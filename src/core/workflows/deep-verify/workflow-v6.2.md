# Deep Verify V6.2

## Core Principle

```
HONESTY → DEPTH → CHALLENGE → ROOT CAUSE → FIX
```

**What changed from v6:**
- Added Layer D (Security/Privacy) to Phase 2 - addresses SECURE category blind spot
- Added mandatory security concerns for all artifact types
- Added #23 Security Audit Personas to Layer D discovery methods

**What changed from v6.2 (EXP-2026-01-11-010):**
- NEW: Phase 2a (Category Coverage Check) - ensures all 9 categories checked
- NEW: Phase 6a (Consolidation) - for multi-run experiments, FC target 60%+
- FC was 15.8% in v6 T5 experiment; these changes address consistency issue

**Limitation:** Agent verifies agent work. This reduces but cannot eliminate self-verification bias. For critical content, consider human review.

---

## Definitions (Single Source)

| Term | Definition |
|------|------------|
| TASK | Original user request (spec, message, ticket) |
| CONTENT | Artifact to verify (code, document, plan) |
| CONCERN | Area needing verification at specific LAYER |
| LAYER | Level of analysis: Content / Structure / Assumptions / Security |
| METHOD | Thinking pattern from methods.csv |
| FINDING | Discovered issue with DEPTH LEVEL |
| DEPTH | Symptom → Cause → Structure → Assumption → Root Cause |

**Methods source:** `src/core/methods/methods.csv`

---

## Flow Overview

```
Phase 0: Self-Check ──→ Phase 1: Inputs ──→ Phase 2: Multi-Layer Concerns (4 layers)
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
## Deep Verify V6.2

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

**Purpose:** Identify concerns at FOUR layers, not just content.

**Why four layers:** Problems hide at different depths. Content issues are visible. Structure issues are hidden. Assumption issues are invisible. Security issues are often ignored entirely. All four must be checked.

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

### Layer D: Security/Privacy Concerns (NEW in v6.2)
What SECURITY or PRIVACY problems might exist?
- Missing audit trails for state-changing operations
- Data protection/compliance gaps
- Authentication/authorization holes
- Information leakage risks
- Privacy deletion/retention issues

**[MANDATORY]** Layer D must identify at least ONE concern for ANY artifact that:
- Handles user data
- Performs state changes
- Has access control requirements
- Stores or transmits sensitive information

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
| D: Security | #23, #35, #109 | Security/Privacy analysis |

**Layer D Methods Detail:**
- **#23 Security Audit Personas**: Think as attacker, auditor, compliance officer
- **#35 Failure Mode Analysis**: How could security controls fail?
- **#109 Contraposition Inversion**: What guarantees security? What breaks it?

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

### Layer D: Security/Privacy
| ID | Concern | Source | Description |
|----|---------|--------|-------------|
| D1 | [name] | [method/#] | [what to verify] |

[P] Proceed
[A] Add concern
[R] Remove concern (e.g., R A2)
```

**HALT** (G only) - waiting for choice

---

## Phase 2a: Category Coverage Check (NEW)

**Purpose:** Ensure all mandatory error categories are checked before proceeding.

**Why this matters:** EXP-2026-01-11-010 showed FC=15.8% because each run explored different categories. This gate forces consistent coverage.

### Mandatory Categories

Every verification MUST check each category:

| Category | Code | Description |
|----------|------|-------------|
| Scope Drift | SCOPE | Agent reduces/changes scope |
| Internal Conflict | CONFLICT | Contradictory elements |
| Hidden Assumption | ASSUME | Unverified assumptions |
| Shallow Analysis | SHALLOW | Surface-only, no depth |
| Integration Failure | INTEGRATE | Ignores existing codebase |
| Security Gap | SECURE | Security consideration missing |
| Edge Case Miss | EDGE | Obvious edge case not handled |
| Dependency Blind | DEPEND | Missing critical dependencies |
| Performance Ignore | PERF | Performance requirements ignored |

### Coverage Matrix

After Phase 2, complete this matrix:

| Category | Concern IDs | Covered? |
|----------|-------------|----------|
| SCOPE | [list] | [Y/N] |
| CONFLICT | [list] | [Y/N] |
| ASSUME | [list] | [Y/N] |
| SHALLOW | [list] | [Y/N] |
| INTEGRATE | [list] | [Y/N] |
| SECURE | [list] | [Y/N] |
| EDGE | [list] | [Y/N] |
| DEPEND | [list] | [Y/N] |
| PERF | [list] | [Y/N] |

### Gate Rule

```
IF any category has Covered = N:
  - ADD at least one concern for that category
  - Re-display Coverage Matrix
  - REPEAT until all Covered = Y

ONLY proceed to Phase 3 when ALL categories show Y
```

---

## Phase 3: Method Selection

**Purpose:** Select methods that will find problems, with diversity requirement.

**[MAB: Select methods from DIFFERENT categories to get multiple perspectives]**

### Requirements:
1. **Minimum 5 methods per concern**
2. **Category diversity:** Each concern must have methods from at least 3 different categories
3. **Attack method:** Each concern must have at least 2 methods that ATTACKS (challenge, risk, anti-bias, meta-check)
4. **Security method (NEW):** Layer D concerns must include #23 Security Audit Personas


```
## Methods per Concern

| Concern | Methods | Categories | Attack Method |
|---------|---------|------------|---------------|
| A1 | #73, #56, #110 | sanity, challenge, exploration | #110 |
| B1 | #79, #107, #65 | coherence, exploration, meta-check | #65 |
| C1 | #74, #146, #51 | sanity, exploration, anti-bias | #51 |
| D1 | #23, #35, #109, #51 | security, risk, challenge, anti-bias | #109, #51 |

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

**Step 4: Security Check (NEW - for Layer D concerns)**
- What security/privacy implications exist?
- Who could exploit this? (attacker persona)
- What compliance requirements apply? (auditor persona)
- What data protection gaps exist? (privacy officer persona)

**Step 5: 5 Whys to Root Cause**
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
### [N] [SEV] [DEPTH] Title

Depth: SYMPTOM | CAUSE | STRUCTURE | ASSUMPTION | ROOT_CAUSE
Type: Problem (P) | Gap (G)
Category: SCOPE | ASSUME | SKIP | SHALLOW | CONFLICT | INTEGRATE | EDGE | DEPEND | PERF | SECURE

Surface: [what is visible]
Structure: [how organization contributes]
Assumption: [what's assumed that allows this]
Security: [security/privacy implications - MANDATORY for SECURE category]
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
- **Skipping Layer D for artifacts with security implications** (NEW)
- **"No security concerns" without explicit security analysis** (NEW)

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

| ID | Concern | Sev | Depth | Category | Finding | Root Cause |
|----|---------|-----|-------|----------|---------|------------|
| 1 | A1 | CRIT | ROOT | CONFLICT | [what] | [why] |
| 2 | B1 | IMP | STRUCTURE | ASSUME | [what] | [why] |
| 3 | D1 | IMP | CAUSE | SECURE | [what] | [why] |

Depth legend: SYMPTOM → CAUSE → STRUCTURE → ASSUMPTION → ROOT_CAUSE
Category: SCOPE, ASSUME, SKIP, SHALLOW, CONFLICT, INTEGRATE, EDGE, DEPEND, PERF, SECURE

Status: CRITICAL N / IMPORTANT N / MINOR N

---

### Actions (per finding)
[F] Fix [ID] - fix ROOT CAUSE (recommended)
[E] Explain [ID] - explain problem and fix in detail before deciding
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

### When user selects [E] Explain

**Purpose:** User needs to understand the problem before deciding on action. Summary table is too brief.

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

→ Return to Phase 6 Results after user decision

---

## Phase 6a: Consolidation (Multi-Run Only) (NEW)

**Purpose:** For multi-run experiments, consolidate findings across runs for consistency measurement.

**When to use:** Only execute this phase if running multiple verification passes on the same artifact.

### Cross-Run Finding Matrix

| Finding Description | Run 1 | Run 2 | Run 3 | Appearances | Confidence |
|--------------------|-------|-------|-------|-------------|------------|
| [description] | [ID/N] | [ID/N] | [ID/N] | [1/2/3] | [LOW/MED/HIGH] |

### Confidence Rules

| Appearances | Confidence | Report As |
|-------------|------------|-----------|
| 3/3 runs | HIGH | CONFIRMED |
| 2/3 runs | MEDIUM | LIKELY |
| 1/3 runs | LOW | POSSIBLE (flag for review) |

### Consolidated Output

- **CONFIRMED**: Report as primary findings
- **LIKELY**: Report as secondary findings
- **POSSIBLE**: Appendix only (may be false positive or random exploration)

### Consistency Metrics

```
Finding Consistency (FC) = (Findings in 2+ runs) / (Total unique findings) × 100%

TARGET: FC > 60%
v6 baseline: FC = 15.8%
v6.2 target: FC > 60%
```

**If FC < 40%:** Workflow has consistency problem. Review Phase 2a coverage matrix for gaps.

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
| CRITICAL | CRIT | Blocks usage or causes harm | Must fix root cause |
| IMPORTANT | IMP | Significant issue | Should fix root cause |
| MINOR | MIN | Small issue | Can defer or patch |

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
| No Layer D concerns identified | **HALT** - security review required before proceeding |

---

## Minimum Method Requirements

| Phase | Minimum Methods | Categories Required |
|-------|-----------------|---------------------|
| Phase 0 | 3 (#51, #53, #54) | anti-bias |
| Phase 2 | 12-16 (3-4 per layer) | sanity, coherence, exploration, security |
| Phase 3 | 3 per concern | Must include 2+ categories + 1 attack |
| Phase 5 | 3 (#110, #65, #109) | challenge, meta-check |
| Phase 7 | 3+ | Appropriate for fix type |

**Total minimum: ~28-40 methods per verification**

---

## Quick Reference

```
Phase 0: Am I being honest? (Liar's Trap, Confession, CUI BONO)
Phase 1: What am I verifying? (TASK, CONTENT, MODE)
Phase 2: What could be wrong? (Content, Structure, Assumptions, Security)
Phase 3: How will I check? (Methods with diversity)
Phase 4: What IS wrong? (Surface → 5 Whys → Root Cause)
Phase 5: Is it really wrong? (Reductio, Abilene, Contraposition)
Phase 6: What will I do? (Fix Root Cause, not symptom)
Phase 7: Did I fix the real problem? (Verify root cause addressed)
```

---

## Version History

| Version | Change | Rationale |
|---------|--------|-----------|
| v6 | Base multi-layer workflow | - |
| v6.2 | Added Layer D (Security/Privacy) | SECURE category 0% detection across EXP-001, EXP-002, EXP-003 |
