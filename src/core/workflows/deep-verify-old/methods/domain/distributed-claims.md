# Distributed Systems Checker

## Purpose
Verify distributed systems claims against known limitations (CAP, FLP, BFT bounds).

## When to Apply
When artifact contains markers: consensus, partition, availability, consistency, replication, CAP, FLP.

## Distributed Systems Facts

### Impossibility Theorems

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **FLP** | Deterministic consensus impossible in async network with 1 crash | "async" + "consensus" + "fault tolerant" without trade-off |
| **CAP** | Cannot have C+A+P simultaneously | Claims all three |
| **BFT Bound** | Byzantine tolerance requires f < N/3 | Claims f ≥ N/3 |
| **Message Complexity** | BFT consensus lower bound Ω(N²) | Claims O(N) for BFT |

### CAP Trade-offs

| System Type | Sacrifices | Examples |
|-------------|------------|----------|
| CP | Availability during partition | Traditional databases, ZooKeeper |
| AP | Consistency during partition | Cassandra, DynamoDB |
| CA | Partition tolerance | Single-node systems only |

### Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "Eventually consistent = always available" | Still needs partition handling |
| "Consensus = data sync" | Different problems |
| "Paxos/Raft = Byzantine tolerant" | They handle crash failures, not Byzantine |

## Checklist

- [ ] **CAP claimed?** Which property is sacrificed?
- [ ] **Consensus claimed?** Sync or async? What failures tolerated?
- [ ] **BFT claimed?** Is f < N/3 bound respected?
- [ ] **Message complexity?** Ω(N²) for BFT consensus
- [ ] **Partition handling?** What happens during network split?

## Procedure

### Step 1: Extract Distributed Claims
Find claims about:
- Consistency guarantees
- Availability guarantees
- Partition tolerance
- Consensus properties
- Fault tolerance levels

### Step 2: Apply Checklist
Go through checklist for each claim.

### Step 3: Check Against Theorems
Compare claims against theorem table.

### Step 4: Flag Issues
- Claims all of CAP → CRITICAL
- Wrong BFT bound → CRITICAL
- FLP violation → CRITICAL

## Output Format

```markdown
## Distributed Systems Check Results

### Claims Found
| Claim | Location | Type |
|-------|----------|------|
| "[claim]" | line X | CAP/consensus/BFT/other |

### Checklist Results
| Check | Result | Notes |
|-------|--------|-------|
| CAP - what sacrificed? | [C/A/P/unclear] | [details] |
| Consensus - sync/async? | [answer] | [details] |
| BFT - bound correct? | YES/NO/N/A | [details] |
| Message complexity | [claimed] vs [bound] | [details] |

### Issues Found
| ID | Claim | Theorem Violated | Severity |
|----|-------|------------------|----------|
| D-1 | "[claim]" | [theorem] | CRITICAL/IMPORTANT |
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Claims all of CAP | CRITICAL |
| Wrong BFT bound | CRITICAL |
| FLP violation (async consensus with faults) | CRITICAL |
| Unclear partition handling | IMPORTANT |
| Missing consistency model specification | IMPORTANT |
