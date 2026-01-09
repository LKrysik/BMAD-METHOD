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
5. You validate one finding to confirm agent is honest
6. You decide what to fix, investigate deeper, or accept

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
| MSE | Evidence requirement: quote ≥30 chars + location |
| UVS | You validate one finding to confirm it's real |

---

## Methods Source

Methods are thinking patterns stored in `src/core/methods/methods.csv`

**How to use:** Find method by number (e.g., #70). Read its `description` for instructions.

**File structure:** `num, category, method_name, description, output_pattern`

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

**When you see `[MAB: purpose]`** = agent must answer all 4 questions focused on that purpose.

**Execute on every action:**

```
[MAB]
#51 Liar's Trap: [3 deceptions] -> [proof not doing]
#52 Mirror Trap: Dishonest would [X] | I do [Y] | Diff [%]
#53 Confession: Hardest [X] | Focus [evidence]
#54 CUI BONO: Benefits AGENT / OUTCOME
```

**Rule:** If AGENT benefit without justification -> revise action.

---

## MSE - Evidence Requirements

Every FINDING must include:
- Quote >=30 chars (verbatim from source)
- Location: file:line OR section:element
- For gaps: "MISSING: [what] in [where]"

**For security findings (code only):**
```
Input: [source] -> Processing: [how used] -> Output: [destination]
Sanitization: Y/N
```

---

## Sanity Suite (6 Methods - MANDATORY)

| # | Method | Check | Output |
|---|--------|-------|--------|
| #70 | Scope Integrity | TASK coverage | Each element: ADDRESSED/REDUCED/OMITTED |
| #71 | Alignment Check | Goal realization | Each goal part: realized Y/N |
| #72 | Closure Check | Incomplete markers | TODO/TBD/PLACEHOLDER with locations |
| #73 | Coherence Check | Contradictions | Terms with conflicting definitions |
| #74 | Grounding Check | Assumptions | EXPLICIT/HIDDEN, validated Y/N |
| #75 | Falsifiability | Failure scenarios | 3 scenarios, 3 gaps |

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
| CRITICAL | !!! | Must fix |
| IMPORTANT | !! | Should fix |
| MINOR | ! | Can defer |

---

## Prerequisites

Before starting Deep Verify:
1. **TASK** - Original user request must be available (spec, message, ticket)
2. **CONTENT** - Artifact to verify must be complete (not work-in-progress)
3. **ENVIRONMENT** - Related files accessible if referenced
4. **Agent capability** - Agent must execute MAB honestly (self-supervision limitation)

---

## Flow

```
Step 0: Inputs -> Step 1: Mode
-> Step 2: Generate Concerns (2a: Select Discovery Methods incl. Sanity, 2b: Execute)
-> Step 3: Select Methods for Concerns (3a: Per-Concern, 3b: Additional)
-> Step 4: Verify + UVS -> Step 5: Results -> Actions
                                              ↓
                              [F]ix/[D]eeper → Loop back to Results
                              [R]eject → Remove from Results
                              [X] Done → Complete
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

[Y] Correct - start verification
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

```
[A] Auto - run all steps, show results at end
[G] Guided - pause at each step for my approval
```

**HALT** - waiting for your choice

---

## Step 2: Generate Concerns

**What happens now:** Agent identifies CONCERNS - areas in CONTENT that need verification.

**Why this matters:** CONCERNs determine what gets checked. Missing a concern = missing potential problems.

**What are CONCERNs?** Areas like "security", "completeness", "performance" that need to be verified against TASK requirements.

### 2a: Select Discovery Methods

**What happens now:** Agent selects thinking methods that will help discover concerns.

**[MAB: Select methods that will find ALL concerns, not just obvious ones]**

**MANDATORY (Sanity Suite - always used):**
| # | Method | What it finds |
|---|--------|---------------|
| #70 | Scope Integrity | Missing/reduced requirements from TASK |
| #71 | Alignment Check | Goal parts that aren't realized |
| #72 | Closure Check | TODO/TBD/PLACEHOLDER left in content |
| #73 | Coherence Check | Internal contradictions |
| #74 | Grounding Check | Hidden assumptions |
| #75 | Falsifiability | Ways the content could fail |

**ADDITIONAL (agent selects 3-9 more based on TYPE and complexity):**
- `risk` category: #34 Pre-mortem, #37 Identify Risks, #38 Chaos Monkey
- `challenge` category: #55-#61 paradoxes, #62 Theseus
- `coherence` category: #76-#85
- `exploration` category: #101-#119

```
## Discovery Methods Selected

[MAB]
#51: Ways I could skip hard methods: [list] → Proof I'm not: [evidence]
#52: Lazy agent would pick: [only mandatory] | I pick: [mandatory + N additional] | Diff: [%]
#53: Hardest concerns to find need methods: [list] | Included: Y/N
#54: Benefits AGENT (fewer methods = less work) / OUTCOME (thorough coverage)

MANDATORY: #70, #71, #72, #73, #74, #75 ✓
ADDITIONAL:
| # | Method | Category | Why selected |
|---|--------|----------|--------------|
| #34 | Pre-mortem | risk | Find failure modes |
| #55 | Barber Paradox | challenge | Find dismissed alternatives |
| ... | ... | ... | ... |
```

### 2b: Execute Discovery

**What happens now:** Agent runs all selected methods and extracts CONCERNS.

**Next:** These concerns will be verified in Step 3 and 4.

**[MAB: Extract ALL relevant concerns, not just safe/obvious ones]**

```
[MAB]
#51: Ways I could miss concerns: [list] → Proof I'm not: [evidence]
#52: Lazy agent would list: [N] concerns | I list: [N] | Diff: [%]
#53: Hardest concern to admit: [X] | Included: Y/N
#54: Benefits AGENT (fewer concerns = less work) / OUTCOME (complete coverage)

| ID | Concern | Source | Discovery Method | Description |
|----|---------|--------|------------------|-------------|
| C1 | [name] | TASK<>CONTENT | #[N] | [what to verify] |
```

**Mode G only - you can modify concerns:**
```
[A] Add concern - describe what area to verify
[R] Remove concern - specify ID (e.g., R C2)
[V] Verify these concerns - proceed to select verification methods
```

**HALT** (G only) - waiting for your choice

---

## Step 3: Select Methods for Concerns

**What happens now:** For each CONCERN, agent selects verification methods that will find problems.

**Why this matters:** Different methods find different problems. Weak methods = missed issues.

### 3a: Method Selection for each CONCERN

**What happens now:** Agent picks 2-5 methods per concern from `methods.csv`.

**[MAB: Select methods that will find problems, not confirm success]**

**Selection guidance by TYPE:**
- **Code:** Prefer `#17 Red Team`, `#38 Chaos Monkey`, `#76-83 coherence`
- **Document:** Prefer `#62 Theseus`, `#79 DNA`, `#82 Temporal`
- **Plan:** Prefer `#34 Pre-mortem`, `#101 Quantum`, `#102 Cantor`

```
## Methods per Concern

[MAB]
#51: Ways I could pick weak methods: [list] → Proof I'm not: [evidence]
#52: Lazy agent would pick: [easy methods] | I pick: [challenging methods] | Diff: [%]
#53: Methods most likely to find problems: [list] | Included: Y/N
#54: Benefits AGENT (soft methods = fewer findings) / OUTCOME (rigorous verification)

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
[S] Skip - concern methods are sufficient
[V] Verify - proceed to execute verification
```

**HALT** (G only) - waiting for your choice

```
[MAB]
#51: Ways I could skip needed methods: [list] → Proof I'm not: [evidence]
#52: Thorough agent would add: [list] | I add: [list] | Diff: [%]
#53: Blind spot most likely missed: [X] | Covered by: [method or N/A]
#54: Benefits AGENT (skip = less work) / OUTCOME (complete coverage)

| Additional Method | Purpose |
|-------------------|---------|
| #[N] | [why needed beyond concerns] |
```

---

## Step 4: Verify + UVS

**What happens now:** Agent executes each verification method on each concern and reports findings.

**Why this matters:** This is where problems are actually found. Rushed verification = missed issues.

**[MAB: Find real problems, not confirm "all OK" + MSE required on each]**

For each concern + method combination:

```
## Verify: [Concern] with #[Method]

[MAB: Execute method to FIND issues, not to PASS verification]
#51: Ways I could miss problems: [list] → Proof I'm not: [evidence]
#52: Lazy agent would conclude: "OK" | My conclusion: [X] | Diff: [%]
#53: Hardest issue to find/admit: [X] | Found: Y/N
#54: Benefits AGENT ("OK" = done faster) / OUTCOME (real issues found)

Execution: [method-specific analysis]
Result: [Finding or OK]
```

### Finding Format

Each finding must include evidence (MSE requirement):

```
### [N.NN] [P/G]-[!!!|!!|!] Title

What: [description]
Where: [location]
Evidence: "[>=30 char quote]" - [file:line]
Impact: [consequence]
Fix: [action]

// Security findings only (code):
Attack: [vector]
Input->Process->Output: [flow]
Sanitization: Y/N
```

**Severity levels:**
- `!!!` CRITICAL - must fix before use
- `!!` IMPORTANT - should fix
- `!` MINOR - can defer

### UVS - User Validation Step

**What happens now:** You validate ONE finding to confirm agent isn't fabricating evidence.

**Why this matters:** Agent could invent findings or quote wrong locations. You check one to keep agent honest.

Agent selects highest-severity finding with evidence.

```
## UVS - Please Validate

Finding: [ID] [Title]
Evidence: "[quote]" - [location]

Does this quote exist at this location?
[Y] Yes, confirmed - continue to results
[N] No, not found - I'll explain what I see
```

**HALT** - waiting for your validation

**If [N]:**
1. You explain what you found (correct location or "not there")
2. If location corrected → Agent updates finding, shows results
3. If "not found" → Agent re-verifies. If still not found → finding REJECTED as "Evidence not reproducible"

---

## Step 5: Results

**What happens now:** Agent shows all findings and you decide what to do next.

```
## Verification Results

TASK: [summary]
CONTENT: [summary]
TYPE: [Code/Document/Plan]
UVS: [Y/N] - [ID]

### Summary

| Type | !!! | !! | ! |
|------|-----|----|---|
| Problems | N | N | N |
| Gaps | N | N | N |

Status: RED (has !!!) / YELLOW (has !!) / GREEN (only ! or none)

### Findings

| ID | Type | Sev | Description | Method |
|----|------|-----|-------------|--------|
| 1.01 | P | !!! | [desc] | #70 |

### Coverage

| Area | Methods | Findings |
|------|---------|----------|
| Sanity | #70-75 | N |
| C1 | #38 | N |

## What do you want to do?

[F] Fix findings - agent fixes issues (specify IDs, e.g., "F 1.01 1.02" or "F all")
[D] Deeper analysis - investigate a finding more thoroughly (specify ID, e.g., "D 1.01")
[R] Reject findings - mark findings as invalid with reason (e.g., "R 1.01 not applicable")
[X] Done - finish verification
```

**HALT** - waiting for your choice

---

## Actions Detail

**What happens after each action:** Agent updates results and shows them again. You can take another action until you choose [X] Done.

### Fix

**What happens:** Agent applies fixes to the identified issues and verifies each fix worked.

```
[ID]: [what was fixed] -> [how verified]
```
→ Finding marked as FIXED
→ Results refreshed, **HALT** for next action

### Deeper

**What happens:** Agent runs additional verification methods on a specific finding to investigate further.

```
## Deeper Analysis: [ID]

Additional methods applied: #[N], #[N]
Sub-findings discovered:
| ID | Type | Sev | Description |
```
→ Sub-findings added (as [ID].1, [ID].2, etc.)
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
| !!! | N |
| !! | N |
| ! | N |

Validation: UVS [Y/N]
```

---

## Quick Ref

**Flow:** Inputs → Mode → Concerns (Sanity #70-75 mandatory + 3-9 additional) → Methods per Concern (2-5 each) → Verify + UVS → Results

**MAB (anti-shortcut + anti-bias):** Execute on every action with stated PURPOSE
- #51 Liar's Trap: Ways to cut corners → proof not doing
- #52 Mirror Trap: What would lazy agent do? → compare
- #53 Confession: Hardest part → am I avoiding it?
- #54 CUI BONO: Benefits AGENT (red flag) / OUTCOME (ok)

**Other mechanisms:** MSE (every finding) | UVS (before report)

**Sanity (mandatory in Step 2):** #70 Scope | #71 Align | #72 Closure | #73 Coherence | #74 Ground | #75 Falsify

**Methods Source:** `src/core/methods/methods.csv` (num, category, method_name, description, output_pattern)

**Severity:** !!! must fix | !! should fix | ! defer

**Actions:** [F]ix | [D]eeper | [R]eject | [X]Done
