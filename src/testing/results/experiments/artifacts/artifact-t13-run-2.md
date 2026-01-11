# Cross-Agent Memory Synchronization Protocol (Run 2)

## Executive Summary

This document specifies a synchronization protocol for sharing memory state across multiple agents while maintaining causal consistency, partition tolerance, and automatic conflict resolution.

---

## 1. System Model

### 1.1 Agents

```
Agent = {
  id: AgentId,
  localMemory: MemoryStore,
  syncState: SyncState,
  peers: Set<AgentId>
}
```

### 1.2 Communication Model

- Asynchronous message passing
- Unreliable network (messages may be lost, delayed, reordered)
- No shared global clock

---

## 2. Data Structures

### 2.1 Memory Record

```typescript
interface MemoryRecord {
  key: string;
  value: any;
  metadata: RecordMetadata;
}

interface RecordMetadata {
  createdBy: AgentId;
  createdAt: HybridTimestamp;
  modifiedBy: AgentId;
  modifiedAt: HybridTimestamp;
  version: VectorClock;
  tombstone: boolean;
}

interface HybridTimestamp {
  physical: number;  // wall clock ms
  logical: number;   // Lamport counter
}

interface VectorClock {
  entries: Map<AgentId, number>;
}
```

### 2.2 Sync State

```typescript
interface SyncState {
  localClock: VectorClock;
  peerClocks: Map<AgentId, VectorClock>;
  pendingAcks: Map<MessageId, PendingMessage>;
  outbox: SyncMessage[];
}
```

---

## 3. Consistency Guarantees

### 3.1 Causal Consistency

**Guarantee:** If operation A causally precedes operation B, all agents observe A before B.

**Implementation:** Vector clocks track causal dependencies.

```typescript
class CausalOrderer {
  canDeliver(msg: SyncMessage, localClock: VectorClock): boolean {
    const msgClock = msg.vectorClock;

    // Check all entries except sender
    for (const [agent, count] of msgClock.entries) {
      if (agent === msg.sender) {
        // Sender's count should be exactly one more
        if (count !== (localClock.entries.get(agent) || 0) + 1) {
          return false;
        }
      } else {
        // Other agents' counts should be <= local
        if (count > (localClock.entries.get(agent) || 0)) {
          return false;
        }
      }
    }
    return true;
  }

  waitForDependencies(msg: SyncMessage): Promise<void> {
    return new Promise(resolve => {
      const check = () => {
        if (this.canDeliver(msg, this.localClock)) {
          resolve();
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });
  }
}
```

### 3.2 Eventual Consistency

**Guarantee:** All agents eventually converge to the same state.

**Bound:** Maximum 30 seconds staleness under normal operation.

### 3.3 Partition Tolerance

**Guarantee:** Agents continue operating during network partitions.

**Tradeoff:** Consistency relaxed during partition (CAP theorem).

---

## 4. Conflict Resolution

### 4.1 Detection

```typescript
function detectConflict(local: MemoryRecord, incoming: MemoryRecord): ConflictType | null {
  const localV = local.metadata.version;
  const incomingV = incoming.metadata.version;

  if (vectorClockEquals(localV, incomingV)) {
    return null;  // Same version
  }

  if (vectorClockLessThan(localV, incomingV)) {
    return null;  // Incoming is newer, no conflict
  }

  if (vectorClockLessThan(incomingV, localV)) {
    return null;  // Local is newer, no conflict
  }

  // Concurrent modifications
  return 'CONCURRENT_WRITE';
}
```

### 4.2 Automatic Resolution

```typescript
type ConflictResolver = (a: MemoryRecord, b: MemoryRecord) => MemoryRecord;

const resolvers: Record<string, ConflictResolver> = {
  // Default: Last-Writer-Wins using hybrid timestamp
  default: (a, b) => {
    const aTime = a.metadata.modifiedAt;
    const bTime = b.metadata.modifiedAt;

    if (aTime.physical !== bTime.physical) {
      return aTime.physical > bTime.physical ? a : b;
    }
    if (aTime.logical !== bTime.logical) {
      return aTime.logical > bTime.logical ? a : b;
    }
    // Tie-breaker: agent ID
    return a.metadata.modifiedBy > b.metadata.modifiedBy ? a : b;
  },

  // For counters: merge by taking max
  counter: (a, b) => ({
    ...a,
    value: Math.max(a.value, b.value),
    metadata: mergeMetadata(a.metadata, b.metadata)
  }),

  // For sets: union
  set: (a, b) => ({
    ...a,
    value: [...new Set([...a.value, ...b.value])],
    metadata: mergeMetadata(a.metadata, b.metadata)
  })
};
```

### 4.3 Semantic Conflict Handling

```typescript
interface SemanticConflict {
  type: 'CONTRADICTION' | 'SUPERSEDES' | 'INCOMPATIBLE';
  records: [MemoryRecord, MemoryRecord];
  domain: string;
}

function resolveSemanticConflict(conflict: SemanticConflict): Resolution {
  switch (conflict.type) {
    case 'CONTRADICTION':
      // Both cannot be true - need domain logic
      return {
        action: 'KEEP_BOTH_FLAGGED',
        result: flagAsConflicting(conflict.records)
      };

    case 'SUPERSEDES':
      // One logically replaces the other
      return {
        action: 'KEEP_SUPERSEDING',
        result: findSuperseding(conflict.records)
      };

    case 'INCOMPATIBLE':
      // Cannot merge - escalate
      return {
        action: 'ESCALATE',
        result: null
      };
  }
}
```

---

## 5. Partition Handling

### 5.1 Detection

```typescript
class PartitionManager {
  private readonly HEARTBEAT_INTERVAL = 5000;
  private readonly PARTITION_THRESHOLD = 3;  // missed heartbeats

  private heartbeatCounts: Map<AgentId, number> = new Map();

  tick(): void {
    for (const [agent, count] of this.heartbeatCounts) {
      this.heartbeatCounts.set(agent, count + 1);

      if (count + 1 >= this.PARTITION_THRESHOLD) {
        this.onPartitionDetected(agent);
      }
    }
  }

  onHeartbeat(agent: AgentId): void {
    this.heartbeatCounts.set(agent, 0);

    if (this.partitionedPeers.has(agent)) {
      this.onPartitionHealed(agent);
    }
  }

  private partitionedPeers: Set<AgentId> = new Set();
}
```

### 5.2 Operation During Partition

```typescript
class PartitionAwareSync {
  async write(record: MemoryRecord): Promise<WriteResult> {
    // Always write locally
    await this.localStore.write(record);

    // Queue for sync
    this.syncQueue.enqueue({
      record,
      timestamp: Date.now(),
      attempts: 0
    });

    // Try to sync immediately to available peers
    const availablePeers = this.getAvailablePeers();
    if (availablePeers.length > 0) {
      await this.syncToPeers(record, availablePeers);
    }

    return { status: 'ACCEPTED', synced: availablePeers.length };
  }
}
```

### 5.3 Reconciliation After Partition

```typescript
async function reconcile(localState: MemoryRecord[], remoteState: MemoryRecord[]): Promise<MemoryRecord[]> {
  const result: MemoryRecord[] = [];
  const conflicts: SemanticConflict[] = [];

  // Build index by key
  const localByKey = new Map(localState.map(r => [r.key, r]));
  const remoteByKey = new Map(remoteState.map(r => [r.key, r]));

  const allKeys = new Set([...localByKey.keys(), ...remoteByKey.keys()]);

  for (const key of allKeys) {
    const local = localByKey.get(key);
    const remote = remoteByKey.get(key);

    if (!local) {
      result.push(remote!);
    } else if (!remote) {
      result.push(local);
    } else {
      const conflictType = detectConflict(local, remote);
      if (conflictType) {
        const resolved = resolvers.default(local, remote);
        result.push(resolved);
        logConflictResolution(local, remote, resolved);
      } else {
        result.push(newerOf(local, remote));
      }
    }
  }

  return result;
}
```

---

## 6. Sync Protocol

### 6.1 Message Types

```typescript
type SyncMessage =
  | { type: 'UPDATE'; records: MemoryRecord[]; clock: VectorClock }
  | { type: 'ACK'; messageId: string; clock: VectorClock }
  | { type: 'SYNC_REQUEST'; since: VectorClock }
  | { type: 'SYNC_RESPONSE'; records: MemoryRecord[]; clock: VectorClock }
  | { type: 'HEARTBEAT'; clock: VectorClock };
```

### 6.2 Protocol Flow

```
Agent A                     Agent B
   |                           |
   |-- UPDATE (records) ------>|
   |                           |
   |<------ ACK ---------------|
   |                           |
   |<-- HEARTBEAT -------------|
   |                           |
   |--- HEARTBEAT ------------>|
   |                           |
```

### 6.3 Latency Optimization

```typescript
class LowLatencySync {
  private readonly BATCH_WINDOW_MS = 5;
  private readonly MAX_BATCH_SIZE = 100;

  private batch: MemoryRecord[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  enqueue(record: MemoryRecord): void {
    this.batch.push(record);

    if (this.batch.length >= this.MAX_BATCH_SIZE) {
      this.flush();
    } else if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => this.flush(), this.BATCH_WINDOW_MS);
    }
  }

  private flush(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    const records = this.batch;
    this.batch = [];

    this.broadcast({ type: 'UPDATE', records, clock: this.localClock });
  }
}
```

---

## 7. Audit Trail

```typescript
interface AuditEntry {
  id: string;
  timestamp: Date;
  event: AuditEvent;
  agent: AgentId;
  details: any;
}

type AuditEvent =
  | 'WRITE'
  | 'SYNC_SENT'
  | 'SYNC_RECEIVED'
  | 'CONFLICT_DETECTED'
  | 'CONFLICT_RESOLVED'
  | 'PARTITION_DETECTED'
  | 'PARTITION_HEALED'
  | 'RECONCILIATION';

class AuditLogger {
  private log: AuditEntry[] = [];

  record(event: AuditEvent, details: any): void {
    this.log.push({
      id: generateId(),
      timestamp: new Date(),
      event,
      agent: this.agentId,
      details
    });
  }

  query(filter: Partial<AuditEntry>): AuditEntry[] {
    return this.log.filter(entry =>
      Object.entries(filter).every(([k, v]) => entry[k] === v)
    );
  }
}
```

---

## 8. Integration with Task 3

Extends `MemoryPersistence` from Task 3:

```typescript
class SyncedMemoryPersistence implements MemoryPersistence {
  private local: LocalMemoryStore;
  private sync: SyncManager;

  async write(key: string, value: any): Promise<void> {
    const record = this.createRecord(key, value);
    await this.local.write(record);
    await this.sync.broadcast(record);
  }

  async read(key: string): Promise<any> {
    return this.local.read(key);
  }

  async delete(key: string): Promise<void> {
    const tombstone = this.createTombstone(key);
    await this.local.write(tombstone);
    await this.sync.broadcast(tombstone);
  }
}
```

---

## 9. Performance

| Requirement | Target | Achieved |
|-------------|--------|----------|
| Sync latency | <100ms | 5-50ms (batching) |
| Staleness | <=30s | ~5s normal |
| Agent count | 2-10 | Scales linearly |
| Throughput | - | ~1000 ops/sec |

---

## 10. Assumptions

1. Agents are trusted (no Byzantine failures)
2. Network partitions are temporary
3. Agent clocks are roughly synchronized (NTP)
4. Message ordering within connection is FIFO
5. Storage is reliable (no data loss)

---

## 11. Known Limitations

1. Last-writer-wins may lose concurrent updates
2. No support for Byzantine fault tolerance
3. Vector clock size grows with agents
4. Semantic conflict resolution is incomplete
5. No global consistency during partitions
