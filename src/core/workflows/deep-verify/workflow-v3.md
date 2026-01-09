# Deep Verify V3

Hybrid verification workflow combining V1's rigor with V2's usability.

---

name: Deep Verify V3
description: Systematic verification with mandatory Sanity Suite and streamlined anti-bias supervision

---

## Purpose

Find real issues in CONTENT through systematic verification. Combines V1's comprehensive method integration with V2's streamlined flow.

**Key improvements over V1/V2:**
- Mandatory Sanity Suite (#70-75) for baseline rigor
- 3-tier severity (CRITICAL/IMPORTANT/MINOR)
- Compact MAB with expand option
- Reject handler from V2
- Coverage tracking from V1

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
| **MAB** | Mandatory Anti-Bias — supervision procedure |
| **MSE** | Minimum Specificity Evidence — quote ≥30 chars with location |
| **UVS** | User Validation Step — user confirms one finding |

---

## MAB — Mandatory Anti-Bias Procedure

**When referenced:** Agent MUST execute all 4 methods on the current action.

| # | Method | Agent must answer |
|---|--------|-------------------|
| #51 | Liar's Trap | 3 ways I could deceive here + proof I'm not |
| #52 | Mirror Trap | What would dishonest agent do? How am I different? |
| #53 | Confession | What's the hardest part? Am I focusing on it? |
| #54 | CUI BONO | Who benefits from this decision — AGENT or OUTCOME? |

**Compact output format (default):**
```
[MAB]
#51: [deceptions] → [proof]
#52: Dishonest: [X] | Mine: [Y] | Diff: [%]
#53: Hardest: [X] | Focus: [evidence]
#54: Benefits: AGENT / OUTCOME
```

**Expanded output format (on request):**
```
## MAB: [action name]

**#51 Liar's Trap:**
How could I deceive: [3 specific ways]
Proof not doing: [specifics for each]

**#52 Mirror Trap:**
Dishonest agent would: [description]
My action: [description]
Difference: [X%]

**#53 Confession:**
Hardest part: [identification]
My focus on it: [proof]

**#54 CUI BONO:**
| Decision | Benefits |
|----------|----------|
| [X] | AGENT / OUTCOME |
```

**Rule:** If #54 shows AGENT benefit without justification → revise action.

---

## MSE — Minimum Specificity Evidence

Every FINDING must include evidence:
- Quote ≥30 characters (verbatim)
- Location as file:line OR section:element
- For gaps: "MISSING: [what] in [where]"

**Self-check before adding Evidence:**
```
□ Quote ≥30 characters?
□ Quote is EXACT (copy-paste from source)?
□ Location is file:line OR section:element?
□ Someone can find this quote in source?
```

---

## Sanity Suite (MANDATORY)

Every verification MUST include these 5 methods:

| # | Method | Purpose | What to check |
|---|--------|---------|---------------|
| #70 | Scope Integrity | Full scope coverage | Quote TASK verbatim, classify each element as ADDRESSED/REDUCED/OMITTED |
| #72 | Closure Check | No incomplete markers | Scan for TODO/TBD/PLACEHOLDER, list with line numbers |
| #73 | Coherence Check | No contradictions | Find terms defined differently in 2+ places |
| #74 | Grounding Check | Assumptions validated | List explicit assumptions, mark hidden ones as issues |
| #75 | Falsifiability | Failure scenarios | Generate 3 realistic failure scenarios, identify 3 gaps |

**Sanity Suite is NON-NEGOTIABLE.** Agent cannot skip or abbreviate these methods.

---

## Severity

| Level | Symbol | Meaning | Action |
|-------|--------|---------|--------|
| **CRITICAL** | `!!!` | Blocks task or breaks system | Must fix before use |
| **IMPORTANT** | `!!` | Significantly affects quality | Should fix |
| **MINOR** | `!` | Small issue, low impact | Can defer |

---

## Flow

```
INPUTS → MODE → CONCERNS (MAB) → SANITY SUITE (mandatory)
       → ADDITIONAL METHODS (MAB) → VERIFY (MAB + MSE)
       → UVS → REPORT → ACTIONS
```

---

## Start

### Step 0: Confirm Inputs

```
## Deep Verify V3

**TASK:** [original request]
**CONTENT:** [what was produced — added/changed/removed]
**ENVIRONMENT:** [context — related files, constraints]

Correct?
[Y] Yes — proceed
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
| ID | Concern | Source | Description |
|----|---------|--------|-------------|
| C1 | [name] | TASK↔CONTENT | [what to verify] |
| C2 | [name] | CONTENT↔ENV | [what to verify] |
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

### Step 3: Execute SANITY SUITE

**MANDATORY — cannot be skipped.**

Agent executes all 5 Sanity Suite methods on CONTENT:

```
## Sanity Suite Execution

### #70 Scope Integrity
**TASK verbatim:** "[exact quote]"
**Elements:**
| Element | Status | Evidence |
|---------|--------|----------|
| [X] | ADDRESSED / REDUCED / OMITTED | [location] |

### #72 Closure Check
**Incomplete markers found:**
| Marker | Location | Context |
|--------|----------|---------|
| TODO | file:line | "[quote]" |

### #73 Coherence Check
**Term conflicts:**
| Term | Definition 1 | Definition 2 | Conflict? |
|------|--------------|--------------|-----------|

### #74 Grounding Check
**Assumptions:**
| Assumption | Type | Validated? |
|------------|------|------------|
| [X] | EXPLICIT / HIDDEN | Y/N |

### #75 Falsifiability
**Failure scenarios:**
1. [scenario] — likelihood: [H/M/L]
2. [scenario] — likelihood: [H/M/L]
3. [scenario] — likelihood: [H/M/L]

**Gaps identified:**
1. [underdeveloped area]
2. [missing element]
3. [future-critical weakness]
```

---

### Step 4: Select ADDITIONAL METHODS

**Action requires MAB.**

For each concern, agent selects additional thinking methods from methods.csv.

**If mode = A:** Auto-select and proceed.
**If mode = G:** Show menu.

```
## Additional Methods

[A] Auto — select methods automatically
[M] Manual — I will describe what methods to use
[S] Skip — Sanity Suite is sufficient
```

**HALT** (G mode only)

Agent generates methods per concern:

```
| Concern | Method ID | Method Name | Purpose |
|---------|-----------|-------------|---------|
| C1 | #38 | Chaos Monkey | Stress test edge cases |
| C2 | #51 | Liar's Trap | Check for self-deception |
```

---

### Step 5: Execute Verification

**Each method execution requires MAB.**

For each concern + method combination:

```
## Verify: [Concern] with #[Method]

[MAB]
#51: [deceptions] → [proof]
#52: Dishonest: [X] | Mine: [Y] | Diff: [%]
#53: Hardest: [X] | Focus: [evidence]
#54: Benefits: AGENT / OUTCOME

**Execution:**
[Show actual method execution — questions asked, evidence found]

**Result:** [Finding or OK]
```

### Finding Format

**Problem found:**
```
### [1.01] P-!!! Problem Title

**What:** [description of problem]
**Where:** [location in CONTENT]
**Evidence:** "[VERBATIM QUOTE ≥30 chars]" — [file:line]
**Impact:** [consequence for TASK or ENVIRONMENT]
**Fix:** [suggested action]
```

**Gap found:**
```
### [1.02] G-!! Gap Title

**Missing:** [what should exist]
**Expected because:** [TASK requires / ENVIRONMENT shows]
**Evidence:** MISSING: [what] in [where should be]
**Impact:** [consequence]
**Add:** [what to add and where]
```

---

### Step 6: User Validation (UVS)

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

If [N]: Agent explains discrepancy, corrects finding, repeats UVS.

---

### Step 7: Results

```
## Verification Results

**TASK:** [summary]
**CONTENT:** [summary]
**UVS:** [Y/N] — Finding [ID]

---

### Summary

| Type | !!! | !! | ! |
|------|-----|----|----|
| Problems | [N] | [N] | [N] |
| Gaps | [N] | [N] | [N] |

**Status:** RED (critical) / YELLOW (important) / GREEN (minor or none)

---

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
| C1 | #[N], #[N] | [N] |

**Not verified:**
| Area | Reason |
|------|--------|
| [X] | [reason] |

---

### Findings

| ID | Type | Sev | Description | Source |
|----|------|-----|-------------|--------|
| 1.01 | P | !!! | [short desc] | Sanity #70 |
| 1.02 | G | !! | [short desc] | C1 #38 |

---

## Actions

[F] Fix — apply fixes (specify IDs or "all")
[D] Deeper — more analysis on specific finding
[N] New — add new concerns
[R] Reject — contest findings (specify IDs + reason)
[X] Done — finish verification
```

**HALT**

---

## Action: Fix

```
## Fixing

**[1.01]:** [what was fixed]
**Check:** [verification fix is correct]

Results updated.
```

Return to Results.

---

## Action: Deeper

```
## Deeper Analysis: [1.01]

**Original finding:** [summary]

### Extended Analysis

**Additional Methods applied:**
- #[N] [name] — [what it checks]

### Results

[detailed analysis following each method's pattern]

### Sub-findings

| ID | Type | Sev | Description |
|----|------|-----|-------------|
| 1.01.1 | [type] | [sev] | [found in deeper analysis] |
```

Return to Results with updated findings.

---

## Action: New

```
## New Concerns

**Previous concerns:**
[list]

**Suggested additions:**
| # | Concern | Source | Why now |
|---|---------|--------|---------|
| C3 | [name] | [source] | [reason] |

[OK] Execute with new concerns
[+] Add more — describe
[X] Cancel
```

**HALT**

Execute new verification, append to Results.

---

## Action: Reject

```
## Reject Findings

Specify IDs to reject: [user input]
Reason: [user provides]

**[F2]:** REJECTED — [reason]
**Counter-evidence:** [if provided]

Results updated.
```

Return to Results.

---

## Action: Done

```
## Verification Complete

**Total iterations:** [N]
**Total findings:** [N] (P:[N] G:[N])
**Fixed:** [N]
**Open:** [N]
**Rejected:** [N]

### Final Status

| Category | Count |
|----------|-------|
| !!! Critical open | [N] |
| !! Important open | [N] |
| ! Minor open | [N] |

### Sanity Suite Coverage

| Method | Pass | Findings |
|--------|------|----------|
| #70 | ✓ | [N] |
| #72 | ✓ | [N] |
| #73 | ✓ | [N] |
| #74 | ✓ | [N] |
| #75 | ✓ | [N] |

### All Findings

[complete list with final status: FIXED / OPEN / REJECTED]
```

---

## Quick Reference

### Core Mechanisms

| Mechanism | Purpose | When |
|-----------|---------|------|
| **MAB** | Supervise every action (4 methods) | ALL actions |
| **MSE** | Prevent vague evidence | Every finding |
| **UVS** | User validates one finding | Before report |
| **Sanity Suite** | Baseline verification rigor | ALWAYS (mandatory) |

### Sanity Suite Methods

| # | Method | Checks |
|---|--------|--------|
| #70 | Scope Integrity | TASK coverage |
| #72 | Closure Check | Incomplete markers |
| #73 | Coherence Check | Contradictions |
| #74 | Grounding Check | Assumptions |
| #75 | Falsifiability | Failure scenarios |

### Severity

| Symbol | Level | Action |
|--------|-------|--------|
| `!!!` | CRITICAL | Must fix |
| `!!` | IMPORTANT | Should fix |
| `!` | MINOR | Can defer |

### Actions

| Action | Purpose |
|--------|---------|
| [F] Fix | Apply corrections |
| [D] Deeper | More analysis on finding |
| [N] New | Add new concerns |
| [R] Reject | Contest findings |
| [X] Done | Finish verification |

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
| 3.0 | 2026-01-08 | Initial V3 — hybrid of V1+V2 based on MARS testing |

---

## Comparison with V1/V2

| Feature | V1 | V2 | V3 |
|---------|----|----|-----|
| Sanity Suite | Integrated | Missing | **Mandatory** |
| Severity Levels | 4 | 2 | **3** |
| MAB Format | Verbose | Compact | **Compact + Expand** |
| Reject Handler | No | Yes | **Yes** |
| Coverage Tracking | Yes | No | **Yes** |
| Deeper Handler | Yes | Merged | **Yes** |
| Lines | 767 | 357 | **~500** |
| Bug Detection | 100% | 40% | **~95%** |
