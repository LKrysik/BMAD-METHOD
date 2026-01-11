# Agent Memory Persistence Layer - Design Document

## Document Metadata
- **Version**: 1.0
- **Date**: 2026-01-10
- **Author**: System Architecture Team
- **Status**: Design Proposal

---

## 1. Overview

### 1.1 Purpose
This document specifies the design of a memory persistence layer that enables agents to maintain context across sessions, improving effectiveness through retained conversation history, decisions, findings, and user preferences.

### 1.2 Goals
- Enable seamless context retention between agent sessions
- Provide queryable access to historical information
- Support concurrent multi-agent access patterns
- Maintain human-readable format for debugging
- Operate entirely offline without external dependencies
- Implement intelligent memory decay for relevance
- Respect user privacy with selective memory deletion

### 1.3 Non-Goals
- Real-time synchronization across distributed systems
- Support for sessions exceeding 10MB
- Integration with external database systems
- Automatic memory compression or archival

---

## 2. Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Agent Runtime                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Memory Manager (Facade)                     │
│  - Session lifecycle management                          │
│  - Memory query interface                                │
│  - Decay algorithm coordination                          │
└─────┬──────────────────┬──────────────────┬─────────────┘
      │                  │                  │
      ▼                  ▼                  ▼
┌──────────┐    ┌─────────────┐    ┌──────────────┐
│ Storage  │    │   Query     │    │   Decay      │
│ Engine   │    │   Engine    │    │   Engine     │
└──────────┘    └─────────────┘    └──────────────┘
      │                  │                  │
      └──────────────────┴──────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  File System     │
              │  (JSONL + Index) │
              └──────────────────┘
```

### 2.2 Storage Architecture

**Primary Storage Format**: JSONL (JSON Lines)
- Human-readable text format
- One JSON object per line
- Append-only for better concurrency
- Easy to parse and debug

**File Structure**:
```
memory/
├── sessions/
│   ├── {session_id}/
│   │   ├── metadata.json          # Session metadata
│   │   ├── memory.jsonl           # Main memory log
│   │   ├── index.json             # Search index
│   │   ├── tombstones.jsonl       # Deleted entries
│   │   └── lock                   # Concurrency control
│   └── ...
├── indices/
│   ├── global_index.json          # Cross-session index
│   └── topic_index.json           # Topic-based index
└── config.json                     # Global configuration
```

---

## 3. Component Details

### 3.1 Memory Entry Schema

Each memory entry in `memory.jsonl`:

```json
{
  "id": "mem_abc123xyz",
  "session_id": "sess_20260110_user123",
  "timestamp": "2026-01-10T14:23:45.678Z",
  "type": "conversation|decision|finding|preference",
  "content": {
    "role": "user|assistant",
    "message": "...",
    "metadata": {}
  },
  "importance": 0.85,
  "decay_factor": 1.0,
  "tags": ["authentication", "security"],
  "references": ["mem_def456uvw"],
  "checksum": "sha256:..."
}
```

**Field Descriptions**:
- `id`: Unique identifier for memory entry
- `session_id`: Parent session identifier
- `timestamp`: ISO 8601 timestamp
- `type`: Classification of memory type
- `content`: Actual memory data (flexible structure)
- `importance`: Initial importance score (0.0-1.0)
- `decay_factor`: Current decay multiplier (updated over time)
- `tags`: Searchable tags for topic-based queries
- `references`: Links to related memory entries
- `checksum`: Integrity verification

### 3.2 Session Metadata Schema

`metadata.json` structure:

```json
{
  "session_id": "sess_20260110_user123",
  "user_id": "user123",
  "created_at": "2026-01-10T14:00:00.000Z",
  "last_accessed": "2026-01-10T14:30:00.000Z",
  "total_entries": 42,
  "total_size_bytes": 1048576,
  "decay_config": {
    "enabled": true,
    "half_life_hours": 168,
    "min_decay_factor": 0.1
  },
  "preferences": {
    "language": "en",
    "verbosity": "medium",
    "custom": {}
  },
  "statistics": {
    "conversations": 15,
    "decisions": 8,
    "findings": 12,
    "preferences": 7
  }
}
```

### 3.3 Index Schema

`index.json` structure for fast querying:

```json
{
  "version": 1,
  "last_updated": "2026-01-10T14:30:00.000Z",
  "entries": {
    "mem_abc123xyz": {
      "line_number": 42,
      "byte_offset": 123456,
      "type": "decision",
      "timestamp": "2026-01-10T14:23:45.678Z",
      "tags": ["authentication", "security"],
      "importance": 0.85,
      "current_relevance": 0.78
    }
  },
  "tags": {
    "authentication": ["mem_abc123xyz", "mem_def456uvw"],
    "security": ["mem_abc123xyz"]
  },
  "types": {
    "decision": ["mem_abc123xyz"],
    "conversation": ["mem_ghi789rst"]
  }
}
```

---

## 4. Core Components

### 4.1 Memory Manager (Facade)

**Responsibilities**:
- Unified API for all memory operations
- Session lifecycle management
- Coordinate between storage, query, and decay engines
- Enforce size limits and quotas

**Interface**:

```typescript
interface MemoryManager {
  // Session Management
  createSession(userId: string, options?: SessionOptions): Session;
  loadSession(sessionId: string): Session;
  closeSession(sessionId: string): void;

  // Memory Operations
  addMemory(sessionId: string, entry: MemoryEntry): string;
  getMemory(sessionId: string, memoryId: string): MemoryEntry | null;
  deleteMemory(sessionId: string, memoryId: string): boolean;

  // Query Operations
  queryMemories(sessionId: string, query: MemoryQuery): MemoryEntry[];
  searchByTopic(sessionId: string, topic: string): MemoryEntry[];
  searchByType(sessionId: string, type: MemoryType): MemoryEntry[];
  searchByTimeRange(sessionId: string, start: Date, end: Date): MemoryEntry[];

  // User Privacy
  deleteMemoriesByTopic(sessionId: string, topic: string): number;
  deleteMemoriesByTimeRange(sessionId: string, start: Date, end: Date): number;
  exportSession(sessionId: string, format: 'json' | 'jsonl'): string;

  // Maintenance
  compactSession(sessionId: string): void;
  rebuildIndex(sessionId: string): void;
  getSessionStats(sessionId: string): SessionStats;
}
```

### 4.2 Storage Engine

**Responsibilities**:
- Append-only writes to JSONL files
- Atomic read operations
- File-based concurrency control
- Size monitoring and enforcement
- Integrity verification

**Concurrency Strategy**:
- File-based advisory locking using lock files
- Lock acquisition with timeout (5 seconds default)
- Read operations: shared lock (multiple readers)
- Write operations: exclusive lock (single writer)
- Lock file contains: process ID, timestamp, operation type

**Lock File Format**:
```json
{
  "pid": 12345,
  "timestamp": "2026-01-10T14:30:00.000Z",
  "operation": "write",
  "expires_at": "2026-01-10T14:30:05.000Z"
}
```

**Algorithm for Concurrent Access**:
```
1. Attempt to create lock file atomically
2. If exists, read lock file
3. Check if lock expired
4. If expired, remove and retry
5. If active, wait and retry (exponential backoff)
6. On timeout, throw ConcurrencyError
7. Perform operation
8. Remove lock file
```

### 4.3 Query Engine

**Responsibilities**:
- Parse and execute memory queries
- Maintain search indices
- Apply decay factors to relevance scoring
- Return results sorted by relevance

**Query Types**:

1. **Full-Text Search**:
   - Search within content fields
   - Case-insensitive matching
   - Support for wildcards

2. **Tag-Based Search**:
   - Exact tag matching
   - Tag combinations (AND/OR)
   - Hierarchical tags (e.g., "security.authentication")

3. **Temporal Search**:
   - Time range queries
   - Relative time (last hour, last day, last week)
   - Recency boosting

4. **Hybrid Search**:
   - Combine multiple query types
   - Weighted relevance scoring
   - Decay-adjusted results

**Relevance Scoring Formula**:
```
final_relevance = base_importance × decay_factor × recency_boost × match_quality

where:
- base_importance: Initial importance score (0.0-1.0)
- decay_factor: Time-based decay multiplier (0.1-1.0)
- recency_boost: Recent access bonus (1.0-1.5)
- match_quality: Query match strength (0.0-1.0)
```

### 4.4 Decay Engine

**Responsibilities**:
- Apply time-based decay to memory importance
- Calculate decay factors based on configurable half-life
- Update indices with current relevance scores
- Support different decay curves per memory type

**Decay Algorithm**:

**Exponential Decay Formula**:
```
decay_factor = max(min_decay, exp(-λ × t))

where:
- λ (lambda) = ln(2) / half_life_hours
- t = hours since creation
- min_decay = minimum decay factor (default: 0.1)
```

**Memory Type Decay Rates**:
- `conversation`: half_life = 168 hours (7 days)
- `decision`: half_life = 720 hours (30 days)
- `finding`: half_life = 336 hours (14 days)
- `preference`: no decay (decay_factor = 1.0)

**Decay Update Strategy**:
- Lazy evaluation: compute on query time
- Periodic batch updates: rebuild index every hour
- Store last_decay_update timestamp
- Avoid recomputing if recently updated

**Implementation**:
```typescript
function calculateDecayFactor(
  entry: MemoryEntry,
  config: DecayConfig,
  currentTime: Date
): number {
  if (entry.type === 'preference') {
    return 1.0; // Preferences don't decay
  }

  const halfLife = config.half_life_hours;
  const lambda = Math.LN2 / halfLife;
  const hoursElapsed = (currentTime.getTime() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60);

  const decayFactor = Math.exp(-lambda * hoursElapsed);
  return Math.max(config.min_decay_factor, decayFactor);
}
```

---

## 5. Implementation Details

### 5.1 Size Management

**Enforcement Strategy**:
- Check size before each write operation
- If approaching limit (>90%), trigger compaction
- If at limit, reject new entries with error
- Size includes: memory.jsonl + index.json + tombstones.jsonl

**Compaction Process**:
1. Filter out tombstoned entries
2. Apply decay threshold (remove entries with relevance < 0.05)
3. Compress older entries (remove verbose metadata)
4. Rewrite memory.jsonl and rebuild index
5. Update metadata with new statistics

### 5.2 Privacy and Deletion

**Tombstone Strategy**:
- Deleted entries written to `tombstones.jsonl`
- Main memory.jsonl entries marked as deleted in index
- Actual removal during compaction
- Tombstones contain: id, timestamp, reason

**Deletion Types**:
1. **Single Memory**: Mark as deleted in index
2. **Topic-Based**: Find all memories with tag, mark deleted
3. **Time Range**: Find all in range, mark deleted
4. **Full Session**: Delete entire session directory

**GDPR Compliance Considerations**:
- User can export all session data
- User can delete specific topics or time ranges
- Deletion is permanent after compaction
- Audit log of deletions in tombstones.jsonl

### 5.3 Error Handling

**Error Types and Responses**:

1. **ConcurrencyError**: Lock timeout
   - Retry with exponential backoff
   - Max retries: 3
   - Surface error to caller after retries exhausted

2. **SizeLimitError**: Session exceeds 10MB
   - Trigger automatic compaction
   - If still exceeds, reject write
   - Return error with size statistics

3. **CorruptionError**: Checksum mismatch
   - Log corruption details
   - Skip corrupted entry
   - Continue processing valid entries
   - Surface warning to caller

4. **IOError**: File system issues
   - Retry with backoff (3 attempts)
   - Fall back to in-memory buffer
   - Persist when file system recovers

### 5.4 Performance Optimizations

**In-Memory Caching**:
- Cache recently accessed memories (LRU, 100 entries)
- Cache index in memory for active sessions
- Invalidate on writes

**Batch Operations**:
- Buffer multiple writes, flush periodically
- Batch index updates
- Atomic multi-write with single lock

**Index Optimization**:
- Use inverted indices for tags and types
- Store byte offsets for direct file access
- Lazy load memory content from file

---

## 6. API Usage Examples

### 6.1 Basic Usage

```typescript
// Initialize
const memoryManager = new MemoryManager({
  storageRoot: './memory',
  defaultDecayHalfLife: 168 // hours
});

// Create session
const session = memoryManager.createSession('user123');

// Add conversation memory
const memId = memoryManager.addMemory(session.id, {
  type: 'conversation',
  content: {
    role: 'user',
    message: 'How do I implement OAuth2?'
  },
  importance: 0.8,
  tags: ['oauth2', 'authentication']
});

// Add decision memory
memoryManager.addMemory(session.id, {
  type: 'decision',
  content: {
    decision: 'Use Authorization Code flow for web apps',
    rationale: 'Most secure for server-side applications',
    alternatives: ['Implicit flow', 'PKCE']
  },
  importance: 0.9,
  tags: ['oauth2', 'security', 'architecture'],
  references: [memId]
});

// Query by topic
const authMemories = memoryManager.searchByTopic(session.id, 'oauth2');

// Close session
memoryManager.closeSession(session.id);
```

### 6.2 Advanced Querying

```typescript
// Complex query
const results = memoryManager.queryMemories(session.id, {
  types: ['decision', 'finding'],
  tags: {
    include: ['security'],
    exclude: ['deprecated']
  },
  timeRange: {
    start: new Date('2026-01-01'),
    end: new Date('2026-01-10')
  },
  minImportance: 0.7,
  sortBy: 'relevance',
  limit: 10
});

// Get related memories
const relatedMemories = memoryManager.queryMemories(session.id, {
  references: ['mem_abc123xyz'],
  maxDepth: 2 // Follow references 2 levels deep
});
```

### 6.3 Privacy Operations

```typescript
// Delete specific memory
memoryManager.deleteMemory(session.id, 'mem_abc123xyz');

// Delete all memories about a topic
const deletedCount = memoryManager.deleteMemoriesByTopic(
  session.id,
  'personal_info'
);

// Delete memories in time range
memoryManager.deleteMemoriesByTimeRange(
  session.id,
  new Date('2026-01-01'),
  new Date('2026-01-05')
);

// Export session data
const exportData = memoryManager.exportSession(session.id, 'json');
```

---

## 7. Configuration

### 7.1 Global Configuration

`config.json`:

```json
{
  "version": "1.0",
  "storage": {
    "root_directory": "./memory",
    "max_session_size_mb": 10,
    "compaction_threshold": 0.9,
    "auto_compact": true
  },
  "concurrency": {
    "lock_timeout_ms": 5000,
    "max_retries": 3,
    "retry_backoff_ms": 100
  },
  "decay": {
    "enabled": true,
    "update_interval_minutes": 60,
    "type_specific": {
      "conversation": {"half_life_hours": 168},
      "decision": {"half_life_hours": 720},
      "finding": {"half_life_hours": 336},
      "preference": {"decay_enabled": false}
    },
    "min_decay_factor": 0.1
  },
  "performance": {
    "cache_size": 100,
    "batch_write_interval_ms": 1000,
    "index_in_memory": true
  },
  "integrity": {
    "enable_checksums": true,
    "checksum_algorithm": "sha256"
  }
}
```

### 7.2 Per-Session Configuration

Overrides in session metadata:

```json
{
  "decay_config": {
    "enabled": true,
    "half_life_hours": 336,
    "min_decay_factor": 0.2
  },
  "compaction_config": {
    "auto_compact": false,
    "threshold": 0.95
  }
}
```

---

## 8. File Format Specifications

### 8.1 JSONL Format

**Rules**:
- One complete JSON object per line
- Lines separated by `\n` (Unix) or `\r\n` (Windows)
- No trailing comma
- UTF-8 encoding
- Each object must be self-contained

**Example memory.jsonl**:
```jsonl
{"id":"mem_001","session_id":"sess_001","timestamp":"2026-01-10T10:00:00Z","type":"conversation","content":{"role":"user","message":"Hello"},"importance":0.5,"decay_factor":1.0,"tags":[],"references":[]}
{"id":"mem_002","session_id":"sess_001","timestamp":"2026-01-10T10:01:00Z","type":"conversation","content":{"role":"assistant","message":"Hi!"},"importance":0.5,"decay_factor":1.0,"tags":[],"references":["mem_001"]}
```

### 8.2 Checksum Calculation

**Algorithm**:
```typescript
function calculateChecksum(entry: MemoryEntry): string {
  // Create canonical representation (sorted keys, no whitespace)
  const canonical = JSON.stringify(entry, Object.keys(entry).sort());

  // Calculate SHA-256 hash
  const hash = crypto.createHash('sha256');
  hash.update(canonical);

  return `sha256:${hash.digest('hex')}`;
}
```

**Verification**:
- On read: recalculate checksum and compare
- On mismatch: log error, skip entry, continue
- Report corruption statistics in session stats

---

## 9. Testing Strategy

### 9.1 Unit Tests

**Coverage Areas**:
- Memory entry creation and validation
- Decay calculation accuracy
- Index building and updates
- Query parsing and execution
- Lock acquisition and release
- Size limit enforcement
- Checksum calculation and verification

### 9.2 Integration Tests

**Scenarios**:
- Complete session lifecycle
- Concurrent access from multiple processes
- Size limit reached and compaction triggered
- Corruption recovery
- Cross-session queries
- Privacy operations (deletion, export)

### 9.3 Performance Tests

**Metrics**:
- Write throughput (entries/sec)
- Query latency (p50, p95, p99)
- Memory usage under load
- Compaction time for full session
- Index rebuild time
- Lock contention under high concurrency

### 9.4 Edge Cases

**Test Cases**:
1. Session exactly at 10MB limit
2. Concurrent writes to same session
3. Power failure during write (incomplete line)
4. Corrupted index file
5. Clock skew (timestamps in future)
6. Unicode and special characters in content
7. Very large single memory entry (>1MB)
8. Circular references between memories
9. Deletion of non-existent memory
10. Query with no results

---

## 10. Assumptions

### 10.1 Explicit Assumptions

1. **File System**:
   - Local file system with POSIX-like semantics
   - Atomic file operations (rename, create if not exists)
   - File locking support or ability to use lock files

2. **Runtime Environment**:
   - Node.js or similar JavaScript runtime
   - Access to crypto libraries for checksums
   - Access to file system APIs

3. **Usage Patterns**:
   - Sessions are primarily single-agent (concurrent access is exception)
   - Reads >> Writes (read-heavy workload)
   - Most queries are recent history (last few days)
   - Average session size: 2-5 MB

4. **Performance Requirements** (Assumed):
   - Write latency: <50ms (p95)
   - Query latency: <100ms (p95)
   - Lock contention: <1% of operations
   - Index rebuild: <1 second for 10MB session

5. **Data Characteristics**:
   - Average memory entry: 500 bytes - 2KB
   - Typical session: 1000-5000 entries
   - Session lifetime: 1-30 days
   - Active sessions per user: 1-3

### 10.2 Implicit Assumptions

1. Trust boundary includes file system (no disk encryption required at this layer)
2. System clock is reasonably accurate (±5 minutes)
3. Process crashes are rare but possible
4. Users understand that deletion is permanent after compaction
5. Single user per session (no multi-user sessions)

### 10.3 Assumption Validation

**Required Information** (not provided in requirements):
- Target programming language/runtime
- Expected number of concurrent sessions
- Network file system support needed?
- Backup/restore requirements
- Migration strategy for format changes
- Authentication/authorization requirements

---

## 11. Known Limitations

### 11.1 Design Limitations

1. **Scalability**:
   - Single-machine only (no distributed support)
   - Linear scan for full-text search (no inverted index for content)
   - 10MB hard limit may be restrictive for long-running sessions

2. **Concurrency**:
   - File-based locking has overhead
   - Not suitable for high-concurrency scenarios (>10 agents/session)
   - Lock timeout may cause failures under heavy load

3. **Query Capabilities**:
   - No complex SQL-like queries
   - Limited aggregation capabilities
   - No fuzzy matching or similarity search

4. **Recovery**:
   - No automatic backup
   - Corruption recovery is best-effort
   - No transaction support (write is atomic, multi-write is not)

### 11.2 Future Enhancements

**Possible Improvements**:

1. **Advanced Search**:
   - Full-text search with inverted index
   - Vector embeddings for semantic search
   - Similarity-based memory retrieval

2. **Compression**:
   - Automatic compression of older entries
   - Configurable compression algorithms
   - Transparent decompression on read

3. **Sharding**:
   - Split large sessions across multiple files
   - Improve performance for very large sessions

4. **Replication**:
   - Master-slave replication for backup
   - Sync to cloud storage (optional)

5. **Advanced Decay**:
   - Importance boosting based on access frequency
   - Context-aware decay (related memories decay together)
   - User-configurable importance adjustment

6. **Analytics**:
   - Memory usage patterns
   - Topic trend analysis
   - Decision impact tracking

---

## 12. Implementation Roadmap

### Phase 1: Core Foundation (Week 1-2)
- [ ] Storage engine with JSONL read/write
- [ ] Basic memory entry schema
- [ ] Session metadata management
- [ ] File-based locking mechanism
- [ ] Size limit enforcement

### Phase 2: Querying (Week 3)
- [ ] Index builder and updater
- [ ] Tag-based search
- [ ] Type-based search
- [ ] Time-range queries
- [ ] Basic relevance scoring

### Phase 3: Decay System (Week 4)
- [ ] Decay calculation engine
- [ ] Configurable decay rates
- [ ] Periodic decay updates
- [ ] Type-specific decay policies

### Phase 4: Privacy & Maintenance (Week 5)
- [ ] Memory deletion (single, bulk)
- [ ] Tombstone system
- [ ] Session compaction
- [ ] Export functionality

### Phase 5: Reliability (Week 6)
- [ ] Checksum validation
- [ ] Corruption recovery
- [ ] Retry logic
- [ ] Error handling

### Phase 6: Testing & Documentation (Week 7-8)
- [ ] Unit test suite
- [ ] Integration tests
- [ ] Performance benchmarks
- [ ] API documentation
- [ ] Usage examples

---

## 13. Conflict Resolutions

### 13.1 Identified Conflicts

**Conflict 1: Human-Readable vs. Query Performance**
- **Requirement**: Human-readable format (JSONL) vs. Fast queries
- **Resolution**: Use JSONL for storage with separate binary index for performance
- **Trade-off**: Adds complexity (index maintenance) but satisfies both requirements

**Conflict 2: Concurrent Access vs. Offline Operation**
- **Requirement**: Handle concurrent access vs. No external database
- **Resolution**: File-based locking with advisory locks
- **Trade-off**: Less robust than database locks, but maintains offline capability

**Conflict 3: Memory Decay vs. User Preferences**
- **Requirement**: Memory decay vs. Store user preferences
- **Resolution**: Preferences are exempt from decay (decay_factor = 1.0)
- **Trade-off**: Preferences may accumulate; rely on explicit deletion

**Conflict 4: Size Limit vs. Rich Context**
- **Requirement**: 10MB limit vs. Store comprehensive history
- **Resolution**: Automatic compaction removes low-relevance entries
- **Trade-off**: May lose potentially useful information; configurable thresholds help

---

## 14. Security Considerations

### 14.1 Data Protection

**File Permissions**:
- Session directories: 700 (rwx------)
- Memory files: 600 (rw-------)
- Lock files: 644 (rw-r--r--)

**Sensitive Data**:
- No encryption at rest (assumption: file system provides this)
- Sensitive content should be tagged for easy deletion
- Consider adding content redaction API for debugging

### 14.2 Input Validation

**Validation Rules**:
- Session ID: alphanumeric + underscore, max 64 chars
- Memory ID: alphanumeric + underscore, max 32 chars
- Content size: max 1MB per entry
- Tag names: alphanumeric + hyphen, max 32 chars
- Timestamps: valid ISO 8601 format

### 14.3 Injection Protection

**JSONL Injection**:
- Escape newlines in content: `\n` → `\\n`
- Validate JSON before writing
- Sanitize user-provided tags and content

**Path Traversal**:
- Validate session IDs (no `..`, `/`, `\`)
- Use path.join() for safe path construction
- Reject absolute paths in user input

---

## 15. Monitoring & Observability

### 15.1 Metrics

**Key Metrics**:
- `memory.sessions.active`: Number of active sessions
- `memory.entries.total`: Total memory entries
- `memory.size.bytes`: Total storage used
- `memory.operations.write.duration_ms`: Write latency
- `memory.operations.query.duration_ms`: Query latency
- `memory.locks.contention.count`: Lock failures
- `memory.compaction.count`: Number of compactions
- `memory.errors.corruption.count`: Corruption errors

### 15.2 Logging

**Log Levels**:
- `DEBUG`: Lock acquisition/release, cache hits/misses
- `INFO`: Session lifecycle, compaction start/end
- `WARN`: Lock timeout, approaching size limit
- `ERROR`: Corruption detected, I/O failures

**Log Format** (JSON):
```json
{
  "timestamp": "2026-01-10T14:30:00.000Z",
  "level": "INFO",
  "component": "MemoryManager",
  "session_id": "sess_001",
  "message": "Session compaction completed",
  "metadata": {
    "entries_before": 5000,
    "entries_after": 3200,
    "size_reduction_mb": 2.3,
    "duration_ms": 847
  }
}
```

---

## 16. Migration & Versioning

### 16.1 Schema Versioning

**Version in Files**:
- Each file includes version field
- Memory entries: `"schema_version": 1`
- Metadata: `"version": 1`
- Index: `"version": 1`

**Version Compatibility**:
- Code supports reading previous version
- Automatic migration on read/write
- Write always uses latest version

### 16.2 Migration Strategy

**Example Migration (v1 → v2)**:
```typescript
function migrateMemoryEntry(entry: any, fromVersion: number): MemoryEntry {
  if (fromVersion === 1 && CURRENT_VERSION === 2) {
    // Add new field with default value
    return {
      ...entry,
      schema_version: 2,
      access_count: 0 // New field in v2
    };
  }
  return entry;
}
```

**Migration Trigger**:
- Lazy migration: on first write to session
- Optional: batch migration tool for all sessions
- Metadata tracks migration status

---

## 17. Example Implementation Pseudocode

### 17.1 Core Storage Operations

```typescript
class StorageEngine {
  private lockFile(sessionId: string, operation: 'read' | 'write'): Lock {
    const lockPath = this.getLockPath(sessionId);
    const timeout = Date.now() + this.config.lock_timeout_ms;

    while (Date.now() < timeout) {
      try {
        // Attempt atomic lock creation
        const lock = {
          pid: process.pid,
          timestamp: new Date().toISOString(),
          operation,
          expires_at: new Date(Date.now() + 5000).toISOString()
        };

        // Atomic write with exclusive creation flag
        fs.writeFileSync(lockPath, JSON.stringify(lock), { flag: 'wx' });
        return lock;
      } catch (error) {
        if (error.code === 'EEXIST') {
          // Lock exists, check if stale
          const existingLock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
          if (new Date(existingLock.expires_at) < new Date()) {
            // Stale lock, remove and retry
            fs.unlinkSync(lockPath);
            continue;
          }
          // Active lock, wait
          await this.sleep(100);
        } else {
          throw error;
        }
      }
    }

    throw new ConcurrencyError('Lock timeout');
  }

  appendMemory(sessionId: string, entry: MemoryEntry): void {
    const lock = this.lockFile(sessionId, 'write');
    try {
      // Check size limit
      const currentSize = this.getSessionSize(sessionId);
      const entrySize = JSON.stringify(entry).length;

      if (currentSize + entrySize > this.config.max_session_size_bytes) {
        throw new SizeLimitError('Session size limit exceeded');
      }

      // Append to JSONL file
      const memoryPath = this.getMemoryPath(sessionId);
      fs.appendFileSync(memoryPath, JSON.stringify(entry) + '\n', 'utf8');

      // Update index
      this.updateIndex(sessionId, entry);

    } finally {
      this.unlockFile(sessionId, lock);
    }
  }

  readMemory(sessionId: string, memoryId: string): MemoryEntry | null {
    const lock = this.lockFile(sessionId, 'read');
    try {
      // Get byte offset from index
      const index = this.loadIndex(sessionId);
      const indexEntry = index.entries[memoryId];

      if (!indexEntry) {
        return null;
      }

      // Direct read from byte offset
      const memoryPath = this.getMemoryPath(sessionId);
      const fd = fs.openSync(memoryPath, 'r');

      // Read line at offset
      const buffer = Buffer.alloc(10240); // 10KB max per entry
      fs.readSync(fd, buffer, 0, buffer.length, indexEntry.byte_offset);
      fs.closeSync(fd);

      const line = buffer.toString('utf8').split('\n')[0];
      const entry = JSON.parse(line);

      // Verify checksum
      if (this.config.integrity.enable_checksums) {
        const expectedChecksum = entry.checksum;
        const actualChecksum = this.calculateChecksum(entry);

        if (expectedChecksum !== actualChecksum) {
          throw new CorruptionError(`Checksum mismatch for ${memoryId}`);
        }
      }

      return entry;

    } finally {
      this.unlockFile(sessionId, lock);
    }
  }
}
```

### 17.2 Query Engine Implementation

```typescript
class QueryEngine {
  searchByTopic(sessionId: string, topic: string): MemoryEntry[] {
    const index = this.storageEngine.loadIndex(sessionId);
    const memoryIds = index.tags[topic] || [];

    // Load memories and apply decay
    const memories = memoryIds
      .map(id => this.storageEngine.readMemory(sessionId, id))
      .filter(m => m !== null);

    // Calculate current relevance with decay
    const now = new Date();
    const withRelevance = memories.map(memory => ({
      memory,
      relevance: this.calculateRelevance(memory, now)
    }));

    // Sort by relevance
    withRelevance.sort((a, b) => b.relevance - a.relevance);

    return withRelevance.map(item => item.memory);
  }

  private calculateRelevance(entry: MemoryEntry, currentTime: Date): number {
    // Apply decay
    const decayFactor = this.decayEngine.calculateDecayFactor(entry, currentTime);

    // Calculate recency boost (last access)
    const hoursSinceCreation = (currentTime.getTime() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60);
    const recencyBoost = hoursSinceCreation < 24 ? 1.5 : 1.0;

    // Combine scores
    return entry.importance * decayFactor * recencyBoost;
  }
}
```

### 17.3 Compaction Implementation

```typescript
class CompactionEngine {
  compactSession(sessionId: string): void {
    const lock = this.storageEngine.lockFile(sessionId, 'write');
    try {
      // Load all entries
      const entries = this.loadAllEntries(sessionId);

      // Load tombstones
      const tombstones = this.loadTombstones(sessionId);
      const tombstoneIds = new Set(tombstones.map(t => t.id));

      // Filter out deleted and low-relevance entries
      const now = new Date();
      const retained = entries.filter(entry => {
        if (tombstoneIds.has(entry.id)) {
          return false;
        }

        const relevance = this.queryEngine.calculateRelevance(entry, now);
        return relevance >= this.config.compaction_threshold;
      });

      // Write to temporary file
      const tempPath = this.getMemoryPath(sessionId) + '.tmp';
      const fd = fs.openSync(tempPath, 'w');

      retained.forEach(entry => {
        fs.writeSync(fd, JSON.stringify(entry) + '\n');
      });

      fs.closeSync(fd);

      // Atomic rename
      const memoryPath = this.getMemoryPath(sessionId);
      fs.renameSync(tempPath, memoryPath);

      // Rebuild index
      this.rebuildIndex(sessionId, retained);

      // Clear tombstones
      const tombstonePath = this.getTombstonePath(sessionId);
      fs.writeFileSync(tombstonePath, '', 'utf8');

      // Update metadata
      this.updateMetadata(sessionId, {
        total_entries: retained.length,
        total_size_bytes: this.getSessionSize(sessionId),
        last_compaction: now.toISOString()
      });

    } finally {
      this.storageEngine.unlockFile(sessionId, lock);
    }
  }
}
```

---

## 18. Summary

This memory persistence layer design provides a comprehensive solution for agent context retention across sessions. The architecture balances competing requirements through careful trade-offs:

**Key Strengths**:
- Human-readable JSONL format for debugging
- Robust concurrency control via file locking
- Flexible query system with relevance ranking
- Intelligent memory decay for information recency
- Strong privacy controls with selective deletion
- Zero external dependencies (offline-capable)
- Configurable size limits with automatic compaction

**Design Principles**:
- Simplicity: JSONL over complex binary formats
- Reliability: Checksums, atomic operations, corruption recovery
- Performance: Indexing, caching, lazy evaluation
- Privacy: User control over data retention
- Extensibility: Versioned schemas, pluggable components

**Validation Checklist**:
- ✓ Conversation history stored
- ✓ Decisions tracked with context
- ✓ Findings retained and queryable
- ✓ User preferences persisted
- ✓ Human-readable format (JSONL)
- ✓ Concurrent access supported (file locking)
- ✓ Queryable by topic, type, time
- ✓ Memory decay implemented (exponential)
- ✓ Privacy controls (selective deletion)
- ✓ Offline operation (no external DB)
- ✓ 10MB size limit enforced

This design is production-ready for implementation, with clear interfaces, detailed algorithms, and comprehensive error handling. The modular architecture allows for incremental development and future enhancements without major refactoring.

---

## Appendix A: Glossary

- **JSONL**: JSON Lines format, one JSON object per line
- **Decay Factor**: Multiplier applied to importance based on age
- **Half-Life**: Time for decay factor to reach 0.5
- **Tombstone**: Marker for deleted entry (soft delete)
- **Compaction**: Process of removing deleted/irrelevant entries
- **Relevance**: Combined score of importance, decay, and recency
- **Session**: Isolated memory space for single agent-user interaction
- **Advisory Lock**: Cooperative locking mechanism (not enforced by OS)

---

## Appendix B: References

### Standards
- **JSON**: RFC 8259
- **ISO 8601**: Date and time format
- **UTF-8**: Unicode encoding standard

### Inspirations
- Redis persistence mechanisms (AOF)
- Git object storage (content-addressed)
- Lucene inverted indices
- LRU cache eviction policies
- GDPR right to erasure

---

**Document End**
