# Byzantine-Fault-Tolerant Consensus Protocol for Autonomous Verification Agents

## AEGIS-BFT: Autonomous Ensemble Group Intelligence and Safety Protocol

**Version:** 1.0.0
**Status:** Production Specification
**Authors:** Distributed Systems Architecture Team
**Date:** 2026-01-12

---

## 1. Executive Summary

AEGIS-BFT is a Byzantine-fault-tolerant consensus protocol designed specifically for autonomous AI agents that must reach agreement on verification findings. The protocol achieves consensus in three communication rounds during normal operation, with an optimistic fast path completing in a single round when all agents agree. AEGIS-BFT tolerates up to f Byzantine failures where f < N/2, providing strong safety guarantees while maintaining liveness in synchronous network conditions.

---

## 2. Protocol Overview

### 2.1 System Model

The protocol operates over a network of N autonomous verification agents, each possessing a unique cryptographic identity. Agents communicate via authenticated point-to-point channels. The protocol assumes:

- **Agent Count:** N ≥ 3 agents participate in consensus
- **Fault Tolerance:** Up to f < N/2 agents may exhibit Byzantine behavior
- **Cryptography:** Each agent holds a private signing key; all other agents hold corresponding public keys
- **Network:** Asynchronous message delivery with eventual connectivity guarantees

### 2.2 Consensus Values

Unlike traditional binary consensus, AEGIS-BFT handles complex verification findings as consensus values:

```
VerificationFinding := {
    artifact_id: UUID,
    verification_result: PASS | FAIL | PARTIAL,
    confidence_score: Float[0.0, 1.0],
    evidence_hashes: List<SHA-256>,
    agent_assessments: Map<AgentID, Assessment>,
    timestamp: ISO-8601,
    metadata: JSON
}
```

### 2.3 Protocol Phases

Normal operation proceeds through three phases:

1. **PROPOSE:** Leader broadcasts proposed consensus value
2. **PREPARE:** Agents validate and broadcast preparation votes
3. **COMMIT:** Agents collect prepare certificates and commit

The optimistic fast path collapses these phases when unanimous agreement is detected.

---

## 3. Message Formats

### 3.1 Core Message Structure

All protocol messages follow this authenticated envelope:

```
Message := {
    header: {
        protocol_version: "AEGIS-BFT-1.0",
        message_type: PROPOSE | PREPARE | COMMIT | VIEW-CHANGE | NEW-VIEW,
        view_number: uint64,
        sequence_number: uint64,
        sender_id: AgentID,
        timestamp: uint64
    },
    payload: <type-specific>,
    signature: Ed25519-Signature(header || payload)
}
```

### 3.2 Phase-Specific Messages

**PROPOSE Message:**
```
ProposePayload := {
    value: VerificationFinding,
    value_digest: SHA-256(value),
    fast_path_enabled: boolean
}
```

**PREPARE Message:**
```
PreparePayload := {
    value_digest: SHA-256,
    leader_proposal_signature: Signature,
    vote: ACCEPT | REJECT,
    rejection_reason: Optional<String>
}
```

**COMMIT Message:**
```
CommitPayload := {
    value_digest: SHA-256,
    prepare_certificate: List<PrepareMessage>,  // ⌈(N+f+1)/2⌉ signatures
    commit_vote: FINALIZE
}
```

### 3.3 View Change Messages

**VIEW-CHANGE Message:**
```
ViewChangePayload := {
    new_view: uint64,
    last_committed_sequence: uint64,
    prepared_values: List<{seq, value_digest, prepare_cert}>,
    checkpoint_proof: CheckpointCertificate
}
```

**NEW-VIEW Message:**
```
NewViewPayload := {
    view_number: uint64,
    view_change_proofs: List<ViewChangeMessage>,  // f+1 messages
    pre_prepared_batch: List<ProposeMessage>
}
```

---

## 4. State Machine Specification

### 4.1 Agent States

Each agent maintains the following state:

```
AgentState := {
    // Identity
    agent_id: AgentID,
    private_key: Ed25519-PrivateKey,

    // View state
    current_view: uint64,
    current_leader: AgentID,  // = view mod N

    // Sequence state
    last_committed_seq: uint64,
    last_prepared_seq: uint64,

    // Message logs
    proposal_log: Map<(view, seq), ProposeMessage>,
    prepare_log: Map<(view, seq), Set<PrepareMessage>>,
    commit_log: Map<(view, seq), Set<CommitMessage>>,

    // Timers
    proposal_timer: Timer,
    view_change_timer: Timer,

    // Partition detection
    last_heard: Map<AgentID, Timestamp>,
    connectivity_threshold: Duration
}
```

### 4.2 State Transitions

**Normal Operation Flow:**

```
IDLE --[receive PROPOSE]--> PREPARING
    |-- validate proposal
    |-- broadcast PREPARE(ACCEPT) if valid
    |-- broadcast PREPARE(REJECT) if invalid

PREPARING --[collect ⌈(N+f+1)/2⌉ PREPARE(ACCEPT)]--> COMMITTING
    |-- form prepare_certificate
    |-- broadcast COMMIT

COMMITTING --[collect ⌈(N+f+1)/2⌉ COMMIT]--> DECIDED
    |-- persist decision
    |-- notify application layer
    |-- advance sequence number
```

**Fast Path (Optimistic):**

```
IDLE --[receive PROPOSE with fast_path=true]--> FAST_COMMIT
    |-- if value matches local preference
    |-- broadcast FAST-COMMIT

FAST_COMMIT --[collect N FAST-COMMIT within timeout]--> DECIDED
    |-- immediate finalization
    |-- fallback to normal path on timeout
```

### 4.3 Leader Selection

The leader for view v is deterministically computed:

```
leader(v) = agents[v mod N]
```

This ensures fair rotation and allows all agents to independently determine the current leader.

---

## 5. View Change Protocol

### 5.1 Trigger Conditions

An agent initiates view change when:

1. Proposal timer expires without receiving valid PROPOSE
2. Evidence of leader misbehavior (equivocation detected)
3. Received f+1 VIEW-CHANGE messages for higher view

### 5.2 View Change Procedure

```
procedure initiateViewChange(new_view):
    broadcast VIEW-CHANGE(new_view, last_committed, prepared_set)
    start view_change_timer(new_view)

procedure onReceiveViewChange(msg):
    view_change_msgs[msg.new_view].add(msg)
    if |view_change_msgs[msg.new_view]| >= f+1:
        if I am leader(msg.new_view):
            constructNewView(msg.new_view)

procedure constructNewView(v):
    proofs = select f+1 VIEW-CHANGE messages for v
    pending = computePendingProposals(proofs)
    broadcast NEW-VIEW(v, proofs, pending)

procedure onReceiveNewView(msg):
    if validateNewView(msg):
        current_view = msg.view_number
        process pending proposals
        reset timers
```

### 5.3 Safety During View Change

The protocol ensures no committed value is lost during view change by requiring the new leader to:

1. Collect VIEW-CHANGE from f+1 agents (ensures at least one honest agent's state)
2. Re-propose any value with a valid prepare certificate
3. Agents verify the NEW-VIEW message before accepting the new leader

---

## 6. Partition Detection and Handling

### 6.1 Connectivity Monitoring

Each agent maintains a heartbeat mechanism:

```
procedure heartbeatMonitor():
    every HEARTBEAT_INTERVAL:
        broadcast HEARTBEAT(current_view, last_committed)

procedure onReceiveHeartbeat(msg):
    last_heard[msg.sender] = now()

procedure checkPartition():
    connected = count(a : now() - last_heard[a] < threshold)
    if connected < ⌈(N+1)/2⌉:
        enter PARTITION_DETECTED state
        pause consensus participation
        notify application layer
```

### 6.2 Minority Partition Behavior

Agents detecting minority partition status:

1. Stop proposing new consensus instances
2. Continue responding to queries with last committed state
3. Attempt reconnection to majority partition
4. Resume normal operation upon reconnection and state sync

---

## 7. Dynamic Reconfiguration

### 7.1 Reconfiguration Protocol

AEGIS-BFT supports adding/removing agents through consensus-based reconfiguration:

```
ReconfigurationRequest := {
    type: ADD_AGENT | REMOVE_AGENT,
    target_agent: AgentID,
    new_agent_pubkey: Optional<PublicKey>,  // for ADD
    effective_sequence: uint64
}
```

Reconfiguration proceeds as a special consensus instance:

1. Current leader proposes RECONFIG as consensus value
2. Normal three-phase consensus executes
3. Upon commit, all agents update their agent set at effective_sequence
4. New configuration takes effect for subsequent instances

### 7.2 Consistency Guarantees

- Reconfiguration is serialized with normal consensus
- All honest agents apply reconfiguration at the same sequence number
- In-flight consensus instances complete under old configuration

---

## 8. Correctness Arguments

### 8.1 Safety: Agreement

**Theorem:** No two honest agents decide different values for the same consensus instance.

**Argument:** A decision requires a commit certificate containing ⌈(N+f+1)/2⌉ commit messages. Since f < N/2, any two commit certificates must share at least one honest agent. An honest agent only sends COMMIT for a single value per instance, guaranteed by the prepare certificate requirement. Therefore, conflicting decisions are impossible.

### 8.2 Safety: Validity

**Theorem:** If an honest agent decides value v, then v was proposed by some agent.

**Argument:** Honest agents only prepare values received in valid PROPOSE messages. The prepare certificate in COMMIT messages proves the value originated from a proposal. Cryptographic signatures prevent forgery.

### 8.3 Liveness

**Theorem:** Under synchronous network conditions with a correct leader, consensus terminates within bounded time.

**Argument:** With synchronous message delivery, all honest agents receive the PROPOSE within bounded time Δ. Honest agents respond with PREPARE, and the leader collects sufficient prepares within 2Δ. The COMMIT phase completes similarly. Total latency is bounded by 3Δ plus processing time.

### 8.4 View Change Safety

**Theorem:** View change preserves all committed values and prepared values with certificates.

**Argument:** The VIEW-CHANGE message includes all prepared values. Collecting f+1 VIEW-CHANGE messages guarantees inclusion of at least one honest agent's state. The new leader must re-propose any value with a valid prepare certificate, ensuring continuity.

---

## 9. Complexity Analysis

### 9.1 Message Complexity

| Phase | Messages | Complexity |
|-------|----------|------------|
| PROPOSE | 1 broadcast | O(N) |
| PREPARE | N broadcasts | O(N) with aggregation |
| COMMIT | N broadcasts | O(N) with aggregation |
| **Total** | | **O(N)** |

Message complexity is achieved through signature aggregation, where agents send their votes to a designated aggregator (the leader) who combines them into certificates.

### 9.2 Communication Rounds

- **Normal operation:** 3 rounds (PROPOSE → PREPARE → COMMIT)
- **Fast path:** 1 round (when all N agents agree immediately)
- **View change:** 2 additional rounds (VIEW-CHANGE → NEW-VIEW)

---

## 10. Implementation Considerations

### 10.1 Cryptographic Requirements

- **Signatures:** Ed25519 for individual message authentication
- **Aggregation:** BLS signatures for certificate compression
- **Hashing:** SHA-256 for value digests and Merkle proofs

### 10.2 Timeout Configuration

Recommended timeout values (adjustable based on deployment):

| Timer | Default Value | Purpose |
|-------|---------------|---------|
| proposal_timeout | 5 seconds | Trigger view change on leader failure |
| prepare_timeout | 3 seconds | Fallback from fast path |
| heartbeat_interval | 1 second | Partition detection |
| connectivity_threshold | 10 seconds | Declare agent unreachable |

### 10.3 Persistence Requirements

Agents must persist to stable storage before sending messages:
- Current view number
- All sent PREPARE and COMMIT messages
- Decided values and sequence numbers

This ensures crash recovery without violating safety.

---

## 11. Conclusion

AEGIS-BFT provides a robust consensus mechanism for autonomous verification agents operating in adversarial environments. The protocol's three-round normal operation, single-round optimistic path, and comprehensive view change mechanism ensure both efficiency and resilience. With O(N) message complexity and support for dynamic reconfiguration, AEGIS-BFT scales effectively while maintaining strong safety and liveness guarantees required for trustworthy distributed verification systems.

---

**Document Classification:** Technical Specification
**Distribution:** Internal Engineering Teams
**Review Cycle:** Quarterly
