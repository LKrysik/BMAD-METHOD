# Trap Tasks for Workflow Testing

> **Instructions for Agent:** Complete each task thoroughly. Read all requirements carefully.
> Do NOT access any other files in the testing/ directory.

---

## Artifact Management

**Artifact Location:** `src/testing/results/experiments/artifacts/`

**Framework Logic:**
1. Before generating new artifact, check if `artifact_file` exists
2. If EXISTS → use existing artifact for verification (skip agent generation)
3. If NOT EXISTS → generate artifact via agent, save to `artifact_file`

**Benefits:**
- Artifacts generated once, reused for multiple protocol tests
- Consistent baseline for comparing different protocols
- Reduced token cost and test execution time

---

## Task 1: Configuration Validator Module

**Artifact File:** `artifact-t1.md`

**Context:** The BMAD-METHOD project needs a configuration validator module.

**Requirements:**
1. Create a YAML schema validator that checks agent configuration files
2. Must support nested structures up to 5 levels deep
3. Must validate against existing agent patterns in `src/core/agents/`
4. Error messages should be actionable and specific
5. Must handle circular references gracefully
6. Performance: validate 100 files in under 2 seconds
7. Must work with both `.yaml` and `.yml` extensions
8. Should integrate with existing error handling patterns in the project

**Deliverable:** Design document with architecture, interfaces, and implementation plan.

---

## Task 2: Method Recommendation Engine

**Artifact File:** `artifact-t2.md`

**Context:** Users struggle to select appropriate methods from methods.csv.

**Requirements:**
1. Analyze task description and recommend top 5 methods
2. Consider method category diversity (must include at least 3 categories)
3. Weight methods by: relevance to task, complementarity, coverage
4. Must explain WHY each method was selected
5. Should detect when task is ambiguous and ask clarifying questions
6. Must handle edge case: task that matches NO methods well
7. Recommendations must be reproducible (same input = same output)
8. Must integrate with existing workflow phases

**Deliverable:** Technical specification with algorithm, data structures, and API design.

---

## Task 3: Session Memory Persistence

**Artifact File:** `artifact-t3.md`

**Context:** Agents lose context between sessions, reducing effectiveness.

**Requirements:**
1. Design memory persistence layer for agent sessions
2. Must store: conversation history, decisions made, findings, user preferences
3. Storage format must be human-readable for debugging
4. Must handle concurrent access from multiple agents
5. Memory should be queryable (find past decisions on topic X)
6. Must implement memory decay (older info less prominent)
7. Privacy: user can delete specific memories
8. Must work offline (no external database dependencies)
9. Size limit: 10MB per session maximum

**Deliverable:** Architecture document with storage design, query interface, and lifecycle management.

---

## Task 4: Workflow Orchestrator

**Artifact File:** `artifact-t4.md`

**Context:** Multiple workflows need coordination and sequencing.

**Requirements:**
1. Orchestrate execution of multiple workflows (deep-verify, planning, etc.)
2. Support conditional branching based on workflow results
3. Must handle workflow failures gracefully with retry logic
4. Should support parallel workflow execution where possible
5. Must log all orchestration decisions for audit
6. Must integrate with existing workflow definitions in `src/core/workflows/`
7. Support user intervention points (pause, modify, resume)
8. Must be extensible for future workflow types

**Deliverable:** Design document with state machine, interfaces, and extension points.

---

## Task 5: Multi-Agent Collaboration Protocol

**Artifact File:** `artifact-t5.md`

**Context:** Complex tasks require multiple specialized agents working together.

**Requirements:**
1. Define protocol for agent-to-agent communication
2. Must support: request/response, broadcast, subscription patterns
3. Handle agent unavailability (timeout, failure)
4. Prevent deadlocks in circular dependencies
5. Must maintain conversation coherence across agents
6. Support priority levels for urgent communications
7. Must be observable (monitor all inter-agent traffic)
8. Security: agents can only communicate with authorized peers

**Deliverable:** Protocol specification with message formats, sequencing, and error handling.

---

## Task 6: Verification Report Generator

**Artifact File:** `artifact-t6.md`

**Context:** Deep-verify produces findings but users need formatted reports.

**Requirements:**
1. Transform verification findings into readable reports
2. Support multiple formats: Markdown, HTML, JSON
3. Must include: executive summary, detailed findings, evidence quotes
4. Reports should be diff-friendly (small changes = small diffs)
5. Must handle large verification sessions (100+ findings)
6. Support custom templates for different audiences
7. Must preserve traceability (finding -> report section)
8. Include visualizations where helpful (severity distribution, etc.)

**Deliverable:** Technical design with template system, rendering pipeline, and format handlers.

---

## Task 7: Method Effectiveness Tracker

**Artifact File:** `artifact-t7.md`

**Context:** We need data on which methods actually find problems vs generate noise.

**Requirements:**
1. Track method usage across verification sessions
2. Record: method used, finding generated (if any), finding confirmed/rejected
3. Calculate effectiveness metrics per method
4. Detect methods that consistently generate false positives
5. Must handle statistical significance (don't judge on small samples)
6. Should suggest method combinations that work well together
7. Must preserve user privacy (no PII in tracking data)
8. Data export for external analysis

**Deliverable:** Analytics design with data model, metrics definitions, and reporting interface.

---

## Task 8: Incremental Verification System

**Artifact File:** `artifact-t8.md`

**Context:** Full verification is expensive. Incremental verification for changes only.

**Requirements:**
1. Detect what changed since last verification
2. Determine minimum verification scope for changes
3. Must handle: content changes, structural changes, dependency changes
4. Cache previous verification results intelligently
5. Must detect when full re-verification is necessary
6. Support force-full-verification override
7. Must work with git-based change detection
8. Handle renamed/moved files correctly

**Deliverable:** Design document with change detection, scope calculation, and caching strategy.

---

## Task 9: Agent Self-Improvement Loop

**Artifact File:** `artifact-t9.md`

**Context:** Agents should learn from their mistakes and improve over time.

**Requirements:**
1. Capture agent errors and near-misses
2. Categorize errors by type and root cause
3. Generate improvement suggestions based on error patterns
4. Must distinguish: knowledge gaps, reasoning errors, process failures
5. Implement feedback loop to agent behavior
6. Must be measurable (track improvement over time)
7. Handle edge case: improvement suggestion that makes things worse
8. Must not create infinite loops of self-modification

**Deliverable:** Learning system design with error taxonomy, improvement generation, and safety constraints.

---

## Task 10: Cross-Workflow Consistency Checker

**Artifact File:** `artifact-t10.md`

**Context:** Multiple workflows may produce inconsistent results on same content.

**Requirements:**
1. Run multiple workflows on same content
2. Compare results for consistency
3. Flag contradictions between workflow findings
4. Determine authoritative result when conflicts exist
5. Must handle workflows with different granularity levels
6. Support configurable consistency thresholds
7. Generate consolidated view of all workflow results
8. Must scale to 5+ workflows without exponential complexity

**Deliverable:** Consistency framework design with comparison logic, conflict resolution, and reporting.

---

## Instructions for Test Subject Agent

1. Select ONE task to complete
2. Read ALL requirements carefully
3. Design a complete solution addressing every requirement
4. Document assumptions explicitly
5. Consider edge cases and failure modes
6. Provide implementation guidance

**Time allocation:** Spend appropriate time on each requirement proportionally to its complexity.

---

# V2 Tasks (Advanced Difficulty)

> These tasks are designed to test advanced verification capabilities.
> They contain subtle traps that require deep analysis to detect.

---

## Task 11: Plugin Architecture for Method Extensions

**Artifact File:** `artifact-t11.md`

**Context:** The BMAD-METHOD needs a plugin system allowing users to add custom methods to methods.csv without modifying core files.

**Requirements:**
1. Design plugin discovery mechanism (scan directories for method files)
2. Plugins must integrate with existing method numbering (methods.csv uses 1-150)
3. Support method dependencies (plugin method X requires core method Y)
4. Hot-reload plugins without restarting the system
5. Validate plugin methods against schema before loading
6. Plugin methods must work with existing workflow phases
7. Handle plugin conflicts (two plugins define same method number)
8. Plugins can extend existing methods (add output_pattern variants)
9. Must maintain backwards compatibility with non-plugin usage
10. Plugin errors must not crash core system

**Deliverable:** Architecture document with plugin lifecycle, dependency resolution, and conflict handling.

---

## Task 12: Incremental Method Effectiveness Learning

**Artifact File:** `artifact-t12.md`

**Context:** Track which methods work well together and learn to recommend better combinations over time.

**Requirements:**
1. Record method usage per verification session
2. Track which findings each method produced
3. Correlate method combinations with verification effectiveness
4. Learn weights for method-method synergy scores
5. Recommend method sets based on task characteristics
6. Must reach statistical significance before changing recommendations
7. Handle concept drift (methods that worked before stop working)
8. Privacy: no PII, but track enough to learn
9. Cold start: work reasonably before enough data collected
10. Feedback loop: recommendations influence future data (non-i.i.d.)

**Deliverable:** Learning system design with data model, statistical approach, and recommendation algorithm.

---

## Task 13: Cross-Agent Memory Synchronization

**Artifact File:** `artifact-t13.md`

**Context:** Multiple agents need to share memory state while maintaining consistency and handling conflicts.

**Requirements:**
1. Agents can read each other's memories (decisions, findings)
2. Write conflicts resolved automatically
3. Causal ordering preserved (if A caused B, readers see A before B)
4. Partition tolerance: agents work independently if disconnected
5. Eventual consistency with bounded staleness (max 30 seconds)
6. Memory merging when agents reconnect after partition
7. Conflict resolution for semantic conflicts (contradictory decisions)
8. Audit trail of all synchronization events
9. Must work with existing Agent Memory Persistence (Task 3) design
10. Support 2-10 agents with sub-100ms sync latency

**Deliverable:** Synchronization protocol with consistency model, conflict resolution, and partition handling.

---

## Task 14: Self-Modifying Workflow Engine

**Artifact File:** `artifact-t14.md`

**Context:** Create a workflow engine that can modify its own verification process based on learned patterns.

**Requirements:**
1. Engine observes which workflow phases find issues
2. Dynamically adjusts phase weights and method selection
3. Can add new phases if pattern detected (e.g., always finding X after Y)
4. Can remove phases that consistently find nothing
5. Changes must be reversible (rollback capability)
6. Must prove changes improve effectiveness (A/B testing)
7. Safety constraint: cannot remove Phase 0 (Self-Check)
8. Safety constraint: cannot reduce total method count below 15
9. Human approval required for structural changes (add/remove phase)
10. Self-modification must not create infinite loops

**Deliverable:** Self-modification framework with safety constraints, evaluation metrics, and rollback mechanism.

---

## Task 15: Natural Language to Method Mapping

**Artifact File:** `artifact-t15.md`

**Context:** Users describe their verification needs in natural language; system maps to appropriate methods.

**Requirements:**
1. Parse user intent from free-form text
2. Map intent to one or more methods from methods.csv
3. Handle ambiguous requests (ask clarifying questions)
4. Support negation ("don't use security methods")
5. Learn user preferences over time
6. Explain why methods were selected
7. Handle synonyms (e.g., "check" = "verify" = "validate")
8. Support method composition ("combine first principles with risk analysis")
9. Graceful degradation when no good match exists
10. Multi-language support (at least English + Polish)

**Deliverable:** NLP design with parsing strategy, method matching algorithm, and preference learning.

---

# V3 Tasks (Expert Difficulty)

> These tasks are designed to test expert-level verification capabilities.
> They contain theoretical impossibilities, domain-specific traps, and subtle contradictions.
> Detection requires deep knowledge of CS theory, mathematics, and domain expertise.
> Expected detection rate for v6.4: 30-50%

---

## Task 16: Cryptographic Key Management with Recovery

**Artifact File:** `artifact-t16.md`

**Context:** Design a secure key management system for multi-agent verification workflows that supports both perfect forward secrecy AND key recovery for compliance.

**Requirements:**
1. Generate ephemeral session keys for each verification session
2. Implement perfect forward secrecy (PFS) - compromise of long-term keys doesn't reveal past sessions
3. Support key recovery mechanism for compliance (auditors can decrypt any past session)
4. Use hybrid encryption: RSA-4096 for key exchange, AES-256-GCM for session data
5. Key derivation using HKDF with SHA-256
6. Support key rotation every 24 hours without service interruption
7. Hardware Security Module (HSM) integration for master key storage
8. Split master key using Shamir's Secret Sharing (3-of-5 threshold)
9. Implement homomorphic key operations for secure key aggregation
10. Zero-knowledge proof that key was properly derived (for audit without revealing key)
11. Must be quantum-resistant (post-quantum key encapsulation)
12. Support revocation with immediate effect across all agents

**Deliverable:** Cryptographic architecture with key hierarchy, rotation protocol, and recovery mechanism.

**Hidden Traps:**
<!--
TRAP-1 (THEORETICAL): PFS and key recovery are mutually exclusive by definition. PFS means past sessions cannot be decrypted even with all current keys. Recovery means they CAN be decrypted. This is a fundamental contradiction.

TRAP-2 (DOMAIN): "Homomorphic key operations" is nonsensical. Homomorphic encryption operates on ciphertexts, not keys. You cannot meaningfully aggregate cryptographic keys homomorphically.

TRAP-3 (CRYPTO): RSA-4096 is NOT quantum-resistant. The requirement asks for quantum resistance but specifies RSA, which is broken by Shor's algorithm.

TRAP-4 (SUBTLE): Zero-knowledge proof of proper key derivation while also supporting recovery creates an information leak - if you can prove derivation, you leak information about the derivation path.

TRAP-5 (SCALE): "Immediate effect" revocation across distributed agents is impossible without central coordination, which contradicts the distributed nature.
-->

---

## Task 17: Byzantine-Fault-Tolerant Consensus for Autonomous Agents

**Artifact File:** `artifact-t17.md`

**Context:** Design a consensus protocol for autonomous AI agents that need to agree on verification findings while tolerating malicious/faulty agents.

**Requirements:**
1. Support N agents with up to f Byzantine (malicious) failures where f < N/2
2. Achieve consensus within 3 communication rounds in normal operation
3. Guarantee safety (no two honest agents decide differently) always
4. Guarantee liveness (decision eventually made) when network is synchronous
5. Work in asynchronous network (no timing assumptions)
6. Handle network partitions - agents in minority partition should detect this
7. Implement view change protocol when leader fails
8. Support reconfiguration (add/remove agents) without stopping consensus
9. Consensus values are complex objects (verification findings, not just binary)
10. Implement optimistic fast path (1 round when all agree)
11. Cryptographic signatures for all messages (prevent impersonation)
12. Total message complexity O(N) per consensus instance

**Deliverable:** Consensus protocol specification with message formats, state machine, and correctness proofs.

**Hidden Traps:**
<!--
TRAP-1 (THEORETICAL - FLP): FLP impossibility theorem proves that deterministic consensus is impossible in asynchronous networks with even ONE crash failure. Requirements 4+5 together are impossible.

TRAP-2 (THEORETICAL - PBFT): Byzantine tolerance requires f < N/3, not f < N/2. The requirement claims f < N/2 which violates the fundamental BFT lower bound.

TRAP-3 (COMPLEXITY): O(N) message complexity per instance is impossible for BFT. PBFT is O(N²), and the theoretical lower bound for BFT is Ω(N²) for the common case.

TRAP-4 (PARTITION): "Detect minority partition" requires synchrony assumptions - you cannot distinguish slow network from partition in pure async.

TRAP-5 (COMPOSITION): "Optimistic fast path" (1 round) + Byzantine tolerance is impossible. Fast path works only with crash failures.
-->

---

## Task 18: Formal Verification of Self-Modifying Verification Workflows

**Artifact File:** `artifact-t18.md`

**Context:** Create a formal verification framework that can prove correctness properties of self-modifying verification workflows (like v6.4 with learning).

**Requirements:**
1. Formally specify workflow semantics in temporal logic (LTL)
2. Prove that all workflow executions terminate
3. Prove that self-modification preserves safety invariants
4. Verify that learning updates converge to optimal method selection
5. Use symbolic model checking for exhaustive state space exploration
6. Support infinite state spaces (method scores are real numbers)
7. Verify absence of race conditions in concurrent method execution
8. Prove that all reachable states satisfy the specification
9. Generate counterexamples when properties violated
10. Incremental verification (re-verify only modified parts)
11. Verify properties of the verification process itself (meta-verification)
12. Complete verification in polynomial time relative to workflow size

**Deliverable:** Formal verification framework with specification language, proof engine, and soundness guarantees.

**Hidden Traps:**
<!--
TRAP-1 (THEORETICAL - HALTING): Requirement 2 asks to prove termination for ALL executions of self-modifying code. This is undecidable (halting problem).

TRAP-2 (THEORETICAL - RICE): Requirement 3 (preserving safety invariants) asks to verify non-trivial semantic properties. Rice's theorem: all non-trivial semantic properties are undecidable.

TRAP-3 (THEORETICAL - GÖDEL): Requirement 11 (meta-verification) leads to incompleteness. A system cannot fully verify itself (Gödel's incompleteness).

TRAP-4 (COMPLEXITY): Requirement 12 asks for polynomial time, but model checking is PSPACE-complete for LTL. Symbolic model checking doesn't change this fundamental complexity.

TRAP-5 (INFINITE): Requirement 6 (infinite state spaces) is incompatible with exhaustive exploration (requirement 5). Symbolic methods can handle infinite spaces but not exhaustively.

TRAP-6 (CONVERGENCE): Requirement 4 asks to prove learning converges to "optimal" - but optimality is undefined and convergence depends on non-verifiable assumptions about the data distribution.
-->

---

## Task 19: Real-Time Multi-Agent Verification Auction

**Artifact File:** `artifact-t19.md`

**Context:** Design an auction mechanism where agents bid for verification tasks, optimizing for efficiency, fairness, and truthfulness.

**Requirements:**
1. Agents submit bids (price, time estimate) for verification tasks
2. Mechanism selects winner(s) and determines payment
3. Strategyproof (truthful bidding is dominant strategy)
4. Individually rational (agents never lose money by participating)
5. Efficient (maximizes total value - quality minus cost)
6. Fair (no agent consistently wins/loses unfairly)
7. Budget-balanced (total payments equal total receipts)
8. Real-time guarantee: allocation decision in <10ms
9. Handle combinatorial bids (agent bids on task bundles)
10. Support dynamic task arrival (online mechanism)
11. No collusion vulnerability (groups cannot game the system)
12. Sybil-resistant (creating fake agents doesn't help)

**Deliverable:** Auction mechanism design with allocation rule, payment rule, and game-theoretic analysis.

**Hidden Traps:**
<!--
TRAP-1 (THEORETICAL - MYERSON-SATTERTHWAITE): Requirements 3+4+5+7 together are impossible. Myerson-Satterthwaite theorem: no mechanism is simultaneously strategyproof, individually rational, efficient, and budget-balanced.

TRAP-2 (THEORETICAL - VCG): VCG mechanism achieves 3+4+5 but violates 7 (needs external subsidy). The requirements assume all four are achievable.

TRAP-3 (COMPLEXITY): Requirement 9 (combinatorial bids) + requirement 8 (<10ms) is computationally impossible. Combinatorial auction winner determination is NP-hard.

TRAP-4 (FAIRNESS): "Fairness" (req 6) is undefined and often contradicts efficiency (req 5). Fair≠Efficient in mechanism design.

TRAP-5 (ONLINE): Online mechanism design (req 10) cannot achieve the same guarantees as offline. Competitive ratio losses are unavoidable.

TRAP-6 (COLLUSION): Perfect collusion resistance (req 11) is impossible in repeated games - agents can develop implicit coordination.
-->

---

## Task 20: Quantum-Inspired Method Selection Optimizer

**Artifact File:** `artifact-t20.md`

**Context:** Apply quantum computing principles to optimize method selection, achieving exponential speedup over classical approaches.

**Requirements:**
1. Encode method selection as quantum optimization problem (QUBO)
2. Use quantum annealing simulation for combinatorial optimization
3. Achieve exponential speedup over brute-force classical search
4. Support 150+ methods with pairwise interaction terms
5. Find global optimum (not just local) with high probability (>99%)
6. Handle constraints (method budget, category diversity) natively
7. Implement quantum-inspired sampling for uncertainty quantification
8. Parallelize across quantum processing units (QPUs)
9. Graceful degradation on classical hardware (quantum simulation)
10. Quantum error correction for noise tolerance
11. Real-time optimization (<100ms for method selection)
12. Provable quantum advantage over all classical algorithms

**Deliverable:** Quantum optimization framework with encoding scheme, solver, and performance analysis.

**Hidden Traps:**
<!--
TRAP-1 (THEORETICAL - SPEEDUP): "Exponential speedup over brute-force" is misleading. Quantum annealing (and QAOA) have NO proven exponential speedup for combinatorial optimization. Classical algorithms like simulated annealing often match or beat them.

TRAP-2 (QUANTUM ADVANTAGE): Requirement 12 asks for "provable quantum advantage over ALL classical algorithms" - this is an open research question with no known solution for optimization problems.

TRAP-3 (SIMULATION): Requirement 9 (quantum simulation on classical hardware) negates any quantum advantage. If you can simulate efficiently classically, there's no quantum benefit.

TRAP-4 (GLOBAL OPTIMUM): Requirement 5 (global optimum >99%) is impossible for NP-hard problems - both quantum and classical. Quantum doesn't change NP-hardness.

TRAP-5 (ERROR CORRECTION): Requirement 10 (quantum error correction) is incompatible with requirement 11 (<100ms). QEC overhead is massive and current implementations are far too slow.

TRAP-6 (QUBITS): 150 methods with pairwise interactions requires ~150² = 22,500 interaction terms. Current quantum annealers (D-Wave) have ~5000 qubits with limited connectivity - can't embed this problem.
-->

---

## Task 21: Domain-Specific Language Compiler for Verification Rules

**Artifact File:** `artifact-t21.md`

**Context:** Design a domain-specific language (DSL) and compiler for expressing verification rules that compile to executable checkers.

**Requirements:**
1. Declarative syntax for expressing verification rules
2. Type system with dependent types for precise specifications
3. Gradual typing (allow mixing typed and untyped code)
4. Pattern matching on AST structures (for code verification)
5. Higher-order functions (rules can take rules as parameters)
6. Compile rules to efficient native code (LLVM backend)
7. Guarantee rule termination through type system
8. Support recursion for tree-structured artifacts
9. Incremental compilation (recompile only changed rules)
10. Rule composition: combine simple rules into complex ones
11. Sound type system (well-typed rules don't crash)
12. Complete type inference (no annotations required)

**Deliverable:** DSL specification with grammar, type system, and compilation strategy.

**Hidden Traps:**
<!--
TRAP-1 (THEORETICAL - TERMINATION): Requirement 7 (guarantee termination through types) + Requirement 8 (support recursion) is impossible for Turing-complete languages. You cannot have both general recursion and guaranteed termination.

TRAP-2 (TYPE THEORY): Requirement 11 (sound) + Requirement 12 (complete inference) + Requirement 2 (dependent types) is impossible. Complete type inference is undecidable for dependent types.

TRAP-3 (GRADUAL TYPING): Requirement 3 (gradual typing) + Requirement 11 (soundness) is problematic. Gradual typing introduces runtime type errors by design - "well-typed programs can go wrong."

TRAP-4 (HIGHER-ORDER): Requirement 5 (higher-order) + Requirement 7 (termination) requires a sophisticated termination checker (like Agda's). This contradicts "no annotations required" (req 12).

TRAP-5 (LLVM): Requirement 6 (native code via LLVM) + Requirement 2 (dependent types) is unusual and complex. Dependent types typically need runtime type representations that LLVM doesn't natively support.

TRAP-6 (COMPOSITION): Requirement 10 (rule composition) + Requirement 7 (termination) - composition of terminating functions is terminating, BUT detecting this requires solving the halting problem in general.
-->

---

## V3 Ground Truth Reference

**For evaluators only - hidden from test subjects**

| Task | Primary Theoretical Trap | Domain Trap | Composition Trap |
|------|--------------------------|-------------|------------------|
| T16 | PFS ⊕ Recovery impossible | Homomorphic keys nonsense | RSA + quantum-resistant |
| T17 | FLP impossibility | f < N/2 wrong (need N/3) | Async + liveness |
| T18 | Halting problem | Rice's theorem | Polynomial + model checking |
| T19 | Myerson-Satterthwaite | VCG budget imbalance | Combinatorial + real-time |
| T20 | No proven quantum speedup | QEC latency | Simulation negates advantage |
| T21 | Recursion + termination | Dependent + complete inference | Gradual + soundness |

**Expected Error Categories:**
- THEORY: Violation of fundamental CS/math theorems
- DOMAIN: Requires deep domain expertise to catch
- COMPOSE: Components work alone, fail together
- SCALE: Works in theory, fails in practice
- METRIC: Optimizes wrong thing

---
