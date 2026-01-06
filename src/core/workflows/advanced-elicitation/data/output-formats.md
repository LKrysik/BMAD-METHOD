# Output Formats

Core presentation templates for Deep Discover and Deep Verify. Load via [T] option.

---

## Why These 6 Formats

Reduced from 10 formats using Sorites Paradox (which removal destroys the solution?) and Theseus Paradox (does core address core problem?).

**Kept — essential for quality/clarity:**
- Evidence Standards — without grounding, claims are opinions
- Confidence Scale — without calibration, certainty is theater
- Issue Format — core output of verification
- Completeness Matrix — tracks what's covered
- Summary Format — structures final output
- Quality Checklist — prevents common failures

**Removed — not core to output:**
- Risk Presentation → method (#37), not output format
- Stakeholder View → method (#1-4), not output format
- Audit Trail → documentation, not verification output
- Confidence Scoring Formula → simplified into Confidence Scale

---

## Format Selection

```
Select format(s):

[1] Evidence Standards — how to ground claims
[2] Confidence Scale — certainty levels
[3] Issue Format — findings and omissions
[4] Completeness Matrix — coverage tracking (Verify)
[5] Summary Format — output structure
[6] Quality Checklist — pre-output verification
[X] Exit — use default format
```

---

## 1. Evidence Standards

**Purpose:** Every claim must be grounded and verifiable.

### Evidence Levels

| Level | Requirements | Use when |
|-------|--------------|----------|
| **STRONG** | Direct quote + exact location | Findings, critical claims |
| **MODERATE** | Paraphrase + location | Standard observations |
| **WEAK** | Inference without quote | Low-stakes, flagged as uncertain |

### Evidence Template

```markdown
**Evidence:**
- Quote: "[exact text]"
- Location: [file:line] or [section]
- Verifiable by: [how to check]
```

### Example

```markdown
**Evidence:**
- Quote: "All findings must include severity level"
- Location: workflow.md:142
- Verifiable by: Open workflow.md, go to line 142
```

### Anti-Patterns — Do Not Use

| Pattern | Problem |
|---------|---------|
| "It seems..." | No concrete evidence |
| "Generally..." | Vague, unverifiable |
| "Should be..." | Prescription without evidence |
| No location | Cannot be verified |

---

## 2. Confidence Scale

**Purpose:** Calibrate certainty to evidence quality.

### Confidence Levels

| Level | Range | Meaning | Evidence Required |
|-------|-------|---------|-------------------|
| **HIGH** | 80-100% | Strong evidence, verified | Direct quote + location |
| **MODERATE** | 50-79% | Partial evidence, gaps exist | Paraphrase or incomplete context |
| **LOW** | <50% | Inference, minimal evidence | Logic only, flag as uncertain |

### Context Impact on Confidence

| Context Situation | Adjustment |
|-------------------|------------|
| Full context available | No change |
| Partial context | -15% to -25% |
| Context outdated | -20% |
| No context for aspect | Cannot verify — flag as LOW |

### Confidence Template

```markdown
**Confidence:** [HIGH/MODERATE/LOW] ([%])
- Evidence: [what supports this]
- Context: [available/partial/missing]
- Uncertainty: [what could change this]
```

### Example

```markdown
**Confidence:** HIGH (85%)
- Evidence: Direct quote from PRD section 3.2
- Context: Full PRD available, architecture doc missing
- Uncertainty: Architecture decisions may change implementation
```

---

## 3. Issue Format

**Purpose:** Unified structure for findings (wrong) and omissions (missing).

### Issue Types

| Type | Definition |
|------|------------|
| **FINDING** | Something EXISTS but is WRONG |
| **OMISSION** | Something SHOULD EXIST but DOESN'T |

### Severity Levels

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Blocks functionality, security risk, data loss |
| **IMPORTANT** | Degraded function, user confusion, maintenance burden |
| **MINOR** | Cosmetic, optimization, nice-to-have |

### Finding Template

```markdown
**FINDING [F-001]** — [SEVERITY] — Confidence: [LEVEL]

**Problem:** [one sentence: what is wrong]

**Evidence:**
- Quote: "[exact text]"
- Location: [file:line]

**Impact:** [what happens if not fixed]

**Fix:** [specific action]
```

### Finding Example

```markdown
**FINDING [F-001]** — IMPORTANT — Confidence: HIGH (90%)

**Problem:** Function returns null instead of throwing error on invalid input

**Evidence:**
- Quote: "return null; // invalid case"
- Location: src/validator.ts:47

**Impact:** Callers must null-check, silent failures in production

**Fix:** Replace with `throw new ValidationError('Invalid input')`
```

### Omission Template

```markdown
**OMISSION [O-001]** — [SEVERITY] — Confidence: [LEVEL]

**Missing:** [what should exist]

**Expected because:**
- TASK: "[quote from original task]"
- CONTEXT: [what indicates this should exist]

**Impact:** [consequence if not added]

**Add:** [what to add and where]
```

### Omission Example

```markdown
**OMISSION [O-001]** — CRITICAL — Confidence: HIGH (85%)

**Missing:** Error handling for network failures

**Expected because:**
- TASK: "Handle all error cases gracefully"
- CONTEXT: App works offline, network is unreliable

**Impact:** App crashes when network unavailable

**Add:** Try-catch around fetch calls in src/api.ts, show user-friendly error
```

### Running Totals

After each issue, show:
```
Issues: [N] CRITICAL, [N] IMPORTANT, [N] MINOR
```

---

## 4. Completeness Matrix

**Purpose:** Track coverage of task elements. Primary use: Deep Verify.

### Matrix Template

```markdown
## Completeness Matrix

| Element | Source | Status | Evidence |
|---------|--------|--------|----------|
| [element 1] | TASK: "[quote]" | COVERED / PARTIAL / MISSING | [where addressed] |
| [element 2] | TASK: "[quote]" | COVERED / PARTIAL / MISSING | [where addressed] |
| [implied] | Inferred from: [context] | COVERED / PARTIAL / MISSING | [where addressed] |

**Coverage:** [N]/[N] elements ([%])
**Status:** GREEN / YELLOW / RED
```

### Example

```markdown
## Completeness Matrix

| Element | Source | Status | Evidence |
|---------|--------|--------|----------|
| User login | TASK: "Users must authenticate" | COVERED | src/auth/login.ts |
| Password reset | TASK: "Users must authenticate" | PARTIAL | UI exists, email not implemented |
| Session timeout | Inferred from: security requirements | MISSING | Not implemented |

**Coverage:** 1.5/3 elements (50%)
**Status:** RED
```

### Status Criteria

| Status | Criteria |
|--------|----------|
| **GREEN** | >90% covered, no critical missing |
| **YELLOW** | 70-90% covered, or partial on important |
| **RED** | <70% covered, or critical missing |

---

## 5. Summary Format

**Purpose:** Structure final output for clarity.

### Brief Summary (1 paragraph)

```markdown
## Summary

[TOPIC] was [analyzed/verified]. [KEY RESULT in one sentence].
[N] issues found: [N] critical, [N] important, [N] minor.
Confidence: [LEVEL]. [PRIMARY ACTION needed].
```

### Brief Example

```markdown
## Summary

Authentication module was verified. Core login works but password reset incomplete.
3 issues found: 1 critical, 1 important, 1 minor.
Confidence: HIGH. Implement email service before release.
```

### Full Summary (structured)

```markdown
## Summary

**What:** [what was analyzed]
**Result:** [overall outcome]
**Confidence:** [LEVEL] ([%])

**Issues:**

| ID | Type | Severity | Problem | Fix |
|----|------|----------|---------|-----|
| F-001 | FINDING | [level] | [issue] | [fix] |
| O-001 | OMISSION | [level] | [missing] | [add] |

**Coverage:** [%] — [GREEN/YELLOW/RED]

**Gaps Accepted:**
- [conscious gaps user confirmed]

**User Validation:**
- Scope confirmed: [yes/no]
- Findings validated: [yes/no]
- Confidence: [user's rating 1-10]
```

---

## 6. Quality Checklist

**Purpose:** Verify output quality before finalizing.

### Pre-Output Check

```markdown
## Quality Check

**Evidence:**
- [ ] Every finding has direct quote
- [ ] Every quote has location
- [ ] No "it seems" / "generally" / ungrounded claims

**Confidence:**
- [ ] Levels match evidence quality
- [ ] Context gaps acknowledged
- [ ] No false certainty

**Completeness:**
- [ ] All task elements addressed or flagged
- [ ] Omissions explicitly listed
- [ ] Gaps acknowledged, not hidden

**User Validation:**
- [ ] User confirmed scope
- [ ] User validated findings
- [ ] User accepted caveats
```

---

## Format Combinations

When to add formats beyond defaults:

| Situation | Add format | Why |
|-----------|------------|-----|
| Findings disputed | Evidence Standards | Strengthen proof |
| User questions certainty | Confidence Scale | Show calibration |
| Complex multi-part task | Completeness Matrix | Track coverage |
| Handoff to another person | Full Summary | Complete context |
| High-stakes decision | Quality Checklist | Explicit verification |

**Combining rules:**
- Always include Summary Format (Brief or Full)
- Add Evidence Standards when any finding is CRITICAL
- Add Confidence Scale when context is incomplete
- Add Quality Checklist for formal reviews

---

## Process-Specific Defaults

### Deep Discover — Default Output

Use: Confidence Scale + Summary Format (Full) + Quality Checklist

Focus on:
- Knowledge summary (what user truly needs)
- Certainty per element
- Conscious gaps
- User validation record

### Deep Verify — Default Output

Use: Evidence Standards + Issue Format + Completeness Matrix + Summary Format + Quality Checklist

Focus on:
- Findings with evidence
- Omissions with justification
- Coverage tracking
- Verification status (GREEN/YELLOW/RED)
