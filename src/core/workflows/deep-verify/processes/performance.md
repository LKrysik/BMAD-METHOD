# Process: Performance Claims Verification

## Triggers

Keywords that activate this process:
- O(1), O(n), O(log n), O(n²), complexity
- latency, response time
- throughput, requests per second, TPS
- real-time, real time
- fast, faster, fastest
- scalable, scalability, scales
- benchmark, performance
- milliseconds, ms, microseconds
- parallel, concurrent
- optimized, optimization

---

## Steps

### Step 1: Extract Performance Claims

**Do:** List ALL performance-related claims in the artifact.

Look for these claim types:
- Time complexity (Big O)
- Space complexity
- Latency guarantees
- Throughput numbers
- Scalability claims
- Real-time guarantees
- Benchmark results

**Output Format:**
```
| Claim Type | Value Claimed | Location | Exact Quote |
|------------|---------------|----------|-------------|
| Time Complexity | O([X]) | §[X] | "[quote]" |
| Latency | [N]ms | §[X] | "[quote]" |
| Throughput | [N]/sec | §[X] | "[quote]" |
| Scalability | [description] | §[X] | "[quote]" |
| Real-time | [type] | §[X] | "[quote]" |
```

---

### Step 2: Check Problem Hardness

**Do:** For complexity claims, verify the underlying problem isn't harder.

**Uses:** domain-knowledge-base.md §1.Optimization

**Hardness Checks:**
```
| Problem Type | Known Hardness | Claim Valid If |
|--------------|----------------|----------------|
| Combinatorial auction | NP-hard | Claims approximation OR special structure |
| General optimization | No free lunch | Specifies problem class |
| Graph problems | Varies | Matches known complexity |
| Sorting | Ω(n log n) comparison | Uses non-comparison method if O(n) claimed |
```

**Red Flags:**
- O(poly) for NP-hard problem without proof of special structure
- "Optimal" without defining optimal
- "Practical O(X)" hiding worst-case

**Output:** Hardness analysis

---

### Step 3: Check Physical Constraints

**Do:** Verify claims don't violate physical limits.

**Uses:** domain-knowledge-base.md §1.Performance Engineering

**Physical Limits:**
```
| Constraint | Limit | Violation Signal |
|------------|-------|------------------|
| Speed of light | ~3.3ms per 1000km | <1ms for distant systems |
| Memory access | ~100ns RAM | <10ns for memory operations |
| Disk I/O | ~1ms SSD, ~10ms HDD | <0.1ms for disk operations |
| Network RTT | ~1ms local, ~100ms+ cross-region | <0.1ms for network calls |
```

**Output:** Physical constraints check

---

### Step 4: Check Scalability Claims

**Do:** Assess scalability claims against known limits.

**Uses:** domain-knowledge-base.md §1.Performance Engineering

**Scalability Checks:**
```
| Claim | Check | Common Issues |
|-------|-------|---------------|
| "Linear scalability" | Amdahl's Law - sequential portion? | Hidden sequential bottleneck |
| "Unlimited scale" | What's the coordination overhead? | Coordination costs grow |
| "Horizontal scaling" | State management? | Shared state limits scaling |
```

**Amdahl's Law Check:**
- If 10% is sequential, max speedup is 10x regardless of cores
- "Linear speedup" requires 0% sequential - verify this

**Output:** Scalability analysis

---

### Step 5: Check Measurement Quality

**Do:** Assess if performance claims are properly substantiated.

**Uses:** domain-knowledge-base.md §5.Proof Requirements

**Measurement Checks:**
```
| Aspect | Good | Bad |
|--------|------|-----|
| Methodology | Described | Absent |
| Environment | Specified | Unspecified |
| Load | Realistic | Unclear |
| Variance | Reported (p50, p99) | Only average |
| Reproducibility | Instructions provided | "Trust us" |
```

**Red Flags:**
- Performance numbers without methodology
- Only best-case reported
- "Up to X" without typical case
- Benchmarks on non-representative data

**Output:** Measurement quality assessment

---

## Finding Templates

### CRITICAL Findings

**NP-Hard with Poly Claim:**
```
Finding: Claims polynomial time for NP-hard problem.
Problem: [problem description]
Known Hardness: NP-hard (no poly solution unless P=NP)
Claim: "[quote]"
Severity: CRITICAL (if stated as guarantee)
Severity: IMPORTANT (if stated as "practical" or heuristic)
Recommendation: Clarify this is heuristic/approximation, not worst-case guarantee.
```

### IMPORTANT Findings

**Amdahl's Law Violation:**
```
Finding: Claims linear scalability without addressing sequential portion.
Claim: "[quote]"
Issue: Amdahl's Law limits speedup based on sequential fraction.
Severity: IMPORTANT
Recommendation: Identify and address sequential bottleneck.
```

**Physical Limit Violation:**
```
Finding: Latency claim appears to violate physical limits.
Claim: "[quote]"
Limit: [relevant physical constraint]
Severity: IMPORTANT
Recommendation: Clarify measurement conditions or revise claim.
```

**Unsubstantiated Benchmark:**
```
Finding: Performance claim lacks measurement methodology.
Claim: "[quote]"
Missing: [methodology/environment/variance]
Severity: IMPORTANT
Recommendation: Provide benchmark methodology and conditions.
```

---

## Process Metrics

| Metric | Target |
|--------|--------|
| Steps | 5 |
| Tokens | 1.5-3K |
| Time | 2-4 min |
| Domain-KB sections used | §1.Optimization, §1.Performance, §5.Proof Requirements |
