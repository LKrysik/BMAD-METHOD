---
step: 2
name: "Targeted Analysis"
time_estimate: "15-30 minutes"
goal: "Select methods based on Phase 1 signals, confirm or refute hypotheses"
requires_completion: [0, 1]
next_steps:
  DEFAULT: "step-03-adversarial.md"
data_dependencies:
  - "../data/methods.csv"
  - "../data/method-clusters.yaml"
  - "../data/severity-scoring.yaml"
  - "../data/pattern-library.yaml"
outputs:
  - findings (updated)
  - currentScore (updated)
  - methodsExecuted (updated)
---

# Phase 2: Targeted Analysis

## MANDATORY EXECUTION RULES

1. **LOAD ALL DATA FILES FIRST** — Read all `data_dependencies` before proceeding
2. **Select methods based on Phase 1 signals** — Do not pick randomly
3. **Respect cluster correlation rules** — Never 3+ from same cluster
4. **Execute 2-4 methods** — Minimum 2, maximum 4
5. **Update score after EACH method** — Check thresholds continuously
6. **ALWAYS proceed to Phase 3** — Mandatory in V2

---

## 2.0 Load Required Data

**Before ANY analysis, load these files:**

```
1. ../data/methods.csv
   → Have full method catalog available
   → Will select specific methods based on signals

2. ../data/method-clusters.yaml
   → Load cluster definitions
   → Load signal_to_cluster_mapping
   → Load selection_algorithm

3. ../data/severity-scoring.yaml
   → Load for score updates

4. ../data/pattern-library.yaml
   → Have ready for new finding comparison
```

→ **HALT** — Confirm all data files loaded before proceeding

---

## 2.1 Analyze Phase 1 Signals

**Review Phase 1 results to identify primary signal:**

```
Phase 1 findings summary:
  CRITICAL: _____ findings
  IMPORTANT: _____ findings
  MINOR: _____ findings
  Clean passes: _____/3

Current S = _____

Primary signal detected (check all that apply):

[ ] ABSOLUTE_CLAIMS
    Evidence: "guarantees", "always", "never", "100%", "perfect" found
    → Recommend: Theory cluster (#153, #154, #163)

[ ] STRUCTURAL_COMPLEXITY
    Evidence: Multiple subsystems, complex interactions, dependencies
    → Recommend: Structure cluster (#116, #86, #159)

[ ] UNGROUNDED_CLAIMS
    Evidence: Assertions without justification, missing evidence
    → Recommend: Grounding cluster (#85, #78, #130)

[ ] DIFFUSE_BELIEF
    Evidence: General unease, can't pinpoint problem
    → Recommend: Mix (#84, #109, #63)

[ ] CLEAN_PHASE1
    Evidence: All Tier 1 methods passed, looking for hidden issues
    → Recommend: Mix (#78, #109, #86)
```

→ **HALT** — Wait for signal identification

---

## 2.2 Method Selection

**From `method-clusters.yaml` → `selection_algorithm`:**

### Step 1: Identify primary signal
Primary signal from 2.1: _____________________

### Step 2: Select first method from recommended cluster

**Load method definition from `methods.csv`:**

```
First method selected: #_____ _____________________
Cluster: _____________________
Reason: Based on _____ signal

Method definition:
Description: [from methods.csv]
Output pattern: [from methods.csv]
```

### Step 3: Plan remaining methods

```
If first method finds something:
  → Select one more from same cluster to confirm
  → Then select from different cluster or challenge

If first method finds nothing:
  → Skip rest of cluster
  → Select from different cluster or challenge

Planned methods (2-4 total):
1. #_____ _____________________ (cluster: _____)
2. #_____ _____________________ (cluster: _____)
3. #_____ _____________________ (cluster: _____) [optional]
4. #_____ _____________________ (cluster: _____) [optional]
```

**Cluster constraint check:**
- [ ] No cluster has 3+ methods selected
- [ ] If first from cluster found nothing, rest of cluster skipped

→ **HALT** — Wait for method selection confirmation

---

## 2.3 Execute Selected Methods

**For each selected method, complete this template:**

### Method #___: _____________________

**From methods.csv:**
> [Paste full description from methods.csv]

**WHY SELECTED:** [1 sentence — what signal triggered this choice]

**LOOKING FOR:** [specific thing that would change belief]

**CLAIMS EXAMINED:**
```
1. "[quote from artifact]" (line ___) — [what I tested]
2. "[quote from artifact]" (line ___) — [what I tested]
3. "[quote from artifact]" (line ___) — [what I tested]
```

**FINDINGS:**
```
[ ] CLEAN PASS — No issues found
    → S adjustment: -0.5

[ ] FINDING:
    Description: _____________________
    Quote: "[exact text]"
    Location: line ___ / section ___
    Severity: [ ] CRITICAL (+3) [ ] IMPORTANT (+1) [ ] MINOR (+0.3)
    Pattern match: [ ] Yes: _____ [ ] No
    → S adjustment: +_____
```

**DIRECTION:** [ ] Confirms REJECT [ ] Confirms ACCEPT [ ] Neutral

---

### Update Score After Method

```
S before method #___: _____
Adjustment: _____
S after method #___: _____

Threshold check:
[ ] S ≥ 6 — High evidence for REJECT, but continue to Phase 3
[ ] S ≤ -3 — High evidence for ACCEPT, but continue to Phase 3
[ ] Otherwise — Continue with remaining methods
```

**V2 RULE:** Phase 3 is MANDATORY. Do not exit early from Phase 2.

→ **HALT** — Wait for method execution, then repeat for each selected method

---

## 2.4 Method Agreement Check

After all Phase 2 methods completed:

```
Methods executed in Phase 2:
1. #_____ _____________________ — Direction: _____
2. #_____ _____________________ — Direction: _____
3. #_____ _____________________ — Direction: _____ [if executed]
4. #_____ _____________________ — Direction: _____ [if executed]

Direction summary:
  Confirms REJECT: _____/___ methods
  Confirms ACCEPT: _____/___ methods
  Neutral: _____/___ methods

Agreement assessment:
[ ] Strong agreement (3+ methods same direction)
[ ] Moderate agreement (2 methods same direction)
[ ] Disagreement (methods conflict)
```

---

## 2.5 Consolidate New Findings

**Add all new findings to findings array:**

```yaml
findings:
  # ... existing Phase 1 findings ...
  - id: F[next]
    severity: [CRITICAL/IMPORTANT/MINOR]
    description: "[description]"
    quote: "[exact text]"
    location: "[line/section]"
    pattern: "[pattern_id or null]"
    method: [method_num]
    survived_phase3: null  # Will be set in Phase 3
```

**Confirmation bonuses:**
If a new method confirmed an existing finding from different cluster:
- Add +1 bonus per confirmation
- Note in scoreHistory

---

## 2.6 Update Frontmatter

```yaml
stepsCompleted: [0, 1, 2]
currentStep: 3
currentScore: [updated S]
scoreHistory:
  - step: 1
    # ... existing ...
  - step: 2
    methods: [list of method_ids executed]
    delta: "[calculation details]"
    total: [S]
findings:
  # ... all findings including new ones ...
methodsExecuted:
  # ... existing Tier 1 ...
  - method_id: [X]
    name: "[name]"
    result: [Clean/Finding]
    selected_because: "[signal]"
  # ... more Phase 2 methods ...
```

---

## 2.7 Proceed to Adversarial Validation

**In V2, Phase 3 is MANDATORY.** Regardless of S value, proceed to adversarial review.

**Exception:** Only if Phase 1 triggered early exit with Pattern match (which would have skipped Phase 2 entirely).

**Next step:** Load `step-03-adversarial.md`

**Before loading, verify:**
- [ ] 2-4 methods executed in Phase 2
- [ ] Cluster rules respected
- [ ] All findings have quotes
- [ ] Score updated after each method
- [ ] New findings added to array
- [ ] Frontmatter updated

---

## Output Checklist

- [ ] 2-4 Phase 2 methods executed
- [ ] All new findings recorded with quotes
- [ ] `currentScore` updated
- [ ] `methodsExecuted` includes all Phase 2 methods
- [ ] Method agreement assessed
- [ ] Ready to proceed to Phase 3 (MANDATORY)
