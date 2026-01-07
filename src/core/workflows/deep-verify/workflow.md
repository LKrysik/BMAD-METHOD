# Deep Verify

Verify that agent's output correctly addresses the task.

---

name: Deep Verify
description: Verification process with Quick and Guided modes

---

## Goal

Check if OUTPUT correctly addresses TASK in given CONTEXT.

**Verification dimensions:**
- **Completeness** — all requirements addressed?
- **Correctness** — no errors in what's present?
- **Coherence** — fits with context/ecosystem?
- **Clarity** — understandable and usable?

Find what's wrong, what's missing, what doesn't fit, what's unclear.

## Method Source

```
{project-root}/_bmad/core/methods/methods.csv
```

---

## Start

### 1. Receive verification request

**Required inputs:**
- **TASK:** What was the original request?
- **OUTPUT:** What did agent produce?
- **CONTEXT:** What ecosystem/project/constraints exist?

If not provided, ask for each.

---

### 2. Choose verification mode

```
## Deep Verify

**Task:** [what was requested]
**Output:** [what was produced]
**Context:** [constraints, ecosystem]

How do you want to verify?

[Q] Quick — I verify automatically, you review results
[G] Guided — We decide together what and how to verify
[X] Exit
```

**HALT:** Wait for user choice.

- If [Q] → Go to QUICK MODE
- If [G] → Go to GUIDED MODE

---

## QUICK MODE

Agent performs all steps automatically, presents results for review.

### Q1. Self-discipline SELECTION

I select 2-3 methods to keep myself honest:

```
**My self-discipline methods:**

| # | Method | Prevents | Applied at |
|---|--------|----------|------------|
| [N] | [name] | [what] | Q4 + Q6 |
| [N] | [name] | [what] | Q4 + Q6 |

I will apply these at checkpoint (Q4) and before concluding (Q6).
```

### Q2. Understand task and output

I break down what I'm verifying:

```
**Task breakdown:**
- Explicit requirements: [list]
- Implied requirements: [list from context]
- Constraints: [list]

**Output breakdown:**
- What's included: [list]
- What addresses which requirement: [mapping]
- Potential gaps: [list]
```

### Q3. Determine what to check

Based on breakdown, I identify what needs verification across all dimensions:

```
**Verification checklist:**

| What to check | Dimension | Risk if wrong |
|---------------|-----------|---------------|
| [requirement coverage] | Completeness | [consequence] |
| [factual accuracy] | Correctness | [consequence] |
| [ecosystem fit] | Coherence | [consequence] |
| [understandability] | Clarity | [consequence] |
```

### Q4. Self-discipline CHECKPOINT

Before execution, I verify my approach:

```
**Self-discipline CHECKPOINT:**

- [ ] Not skipping hard parts
- [ ] Not selecting easy methods
- [ ] Not planning to answer for user

If any unchecked → REVISE before Q5.
```

### Q5. Select verification methods

I match methods to each element:

```
**Verification plan:**

| Check | Method | Looking for |
|-------|--------|-------------|
| [element] | #[N] [name] | [what specifically] |
```

### Q6. Execute verification

For each check, I search and report:

**If issue found:**
```
**FINDING [F-001]** — [SEVERITY] — Confidence: [LEVEL]

**Problem:** [what's wrong]
**Evidence:** "[quote]" — [location]
**Impact:** [consequence]
**Fix:** [action]
```

**If something missing:**
```
**OMISSION [O-001]** — [SEVERITY] — Confidence: [LEVEL]

**Missing:** [what should exist]
**Expected because:** [TASK says / CONTEXT shows]
**Impact:** [consequence]
**Add:** [what and where]
```

**If element passes:**
```
**CLEAR [C-001]:** [element] — verified with #[N], no issues found
```

### Q7. Self-discipline APPLICATION (REQUIRED)

Before concluding, I apply methods from Q1 with **evidence**:

```
**Self-discipline APPLICATION:**

**REQUIRED: Evidence per checkbox** (quote + location: line N, section X, or paragraph Y)

- [ ] Applied #[N]:
  - Result: [what found]
  - Evidence: "[quote]" — [location]

- [ ] "Did I tell user what they wanted to hear?"
  - Answer: [YES/NO]
  - Evidence: [specific example OR "N/A - findings were critical"]

- [ ] "Did I skip hard parts?"
  - Answer: [YES/NO]
  - If YES: [list what + why]
  - If NO: [hardest part addressed: ...]

⛔ Checkbox without evidence = checkbox unchecked
⛔ Cannot proceed if any unchecked
```

**Evidence formats accepted:**
- Line number: `"quote" — line 42`
- Section: `"quote" — section G3`
- Paragraph: `"quote" — para 2 of Results`
- Element: `"quote" — in FINDING F-001`

### Q8. Present results

```
## Verification Results

**Task:** [original request]
**Output:** [what was verified]

**Summary:**
- Findings: [N] CRITICAL, [N] IMPORTANT, [N] MINOR
- Omissions: [N] CRITICAL, [N] IMPORTANT, [N] MINOR
- Clear: [N]

**Issues:**

| ID | Type | Severity | Problem | Fix |
|----|------|----------|---------|-----|
| [id] | [type] | [level] | [issue] | [fix] |

**Verification Status:** GREEN / YELLOW / RED

---

## Your Review

Please check:
1. Did I verify what you expected?
2. Any element I missed?
3. Do findings make sense?
4. Your confidence in this verification (1-10)?

[F] Fix issues — apply suggested fixes
[S] Select fixes — choose which to apply
[M] More verification — verify additional elements
[T] Templates — choose output format
[X] Exit — done
```

**HALT:** Wait for user review and choice.

---

## GUIDED MODE

User and agent decide together at each step.

### G1. Self-discipline

**What we're doing:** Selecting methods that will keep ME (the agent) honest during verification. These prevent shortcuts and self-deception.

```
## Self-Discipline Setup

Before I verify anything, I need methods to check my own work.

I suggest these methods to keep myself honest:

| Method | What it catches |
|--------|-----------------|
| #[N] [name] | [prevents what] |
| #[N] [name] | [catches what] |

[OK] Use these methods
[C] Browse categories to choose different ones
[X] Exit
```

**HALT:** Wait for user choice.

---

### G2. Understand task and output

**What we're doing:** Breaking down the original task and the output into pieces so we know exactly what to check.

```
## Understanding What We're Verifying

I need to break down the task and output into checkable pieces.

[AUTO] Do this automatically — show me results
[MANUAL] Let me guide the breakdown
[X] Exit
```

**HALT:** Wait for user choice.

**If AUTO:** Agent performs breakdown, presents:

```
## Task Breakdown

**Original task:** "[exact words]"

**Requirements I found:**
1. [explicit requirement] — from task
2. [explicit requirement] — from task
3. [implied requirement] — inferred from context
4. [constraint] — from context

## Output Breakdown

**What was produced:** [description]

**Elements in output:**
1. [element] → addresses requirement [N]
2. [element] → addresses requirement [N]
3. [element] → no clear requirement match
4. [requirement N] → NOT addressed in output

## Gaps I See

- [potential issue 1]
- [potential issue 2]

[OK] This breakdown is correct
[A] Add something I missed
[R] Remove something incorrect
[X] Exit
```

**HALT:** Wait for user confirmation.

**If MANUAL:** Agent asks questions:
- "What are the key requirements in this task?"
- "What should the output definitely include?"
- "What constraints apply?"

---

### G3. Decide what to verify

**What we're doing:** Based on the breakdown, deciding which elements to verify across all four dimensions.

```
## What Should I Verify?

Based on breakdown, here's what I think needs checking:

| Element | Dimension | Risk if wrong |
|---------|-----------|---------------|
| [requirement coverage] | Completeness | [consequence] |
| [factual claims] | Correctness | [consequence] |
| [ecosystem fit] | Coherence | [consequence] |
| [understandability] | Clarity | [consequence] |

**Dimensions:**
- Completeness — all requirements addressed?
- Correctness — no errors in what's present?
- Coherence — fits with context/ecosystem?
- Clarity — understandable and usable?

**Priorities:**
1. [highest risk]
2. [second priority]
3. [third priority]

[OK] Verify these elements
[A] Add element to verify
[R] Remove element (not important)
[AUTO] You decide, show me results
[X] Exit
```

**HALT:** Wait for user choice.

---

### G4. Choose verification methods

**What we're doing:** Selecting which methods from methods.csv to use for checking each element.

```
## How Should I Check?

For each element, I'll use specific methods:

| Element | Method | Why this method |
|---------|--------|-----------------|
| [element 1] | #[N] [name] | [matches because] |
| [element 2] | #[N] [name] | [matches because] |

**Anti-gaming methods (I must use):**
| Method | Catches |
|--------|---------|
| #[N] | [what] |

[OK] Use these methods
[A] Add method
[R] Remove method
[AUTO] You decide, proceed with verification
[X] Exit
```

**HALT:** Wait for user choice.

---

### G5. Execute verification

**What we're doing:** Actually checking each element using selected methods, reporting findings.

For each element + method:

```
**Checking:** [element]
**Using:** #[N] [method name]
**Looking for:** [what specifically]
```

Then report result (FINDING / OMISSION / CLEAR) using formats from Q5.

**Running totals after each check:**
```
Progress: [N]/[N] elements checked
Issues: [N] CRITICAL, [N] IMPORTANT, [N] MINOR
```

---

### G6. Self-discipline check

**What we're doing:** Applying the methods from G1 to my own verification work before concluding.

```
## Checking My Own Work

Applying self-discipline methods:

### #[N] [Method name]
[Execute method on own work]
**Result:** [what I found]

### #[N] [Method name]
[Execute method on own work]
**Result:** [what I found]

**Adjustments needed:** [yes/no]
```

If adjustments needed → return to relevant step.

---

### G7. Confirm with user

**What we're doing:** Making sure you agree with the verification results before finalizing.

```
## Verification Complete

**Verified:** [N] elements
**Found:** [N] findings, [N] omissions
**Self-check:** PASSED / CONCERNS

**Questions for you:**

1. Did I verify what you expected?
2. Any element I should have checked but didn't?
3. Do findings make sense?
4. Your confidence in this verification (1-10)?

[Record your answers — this confirms completeness]
```

**HALT:** Wait for user answers.

If user identifies gaps → return to G3 or G4.

---

### G8. Present results

Same format as Q7 (Quick mode results).

---

## Key Principles

- **Two modes:** Quick for efficiency, Guided for control
- **Self-discipline first:** Agent checks itself before checking output
- **User confirms:** Verification is valid when user agrees, not when agent declares
- **Evidence required:** Every finding needs quote + location

---

## Quick Reference

| Mode | When to use |
|------|-------------|
| **Quick** | Trust agent judgment, want fast results |
| **Guided** | Want control over what/how, learning the process |

| Step | Quick | Guided |
|------|-------|--------|
| Self-discipline | Auto | User confirms |
| Breakdown | Auto | Auto or Manual |
| Scope | Auto | User confirms/edits |
| Methods | Auto | User confirms/edits |
| Execution | Auto | Shown per element |
| Self-check | Auto | Shown |
| Confirm | User reviews | User answers questions |
