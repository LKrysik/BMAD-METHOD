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
| **Question** | `Q` | Needs clarification or decision |
| **Verified** | `V` | Checked and confirmed OK |

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

## Phase 1: Context Analysis

Agent analyzes TASK + CONTENT + ENVIRONMENT to identify verification concerns.

**Note:** This phase uses Thinking Methods to guide analysis — not just intuition. Agent reads and executes methods to extract insights systematically.

### 1.1 Analyze Context

Extract key elements from each input to find risk areas.

**Use Thinking Methods to analyze:**
- #70 Scope Integrity — identify all elements in TASK
- #74 Grounding Check — find hidden assumptions in CONTENT
- #119 Assumption Archaeology — surface inherited assumptions from ENVIRONMENT

Agent executes these methods (following patterns from source) to produce structured analysis. May use other methods as context requires.

**Output format:**
```
## Context Analysis

### From TASK
- Key requirements: [list]
- Explicit constraints: [list]
- Implied expectations: [list]

### From CONTENT
- What was added: [list]
- What was changed: [list]
- What was removed: [list]

### From ENVIRONMENT
- Related components: [list]
- Dependencies: [list]
- Conventions to follow: [list]

### Risk Areas (TASK ↔ CONTENT ↔ ENVIRONMENT)

| Area | Risk | Why verify |
|------|------|-----------|
| [area] | [what could go wrong] | [consequence] |
```

### 1.2 Identify Concerns and Select Thinking Methods

Based on context analysis, identify specific concerns to verify and select thinking methods for each.

**Step A: Use Thinking Methods to identify what needs verification:**
- #56 Sorites Paradox — which elements are critical (removal destroys solution)?
- #93 Aristotle's Four Causes — what is CONTENT made of, structured as, caused by, for?
- #112 Topological Invariant — what is the essence that must be verified?

Agent executes these methods to discover concerns systematically — not just list obvious ones.

**Step B: For each identified concern, select verification methods:**

Agent browses Thinking Methods source using insights from Step A to find best matches. Common verification methods:
- #70 Scope Integrity — check completeness against original task
- #73 Coherence Check — find contradictions
- #74 Grounding Check — surface hidden assumptions
- #33 Comparative Analysis — evaluate against criteria

Agent may find other methods more suitable based on specific concern characteristics.

**Output format:**
```
## Verification Concerns

| # | Concern | What to verify | Source | Thinking Methods |
|---|---------|----------------|--------|------------------|
| 1 | [name] | [specific check] | TASK: [element] | #[N] [name], #[N] [name] |
| 2 | [name] | [specific check] | CONTENT: [element] | #[N] [name] |
| 3 | [name] | [specific check] | ENVIRONMENT: [element] | #[N] [name] |
| 4 | [name] | [specific check] | TASK↔CONTENT: [gap] | #[N] [name] |
| 5 | [name] | [specific check] | CONTENT↔ENV: [conflict] | #[N] [name] |
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

**Problem found:**
```
### [1.01] P-!!! Problem Title

**What:** [description of problem]
**Where:** [location in CONTENT]
**Evidence:** "[quote]" — [line/section]
**Impact:** [consequence for TASK or ENVIRONMENT]
**Fix:** [suggested action]
```

**Gap found:**
```
### [1.02] G-!! Gap Title

**Missing:** [what should exist]
**Expected because:** [TASK requires / ENVIRONMENT shows]
**Impact:** [consequence]
**Add:** [what to add and where]
```

**Question raised:**
```
### [1.03] Q Question Title

**Issue:** [what needs clarification]
**Context:** [why this matters]
**Options:** [possible resolutions]
```

**Verified OK:**
```
### [1.04] V Verified Element

**Checked:** [element]
**Thinking Method:** #[N] [name]
**Status:** OK
```

---

## Phase 3: Report

### Report Format

```
## Verification Report

**Iteration:** [N]
**TASK:** [summary]
**CONTENT:** [summary]

---

### Summary

| Type | !!! | !! | ! | i |
|------|-----|----|---|---|
| Problems | [N] | [N] | [N] | — |
| Gaps | [N] | [N] | [N] | — |
| Questions | [N] | — | — | — |
| Verified | — | — | — | [N] |

**Status:** RED (critical issues) / YELLOW (important issues) / GREEN (minor or none)

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

### Modes

| Mode | When to use | HALTs |
|------|-------------|-------|
| **Auto** | Trust agent, want quick results | 1 (after report) |
| **Supervised** | Control concerns and methods | 2 (plan + report) |

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
