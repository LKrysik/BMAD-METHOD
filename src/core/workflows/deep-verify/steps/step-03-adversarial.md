---
step: 3
name: "Adversarial Validation"
time_estimate: "10-15 minutes"
goal: "Attack your own findings to ensure they survive scrutiny"
requires_completion: [0, 1, 2]
next_steps:
  DEFAULT: "steps/step-04-verdict.md"
data_dependencies:
  - "data/methods.csv"
  - "data/severity-scoring.yaml"
outputs:
  - findings (updated with survived_phase3)
  - currentScore (adjusted)
---

# Phase 3: Adversarial Validation

## ⚠️ CRITICAL: THIS PHASE IS MANDATORY

Empirical data shows adversarial review changes verdict direction in **57% of borderline cases**.

**Skip ONLY if:** Early exit triggered in Phase 1 WITH Pattern Library confirmation (which would have bypassed Phase 2 entirely).

---

## MANDATORY EXECUTION RULES

1. **LOAD DATA FILES FIRST** — Read all `data_dependencies` before proceeding
2. **Review ALL IMPORTANT+ findings** — No skipping
3. **Answer ALL FOUR adversarial prompts** — Per finding
4. **Construct steel-man** — For opposite verdict
5. **Complete False Positive Checklist** — Before REJECT
6. **Adjust scores honestly** — Based on what prompts reveal

---

## 3.0 Load Required Data

**Before ANY analysis, load these files:**

```
1. data/method-procedures/063_Challenge_from_Critical_Perspective.md
   → Load for method #63 (Critical Challenge) procedure

2. data/severity-scoring.yaml
   → Load phase3_adjustment_rules section
```

→ **HALT** — Confirm data files loaded

---

## 3.1 Devil's Advocate Prompts

**For EACH finding with severity ≥ IMPORTANT, complete all four prompts:**

### Finding: [F_id] — [description]

**Original severity:** [CRITICAL / IMPORTANT]
**Quote:** "[exact text]"

---

#### □ PROMPT 1: ALTERNATIVE EXPLANATION

> "What if the author meant X instead of Y?"
> "Is there a reading where this is not a problem?"

**Answer:** ________________________________

**Weakens finding?** [ ] Yes [ ] No

**If Yes, explain:** ________________________________

---

#### □ PROMPT 2: HIDDEN CONTEXT

> "What unstated assumption would make this work?"
> "Is there a footnote/appendix that resolves this?"

**Answer:** ________________________________

**Weakens finding?** [ ] Yes [ ] No

**If Yes, explain:** ________________________________

---

#### □ PROMPT 3: DOMAIN EXCEPTION

> "Is there a known exception in this domain?"
> "Do practitioners actually treat this as a problem?"

**Answer:** ________________________________

**Weakens finding?** [ ] Yes [ ] No

**If Yes, explain:** ________________________________

---

#### □ PROMPT 4: SURVIVORSHIP BIAS

> "Am I focusing on this because I found it first?"
> "What would I conclude if I'd read in different order?"

**Answer:** ________________________________

**Weakens finding?** [ ] Yes [ ] No

**If Yes, explain:** ________________________________

---

#### RESULT

```
Prompts that weaken this finding: _____/4

RULE: If ≥2 prompts weaken → downgrade or remove

ACTION:
[ ] Keep severity (0-1 prompts weakened)
[ ] Downgrade severity (2-3 prompts weakened)
    CRITICAL → IMPORTANT: S adjustment = -2
    IMPORTANT → MINOR: S adjustment = -0.7
[ ] Remove finding (all 4 prompts weakened)
    S adjustment = -[original severity points]
```

→ **HALT** — Complete for each IMPORTANT+ finding before proceeding

---

## 3.2 Steel-Man the Artifact

**Construct the strongest possible case for the OPPOSITE of your current leaning:**

```
Current evidence suggests: [ ] REJECT [ ] ACCEPT [ ] UNCERTAIN

Steel-man arguments for [opposite]:
```

### Argument 1:

**Claim:** ________________________________

**Evidence from artifact:** ________________________________

**Holds up under scrutiny?** [ ] Yes [ ] No

**If No, why:** ________________________________

---

### Argument 2:

**Claim:** ________________________________

**Evidence from artifact:** ________________________________

**Holds up under scrutiny?** [ ] Yes [ ] No

**If No, why:** ________________________________

---

### Argument 3:

**Claim:** ________________________________

**Evidence from artifact:** ________________________________

**Holds up under scrutiny?** [ ] Yes [ ] No

**If No, why:** ________________________________

---

### Steel-Man Assessment

```
Arguments that hold up: _____/3

If ANY steel-man argument holds:
→ Reconsider verdict direction
→ Document why you're proceeding anyway if you don't change
```

→ **HALT** — Wait for steel-man construction

---

## 3.3 False Positive Checklist (Before REJECT)

**If current direction is REJECT, verify:**

```
□ Did I search for disconfirming evidence with same rigor as confirming?
  Answer: ________________________________

□ Could a domain expert reasonably disagree with my interpretation?
  Answer: ________________________________

□ Is my finding based on what artifact SAYS vs what it IMPLIES?
  Answer: ________________________________

□ Did I give artifact benefit of the doubt on ambiguous language?
  Answer: ________________________________

□ Would the original author recognize my characterization as fair?
  Answer: ________________________________

Boxes checked: _____/5

RULE: If 2+ boxes unchecked → Return to 3.1 with fresh perspective
```

→ **HALT** — Complete checklist if REJECT direction

---

## 3.4 Reconciliation

**Summarize Phase 3 adjustments:**

```
Original findings count:
  CRITICAL: _____
  IMPORTANT: _____
  MINOR: _____

After adversarial review:
  Findings removed: _____ (total points: _____)
  Findings downgraded: _____ (total adjustment: _____)
  Findings unchanged: _____

Final findings count:
  CRITICAL: _____
  IMPORTANT: _____
  MINOR: _____

Score before Phase 3: _____
Phase 3 adjustments: _____
Score after Phase 3: _____
```

---

## 3.5 Update Findings Array

**For each finding, update `survived_phase3`:**

```yaml
findings:
  - id: F1
    severity: [original or adjusted]
    description: "[description]"
    quote: "[exact text]"
    location: "[line/section]"
    pattern: "[pattern_id or null]"
    method: [method_num]
    survived_phase3: true  # Survived adversarial review
    phase3_notes: "[any notes about why kept/adjusted]"

  - id: F2
    # ... if downgraded, update severity ...
    survived_phase3: true
    phase3_notes: "Downgraded from CRITICAL due to alternative explanation"

  # Removed findings can be kept with flag or deleted
  - id: F3
    survived_phase3: false
    removal_reason: "4/4 adversarial prompts weakened"
```

---

## 3.6 Update Frontmatter

```yaml
stepsCompleted: [0, 1, 2, 3]
currentStep: 4
currentScore: [adjusted S]
scoreHistory:
  - step: 1
    # ... existing ...
  - step: 2
    # ... existing ...
  - step: 3
    action: "adversarial_review"
    findings_examined: [count]
    findings_removed: [count]
    findings_downgraded: [count]
    delta: "[calculation]"
    total: [adjusted S]

phase3_summary:
  adversarial_prompts_applied: true
  steel_man_attempted: true
  steel_man_arguments_held: [count]
  false_positive_checklist: [count]/5 or "N/A"
```

---

## 3.7 Proceed to Verdict

**Next step:** Load `steps/step-04-verdict.md`

**Before loading, verify:**
- [ ] All IMPORTANT+ findings reviewed adversarially
- [ ] All four prompts answered per finding
- [ ] Steel-man constructed for opposite verdict
- [ ] False Positive Checklist completed (if REJECT direction)
- [ ] Score adjusted based on findings
- [ ] Frontmatter updated with Phase 3 summary

---

## Output Checklist

- [ ] All IMPORTANT+ findings have `survived_phase3` set
- [ ] `currentScore` adjusted for any downgrades/removals
- [ ] Steel-man arguments documented
- [ ] False Positive Checklist completed (if applicable)
- [ ] Ready to proceed to final verdict
