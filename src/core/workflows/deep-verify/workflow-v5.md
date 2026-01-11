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

**Document type:** This is a **procedural workflow** (step-by-step instructions), not reference documentation. Sections are ordered for execution, not lookup. Key Concepts provides the single source for definitions.

---

## Quick Start (Minimum Concepts)

**To use Deep Verify, you need to know only 4 things:**
- **TASK**, **CONTENT**, **FINDING** → see Key Concepts table below
- **Severity** = 🔴 (must fix) / 🟠 (should fix) / 🟡 (can defer)

**Everything else is internal workflow mechanics.** Just follow the prompts and choose options when asked (A/G, P/A/R, F/D/R/X, etc.).

**First time?** Choose **Guided mode** [**G**] to see each step.

**⚠️ Important limitation:** This workflow is executed BY an agent TO verify agent work. It reduces but cannot eliminate self-verification bias. For 🔴 critical content, consider human review.

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
- When agent sees `[MAB: purpose]` in workflow:
  1. Read the "purpose" text as context (e.g., "Select methods that will find problems" tells agent WHAT to apply MAB to)
  2. Execute #51-#54 internally, applying each question to current action
  3. If any answer reveals shortcut/bias → STOP, correct, then proceed
  4. Show ONLY the step result (not the MAB analysis itself)

**Rule:** If AGENT benefit without justification → revise action before proceeding.

**⚠️ Self-verification limitation:** MAB is self-supervision - the same agent checking itself. This reduces but cannot eliminate bias. MAB effectiveness depends on agent honesty. For high-stakes verification, use a different agent or human reviewer.

**Method Numbers:** MAB uses #51-54 (anti-bias category in methods.csv). Sanity Suite uses #70-75, #150 (sanity category). All numbers reference the same methods.csv file - different ranges are different categories.

---

## MSE - Evidence Requirements

Every FINDING must include:
- Quote: verbatim from source, long enough to locate uniquely (typically ≥30 chars, shorter OK if unique)
- Location: file:line OR section:element
- For gaps: "MISSING: [what] in [where]"

**Why quote length matters:** Too short = ambiguous location. Too long = noise. Target: shortest quote that uniquely identifies the location. 30 chars is a guideline, not a rule.


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
1. **TASK** must be available (see Key Concepts)
2. **CONTENT** must be complete, not work-in-progress (see Key Concepts)
3. **ENVIRONMENT** - Related files accessible if referenced
4. **Agent capability** - Agent must execute MAB honestly (self-supervision limitation)

**Fundamental Circularity:** This workflow verifies agent work but is itself executed by an agent. This circularity cannot be fully broken.

**Active Mitigations (MANDATORY):**
1. **Evidence Anchoring** - Every finding MUST include MSE (quote + location). User can verify quote exists.
2. **Severity Justification** - 🔴 findings require user confirmation before proceeding to fix.
3. **Null Finding Challenge** - If agent reports "no issues found", user SHOULD request agent run #51 Liar's Trap on itself.

**Passive Mitigations (RECOMMENDED):**
- User spot-checks 1-2 findings per verification (verify quote, check context)
- For 🔴 critical content: use DIFFERENT agent or human reviewer
- Compare findings against user's intuition - suspiciously clean results warrant scrutiny

**Trust Calibration:** Track verification accuracy over time. If agent consistently misses issues user later finds, reduce trust in Auto mode.

---

## Error Handling

**What to do when things go wrong:**

| Error | Symptom | Recovery |
|-------|---------|----------|
| methods.csv not found | Agent cannot read methods file | Verify file exists at `src/core/methods/methods.csv`. If missing, workflow cannot proceed. |
| CONTENT not accessible | Agent cannot read artifact to verify | Provide correct path or paste content directly. |
| Verification timeout | Step 4 takes too long | Use [**C**] to reduce concerns or [**M**] to select fewer methods. |
| All concerns irrelevant | Generated concerns don't match user intent | Use [**C**] Navigation → clear all → use [**M**] Manual to specify directly. |
| False positives | Agent reports problems that don't exist | Use [**R**] Reject with reason. Track pattern - may indicate method mismatch. |
| Fix keeps failing | Multiple fix attempts don't resolve issue | Use [**D**] Deeper to understand root cause. Consider human review. |
| Agent stuck in loop | Same findings keep appearing | Use [**O**] Restart with different approach or simpler scope. |

**General recovery:** At any HALT point, you can describe what's wrong and agent will attempt to help. For unrecoverable errors, use [**X**] Done or [**O**] Restart.

---

## Flow

```
Step 0: Confirm Inputs -> Step 1: Mode -> Step 2: Generate Concerns
                                                ↓
                              [M] Manual ──────────────────┐
                              [D] Discovery (2a+2b) ───────┤
                                                           ↓
                                    Step 3: Select Methods -> Step 4: Verify -> Step 5: Results
                                   ↑                                    ↓
                                   ├─────────────── [M] Methods ────────┤
                                   │                                    │
              Step 2 ←───────────── [C] Concerns ──────────────────────┤
                                                                        │
Step 0 ←──────────────────────────── [O] Restart ──────────────────────┤
                                                                        │
                                                    [F]ix/[D]eeper ─────┤ Loop
                                                    [R]eject / [X] Done ┘
```

**HALT Legend:**
- **HALT** = Wait for user input (both modes)
- **HALT (G only)** = Wait only in Guided mode; Auto mode continues

---

## 📋 Step 0 of 5: Confirm Inputs

**What happens now:** Agent shows what it will verify. You confirm it's correct.

**Why this matters:** Wrong inputs = useless verification. Make sure TASK matches what you actually requested.

```
## Deep Verify V5

TASK: [original request]
CONTENT: [what was produced]
TYPE: [Code / Document / Plan]
ENVIRONMENT: [context]

[**C**] Correct - start verification

[**E**] Edit - I'll describe what to change
[**X**] Exit - cancel verification
```

**If [E] Edit:** Describe what's wrong (e.g., "TASK should be X", "wrong file"). Agent updates and shows corrected inputs for confirmation.

**HALT** - waiting for your choice

---

## ⚙️ Step 1 of 5: Mode

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
[**A**] Auto - run all steps, show results at end
[**G**] Guided - pause at each step for my approval
```

**HALT** - waiting for your choice

---

## 🔍 Step 2 of 5: Generate Concerns

**What happens now:** Define what areas of CONTENT need verification.

**What are CONCERNs?** Areas like "security", "completeness", "performance", "logic errors", "gaps" that need to be verified against TASK requirements.

**Agent must describe what is CONCERN for user**

```

How do you want to define concerns? 

[**M**] Manual - I'll specify what to verify
[**D**] Discovery - Agent finds concerns using methods
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

[**P**] Proceed with these concerns
[**A**] Add concern - describe what area to verify
[**R**] Remove concern - specify ID (e.g., R C2)
[**D**] Discover more - expand concerns using Discovery methods (with MAB)
```

**Note:** [**D**] runs Discovery process (Step 2a+2b) on your manual concerns to find related areas you might have missed.

**HALT** - waiting for choice

---

### Option D: Discovery

Agent uses methods to find concerns systematically.

**Why two method selection phases?**
| Phase | Purpose | Methods answer |
|-------|---------|----------------|
| **Discovery** (Step 2) | Find WHAT to verify | "What areas might have problems?" |
| **Verification** (Step 3) | Decide HOW to verify | "How to check if this area has problems?" |

*Discovery methods = find concerns. Verification methods = test concerns.*

### 2a: Select Discovery Methods

**[MAB: Select methods that will find ALL concerns that are key for CONTENT and TASK, not just obvious ones]**

**Purpose:** These methods will be used to DISCOVER CONCERNS (areas that need verification) - not to verify yet.

**MANDATORY:** Sanity Suite #70-#75, #150 (see Sanity Suite section)

**ADDITIONAL:** Select 3-9 methods from `methods.csv` based on:
1. **TYPE**
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

[**P**] Proceed - use these methods for discovery
[**A**] Add method - by ID (#N) or by description ("find X problems")
[**R**] Remove method - specify # (e.g., R #38)
[**S**] Show categories - display method categories from methods.csv
```

**IMPORTANT:** [**A**] adds method to ADDITIONAL list (append). Does NOT replace existing methods.

**[A] by description:** If you describe what you want (e.g., "method to find logic errors"), agent finds matching methods from methods.csv using [MAB: select methods that match user intent, not easiest ones].

**HALT** (G only) - waiting for your choice

### 2b: Execute Discovery

**What happens now:** Agent runs all selected methods and extracts CONCERNS.

**Next:** These concerns will be verified in Step 3 and 4.

**[MAB: Extract ALL relevant concerns, not just safe/obvious ones]**

**Extraction process:**
1. For each selected method → run against TASK + CONTENT
2. From method output → identify areas that need verification
3. Formulate as CONCERN: "Area X needs checking because method found Y"
4. Avoid duplicates - merge similar concerns

```
| ID | Concern | Source | Discovery Method | Description |
|----|---------|--------|------------------|-------------|
| C1 | [name] | TASK<>CONTENT | #[N] | [what to verify] |
```

**Mode G only - you can modify concerns:**
```
[**P**] Proceed - continue to select verification methods
[**A**] Add concern - describe what area to verify
[**R**] Remove concern - specify ID (e.g., R C2)
```

**HALT** (G only) - waiting for your choice

---

## 🧰 Step 3 of 5: Select Methods for Concerns

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
[**A**] Auto-select additional methods
[**M**] Manual - I'll specify which methods to add (by ID or description)
[**S**] Show categories - display method categories from methods.csv

[**V**] Verify - proceed to execute verification
[**C**] Back to Concerns - return to Step 2 to modify concerns
```

**HALT** (G only) - waiting for your choice

```
| Additional Method | Purpose |
|-------------------|---------|
| #[N] | [why needed beyond concerns] |
```

---

## ✅ Step 4 of 5: Verify

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
   - Example: #73 Coherence → "same term defined differently in two places" OR "same term defined IDENTICALLY in multiple places (redundancy)"
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
### [N] 🔴|🟠|🟡 [P|G] Title

Type: Problem (P) = something wrong | Gap (G) = something missing
What: [description]
Where: [location]
Evidence: "[quote]" - [file:line]
Impact: [consequence]
Fix: [action]
```

This detailed format is used DURING Step 4 verification. Results table (Step 5) shows summary only.

### Anti-patterns (redo if detected)

- "Looks fine" without specifics
- No evidence for OK conclusions
- Skipping hard-to-verify areas
- "Intentional redundancy" without proof it's intentional or beneficial
- Finding only contradictions, ignoring unnecessary duplications

---

## 📊 Step 5 of 5: Results

**What happens now:** Agent shows summary of all findings. You decide what to do next.

**MANDATORY:** Use this exact table format:

```
## Verification Results

TASK: [summary]
CONTENT: [summary]

### Findings

| ID | Concern | Sev | Finding |
|----|---------|-----|---------|
| 1 | C1: [name] | 🔴 | [What] → [Impact] → [Action] |
| 2 | C2: [name] | 🟠 | [What] → [Impact] → [Action] |

Status: 🔴 / 🟠 / 🟡 / ✅

---

### 🔧 Actions (per finding)
[**F**] Fix [ID,...]     - fix one or more findings (e.g., F 1 or F 1,2,3)
[**D**] Deeper [ID]      - investigate finding as new concern
[**R**] Reject [ID]      - mark finding as invalid (with reason)

---

### 🧭 Navigation
[**C**] Concerns         - go back to modify/add concerns (Step 2)
[**M**] Methods          - re-run verification with different methods (Step 3)
[**X**] Done             - finish verification

---

### 🔄 Session
[**O**] Restart          - start over from Step 0 (discard current progress)
```

**Note:** Full evidence (MSE) is in Step 4 output. This table is summary for decision-making.

**HALT**

---

## Actions Detail

**What happens after each action:** Agent updates results and shows them again. You can take another action until you choose [X] Done.

### Fix

**What happens:** Agent fixes the issue and verifies fix is correct.

**[MAB: Fix must solve the problem, not just change something]**

**⚠️ For 🔴 critical fixes:** User SHOULD independently verify the fix after agent completes it. Agent self-verification has inherent limitations (circularity).

**Process:**
1. **Analyze** finding → understand root cause
2. **Plan** fix → what exactly needs to change
3. **Select verification methods** → user chooses mode:
   - [**A**] Auto - agent selects 1-3 methods appropriate for this fix type
   - [**M**] Manual - user specifies methods (by ID or description)
   - [**S**] Show categories - display available method categories
4. **Execute** fix → make changes
5. **Verify** using selected methods → confirm problem is solved
6. **Report** changes made

**Method selection (Auto mode):**

**[MAB: Select methods that will DETECT if fix failed, not confirm it worked]**

For the problem/error/issue being fixed, agent selects methods that will verify what was actually done during the fix. Agent must NOT take shortcuts, must NOT avoid difficult aspects of verification.

Selected methods must:
- Cover different scopes and aspects of the fix (not just one angle)
- Catch as many potential problems with the fix as possible
- Be appropriate for THIS specific type of problem

Agent must justify: "Method #X verifies [aspect] and will catch [failure mode] if fix is incomplete or incorrect."

**Anti-patterns:**
- Selecting generic/easy methods that would pass regardless of fix quality
- Selecting methods that verify only surface-level changes
- Avoiding methods that would require deep analysis

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

**If FAILED:**
- Review root cause analysis - was it correct?
- Consider [**D**] Deeper on original finding to understand better
- Try different fix approach
- For persistent failures: escalate to human review

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

---

## Navigation Detail

### Concerns

**What happens:** Go back to Step 2 to modify concerns list.

**Use when:**
- New area to verify discovered during verification
- Want to remove concern that proved irrelevant
- Need to split broad concern into specific ones

→ Returns to Step 2 with current concerns editable
→ After changes: re-run Step 3 (Methods) and Step 4 (Verify) for modified concerns only

### Methods

**What happens:** Re-run verification with different methods for same concerns.

**Use when:**
- Current methods didn't find expected issues
- Want deeper analysis with specialized methods
- Suspected blind spots in verification

→ Returns to Step 3 (Select Methods)
→ Keep existing findings, add new from re-verification

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

## Design Decisions

**Why these choices were made:**

| Decision | Reason |
|----------|--------|
| Single definition source (Key Concepts) | Prevents redundancy drift; other sections reference, not redefine |
| Procedural structure (not reference docs) | Workflow is executed step-by-step, not looked up randomly |
| MAB inline (not Phase 0) | v5 trades depth for simplicity; v6 uses upfront self-check |
| Evidence requirement (MSE) | Anchors findings to verifiable quotes; counters confirmation bias |
| User confirmation for 🔴 | Mitigates self-verification circularity for critical items |

**Known limitations:**
- Agent verifies agent work (circularity cannot be fully broken)
- MAB effectiveness depends on agent honesty
- Symptom-level findings may miss root causes (see v6 for depth analysis)

---

## Feedback

After using Deep Verify, consider:
- Did verification find issues you expected?
- Did it miss issues you later discovered?
- Were any findings false positives?

Track patterns over time to calibrate trust in Auto vs Guided mode.