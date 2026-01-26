---
step: 5
name: "Report"
time_estimate: "5 minutes"
goal: "Generate comprehensive verification report"
requires_completion: [0, 4]
next_steps: null
data_dependencies:
  - "data/report-template.md"
outputs:
  - verification_report
---

# Phase 5: Report Generation

## MANDATORY EXECUTION RULES

1. **LOAD REPORT TEMPLATE FIRST** — Read `data/report-template.md`
2. **Fill ALL sections** — No placeholders in final report
3. **Use exact quotes** — Copy from findings array
4. **Verify calculations** — Score must add up correctly
5. **Be honest about gaps** — NOT CHECKED section must be complete

---

## 5.0 Load Report Template

**Load:** `data/report-template.md`

This template provides the structure for the final report. All `[PLACEHOLDER]` fields must be replaced with actual values from the verification process.

→ **HALT** — Confirm template loaded

---

## 5.1 Gather Report Data

**Collect all data from frontmatter:**

```
From frontmatter:
  artifact: _____________________
  started: _____________________
  stakes: _____________________
  bias_mode: _____________________
  initial_assessment: _____________________

  stepsCompleted: _____________________
  currentScore: _____________________

  verdict: _____________________
  confidence: _____________________
  earlyExit: _____________________
  earlyExitReason: _____________________

  findings: [array]
  patternsMatched: [array]
  methodsExecuted: [array]

  phase3_summary: [object]
  escalation: [object]
```

---

## 5.2 Generate Report

**Fill in the report template:**

```
═══════════════════════════════════════════════════════════════
VERIFICATION REPORT
═══════════════════════════════════════════════════════════════

ARTIFACT: [artifact from frontmatter]
DATE: [current date ISO]
WORKFLOW VERSION: Deep Verify 2.0

───────────────────────────────────────────────────────────────
VERDICT
───────────────────────────────────────────────────────────────

VERDICT: [verdict from frontmatter]
CONFIDENCE: [confidence from frontmatter]
EVIDENCE SCORE: S = [currentScore from frontmatter]
EARLY EXIT: [earlyExit ? "Yes — " + earlyExitReason : "No — Full process"]
PATTERN MATCH: [patternsMatched.length > 0 ? "Yes — " + patterns : "No"]
```

→ Continue filling each section from template...

---

## 5.3 Findings Section

**For each finding in findings array:**

```
[F{id}] [{severity}] — [{description}]
     Quote: "[{quote}]"
     Location: [{location}]
     Pattern: [{pattern || "None"}]
     Method: #{method_id} [{method_name from data/methods.csv}]
     Survived Phase 3: [{survived_phase3 ? "Yes" : "No" : "N/A"}]
```

**Order findings by severity:** CRITICAL first, then IMPORTANT, then MINOR.

---

## 5.4 Methods Section

**List all methods executed per phase:**

```
Phase 0 (Setup):
  □ Stakes Assessment: [{stakes}]
  □ Initial Assessment: [{initial_assessment}]
  □ Bias Mode: [{bias_mode}]
  □ Bias Check: Completed

Phase 1 (Pattern Scan):
  [For each methodsExecuted where step = 1]
  □ #{method_id} {method_name} — [{result}]
  □ Pattern Library — [{patternsMatched.length > 0 ? "Match: " + patterns : "No match"}]

Phase 2 (Targeted Analysis):
  [For each methodsExecuted where step = 2]
  □ #{method_id} {method_name} — [{result}]
    Selected because: [{selected_because}]

Phase 3 (Adversarial Validation):
  □ Devil's Advocate — [{phase3_summary.findings_examined} findings examined]
  □ Adversarial Prompts — [{phase3_summary.findings_weakened || 0} findings weakened]
  □ Steel-man — [{phase3_summary.steel_man_arguments_held}/3 arguments held]
  □ False Positive Checklist — [{phase3_summary.false_positive_checklist || "N/A"}]

Phase 4 (Verdict):
  □ Validation Checklist — [Completed]
  □ Escalation Check — [{escalation.needed ? "Triggered: " + escalation.reason : "Not needed"}]
```

---

## 5.5 Score Calculation Section

**Show complete calculation:**

```
Phase 1:
  CRITICAL findings: [count] × 3 = [subtotal]
  IMPORTANT findings: [count] × 1 = [subtotal]
  MINOR findings: [count] × 0.3 = [subtotal]
  Clean passes: [count] × -0.5 = [subtotal]
  Pattern bonus: [count] × 1 = [subtotal]
  Phase 1 subtotal: [S1]

Phase 2:
  [details from scoreHistory]
  Phase 2 subtotal: [S2]

Phase 3:
  Findings removed: [count] ([points])
  Findings downgraded: [count] ([adjustment])
  Phase 3 adjustment: [S3]

Final Score: S = [S1] + [S2] + [S3] = [final]
```

---

## 5.6 NOT CHECKED Section

**Document what was NOT examined:**

Think about:
- Aspects outside the workflow scope
- Areas requiring external expertise
- Implementation details vs specification
- Performance/scalability (if spec review only)
- Security (if not security-focused)
- Compliance (if not regulatory focus)

```
- [Aspect 1]: Not examined because [reason]
- [Aspect 2]: Outside scope because [reason]
- [Aspect 3]: Would require [external resource/expertise]
```

**Be thorough and honest.** Users need to know limitations.

---

## 5.7 Recommendations Section

**Based on verdict:**

### If REJECT:

```
Critical issues to address:
  1. [Specific action to address F1]
  2. [Specific action to address F2]
  ...

Before resubmission:
  - [Requirement 1]
  - [Requirement 2]
```

### If ACCEPT:

```
Caveats:
  1. [Any caveats or areas to monitor]
  2. [Residual risks acknowledged]

Recommended follow-up:
  - [Suggestion 1]
  - [Suggestion 2]
```

### If UNCERTAIN:

```
Unresolved questions:
  1. [Question 1]
  2. [Question 2]

Additional information needed:
  - [Information 1]
  - [Information 2]
```

### If ESCALATE:

```
Question for human reviewer:
  [Specific question from escalation.question]

Context for reviewer:
  [Background from verification process]

What would resolve this:
  [From escalation.information_needed]
```

---

## 5.8 Report Validation Checklist

**Before finalizing, verify:**

```
□ All [PLACEHOLDER] fields replaced with actual values
□ All quotes are exact (copy-paste from artifact)
□ All line numbers/sections are accurate
□ Score calculation adds up correctly
□ Methods list matches methodsExecuted
□ Findings list matches findings array
□ Verdict matches data/decision-thresholds.yaml rules
□ Confidence level matches conditions
□ NOT CHECKED section is honest and complete
□ Recommendations are actionable and specific
```

→ **HALT** — Wait for validation checklist completion

---

## 5.9 Finalize Report

**Update frontmatter with completion:**

```yaml
stepsCompleted: [0, 1, 2, 3, 4, 5]  # or [0, 1, 4, 5] for early exit
currentStep: null  # Complete
completed: "[current ISO timestamp]"
report_generated: true
```

**Output the complete report** using the filled template.

---

## 5.10 Post-Report Actions

**Depending on verdict:**

| Verdict | Post-Report Action |
|---------|-------------------|
| REJECT | Share findings with artifact owner for revision |
| ACCEPT | Proceed with artifact usage, note caveats |
| UNCERTAIN | Gather additional information, re-verify |
| ESCALATE | Hand off to human reviewer with report |

### Pattern Candidate Check

**After delivering the report, check if a pattern candidate note should be included:**

```
Any CRITICAL finding that survived Phase 3 WITHOUT a Pattern Library match?

[ ] Yes -> Add a QUIET NOTE to the end of the report (passive, not interactive):

    ────────────────────────────────────
    PATTERN CANDIDATE NOTE
    ────────────────────────────────────
    Finding [F_id] ([description]) has no Pattern Library match.
    Reason this may be a new pattern: [one sentence explanation].
    To evaluate: request Phase 6 (Pattern Candidate Evaluation).

    IMPORTANT: This is a passive note, NOT an interactive question.
    Do NOT ask the user if they want to run Phase 6.
    The user reads the note and decides on their own.

    If user later requests Phase 6 -> Load steps/step-06-pattern-candidate.md

[ ] No  -> Workflow complete, no note needed
```

---

## Output Checklist

- [ ] Report template fully populated
- [ ] All sections complete (no placeholders)
- [ ] Validation checklist passed
- [ ] Report output to user
- [ ] Frontmatter marked complete
- [ ] Post-report actions noted

---

## Workflow Complete

The Deep Verify workflow is now complete.

**Report has been generated with:**
- Verdict: [from frontmatter]
- Confidence: [from frontmatter]
- Evidence Score: S = [from frontmatter]

**All data files used:**
- data/methods.csv
- data/pattern-library.yaml
- data/severity-scoring.yaml
- data/method-clusters.yaml
- data/decision-thresholds.yaml
- data/report-template.md
