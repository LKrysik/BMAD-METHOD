# Workflow Modification Operators

## Purpose
Concrete, testable operations for modifying workflow. Each operator has defined:
- Syntax (how to specify)
- Semantics (what it does)
- Expected impact (hypothesis)
- Test method (how to verify)
- Rollback (how to undo)

---

## Operator Categories

```
┌────────────────────────────────────────────────────────────────┐
│ STRUCTURAL          │ Changes workflow structure/flow          │
│ METHOD              │ Changes which methods are used           │
│ THRESHOLD           │ Changes numeric parameters               │
│ CONCERN             │ Changes concern generation               │
│ CHALLENGE           │ Changes validation/challenge phase       │
│ OUTPUT              │ Changes what workflow produces           │
└────────────────────────────────────────────────────────────────┘
```

---

## STRUCTURAL Operators

### S1: REORDER_PHASES

**Syntax:**
```
REORDER_PHASES(new_order: [phase_ids])
```

**Example:**
```
REORDER_PHASES([0, 2, 4, 3, 5, 6, 7])  # Move Methods before Concerns
```

**Semantics:** Changes the sequence of workflow phases.

**Constraints:**
- Phase 0 must remain first (self-check)
- Phase 1 must be before Phase 2 (inputs before concerns)
- Phase 6 must be before Phase 7 (results before fix)

**Expected impact:** Different phase order may catch different errors.

**Test method:** Run on same task, compare findings.

**Rollback:** REORDER_PHASES(original_order)

---

### S2: ADD_PHASE

**Syntax:**
```
ADD_PHASE(
  after: phase_id,
  name: string,
  purpose: string,
  methods: [method_ids],
  output: string
)
```

**Example:**
```
ADD_PHASE(
  after: 2,
  name: "Dependency Analysis",
  purpose: "Map dependencies before verification",
  methods: [#77, #84, #61],
  output: "dependency_map"
)
```

**Semantics:** Inserts new phase into workflow.

**Constraints:**
- Must have at least 3 methods
- Must have defined output
- Cannot duplicate existing phase purpose

**Expected impact:** Additional analysis dimension.

**Test method:** Compare detection rate with/without phase.

**Rollback:** REMOVE_PHASE(phase_name)

---

### S3: REMOVE_PHASE

**Syntax:**
```
REMOVE_PHASE(phase_id_or_name)
```

**Example:**
```
REMOVE_PHASE(5)  # Remove Challenge phase
```

**Semantics:** Removes phase from workflow.

**Constraints:**
- Cannot remove Phase 0 (self-check is mandatory)
- Cannot remove Phase 1 (inputs required)
- Cannot remove Phase 6 (results required)

**Expected impact:** Faster execution, possibly lower quality.

**Test method:** Compare token usage and detection rate.

**Rollback:** ADD_PHASE with original definition

---

### S4: SPLIT_PHASE

**Syntax:**
```
SPLIT_PHASE(
  phase_id,
  split_by: criterion,
  names: [name1, name2]
)
```

**Example:**
```
SPLIT_PHASE(
  4,
  split_by: "layer",
  names: ["Verify Content", "Verify Structure", "Verify Assumptions"]
)
```

**Semantics:** Divides one phase into multiple specialized phases.

**Expected impact:** More focused analysis per sub-phase.

**Test method:** Compare depth quality metric.

**Rollback:** MERGE_PHASES([new_phase_ids])

---

### S5: MERGE_PHASES

**Syntax:**
```
MERGE_PHASES(
  phases: [phase_ids],
  new_name: string
)
```

**Example:**
```
MERGE_PHASES([3, 4], "Method Selection & Verification")
```

**Semantics:** Combines multiple phases into one.

**Expected impact:** Less overhead, possibly less thorough.

**Test method:** Compare token efficiency.

**Rollback:** SPLIT_PHASE with original definitions

---

## METHOD Operators

### M1: ADD_METHOD

**Syntax:**
```
ADD_METHOD(
  phase: phase_id,
  method: method_id,
  mandatory: bool,
  trigger: condition | null
)
```

**Example:**
```
ADD_METHOD(
  phase: 2,
  method: #148,  # Multi-Artifact Cross-Check
  mandatory: true,
  trigger: null
)
```

**Semantics:** Adds method to phase's method pool.

**Variants:**
- `mandatory: true` → always executed
- `mandatory: false` → selected based on context
- `trigger: condition` → executed only when condition met

**Expected impact:** More thorough analysis in that dimension.

**Test method:** Track if method contributes to findings.

**Rollback:** REMOVE_METHOD(phase, method)

---

### M2: REMOVE_METHOD

**Syntax:**
```
REMOVE_METHOD(phase: phase_id, method: method_id)
```

**Example:**
```
REMOVE_METHOD(phase: 4, method: #72)  # Remove Closure Check from Verify
```

**Semantics:** Removes method from phase.

**Constraints:**
- Cannot remove all methods from phase
- Cannot remove mandatory methods defined in v6 core

**Expected impact:** Faster but possibly missing that analysis type.

**Test method:** Check if previously-detected errors are now missed.

**Rollback:** ADD_METHOD with original config

---

### M3: REPLACE_METHOD

**Syntax:**
```
REPLACE_METHOD(
  phase: phase_id,
  old_method: method_id,
  new_method: method_id
)
```

**Example:**
```
REPLACE_METHOD(phase: 5, old_method: #65, new_method: #110)
```

**Semantics:** Swaps one method for another.

**Use case:** When method is ineffective, try alternative.

**Test method:** Compare findings quality before/after.

**Rollback:** REPLACE_METHOD(phase, new_method, old_method)

---

### M4: SET_METHOD_MINIMUM

**Syntax:**
```
SET_METHOD_MINIMUM(phase: phase_id, count: int)
```

**Example:**
```
SET_METHOD_MINIMUM(phase: 3, count: 7)  # Require 7 methods per concern
```

**Semantics:** Changes minimum method requirement for phase.

**Constraints:**
- count >= 3 (minimum viable)
- count <= 15 (practical maximum)

**Expected impact:** More/fewer methods = more/fewer findings.

**Test method:** Compare detection rate at different minimums.

**Rollback:** SET_METHOD_MINIMUM(phase, original_count)

---

### M5: SET_CATEGORY_DIVERSITY

**Syntax:**
```
SET_CATEGORY_DIVERSITY(phase: phase_id, min_categories: int)
```

**Example:**
```
SET_CATEGORY_DIVERSITY(phase: 3, min_categories: 4)
```

**Semantics:** Requires methods from N different categories.

**Expected impact:** More diverse analysis perspectives.

**Test method:** Compare category coverage metric.

**Rollback:** SET_CATEGORY_DIVERSITY(phase, original)

---

## THRESHOLD Operators

### T1: SET_DEPTH_MINIMUM

**Syntax:**
```
SET_DEPTH_MINIMUM(depth_level: SYMPTOM|CAUSE|STRUCTURE|ASSUMPTION|ROOT_CAUSE)
```

**Example:**
```
SET_DEPTH_MINIMUM(STRUCTURE)  # Findings must reach at least STRUCTURE
```

**Semantics:** Findings below this depth are flagged as incomplete.

**Current default:** No minimum (any depth accepted)

**Expected impact:** Deeper analysis, fewer superficial findings.

**Test method:** Compare depth quality metric.

**Rollback:** SET_DEPTH_MINIMUM(SYMPTOM)

---

### T2: SET_WHYS_COUNT

**Syntax:**
```
SET_WHYS_COUNT(count: int)
```

**Example:**
```
SET_WHYS_COUNT(7)  # 7 Whys instead of 5
```

**Semantics:** Changes depth of root cause analysis.

**Constraints:**
- count >= 3
- count <= 10

**Expected impact:** Deeper root cause identification.

**Test method:** Compare root cause quality.

**Rollback:** SET_WHYS_COUNT(5)

---

### T3: SET_CHALLENGE_THRESHOLD

**Syntax:**
```
SET_CHALLENGE_THRESHOLD(
  min_challenges: int,
  require_all_pass: bool
)
```

**Example:**
```
SET_CHALLENGE_THRESHOLD(min_challenges: 2, require_all_pass: false)
```

**Semantics:** How many challenge methods must a finding survive?

**Current default:** 3 challenges, all must pass

**Expected impact:** Lower = more findings (possibly more FP), Higher = fewer findings (possibly more FN)

**Test method:** Compare precision and detection rate.

**Rollback:** SET_CHALLENGE_THRESHOLD(3, true)

---

### T4: SET_SEVERITY_THRESHOLDS

**Syntax:**
```
SET_SEVERITY_THRESHOLDS(
  critical_if: condition,
  important_if: condition,
  minor_else: true
)
```

**Example:**
```
SET_SEVERITY_THRESHOLDS(
  critical_if: "blocks_usage OR security_risk",
  important_if: "significant_impact OR multiple_locations",
  minor_else: true
)
```

**Semantics:** Defines how severity is assigned to findings.

**Expected impact:** Changes severity distribution.

**Test method:** Compare weighted detection score.

**Rollback:** Restore original definitions

---

## CONCERN Operators

### C1: ADD_CONCERN_LAYER

**Syntax:**
```
ADD_CONCERN_LAYER(
  name: string,
  description: string,
  methods: [method_ids]
)
```

**Example:**
```
ADD_CONCERN_LAYER(
  name: "D: Dependencies",
  description: "What problems might exist in DEPENDENCIES?",
  methods: [#61, #77, #84, #148]
)
```

**Semantics:** Adds new layer to multi-layer concern analysis.

**Current layers:** A (Content), B (Structure), C (Assumptions)

**Expected impact:** Additional analysis dimension.

**Test method:** Check if new layer catches errors others miss.

**Rollback:** REMOVE_CONCERN_LAYER(name)

---

### C2: REMOVE_CONCERN_LAYER

**Syntax:**
```
REMOVE_CONCERN_LAYER(layer_name)
```

**Semantics:** Removes concern layer from analysis.

**Constraints:**
- Cannot remove all layers
- Cannot remove Layer A (Content) - minimum viable

**Expected impact:** Faster but less thorough.

**Rollback:** ADD_CONCERN_LAYER with original definition

---

### C3: SET_CONCERNS_PER_LAYER

**Syntax:**
```
SET_CONCERNS_PER_LAYER(min: int, max: int)
```

**Example:**
```
SET_CONCERNS_PER_LAYER(min: 3, max: 8)
```

**Semantics:** Bounds on how many concerns per layer.

**Current default:** No explicit bounds

**Expected impact:** Prevents over/under-analysis.

**Test method:** Compare findings per concern.

**Rollback:** SET_CONCERNS_PER_LAYER(1, unlimited)

---

## CHALLENGE Operators

### CH1: ADD_CHALLENGE_METHOD

**Syntax:**
```
ADD_CHALLENGE_METHOD(method_id, weight: float)
```

**Example:**
```
ADD_CHALLENGE_METHOD(#51, weight: 1.5)  # Add Liar's Trap with high weight
```

**Semantics:** Adds method to Challenge phase with specified weight.

**Weight meaning:**
- weight > 1.0: Must pass this challenge
- weight = 1.0: Normal challenge
- weight < 1.0: Optional/supplementary

**Expected impact:** Different challenges catch different issues.

**Rollback:** REMOVE_CHALLENGE_METHOD(method_id)

---

### CH2: SET_CHALLENGE_MODE

**Syntax:**
```
SET_CHALLENGE_MODE(mode: ALL_MUST_PASS | MAJORITY_PASS | WEIGHTED_SCORE)
```

**Example:**
```
SET_CHALLENGE_MODE(WEIGHTED_SCORE)
```

**Semantics:**
- ALL_MUST_PASS: Finding rejected if any challenge fails
- MAJORITY_PASS: Finding accepted if >50% challenges pass
- WEIGHTED_SCORE: Weighted average, threshold configurable

**Expected impact:** Changes false positive/negative balance.

**Rollback:** SET_CHALLENGE_MODE(ALL_MUST_PASS)

---

## OUTPUT Operators

### O1: ADD_OUTPUT_FIELD

**Syntax:**
```
ADD_OUTPUT_FIELD(
  finding_field: string,
  type: string,
  required: bool
)
```

**Example:**
```
ADD_OUTPUT_FIELD(
  finding_field: "fix_effort",
  type: "LOW|MEDIUM|HIGH",
  required: true
)
```

**Semantics:** Adds required field to finding output.

**Expected impact:** More structured, actionable findings.

**Rollback:** REMOVE_OUTPUT_FIELD(field_name)

---

### O2: SET_EVIDENCE_REQUIREMENTS

**Syntax:**
```
SET_EVIDENCE_REQUIREMENTS(
  require_quote: bool,
  require_line_number: bool,
  require_file_path: bool
)
```

**Example:**
```
SET_EVIDENCE_REQUIREMENTS(
  require_quote: true,
  require_line_number: true,
  require_file_path: true
)
```

**Semantics:** What evidence must accompany each finding.

**Expected impact:** More verifiable findings, possibly fewer findings.

**Rollback:** SET_EVIDENCE_REQUIREMENTS(false, false, false)

---

## Operator Composition

Operators can be combined into "recipes":

### Recipe Example: "Deep Mode"
```
RECIPE deep_mode:
  SET_DEPTH_MINIMUM(STRUCTURE)
  SET_WHYS_COUNT(7)
  SET_METHOD_MINIMUM(phase: 3, count: 8)
  SET_CATEGORY_DIVERSITY(phase: 3, min_categories: 5)
  SET_EVIDENCE_REQUIREMENTS(true, true, true)
```

### Recipe Example: "Fast Mode"
```
RECIPE fast_mode:
  REMOVE_PHASE(5)  # Skip Challenge
  SET_METHOD_MINIMUM(phase: 3, count: 3)
  SET_CONCERNS_PER_LAYER(min: 1, max: 3)
```

### Recipe Example: "High Precision"
```
RECIPE high_precision:
  SET_CHALLENGE_THRESHOLD(min_challenges: 4, require_all_pass: true)
  ADD_CHALLENGE_METHOD(#51, weight: 1.5)
  ADD_CHALLENGE_METHOD(#52, weight: 1.5)
  SET_EVIDENCE_REQUIREMENTS(true, true, true)
```

---

## Operator Application Log

When applying operators, record:

```markdown
## Operator Application

Variant: v6.2
Base: v6.1
Date: [timestamp]

### Operators Applied
1. ADD_METHOD(phase: 2, method: #148, mandatory: true)
   - Rationale: Cross-check was missing
   - Hypothesis: Will catch INTEGRATE errors better

2. SET_DEPTH_MINIMUM(CAUSE)
   - Rationale: Too many SYMPTOM-level findings
   - Hypothesis: Will improve depth quality metric

### Combined Expected Effect
- Detection rate: +5% for INTEGRATE category
- Depth quality: +0.5 average
- Token usage: +10% (more thorough)

### Test Plan
- Run on T1, T3, T7 (known INTEGRATE errors)
- Compare to v6.1 baseline
- Success if: DR_integrate > 70% AND DQ > 3.0
```

---

## Operator Constraints Summary

| Operator | Cannot | Reason |
|----------|--------|--------|
| REMOVE_PHASE | Remove 0,1,6 | Core phases |
| REMOVE_METHOD | Remove all from phase | Phase becomes empty |
| SET_METHOD_MINIMUM | < 3 | Not viable |
| SET_WHYS_COUNT | < 3 or > 10 | Practical limits |
| REMOVE_CONCERN_LAYER | Layer A | Content is minimum |

---

## Measuring Operator Impact

For each operator application:

```
Impact = (Metric_after - Metric_before) / Metric_before × 100

Track:
- Detection Rate impact
- Token Efficiency impact
- Precision impact
- Depth Quality impact
```

Build operator effectiveness database over time:
- Which operators consistently help?
- Which operators are context-dependent?
- Which operators should be deprecated?
