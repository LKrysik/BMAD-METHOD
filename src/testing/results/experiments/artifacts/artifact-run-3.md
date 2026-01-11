# Agent Memory Persistence Layer - Architecture Design Document (Run 3)

## Executive Overview

This document specifies the architecture for a memory persistence layer that enables AI agents to maintain context across sessions.

---

## 1. Architecture Overview

### 1.1 High-Level Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Agent Application                             │
├─────────────────────────────────────────────────────────────────────┤
│                     Memory Access Layer (API)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │  Write   │  │  Query   │  │  Delete  │  │  Lifecycle Manager   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                      Memory Processing Layer                         │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────────────────┐│
│  │ Relevance    │  │ Decay         │  │ Concurrency Controller     ││
│  │ Scorer       │  │ Calculator    │  │ (File Locking)             ││
│  └──────────────┘  └───────────────┘  └────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────┤
│                        Storage Layer                                 │
│                    Local File System (YAML)                          │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Directory Structure

```
.agent-memory/
├── sessions/
│   ├── {session-id}/
│   │   ├── manifest.yaml
│   │   ├── conversation.yaml
│   │   ├── decisions.yaml
│   │   ├── findings.yaml
│   │   └── .lock
├── preferences/
│   └── user-preferences.yaml
├── indices/
│   ├── topics.json
│   ├── temporal.json
│   └── decisions.json
└── meta/
    ├── schema-version.yaml
    └── gc-state.yaml
```

---

## 2. Storage Design

### 2.1 Session Manifest

```yaml
schema_version: "1.0"
session_id: "sess_20260110_143052_abc123"
created_at: "2026-01-10T14:30:52Z"
last_accessed: "2026-01-10T16:45:30Z"
total_size_bytes: 524288
entry_counts:
  conversations: 156
  decisions: 12
  findings: 34
status: "active"
```

### 2.2 Conversation History

```yaml
entries:
  - id: "conv_001"
    timestamp: "2026-01-10T14:30:52Z"
    role: "user"
    content: "Help me design the authentication module"
    relevance_score: 1.0
    topics: ["authentication", "design"]
    deleted: false
```

### 2.3 Decisions

```yaml
entries:
  - id: "dec_001"
    timestamp: "2026-01-10T15:22:00Z"
    title: "Use JWT for session management"
    decision: "Implement JWT-based authentication"
    rationale: |
      - Stateless architecture
      - Better scalability
      - Industry standard
    alternatives_considered:
      - option: "Server-side sessions"
        rejected_reason: "Adds dependency"
    confidence: 0.85
```

---

## 3. Component Details

### 3.1 Decay Calculator

**Formula:**
```
relevance = max(min, initial × e^(-λt) + accessBoost × recentAccess)
```

**Decay Thresholds:**
- `>0.5`: Fully active
- `0.2-0.5`: Available but summarized
- `0.05-0.2`: Archive state
- `≤0.05`: Cleanup candidate

### 3.2 Concurrency Controller

**Lock Protocol:**
1. Acquire exclusive lock on .lock file
2. Read current state
3. Perform operation
4. Atomic rename for writes
5. Release lock

Lock timeout: 60 seconds

### 3.3 Privacy Manager

```typescript
interface PrivacyManager {
  softDelete(entryId: string): Promise<DeleteResult>;
  hardDelete(entryId: string): Promise<DeleteResult>;
  deleteByTopic(topic: string): Promise<BulkDeleteResult>;
  recoverSoftDeleted(entryId: string): Promise<RecoveryResult>;
}
```

---

## 4. Query Interface

```typescript
class AgentMemory {
  async startSession(): Promise<Session>;
  async resumeSession(sessionId: string): Promise<Session>;

  async remember(entry: MemoryInput): Promise<MemoryEntry>;
  async recordDecision(decision: DecisionInput): Promise<DecisionEntry>;

  async recall(query: RecallQuery): Promise<RecallResult>;
  async getRelevantContext(topics: string[], maxTokens?: number): Promise<ContextBundle>;

  async forget(entryId: string, hard?: boolean): Promise<void>;
  async forgetTopic(topic: string): Promise<ForgetResult>;

  async getStorageStats(): Promise<StorageStats>;
  async optimize(): Promise<OptimizeResult>;
}
```

---

## 5. Size Management

| Threshold | Action |
|-----------|--------|
| 8MB (80%) | Warning, increase decay |
| 9MB (90%) | Trigger compaction |
| 10MB | Reject writes |

**Compaction Algorithm:**
1. Acquire exclusive lock
2. Read all entries
3. Apply strategy filters
4. Write to temp file
5. Atomic rename
6. Update indices
7. Release lock

---

## 6. Implementation Guidance

### 6.1 Technology Recommendations

| Component | Recommendation |
|-----------|---------------|
| Language | TypeScript/Python |
| YAML Parser | js-yaml / PyYAML |
| File Locking | proper-lockfile |
| Topic Extraction | TF-IDF |

### 6.2 Atomic Writes

```typescript
async function atomicWrite(filepath: string, content: string) {
  const tempPath = `${filepath}.tmp`;
  await fs.writeFile(tempPath, content);
  await fs.rename(tempPath, filepath);
}
```

---

## 7. Assumptions

1. Local filesystem available
2. POSIX-compatible atomic rename
3. Sufficient disk space (10MB)
4. 1-3 concurrent agents typical
5. Agents have unique identifiers
6. Token counting approximate (4 chars ≈ 1 token)

---

## 8. Known Limitations

### 8.1 Architectural

1. **Search**: Simple substring/regex - no semantic search
2. **Topic Extraction**: Keyword frequency only
3. **Cross-Session**: Not optimized
4. **Concurrent Writers**: Serialized per session

### 8.2 Operational

1. No built-in backup
2. Plaintext storage
3. Schema changes require migration
4. No built-in monitoring

### 8.3 Scalability Boundaries

| Dimension | Soft Limit | Hard Limit |
|-----------|------------|------------|
| Sessions | 100 | 1000 |
| Entries/file | 1000 | 5000 |
| Concurrent readers | 10 | 50 |
| Concurrent writers | 1 | 1 |

---

## 9. Security

- File Permissions: 0600
- Flag mechanism for sensitive entries
- Optional audit log for deletes

---

## 10. Testing Strategy

- Unit: YAML roundtrip, decay calculation
- Integration: Concurrent access, compaction
- Stress: Size limits, 10 concurrent agents

---

## 11. Migration Path

```typescript
interface Migration {
  fromVersion: string;
  toVersion: string;
  migrate(data: any): any;
  rollback(data: any): any;
}
```
