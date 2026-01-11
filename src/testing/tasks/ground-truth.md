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
