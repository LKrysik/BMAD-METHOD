# Cross-Agent Memory Synchronization - Technical Specification (Run 3)

## 1. Introduction

### 1.1 Purpose

Enable multiple agents (2-10) to share memory state with consistency guarantees, automatic conflict resolution, and partition tolerance.

### 1.2 Design Goals

- Causal ordering of operations
- Eventual consistency with bounded staleness
- Automatic conflict resolution
- Graceful partition handling
- Sub-100ms synchronization latency

---

## 2. Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                    Synchronization Layer                       │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐      │
│  │Agent A  │   │Agent B  │   │Agent C  │   │Agent N  │      │
│  │         │   │         │   │         │   │         │      │
│  │┌───────┐│   │┌───────┐│   │┌───────┐│   │┌───────┐│      │
│  ││Local  ││   ││Local  ││   ││Local  ││   ││Local  ││      │
│  ││Memory ││   ││Memory ││   ││Memory ││   ││Memory ││      │
│  │└───────┘│   │└───────┘│   │└───────┘│   │└───────┘│      │
│  │    │    │   │    │    │   │    │    │   │    │    │      │
│  │┌───▼───┐│   │┌───▼───┐│   │┌───▼───┐│   │┌───▼───┐│      │
│  ││ Sync  ││   ││ Sync  ││   ││ Sync  ││   ││ Sync  ││      │
│  ││Engine ││   ││Engine ││   ││Engine ││   ││Engine ││      │
│  │└───┬───┘│   │└───┬───┘│   │└───┬───┘│   │└───┬───┘│      │
│  └────┼────┘   └────┼────┘   └────┼────┘   └────┼────┘      │
│       │             │             │             │            │
│       └─────────────┴──────┬──────┴─────────────┘            │
│                            │                                  │
│                   ┌────────▼────────┐                        │
│                   │   Message Bus    │                        │
│                   │   (gossip/pub)   │                        │
│                   └──────────────────┘                        │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 3. Core Data Structures

### 3.1 Memory Entry

```typescript
interface MemoryEntry {
  // Identity
  id: string;
  key: string;

  // Content
  value: any;
  type: EntryType;

  // Versioning
  version: VersionVector;
  timestamp: HLCTimestamp;

  // Metadata
  origin: AgentId;
  modifiedBy: AgentId;

  // Tombstone for deletes
  deleted: boolean;
}

enum EntryType {
  DECISION = 'decision',
  FINDING = 'finding',
  PREFERENCE = 'preference',
  CONTEXT = 'context'
}

type VersionVector = Map<AgentId, number>;

interface HLCTimestamp {
  wall: number;      // Physical time
  logical: number;   // Logical counter
  node: AgentId;     // Tie-breaker
}
```

### 3.2 Sync State

```typescript
interface AgentSyncState {
  agentId: AgentId;
  localVersion: VersionVector;
  peerVersions: Map<AgentId, VersionVector>;
  pendingSync: MemoryEntry[];
  inflightMessages: Map<MessageId, Message>;
}
```

---

## 4. Consistency Model

### 4.1 Causal Consistency

Operations are ordered causally:
- If A → B (A happens before B), all agents see A before B
- Concurrent operations may be seen in different orders

```typescript
class VersionVector {
  private counts: Map<AgentId, number>;

  increment(agent: AgentId): void {
    this.counts.set(agent, (this.counts.get(agent) || 0) + 1);
  }

  merge(other: VersionVector): VersionVector {
    const result = new VersionVector();
    for (const agent of new Set([...this.counts.keys(), ...other.counts.keys()])) {
      result.counts.set(agent, Math.max(
        this.counts.get(agent) || 0,
        other.counts.get(agent) || 0
      ));
    }
    return result;
  }

  happensBefore(other: VersionVector): boolean {
    let strictlyLess = false;
    for (const agent of new Set([...this.counts.keys(), ...other.counts.keys()])) {
      const thisCount = this.counts.get(agent) || 0;
      const otherCount = other.counts.get(agent) || 0;
      if (thisCount > otherCount) return false;
      if (thisCount < otherCount) strictlyLess = true;
    }
    return strictlyLess;
  }

  concurrent(other: VersionVector): boolean {
    return !this.happensBefore(other) && !other.happensBefore(this);
  }
}
```

### 4.2 Bounded Staleness

Maximum staleness: 30 seconds

```typescript
class StalenessMonitor {
  private readonly MAX_STALENESS_MS = 30000;

  checkStaleness(entry: MemoryEntry): boolean {
    const age = Date.now() - entry.timestamp.wall;
    return age <= this.MAX_STALENESS_MS;
  }

  async ensureFreshness(): Promise<void> {
    const staleEntries = this.findStaleEntries();
    if (staleEntries.length > 0) {
      await this.requestSync(staleEntries);
    }
  }
}
```

### 4.3 Eventual Consistency

All non-faulty agents eventually converge to the same state.

---

## 5. Conflict Resolution

### 5.1 Conflict Detection

```typescript
function detectConflict(local: MemoryEntry, remote: MemoryEntry): ConflictInfo | null {
  if (local.key !== remote.key) return null;

  if (local.version.happensBefore(remote.version)) {
    return null;  // Remote is clearly newer
  }

  if (remote.version.happensBefore(local.version)) {
    return null;  // Local is clearly newer
  }

  // Concurrent modifications - conflict!
  return {
    type: 'CONCURRENT',
    local,
    remote,
    detectedAt: new Date()
  };
}
```

### 5.2 Resolution Strategies

```typescript
type ConflictStrategy = 'LWW' | 'MERGE' | 'CUSTOM';

const conflictResolvers: Record<EntryType, ConflictResolver> = {
  [EntryType.DECISION]: (a, b) => {
    // Decisions: use LWW with HLC
    return compareHLC(a.timestamp, b.timestamp) > 0 ? a : b;
  },

  [EntryType.FINDING]: (a, b) => {
    // Findings: merge (both findings are valid)
    return {
      ...a,
      value: mergeFindingValues(a.value, b.value),
      version: a.version.merge(b.version)
    };
  },

  [EntryType.PREFERENCE]: (a, b) => {
    // Preferences: user's own agent wins
    if (a.origin === getCurrentUser()) return a;
    if (b.origin === getCurrentUser()) return b;
    return compareHLC(a.timestamp, b.timestamp) > 0 ? a : b;
  },

  [EntryType.CONTEXT]: (a, b) => {
    // Context: merge if possible, LWW otherwise
    try {
      return mergeContexts(a, b);
    } catch {
      return compareHLC(a.timestamp, b.timestamp) > 0 ? a : b;
    }
  }
};
```

### 5.3 Semantic Conflicts

```typescript
interface SemanticConflict {
  entries: MemoryEntry[];
  semanticType: 'CONTRADICTION' | 'INCOMPATIBLE' | 'DEPENDENCY';
  description: string;
}

function detectSemanticConflict(entries: MemoryEntry[]): SemanticConflict | null {
  // Check for contradictory decisions
  const decisions = entries.filter(e => e.type === EntryType.DECISION);

  for (let i = 0; i < decisions.length; i++) {
    for (let j = i + 1; j < decisions.length; j++) {
      if (areContradictory(decisions[i], decisions[j])) {
        return {
          entries: [decisions[i], decisions[j]],
          semanticType: 'CONTRADICTION',
          description: `Decisions "${decisions[i].key}" and "${decisions[j].key}" are contradictory`
        };
      }
    }
  }

  return null;
}

function resolveSemanticConflict(conflict: SemanticConflict): MemoryEntry[] {
  switch (conflict.semanticType) {
    case 'CONTRADICTION':
      // Keep most recent, flag the other
      const sorted = conflict.entries.sort((a, b) =>
        compareHLC(b.timestamp, a.timestamp)
      );
      return [sorted[0], { ...sorted[1], value: { ...sorted[1].value, superseded: true } }];

    case 'INCOMPATIBLE':
      // Cannot resolve automatically
      throw new ManualResolutionRequired(conflict);

    case 'DEPENDENCY':
      // Order by dependency
      return topologicalSort(conflict.entries);
  }
}
```

---

## 6. Partition Handling

### 6.1 Partition Detection

```typescript
class PartitionDetector {
  private readonly HEARTBEAT_INTERVAL = 5000;
  private readonly FAILURE_THRESHOLD = 3;

  private heartbeats: Map<AgentId, number> = new Map();
  private suspected: Set<AgentId> = new Set();

  onHeartbeat(from: AgentId): void {
    this.heartbeats.set(from, Date.now());
    this.suspected.delete(from);
  }

  checkPartitions(): Set<AgentId> {
    const now = Date.now();
    const timeout = this.HEARTBEAT_INTERVAL * this.FAILURE_THRESHOLD;

    for (const [agent, lastSeen] of this.heartbeats) {
      if (now - lastSeen > timeout) {
        this.suspected.add(agent);
      }
    }

    return this.suspected;
  }
}
```

### 6.2 Operation During Partition

During network partition, agents:
1. Continue local operations
2. Queue writes for later sync
3. Mark reads as potentially stale

```typescript
class PartitionTolerantStore {
  private queue: QueuedWrite[] = [];
  private partitioned: Set<AgentId> = new Set();

  async write(entry: MemoryEntry): Promise<WriteResult> {
    // Always write locally
    await this.localStorage.write(entry);

    // Sync to available peers
    const available = this.getAvailablePeers();
    const synced = await this.syncTo(entry, available);

    // Queue for partitioned peers
    for (const peer of this.partitioned) {
      this.queue.push({ entry, target: peer, queuedAt: Date.now() });
    }

    return {
      local: true,
      synced: synced.length,
      queued: this.partitioned.size
    };
  }
}
```

### 6.3 Reconciliation

```typescript
async function reconcileAfterPartition(
  localState: MemoryEntry[],
  remoteState: MemoryEntry[],
  remoteAgent: AgentId
): Promise<ReconciliationResult> {
  const result: ReconciliationResult = {
    merged: [],
    conflicts: [],
    applied: 0
  };

  // Create lookup maps
  const localMap = new Map(localState.map(e => [e.key, e]));
  const remoteMap = new Map(remoteState.map(e => [e.key, e]));

  // Process all keys
  const allKeys = new Set([...localMap.keys(), ...remoteMap.keys()]);

  for (const key of allKeys) {
    const local = localMap.get(key);
    const remote = remoteMap.get(key);

    if (!local && remote) {
      result.merged.push(remote);
      result.applied++;
    } else if (local && !remote) {
      result.merged.push(local);
    } else if (local && remote) {
      const conflict = detectConflict(local, remote);
      if (conflict) {
        const resolved = conflictResolvers[local.type](local, remote);
        result.merged.push(resolved);
        result.conflicts.push(conflict);
      } else {
        result.merged.push(local.version.happensBefore(remote.version) ? remote : local);
      }
    }
  }

  return result;
}
```

---

## 7. Sync Protocol

### 7.1 Message Format

```typescript
type SyncMessage =
  | { type: 'GOSSIP'; entries: MemoryEntry[]; version: VersionVector }
  | { type: 'PULL_REQUEST'; since: VersionVector }
  | { type: 'PULL_RESPONSE'; entries: MemoryEntry[] }
  | { type: 'HEARTBEAT'; version: VersionVector }
  | { type: 'ACK'; messageId: string };
```

### 7.2 Gossip Protocol

```typescript
class GossipSync {
  private readonly GOSSIP_INTERVAL = 100;  // ms
  private readonly FANOUT = 2;  // peers per gossip round

  async gossipRound(): Promise<void> {
    const updates = this.getPendingUpdates();
    if (updates.length === 0) return;

    // Select random subset of peers
    const peers = this.selectRandomPeers(this.FANOUT);

    // Send updates
    for (const peer of peers) {
      await this.send(peer, {
        type: 'GOSSIP',
        entries: updates,
        version: this.localVersion
      });
    }
  }
}
```

### 7.3 Latency Optimization

```typescript
class FastSync {
  // Batch writes within window
  private readonly BATCH_WINDOW_MS = 10;

  // Priority queue for urgent updates
  private urgentQueue: MemoryEntry[] = [];
  private normalQueue: MemoryEntry[] = [];

  enqueue(entry: MemoryEntry, priority: 'urgent' | 'normal' = 'normal'): void {
    if (priority === 'urgent') {
      this.urgentQueue.push(entry);
      this.flushUrgent();
    } else {
      this.normalQueue.push(entry);
      this.scheduleBatchFlush();
    }
  }

  private async flushUrgent(): Promise<void> {
    const entries = this.urgentQueue;
    this.urgentQueue = [];
    await this.broadcastImmediate(entries);
  }
}
```

---

## 8. Audit Trail

```typescript
interface SyncAuditEntry {
  id: string;
  timestamp: Date;
  event: SyncEventType;
  source: AgentId;
  target?: AgentId;
  entriesAffected: string[];
  versionBefore: VersionVector;
  versionAfter: VersionVector;
  metadata: Record<string, any>;
}

type SyncEventType =
  | 'WRITE_LOCAL'
  | 'SYNC_SENT'
  | 'SYNC_RECEIVED'
  | 'CONFLICT_DETECTED'
  | 'CONFLICT_RESOLVED'
  | 'PARTITION_SUSPECTED'
  | 'PARTITION_CONFIRMED'
  | 'PARTITION_HEALED'
  | 'RECONCILIATION_STARTED'
  | 'RECONCILIATION_COMPLETED';

class SyncAuditLog {
  private entries: SyncAuditEntry[] = [];

  log(event: Omit<SyncAuditEntry, 'id' | 'timestamp'>): void {
    this.entries.push({
      ...event,
      id: generateUUID(),
      timestamp: new Date()
    });
  }

  query(criteria: AuditQueryCriteria): SyncAuditEntry[] {
    return this.entries.filter(e => matchesCriteria(e, criteria));
  }
}
```

---

## 9. Integration with Task 3

```typescript
// Wraps Task 3's MemoryPersistence
class SynchronizedMemory implements MemoryPersistence {
  constructor(
    private local: MemoryPersistence,  // From Task 3
    private sync: SyncEngine
  ) {}

  async write(key: string, value: any, type: EntryType): Promise<void> {
    const entry = this.createEntry(key, value, type);

    // Persist locally first (Task 3 storage)
    await this.local.write(entry.key, entry);

    // Then sync to peers
    await this.sync.broadcast(entry);
  }

  async read(key: string): Promise<any | null> {
    return this.local.read(key);
  }

  async query(filter: QueryFilter): Promise<any[]> {
    return this.local.query(filter);
  }

  async delete(key: string): Promise<void> {
    const tombstone = this.createTombstone(key);
    await this.local.write(key, tombstone);
    await this.sync.broadcast(tombstone);
  }
}
```

---

## 10. Performance Characteristics

| Metric | Requirement | Design Target |
|--------|-------------|---------------|
| Sync latency | <100ms | 10-50ms |
| Staleness bound | <=30s | ~5s typical |
| Agent count | 2-10 | Tested to 10 |
| Throughput | - | 500-1000 ops/s |
| Memory overhead | - | O(agents) per entry |

---

## 11. Assumptions

1. **Trusted agents**: No Byzantine behavior
2. **Reliable storage**: Local persistence doesn't lose data
3. **Bounded partitions**: Partitions are temporary (<1 hour)
4. **Clock sync**: Agents have loosely synchronized clocks (NTP)
5. **Ordered channels**: TCP provides FIFO within connection

---

## 12. Limitations

1. **CAP tradeoff**: Consistency sacrificed during partitions
2. **LWW data loss**: Concurrent writes may lose one value
3. **Semantic resolution**: Manual intervention sometimes needed
4. **Vector clock growth**: Storage grows with agent count
5. **No strong consistency**: Cannot guarantee linearizability
