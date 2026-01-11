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

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Storage Design](#2-storage-design)
3. [Memory Types and Structure](#3-memory-types-and-structure)
4. [Query Interface](#4-query-interface)
5. [Lifecycle Management](#5-lifecycle-management)
6. [Concurrency Control](#6-concurrency-control)
7. [Memory Decay System](#7-memory-decay-system)
8. [Privacy and User Control](#8-privacy-and-user-control)
9. [Size Management](#9-size-management)
10. [Implementation Guidance](#10-implementation-guidance)
11. [Integration with BMAD](#11-integration-with-bmad)
12. [Performance Characteristics](#12-performance-characteristics)

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

### 2.2 File Format Standards

#### 2.2.1 Session Metadata

**File:** `metadata.yaml`

```yaml
session:
  id: "session-2026-01-11-abc123"
  created_at: "2026-01-11T14:30:00Z"
  last_accessed: "2026-01-11T16:45:00Z"
  status: "active"  # active | archived | deleted

  # Size tracking
  storage:
    total_bytes: 2457600  # 2.4 MB
    quota_bytes: 10485760  # 10 MB
    utilization_pct: 23.4
    last_compaction: "2026-01-11T15:00:00Z"

  # Decay tracking
  decay:
    base_priority: 1.0
    current_priority: 0.87  # Decays over time
    decay_rate: 0.05  # per day
    last_decay_update: "2026-01-11T16:00:00Z"

  # Participants
  participants:
    user_id: "user-123"
    agents:
      - agent_id: "bmad-master"
        message_count: 42
        last_active: "2026-01-11T16:45:00Z"
      - agent_id: "veritas"
        message_count: 18
        last_active: "2026-01-11T16:30:00Z"

  # Context
  context:
    project_name: "E-Commerce Platform"
    project_phase: "requirements"
    primary_topic: "authentication"
    tags: ["oauth", "security", "requirements"]
```

#### 2.2.2 Conversation History

**File:** `conversation.md`

```markdown
# Conversation History
**Session:** session-2026-01-11-abc123
**Started:** 2026-01-11 14:30:00 UTC
**Participants:** user-123, bmad-master, veritas, architect

---

## Turn 1 - 2026-01-11 14:30:00
**Speaker:** user
**Type:** message

Let's review the authentication requirements for the e-commerce platform.

---

## Turn 2 - 2026-01-11 14:30:05
**Speaker:** bmad-master
**Type:** message
**Memory-Refs:** [DEC-001]

I'll coordinate a comprehensive review with our specialists. I'm delegating to Veritas for verification and Architect for technical feasibility.

**Memory Stored:**
- Decision to use multi-agent review [DEC-001]

---

## Turn 3 - 2026-01-11 14:30:30
**Speaker:** veritas
**Type:** message
**Memory-Refs:** [FIND-001, FIND-002]

I've identified three concerns in section 3.2:

1. **CRITICAL:** No MFA requirement specified [FIND-001]
2. **IMPORTANT:** Session timeout not defined [FIND-002]
3. **MINOR:** Password complexity requirements vague

**Memory Stored:**
- Finding: Missing MFA requirement [FIND-001]
- Finding: Missing session timeout [FIND-002]

---

## Turn 4 - 2026-01-11 14:35:00
**Speaker:** user
**Type:** message
**Memory-Refs:** [PREF-001]

Good catches. MFA should be required for all admin users but optional for customers.

**Memory Stored:**
- Preference: MFA policy clarification [PREF-001]

---

<!-- Conversation continues... -->
```

#### 2.2.3 Decisions

**File:** `decisions.yaml`

```yaml
decisions:
  - id: "DEC-001"
    timestamp: "2026-01-11T14:30:05Z"
    turn_ref: 2
    made_by: "bmad-master"

    decision: "Use multi-agent review for authentication requirements"
    rationale: "Authentication is security-critical and benefits from specialist review"
    agents_involved: ["veritas", "architect"]

    confidence: "high"
    reversible: true

    tags: ["process", "collaboration"]

    decay:
      priority: 1.0
      last_accessed: "2026-01-11T16:45:00Z"
      access_count: 3

  - id: "DEC-002"
    timestamp: "2026-01-11T14:40:00Z"
    turn_ref: 8
    made_by: "architect"
    agreed_by: ["bmad-master", "veritas"]

    decision: "Use OAuth 2.0 with JWT tokens for authentication"
    rationale: "Industry standard, good library support, supports SSO future"
    alternatives_considered:
      - option: "Session cookies"
        rejected_because: "Not suitable for API authentication"
      - option: "Opaque tokens"
        rejected_because: "Requires additional lookup on every request"

    confidence: "high"
    reversible: false  # Would require architecture change
    implementation_impact: "high"

    tags: ["architecture", "security", "authentication"]

    decay:
      priority: 1.0
      last_accessed: "2026-01-11T16:45:00Z"
      access_count: 5
```

#### 2.2.4 Findings

**File:** `findings.yaml`

```yaml
findings:
  - id: "FIND-001"
    timestamp: "2026-01-11T14:30:30Z"
    turn_ref: 3
    discovered_by: "veritas"

    severity: "critical"
    category: "missing_requirement"

    finding: "No MFA requirement specified in authentication section"

    location:
      artifact: "/docs/requirements.md"
      section: "3.2 Authentication"
      line_numbers: [45, 60]

    impact: "Security vulnerability - admin accounts could be compromised with single factor"
    root_cause: "Requirements template didn't include MFA as checklist item"

    resolution:
      status: "resolved"
      resolved_at: "2026-01-11T14:35:00Z"
      resolved_by: "user"
      action_taken: "Added MFA requirement: required for admins, optional for customers"
      verification: "Requirement added in commit abc123"

    tags: ["security", "authentication", "mfa"]

    decay:
      priority: 0.8  # Resolved findings decay faster
      last_accessed: "2026-01-11T14:35:00Z"
      access_count: 2

  - id: "FIND-002"
    timestamp: "2026-01-11T14:30:30Z"
    turn_ref: 3
    discovered_by: "veritas"

    severity: "important"
    category: "ambiguous_requirement"

    finding: "Session timeout not defined"

    location:
      artifact: "/docs/requirements.md"
      section: "3.2 Authentication"
      line_numbers: [55, 58]

    impact: "Potential security risk - sessions might persist indefinitely"
    root_cause: "Template assumed timeout would be handled in implementation phase"

    resolution:
      status: "open"
      next_steps: "Need to define timeout for different user roles"

    tags: ["security", "authentication", "session"]

    decay:
      priority: 1.0  # Open findings maintain priority
      last_accessed: "2026-01-11T16:45:00Z"
      access_count: 4
```

#### 2.2.5 User Preferences

**File:** `preferences.yaml`

```yaml
preferences:
  - id: "PREF-001"
    timestamp: "2026-01-11T14:35:00Z"
    turn_ref: 4

    category: "policy"
    topic: "mfa_requirements"

    preference: "MFA required for admin users, optional for customers"
    context: "E-commerce platform authentication policy"

    confidence: "explicit"  # explicit | inferred | uncertain
    source: "user_statement"

    applies_to:
      projects: ["e-commerce-platform"]
      domains: ["authentication", "security"]

    decay:
      priority: 1.0
      last_accessed: "2026-01-11T16:45:00Z"
      access_count: 7

  - id: "PREF-002"
    timestamp: "2026-01-11T15:00:00Z"
    turn_ref: 15

    category: "workflow"
    topic: "verification_depth"

    preference: "Prefer comprehensive verification over speed for security features"
    context: "User chose Deep Verify over Quick Verify for auth requirements"

    confidence: "inferred"
    source: "behavior_pattern"

    applies_to:
      projects: ["*"]  # All projects
      domains: ["security", "authentication", "authorization"]

    decay:
      priority: 0.9
      last_accessed: "2026-01-11T15:00:00Z"
      access_count: 1
```

#### 2.2.6 Agent State

**File:** `agent-states/veritas.yaml`

```yaml
agent_state:
  agent_id: "veritas"
  session_id: "session-2026-01-11-abc123"
  last_updated: "2026-01-11T16:45:00Z"

  # Agent's view of current state
  current_context:
    current_task: "verify_requirements"
    current_phase: "PHASE_6"
    focus_area: "authentication_requirements"

    active_artifacts:
      - path: "/docs/requirements.md"
        status: "reviewed"
        findings_count: 3

  # Agent's working memory
  working_memory:
    concerns_identified:
      - "Missing MFA specification"
      - "Undefined session timeout"
      - "Vague password complexity"

    methods_applied:
      - "#51 Liar's Trap"
      - "#70 Content Accuracy"
      - "#79 Structural Completeness"
      - "#110 Reductio Attack"

    verification_summary:
      total_concerns: 3
      critical: 1
      important: 1
      minor: 1
      all_resolved: false

  # Agent's learned patterns (specific to this session)
  session_learnings:
    - "User prefers explicit security requirements over defaults"
    - "Requirements review should check for MFA in all auth sections"
    - "Session management is often overlooked in initial requirements"

  # References to shared memories
  memory_refs:
    decisions_made: []
    findings_created: ["FIND-001", "FIND-002", "FIND-003"]
    preferences_learned: ["PREF-002"]

  decay:
    priority: 0.95
    last_accessed: "2026-01-11T16:45:00Z"
```

### 2.3 Index Files

#### 2.3.1 Topic Index

**File:** `indexes/topics.yaml`

```yaml
topic_index:
  version: 1
  last_updated: "2026-01-11T16:45:00Z"

  topics:
    authentication:
      weight: 0.95  # Importance in this session
      mentions: 28
      first_mentioned: "2026-01-11T14:30:00Z"
      last_mentioned: "2026-01-11T16:45:00Z"

      related_memories:
        decisions: ["DEC-002"]
        findings: ["FIND-001", "FIND-002"]
        preferences: ["PREF-001"]
        turns: [1, 2, 3, 4, 8, 12, 15, 18]

      subtopics:
        - mfa
        - oauth
        - session_management
        - jwt

    security:
      weight: 0.88
      mentions: 22
      first_mentioned: "2026-01-11T14:30:00Z"
      last_mentioned: "2026-01-11T16:40:00Z"

      related_memories:
        decisions: ["DEC-002"]
        findings: ["FIND-001", "FIND-002"]
        preferences: ["PREF-001", "PREF-002"]
        turns: [1, 3, 4, 8, 12]

      subtopics:
        - authentication
        - authorization
        - compliance

    # ... more topics
```

#### 2.3.2 Timeline Index

**File:** `indexes/timeline.yaml`

```yaml
timeline_index:
  version: 1
  last_updated: "2026-01-11T16:45:00Z"

  # Chronological event stream
  events:
    - timestamp: "2026-01-11T14:30:00Z"
      type: "conversation_turn"
      ref: "turn-1"
      participants: ["user"]
      topics: ["authentication"]

    - timestamp: "2026-01-11T14:30:05Z"
      type: "decision"
      ref: "DEC-001"
      made_by: "bmad-master"
      topics: ["process", "collaboration"]

    - timestamp: "2026-01-11T14:30:30Z"
      type: "finding"
      ref: "FIND-001"
      discovered_by: "veritas"
      severity: "critical"
      topics: ["security", "authentication", "mfa"]

    # ... more events

  # Time-based buckets for fast lookup
  buckets:
    "2026-01-11T14:00":  # Hour bucket
      event_count: 15
      event_refs: ["turn-1", "turn-2", "DEC-001", "FIND-001", ...]

    "2026-01-11T15:00":
      event_count: 23
      event_refs: [...]
```

---

## 3. Memory Types and Structure

### 3.1 Memory Type Hierarchy

```
Memory
├── Conversation Memory (immutable)
│   ├── Turns (chronological)
│   └── Context switches
├── Knowledge Memory (mutable, append-preferred)
│   ├── Decisions
│   ├── Findings
│   ├── Preferences
│   └── Learnings
├── Agent Memory (agent-specific)
│   ├── State
│   ├── Working memory
│   └── Session learnings
└── Artifact Memory
    ├── Generated content
    └── Analysis results
```

### 3.2 Memory Attributes

Every memory object includes:

```yaml
standard_attributes:
  id: "UUID or semantic ID"
  timestamp: "ISO8601 creation time"
  turn_ref: "Reference to conversation turn"
  created_by: "Agent or user identifier"

  # Content
  content: "The actual memory data"

  # Metadata
  tags: ["topic1", "topic2"]
  confidence: "high | medium | low | uncertain"

  # Decay tracking
  decay:
    priority: 0.0-1.0  # Current priority score
    last_accessed: "ISO8601"
    access_count: integer
    base_priority: 0.0-1.0  # Initial priority
```

### 3.3 Memory Relationships

Memories reference each other:

```yaml
memory_relationships:
  - source: "DEC-002"
    target: "FIND-001"
    relationship: "resolves"

  - source: "FIND-002"
    target: "DEC-003"
    relationship: "led_to"

  - source: "PREF-001"
    target: "DEC-002"
    relationship: "influenced"
```

---

## 4. Query Interface

### 4.1 Query API

```typescript
interface MemoryQueryAPI {
  // Basic queries
  getByTopic(topic: string, options?: QueryOptions): Memory[]
  getByAgent(agentId: string, options?: QueryOptions): Memory[]
  getByTimeRange(start: Date, end: Date, options?: QueryOptions): Memory[]
  getByType(type: MemoryType, options?: QueryOptions): Memory[]

  // Semantic queries
  findSimilar(query: string, options?: QueryOptions): Memory[]
  findRelated(memoryId: string, options?: QueryOptions): Memory[]

  // Complex queries
  query(querySpec: QuerySpecification): QueryResult

  // Aggregations
  summarizeSession(): SessionSummary
  getTopics(): TopicSummary[]
  getTimeline(): TimelineEvent[]
}

interface QueryOptions {
  limit?: number              // Max results
  offset?: number             // Pagination
  sortBy?: SortField          // Sort criteria
  includeDecayed?: boolean    // Include low-priority memories
  minPriority?: number        // Minimum decay priority
  agentFilter?: string[]      // Filter by agent
  dateFilter?: DateRange      // Filter by date
  confidenceFilter?: string[] // Filter by confidence level
}

interface QuerySpecification {
  filters: Filter[]
  sort: SortCriteria[]
  aggregations?: Aggregation[]
  includeRelated?: boolean
}
```

### 4.2 Query Examples

#### 4.2.1 Find Past Decisions on Topic

```typescript
// Find all decisions about authentication
const decisions = memory.query({
  filters: [
    { field: "type", operator: "equals", value: "decision" },
    { field: "tags", operator: "contains", value: "authentication" }
  ],
  sort: [
    { field: "decay.priority", direction: "desc" },
    { field: "timestamp", direction: "desc" }
  ]
});
```

#### 4.2.2 Find Related Memories

```typescript
// Find all memories related to a specific finding
const related = memory.findRelated("FIND-001", {
  includeDecayed: false,
  minPriority: 0.5
});

// Returns:
// - The decision that resolved it (DEC-002)
// - The user preference that influenced it (PREF-001)
// - Other findings from same verification session
```

#### 4.2.3 Get Conversation Context

```typescript
// Get last 20 turns with high-priority memories
const context = memory.query({
  filters: [
    { field: "type", operator: "equals", value: "conversation_turn" }
  ],
  sort: [
    { field: "timestamp", direction: "desc" }
  ],
  includeRelated: true  // Include referenced decisions/findings
}).slice(0, 20);
```

### 4.3 Index-Accelerated Queries

Queries use indexes for performance:

```yaml
query_optimization:
  # Topic queries use topic index
  - query: "getByTopic('authentication')"
    index_used: "topics.yaml"
    lookup_complexity: "O(1)"

  # Time range queries use timeline index
  - query: "getByTimeRange(start, end)"
    index_used: "timeline.yaml"
    lookup_complexity: "O(log n)"

  # Agent queries use agent index
  - query: "getByAgent('veritas')"
    index_used: "agents.yaml"
    lookup_complexity: "O(1)"
```

---

## 5. Lifecycle Management

### 5.1 Session Lifecycle States

```
CREATE → ACTIVE → IDLE → DECAYING → ARCHIVED → DELETED
```

#### 5.1.1 State Transitions

```yaml
lifecycle_states:
  created:
    description: "Session just initialized"
    duration: "Immediate"
    transitions_to: "active"
    actions:
      - "Create session directory"
      - "Initialize metadata.yaml"
      - "Create empty memory files"
      - "Build initial indexes"

  active:
    description: "Session currently in use"
    duration: "While conversation ongoing"
    transitions_to: "idle"
    actions:
      - "Accept memory writes"
      - "Update indexes on write"
      - "Track access patterns"
      - "Monitor size quota"

  idle:
    description: "Session not accessed recently"
    duration: "Until accessed or decay threshold"
    transitions_to: "active | decaying"
    trigger: "No access for 24 hours"
    actions:
      - "Continue accepting writes (if resumed)"
      - "Begin decay priority calculation"
      - "Reduce index update frequency"

  decaying:
    description: "Session aging out"
    duration: "Until archive threshold"
    transitions_to: "archived"
    trigger: "No access for 7 days"
    actions:
      - "Apply decay function to all memories"
      - "Lower priority in cross-session queries"
      - "Mark for archival consideration"

  archived:
    description: "Session compressed and moved to archive"
    duration: "Indefinite (or until user deletes)"
    transitions_to: "deleted"
    trigger: "No access for 30 days OR explicit archive command"
    actions:
      - "Generate session summary"
      - "Compress full session data"
      - "Move to archived/ directory"
      - "Keep summary in fast index"

  deleted:
    description: "Session marked for deletion"
    duration: "30 day retention period"
    transitions_to: "purged"
    trigger: "User deletion command"
    actions:
      - "Move to deleted/ directory"
      - "Create deletion record with reason"
      - "Remove from active indexes"
      - "Preserve for recovery period"

  purged:
    description: "Permanently removed"
    duration: "N/A"
    transitions_to: null
    trigger: "30 days after deletion"
    actions:
      - "Permanently delete all files"
      - "Remove all index entries"
      - "Log purge event"
```

### 5.2 Lifecycle Operations

```typescript
interface SessionLifecycle {
  // Creation
  createSession(userId: string, context: SessionContext): Session

  // State management
  activateSession(sessionId: string): void
  deactivateSession(sessionId: string): void
  archiveSession(sessionId: string, reason?: string): void
  deleteSession(sessionId: string, reason: string): void

  // Recovery
  restoreSession(sessionId: string): Session
  undeleteSession(sessionId: string, reason: string): void

  // Maintenance
  compactSession(sessionId: string): CompactionResult
  validateSession(sessionId: string): ValidationResult
  repairSession(sessionId: string): RepairResult
}
```

### 5.3 Background Tasks

```yaml
background_tasks:
  decay_update:
    frequency: "Every 6 hours"
    action: "Update decay priorities for all active sessions"
    cost: "Low (only updates metadata)"

  index_rebuild:
    frequency: "Daily at 3 AM"
    action: "Rebuild all indexes from source data"
    cost: "Medium (reads all memory files)"

  archive_check:
    frequency: "Daily at 4 AM"
    action: "Identify sessions eligible for archival"
    cost: "Low (only checks metadata)"

  purge_deleted:
    frequency: "Weekly on Sunday"
    action: "Permanently delete sessions past retention period"
    cost: "Low (file deletion)"

  quota_enforcement:
    frequency: "On every write"
    action: "Check session size, trigger compaction if needed"
    cost: "Very low (metadata check)"
```

---

## 6. Concurrency Control

### 6.1 Lock Strategy

Use file-based locking with optimistic concurrency for reads.

```yaml
lock_strategy:
  read_operations:
    lock_type: "none"  # Optimistic - read current state
    conflict_resolution: "last-write-wins with version check"

  write_operations:
    lock_type: "exclusive file lock"
    timeout_ms: 5000
    retry_policy:
      max_attempts: 3
      backoff_ms: [100, 500, 1000]

  index_updates:
    lock_type: "exclusive file lock"
    batch_updates: true  # Accumulate updates, flush periodically
```

### 6.2 Lock Implementation

```typescript
interface LockManager {
  // Acquire exclusive write lock
  acquireLock(filePath: string, timeoutMs: number): Lock

  // Release lock
  releaseLock(lock: Lock): void

  // Try lock without blocking
  tryLock(filePath: string): Lock | null

  // Check if file is locked
  isLocked(filePath: string): boolean
}

class FileLock implements Lock {
  private lockFile: string;  // .lock file alongside data file
  private acquired: Date;
  private ownerPid: number;

  async acquire(): Promise<void> {
    // Create .lock file with PID and timestamp
    // Use atomic file creation (O_EXCL flag)
    // If fails, check if lock is stale (owner process dead)
    // Retry with backoff if lock held by active process
  }

  async release(): Promise<void> {
    // Delete .lock file
    // If lock doesn't exist, log warning (double release)
  }

  isStale(): boolean {
    // Check if owner process still exists
    // Check if lock older than timeout threshold
  }
}
```

### 6.3 Deadlock Prevention

```yaml
deadlock_prevention:
  # Global lock ordering
  lock_order:
    1: "metadata.yaml"
    2: "conversation.md"
    3: "decisions.yaml"
    4: "findings.yaml"
    5: "preferences.yaml"
    6: "agent-states/{agent-id}.yaml"
    7: "indexes/*.yaml"

  rule: "Always acquire locks in ascending order number"

  # Lock timeout
  max_lock_hold_time_ms: 10000
  stale_lock_cleanup: true

  # Detection
  detect_cycles: true
  log_blocked_operations: true
```

### 6.4 Transaction Model

```typescript
interface Transaction {
  begin(): void

  // Memory operations
  writeDecision(decision: Decision): void
  writeFinding(finding: Finding): void
  writePreference(preference: Preference): void
  updateAgentState(agentId: string, state: AgentState): void

  // Commit or rollback
  commit(): Promise<void>
  rollback(): void

  // Status
  isActive(): boolean
  getModifications(): Modification[]
}

class MemoryTransaction implements Transaction {
  private modifications: Modification[] = [];
  private locks: Lock[] = [];

  async commit(): Promise<void> {
    try {
      // 1. Acquire all necessary locks in order
      this.acquireLocksInOrder();

      // 2. Validate no conflicts (version check)
      this.validateNoConflicts();

      // 3. Write all modifications atomically
      this.writeModifications();

      // 4. Update indexes
      this.updateIndexes();

      // 5. Release locks
      this.releaseAllLocks();
    } catch (error) {
      // Rollback on any failure
      this.rollback();
      throw error;
    }
  }

  rollback(): void {
    // Discard all modifications
    this.modifications = [];

    // Release any held locks
    this.releaseAllLocks();
  }
}
```

---

## 7. Memory Decay System

### 7.1 Decay Function

Memory priority decays over time and increases with access:

```typescript
interface DecayCalculator {
  calculatePriority(memory: Memory, now: Date): number
  updateOnAccess(memory: Memory): void
  decayAllMemories(session: Session): void
}

class ExponentialDecay implements DecayCalculator {
  calculatePriority(memory: Memory, now: Date): number {
    const basePriority = memory.decay.base_priority;
    const daysSinceCreation = daysBetween(memory.timestamp, now);
    const daysSinceAccess = daysBetween(memory.decay.last_accessed, now);
    const accessCount = memory.decay.access_count;

    // Exponential decay based on time since last access
    const timeFactor = Math.exp(-0.05 * daysSinceAccess);

    // Boost from access frequency
    const accessBoost = Math.min(0.2, accessCount * 0.01);

    // Age penalty (even accessed memories decay slowly)
    const agePenalty = Math.exp(-0.01 * daysSinceCreation);

    // Combined priority
    const priority = basePriority * timeFactor * agePenalty + accessBoost;

    return Math.max(0, Math.min(1, priority));
  }

  updateOnAccess(memory: Memory): void {
    memory.decay.last_accessed = new Date().toISOString();
    memory.decay.access_count += 1;
    memory.decay.priority = this.calculatePriority(memory, new Date());
  }
}
```

### 7.2 Decay Rules by Memory Type

```yaml
decay_rules:
  conversation_turns:
    base_priority: 1.0
    decay_rate: 0.05  # per day
    access_boost: 0.01  # per access
    note: "Recent conversation always high priority"

  decisions:
    base_priority: 0.95
    decay_rate: 0.03  # Slower decay
    access_boost: 0.02
    special_rules:
      - "Unresolved decisions maintain higher priority"
      - "Decisions with high impact maintain 0.9+ priority"

  findings:
    base_priority: 0.90
    decay_rate: 0.04
    access_boost: 0.015
    special_rules:
      - "Critical findings maintain 0.8+ priority"
      - "Resolved findings decay faster (rate * 1.5)"

  preferences:
    base_priority: 0.85
    decay_rate: 0.02  # Very slow decay
    access_boost: 0.03  # High boost on access
    special_rules:
      - "Explicit preferences never decay below 0.6"
      - "Inferred preferences can decay to 0.3"

  agent_states:
    base_priority: 0.80
    decay_rate: 0.06  # Faster decay
    access_boost: 0.01
    special_rules:
      - "Working memory decays quickly"
      - "Learnings persist longer"
```

### 7.3 Decay-Aware Queries

Queries can filter by decay priority:

```typescript
// Only high-priority memories
const recent = memory.getByTopic("authentication", {
  minPriority: 0.7,
  sortBy: "decay.priority"
});

// Include decayed memories but sort by relevance
const all = memory.getByTopic("authentication", {
  includeDecayed: true,
  sortBy: "decay.priority"
});

// Get decayed memories for potential archival
const decayed = memory.query({
  filters: [
    { field: "decay.priority", operator: "lessThan", value: 0.3 }
  ],
  sort: [
    { field: "decay.priority", direction: "asc" }
  ]
});
```

---

## 8. Privacy and User Control

### 8.1 User Privacy Rights

Users have complete control over their memory data:

```yaml
privacy_rights:
  inspect:
    description: "View all stored memories"
    implementation: "Direct filesystem access + query UI"

  delete:
    description: "Delete specific memories or entire sessions"
    granularity: ["individual_memory", "topic", "date_range", "entire_session"]
    retention_period: "30 days in deleted/ directory"

  export:
    description: "Export memories in portable format"
    formats: ["yaml", "json", "markdown"]

  anonymize:
    description: "Remove personally identifiable information"
    scope: "Session-level or global"
```

### 8.2 Deletion Interface

```typescript
interface MemoryDeletion {
  // Delete specific memory
  deleteMemory(memoryId: string, reason: string): void

  // Delete by criteria
  deleteByTopic(topic: string, reason: string): DeletionResult
  deleteByDateRange(start: Date, end: Date, reason: string): DeletionResult
  deleteByAgent(agentId: string, reason: string): DeletionResult

  // Delete entire session
  deleteSession(sessionId: string, reason: string): void

  // Recovery
  listDeletedMemories(): DeletedMemory[]
  restoreMemory(memoryId: string, reason: string): void

  // Permanent deletion
  purgeDeleted(olderThan: Date): PurgeResult
}
```

### 8.3 Deletion Record

When user deletes memory, record the deletion:

```yaml
# File: deleted/{session-id}/deletion-record.yaml
deletion:
  session_id: "session-2026-01-11-abc123"
  deleted_at: "2026-01-15T10:30:00Z"
  deleted_by: "user-123"
  reason: "Privacy - removing work discussion"

  deleted_items:
    - type: "conversation_turn"
      id: "turn-42"
      timestamp: "2026-01-11T15:30:00Z"
      reason_specific: "Contained personal information"

    - type: "decision"
      id: "DEC-005"
      timestamp: "2026-01-11T15:35:00Z"
      reason_specific: "Related to deleted conversation"

  recovery_deadline: "2026-02-14T10:30:00Z"  # 30 days

  # What was deleted (for potential recovery)
  backup_location: "deleted/session-2026-01-11-abc123/backup.tar.gz"
```

### 8.4 Anonymization

Remove PII while preserving utility:

```typescript
interface Anonymizer {
  anonymizeSession(sessionId: string, config: AnonymizationConfig): void
  anonymizeMemory(memoryId: string, config: AnonymizationConfig): void
}

interface AnonymizationConfig {
  remove_user_names: boolean
  remove_project_names: boolean
  remove_file_paths: boolean
  replace_with_placeholders: boolean
  preserve_structure: boolean  // Keep memory relationships
}

// Example: Anonymize but keep structure
anonymizer.anonymizeSession("session-123", {
  remove_user_names: true,        // "John" → "User-1"
  remove_project_names: true,     // "E-Commerce" → "Project-A"
  remove_file_paths: true,        // "/home/john/..." → "/path/..."
  replace_with_placeholders: true,
  preserve_structure: true        // Keep decisions, findings, relationships
});
```

---

## 9. Size Management

### 9.1 Size Quota

Hard limit of 10MB per session:

```yaml
quota_policy:
  max_session_size_bytes: 10485760  # 10 MB
  warning_threshold_pct: 80  # Warn at 8 MB
  critical_threshold_pct: 95  # Force compaction at 9.5 MB

  size_calculation:
    include:
      - "All YAML files"
      - "All Markdown files"
      - "Index files"
      - "Agent state files"
    exclude:
      - "Lock files"
      - "Temporary files"
```

### 9.2 Compaction Strategy

When approaching quota, compact the session:

```typescript
interface Compactor {
  compact(session: Session, targetReduction: number): CompactionResult
  estimateCompactionGain(session: Session): number
}

class MemoryCompactor implements Compactor {
  compact(session: Session, targetReduction: number): CompactionResult {
    const actions: CompactionAction[] = [];
    let bytesFreed = 0;

    // 1. Remove low-priority decayed memories
    const decayed = this.findDecayedMemories(session, maxPriority: 0.3);
    for (const memory of decayed) {
      actions.push({
        type: "remove_decayed",
        memory_id: memory.id,
        bytes_freed: this.estimateSize(memory)
      });
      bytesFreed += this.estimateSize(memory);
    }

    // 2. Compress old conversation turns
    if (bytesFreed < targetReduction) {
      const oldTurns = this.findOldTurns(session, olderThanDays: 7);
      const summary = this.summarizeTurns(oldTurns);

      actions.push({
        type: "summarize_conversation",
        turns_compressed: oldTurns.length,
        bytes_freed: this.estimateTurnSize(oldTurns) - this.estimateSize(summary)
      });
      bytesFreed += this.estimateTurnSize(oldTurns) - this.estimateSize(summary);
    }

    // 3. Archive resolved findings
    if (bytesFreed < targetReduction) {
      const resolved = this.findResolvedFindings(session);
      actions.push({
        type: "archive_findings",
        findings_archived: resolved.length,
        bytes_freed: this.estimateFindingsSize(resolved)
      });
      bytesFreed += this.estimateFindingsSize(resolved);
    }

    // 4. Compress agent states (keep only current, archive history)
    if (bytesFreed < targetReduction) {
      for (const agent of session.participants.agents) {
        const stateHistory = this.getStateHistory(agent.agent_id);
        const compressed = this.compressStateHistory(stateHistory);

        actions.push({
          type: "compress_agent_state",
          agent_id: agent.agent_id,
          bytes_freed: this.estimateSize(stateHistory) - this.estimateSize(compressed)
        });
        bytesFreed += this.estimateSize(stateHistory) - this.estimateSize(compressed);
      }
    }

    return {
      actions,
      bytes_freed: bytesFreed,
      success: bytesFreed >= targetReduction
    };
  }
}
```

### 9.3 Compaction Rules

```yaml
compaction_rules:
  automatic_triggers:
    - condition: "size > 95% of quota"
      action: "Aggressive compaction"
      target_reduction: "20% of current size"

    - condition: "size > 80% of quota"
      action: "Gentle compaction"
      target_reduction: "10% of current size"

  manual_triggers:
    - command: "compact_session"
      user_initiated: true

  compaction_operations:
    priority_order:
      1: "Remove decayed memories (priority < 0.3)"
      2: "Summarize old conversation (> 7 days)"
      3: "Archive resolved findings"
      4: "Compress agent state history"
      5: "Remove duplicate index entries"

  preservation_rules:
    never_remove:
      - "Active decisions (not resolved)"
      - "Open findings (not resolved)"
      - "Explicit user preferences"
      - "Last 24 hours of conversation"

    always_preserve:
      - "Memories with priority > 0.7"
      - "User-pinned memories"
      - "Memories accessed in last 48 hours"
```

### 9.4 Size Monitoring

```typescript
interface SizeMonitor {
  getCurrentSize(sessionId: string): number
  getQuotaUtilization(sessionId: string): number

  // Breakdown by component
  getSizeBreakdown(sessionId: string): SizeBreakdown

  // Predictions
  predictTimeToQuota(sessionId: string): number  // days
  estimateCompactionGain(sessionId: string): number  // bytes
}

interface SizeBreakdown {
  total_bytes: number

  components: {
    conversation: number
    decisions: number
    findings: number
    preferences: number
    agent_states: number
    indexes: number
    artifacts: number
  }

  largest_files: Array<{
    path: string
    size_bytes: number
    percentage: number
  }>
}
```

---

## 10. Implementation Guidance

### 10.1 Technology Stack

```yaml
recommended_stack:
  language: "TypeScript (or Python)"
  rationale: "Type safety, async I/O, good YAML libraries"

  file_operations:
    library: "fs/promises (Node) or aiofiles (Python)"
    atomic_writes: "write to temp file + atomic rename"

  yaml_processing:
    library: "js-yaml (Node) or PyYAML (Python)"
    validation: "JSON Schema for structure validation"

  locking:
    library: "proper-lockfile (Node) or filelock (Python)"
    strategy: "Exclusive locks with stale detection"

  search_indexing:
    library: "Custom inverted index (simple) or MiniSearch (advanced)"
    persistence: "YAML files, rebuild on startup"
```

### 10.2 Core Classes

```typescript
// Main entry point
class SessionMemoryManager {
  constructor(
    private storage: StorageEngine,
    private indexManager: IndexManager,
    private lockManager: LockManager,
    private decayEngine: DecayEngine,
    private quotaManager: QuotaManager
  ) {}

  // Session operations
  createSession(userId: string, context: SessionContext): Session
  getSession(sessionId: string): Session
  deleteSession(sessionId: string, reason: string): void

  // Memory operations
  writeMemory(sessionId: string, memory: Memory): void
  readMemory(sessionId: string, memoryId: string): Memory
  queryMemories(sessionId: string, query: QuerySpec): Memory[]

  // Lifecycle
  compactSession(sessionId: string): CompactionResult
  archiveSession(sessionId: string): void
}

// Storage abstraction
class StorageEngine {
  async read(filePath: string): Promise<string>
  async write(filePath: string, content: string): Promise<void>
  async append(filePath: string, content: string): Promise<void>
  async delete(filePath: string): Promise<void>
  async exists(filePath: string): Promise<boolean>
  async getSize(filePath: string): Promise<number>
}

// Index management
class IndexManager {
  async buildTopicIndex(session: Session): Promise<TopicIndex>
  async buildTimelineIndex(session: Session): Promise<TimelineIndex>
  async buildAgentIndex(session: Session): Promise<AgentIndex>

  async updateIndex(indexType: string, update: IndexUpdate): Promise<void>

  async query(indexType: string, query: IndexQuery): Promise<IndexResult>
}
```

### 10.3 File Operations

```typescript
class AtomicFileWriter {
  async writeAtomic(filePath: string, content: string): Promise<void> {
    const tempPath = `${filePath}.tmp.${Date.now()}`;

    try {
      // Write to temp file
      await fs.writeFile(tempPath, content, 'utf8');

      // Atomic rename
      await fs.rename(tempPath, filePath);
    } catch (error) {
      // Clean up temp file on error
      await fs.unlink(tempPath).catch(() => {});
      throw error;
    }
  }

  async appendAtomic(filePath: string, content: string): Promise<void> {
    const lock = await this.lockManager.acquireLock(filePath, 5000);

    try {
      await fs.appendFile(filePath, content, 'utf8');
    } finally {
      await this.lockManager.releaseLock(lock);
    }
  }
}
```

### 10.4 Error Handling

```typescript
class MemoryPersistenceError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean,
    public sessionId?: string
  ) {
    super(message);
  }
}

enum ErrorCodes {
  QUOTA_EXCEEDED = "MEM_E001",
  LOCK_TIMEOUT = "MEM_E002",
  CORRUPTION_DETECTED = "MEM_E003",
  INVALID_QUERY = "MEM_E004",
  SESSION_NOT_FOUND = "MEM_E005",
  COMPACTION_FAILED = "MEM_E006"
}

// Error recovery
class ErrorRecovery {
  async handleError(error: MemoryPersistenceError): Promise<void> {
    switch (error.code) {
      case ErrorCodes.QUOTA_EXCEEDED:
        // Try compaction
        await this.compactSession(error.sessionId);
        break;

      case ErrorCodes.CORRUPTION_DETECTED:
        // Try repair from conversation log
        await this.repairFromConversation(error.sessionId);
        break;

      case ErrorCodes.LOCK_TIMEOUT:
        // Check for stale locks
        await this.cleanStaleLocks();
        break;
    }
  }
}
```

---

## 11. Integration with BMAD

### 11.1 Agent Integration

Agents access memory through a unified interface:

```typescript
// In agent execution context
class AgentMemoryInterface {
  private sessionId: string;
  private agentId: string;

  // Read operations
  async getConversationContext(turnCount: number = 20): Promise<Turn[]>
  async getRelevantDecisions(topic: string): Promise<Decision[]>
  async getRelevantFindings(topic: string): Promise<Finding[]>
  async getUserPreferences(topic?: string): Promise<Preference[]>

  // Write operations
  async recordDecision(decision: Decision): Promise<void>
  async recordFinding(finding: Finding): Promise<void>
  async recordPreference(preference: Preference): Promise<void>
  async updateAgentState(state: AgentState): Promise<void>

  // Query
  async query(query: string): Promise<Memory[]>
  async findSimilar(memoryId: string): Promise<Memory[]>
}
```

### 11.2 Workflow Integration

Workflows can specify memory requirements:

```yaml
# In workflow definition (e.g., deep-verify/workflow-v6.md)
workflow:
  metadata:
    id: "deep-verify-v6"
    name: "Deep Verify V6"

  memory_requirements:
    read_access:
      - "conversation.last_20_turns"
      - "decisions.by_topic:verification"
      - "findings.by_severity:critical"
      - "preferences.workflow_depth"

    write_access:
      - "findings"
      - "agent_states.veritas"

    memory_hints:
      - "Load past verification findings for comparison"
      - "Check user preferences for verification depth"

  phases:
    - name: "Phase 0: Self-Check"
      memory_usage:
        - type: "read"
          query: "past verifications on similar content"
          purpose: "Check for consistency in verification rigor"
```

### 11.3 MACP Integration

Memory persistence integrates with Multi-Agent Collaboration Protocol:

```yaml
# Agents share memory through session context
macp_integration:
  shared_context:
    source: "session memory persistence layer"

    inject_on_message:
      - conversation_history: "last 20 turns"
      - relevant_decisions: "by current topic"
      - active_findings: "unresolved only"
      - user_preferences: "applicable to current task"

    update_on_response:
      - agent_state: "current agent's working memory"
      - new_memories: "decisions, findings, learnings"
```

### 11.4 Party Mode Integration

In Party Mode (multi-agent discussions), memory is shared:

```yaml
party_mode_memory:
  shared_session: true

  memory_visibility:
    all_agents_can_read:
      - "conversation_history"
      - "decisions"
      - "findings"
      - "shared_preferences"

    agent_private:
      - "agent_states.{self}"
      - "working_memory.{self}"

  conflict_resolution:
    strategy: "collaborative"
    decision_recording: "capture all agent inputs"
    finding_aggregation: "merge similar findings"
```

---

## 12. Performance Characteristics

### 12.1 Expected Performance

```yaml
performance_targets:
  write_operations:
    record_memory: "< 10ms (no lock contention)"
    record_memory_locked: "< 50ms (with lock acquisition)"
    update_indexes: "< 20ms (batch updates)"

  read_operations:
    get_by_id: "< 5ms (direct file read)"
    query_by_topic: "< 50ms (index lookup)"
    query_by_time_range: "< 100ms (index scan)"
    complex_query: "< 200ms (multiple index joins)"

  lifecycle_operations:
    create_session: "< 100ms"
    compact_session: "< 5s (for 10MB session)"
    archive_session: "< 10s (compression)"
    delete_session: "< 100ms (move to deleted)"

  background_tasks:
    decay_update: "< 1s per session"
    index_rebuild: "< 10s per session"
```

### 12.2 Scalability Limits

```yaml
scalability:
  max_concurrent_sessions: 100
  max_session_size_mb: 10
  max_memories_per_session: 10000
  max_conversation_turns: 1000

  total_storage:
    max_active_sessions: "100 * 10MB = 1GB"
    max_archived_sessions: "Unlimited (user responsibility)"

  performance_degradation:
    - threshold: "5MB session size"
      impact: "Query latency increases 2x"
      mitigation: "Suggest compaction"

    - threshold: "500 conversation turns"
      impact: "Context injection slower"
      mitigation: "Automatic summarization"
```

### 12.3 Optimization Strategies

```yaml
optimizations:
  indexing:
    - "Topic index with inverted index structure"
    - "Timeline index with hour-bucket optimization"
    - "LRU cache for frequently accessed memories"

  file_operations:
    - "Batch writes where possible"
    - "Lazy index updates (flush every 10 writes)"
    - "Memory-mapped files for large sessions"

  query_optimization:
    - "Index-only queries when possible"
    - "Parallel file reads for multi-file queries"
    - "Query result caching for repeated queries"

  compaction:
    - "Incremental compaction (remove low-hanging fruit first)"
    - "Background compaction during idle periods"
    - "Predictive compaction (before hitting quota)"
```

---

## Appendix A: File Size Estimates

```yaml
typical_file_sizes:
  metadata.yaml: "2-5 KB"
  conversation.md: "50-500 KB (depends on turn count)"
  decisions.yaml: "10-100 KB"
  findings.yaml: "20-200 KB"
  preferences.yaml: "5-50 KB"
  agent_states/{agent}.yaml: "10-50 KB per agent"
  indexes/topics.yaml: "5-30 KB"
  indexes/timeline.yaml: "10-50 KB"
  indexes/agents.yaml: "2-10 KB"

  total_for_typical_session: "200 KB - 2 MB"
  total_for_large_session: "5 MB - 10 MB"
```

---

## Appendix B: Example Query Patterns

```typescript
// Pattern 1: Load context for agent
async function loadAgentContext(
  memory: SessionMemoryManager,
  sessionId: string,
  agentId: string
): Promise<AgentContext> {
  const [turns, decisions, findings, prefs, state] = await Promise.all([
    memory.queryMemories(sessionId, {
      filters: [{ field: "type", operator: "equals", value: "turn" }],
      sort: [{ field: "timestamp", direction: "desc" }],
      limit: 20
    }),
    memory.queryMemories(sessionId, {
      filters: [
        { field: "type", operator: "equals", value: "decision" },
        { field: "decay.priority", operator: "greaterThan", value: 0.5 }
      ]
    }),
    memory.queryMemories(sessionId, {
      filters: [
        { field: "type", operator: "equals", value: "finding" },
        { field: "resolution.status", operator: "equals", value: "open" }
      ]
    }),
    memory.queryMemories(sessionId, {
      filters: [{ field: "type", operator: "equals", value: "preference" }]
    }),
    memory.readMemory(sessionId, `agent-states/${agentId}`)
  ]);

  return {
    conversationHistory: turns,
    relevantDecisions: decisions,
    openFindings: findings,
    userPreferences: prefs,
    agentState: state
  };
}

// Pattern 2: Record verification findings
async function recordVerificationResults(
  memory: SessionMemoryManager,
  sessionId: string,
  results: VerificationResults
): Promise<void> {
  const transaction = memory.beginTransaction(sessionId);

  try {
    // Record findings
    for (const finding of results.findings) {
      transaction.writeMemory({
        type: "finding",
        ...finding,
        decay: { priority: 1.0, access_count: 0 }
      });
    }

    // Record verification decision
    transaction.writeMemory({
      type: "decision",
      decision: `Verification completed with ${results.findings.length} findings`,
      made_by: "veritas",
      decay: { priority: 0.95, access_count: 0 }
    });

    // Update agent state
    transaction.updateAgentState("veritas", {
      last_verification: new Date().toISOString(),
      findings_created: results.findings.map(f => f.id)
    });

    await transaction.commit();
  } catch (error) {
    transaction.rollback();
    throw error;
  }
}
```

---

## Appendix C: Migration Guide

For existing BMAD installations:

```yaml
migration_steps:
  1_backup:
    action: "Backup existing conversation logs and agent state"
    location: "{project}/.bmad/backup-pre-smp/"

  2_install:
    action: "Install SMP layer"
    command: "bmad install session-memory-persistence"

  3_migrate:
    action: "Migrate existing data to SMP format"
    script: "bmad migrate-to-smp"

    what_happens:
      - "Create session directories for recent conversations"
      - "Parse conversation logs into structured format"
      - "Extract decisions, findings, preferences from logs"
      - "Build initial indexes"
      - "Set initial decay priorities"

  4_validate:
    action: "Validate migration success"
    checks:
      - "All conversations preserved"
      - "No data loss"
      - "Indexes built correctly"
      - "Agents can access memories"

  5_cleanup:
    action: "Clean up old format (optional)"
    caution: "Keep backups for at least 30 days"
```

---

**End of Session Memory Persistence Architecture v1.0**
