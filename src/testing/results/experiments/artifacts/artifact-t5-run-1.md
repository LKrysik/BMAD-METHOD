# Multi-Agent Collaboration Protocol - Design Document (Run 1)

## 1. Overview

### 1.1 Purpose
This document specifies a protocol for multi-agent collaboration, enabling specialized AI agents to work together on complex tasks through structured communication.

### 1.2 Design Goals
- **Interoperability**: Agents with different capabilities can communicate
- **Reliability**: Handle failures gracefully
- **Observability**: All communications are traceable
- **Scalability**: Support growing number of agents
- **Coherence**: Maintain context across agent boundaries

---

## 2. Protocol Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Collaboration Layer                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   Message    │  │  Session     │  │   Agent                  │  │
│  │   Router     │  │  Manager     │  │   Registry               │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                      Transport Layer                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Message Queue (In-Process)                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Core Components

| Component | Responsibility |
|-----------|---------------|
| Message Router | Route messages between agents |
| Session Manager | Track conversation state |
| Agent Registry | Manage agent identities and capabilities |
| Message Queue | Async message delivery |

---

## 3. Message Formats

### 3.1 Base Message Structure

```typescript
interface Message {
  id: string;                    // Unique message ID
  type: MessageType;             // REQUEST | RESPONSE | BROADCAST | EVENT
  from: AgentId;                 // Sender agent
  to: AgentId | AgentId[] | '*'; // Recipient(s)
  correlationId?: string;        // Links request/response
  timestamp: string;             // ISO 8601
  priority: Priority;            // LOW | NORMAL | HIGH | URGENT
  payload: MessagePayload;       // Content
  metadata: MessageMetadata;     // Additional context
}

enum MessageType {
  REQUEST = 'request',
  RESPONSE = 'response',
  BROADCAST = 'broadcast',
  EVENT = 'event'
}

enum Priority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3
}
```

### 3.2 Request/Response Pattern

```typescript
interface RequestMessage extends Message {
  type: 'request';
  payload: {
    action: string;
    parameters: Record<string, any>;
    timeout?: number;  // ms, default 30000
  };
}

interface ResponseMessage extends Message {
  type: 'response';
  correlationId: string;  // Required - links to request
  payload: {
    status: 'success' | 'error' | 'partial';
    result?: any;
    error?: ErrorInfo;
  };
}
```

### 3.3 Broadcast Pattern

```typescript
interface BroadcastMessage extends Message {
  type: 'broadcast';
  to: '*';
  payload: {
    topic: string;
    content: any;
  };
}
```

### 3.4 Subscription Pattern

```typescript
interface SubscriptionRequest {
  subscriberId: AgentId;
  topics: string[];
  filter?: SubscriptionFilter;
}

interface SubscriptionFilter {
  fromAgents?: AgentId[];
  priority?: Priority[];
  contentMatch?: string;  // Regex pattern
}
```

---

## 4. Communication Patterns

### 4.1 Request/Response Flow

```
Agent A                    Router                    Agent B
   │                         │                         │
   │──── REQUEST ──────────>│                         │
   │                         │──── REQUEST ──────────>│
   │                         │                         │
   │                         │<──── RESPONSE ─────────│
   │<──── RESPONSE ─────────│                         │
   │                         │                         │
```

**Timeout Handling:**
- Default timeout: 30 seconds
- On timeout: Return error response with `TIMEOUT` code
- Caller decides retry strategy

### 4.2 Broadcast Flow

```
Agent A                    Router                    All Agents
   │                         │                         │
   │──── BROADCAST ────────>│                         │
   │                         │──── BROADCAST ────────>│ (Agent B)
   │                         │──── BROADCAST ────────>│ (Agent C)
   │                         │──── BROADCAST ────────>│ (Agent D)
   │                         │                         │
```

### 4.3 Subscription Flow

```
Agent B                    Router
   │                         │
   │──── SUBSCRIBE(topic) ──>│
   │<──── ACK ──────────────│
   │                         │

Agent A                    Router                    Agent B
   │                         │                         │
   │──── EVENT(topic) ──────>│                         │
   │                         │──── EVENT ─────────────>│
   │                         │                         │
```

---

## 5. Agent Registry

### 5.1 Agent Registration

```typescript
interface AgentRegistration {
  id: AgentId;
  name: string;
  capabilities: string[];
  status: AgentStatus;
  endpoints: {
    receive: (message: Message) => Promise<void>;
  };
  metadata: {
    version: string;
    startedAt: string;
  };
}

enum AgentStatus {
  STARTING = 'starting',
  READY = 'ready',
  BUSY = 'busy',
  STOPPING = 'stopping',
  UNAVAILABLE = 'unavailable'
}
```

### 5.2 Capability Discovery

```typescript
interface CapabilityQuery {
  requiredCapabilities: string[];
  preferredCapabilities?: string[];
}

// Returns agents that match capabilities
function findAgents(query: CapabilityQuery): AgentRegistration[];
```

---

## 6. Failure Handling

### 6.1 Agent Unavailability

| Scenario | Detection | Response |
|----------|-----------|----------|
| Agent not responding | Timeout | Return error, mark unavailable |
| Agent crashed | Heartbeat miss | Remove from registry |
| Agent overloaded | BUSY status | Queue or redirect |

### 6.2 Timeout Strategy

```typescript
const timeoutConfig = {
  request: {
    default: 30000,      // 30 seconds
    min: 5000,           // 5 seconds
    max: 300000          // 5 minutes
  },
  heartbeat: {
    interval: 10000,     // 10 seconds
    missThreshold: 3     // 3 misses = unavailable
  }
};
```

### 6.3 Retry Logic

```typescript
interface RetryConfig {
  maxAttempts: number;        // Default: 3
  backoffMs: number;          // Default: 1000
  backoffMultiplier: number;  // Default: 2
}

// Retry with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig
): Promise<T>;
```

---

## 7. Session Management

### 7.1 Conversation Context

```typescript
interface ConversationSession {
  id: string;
  participants: AgentId[];
  startedAt: string;
  context: {
    topic: string;
    sharedState: Record<string, any>;
    messageHistory: MessageSummary[];
  };
  status: 'active' | 'paused' | 'completed';
}
```

### 7.2 Context Propagation

Each message includes session context:
```typescript
interface MessageMetadata {
  sessionId?: string;
  conversationDepth: number;  // How many hops from original
  contextSnapshot?: ContextSnapshot;
}
```

---

## 8. Observability

### 8.1 Message Logging

All messages are logged with:
- Full message content
- Timing information
- Routing decisions
- Delivery status

### 8.2 Metrics

| Metric | Description |
|--------|-------------|
| `messages_sent_total` | Count by type, priority |
| `message_latency_ms` | Request-response time |
| `agent_availability` | Per-agent uptime |
| `queue_depth` | Messages pending delivery |

### 8.3 Tracing

```typescript
interface TraceContext {
  traceId: string;     // Unique per conversation
  spanId: string;      // Unique per message
  parentSpanId?: string;
}
```

---

## 9. Priority Handling

### 9.1 Priority Levels

| Level | Use Case | Processing |
|-------|----------|------------|
| URGENT | System alerts, failures | Immediate, preempt queue |
| HIGH | Time-sensitive requests | Front of queue |
| NORMAL | Standard operations | FIFO |
| LOW | Background, batch | When idle |

### 9.2 Priority Escalation

If message waits > threshold, priority escalates:
- NORMAL → HIGH after 10 seconds
- HIGH → URGENT after 30 seconds

---

## 10. Assumptions

1. All agents run in same process (in-memory queue)
2. Agent IDs are unique and pre-assigned
3. Message serialization is handled by framework
4. Agents are cooperative (no malicious agents)
5. Clock synchronization between agents
6. Maximum 20 concurrent agents

---

## 11. Known Limitations

1. **Single Process**: No distributed deployment
2. **No Persistence**: Messages lost on crash
3. **No Encryption**: Messages are plaintext
4. **Simple Routing**: No content-based routing
5. **Limited Scalability**: In-memory queue limits throughput

---

## 12. Future Enhancements

1. Distributed deployment with Redis/RabbitMQ
2. Message persistence for durability
3. Content-based routing
4. Agent capability negotiation
5. Message compression for large payloads
