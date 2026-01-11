# Agent Instructions: Deep Verify Workflow Testing

## Your Mission
Test and evolve the Deep Verify workflow by running controlled experiments with trap tasks.

---

## Files to Read (IN ORDER)

### Step 1: Understand the System
```
1. src/core/workflows/deep-verify/testing/test-orchestrator.md
   → Main process definition, all phases explained

2. src/core/workflows/deep-verify/testing/method-matrix.md
   → MANDATORY methods for each action (5-8 methods per action)

3. src/core/workflows/deep-verify/testing/metrics.md
   → How to measure success (formulas, thresholds)

4. src/core/workflows/deep-verify/testing/modification-operators.md
   → How to modify workflow for next iteration
```

### Step 2: Understand the Test Materials
```
5. src/core/workflows/deep-verify/testing/trap-tasks.md
   → 10 trap tasks for agent (T1-T10)

6. src/core/workflows/deep-verify/testing/ground-truth.md
   → Expected errors per task (CONFIDENTIAL - only for evaluation)

7. src/core/methods/methods.csv
   → All available methods (referenced by # number)
```

### Step 3: Understand the Workflow Being Tested
```
8. src/core/workflows/deep-verify/workflow-v6.md
   → The workflow you are testing/improving
```

### Step 4: Where to Log Results
```
9. src/core/workflows/deep-verify/testing/experiment-log.md
   → Template for logging experiments
```

---

## Quick Start Command

Copy this to start:

```
Execute Deep Verify Testing Experiment:

1. Read files in order:
   - test-orchestrator.md (process)
   - method-matrix.md (required methods)
   - metrics.md (measurement)
   - trap-tasks.md (select one task)
   - workflow-v6.md (workflow to test)

2. Select task: T3 (Session Memory Persistence) - good starting point

3. Execute Phase 0 (Pre-Experiment Methods):
   - Apply methods #51, #53, #54, #75, #109, #68
   - Document outputs

4. Execute Phase 1 (Agent Task) - 3 RUNS:
   - Give task to fresh agent (no access to testing/ folder)
   - Record artifact and tokens for each run

5. Execute Phase 2 (Workflow Verification) - 3 RUNS:
   - Run workflow-v6 on each agent artifact
   - Record findings per run

6. Execute Phase 3 (Blind Evaluation):
   - Step 1: Assess findings WITHOUT seeing ground-truth.md
   - Step 2: Predict which errors will be caught
   - Step 3: NOW open ground-truth.md and match
   - Step 4: Classify unexpected findings
   - Step 5: Check for bias

7. Execute Phase 4 (Metrics):
   - Calculate DR, WDS, TE, P, DIS, DQ, CC, OES
   - Calculate variance (RS) across 3 runs
   - Assess stability

8. Execute Phase 5 (Log):
   - Append to experiment-log.md using template

9. Execute Phase 6 (Decide):
   - Check stopping criteria
   - If continue: proceed to Phase 7

10. Execute Phase 7 (Evolve):
    - Analyze missed errors with 5 Whys
    - Select modification operators
    - Create workflow variant
    - Validate with D2 methods
```

---

## Critical Rules

1. **ALWAYS use methods from method-matrix.md** - minimum 5 per action
2. **ALWAYS run 3 times** - variance matters
3. **ALWAYS do blind evaluation** - don't peek at ground-truth before Step 3
4. **NEVER give agent access to testing/ folder** - isolate test subject
5. **ALWAYS log to experiment-log.md** - even failed experiments

---

## If You Get Stuck

| Problem | Solution |
|---------|----------|
| Unstable results (RS < 0.6) | Increase to 5 runs |
| Agent doesn't make expected errors | Task may be too easy - note this |
| Workflow finds unexpected errors | Classify as BONUS_VALID or FALSE_POSITIVE |
| Metrics don't improve | Try different modification operators |
| Not sure which task | Start with T3, then T1, then T5 |

---

## Example Experiment Flow

```
EXP-2024-01-15-001
├── Config: workflow-v6, Task T3, 3 runs
├── Phase 0: Pre-experiment methods documented
├── Phase 1: 3 agent runs (artifacts saved)
├── Phase 2: 3 workflow runs (findings captured)
├── Phase 3: Blind evaluation completed
├── Phase 4: Metrics calculated
│   ├── DR: 58% ± 5% (RS=0.91) STABLE
│   ├── WDS: 52%
│   ├── OES: 48
├── Phase 5: Logged
├── Phase 6: Decision = CONTINUE (DR_critical < 90%)
└── Phase 7: Evolution
    ├── Missed T3-E1 (CONFLICT) → 5 Whys → METHOD_GAP
    ├── Operator: ADD_METHOD(phase:2, method:#148)
    └── New variant: workflow-v6.1
```

---

## Files Summary

| File | Purpose | When to Read |
|------|---------|--------------|
| `test-orchestrator.md` | Process steps | First |
| `method-matrix.md` | Required methods | Before each action |
| `metrics.md` | Formulas | During Phase 4 |
| `modification-operators.md` | How to change workflow | Phase 7 |
| `trap-tasks.md` | Test tasks | Phase 1 |
| `ground-truth.md` | Expected errors | Phase 3 Step 3 ONLY |
| `experiment-log.md` | Results template | Phase 5 |
| `workflow-v6.md` | Workflow to test | Phase 2 |
| `methods.csv` | All methods | Reference |
