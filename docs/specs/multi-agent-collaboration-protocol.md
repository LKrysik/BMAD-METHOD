# Multi-Agent Collaboration Protocol (MACP)

## Document Metadata
- **Version**: 1.0.0
- **Date**: 2026-01-10
- **Status**: Specification
- **Author**: System Architecture Team

---

## 1. Overview

### 1.1 Purpose

Define a comprehensive protocol enabling multiple specialized agents to collaborate on complex tasks. This specification establishes the communication patterns, message formats, sequencing rules, and error handling mechanisms required for reliable multi-agent coordination.

### 1.2 Goals

- Enable structured agent-to-agent communication
- Support request/response, broadcast, and subscription patterns
- Handle agent unavailability gracefully (timeout, failure)
- Prevent deadlocks in circular dependency scenarios
- Maintain conversation coherence across agent boundaries
- Provide priority levels for urgent communications
- Enable full observability of inter-agent traffic
- Enforce authorization for agent communication

### 1.3 Success Criteria

- Message delivery confirmation within defined SLA (configurable per priority)
- Zero undetected message loss
- Deadlock detection within 5 seconds, resolution within 30 seconds
- Conversation context preserved across 10+ agent handoffs
- Observer latency less than 100ms for traffic monitoring
- Authorization check latency less than 10ms

---

## 2. Core Concepts

### 2.1 Agent Identity

Every agent in the MACP ecosystem has a unique identity:

```yaml
agent_identity:
  id: "agent-{uuid}"                    # Unique identifier
  name: "architect"                     # Human-readable name
  type: "specialist"                    # agent type classification
  capabilities:                         # What this agent can do
    - "architecture-design"
    - "technical-review"
    - "pattern-analysis"
  authorization_groups:                 # Security groups
    - "core-agents"
    - "technical-domain"
  priority_ceiling: 3                   # Maximum priority level (1-5)
  status: "available"                   # Current availability
```

### 2.2 Agent Status States

```
                    +---------------+
                    |  INITIALIZING |
                    +-------+-------+
                            |
                            v
+------------+        +----------+        +-----------+
|  SUSPENDED |<------>| AVAILABLE |<------>|   BUSY    |
+------------+        +-----+----+        +-----------+
                            |
                            v
                    +---------------+
                    |  TERMINATED   |
                    +---------------+

Status Definitions:
- INITIALIZING: Agent is starting up, not ready for messages
- AVAILABLE: Ready to receive and process messages
- BUSY: Processing a request, can queue incoming messages
- SUSPENDED: Temporarily inactive, messages queued
- TERMINATED: Agent has shut down, no longer accepting messages
```

### 2.3 Conversation Context

Conversations span multiple agents while maintaining coherence:

```yaml
conversation_context:
  id: "conv-{uuid}"                     # Unique conversation identifier
  created_at: "2026-01-10T14:30:00Z"
  initiator: "agent-abc123"             # Original requester
  purpose: "Architecture review for payment module"
  participants:                         # Agents involved
    - agent_id: "agent-abc123"
      role: "requester"
      joined_at: "2026-01-10T14:30:00Z"
    - agent_id: "agent-def456"
      role: "responder"
      joined_at: "2026-01-10T14:30:05Z"
  state:                                # Conversation state
    current_phase: "analysis"
    shared_artifacts:
      - type: "document"
        ref: "artifact-789"
    decisions: []
  thread_depth: 0                       # Nesting level for sub-conversations
  parent_conversation: null             # Link to parent if sub-conversation
  ttl_minutes: 60                       # Auto-expire after inactivity
```

---

## 3. Communication Patterns

### 3.1 Pattern Overview

| Pattern | Use Case | Synchronous | Guaranteed Delivery |
|---------|----------|-------------|---------------------|
| Request/Response | Direct queries, task delegation | Yes | Yes |
| Broadcast | Announcements, state changes | No | Best-effort |
| Subscription | Event-driven updates | No | Yes (to subscribers) |
| Streaming | Large data, progress updates | Partial | Yes |

### 3.2 Request/Response Pattern

The fundamental pattern for direct agent-to-agent communication.

```
+-----------+                          +-----------+
|  Agent A  |                          |  Agent B  |
| (Requester)|                          | (Responder)|
+-----+-----+                          +-----+-----+
      |                                      |
      |  ------- REQUEST ---------------->   |
      |          {message_id, payload}       |
      |                                      |
      |                                 +----+----+
      |                                 | Process |
      |                                 +----+----+
      |                                      |
      |  <------ RESPONSE ----------------   |
      |          {correlation_id, result}    |
      |                                      |
```

**Sequence Rules:**
1. Requester sends REQUEST with unique `message_id`
2. Responder acknowledges within `ack_timeout_ms` (default: 1000ms)
3. Responder processes and sends RESPONSE with `correlation_id` = original `message_id`
4. Requester confirms receipt with implicit ACK (next message) or explicit ACK
5. If no response within `response_timeout_ms`, requester initiates retry or failover

### 3.3 Broadcast Pattern

For disseminating information to multiple agents simultaneously.

```
                    +-----------+
                    |  Agent A  |
                    |(Broadcaster)|
                    +-----+-----+
                          |
                          | BROADCAST
                          | {topic, payload}
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
    +-----------+   +-----------+   +-----------+
    |  Agent B  |   |  Agent C  |   |  Agent D  |
    | (Listener)|   | (Listener)|   | (Listener)|
    +-----------+   +-----------+   +-----------+
```

**Broadcast Scopes:**
- `all`: All registered agents
- `group:{name}`: Agents in specific authorization group
- `capability:{name}`: Agents with specific capability
- `exclude:{agent_ids}`: All except specified agents

**Delivery Semantics:**
- Best-effort delivery (no guaranteed ordering)
- No acknowledgment required
- Dead-letter queue for failed deliveries (optional)

### 3.4 Subscription Pattern

For event-driven, loosely-coupled communication.

```
+-----------+        +-----------------+        +-----------+
|  Agent A  |        |  Message Router |        |  Agent B  |
| (Publisher)|        |  (Coordinator)  |        | (Subscriber)|
+-----+-----+        +--------+--------+        +-----+-----+
      |                       |                       |
      |                       |  <-- SUBSCRIBE -----  |
      |                       |      {topic, filters} |
      |                       |                       |
      |                       |  ------ ACK ------->  |
      |                       |  {subscription_id}    |
      |                       |                       |
      |  ---- PUBLISH ---->   |                       |
      |  {topic, event}       |                       |
      |                       |                       |
      |                       |  ---- NOTIFY ------>  |
      |                       |  {subscription_id,    |
      |                       |   event}              |
      |                       |                       |
```

**Subscription Management:**

```yaml
subscription:
  id: "sub-{uuid}"
  subscriber: "agent-def456"
  topic: "architecture.decisions"       # Hierarchical topic
  filters:                              # Optional content filters
    severity: ["critical", "high"]
    domain: "payment"
  delivery_mode: "push"                 # push | pull
  batch_size: 1                         # Events per notification
  expiry: "2026-01-11T14:30:00Z"       # Auto-unsubscribe time
```

### 3.5 Streaming Pattern

For large data transfers or progress updates.

```
+-----------+                          +-----------+
|  Agent A  |                          |  Agent B  |
| (Producer)|                          | (Consumer)|
+-----+-----+                          +-----+-----+
      |                                      |
      |  ------- STREAM_INIT ------------>   |
      |          {stream_id, metadata}       |
      |                                      |
      |  <------ STREAM_READY -------------  |
      |          {window_size}               |
      |                                      |
      |  ------- STREAM_CHUNK [1] ------->   |
      |  ------- STREAM_CHUNK [2] ------->   |
      |  ------- STREAM_CHUNK [3] ------->   |
      |                                      |
      |  <------ STREAM_ACK ---------------  |
      |          {last_received: 3}          |
      |                                      |
      |  ------- STREAM_CHUNK [4] ------->   |
      |  ------- STREAM_END ------------->   |
      |          {checksum}                  |
      |                                      |
      |  <------ STREAM_COMPLETE ----------  |
      |          {status, checksum_valid}    |
      |                                      |
```

**Flow Control:**
- Window-based flow control prevents overwhelming receivers
- Checksum validation ensures data integrity
- Resume capability for interrupted streams

---

## 4. Message Format

### 4.1 Message Envelope

All messages use a common envelope structure:

```yaml
message:
  # --- Header (Required) ---
  header:
    message_id: "msg-{uuid}"            # Unique message identifier
    correlation_id: "msg-{parent-uuid}" # Links to original request
    conversation_id: "conv-{uuid}"      # Conversation context
    timestamp: "2026-01-10T14:30:00.123Z"
    version: "1.0"                      # Protocol version

  # --- Routing (Required) ---
  routing:
    source: "agent-abc123"              # Sender identity
    destination: "agent-def456"         # Target (or broadcast scope)
    pattern: "request"                  # request|response|broadcast|notify|stream

  # --- Priority & QoS (Required) ---
  qos:
    priority: 3                         # 1 (highest) to 5 (lowest)
    ttl_seconds: 300                    # Message expiry
    require_ack: true                   # Acknowledgment needed
    retry_policy: "exponential"         # none|fixed|exponential
    max_retries: 3

  # --- Security (Required) ---
  security:
    auth_token: "{jwt-token}"           # Authorization token
    signature: "{hmac-signature}"       # Message integrity
    encryption: "none"                  # none|aes256

  # --- Payload (Required) ---
  payload:
    type: "task_request"                # Payload schema type
    content: { }                        # Actual content
    attachments: []                     # Referenced artifacts

  # --- Tracing (Optional) ---
  tracing:
    trace_id: "trace-{uuid}"            # Distributed trace ID
    span_id: "span-{uuid}"              # Current span
    parent_span_id: "span-{parent-uuid}"
    baggage:                            # Propagated context
      user_id: "user-789"
      session_id: "session-xyz"
```

### 4.2 Message Types

#### 4.2.1 Task Request

```yaml
payload:
  type: "task_request"
  content:
    task_type: "review"                 # Task classification
    description: "Review architecture design for payment module"
    context:                            # Required context
      artifacts:
        - ref: "artifact-001"
          type: "document"
          name: "payment-architecture.md"
      constraints:
        deadline: "2026-01-10T16:00:00Z"
        max_tokens: 5000
    expected_output:
      format: "structured_review"
      schema_ref: "schemas/review-output.json"
```

#### 4.2.2 Task Response

```yaml
payload:
  type: "task_response"
  content:
    status: "completed"                 # completed|partial|failed|delegated
    result:
      findings:
        - severity: "high"
          category: "scalability"
          description: "Database connection pooling not configured"
          recommendation: "Implement connection pool with max 50 connections"
      summary: "Architecture review identified 3 issues, 1 high severity"
    metadata:
      processing_time_ms: 2340
      tokens_used: 1250
      delegated_to: null
```

#### 4.2.3 Broadcast Announcement

```yaml
payload:
  type: "broadcast"
  content:
    topic: "agent.status"
    event: "capability_added"
    data:
      agent_id: "agent-abc123"
      capability: "security-analysis"
      effective_from: "2026-01-10T14:30:00Z"
```

#### 4.2.4 Subscription Event

```yaml
payload:
  type: "subscription_event"
  content:
    subscription_id: "sub-xyz789"
    topic: "architecture.decisions"
    event:
      type: "decision_made"
      data:
        decision_id: "dec-001"
        title: "Use PostgreSQL for primary database"
        made_by: "agent-architect-001"
        rationale: "ACID compliance required for financial transactions"
```

### 4.3 Priority Levels

| Level | Name | Use Case | SLA Target |
|-------|------|----------|------------|
| 1 | CRITICAL | System failures, security incidents | < 100ms |
| 2 | HIGH | Time-sensitive decisions, blocking requests | < 500ms |
| 3 | NORMAL | Standard task requests, reviews | < 5s |
| 4 | LOW | Background processing, batch operations | < 30s |
| 5 | DEFERRED | Analytics, non-urgent updates | Best-effort |

**Priority Handling Rules:**
1. Higher priority messages preempt lower priority processing
2. Priority 1-2 bypass normal queue ordering
3. Priority escalation allowed after timeout (configurable)
4. Priority ceiling enforced per agent (prevent abuse)

---

## 5. Agent Unavailability Handling

### 5.1 Detection Mechanisms

```
+-------------------------------------------------------------------+
|                    Unavailability Detection                        |
+-------------------------------------------------------------------+
|                                                                    |
|  +-------------+    +-------------+    +---------------------+    |
|  |  Heartbeat  |    |   Timeout   |    |  Explicit Signal    |    |
|  |  Monitor    |    |   Detector  |    |  Handler            |    |
|  +------+------+    +------+------+    +----------+----------+    |
|         |                  |                      |               |
|    Every 10s          Per-message            Agent reports        |
|    health check       timeout tracking       SUSPENDED/TERMINATED |
|         |                  |                      |               |
|         +------------------+----------------------+               |
|                            |                                      |
|                            v                                      |
|                   +------------------+                            |
|                   |  Availability    |                            |
|                   |  State Machine   |                            |
|                   +------------------+                            |
|                                                                    |
+-------------------------------------------------------------------+
```

### 5.2 Timeout Configuration

```yaml
timeout_config:
  heartbeat:
    interval_ms: 10000                  # Heartbeat frequency
    miss_threshold: 3                   # Consecutive misses before unavailable

  message_timeouts:
    ack_timeout_ms: 1000                # Time to acknowledge receipt
    processing_timeout_ms:              # Time to complete processing
      priority_1: 5000
      priority_2: 15000
      priority_3: 60000
      priority_4: 300000
      priority_5: null                  # No timeout for deferred

  connection:
    connect_timeout_ms: 5000            # Initial connection
    idle_timeout_ms: 300000             # Disconnect after idle
    reconnect_delay_ms: 1000            # Initial reconnect delay
    reconnect_max_delay_ms: 30000       # Maximum backoff
    reconnect_multiplier: 2.0           # Exponential backoff factor
```

### 5.3 Failure Response Strategies

```yaml
failure_strategies:
  retry:
    enabled: true
    policy: "exponential"               # none|fixed|exponential|circuit_breaker
    initial_delay_ms: 100
    max_delay_ms: 10000
    multiplier: 2.0
    max_attempts: 3
    jitter: true                        # Add randomness to prevent thundering herd

  failover:
    enabled: true
    strategy: "capability_match"        # capability_match|explicit_backup|broadcast
    backup_agents:                      # For explicit_backup strategy
      - "agent-backup-001"
      - "agent-backup-002"
    capability_match:                   # For capability_match strategy
      required: ["architecture-design"]
      preferred: ["high-availability"]

  circuit_breaker:
    enabled: true
    failure_threshold: 5                # Failures before opening
    success_threshold: 3                # Successes to close
    timeout_ms: 60000                   # Time in open state
    half_open_requests: 1               # Requests in half-open state

  dead_letter:
    enabled: true
    queue: "dlq-{source_agent}"
    retention_hours: 24
    alert_threshold: 10                 # Alert after N failed messages
```

### 5.4 Failover Sequence

```
Agent A                    Coordinator                  Agent B (Primary)    Agent C (Backup)
   |                            |                              |                   |
   | -- REQUEST -------------> |                              |                   |
   |                            | -- FORWARD ---------------> |                   |
   |                            |                              |                   |
   |                            |        [Timeout - No Response]                   |
   |                            |                              |                   |
   |                            | -- RETRY (1) -------------> |                   |
   |                            |                              |                   |
   |                            |        [Timeout - No Response]                   |
   |                            |                              |                   |
   |                            | -- FAILOVER ---------------------------------->  |
   |                            |                                                  |
   |                            | <-------------------------------- RESPONSE ----- |
   |                            |                                                  |
   | <-- RESPONSE ------------ |                                                  |
   |     (with failover_info)   |                                                  |
```

---

## 6. Deadlock Prevention

### 6.1 Circular Dependency Detection

Deadlocks occur when agents form circular wait chains. MACP prevents this through:

```
+-----------------------------------------------------------------------------+
|                        Deadlock Prevention Architecture                      |
+-----------------------------------------------------------------------------+
|                                                                              |
|   +------------------+     +------------------+     +--------------------+   |
|   |  Wait-For Graph  |     |  Timeout-Based   |     |  Request Priority  |   |
|   |  Detection       |     |  Prevention      |     |  Ordering          |   |
|   +--------+---------+     +--------+---------+     +----------+---------+   |
|            |                        |                          |             |
|   Track all pending         Abort waiting after        Higher priority      |
|   request dependencies      configurable timeout       requests preempt     |
|            |                        |                          |             |
|            +------------------------+--------------------------|             |
|                                     |                                        |
|                                     v                                        |
|                          +-------------------+                               |
|                          |  Deadlock Handler |                               |
|                          +-------------------+                               |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 6.2 Wait-For Graph

The coordinator maintains a real-time dependency graph:

```yaml
wait_for_graph:
  nodes:
    - agent_id: "agent-a"
      status: "waiting"
      waiting_for: "agent-b"
      since: "2026-01-10T14:30:00Z"
      request_id: "msg-001"

    - agent_id: "agent-b"
      status: "waiting"
      waiting_for: "agent-c"
      since: "2026-01-10T14:30:01Z"
      request_id: "msg-002"

    - agent_id: "agent-c"
      status: "waiting"
      waiting_for: "agent-a"           # Cycle detected!
      since: "2026-01-10T14:30:02Z"
      request_id: "msg-003"

  # Cycle: A -> B -> C -> A
  detected_cycles:
    - cycle_id: "cycle-001"
      agents: ["agent-a", "agent-b", "agent-c"]
      detected_at: "2026-01-10T14:30:05Z"
      oldest_request: "msg-001"
```

### 6.3 Deadlock Resolution

```yaml
deadlock_resolution:
  detection:
    check_interval_ms: 1000             # Cycle detection frequency
    max_wait_depth: 10                  # Maximum chain length before forced break

  resolution_strategy: "youngest_abort" # youngest_abort|priority_abort|random_abort

  strategies:
    youngest_abort:                     # Abort most recently blocked request
      description: "Abort request that was blocked last"
      preference: "preserves_long_running_work"

    priority_abort:                     # Abort lowest priority request
      description: "Abort lowest priority request in cycle"
      preference: "preserves_important_work"

    random_abort:                       # Random selection with backoff
      description: "Randomly select request to abort"
      preference: "fairness"

  on_resolution:
    notify_affected: true               # Inform all agents in cycle
    retry_aborted: true                 # Auto-retry aborted request
    retry_delay_ms: 500                 # Delay before retry
    add_jitter: true                    # Randomize retry timing
```

### 6.4 Prevention Techniques

**1. Request Timeouts:**
```yaml
request_timeout:
  default_ms: 30000
  per_priority:
    1: 5000
    2: 15000
    3: 30000
    4: 60000
    5: 300000
  on_timeout: "abort_and_notify"
```

**2. Resource Ordering:**
```yaml
resource_ordering:
  enabled: true
  # Agents must acquire resources in consistent order
  # E.g., always request A before B if both needed
  order_key: "agent_id"                 # Lexicographic ordering by ID
```

**3. Request Cancellation:**
```yaml
cancellation:
  enabled: true
  propagate: true                       # Cancel downstream requests
  grace_period_ms: 1000                 # Time for cleanup
```

---

## 7. Conversation Coherence

### 7.1 Context Propagation

Every message carries conversation context to maintain coherence across agent boundaries:

```yaml
conversation_context:
  # Core identity
  id: "conv-{uuid}"
  created_at: "2026-01-10T14:30:00Z"

  # Hierarchical threading
  thread:
    root_id: "conv-root-{uuid}"         # Original conversation
    parent_id: "conv-parent-{uuid}"     # Immediate parent
    depth: 2                            # Nesting level
    max_depth: 5                        # Prevent infinite nesting

  # Participant tracking
  participants:
    active:
      - agent_id: "agent-abc"
        role: "primary_analyst"
        joined_at: "2026-01-10T14:30:00Z"
    historical:
      - agent_id: "agent-xyz"
        role: "initial_requester"
        left_at: "2026-01-10T14:31:00Z"
        reason: "delegated"

  # Shared understanding
  shared_state:
    topic: "Payment system architecture review"
    objective: "Identify scalability bottlenecks"
    constraints:
      - "Must support 10K TPS"
      - "Max latency 100ms p99"
    decisions:
      - id: "dec-001"
        statement: "Use PostgreSQL for transactions"
        made_by: "agent-architect"
        timestamp: "2026-01-10T14:35:00Z"
    artifacts:
      - ref: "artifact-001"
        type: "document"
        summary: "Architecture diagram v2"
        added_by: "agent-abc"

  # Progress tracking
  progress:
    phases_completed: ["discovery", "analysis"]
    current_phase: "recommendations"
    remaining_phases: ["review", "finalization"]
```

### 7.2 Context Synchronization

```
Agent A                    Coordinator                    Agent B
   |                            |                            |
   | -- REQUEST ------------->  |                            |
   |    {context: snapshot_v1}  |                            |
   |                            | -- FORWARD --------------> |
   |                            |    {context: snapshot_v1}  |
   |                            |                            |
   |                            | <---- RESPONSE ----------- |
   |                            |   {context_update: delta}  |
   |                            |                            |
   |                       +----+----+                       |
   |                       | Merge   |                       |
   |                       | Context |                       |
   |                       +----+----+                       |
   |                            |                            |
   | <-- CONTEXT_SYNC -------- |                            |
   |     {context: snapshot_v2} |                            |
   |                            | -- CONTEXT_SYNC ---------> |
   |                            |    {context: snapshot_v2}  |
```

### 7.3 Context Conflict Resolution

When multiple agents update context concurrently:

```yaml
conflict_resolution:
  strategy: "last_writer_wins"          # last_writer_wins|merge|manual

  merge_rules:
    decisions:
      duplicate_check: "statement_hash"
      action: "keep_both"

    artifacts:
      duplicate_check: "ref"
      action: "keep_newest"

    participants:
      action: "union"

  on_conflict:
    log: true
    notify_participants: true
    require_resolution: false           # Block until resolved
```

### 7.4 Context Handoff

When delegating work to another agent:

```yaml
handoff:
  type: "full"                          # full|partial|summary

  full:
    description: "Transfer complete context"
    includes:
      - conversation_history
      - shared_state
      - artifacts
      - decisions

  partial:
    description: "Transfer relevant subset"
    includes:
      - relevant_history                # LLM-summarized
      - current_state
      - required_artifacts

  summary:
    description: "Condensed handoff for new participants"
    includes:
      - objective
      - key_decisions
      - current_phase
      - required_actions
```

---

## 8. Observability

### 8.1 Observation Architecture

```
+-----------------------------------------------------------------------------+
|                         Observability Layer                                  |
+-----------------------------------------------------------------------------+
|                                                                              |
|   +----------------+   +----------------+   +----------------------------+   |
|   |  Message Tap   |   |  Metric        |   |  Trace Collector          |   |
|   |  (Wire-level)  |   |  Aggregator    |   |  (Distributed Tracing)    |   |
|   +-------+--------+   +-------+--------+   +-------------+--------------+   |
|           |                    |                          |                  |
|           |              +-----+-----+                    |                  |
|           |              | Time-Series|                   |                  |
|           |              | Database   |                   |                  |
|           |              +-----------+                    |                  |
|           |                                               |                  |
|           v                                               v                  |
|   +--------------------------------------------------------------------+    |
|   |                      Observation Store                              |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   |   |  Message    |  |  Metrics    |  |  Traces                 |    |    |
|   |   |  Archive    |  |  Storage    |  |  Storage                |    |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   +--------------------------------------------------------------------+    |
|                                    |                                         |
|                                    v                                         |
|   +--------------------------------------------------------------------+    |
|   |                      Observation Consumers                          |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   |   |  Dashboard  |  |  Alerting   |  |  Audit Log              |    |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   +--------------------------------------------------------------------+    |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 8.2 Message Observation

All inter-agent traffic can be observed without modification:

```yaml
observation_tap:
  mode: "passive"                       # passive|active

  capture:
    messages: true                      # Capture message content
    metadata_only: false                # If true, redact payload
    sampling_rate: 1.0                  # 1.0 = capture all

  filters:
    include_patterns:
      - "request|response"
    exclude_patterns:
      - "heartbeat"
    priority_min: 1
    priority_max: 5
    agents:
      include: []                       # Empty = all
      exclude: ["agent-internal-*"]

  output:
    format: "jsonl"                     # jsonl|protobuf
    destination: "file://./observation.jsonl"
    rotation:
      max_size_mb: 100
      max_files: 10
    realtime_stream: true               # Enable live streaming
```

### 8.3 Metrics Collection

```yaml
metrics:
  # Message metrics
  messages:
    - name: "macp_messages_total"
      type: "counter"
      labels: ["source", "destination", "pattern", "priority"]

    - name: "macp_message_latency_seconds"
      type: "histogram"
      labels: ["source", "destination", "pattern"]
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0, 5.0]

    - name: "macp_message_size_bytes"
      type: "histogram"
      labels: ["pattern"]
      buckets: [100, 1000, 10000, 100000, 1000000]

  # Agent metrics
  agents:
    - name: "macp_agent_status"
      type: "gauge"
      labels: ["agent_id", "status"]

    - name: "macp_agent_queue_depth"
      type: "gauge"
      labels: ["agent_id", "priority"]

    - name: "macp_agent_processing_time_seconds"
      type: "histogram"
      labels: ["agent_id", "task_type"]

  # System metrics
  system:
    - name: "macp_conversations_active"
      type: "gauge"
      labels: []

    - name: "macp_deadlocks_detected_total"
      type: "counter"
      labels: ["resolution_strategy"]

    - name: "macp_failovers_total"
      type: "counter"
      labels: ["reason", "success"]
```

### 8.4 Distributed Tracing

```yaml
tracing:
  enabled: true

  propagation:
    format: "w3c"                       # w3c|b3|jaeger
    headers:
      - "traceparent"
      - "tracestate"

  sampling:
    strategy: "probabilistic"           # always|never|probabilistic|rate_limiting
    probability: 0.1                    # 10% of traces
    priority_override:                  # Always trace high priority
      priority_max: 2

  export:
    format: "otlp"                      # otlp|jaeger|zipkin
    endpoint: "http://localhost:4317"
    batch_size: 100
    timeout_ms: 5000
```

### 8.5 Audit Logging

```yaml
audit:
  enabled: true

  events:
    - category: "authorization"
      actions: ["auth_success", "auth_failure", "permission_denied"]

    - category: "conversation"
      actions: ["created", "joined", "left", "terminated"]

    - category: "message"
      actions: ["sent", "received", "failed", "retried"]

    - category: "system"
      actions: ["agent_started", "agent_stopped", "deadlock_detected"]

  format:
    timestamp: "iso8601"
    fields:
      - "event_id"
      - "timestamp"
      - "category"
      - "action"
      - "actor"
      - "target"
      - "outcome"
      - "details"

  retention:
    days: 90
    archive: true
```

---

## 9. Security & Authorization

### 9.1 Security Architecture

```
+-----------------------------------------------------------------------------+
|                          Security Layer                                      |
+-----------------------------------------------------------------------------+
|                                                                              |
|   +--------------------------------------------------------------------+    |
|   |                    Authentication                                   |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   |   |  Agent      |  |  Token      |  |  Certificate            |    |    |
|   |   |  Registry   |  |  Validator  |  |  Validator              |    |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   +--------------------------------------------------------------------+    |
|                                    |                                         |
|                                    v                                         |
|   +--------------------------------------------------------------------+    |
|   |                    Authorization                                    |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   |   |  Policy     |  |  ACL        |  |  Rate                   |    |    |
|   |   |  Engine     |  |  Checker    |  |  Limiter                |    |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   +--------------------------------------------------------------------+    |
|                                    |                                         |
|                                    v                                         |
|   +--------------------------------------------------------------------+    |
|   |                    Message Security                                 |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   |   |  Signing    |  |  Encryption |  |  Integrity              |    |    |
|   |   |  (HMAC)     |  |  (AES-256)  |  |  Validation             |    |    |
|   |   +-------------+  +-------------+  +-------------------------+    |    |
|   +--------------------------------------------------------------------+    |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 9.2 Agent Authentication

```yaml
authentication:
  method: "jwt"                         # jwt|mtls|api_key

  jwt:
    issuer: "macp-coordinator"
    audience: "macp-agents"
    algorithm: "RS256"
    key_rotation_days: 30
    claims:
      required:
        - "agent_id"
        - "capabilities"
        - "authorization_groups"
      optional:
        - "priority_ceiling"

  token_refresh:
    enabled: true
    interval_minutes: 15
    grace_period_minutes: 5
```

### 9.3 Authorization Policies

```yaml
authorization:
  model: "rbac_with_attributes"         # rbac|abac|rbac_with_attributes

  # Authorization groups define who can communicate with whom
  groups:
    core-agents:
      members: ["bmad-master", "architect", "analyst"]
      can_communicate_with:
        - "core-agents"
        - "specialist-agents"
        - "utility-agents"

    specialist-agents:
      members: ["security-engineer", "performance-analyst"]
      can_communicate_with:
        - "core-agents"
        - "specialist-agents"

    utility-agents:
      members: ["formatter", "validator"]
      can_communicate_with:
        - "core-agents"

  # Capability-based permissions
  capabilities:
    broadcast:
      allowed_scopes:
        "core-agents": ["all", "group:*"]
        "specialist-agents": ["group:specialist-agents"]
        "utility-agents": []            # Cannot broadcast

    priority:
      "core-agents":
        max_priority: 1
      "specialist-agents":
        max_priority: 2
      "utility-agents":
        max_priority: 4

  # Explicit deny rules (override allows)
  deny_rules:
    - source: "utility-agents"
      destination: "specialist-agents"
      pattern: "request"
      reason: "Utility agents cannot make requests to specialists"
```

### 9.4 Communication ACL

```yaml
access_control_list:
  # Format: source_agent -> destination_agent: permissions

  entries:
    - source: "agent-architect"
      destination: "agent-analyst"
      permissions:
        patterns: ["request", "response", "broadcast"]
        topics: ["architecture.*", "analysis.*"]
        priority_range: [1, 5]

    - source: "agent-analyst"
      destination: "agent-architect"
      permissions:
        patterns: ["request", "response"]
        topics: ["analysis.*"]
        priority_range: [2, 5]

    - source: "*"                       # Wildcard for all agents
      destination: "agent-coordinator"
      permissions:
        patterns: ["request"]
        topics: ["system.*"]
        priority_range: [1, 5]

  default_action: "deny"                # deny|allow
```

### 9.5 Message Integrity

```yaml
message_security:
  signing:
    enabled: true
    algorithm: "hmac-sha256"
    key_derivation: "per_agent"         # shared|per_agent|per_conversation
    include_fields:
      - "header"
      - "routing"
      - "payload"

  encryption:
    enabled: false                      # Optional
    algorithm: "aes-256-gcm"
    key_exchange: "ecdh"
    encrypt_fields:
      - "payload.content"

  validation:
    check_signature: true
    check_timestamp: true               # Reject stale messages
    timestamp_tolerance_seconds: 30
    check_replay: true                  # Prevent replay attacks
    replay_window_seconds: 300
```

### 9.6 Rate Limiting

```yaml
rate_limiting:
  enabled: true

  limits:
    per_agent:
      requests_per_second: 100
      requests_per_minute: 1000
      burst_size: 50

    per_conversation:
      messages_per_minute: 200

    per_priority:
      priority_1:
        requests_per_second: 10         # Limit high priority abuse
      priority_5:
        requests_per_second: 1000       # Allow more low priority

  on_limit_exceeded:
    action: "reject"                    # reject|queue|throttle
    response_code: 429
    retry_after_seconds: 60
    notify: true
```

---

## 10. Error Handling

### 10.1 Error Categories

```yaml
error_categories:
  transport:
    - code: "E1001"
      name: "CONNECTION_FAILED"
      description: "Unable to establish connection to agent"
      recoverable: true
      retry: true

    - code: "E1002"
      name: "CONNECTION_TIMEOUT"
      description: "Connection timed out"
      recoverable: true
      retry: true

    - code: "E1003"
      name: "CONNECTION_CLOSED"
      description: "Connection unexpectedly closed"
      recoverable: true
      retry: true

  protocol:
    - code: "E2001"
      name: "INVALID_MESSAGE_FORMAT"
      description: "Message does not conform to protocol"
      recoverable: false
      retry: false

    - code: "E2002"
      name: "UNSUPPORTED_VERSION"
      description: "Protocol version not supported"
      recoverable: false
      retry: false

    - code: "E2003"
      name: "MISSING_REQUIRED_FIELD"
      description: "Required field missing from message"
      recoverable: false
      retry: false

  authorization:
    - code: "E3001"
      name: "AUTHENTICATION_FAILED"
      description: "Agent authentication failed"
      recoverable: false
      retry: false

    - code: "E3002"
      name: "PERMISSION_DENIED"
      description: "Agent not authorized for this action"
      recoverable: false
      retry: false

    - code: "E3003"
      name: "RATE_LIMIT_EXCEEDED"
      description: "Request rate limit exceeded"
      recoverable: true
      retry: true
      retry_after: true

  processing:
    - code: "E4001"
      name: "PROCESSING_TIMEOUT"
      description: "Agent did not complete processing in time"
      recoverable: true
      retry: true

    - code: "E4002"
      name: "PROCESSING_FAILED"
      description: "Agent encountered error during processing"
      recoverable: true
      retry: true

    - code: "E4003"
      name: "CAPABILITY_UNAVAILABLE"
      description: "Required capability not available"
      recoverable: false
      retry: false

  coordination:
    - code: "E5001"
      name: "DEADLOCK_DETECTED"
      description: "Circular dependency detected"
      recoverable: true
      retry: true

    - code: "E5002"
      name: "CONVERSATION_EXPIRED"
      description: "Conversation context no longer valid"
      recoverable: false
      retry: false

    - code: "E5003"
      name: "AGENT_UNAVAILABLE"
      description: "Target agent is not available"
      recoverable: true
      retry: true
```

### 10.2 Error Response Format

```yaml
error_response:
  header:
    message_id: "msg-{uuid}"
    correlation_id: "msg-{original-uuid}"
    conversation_id: "conv-{uuid}"
    timestamp: "2026-01-10T14:30:00.123Z"

  routing:
    source: "agent-responder"
    destination: "agent-requester"
    pattern: "error"

  error:
    code: "E4001"
    category: "processing"
    name: "PROCESSING_TIMEOUT"
    message: "Request processing exceeded 30 second timeout"
    details:
      timeout_ms: 30000
      elapsed_ms: 30145
      phase: "analysis"
    recoverable: true
    retry_info:
      suggested: true
      delay_ms: 1000
      max_attempts: 3

  context:
    original_request:
      summary: "Architecture review request"
      size_bytes: 1500
    agent_state:
      status: "busy"
      queue_depth: 5
```

### 10.3 Error Recovery Flows

```
+--------------------------------------------------------------------------+
|                        Error Recovery Decision Tree                       |
+--------------------------------------------------------------------------+
|                                                                           |
|   Error Received                                                          |
|        |                                                                  |
|        v                                                                  |
|   +------------+                                                          |
|   |Recoverable?|                                                          |
|   +-----+------+                                                          |
|         |                                                                 |
|    +----+----+                                                            |
|    |         |                                                            |
|   Yes        No                                                           |
|    |         |                                                            |
|    v         v                                                            |
| +----------+  +-------------+                                             |
| |Retry     |  |Abort        |                                             |
| |Policy?   |  |& Notify     |                                             |
| +----+-----+  +-------------+                                             |
|      |                                                                    |
| +----+--------------------+                                               |
| |                         |                                               |
| v                         v                                               |
| Retries                  No Retries                                       |
| Remaining                Remaining                                        |
| |                         |                                               |
| v                         v                                               |
| +------------+   +----------------+                                       |
| |Wait &      |   |Failover        |                                       |
| |Retry       |   |Available?      |                                       |
| +------------+   +-------+--------+                                       |
|                          |                                                |
|                     +----+----+                                           |
|                     |         |                                           |
|                    Yes        No                                          |
|                     |         |                                           |
|                     v         v                                           |
|              +----------+  +-------------+                                |
|              |Failover  |  |Dead Letter  |                                |
|              |to Backup |  |Queue        |                                |
|              +----------+  +-------------+                                |
|                                                                           |
+--------------------------------------------------------------------------+
```

### 10.4 Dead Letter Queue

```yaml
dead_letter_queue:
  enabled: true

  storage:
    path: "./dlq/{agent_id}"
    format: "jsonl"
    rotation:
      max_size_mb: 100
      max_age_hours: 24

  entry_format:
    original_message: { }               # Complete original message
    error: { }                          # Error that caused DLQ
    attempts:
      - timestamp: "2026-01-10T14:30:00Z"
        error_code: "E4001"
        agent: "agent-primary"
      - timestamp: "2026-01-10T14:30:05Z"
        error_code: "E4001"
        agent: "agent-backup"
    created_at: "2026-01-10T14:30:10Z"
    expires_at: "2026-01-11T14:30:10Z"

  processing:
    auto_retry:
      enabled: true
      interval_minutes: 60
      max_attempts: 5
    manual_intervention:
      alert_threshold: 10               # Alert after N entries
      notification_channel: "ops-alerts"
```

---

## 11. Implementation Guidance

### 11.1 Component Dependencies

```
+-----------------------------------------------------------------------------+
|                     Component Dependency Graph                               |
+-----------------------------------------------------------------------------+
|                                                                              |
|   Level 0 (Foundation):                                                      |
|   +-------------+  +-------------+  +---------------------------------+      |
|   |  Message    |  |  Agent      |  |  Configuration                  |      |
|   |  Format     |  |  Registry   |  |  Manager                        |      |
|   +------+------+  +------+------+  +---------------+-----------------+      |
|          |                |                         |                        |
|   Level 1 (Transport):    |                         |                        |
|   +------+------+  +------+------+  +---------------+-------------------+    |
|   |  Message    |  |  Auth       |  |  Observation                      |    |
|   |  Router     |  |  Manager    |  |  Subsystem                        |    |
|   +------+------+  +------+------+  +-----------------------------------+    |
|          |               |                                                   |
|   Level 2 (Patterns):    |                                                   |
|   +------+---------------+-------------------------------------------+       |
|   |  Request/Response |  Broadcast  |  Subscription  |  Streaming    |       |
|   +------------------+-------------+----------------+----------------+       |
|                                                   |                          |
|   Level 3 (Coordination):                         |                          |
|   +------------------+-------------+--------------+------------------+       |
|   |  Conversation    |  Deadlock   |  Failover    |  Error           |       |
|   |  Manager         |  Detector   |  Handler     |  Handler         |       |
|   +------------------+-------------+--------------+------------------+       |
|                                                                              |
+-----------------------------------------------------------------------------+
```

### 11.2 Implementation Phases

**Phase 1: Foundation (Week 1-2)**
- Message format definition and validation
- Agent registry and identity management
- Configuration management system
- Basic message serialization/deserialization

**Phase 2: Transport (Week 3-4)**
- Message router implementation
- Authentication/authorization integration
- Basic observation (logging)
- Request/response pattern

**Phase 3: Patterns (Week 5-6)**
- Broadcast pattern implementation
- Subscription pattern with topic filtering
- Streaming pattern with flow control
- Pattern-specific error handling

**Phase 4: Coordination (Week 7-8)**
- Conversation context management
- Deadlock detection and prevention
- Failover mechanism implementation
- Comprehensive error handling

**Phase 5: Observability & Security (Week 9-10)**
- Full observation subsystem
- Metrics and tracing integration
- Security hardening
- Rate limiting and abuse prevention

**Phase 6: Testing & Documentation (Week 11-12)**
- Integration testing
- Load testing
- Security testing
- Documentation and examples

### 11.3 Integration Points

```yaml
integration_points:
  agent_interface:
    description: "How agents connect to MACP"
    methods:
      - "register(agent_identity)"
      - "send(message)"
      - "receive() -> message"
      - "subscribe(topic, handler)"
      - "broadcast(scope, message)"

  coordinator_interface:
    description: "Central coordination service"
    methods:
      - "route_message(message)"
      - "check_authorization(source, destination, action)"
      - "detect_deadlock()"
      - "resolve_deadlock(cycle)"

  observation_interface:
    description: "Monitoring and observability"
    methods:
      - "tap_message(message)"
      - "record_metric(name, value, labels)"
      - "record_trace_span(span)"
      - "write_audit_log(event)"
```

### 11.4 Configuration Templates

**Minimal Configuration:**
```yaml
# macp-config-minimal.yaml
macp:
  version: "1.0"
  coordinator:
    address: "localhost:9000"
  agents:
    heartbeat_interval_ms: 10000
  security:
    enabled: false
  observation:
    level: "basic"                      # basic|standard|detailed
```

**Production Configuration:**
```yaml
# macp-config-production.yaml
macp:
  version: "1.0"
  coordinator:
    address: "macp-coordinator:9000"
    replicas: 3
    consensus: "raft"

  agents:
    heartbeat_interval_ms: 5000
    queue_size: 1000

  security:
    enabled: true
    authentication:
      method: "jwt"
      token_ttl_minutes: 15
    authorization:
      model: "rbac_with_attributes"
      policy_refresh_seconds: 60
    encryption:
      enabled: true
      algorithm: "aes-256-gcm"

  observation:
    level: "detailed"
    metrics:
      export: "prometheus"
      endpoint: "http://prometheus:9090"
    tracing:
      export: "otlp"
      endpoint: "http://jaeger:4317"
      sampling_rate: 0.1
    audit:
      enabled: true
      retention_days: 90

  reliability:
    retry:
      policy: "exponential"
      max_attempts: 3
    failover:
      enabled: true
      strategy: "capability_match"
    circuit_breaker:
      enabled: true
      failure_threshold: 5
    dead_letter:
      enabled: true
      retention_hours: 24
```

---

## 12. Assumptions

### 12.1 Explicit Assumptions

1. **Agent Execution Environment**: Agents run as independent processes or threads with their own execution context

2. **Coordinator Availability**: A central coordinator (or distributed coordinator cluster) is always available for message routing

3. **Time Synchronization**: All participating agents have reasonably synchronized clocks (within 1 second)

4. **Message Ordering**: Within a single agent-to-agent channel, message ordering is preserved

5. **Agent Cooperation**: Agents are cooperative and follow protocol rules (not adversarial)

6. **Resource Availability**: Sufficient memory and network bandwidth for message queuing

7. **Conversation Duration**: Most conversations complete within hours, not days

8. **Agent Count**: System designed for 10-100 concurrent agents, not thousands

9. **Message Size**: Individual messages are less than 1MB, typical messages less than 100KB

10. **Network Reliability**: Underlying transport provides reliable delivery (retransmission handled at lower layer)

### 12.2 Technology Assumptions

**Required Infrastructure:**
- Message queue or pub/sub system (or simple in-memory queues for small deployments)
- Persistent storage for observation data and dead letter queues
- Timer/scheduler for timeout handling

**Optional Infrastructure:**
- Distributed tracing backend (Jaeger, Zipkin)
- Metrics backend (Prometheus, InfluxDB)
- Log aggregation system (ELK, Loki)

### 12.3 Security Assumptions

1. **Trust Boundary**: All agents within MACP are within the same trust boundary
2. **Key Management**: Secure key storage and distribution exists
3. **Network Security**: Communication channels may be untrusted (hence optional encryption)
4. **Identity Verification**: Agent identities are verified at registration time

---

## 13. Edge Cases & Failure Modes

### 13.1 Edge Cases

**1. Rapid Agent Restarts**
```yaml
scenario: "Agent repeatedly restarts within seconds"
impact: "Message loss, inconsistent state"
handling:
  - Track restart count per time window
  - Delay message delivery after restart
  - Require health check before accepting messages
  - Alert on excessive restarts
```

**2. Conversation Participant Leaves Mid-Task**
```yaml
scenario: "Agent leaves conversation while processing request"
impact: "Orphaned requests, incomplete work"
handling:
  - Detect departure via heartbeat
  - Reassign pending requests to backup
  - Notify remaining participants
  - Preserve context for handoff
```

**3. Message Size Exceeds Limit**
```yaml
scenario: "Agent attempts to send oversized message"
impact: "Message rejected, task blocked"
handling:
  - Validate size before send
  - Suggest chunking for large payloads
  - Use streaming pattern for large transfers
  - Return clear error with size limit info
```

**4. Circular Delegation**
```yaml
scenario: "A delegates to B, B delegates back to A"
impact: "Infinite loop, resource exhaustion"
handling:
  - Track delegation chain in context
  - Detect cycles using visited set
  - Abort on cycle detection
  - Notify original requester
```

**5. Priority Inversion**
```yaml
scenario: "High-priority request blocked by low-priority processing"
impact: "SLA violation for high-priority work"
handling:
  - Preemption of low-priority work
  - Separate queues per priority level
  - Priority inheritance for blocking chains
  - Alert on SLA violations
```

### 13.2 Failure Mode Analysis

| Failure Mode | Detection | Impact | Mitigation |
|--------------|-----------|--------|------------|
| Coordinator crash | Heartbeat timeout | All routing fails | Multi-coordinator cluster |
| Agent crash | Heartbeat miss | Messages queued | Failover to backup |
| Network partition | Message timeouts | Partial communication | Partition-tolerant design |
| Message corruption | Signature invalid | Message rejected | Retry from sender |
| Clock skew | Timestamp validation | Message rejected | NTP, configurable tolerance |
| Queue overflow | Queue depth check | Messages dropped | Backpressure, flow control |
| Deadlock | Graph cycle detection | Agents blocked | Automatic resolution |
| Memory exhaustion | Resource monitoring | Agent crash | Resource limits, cleanup |

### 13.3 Recovery Procedures

**Coordinator Recovery:**
```yaml
procedure: "coordinator_recovery"
steps:
  1. Detect coordinator failure (heartbeat miss)
  2. Elect new leader (if clustered)
  3. Restore agent registry from persistent storage
  4. Replay pending messages from journal
  5. Notify agents of coordinator change
  6. Resume normal operation
estimated_time: "30-60 seconds"
data_loss: "None if journal enabled"
```

**Agent Recovery:**
```yaml
procedure: "agent_recovery"
steps:
  1. Agent restarts and registers with coordinator
  2. Coordinator provides pending messages from queue
  3. Agent resumes processing from last checkpoint
  4. Agent sends status update to conversation participants
  5. Normal operation resumes
estimated_time: "5-10 seconds"
data_loss: "In-progress work may need restart"
```

---

## 14. Glossary

| Term | Definition |
|------|------------|
| **Agent** | An autonomous entity that can send and receive messages |
| **Broadcast** | One-to-many message dissemination pattern |
| **Capability** | A specific skill or function an agent can perform |
| **Conversation** | A coherent exchange of messages toward a shared goal |
| **Correlation ID** | Links a response to its original request |
| **Dead Letter Queue** | Storage for messages that failed delivery |
| **Failover** | Automatic switching to backup agent on failure |
| **Heartbeat** | Periodic signal indicating agent liveness |
| **MACP** | Multi-Agent Collaboration Protocol |
| **Pattern** | A defined communication style (request/response, broadcast, etc.) |
| **Priority** | Urgency level determining processing order |
| **Subscription** | Registration to receive events on a topic |
| **TTL** | Time-to-live, message expiration period |
| **Wait-For Graph** | Data structure tracking agent dependencies for deadlock detection |

---

## 15. Appendices

### Appendix A: Complete Message Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MACP Message",
  "type": "object",
  "required": ["header", "routing", "qos", "security", "payload"],
  "properties": {
    "header": {
      "type": "object",
      "required": ["message_id", "timestamp", "version"],
      "properties": {
        "message_id": { "type": "string", "pattern": "^msg-[a-f0-9-]+$" },
        "correlation_id": { "type": "string" },
        "conversation_id": { "type": "string", "pattern": "^conv-[a-f0-9-]+$" },
        "timestamp": { "type": "string", "format": "date-time" },
        "version": { "type": "string", "const": "1.0" }
      }
    },
    "routing": {
      "type": "object",
      "required": ["source", "destination", "pattern"],
      "properties": {
        "source": { "type": "string" },
        "destination": { "type": "string" },
        "pattern": {
          "type": "string",
          "enum": ["request", "response", "broadcast", "notify", "stream", "error"]
        }
      }
    },
    "qos": {
      "type": "object",
      "required": ["priority", "ttl_seconds"],
      "properties": {
        "priority": { "type": "integer", "minimum": 1, "maximum": 5 },
        "ttl_seconds": { "type": "integer", "minimum": 1 },
        "require_ack": { "type": "boolean" },
        "retry_policy": {
          "type": "string",
          "enum": ["none", "fixed", "exponential", "circuit_breaker"]
        },
        "max_retries": { "type": "integer", "minimum": 0 }
      }
    },
    "security": {
      "type": "object",
      "required": ["auth_token"],
      "properties": {
        "auth_token": { "type": "string" },
        "signature": { "type": "string" },
        "encryption": { "type": "string", "enum": ["none", "aes256"] }
      }
    },
    "payload": {
      "type": "object",
      "required": ["type", "content"],
      "properties": {
        "type": { "type": "string" },
        "content": { "type": "object" },
        "attachments": { "type": "array" }
      }
    },
    "tracing": {
      "type": "object",
      "properties": {
        "trace_id": { "type": "string" },
        "span_id": { "type": "string" },
        "parent_span_id": { "type": "string" },
        "baggage": { "type": "object" }
      }
    }
  }
}
```

### Appendix B: State Machine Diagrams

**Agent Status State Machine:**
```
INITIALIZING ----------------------------------+
     |                                         |
     | initialization_complete                 | initialization_failed
     v                                         v
AVAILABLE <------------------------------- TERMINATED
     |              |
     | task_started | suspend
     v              v
   BUSY <-------> SUSPENDED
     |              |
     | task_complete| resume
     v              |
AVAILABLE <--------+
```

**Conversation State Machine:**
```
CREATED --> ACTIVE --> COMPLETING --> COMPLETED
                |            |
                |            +----------> FAILED
                |            |
                +---> EXPIRED <-----------+
```

### Appendix C: Example Message Flows

**Request/Response with Retry:**
```
Time    Agent A              Coordinator           Agent B
------------------------------------------------------------------
t=0     --> REQUEST -------->
t=1                          --> FORWARD -------->
t=2                          [Timeout: 5s]
t=5                          [No response]
t=5                          --> RETRY(1) ------->
t=6                                               <-- ACK
t=8                                               <-- RESPONSE
t=8                          <-- FORWARD --------
t=8     <-- RESPONSE -------
```

**Broadcast with Partial Delivery:**
```
Time    Agent A              Coordinator           Agent B    Agent C    Agent D
---------------------------------------------------------------------------------
t=0     --> BROADCAST ------>
t=1                          --> DELIVER --------------------------->
t=1                          --> DELIVER ------------------------------------->
t=1                          --> DELIVER ----------------------------------------->
t=2                                               <-- ACK
t=2                                                          [Offline]
t=2                                                                      <-- ACK
t=5                          [Delivery failed to Agent C]
t=5                          [Retry or DLQ based on config]
```

---

## 16. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-10 | System Architecture Team | Initial specification |

---

**Document End**

*This specification defines the Multi-Agent Collaboration Protocol (MACP) for enabling structured, secure, and observable communication between specialized agents. Implementation should follow the phased approach outlined in Section 11, with particular attention to the failure modes and edge cases documented in Section 13.*
