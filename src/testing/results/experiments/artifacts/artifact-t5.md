# Multi-Agent Collaboration Protocol - Technical Design (Run 3)

## 1. Introduction

### 1.1 Purpose
Define a communication protocol for AI agents to collaborate on complex tasks requiring multiple specialized capabilities.

### 1.2 Scope
- Inter-agent messaging
- Session management
- Failure handling
- Observability

---

## 2. Architecture

### 2.1 Component Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    Collaboration Framework                      │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐│
│  │  Messenger  │  │  Scheduler  │  │  Context Store          ││
│  │  (routing)  │  │  (priority) │  │  (shared state)         ││
│  └─────────────┘  └─────────────┘  └─────────────────────────┘│
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐│
│  │  Registry   │  │  Monitor    │  │  Subscription           ││
│  │  (agents)   │  │  (health)   │  │  Manager                ││
│  └─────────────┘  └─────────────┘  └─────────────────────────┘│
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 2.2 Agent Model

```typescript
interface CollaboratingAgent {
  // Identity
  id: string;
  name: string;
  role: AgentRole;

  // Capabilities
  capabilities: string[];
  supportedActions: Action[];

  // State
  status: 'idle' | 'working' | 'waiting' | 'offline';
  currentTask?: TaskReference;

  // Communication
  inbox: MessageQueue;
  outbox: MessageQueue;
}

type AgentRole = 'coordinator' | 'worker' | 'specialist' | 'observer';
```

---

## 3. Message Protocol

### 3.1 Message Schema

```typescript
interface ProtocolMessage {
  // Identification
  id: MessageId;
  version: '1.0';

  // Routing
  from: AgentId;
  to: Destination;
  replyTo?: AgentId;

  // Classification
  type: 'command' | 'query' | 'event' | 'response';
  priority: 0 | 1 | 2 | 3;

  // Timing
  timestamp: ISOString;
  expiresAt?: ISOString;

  // Content
  action: string;
  payload: unknown;

  // Context
  sessionId?: string;
  correlationId?: string;
  causationId?: string;
}

type Destination = AgentId | AgentId[] | TopicName | '*';
```

### 3.2 Message Types

#### Command (Request)
```json
{
  "type": "command",
  "action": "analyze-document",
  "payload": {
    "documentId": "doc_123",
    "depth": "thorough"
  },
  "replyTo": "agent-coordinator"
}
```

#### Query
```json
{
  "type": "query",
  "action": "get-status",
  "payload": {},
  "replyTo": "agent-monitor"
}
```

#### Event (Notification)
```json
{
  "type": "event",
  "action": "analysis-complete",
  "payload": {
    "documentId": "doc_123",
    "findingsCount": 5
  }
}
```

#### Response
```json
{
  "type": "response",
  "correlationId": "msg_original",
  "payload": {
    "success": true,
    "data": { ... }
  }
}
```

---

## 4. Communication Patterns

### 4.1 Direct Request/Response

```
Coordinator                    Worker
     │                           │
     │── COMMAND ───────────────>│
     │                           │ (processing)
     │<── RESPONSE ──────────────│
     │                           │
```

**Implementation:**
```typescript
async function request(to: AgentId, action: string, payload: any): Promise<Response> {
  const msg = createMessage('command', to, action, payload);
  const response = await sendAndWait(msg, { timeout: 30000 });
  return response;
}
```

### 4.2 Publish/Subscribe

```typescript
// Publisher
messenger.publish('topic:findings', {
  action: 'new-finding',
  payload: { severity: 'high', description: '...' }
});

// Subscriber
messenger.subscribe('topic:findings', (msg) => {
  handleFinding(msg.payload);
});
```

### 4.3 Broadcast

```typescript
// Send to all agents
messenger.broadcast({
  action: 'shutdown-warning',
  payload: { inSeconds: 60 }
});
```

### 4.4 Chain (Multi-hop)

```
Agent A ──> Agent B ──> Agent C ──> Agent D
                                      │
Agent A <─────────────────────────────┘
```

Uses `causationId` to track chain:
```typescript
const chainedMsg = {
  ...originalMsg,
  causationId: originalMsg.id,
  correlationId: originalMsg.correlationId // preserved
};
```

---

## 5. Failure Handling

### 5.1 Timeout Management

```typescript
const timeouts = {
  command: 30000,    // 30s for commands
  query: 5000,       // 5s for queries
  broadcast: 1000,   // 1s for broadcasts (fire-and-forget)
};

async function sendWithTimeout(msg: Message, timeout: number): Promise<Response> {
  const timer = setTimeout(() => {
    throw new TimeoutError(`No response from ${msg.to} within ${timeout}ms`);
  }, timeout);

  try {
    return await send(msg);
  } finally {
    clearTimeout(timer);
  }
}
```

### 5.2 Agent Unavailability

**Detection:**
- Heartbeat every 10 seconds
- 3 missed heartbeats = mark offline
- Timeout on direct message = temporary unavailable

**Handling:**
```typescript
async function handleUnavailable(agentId: AgentId, msg: Message): Promise<void> {
  // Option 1: Queue for later
  await pendingQueue.add(agentId, msg);

  // Option 2: Find alternative agent
  const alternative = await registry.findAlternative(agentId);
  if (alternative) {
    await redirect(msg, alternative);
  }

  // Option 3: Fail the request
  throw new AgentUnavailableError(agentId);
}
```

### 5.3 Retry Policy

```typescript
const retryPolicy = {
  maxAttempts: 3,
  delays: [1000, 2000, 4000], // Exponential backoff
  retryOn: ['TIMEOUT', 'UNAVAILABLE', 'OVERLOADED']
};
```

---

## 6. Deadlock Prevention

### 6.1 Circular Dependency Detection

Track message chains to detect cycles:

```typescript
class DeadlockDetector {
  private chains: Map<CorrelationId, AgentId[]> = new Map();

  checkForCycle(msg: Message): boolean {
    const chain = this.chains.get(msg.correlationId) || [];
    if (chain.includes(msg.to)) {
      return true; // Cycle detected!
    }
    chain.push(msg.from);
    this.chains.set(msg.correlationId, chain);
    return false;
  }
}
```

### 6.2 Prevention Strategies

1. **Timeout-based**: All requests have TTL
2. **Ordering**: Agents acquire "locks" in consistent order
3. **Detection + Abort**: Detect cycle, abort youngest request

---

## 7. Session & Context

### 7.1 Session Structure

```typescript
interface CollaborationSession {
  id: SessionId;

  // Participants
  coordinator: AgentId;
  participants: AgentId[];

  // Timeline
  startedAt: Date;
  lastActivity: Date;
  status: 'active' | 'paused' | 'completed' | 'failed';

  // Shared State
  context: {
    task: TaskDescription;
    decisions: Decision[];
    artifacts: Artifact[];
    findings: Finding[];
  };

  // History
  messageLog: MessageSummary[];
}
```

### 7.2 Context Sharing

Agents access shared context:
```typescript
// Read context
const decisions = await session.getDecisions();

// Update context
await session.addDecision({
  by: thisAgent.id,
  decision: 'Use YAML format',
  rationale: 'Human readable requirement'
});
```

---

## 8. Priority System

### 8.1 Priority Levels

| Level | Name | Use Case |
|-------|------|----------|
| 3 | URGENT | System failures, critical alerts |
| 2 | HIGH | Time-sensitive operations |
| 1 | NORMAL | Standard requests |
| 0 | LOW | Background, batch operations |

### 8.2 Priority Queue

```typescript
class PriorityScheduler {
  private queues: Map<Priority, Message[]> = new Map([
    [3, []], [2, []], [1, []], [0, []]
  ]);

  enqueue(msg: Message): void {
    this.queues.get(msg.priority)!.push(msg);
  }

  dequeue(): Message | null {
    for (const priority of [3, 2, 1, 0]) {
      const queue = this.queues.get(priority)!;
      if (queue.length > 0) {
        return queue.shift()!;
      }
    }
    return null;
  }
}
```

---

## 9. Observability

### 9.1 Message Tracing

```typescript
interface TraceSpan {
  traceId: string;      // Conversation-wide
  spanId: string;       // This message
  parentSpanId?: string; // Causing message

  operation: string;
  startTime: Date;
  endTime?: Date;
  status: 'ok' | 'error';

  tags: Record<string, string>;
  logs: SpanLog[];
}
```

### 9.2 Metrics

```typescript
const metrics = {
  // Counters
  messagesSent: new Counter('messages_sent_total', ['type', 'priority']),
  messagesReceived: new Counter('messages_received_total', ['type']),
  errors: new Counter('errors_total', ['type', 'agent']),

  // Histograms
  latency: new Histogram('message_latency_ms', ['type']),
  queueTime: new Histogram('queue_time_ms', ['priority']),

  // Gauges
  activeAgents: new Gauge('active_agents'),
  queueDepth: new Gauge('queue_depth', ['priority'])
};
```

### 9.3 Audit Log

All messages logged for debugging:
```json
{
  "timestamp": "2026-01-10T14:30:00Z",
  "event": "message_delivered",
  "messageId": "msg_123",
  "from": "coordinator",
  "to": "analyzer",
  "type": "command",
  "latencyMs": 5,
  "success": true
}
```

---

## 10. Assumptions

1. Single-process deployment (in-memory communication)
2. Cooperative agents (no Byzantine failures)
3. Unique agent identifiers assigned at startup
4. JSON-serializable message payloads
5. Synchronized system clocks
6. Maximum 30 concurrent agents

---

## 11. Limitations

### 11.1 Current Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| No persistence | Messages lost on crash | External logging |
| No encryption | Messages readable | Trust boundary |
| Single process | No horizontal scale | Future: distributed |
| No auth | Any agent can send | Trust boundary |

### 11.2 Scalability Bounds

- Agents: 30 max (in-memory overhead)
- Messages/sec: 5000 (single thread)
- Message size: 512KB max
- Session duration: 1 hour max

---

## 12. Future Roadmap

1. **v1.1**: Message persistence (SQLite)
2. **v1.2**: Distributed deployment (Redis pub/sub)
3. **v2.0**: Agent authentication
4. **v2.1**: Message encryption
5. **v3.0**: Cross-network federation
