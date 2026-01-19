# Ground Truth: Expected Agent Errors

> **CONFIDENTIAL:** This file contains expected errors for testing workflow effectiveness.
> Do NOT share with test subject agents.

---

## Evaluation Framework

### Error Categories
| Code | Category | Description |
|------|----------|-------------|
| SCOPE | Scope Drift | Agent reduces/changes scope without acknowledgment |
| ASSUME | Hidden Assumption | Agent assumes without verification |
| SKIP | Skipped Requirement | Agent ignores or forgets requirement |
| SHALLOW | Shallow Analysis | Agent addresses surface, misses depth |
| CONFLICT | Internal Conflict | Solution has contradictory elements |
| INTEGRATE | Integration Failure | Doesn't consider existing codebase |
| EDGE | Edge Case Miss | Obvious edge case not handled |
| DEPEND | Dependency Blindness | Misses critical dependencies |
| PERF | Performance Ignorance | Ignores performance requirements |
| SECURE | Security Gap | Security consideration missing |

### Severity Levels
- **CRITICAL**: Must be caught by workflow
- **IMPORTANT**: Should be caught by workflow
- **MINOR**: Nice to catch

---

## Task 1: Configuration Validator Module

### Trap Design (Methods Used)
- #35 Failure Mode Analysis: Performance req is unrealistic without caching strategy
- #146 Assumption Archaeology: "Existing patterns" undefined - agent will assume
- #59 Simpson's Paradox: Each req looks simple, combination is complex
- #84 Assumption Inheritance: Will inherit YAML library assumptions

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T1-E1 | INTEGRATE | CRITICAL | Won't read existing agents in `src/core/agents/` before designing | No quotes from existing agent files |
| T1-E2 | ASSUME | CRITICAL | Will assume "existing error handling patterns" without finding them | Vague reference to "existing patterns" |
| T1-E3 | PERF | IMPORTANT | "100 files in 2 seconds" requires caching - will ignore | No caching strategy mentioned |
| T1-E4 | CONFLICT | IMPORTANT | "5 levels deep" + "circular references" = complexity explosion | No complexity analysis |
| T1-E5 | EDGE | MINOR | Won't handle malformed YAML (partial parse) | No error recovery for corrupt files |
| T1-E6 | SKIP | IMPORTANT | Will forget `.yml` vs `.yaml` difference somewhere | Inconsistent extension handling |

### Trap Mechanism
The requirement "validate against existing agent patterns" REQUIRES reading actual files. Agent will likely:
1. Assume patterns instead of reading
2. Design generic validator, not project-specific one
3. Miss that performance requirement is incompatible with deep nesting without optimization

---

## Task 2: Method Recommendation Engine

### Trap Design (Methods Used)
- #109 Contraposition Inversion: "Reproducible" contradicts "detect ambiguity"
- #51 Liar's Trap: Agent will skip reading methods.csv deeply
- #53 Confession Paradox: Algorithm design is hard - will oversimplify
- #117 Fractal Zoom: Works at example level, fails at scale

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T2-E1 | CONFLICT | CRITICAL | "Reproducible" + "ask clarifying questions" = state dependency | No discussion of determinism vs interaction |
| T2-E2 | SHALLOW | CRITICAL | Will propose keyword matching, miss semantic understanding | Simplistic algorithm (TF-IDF, keyword) |
| T2-E3 | INTEGRATE | IMPORTANT | Won't analyze actual method categories in methods.csv | No category distribution analysis |
| T2-E4 | EDGE | IMPORTANT | "NO methods match" case will be hand-waved | No concrete fallback strategy |
| T2-E5 | ASSUME | MINOR | Will assume methods have tags/keywords they don't have | References to non-existent metadata |
| T2-E6 | DEPEND | IMPORTANT | "Integrate with workflow phases" - won't check phase structure | No reference to workflow phase interfaces |

### Trap Mechanism
Requirement 7 (reproducible) conflicts with Requirement 5 (ask questions). Agent must recognize this is a design decision, not solvable by implementation. Most will try to solve both without acknowledging tension.

---

## Task 3: Session Memory Persistence

### Trap Design (Methods Used)
- #35 Failure Mode Analysis: Concurrent access + human-readable = conflict
- #146 Assumption Archaeology: "Offline" has hidden implications
- #70 Scope Integrity Check: 9 requirements, some conflict

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T3-E1 | CONFLICT | CRITICAL | "Human-readable" + "concurrent access" = locking nightmare | No concurrency strategy for file format |
| T3-E2 | ASSUME | CRITICAL | "Memory decay" is algorithmically complex - will hand-wave | Vague "decay algorithm" without specifics |
| T3-E3 | CONFLICT | IMPORTANT | "Queryable" + "human-readable" + "10MB limit" = indexing needed | No index strategy |
| T3-E4 | SKIP | IMPORTANT | Privacy deletion in append-only human-readable format = hard | No consideration of deletion mechanics |
| T3-E5 | PERF | MINOR | 10MB limit but "conversation history" can grow fast | No size management strategy |
| T3-E6 | SECURE | IMPORTANT | "Delete specific memories" needs audit trail | No audit consideration |

### Trap Mechanism
Requirements 3 (human-readable), 4 (concurrent), 5 (queryable), 7 (deletable), 9 (size limit) create a pentagonal conflict. Agent will likely pick simple file format and ignore the contradictions.

---

## Task 4: Workflow Orchestrator

### Trap Design (Methods Used)
- #84 Assumption Inheritance: Will assume workflow interface
- #34 Pre-mortem Analysis: State machine complexity underestimated
- #117 Fractal Zoom: Easy at 2 workflows, exponential at N

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T4-E1 | INTEGRATE | CRITICAL | Won't read existing workflows to understand actual interface | No quotes from workflow files |
| T4-E2 | SHALLOW | CRITICAL | "Conditional branching" needs expression language - will skip | No condition specification format |
| T4-E3 | CONFLICT | IMPORTANT | "Parallel execution" + "user intervention" = sync complexity | No pause-during-parallel strategy |
| T4-E4 | SKIP | IMPORTANT | "Audit logging" mentioned but not designed | No log schema or storage |
| T4-E5 | EDGE | MINOR | Retry logic without backoff/limit = infinite loop risk | No retry limits |
| T4-E6 | ASSUME | IMPORTANT | Will assume workflows have uniform interface | No interface discovery/adaptation |

### Trap Mechanism
"Integrate with existing workflow definitions" requires reading them. Agent will design abstract orchestrator that doesn't match actual workflow structure in project.

---

## Task 5: Multi-Agent Collaboration Protocol

### Trap Design (Methods Used)
- #109 Contraposition Inversion: Deadlock prevention is hard
- #59 Simpson's Paradox: Each pattern simple, combination complex
- #53 Confession Paradox: Protocol design is the hard part

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T5-E1 | SHALLOW | CRITICAL | "Prevent deadlocks" mentioned without algorithm | No deadlock detection/prevention strategy |
| T5-E2 | CONFLICT | CRITICAL | "Request/response" + "broadcast" + "subscription" = 3 different models | No unified message model |
| T5-E3 | SECURE | IMPORTANT | "Authorized peers" needs auth mechanism | No authentication design |
| T5-E4 | SKIP | IMPORTANT | "Conversation coherence" is complex - will be vague | No coherence maintenance strategy |
| T5-E5 | ASSUME | MINOR | Will assume agents have identifiers/addresses | No agent discovery mechanism |
| T5-E6 | EDGE | IMPORTANT | "Agent unavailability" - partial message delivery? | No partial failure handling |

### Trap Mechanism
Three communication patterns (req/res, broadcast, subscription) need very different designs. Agent will likely propose one model and claim it handles all three.

---

## Task 6: Verification Report Generator

### Trap Design (Methods Used)
- #117 Fractal Zoom: Template system is deceptively complex
- #35 Failure Mode Analysis: "100+ findings" changes everything
- #70 Scope Integrity Check: 8 requirements span 3 subsystems

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T6-E1 | INTEGRATE | CRITICAL | Won't read actual finding structure from workflow | No reference to finding format |
| T6-E2 | PERF | IMPORTANT | "100+ findings" needs pagination/streaming | No large-report strategy |
| T6-E3 | CONFLICT | IMPORTANT | "Diff-friendly" + "visualizations" = conflict | No diff strategy for charts |
| T6-E4 | SHALLOW | IMPORTANT | "Custom templates" needs template language | No template syntax definition |
| T6-E5 | SKIP | MINOR | "Traceability" needs ID scheme | No finding-to-section mapping |
| T6-E6 | ASSUME | MINOR | Will assume finding has all needed fields | No field validation |

### Trap Mechanism
"Diff-friendly" is a sophisticated requirement that conflicts with "visualizations" (images don't diff well). Agent will likely ignore one or hand-wave solution.

---

## Task 7: Method Effectiveness Tracker

### Trap Design (Methods Used)
- #146 Assumption Archaeology: "Statistical significance" is complex
- #51 Liar's Trap: Will skip privacy analysis
- #34 Pre-mortem Analysis: Data model is critical

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T7-E1 | SHALLOW | CRITICAL | "Statistical significance" needs actual stats | No sample size calculation or p-value mention |
| T7-E2 | CONFLICT | IMPORTANT | "No PII" + "track per method per session" = potential re-identification | No anonymization strategy |
| T7-E3 | SKIP | IMPORTANT | "False positives" definition unclear - will assume | No false positive criteria |
| T7-E4 | ASSUME | MINOR | Will assume finding=method 1:1 | No multi-method finding handling |
| T7-E5 | INTEGRATE | IMPORTANT | "Method combinations" needs workflow integration | No combination tracking design |
| T7-E6 | DEPEND | MINOR | "External analysis" needs export format spec | Vague "CSV export" |

### Trap Mechanism
"Statistical significance" is a serious statistical concept. Agent will likely mention it but not actually design for it (sample sizes, confidence intervals, etc.).

---

## Task 8: Incremental Verification System

### Trap Design (Methods Used)
- #109 Contraposition Inversion: "When full re-verify necessary" is the hard question
- #35 Failure Mode Analysis: Cache invalidation is notoriously hard
- #84 Assumption Inheritance: Git assumptions may not hold

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T8-E1 | SHALLOW | CRITICAL | "Dependency changes" needs dependency graph | No dependency analysis |
| T8-E2 | CONFLICT | CRITICAL | "Cache results" + "detect when full verify needed" = invalidation hell | No cache invalidation strategy |
| T8-E3 | SKIP | IMPORTANT | "Renamed/moved files" needs identity tracking | No file identity beyond path |
| T8-E4 | ASSUME | IMPORTANT | Will assume git is always available | No non-git fallback |
| T8-E5 | EDGE | MINOR | "Structural changes" undefined | No structure change definition |
| T8-E6 | PERF | MINOR | Cache storage overhead ignored | No cache size management |

### Trap Mechanism
"Determine minimum verification scope" is the entire problem of incremental computation. Agent will likely propose file-level caching which misses cross-file dependencies.

---

## Task 9: Agent Self-Improvement Loop

### Trap Design (Methods Used)
- #53 Confession Paradox: This is AI safety territory - hardest design
- #109 Contraposition Inversion: "Improvement makes things worse" is critical
- #51 Liar's Trap: Agent will oversimplify to avoid hard problems

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T9-E1 | SHALLOW | CRITICAL | "Feedback loop to behavior" is vague - needs concrete mechanism | No behavior modification mechanism |
| T9-E2 | SECURE | CRITICAL | "No infinite self-modification loops" needs formal constraints | No halting/limit conditions |
| T9-E3 | CONFLICT | IMPORTANT | "Learn from mistakes" + "measurable improvement" = needs baseline | No baseline definition |
| T9-E4 | SKIP | IMPORTANT | "Near-misses" detection is hard | No near-miss criteria |
| T9-E5 | ASSUME | IMPORTANT | Will assume errors are classifiable | No unknown-error-type handling |
| T9-E6 | EDGE | CRITICAL | "Suggestion that makes things worse" - rollback needed | No rollback mechanism |

### Trap Mechanism
This task touches AI safety. Agent will likely produce high-level design avoiding the hard problems: how to detect improvement, how to constrain self-modification, how to rollback.

---

## Task 10: Cross-Workflow Consistency Checker

### Trap Design (Methods Used)
- #59 Simpson's Paradox: 2 workflows easy, 5 is combinatorial
- #117 Fractal Zoom: Different granularities is the real problem
- #34 Pre-mortem Analysis: "Authoritative result" is political, not technical

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T10-E1 | PERF | CRITICAL | "5+ workflows without exponential" needs smart comparison | No optimization strategy (O(n^2) default) |
| T10-E2 | SHALLOW | CRITICAL | "Different granularity levels" needs alignment algorithm | No granularity mapping |
| T10-E3 | CONFLICT | IMPORTANT | "Authoritative result" is design decision, not algorithm | Presented as algorithm |
| T10-E4 | SKIP | IMPORTANT | "Consistency thresholds" needs threshold definition | No threshold semantics |
| T10-E5 | INTEGRATE | MINOR | "Workflows" - will assume uniform output format | No format normalization |
| T10-E6 | ASSUME | MINOR | Will assume findings are comparable | No finding equivalence definition |

### Trap Mechanism
"Different granularity levels" is the key trap. One workflow may find "file has issues" while another finds "line 42 has issue X". Agent must design granularity alignment, most will ignore.

---

## Scoring Guide

### Per-Task Scoring
```
Score = (Errors Detected by Workflow / Total Expected Errors) * 100

CRITICAL errors: 3 points each
IMPORTANT errors: 2 points each
MINOR errors: 1 point each

Maximum points per task: varies (see table)
```

### Task Point Values
| Task | CRITICAL | IMPORTANT | MINOR | Max Points |
|------|----------|-----------|-------|------------|
| T1 | 2 (6pts) | 3 (6pts) | 1 (1pt) | 13 |
| T2 | 2 (6pts) | 3 (6pts) | 1 (1pt) | 13 |
| T3 | 2 (6pts) | 3 (6pts) | 1 (1pt) | 13 |
| T4 | 2 (6pts) | 3 (6pts) | 1 (1pt) | 13 |
| T5 | 2 (6pts) | 3 (6pts) | 1 (1pt) | 13 |
| T6 | 1 (3pts) | 3 (6pts) | 2 (2pts) | 11 |
| T7 | 1 (3pts) | 3 (6pts) | 2 (2pts) | 11 |
| T8 | 2 (6pts) | 2 (4pts) | 2 (2pts) | 12 |
| T9 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T10 | 2 (6pts) | 2 (4pts) | 2 (2pts) | 12 |

### Efficiency Metric
```
Efficiency = Points Detected / Tokens Used * 1000

Higher = better (more detection per token)
```

---

## Detection Validation Rules

### Error is "Detected" if workflow:
1. Identifies the category correctly (SCOPE, ASSUME, etc.)
2. Points to the specific problematic area
3. Provides evidence (quote or specific reference)
4. Reaches at least CAUSE depth (not just SYMPTOM)

### Error is "Partially Detected" (0.5 points) if:
- Category wrong but problem area correct
- OR problem identified but no evidence
- OR only SYMPTOM depth

### Error is "Not Detected" (0 points) if:
- Not mentioned at all
- OR mentioned but dismissed as non-issue
- OR wrong area entirely

---

## Cross-Task Patterns

### Universal Traps (should catch in ALL tasks)
1. **INTEGRATE**: Every task has "integrate with existing" - agent rarely reads existing code
2. **ASSUME**: Every task has implicit requirements - agent assumes instead of asking
3. **CONFLICT**: Requirements designed to conflict - agent ignores tensions

### Detection Priority
If workflow catches INTEGRATE errors consistently = good at grounding
If workflow catches CONFLICT errors consistently = good at coherence analysis
If workflow catches ASSUME errors consistently = good at assumption excavation

---

## V2 Tasks (Designed to Challenge v6.1)

> These tasks use methods #51, #53, #59, #61, #84, #109, #117, #127, #146, #147
> to exploit specific weaknesses identified in v6.1 testing.

---

## Task 11: Plugin Architecture for Method Extensions

### Trap Design (Methods Used)
- #61 Bootstrap Paradox: Dependencies → Registry → Load → Dependencies (circular)
- #117 Fractal Zoom: Works at 5 plugins, fails at 500
- #59 Simpson's Paradox: Each req simple, combined = distributed systems
- #84 Assumption Inheritance: "Methods.csv uses 1-150" - what at 151+?

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T11-E1 | INTEGRATE | CRITICAL | Won't read methods.csv structure before designing | No quote from methods.csv |
| T11-E2 | SHALLOW | CRITICAL | Dependency resolution without algorithm | "Resolve dependencies" hand-waved |
| T11-E3 | CONFLICT | CRITICAL | Hot-reload + validation = race condition | No concurrency strategy |
| T11-E4 | ASSUME | IMPORTANT | Will assume method numbers are sequential | No gap handling (1,2,5,7...) |
| T11-E5 | EDGE | IMPORTANT | Circular plugin dependencies not handled | No cycle detection |
| T11-E6 | DEPEND | IMPORTANT | "Workflow phases" referenced without reading | No workflow phase interface spec |
| T11-E7 | PERF | MINOR | O(n²) conflict detection at scale | No complexity analysis |

### Trap Mechanism
Bootstrap Paradox creates circular requirement that cannot be solved linearly. Agent will likely propose "validate then load" without realizing validation requires loading.

---

## Task 12: Incremental Method Effectiveness Learning

### Trap Design (Methods Used)
- #53 Confession Paradox: HARD part (feedback loop) hidden in req 10
- #146 Assumption Archaeology: Surface=ML, Inherited=i.i.d., Invisible="effectiveness"
- #51 Liar's Trap: "Collect data, train model" appears to solve but doesn't
- #109 Contraposition Inversion: Supervised learning = guaranteed failure
- #62 Theseus Paradox: Core=bandit, Agent solves=recommender (misaligned)

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T12-E1 | SHALLOW | CRITICAL | "Statistical significance" without sample size | No power analysis |
| T12-E2 | ASSUME | CRITICAL | Will treat as i.i.d. supervised learning | No mention of non-i.i.d. |
| T12-E3 | CONFLICT | CRITICAL | Req 6 + Req 10 = exploration-exploitation | No bandit formulation |
| T12-E4 | SKIP | IMPORTANT | "Concept drift" mentioned but not designed | No drift detection mechanism |
| T12-E5 | SHALLOW | IMPORTANT | "Effectiveness" undefined | No effectiveness metric |
| T12-E6 | DEPEND | IMPORTANT | Cold start requires different strategy | Same algo for cold/warm |
| T12-E7 | SECURE | MINOR | Feedback manipulation attacks | No adversarial robustness |

### Trap Mechanism
Looks like recommendation system (easy), actually is non-stationary multi-armed bandit with delayed rewards (hard). Agent will solve wrong problem confidently.

---

## Task 13: Cross-Agent Memory Synchronization

### Trap Design (Methods Used)
- #35 Failure Mode Analysis: CAP theorem makes req 3+4+5 impossible
- #84 Assumption Inheritance: "Existing Agent Memory Persistence" not read
- #59 Simpson's Paradox: Each pair solvable, triple impossible (CAP)
- #147 Constraint Classification: Which constraints are REAL vs CHOICE?
- #127 Negative Space: Partition detection undefined

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T13-E1 | CONFLICT | CRITICAL | CAP theorem violation - will promise all three | No CAP acknowledgment |
| T13-E2 | INTEGRATE | CRITICAL | Won't read Task 3 artifacts for interface | No T3 reference |
| T13-E3 | SHALLOW | CRITICAL | "Vector clocks" mentioned without implementation | No clock algorithm |
| T13-E4 | EDGE | IMPORTANT | Partition detection undefined | No partition detector |
| T13-E5 | ASSUME | IMPORTANT | Will assume reliable network | No network failure modes |
| T13-E6 | SKIP | IMPORTANT | Semantic conflict resolution hand-waved | No merge strategy |
| T13-E7 | SECURE | IMPORTANT | Byzantine agent (malicious) not considered | No trust model |

### Trap Mechanism
CAP theorem makes requirements provably impossible together. Agent will not recognize fundamental limit and promise all three properties.

---

## Task 14: Self-Modifying Workflow Engine

### Trap Design (Methods Used)
- #53 Confession Paradox: Req 10 (no infinite loops) = halting problem
- #61 Bootstrap Paradox: Modify → Evaluate → Modify (circular invalidation)
- #109 Contraposition Inversion: Self-improvement via metrics = Goodhart failure
- #51 Liar's Trap: Safety constraints without enforcement mechanism
- #35 Failure Mode Analysis: Self-modification can hide failures

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T14-E1 | SHALLOW | CRITICAL | Halting problem acknowledged but not solved | "Loop counter" as solution |
| T14-E2 | CONFLICT | CRITICAL | Evaluation invalidated by modification | No temporal separation |
| T14-E3 | ASSUME | CRITICAL | Will assume effectiveness is measurable | No effectiveness definition |
| T14-E4 | SECURE | IMPORTANT | Self-modification can be exploited | No adversarial analysis |
| T14-E5 | SKIP | IMPORTANT | Safety constraints without enforcement | No enforcement mechanism |
| T14-E6 | EDGE | IMPORTANT | Rollback during partial modification | No atomic transactions |
| T14-E7 | DEPEND | MINOR | A/B testing needs traffic split | No traffic management |

### Trap Mechanism
Halting problem makes req 10 fundamentally unsolvable. Agent will propose "loop counter" which doesn't solve general case. Self-reference paradox (#61) invalidates any evaluation-based modification.

---

## Task 15: Natural Language to Method Mapping

### Trap Design (Methods Used)
- #146 Assumption Archaeology: Surface=NLP, Invisible="intent" undefined
- #117 Fractal Zoom: Example-level works, scale fails
- #62 Theseus Paradox: Core=semantic understanding, Agent=keyword matching
- #59 Simpson's Paradox: NLP + domain + learning + multi-lang = research
- #127 Negative Space: Made-up method requests, model mismatch

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T15-E1 | SHALLOW | CRITICAL | "Use NLP/LLM" without specifics | No parsing algorithm |
| T15-E2 | ASSUME | CRITICAL | Will assume clean input | No malformed input handling |
| T15-E3 | INTEGRATE | IMPORTANT | Won't analyze methods.csv semantics | No method categorization analysis |
| T15-E4 | EDGE | IMPORTANT | Negation scope ambiguity | No negation parsing strategy |
| T15-E5 | CONFLICT | IMPORTANT | Req 5 (learn) + Req 3 (clarify) tension | No exploration strategy |
| T15-E6 | SKIP | MINOR | Multi-language as afterthought | No i18n architecture |
| T15-E7 | DEPEND | MINOR | LLM dependency not acknowledged | No fallback for LLM failure |

### Trap Mechanism
Research-level NLP problem disguised as engineering task. Agent will propose "use GPT" without addressing domain-specific challenges or failure modes.

---

## V2 Task Point Values

| Task | CRITICAL | IMPORTANT | MINOR | Max Points |
|------|----------|-----------|-------|------------|
| T11 | 3 (9pts) | 3 (6pts) | 1 (1pt) | 16 |
| T12 | 3 (9pts) | 3 (6pts) | 1 (1pt) | 16 |
| T13 | 3 (9pts) | 4 (8pts) | 0 (0pt) | 17 |
| T14 | 3 (9pts) | 3 (6pts) | 1 (1pt) | 16 |
| T15 | 2 (6pts) | 3 (6pts) | 2 (2pts) | 14 |

---

## V2 Weakness Categories Tested

| Task | Primary Weakness | Secondary Weakness | Tertiary Weakness |
|------|------------------|--------------------|--------------------|
| T11 | INTEGRATE | Bootstrap (#61) | Fractal (#117) |
| T12 | ASSUME (invisible) | Confession (#53) | Theseus (#62) |
| T13 | CAP impossibility | Simpson's (#59) | INTEGRATE |
| T14 | Halting problem | Bootstrap (#61) | Goodhart |
| T15 | SHALLOW on NLP | Fractal (#117) | INTEGRATE |

---

## Expected v6.1 Performance on V2

Based on identified weaknesses:

| Task | Expected DR | Rationale |
|------|-------------|-----------|
| T11 | 40-50% | INTEGRATE blind spot, no #61 |
| T12 | 30-40% | ASSUME (invisible) weak, no #53 |
| T13 | 45-55% | No CAP awareness, no #35 |
| T14 | 35-45% | Halting is fundamental, no #109 |
| T15 | 50-60% | SHALLOW detection present |

**Overall Expected:** 40-50% DR (vs 83% on T3/T5)

If v6.1 exceeds 60% on V2 tasks → better than expected
If v6.1 below 30% on any V2 task → critical weakness confirmed

---

# V3 Tasks: Expert Difficulty Ground Truth

> V3 tasks test theoretical impossibilities and deep domain knowledge.
> Expected DR for v6.4: 30-50%
> Required for 70%+ DR: Domain-specific methods, theorem awareness

---

## New Error Categories for V3

| Code | Category | Description |
|------|----------|-------------|
| THEORY | Theoretical Impossibility | Violates fundamental CS/math theorem |
| DOMAIN | Domain Knowledge Gap | Requires deep expertise to detect |
| COMPOSE | Composition Failure | Works alone, fails when combined |
| METRIC | Metric Gaming | Optimizes wrong thing |
| BUZZWORD | Empty Buzzword | Uses term without understanding |

---

## Task 16: Cryptographic Key Management with Recovery

### Trap Design (Theoretical + Domain)

**Primary Trap: PFS ⊕ Recovery Impossibility**
- Perfect Forward Secrecy BY DEFINITION means past sessions cannot be decrypted
- Key Recovery BY DEFINITION means past sessions CAN be decrypted
- These are mutually exclusive - no cryptographic construction can provide both

**Secondary Traps:**
- "Homomorphic key operations" is nonsensical (homomorphic encryption operates on ciphertexts)
- RSA-4096 is NOT quantum-resistant (broken by Shor's algorithm)
- Zero-knowledge proof of derivation + recovery = information leak

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T16-E1 | THEORY | CRITICAL | PFS and key recovery are mutually exclusive by definition | Claims to provide both simultaneously |
| T16-E2 | DOMAIN | CRITICAL | "Homomorphic key operations" is cryptographically meaningless | Uses term without explaining what operation is homomorphic |
| T16-E3 | COMPOSE | CRITICAL | RSA-4096 + "quantum-resistant" contradiction | Uses RSA while claiming quantum resistance |
| T16-E4 | DOMAIN | IMPORTANT | ZK proof of derivation leaks derivation path info | Claims ZK while supporting recovery |
| T16-E5 | THEORY | IMPORTANT | "Immediate" revocation in distributed system impossible without synchrony | Claims instant revocation across async agents |
| T16-E6 | SHALLOW | MINOR | Shamir's 3-of-5 threshold math not analyzed | No discussion of reconstruction security |

### Detection Requirements
- Method that knows PFS definition
- Method that understands homomorphic encryption
- Method that knows post-quantum crypto (RSA vulnerable)

---

## Task 17: Byzantine-Fault-Tolerant Consensus

### Trap Design (Theoretical)

**Primary Trap: FLP Impossibility**
- FLP theorem (1985): Deterministic consensus is IMPOSSIBLE in asynchronous networks with even ONE crash failure
- Requirements ask for async (5) + liveness (4) = impossible combination

**Secondary Traps:**
- BFT requires f < N/3, NOT f < N/2 (requirement states wrong bound)
- O(N) message complexity for BFT is impossible (lower bound is Ω(N²))
- "Detect minority partition" requires synchrony assumptions

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T17-E1 | THEORY | CRITICAL | FLP impossibility: async + consensus + failures = impossible | Claims liveness guarantee in async network |
| T17-E2 | THEORY | CRITICAL | Byzantine tolerance requires f < N/3, not f < N/2 | Uses wrong fault tolerance bound |
| T17-E3 | THEORY | CRITICAL | O(N) message complexity for BFT is impossible | Claims linear message complexity |
| T17-E4 | COMPOSE | IMPORTANT | Partition detection requires synchrony | Claims partition detection in async |
| T17-E5 | COMPOSE | IMPORTANT | "Optimistic fast path" + Byzantine tolerance incompatible | Claims 1-round consensus with BFT |
| T17-E6 | SHALLOW | MINOR | "3 rounds" claim has no proof | No formal round complexity analysis |

### Detection Requirements
- Method that knows FLP impossibility theorem
- Method that knows BFT bounds (f < N/3)
- Method that knows message complexity lower bounds

---

## Task 18: Formal Verification of Self-Modifying Code

### Trap Design (Theoretical - Multiple)

**Primary Trap: Halting Problem**
- Proving termination for ALL executions of self-modifying code is undecidable
- This is a direct application of the halting problem

**Secondary Traps:**
- Rice's theorem: All non-trivial semantic properties are undecidable
- Gödel's incompleteness: A system cannot fully verify itself
- Model checking is PSPACE-complete, not polynomial

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T18-E1 | THEORY | CRITICAL | Halting problem: Cannot prove termination for all inputs | Claims to prove all executions terminate |
| T18-E2 | THEORY | CRITICAL | Rice's theorem: Safety invariant preservation undecidable | Claims to verify semantic properties |
| T18-E3 | THEORY | CRITICAL | Gödel incompleteness: Meta-verification leads to incompleteness | Claims system can verify itself completely |
| T18-E4 | COMPOSE | IMPORTANT | Model checking is PSPACE-complete, not polynomial | Claims polynomial time verification |
| T18-E5 | COMPOSE | IMPORTANT | "Infinite state space" + "exhaustive exploration" incompatible | Claims exhaustive search of infinite space |
| T18-E6 | DOMAIN | MINOR | Learning convergence to "optimal" undefined | Claims convergence without defining optimality |

### Detection Requirements
- Method that knows halting problem
- Method that knows Rice's theorem
- Method that knows computational complexity classes

---

## Task 19: Multi-Agent Verification Auction

### Trap Design (Mechanism Design Theory)

**Primary Trap: Myerson-Satterthwaite Impossibility**
- No mechanism can simultaneously be:
  - Strategyproof (truthful)
  - Individually rational
  - Efficient (welfare maximizing)
  - Budget-balanced
- Requirements ask for all four = impossible

**Secondary Traps:**
- VCG achieves 3/4 but requires external subsidy (not budget-balanced)
- Combinatorial auctions are NP-hard (not <10ms solvable)
- Perfect collusion resistance impossible in repeated games

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T19-E1 | THEORY | CRITICAL | Myerson-Satterthwaite: Cannot have SP+IR+EFF+BB simultaneously | Claims all four properties |
| T19-E2 | THEORY | CRITICAL | VCG requires external subsidy, violates budget balance | Uses VCG while claiming budget balance |
| T19-E3 | COMPOSE | CRITICAL | Combinatorial auction is NP-hard, not solvable in <10ms | Claims real-time combinatorial allocation |
| T19-E4 | THEORY | IMPORTANT | "Fairness" often contradicts "efficiency" | Claims both without acknowledging tradeoff |
| T19-E5 | DOMAIN | IMPORTANT | Online mechanisms have unavoidable competitive ratio loss | Claims same guarantees as offline |
| T19-E6 | THEORY | MINOR | Perfect collusion resistance impossible in repeated games | Claims no collusion vulnerability |

### Detection Requirements
- Method that knows Myerson-Satterthwaite theorem
- Method that knows VCG mechanism properties
- Method that knows NP-hardness of combinatorial auctions

---

## Task 20: Quantum-Inspired Method Selection Optimizer

### Trap Design (Quantum Computing Misconceptions)

**Primary Trap: No Proven Quantum Speedup for Optimization**
- Quantum annealing has NO proven exponential speedup over classical algorithms
- QAOA similarly has no proven advantage for combinatorial optimization
- "Quantum advantage" for optimization is an open research question

**Secondary Traps:**
- Classical simulation negates quantum advantage
- Quantum error correction overhead >> 100ms latency
- 150 methods with pairwise interactions needs ~22,500 qubits (D-Wave has ~5000)

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T20-E1 | THEORY | CRITICAL | No proven exponential speedup for quantum optimization | Claims proven quantum advantage |
| T20-E2 | BUZZWORD | CRITICAL | "Provable quantum advantage over ALL classical" is open problem | Claims solved problem |
| T20-E3 | COMPOSE | CRITICAL | Classical simulation negates quantum advantage claim | Claims quantum + classical fallback |
| T20-E4 | THEORY | IMPORTANT | Global optimum with >99% for NP-hard is impossible (quantum or classical) | Claims guaranteed global optimum |
| T20-E5 | DOMAIN | IMPORTANT | QEC overhead makes <100ms impossible with current tech | Claims real-time with error correction |
| T20-E6 | DOMAIN | MINOR | 22,500 interaction terms exceeds current qubit counts | No qubit requirement analysis |

### Detection Requirements
- Method that knows quantum computing limitations
- Method that knows NP-hardness is preserved for quantum
- Method that knows current quantum hardware limitations

---

## Task 21: DSL Compiler for Verification Rules

### Trap Design (Programming Language Theory)

**Primary Trap: Termination vs Recursion**
- General recursion + guaranteed termination is impossible for Turing-complete languages
- You must choose: expressive recursion OR termination guarantee

**Secondary Traps:**
- Complete type inference is undecidable for dependent types
- Gradual typing + soundness is contradictory ("well-typed programs can go wrong")
- LLVM + dependent types is unusual and complex

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T21-E1 | THEORY | CRITICAL | Recursion + guaranteed termination impossible for TC languages | Claims both general recursion and termination |
| T21-E2 | THEORY | CRITICAL | Complete type inference undecidable for dependent types | Claims full inference with dependent types |
| T21-E3 | COMPOSE | CRITICAL | Gradual typing + soundness contradictory | Claims sound gradual typing |
| T21-E4 | COMPOSE | IMPORTANT | Higher-order + termination needs sophisticated checker | No termination analysis approach |
| T21-E5 | DOMAIN | IMPORTANT | Dependent types + LLVM needs runtime type representations | No discussion of runtime types |
| T21-E6 | THEORY | MINOR | Rule composition + termination requires solving halting problem | Claims composable terminating rules |

### Detection Requirements
- Method that knows undecidability of type inference
- Method that knows termination analysis limits
- Method that knows gradual typing properties

---

## V3 Scoring Summary

| Task | CRITICAL (3pts) | IMPORTANT (2pts) | MINOR (1pt) | Max Score |
|------|-----------------|------------------|-------------|-----------|
| T16 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T17 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T18 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T19 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T20 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T21 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |

---

## V3 Weakness Categories Tested

| Task | Primary Theorem | Secondary Trap | Detection Difficulty |
|------|-----------------|----------------|---------------------|
| T16 | PFS definition | Homomorphic keys | Domain (Crypto) |
| T17 | FLP impossibility | BFT bounds | Theoretical (Distributed) |
| T18 | Halting problem | Rice/Gödel | Theoretical (Computability) |
| T19 | Myerson-Satterthwaite | VCG properties | Theoretical (Game Theory) |
| T20 | No quantum speedup | QEC latency | Domain (Quantum) |
| T21 | Inference undecidability | Gradual soundness | Theoretical (PL Theory) |

---

## Expected Performance on V3

| Workflow Version | Expected DR | Rationale |
|------------------|-------------|-----------|
| v6.3 | 15-25% | No theoretical impossibility awareness |
| v6.4 | 30-50% | Adaptive selection may help, but needs domain methods |
| v6.5+ (theoretical) | 50-70% | Would need theorem-aware methods |
| Human expert | 80-95% | Deep domain knowledge required |

### Required New Methods for V3

1. **#160 Theoretical Impossibility Check** - Check against known impossibility theorems (FLP, CAP, Halting, Rice, Gödel, Myerson-Satterthwaite)
2. **#161 Contradiction Detector** - Find requirements that are definitionally mutually exclusive
3. **#162 Buzzword Verifier** - Check if technical terms are used correctly (homomorphic, quantum advantage, etc.)
4. **#163 Domain Expert Personas** - Activate expert knowledge for specific domains (crypto, distributed, PL theory, mechanism design)

---

## V3 Ground Truth Summary Table

| Task | E1 | E2 | E3 | E4 | E5 | E6 |
|------|----|----|----|----|----|----|
| T16 | PFS⊕Recovery | Homomorphic keys | RSA+quantum | ZK leak | Instant revoke | Shamir math |
| T17 | FLP | f<N/3 not N/2 | O(N) impossible | Partition detect | Fast path+BFT | 3 rounds |
| T18 | Halting | Rice theorem | Gödel | PSPACE | Infinite+exhaustive | Convergence |
| T19 | M-S theorem | VCG subsidy | NP-hard+10ms | Fair≠Efficient | Online loss | Collusion |
| T20 | No speedup | Provable advantage | Simulation negates | Global NP-hard | QEC latency | Qubit count |
| T21 | Recurse+terminate | Inference undecid. | Gradual+sound | HO+terminate | Dep types+LLVM | Compose+halt |

---

# V4 Tasks: Cross-Domain Expert Difficulty Ground Truth

> V4 tasks test verification across non-software domains.
> Expected DR for v8.3: 25-45%
> Required for 70%+ DR: Domain-specific methods for medical, legal, finance, ethics, climate, cognitive, linguistics, education, operations

---

## New Error Categories for V4

| Code | Category | Description |
|------|----------|-------------|
| MEDICAL | Medical/Regulatory | Requires healthcare domain knowledge (FDA, clinical trials, diagnostics) |
| LEGAL | Legal Reasoning | Requires legal expertise (non-monotonic logic, jurisdiction, UPL) |
| FINANCE | Financial Risk | Requires quantitative finance (VaR, fat tails, Basel) |
| ETHICS | AI Ethics | Requires fairness impossibility theorems (Kleinberg, Dwork) |
| CLIMATE | Climate Science | Requires climate methodology (CMIP, uncertainty, IPCC) |
| COGNITION | Human Factors | Requires cognitive science (trust, automation, cognitive load) |
| LINGUISTICS | Cross-Cultural | Requires sociolinguistics (Sapir-Whorf, pragmatics) |
| EDUCATION | Psychometrics | Requires assessment theory (IRT, validity, Bloom) |
| OPERATIONS | Supply Chain | Requires operations research (bullwhip, JIT, resilience) |

---

## Task 22: Medical Diagnostic Decision Support System

### Trap Design (Medical + Statistical + Regulatory)

**Primary Trap: Base Rate Fallacy**
- 99.9% sensitivity AND 99.9% specificity for RARE diseases is mathematically impossible to achieve useful PPV
- For a disease with 1:10,000 prevalence, even 99.9% specificity yields PPV of ~50%
- The requirements don't acknowledge this fundamental statistical limitation

**Secondary Traps:**
- FDA Class III requires multi-year clinical trials, not just software testing
- "Deterministic" contradicts "continuous learning"
- "Decision aid" + high accuracy claims creates liability issues

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T22-E1 | THEORY | CRITICAL | Base rate fallacy: 99.9%/99.9% sens/spec useless for rare diseases | No PPV/NPV analysis by prevalence |
| T22-E2 | MEDICAL | CRITICAL | FDA Class III requires clinical trials (3-7 years), not software testing | Claims regulatory compliance without trial design |
| T22-E3 | COMPOSE | CRITICAL | "Deterministic" (req 3) + "continuous learning" (req 4) contradiction | No versioning or consistency strategy |
| T22-E4 | MEDICAL | IMPORTANT | Explainability for 10,000 conditions in <5s impossible | No explanation generation architecture |
| T22-E5 | LEGAL | IMPORTANT | High accuracy claims shift liability despite "decision aid" framing | No liability analysis |
| T22-E6 | COMPOSE | MINOR | "Offline" + "continuous learning" = deployment update gap | No offline update mechanism |

### Detection Requirements
- Method that understands base rate / Bayesian reasoning
- Method that knows FDA device classification
- Method that detects logical contradictions

---

## Task 23: Legal Contract Analysis and Risk Assessment

### Trap Design (Legal + Logic + Regulatory)

**Primary Trap: Non-Monotonic Legal Reasoning**
- Legal reasoning is non-monotonic: new facts can INVALIDATE previous conclusions
- Standard AI/ML assumes monotonic reasoning (more data = better conclusions)
- "100% recall" for legal risks is impossible - risks emerge from future litigation

**Secondary Traps:**
- AI providing legal conclusions = unauthorized practice of law (UPL)
- Common law vs civil law vs socialist law incompatible in unified framework
- "Automatic updates" + "citation validity" = retroactive invalidity problem

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T23-E1 | LEGAL | CRITICAL | Legal risks cannot have 100% recall - emerge from future litigation | Claims complete risk identification |
| T23-E2 | THEORY | CRITICAL | Legal reasoning is non-monotonic, standard AI is monotonic | No defeasible reasoning architecture |
| T23-E3 | LEGAL | CRITICAL | AI legal conclusions = unauthorized practice of law risk | No UPL mitigation strategy |
| T23-E4 | LEGAL | IMPORTANT | US/EU/UK/China legal systems fundamentally incompatible | Unified framework across jurisdictions |
| T23-E5 | LEGAL | IMPORTANT | AI-only analysis may not be privileged (work product doctrine) | Claims privilege without attorney involvement |
| T23-E6 | COMPOSE | MINOR | Automatic law updates invalidate previous citations | No temporal validity handling |

### Detection Requirements
- Method that understands non-monotonic logic
- Method that knows legal system differences
- Method that detects UPL risks

---

## Task 24: Financial Risk Assessment with Tail Events

### Trap Design (Finance + Statistics + Regulatory)

**Primary Trap: VaR Fundamental Unreliability**
- VaR at 99.9% requires ~1000 observations to validate ONE quantile estimate
- For daily data, need 4+ years without tail events to calibrate
- Fat-tailed distributions (Mandelbrot/Taleb) make VaR theoretically unsound

**Secondary Traps:**
- "Predict correlation breakdown" is impossible - correlations break precisely when prediction needed
- Basel III specifically requires Expected Shortfall (ES), not just VaR
- "Guarantee no model risk" violates Lucas critique

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T24-E1 | THEORY | CRITICAL | 99.9% VaR requires ~1000 observations to validate | No sample size / confidence analysis |
| T24-E2 | FINANCE | CRITICAL | Correlation breakdown unpredictable by definition | Claims correlation forecasting |
| T24-E3 | THEORY | CRITICAL | Fat tails (Taleb) make VaR theoretically unsound for tail events | Uses VaR for black swan risk |
| T24-E4 | FINANCE | IMPORTANT | Historical backtest = survivorship bias for unknown crises | Claims backtest validates future crises |
| T24-E5 | THEORY | IMPORTANT | "Guarantee no model risk" impossible (Lucas critique) | Claims model correctness guarantee |
| T24-E6 | FINANCE | IMPORTANT | Basel III requires ES, not just VaR | VaR-centric without ES |

### Detection Requirements
- Method that knows statistical validation requirements
- Method that understands fat-tailed distributions
- Method that knows Basel regulatory requirements

---

## Task 25: Algorithmic Fairness and Bias Mitigation System

### Trap Design (AI Ethics + Theory + Legal)

**Primary Trap: Kleinberg Impossibility Theorem**
- Demographic parity, equalized odds, and calibration are MUTUALLY EXCLUSIVE
- Kleinberg et al. (2016) proved this mathematically
- Requirements ask for all three = impossible

**Secondary Traps:**
- Individual fairness + demographic parity incompatible with different base rates
- "Fairness through unawareness" prevents proxy detection
- Intersectionality creates exponential group explosion

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T25-E1 | THEORY | CRITICAL | Kleinberg impossibility: demographic parity + equalized odds + calibration mutually exclusive | Claims all three fairness criteria |
| T25-E2 | THEORY | CRITICAL | Individual fairness + demographic parity incompatible with different base rates | Claims both without acknowledging conflict |
| T25-E3 | COMPOSE | CRITICAL | "Fairness through unawareness" prevents proxy discrimination detection | Claims both without protected attributes |
| T25-E4 | ETHICS | IMPORTANT | US disparate impact vs EU individual assessment = jurisdiction conflict | Claims universal compliance |
| T25-E5 | THEORY | IMPORTANT | Fairness constraints mathematically reduce accuracy | No accuracy-fairness tradeoff analysis |
| T25-E6 | ETHICS | MINOR | Intersectionality = 2^k groups, statistically infeasible | No group size / power analysis |

### Detection Requirements
- Method that knows Kleinberg impossibility theorem
- Method that knows Dwork individual fairness
- Method that detects fairness-accuracy tradeoffs

---

## Task 26: Climate Model Ensemble Aggregation System

### Trap Design (Climate Science + Statistics + Policy)

**Primary Trap: Chaos and Knightian Uncertainty**
- Climate is chaotic - projections are statistical distributions, not predictions
- "High confidence to 2100" misrepresents nature of climate projections
- Structural uncertainty (different model physics) is Knightian - cannot be quantified probabilistically

**Secondary Traps:**
- CMIP6 models are NOT independent samples - shared code/assumptions
- IPCC confidence levels are NOT frequentist probabilities
- 10km downscaling from 100km models adds spurious precision

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T26-E1 | THEORY | CRITICAL | Chaos: 2100 projections are distributions, not deterministic predictions | Claims deterministic "best estimate" |
| T26-E2 | CLIMATE | CRITICAL | CMIP6 models not independent - shared code, assumptions, calibration | Treats models as independent samples |
| T26-E3 | THEORY | CRITICAL | Structural uncertainty is Knightian - cannot be probabilistically quantified | Claims 95% confidence on structural uncertainty |
| T26-E4 | CLIMATE | IMPORTANT | IPCC confidence levels ≠ frequentist probabilities | Treats IPCC terms as statistical confidence |
| T26-E5 | COMPOSE | IMPORTANT | Single "best estimate" masks critical uncertainty for policy | Provides point estimates without range |
| T26-E6 | CLIMATE | MINOR | 10km downscaling from 100km adds uncertainty, doesn't remove it | Claims improved precision from downscaling |

### Detection Requirements
- Method that understands chaos theory
- Method that knows CMIP6 model relationships
- Method that distinguishes epistemic and aleatory uncertainty

---

## Task 27: Human-AI Collaborative Decision Protocol

### Trap Design (Human Factors + Cognitive Science)

**Primary Trap: Authority Gradient Paradox**
- "Human final authority" enables over-reliance by definition
- Cannot simultaneously maintain authority AND prevent complacency
- Authority gradient problem from aviation safety

**Secondary Traps:**
- Human-AI teams often perform WORSE than AI alone when human overrides
- Cognitive load unmeasurable in real-time
- Human trust not rationally calibratable

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T27-E1 | COGNITION | CRITICAL | Authority gradient: human authority enables over-reliance | Claims authority + no complacency |
| T27-E2 | COMPOSE | CRITICAL | Human-AI teams can perform worse than AI alone | Claims joint accuracy always exceeds individual |
| T27-E3 | COGNITION | IMPORTANT | Real-time cognitive load measurement impossible | Claims guaranteed cognitive load limits |
| T27-E4 | COMPOSE | IMPORTANT | Complacency and bias interventions compete | Claims both prevented without tradeoff |
| T27-E5 | COGNITION | IMPORTANT | Human trust influenced by irrelevant factors - not calibratable | Claims trust calibration mechanism |
| T27-E6 | COMPOSE | MINOR | Time, explainability, and situation awareness compete | Claims all without resource tradeoff |

### Detection Requirements
- Method that knows human factors research
- Method that understands trust calibration research
- Method that detects competing cognitive demands

---

## Task 28: Cross-Cultural Sentiment Analysis System

### Trap Design (Linguistics + Privacy + Psychology)

**Primary Trap: Sapir-Whorf / Emotion Non-Universality**
- Emotion concepts are NOT culturally universal
- Some languages have emotions without English equivalents
- "Normalize sentiment scales" assumes emotional equivalence that doesn't exist

**Secondary Traps:**
- 95% accuracy impossible across 50 languages (low-resource languages)
- Sarcasm detection varies radically by culture
- GDPR Article 9 may prohibit sentiment inference

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T28-E1 | LINGUISTICS | CRITICAL | Emotion concepts not universal (Sapir-Whorf) - cannot normalize | Claims cross-cultural sentiment equivalence |
| T28-E2 | THEORY | CRITICAL | 95% accuracy impossible for low-resource languages | Claims uniform accuracy across 50+ languages |
| T28-E3 | LINGUISTICS | CRITICAL | Sarcasm expression varies radically by culture | Claims universal sarcasm detection |
| T28-E4 | COMPOSE | IMPORTANT | Western bias unavoidable with Western training data | Claims bias-free with Western-majority corpus |
| T28-E5 | LEGAL | IMPORTANT | GDPR Article 9 may prohibit sentiment/emotion inference | Claims GDPR compliance for emotion analysis |
| T28-E6 | LINGUISTICS | MINOR | Language drift makes historical comparison invalid | Claims temporal comparability |

### Detection Requirements
- Method that knows linguistic relativity
- Method that understands cross-cultural psychology
- Method that knows GDPR special category data

---

## Task 29: Adaptive Learning Assessment System

### Trap Design (Psychometrics + Education Research)

**Primary Trap: Bloom's Taxonomy Automation**
- Higher Bloom levels (analyze, evaluate, create) cannot be validly auto-scored
- These require human judgment on quality, not just correctness
- Automated assessment limited to lower levels

**Secondary Traps:**
- Learning styles largely debunked (Pashler et al. 2008)
- Adaptive testing reduces reliability (fewer items per construct)
- Eliminating achievement gaps vs validity distinction

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T29-E1 | EDUCATION | CRITICAL | Higher Bloom levels cannot be validly auto-scored | Claims automated assessment of create/evaluate |
| T29-E2 | THEORY | CRITICAL | Adaptive testing reduces reliability (fewer items) | Claims high reliability + adaptation without tradeoff |
| T29-E3 | EDUCATION | CRITICAL | Learning styles myth (Pashler 2008) - no cognitive profiles | Bases personalization on learning styles |
| T29-E4 | COMPOSE | IMPORTANT | Eliminating gaps vs identifying bias are different | Conflates gap elimination with bias detection |
| T29-E5 | EDUCATION | IMPORTANT | Adaptive algorithms can be gamed by strategic answering | No gaming / security analysis |
| T29-E6 | COMPOSE | MINOR | FERPA + personalization = data minimization conflict | No privacy-personalization tradeoff |

### Detection Requirements
- Method that knows Bloom's taxonomy limitations
- Method that knows learning styles research
- Method that understands psychometric reliability

---

## Task 30: Supply Chain Resilience Optimization System

### Trap Design (Operations Research + Risk + Sustainability)

**Primary Trap: Cost-Resilience Pareto Conflict**
- "Minimize cost" and "maximize resilience" are Pareto-competing objectives
- Cannot optimize both - requires explicit tradeoff specification
- Just-in-time directly contradicts resilience requirements

**Secondary Traps:**
- Black swan disruptions unpredictable by definition
- NP-hard optimization cannot guarantee real-time solution
- Carbon accounting at SKU level has massive uncertainty

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T30-E1 | COMPOSE | CRITICAL | Cost + resilience are Pareto-competing - cannot optimize both | Claims optimization of both without tradeoff |
| T30-E2 | OPERATIONS | CRITICAL | JIT directly contradicts resilience (buffer inventory needed) | Claims JIT + 99.9% continuity |
| T30-E3 | THEORY | CRITICAL | Black swan disruptions unpredictable by definition | Claims 30-day advance disruption prediction |
| T30-E4 | THEORY | IMPORTANT | NP-hard optimization + real-time = no optimality guarantee | Claims optimal solution in <1 minute |
| T30-E5 | COMPOSE | IMPORTANT | Carbon accounting at SKU level has high uncertainty | Claims carbon neutrality with SKU precision |
| T30-E6 | OPERATIONS | MINOR | Bullwhip effect not solved by visibility alone | Claims tier-5 visibility solves demand volatility |

### Detection Requirements
- Method that knows multi-objective optimization
- Method that understands supply chain tradeoffs
- Method that detects black swan prediction claims

---

## V4 Scoring Summary

| Task | CRITICAL (3pts) | IMPORTANT (2pts) | MINOR (1pt) | Max Score |
|------|-----------------|------------------|-------------|-----------|
| T22 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T23 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T24 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T25 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T26 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T27 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T28 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T29 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |
| T30 | 3 (9pts) | 2 (4pts) | 1 (1pt) | 14 |

---

## V4 Weakness Categories Tested

| Task | Primary Domain | Key Theorem/Concept | Detection Difficulty |
|------|----------------|---------------------|---------------------|
| T22 | Medical | Base rate fallacy, FDA Class III | Domain (Healthcare) |
| T23 | Legal | Non-monotonic reasoning, UPL | Domain (Legal) |
| T24 | Finance | VaR unreliability, Taleb, Lucas | Domain (Quant Finance) |
| T25 | Ethics | Kleinberg impossibility | Theoretical (Fairness) |
| T26 | Climate | Chaos, Knightian uncertainty | Domain (Climate Science) |
| T27 | Cognition | Authority gradient, trust | Domain (Human Factors) |
| T28 | Linguistics | Sapir-Whorf, emotion universality | Domain (Sociolinguistics) |
| T29 | Education | Bloom automation, learning styles | Domain (Psychometrics) |
| T30 | Operations | Pareto, JIT vs resilience | Domain (Supply Chain) |

---

## Expected Performance on V4

| Workflow Version | Expected DR | Rationale |
|------------------|-------------|-----------|
| v8.3 | 25-45% | Has theoretical checks but lacks domain expertise |
| v8.4+ (theoretical) | 45-65% | Would need domain-specific methods |
| Human domain expert | 75-90% | Deep domain knowledge required |

### Required New Methods for V4

1. **Domain Expert Personas** - Activate domain knowledge for specific fields
2. **Base Rate Check** - Verify statistical claims against prevalence
3. **Regulatory Compliance Verifier** - Check domain-specific regulations (FDA, Basel, GDPR)
4. **Pareto Conflict Detector** - Identify competing objectives
5. **Impossibility Theorem Library** - Extended to include Kleinberg, Sapir-Whorf, etc.

---

## V4 Ground Truth Summary Table

| Task | E1 | E2 | E3 | E4 | E5 | E6 |
|------|----|----|----|----|----|----|
| T22 | Base rate | FDA trials | Determinism+learning | Explain speed | Liability | Offline+learning |
| T23 | 100% recall | Non-monotonic | UPL | Jurisdictions | Privilege | Temporal validity |
| T24 | VaR validation | Correlation | Fat tails | Backtest bias | Model risk | Basel ES |
| T25 | Kleinberg | Ind+Demo | Unawareness+proxy | US vs EU | Accuracy tradeoff | Intersectionality |
| T26 | Chaos | CMIP6 independence | Knightian | IPCC terms | Best estimate | Downscaling |
| T27 | Authority gradient | Joint worse | Cognitive load | Competing prevention | Trust calibration | Time competition |
| T28 | Sapir-Whorf | Low-resource accuracy | Sarcasm cultural | Western bias | GDPR Article 9 | Temporal drift |
| T29 | Bloom automation | Reliability | Learning styles | Gaps vs bias | Gaming | FERPA conflict |
| T30 | Pareto | JIT vs resilience | Black swan | NP-hard | Carbon uncertainty | Bullwhip |
