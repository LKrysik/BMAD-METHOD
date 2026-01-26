---
step: 6
name: "Pattern Candidate Evaluation"
time_estimate: "5-10 minutes"
goal: "Evaluate whether deep-verify findings warrant new pattern-library entries"
requires_completion: [0, 4, 5]
optional: true
trigger: "User requests pattern evaluation after report, OR CRITICAL finding with no pattern match"
next_steps: null
data_dependencies:
  - "data/pattern-update-protocol.yaml"
  - "data/pattern-library.yaml"
---

# Phase 6: Pattern Candidate Evaluation (OPTIONAL)

## When This Phase Activates

This phase is **optional** and runs only when:

1. **User explicitly requests** pattern evaluation after receiving the report
2. **Auto-suggested** when ALL of these conditions are met:
   - CRITICAL finding survived Phase 3
   - No Pattern Library match was found
   - Finding is grounded in a theorem, definition, or regulation (not opinion)

**This phase does NOT activate for:**
- MINOR findings (insufficient impact)
- Findings already covered by existing patterns
- One-off issues unlikely to recur

---

## 6.0 Load Required Data

**Before ANY evaluation, load these files:**

```
1. data/pattern-update-protocol.yaml
   -> Load significance_checklist
   -> Load proposal_template

2. data/pattern-library.yaml
   -> Load to check for existing coverage
```

> **HALT** -- Confirm data files loaded

---

## 6.1 Identify Pattern Candidates

**Review findings from the completed verification:**

```
For each finding with severity >= IMPORTANT that survived Phase 3:

  Finding: [F_id] -- [description]
  Severity: [CRITICAL / IMPORTANT]
  Quote: "[exact text]"
  Method: #[method_id]
  Pattern match: [Yes/No]

  If pattern match = No:
    -> This is a POTENTIAL pattern candidate
    -> Proceed to 6.2 for this finding
```

List candidates:

```
Candidate 1: F___ -- ________________________________
Candidate 2: F___ -- ________________________________
```

---

## 6.2 Existing Pattern Coverage Check

**BEFORE evaluating significance, verify this isn't a detection failure of an existing pattern:**

```
Candidate: F___ -- [description]

Check each existing pattern category:
  □ definitional_contradictions (DC-001 to DC-004): Match? ________
  □ theorem_violations (TV-001 to TV-005): Match? ________
  □ statistical_impossibilities (SI-001 to SI-004): Match? ________
  □ regulatory_contradictions (RC-001 to RC-003): Match? ________
  □ ungrounded_core_concepts (UG-001 to UG-003): Match? ________

If EXISTING pattern covers this with different signal keywords:
  -> DO NOT propose new pattern
  -> Instead, recommend expanding signals of existing pattern
  -> Note: "Existing pattern [ID] covers this case. Suggest adding signals: [keywords]"
  -> STOP here for this candidate.

If no existing pattern covers this:
  -> Proceed to 6.3 Significance Pre-Check
```

> **HALT** -- Complete for each candidate before proceeding

---

## 6.3 Significance Pre-Check

**CRITICAL DISTINCTION: Pattern Library contains IMPOSSIBILITIES, not INCOMPLETENESS.**
- "Missing details about X" = incompleteness -> does NOT qualify
- "X contradicts Y by theorem/definition" = impossibility -> QUALIFIES

**Is this finding an impossibility or incompleteness?**
```
[ ] IMPOSSIBILITY (proceed with questions below)
[ ] INCOMPLETENESS (STOP — not pattern-library material)
```

**For each candidate, answer ALL five questions (all must be YES):**

```
Candidate: F___ -- [description]

[ ] 1. Is this pattern likely to appear in future artifacts (not one-off)?
       Answer: ________________________________
       Reasoning: ________________________________

[ ] 2. Would detecting this pattern early change a verdict direction?
       Answer: ________________________________
       Expected impact: [ ] Would cause REJECT  [ ] Would prevent false ACCEPT
       Impact thought experiment: "Imagine 3 typical artifacts from this domain.
       Would this pattern change the verdict for at least one?"
       Result: ________________________________

[ ] 3. Is this grounded in a theorem, definition, regulation, or statistical proof?
       Answer: ________________________________
       Type: [ ] THEOREM  [ ] DEFINITION  [ ] REGULATION  [ ] STATISTICAL  [ ] HEURISTIC
       If HEURISTIC: Do you have 3+ independent confirmed cases? ________

[ ] 4. Do existing patterns NOT already cover this case?
       Answer: ________________________________
       Nearest existing pattern: ________________________________
       Why it's different: ________________________________

[ ] 5. Can you write signal keywords that won't match valid artifacts?
       Answer: ________________________________
       Proposed signals: ________________________________
       Risk of over-matching: [ ] Low  [ ] Medium  [ ] High

ALL YES? [ ] Yes -> Proceed to 6.4 (Draft Pattern Proposal)
          [ ] No  -> STOP. Finding is valuable but not pattern-library material.
                     Document in report as "potential future pattern" only.
```

> **HALT** -- Complete pre-check for each candidate

---

## 6.4 Draft Pattern Proposal

**For candidates that passed pre-check, fill the proposal template:**

```yaml
proposal:
  proposed_date: "[today ISO]"
  source: "deep-verify"
  source_artifact: "[artifact name from this verification]"
  source_finding_id: "[F_id]"
  status: "PROPOSED"

  pattern:
    id: "[suggest: CATEGORY-NNN]"
    category: "[select category]"
    name: "[descriptive name]"
    type: "[THEOREM | DEFINITION | REGULATION | STATISTICAL | HEURISTIC]"

    signals:
      - "[keyword 1]"
      - "[keyword 2]"

    why_impossible: |
      [explanation]

    theorem: "[if applicable]"
    theorem_source: "[if applicable]"
    exception: "[if applicable]"
    severity: "[CRITICAL | IMPORTANT]"
    detection_methods: ["[NNN_Method.md]"]
    check: "[yes/no verification question]"

    falsified_if: |
      [MANDATORY — what would disprove this pattern?]
```

---

## 6.5 Self-Challenge (Adversarial — Triangular Validation)

**You MUST attempt to break your own proposed pattern.**

Switch to adversarial mode and attempt to construct a counterexample:

```
Pattern claim: [what the pattern says is impossible]

Counterexample attempt:
  "Can I construct a system/situation where BOTH sides coexist validly?"

  Attempt 1: ________________________________
  Result: [ ] Breaks pattern  [ ] Fails (pattern holds)

  Attempt 2: ________________________________
  Result: [ ] Breaks pattern  [ ] Fails (pattern holds)

  If counterexample breaks pattern:
    [ ] Add exception field and refine pattern
    [ ] Abandon pattern — it's not a true impossibility

  If no counterexample possible:
    Explain why: ________________________________
```

---

## 6.6 Signal Specificity Check

**Verify signals won't cause false matches:**

```
Mentally apply signals to 3 types of VALID artifacts:

  Valid artifact 1 (same domain, no issues):
    Would signals match? [ ] Yes (BAD -> refine) [ ] No (GOOD)

  Valid artifact 2 (similar domain, no issues):
    Would signals match? [ ] Yes (BAD -> refine) [ ] No (GOOD)

  Valid artifact 3 (different domain, similar keywords):
    Would signals match? [ ] Yes (BAD -> refine) [ ] No (GOOD)

If ANY match valid artifacts:
  -> Narrow signals or add distinguishing conditions
  -> Re-check after narrowing
```

---

## 6.7 Recommendation

**Based on steps 6.3-6.6 (significance + proposal + challenge + signal test), make a recommendation:**

```
Pattern candidate: [name]

Recommendation:
  [ ] VALIDATED — Add to pattern-library.yaml immediately
      Confidence: [ ] High (theorem/definition based)
                  [ ] Medium (regulation/statistical based)

  [ ] PROVISIONAL — Add with PROVISIONAL status
      Promote to VALIDATED after: 5+ true matches
      Reason for provisional: ________________________________

  [ ] DEFERRED — Promising but needs more evidence
      What's needed: ________________________________

  [ ] REJECTED — Does not meet pattern-library criteria
      Reason: ________________________________
```

---

## 6.8 Output Pattern Candidate Report

**If recommending VALIDATED or PROVISIONAL, output:**

```
═══════════════════════════════════════════════════════════════
PATTERN CANDIDATE REPORT
═══════════════════════════════════════════════════════════════

Source: Deep Verify report for [artifact name]
Finding: [F_id] — [description]
Date: [ISO date]

PROPOSED PATTERN:
  Name: [name]
  Category: [category]
  Type: [type]
  Severity: [severity]

  Signals: [list]
  Why impossible: [explanation]
  Check: [question]
  Falsified if: [condition]
  Exception: [if any]

VERIFICATION:
  Significance check: PASSED (5/5)
  Counterexample: [IMPOSSIBLE / FOUND_WITH_EXCEPTION]
  Signal specificity: [PASSED / REFINED]

RECOMMENDATION: [VALIDATED / PROVISIONAL / DEFERRED / REJECTED]

ACTION REQUIRED:
  [ ] Human review before adding to pattern-library.yaml
  [ ] Add to pattern-library.yaml with status field
  [ ] Track usage in calibration.yaml
═══════════════════════════════════════════════════════════════
```

---

## 6.9 Update Frontmatter

```yaml
stepsCompleted: [0, 1, 2, 3, 4, 5, 6]
currentStep: null  # Complete
pattern_candidates:
  - finding_id: "[F_id]"
    proposed_pattern: "[name]"
    recommendation: "[VALIDATED / PROVISIONAL / DEFERRED / REJECTED]"
    added_to_library: false  # Updated after human review
```

---

## Output Checklist

- [ ] All IMPORTANT+ findings without pattern match evaluated
- [ ] Significance pre-check completed for each candidate
- [ ] Counterexample attempted for each proposed pattern
- [ ] Signal specificity verified
- [ ] Recommendation documented
- [ ] Pattern Candidate Report output (if applicable)
