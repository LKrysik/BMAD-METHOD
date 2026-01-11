# Agent Memory Persistence Layer - Architecture Design Document (Run 1)

## 1. Overview

### 1.1 Purpose
This document describes the architecture for a memory persistence layer that enables AI agents to maintain context across sessions. The system stores conversation history, decisions, findings, and user preferences in a queryable, human-readable format with support for concurrent access, memory decay, and privacy controls.

### 1.2 Design Goals
- **Persistence**: Survive session restarts and system reboots
- **Human Readability**: Debug-friendly storage format
- **Queryability**: Efficient retrieval of past decisions and context
- **Concurrency**: Safe access from multiple agents
- **Privacy**: User control over stored memories
- **Offline Operation**: No external database dependencies
- **Bounded Size**: Maximum 10MB per session

### 1.3 Scope
This design covers the memory subsystem for a single user's agent sessions. Multi-user deployments would require additional isolation layers not covered here.

---

## 2. Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Agent Runtime                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  Memory      │    │   Query      │    │   Lifecycle          │  │
│  │  Writer      │───▶│   Engine     │◀───│   Manager            │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│         │                   │                      │                │
│         ▼                   ▼                      ▼                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Memory Access Layer                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │ Concurrency │  │   Index     │  │   Decay             │  │   │
│  │  │ Controller  │  │   Manager   │  │   Calculator        │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
└──────────────────────────────┼──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Storage Layer (Filesystem)                       │
│                                                                      │
│   ~/.agent-memory/                                                   │
│   ├── sessions/                                                      │
│   │   ├── {session-id}/                                             │
│   │   │   ├── manifest.json           # Session metadata            │
│   │   │   ├── memories/                                             │
│   │   │   │   ├── 2024-01-15_001.jsonl  # Daily memory files       │
│   │   │   │   └── 2024-01-16_002.jsonl                              │
│   │   │   ├── indices/                                              │
│   │   │   │   ├── topics.json          # Topic → memory refs        │
│   │   │   │   ├── decisions.json       # Decision index             │
│   │   │   │   └── temporal.json        # Time-based index           │
│   │   │   └── preferences.json         # User preferences           │
│   │   └── {session-id-2}/                                           │
│   ├── global/                                                        │
│   │   └── user-preferences.json        # Cross-session preferences  │
│   └── locks/                            # Concurrency lock files     │
│       └── {session-id}.lock                                         │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Storage Format Selection

**Chosen Format: JSONL (JSON Lines) with JSON Index Files**

Rationale:
| Requirement | JSONL+JSON | SQLite | Plain JSON | YAML |
|-------------|------------|--------|------------|------|
| Human-readable | ✅ Excellent | ❌ Binary | ✅ Good | ✅ Good |
| Queryable | ✅ Via indices | ✅ Native | ⚠️ Load all | ⚠️ Load all |
| Concurrent access | ✅ Append-only | ⚠️ Locking issues | ❌ Full rewrite | ❌ Full rewrite |
| Offline | ✅ Filesystem | ✅ Embedded | ✅ Filesystem | ✅ Filesystem |
| Streaming writes | ✅ Native | ⚠️ Transactions | ❌ No | ❌ No |
| Size management | ✅ File rotation | ✅ Vacuum | ❌ Single file | ❌ Single file |

---

## 3. Component Details

### 3.1 Memory Entry Schema

```typescript
interface MemoryEntry {
  id: string;
  sessionId: string;
  timestamp: string;
  type: MemoryType;
  category: string;
  tags: string[];
  content: MemoryContent;
  parentId?: string;
  relatedIds: string[];
  importance: number;
  accessCount: number;
  lastAccessedAt: string;
  expiresAt?: string;
  deletable: boolean;
  sensitive: boolean;
  checksum: string;
  version: number;
}

enum MemoryType {
  CONVERSATION = "conversation",
  DECISION = "decision",
  FINDING = "finding",
  PREFERENCE = "preference",
  CONTEXT = "context",
  ERROR = "error"
}
```

### 3.2 Decay Engine

Memory relevance decays over time using an exponential decay function with access-based boosting.

**Default Decay Configuration:**
```json
{
  "enabled": true,
  "halfLifeDays": 30,
  "minimumImportance": 0.1,
  "accessBoostFactor": 0.2,
  "typeWeights": {
    "conversation": 0.5,
    "decision": 1.0,
    "finding": 0.8,
    "preference": 1.0,
    "context": 0.3,
    "error": 0.2
  }
}
```

---

## 4. Interfaces

### 4.1 Core Memory API

```typescript
interface MemoryStore {
  store(entry: Omit<MemoryEntry, 'id' | 'checksum'>): Promise<MemoryEntry>;
  storeConversation(role: string, message: string, metadata?: object): Promise<MemoryEntry>;
  storeDecision(question: string, options: string[], chosen: string, reasoning: string): Promise<MemoryEntry>;
  storeFinding(topic: string, summary: string, details: string, sources?: string[]): Promise<MemoryEntry>;
  storePreference(key: string, value: any, scope?: 'session' | 'global'): Promise<MemoryEntry>;

  get(id: string): Promise<MemoryEntry | null>;
  getRecent(limit: number, type?: MemoryType): Promise<MemoryEntry[]>;
  getConversationHistory(limit?: number): Promise<MemoryEntry[]>;

  query(query: MemoryQuery): Promise<QueryResult>;
  findDecisions(topic?: string, timeRange?: TimeRange): Promise<MemoryEntry[]>;
  findFindings(topic: string): Promise<MemoryEntry[]>;

  delete(id: string): Promise<boolean>;
  deleteByQuery(query: MemoryQuery): Promise<number>;
  exportUserData(): Promise<ExportBundle>;

  getSessionSize(): Promise<number>;
  compact(): Promise<CompactionResult>;

  createSession(config?: Partial<SessionConfig>): Promise<string>;
  loadSession(sessionId: string): Promise<void>;
  archiveSession(sessionId: string): Promise<void>;
}
```

### 4.2 Concurrency Control Interface

```typescript
interface ConcurrencyController {
  acquireWriteLock(sessionId: string, timeoutMs?: number): Promise<LockHandle>;
  acquireReadLock(sessionId: string, timeoutMs?: number): Promise<LockHandle>;
  release(handle: LockHandle): Promise<void>;
  isLocked(sessionId: string): Promise<LockInfo>;
}
```

---

## 5. Implementation Notes

### 5.1 Concurrency Strategy

**Lock File Implementation** with atomic file creation, PID-based stale lock detection, and exponential backoff for lock contention.

### 5.2 Query Optimization

Query strategy selection based on index availability:
- Topic search uses pre-built topic index
- Temporal search uses temporal index
- Full-text search tokenizes and matches against content

---

## 6. Assumptions

1. **Filesystem Available**: Standard POSIX-compatible or Windows filesystem
2. **Local Storage**: Sufficient disk space (10MB minimum free)
3. **Session Duration**: Sessions may last minutes to hours
4. **Write Frequency**: ~1-10 memory entries per minute
5. **Agent Count**: 1-5 agents may access same session concurrently

---

## 7. Known Limitations

1. No full-text search engine - queries may be slow on large datasets
2. Single-machine design - cannot scale horizontally
3. No encryption at rest
4. Index in memory during queries - memory spike on large indices
5. Compaction requires full lock - blocks all access
6. No real-time sync between agents

---

## 8. Future Considerations

1. Semantic Search with embedding vectors
2. Encryption Layer
3. Distributed Mode
4. Memory Summarization
5. Compression for archived sessions
