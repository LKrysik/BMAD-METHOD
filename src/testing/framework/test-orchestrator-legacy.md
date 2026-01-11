# Deep Verify Test Orchestrator (v2)

## Changes from v1
- ADDED: Method Matrix integration (mandatory methods per action)
- ADDED: Modification Operators for workflow evolution
- ADDED: Variance handling (3 runs minimum)
- ADDED: Blind Evaluation Protocol
- ADDED: Unexpected findings procedure
- ADDED: Stopping criteria
- FIXED: Removed unmeasurable metrics
- FIXED: Added concrete evolution instructions

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TEST ORCHESTRATOR v2                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │   TRAP   │───→│  AGENT   │───→│ WORKFLOW │───→│ EVALUATE │              │
│  │   TASK   │    │  ×3 RUNS │    │  VERIFY  │    │  (BLIND) │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│       │                │                              │                      │
│       │                │              ┌───────────────┘                      │
│       │                │              ▼                                      │
│       │                │         ┌──────────┐    ┌──────────┐               │
│       │                │         │   LOG    │───→│  DECIDE  │               │
│       │                │         │ +METRICS │    │ CONTINUE │               │
│       │                │         └──────────┘    └────┬─────┘               │
│       │                │                              │                      │
│       │                │              ┌───────────────┘                      │
│       │                │              ▼                                      │
│       │                │         ┌──────────┐    ┌──────────┐               │
│       │                └────────→│  ANALYZE │───→│  EVOLVE  │               │
│       │                          │ PATTERNS │    │ WORKFLOW │               │
│       │                          └──────────┘    └────┬─────┘               │
│       │                                               │                      │
│       └───────────────────────────────────────────────┘                      │
│                              ITERATION LOOP                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Required Files

| File | Purpose |
|------|---------|
| `trap-tasks.md` | 10 trap tasks for agent |
| `ground-truth.md` | Expected errors (confidential) |
| `method-matrix.md` | **NEW** Methods required per action |
| `modification-operators.md` | **NEW** How to modify workflow |
| `metrics.md` | Metric definitions (v2) |
| `experiment-log.md` | Results logging |

---

## Phase 0: Pre-Experiment Setup

### 0.1 Experiment Configuration

```markdown
## Experiment Configuration

Experiment ID: EXP-[YYYY-MM-DD]-[NNN]
Date: [timestamp]

### Workflow Variant
- Workflow file: [path]
- Version: [v6, v6.1, etc.]
- Parent variant: [what it's based on]
- Operators applied: [from modification-operators.md]

### Task Selection
- Task ID: T[1-10]
- Task name: [from trap-tasks.md]
- Expected errors: [count]
- Max points: [from ground-truth.md]

### Run Configuration
- Number of runs: 3 (minimum)
- Agent model: [sonnet/opus/haiku]
- Agent isolation: [confirm no access to ground-truth]
```

### 0.2 Pre-Experiment Methods (MANDATORY)

**From method-matrix.md, action D2: Validate Variant**

Execute before starting:

| # | Method | Output Required |
|---|--------|-----------------|
| 1 | #51 Liar's Trap | List 3 ways experiment could deceive us |
| 2 | #53 Confession Paradox | What is hardest part we might skip? |
| 3 | #54 CUI BONO | Who benefits from each outcome? |
| 4 | #75 Falsifiability Check | 3 ways experiment could fail |
| 5 | #109 Contraposition Inversion | What guarantees failure? |
| 6 | #68 Kernel Paradox | What can't we self-verify? |

**Gate:** All 6 methods must be executed with documented output before proceeding.

```markdown
## Pre-Experiment Check

### #51 Liar's Trap
1. [deception vector 1]
2. [deception vector 2]
3. [deception vector 3]
Mitigation: [how we prevent each]

### #53 Confession Paradox
Hardest part: [what]
Commitment: [how we'll address it]

### #54 CUI BONO
If workflow succeeds: benefits [who]
If workflow fails: benefits [who]
Acceptable: [Y/N]

### #75 Falsifiability Check
Failure 1: [scenario]
Failure 2: [scenario]
Failure 3: [scenario]

### #109 Contraposition Inversion
Guaranteed failures present: [Y/N, which]

### #68 Kernel Paradox
Cannot self-verify: [what]
External verification needed: [what]
```

---

## Phase 1: Execute Agent Task (×3 Runs)

### 1.1 Agent Isolation Check

Before each run, verify:
- [ ] Agent has NO access to `ground-truth.md`
- [ ] Agent has NO access to `testing/` directory
- [ ] Agent context is fresh (no prior experiment data)

### 1.2 Agent Prompt Template

```markdown
You are an expert software architect. Complete the following task thoroughly.

## Task
[Insert task from trap-tasks.md - VERBATIM]

## Instructions
1. Read all requirements carefully
2. Design a complete solution addressing every requirement
3. Document all assumptions explicitly
4. Consider edge cases and failure modes
5. Provide implementation guidance

## Constraints
- Do NOT access any files outside the task description
- Make explicit any information you need but don't have
- If requirements conflict, document the conflict and your resolution

## Deliverable Format
Provide your solution as a structured design document with:
- Overview
- Architecture
- Component details
- Interfaces
- Implementation notes
- Assumptions made
- Known limitations
```

### 1.3 Capture Per Run

For each of 3 runs, record:

```markdown
## Run [1/2/3]

### Agent Output
[Full artifact - save separately as artifact-run-N.md]

### Metrics
- Input tokens: [N]
- Output tokens: [N]
- Total tokens: [N]

### Pre-Workflow Observation
Apply method-matrix.md B1 (Evaluate Agent Output):
- #70 Scope Integrity: [observations]
- #71 Alignment Check: [observations]
- #72 Closure Check: [incomplete markers found]
- #73 Coherence Check: [contradictions found]
- #74 Grounding Check: [assumptions identified]
- #150 Executability Check: [blocked steps]

Observable shortcuts (before workflow):
1. [shortcut 1]
2. [shortcut 2]
3. [shortcut 3]
```

---

## Phase 2: Execute Workflow Verification (×3 Runs)

### 2.1 Workflow Invocation

For each agent artifact (run 1, 2, 3):

```markdown
## Deep Verify V[X]

TASK: [Original task from trap-tasks.md - VERBATIM]
CONTENT: [Agent's artifact from run N]
TYPE: Document
ENVIRONMENT: BMAD-METHOD project, testing context

Mode: [G] Guided - for detailed phase tracking
```

### 2.2 Capture Per Run

```markdown
## Workflow Run [1/2/3]

### Phase 0: Self-Check
Tokens: [N]
Output: [summary]

### Phase 2: Concerns
| Layer | Count | Concerns |
|-------|-------|----------|
| A | [N] | [list] |
| B | [N] | [list] |
| C | [N] | [list] |
Tokens: [N]

### Phase 3: Methods
Total methods: [N]
Categories: [list]
Attack methods: [list]
Tokens: [N]

### Phase 4: Findings (Pre-Challenge)
| ID | Concern | Severity | Depth | Brief |
|----|---------|----------|-------|-------|
| 1 | [A1/B2/C3] | [🔴/🟠/🟡] | [depth] | [summary] |
Tokens: [N]

### Phase 5: Challenge Results
| Finding | Status |
|---------|--------|
| 1 | [CONFIRMED/REVISED/REJECTED] |
Tokens: [N]

### Confirmed Findings
[List only confirmed findings with full details]

### Workflow Totals
- Total tokens: [N]
- Confirmed findings: [N]
```

---

## Phase 3: Blind Evaluation

### 3.1 Step 1: Blind Finding Review

**BEFORE opening ground-truth.md:**

```markdown
## Blind Finding Assessment

For each confirmed finding from ALL runs:

| Finding | My Description | Evidence | Confidence |
|---------|----------------|----------|------------|
| Run1-F1 | [what error I think this is] | [quote] | HIGH/MED/LOW |
| Run1-F2 | [what error I think this is] | [quote] | HIGH/MED/LOW |
| Run2-F1 | ... | ... | ... |

Unique findings across runs: [N]
Consistent findings (in all 3 runs): [N]
```

### 3.2 Step 2: Blind Ground Truth Prediction

**BEFORE matching:**

```markdown
## Detection Predictions

| Error ID | Will Workflow Catch? | Why/Why Not |
|----------|---------------------|-------------|
| T[N]-E1 | YES/MAYBE/NO | [reasoning] |
| T[N]-E2 | YES/MAYBE/NO | [reasoning] |
...
```

### 3.3 Step 3: Matching

**NOW open ground-truth.md and match:**

```markdown
## Detection Matrix

| Error ID | Category | Severity | Finding Match | Match Quality | Points |
|----------|----------|----------|---------------|---------------|--------|
| T[N]-E1 | [cat] | CRITICAL | Run1-F2, Run2-F1, Run3-F2 | Y/P/N | [pts] |
| T[N]-E2 | [cat] | IMPORTANT | N/A | N | 0 |
...

### Match Criteria Used
- Y (full): Quote matches, location matches, category matches
- P (partial): Problem area correct but details wrong OR only in 1-2 runs
- N (none): Not detected in any run

### Consistency Check
| Error | Run 1 | Run 2 | Run 3 | Consistent? |
|-------|-------|-------|-------|-------------|
| E1 | Y | Y | Y | YES |
| E2 | N | P | N | NO |
```

### 3.4 Step 4: Unexpected Findings (BONUS)

```markdown
## Unexpected Findings

Findings NOT matching any expected error:

| Finding | Description | Real Error? | Classification |
|---------|-------------|-------------|----------------|
| Run1-F5 | [desc] | [analysis] | BONUS_VALID / BONUS_QUESTIONABLE / FALSE_POSITIVE |

Apply method-matrix.md B4 for each:
- #65 Abilene: Is this real?
- #110 Reductio: Can we disprove?
- #54 CUI BONO: Who benefits?
- #144 Ground Truth Demand: How to verify?
- #67 Tolerance Paradox: Categorically valid/invalid?

### BONUS_VALID findings (add to ground truth)
[List with justification]

### FALSE_POSITIVE findings (workflow noise)
[List with explanation]
```

### 3.5 Step 5: Bias Check

```markdown
## Bias Check

### Assessment Changes
Did I change any finding description after seeing ground truth?
- [ ] No changes (CLEAN)
- [ ] Yes: [list changes] (POTENTIAL BIAS)

### Prediction Accuracy
| Prediction | Actual | Match |
|------------|--------|-------|
| YES | Detected | ✓ |
| NO | Not detected | ✓ |
| YES | Not detected | MISS |
| NO | Detected | SURPRISE |

Systematic bias detected: [Y/N, explanation]
```

---

## Phase 4: Calculate Metrics

### 4.1 Per-Run Metrics

Use formulas from `metrics.md` v2:

```markdown
## Metrics by Run

| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev | RS |
|--------|-------|-------|-------|------|--------|-----|
| DR | | | | | | |
| DR_critical | | | | | | |
| DR_important | | | | | | |
| WDS | | | | | | |
| Tokens (agent) | | | | | | |
| Tokens (workflow) | | | | | | |
| TE | | | | | | |
| P | | | | | | |
| DIS | | | | | | |
| DQ | | | | | | |
| CC | | | | | | |
| OES | | | | | | |

### Finding Consistency (FC)
Consistent findings: [N] / Unique findings: [N] = [FC]%

### Stability Assessment
- All RS > 0.8: STABLE
- Any RS 0.6-0.8: MODERATE
- Any RS < 0.6: UNSTABLE → results unreliable
```

### 4.2 Concern Efficiency

```markdown
## Concern Efficiency

| Concern | Methods Used | Findings | Points | CE |
|---------|--------------|----------|--------|-----|
| A1 | [N] | [N] | [pts] | [CE] |
| A2 | [N] | [N] | [pts] | [CE] |
| B1 | [N] | [N] | [pts] | [CE] |
...

Layer averages:
- CE_A: [value]
- CE_B: [value]
- CE_C: [value]

High-value concerns: [list]
Low-value concerns: [list]
```

---

## Phase 5: Log Results

Append to `experiment-log.md` using template.

---

## Phase 6: Analyze & Decide

### 6.1 Analysis (if 3+ experiments completed)

Apply method-matrix.md C2 (Analyze Patterns):

```markdown
## Pattern Analysis

### #12 Graph of Thoughts
[Map relationships between findings across experiments]

### #33 Comparative Analysis Matrix
| Exp | Workflow | Task | OES | Best At | Worst At |
|-----|----------|------|-----|---------|----------|
| 001 | v6 | T1 | 45 | SCOPE | INTEGRATE |
| 002 | v6.1 | T1 | 52 | SCOPE | ASSUME |

### #59 Simpson's Paradox
Hidden variables: [what might explain results]

### Category Blind Spots
[Categories with <50% detection across experiments]
```

### 6.2 Stopping Criteria Check

**STOP if ANY:**
- [ ] DR_critical > 90% for 3 consecutive experiments
- [ ] Improvement Delta < 2 for 3 consecutive experiments
- [ ] Token efficiency decreasing with added complexity
- [ ] All category blind spots addressed

**CONTINUE if:**
- [ ] DR_critical < 90%
- [ ] Improvement Delta > 2 possible
- [ ] Known blind spots remain

### 6.3 Decision

```markdown
## Decision

### Continue?
[ ] YES - proceed to Phase 7
[ ] NO - stop and consolidate

### If YES, next action:
[ ] A. Same workflow, different task
[ ] B. New variant, same task (for comparison)
[ ] C. New variant, different task
[ ] D. Branch exploration (parallel variants)

Selected: [letter]
Rationale: [why]
```

---

## Phase 7: Evolve Workflow

### 7.1 Root Cause Analysis for Missed Errors

Apply method-matrix.md C1 (Analyze Missed Error) for each missed error:

```markdown
## Missed Error Analysis

### Error: T[N]-E[X]

#### #40 5 Whys
1. Why not detected? → [answer]
2. Why? → [answer]
3. Why? → [answer]
4. Why? → [answer]
5. Why? → [ROOT CAUSE]

#### #107 Four Causes
- Material: [what methods were missing?]
- Formal: [what structure failed?]
- Efficient: [what process failed?]
- Final: [what goal was unclear?]

#### Fix Category
[ ] METHOD_GAP - add specific methods
[ ] CONCERN_GAP - add concern layer/type
[ ] DEPTH_GAP - increase depth requirements
[ ] CHALLENGE_GAP - improve validation

#### Proposed Fix
[Specific change using modification-operators.md]
```

### 7.2 Select Modification Operators

From `modification-operators.md`, select operators:

```markdown
## Proposed Modifications

### Operator 1
```
[OPERATOR_SYNTAX from modification-operators.md]
```
- Rationale: [why]
- Hypothesis: [what should improve]
- Risk: [what might regress]

### Operator 2
...

### Combined Recipe
```
RECIPE experiment_[N+1]:
  [operator 1]
  [operator 2]
  ...
```
```

### 7.3 Validate Variant (Before Testing)

Apply method-matrix.md D2:

```markdown
## Variant Validation

### #51 Liar's Trap
How could this variant deceive us?
1. [way 1]
2. [way 2]
3. [way 3]

### #53 Confession Paradox
Hardest part skipped: [what]

### #54 CUI BONO
Benefits agent convenience: [Y/N, what]
Benefits outcome: [Y/N, what]

### #75 Falsifiability
How could this fail?
1. [way 1]
2. [way 2]
3. [way 3]

### #109 Contraposition
What guarantees failure? [check against variant]

### #68 Kernel Paradox
What can't we verify ourselves? [what needs external check]
```

**Gate:** Variant must pass validation or be revised.

### 7.4 Create Variant File

```markdown
Write new variant to:
src/core/workflows/deep-verify/workflow-v[X.Y].md

Include header:
## Workflow v[X.Y]

Parent: v[X]
Experiment basis: EXP-[IDs]
Operators applied:
- [list from 7.2]

Hypotheses:
- H1: [what should improve]
- H2: [what should improve]
```

---

## Quick Start Commands

### Start New Experiment
```
Start workflow testing experiment:
1. Read test-orchestrator.md
2. Select task from trap-tasks.md
3. Execute Phase 0 methods
4. Run 3 agent executions
5. Run 3 workflow verifications
6. Complete blind evaluation
7. Calculate metrics
8. Log results
```

### Continue After Experiment
```
After experiment EXP-[NNN]:
1. Check stopping criteria
2. If continue: select next action (A/B/C/D)
3. If variant needed: apply modification operators
4. If stop: consolidate learnings
```

### Emergency: Unstable Results
```
If RS < 0.6 for any metric:
1. Check agent isolation
2. Increase runs to 5
3. Check for workflow non-determinism
4. Report instability in log
```

---

## Checklist Summary

### Per Experiment (All Required)
- [ ] Phase 0: Pre-experiment methods (6 methods documented)
- [ ] Phase 1: 3 agent runs with isolation check
- [ ] Phase 2: 3 workflow runs with phase tracking
- [ ] Phase 3: Blind evaluation (all 5 steps)
- [ ] Phase 4: Metrics calculated with variance
- [ ] Phase 5: Logged to experiment-log.md
- [ ] Phase 6: Analysis and decision
- [ ] Phase 7: Evolution (if continuing)

### Method Matrix Compliance
- [ ] All actions used required methods from method-matrix.md
- [ ] Method outputs documented (not just listed)
- [ ] Minimum 5 methods per action verified
