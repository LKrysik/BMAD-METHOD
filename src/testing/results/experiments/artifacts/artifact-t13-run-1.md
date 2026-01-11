# Cross-Agent Memory Synchronization - Design Document (Run 1)

## 1. Overview

### 1.1 Purpose
Design a synchronization protocol enabling multiple agents to share memory state while maintaining consistency, handling conflicts, and supporting partition tolerance.

### 1.2 Scope
- Memory sharing between 2-10 agents
- Conflict resolution mechanisms
- Partition handling and recovery
- Integration with existing Agent Memory Persistence

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Memory Synchronization Layer                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Agent 1  │  │ Agent 2  │  │ Agent 3  │  │ Agent N  │       │
│  │ Memory   │  │ Memory   │  │ Memory   │  │ Memory   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │             │             │              │
│       └─────────────┴──────┬──────┴─────────────┘              │
│                            │                                    │
│                    ┌───────▼────────┐                          │
│                    │  Sync Manager  │                          │
│                    │  (per agent)   │                          │
│                    └───────┬────────┘                          │
│                            │                                    │
│                    ┌───────▼────────┐                          │
│                    │  Message Bus   │                          │
│                    │  (pub/sub)     │                          │
│                    └────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model

### 3.1 Memory Entry

```typescript
interface MemoryEntry {
  id: string;                    // Unique identifier
  agentId: string;               // Originating agent
  timestamp: number;             // Lamport timestamp
  vectorClock: VectorClock;      // For causal ordering

  // Content
  type: 'decision' | 'finding' | 'preference' | 'context';
  content: any;

  // Sync metadata
  version: number;
  lastModified: Date;
  syncStatus: 'local' | 'syncing' | 'synced';
}

interface VectorClock {
  [agentId: string]: number;
}
```

### 3.2 Sync Message

```typescript
interface SyncMessage {
  type: 'update' | 'ack' | 'request' | 'conflict';
  sourceAgent: string;
  targetAgent: string | 'broadcast';

  payload: {
    entries: MemoryEntry[];
    vectorClock: VectorClock;
  };

  messageId: string;
  timestamp: Date;
}
```

---

## 4. Consistency Model

### 4.1 Eventual Consistency

We implement eventual consistency with bounded staleness:
- Maximum staleness: 30 seconds
- All agents will converge to same state
- No strong consistency guarantees during partitions

### 4.2 Causal Ordering

Vector clocks ensure causal ordering:

```typescript
function happensBefore(a: VectorClock, b: VectorClock): boolean {
  let atLeastOneLess = false;

  for (const agent of Object.keys({...a, ...b})) {
    const aVal = a[agent] || 0;
    const bVal = b[agent] || 0;

    if (aVal > bVal) return false;
    if (aVal < bVal) atLeastOneLess = true;
  }

  return atLeastOneLess;
}

function isConcurrent(a: VectorClock, b: VectorClock): boolean {
  return !happensBefore(a, b) && !happensBefore(b, a);
}
```

### 4.3 Conflict Detection

```typescript
function detectConflict(local: MemoryEntry, remote: MemoryEntry): boolean {
  if (local.id !== remote.id) return false;

  // Same entry, check if concurrent modifications
  return isConcurrent(local.vectorClock, remote.vectorClock);
}
```

---

## 5. Conflict Resolution

### 5.1 Automatic Resolution Strategy

```typescript
type ResolutionStrategy = 'last-writer-wins' | 'merge' | 'manual';

function resolveConflict(
  local: MemoryEntry,
  remote: MemoryEntry,
  strategy: ResolutionStrategy
): MemoryEntry {
  switch (strategy) {
    case 'last-writer-wins':
      return local.lastModified > remote.lastModified ? local : remote;

    case 'merge':
      return mergeEntries(local, remote);

    case 'manual':
      throw new ConflictRequiresManualResolution(local, remote);
  }
}
```

### 5.2 Semantic Conflict Resolution

For contradictory decisions:

```typescript
interface SemanticConflict {
  entryA: MemoryEntry;
  entryB: MemoryEntry;
  conflictType: 'contradiction' | 'superseded' | 'partial_overlap';
}

function resolveSemanticConflict(conflict: SemanticConflict): MemoryEntry {
  switch (conflict.conflictType) {
    case 'contradiction':
      // Prefer more recent decision with higher confidence
      return selectByConfidence(conflict.entryA, conflict.entryB);

    case 'superseded':
      // Newer entry replaces older
      return conflict.entryA.timestamp > conflict.entryB.timestamp
        ? conflict.entryA : conflict.entryB;

    case 'partial_overlap':
      // Merge non-conflicting parts
      return mergePartial(conflict.entryA, conflict.entryB);
  }
}
```

---

## 6. Partition Handling

### 6.1 Partition Detection

```typescript
class PartitionDetector {
  private heartbeatInterval = 5000;  // 5 seconds
  private timeoutThreshold = 15000;  // 3 missed heartbeats

  private lastHeartbeat: Map<string, Date> = new Map();

  isPartitioned(agentId: string): boolean {
    const last = this.lastHeartbeat.get(agentId);
    if (!last) return true;

    return Date.now() - last.getTime() > this.timeoutThreshold;
  }

  getPartitionedAgents(): string[] {
    return Array.from(this.lastHeartbeat.keys())
      .filter(id => this.isPartitioned(id));
  }
}
```

### 6.2 Partition Tolerance

During partition:
1. Agents continue operating with local memory
2. Changes queued for sync when reconnected
3. No writes blocked

### 6.3 Merge on Reconnect

```typescript
async function mergeAfterPartition(
  localState: MemoryEntry[],
  remoteState: MemoryEntry[]
): Promise<MemoryEntry[]> {
  const merged: MemoryEntry[] = [];
  const conflicts: SemanticConflict[] = [];

  // Group by entry ID
  const allIds = new Set([
    ...localState.map(e => e.id),
    ...remoteState.map(e => e.id)
  ]);

  for (const id of allIds) {
    const local = localState.find(e => e.id === id);
    const remote = remoteState.find(e => e.id === id);

    if (!local) {
      merged.push(remote!);
    } else if (!remote) {
      merged.push(local);
    } else if (detectConflict(local, remote)) {
      conflicts.push({ entryA: local, entryB: remote, conflictType: 'contradiction' });
    } else {
      // Use vector clock to determine latest
      merged.push(happensBefore(local.vectorClock, remote.vectorClock) ? remote : local);
    }
  }

  // Resolve conflicts
  for (const conflict of conflicts) {
    merged.push(resolveSemanticConflict(conflict));
  }

  return merged;
}
```

---

## 7. Sync Protocol

### 7.1 Push-Based Sync

```typescript
class SyncManager {
  private readonly agentId: string;
  private readonly messageBus: MessageBus;

  async broadcastUpdate(entry: MemoryEntry): Promise<void> {
    const message: SyncMessage = {
      type: 'update',
      sourceAgent: this.agentId,
      targetAgent: 'broadcast',
      payload: {
        entries: [entry],
        vectorClock: this.currentVectorClock
      },
      messageId: generateId(),
      timestamp: new Date()
    };

    await this.messageBus.publish('memory-sync', message);
  }

  async requestFullSync(targetAgent: string): Promise<void> {
    const message: SyncMessage = {
      type: 'request',
      sourceAgent: this.agentId,
      targetAgent,
      payload: {
        entries: [],
        vectorClock: this.currentVectorClock
      },
      messageId: generateId(),
      timestamp: new Date()
    };

    await this.messageBus.send(targetAgent, message);
  }
}
```

### 7.2 Latency Optimization

To achieve sub-100ms sync:
- Use in-memory message bus
- Batch small updates
- Async acknowledgments

```typescript
const BATCH_WINDOW = 10;  // ms
const MAX_BATCH_SIZE = 50;

class BatchedSyncManager extends SyncManager {
  private pendingUpdates: MemoryEntry[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  queueUpdate(entry: MemoryEntry): void {
    this.pendingUpdates.push(entry);

    if (this.pendingUpdates.length >= MAX_BATCH_SIZE) {
      this.flushBatch();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.flushBatch(), BATCH_WINDOW);
    }
  }

  private async flushBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    const batch = this.pendingUpdates;
    this.pendingUpdates = [];

    await this.broadcastBatch(batch);
  }
}
```

---

## 8. Audit Trail

### 8.1 Sync Event Log

```typescript
interface SyncEvent {
  eventId: string;
  timestamp: Date;
  eventType: 'sync' | 'conflict' | 'resolution' | 'partition' | 'reconnect';

  sourceAgent: string;
  targetAgent?: string;

  affectedEntries: string[];  // entry IDs

  details: {
    vectorClockBefore?: VectorClock;
    vectorClockAfter?: VectorClock;
    conflictResolution?: string;
  };
}

class AuditLog {
  private events: SyncEvent[] = [];

  log(event: SyncEvent): void {
    this.events.push(event);
    this.persist(event);
  }

  query(filter: Partial<SyncEvent>): SyncEvent[] {
    return this.events.filter(e =>
      Object.entries(filter).every(([k, v]) => e[k] === v)
    );
  }
}
```

---

## 9. Integration with Task 3

### 9.1 Memory Persistence Layer

```typescript
// Extends existing MemoryPersistence from Task 3
class SyncableMemoryPersistence extends MemoryPersistence {
  private syncManager: SyncManager;

  async write(entry: MemoryEntry): Promise<void> {
    // Local persistence first
    await super.write(entry);

    // Then broadcast to other agents
    await this.syncManager.broadcastUpdate(entry);
  }

  async read(id: string): Promise<MemoryEntry | null> {
    // Check local first
    const local = await super.read(id);
    if (local) return local;

    // Request from other agents if not found
    return this.syncManager.requestFromPeers(id);
  }
}
```

---

## 10. Performance Targets

| Metric | Target | Mechanism |
|--------|--------|-----------|
| Sync latency | <100ms | In-memory bus, batching |
| Staleness bound | 30s | Periodic full sync |
| Conflict resolution | Automatic | Last-writer-wins default |
| Partition detection | 15s | Heartbeat timeout |
| Recovery time | <5s | State diff merge |

---

## 11. Assumptions

1. Network is mostly reliable (partitions are exceptions)
2. All agents run on same trust level
3. Clock skew between agents is minimal (<1s)
4. Memory entries are relatively small (<1MB each)
5. Agent count stays within 2-10 range

---

## 12. Limitations

1. No strong consistency during partitions
2. Last-writer-wins may lose data in conflicts
3. Vector clocks grow with agent count
4. No Byzantine fault tolerance
5. Semantic conflict resolution is heuristic

---

## 13. Future Considerations

1. CRDTs for conflict-free data types
2. Raft consensus for critical decisions
3. Merkle trees for efficient state comparison
4. Compression for large sync payloads
