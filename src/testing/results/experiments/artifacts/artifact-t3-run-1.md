# Session Memory Persistence Architecture v1.0

**Status:** Architecture Specification
**Version:** 1.0.0
**Author:** BMAD Core Team
**Created:** 2026-01-11
**Purpose:** Enable agents to maintain context and memory across sessions

---

## Executive Summary

The Session Memory Persistence (SMP) layer provides agents with durable memory across conversation sessions. This architecture addresses context loss between sessions while maintaining human-readability, queryability, and offline operation.

### Core Objectives

- **Persistence:** Agent context survives session termination and system restart
- **Queryability:** Fast retrieval of relevant memories by topic, agent, or time
- **Human-Readable:** All storage in YAML/Markdown for debugging and transparency
- **Concurrency-Safe:** Multiple agents can access memory without corruption
- **Memory Decay:** Older memories become less prominent over time
- **Privacy-First:** Users can inspect and delete specific memories
- **Offline-First:** No external database dependencies
- **Size-Bounded:** Hard limit of 10MB per session prevents unbounded growth

---

## 1. Architecture Overview

### 1.1 Component Diagram

```
+------------------------------------------------------------------+
|                  Session Memory Persistence Layer                 |
+------------------------------------------------------------------+
|                                                                   |
|  +-----------------------+     +---------------------------+      |
|  |   Memory Manager      |<--->|   Storage Engine          |      |
|  |  - Write operations   |     |  - File I/O               |      |
|  |  - Read operations    |     |  - YAML/MD serialization  |      |
|  |  - Query processing   |     |  - Atomic writes          |      |
|  +-----------------------+     +---------------------------+      |
|            ^                              ^                       |
|            |                              |                       |
|  +-----------------------+     +---------------------------+      |
|  |   Index Manager       |     |   Lock Manager            |      |
|  |  - Topic index        |     |  - File locks             |      |
|  |  - Time index         |     |  - Transaction mgmt       |      |
|  |  - Agent index        |     |  - Deadlock prevention    |      |
|  +-----------------------+     +---------------------------+      |
|            ^                              ^                       |
|            |                              |                       |
|  +-----------------------+     +---------------------------+      |
|  |   Decay Engine        |     |   Quota Manager           |      |
|  |  - Decay calculation  |     |  - Size tracking          |      |
|  |  - Relevance scoring  |     |  - Compaction triggers    |      |
|  |  - Archive operations |     |  - Eviction policy        |      |
|  +-----------------------+     +---------------------------+      |
|                                                                   |
+------------------------------------------------------------------+
                              ^
                              |
                   +----------+----------+
                   |   Agent Interface   |
                   +---------------------+
```

### 1.2 Design Principles

1. **Files Over Database:** Use filesystem as primary storage for transparency
2. **Human-First Format:** YAML for structure, Markdown for content
3. **Immutable History:** Append-only conversation logs, modifications tracked
4. **Explicit Deletion:** Nothing removed automatically except via decay policy
5. **Fail-Safe:** Corruption in one memory doesn't break entire session
6. **Observable:** All operations logged for debugging and audit

---

## 2. Storage Design

### 2.1 Directory Structure

```
{project-root}/.bmad/sessions/
├── active/
│   ├── {session-id}/
│   │   ├── metadata.yaml              # Session metadata
│   │   ├── conversation.md            # Conversation history
│   │   ├── decisions.yaml             # Key decisions made
│   │   ├── findings.yaml              # Agent findings/discoveries
│   │   ├── preferences.yaml           # User preferences learned
│   │   ├── agent-states/              # Per-agent memory
│   │   │   ├── veritas.yaml
│   │   │   ├── architect.yaml
│   │   │   └── bmad-master.yaml
│   │   ├── artifacts/                 # Generated artifacts
│   │   │   └── {artifact-id}.md
│   │   └── indexes/                   # Query indexes
│   │       ├── topics.yaml
│   │       ├── timeline.yaml
│   │       └── agents.yaml
│   └── {session-id-2}/
│       └── ...
├── archived/                          # Decayed/old sessions
│   └── {session-id}/
│       ├── summary.yaml               # Compressed summary
│       └── archive.tar.gz             # Original data (optional)
└── deleted/                           # User-deleted memories (retention period)
    └── {session-id}/
        └── deletion-record.yaml

{project-root}/.bmad/sessions/global/
├── cross-session-preferences.yaml     # Preferences across all sessions
├── learned-patterns.yaml              # Patterns agent learned
└── user-profile.yaml                  # High-level user preferences
```

### 2.2 Memory Types

| Type | Format | Mutable | Decay Rate |
|------|--------|---------|------------|
| Conversation | Markdown | No (append-only) | 0.05/day |
| Decisions | YAML | Yes | 0.03/day |
| Findings | YAML | Yes | 0.04/day |
| Preferences | YAML | Yes | 0.02/day |
| Agent State | YAML | Yes | 0.06/day |

### 2.3 Query Interface

```typescript
interface MemoryQueryAPI {
  getByTopic(topic: string, options?: QueryOptions): Memory[]
  getByAgent(agentId: string, options?: QueryOptions): Memory[]
  getByTimeRange(start: Date, end: Date): Memory[]
  findSimilar(query: string): Memory[]
  findRelated(memoryId: string): Memory[]
}
```

---

## 3. Concurrency Control

### 3.1 Lock Strategy

- **Read Operations:** Optimistic (no lock)
- **Write Operations:** Exclusive file lock with 5s timeout
- **Index Updates:** Batched with periodic flush

### 3.2 Deadlock Prevention

Global lock ordering:
1. metadata.yaml
2. conversation.md
3. decisions.yaml
4. findings.yaml
5. preferences.yaml
6. agent-states/*.yaml
7. indexes/*.yaml

---

## 4. Memory Decay System

### 4.1 Decay Function

```
priority = base_priority × e^(-decay_rate × days_since_access) × age_penalty + access_boost
```

Where:
- `age_penalty = e^(-0.01 × days_since_creation)`
- `access_boost = min(0.2, access_count × 0.01)`

### 4.2 Decay Rules by Type

| Memory Type | Base Priority | Decay Rate | Min Priority |
|-------------|---------------|------------|--------------|
| Conversation | 1.0 | 0.05/day | 0.1 |
| Decisions | 0.95 | 0.03/day | 0.4 |
| Findings | 0.90 | 0.04/day | 0.3 |
| Preferences | 0.85 | 0.02/day | 0.6 |

---

## 5. Size Management

### 5.1 Quota Policy

- **Hard Limit:** 10MB per session
- **Warning:** 80% utilization
- **Critical:** 95% (force compaction)

### 5.2 Compaction Strategy

Priority order:
1. Remove decayed memories (priority < 0.3)
2. Summarize old conversation (> 7 days)
3. Archive resolved findings
4. Compress agent state history

---

## 6. Privacy Controls

### 6.1 User Rights

- **Inspect:** View all stored memories
- **Delete:** Remove specific memories or sessions
- **Export:** Download in YAML/JSON/MD format
- **Anonymize:** Remove PII while preserving structure

### 6.2 Retention

- Deleted items: 30-day recovery period
- After retention: Permanent purge

---

## 7. Performance Targets

| Operation | Target Latency |
|-----------|---------------|
| Record memory | < 10ms |
| Query by topic | < 50ms |
| Query by time | < 100ms |
| Compact session | < 5s |
| Archive session | < 10s |

---

## 8. Integration Points

### 8.1 Agent Interface

```typescript
class AgentMemoryInterface {
  getConversationContext(turnCount: number): Turn[]
  getRelevantDecisions(topic: string): Decision[]
  recordDecision(decision: Decision): void
  recordFinding(finding: Finding): void
}
```

### 8.2 BMAD Workflow Integration

Workflows specify memory requirements in metadata:

```yaml
workflow:
  memory_requirements:
    read_access: ["conversation", "decisions", "findings"]
    write_access: ["findings", "agent_states"]
```

---

**End of Architecture Document**
