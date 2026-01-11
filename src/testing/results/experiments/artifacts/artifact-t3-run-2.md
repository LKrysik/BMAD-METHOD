# Session Memory Persistence - Event Sourcing Architecture

**Version:** 1.0
**Approach:** Event Sourcing with Temporal Graph Index

---

## 1. Core Concept

All memory operations are stored as **immutable events** in an append-only log. Current state is derived by replaying events.

### Event Types

```yaml
events:
  - CONVERSATION_ADDED
  - DECISION_MADE
  - FINDING_RECORDED
  - PREFERENCE_LEARNED
  - MEMORY_ACCESSED
  - MEMORY_DELETED
```

---

## 2. Storage Design

### 2.1 Event Log (Primary Storage)

```
.bmad/sessions/{session-id}/
├── events.jsonl           # Append-only event log
├── snapshots/             # Periodic state snapshots
│   └── snapshot-{timestamp}.json
├── graph/                 # Temporal graph index
│   ├── nodes.jsonl
│   └── edges.jsonl
└── views/                 # Materialized views
    ├── conversations.md
    ├── decisions.yaml
    └── findings.yaml
```

### 2.2 Event Format

```json
{
  "id": "evt-001",
  "type": "DECISION_MADE",
  "timestamp": "2026-01-11T14:30:00Z",
  "agent_id": "bmad-master",
  "payload": {
    "decision": "Use OAuth 2.0 for authentication",
    "rationale": "Industry standard",
    "confidence": "high"
  },
  "metadata": {
    "turn_ref": 5,
    "topics": ["authentication", "security"]
  }
}
```

---

## 3. Temporal Graph Index

### 3.1 Node Types

- **Memory nodes**: decisions, findings, preferences
- **Topic nodes**: semantic categories
- **Agent nodes**: participating agents
- **Time nodes**: temporal buckets

### 3.2 Edge Types

- `REFERENCES`: memory → memory
- `ABOUT`: memory → topic
- `CREATED_BY`: memory → agent
- `OCCURRED_AT`: memory → time

### 3.3 Query via Graph Traversal

```
QUERY: "Find decisions about authentication"
PATH: topic:authentication ←[ABOUT]← decision:*
RESULT: All decisions connected to authentication topic
```

---

## 4. Concurrency Control

### 4.1 Single-Writer-Multiple-Readers

- One writer appends to events.jsonl
- Multiple readers can read concurrently
- No read locks needed (immutable data)

### 4.2 Write Coordination

```
1. Acquire write semaphore (file-based)
2. Append event to events.jsonl
3. Update graph index
4. Update materialized views (async)
5. Release semaphore
```

---

## 5. Memory Decay

### 5.1 Decay via Access Tracking

Each `MEMORY_ACCESSED` event boosts priority:

```
priority = base × exp(-decay_rate × days_since_access) + access_boost
```

### 5.2 Decay-Aware Queries

```typescript
query({
  filter: { topic: "authentication" },
  minPriority: 0.5,
  sort: "priority DESC"
})
```

---

## 6. Privacy & Deletion

### 6.1 Soft Delete

Append `MEMORY_DELETED` event - memory excluded from views but retained in log.

### 6.2 Hard Delete (Compaction)

Rewrite events.jsonl excluding deleted events. Requires full log scan.

---

## 7. Size Management

### 7.1 Quota Enforcement

- Monitor events.jsonl size
- At 80%: warn and suggest compaction
- At 95%: force compaction

### 7.2 Compaction Strategy

1. Remove low-priority events (priority < 0.3)
2. Merge consecutive MEMORY_ACCESSED into single event
3. Summarize old conversations
4. Create fresh snapshot

---

## 8. Query Interface

```typescript
interface EventStore {
  // Write
  append(event: Event): void

  // Read (from materialized views)
  getConversation(limit: number): Turn[]
  getDecisions(topic?: string): Decision[]
  getFindings(status?: string): Finding[]

  // Graph queries
  traverse(query: GraphQuery): Memory[]
  findRelated(memoryId: string): Memory[]

  // Time travel
  stateAt(timestamp: Date): SessionState
}
```

---

## 9. Performance

| Operation | Complexity | Latency |
|-----------|------------|---------|
| Append event | O(1) | <5ms |
| Query by topic | O(k) | <50ms |
| Rebuild state | O(n) | <1s |
| Compaction | O(n) | <5s |

---

## 10. Advantages of Event Sourcing

1. **Full history**: Can reconstruct any past state
2. **Audit trail**: Every change is recorded
3. **Concurrency**: Lock-free reads
4. **Debugging**: Replay events to reproduce bugs
5. **Flexibility**: New views can be created from events

---

**End of Architecture**
