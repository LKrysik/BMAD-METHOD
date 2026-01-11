# Session Memory Persistence Architecture
## Event-Sourced Memory with Temporal Graph Index

### Executive Summary

This architecture implements session memory persistence using **event sourcing** as the primary storage paradigm, coupled with a **temporal knowledge graph** for efficient querying. Unlike traditional snapshot-based storage, this approach maintains an immutable append-only event log, enabling perfect reconstruction of any historical state while supporting complex temporal queries through graph traversal.

---

## 1. Core Architecture

### 1.1 Storage Model Overview

```
Session Memory Store
├── Event Log (Primary Source of Truth)
│   ├── events.jsonl           # Append-only event stream
│   └── events.index           # Binary offset index
├── Temporal Graph (Derived Index)
│   ├── nodes.jsonl            # Entity and concept nodes
│   ├── edges.jsonl            # Temporal relationships
│   └── graph.index            # Adjacency list cache
├── Projections (Read Models)
│   ├── conversation.view      # Materialized conversation thread
│   ├── decisions.view         # Decision registry
│   └── preferences.view       # User preference snapshot
└── Metadata
    ├── session.meta           # Session configuration
    └── compaction.log         # Compaction history
```

### 1.2 Why Event Sourcing + Temporal Graph?

**Event Sourcing Benefits:**
- Immutable log provides perfect audit trail
- Time-travel capabilities (reconstruct any past state)
- Natural support for memory decay via event weighting
- Concurrent access simplified (append-only writes)

**Temporal Graph Benefits:**
- Fast semantic queries ("decisions about authentication")
- Natural representation of knowledge relationships
- Efficient memory decay through edge weight propagation
- Privacy operations via graph pruning

---

## 2. Event Log Design

### 2.1 Event Structure

```json
{
  "eventId": "evt_1704912345678_a3f2",
  "sessionId": "sess_20260111_abc123",
  "timestamp": 1704912345678,
  "sequenceNum": 42,
  "eventType": "MESSAGE_RECEIVED|DECISION_MADE|FINDING_RECORDED|PREFERENCE_SET|MEMORY_DELETED",
  "payload": {
    "type-specific-data": "..."
  },
  "metadata": {
    "agentId": "agent_deep_verify",
    "importance": 0.85,
    "tags": ["authentication", "security"],
    "parentEventId": "evt_1704912340000_b2e1"
  },
  "checksum": "sha256:..."
}
```

### 2.2 Event Types

#### MESSAGE_RECEIVED
```json
{
  "eventType": "MESSAGE_RECEIVED",
  "payload": {
    "role": "user|assistant|system",
    "content": "message text",
    "toolCalls": [...],
    "responseMetadata": {...}
  },
  "metadata": {
    "importance": 0.7,
    "tags": ["conversation"]
  }
}
```

#### DECISION_MADE
```json
{
  "eventType": "DECISION_MADE",
  "payload": {
    "decision": "Use RSA-2048 for key generation",
    "rationale": "Industry standard, balances security and performance",
    "alternatives": ["RSA-4096", "ECDSA"],
    "context": ["security", "key-management"],
    "confidence": 0.9
  },
  "metadata": {
    "importance": 0.95,
    "tags": ["decision", "security", "cryptography"]
  }
}
```

#### FINDING_RECORDED
```json
{
  "eventType": "FINDING_RECORDED",
  "payload": {
    "finding": "Authentication endpoint lacks rate limiting",
    "severity": "high",
    "evidence": ["file:auth.py:45", "file:config.yaml:12"],
    "category": "security-vulnerability"
  },
  "metadata": {
    "importance": 0.9,
    "tags": ["finding", "security", "authentication"]
  }
}
```

#### PREFERENCE_SET
```json
{
  "eventType": "PREFERENCE_SET",
  "payload": {
    "key": "code_style.indent",
    "value": "2-spaces",
    "scope": "global|session|context",
    "expiresAt": null
  },
  "metadata": {
    "importance": 0.6,
    "tags": ["preference", "code-style"]
  }
}
```

#### MEMORY_DELETED (Privacy Operation)
```json
{
  "eventType": "MEMORY_DELETED",
  "payload": {
    "deletionQuery": {
      "tags": ["sensitive-data"],
      "timeRange": {"start": 1704900000000, "end": 1704912000000}
    },
    "deletedEventIds": ["evt_...", "evt_..."],
    "reason": "user_request"
  },
  "metadata": {
    "importance": 1.0,
    "tags": ["privacy", "deletion"]
  }
}
```

### 2.3 Storage Format: JSONL (JSON Lines)

**events.jsonl** - One event per line for efficient append and streaming:
```
{"eventId":"evt_001","timestamp":1704912340000,...}
{"eventId":"evt_002","timestamp":1704912345678,...}
{"eventId":"evt_003","timestamp":1704912350123,...}
```

**events.index** - Binary offset index for O(1) event access:
```
[event_id: string(32)] -> [file_offset: uint64, length: uint32]
```

---

## 3. Temporal Graph Index

### 3.1 Graph Structure

**Nodes** represent entities and concepts extracted from events:
```json
{
  "nodeId": "node_auth_endpoint_45",
  "nodeType": "CONCEPT|ENTITY|DECISION|FINDING|PREFERENCE",
  "label": "Authentication Endpoint",
  "sourceEventIds": ["evt_001", "evt_023"],
  "createdAt": 1704912345678,
  "lastAccessedAt": 1704915000000,
  "accessCount": 7,
  "attributes": {
    "domain": "security",
    "filepath": "src/auth.py"
  }
}
```

**Edges** represent temporal relationships:
```json
{
  "edgeId": "edge_abc123",
  "fromNodeId": "node_decision_rsa",
  "toNodeId": "node_concept_cryptography",
  "edgeType": "RELATES_TO|CAUSED_BY|CONTRADICTS|REFINES|DEPENDS_ON",
  "weight": 0.85,
  "createdAt": 1704912345678,
  "lastReinforced": 1704915000000,
  "reinforcements": 3,
  "sourceEventId": "evt_042"
}
```

### 3.2 Graph Edge Types

- **RELATES_TO**: Semantic connection between concepts
- **CAUSED_BY**: Causal relationship (decision → rationale)
- **CONTRADICTS**: Conflicting information (for detecting inconsistencies)
- **REFINES**: Later information refines earlier understanding
- **DEPENDS_ON**: Dependency relationship (decision depends on finding)

### 3.3 Graph Indexing Strategy

**Adjacency List Cache (graph.index)**:
```
node_id -> {
  outgoing: [{edgeId, toNodeId, weight, type}],
  incoming: [{edgeId, fromNodeId, weight, type}],
  degreeOut: int,
  degreeIn: int
}
```

Stored as compressed JSON for human-readability with binary index overlay for performance.

---

## 4. Memory Decay Implementation

### 4.1 Time-Based Decay Function

```
effectiveWeight(event, currentTime) =
  baseImportance × temporalDecay × accessBoost

where:
  temporalDecay = exp(-λ × age_in_days)
  accessBoost = 1 + log(1 + accessCount) × α
  λ = decay_rate (default: 0.1)
  α = access_amplification (default: 0.3)
```

### 4.2 Decay Application

**Event Level:**
- Calculate effective weight on-the-fly during queries
- Recent events naturally rank higher
- Frequently accessed events resist decay

**Graph Level:**
- Edge weights decay over time
- Reinforcement events boost edge weights
- Weak edges pruned during compaction

### 4.3 Decay Configuration

```yaml
# session.meta
decay_policy:
  enabled: true
  decay_rate: 0.1          # λ parameter
  access_boost: 0.3         # α parameter
  min_weight_threshold: 0.05 # Prune below this
  decay_check_interval: 3600000 # 1 hour in ms
```

---

## 5. Query Interface

### 5.1 Query Language: Temporal Graph Query (TGQ)

**Syntax:**
```
FIND {nodeType}
WHERE {conditions}
IN_TIME_RANGE {start, end}
WITH_DECAY {enabled}
RELATED_TO {nodeIds}
ORDER_BY {weight|recency|relevance}
LIMIT {n}
```

**Examples:**

```javascript
// Find recent decisions about authentication
query({
  nodeType: "DECISION",
  tags: ["authentication"],
  timeRange: { last: "7d" },
  withDecay: true,
  orderBy: "weight",
  limit: 5
})

// Find all findings related to security
query({
  nodeType: "FINDING",
  relatedTo: ["node_concept_security"],
  traversalDepth: 2,
  edgeTypes: ["RELATES_TO", "CAUSED_BY"]
})

// Get conversation context for topic
query({
  nodeType: "CONCEPT",
  label: "database schema",
  expandToMessages: true,
  timeRange: { start: sessionStart, end: now },
  includeAncestors: true
})
```

### 5.2 Query Engine Architecture

```
QueryEngine
├── Parser: TGQ → QueryPlan
├── Executor
│   ├── GraphTraversal (BFS/DFS with weight filtering)
│   ├── EventLogScan (for temporal queries)
│   └── ViewQuery (for fast common patterns)
├── DecayCalculator
└── ResultRanker
```

### 5.3 Query Execution Flow

1. **Parse** query into execution plan
2. **Index Selection**: Choose graph traversal vs event scan
3. **Traverse/Scan**: Execute with decay calculation
4. **Expand**: Resolve node IDs to full events if needed
5. **Rank**: Apply relevance scoring
6. **Limit**: Return top-N results

### 5.4 API Interface

```typescript
interface MemoryStore {
  // Event append
  append(event: Event): Promise<EventId>;

  // Query interface
  query(query: Query): Promise<QueryResult[]>;

  // Convenience methods
  getConversationHistory(limit?: number): Promise<Message[]>;
  getDecisions(topic?: string): Promise<Decision[]>;
  getFindings(filter?: FindingFilter): Promise<Finding[]>;
  getPreference(key: string): Promise<any>;

  // Privacy operations
  deleteMemories(query: DeletionQuery): Promise<DeletionReport>;

  // Lifecycle
  compact(): Promise<CompactionReport>;
  export(): Promise<SessionExport>;
  getStats(): SessionStats;
}
```

---

## 6. Concurrency Control

### 6.1 Lock-Free Append Strategy

**Event Log:**
- Single-writer, multiple-readers (SWMR)
- Atomic append operations using file system guarantees
- Writers acquire lightweight session lock (file-based semaphore)

```
Lock Mechanism:
1. Writer creates lock file: .session_abc123.lock with PID
2. Append event to events.jsonl
3. Update events.index (atomic rename)
4. Release lock (delete lock file)
5. Timeout: 5 seconds (stale lock detection)
```

**Graph Index:**
- Eventually consistent
- Background rebuild process
- Readers use versioned snapshots

### 6.2 Concurrent Read Handling

```
Read Strategy:
- Events: Direct file read (append-only = safe)
- Index: Read latest stable version
- Graph: Read from snapshot (point-in-time consistency)
```

### 6.3 Multi-Agent Coordination

**Agent Registry (agent.registry.jsonl):**
```json
{
  "agentId": "agent_deep_verify",
  "sessionId": "sess_20260111_abc123",
  "pid": 12345,
  "lastHeartbeat": 1704912345678,
  "role": "analyzer"
}
```

Agents periodically update heartbeat. Stale entries (>30s) indicate crashed agents.

---

## 7. Lifecycle Management

### 7.1 Session Initialization

```javascript
async function initializeSession(sessionId) {
  const sessionDir = `./memory/${sessionId}`;

  // Create directory structure
  await fs.mkdir(`${sessionDir}/events`, { recursive: true });
  await fs.mkdir(`${sessionDir}/graph`, { recursive: true });
  await fs.mkdir(`${sessionDir}/views`, { recursive: true });

  // Initialize metadata
  await writeFile(`${sessionDir}/session.meta`, {
    sessionId,
    createdAt: Date.now(),
    version: "1.0.0",
    sizeLimit: 10 * 1024 * 1024, // 10MB
    decayPolicy: { /* defaults */ }
  });

  // Initialize empty event log
  await fs.writeFile(`${sessionDir}/events/events.jsonl`, '');
  await fs.writeFile(`${sessionDir}/events/events.index`, '');

  return new MemoryStore(sessionId);
}
```

### 7.2 Background Maintenance

**Compaction Process (runs every 10 minutes or on size threshold):**

```javascript
async function compact(sessionDir) {
  // 1. Identify deleted events (MEMORY_DELETED events)
  const deletedIds = await scanDeletions(sessionDir);

  // 2. Rebuild event log excluding deleted events
  const tempLog = `${sessionDir}/events/events.jsonl.tmp`;
  await streamEvents(
    `${sessionDir}/events/events.jsonl`,
    tempLog,
    (event) => !deletedIds.has(event.eventId)
  );

  // 3. Rebuild index
  await rebuildIndex(tempLog);

  // 4. Atomic swap
  await fs.rename(tempLog, `${sessionDir}/events/events.jsonl`);

  // 5. Rebuild graph index (prune weak edges)
  await rebuildGraph(sessionDir, { minWeight: 0.05 });

  // 6. Update views
  await rebuildViews(sessionDir);

  // 7. Log compaction
  await appendCompactionLog(sessionDir, {
    timestamp: Date.now(),
    eventsRemoved: deletedIds.size,
    newSize: await getDirectorySize(sessionDir)
  });
}
```

### 7.3 Size Management

**Size Monitoring:**
```javascript
async function checkSize(sessionDir) {
  const currentSize = await getDirectorySize(sessionDir);
  const limit = await getSizeLimit(sessionDir);

  if (currentSize > limit * 0.9) {
    // Trigger aggressive compaction
    await compact(sessionDir, { aggressive: true });

    // If still over limit, prune oldest low-importance events
    if (await getDirectorySize(sessionDir) > limit) {
      await pruneOldEvents(sessionDir, {
        targetSize: limit * 0.8,
        preserveTypes: ["DECISION_MADE", "PREFERENCE_SET"]
      });
    }
  }
}
```

**Pruning Strategy:**
1. Calculate effective weight for all events
2. Sort by weight (ascending)
3. Remove lowest-weight events until size target met
4. Always preserve DECISION_MADE and PREFERENCE_SET events
5. Rebuild graph and views

---

## 8. Privacy & Deletion

### 8.1 Deletion Semantics

**Soft Deletion (Append MEMORY_DELETED event):**
- Fast operation
- Maintains audit trail
- Deleted events hidden from queries
- Physically removed during compaction

**Hard Deletion (Immediate compaction):**
- Physically removes events immediately
- For sensitive data requiring immediate erasure
- More expensive operation

### 8.2 Deletion API

```typescript
interface DeletionQuery {
  eventIds?: string[];           // Specific events
  tags?: string[];               // All events with tags
  timeRange?: TimeRange;         // All events in range
  nodeIds?: string[];            // Events linked to nodes
  pattern?: string;              // Content pattern match
  deleteMode?: 'soft' | 'hard';
}

interface DeletionReport {
  deletedCount: number;
  affectedNodes: string[];
  affectedEdges: string[];
  compactionRequired: boolean;
  timestamp: number;
}
```

### 8.3 Graph Pruning

When events are deleted:
1. Identify affected nodes (sourceEventIds contains deleted events)
2. Remove nodes if ALL source events deleted
3. Remove edges connected to deleted nodes
4. Recompute edge weights for partially affected nodes

---

## 9. Projection Views (Read Models)

### 9.1 Conversation View

Materialized view of conversation thread for fast access:

```json
// conversation.view
{
  "messages": [
    {
      "messageId": "msg_001",
      "role": "user",
      "content": "...",
      "timestamp": 1704912345678,
      "sourceEventId": "evt_001"
    },
    {
      "messageId": "msg_002",
      "role": "assistant",
      "content": "...",
      "timestamp": 1704912350000,
      "sourceEventId": "evt_005"
    }
  ],
  "lastUpdated": 1704912350000,
  "version": 42
}
```

### 9.2 Decision Registry View

```json
// decisions.view
{
  "decisions": [
    {
      "decisionId": "dec_001",
      "decision": "Use RSA-2048",
      "topic": "cryptography",
      "confidence": 0.9,
      "timestamp": 1704912345678,
      "sourceEventId": "evt_042",
      "effectiveWeight": 0.82
    }
  ],
  "byTopic": {
    "cryptography": ["dec_001"],
    "database": ["dec_005", "dec_008"]
  }
}
```

### 9.3 Preferences View

```json
// preferences.view
{
  "global": {
    "code_style.indent": "2-spaces",
    "response_format": "detailed"
  },
  "session": {
    "focus_area": "security-audit"
  },
  "lastUpdated": 1704912345678
}
```

### 9.4 View Update Strategy

- **Incremental**: Update views as events append (fast path)
- **Rebuild**: Periodic full rebuild from event log (ensures consistency)
- **On-Demand**: Rebuild view if version mismatch detected

---

## 10. Offline Operation

### 10.1 Zero External Dependencies

**Storage:**
- File system only (JSONL files)
- No database server required
- Portable across environments

**Libraries:**
- Standard file I/O
- JSON parsing (built-in)
- Optional: compression (gzip - standard library)

### 10.2 Portability

**Session Export:**
```javascript
async function exportSession(sessionId) {
  return {
    sessionId,
    createdAt: /* ... */,
    events: await readAllEvents(sessionId),
    metadata: await readMetadata(sessionId)
  };
}
```

**Session Import:**
```javascript
async function importSession(exportData) {
  const sessionId = exportData.sessionId;
  await initializeSession(sessionId);

  for (const event of exportData.events) {
    await appendEvent(sessionId, event);
  }

  await rebuildGraph(sessionId);
  await rebuildViews(sessionId);
}
```

### 10.3 Cross-Platform Compatibility

- Use platform-agnostic path separators
- UTF-8 encoding throughout
- Newline normalization (LF)
- Timestamp in milliseconds (UTC)

---

## 11. Implementation Example

### 11.1 Core MemoryStore Class

```typescript
class EventSourcedMemoryStore {
  private sessionDir: string;
  private eventLog: EventLog;
  private graphIndex: TemporalGraph;
  private views: ViewManager;
  private lockManager: LockManager;

  constructor(sessionId: string) {
    this.sessionDir = `./memory/${sessionId}`;
    this.eventLog = new EventLog(`${this.sessionDir}/events`);
    this.graphIndex = new TemporalGraph(`${this.sessionDir}/graph`);
    this.views = new ViewManager(`${this.sessionDir}/views`);
    this.lockManager = new LockManager(this.sessionDir);
  }

  async append(event: Event): Promise<EventId> {
    await this.lockManager.acquire();
    try {
      // Append to event log
      const eventId = await this.eventLog.append(event);

      // Update graph index (async, non-blocking)
      this.graphIndex.index(event).catch(err =>
        console.error('Graph indexing failed:', err)
      );

      // Update views (async, non-blocking)
      this.views.update(event).catch(err =>
        console.error('View update failed:', err)
      );

      return eventId;
    } finally {
      await this.lockManager.release();
    }
  }

  async query(query: Query): Promise<QueryResult[]> {
    // Choose execution strategy
    const plan = this.planQuery(query);

    switch (plan.strategy) {
      case 'graph_traversal':
        return this.executeGraphQuery(query);
      case 'event_scan':
        return this.executeEventScan(query);
      case 'view_lookup':
        return this.executeViewQuery(query);
      default:
        throw new Error(`Unknown strategy: ${plan.strategy}`);
    }
  }

  private async executeGraphQuery(query: Query): Promise<QueryResult[]> {
    // Start from seed nodes matching query
    const seedNodes = await this.graphIndex.findNodes(query.conditions);

    // Traverse graph
    const visited = new Set<string>();
    const results: QueryResult[] = [];

    for (const seed of seedNodes) {
      await this.traverse(seed, query, visited, results);
    }

    // Apply decay and rank
    return this.rankResults(results, query);
  }

  private async traverse(
    nodeId: string,
    query: Query,
    visited: Set<string>,
    results: QueryResult[]
  ): Promise<void> {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = await this.graphIndex.getNode(nodeId);

    // Expand to source events
    for (const eventId of node.sourceEventIds) {
      const event = await this.eventLog.getEvent(eventId);
      const weight = this.calculateEffectiveWeight(event);

      if (weight >= query.minWeight) {
        results.push({ event, weight, node });
      }
    }

    // Traverse edges if depth remains
    if (query.traversalDepth > 0) {
      const edges = await this.graphIndex.getEdges(nodeId, query.edgeTypes);
      for (const edge of edges) {
        await this.traverse(
          edge.toNodeId,
          { ...query, traversalDepth: query.traversalDepth - 1 },
          visited,
          results
        );
      }
    }
  }

  private calculateEffectiveWeight(event: Event): number {
    const now = Date.now();
    const ageInDays = (now - event.timestamp) / (1000 * 60 * 60 * 24);
    const temporalDecay = Math.exp(-0.1 * ageInDays);
    const accessBoost = 1 + Math.log(1 + (event.accessCount || 0)) * 0.3;

    return event.metadata.importance * temporalDecay * accessBoost;
  }

  async getConversationHistory(limit: number = 50): Promise<Message[]> {
    // Fast path: read from materialized view
    const view = await this.views.getConversationView();
    return view.messages.slice(-limit);
  }

  async deleteMemories(query: DeletionQuery): Promise<DeletionReport> {
    await this.lockManager.acquire();
    try {
      // Find events matching deletion query
      const toDelete = await this.findEventsToDelete(query);

      // Append MEMORY_DELETED event
      const deletionEvent: Event = {
        eventId: generateEventId(),
        sessionId: this.sessionId,
        timestamp: Date.now(),
        sequenceNum: await this.eventLog.getNextSequence(),
        eventType: 'MEMORY_DELETED',
        payload: {
          deletionQuery: query,
          deletedEventIds: toDelete.map(e => e.eventId),
          reason: 'user_request'
        },
        metadata: { importance: 1.0, tags: ['privacy', 'deletion'] }
      };

      await this.eventLog.append(deletionEvent);

      // Trigger compaction if hard delete requested
      if (query.deleteMode === 'hard') {
        await this.compact();
      }

      return {
        deletedCount: toDelete.length,
        affectedNodes: await this.graphIndex.findAffectedNodes(toDelete),
        affectedEdges: await this.graphIndex.findAffectedEdges(toDelete),
        compactionRequired: query.deleteMode !== 'hard',
        timestamp: Date.now()
      };
    } finally {
      await this.lockManager.release();
    }
  }
}
```

---

## 12. Performance Characteristics

### 12.1 Time Complexity

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Append Event | O(1) | Append-only log |
| Query by Event ID | O(1) | Direct index lookup |
| Graph Traversal | O(V + E) | V=nodes, E=edges in subgraph |
| Event Scan | O(N) | N=total events (with early termination) |
| Conversation History | O(1) | Materialized view lookup |
| Compaction | O(N) | Linear scan and rebuild |

### 12.2 Space Complexity

| Component | Size | Notes |
|-----------|------|-------|
| Event Log | ~500 bytes/event | JSON compressed |
| Graph Index | ~200 bytes/node, ~100 bytes/edge | Sparse representation |
| Views | ~10% of event log | Materialized snapshots |
| Metadata | ~10 KB | Fixed overhead |
| **Total** | **~8 MB for 10K events** | Well within 10MB limit |

### 12.3 Optimization Strategies

**For Large Sessions:**
1. **Streaming Queries**: Process events without loading all into memory
2. **Lazy Graph Loading**: Load graph segments on-demand
3. **View Caching**: Keep hot views in memory
4. **Compression**: gzip event log (3x-5x reduction)

**For Frequent Queries:**
1. **Query Result Cache**: Cache common query patterns (LRU)
2. **Bloom Filters**: Fast negative lookups for tags
3. **Inverted Index**: Tag → Event IDs mapping

---

## 13. Debugging & Observability

### 13.1 Human-Readable Format

**All storage files are text-based:**
- Events: JSONL (open with any text editor)
- Graph: JSONL (human-scannable)
- Views: JSON (pretty-printed)

**Debugging Tools:**

```bash
# View recent events
tail -n 20 memory/sess_abc123/events/events.jsonl | jq

# Search for decisions
grep "DECISION_MADE" memory/sess_abc123/events/events.jsonl | jq

# Inspect graph nodes
cat memory/sess_abc123/graph/nodes.jsonl | jq '.[] | select(.label | contains("auth"))'

# Check session stats
cat memory/sess_abc123/session.meta | jq
```

### 13.2 Diagnostic API

```typescript
interface SessionStats {
  sessionId: string;
  createdAt: number;
  totalEvents: number;
  eventsByType: Record<EventType, number>;
  graphSize: { nodes: number; edges: number };
  diskSize: number;
  sizeLimit: number;
  lastCompaction: number;
  decayStats: {
    averageAge: number;
    averageWeight: number;
    eventsBelow05: number;
  };
}

memoryStore.getStats(): Promise<SessionStats>
```

### 13.3 Integrity Checks

```typescript
async function verifyIntegrity(sessionDir: string) {
  const issues: string[] = [];

  // Check event log integrity
  const events = await readAllEvents(sessionDir);
  for (const event of events) {
    const computed = computeChecksum(event);
    if (computed !== event.checksum) {
      issues.push(`Event ${event.eventId} checksum mismatch`);
    }
  }

  // Check graph consistency
  const orphanedNodes = await findOrphanedNodes(sessionDir);
  if (orphanedNodes.length > 0) {
    issues.push(`Found ${orphanedNodes.length} orphaned nodes`);
  }

  // Check size limits
  const size = await getDirectorySize(sessionDir);
  const limit = await getSizeLimit(sessionDir);
  if (size > limit) {
    issues.push(`Session exceeds size limit: ${size} > ${limit}`);
  }

  return { valid: issues.length === 0, issues };
}
```

---

## 14. Migration & Versioning

### 14.1 Version Strategy

```json
// session.meta
{
  "version": "1.0.0",
  "schemaVersion": "1",
  "migrations": [
    {
      "from": "0.9.0",
      "to": "1.0.0",
      "appliedAt": 1704912345678,
      "script": "migrate_0_9_to_1_0.js"
    }
  ]
}
```

### 14.2 Migration Process

```javascript
async function migrate(sessionDir, targetVersion) {
  const currentVersion = await getCurrentVersion(sessionDir);
  const migrationPath = findMigrationPath(currentVersion, targetVersion);

  // Backup before migration
  await backupSession(sessionDir);

  for (const migration of migrationPath) {
    console.log(`Applying migration: ${migration.from} → ${migration.to}`);
    await applyMigration(sessionDir, migration);
    await updateVersion(sessionDir, migration.to);
  }

  // Verify integrity after migration
  const integrity = await verifyIntegrity(sessionDir);
  if (!integrity.valid) {
    throw new Error(`Migration failed: ${integrity.issues.join(', ')}`);
  }
}
```

---

## 15. Usage Examples

### 15.1 Initialize and Use Memory Store

```typescript
import { EventSourcedMemoryStore } from './memory-store';

// Initialize session
const sessionId = 'sess_20260111_abc123';
const memory = new EventSourcedMemoryStore(sessionId);

// Record user message
await memory.append({
  eventType: 'MESSAGE_RECEIVED',
  payload: {
    role: 'user',
    content: 'Review the authentication module for security issues'
  },
  metadata: {
    importance: 0.7,
    tags: ['conversation', 'security']
  }
});

// Record finding
await memory.append({
  eventType: 'FINDING_RECORDED',
  payload: {
    finding: 'Authentication endpoint lacks rate limiting',
    severity: 'high',
    evidence: ['file:auth.py:45']
  },
  metadata: {
    importance: 0.9,
    tags: ['finding', 'security', 'authentication']
  }
});

// Record decision
await memory.append({
  eventType: 'DECISION_MADE',
  payload: {
    decision: 'Implement token bucket rate limiter',
    rationale: 'Protects against brute force attacks while allowing burst traffic',
    confidence: 0.85
  },
  metadata: {
    importance: 0.95,
    tags: ['decision', 'security', 'rate-limiting']
  }
});
```

### 15.2 Query Past Decisions

```typescript
// Find recent decisions about security
const securityDecisions = await memory.query({
  nodeType: 'DECISION',
  tags: ['security'],
  timeRange: { last: '7d' },
  withDecay: true,
  orderBy: 'weight',
  limit: 10
});

console.log('Recent security decisions:');
for (const result of securityDecisions) {
  console.log(`- ${result.event.payload.decision} (weight: ${result.weight})`);
}
```

### 15.3 Get Conversation Context

```typescript
// Retrieve conversation history
const messages = await memory.getConversationHistory(20);

console.log('Last 20 messages:');
for (const msg of messages) {
  console.log(`[${msg.role}]: ${msg.content.substring(0, 100)}...`);
}
```

### 15.4 Delete Sensitive Information

```typescript
// User requests deletion of messages containing API keys
const deletionReport = await memory.deleteMemories({
  pattern: 'API_KEY|SECRET_KEY',
  deleteMode: 'hard',
  reason: 'Sensitive data exposed'
});

console.log(`Deleted ${deletionReport.deletedCount} events containing sensitive data`);
```

---

## 16. Advantages of This Architecture

### 16.1 Compared to Snapshot-Based Storage

| Aspect | Event Sourcing + Graph | Traditional Snapshots |
|--------|------------------------|----------------------|
| **Audit Trail** | Complete, immutable history | Only current state |
| **Time-Travel** | Reconstruct any past state | Not possible |
| **Debugging** | Replay events to reproduce bugs | Limited |
| **Concurrency** | Append-only (minimal locking) | Complex locking needed |
| **Memory Decay** | Natural via event weighting | Requires separate mechanism |
| **Privacy** | Append delete events | In-place modification |
| **Queryability** | Rich temporal queries | Limited to current state |

### 16.2 Key Benefits

1. **Immutability**: Event log never modified, only appended
2. **Traceability**: Every state change has a reason (event)
3. **Flexibility**: Add new projections without changing storage
4. **Resilience**: Corrupt view? Rebuild from event log
5. **Auditability**: Who decided what, when, and why
6. **Scalability**: Compaction keeps size bounded
7. **Simplicity**: No complex ORM, just append and query

---

## 17. Limitations & Trade-offs

### 17.1 Known Limitations

1. **Write Amplification**: Every event creates graph/view updates
2. **Eventual Consistency**: Graph index may lag event log briefly
3. **Query Latency**: Complex graph traversals can be slow
4. **Memory Overhead**: Graph index requires RAM for large sessions

### 17.2 Mitigation Strategies

1. **Async Indexing**: Graph updates don't block event append
2. **View Caching**: Common queries served from materialized views
3. **Compaction**: Regular cleanup keeps size manageable
4. **Partitioning**: Large sessions can be split into episodes

---

## 18. Future Enhancements

### 18.1 Advanced Features

- **Semantic Search**: Embed events using LLM, enable vector similarity search
- **Cross-Session Knowledge**: Link related concepts across sessions
- **Anomaly Detection**: Identify contradictory decisions automatically
- **Auto-Tagging**: ML-based tag extraction from events
- **Compression**: Adaptive compression (high for old events, low for recent)

### 18.2 Optimization Opportunities

- **Binary Format**: Switch to MessagePack for 30-40% size reduction
- **Incremental Graph**: Update graph without full rebuild
- **Lazy Deserialization**: Parse JSON on-demand
- **Memory-Mapped Files**: Fast random access for indices

---

## 19. Conclusion

This event-sourced memory persistence architecture with temporal graph indexing provides a robust, queryable, and privacy-respecting solution for multi-agent session memory. By treating events as the source of truth and deriving all other representations, it achieves flexibility, auditability, and resilience while maintaining human-readable storage for debugging.

The combination of immutable event logging, temporal graph indexing, and materialized views enables efficient queries across conversation history, decisions, findings, and preferences while naturally supporting memory decay, concurrent access, and privacy operations.

**Key Differentiators:**
- Event sourcing provides complete audit trail and time-travel
- Temporal graph enables semantic queries and relationship discovery
- Materialized views optimize common access patterns
- Human-readable JSONL format simplifies debugging
- Lock-free append operations support concurrent agents
- Natural memory decay via time-weighted graph traversal
- Privacy-first deletion semantics with soft/hard modes
- Zero external dependencies (file system only)
- Automatic size management via compaction and pruning

This architecture meets all requirements while introducing innovative approaches to session memory persistence that go beyond traditional snapshot-based solutions.
