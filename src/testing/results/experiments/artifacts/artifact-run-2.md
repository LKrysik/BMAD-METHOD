# Agent Memory Persistence Layer - Architecture Design Document (Run 2)

## 1. Overview

### 1.1 Purpose
This document describes the architecture for a persistent memory layer that enables AI agents to maintain context across sessions.

### 1.2 Design Goals
- **Persistence**: Survive agent restarts
- **Human-Readable**: JSON-based storage for debugging
- **Concurrent-Safe**: Support multiple agents
- **Queryable**: Semantic and keyword-based retrieval
- **Decay-Aware**: Temporal relevance scoring
- **Privacy-Respecting**: Granular deletion
- **Offline-First**: No external database
- **Size-Bounded**: 10MB per-session limit

---

## 2. Architecture

### 2.1 Directory Structure

```
~/.agent-memory/
├── sessions/
│   ├── {session-id-1}/
│   │   ├── memories.jsonl        # Main memory store
│   │   ├── memories.idx          # Inverted index
│   │   ├── session.meta          # Session metadata
│   │   └── .lock                 # Lock file
│   └── {session-id-2}/
├── global/
│   ├── preferences.json          # Cross-session preferences
│   └── topics.idx                # Global topic index
└── config.json                   # System configuration
```

---

## 3. Component Details

### 3.1 Memory Entry Schema

```json
{
  "id": "mem_1704067200_a1b2c3d4",
  "type": "decision|finding|conversation|preference",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "created_at": 1704067200000,
  "last_accessed": 1704067200000,
  "access_count": 1,
  "importance": 0.8,
  "decay_rate": 0.1,
  "deleted": false,
  "content": {
    "summary": "Brief description",
    "detail": "Full content",
    "context": "Creation context"
  },
  "metadata": {
    "topics": ["authentication", "security"],
    "entities": ["UserService"],
    "source": "conversation|inference|explicit",
    "confidence": 0.95
  }
}
```

### 3.2 Memory Types

| Type | Decay Rate | Typical Importance |
|------|------------|-------------------|
| `conversation` | 0.2 | 0.3-0.5 |
| `decision` | 0.05 | 0.7-0.9 |
| `finding` | 0.1 | 0.5-0.8 |
| `preference` | 0.02 | 0.8-1.0 |

### 3.3 Decay Engine

```
effective_relevance = base_importance × e^(-λt) × access_boost
```

**Decay Thresholds:**
- `>0.5`: Fully active
- `0.2-0.5`: Summarized
- `0.05-0.2`: Archive state
- `≤0.05`: Cleanup candidate

### 3.4 Concurrency Control

**Lock Strategy: File-Based Advisory Locking**
- Multiple readers allowed
- Writers require exclusive access
- Lock timeout: 5 seconds
- Retry with exponential backoff

---

## 4. Interfaces

### 4.1 Core Memory API

```typescript
interface MemoryStore {
  store(entry: MemoryInput): Promise<MemoryEntry>;
  get(id: string): Promise<MemoryEntry | null>;
  query(query: MemoryQuery): Promise<QueryResult>;
  findByTopic(topic: string): Promise<MemoryEntry[]>;
  delete(id: string): Promise<boolean>;
  deleteByQuery(query: MemoryQuery): Promise<number>;
  compact(): Promise<CompactionResult>;
  getStats(): Promise<MemoryStats>;
}
```

### 4.2 Query Interface

```typescript
interface MemoryQuery {
  text?: string;
  topics?: string[];
  types?: MemoryType[];
  createdAfter?: Date;
  createdBefore?: Date;
  minRelevance?: number;
  limit?: number;
  sortBy?: 'relevance' | 'recency' | 'importance';
}
```

---

## 5. Size Management

**Thresholds:**
- Warning: 8MB (80%)
- Soft cap: 9MB (90%) → automatic cleanup
- Hard cap: 10MB → reject new entries

**Cleanup Priority:**
1. Soft-deleted entries
2. Relevance < 0.05
3. Old conversations (>30 days)
4. Relevance < 0.2
5. Merge conversation threads

---

## 6. Implementation Notes

**JSONL Choice Rationale:**
- Append-only writes are atomic
- Human-readable
- Easy streaming
- Simple conflict resolution

**Pseudocode: Store Memory:**
```javascript
async function storeMemory(input) {
  validateInput(input);
  checkSizeLimit();
  const entry = buildEntry(input);
  const release = await acquireLock();
  try {
    await appendToFile(entry);
    await updateIndex(entry);
  } finally {
    release();
  }
  return entry;
}
```

---

## 7. Assumptions

1. File System Access available
2. Single Machine operation
3. Each agent has unique identifier
4. Text-Based Content
5. 2-5 concurrent agents expected
6. UTF-8 Encoding
7. Clock Synchronization

---

## 8. Known Limitations

1. **No Full-Text Search Engine** - keyword matching only
2. **No Encryption at Rest**
3. **No Automatic Backup**
4. **No Cross-Machine Sync**
5. **Limited Relationship Depth**
6. **Index may become stale** on crash

### Performance Constraints

| Operation | Expected Latency |
|-----------|-----------------|
| Store entry | <50ms |
| Query (indexed) | <100ms |
| Query (full scan) | <500ms |
| Compaction | 1-5 seconds |

---

## 9. Security Considerations

- **Sensitive Data**: Do not store passwords, API keys
- **File Permissions**: 0600 (owner read/write only)
- **Audit Trail**: Optional delete logging

---

## 10. Future Enhancements

1. Semantic Search
2. Memory Summarization
3. Cross-Session Learning
4. Memory Visualization
5. Encryption Layer
6. Distributed Mode
