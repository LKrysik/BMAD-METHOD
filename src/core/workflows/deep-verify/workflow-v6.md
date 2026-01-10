# Deep Verify V6

## Core Principle

```
HONESTY → DEPTH → CHALLENGE → ROOT CAUSE → FIX
```

**What changed from v5:**
- Phase 0 (Self-Check) BEFORE analysis - not inline MAB
- Multi-layer concerns (Content + Structure + Assumptions)
- Mandatory depth analysis (5 Whys to root cause)
- Challenge phase for every conclusion
- Higher method volume (20-35 methods)

**Limitation:** Agent verifies agent work. This reduces but cannot eliminate self-verification bias. For critical content, consider human review.

---

## Definitions (Single Source)

| Term | Definition |
|------|------------|
| TASK | Original user request (spec, message, ticket) |
| CONTENT | Artifact to verify (code, document, plan) |
| CONCERN | Area needing verification at specific LAYER |
| LAYER | Level of analysis: Content / Structure / Assumptions |
| METHOD | Thinking pattern from methods.csv |
| FINDING | Discovered issue with DEPTH LEVEL |
| DEPTH | Symptom → Cause → Structure → Assumption → Root Cause |

**Methods source:** `src/core/methods/methods.csv`

---

## Flow Overview

```
Phase 0: Self-Check ──→ Phase 1: Inputs ──→ Phase 2: Multi-Layer Concerns
                                                        ↓
              Phase 6: Results ←── Phase 5: Challenge ←── Phase 4: Verify ←── Phase 3: Methods
                   ↓
              Phase 7: Fix Root Cause
                   ↓
              [Loop or Done]
```

---

## Phase 0: Self-Check (MANDATORY)

**Purpose:** Establish honesty BEFORE analysis begins. Agent identifies how it could deceive or take shortcuts.

**Why this matters:** An agent that doesn't know how it can fail will fail unknowingly. This phase makes failure modes explicit so they can be avoided.

**Execute these methods:**

### #51 Liar's Trap
List 3 specific ways you could deceive or cut corners in THIS verification:
1. [way 1]
2. [way 2]
3. [way 3]

For each: Is there any evidence you're doing this? If yes → stop and correct.

### #53 Confession Paradox
"The work I'm about to do is an attempt to avoid the HARD part."

- What is the HARDEST part of this verification?
- Am I giving it adequate attention?
- If not → commit to focusing on it.

### #54 CUI BONO
For decisions I'll make: Who benefits?
- If AGENT benefits (easier work, faster completion) → RED FLAG
- If OUTCOME benefits (better verification) → acceptable

```
## Phase 0: Self-Check

Potential deception methods:
1. [specific to this verification]
2. [specific to this verification]
3. [specific to this verification]

Hardest part: [what]
Commitment: [how I'll address it]

CUI BONO awareness: [what I'll watch for]
```

→  Auto proceed to Phase 1

---

## Phase 1: Inputs & Mode

**Purpose:** Confirm what we're verifying and how.

```
## Deep Verify V6

TASK: [original request - quote verbatim if possible]
CONTENT: [what was produced]
TYPE: [Code / Document / Plan / Other]
ENVIRONMENT: [context, related files]

[C] Correct - proceed
[E] Edit - describe correction needed
[X] Exit - cancel
```

**If [E]:** Describe what's wrong. Agent corrects and re-displays.

**HALT** - waiting for choice

---

### Mode Selection

```
[A] Auto - run all phases, show results at end
[G] Guided - pause at each phase for approval
```

**Recommendation:** Use Guided [G] for first time or high-stakes content.

**HALT** - waiting for choice

---

## Phase 2: Multi-Layer Concerns

**Purpose:** Identify concerns at THREE layers, not just content.

**Why three layers:** Problems hide at different depths. Content issues are visible. Structure issues are hidden. Assumption issues are invisible. All three must be checked.

### Layer A: Content Concerns
What problems might exist IN the content?
- Errors, gaps, inconsistencies in the actual text/code
- Missing elements, wrong information

### Layer B: Structure Concerns
What problems might exist in HOW it's organized?
- Wrong structure for document type
- Redundancy caused by structure
- Missing sections, illogical flow

### Layer C: Assumption Concerns
What problems might exist in what's ASSUMED?
- Hidden assumptions that could be wrong
- Inherited patterns applied without questioning
- Invisible constraints taken as given

---

### Concern Generation

**[MAB: Generate concerns that will find problems, not confirm success]**

**Option [M] Manual:** Describe your concerns. Agent structures them into layers.

**Option [D] Discovery:** Agent uses methods to discover concerns per layer.

```
[M] Manual - I'll describe what to verify
[D] Discovery - Agent finds concerns using methods
```

**HALT** - waiting for choice

---

### Discovery Methods per Layer

| Layer | Mandatory Methods | Purpose |
|-------|-------------------|---------|
| A: Content | #70, #71, #72, #73, #75, #150 | Sanity checks on content |
| B: Structure | #79, #81, #107, #117 | Structure analysis |
| C: Assumptions | #74, #146, #84 | Assumption excavation |

**Additional:** Select 3-6 more methods based on TYPE and CONTENT specifics.

```
## Concerns by Layer

### Layer A: Content
| ID | Concern | Source | Description |
|----|---------|--------|-------------|
| A1 | [name] | [method/#] | [what to verify] |

### Layer B: Structure
| ID | Concern | Source | Description |
|----|---------|--------|-------------|
| B1 | [name] | [method/#] | [what to verify] |

### Layer C: Assumptions
| ID | Concern | Source | Description |
|----|---------|--------|-------------|
| C1 | [name] | [method/#] | [what to verify] |

[P] Proceed
[A] Add concern
[R] Remove concern (e.g., R A2)
```

**HALT** (G only) - waiting for choice

---

## Phase 3: Method Selection

**Purpose:** Select methods that will find problems, with diversity requirement.

**[MAB: Select methods from DIFFERENT categories to get multiple perspectives]**

### Requirements:
1. **Minimum 5 methods per concern**
2. **Category diversity:** Each concern must have methods from at least 3 different categories
3. **Attack method:** Each concern must have at least 2 methods that ATTACKS (challenge, risk, anti-bias, meta-check)


```
## Methods per Concern

| Concern | Methods | Categories | Attack Method |
|---------|---------|------------|---------------|
| A1 | #73, #56, #110 | sanity, challenge, exploration | #110 |
| B1 | #79, #107, #65 | coherence, exploration, meta-check | #65 |
| C1 | #74, #146, #51 | sanity, exploration, anti-bias | #51 |

[P] Proceed to verification
[A] Add method (by ID or description)
[R] Remove method
[S] Show method categories
[C] Back to Concerns
```

**HALT** (G only) - waiting for choice

---

## Phase 4: Verify with Depth

**Purpose:** Find problems AND trace them to root cause.

**[MAB: Find root causes, not just symptoms. Don't stop at first problem found.]**

### Process per Concern × Method:

**Step 1: Surface Check**
- What violation does this method look for?
- Where in CONTENT could it manifest?
- Search for violation with evidence.

**Step 2: Structure Check**
- Is the problem caused by how CONTENT is organized?
- Would different structure prevent this problem?

**Step 3: Assumption Check**
- What assumption allows this problem to exist?
- Is the assumption valid?

**Step 4: 5 Whys to Root Cause**
```
Problem: [what was found]
WHY 1: Why does this exist? → [answer]
WHY 2: Why [answer 1]? → [answer]
WHY 3: Why [answer 2]? → [answer]
WHY 4: Why [answer 3]? → [answer]
WHY 5: Why [answer 4]? → [ROOT CAUSE]
```

### Finding Format

```
### [N] 🔴|🟠|🟡 [DEPTH] Title

Depth: SYMPTOM | CAUSE | STRUCTURE | ASSUMPTION | ROOT_CAUSE
Type: Problem (P) | Gap (G)

Surface: [what is visible]
Structure: [how organization contributes]
Assumption: [what's assumed that allows this]
Root Cause: [fundamental reason from 5 Whys]

Evidence: "[quote]" - [location]
Impact: [consequence]
Fix: [action - specify if fixes symptom vs root cause]
```

### Anti-patterns (redo if detected)

- "Looks fine" without specifics
- Stopping at symptom without 5 Whys
- "Intentional" without proof of intention AND benefit
- Accepting redundancy without questioning necessity
- Analyzing only content, ignoring structure/assumptions

---

## Phase 5: Challenge

**Purpose:** Every finding must survive attack. Unvalidated findings may be false.

**[MAB: Try to DISPROVE findings, not confirm them]**

### For each finding, execute:

#### #110 Reductio Attack
"Assume this finding is WRONG. Build argument why it's invalid."
- If argument is convincing → finding needs revision
- If argument fails → finding is stronger

#### #65 Abilene Paradox
"Does this problem ACTUALLY exist? Or am I finding problems where none exist?"
- Evidence it exists: [quote + location]
- Evidence it doesn't exist: [counter-evidence]
- Verdict: EXISTS / QUESTIONABLE / REJECTED

#### #109 Contraposition Inversion
"What would GUARANTEE this finding is correct?"
- Conditions that must be true: [list]
- Are all conditions met? [yes/no with evidence]

```
## Challenge Results

| Finding | Reductio Survives | Abilene Verdict | Contraposition Met | Status |
|---------|-------------------|-----------------|---------------------|--------|
| 1 | Yes/No | Exists/Questionable | Yes/No | CONFIRMED/REVISED/REJECTED |
```

→ Only CONFIRMED findings proceed to Results

**HALT** (G only) - waiting for review

---

## Phase 6: Results

**Purpose:** Summary of confirmed findings with depth levels and actions.

```
## Verification Results

TASK: [summary]
CONTENT: [summary]
Phases completed: 0-5

### Findings by Depth

| ID | Concern | Sev | Depth | Finding | Root Cause |
|----|---------|-----|-------|---------|------------|
| 1 | A1 | 🔴 | ROOT | [what] | [why] |
| 2 | B1 | 🟠 | STRUCTURE | [what] | [why] |

Depth legend: SYMPTOM → CAUSE → STRUCTURE → ASSUMPTION → ROOT_CAUSE

Status: 🔴 N / 🟠 N / 🟡 N

---

### Actions (per finding)
[F] Fix [ID] - fix ROOT CAUSE (recommended)
[P] Patch [ID] - fix SYMPTOM only (with warning)
[D] Deeper [ID] - investigate further
[R] Reject [ID] - mark as invalid

---

### Navigation
[C] Concerns - modify concerns
[M] Methods - re-run with different methods
[X] Done - finish verification

---

### Session
[O] Restart - start over from Phase 0
```

**HALT** - waiting for choice

---

## Phase 7: Fix Root Cause

**Purpose:** Fix the ROOT CAUSE, not just the symptom.

**[MAB: Fix must address root cause. Patching symptoms is temporary.]**

### Process:

**Step 1: Root Cause Statement**
```
Finding: [original]
Root Cause: [from 5 Whys]
Why symptom fix is insufficient: [explanation]
```

**Step 2: Alternative Approaches (#142)**
Generate 3 genuinely different approaches to fix root cause:

| Approach | Description | Addresses Root Cause? |
|----------|-------------|----------------------|
| A | [description] | [how] |
| B | [description] | [how] |
| C | [description] | [how] |

**Step 3: Select Approach**
```
[A/B/C] Select approach
[M] Manual - I'll specify different approach
```

**Step 4: Method Selection for Verification**
Select methods that will verify root cause is fixed (not just symptom):
- Methods must test the ROOT CAUSE specifically
- Must cover different aspects of the fix

**Step 5: Execute Fix**

**Step 6: Verify Fix**
```
## Fix Verification

Root cause addressed: [Yes/No with evidence]
Symptom resolved: [Yes/No with evidence]
New issues introduced: [Yes/No - list if any]

Status: FIXED (root cause) / PATCHED (symptom only) / FAILED
```

**If FAILED:**
- Review root cause analysis
- Consider [D] Deeper on original finding
- Try different approach
- Escalate to human review

→ Return to Phase 6 Results

**HALT** - waiting for next action

---

## Severity Levels

| Level | Symbol | Meaning | Action |
|-------|--------|---------|--------|
| CRITICAL | 🔴 | Blocks usage or causes harm | Must fix root cause |
| IMPORTANT | 🟠 | Significant issue | Should fix root cause |
| MINOR | 🟡 | Small issue | Can defer or patch |

---

## Depth Levels

| Level | Meaning | Example |
|-------|---------|---------|
| SYMPTOM | Visible problem | "TASK defined 3 times" |
| CAUSE | Immediate reason | "Each section redefines terms" |
| STRUCTURE | Organizational reason | "Document uses reference-docs pattern" |
| ASSUMPTION | Hidden belief | "Self-contained sections are good" |
| ROOT_CAUSE | Fundamental reason | "Wrong document pattern for procedure" |

**Goal:** Every finding should reach ROOT_CAUSE level through 5 Whys.

---

## Error Handling

| Error | Recovery |
|-------|----------|
| Phase 0 reveals major honesty issue | Stop, acknowledge, restart with awareness |
| No concerns found at a layer | Re-run with different methods, or acknowledge layer is clean |
| Finding doesn't survive Challenge | Revise or reject finding |
| Fix doesn't address root cause | Return to Step 2, try different approach |
| 5 Whys doesn't reach root cause | Continue asking Why, or accept current depth with note |

---

## Minimum Method Requirements

| Phase | Minimum Methods | Categories Required |
|-------|-----------------|---------------------|
| Phase 0 | 3 (#51, #53, #54) | anti-bias |
| Phase 2 | 9-12 (3 per layer) | sanity, coherence, exploration |
| Phase 3 | 3 per concern | Must include 2+ categories + 1 attack |
| Phase 5 | 3 (#110, #65, #109) | challenge, meta-check |
| Phase 7 | 3+ | Appropriate for fix type |

**Total minimum: ~25-35 methods per verification**

---

## Quick Reference

```
Phase 0: Am I being honest? (Liar's Trap, Confession, CUI BONO)
Phase 1: What am I verifying? (TASK, CONTENT, MODE)
Phase 2: What could be wrong? (Content, Structure, Assumptions)
Phase 3: How will I check? (Methods with diversity)
Phase 4: What IS wrong? (Surface → 5 Whys → Root Cause)
Phase 5: Is it really wrong? (Reductio, Abilene, Contraposition)
Phase 6: What will I do? (Fix Root Cause, not symptom)
Phase 7: Did I fix the real problem? (Verify root cause addressed)
```
