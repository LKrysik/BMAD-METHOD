# Session Memory Persistence Architecture

## Document Metadata
- **Version**: 1.0.0
- **Date**: 2026-01-11
- **Status**: Architecture Specification
- **Task**: Task 3 - Session Memory Persistence

---

## 1. Overview

### 1.1 Purpose

Design a lightweight, offline-first memory persistence layer enabling agents to maintain context across sessions without external database dependencies.

### 1.2 Problem Statement

Agents lose conversational context, decision history, and learned preferences between sessions, forcing users to re-explain requirements and reducing collaboration effectiveness.

### 1.3 Goals

- Store conversation history, decisions, findings, and user preferences
- Human-readable format for debugging and manual inspection
- Support concurrent multi-agent access
- Enable semantic querying of past context
- Implement memory decay for relevance-based prioritization
- Privacy-compliant with selective memory deletion
- Offline operation with 10MB per-session maximum

---

## 2. Architecture Design

### 2.1 Storage Model

**File-based JSONL (JSON Lines) storage** provides simplicity, human readability, and efficient append operations.

```
{project-root}/.bmad/memory/
├── sessions/
│   ├── {session-id}/
│   │   ├── manifest.json          # Session metadata and index
│   │   ├── conversation.jsonl     # Chronological message log
│   │   ├── decisions.jsonl        # Decision records
│   │   ├── findings.jsonl         # Analysis findings
│   │   ├── preferences.jsonl      # User preferences
│   │   └── index.json             # Fast lookup index
│   └── {session-id-2}/
│       └── ...
├── shared/
│   ├── user-preferences.json      # Cross-session preferences
│   └── agent-knowledge.json       # Shared agent learnings
└── config.json                    # Memory system configuration
```

### 2.2 Core Components

```
+-----------------------------------------------------------------------+
|                    Session Memory Architecture                         |
+-----------------------------------------------------------------------+
|                                                                        |
|  +---------------------------+    +-----------------------------+     |
|  |  Memory Manager           |    |  Query Engine               |     |
|  |  - Session lifecycle      |    |  - Semantic search          |     |
|  |  - Write coordination     |    |  - Time-based filtering     |     |
|  |  - Size enforcement       |    |  - Relevance scoring        |     |
|  +----------+----------------+    +-------------+---------------+     |
|             |                                   |                     |
|             v                                   v                     |
|  +---------------------------+    +-----------------------------+     |
|  |  Persistence Layer        |    |  Index Manager              |     |
|  |  - JSONL append           |    |  - In-memory cache          |     |
|  |  - Atomic writes          |    |  - Inverted index           |     |
|  |  - File rotation          |    |  - Decay tracking           |     |
|  +----------+----------------+    +-------------+---------------+     |
|             |                                   |                     |
|             v                                   v                     |
|  +-----------------------------------------------------------+        |
|  |  File System (.bmad/memory/)                              |        |
|  |  - JSONL conversation logs                                |        |
|  |  - Index files for fast lookup                            |        |
|  |  - Lock files for concurrency                             |        |
|  +-----------------------------------------------------------+        |
|                                                                        |
+-----------------------------------------------------------------------+
```

---

## 3. Data Structures

### 3.1 Session Manifest

```json
{
  "session_id": "sess-2026-01-11-abc123",
  "created_at": "2026-01-11T10:00:00Z",
  "updated_at": "2026-01-11T14:30:00Z",
  "user_id": "user-789",
  "agent_ids": ["bmad-master", "architect", "analyst"],
  "metadata": {
    "project_name": "payment-system",
    "session_type": "architecture_review",
    "tags": ["architecture", "payments", "scalability"]
  },
  "statistics": {
    "total_messages": 127,
    "total_decisions": 8,
    "total_findings": 15,
    "size_bytes": 245678,
    "last_accessed": "2026-01-11T14:30:00Z"
  },
  "version": "1.0"
}
```

### 3.2 Conversation Entry

```json
{
  "id": "msg-001",
  "timestamp": "2026-01-11T10:05:23Z",
  "agent_id": "architect",
  "role": "assistant",
  "content": "Based on the requirements, I recommend PostgreSQL for ACID compliance.",
  "context": {
    "conversation_id": "conv-xyz",
    "parent_message_id": "msg-000",
    "topic": "database_selection"
  },
  "metadata": {
    "tokens": 15,
    "processing_time_ms": 230,
    "references": ["dec-001", "finding-003"]
  },
  "decay_factor": 1.0
}
```

### 3.3 Decision Record

```json
{
  "id": "dec-001",
  "timestamp": "2026-01-11T10:10:00Z",
  "made_by": "architect",
  "approved_by": ["user-789"],
  "decision": "Use PostgreSQL for primary database",
  "rationale": "ACID compliance required for financial transactions, proven scalability to 10K TPS",
  "alternatives_considered": [
    {"option": "MongoDB", "rejected_reason": "Eventual consistency risk"},
    {"option": "MySQL", "rejected_reason": "Licensing concerns"}
  ],
  "impact": "high",
  "tags": ["database", "architecture", "critical"],
  "references": {
    "conversations": ["msg-001", "msg-002"],
    "findings": ["finding-003"]
  },
  "decay_factor": 1.0
}
```

### 3.4 Finding Record

```json
{
  "id": "finding-003",
  "timestamp": "2026-01-11T10:08:15Z",
  "discovered_by": "analyst",
  "category": "scalability",
  "severity": "high",
  "description": "Database connection pooling not configured",
  "evidence": "Connection pool config missing from application.yml",
  "recommendation": "Implement HikariCP with max 50 connections",
  "status": "open",
  "tags": ["performance", "database", "configuration"],
  "decay_factor": 1.0
}
```

### 3.5 User Preference

```json
{
  "id": "pref-001",
  "timestamp": "2026-01-11T10:00:00Z",
  "category": "communication",
  "key": "response_style",
  "value": "concise_with_examples",
  "context": "User prefers brief explanations followed by code examples",
  "confidence": 0.9,
  "learned_from": ["sess-2026-01-10-xyz", "sess-2026-01-11-abc"],
  "decay_factor": 1.0
}
```

### 3.6 Search Index

```json
{
  "session_id": "sess-2026-01-11-abc123",
  "created_at": "2026-01-11T14:30:00Z",
  "inverted_index": {
    "database": ["msg-001", "msg-002", "dec-001", "finding-003"],
    "postgresql": ["msg-001", "dec-001"],
    "scalability": ["finding-003", "msg-005"],
    "architecture": ["dec-001", "msg-001", "msg-003"]
  },
  "topic_index": {
    "database_selection": ["msg-001", "msg-002", "dec-001"],
    "performance_optimization": ["finding-003", "msg-005"]
  },
  "temporal_index": {
    "2026-01-11T10": ["msg-001", "msg-002", "dec-001"],
    "2026-01-11T11": ["msg-005", "finding-003"]
  },
  "version": 1
}
```

---

## 4. Storage Implementation

### 4.1 Write Operations

**Append-Only JSONL Pattern:**
```javascript
// Pseudo-code for memory write
function writeMemory(sessionId, type, entry) {
  const session = acquireSession(sessionId);
  const lock = acquireLock(session, 'write');

  try {
    // 1. Check size limit
    if (session.size + entry.size > MAX_SIZE_10MB) {
      triggerMemoryCompaction(session);
    }

    // 2. Apply decay to existing entries
    updateDecayFactors(session);

    // 3. Append to JSONL file
    const file = `${session.path}/${type}.jsonl`;
    appendLine(file, JSON.stringify(entry));

    // 4. Update index
    updateIndex(session, type, entry);

    // 5. Update manifest
    updateManifest(session, {
      updated_at: now(),
      statistics: calculateStats(session)
    });

    // 6. Commit
    fsync(file);

  } finally {
    releaseLock(lock);
  }
}
```

**Atomic Writes:**
- Write to temporary file: `conversation.jsonl.tmp`
- fsync for durability
- Atomic rename: `conversation.jsonl.tmp` → `conversation.jsonl`
- Lock-free reads during write

### 4.2 Concurrency Control

**File-based Locking:**
```
{session-id}/
├── conversation.jsonl
├── conversation.jsonl.lock  # Lock file for write coordination
└── index.json
```

**Lock Protocol:**
```javascript
function acquireLock(session, mode) {
  const lockFile = `${session.path}/.lock`;
  const timeout = 5000; // 5 seconds
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      // Exclusive lock for write, shared for read
      const fd = fs.openSync(lockFile,
        mode === 'write' ? 'wx' : 'r');

      // Write PID and timestamp for debugging
      if (mode === 'write') {
        fs.writeSync(fd, JSON.stringify({
          pid: process.pid,
          agent_id: currentAgentId,
          acquired_at: new Date().toISOString()
        }));
      }

      return { fd, file: lockFile };

    } catch (err) {
      if (err.code === 'EEXIST') {
        // Lock held by another process
        await sleep(100); // Wait 100ms and retry
        continue;
      }
      throw err;
    }
  }

  throw new Error(`Lock acquisition timeout for ${session.id}`);
}

function releaseLock(lock) {
  fs.closeSync(lock.fd);
  fs.unlinkSync(lock.file);
}
```

### 4.3 Size Management

**Compaction Strategy:**
```javascript
function triggerMemoryCompaction(session) {
  // 1. Calculate decay scores for all entries
  const entries = readAllEntries(session);
  const scored = entries.map(e => ({
    ...e,
    relevance: calculateRelevance(e)
  }));

  // 2. Sort by relevance (decay * recency * importance)
  scored.sort((a, b) => b.relevance - a.relevance);

  // 3. Keep top 80% by relevance, remove bottom 20%
  const keepThreshold = Math.floor(scored.length * 0.8);
  const toKeep = scored.slice(0, keepThreshold);

  // 4. Rewrite files with compacted data
  rewriteCompacted(session, toKeep);

  // 5. Update index
  rebuildIndex(session);

  // 6. Log compaction
  logCompaction(session, {
    before_size: session.size,
    after_size: calculateSize(toKeep),
    removed_count: scored.length - keepThreshold
  });
}
```

---

## 5. Query Interface

### 5.1 Query API

```javascript
// Query memory with semantic search and filters
const query = {
  // Text search
  text: "database scalability",

  // Type filtering
  types: ["decisions", "findings"],

  // Time range
  time_range: {
    start: "2026-01-10T00:00:00Z",
    end: "2026-01-11T23:59:59Z"
  },

  // Tags
  tags: ["database", "architecture"],

  // Agent filter
  agents: ["architect", "analyst"],

  // Relevance threshold (0-1)
  min_relevance: 0.5,

  // Result limit
  limit: 20,

  // Sort order
  sort: "relevance_desc" // relevance_desc | time_desc | time_asc
};

const results = await memoryManager.query(sessionId, query);
```

### 5.2 Query Processing

```javascript
function queryMemory(sessionId, query) {
  const session = loadSession(sessionId);
  const index = loadIndex(session);

  // 1. Extract search terms
  const terms = tokenize(query.text);

  // 2. Lookup in inverted index
  let candidateIds = new Set();
  for (const term of terms) {
    const ids = index.inverted_index[term] || [];
    ids.forEach(id => candidateIds.add(id));
  }

  // 3. Load candidate entries
  const candidates = loadEntries(session, Array.from(candidateIds));

  // 4. Apply filters
  let filtered = candidates.filter(entry => {
    // Type filter
    if (query.types && !query.types.includes(entry.type)) {
      return false;
    }

    // Time range filter
    if (query.time_range) {
      const ts = new Date(entry.timestamp);
      if (ts < new Date(query.time_range.start) ||
          ts > new Date(query.time_range.end)) {
        return false;
      }
    }

    // Tag filter
    if (query.tags && query.tags.length > 0) {
      const hasTag = query.tags.some(tag =>
        entry.tags && entry.tags.includes(tag));
      if (!hasTag) return false;
    }

    // Agent filter
    if (query.agents && !query.agents.includes(entry.agent_id)) {
      return false;
    }

    return true;
  });

  // 5. Calculate relevance scores
  const scored = filtered.map(entry => ({
    ...entry,
    relevance: calculateRelevance(entry, query, terms)
  }));

  // 6. Filter by minimum relevance
  const relevant = scored.filter(e =>
    e.relevance >= (query.min_relevance || 0));

  // 7. Sort
  relevant.sort((a, b) => {
    if (query.sort === 'relevance_desc') {
      return b.relevance - a.relevance;
    } else if (query.sort === 'time_desc') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else {
      return new Date(a.timestamp) - new Date(b.timestamp);
    }
  });

  // 8. Limit results
  return relevant.slice(0, query.limit || 20);
}
```

### 5.3 Relevance Scoring

```javascript
function calculateRelevance(entry, query, searchTerms) {
  const now = Date.now();
  const entryTime = new Date(entry.timestamp).getTime();
  const ageHours = (now - entryTime) / (1000 * 60 * 60);

  // Component 1: Text relevance (TF-IDF-like)
  const textScore = calculateTextScore(entry, searchTerms);

  // Component 2: Temporal decay (exponential)
  const decayRate = 0.1; // Configurable per memory type
  const timeScore = entry.decay_factor * Math.exp(-decayRate * ageHours);

  // Component 3: Importance (based on type and metadata)
  const importanceScore = calculateImportance(entry);

  // Component 4: Access recency (boost recently accessed)
  const accessScore = entry.last_accessed ?
    Math.exp(-0.05 * ((now - new Date(entry.last_accessed).getTime()) / (1000 * 60 * 60))) : 0.5;

  // Weighted combination
  const weights = {
    text: 0.4,
    time: 0.3,
    importance: 0.2,
    access: 0.1
  };

  return (
    weights.text * textScore +
    weights.time * timeScore +
    weights.importance * importanceScore +
    weights.access * accessScore
  );
}

function calculateImportance(entry) {
  const importanceMap = {
    'decision': 1.0,      // Highest importance
    'finding': 0.8,
    'preference': 0.7,
    'conversation': 0.5   // Base importance
  };

  let score = importanceMap[entry.type] || 0.5;

  // Boost for high severity/impact
  if (entry.severity === 'critical' || entry.impact === 'high') {
    score *= 1.3;
  }

  // Boost for user-approved decisions
  if (entry.approved_by && entry.approved_by.length > 0) {
    score *= 1.2;
  }

  return Math.min(score, 1.0);
}
```

---

## 6. Memory Decay

### 6.1 Decay Model

**Exponential decay with boosting for important/accessed memories:**

```
decay_factor(t) = initial_factor * e^(-λt) * boost_multiplier

where:
  t = time since creation (hours)
  λ = decay rate (configurable per memory type)
  boost_multiplier = 1 + (access_count * 0.1) + (importance * 0.2)
```

### 6.2 Decay Parameters

```json
{
  "decay_config": {
    "conversation": {
      "decay_rate": 0.1,
      "half_life_hours": 168
    },
    "decision": {
      "decay_rate": 0.02,
      "half_life_hours": 720
    },
    "finding": {
      "decay_rate": 0.05,
      "half_life_hours": 336
    },
    "preference": {
      "decay_rate": 0.01,
      "half_life_hours": 1440
    }
  },
  "update_interval_hours": 24,
  "minimum_decay_factor": 0.1
}
```

### 6.3 Decay Update Process

```javascript
function updateDecayFactors(session) {
  const now = Date.now();
  const config = loadDecayConfig();

  for (const type of ['conversation', 'decisions', 'findings', 'preferences']) {
    const entries = readEntries(session, type);
    const decayRate = config.decay_config[type].decay_rate;

    const updated = entries.map(entry => {
      const ageHours = (now - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60);

      // Base decay
      const baseDecay = Math.exp(-decayRate * ageHours);

      // Boost factors
      const accessBoost = 1 + (entry.access_count || 0) * 0.1;
      const importanceBoost = 1 + calculateImportance(entry) * 0.2;

      // Combined decay factor
      const newDecay = Math.max(
        baseDecay * accessBoost * importanceBoost,
        config.minimum_decay_factor
      );

      return {
        ...entry,
        decay_factor: newDecay,
        last_decay_update: now
      };
    });

    // Rewrite file with updated decay factors
    rewriteEntries(session, type, updated);
  }
}
```

---

## 7. Privacy and Deletion

### 7.1 Selective Deletion API

```javascript
// Delete specific memories by ID
await memoryManager.delete(sessionId, {
  ids: ["msg-001", "dec-002", "finding-005"]
});

// Delete by criteria
await memoryManager.delete(sessionId, {
  types: ["conversation"],
  time_range: {
    start: "2026-01-10T00:00:00Z",
    end: "2026-01-10T23:59:59Z"
  },
  tags: ["sensitive"]
});

// Delete entire session
await memoryManager.deleteSession(sessionId);
```

### 7.2 Deletion Implementation

```javascript
function deleteMemories(sessionId, criteria) {
  const session = acquireSession(sessionId);
  const lock = acquireLock(session, 'write');

  try {
    // 1. Load all entries
    const allEntries = readAllEntries(session);

    // 2. Filter to keep (inverse of deletion criteria)
    const toKeep = allEntries.filter(entry => {
      // Match by ID
      if (criteria.ids && criteria.ids.includes(entry.id)) {
        return false;
      }

      // Match by type
      if (criteria.types && criteria.types.includes(entry.type)) {
        // Check additional criteria
        if (matchesCriteria(entry, criteria)) {
          return false;
        }
      }

      return true;
    });

    // 3. Rewrite all files
    rewriteAllEntries(session, toKeep);

    // 4. Rebuild index
    rebuildIndex(session);

    // 5. Update manifest
    updateManifest(session, {
      updated_at: now(),
      statistics: calculateStats(session)
    });

    // 6. Log deletion (for audit)
    logDeletion(session, {
      deleted_count: allEntries.length - toKeep.length,
      criteria: criteria,
      deleted_at: now()
    });

  } finally {
    releaseLock(lock);
  }
}
```

### 7.3 Privacy Safeguards

```javascript
{
  "privacy_config": {
    "auto_redaction": {
      "enabled": true,
      "patterns": [
        {"type": "email", "regex": "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"},
        {"type": "api_key", "regex": "\\b[A-Za-z0-9]{32,}\\b"},
        {"type": "password", "regex": "password[\\s:=]+[^\\s]+"}
      ],
      "replacement": "[REDACTED]"
    },
    "retention_limits": {
      "conversation_days": 90,
      "decisions_days": 365,
      "findings_days": 180,
      "preferences_days": 730
    },
    "auto_purge": {
      "enabled": true,
      "schedule_cron": "0 2 * * 0"
    }
  }
}
```

---

## 8. Lifecycle Management

### 8.1 Session Lifecycle

```
CREATE → ACTIVE → IDLE → ARCHIVED → DELETED
   |        |       |        |
   |        |       |        +-- Auto-purge after retention period
   |        |       +-- Archive after 30 days inactivity
   |        +-- Active use
   +-- New session creation
```

### 8.2 Session Creation

```javascript
async function createSession(params) {
  const sessionId = `sess-${new Date().toISOString().split('T')[0]}-${generateId()}`;
  const sessionPath = `${MEMORY_ROOT}/sessions/${sessionId}`;

  // 1. Create directory
  await fs.mkdir(sessionPath, { recursive: true });

  // 2. Initialize manifest
  const manifest = {
    session_id: sessionId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: params.user_id,
    agent_ids: params.agent_ids || [],
    metadata: params.metadata || {},
    statistics: {
      total_messages: 0,
      total_decisions: 0,
      total_findings: 0,
      size_bytes: 0,
      last_accessed: new Date().toISOString()
    },
    version: "1.0"
  };

  await writeJson(`${sessionPath}/manifest.json`, manifest);

  // 3. Initialize empty JSONL files
  await touch(`${sessionPath}/conversation.jsonl`);
  await touch(`${sessionPath}/decisions.jsonl`);
  await touch(`${sessionPath}/findings.jsonl`);
  await touch(`${sessionPath}/preferences.jsonl`);

  // 4. Initialize index
  const index = {
    session_id: sessionId,
    created_at: new Date().toISOString(),
    inverted_index: {},
    topic_index: {},
    temporal_index: {},
    version: 1
  };

  await writeJson(`${sessionPath}/index.json`, index);

  return sessionId;
}
```

### 8.3 Session Archival

```javascript
async function archiveSession(sessionId) {
  const session = loadSession(sessionId);

  // 1. Compress session data
  const archivePath = `${MEMORY_ROOT}/archive/${sessionId}.tar.gz`;
  await compress(session.path, archivePath);

  // 2. Create archive manifest
  const archiveManifest = {
    ...session.manifest,
    archived_at: new Date().toISOString(),
    original_size_bytes: session.statistics.size_bytes,
    compressed_size_bytes: await getFileSize(archivePath)
  };

  await writeJson(`${MEMORY_ROOT}/archive/${sessionId}.manifest.json`, archiveManifest);

  // 3. Remove active session
  await fs.rm(session.path, { recursive: true });

  // 4. Update global index
  updateGlobalIndex('archived', sessionId);
}
```

---

## 9. Configuration

### 9.1 Memory System Configuration

```json
{
  "memory_config": {
    "version": "1.0",
    "storage": {
      "root_path": ".bmad/memory",
      "format": "jsonl",
      "encoding": "utf-8",
      "max_session_size_mb": 10,
      "compression": {
        "enabled": false,
        "algorithm": "gzip"
      }
    },
    "concurrency": {
      "lock_timeout_ms": 5000,
      "lock_retry_interval_ms": 100,
      "max_concurrent_writes": 10
    },
    "indexing": {
      "enabled": true,
      "update_strategy": "incremental",
      "rebuild_threshold_writes": 1000,
      "cache_size_mb": 5
    },
    "decay": {
      "enabled": true,
      "update_interval_hours": 24,
      "minimum_factor": 0.1,
      "rates": {
        "conversation": 0.1,
        "decision": 0.02,
        "finding": 0.05,
        "preference": 0.01
      }
    },
    "compaction": {
      "enabled": true,
      "trigger_threshold_mb": 9,
      "keep_percentage": 0.8,
      "strategy": "relevance_based"
    },
    "privacy": {
      "auto_redaction": true,
      "retention_days": {
        "conversation": 90,
        "decision": 365,
        "finding": 180,
        "preference": 730
      },
      "auto_purge": true,
      "audit_deletions": true
    },
    "performance": {
      "batch_write_size": 100,
      "index_cache_ttl_seconds": 300,
      "lazy_load": true
    }
  }
}
```

---

## 10. API Specification

### 10.1 Memory Manager Interface

```typescript
interface MemoryManager {
  // Session management
  createSession(params: SessionParams): Promise<SessionId>;
  loadSession(sessionId: SessionId): Promise<Session>;
  deleteSession(sessionId: SessionId): Promise<void>;
  archiveSession(sessionId: SessionId): Promise<void>;

  // Write operations
  addConversation(sessionId: SessionId, message: ConversationEntry): Promise<void>;
  addDecision(sessionId: SessionId, decision: DecisionRecord): Promise<void>;
  addFinding(sessionId: SessionId, finding: FindingRecord): Promise<void>;
  updatePreference(sessionId: SessionId, preference: UserPreference): Promise<void>;

  // Query operations
  query(sessionId: SessionId, query: MemoryQuery): Promise<MemoryEntry[]>;
  getDecisions(sessionId: SessionId, filters?: DecisionFilters): Promise<DecisionRecord[]>;
  getFindings(sessionId: SessionId, filters?: FindingFilters): Promise<FindingRecord[]>;
  getPreferences(sessionId: SessionId): Promise<UserPreference[]>;

  // Deletion operations
  delete(sessionId: SessionId, criteria: DeletionCriteria): Promise<DeletionResult>;

  // Maintenance operations
  compactSession(sessionId: SessionId): Promise<CompactionResult>;
  rebuildIndex(sessionId: SessionId): Promise<void>;
  updateDecayFactors(sessionId: SessionId): Promise<void>;

  // Statistics
  getStatistics(sessionId: SessionId): Promise<SessionStatistics>;
  getGlobalStatistics(): Promise<GlobalStatistics>;
}
```

### 10.2 Example Usage

```javascript
// Initialize memory manager
const memoryManager = new MemoryManager({
  rootPath: '.bmad/memory',
  config: memoryConfig
});

// Create new session
const sessionId = await memoryManager.createSession({
  user_id: 'user-789',
  agent_ids: ['bmad-master', 'architect'],
  metadata: {
    project_name: 'payment-system',
    session_type: 'architecture_review'
  }
});

// Add conversation entry
await memoryManager.addConversation(sessionId, {
  agent_id: 'architect',
  role: 'assistant',
  content: 'I recommend PostgreSQL for ACID compliance.',
  context: {
    conversation_id: 'conv-xyz',
    topic: 'database_selection'
  }
});

// Record decision
await memoryManager.addDecision(sessionId, {
  made_by: 'architect',
  decision: 'Use PostgreSQL for primary database',
  rationale: 'ACID compliance required',
  impact: 'high',
  tags: ['database', 'architecture']
});

// Query memory
const results = await memoryManager.query(sessionId, {
  text: 'database scalability',
  types: ['decisions', 'findings'],
  min_relevance: 0.5,
  limit: 10
});

// Delete sensitive memories
await memoryManager.delete(sessionId, {
  tags: ['sensitive'],
  types: ['conversation']
});
```

---

## 11. Performance Characteristics

### 11.1 Operation Complexity

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|----------------|------------------|-------|
| Write (append) | O(1) | O(1) | Constant time append to JSONL |
| Read entry | O(1) | O(1) | Indexed lookup |
| Query (indexed) | O(k log n) | O(k) | k = result size, n = total entries |
| Query (full scan) | O(n) | O(n) | Worst case without index |
| Compaction | O(n log n) | O(n) | Sort by relevance |
| Index rebuild | O(n) | O(n) | Linear scan |
| Delete | O(n) | O(n) | Rewrite file |

### 11.2 Size Estimates

**Typical entry sizes:**
- Conversation message: 200-500 bytes
- Decision record: 400-800 bytes
- Finding record: 300-600 bytes
- User preference: 150-300 bytes

**10MB limit capacity:**
- ~20,000-50,000 conversation messages
- ~12,000-25,000 decision records
- ~15,000-33,000 finding records

**Index overhead:**
- Inverted index: ~10-15% of data size
- Temporal index: ~5% of data size
- Topic index: ~5% of data size
- Total overhead: ~20-25% of data size

---

## 12. Error Handling

### 12.1 Error Categories

```typescript
enum MemoryErrorCode {
  // Storage errors
  STORAGE_IO_ERROR = 'E_STORAGE_IO',
  STORAGE_FULL = 'E_STORAGE_FULL',
  STORAGE_CORRUPT = 'E_STORAGE_CORRUPT',

  // Concurrency errors
  LOCK_TIMEOUT = 'E_LOCK_TIMEOUT',
  CONCURRENT_MODIFICATION = 'E_CONCURRENT_MOD',

  // Data errors
  INVALID_FORMAT = 'E_INVALID_FORMAT',
  SCHEMA_VALIDATION_FAILED = 'E_SCHEMA_INVALID',
  SIZE_LIMIT_EXCEEDED = 'E_SIZE_LIMIT',

  // Session errors
  SESSION_NOT_FOUND = 'E_SESSION_NOT_FOUND',
  SESSION_ARCHIVED = 'E_SESSION_ARCHIVED',
  SESSION_CORRUPTED = 'E_SESSION_CORRUPT',

  // Query errors
  QUERY_TIMEOUT = 'E_QUERY_TIMEOUT',
  INVALID_QUERY = 'E_INVALID_QUERY'
}
```

### 12.2 Recovery Strategies

```javascript
const errorRecovery = {
  'E_STORAGE_IO': {
    strategy: 'retry',
    max_attempts: 3,
    backoff_ms: [100, 500, 2000]
  },
  'E_STORAGE_CORRUPT': {
    strategy: 'rebuild_from_backup',
    fallback: 'create_new_session'
  },
  'E_LOCK_TIMEOUT': {
    strategy: 'retry_with_backoff',
    max_attempts: 5,
    notify_user: true
  },
  'E_SIZE_LIMIT': {
    strategy: 'auto_compact',
    notify_user: true
  },
  'E_SESSION_ARCHIVED': {
    strategy: 'restore_from_archive',
    auto: true
  }
};
```

---

## 13. Testing Strategy

### 13.1 Unit Tests

```javascript
describe('MemoryManager', () => {
  test('should create new session', async () => {
    const sessionId = await memoryManager.createSession({
      user_id: 'test-user'
    });
    expect(sessionId).toMatch(/^sess-/);
  });

  test('should write and read conversation', async () => {
    const entry = { agent_id: 'test', content: 'test message' };
    await memoryManager.addConversation(sessionId, entry);

    const results = await memoryManager.query(sessionId, {
      text: 'test message'
    });
    expect(results).toHaveLength(1);
  });

  test('should enforce 10MB size limit', async () => {
    // Write until size limit
    const largeEntry = { content: 'x'.repeat(1024 * 1024) }; // 1MB

    for (let i = 0; i < 11; i++) {
      await memoryManager.addConversation(sessionId, largeEntry);
    }

    const stats = await memoryManager.getStatistics(sessionId);
    expect(stats.size_bytes).toBeLessThanOrEqual(10 * 1024 * 1024);
  });
});
```

### 13.2 Concurrency Tests

```javascript
describe('Concurrency', () => {
  test('should handle concurrent writes', async () => {
    const promises = [];

    // Simulate 10 concurrent agents writing
    for (let i = 0; i < 10; i++) {
      promises.push(
        memoryManager.addConversation(sessionId, {
          agent_id: `agent-${i}`,
          content: `message-${i}`
        })
      );
    }

    await Promise.all(promises);

    const stats = await memoryManager.getStatistics(sessionId);
    expect(stats.total_messages).toBe(10);
  });

  test('should prevent race conditions', async () => {
    // Test write-write conflicts
    // Test write-read conflicts
    // Test compaction during writes
  });
});
```

### 13.3 Performance Tests

```javascript
describe('Performance', () => {
  test('write throughput > 100 entries/sec', async () => {
    const start = Date.now();

    for (let i = 0; i < 1000; i++) {
      await memoryManager.addConversation(sessionId, {
        agent_id: 'test',
        content: `message-${i}`
      });
    }

    const elapsed = Date.now() - start;
    const throughput = 1000 / (elapsed / 1000);

    expect(throughput).toBeGreaterThan(100);
  });

  test('query latency < 100ms', async () => {
    const start = Date.now();

    await memoryManager.query(sessionId, {
      text: 'test query',
      limit: 20
    });

    const latency = Date.now() - start;
    expect(latency).toBeLessThan(100);
  });
});
```

---

## 14. Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] File system structure setup
- [ ] JSONL read/write utilities
- [ ] Session manifest management
- [ ] Basic error handling
- [ ] Configuration loader

### Phase 2: Core Operations (Week 2)
- [ ] Memory write operations (conversation, decisions, findings, preferences)
- [ ] File-based locking mechanism
- [ ] Atomic write implementation
- [ ] Size tracking and enforcement
- [ ] Basic query interface

### Phase 3: Indexing (Week 3)
- [ ] Inverted index implementation
- [ ] Temporal index
- [ ] Topic index
- [ ] Index update on write
- [ ] Index rebuild utility

### Phase 4: Query Engine (Week 4)
- [ ] Text search implementation
- [ ] Filter processing
- [ ] Relevance scoring algorithm
- [ ] Result ranking and sorting
- [ ] Query optimization

### Phase 5: Memory Decay (Week 5)
- [ ] Decay factor calculation
- [ ] Periodic decay updates
- [ ] Boost multipliers
- [ ] Decay configuration
- [ ] Background scheduler

### Phase 6: Lifecycle Management (Week 6)
- [ ] Session creation/deletion
- [ ] Compaction implementation
- [ ] Archival system
- [ ] Auto-purge scheduling
- [ ] Session restoration

### Phase 7: Privacy & Security (Week 7)
- [ ] Selective deletion
- [ ] Auto-redaction patterns
- [ ] Retention policy enforcement
- [ ] Deletion audit logging
- [ ] Privacy compliance checks

### Phase 8: Testing & Documentation (Week 8)
- [ ] Unit test suite
- [ ] Concurrency tests
- [ ] Performance benchmarks
- [ ] Integration tests
- [ ] API documentation
- [ ] Usage examples

---

## 15. Assumptions

1. **Single-process per session**: Only one agent process writes to a session at a time per memory type
2. **File system atomicity**: Underlying file system supports atomic rename operations
3. **Clock synchronization**: System clock is reasonably accurate for timestamp ordering
4. **UTF-8 encoding**: All text content is valid UTF-8
5. **Storage availability**: Sufficient disk space for memory storage (monitoring required)
6. **Read-heavy workload**: Queries are more frequent than writes (10:1 ratio)
7. **Session duration**: Most sessions are hours to days, not weeks
8. **Network independence**: No network required for memory operations
9. **Agent cooperation**: Agents respect lock protocol and don't corrupt files
10. **Backup responsibility**: External backup system handles disaster recovery

---

## 16. Future Enhancements

### 16.1 Potential Improvements

1. **Cross-session knowledge graph**: Link related decisions/findings across sessions
2. **Semantic embeddings**: Vector-based similarity search for better query relevance
3. **Incremental snapshots**: Point-in-time recovery without full rewrite
4. **Multi-session queries**: Search across multiple sessions simultaneously
5. **Memory consolidation**: Merge similar memories to reduce redundancy
6. **Machine learning**: Learn optimal decay rates per user/project
7. **Distributed sessions**: Share memory across multiple machines (requires coordination)
8. **Streaming queries**: Real-time query updates as new memories are added

### 16.2 Scalability Considerations

**If session sizes exceed 10MB:**
- Implement tiered storage (hot/warm/cold)
- Use external database for index (SQLite embedded)
- Shard sessions across multiple files
- Implement columnar storage for better compression

**If query performance degrades:**
- Pre-compute common queries
- Add full-text search engine (like Tantivy/Lucene)
- Implement query result caching
- Parallelize query processing

---

## 17. Glossary

| Term | Definition |
|------|------------|
| **Session** | A bounded period of agent-user interaction with isolated memory |
| **Memory Entry** | A single record (conversation, decision, finding, or preference) |
| **Decay Factor** | Numerical weight (0-1) indicating memory relevance over time |
| **Compaction** | Process of removing low-relevance memories to stay under size limit |
| **Inverted Index** | Mapping from terms to memory entries for fast text search |
| **JSONL** | JSON Lines format, one JSON object per line |
| **Temporal Index** | Time-based index for efficient time-range queries |
| **Relevance Score** | Combined metric of text match, recency, and importance |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-11 | Architecture Team | Initial specification |

---

**Document End**

*This architecture provides a simple, offline-first, human-readable memory persistence layer for multi-agent systems. The JSONL-based design ensures debuggability while file-based locking enables concurrent access. Memory decay and compaction keep storage within the 10MB limit while maintaining relevant context across sessions.*
