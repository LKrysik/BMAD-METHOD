# Multi-Agent Collaboration Protocol - Specification (Run 2)

## Executive Summary

This specification defines a protocol enabling multiple AI agents to collaborate on complex tasks through structured message passing, shared context, and coordinated workflows.

---

## 1. Protocol Overview

### 1.1 Core Principles

- **Loose Coupling**: Agents communicate via messages, not direct calls
- **Async by Default**: Non-blocking message delivery
- **Observable**: All interactions are logged and traceable
- **Resilient**: Graceful degradation on failures

### 1.2 Supported Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Request/Response | Synchronous-style call | Direct agent queries |
| Publish/Subscribe | Topic-based distribution | Event notifications |
| Broadcast | All-agent announcements | System-wide updates |

---

## 2. Message Structure

### 2.1 Envelope Format

```json
{
  "header": {
    "messageId": "msg_uuid_123",
    "correlationId": "corr_uuid_456",
    "type": "REQUEST|RESPONSE|PUBLISH|BROADCAST",
    "source": "agent-analyzer",
    "destination": "agent-planner|*|topic:findings",
    "timestamp": "2026-01-10T14:30:00Z",
    "priority": 1,
    "ttl": 30000
  },
  "body": {
    "action": "analyze",
    "payload": { ... },
    "context": { ... }
  },
  "trace": {
    "traceId": "trace_123",
    "spanId": "span_456",
    "parentSpan": "span_123"
  }
}
```

### 2.2 Message Types

**REQUEST**: Expects response
```json
{
  "type": "REQUEST",
  "body": {
    "action": "verify",
    "payload": { "content": "..." },
    "responseRequired": true
  }
}
```

**RESPONSE**: Reply to request
```json
{
  "type": "RESPONSE",
  "correlationId": "original_request_id",
  "body": {
    "status": "SUCCESS|ERROR|TIMEOUT",
    "result": { ... },
    "error": null
  }
}
```

**PUBLISH**: To topic subscribers
```json
{
  "type": "PUBLISH",
  "destination": "topic:verification-complete",
  "body": {
    "event": "VerificationComplete",
    "data": { ... }
  }
}
```

---

## 3. Agent Management

### 3.1 Agent Lifecycle

```
INITIALIZING → READY → BUSY ⟷ READY → STOPPING → STOPPED
                  ↓
            UNAVAILABLE
```

### 3.2 Registration

```typescript
interface Agent {
  id: string;
  name: string;
  version: string;
  capabilities: Capability[];
  status: AgentStatus;
  messageHandler: (msg: Message) => Promise<Response>;
}

interface Capability {
  name: string;
  version: string;
  actions: string[];
}
```

### 3.3 Discovery

Agents query registry for peers:
```typescript
// Find agents with capability
const agents = await registry.find({
  capability: 'verification',
  status: 'READY'
});
```

---

## 4. Communication Patterns

### 4.1 Request/Response

```
┌─────────┐          ┌─────────┐          ┌─────────┐
│ Agent A │          │  Bus    │          │ Agent B │
└────┬────┘          └────┬────┘          └────┬────┘
     │                    │                    │
     │─── REQUEST ───────>│                    │
     │                    │─── REQUEST ───────>│
     │                    │                    │
     │                    │<── RESPONSE ───────│
     │<── RESPONSE ───────│                    │
     │                    │                    │
```

**Timeout Behavior:**
- Configurable per-request (default 30s)
- Returns ERROR response on timeout
- Agent marked UNAVAILABLE after 3 consecutive timeouts

### 4.2 Publish/Subscribe

```typescript
// Subscribe to topic
await bus.subscribe('topic:findings', async (msg) => {
  console.log('Finding received:', msg.body);
});

// Publish to topic
await bus.publish('topic:findings', {
  event: 'NewFinding',
  data: { severity: 'HIGH', description: '...' }
});
```

### 4.3 Broadcast

Sent to all registered agents:
```typescript
await bus.broadcast({
  event: 'SystemShutdown',
  countdown: 30
});
```

---

## 5. Failure Handling

### 5.1 Detection Methods

| Method | Trigger | Action |
|--------|---------|--------|
| Timeout | No response in TTL | Mark message failed |
| Heartbeat | 3 missed beats | Mark agent unavailable |
| Error Response | Agent returns error | Log and propagate |

### 5.2 Retry Strategy

```typescript
const retryPolicy = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryableErrors: ['TIMEOUT', 'UNAVAILABLE']
};
```

### 5.3 Circuit Breaker

```typescript
const circuitBreaker = {
  failureThreshold: 5,      // Open after 5 failures
  resetTimeout: 60000,      // Try again after 60s
  halfOpenRequests: 3       // Test requests before fully closing
};
```

---

## 6. Context Management

### 6.1 Session Context

```typescript
interface Session {
  id: string;
  initiator: AgentId;
  participants: AgentId[];
  createdAt: Date;
  expiresAt: Date;
  context: {
    task: TaskDescription;
    decisions: Decision[];
    artifacts: Artifact[];
  };
}
```

### 6.2 Context Propagation

Context flows with messages:
```json
{
  "body": {
    "context": {
      "sessionId": "sess_123",
      "taskId": "task_456",
      "previousDecisions": ["use JSONL", "add indices"]
    }
  }
}
```

### 6.3 Coherence Maintenance

- Each message includes session reference
- Agents can query session for full history
- Conflicts resolved by timestamp

---

## 7. Observability

### 7.1 Logging

Every message logged:
```json
{
  "timestamp": "2026-01-10T14:30:00Z",
  "event": "MESSAGE_SENT",
  "messageId": "msg_123",
  "source": "agent-a",
  "destination": "agent-b",
  "type": "REQUEST",
  "latencyMs": null
}
```

### 7.2 Metrics

| Metric | Type | Labels |
|--------|------|--------|
| `agent_messages_total` | Counter | source, dest, type |
| `agent_request_duration` | Histogram | source, dest |
| `agent_errors_total` | Counter | source, error_type |
| `agent_queue_size` | Gauge | agent_id |

### 7.3 Distributed Tracing

OpenTelemetry compatible:
- TraceID: Unique per conversation
- SpanID: Unique per message
- Parent linking for call chains

---

## 8. Priority System

### 8.1 Priority Levels

| Level | Value | Processing |
|-------|-------|------------|
| CRITICAL | 4 | Immediate, bypass queue |
| HIGH | 3 | Front of queue |
| NORMAL | 2 | Standard FIFO |
| LOW | 1 | Background |
| BATCH | 0 | When idle |

### 8.2 Priority Inversion Prevention

If low-priority task blocks high-priority:
- Temporarily elevate low-priority task
- Log priority boost for analysis

---

## 9. Error Handling

### 9.1 Error Categories

| Category | Retryable | Example |
|----------|-----------|---------|
| TIMEOUT | Yes | Agent slow to respond |
| UNAVAILABLE | Yes | Agent offline |
| REJECTED | No | Invalid request |
| INTERNAL | Maybe | Agent crashed |

### 9.2 Error Response Format

```json
{
  "status": "ERROR",
  "error": {
    "code": "TIMEOUT",
    "message": "Agent did not respond within 30s",
    "retryable": true,
    "retryAfter": 5000
  }
}
```

---

## 10. Assumptions

1. Agents run in cooperative environment
2. Network between agents is reliable (same process)
3. Agent identifiers are globally unique
4. Messages are processed in order per-agent
5. System clock is synchronized
6. Maximum message size: 1MB

---

## 11. Limitations

1. **No Distribution**: Single-process only
2. **No Persistence**: In-memory messages
3. **No Auth**: Assumes trusted environment
4. **No Encryption**: Plaintext messages
5. **Limited Scale**: <50 agents recommended

---

## 12. Implementation Notes

### 12.1 Recommended Libraries

| Component | Library |
|-----------|---------|
| Message Queue | In-process EventEmitter |
| Serialization | JSON |
| Tracing | OpenTelemetry |
| Metrics | Prometheus client |

### 12.2 Performance Targets

| Metric | Target |
|--------|--------|
| Message latency | <10ms (in-process) |
| Throughput | 10,000 msg/sec |
| Max agents | 50 |
| Max message size | 1MB |
