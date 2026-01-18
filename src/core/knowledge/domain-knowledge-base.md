# Domain Knowledge Base

> **Purpose:** Reference for methods #153-156 (theory category). Updated by Deep Verify Phase 7.5.
> **Last Updated:** 2026-01-18
> **Update Protocol:** See [Updating This Base](#updating-this-base) at end.

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
| **History-SP Incompatibility** | History-dependent allocation rules break strategyproofness (agents can manipulate history) | Fairness adjustments + strategyproofness claim | `PROPOSED` |
| **Redistribution Gaming** | Redistribution based on participation creates gaming incentive (strategic losing) | Redistribution mechanism + strategyproofness | `PROPOSED` |

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
| **Strategyproof** | Truthful reporting is dominant strategy regardless of others' actions | Mechanism where history affects allocation (creates gaming) | `PROPOSED` |
| **Budget Balanced** | Mechanism neither injects nor extracts money (Σ payments = 0) | VCG mechanism (requires subsidy by construction) |
| **Individually Rational** | Participation yields non-negative utility | Redistribution that can be negative when R < 0 | `PROPOSED` |

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
- [ ] History-dependent rules? Breaks strategyproofness (agents can game history) `PROPOSED`
- [ ] Redistribution mechanism? Check if R can be negative; check if creates gaming `PROPOSED`
- [ ] Multiple mechanisms in one doc? Verify which claims apply to which `PROPOSED`

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
| History-dependent allocation | Strategyproofness | Agents can manipulate history to gain advantage | `PROPOSED` |
| Participation-based redistribution | Strategyproofness | Strategic losing becomes profitable | `PROPOSED` |
| Fairness controller adjustments | Dominant strategy incentive compatibility | Tie-breaker preferences create gaming incentive | `PROPOSED` |

### Document-Level Anti-Patterns `PROPOSED`

| Pattern | Description | Detection Signal |
|---------|-------------|------------------|
| **Mixed Mechanism Conflation** | Design doc uses multiple mechanisms (e.g., VCG + posted-price) but conclusion claims properties for entire system without distinguishing which apply where | Conclusion lists properties; multiple mechanism sections exist |
| **Proof Sketch Overclaim** | "Proof sketch" provided for properties that require formal proof due to known impossibility theorems | "Proof sketch" + claims against M-S/FLP/CAP |
| **By Construction Handwave** | Claims property holds "by construction" without providing the construction | "by construction" + no mathematical proof |

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
| 2026-01-18 | Added: History-SP Incompatibility, Redistribution Gaming theorems (PROPOSED) | v7-0-T19 F4, F6 |
| 2026-01-18 | Added: Mechanism Design Terms section (Strategyproof, Budget Balanced, IR) | v7-0-T19 |
| 2026-01-18 | Added: 3 new contradiction patterns (history-dependent, redistribution, fairness) | v7-0-T19 F4 |
| 2026-01-18 | Added: Document-Level Anti-Patterns section (Mixed Mechanism, Proof Sketch, By Construction) | v7-0-T19 F3, F8 |
| 2026-01-18 | Updated: Mechanism Design Checklist (+3 items) | v7-0-T19 |
