# Deep Verify V4

Production-ready verification workflow with enhanced Sanity Suite and external validation.

---

name: Deep Verify V4
description: Systematic verification with 6-method Sanity Suite, MAB spot-check, and content-type specific methods

---

## Purpose

Find real issues in CONTENT through systematic verification. V4 addresses gaps identified by 6-agent MARS multilingual testing:

**Key improvements over V3:**
- Extended Sanity Suite: 6 methods (added #71 Alignment Check)
- MAB Spot-Check (MBS): User validates one MAB response
- Content-type specific method recommendations
- Security-enhanced MSE requirements
- Sanity Suite enforcement mechanism

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
| **MBS** | MAB Spot-check — user validates one MAB response |
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

**Expanded output format (on request or for MBS):**
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

## MBS — MAB Spot-Check (NEW in V4)

**Purpose:** External verification that MAB is executed genuinely, not just templated.

**When:** After Step 3 (Sanity Suite), before Step 4 (Additional Methods).

**Procedure:**
1. Agent selects MAB response from Sanity Suite execution
2. User validates that MAB shows genuine reasoning

```
## MAB Spot-Check

**Selected MAB:** [from Sanity Suite method execution]

[MAB - EXPANDED FORMAT]
#51: [full deception analysis]
#52: Dishonest: [X] | Mine: [Y] | Diff: [X%]
#53: Hardest: [X] | Focus: [evidence]
#54: Benefits: [AGENT / OUTCOME with justification]

Does this MAB show genuine anti-bias reasoning?
[Y] Yes — continue
[N] No — agent must redo with deeper analysis
```

**HALT**

If [N]: Agent explains, provides deeper MAB analysis, repeats MBS.

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

### Security-Critical Evidence (NEW in V4)

For code CONTENT, additional requirements:

| Security Concern | Evidence Must Include |
|------------------|----------------------|
| **Input handling** | Data flow: input → processing → output |
| **SQL/Commands** | All string interpolation points identified |
| **Authentication** | All access control points verified |
| **Secrets** | No hardcoded credentials (or flagged) |

```
**Security Evidence:**
- Input source: [where data enters]
- Processing: [how data is used]
- Output: [where data goes]
- Sanitization: [Y/N] — [method if Y]
```

---

## Sanity Suite (MANDATORY) — 6 Methods

Every verification MUST include these 6 methods:

| # | Method | Purpose | What to check |
|---|--------|---------|---------------|
| #70 | Scope Integrity | Full scope coverage | Quote TASK verbatim, classify each element as ADDRESSED/REDUCED/OMITTED |
| #71 | Alignment Check | Goal realization | Quote stated goal, verify EACH part is actually addressed (not just mentioned) |
| #72 | Closure Check | No incomplete markers | Scan for TODO/TBD/PLACEHOLDER, list with line numbers |
| #73 | Coherence Check | No contradictions | Find terms defined differently in 2+ places |
| #74 | Grounding Check | Assumptions validated | List explicit assumptions, mark hidden ones as issues |
| #75 | Falsifiability | Failure scenarios | Generate 3 realistic failure scenarios, identify 3 gaps |

**Sanity Suite is NON-NEGOTIABLE.** Agent cannot skip or abbreviate these methods.

### Enforcement Mechanism (NEW in V4)

Before proceeding to Step 4, agent MUST confirm:

```
## Sanity Suite Checkpoint

| # | Method | Executed? | Findings |
|---|--------|-----------|----------|
| #70 | Scope Integrity | [Y/N] | [count] |
| #71 | Alignment Check | [Y/N] | [count] |
| #72 | Closure Check | [Y/N] | [count] |
| #73 | Coherence Check | [Y/N] | [count] |
| #74 | Grounding Check | [Y/N] | [count] |
| #75 | Falsifiability | [Y/N] | [count] |

**All 6 methods executed?** [Y/N]

If any [N]: STOP — execute missing methods before continuing.
```

---

## Content-Type Specific Methods (NEW in V4)

After Sanity Suite, select additional methods based on CONTENT type:

### For Code Artifacts
| # | Method | Purpose |
|---|--------|---------|
| #17 | Red Team vs Blue Team | Security attack simulation |
| #38 | Chaos Monkey | Edge case stress testing |
| #76 | Camouflage Test | Does code hide in codebase? |
| #83 | Boundary Violation | Security boundary checks |

### For Documents/Specs
| # | Method | Purpose |
|---|--------|---------|
| #62 | Theseus Paradox | Core problem alignment |
| #79 | DNA Inheritance | Inherited patterns |
| #82 | Temporal Consistency | Era-appropriate patterns |

### For Plans/Architecture
| # | Method | Purpose |
|---|--------|---------|
| #34 | Pre-mortem Analysis | Failure prediction |
| #101 | Quantum Superposition | Parallel solution exploration |
| #102 | Cantor's Diagonal | Novel approaches |

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
INPUTS → MODE → CONCERNS (MAB) → SANITY SUITE (6 methods, mandatory)
       → CHECKPOINT → MBS (MAB spot-check) → ADDITIONAL METHODS (MAB)
       → VERIFY (MAB + MSE) → UVS → REPORT → ACTIONS
```

---

## Start

### Step 0: Confirm Inputs

```
## Deep Verify V4

**TASK:** [original request]
**CONTENT:** [what was produced — added/changed/removed]
**CONTENT TYPE:** [Code / Document / Plan]
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

**MANDATORY — cannot be skipped. All 6 methods required.**

Agent executes all 6 Sanity Suite methods on CONTENT:

```
## Sanity Suite Execution

### #70 Scope Integrity
[MAB - compact]

**TASK verbatim:** "[exact quote]"
**Elements:**
| Element | Status | Evidence |
|---------|--------|----------|
| [X] | ADDRESSED / REDUCED / OMITTED | [location] |

### #71 Alignment Check (NEW)
[MAB - compact]

**Stated goal:** "[quote from CONTENT or TASK]"
**Realization check:**
| Goal Part | Addressed? | How | Evidence |
|-----------|------------|-----|----------|
| [X] | Y/N | [mechanism] | [location] |

**Alignment score:** [X]/[Y] parts realized

### #72 Closure Check
[MAB - compact]

**Incomplete markers found:**
| Marker | Location | Context |
|--------|----------|---------|
| TODO | file:line | "[quote]" |

### #73 Coherence Check
[MAB - compact]

**Term conflicts:**
| Term | Definition 1 | Definition 2 | Conflict? |
|------|--------------|--------------|-----------|

### #74 Grounding Check
[MAB - compact]

**Assumptions:**
| Assumption | Type | Validated? | Critical if false? |
|------------|------|------------|-------------------|
| [X] | EXPLICIT / HIDDEN | Y/N | Y/N |

### #75 Falsifiability
[MAB - compact]

**Failure scenarios:**
1. [scenario] — likelihood: [H/M/L] — mitigation: [exists/missing]
2. [scenario] — likelihood: [H/M/L] — mitigation: [exists/missing]
3. [scenario] — likelihood: [H/M/L] — mitigation: [exists/missing]

**Gaps identified:**
1. [underdeveloped area]
2. [missing element]
3. [future-critical weakness]
```

---

### Step 3.5: Sanity Suite Checkpoint

**ENFORCEMENT — agent confirms all 6 methods executed.**

```
## Sanity Suite Checkpoint

| # | Method | Executed? | Findings |
|---|--------|-----------|----------|
| #70 | Scope Integrity | [Y/N] | [count] |
| #71 | Alignment Check | [Y/N] | [count] |
| #72 | Closure Check | [Y/N] | [count] |
| #73 | Coherence Check | [Y/N] | [count] |
| #74 | Grounding Check | [Y/N] | [count] |
| #75 | Falsifiability | [Y/N] | [count] |

**Total findings from Sanity Suite:** [N]

All 6 methods executed? [Y] — proceed / [N] — STOP and complete
```

If any method not executed → STOP, execute missing methods.

---

### Step 3.6: MAB Spot-Check (MBS)

**User validates one MAB response to ensure genuine reasoning.**

Agent selects MAB with most potential for shallow execution (usually #74 Grounding or #75 Falsifiability).

```
## MAB Spot-Check

**Selected:** MAB from #[N] [method name]

[MAB - EXPANDED FORMAT]
**#51 Liar's Trap:**
How could I deceive:
1. [specific way]
2. [specific way]
3. [specific way]
Proof not doing: [specifics for each]

**#52 Mirror Trap:**
Dishonest agent would: [description]
My action: [description]
Difference: [X%]

**#53 Confession:**
Hardest part: [identification]
My focus on it: [proof]

**#54 CUI BONO:**
This decision benefits: [AGENT / OUTCOME]
Justification: [why]

---

Does this MAB show genuine anti-bias reasoning (not templated)?
[Y] Yes — continue
[N] No — redo with deeper analysis
```

**HALT**

If [N]: Agent explains, provides deeper MAB analysis, repeats MBS.

---

### Step 4: Select ADDITIONAL METHODS

**Action requires MAB.**

For each concern, agent selects additional thinking methods based on CONTENT TYPE.

**If mode = A:** Auto-select based on content type and proceed.
**If mode = G:** Show menu.

```
## Additional Methods

**CONTENT TYPE:** [Code / Document / Plan]

**Recommended for this type:**
[Show content-type specific methods table]

[A] Auto — select recommended methods
[M] Manual — I will describe what methods to use
[S] Skip — Sanity Suite is sufficient
```

**HALT** (G mode only)

Agent generates methods per concern:

```
| Concern | Method ID | Method Name | Purpose |
|---------|-----------|-------------|---------|
| C1 | #38 | Chaos Monkey | Stress test edge cases |
| C2 | #17 | Red Team | Security attack simulation |
```

---

### Step 5: Execute Verification

**Each method execution requires MAB.**

For each concern + method combination:

```
## Verify: [Concern] with #[Method]

[MAB - compact]
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

**Security finding (for code):**
```
### [1.03] P-!!! Security: [Title]

**Vulnerability:** [type — SQLi/XSS/etc]
**Where:** [file:line]
**Evidence:** "[VERBATIM QUOTE ≥30 chars]" — [file:line]
**Attack vector:** [how it could be exploited]
**Security Evidence:**
- Input source: [where data enters]
- Processing: [how data is used]
- Sanitization: [Y/N]
**Fix:** [remediation]
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
**CONTENT TYPE:** [Code / Document / Plan]
**UVS:** [Y/N] — Finding [ID]
**MBS:** [Y/N] — MAB from #[N]

---

### Summary

| Type | !!! | !! | ! |
|------|-----|----|----|
| Problems | [N] | [N] | [N] |
| Gaps | [N] | [N] | [N] |
| Security | [N] | [N] | [N] |

**Status:** RED (critical) / YELLOW (important) / GREEN (minor or none)

---

### Coverage

**Sanity Suite (6 methods):**
| Method | Executed | Findings |
|--------|----------|----------|
| #70 Scope Integrity | ✓ | [N] |
| #71 Alignment Check | ✓ | [N] |
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
**Total findings:** [N] (P:[N] G:[N] S:[N])
**Fixed:** [N]
**Open:** [N]
**Rejected:** [N]

### Final Status

| Category | Count |
|----------|-------|
| !!! Critical open | [N] |
| !! Important open | [N] |
| ! Minor open | [N] |

### Sanity Suite Coverage (6 methods)

| Method | Executed | Findings |
|--------|----------|----------|
| #70 Scope Integrity | ✓ | [N] |
| #71 Alignment Check | ✓ | [N] |
| #72 Closure Check | ✓ | [N] |
| #73 Coherence Check | ✓ | [N] |
| #74 Grounding Check | ✓ | [N] |
| #75 Falsifiability | ✓ | [N] |

### External Validations

| Validation | Status | Details |
|------------|--------|---------|
| MBS (MAB Spot-Check) | [Y/N] | #[N] validated |
| UVS (User Validation) | [Y/N] | Finding [ID] |

### All Findings

[complete list with final status: FIXED / OPEN / REJECTED]
```

---

## Quick Reference

### Core Mechanisms

| Mechanism | Purpose | When |
|-----------|---------|------|
| **MAB** | Supervise every action (4 methods) | ALL actions |
| **MBS** | User validates MAB genuineness | After Sanity Suite |
| **MSE** | Prevent vague evidence | Every finding |
| **UVS** | User validates one finding | Before report |
| **Sanity Suite** | Baseline verification rigor (6 methods) | ALWAYS (mandatory) |

### Sanity Suite Methods (6)

| # | Method | Checks |
|---|--------|--------|
| #70 | Scope Integrity | TASK coverage |
| #71 | Alignment Check | Goal realization |
| #72 | Closure Check | Incomplete markers |
| #73 | Coherence Check | Contradictions |
| #74 | Grounding Check | Assumptions |
| #75 | Falsifiability | Failure scenarios |

### Content-Type Methods

| Type | Recommended Methods |
|------|---------------------|
| **Code** | #17, #38, #76, #83 |
| **Document** | #62, #79, #82 |
| **Plan** | #34, #101, #102 |

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
| 4.0 | 2026-01-08 | V4 — Added #71, MBS, content-type methods, security MSE, enforcement |

---

## V4 Improvements Summary

| Issue from MARS Testing | V4 Solution |
|------------------------|-------------|
| Missing #71 Alignment Check | Added to Sanity Suite (now 6 methods) |
| MAB self-attestation trust | Added MBS (MAB Spot-Check) |
| No security-specific methods | Added content-type recommendations |
| MSE lacks security evidence | Added Security Evidence requirements |
| No Sanity Suite enforcement | Added Step 3.5 Checkpoint |

---

## Comparison with Previous Versions

| Feature | V1 | V2 | V3 | V4 |
|---------|----|----|-----|-----|
| Sanity Suite | 5 implicit | Missing | 5 mandatory | **6 mandatory** |
| MAB External Check | No | No | No | **Yes (MBS)** |
| Content-Type Methods | No | No | No | **Yes** |
| Security Evidence | Basic | Basic | Basic | **Enhanced** |
| Enforcement | No | No | Partial | **Full checkpoint** |
| Severity Levels | 4 | 2 | 3 | **3** |
| MAB Format | Verbose | Compact | Compact+Expand | **Compact+Expand** |
| Reject Handler | No | Yes | Yes | **Yes** |
| Coverage Tracking | Yes | No | Yes | **Yes** |
| Bug Detection | 100% | 40% | 92% | **~98%** |
| External Validations | 1 (UVS) | 1 (UVS) | 1 (UVS) | **2 (UVS+MBS)** |
