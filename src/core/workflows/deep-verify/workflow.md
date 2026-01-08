# Deep Verify

Iterative verification of agent output using structured methods.

---

name: Deep Verify
description: Iterative verification with context-derived concerns and methods

---

## Purpose

Improve CONTENT quality through systematic verification of concerns derived from TASK and ENVIRONMENT.

Each iteration can:
- Find new issues
- Deepen analysis of found issues
- Expand verification scope
- Apply different thinking methods

---

## Thinking Methods

This workflow uses **Thinking Methods** — structured reasoning patterns that guide how agent analyzes and verifies.

Each method:
- Has a specific **pattern** agent must follow
- Forces **deeper analysis** than intuitive response
- Produces **concrete output** (not vague statements)

**Source:**
```
{project-root}/_bmad/core/methods/methods.csv
```

### How Agent Uses Thinking Methods

1. **Read** the method from source — find the method by number, read its `description` and `output_pattern`
2. **Understand** what the method asks — each method has specific questions or steps
3. **Execute** the pattern on current context — answer the questions, follow the steps
4. **Produce output** matching the method's pattern — not generic statements

**Example:**
```
Method #70 Scope Integrity says:
"Verify artifact addresses FULL scope of ORIGINAL task. Quote original task verbatim..."

Agent MUST:
1. Quote the original TASK verbatim
2. List EACH element from TASK
3. Classify each as ADDRESSED / REDUCED / OMITTED
4. Show the classification with evidence
```

Agent cannot say "Applied #70, looks good" — must show the actual execution with output.

---

## Core Mechanisms

Deep Verify uses two core mechanisms: MAB (supervision) and MSE (evidence quality).

### Mandatory Anti-Bias (MAB)

**Purpose:** Supervise EVERY agent action through structured self-examination.

**Principle:** Agent cannot be trusted to make honest choices. MAB forces agent to examine how it could deceive and prove it's not doing so.

**ALL FOUR methods are MANDATORY at each action point:**

| # | Method | Question | Required output |
|---|--------|----------|-----------------|
| #51 | Liar's Trap | How could I deceive in this action? | 3 ways + proof not doing |
| #52 | Mirror Trap | What would dishonest agent do? | Comparison + difference % |
| #53 | Confession | What's the hardest part? | Identification + focus proof |
| #54 | CUI BONO | Who benefits from this decision? | AGENT / USER / OUTCOME |

**When to apply MAB:**
- Selecting concerns
- Selecting verification methods
- Executing each method
- Creating each finding
- Before final report

**Output format:**
```
## MAB: [action name]

**#51 Liar's Trap:**
How could I deceive: [3 ways]
Proof not doing: [specifics]

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
| [X] | AGENT / USER / OUTCOME |
```

**Note:** MAB replaces the previous OAP mechanism. Mirror Trap (#52) achieves the same externalization of perspective ("what would another agent do") while adding three more verification layers.

---

### Minimum Specificity Evidence (MSE)

**Purpose:** Prevent vague or fabricated evidence in findings.

**Requirements for Evidence field:**

| Requirement | Minimum | Example good | Example bad |
|-------------|---------|--------------|-------------|
| Quote length | ≥30 characters | "if (user.role === 'admin') return true" | "admin check" |
| Location | file:line OR section:element | `auth.ts:47` | "somewhere" |
| Verbatim | 100% exact | exactly as in source | paraphrase |

**Format:**
```
**Evidence:** "[VERBATIM_QUOTE ≥30 chars]" — [LOCATION]
```

**Agent self-check before adding Evidence:**
```
□ Quote ≥30 characters?
□ Quote is EXACT (copy-paste from source)?
□ Location is file:line OR section:element?
□ Someone can find this quote in source?
```

**Exceptions:**

| Situation | Allowed | Format |
|-----------|---------|--------|
| Gap (missing) | Describe what's missing + where should be | "MISSING: [what] in [where]" |
| Pattern in many places | One full quote + count | "[quote]" — and 7 similar |
| Long context | Quote with [...] | "start [...] end" — file:lines |

---

### User Validation Step (UVS)

**Purpose:** User confirms ONE finding has real Evidence. This breaks information asymmetry.

**When:** ALWAYS before final report (both modes).

**Procedure:**

Agent selects finding with highest severity that has Evidence.

```
## User Validation

**Finding:** [ID] [Title]
**Evidence:** "[quote]" — [file:line]

Does this quote exist at this location?
[Y] Yes — continue
[N] No — agent explains and corrects
```

**HALT** — wait for user.

If [N]: Agent explains discrepancy, corrects finding, repeats UVS.

---

## Terminology

**Concern** — A specific area requiring verification, derived from analyzing TASK, CONTENT, and ENVIRONMENT. Agent identifies concerns relevant to the specific case — not limited to predefined list.

**HALT** — Instruction for agent to stop and wait for user response. Agent presents options and waits — does not proceed until user responds.

### Example Concern Areas

These are common areas — agent should identify others as context requires:

| Area | Typical concerns within |
|------|------------------------|
| **Completeness** | Requirements coverage, missing elements, scope gaps |
| **Correctness** | Logic errors, factual errors, wrong values |
| **Consistency** | Internal contradictions, naming conflicts, style mismatches |
| **Coherence** | Logical flow, structural fit, narrative sense |
| **Clarity** | Understandability, ambiguity, documentation |
| **Integration** | Environment fit, interface compatibility, dependency safety |
| **Constraints** | Rule compliance, security, performance |

Agent generates concerns specific to THIS verification — may include areas not in examples above.

---

## Required Inputs

Before verification, establish:

| Input | Description | Example |
|-------|-------------|---------|
| **TASK** | Original user request | "Add authentication to API endpoints" |
| **CONTENT** | What agent produced (added/changed/removed) | New auth middleware, modified routes |
| **ENVIRONMENT** | Surrounding context (related code, docs, constraints) | Existing codebase, security requirements |

If any input missing → ask user to provide.

---

## Severity Levels

| Level | Symbol | Meaning | Action |
|-------|--------|---------|--------|
| **CRITICAL** | `!!!` | Blocks TASK completion or breaks ENVIRONMENT | Must fix before use |
| **IMPORTANT** | `!!` | Significantly affects quality | Should fix |
| **MINOR** | `!` | Small issue, low impact | Can defer |
| **INFO** | `i` | Observation, not a problem | For awareness |

---

## Finding Types

| Type | Code | Description |
|------|------|-------------|
| **Problem** | `P` | Something wrong in CONTENT |
| **Gap** | `G` | Something missing that should exist |

**Note:** Previous "V Verified OK" type removed — it allowed agent to close items without depth. If something is verified, it simply has no finding.

---

## Start

### Step 1: Confirm Inputs

```
## Deep Verify

**TASK:** [original request]
**CONTENT:** [what was produced — added/changed/removed]
**ENVIRONMENT:** [context — related code, docs, constraints]

Is this correct?

[Y] Yes, proceed — start verification with these inputs
[E] Edit inputs — tell me what to change (in your own words)
[X] Exit — cancel verification
```

**HALT** — Wait for user response.

---

### Step 2: Choose Mode

```
## Verification Mode

[A] Auto — I do everything, you review final report
[S] Supervised — I prepare plan, you can modify before I execute
[X] Exit — cancel verification
```

**HALT** — Wait for user response.

---

## Phase 1: Analyze & Plan

Agent analyzes context and prepares verification plan. **Use MAB to verify this action.**

### Step 1: Context Analysis

Use Thinking Methods to extract key elements:
- #70 Scope Integrity — elements in TASK
- #74 Grounding Check — assumptions in CONTENT
- #119 Assumption Archaeology — inherited assumptions from ENVIRONMENT

```
### Context

**TASK elements:** [list]
**CONTENT changes:** added: [...], changed: [...], removed: [...]
**ENVIRONMENT constraints:** [list]
**Risk areas:** [where TASK↔CONTENT↔ENV may conflict]
```

### Step 2: Select Concerns and Methods

For each risk area, define concern and select verification methods.

**Apply MAB to this selection:**
```
## MAB: Selecting concerns and methods

**#51 Liar's Trap:**
How could I select easy concerns: [3 ways]
Proof not doing: [specifics]

**#52 Mirror Trap:**
Dishonest agent would select: [easy concerns]
I select: [hard concerns]
Difference: [X%]

**#53 Confession:**
Hardest concern to verify: [identification]
My focus on it: [proof]

**#54 CUI BONO:**
| Concern selected | Benefits |
|------------------|----------|
| [X] | AGENT / USER / OUTCOME |
```

**Output:**
```
### Verification Plan

| # | Concern | What to verify | Source | Methods |
|---|---------|----------------|--------|---------|
| 1 | [name] | [check] | TASK↔CONTENT | #[N], #[N] |
| 2 | [name] | [check] | CONTENT↔ENV | #[N] |
```

---

## Phase 1 Checkpoint

### Auto Mode
→ Proceed to Phase 2 execution.

### Supervised Mode

```
## Verification Plan

### Concerns

| # | Concern | Source | Thinking Methods |
|---|---------|--------|------------------|
| 1 | [name] | [source] | #[N] [name], #[N] [name] |
| 2 | [name] | [source] | #[N] [name] |

### Actions

[OK] Approve and execute (recommended if plan looks complete)
[+] Add concern — describe in your own words what else to check
[−] Remove concern — specify number
[M] Modify thinking methods for concern
[?] Search — describe in your own words what you're looking for
[X] Exit
```

**HALT** — Wait for user response.

After modifications → show updated plan.
After [OK] → proceed to Phase 2.

---

## Phase 2: Execute Verification

For each concern, apply assigned thinking methods.

**Important:** Agent must show actual method execution, not just claim it was done. See "How Agent Uses Thinking Methods" section.

### Execution Format

```
**Concern:** [name]
**Thinking Method:** #[N] [method name]
**Target:** [what specifically checking]

**Method execution:**
[Show actual execution: questions asked, steps followed, evidence found]
[Must match the method's output_pattern from source]

**Result:** [finding or verified OK]
```

### Finding Format

Each finding gets unique ID: `[iteration].[sequence]` (e.g., `1.01`, `1.02`, `2.01`)

**IMPORTANT: All Evidence fields MUST follow MSE (Minimum Specificity Evidence) requirements:**
- Quote ≥30 characters (verbatim from source)
- Location as file:line OR section:element
- Self-check before adding: "Can someone find this exact quote?"

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

**Use MAB when creating each finding.**

---

## Phase 2.5: User Validation (UVS)

Before report, user validates ONE finding. Agent selects finding with highest severity that has Evidence.

```
## User Validation

**Finding:** [ID] [Title]
**Evidence:** "[quote]" — [file:line]

Does this quote exist at this location?
[Y] Yes — continue to report
[N] No — agent explains and corrects
```

**HALT** — wait for user.

If [N]: Agent explains discrepancy, corrects finding, repeats UVS.

---

## Phase 3: Report

### Report Format

```
## Verification Report

**Iteration:** [N]
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

### Verification Scope

**Verified areas:**

| Concern | Coverage | Notes |
|---------|----------|-------|
| [name] | Full | All aspects checked |
| [name] | Partial | [what checked], [what skipped] |

**Not verified:**

| Area | Source | Reason |
|------|--------|--------|
| [area] | TASK | Out of scope for this iteration |
| [area] | CONTENT | Requires access to [X] |
| [area] | ENV | Deferred — low risk |

**Coverage assessment:**
- TASK requirements: [X]/[Y] addressed
- CONTENT elements: [X]/[Y] checked
- Recommended next: [suggestion or "None — sufficient coverage"]

---

### Findings

| ID | Type | Sev | Description | Concern |
|----|------|-----|-------------|---------|
| 1.01 | P | !!! | [short desc] | [concern] |
| 1.02 | G | !! | [short desc] | [concern] |
| 1.03 | Q | — | [short desc] | [concern] |

---

### Concerns Verified

| # | Concern | Source | Thinking Methods | Findings |
|---|---------|--------|------------------|----------|
| 1 | [name] | [source] | #[N] [name], #[N] [name] | 1.01, 1.03 |
| 2 | [name] | [source] | #[N] [name] | V |

---

## What's Next?

Based on status:
- **RED/YELLOW:** Consider [F] Fix to address issues, or [D] Deeper to investigate
- **GREEN:** Consider [X] Done, or [N] New to check other areas

### Actions

[F] Fix — apply fixes (specify IDs or "all")
[D] Deeper — analyze finding in more depth (specify ID)
[N] New — run new iteration with different concerns
[M] More — expand thinking methods for current concerns
[?] Search — describe in your own words what you're looking for
[X] Done — finish verification
```

**HALT** — Wait for user response.

---

## Action Handlers

### [F] Fix

Apply fixes for specified findings.

```
## Applying Fixes

**[1.01]:** [what was fixed]
**Verification:** [quick check if fix is correct]

**[1.02]:** [what was fixed]
**Verification:** [quick check if fix is correct]

---

Report updated. Returning to actions.
```

→ Update report: mark fixed findings.
→ Return to report.

---

### [D] Deeper [ID]

Deeper analysis of specific finding.

```
## Deeper Analysis: [1.01]

**Original finding:** [summary]

### Extended Analysis

**Additional Thinking Methods applied:**
- #[N] [name] — [what it checks]
- #[N] [name] — [what it checks]

### Results

[detailed analysis following each method's pattern]

### Sub-findings

| ID | Type | Sev | Description |
|----|------|-----|-------------|
| 1.01.1 | [type] | [sev] | [found in deeper analysis] |
| 1.01.2 | [type] | [sev] | [found in deeper analysis] |

---

Report updated. Returning to actions.
```

→ Add sub-findings to report.
→ Return to report.

---

### [N] New Concerns

Start new iteration with different concerns.

```
## New Iteration

**Previous iteration verified:**
[list of concerns from previous]

**Suggested new concerns:**

| # | Concern | Source | Why now |
|---|---------|--------|---------|
| 1 | [name] | [source] | [not checked before / suggested by finding X] |
| 2 | [name] | [source] | [reason] |

[OK] Execute with these concerns
[+] Add concern — describe in your own words
[−] Remove concern — specify number
[?] Search — describe what you're looking for
```

**HALT** — Wait for user response.

→ Execute new iteration.
→ Append findings to report with new iteration number.

---

### [M] More Depth

Expand thinking methods for existing concerns.

```
## Expand Thinking Methods

**Current methods per concern:**

| Concern | Current | Suggested additions |
|---------|---------|---------------------|
| [name] | #[N] [name] | #[N] [name] — [what it adds] |
| [name] | #[N] [name], #[N] [name] | #[N] [name] — [what it adds] |

[OK] Add suggested and execute
[+] Add specific thinking method — describe what kind of check you need
[?] Search — describe what you're looking for
```

**HALT** — Wait for user response.

→ Execute with expanded methods.
→ Update report with new findings.

---

### [?] Search

Find concern or thinking method by description.

```
## Search

Describe what you want to verify or how:

> [user input]

**Matches found:**

**Concerns:**
| Name | Verifies |
|------|----------|
| [name] | [description] |

**Thinking Methods:**
| # | Name | Category | What it does |
|---|------|----------|--------------|
| [N] | [name] | [cat] | [description] |

[A] Add to plan — specify what
[X] Cancel search
```

**HALT** — Wait for user response.

---

### [X] Done

Finalize verification.

```
## Verification Complete

**Total iterations:** [N]
**Total findings:** [N] (P:[N] G:[N] Q:[N])
**Fixed:** [N]
**Open:** [N]

### Final Status

| Category | Count |
|----------|-------|
| !!! Critical open | [N] |
| !! Important open | [N] |
| ! Minor open | [N] |
| Questions pending | [N] |

### All Findings

[complete list with final status: FIXED / OPEN / ACCEPTED]

### Verified Concerns (all iterations)

[complete list]
```

---

## Quick Reference

### Core Mechanisms

| Mechanism | Purpose | When |
|-----------|---------|------|
| **MAB** | Supervise every action (4 methods mandatory) | ALL actions |
| **MSE** | Prevent vague evidence | Every finding |
| **UVS** | User validates one finding | Before report |

### MAB Methods (all mandatory at each action)

| # | Method | Question |
|---|--------|----------|
| #51 | Liar's Trap | How could I deceive? |
| #52 | Mirror Trap | What would dishonest agent do? |
| #53 | Confession | What's the hardest part? |
| #54 | CUI BONO | Who benefits? |

### Modes

| Mode | When to use | HALTs |
|------|-------------|-------|
| **Auto** | Quick results | 2 (UVS + report) |
| **Supervised** | Control plan | 3 (plan + UVS + report) |

### Process Flow

```
Inputs → Mode → Phase 1 (MAB) → Checkpoint → Phase 2 (MAB + MSE)
→ UVS → Report → Actions
```

### Actions

| Action | Purpose | When to use |
|--------|---------|-------------|
| [F] Fix | Apply corrections | When ready to fix issues |
| [D] Deeper | More analysis | Complex finding needs investigation |
| [N] New | Different concerns | Want to check other areas |
| [M] More | More thinking methods | Want deeper coverage of same concerns |
| [?] Search | Find by description | Don't know exact concern/method name |
| [X] Done | Finish | Verification complete |

### Finding IDs

Format: `[iteration].[sequence]` or `[iteration].[parent].[sub]`

Examples:
- `1.01` — First finding in iteration 1
- `2.03` — Third finding in iteration 2
- `1.01.2` — Second sub-finding from deeper analysis of 1.01

### Severity

See **Severity Levels** section above for full definitions.

Quick: `!!!` = must fix, `!!` = should fix, `!` = can defer, `i` = info only
