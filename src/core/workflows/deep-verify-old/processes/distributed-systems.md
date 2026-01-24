# Process: Distributed Systems Verification

## Triggers

Keywords that activate this process:
- consensus, agreement
- partition, network partition
- CAP, consistency, availability
- replication, replicated
- distributed, multi-node
- async, asynchronous
- Byzantine, fault-tolerant, BFT
- leader election
- eventual consistency, strong consistency
- quorum, majority

---

## Steps

### Step 1: Extract System Claims

**Do:** List ALL claims the artifact makes about the distributed system.

Look for these claim types:
- Consistency level (strong, eventual, causal, etc.)
- Availability guarantees
- Partition tolerance
- Fault tolerance (crash, Byzantine)
- Consensus properties (safety, liveness)
- Performance (latency, throughput, message complexity)

**Output Format:**
```
| Claim Type | Claimed? | Location | Exact Quote |
|------------|----------|----------|-------------|
| Consistency | [level] | §[X] | "[quote]" |
| Availability | [guarantee] | §[X] | "[quote]" |
| Partition Tolerance | YES/NO | §[X] | "[quote]" |
| Fault Tolerance | [type, count] | §[X] | "[quote]" |
| Consensus | [properties] | §[X] | "[quote]" |
```

---

### Step 2: Check CAP Theorem

**Do:** If system claims to be distributed, check CAP constraints.

**Uses:** domain-knowledge-base.md §1.Distributed Systems

**CAP Check:**
```
Claims Consistency? [YES/NO] - "[quote]"
Claims Availability? [YES/NO] - "[quote]"
Claims Partition Tolerance? [YES/NO] - "[quote]"

If ALL THREE claimed → CRITICAL (CAP violation)
If only TWO → Which is sacrificed? Is it explicit?
```

**Output:** CAP analysis result with quotes

---

### Step 3: Check FLP Theorem

**Do:** If system claims consensus, check FLP constraints.

**Uses:** domain-knowledge-base.md §1.Distributed Systems

**FLP Check:**
```
Is network asynchronous? [YES/NO/UNCLEAR]
Claims consensus/agreement? [YES/NO]
Claims fault tolerance? [YES/NO]
Claims liveness guarantee? [YES/NO]

If async + consensus + fault-tolerant + liveness → CRITICAL (FLP violation)
```

**Note:** FLP doesn't prohibit practical consensus, but prohibits GUARANTEED liveness in async with faults.

**Output:** FLP analysis result

---

### Step 4: Check Byzantine Bounds

**Do:** If system claims Byzantine fault tolerance, check bounds.

**Uses:** domain-knowledge-base.md §1.Distributed Systems

**BFT Checks:**
```
| Check | Correct Bound | Artifact Claims | Violated? |
|-------|---------------|-----------------|-----------|
| Fault tolerance | f < N/3 | [what artifact says] | [YES/NO] |
| Message complexity | Ω(N²) | [what artifact says] | [YES/NO] |
```

**Common errors:**
- Claims f < N/2 (wrong - that's crash tolerance, not Byzantine)
- Claims O(N) messages (wrong - BFT requires Ω(N²))

**Output:** BFT bounds check result

---

### Step 5: Check Consistency Model

**Do:** Verify consistency claims are coherent.

**Uses:** domain-knowledge-base.md §2.Distributed Systems Terms

**Consistency Hierarchy:**
```
Linearizable > Sequential > Causal > Eventual

If claims higher level, verify mechanism supports it.
If claims "consistent" without specifying → flag as ambiguous.
```

**Common errors:**
- Claims "strong consistency" but describes eventual
- Claims "linearizable" without total ordering mechanism
- Claims "consistent" in different meanings across document

**Output:** Consistency model analysis

---

## Finding Templates

### CRITICAL Findings

**CAP Violation:**
```
Finding: Artifact claims Consistency + Availability + Partition Tolerance simultaneously.
Theorem: CAP theorem (Brewer 2000) - cannot have all three.
Evidence:
- Consistency: "[quote]"
- Availability: "[quote]"
- Partition Tolerance: "[quote]"
Severity: CRITICAL
Recommendation: Specify which property is sacrificed during partitions.
```

**FLP Violation:**
```
Finding: Artifact claims guaranteed liveness for async consensus with faults.
Theorem: FLP (1985) - impossible for deterministic consensus.
Evidence: "[quotes showing async + liveness + fault-tolerant]"
Severity: CRITICAL
Recommendation: Acknowledge probabilistic liveness or synchrony assumptions.
```

### IMPORTANT Findings

**Wrong BFT Bound:**
```
Finding: Uses incorrect Byzantine tolerance bound.
Claim: "[what artifact says]"
Correct: f < N/3 (not N/2)
Severity: IMPORTANT
```

**Message Complexity:**
```
Finding: Claims O(N) message complexity for BFT consensus.
Theorem: Lower bound is Ω(N²).
Evidence: "[quote]"
Severity: IMPORTANT
```

---

## Process Metrics

| Metric | Target |
|--------|--------|
| Steps | 5 |
| Tokens | 1.5-3K |
| Time | 2-4 min |
| Domain-KB sections used | §1.Distributed, §2.Distributed Terms |
