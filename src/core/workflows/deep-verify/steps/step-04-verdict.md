---
step: 4
name: "Verdict"
time_estimate: "2 minutes"
goal: "Calculate final score, determine verdict, assess confidence"
requires_completion: [0]
requires_one_of: [[1], [1, 2, 3]]
next_steps:
  DEFAULT: "steps/step-05-report.md"
data_dependencies:
  - "data/decision-thresholds.yaml"
  - "data/severity-scoring.yaml"
outputs:
  - verdict
  - confidence
  - escalation_needed
---

# Phase 4: Verdict

## MANDATORY EXECUTION RULES

1. **LOAD DATA FILES FIRST** — Read all `data_dependencies` before proceeding
2. **Calculate final score accurately** — Use all adjustments
3. **Apply verdict rules consistently** — From data/decision-thresholds.yaml
4. **Validate verdict** — Use appropriate checklist
5. **Assess confidence honestly** — Based on evidence quality
6. **Check escalation criteria** — Before finalizing

---

## 4.0 Load Required Data

**Before verdict determination, load these files:**

```
1. data/decision-thresholds.yaml
   → Load final_verdict_rules
   → Load confidence_levels
   → Load escalation_criteria

2. data/severity-scoring.yaml
   → Reference for score verification
```

→ **HALT** — Confirm data files loaded

---

## 4.1 Final Evidence Score Calculation

**Verify score is correct:**

```
═══════════════════════════════════════════════════════════════
EVIDENCE SCORE CALCULATION
═══════════════════════════════════════════════════════════════

Phase 1 contributions:
  CRITICAL findings: _____ × 3 = _____
  IMPORTANT findings: _____ × 1 = _____
  MINOR findings: _____ × 0.3 = _____
  Clean passes: _____ × -0.5 = _____
  Pattern bonuses: _____ × 1 = _____
  ─────────────────────────────────
  Phase 1 subtotal: _____

Phase 2 contributions (if executed):
  New CRITICAL: _____ × 3 = _____
  New IMPORTANT: _____ × 1 = _____
  New MINOR: _____ × 0.3 = _____
  Confirmations: _____ × 1 = _____
  Clean passes: _____ × -0.5 = _____
  ─────────────────────────────────
  Phase 2 subtotal: _____

Phase 3 adjustments (if executed):
  Findings removed: -_____
  Downgrades (CRITICAL→IMPORTANT): _____ × -2 = _____
  Downgrades (IMPORTANT→MINOR): _____ × -0.7 = _____
  ─────────────────────────────────
  Phase 3 adjustment: _____

═══════════════════════════════════════════════════════════════
FINAL EVIDENCE SCORE: S = _____
═══════════════════════════════════════════════════════════════
```

---

## 4.2 Determine Verdict

**From `data/decision-thresholds.yaml` → `final_verdict_rules`:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  S ≥ 6           → REJECT                                           │
│  S ≤ -3          → ACCEPT                                           │
│  -3 < S < 6      → UNCERTAIN                                        │
└─────────────────────────────────────────────────────────────────────┘

Current S = _____

VERDICT: _______________
```

---

## 4.3 Validate Verdict

**Complete the appropriate checklist:**

### If REJECT:

```
□ At least one CRITICAL finding survived Phase 3
  Finding: _____________________

□ Pattern Library match exists OR Phase 2 confirmation obtained
  Evidence: _____________________

□ False Positive Checklist completed (from Phase 3)
  Result: _____/5 checked

□ Steel-man arguments addressed
  Arguments that held: _____/3

If any unchecked → Document exception:
Exception: _____________________
```

### If ACCEPT:

```
□ All Tier 1 methods passed clean
  Result: [ ] Yes [ ] No (had findings that were resolved)

□ No CRITICAL findings at any phase
  Confirm: _____________________

□ If IMPORTANT findings existed, all were resolved in Phase 3
  Confirm: _____________________

□ Steel-man for REJECT was attempted and failed
  Confirm: _____________________

If any unchecked → Document exception:
Exception: _____________________
```

### If UNCERTAIN:

```
□ Score is genuinely in uncertain range (-3 < S < 6)
  S = _____

□ Escalation criteria checked (see 4.5)

□ Specific uncertainties documented
  1. _____________________
  2. _____________________
```

→ **HALT** — Wait for validation checklist completion

---

## 4.4 Assess Confidence

**From `data/decision-thresholds.yaml` → `confidence_levels`:**

```
Check applicable conditions:

[ ] HIGH confidence
    Conditions:
    - |S| > 10: [ ] Yes (S = _____) [ ] No
    - Methods agree: [ ] Yes [ ] No
    - Adversarial attacks failed: [ ] Yes [ ] No
    All conditions met? [ ] Yes → HIGH confidence

[ ] MEDIUM confidence
    Conditions:
    - 6 ≤ |S| ≤ 10: [ ] Yes (S = _____) [ ] No
    - Most methods agree: [ ] Yes [ ] No
    Met? [ ] Yes → MEDIUM confidence

[ ] LOW confidence
    Conditions:
    - |S| near threshold: [ ] Yes [ ] No
    - Methods disagree: [ ] Yes [ ] No
    - Findings weakened in Phase 3: [ ] Yes [ ] No
    Any condition met? [ ] Yes → LOW confidence

CONFIDENCE: _______________
```

---

## 4.5 Check Escalation Criteria

**From `data/decision-thresholds.yaml` → `escalation_criteria`:**

### Mandatory Escalation (ANY triggers escalation):

```
[ ] UNCERTAIN verdict AND stakes are HIGH
    Stakes: _____ Verdict: _____

[ ] Methods strongly disagree (some REJECT, some ACCEPT)
    Method agreement: _____

[ ] False Positive Checklist has 2+ unchecked items
    Unchecked items: _____
```

### Recommended Escalation (consider if ANY apply):

```
[ ] Findings require domain expertise you lack
    Domain: _____________________

[ ] Novel pattern not in library, uncertain severity
    Pattern: _____________________

[ ] Multiple steel-man arguments hold
    Count: _____/3
```

### Escalation Decision

```
Escalation needed? [ ] Yes [ ] No

If Yes:
  Reason: _____________________

  Specific question for reviewer:
  _____________________

  What information would resolve:
  _____________________
```

---

## 4.6 Update Frontmatter

```yaml
stepsCompleted: [0, 1, 2, 3, 4]  # or [0, 1, 4] for early exit
currentStep: 5
currentScore: [final S]

verdict: [REJECT / ACCEPT / UNCERTAIN / ESCALATE]
confidence: [HIGH / MEDIUM / LOW]
earlyExit: [true/false]
earlyExitReason: [reason or null]

escalation:
  needed: [true/false]
  reason: "[reason or null]"
  question: "[question or null]"
  information_needed: "[info or null]"

validation:
  checklist_completed: true
  exceptions_documented: "[any exceptions]"
```

---

## 4.7 Proceed to Report

**Next step:** Load `steps/step-05-report.md`

**Before loading, verify:**
- [ ] Final score calculated and verified
- [ ] Verdict determined per thresholds
- [ ] Validation checklist completed
- [ ] Confidence level assigned
- [ ] Escalation criteria checked
- [ ] Frontmatter updated

---

## Quick Reference: Verdict Summary

| Condition | Verdict | Action |
|-----------|---------|--------|
| S ≥ 6 | REJECT | Document critical findings |
| S ≤ -3 | ACCEPT | Document clean passes |
| -3 < S < 6 | UNCERTAIN | Document uncertainties, consider escalation |
| Any mandatory escalation | ESCALATE | Hand off to human reviewer |

---

## Output Checklist

- [ ] `verdict` is set (REJECT / ACCEPT / UNCERTAIN / ESCALATE)
- [ ] `confidence` is set (HIGH / MEDIUM / LOW)
- [ ] Validation checklist completed for verdict type
- [ ] Escalation decision made and documented
- [ ] Ready to generate final report
