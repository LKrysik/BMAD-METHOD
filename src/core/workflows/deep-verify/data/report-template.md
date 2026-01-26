# Report Template — Verification Report Structure
# LOAD: step-05-report.md
# PURPOSE: Standardized output format for verification results

---

# LOADING INSTRUCTIONS:
# 1. Load this file at START of step-05
# 2. Fill in each section using data from frontmatter
# 3. All [PLACEHOLDER] fields must be replaced
# 4. Do not remove sections - mark as "N/A" if not applicable

---

```
═══════════════════════════════════════════════════════════════
VERIFICATION REPORT
═══════════════════════════════════════════════════════════════

ARTIFACT: [artifact_name]
DATE: [ISO date]
WORKFLOW VERSION: Deep Verify V2.0

───────────────────────────────────────────────────────────────
VERDICT
───────────────────────────────────────────────────────────────

VERDICT: [REJECT / ACCEPT / UNCERTAIN / ESCALATE]
CONFIDENCE: [HIGH / MEDIUM / LOW]
EVIDENCE SCORE: S = [final_score]
EARLY EXIT: [Yes — Phase X / No — Full process]
PATTERN MATCH: [Yes — pattern_id / No]

───────────────────────────────────────────────────────────────
EXECUTIVE SUMMARY
───────────────────────────────────────────────────────────────

[2-3 sentence summary of verdict rationale]

Key factors:
- [Factor 1]
- [Factor 2]
- [Factor 3]

───────────────────────────────────────────────────────────────
KEY FINDINGS
───────────────────────────────────────────────────────────────

[Repeat for each finding, ordered by severity]

[F1] [SEVERITY] — [Brief description]
     Quote: "[exact text from artifact]"
     Location: [line/section]
     Pattern: [pattern_id or "None"]
     Method: #[method_num] [method_name]
     Survived Phase 3: [Yes / No / N/A]

[F2] [SEVERITY] — [Brief description]
     Quote: "[exact text]"
     Location: [line/section]
     Pattern: [pattern_id or "None"]
     Method: #[method_num] [method_name]
     Survived Phase 3: [Yes / No / N/A]

[Continue for all findings...]

If no findings:
[No CRITICAL or IMPORTANT findings identified]

───────────────────────────────────────────────────────────────
SCORE CALCULATION
───────────────────────────────────────────────────────────────

Phase 1:
  CRITICAL findings: [count] × 3 = [subtotal]
  IMPORTANT findings: [count] × 1 = [subtotal]
  MINOR findings: [count] × 0.3 = [subtotal]
  Clean passes: [count] × -0.5 = [subtotal]
  Pattern bonus: [count] × 1 = [subtotal]
  Phase 1 subtotal: [S1]

Phase 2:
  New findings: [details]
  Confirmations: [details]
  Clean passes: [count] × -0.5 = [subtotal]
  Phase 2 subtotal: [S2]

Phase 3:
  Findings removed: [count] ([total points removed])
  Findings downgraded: [count] ([total adjustment])
  Phase 3 adjustment: [S3_adjustment]

Final Score: S = [S1] + [S2] + [S3_adjustment] = [final]

───────────────────────────────────────────────────────────────
METHODS EXECUTED
───────────────────────────────────────────────────────────────

Phase 0 (Setup):
  □ Stakes Assessment: [LOW / MEDIUM / HIGH]
  □ Initial Assessment: [ProbablySound / Uncertain / ProbablyFlawed / BLIND]
  □ Bias Mode: [Standard / Blind / ForcedAlternative]
  □ Bias Check: [Completed / Skipped]

Phase 1 (Pattern Scan):
  □ #71 First Principles — [Clean / Finding: brief]
  □ #100 Vocabulary Audit — [Clean / Finding: brief]
  □ #17 Abstraction Laddering — [Clean / Finding: brief]
  □ Pattern Library — [No match / Match: pattern_id]

Phase 2 (Targeted Analysis):
  □ #[X] [Name] — [Clean / Finding: brief]
    Selected because: [signal that triggered selection]
  □ #[Y] [Name] — [Clean / Finding: brief]
    Selected because: [signal that triggered selection]
  [Continue for each Phase 2 method...]

Phase 3 (Adversarial Validation):
  □ Devil's Advocate — [X/Y findings examined]
  □ Adversarial Prompts — [X findings weakened]
  □ Steel-man — [All failed / X arguments held]
  □ False Positive Checklist — [X/5 checked]

Phase 4 (Verdict):
  □ Validation Checklist — [All passed / X items unchecked]
  □ Escalation Check — [Not needed / Triggered: reason]

───────────────────────────────────────────────────────────────
ADVERSARIAL REVIEW DETAILS
───────────────────────────────────────────────────────────────

[For each IMPORTANT+ finding that went through Phase 3]

Finding: [F_id] [description]
  □ Alternative Explanation: [answer] — Weakens? [Yes/No]
  □ Hidden Context: [answer] — Weakens? [Yes/No]
  □ Domain Exception: [answer] — Weakens? [Yes/No]
  □ Survivorship Bias: [answer] — Weakens? [Yes/No]
  Result: [X/4 prompts weaken]
  Action: [Keep / Downgrade / Remove]

Steel-man Arguments for [opposite verdict]:
  1. [Argument]: [details]
     Evidence: [details]
     Holds up? [Yes / No]
  2. [Argument]: [details]
     Evidence: [details]
     Holds up? [Yes / No]
  3. [Argument]: [details]
     Evidence: [details]
     Holds up? [Yes / No]

───────────────────────────────────────────────────────────────
NOT CHECKED
───────────────────────────────────────────────────────────────

[List aspects NOT examined with reasons]

- [Aspect 1]: Not examined because [reason]
- [Aspect 2]: Outside scope because [reason]
- [Aspect 3]: Would require [external resource/expertise]

───────────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────────

[Section depends on verdict]

IF REJECT:
  Critical issues to address:
    1. [Action to address F1]
    2. [Action to address F2]

  Before resubmission:
    - [Requirement 1]
    - [Requirement 2]

IF ACCEPT:
  Caveats:
    1. [Any caveats or areas to monitor]
    2. [Residual risks acknowledged]

  Recommended follow-up:
    - [Suggestion 1]
    - [Suggestion 2]

IF UNCERTAIN:
  Unresolved questions:
    1. [Question 1]
    2. [Question 2]

  Additional information needed:
    - [Information 1]
    - [Information 2]

IF ESCALATE:
  Question for human reviewer:
    [Specific question]

  Context for reviewer:
    [Background information]

  What would resolve this:
    [Information or decision needed]

───────────────────────────────────────────────────────────────
PATTERN CANDIDATE NOTE
───────────────────────────────────────────────────────────────

[Include ONLY if: CRITICAL finding survived Phase 3 WITHOUT Pattern Library match]
[Omit entire section if no candidates exist]

Finding [F_id] ([description]) has no Pattern Library match.
Reason this may be a new pattern: [one sentence explanation].
To evaluate: request Phase 6 (Pattern Candidate Evaluation).

───────────────────────────────────────────────────────────────
METADATA
───────────────────────────────────────────────────────────────

Verification started: [timestamp]
Verification completed: [timestamp]
Total methods executed: [count]
Data files loaded: [list]
Early exit: [Yes — reason / No]
Workflow version: Deep Verify V2.0

═══════════════════════════════════════════════════════════════
```

---

# REPORT GENERATION CHECKLIST

Before finalizing report, verify:

□ All [PLACEHOLDER] fields replaced with actual values
□ All quotes are exact (copy-paste from artifact)
□ All line numbers/sections are accurate
□ Score calculation adds up correctly
□ Methods list matches frontmatter.methodsExecuted
□ Findings list matches frontmatter.findings
□ Verdict matches decision-thresholds.yaml rules
□ Confidence level assigned per confidence_levels
□ NOT CHECKED section is honest and complete
□ Recommendations are actionable and specific
