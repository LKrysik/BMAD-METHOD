# Deep Verify

Iterative verification of agent output using structured methods under mandatory supervision.

---

name: Deep Verify
description: Verify CONTENT against TASK using CONCERNS, METHODS, and anti-bias supervision

---

## Purpose

Find real issues in CONTENT through systematic verification. Agent is not trusted to be honest — every action is supervised by MAB procedure.

---

## Definitions

| Term | Meaning |
|------|---------|
| **TASK** | Original user request |
| **CONTENT** | What agent produced (code, document, plan) |
| **ENVIRONMENT** | Context — related files, constraints, requirements |
| **CONCERN** | Specific area to verify (e.g., "completeness", "security") |
| **METHOD** | Thinking pattern from methods.csv used to analyze |
| **FINDING** | Issue discovered — Problem (P) or Gap (G) |
| **HALT** | Stop and wait for user response |
| **MAB** | Mandatory Anti-Bias — supervision procedure (see below) |
| **MSE** | Minimum Specificity Evidence — quote ≥30 chars with location |

---

## MAB — Mandatory Anti-Bias Procedure

**When referenced:** Agent MUST execute all 4 methods on the current action.

| # | Method | Agent must answer |
|---|--------|-------------------|
| #51 | Liar's Trap | 3 ways I could deceive here + proof I'm not |
| #52 | Mirror Trap | What would dishonest agent do? How am I different? |
| #53 | Confession | What's the hardest part? Am I focusing on it? |
| #54 | CUI BONO | Who benefits from this decision — AGENT or OUTCOME? |

**Output format:**
```
[MAB]
#51: [3 deception ways] → [proof not doing]
#52: Dishonest: [X] | Mine: [Y] | Diff: [%]
#53: Hardest: [X] | Focus: [evidence]
#54: Benefits: AGENT / OUTCOME
```

**Rule:** If #54 shows AGENT benefit without justification → revise action.

---

## MSE — Minimum Specificity Evidence

Every FINDING must include evidence:
- Quote ≥30 characters (verbatim)
- Location as file:line OR section:element
- For gaps: "MISSING: [what] in [where]"

---

## Severity

| Level | Meaning | Action |
|-------|---------|--------|
| **CRITICAL** | Blocks task or breaks system | Must fix |
| **IMPORTANT** | Significantly affects quality | Should fix |
| **MINOR** | Small issue, low impact | Can defer |

---

## Sanity Suite (MANDATORY)

Every verification MUST include these 5 methods from methods.csv:

| # | Method | Purpose | What to check |
|---|--------|---------|---------------|
| #70 | Scope Integrity | Full scope coverage | Quote TASK verbatim, classify each element |
| #72 | Closure Check | No incomplete markers | Scan for TODO/TBD/PLACEHOLDER |
| #73 | Coherence Check | No contradictions | Find conflicting definitions |
| #74 | Grounding Check | Assumptions validated | List explicit + hidden assumptions |
| #75 | Falsifiability | Failure scenarios | Generate 3 realistic failure scenarios |

**Sanity Suite is NON-NEGOTIABLE.** Agent cannot skip these methods.

---

## Flow

```
INPUTS → MODE → CONCERNS (MAB) → SANITY SUITE (mandatory) → METHODS (MAB) → VERIFY (MAB) → FINDINGS → ACTIONS
```

---

## Start

### Step 0: Confirm Inputs

```
## Deep Verify

**TASK:** [original request]
**CONTENT:** [what was produced]
**ENVIRONMENT:** [context]

Correct?
[Y] Yes
[E] Edit — describe changes
[X] Exit
```

**HALT**

---

### Step 1: Choose Mode

```
## Mode

[A] Auto — full automation, review at end
[G] Guided — control each step
[X] Exit
```

**HALT**

---

### Step 2: Generate CONCERNS

**Action requires MAB.**

Agent analyzes TASK, CONTENT, ENVIRONMENT to identify what needs verification.

**If mode = A:** Auto-generate concerns and proceed.
**If mode = G:** Show menu.

```
## Concerns

[A] Auto — generate concerns automatically
[M] Manual — I will describe concerns
```

**HALT** (G mode only)

Agent generates concerns list:

```
| ID | Concern | Description |
|----|---------|-------------|
| C1 | [name] | [what to verify] |
| C2 | [name] | [what to verify] |
```

**If mode = G:**
```
[+] Add concern — describe what to check
[-] Remove — specify ID
[OK] Accept and continue
[X] Exit
```

**HALT** (G mode only)

---

### Step 2.5: Execute SANITY SUITE

**MANDATORY — cannot be skipped.**

Agent executes all 5 Sanity Suite methods (#70, #72, #73, #74, #75) on CONTENT:

```
## Sanity Suite

### #70 Scope Integrity
**TASK verbatim:** "[exact quote]"
| Element | Status | Evidence |
|---------|--------|----------|
| [X] | ADDRESSED / REDUCED / OMITTED | [loc] |

### #72 Closure Check
| Marker | Location | Context |
|--------|----------|---------|
| TODO | file:line | "[quote]" |

### #73 Coherence Check
| Term | Conflict? | Locations |
|------|-----------|-----------|

### #74 Grounding Check
| Assumption | Type | Validated? |
|------------|------|------------|
| [X] | EXPLICIT / HIDDEN | Y/N |

### #75 Falsifiability
**Failure scenarios:**
1. [scenario]
2. [scenario]
3. [scenario]
```

---

### Step 3: Select METHODS for each CONCERN

**Action requires MAB.**

For each concern, agent selects thinking methods from methods.csv.

**If mode = A:** Auto-select and proceed.
**If mode = G:** Show menu.

```
## Methods

[A] Auto — select methods automatically
[M] Manual — I will describe what methods to use
```

**HALT** (G mode only)

Agent generates methods per concern:

```
| Concern | Method ID | Method Name | Purpose |
|---------|-----------|-------------|---------|
| C1 | #70 | Scope Integrity | Check full scope coverage |
| C1 | #74 | Grounding Check | Find hidden assumptions |
| C2 | #75 | Falsifiability | Find failure scenarios |
```

**If mode = G:**
```
[+] Add method — describe what kind of check
[-] Remove — specify concern + method ID
[OK] Accept and execute
[X] Exit
```

**HALT** (G mode only)

---

### Step 4: Execute Verification

**Each method execution requires MAB.**

For each concern + method combination:

```
## Verify: [Concern] with #[Method]

[MAB]
#51: ...
#52: ...
#53: ...
#54: ...

**Execution:**
[Show actual method execution — questions asked, evidence found]

**Result:** [Finding or OK]
```

---

### Step 5: User Validation (UVS)

Before showing results, user validates ONE finding.

Agent selects finding with highest severity that has evidence.

```
## User Validation

**Finding:** [ID] [Title]
**Evidence:** "[quote]" — [location]

Does this quote exist at this location?
[Y] Yes — continue
[N] No — I will correct
```

**HALT**

If [N]: Agent explains, corrects, repeats UVS.

---

### Step 6: Results

```
## Verification Results

**TASK:** [summary]
**UVS:** [Y/N] — Finding [ID]

### Findings

| ID | Type | Severity | Description | Evidence |
|----|------|----------|-------------|----------|
| F1 | P | CRITICAL | [desc] | "[quote]" — [loc] |
| F2 | G | MINOR | [desc] | MISSING: [what] in [where] |

### Summary

| | CRITICAL | IMPORTANT | MINOR |
|----------|----------|-----------|-------|
| Problems | [N] | [N] | [N] |
| Gaps | [N] | [N] | [N] |

**Status:** RED (critical) / YELLOW (important) / GREEN (minor or none)

### Coverage

**Sanity Suite:**
| Method | Executed | Findings |
|--------|----------|----------|
| #70 Scope Integrity | ✓ | [N] |
| #72 Closure Check | ✓ | [N] |
| #73 Coherence Check | ✓ | [N] |
| #74 Grounding Check | ✓ | [N] |
| #75 Falsifiability | ✓ | [N] |

**Additional Methods:**
| Concern | Methods | Findings |
|---------|---------|----------|
| C1 | #[N] | [N] |

---

## Actions

[F] Fix — apply fixes (specify IDs or "all")
[C] Continue — deeper analysis or new concerns
[R] Reject — mark findings as invalid (specify IDs)
[X] Done — finish verification
```

**HALT**

---

## Action: Fix

```
## Fixing

**[F1]:** [what was fixed]
**Check:** [verification fix is correct]

Results updated.
```

Return to Results.

---

## Action: Continue

```
## Continue

[D] Deeper — more methods on existing findings
[N] New — add new concerns
[M] More — add more methods to existing concerns

Specify what to expand:
```

**HALT**

Execute expansion, return to Results with updated findings.

---

## Action: Reject

```
## Reject Findings

Specify IDs to reject: [user input]

**[F2]:** Rejected — [reason from user]

Results updated.
```

Return to Results.

---

## Action: Done

```
## Verification Complete

**Findings:** [total] (Fixed: [N], Open: [N], Rejected: [N])
**Status:** [RED/GREEN]

### Open Issues

| ID | Type | Severity | Description |
|----|------|----------|-------------|
| ... |

Verification ended.
```

---

## Methods Source

```
{project-root}/src/core/methods/methods.csv
```

Agent reads method by number, executes its pattern, produces output matching its output_pattern.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2025-01-08 | Initial V2 — simplified workflow |
| 2.1 | 2026-01-08 | Added Sanity Suite, IMPORTANT severity, Coverage tracking (MARS recommendations) |
