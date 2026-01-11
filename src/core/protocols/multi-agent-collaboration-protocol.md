# Multi-Agent Collaboration Protocol (MACP) v1.0

**Status:** Specification Draft
**Version:** 1.0.0
**Author:** BMAD Core Team
**Created:** 2026-01-10
**Purpose:** Define protocol for agent-to-agent communication in the BMAD ecosystem

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope and Assumptions](#2-scope-and-assumptions)
3. [Protocol Architecture](#3-protocol-architecture)
4. [Message Format Specification](#4-message-format-specification)
5. [Communication Patterns](#5-communication-patterns)
6. [Agent Authorization and Security](#6-agent-authorization-and-security)
7. [Error Handling and Recovery](#7-error-handling-and-recovery)
8. [Deadlock Prevention](#8-deadlock-prevention)
9. [Conversation Coherence](#9-conversation-coherence)
10. [Priority System](#10-priority-system)
11. [Observability and Monitoring](#11-observability-and-monitoring)
12. [Implementation Guidance](#12-implementation-guidance)
13. [Edge Cases and Failure Modes](#13-edge-cases-and-failure-modes)

---

## 1. Executive Summary

The Multi-Agent Collaboration Protocol (MACP) establishes a standardized framework for agent-to-agent communication within the BMAD ecosystem. This protocol enables specialized agents to work together on complex tasks that exceed the capabilities of any single agent.

### Core Objectives

- **Interoperability:** Standardized message formats enable any BMAD agent to communicate with any other
- **Reliability:** Built-in error handling, timeouts, and recovery mechanisms
- **Security:** Authorization-based communication with explicit peer relationships
- **Observability:** Complete visibility into all inter-agent traffic for debugging and auditing
- **Coherence:** Maintained conversation context across multiple agent interactions

---

## 2. Scope and Assumptions

### 2.1 In Scope

- Agent-to-agent message routing and delivery
- Communication patterns (request/response, broadcast, subscription)
- Error handling and timeout management
- Authorization and access control
- Conversation state management
- Priority-based message handling
- Monitoring and observability infrastructure

### 2.2 Out of Scope

- Agent implementation details (internal logic)
- Human-to-agent communication (covered by existing workflows)
- External system integrations (APIs, databases)
- Agent deployment and lifecycle management

### 2.3 Assumptions

| Assumption | Rationale | Risk if Invalid |
|------------|-----------|-----------------|
| Agents operate within a single orchestration context | BMAD agents run within a conversation session | Protocol would need distributed messaging layer |
| Agent identities are pre-registered | Agents defined in `agent-manifest.csv` | Would need dynamic registration protocol |
| Message ordering is not guaranteed | Async communication model | Applications requiring strict ordering need sequence numbers |
| Agents may be temporarily unavailable | LLM context limitations, rate limits | Timeout and retry mechanisms required |
| Single orchestrator manages routing | BMad Master or Party Mode facilitator | Would need consensus protocol otherwise |

### 2.4 Design Principles

1. **Explicit over Implicit:** All communication must be explicit in intent and structure
2. **Fail Fast:** Detect and report failures quickly rather than silently degrading
3. **Idempotent Operations:** Messages can be safely retried without side effects
4. **Minimal Coupling:** Agents should depend on protocol, not on each other's internals
5. **Audit Trail:** Every message exchange must be traceable

---

## 3. Protocol Architecture

### 3.1 Component Overview

```
+------------------------------------------------------------------+
|                    MACP Protocol Stack                            |
+------------------------------------------------------------------+
|  [Application Layer]                                              |
|    - Agent Business Logic                                         |
|    - Task-Specific Processing                                     |
+------------------------------------------------------------------+
|  [Session Layer]                                                  |
|    - Conversation Context Management                              |
|    - State Synchronization                                        |
|    - Priority Queue Management                                    |
+------------------------------------------------------------------+
|  [Transport Layer]                                                |
|    - Message Routing                                              |
|    - Delivery Confirmation                                        |
|    - Timeout Management                                           |
+------------------------------------------------------------------+
|  [Security Layer]                                                 |
|    - Agent Authentication                                         |
|    - Authorization Verification                                   |
|    - Message Integrity                                            |
+------------------------------------------------------------------+
|  [Observability Layer]                                            |
|    - Traffic Logging                                              |
|    - Metrics Collection                                           |
|    - Trace Propagation                                            |
+------------------------------------------------------------------+
```

### 3.2 Core Components

#### 3.2.1 Message Router

The Message Router is responsible for:
- Receiving messages from source agents
- Validating message format and authorization
- Routing messages to destination agent(s)
- Managing message queues by priority
- Handling delivery confirmations

#### 3.2.2 Session Manager

The Session Manager handles:
- Creating and destroying conversation sessions
- Maintaining shared context across agents
- Managing session timeouts and cleanup
- Providing context injection to agents

#### 3.2.3 Authorization Registry

The Authorization Registry maintains:
- Agent identity records
- Peer authorization relationships
- Communication permission matrices
- Security audit logs

#### 3.2.4 Observer Bus

The Observer Bus provides:
- Real-time message streaming for monitoring
- Structured logging of all traffic
- Event emission for external systems
- Debugging hooks

### 3.3 Agent Roles

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Orchestrator** | Coordinates multi-agent workflows | Full routing access, can broadcast, manages sessions |
| **Specialist** | Domain-specific expert agent | Request/response with authorized peers |
| **Observer** | Monitoring-only agent | Read-only access to message bus |
| **Coordinator** | Sub-workflow manager | Limited routing within scope |

---

## 4. Message Format Specification

### 4.1 Base Message Structure

All MACP messages follow this structure:

```yaml
message:
  # REQUIRED: Message Metadata
  header:
    message_id: string         # UUID v4, globally unique
    correlation_id: string     # Links related messages (request/response)
    session_id: string         # Conversation session identifier
    timestamp: ISO8601         # Message creation time
    version: "1.0"             # Protocol version

  # REQUIRED: Routing Information
  routing:
    source_agent: string       # Sender agent ID
    target_agent: string       # Recipient agent ID (or "*" for broadcast)
    target_group: string       # Optional: Named group for multicast
    reply_to: string           # Agent to receive response

  # REQUIRED: Message Classification
  classification:
    type: enum                 # REQUEST | RESPONSE | BROADCAST | EVENT | ACK | ERROR
    pattern: enum              # SYNC | ASYNC | FIRE_AND_FORGET
    priority: enum             # CRITICAL | HIGH | NORMAL | LOW
    ttl_ms: integer            # Time-to-live in milliseconds

  # REQUIRED: Payload
  payload:
    intent: string             # Machine-readable intent code
    content: object            # Message-specific data
    context_refs: array        # References to shared context keys

  # OPTIONAL: Security
  security:
    auth_token: string         # Authorization credential
    signature: string          # Message integrity signature
```

### 4.2 Message Types

#### 4.2.1 REQUEST Message

Used when an agent needs something from another agent.

```yaml
message:
  header:
    message_id: "550e8400-e29b-41d4-a716-446655440000"
    correlation_id: "req-001"
    session_id: "session-abc123"
    timestamp: "2026-01-10T14:30:00Z"
    version: "1.0"
  routing:
    source_agent: "bmad-master"
    target_agent: "veritas"
    reply_to: "bmad-master"
  classification:
    type: REQUEST
    pattern: SYNC
    priority: NORMAL
    ttl_ms: 30000
  payload:
    intent: "VERIFY_CONTENT"
    content:
      artifact_type: "requirements_document"
      artifact_ref: "/docs/requirements.md"
      verification_depth: "comprehensive"
    context_refs: ["current_project", "user_preferences"]
```

#### 4.2.2 RESPONSE Message

Reply to a REQUEST message.

```yaml
message:
  header:
    message_id: "660e8400-e29b-41d4-a716-446655440001"
    correlation_id: "req-001"  # Links to original request
    session_id: "session-abc123"
    timestamp: "2026-01-10T14:30:15Z"
    version: "1.0"
  routing:
    source_agent: "veritas"
    target_agent: "bmad-master"
    reply_to: null
  classification:
    type: RESPONSE
    pattern: SYNC
    priority: NORMAL
    ttl_ms: 0
  payload:
    intent: "VERIFICATION_COMPLETE"
    content:
      status: "COMPLETED"
      findings_count: 3
      severity_summary:
        critical: 0
        important: 2
        minor: 1
      findings: [...]
    context_refs: []
```

#### 4.2.3 BROADCAST Message

One-to-many communication to all subscribed agents.

```yaml
message:
  header:
    message_id: "770e8400-e29b-41d4-a716-446655440002"
    correlation_id: null
    session_id: "session-abc123"
    timestamp: "2026-01-10T14:31:00Z"
    version: "1.0"
  routing:
    source_agent: "bmad-master"
    target_agent: "*"
    target_group: "active_session_agents"
    reply_to: null
  classification:
    type: BROADCAST
    pattern: FIRE_AND_FORGET
    priority: HIGH
    ttl_ms: 5000
  payload:
    intent: "SESSION_CONTEXT_UPDATED"
    content:
      update_type: "requirements_changed"
      affected_artifacts: ["/docs/requirements.md"]
      summary: "User modified Section 3.2"
    context_refs: ["current_project"]
```

#### 4.2.4 EVENT Message

Notification of state changes or significant occurrences.

```yaml
message:
  header:
    message_id: "880e8400-e29b-41d4-a716-446655440003"
    correlation_id: null
    session_id: "session-abc123"
    timestamp: "2026-01-10T14:32:00Z"
    version: "1.0"
  routing:
    source_agent: "veritas"
    target_agent: null
    target_group: "workflow_monitors"
    reply_to: null
  classification:
    type: EVENT
    pattern: FIRE_AND_FORGET
    priority: NORMAL
    ttl_ms: 10000
  payload:
    intent: "TASK_PROGRESS"
    content:
      task_id: "verify-task-001"
      phase: "PHASE_4"
      progress_pct: 75
      current_activity: "Applying 5 Whys to finding #2"
    context_refs: []
```

#### 4.2.5 ACK Message

Acknowledgment of message receipt.

```yaml
message:
  header:
    message_id: "990e8400-e29b-41d4-a716-446655440004"
    correlation_id: "550e8400-e29b-41d4-a716-446655440000"
    session_id: "session-abc123"
    timestamp: "2026-01-10T14:30:01Z"
    version: "1.0"
  routing:
    source_agent: "veritas"
    target_agent: "bmad-master"
    reply_to: null
  classification:
    type: ACK
    pattern: SYNC
    priority: NORMAL
    ttl_ms: 0
  payload:
    intent: "MESSAGE_RECEIVED"
    content:
      ack_type: "RECEIVED"  # RECEIVED | PROCESSING | QUEUED
      estimated_completion_ms: 15000
    context_refs: []
```

#### 4.2.6 ERROR Message

Communication or processing error notification.

```yaml
message:
  header:
    message_id: "aa0e8400-e29b-41d4-a716-446655440005"
    correlation_id: "550e8400-e29b-41d4-a716-446655440000"
    session_id: "session-abc123"
    timestamp: "2026-01-10T14:30:30Z"
    version: "1.0"
  routing:
    source_agent: "veritas"
    target_agent: "bmad-master"
    reply_to: null
  classification:
    type: ERROR
    pattern: SYNC
    priority: HIGH
    ttl_ms: 0
  payload:
    intent: "PROCESSING_FAILED"
    content:
      error_code: "E4001"
      error_category: "RESOURCE_UNAVAILABLE"
      message: "Referenced artifact not found"
      details:
        artifact_ref: "/docs/requirements.md"
        attempted_actions: ["read", "parse"]
      recoverable: true
      suggested_action: "Verify artifact path or provide content inline"
    context_refs: []
```

### 4.3 Intent Codes

Standard intent codes for common operations:

| Intent Code | Type | Description |
|-------------|------|-------------|
| `VERIFY_CONTENT` | REQUEST | Request content verification |
| `ANALYZE_ARTIFACT` | REQUEST | Request artifact analysis |
| `GENERATE_CONTENT` | REQUEST | Request content generation |
| `REVIEW_PROPOSAL` | REQUEST | Request peer review |
| `DELEGATE_TASK` | REQUEST | Delegate subtask to specialist |
| `REQUEST_CONTEXT` | REQUEST | Ask for shared context data |
| `PROVIDE_INPUT` | REQUEST | Supply information to agent |
| `VERIFICATION_COMPLETE` | RESPONSE | Verification results |
| `ANALYSIS_COMPLETE` | RESPONSE | Analysis results |
| `TASK_COMPLETE` | RESPONSE | Generic task completion |
| `NEED_CLARIFICATION` | RESPONSE | Requires additional input |
| `SESSION_CONTEXT_UPDATED` | BROADCAST | Shared context changed |
| `AGENT_STATUS_CHANGED` | BROADCAST | Agent availability changed |
| `WORKFLOW_PHASE_CHANGED` | BROADCAST | Workflow state transition |
| `TASK_PROGRESS` | EVENT | Progress update |
| `FINDING_DISCOVERED` | EVENT | Notable finding |
| `MESSAGE_RECEIVED` | ACK | Receipt confirmation |
| `PROCESSING_FAILED` | ERROR | Processing error |
| `AUTHORIZATION_DENIED` | ERROR | Permission error |
| `TIMEOUT_EXCEEDED` | ERROR | Timeout error |

---

## 5. Communication Patterns

### 5.1 Request/Response Pattern

The most common pattern for agent collaboration.

```
    Agent A                    Router                    Agent B
       |                         |                          |
       |---(1) REQUEST --------->|                          |
       |                         |---(2) Validate & Route-->|
       |                         |                          |
       |<--(3) ACK --------------|<--------------------------|
       |                         |                          |
       |   [Agent B processing]  |                          |
       |                         |                          |
       |<--(4) RESPONSE ---------|<--------------------------|
       |                         |                          |
```

**Sequencing Rules:**
1. Source agent sends REQUEST with unique `message_id` and `correlation_id`
2. Router validates authorization and routes to target
3. Target sends ACK within 1000ms indicating receipt
4. Target processes and sends RESPONSE with matching `correlation_id`
5. Source matches RESPONSE to REQUEST via `correlation_id`

**Timeout Handling:**
- No ACK within 1000ms: Mark target as potentially unavailable
- No RESPONSE within TTL: Trigger timeout error callback

### 5.2 Broadcast Pattern

One-to-many communication for announcements and updates.

```
    Agent A                    Router                    Agents B,C,D
       |                         |                          |
       |---(1) BROADCAST ------->|                          |
       |                         |---(2) Fan-out ---------> B
       |                         |---(2) Fan-out ---------> C
       |                         |---(2) Fan-out ---------> D
       |                         |                          |
       |   [No response expected]|                          |
       |                         |                          |
```

**Broadcast Targeting:**
- `target_agent: "*"` - All registered agents in session
- `target_group: "group_name"` - Only agents in named group

**Built-in Groups:**
| Group Name | Members |
|------------|---------|
| `orchestrators` | All orchestrator-role agents |
| `specialists` | All specialist-role agents |
| `active_session_agents` | All agents with current session state |
| `workflow_monitors` | Agents subscribed to workflow events |

### 5.3 Subscription Pattern

Agents subscribe to specific event types or topics.

```
    Agent A                    Router                    Agent B
       |                         |                          |
       |---(1) SUBSCRIBE ------->|                          |
       |   topic: "findings.*"   |                          |
       |                         |   [Subscription stored]  |
       |                         |                          |
       |                         |<--(2) EVENT -------------|
       |                         |   topic: "findings.new"  |
       |                         |                          |
       |<--(3) EVENT forwarded---|                          |
       |                         |                          |
```

**Subscription Message:**

```yaml
message:
  header:
    message_id: "sub-001"
    correlation_id: null
    session_id: "session-abc123"
    timestamp: "2026-01-10T14:00:00Z"
    version: "1.0"
  routing:
    source_agent: "bmad-master"
    target_agent: "_router"
    reply_to: "bmad-master"
  classification:
    type: REQUEST
    pattern: SYNC
    priority: NORMAL
    ttl_ms: 5000
  payload:
    intent: "SUBSCRIBE"
    content:
      topics:
        - "findings.*"
        - "workflow.phase_changed"
      filter:
        severity: ["critical", "important"]
      duration_ms: 3600000  # 1 hour
    context_refs: []
```

**Topic Naming Convention:**
- Format: `category.subcategory.detail`
- Wildcards: `*` matches single level, `**` matches multiple levels
- Examples:
  - `findings.*` - All finding events
  - `workflow.phase_changed` - Specific event
  - `agent.**` - All agent-related events at any depth

### 5.4 Delegation Pattern

For complex tasks requiring specialist agents.

```
    Orchestrator              Router              Specialist A    Specialist B
         |                       |                      |               |
         |---(1) DELEGATE ------>|                      |               |
         |   task: "complex"     |----(2) Analyze----->|               |
         |                       |                      |               |
         |<--(3) ACK ------------|<---------------------|               |
         |                       |                      |               |
         |                       |<--(4) SUB-REQUEST----|               |
         |                       |                      |               |
         |                       |----(5) Route ------->|-------------->|
         |                       |                      |               |
         |                       |<--(6) RESPONSE ------|<--------------|
         |                       |                      |               |
         |<--(7) FINAL RESPONSE--|<---------------------|               |
         |                       |                      |               |
```

**Delegation Rules:**
1. Orchestrator identifies need for specialist(s)
2. Sends DELEGATE request with task breakdown
3. Specialist may sub-delegate to other specialists (depth limit: 3)
4. All sub-requests inherit original `correlation_id` chain
5. Final aggregated response returns to orchestrator

---

## 6. Agent Authorization and Security

### 6.1 Authorization Model

MACP uses a capability-based authorization model with explicit peer relationships.

#### 6.1.1 Agent Identity Record

```yaml
agent_identity:
  agent_id: "veritas"
  agent_type: "specialist"
  module: "core"
  capabilities:
    - "verify_content"
    - "analyze_structure"
    - "generate_findings"
  authorized_peers:
    - agent_id: "bmad-master"
      permissions: ["request", "receive_response"]
    - agent_id: "architect"
      permissions: ["request", "receive_response", "delegate_to"]
    - agent_id: "*"
      permissions: ["receive_broadcast"]
  communication_restrictions:
    max_concurrent_requests: 5
    rate_limit_per_minute: 60
```

#### 6.1.2 Permission Types

| Permission | Description |
|------------|-------------|
| `request` | Can send REQUEST messages to this agent |
| `receive_response` | Can receive RESPONSE from this agent |
| `broadcast_to` | Can include this agent in broadcasts |
| `receive_broadcast` | Can receive broadcasts from this agent |
| `delegate_to` | Can delegate tasks to this agent |
| `subscribe_events` | Can subscribe to this agent's events |
| `observe` | Can monitor this agent's traffic (observer only) |

#### 6.1.3 Authorization Matrix

The Authorization Registry maintains a matrix of all peer relationships:

```yaml
authorization_matrix:
  # Row: Source Agent, Column: Target Agent
  # Cell: Array of permitted operations

  bmad-master:
    veritas: [request, receive_response, delegate_to, observe]
    architect: [request, receive_response, delegate_to, observe]
    "*": [broadcast_to]

  veritas:
    bmad-master: [request, receive_response]
    architect: [request, receive_response]

  architect:
    bmad-master: [request, receive_response]
    veritas: [request, receive_response, delegate_to]
```

### 6.2 Authorization Flow

```
    Agent A                    Router                    Agent B
       |                         |                          |
       |---(1) REQUEST --------->|                          |
       |                         |                          |
       |                   (2) Check:                       |
       |                   - A exists?                      |
       |                   - B exists?                      |
       |                   - A->B permitted?                |
       |                   - Intent allowed?                |
       |                         |                          |
       |      [If authorized]    |---(3) Forward ---------> |
       |                         |                          |
       |      [If denied]        |                          |
       |<--(ERROR) --------------|                          |
       |   AUTHORIZATION_DENIED  |                          |
```

### 6.3 Security Error Codes

| Code | Name | Description |
|------|------|-------------|
| `E3001` | `AGENT_NOT_FOUND` | Source or target agent not registered |
| `E3002` | `AUTHORIZATION_DENIED` | Permission not granted for operation |
| `E3003` | `PEER_NOT_AUTHORIZED` | Target not in source's authorized_peers |
| `E3004` | `INTENT_NOT_PERMITTED` | Specific intent not allowed for this pair |
| `E3005` | `RATE_LIMIT_EXCEEDED` | Too many requests from source |
| `E3006` | `SESSION_INVALID` | Session ID not valid or expired |

---

## 7. Error Handling and Recovery

### 7.1 Error Categories

| Category | Codes | Typical Cause | Recovery Strategy |
|----------|-------|---------------|-------------------|
| **Transport** | E1xxx | Network, routing issues | Auto-retry with backoff |
| **Validation** | E2xxx | Malformed messages | Reject, notify sender |
| **Security** | E3xxx | Authorization failures | Log, reject, alert |
| **Processing** | E4xxx | Agent execution errors | Agent-specific handling |
| **Timeout** | E5xxx | Response not received | Retry or escalate |

### 7.2 Error Code Reference

```yaml
error_codes:
  # Transport Errors (E1xxx)
  E1001:
    name: MESSAGE_UNDELIVERABLE
    description: Router could not deliver message to target
    recoverable: true
    suggested_action: Check agent availability, retry

  E1002:
    name: QUEUE_FULL
    description: Target agent's message queue at capacity
    recoverable: true
    suggested_action: Wait and retry with backoff

  # Validation Errors (E2xxx)
  E2001:
    name: MALFORMED_MESSAGE
    description: Message does not conform to schema
    recoverable: false
    suggested_action: Fix message format

  E2002:
    name: MISSING_REQUIRED_FIELD
    description: Required field not present
    recoverable: false
    suggested_action: Include required field

  E2003:
    name: INVALID_INTENT
    description: Intent code not recognized
    recoverable: false
    suggested_action: Use valid intent code

  # Security Errors (E3xxx)
  E3001:
    name: AGENT_NOT_FOUND
    description: Agent ID not in registry
    recoverable: false
    suggested_action: Verify agent ID

  E3002:
    name: AUTHORIZATION_DENIED
    description: Operation not permitted
    recoverable: false
    suggested_action: Request authorization

  # Processing Errors (E4xxx)
  E4001:
    name: RESOURCE_UNAVAILABLE
    description: Referenced resource not accessible
    recoverable: true
    suggested_action: Verify resource path

  E4002:
    name: PROCESSING_FAILED
    description: Agent could not complete task
    recoverable: true
    suggested_action: Review error details, retry

  E4003:
    name: DEPENDENCY_FAILED
    description: Required sub-task failed
    recoverable: true
    suggested_action: Address dependency issue

  # Timeout Errors (E5xxx)
  E5001:
    name: ACK_TIMEOUT
    description: No acknowledgment received
    recoverable: true
    suggested_action: Check target availability

  E5002:
    name: RESPONSE_TIMEOUT
    description: No response within TTL
    recoverable: true
    suggested_action: Increase TTL or check agent

  E5003:
    name: SESSION_TIMEOUT
    description: Session expired during operation
    recoverable: false
    suggested_action: Create new session
```

### 7.3 Retry Policy

```yaml
retry_policy:
  default:
    max_attempts: 3
    initial_delay_ms: 1000
    max_delay_ms: 30000
    backoff_multiplier: 2.0
    jitter_factor: 0.1  # +/- 10% randomization

  by_error_category:
    transport:
      max_attempts: 5
      initial_delay_ms: 500
    processing:
      max_attempts: 2
      initial_delay_ms: 2000
    timeout:
      max_attempts: 3
      initial_delay_ms: 5000
```

### 7.4 Circuit Breaker

Prevent cascading failures when an agent is consistently failing.

```yaml
circuit_breaker:
  failure_threshold: 5          # Failures before opening
  success_threshold: 3          # Successes before closing
  timeout_ms: 60000             # Time in open state before half-open

  states:
    CLOSED: "Normal operation, requests flow through"
    OPEN: "Failures exceeded threshold, requests fail immediately"
    HALF_OPEN: "Testing if service recovered, limited requests"
```

**State Transitions:**

```
              [failure_threshold reached]
    CLOSED ─────────────────────────────> OPEN
       ^                                    │
       │                                    │
       │    [success_threshold reached]     │ [timeout_ms elapsed]
       │                                    │
       └───────── HALF_OPEN <───────────────┘
                     │
                     │ [failure in half-open]
                     └─────────────────────> OPEN
```

---

## 8. Deadlock Prevention

### 8.1 Deadlock Scenarios

#### Scenario 1: Circular Dependency

```
Agent A needs result from Agent B
Agent B needs result from Agent C
Agent C needs result from Agent A
```

#### Scenario 2: Resource Contention

```
Agent A holds lock on Resource X, waiting for Resource Y
Agent B holds lock on Resource Y, waiting for Resource X
```

#### Scenario 3: Priority Inversion

```
Low-priority Agent holds resource needed by High-priority Agent
Medium-priority Agent preempts Low-priority Agent indefinitely
```

### 8.2 Prevention Mechanisms

#### 8.2.1 Request Chain Tracking

Every request carries a chain of previous requesters:

```yaml
message:
  payload:
    content:
      _request_chain:
        - agent_id: "bmad-master"
          timestamp: "2026-01-10T14:30:00Z"
        - agent_id: "architect"
          timestamp: "2026-01-10T14:30:05Z"
```

**Circular Dependency Detection:**
Before processing a request, check if the target agent is already in the `_request_chain`. If found, reject with error:

```yaml
error:
  error_code: "E6001"
  error_category: "DEADLOCK_PREVENTED"
  message: "Circular dependency detected"
  details:
    requesting_agent: "veritas"
    cycle: ["bmad-master", "architect", "veritas", "bmad-master"]
```

#### 8.2.2 Maximum Chain Depth

Limit the depth of delegation chains:

```yaml
deadlock_prevention:
  max_request_chain_depth: 5
  max_pending_requests_per_agent: 10
  request_timeout_ms: 60000
```

#### 8.2.3 Resource Lock Ordering

When agents need multiple shared resources, they must acquire locks in a globally consistent order:

```yaml
resource_lock_order:
  - session_context
  - artifact_registry
  - agent_state
  - output_buffer
```

Agents must request locks in this order. Requests out of order are rejected.

#### 8.2.4 Timeout-Based Recovery

All requests have mandatory TTL:

```yaml
ttl_requirements:
  min_ttl_ms: 5000
  max_ttl_ms: 300000
  default_ttl_ms: 30000
```

When TTL expires:
1. Request is marked as TIMED_OUT
2. Any held resources are released
3. Requestor receives ERROR with E5002
4. Audit log entry created

#### 8.2.5 Priority Inheritance

Prevent priority inversion by temporarily elevating blocked agent priority:

```
When High-priority Agent H is blocked waiting for Low-priority Agent L:
  1. Temporarily elevate L's priority to H's level
  2. L completes its critical section
  3. L's priority returns to normal
  4. H proceeds with result
```

### 8.3 Deadlock Error Codes

| Code | Name | Description |
|------|------|-------------|
| `E6001` | `CIRCULAR_DEPENDENCY` | Request would create cycle |
| `E6002` | `CHAIN_DEPTH_EXCEEDED` | Delegation chain too deep |
| `E6003` | `RESOURCE_LOCK_VIOLATION` | Lock order violated |
| `E6004` | `PENDING_LIMIT_EXCEEDED` | Too many pending requests |

---

## 9. Conversation Coherence

### 9.1 Shared Context Architecture

All agents in a session share access to a common context store:

```yaml
shared_context:
  session_id: "session-abc123"
  created_at: "2026-01-10T14:00:00Z"
  last_updated: "2026-01-10T14:35:00Z"

  # Project-level context (read by all)
  project:
    name: "E-Commerce Platform"
    phase: "requirements_gathering"
    artifacts:
      - path: "/docs/requirements.md"
        status: "in_review"
      - path: "/docs/architecture.md"
        status: "draft"

  # Conversation history (append-only)
  conversation_history:
    - turn_id: 1
      speaker: "user"
      content: "Let's review the authentication requirements"
      timestamp: "2026-01-10T14:00:00Z"
    - turn_id: 2
      speaker: "bmad-master"
      content: "I'll coordinate a review with our specialists."
      timestamp: "2026-01-10T14:00:05Z"
    - turn_id: 3
      speaker: "veritas"
      content: "I've identified three concerns in section 3.2..."
      timestamp: "2026-01-10T14:00:30Z"

  # Agent-specific context (isolated per agent)
  agent_contexts:
    veritas:
      current_task: "verify_requirements"
      findings: [...]
      phase: "PHASE_4"
    architect:
      current_focus: "authentication_flow"
      diagrams_generated: [...]

  # Shared working memory (read/write by authorized agents)
  working_memory:
    key_decisions:
      - decision: "Use OAuth 2.0 for authentication"
        made_by: "architect"
        agreed_by: ["bmad-master", "veritas"]
        timestamp: "2026-01-10T14:20:00Z"
    open_questions:
      - question: "Should we support social login?"
        raised_by: "user"
        status: "under_discussion"
```

### 9.2 Context Synchronization Protocol

#### 9.2.1 Context Read

Agents read context at the start of processing:

```yaml
# Implicit context injection before agent processes message
context_injection:
  timestamp: "2026-01-10T14:30:00Z"
  injected_keys:
    - "project"
    - "conversation_history"  # Last N turns
    - "working_memory.key_decisions"
    - "agent_contexts.{self}"
```

#### 9.2.2 Context Write

Agents write context changes explicitly:

```yaml
message:
  header:
    message_id: "ctx-update-001"
    correlation_id: null
    session_id: "session-abc123"
    timestamp: "2026-01-10T14:35:00Z"
    version: "1.0"
  routing:
    source_agent: "veritas"
    target_agent: "_context_manager"
    reply_to: "veritas"
  classification:
    type: REQUEST
    pattern: SYNC
    priority: HIGH
    ttl_ms: 5000
  payload:
    intent: "UPDATE_CONTEXT"
    content:
      updates:
        - path: "agent_contexts.veritas.findings"
          operation: "append"
          value:
            finding_id: "F001"
            severity: "important"
            description: "Authentication flow missing MFA requirement"
        - path: "working_memory.open_questions"
          operation: "append"
          value:
            question: "Should MFA be required for all users?"
            raised_by: "veritas"
            status: "new"
    context_refs: []
```

#### 9.2.3 Context Conflict Resolution

When multiple agents update the same context key:

```yaml
conflict_resolution:
  strategy: "last_writer_wins"  # or "merge", "manual"

  conflict_record:
    path: "working_memory.key_decisions"
    conflicting_updates:
      - agent: "architect"
        timestamp: "2026-01-10T14:35:00Z"
        value: { decision: "Use JWT tokens" }
      - agent: "security-expert"
        timestamp: "2026-01-10T14:35:01Z"
        value: { decision: "Use opaque tokens" }
    resolution: "manual"
    resolved_by: "bmad-master"
    final_value: { decision: "Use JWT with short expiry + refresh tokens" }
```

### 9.3 Conversation Continuity Rules

1. **Turn Attribution:** Every message must identify the speaker clearly
2. **Reference Preservation:** Agents must reference previous turns when building on them
3. **Decision Recording:** Key decisions must be recorded in working_memory
4. **Question Tracking:** Open questions must be explicitly tracked until resolved
5. **Context Limit Management:** When context exceeds limits, summarize older content

#### 9.3.1 Context Summarization

When conversation history exceeds manageable size:

```yaml
summarization_trigger:
  max_turns: 50
  max_tokens: 10000

summarization_request:
  intent: "SUMMARIZE_CONTEXT"
  content:
    range:
      from_turn: 1
      to_turn: 40
    preserve:
      - key_decisions
      - unresolved_questions
      - agent_findings
```

Result:
```yaml
conversation_history:
  - turn_id: 0  # Synthetic summary turn
    speaker: "_system"
    type: "summary"
    content: |
      Session Summary (Turns 1-40):
      - Reviewed authentication requirements for e-commerce platform
      - Key Decision: Use OAuth 2.0 with JWT tokens
      - Open Question: MFA requirements for all users
      - Findings: 3 issues identified in requirements document
    timestamp: "2026-01-10T14:40:00Z"
  - turn_id: 41
    speaker: "user"
    content: "..."
    timestamp: "2026-01-10T14:40:05Z"
```

---

## 10. Priority System

### 10.1 Priority Levels

| Level | Code | Use Case | Processing Guarantee |
|-------|------|----------|---------------------|
| **CRITICAL** | 0 | System failures, security incidents | Immediate, preempts all |
| **HIGH** | 1 | User-blocking issues, time-sensitive tasks | Within 5 seconds |
| **NORMAL** | 2 | Standard operations, routine tasks | Within 30 seconds |
| **LOW** | 3 | Background tasks, non-urgent updates | Best effort |

### 10.2 Priority Queue Management

```yaml
priority_queues:
  critical:
    max_size: 10
    processing_strategy: "immediate"
    overflow_action: "reject_lowest_age"

  high:
    max_size: 50
    processing_strategy: "fifo_with_aging"
    overflow_action: "promote_to_critical_or_reject"

  normal:
    max_size: 200
    processing_strategy: "fifo_with_aging"
    overflow_action: "reject_oldest"

  low:
    max_size: 500
    processing_strategy: "fifo"
    overflow_action: "drop_silently"
```

### 10.3 Priority Aging

Messages waiting too long get promoted:

```yaml
priority_aging:
  enabled: true
  check_interval_ms: 5000

  aging_rules:
    - from_priority: LOW
      to_priority: NORMAL
      wait_threshold_ms: 30000

    - from_priority: NORMAL
      to_priority: HIGH
      wait_threshold_ms: 20000

    - from_priority: HIGH
      to_priority: CRITICAL
      wait_threshold_ms: 10000
```

### 10.4 Priority Override

Orchestrators can override message priority:

```yaml
# Original message
message:
  classification:
    priority: NORMAL

# Orchestrator override
priority_override:
  requesting_agent: "bmad-master"
  original_priority: NORMAL
  new_priority: HIGH
  reason: "User waiting for response"
  override_expires_at: "2026-01-10T14:35:00Z"
```

**Override Restrictions:**
- Only orchestrator-role agents can override
- Can only promote priority (not demote)
- Override expires automatically
- Must provide reason for audit

---

## 11. Observability and Monitoring

### 11.1 Observability Architecture

```
+------------------------------------------------------------------+
|                    Observability Stack                            |
+------------------------------------------------------------------+
|                                                                   |
|   [Message Bus] -----> [Observer Bus] -----> [Consumers]         |
|                              |                                    |
|                              v                                    |
|                     +----------------+                            |
|                     | Trace Collector|                            |
|                     | Metric Store   |                            |
|                     | Log Aggregator |                            |
|                     +----------------+                            |
|                              |                                    |
|                              v                                    |
|                     +----------------+                            |
|                     | Dashboard      |                            |
|                     | Alerting       |                            |
|                     | Analysis       |                            |
|                     +----------------+                            |
+------------------------------------------------------------------+
```

### 11.2 Message Tracing

Every message includes trace context:

```yaml
message:
  header:
    message_id: "550e8400-e29b-41d4-a716-446655440000"
    # ... other header fields ...

  trace:
    trace_id: "abc123def456"  # Spans entire request tree
    span_id: "span-001"       # This specific operation
    parent_span_id: "span-000" # Parent operation
    baggage:                   # Propagated context
      user_id: "user-123"
      workflow_id: "wf-456"
```

**Trace Visualization:**
```
[trace_id: abc123def456]
  |
  +-- [span-000] bmad-master: DELEGATE_TASK
  |     |
  |     +-- [span-001] veritas: VERIFY_CONTENT
  |     |     |
  |     |     +-- [span-002] veritas: internal_analysis
  |     |
  |     +-- [span-003] architect: REVIEW_PROPOSAL
  |
  +-- [span-004] bmad-master: aggregate_results
```

### 11.3 Metrics Collection

Standard metrics collected for all traffic:

```yaml
metrics:
  counters:
    - name: "macp_messages_total"
      labels: [type, intent, source_agent, target_agent, priority]

    - name: "macp_errors_total"
      labels: [error_code, error_category, source_agent]

    - name: "macp_authorization_denials_total"
      labels: [source_agent, target_agent, permission]

  histograms:
    - name: "macp_message_latency_ms"
      labels: [type, intent, priority]
      buckets: [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000]

    - name: "macp_queue_wait_time_ms"
      labels: [priority]
      buckets: [100, 500, 1000, 5000, 10000, 30000]

  gauges:
    - name: "macp_queue_depth"
      labels: [priority]

    - name: "macp_active_sessions"
      labels: []

    - name: "macp_circuit_breaker_state"
      labels: [agent_id]
```

### 11.4 Structured Logging

All events logged in structured format:

```yaml
log_entry:
  timestamp: "2026-01-10T14:30:00.123Z"
  level: "INFO"
  logger: "macp.router"

  message: "Message routed successfully"

  structured_data:
    message_id: "550e8400-e29b-41d4-a716-446655440000"
    correlation_id: "req-001"
    trace_id: "abc123def456"
    span_id: "span-001"
    source_agent: "bmad-master"
    target_agent: "veritas"
    type: "REQUEST"
    intent: "VERIFY_CONTENT"
    priority: "NORMAL"
    queue_wait_ms: 45
    processing_time_ms: 12
```

### 11.5 Observer Subscriptions

External systems can subscribe to traffic:

```yaml
observer_subscription:
  observer_id: "monitoring-system"

  filters:
    include:
      - type: "ERROR"
      - priority: "CRITICAL"
      - source_agent: "veritas"
    exclude:
      - intent: "ACK"

  output:
    format: "json"
    destination: "webhook"
    endpoint: "https://monitoring.example.com/macp-events"

  authentication:
    type: "bearer_token"
    token_ref: "secrets/monitoring-token"
```

### 11.6 Alert Rules

```yaml
alert_rules:
  - name: "high_error_rate"
    condition: "rate(macp_errors_total[5m]) > 10"
    severity: "warning"
    notification: ["slack:ops-channel"]

  - name: "critical_queue_backup"
    condition: "macp_queue_depth{priority='CRITICAL'} > 5"
    severity: "critical"
    notification: ["pagerduty:on-call"]

  - name: "agent_circuit_open"
    condition: "macp_circuit_breaker_state == 2"  # OPEN
    severity: "warning"
    notification: ["slack:ops-channel"]

  - name: "authorization_spike"
    condition: "rate(macp_authorization_denials_total[1m]) > 20"
    severity: "critical"
    notification: ["security-team"]
```

---

## 12. Implementation Guidance

### 12.1 Integration with BMAD Architecture

#### 12.1.1 Agent Definition Extension

Extend existing agent YAML to include MACP configuration:

```yaml
# Example: deep-verify.agent.yaml with MACP additions
agent:
  metadata:
    id: "veritas"
    name: "Veritas"
    # ... existing fields ...

  # NEW: MACP Configuration
  macp:
    role: "specialist"
    capabilities:
      - intent: "VERIFY_CONTENT"
        description: "Full content verification with findings"
      - intent: "QUICK_VERIFY"
        description: "Fast verification pass"

    authorized_peers:
      - agent_id: "bmad-master"
        permissions: [request, receive_response]
      - agent_id: "architect"
        permissions: [request, receive_response, delegate_to]
      - agent_id: "*"
        permissions: [receive_broadcast]

    resource_limits:
      max_concurrent_requests: 5
      rate_limit_per_minute: 60
      max_request_chain_depth: 3

    observability:
      log_level: "INFO"
      metrics_enabled: true
      trace_sampling_rate: 1.0
```

#### 12.1.2 Message Router Implementation

The Message Router should be implemented as a core BMAD component:

```
Location: src/core/protocols/macp/router.ts (or .py)

Responsibilities:
- Parse and validate incoming messages
- Check authorization against registry
- Route to appropriate agent(s)
- Manage priority queues
- Handle ACK/timeout tracking
- Emit observability events
```

#### 12.1.3 Session Manager Implementation

```
Location: src/core/protocols/macp/session-manager.ts

Responsibilities:
- Create/destroy sessions
- Maintain shared context
- Handle context read/write requests
- Manage context limits and summarization
- Coordinate conflict resolution
```

### 12.2 Message Handling in Agents

#### 12.2.1 Agent Message Handler Pattern

```typescript
interface MACPMessageHandler {
  // Called when agent receives a message
  handleMessage(message: MACPMessage): Promise<MACPMessage | void>;

  // Called to check if agent can handle intent
  canHandle(intent: string): boolean;

  // Called to get agent's current state
  getState(): AgentState;
}

// Example implementation pattern
class VeritasAgent implements MACPMessageHandler {
  async handleMessage(message: MACPMessage): Promise<MACPMessage | void> {
    // 1. Send ACK immediately
    await this.sendAck(message);

    // 2. Process based on intent
    switch (message.payload.intent) {
      case 'VERIFY_CONTENT':
        return await this.verifyContent(message);
      case 'QUICK_VERIFY':
        return await this.quickVerify(message);
      default:
        return this.createError(message, 'E2003', 'Unknown intent');
    }
  }

  canHandle(intent: string): boolean {
    return ['VERIFY_CONTENT', 'QUICK_VERIFY'].includes(intent);
  }

  getState(): AgentState {
    return {
      status: 'available',
      currentTask: this.currentTask,
      queueDepth: this.pendingRequests.length
    };
  }
}
```

#### 12.2.2 Context Injection Pattern

```typescript
// Before agent processes message, inject relevant context
async function injectContext(
  agent: MACPMessageHandler,
  message: MACPMessage,
  sessionManager: SessionManager
): Promise<void> {
  const context = await sessionManager.getContext(message.header.session_id);

  // Inject project context
  agent.setProjectContext(context.project);

  // Inject recent conversation history
  agent.setConversationHistory(
    context.conversation_history.slice(-20)  // Last 20 turns
  );

  // Inject agent-specific context
  agent.setAgentContext(
    context.agent_contexts[message.routing.target_agent]
  );

  // Inject working memory
  agent.setWorkingMemory(context.working_memory);
}
```

### 12.3 Orchestrator Implementation

#### 12.3.1 Orchestrator Pattern

```typescript
class MultiAgentOrchestrator {
  private router: MessageRouter;
  private sessionManager: SessionManager;
  private pendingRequests: Map<string, PendingRequest>;

  async delegateTask(
    task: TaskDefinition,
    targetAgents: string[],
    options: DelegationOptions
  ): Promise<AggregatedResult> {

    // 1. Create correlation ID for tracking
    const correlationId = generateCorrelationId();

    // 2. Send requests to all target agents
    const requests = targetAgents.map(agent =>
      this.sendRequest({
        target_agent: agent,
        correlation_id: correlationId,
        intent: task.intent,
        content: task.content,
        priority: options.priority,
        ttl_ms: options.timeout
      })
    );

    // 3. Await all responses (with timeout handling)
    const results = await Promise.allSettled(requests);

    // 4. Aggregate results
    return this.aggregateResults(results, correlationId);
  }

  private async sendRequest(params: RequestParams): Promise<MACPMessage> {
    // Build request message
    const request = this.buildRequestMessage(params);

    // Track pending request
    const pending = new PendingRequest(request, params.ttl_ms);
    this.pendingRequests.set(request.header.correlation_id, pending);

    // Route message
    await this.router.route(request);

    // Wait for response or timeout
    return pending.waitForResponse();
  }
}
```

### 12.4 Testing Strategy

#### 12.4.1 Unit Tests

```typescript
describe('MACP Message Validation', () => {
  it('should reject message without message_id', () => {
    const invalidMessage = { /* missing message_id */ };
    expect(() => validateMessage(invalidMessage))
      .toThrow('E2002: MISSING_REQUIRED_FIELD');
  });

  it('should reject unknown intent', () => {
    const message = createMessage({ intent: 'UNKNOWN_INTENT' });
    expect(() => validateMessage(message))
      .toThrow('E2003: INVALID_INTENT');
  });
});

describe('Authorization', () => {
  it('should deny unauthorized peer communication', () => {
    const request = createRequest({
      source: 'agent-a',
      target: 'agent-b'  // Not in agent-a's authorized_peers
    });
    expect(() => authRegistry.checkAuthorization(request))
      .toThrow('E3003: PEER_NOT_AUTHORIZED');
  });
});
```

#### 12.4.2 Integration Tests

```typescript
describe('Multi-Agent Workflow', () => {
  it('should complete delegation chain', async () => {
    const orchestrator = new MultiAgentOrchestrator();

    const result = await orchestrator.delegateTask(
      { intent: 'VERIFY_CONTENT', content: { artifact: '/test.md' } },
      ['veritas', 'architect'],
      { priority: 'NORMAL', timeout: 30000 }
    );

    expect(result.status).toBe('COMPLETED');
    expect(result.responses).toHaveLength(2);
  });

  it('should detect circular dependency', async () => {
    // Setup: A requests B, B requests C, C requests A
    const result = await triggerCircularChain();

    expect(result.error.code).toBe('E6001');
    expect(result.error.details.cycle).toContain('agent-a');
  });
});
```

#### 12.4.3 Load Tests

```typescript
describe('Performance', () => {
  it('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill(null).map(() =>
      sendTestRequest({ priority: 'NORMAL' })
    );

    const startTime = Date.now();
    const results = await Promise.all(requests);
    const duration = Date.now() - startTime;

    expect(results.filter(r => r.success)).toHaveLength(100);
    expect(duration).toBeLessThan(30000);  // Under 30 seconds
  });
});
```

---

## 13. Edge Cases and Failure Modes

### 13.1 Edge Cases

#### 13.1.1 Empty Target Group

**Scenario:** Broadcast sent to group with no members.

```yaml
handling:
  detection: "target_group resolves to empty set"
  action: "Return success with empty delivery list"
  message: "Broadcast delivered to 0 agents (group empty)"
```

#### 13.1.2 Self-Referential Request

**Scenario:** Agent sends request to itself.

```yaml
handling:
  detection: "source_agent == target_agent"
  action: "Allow with warning in observability log"
  rationale: "May be valid for internal state management"
```

#### 13.1.3 Orphaned Response

**Scenario:** Response received for unknown correlation_id.

```yaml
handling:
  detection: "correlation_id not in pending_requests"
  action: "Log warning, discard response"
  possible_causes:
    - "Original request timed out before response"
    - "Duplicate response from agent"
    - "Corrupted correlation_id"
```

#### 13.1.4 Session Migration

**Scenario:** Need to transfer conversation to new session.

```yaml
handling:
  trigger: "SESSION_MIGRATE request from orchestrator"
  action:
    - "Create new session with copied context"
    - "Update all pending requests with new session_id"
    - "Broadcast SESSION_MIGRATED to all agents"
    - "Deprecate old session"
```

#### 13.1.5 Agent Hot Reload

**Scenario:** Agent definition updated while requests pending.

```yaml
handling:
  trigger: "Agent manifest change detected"
  action:
    - "Complete all pending requests with old configuration"
    - "Drain agent queue"
    - "Reload agent with new configuration"
    - "Resume accepting new requests"
```

### 13.2 Failure Modes

#### 13.2.1 Router Failure

**Scenario:** Message router becomes unresponsive.

```yaml
symptoms:
  - "Messages not being delivered"
  - "ACKs not being received"
  - "Queue depth increasing without processing"

detection:
  - "Health check endpoint returns error"
  - "macp_queue_depth gauge increasing continuously"

recovery:
  automatic:
    - "Circuit breaker opens for router"
    - "Queued messages preserved"
    - "Health check monitors for recovery"
  manual:
    - "Restart router service"
    - "Check for resource exhaustion"
    - "Review error logs for root cause"
```

#### 13.2.2 Context Store Corruption

**Scenario:** Shared context becomes inconsistent.

```yaml
symptoms:
  - "Agents receiving conflicting context data"
  - "Context read returning partial data"
  - "Context write failing silently"

detection:
  - "Context checksum mismatch"
  - "Agent reports unexpected context state"

recovery:
  automatic:
    - "Rollback to last known good checkpoint"
    - "Notify all agents of context reset"
  manual:
    - "Identify corruption source"
    - "Rebuild context from conversation history"
    - "Validate context integrity"
```

#### 13.2.3 Priority Queue Starvation

**Scenario:** Low-priority messages never processed due to constant high-priority traffic.

```yaml
symptoms:
  - "Low-priority queue depth continuously growing"
  - "Low-priority message latency exceeding SLA"

detection:
  - "macp_queue_wait_time_ms{priority='LOW'} > threshold"
  - "macp_queue_depth{priority='LOW'} > max_normal"

recovery:
  automatic:
    - "Priority aging promotes stuck messages"
    - "Reserve minimum processing slots for low priority"
  configuration:
    min_low_priority_slots: 2
    low_priority_max_wait_ms: 60000
```

#### 13.2.4 Authorization Registry Unavailable

**Scenario:** Cannot verify agent permissions.

```yaml
symptoms:
  - "All authorization checks failing"
  - "Messages being rejected with E3xxx errors"

detection:
  - "Authorization check latency spike"
  - "High rate of E3xxx errors"

recovery:
  automatic:
    - "Fall back to cached authorization data"
    - "Reject only unknown agent pairs"
    - "Log all decisions for audit"
  cache_config:
    cache_ttl_ms: 300000
    stale_cache_ttl_ms: 600000

  degraded_mode:
    action: "Allow known-good pairs, reject unknown"
    alert: "AUTHORIZATION_DEGRADED_MODE"
```

#### 13.2.5 Observability Pipeline Backup

**Scenario:** Monitoring system cannot keep up with traffic.

```yaml
symptoms:
  - "Trace data missing for recent messages"
  - "Metrics delayed or incomplete"
  - "Log aggregator queue full"

detection:
  - "Observer bus buffer utilization > 80%"
  - "Trace completion rate < 95%"

recovery:
  automatic:
    - "Reduce trace sampling rate temporarily"
    - "Drop low-priority observability data"
    - "Buffer critical events locally"
  configuration:
    adaptive_sampling:
      enabled: true
      min_rate: 0.1
      max_rate: 1.0
      backpressure_threshold: 0.8
```

---

## Appendix A: Quick Reference

### Message Type Summary

| Type | Pattern | Response Expected | Use Case |
|------|---------|-------------------|----------|
| REQUEST | SYNC/ASYNC | Yes | Agent needs something |
| RESPONSE | SYNC | No | Reply to request |
| BROADCAST | FIRE_AND_FORGET | No | Announce to many |
| EVENT | FIRE_AND_FORGET | No | State change notification |
| ACK | SYNC | No | Receipt confirmation |
| ERROR | SYNC | No | Problem notification |

### Error Code Quick Reference

| Range | Category | Example |
|-------|----------|---------|
| E1xxx | Transport | E1001 MESSAGE_UNDELIVERABLE |
| E2xxx | Validation | E2001 MALFORMED_MESSAGE |
| E3xxx | Security | E3002 AUTHORIZATION_DENIED |
| E4xxx | Processing | E4001 RESOURCE_UNAVAILABLE |
| E5xxx | Timeout | E5002 RESPONSE_TIMEOUT |
| E6xxx | Deadlock | E6001 CIRCULAR_DEPENDENCY |

### Priority Level Quick Reference

| Priority | Code | Max Latency | Typical Use |
|----------|------|-------------|-------------|
| CRITICAL | 0 | Immediate | Security, failures |
| HIGH | 1 | 5 seconds | User-blocking |
| NORMAL | 2 | 30 seconds | Standard ops |
| LOW | 3 | Best effort | Background tasks |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Agent** | A specialized AI component with defined capabilities and persona |
| **Correlation ID** | Identifier linking request and response messages |
| **Delegation** | Assigning a subtask to a specialist agent |
| **Intent** | Machine-readable code describing message purpose |
| **Message Router** | Component responsible for message delivery |
| **Orchestrator** | Agent that coordinates multi-agent workflows |
| **Peer** | Another agent authorized for direct communication |
| **Session** | A conversation context shared by collaborating agents |
| **Span** | A single operation within a distributed trace |
| **Trace** | End-to-end record of a request through the system |
| **TTL** | Time-To-Live, maximum message validity duration |

---

## Appendix C: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-10 | Initial specification |

---

*End of Multi-Agent Collaboration Protocol Specification*
