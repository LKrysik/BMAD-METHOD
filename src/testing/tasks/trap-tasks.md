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

# V4 Tasks (Cross-Domain Expert Difficulty)

> These tasks test verification across non-software domains.
> They require domain-specific expertise in medicine, law, finance, ethics, climate science, and social sciences.
> Detection requires understanding of domain-specific impossibilities and tradeoffs.
> Expected detection rate for v8.3: 25-45%

---

## Task 22: Medical Diagnostic Decision Support System

**Artifact File:** `artifact-t22.md`

**Context:** Design an AI-assisted diagnostic system that helps physicians diagnose rare diseases with high accuracy while meeting regulatory requirements.

**Requirements:**
1. Achieve 99.9% sensitivity for life-threatening conditions (no false negatives)
2. Achieve 99.9% specificity to avoid unnecessary treatments (no false positives)
3. Provide deterministic diagnoses (same symptoms = same diagnosis)
4. Learn continuously from new cases to improve accuracy
5. Explain all diagnostic decisions in human-understandable terms
6. Meet FDA Class III medical device requirements (pre-market approval)
7. Comply with HIPAA for all patient data handling
8. Work offline in rural clinics without internet connectivity
9. Integrate with existing EHR systems (HL7 FHIR standard)
10. Support differential diagnosis across 10,000+ conditions
11. Real-time diagnosis (<5 seconds per case)
12. Maintain physician liability protection (decision aid, not replacement)

**Deliverable:** Technical specification with diagnostic algorithm, regulatory strategy, and clinical validation plan.

**Hidden Traps:**
<!--
TRAP-1 (THEORY - BASE RATE): 99.9% sensitivity AND 99.9% specificity is mathematically impossible for rare diseases due to base rate neglect. Even 99.9% specificity yields many false positives when testing for rare conditions.

TRAP-2 (DOMAIN - REGULATORY): FDA Class III requires CLINICAL TRIALS, not just software testing. Approval takes 3-7 years. The artifact cannot specify "meets FDA requirements" without clinical trial design.

TRAP-3 (COMPOSE): "Deterministic" (req 3) + "Continuous learning" (req 4) = contradiction. If model updates, same symptoms yield different diagnoses over time.

TRAP-4 (DOMAIN - MEDICAL): "Explain in human terms" (req 5) + "10,000 conditions" (req 10) + "<5 seconds" (req 11) = impossible. Generating meaningful explanations for rare disease differential diagnosis cannot be instant.

TRAP-5 (LEGAL): "Decision aid" (req 12) + "99.9% accuracy claims" creates liability trap. Marketing high accuracy shifts liability to the system.

TRAP-6 (COMPOSE): "Offline" (req 8) + "Continuous learning" (req 4) = deployment update problem unaddressed.
-->

---

## Task 23: Legal Contract Analysis and Risk Assessment

**Artifact File:** `artifact-t23.md`

**Context:** Design an AI system that analyzes legal contracts, identifies risks, and provides legally sound recommendations across multiple jurisdictions.

**Requirements:**
1. Parse and understand contracts in natural language (English, German, French, Spanish)
2. Identify all material risks with 100% recall
3. Classify risk severity accurately (low/medium/high/critical)
4. Apply jurisdiction-specific legal rules (US, EU, UK, China)
5. Handle temporal legal validity (laws change over time)
6. Identify conflicts between contract clauses and statutory requirements
7. Generate legally defensible risk assessments
8. Provide citation to relevant case law and statutes
9. Update automatically when laws change
10. Maintain privilege protection (work product doctrine)
11. Handle cross-border transaction complexity
12. Support non-standard contract formats (handwritten, scanned, amended)

**Deliverable:** System architecture with NLP pipeline, legal knowledge base, and risk scoring methodology.

**Hidden Traps:**
<!--
TRAP-1 (DOMAIN - LEGAL): "100% recall" (req 2) for legal risks is impossible. Legal risk is inherently uncertain - novel interpretations emerge from litigation. No system can identify risks that haven't been litigated.

TRAP-2 (THEORY - LOGIC): Legal reasoning is NON-MONOTONIC. Adding new facts can invalidate previous conclusions. Standard AI cannot handle this without defeasible logic.

TRAP-3 (DOMAIN - JURISDICTION): "US, EU, UK, China" have fundamentally incompatible legal systems (common law vs civil law vs socialist legal system). Unified risk framework is false equivalence.

TRAP-4 (COMPOSE): "Legally defensible" (req 7) + "AI-generated" = UPL risk. AI providing legal conclusions may constitute unauthorized practice of law.

TRAP-5 (DOMAIN - PRIVILEGE): "Work product doctrine" (req 10) requires attorney involvement. AI-only analysis may not be privileged.

TRAP-6 (TEMPORAL): "Automatic updates when laws change" (req 9) + "citation to case law" (req 8) = retroactive validity problem. Old analyses become incorrect but are still cited.
-->

---

## Task 24: Financial Risk Assessment with Tail Events

**Artifact File:** `artifact-t24.md`

**Context:** Design a risk management system that accurately predicts and hedges against extreme market events ("black swans") while maintaining regulatory compliance.

**Requirements:**
1. Calculate Value-at-Risk (VaR) at 99.9% confidence level
2. Accurately model tail risks (events beyond 3σ)
3. Predict correlation breakdown during market stress
4. Backtest models with 95%+ accuracy on historical crises
5. Meet Basel III/IV regulatory capital requirements
6. Real-time risk calculation (<100ms latency)
7. Handle non-linear derivative exposures
8. Model liquidity risk during market dislocations
9. Integrate with existing trading systems (FIX protocol)
10. Provide interpretable risk explanations for regulators
11. Support stress testing with Monte Carlo simulation (10M scenarios)
12. Guarantee no model risk (model accurately reflects reality)

**Deliverable:** Risk model specification with mathematical foundations, validation methodology, and regulatory mapping.

**Hidden Traps:**
<!--
TRAP-1 (THEORY - STATISTICS): VaR at 99.9% confidence is fundamentally unreliable. You need ~1000 observations to validate a 99.9% quantile. For daily data, that's ~4 years without a single tail event to calibrate against.

TRAP-2 (DOMAIN - FINANCE): "Predict correlation breakdown" (req 3) is impossible. Correlations break down precisely when prediction matters most. This is known as the "correlation breakdown problem" in risk management.

TRAP-3 (THEORY - TALEB): Fat-tailed distributions (Mandelbrot, Taleb) make VaR theoretically unsound. VaR underestimates risk precisely for the events that matter.

TRAP-4 (COMPOSE): "95% backtest accuracy on historical crises" (req 4) is survivorship bias. Models are fit to crises we know about, not future unknown crises.

TRAP-5 (THEORY - LUCAS): "Guarantee no model risk" (req 12) is impossible. Lucas critique: models change behavior when used, invalidating the model.

TRAP-6 (DOMAIN - REGULATORY): "Basel compliance" (req 5) specifically PROHIBITS sole reliance on VaR. Basel requires Expected Shortfall (ES). Requirements internally contradict.
-->

---

## Task 25: Algorithmic Fairness and Bias Mitigation System

**Artifact File:** `artifact-t25.md`

**Context:** Design a fairness layer for ML systems that ensures equitable treatment across protected groups while maintaining predictive performance.

**Requirements:**
1. Achieve demographic parity (equal positive rates across groups)
2. Achieve equalized odds (equal TPR and FPR across groups)
3. Achieve individual fairness (similar people treated similarly)
4. Maintain calibration (predicted probabilities match outcomes)
5. Preserve predictive accuracy (AUC > 0.85)
6. Apply across any ML model (model-agnostic)
7. Handle intersectional groups (combinations of protected attributes)
8. Detect proxy discrimination (correlates of protected attributes)
9. Provide audit trail for regulatory compliance
10. Work without access to protected attributes (fairness through unawareness)
11. Zero false positive disparity for high-stakes decisions
12. Support real-time bias correction (<10ms overhead)

**Deliverable:** Fairness framework with mathematical definitions, mitigation algorithms, and audit methodology.

**Hidden Traps:**
<!--
TRAP-1 (THEORY - KLEINBERG): Demographic parity (req 1), equalized odds (req 2), and calibration (req 4) are MUTUALLY EXCLUSIVE except in trivial cases. Kleinberg et al. (2016) proved this impossibility.

TRAP-2 (THEORY - DWORK): Individual fairness (req 3) + demographic parity (req 1) are incompatible when groups have different base rates.

TRAP-3 (COMPOSE): "Fairness through unawareness" (req 10) + "detect proxy discrimination" (req 8) = contradiction. Cannot detect proxies without knowing protected attributes.

TRAP-4 (DOMAIN - LEGAL): US law uses "disparate impact" (demographic parity) while EU law uses "individual assessment" (individual fairness). Requirements conflict with jurisdiction.

TRAP-5 (THEORY - ACCURACY): Fairness constraints mathematically reduce accuracy. "Maintain AUC > 0.85" (req 5) may be impossible with strong fairness constraints.

TRAP-6 (DOMAIN - INTERSECTIONALITY): "Intersectional groups" (req 7) creates exponential group explosion. With k protected attributes, 2^k groups to balance - statistically infeasible.
-->

---

## Task 26: Climate Model Ensemble Aggregation System

**Artifact File:** `artifact-t26.md`

**Context:** Design a system that aggregates multiple climate models to provide actionable climate projections with quantified uncertainty for policy decisions.

**Requirements:**
1. Aggregate outputs from 30+ CMIP6 climate models
2. Quantify uncertainty with 95% confidence intervals
3. Provide regional downscaling to 10km resolution
4. Project to year 2100 with "high confidence" (IPCC terminology)
5. Handle structural model uncertainty (different physics)
6. Support all RCP/SSP scenarios
7. Detect and correct systematic model biases
8. Provide attribution for observed climate change
9. Update projections as new observations arrive
10. Generate policy-relevant metrics (sea level, temperature, precipitation)
11. Validate against historical observations with <5% error
12. Produce deterministic "best estimate" for planning

**Deliverable:** Aggregation methodology with uncertainty quantification, validation framework, and policy communication strategy.

**Hidden Traps:**
<!--
TRAP-1 (THEORY - CHAOS): Climate is a chaotic system. Projections beyond ~2 weeks are statistical, not deterministic. "High confidence to 2100" (req 4) misrepresents the nature of projections.

TRAP-2 (DOMAIN - CLIMATE): CMIP6 models are NOT independent samples. They share code, assumptions, and calibration data. Treating them as independent underestimates uncertainty.

TRAP-3 (COMPOSE): "95% confidence intervals" (req 2) + "structural uncertainty" (req 5) = Knightian uncertainty. Structural uncertainty cannot be quantified probabilistically.

TRAP-4 (DOMAIN - IPCC): IPCC confidence levels (very likely, likely, etc.) are NOT frequentist probabilities. They're expert judgment. Treating them as confidence intervals is a category error.

TRAP-5 (COMPOSE): "Deterministic best estimate" (req 12) contradicts "quantified uncertainty" (req 2). Providing single numbers for policy masks critical uncertainty.

TRAP-6 (SCALE - DOWNSCALING): 10km downscaling (req 3) from global models (~100km) introduces spurious precision. Downscaling adds uncertainty, doesn't remove it.
-->

---

## Task 27: Human-AI Collaborative Decision Protocol

**Artifact File:** `artifact-t27.md`

**Context:** Design a protocol for human-AI teaming in high-stakes decisions (medical, military, financial) that optimizes joint performance while maintaining human authority.

**Requirements:**
1. Human maintains final decision authority (human-in-the-loop)
2. AI provides recommendations with confidence levels
3. Optimize joint human-AI accuracy above either alone
4. Prevent automation complacency (human over-trusts AI)
5. Prevent automation bias (human ignores AI)
6. Calibrate human trust to AI actual performance
7. Handle AI uncertainty appropriately (don't recommend when uncertain)
8. Support time-critical decisions (<30 second response)
9. Maintain situation awareness for human operator
10. Provide explainable AI recommendations
11. Adapt to individual human decision styles
12. Guarantee human cognitive load stays within capacity

**Deliverable:** Collaboration protocol with interaction patterns, trust calibration mechanism, and cognitive load management.

**Hidden Traps:**
<!--
TRAP-1 (DOMAIN - HUMAN FACTORS): "Human final authority" (req 1) + "prevent automation complacency" (req 4) are in tension. If human can override, they can over-rely. Authority gradient problem.

TRAP-2 (COMPOSE): "Optimize joint accuracy above either alone" (req 3) is NOT guaranteed. Research shows human-AI teams often perform WORSE than AI alone when human overrides correctly.

TRAP-3 (DOMAIN - COGNITIVE): "Cognitive load within capacity" (req 12) is unmeasurable in real-time. Cognitive load varies by individual, fatigue, stress, and task - cannot guarantee.

TRAP-4 (COMPOSE): "Prevent complacency" (req 4) + "prevent bias" (req 5) are competing goals. Interventions for one often worsen the other.

TRAP-5 (DOMAIN - TRUST): "Calibrate trust to performance" (req 6) assumes trust is rational. Human trust is affected by irrelevant factors (AI appearance, voice, etc.) - not calibratable.

TRAP-6 (COMPOSE): "Time-critical" (req 8) + "explainable" (req 10) + "situation awareness" (req 9) compete for limited time and attention.
-->

---

## Task 28: Cross-Cultural Sentiment Analysis System

**Artifact File:** `artifact-t28.md`

**Context:** Design a sentiment analysis system that accurately interprets emotional content across cultures and languages for global brand monitoring.

**Requirements:**
1. Analyze sentiment in 50+ languages
2. Achieve 95% accuracy across all supported languages
3. Detect sarcasm and irony in all cultures
4. Handle code-switching (mixing languages in one text)
5. Normalize sentiment scales across cultures
6. Detect culturally-specific emotional expressions
7. Respect cultural privacy norms (GDPR, etc.)
8. Avoid Western bias in emotion categories
9. Real-time processing (10,000 posts/second)
10. Provide culture-specific context for analysts
11. Handle emoji and visual sentiment consistently
12. Maintain historical comparability (sentiment from 2020 = sentiment from 2025)

**Deliverable:** NLP architecture with cultural adaptation layers, validation methodology, and bias audit framework.

**Hidden Traps:**
<!--
TRAP-1 (DOMAIN - LINGUISTICS): "95% accuracy across all languages" (req 2) is impossible. Low-resource languages (many of the 50+) lack training data. Accuracy varies dramatically by language.

TRAP-2 (THEORY - SAPIR-WHORF): "Normalize sentiment scales across cultures" (req 5) assumes emotional equivalence. Emotion concepts are NOT universal - some languages have emotions without English equivalents (and vice versa).

TRAP-3 (DOMAIN - PRAGMATICS): "Detect sarcasm in all cultures" (req 3) is impossible. Sarcasm expression varies radically. Some cultures rarely use sarcasm. Detection requires cultural context unavailable to NLP.

TRAP-4 (COMPOSE): "Avoid Western bias" (req 8) + training on mostly English/Western data = contradiction. Model architecture itself embeds Western emotional ontology.

TRAP-5 (DOMAIN - PRIVACY): "GDPR compliance" (req 7) restricts processing of "special category data" including inferred emotions. Sentiment analysis may itself violate GDPR Article 9.

TRAP-6 (TEMPORAL): "Historical comparability" (req 12) + language evolution = drift. Words change meaning (e.g., "sick" positive in some contexts). Cannot guarantee comparability.
-->

---

## Task 29: Adaptive Learning Assessment System

**Artifact File:** `artifact-t29.md`

**Context:** Design an educational assessment system that adapts to individual learners, accurately measures competency, and personalizes learning paths.

**Requirements:**
1. Measure mastery of learning objectives with 95% accuracy
2. Adapt difficulty in real-time to student ability
3. Diagnose specific misconceptions (not just wrong/right)
4. Support all Bloom's taxonomy levels (remember through create)
5. Maintain assessment validity across diverse populations
6. Ensure reliability (consistent scores on equivalent tests)
7. Prevent gaming/cheating through adaptive security
8. Personalize learning paths based on cognitive profile
9. Predict course completion with 90% accuracy
10. Comply with FERPA for student data privacy
11. Support students with disabilities (WCAG 2.1 AAA)
12. Eliminate demographic achievement gaps

**Deliverable:** Assessment framework with psychometric model, adaptation algorithm, and equity analysis.

**Hidden Traps:**
<!--
TRAP-1 (THEORY - PSYCHOMETRICS): "95% mastery accuracy" (req 1) + "real-time adaptation" (req 2) = reliability paradox. Adaptive tests have fewer items per construct, reducing reliability.

TRAP-2 (DOMAIN - MEASUREMENT): "Bloom's taxonomy" (req 4) higher levels (analyze, evaluate, create) cannot be validly assessed with automated scoring. Human judgment required.

TRAP-3 (COMPOSE): "Validity across populations" (req 5) + "eliminate achievement gaps" (req 12) may conflict. Some gaps reflect real knowledge differences, not bias.

TRAP-4 (THEORY - DIF): "Eliminate demographic gaps" (req 12) requires distinguishing bias from impact. Differential item functioning analysis cannot fully separate these.

TRAP-5 (DOMAIN - LEARNING): "Cognitive profile" (req 8) assumes learning styles, which have been largely debunked (Pashler et al. 2008). Personalization based on myth.

TRAP-6 (COMPOSE): "Prevent gaming" (req 7) + "adapt to ability" (req 2) = gaming surface. Adaptive algorithms can be exploited by strategic answering patterns.
-->

---

## Task 30: Supply Chain Resilience Optimization System

**Artifact File:** `artifact-t30.md`

**Context:** Design a supply chain optimization system that balances efficiency with resilience against disruptions, while meeting sustainability requirements.

**Requirements:**
1. Minimize total supply chain cost
2. Maximize resilience to disruptions (99.9% continuity)
3. Achieve carbon neutrality across supply chain
4. Optimize inventory levels (just-in-time where possible)
5. Handle multi-tier supplier visibility (tier 1 through tier 5)
6. Predict disruptions 30 days in advance
7. Automatically reroute when disruptions occur
8. Comply with ESG reporting requirements
9. Handle geopolitical risk (sanctions, trade wars)
10. Support 100,000+ SKUs across 50+ countries
11. Real-time optimization (<1 minute response)
12. Guarantee no single point of failure

**Deliverable:** Optimization framework with mathematical model, disruption prediction, and sustainability accounting.

**Hidden Traps:**
<!--
TRAP-1 (COMPOSE): "Minimize cost" (req 1) + "maximize resilience" (req 2) are Pareto-competing objectives. Cannot optimize both - requires tradeoff specification not provided.

TRAP-2 (DOMAIN - OPERATIONS): "Just-in-time" (req 4) + "99.9% continuity" (req 2) directly contradict. JIT minimizes buffer inventory, resilience requires buffers. Toyota paradox.

TRAP-3 (THEORY - BULLWHIP): Tier 5 visibility (req 5) doesn't prevent bullwhip effect. Demand variance amplifies through tiers regardless of visibility.

TRAP-4 (DOMAIN - PREDICTION): "Predict disruptions 30 days in advance" (req 6) for black swan events (pandemics, earthquakes, political upheaval) is impossible. These are by definition unpredictable.

TRAP-5 (COMPOSE): "Carbon neutrality" (req 3) + "minimize cost" (req 1) + "100K SKUs" (req 10) = intractable optimization. Carbon accounting at SKU level has massive uncertainty.

TRAP-6 (THEORY - NP): "No single point of failure" (req 12) + "real-time optimization" (req 11) + "100K SKUs" (req 10) = NP-hard problem. Cannot guarantee optimal solution in real-time.
-->

---

## V4 Ground Truth Reference

**For evaluators only - hidden from test subjects**

| Task | Primary Trap | Domain | Secondary Traps |
|------|-------------|--------|-----------------|
| T22 | Base rate fallacy | Medical/Regulatory | FDA trials, determinism vs learning |
| T23 | Non-monotonic legal reasoning | Legal | UPL, jurisdiction conflicts |
| T24 | VaR unreliability / Taleb | Finance | Correlation breakdown, Lucas critique |
| T25 | Kleinberg impossibility | AI Ethics | Intersectionality explosion |
| T26 | Chaos / Knightian uncertainty | Climate | CMIP6 non-independence |
| T27 | Authority gradient paradox | Human Factors | Trust calibration impossibility |
| T28 | Sapir-Whorf / emotion non-universality | Sociolinguistics | Sarcasm detection cross-cultural |
| T29 | Bloom's taxonomy automation | Education/Psychometrics | Learning styles myth |
| T30 | JIT vs resilience tradeoff | Operations Research | Black swan prediction |

**V4 Error Categories:**
- MEDICAL: Healthcare/regulatory domain knowledge required
- LEGAL: Legal reasoning and jurisdiction expertise required
- FINANCE: Quantitative finance and risk theory required
- ETHICS: AI fairness impossibility theorems required
- CLIMATE: Climate science methodology required
- COGNITION: Human factors and cognitive science required
- LINGUISTICS: Cross-cultural linguistics required
- EDUCATION: Psychometrics and learning science required
- OPERATIONS: Supply chain and operations research required

---
