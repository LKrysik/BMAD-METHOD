# Deep Verify V5

## What is this?

**Deep Verify** is a structured verification workflow. It helps you find real problems in agent-produced work (code, documents, plans) before they cause issues.

**Why use it?**
- Agents tend to confirm their own work is good (bias)
- Agents skip hard verification to finish faster (shortcuts)
- Deep Verify forces thorough, honest verification

**How it works:**
1. You provide TASK (what was requested) and CONTENT (what was produced)
2. Agent identifies CONCERNS (areas that need verification)
3. Agent selects METHODS (thinking patterns) to verify each concern
4. Agent executes verification and reports FINDINGS (problems/gaps)
5. You decide what to fix, investigate deeper, or accept

---

## Quick Start (Minimum Concepts)

**To use Deep Verify, you need to know only 4 things:**

1. **TASK** = what you asked for
2. **CONTENT** = what was produced
3. **FINDING** = a problem (P) or gap (G) discovered
4. **Severity** = 🔴 (must fix) / 🟠 (should fix) / 🟡 (can defer)

**Everything else is internal workflow mechanics.** Just follow the prompts and choose options when asked (Y/N, A/G, F/D/R/X).

**First time?** Choose **Guided mode** [G] to see each step.

---

## Key Concepts

| Term | What it means for you |
|------|----------------------|
| TASK | The original request you gave the agent |
| CONTENT | What the agent produced (the thing being verified) |
| CONCERN | An area that needs checking (e.g., "security", "completeness") |
| METHOD | A specific thinking pattern from methods.csv used to analyze |
| FINDING | A discovered issue - either Problem (P) or Gap (G) |
| MAB | Anti-shortcut + Anti-bias supervision (see below) |
| MSE | Evidence requirement: quote + location |

---

## Methods Source

**Location:** `src/core/methods/methods.csv`

**Agent MUST:** Read this file and use method definitions from it. Do not guess or invent methods.

**File structure (CSV):**
```
num, category, method_name, description, output_pattern
```

| Column | What it contains |
|--------|------------------|
| num | Method ID (e.g., 70) - reference as #70 |
| category | Group: sanity, risk, challenge, coherence, exploration, etc. |
| method_name | Short name |
| description | **Instructions how to apply** - this is what agent must follow |
| output_pattern | Expected format of method output |

**How to use:** Find method by number → read `description` column → follow its instructions.

---

## MAB - Why the agent supervises itself

**Problem:** Agents naturally:
- Take shortcuts (pick easy methods, skip hard verification)
- Confirm their own work is good (bias toward "no problems found")

**Solution:** MAB forces the agent to answer 4 questions on every action:

| # | Question | What it prevents |
|---|----------|------------------|
| #51 | "3 ways I could cut corners here → proof I'm not" | Shortcuts |
| #52 | "What would lazy agent do? How am I different?" | Lazy verification |
| #53 | "What's the hardest part? Am I avoiding it?" | Skipping hard work |
| #54 | "Who benefits - AGENT (red flag) or OUTCOME (ok)?" | Self-serving decisions |

**How it works:**
- When agent sees `[MAB: purpose]` → executes #51-#54 internally
- Agent shows ONLY the step result (not the MAB analysis)
- If any answer reveals problem → agent corrects before showing result

**Rule:** If AGENT benefit without justification → revise action before proceeding.

**Note:** MAB is self-supervision. It reduces but cannot eliminate agent bias. For high-stakes verification, consider using a different agent or human reviewer.

---

## MSE - Evidence Requirements

Every FINDING must include:
- Quote: verbatim from source, long enough to locate uniquely (typically ≥30 chars, shorter OK if unique)
- Location: file:line OR section:element
- For gaps: "MISSING: [what] in [where]"

**Why quote length matters:** Too short = ambiguous location. Too long = noise. Target: shortest quote that uniquely identifies the location. 30 chars is a guideline, not a rule.

---

## Sanity Suite (7 Methods - MANDATORY)

| # | Method | Check | Output |
|---|--------|-------|--------|
| #70 | Scope Integrity | TASK coverage | Each element: ADDRESSED/REDUCED/OMITTED |
| #71 | Alignment Check | Goal realization | Each goal part: realized Y/N |
| #72 | Closure Check | Incomplete markers | TODO/TBD/PLACEHOLDER with locations |
| #73 | Coherence Check | Contradictions | Terms with conflicting definitions |
| #74 | Grounding Check | Assumptions | EXPLICIT/HIDDEN, validated Y/N |
| #75 | Falsifiability | Failure scenarios | 3 scenarios, 3 gaps |
| #150 | Executability Check | Can it be used? | Each step: ACTIONABLE/BLOCKED/UNCLEAR |

*#150 Executability: For each step/instruction, verify a practitioner could actually perform it without asking questions. List blockers (missing info, undefined terms, impossible actions).

---

## Content-Type Methods

| Type | Methods |
|------|---------|
| Code | #17 Red Team, #38 Chaos Monkey, #76 Camouflage, #83 Boundary |
| Document | #62 Theseus, #79 DNA Inheritance, #82 Temporal |
| Plan | #34 Pre-mortem, #101 Quantum, #102 Cantor |

---

## Severity

| Level | Symbol | Action |
|-------|--------|--------|
| CRITICAL | 🔴 | Must fix |
| IMPORTANT | 🟠 | Should fix |
| MINOR | 🟡 | Can defer |

---

## Prerequisites

Before starting Deep Verify:
1. **TASK** - Original user request must be available (spec, message, ticket)
2. **CONTENT** - Artifact to verify must be complete (not work-in-progress)
3. **ENVIRONMENT** - Related files accessible if referenced
4. **Agent capability** - Agent must execute MAB honestly (self-supervision limitation)

**Fundamental Circularity:** This workflow verifies agent work but is itself executed by an agent. This circularity cannot be fully broken. Mitigations:
- User can spot-check any finding's evidence
- MAB requires concrete evidence, not just assertions
- For critical verification: use a DIFFERENT agent or human reviewer

---

## Flow

```
Step 0: Inputs -> Step 1: Mode -> Step 2: Concerns
                                      ↓
                    [M] Manual ──────────────────┐
                    [D] Discovery (2a+2b) ───────┤
                                                 ↓
                              Step 3: Methods -> Step 4: Verify -> Step 5: Results
                                                                         ↓
                                                         [F]ix/[D]eeper → Loop
                                                         [R]eject / [X] Done
```

**HALT Legend:**
- **HALT** = Wait for user input (both modes)
- **HALT (G only)** = Wait only in Guided mode; Auto mode continues

---

## Step 0: Confirm Inputs

**What happens now:** Agent shows what it will verify. You confirm it's correct.

**Why this matters:** Wrong inputs = useless verification. Make sure TASK matches what you actually requested.

```
## Deep Verify V5

TASK: [original request]
CONTENT: [what was produced]
TYPE: [Code / Document / Plan]
ENVIRONMENT: [context]

[C] Correct - start verification

[E] Edit - I'll describe what to change
[X] Exit - cancel verification
```

**HALT** - waiting for your choice

---

## Step 1: Mode

**What happens now:** You choose how much control you want during verification.

**Options:**
- **Auto:** Agent runs all steps and shows you final results. Faster, less control.
- **Guided:** Agent pauses at each step for your approval. Slower, full control.

**When to use each:**
| Use Auto when... | Use Guided when... |
|------------------|-------------------|
| Low-stakes content | High-stakes / production |
| Familiar content type | First time with this type |
| Time-constrained | Need to understand process |
| Trust agent's judgment | Want to shape verification |

```
[A] Auto - run all steps, show results at end
[G] Guided - pause at each step for my approval
```

**HALT** - waiting for your choice

---

## Step 2: Generate Concerns

**What happens now:** Define what areas of CONTENT need verification.

**What are CONCERNs?** Areas like "security", "completeness", "performance", "logic errors", "gaps" that need to be verified against TASK requirements.

**Agent must describe what is CONCERN for user**

```

How do you want to define concerns? 

[M] Manual - I'll specify what to verify
[D] Discovery - Agent finds concerns using methods
```

**HALT** - waiting for your choice

---

### Option M: Manual Concerns

You describe what you want to verify. Agent expands and structures it into CONCERNS list.

**How to describe (any format works):**
- Keywords: "spójność, czytelność, luki"
- Question: "czy logika jest poprawna?"
- Specific: "sprawdź obsługę błędów w funkcji X"
- Mixed: "security + czy spełnia wymagania z TASK"

**Agent process:**
1. Parse user input for verification areas
2. Apply methods to expand (use #70 Scope, #74 Grounding, #56 Sorites):
   - What related areas might user have missed?
   - What's implicit in user's request?
   - What's the hardest part user might be avoiding?
3. Structure into CONCERNS format

```
User: "logic errors and spec compliance"

Agent expands:
| ID | Concern | From | Description |
|----|---------|------|-------------|
| C1 | Logic errors | User | Flawed reasoning, incorrect conditions |
| C2 | Spec compliance | User | CONTENT matches TASK requirements |
| C3 | Edge cases | #70 | Boundary conditions implied by spec |
| C4 | Assumptions | #74 | Hidden assumptions in logic |

[P] Proceed with these concerns
[A] Add concern - describe what area to verify
[R] Remove concern - specify ID (e.g., R C2)
```

**HALT** - waiting for choice

---

### Option D: Discovery

Agent uses methods to find concerns systematically.

### 2a: Select Discovery Methods

**[MAB: Select methods that will find ALL concerns, not just obvious ones]**

**Purpose:** These methods will be used to DISCOVER CONCERNS (areas that need verification) - not to verify yet.

**MANDATORY:** Sanity Suite #70-#75, #150 (see Sanity Suite section)

**ADDITIONAL:** Select 3-9 methods from `methods.csv` based on:
1. **TYPE** - Code/Document/Plan (see Content-Type Methods section)
2. **CONTENT specifics** - what does THIS content need?
   - What could go wrong here specifically?
   - What's unique/risky about this content?
   - Where are the blind spots?

```
## Discovery Methods

These methods will help identify CONCERNS (areas to verify):

MANDATORY: #70-#75, #150 ✓
ADDITIONAL:
| # | Why this method for THIS content |
|---|----------------------------------|
| #[N] | [specific reason based on content] |
```

### 2b: Execute Discovery

**What happens now:** Agent runs all selected methods and extracts CONCERNS.

**Next:** These concerns will be verified in Step 3 and 4.

**[MAB: Extract ALL relevant concerns, not just safe/obvious ones]**

```
| ID | Concern | Source | Discovery Method | Description |
|----|---------|--------|------------------|-------------|
| C1 | [name] | TASK<>CONTENT | #[N] | [what to verify] |
```

**Mode G only - you can modify concerns:**
```
[P] Proceed - continue to select verification methods
[A] Add concern - describe what area to verify
[R] Remove concern - specify ID (e.g., R C2)
```

**HALT** (G only) - waiting for your choice

---

## Step 3: Select Methods for Concerns

**What happens now:** For each CONCERN, agent selects verification methods that will find problems.

**Why this matters:** Different methods find different problems. Weak methods = missed issues.

### 3a: Method Selection for each CONCERN

**What happens now:** Agent picks 2-5 methods per concern from `methods.csv`.

**[MAB: Select methods that will find problems, not confirm success]**

```
| Concern | Methods | Rationale |
|---------|---------|-----------|
| C1 | #38, #76 | Stress test + coherence |
| C2 | #34, #75 | Failure modes + falsification |
```

### 3b: Additional Methods (Optional)

**What happens now:** Agent can add 0-3 extra methods for holistic analysis beyond specific concerns.

**[MAB: Ensure no blind spots remain uncovered]**

**Mode A:** Auto-select based on TYPE and proceed.
**Mode G:**
```
[A] Auto-select additional methods
[M] Manual - I'll specify which methods to add

[V] Verify - proceed to execute verification
```

**HALT** (G only) - waiting for your choice

```
| Additional Method | Purpose |
|-------------------|---------|
| #[N] | [why needed beyond concerns] |
```

---

## Step 4: Verify

**[MAB: Find real problems, not confirm "all OK"]**

For each Concern + Method:

### Process

1. **Read** method from methods.csv → understand what it detects
   - Find method by number in `description` column
   - Note: what pattern/violation does this method look for?

2. **Locate** where in CONTENT this concern could manifest
   - List ALL relevant locations (not just first found)
   - If concern spans entire content → note "global, sampling sections: X, Y, Z"
   - If unclear → start with: headers, interfaces, boundaries, edge cases

3. **Apply** method's logic: define what violation would look like
   - Based on method description: what SPECIFIC pattern indicates problem?
   - Example: #73 Coherence → "same term defined differently in two places"
   - Write down: "Looking for: [concrete pattern]"

4. **Search** for that violation
   - Assume problem EXISTS until proven otherwise
   - Check each location from step 2
   - Stop when: (a) found with evidence, OR (b) all locations checked, no match
   - If found → document as Finding
   - If not found → list what was checked and why it passed

5. **Document** with MSE evidence OR explain what was checked
   - Finding → use Finding Format below
   - No issue → state: "Checked [X, Y, Z], no [pattern] found because [reason]"

### Output per verification

```
## [Concern] × #[Method]

Target: [what this method looks for in context of this concern]
Checked: [specific sections/elements examined]
Result: [Finding ID] OR [No issue: reason]
```

### Finding Format (MSE required)

```
### [N] [P/G]-[🔴|🟠|🟡] Title

What: [description]
Where: [location]
Evidence: "[quote]" - [file:line]
Impact: [consequence]
Fix: [action]
```

**Severity:** 🔴 must fix | 🟠 should fix | 🟡 can defer

### Anti-patterns (redo if detected)

- "Looks fine" without specifics
- No evidence for OK conclusions
- Skipping hard-to-verify areas

---

## Step 5: Results

**What happens now:** Agent shows all findings and you decide what to do next.

```
## Verification Results

TASK: [summary]
CONTENT: [summary]

### Findings

| ID | Concern | Type | Sev | Description |
|----|---------|------|-----|-------------|
| 1 | C1 | P | 🔴 | [desc] |

Status: 🔴 / 🟠 / 🟡 / ✅

[F] Fix | [D] Deeper | [R] Reject | [X] Done
```

**HALT**

---

## Actions Detail

**What happens after each action:** Agent updates results and shows them again. You can take another action until you choose [X] Done.

### Fix

**What happens:** Agent fixes the issue and verifies fix is correct.

**[MAB: Fix must solve the problem, not just change something]**

**Process:**
1. **Analyze** finding → understand root cause
2. **Plan** fix → what exactly needs to change
3. **Select verification methods** (1-3 from methods.csv) to confirm fix works
4. **Execute** fix → make changes
5. **Verify** using selected methods → confirm problem is solved
6. **Report** changes made

```
## Fix: [ID]

Finding: [original description]
Root cause: [why this problem exists]

Fix plan:
- [what will be changed/added/removed]

Verification methods:
| # | Method | What it will confirm |
|---|--------|---------------------|
| #[N] | [name] | [how it verifies fix] |

Executing fix...

Changes made:
| Action | Location | Before | After |
|--------|----------|--------|-------|
| Modified | [where] | [old] | [new] |
| Added | [where] | - | [what] |
| Removed | [where] | [what] | - |

Verification:
| # | Method | Result |
|---|--------|--------|
| #[N] | [name] | ✓ Pass / ✗ Fail: [reason] |

Status: FIXED / PARTIALLY FIXED / FAILED
```

→ Finding marked with status
→ Results refreshed, **HALT** for next action

### Deeper

**What happens:** Finding becomes a CONCERN and goes through full verification cycle.

**Process:**
1. Finding [ID] → becomes CONCERN for deeper analysis
2. → **Step 3:** Select methods for this concern (2-5 methods)
3. → **Step 4:** Verify using selected methods
4. → Sub-findings added to Results (as [ID].1, [ID].2, etc.)
5. → Original finding marked as ANALYZED

```
## Deeper: [ID] → Concern

Original finding: [description]

Methods selected for deeper analysis:
| # | Method | Why |
|---|--------|-----|
| #[N] | [name] | [rationale] |

[Proceed with Step 4: Verify for each method]
```

→ Sub-findings added to Results
→ Results refreshed, **HALT** for next action

### Reject

**What happens:** You mark a finding as invalid. It stays in the log but doesn't count as open.

```
[ID]: REJECTED - [your reason]
```
→ Finding marked REJECTED
→ Results refreshed, **HALT** for next action

### Done

**What happens:** Verification complete. Final summary shown.

```
## Verification Complete

Findings: [N] total (Problems: [N], Gaps: [N])
Fixed: [N] | Open: [N] | Rejected: [N]

| Severity | Still Open |
|----------|------------|
| 🔴 | N |
| 🟠 | N |
| 🟡 | N |
```

---

## Quick Ref

**Flow:** Inputs → Mode → Concerns → Methods → Verify → Results

**MAB:** Agent executes internally when seeing `[MAB: purpose]`. Output = step result only.

**MSE:** Every finding needs quote + location.

**Sanity (mandatory):** #70 Scope | #71 Align | #72 Closure | #73 Coherence | #74 Ground | #75 Falsify | #150 Exec

**Severity:** 🔴 must fix | 🟠 should fix | 🟡 defer

**Actions:** 
[F]ix - fix findings
[D]eeper - explain and deeper verification
[R]eject - reject findings (remove from list)
[X]Done - exit process
