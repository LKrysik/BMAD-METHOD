# Domain Knowledge Base

> **Purpose:** Reference for methods #153-156 (theory category). Updated by Deep Verify Phase 7.5.
> **Last Updated:** 2026-01-18
> **Update Protocol:** See [Updating This Base](#updating-this-base) at end.

---

## 0. Domain Detection → Knowledge Mapping

### How to Use This Section

After Phase 0.2 Domain Detection, use this mapping to identify which sections to consult:

```
Detected Domain (from Phase 0.2)  →  Sections to Use
```

### Mapping Table

| Detected Domain | Primary Sections | Also Check |
|-----------------|------------------|------------|
| **Mechanism Design** | §1.Mechanism Design, §2.Mechanism Terms, §3.Mechanism Checklist, §4.patterns(M-S,VCG) | §1.Optimization (NP-hard), §5.Proof Requirements |
| **Distributed Systems** | §1.Distributed, §2.Distributed Terms, §3.Distributed Checklist, §4.patterns(FLP,CAP) | §1.Computation Theory |
| **Security/Crypto** | §1.Cryptography, §2.Crypto Terms, §3.Crypto Checklist, §4.patterns(PFS,ZK) | - |
| **Formal Methods** | §1.Computation Theory, §2.PL Terms, §3.Formal Checklist | §1.PL Theory |
| **PL Theory** | §1.PL Theory, §2.PL Terms, §3.PL Checklist | §1.Computation Theory |
| **Quantum Computing** | §1.Optimization (quantum), §2.Quantum Terms, §3.Quantum Checklist | - |
| **Optimization/Algorithms** | §1.Optimization, §5.Proof Requirements | §1.Computation Theory |
| **Web/API Development** | §1.Web, §2.Web Terms, §3.Web Checklist | §1.Security (auth) |
| **Database Systems** | §1.Database, §2.Database Terms, §3.Database Checklist | §1.Distributed (CAP) |
| **Machine Learning** | §1.ML, §2.ML Terms, §3.ML Checklist | §1.Optimization |
| **Performance Engineering** | §1.Performance, §3.Performance Checklist | §1.Optimization (complexity) |
| **General Software** | §3.All Checklists (scan), §4.Document Patterns, §5.Proof Requirements | - |

### Cross-Domain Triggers

Always check these regardless of primary domain:

| If artifact contains... | Also check... |
|------------------------|---------------|
| Performance claims (O(n), "fast", "<10ms") | §1.Optimization, §5.Proof Requirements |
| "Proof" or "by construction" | §5.Proof Requirements |
| Multiple mechanisms/approaches | §4.Document Patterns (Mixed Mechanism) |
| Security/auth mentions | §1.Cryptography, §3.Crypto Checklist |
| Distributed/replicated | §1.Distributed, §4.patterns(CAP,FLP) |

---

## 1. Impossibility Theorems

### Distributed Systems

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **FLP** (1985) | Deterministic consensus impossible in async network with 1 crash failure | Claims "liveness" + "async" + "fault tolerant" |
| **CAP** (2000) | Cannot have Consistency + Availability + Partition-tolerance simultaneously | Claims all three without acknowledging trade-off |
| **BFT Bound** | Byzantine tolerance requires f < N/3, not f < N/2 | Uses wrong bound |
| **Msg Complexity** | BFT consensus lower bound is Ω(N²), not O(N) | Claims linear message complexity |

### Computation Theory

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **Halting Problem** | Cannot decide if arbitrary program terminates | Claims "proves termination for all inputs" |
| **Rice's Theorem** | All non-trivial semantic properties undecidable | Claims "verifies semantic property X for all programs" |
| **Gödel Incompleteness** | Sufficiently powerful system cannot prove own consistency | Claims "system verifies itself completely" |

### Mechanism Design

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **Myerson-Satterthwaite** | No mechanism has SP + IR + Efficiency + Budget Balance | Claims all four properties |
| **VCG Subsidy** | VCG requires external subsidy (not budget balanced) | Uses VCG + claims budget balance |
| **Arrow's Theorem** | No voting system satisfies all fairness criteria | Claims "fair" voting without trade-off |
| **Gibbard-Satterthwaite** | Non-dictatorial voting systems are manipulable | Claims strategyproof non-dictatorial voting |
| **History-SP Incompatibility** | History-dependent allocation rules break strategyproofness (agents can manipulate history) | Fairness adjustments + strategyproofness claim |
| **Redistribution Gaming** | Redistribution based on participation creates gaming incentive (strategic losing) | Redistribution mechanism + strategyproofness |

### Cryptography

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **PFS Definition** | Perfect Forward Secrecy = past sessions unreadable if keys compromised | Claims PFS + key recovery for past sessions |
| **RSA Quantum** | RSA broken by Shor's algorithm (not quantum-resistant) | Uses RSA + claims quantum resistance |
| **ZK Information** | Zero-knowledge cannot leak information about witness | Claims ZK + recovery path derivable from proof |

### Programming Language Theory

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **Termination + Recursion** | General recursion + guaranteed termination impossible for TC languages | Claims both without restriction |
| **Type Inference** | Complete inference undecidable for dependent types | Claims full inference for dependent types |
| **Gradual Soundness** | Gradual typing cannot be sound ("well-typed programs can go wrong") | Claims gradual typing + soundness |

### Optimization

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **No Free Lunch** | No optimizer beats random on all problems | Claims "optimal for all cases" |
| **Quantum Speedup** | No proven exponential speedup for optimization (open problem) | Claims "proven quantum advantage" for optimization |
| **NP-Hardness** | NP-hard problems have no known poly-time solution (quantum or classical) | Claims poly-time for NP-hard |
| **Combinatorial Auction** | Winner determination in combinatorial auctions is NP-hard | Claims O(poly) for combinatorial auctions without proof of special structure |
| **Approximation Limits** | Some NP-hard problems have no PTAS unless P=NP | Claims "near-optimal" without approximation ratio proof |

### Web/API Development

| Theorem/Constraint | Statement | Violation Signal |
|---------|-----------|------------------|
| **Stateless + Session** | True statelessness requires no server-side session | Claims "stateless" but stores session on server |
| **CORS Security** | CORS is browser-enforced, not server security | Relies on CORS for API security |
| **JWT Revocation** | Stateless JWTs cannot be revoked before expiry | Claims "instant revocation" with stateless JWT |
| **Rate Limiting** | Distributed rate limiting requires shared state or approximation | Claims exact rate limiting without shared state |

### Database Systems

| Theorem/Constraint | Statement | Violation Signal |
|---------|-----------|------------------|
| **ACID + Scale** | Full ACID at scale requires coordination overhead | Claims "ACID + unlimited scale + low latency" |
| **Index Trade-off** | More indexes = faster reads, slower writes | Claims "fast writes" with many indexes |
| **Normalization Trade-off** | Normalization reduces redundancy but increases joins | Claims "no joins needed" with normalized schema |
| **CAP for Databases** | Distributed DB must sacrifice C, A, or P | Claims all three for distributed database |

### Machine Learning

| Theorem/Constraint | Statement | Violation Signal |
|---------|-----------|------------------|
| **No Free Lunch (ML)** | No algorithm is best for all problems | Claims "best model for any task" |
| **Bias-Variance Trade-off** | Cannot minimize both bias and variance simultaneously | Claims "no overfitting, no underfitting" |
| **Interpretability Trade-off** | Complex models are less interpretable | Claims "high accuracy + fully interpretable" for deep learning |
| **Data Requirements** | Deep learning requires large datasets | Claims "works with small data" for deep learning without transfer/few-shot |

### Performance Engineering

| Theorem/Constraint | Statement | Violation Signal |
|---------|-----------|------------------|
| **Amdahl's Law** | Speedup limited by sequential portion | Claims "linear speedup" without addressing sequential bottleneck |
| **Latency vs Throughput** | Optimizing one often hurts the other | Claims "lowest latency + highest throughput" |
| **Memory-Compute Trade-off** | Caching speeds compute but uses memory | Claims "no memory overhead" for cached system |
| **Network Bound** | Speed of light limits minimum latency | Claims "<1ms" for geographically distant systems |

---

## 2. Technical Terms Correctness

### Cryptography Terms

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| **Homomorphic** | Operations on ciphertexts that produce encrypted result of operation on plaintexts | "Homomorphic key operations" (keys aren't ciphertexts) |
| **Zero-Knowledge** | Proof reveals nothing except statement truth | ZK proof that enables recovery (leaks information) |
| **Post-Quantum** | Secure against quantum attacks (lattice, hash-based, code-based) | RSA/ECC (broken by Shor) |

### Distributed Systems Terms

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| **Byzantine** | Arbitrary malicious behavior | Simple crash failures |
| **Consensus** | Agreement on single value among nodes | Data synchronization (different problem) |
| **Linearizability** | Operations appear atomic and ordered | Eventual consistency (weaker) |

### Quantum Computing Terms

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| **Quantum Advantage** | Proven speedup vs best classical algorithm | "Faster than brute force" (trivial claim) |
| **Quantum Annealing** | Heuristic optimization, no proven speedup | "Polynomial time optimizer" |
| **Qubit** | Quantum bit, ~5000 on current hardware | Claims requiring >10,000 qubits |

### PL Theory Terms

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| **Sound** | Well-typed programs don't go wrong | Gradual typing (has runtime failures) |
| **Complete** | All true statements provable | Undecidable type inference |
| **Terminating** | All executions halt | Turing-complete + termination guarantee |

### Mechanism Design Terms

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| **Strategyproof** | Truthful reporting is dominant strategy regardless of others' actions | Mechanism where history affects allocation (creates gaming) |
| **Budget Balanced** | Mechanism neither injects nor extracts money (Σ payments = 0) | VCG mechanism (requires subsidy by construction) |
| **Individually Rational** | Participation yields non-negative utility | Redistribution that can be negative when R < 0 |

### Web/API Terms

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| **RESTful** | Stateless, resource-based, uniform interface | Any HTTP API (REST has specific constraints) |
| **Idempotent** | Same request = same result (GET, PUT, DELETE) | POST operations (not idempotent by default) |
| **Stateless** | No server-side session state | Session stored on server but called "stateless" |
| **Eventual Consistency** | Data will converge, not immediate | Claims "consistent" for eventually consistent system |

### Database Terms

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| **ACID** | Atomicity, Consistency, Isolation, Durability (all four) | "ACID-like" or partial ACID |
| **Sharding** | Horizontal partitioning across nodes | Vertical partitioning (different concept) |
| **Replication** | Same data on multiple nodes | Sharding (data split, not copied) |
| **Strong Consistency** | All reads see most recent write | Eventual consistency called "strong" |

### ML Terms

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| **Real-time** | Inference in milliseconds for user-facing | Batch processing called "real-time" |
| **Accuracy** | Correct predictions / total predictions | Used for imbalanced classes without context |
| **Overfitting** | Model memorizes training data, fails on new | Any model with high training accuracy |
| **Explainable AI** | Human-understandable reasoning | Post-hoc visualization called "explainable" |

### Performance Terms

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| **O(1)** | Constant time regardless of input size | "Fast" operations that scale with input |
| **Scalable** | Performance grows sub-linearly with load | "Handles more load" without stating limits |
| **Real-time** | Guaranteed response within deadline | "Fast" without latency guarantees |
| **Lock-free** | Progress guaranteed without locks | "No explicit locks" but uses CAS spinning |

---

## 3. Domain Expert Quick Reference

### Crypto Domain Checklist
- [ ] PFS claimed? Check no recovery mechanism
- [ ] Quantum-resistant? Check no RSA/ECC
- [ ] ZK claimed? Check no information leakage
- [ ] Threshold crypto? Verify math (k-of-n bounds)

### Distributed Domain Checklist
- [ ] Async + consensus? Check FLP acknowledged
- [ ] CAP properties? Which one is sacrificed?
- [ ] BFT? Verify f < N/3 bound
- [ ] Message complexity? Ω(N²) lower bound for BFT

### Formal Methods Checklist
- [ ] Termination proof? Check restrictions on recursion
- [ ] Semantic verification? Rice's theorem limits
- [ ] Self-verification? Gödel limits
- [ ] Complexity claim? PSPACE-complete vs polynomial

### Mechanism Design Checklist
- [ ] All of SP+IR+EFF+BB? M-S impossibility
- [ ] VCG used? Requires subsidy
- [ ] Combinatorial auction? NP-hard timing
- [ ] Fairness + efficiency? Usually trade-off
- [ ] History-dependent rules? Breaks strategyproofness (agents can game history)
- [ ] Redistribution mechanism? Check if R can be negative; check if creates gaming
- [ ] Multiple mechanisms in one doc? Verify which claims apply to which

### Quantum Checklist
- [ ] Speedup claimed? Is it proven or conjectured?
- [ ] Error correction? Adds latency overhead
- [ ] Qubit count? Current hardware ~5000
- [ ] Classical fallback? May negate advantage claim

### PL Theory Checklist
- [ ] Dependent types + inference? Inference undecidable
- [ ] Gradual + sound? Cannot have both
- [ ] Recursion + termination? Need structural restrictions
- [ ] Higher-order + decidable? Usually undecidable

### Web/API Checklist
- [ ] "Stateless" claimed? Check no server-side session
- [ ] "RESTful" claimed? Check all REST constraints met
- [ ] JWT for auth? Check revocation strategy
- [ ] Rate limiting? Check if distributed needs shared state
- [ ] CORS relied upon? Not a security boundary
- [ ] "Real-time" claimed? Check WebSocket/SSE or polling trade-offs

### Database Checklist
- [ ] ACID claimed? Check all four properties actually guaranteed
- [ ] Distributed? Which CAP property is sacrificed?
- [ ] "Scalable" claimed? Check sharding/replication strategy
- [ ] Performance claims? Check index trade-offs
- [ ] "No joins" claimed? Check if denormalized and consistency strategy
- [ ] Strong consistency? Check if actually eventual

### ML Checklist
- [ ] "Works with small data"? Check if transfer learning/few-shot used
- [ ] High accuracy claimed? Check if appropriate metric for problem
- [ ] "Real-time inference"? Check actual latency requirements
- [ ] "Explainable"? Check if truly interpretable or just visualized
- [ ] "No bias"? Check fairness metrics used
- [ ] "Production ready"? Check monitoring, drift detection

### Performance Checklist
- [ ] O(n) or better claimed? Check if NP-hard problem
- [ ] "Scalable" claimed? Check Amdahl's Law bottlenecks
- [ ] Latency claims? Check network/physics limits
- [ ] "Real-time" claimed? Check if hard or soft real-time
- [ ] Throughput claims? Check latency trade-off
- [ ] Parallel speedup? Check sequential portion

---

## 4. Contradiction Patterns

### Definitionally Exclusive Pairs

| Claim A | Claim B | Why Impossible |
|---------|---------|----------------|
| Perfect Forward Secrecy | Key Recovery | PFS = past unreadable, Recovery = past readable |
| Async network | Guaranteed liveness | FLP theorem |
| Sound type system | Gradual typing | Gradual allows runtime failures |
| General recursion | Guaranteed termination | Halting problem |
| Full type inference | Dependent types | Undecidable |
| Budget balance | VCG mechanism | VCG needs subsidy |
| O(N) messages | BFT consensus | Lower bound Ω(N²) |
| History-dependent allocation | Strategyproofness | Agents can manipulate history to gain advantage |
| Participation-based redistribution | Strategyproofness | Strategic losing becomes profitable |
| Fairness controller adjustments | Dominant strategy incentive compatibility | Tie-breaker preferences create gaming incentive |

### Document-Level Anti-Patterns

| Pattern | Description | Detection Signal |
|---------|-------------|------------------|
| **Mixed Mechanism Conflation** | Design doc uses multiple mechanisms (e.g., VCG + posted-price) but conclusion claims properties for entire system without distinguishing which apply where | Conclusion lists properties; multiple mechanism sections exist |
| **Proof Sketch Overclaim** | "Proof sketch" provided for properties that require formal proof due to known impossibility theorems | "Proof sketch" + claims against M-S/FLP/CAP |
| **By Construction Handwave** | Claims property holds "by construction" without providing the construction | "by construction" + no mathematical proof |

---

## 5. Proof Requirements

### When to Demand Proof

| Claim Type | Proof Required | What to Demand |
|------------|----------------|----------------|
| **Impossibility theorem territory** | Claims against M-S, FLP, CAP, etc. | Formal proof showing why theorem doesn't apply |
| **"By construction"** | Property claimed to hold automatically | Show the actual construction with proof |
| **Complexity claim** | O(poly) for known NP-hard problem | Proof of special structure OR approximation analysis |
| **Multiple conflicting properties** | Claims A + B where usually trade-off | Construction showing both hold simultaneously |
| **"Ensures" / "Guarantees"** | Strong assertion without proof | Formal verification or proof sketch with all steps |

### Proof Strength Hierarchy

| Level | Name | Acceptable For | Example |
|-------|------|----------------|---------|
| 1 | **Formal Proof** | Impossibility theorem claims | Mathematical proof with lemmas |
| 2 | **Reference to Literature** | Established results | "Per [Smith 2020], this holds when..." |
| 3 | **Constructive Example** | Existence claims | Working implementation + test cases |
| 4 | **Proof Sketch** | Non-critical properties | Outline of argument (not for impossibility territory) |
| 5 | **Empirical Evidence** | Performance claims | Benchmarks, measurements |
| 6 | **Assertion** | NEVER ACCEPTABLE alone | "This is true by design" |

### Red Flags Requiring Proof Demand

| Signal | What to Demand | Finding Severity if Missing |
|--------|---------------|----------------------------|
| "By construction" | Show the construction | IMPORTANT |
| "Ensures" + impossibility territory | Formal proof | CRITICAL |
| "Achieves X + Y + Z" (known trade-off) | Construction showing all three | CRITICAL |
| "O(poly)" for NP-hard | Special structure proof OR approximation | IMPORTANT |
| "Guarantees" without proof | At least proof sketch | IMPORTANT |
| "Optimal" | Proof of optimality OR definition of "optimal" | IMPORTANT |
| Performance number without measurement | Empirical evidence | MINOR |

### Common Unsubstantiated Claims

| Claim Pattern | Why Suspicious | What's Actually Needed |
|---------------|----------------|------------------------|
| "VCG ensures strategyproofness" | TRUE, but VCG has other constraints (subsidy) | Acknowledge VCG trade-offs |
| "Redistribution achieves budget balance" | May break other VCG properties | Prove redistribution doesn't affect SP/IR |
| "Practical O(n²)" for NP-hard | Heuristic, not guarantee | State it's heuristic, not worst-case |
| "Fairness without efficiency loss" | Usually trade-off exists | Define fairness metric precisely |
| "History-based improvements" | May break incentive compatibility | Prove agents can't game history |

---

## Updating This Base

### When to Update

Deep Verify Phase (Learning Extraction) should add entry when:
1. New impossibility theorem encountered
2. New technical term misuse pattern found
3. New definitional contradiction discovered

### Update Format

```markdown
### Addition Request
- **Source:** [verification session ID]
- **Type:** theorem | term | contradiction
- **Domain:** [crypto | distributed | formal | mechanism | quantum | pl-theory]
- **Entry:**
  | [Name] | [Statement/Correct] | [Signal/Incorrect] |
- **Evidence:** [link to finding that motivated this]
- **Verified:** [YES if expert-confirmed, PROPOSED if agent-suggested]
```

### Update Process

1. Agent proposes addition in Phase 7.5
2. Entry marked as `PROPOSED`
3. User reviews and confirms → changes to `VERIFIED`
4. Only `VERIFIED` entries used for CRITICAL findings
5. `PROPOSED` entries used for flagging (not auto-rejection)

---

## Version History

| Date | Change | Source |
|------|--------|--------|
| 2026-01-12 | Initial creation | EXP-2026-01-12-002 analysis |
| 2026-01-18 | Added: History-SP Incompatibility, Redistribution Gaming theorems | v7-0-T19 F4, F6 |
| 2026-01-18 | Added: Mechanism Design Terms section | v7-0-T19 |
| 2026-01-18 | Added: 3 new contradiction patterns | v7-0-T19 F4 |
| 2026-01-18 | Added: Document-Level Anti-Patterns section | v7-0-T19 F3, F8 |
| 2026-01-18 | Updated: Mechanism Design Checklist (+3 items) | v7-0-T19 |
| 2026-01-18 | **MAJOR:** Added §0 Domain Detection → Knowledge Mapping | v7-0-T19 analysis |
| 2026-01-18 | **MAJOR:** Added §5 Proof Requirements (enables F3-type lookup) | v7-0-T19 F3 |
| 2026-01-18 | Added: Web/API domain (§1.Web, §2.Web Terms, §3.Web Checklist) | domain expansion |
| 2026-01-18 | Added: Database domain (§1.Database, §2.Database Terms, §3.Database Checklist) | domain expansion |
| 2026-01-18 | Added: ML domain (§1.ML, §2.ML Terms, §3.ML Checklist) | domain expansion |
| 2026-01-18 | Added: Performance domain (§1.Performance, §2.Performance Terms, §3.Performance Checklist) | domain expansion |
| 2026-01-18 | Added: Combinatorial Auction NP-hardness to §1.Optimization (enables F5-type lookup) | v7-0-T19 F5 |
| 2026-01-18 | Removed PROPOSED tags from verified patterns | cleanup |
