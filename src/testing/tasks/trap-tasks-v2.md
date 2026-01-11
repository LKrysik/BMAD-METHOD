# Trap Tasks V2 - Designed to Challenge workflow-v6.1

> **Purpose:** These tasks exploit specific weaknesses identified in v6.1 testing.
> Each task is designed using 7-12 methods from methods.csv to create traps
> that v6.1's current method set will likely miss.

---

## Design Methodology

### Methods Used for Trap Design

| # | Method | How Used |
|---|--------|----------|
| #51 | Liar's Trap | Design tasks where "reasonable shortcuts" are fatal |
| #53 | Confession Paradox | Hide the HARD part in seemingly simple requirements |
| #59 | Simpson's Paradox | Parts look good separately, whole fails |
| #61 | Bootstrap Paradox | Create circular dependencies A→B→C→A |
| #84 | Assumption Inheritance | Require inheriting system assumptions |
| #109 | Contraposition Inversion | Design guaranteed failure paths |
| #117 | Fractal Zoom | Works at example scale, fails at production scale |
| #127 | Negative Space | Hide critical requirements in "obvious" omissions |
| #146 | Assumption Archaeology | Layer invisible assumptions |
| #62 | Theseus Paradox | Core solution misaligned with core problem |
| #35 | Failure Mode Analysis | Each component can fail in non-obvious ways |
| #147 | Constraint Classification | Mix real/assumed/choice constraints |

---

## Task 11: Plugin Architecture for Method Extensions

### Context
The BMAD-METHOD needs a plugin system allowing users to add custom methods to methods.csv without modifying core files.

### Requirements
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

### Trap Design (Methods Used)

**#61 Bootstrap Paradox:**
- Req 3 (dependencies) + Req 6 (workflow integration) + Req 2 (numbering) = circular
- To validate dependencies, need method registry
- To build registry, need to load methods
- To load methods, need to validate dependencies

**#117 Fractal Zoom:**
- Works fine with 5 plugins
- At 50 plugins: dependency resolution becomes NP-hard
- At 500 plugins: numbering conflicts guaranteed

**#59 Simpson's Paradox:**
- Each requirement looks simple
- Combined: hot-reload + dependency validation + conflict resolution = distributed systems problem

**#84 Assumption Inheritance:**
- "Methods.csv uses 1-150" - what happens at 151+?
- "Existing workflow phases" - which phases? What interfaces?
- Agent will assume without reading actual workflow files

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

### Why v6.1 Will Struggle

1. **Layer D** focuses on security/operational - won't catch INTEGRATE
2. **#127** finds "what's missing" but not "what wasn't read"
3. **#23** Security Personas won't flag architectural gaps
4. **Bootstrap circular dependency** requires specific detection method not in v6.1

---

## Task 12: Incremental Method Effectiveness Learning

### Context
Track which methods work well together and learn to recommend better combinations over time.

### Requirements
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

### Trap Design (Methods Used)

**#53 Confession Paradox:**
- The HARD part: Req 10 (feedback loop) makes standard ML invalid
- Agent will focus on easy parts (1-5) and hand-wave hard parts (6-10)

**#146 Assumption Archaeology:**
- Surface: "Track usage and learn" seems straightforward
- Inherited: ML works on i.i.d. data (violated by Req 10)
- Invisible: What IS "effectiveness"? How measured? (undefined)

**#51 Liar's Trap:**
- Agent can appear to solve this by describing "collect data, train model"
- Actually solving it requires: causal inference, bandit algorithms, non-stationary learning

**#109 Contraposition Inversion:**
- Guaranteed failure: treating this as supervised learning problem
- Guaranteed failure: ignoring feedback loop
- Agent will likely do both

**#62 Theseus Paradox:**
- Core problem: non-stationary multi-armed bandit with delayed feedback
- Agent will solve: recommendation system with ML (different problem)

### Expected Errors

| ID | Category | Severity | Expected Error | Detection Signal |
|----|----------|----------|----------------|------------------|
| T12-E1 | SHALLOW | CRITICAL | "Statistical significance" without sample size | No power analysis |
| T12-E2 | ASSUME | CRITICAL | Will treat as i.i.d. supervised learning | No mention of non-i.i.d. |
| T12-E3 | CONFLICT | CRITICAL | Req 6 + Req 10 = exploration-exploitation tradeoff | No bandit formulation |
| T12-E4 | SKIP | IMPORTANT | "Concept drift" mentioned but not designed | No drift detection mechanism |
| T12-E5 | SHALLOW | IMPORTANT | "Effectiveness" undefined | No effectiveness metric |
| T12-E6 | DEPEND | IMPORTANT | Cold start requires different strategy | Same algo for cold/warm |
| T12-E7 | SECURE | MINOR | Feedback manipulation attacks | No adversarial robustness |

### Why v6.1 Will Struggle

1. **Layer D** won't catch algorithmic shallowness
2. **#127** finds omissions but won't recognize that "ML approach" is wrong formulation
3. **#23** Security checks won't cover statistical validity
4. **Invisible assumptions** (#146) require ASSUME detection v6.1 is weak at

---

## Task 13: Cross-Agent Memory Synchronization

### Context
Multiple agents need to share memory state while maintaining consistency and handling conflicts.

### Requirements
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

### Trap Design (Methods Used)

**#35 Failure Mode Analysis:**
- Req 3 (causal ordering) + Req 4 (partition tolerance) + Req 5 (consistency) = CAP theorem
- Cannot have all three - agent must choose, will likely not acknowledge

**#84 Assumption Inheritance:**
- Req 9 "existing Agent Memory Persistence" - agent won't read T3 artifacts
- Will assume interface that may not match

**#59 Simpson's Paradox:**
- Each pair of requirements is solvable
- Causal + Partition = ok (vector clocks)
- Partition + Consistency = ok (CRDTs)
- Causal + Consistency + Partition = proven impossible (CAP)

**#147 Constraint Classification:**
- Req 5 (30 seconds) - is this REAL or ASSUMED?
- Req 10 (100ms) - is this REAL or CHOICE?
- Agent will treat all as REAL, but they may conflict

**#127 Negative Space:**
- What's NOT said: what happens to in-flight syncs during partition?
- What's NOT said: how to detect partition vs slow network?

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

### Why v6.1 Will Struggle

1. **CAP theorem** is fundamental limit - no method in v6.1 checks for impossible combinations
2. **INTEGRATE** (read existing artifacts) is v6.1's blind spot
3. **Distributed systems edge cases** require #35 Failure Mode Analysis not in v6.1 Layer D
4. **Impossible requirement combinations** need #109 Contraposition not systematically applied

---

## Task 14: Self-Modifying Workflow Engine

### Context
Create a workflow engine that can modify its own verification process based on learned patterns.

### Requirements
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

### Trap Design (Methods Used)

**#53 Confession Paradox:**
- The HARD part: Req 10 (no infinite loops) is halting problem
- Agent will hand-wave with "add loop counter"
- Actually unsolvable in general case

**#61 Bootstrap Paradox:**
- To modify workflow, need to evaluate effectiveness
- To evaluate effectiveness, need to run workflow
- To run workflow, need current (unmodified) version
- Change invalidates evaluation that justified change

**#109 Contraposition Inversion:**
- Guaranteed failure: self-modification based on recent performance
- Goodhart's Law: metric optimization ≠ goal achievement
- Agent will optimize metric, not goal

**#51 Liar's Trap:**
- Agent will produce design that LOOKS like it handles safety
- But: "cannot remove Phase 0" - how enforced? What if bug?
- "Below 15 methods" - counted when? By whom?

**#35 Failure Mode Analysis:**
- Self-modification can fail in ways that hide the failure
- Modified system evaluates itself as "improved"
- No external ground truth

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

### Why v6.1 Will Struggle

1. **Halting problem** is fundamental - no workflow can catch
2. **Self-reference paradoxes** (#61) need specific detection
3. **Layer D** catches operational issues but not logical impossibilities
4. **#127** finds omissions but won't flag "this requirement is impossible"

---

## Task 15: Natural Language to Method Mapping

### Context
Users describe their verification needs in natural language; system maps to appropriate methods.

### Requirements
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

### Trap Design (Methods Used)

**#146 Assumption Archaeology:**
- Surface: "Parse intent" - NLP task
- Inherited: NLP works well for this (false - methods.csv is domain-specific)
- Invisible: "Intent" is not well-defined even for humans

**#117 Fractal Zoom:**
- Works at example level: "check security" → #23
- Fails at scale: "make sure it's good" → ???
- Ambiguity increases non-linearly with vocabulary

**#62 Theseus Paradox:**
- Core problem: semantic understanding of verification needs
- Agent will solve: keyword matching with synonyms (different problem)

**#59 Simpson's Paradox:**
- Each requirement solvable with NLP
- Combined: NLP + domain-specific + learning + multi-language = research problem

**#127 Negative Space:**
- What's NOT said: how to handle made-up method requests?
- What's NOT said: what if user's mental model doesn't match methods.csv?

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

### Why v6.1 Will Struggle

1. **"Use NLP" hand-waving** is SHALLOW - v6.1 may not go deep enough
2. **INTEGRATE** (analyze methods.csv structure) is blind spot
3. **ASSUME** at minor severity consistently missed
4. **Research-level problem** disguised as engineering task

---

## Scoring Guide for V2 Tasks

### Task Point Values
| Task | CRITICAL | IMPORTANT | MINOR | Max Points |
|------|----------|-----------|-------|------------|
| T11 | 3 (9pts) | 3 (6pts) | 1 (1pt) | 16 |
| T12 | 3 (9pts) | 3 (6pts) | 1 (1pt) | 16 |
| T13 | 3 (9pts) | 3 (6pts) | 1 (1pt) | 16 |
| T14 | 3 (9pts) | 3 (6pts) | 1 (1pt) | 16 |
| T15 | 2 (6pts) | 3 (6pts) | 2 (2pts) | 14 |

### Expected v6.1 Performance

Based on weakness analysis:

| Task | Expected DR | Expected WDS | Primary Weakness Exploited |
|------|-------------|--------------|---------------------------|
| T11 | 40-50% | 35-45% | INTEGRATE, Bootstrap Paradox |
| T12 | 30-40% | 25-35% | ASSUME (invisible), Confession Paradox |
| T13 | 45-55% | 40-50% | CAP theorem, Simpson's Paradox |
| T14 | 35-45% | 30-40% | Halting problem, self-reference |
| T15 | 50-60% | 45-55% | SHALLOW on NLP, Fractal Zoom |

### Improvement Signals

If v6.1 scores >60% on these tasks, it's better than expected.
If v6.1 scores <30% on any task, that weakness needs addressing.

---

## Recommended Methods to Add to v6.2

Based on trap design, v6.1 needs:

| Method | Why Needed |
|--------|------------|
| #61 Bootstrap Paradox | Detect circular dependencies |
| #109 Contraposition Inversion | Find guaranteed failures |
| #117 Fractal Zoom | Check scale behavior |
| #35 Failure Mode Analysis | Component failure modes |
| #147 Constraint Classification | Real vs assumed constraints |
| #59 Simpson's Paradox | Parts vs whole analysis |

### Proposed Layer E: Theoretical Limits

New layer for v6.2:
```
Layer E: Theoretical/Fundamental Concerns
- #109 Contraposition: What guarantees failure?
- #61 Bootstrap: Circular dependencies?
- #59 Simpson's: Hidden variables in composition?
- CAP/Halting/Arrow awareness: Impossible requirements?
```

---

## Usage Instructions

1. Run v6.1 on each task (T11-T15)
2. Score against expected errors
3. Calculate which weakness categories were exploited
4. Use results to design v6.2 improvements
5. Add recommended methods to Layer D or new Layer E
