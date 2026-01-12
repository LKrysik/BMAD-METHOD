# Deep Verify V6-Lite

## Core Principle

```
HONESTY → DEPTH → ROOT CAUSE → FIX
```

**What this is:** Streamlined V6 without Challenge phase. Keeps depth analysis, reduces token cost by ~20%.

**V6-Lite vs V6:**
- ✅ Phase 0 (Self-Check) — kept
- ✅ Multi-layer concerns — kept
- ✅ 5 Whys to root cause — kept
- ❌ Phase 5 (Challenge) — removed (findings go directly to Results)
- 🔄 Lower method volume (15-25 methods vs 25-35)

**When to use V6-Lite vs V6:**
| Use V6-Lite | Use Full V6 |
|-------------|-------------|
| Medium-stakes content | High-stakes / production |
| Token budget constrained | Quality over cost |
| Trusted agent | New/untested agent |
| Iterative verification | Final verification |

**Limitation:** Agent verifies agent work. Without Challenge phase, false positives may pass through. For critical content, consider full V6 or human review.

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
                  Phase 5: Results ←── Phase 4: Verify ←── Phase 3: Methods
                       ↓
                  Phase 6: Fix Root Cause
                       ↓
                  [Loop or Done]
```

**Phases:** 0 → 1 → 2 → 3 → 4 → 5 → 6 (7 phases total, vs 8 in full V6)

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

→ Auto proceed to Phase 1

---

## Phase 1: Inputs & Mode

**Purpose:** Confirm what we're verifying and how.

```
## Deep Verify V6-Lite

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

**Recommendation:** Use Guided [G] for first time or higher-stakes content.

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
| A: Content | #70, #71, #72, #73, #75 | Sanity checks on content |
| B: Structure | #79, #81, #117 | Structure analysis |
| C: Assumptions | #74, #146 | Assumption excavation |

**Additional:** Select 2-4 more methods based on TYPE and CONTENT specifics.

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
1. **Minimum 3 methods per concern**
2. **Category diversity:** Each concern must have methods from at least 2 different categories
3. **One critical method:** Each concern should have at least 1 method that challenges assumptions

```
## Methods per Concern

| Concern | Methods | Categories | Critical Method |
|---------|---------|------------|-----------------|
| A1 | #73, #56, #74 | sanity, challenge, sanity | #56 |
| B1 | #79, #107, #81 | coherence, exploration, coherence | #107 |
| C1 | #74, #146, #54 | sanity, exploration, anti-bias | #54 |

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

**Note:** Stop at the level where actionable root cause is found. Not all findings need 5 full iterations.

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
- Stopping at symptom without asking Why
- "Intentional" without proof of intention AND benefit
- Accepting redundancy without questioning necessity
- Analyzing only content, ignoring structure/assumptions

### Quick Validation (V6-Lite specific)

Since Challenge phase is omitted, perform quick self-check on each finding:

**For each finding, ask:**
1. Is there evidence this problem EXISTS? (quote + location)
2. Could this be a false positive? Why/why not?
3. Is the severity justified?

If any answer is uncertain → mark finding as [?] for user review.

---

## Phase 5: Results

**Purpose:** Summary of findings with depth levels and actions.

```
## Verification Results

TASK: [summary]
CONTENT: [summary]
Phases completed: 0-4

### Findings by Depth

| ID | Concern | Sev | Depth | Finding | Root Cause |
|----|---------|-----|-------|---------|------------|
| 1 | A1 | 🔴 | ROOT | [what] | [why] |
| 2 | B1 | 🟠 | STRUCTURE | [what] | [why] |

Depth legend: SYMPTOM → CAUSE → STRUCTURE → ASSUMPTION → ROOT_CAUSE

Status: 🔴 N / 🟠 N / 🟡 N / [?] N

### Token Usage
| Metric | Value |
|--------|-------|
| Input Tokens | [N] |
| Output Tokens | [N] |
| Total Tokens | [N] |
| Execution Time | [N] sek |

---

### Findings marked [?] (uncertain)
These findings skipped full challenge validation. User should verify:
| ID | Uncertainty reason |
|----|-------------------|
| [N] | [why uncertain] |

---

### Actions (per finding)
[F] Fix [ID] - fix ROOT CAUSE (recommended)
[E] Explain [ID] - explain problem and fix in detail before deciding
[P] Patch [ID] - fix SYMPTOM only (with warning)
[D] Deeper [ID] - investigate further
[R] Reject [ID] - mark as invalid
[V] Validate [ID] - run Challenge methods on uncertain finding

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

### When user selects [V] Validate (V6-Lite specific)

**Purpose:** Run Challenge methods on specific finding when uncertainty exists.

**Process:**
Apply these methods to the finding:

#### #110 Reductio Attack
"Assume this finding is WRONG. Build argument why it's invalid."
- If argument is convincing → finding needs revision
- If argument fails → finding is confirmed

#### #65 Abilene Paradox
"Does this problem ACTUALLY exist? Or am I finding problems where none exist?"
- Evidence it exists: [quote + location]
- Evidence it doesn't exist: [counter-evidence]
- Verdict: EXISTS / QUESTIONABLE / REJECTED

```
## Validation Result for Finding [ID]

Reductio survives: [Yes/No]
Abilene verdict: [Exists/Questionable/Rejected]

Status: CONFIRMED / REVISED / REJECTED
```

→ Return to Phase 5 Results with updated finding status

---

### When user selects [E] Explain

**Purpose:** User needs to understand the problem before deciding on action.

**Process:**

1. **Problem Description** (3-5 sentences)
   - WHAT is the problem (concrete, specific)
   - WHERE it occurs (quote + line number)
   - WHY it's a problem (impact on user/outcome)

2. **Evidence**
   ```
   Current text (line N): "[exact quote]"
   Issue: [what's wrong with this]
   ```

3. **Proposed Fix** (step by step)
   - WHAT will change
   - HOW it addresses the root cause (not just symptom)
   - WHAT the result will look like

4. **After Explanation**
   ```
   [F] Fix - proceed with this fix
   [A] Alternative - show different approach
   [Q] Question - ask clarifying question
   [B] Back - return to Results
   ```

→ Return to Phase 5 Results after user decision

---

## Phase 6: Fix Root Cause

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
Generate 2-3 different approaches to fix root cause:

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

**Step 4: Execute Fix**

**Step 5: Verify Fix**
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

→ Return to Phase 5 Results

**HALT** - waiting for next action

---

## Severity Levels

| Level | Symbol | Meaning | Action |
|-------|--------|---------|--------|
| CRITICAL | 🔴 | Blocks usage or causes harm | Must fix root cause |
| IMPORTANT | 🟠 | Significant issue | Should fix root cause |
| MINOR | 🟡 | Small issue | Can defer or patch |
| UNCERTAIN | [?] | Needs validation | User verify or use [V] |

---

## Depth Levels

| Level | Meaning | Example |
|-------|---------|---------|
| SYMPTOM | Visible problem | "TASK defined 3 times" |
| CAUSE | Immediate reason | "Each section redefines terms" |
| STRUCTURE | Organizational reason | "Document uses reference-docs pattern" |
| ASSUMPTION | Hidden belief | "Self-contained sections are good" |
| ROOT_CAUSE | Fundamental reason | "Wrong document pattern for procedure" |

**Goal:** Most findings should reach at least CAUSE or STRUCTURE level. ROOT_CAUSE for 🔴 critical findings.

---

## Error Handling

| Error | Recovery |
|-------|----------|
| Phase 0 reveals major honesty issue | Stop, acknowledge, restart with awareness |
| No concerns found at a layer | Re-run with different methods, or acknowledge layer is clean |
| Finding seems false positive | Use [V] Validate or [R] Reject with reason |
| Fix doesn't address root cause | Return to Phase 6 Step 2, try different approach |
| 5 Whys doesn't reach root cause | Accept current depth with note, or continue asking Why |

---

## Minimum Method Requirements

| Phase | Minimum Methods | Categories Required |
|-------|-----------------|---------------------|
| Phase 0 | 3 (#51, #53, #54) | anti-bias |
| Phase 2 | 8-10 (per layer guidance) | sanity, coherence, exploration |
| Phase 3 | 3 per concern | Must include 2+ categories |
| Phase 6 | 2+ | Appropriate for fix type |

**Total minimum: ~15-25 methods per verification**

**Comparison:**
| Version | Methods | Estimated Tokens |
|---------|---------|------------------|
| V5 | ~10-15 | ~2,700 |
| V6-Lite | ~15-25 | ~5,000 |
| V6 Full | ~25-35 | ~6,300 |

---

## Quick Reference

```
Phase 0: Am I being honest? (Liar's Trap, Confession, CUI BONO)
Phase 1: What am I verifying? (TASK, CONTENT, MODE)
Phase 2: What could be wrong? (Content, Structure, Assumptions)
Phase 3: How will I check? (Methods with diversity)
Phase 4: What IS wrong? (Surface → 5 Whys → Root Cause)
Phase 5: What will I do? (Results + optional Validation)
Phase 6: Did I fix the real problem? (Verify root cause addressed)
```

---

## V6-Lite vs V6 Decision Guide

**Choose V6-Lite when:**
- You trust the agent's findings without additional challenge
- Token budget is a concern
- Iterating quickly (will verify again later)
- Content is medium-stakes

**Upgrade to V6 Full when:**
- High false-positive rate observed
- Critical/production content
- Agent is new or untested
- Single verification opportunity (no iteration)

**Downgrade to V5 when:**
- Very low stakes
- Severe token constraints
- Quick sanity check only needed
- Familiar, well-understood content

---

## Changelog from V6

| Change | Rationale |
|--------|-----------|
| Removed Phase 5 (Challenge) | 20% token reduction, acceptable for medium-stakes |
| Added [?] uncertain marker | Flags findings that would benefit from Challenge |
| Added [V] Validate action | On-demand Challenge for specific findings |
| Reduced methods per concern (5→3) | Cost optimization |
| Reduced discovery methods | Cost optimization |
| Added Quick Validation in Phase 4 | Partial replacement for Challenge |
| Simplified depth goal | ROOT_CAUSE for critical only |
