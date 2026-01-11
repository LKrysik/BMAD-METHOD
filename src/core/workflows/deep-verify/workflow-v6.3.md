# Deep Verify V6.3

## Core Principle

```
HONESTY → DEPTH → CHALLENGE → ROOT CAUSE → FIX
```

**What changed from v6.2:**
- Added Consistency Protocol in Phase 4 (addresses FC=26.7% issue)
- Added IMPORTANT Error Focus to concern generation (addresses DR_important RS=-0.41)
- Added Redundant Verification requirement for CRITICAL/IMPORTANT findings
- Added Structured Failure Recovery for partial run failures
- Strengthened Layer D mandatory triggers

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
| STABLE FINDING | Finding detected in 2+ independent method applications |

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
## Deep Verify V6.3

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

### Layer D: Security/Privacy Concerns
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
- **Deletes, modifies, or expires data** (NEW in v6.3)
- **Has regulatory/compliance implications** (NEW in v6.3)

---

### IMPORTANT Error Focus (NEW in v6.3)

**Purpose:** IMPORTANT severity errors are often missed while CRITICAL errors are caught. Explicitly target the "important but not critical" zone.

**Before generating concerns, ask:**
1. What errors would be IMPORTANT (should be fixed) but not CRITICAL (must be fixed)?
2. What errors would a reviewer flag but not block release for?
3. What would cause problems in production but not crash the system?

**Generate at least 2 concerns specifically targeting IMPORTANT-severity issues:**
- Concerns about "good enough but not right" implementations
- Concerns about missing-but-not-blocking features
- Concerns about suboptimal but functional designs

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
| D: Security | #23, #35, #109, #54 | Security/Privacy analysis |

**Layer D Methods Detail:**
- **#23 Security Audit Personas**: Think as attacker, auditor, compliance officer
- **#35 Failure Mode Analysis**: How could security controls fail?
- **#109 Contraposition Inversion**: What guarantees security? What breaks it?
- **#54 CUI BONO (NEW)**: Who benefits from security being weak?

**Additional:** Select 3-6 more methods based on TYPE and CONTENT specifics.

```
## Concerns by Layer

### Layer A: Content
| ID | Concern | Source | Description | Targets IMPORTANT? |
|----|---------|--------|-------------|-------------------|
| A1 | [name] | [method/#] | [what to verify] | [Y/N] |

### Layer B: Structure
| ID | Concern | Source | Description | Targets IMPORTANT? |
|----|---------|--------|-------------|-------------------|
| B1 | [name] | [method/#] | [what to verify] | [Y/N] |

### Layer C: Assumptions
| ID | Concern | Source | Description | Targets IMPORTANT? |
|----|---------|--------|-------------|-------------------|
| C1 | [name] | [method/#] | [what to verify] | [Y/N] |

### Layer D: Security/Privacy
| ID | Concern | Source | Description | Targets IMPORTANT? |
|----|---------|--------|-------------|-------------------|
| D1 | [name] | [method/#] | [what to verify] | [Y/N] |

IMPORTANT-targeting concerns: [count] (minimum: 2)

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
4. **Security method:** Layer D concerns must include #23 Security Audit Personas
5. **Redundancy for IMPORTANT (NEW):** IMPORTANT-targeting concerns must have overlapping methods with at least one other concern


```
## Methods per Concern

| Concern | Methods | Categories | Attack Method | Overlaps With |
|---------|---------|------------|---------------|---------------|
| A1 | #73, #56, #110 | sanity, challenge, exploration | #110 | B1 (#73) |
| B1 | #79, #107, #65, #73 | coherence, exploration, meta-check, sanity | #65 | A1 (#73) |
| C1 | #74, #146, #51 | sanity, exploration, anti-bias | #51 | D1 (#51) |
| D1 | #23, #35, #109, #51 | security, risk, challenge, anti-bias | #109, #51 | C1 (#51) |

IMPORTANT-target overlap check: [PASS/FAIL]

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

### Consistency Protocol (NEW in v6.3)

**Purpose:** Ensure findings are reproducible, not artifacts of single method application.

**For each finding, track:**
1. **Discovery Method:** Which method first identified this?
2. **Confirming Methods:** Which other methods also surface this issue?
3. **Stability Rating:**
   - STABLE: Found by 2+ methods independently
   - UNSTABLE: Found by only 1 method

**Only STABLE findings should be reported as CONFIRMED. UNSTABLE findings should be marked NEEDS_CONFIRMATION.**

---

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

**Step 4: Security Check (for Layer D concerns)**
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

**Step 6: Stability Check (NEW in v6.3)**
```
Discovery method: #[number]
Confirming methods: #[list]
Stability: STABLE / UNSTABLE
```

### Finding Format

```
### [N] [SEV] [DEPTH] [STABILITY] Title

Depth: SYMPTOM | CAUSE | STRUCTURE | ASSUMPTION | ROOT_CAUSE
Type: Problem (P) | Gap (G)
Category: SCOPE | ASSUME | SKIP | SHALLOW | CONFLICT | INTEGRATE | EDGE | DEPEND | PERF | SECURE
Stability: STABLE | NEEDS_CONFIRMATION

Surface: [what is visible]
Structure: [how organization contributes]
Assumption: [what's assumed that allows this]
Security: [security/privacy implications - MANDATORY for SECURE category]
Root Cause: [fundamental reason from 5 Whys]

Evidence: "[quote]" - [location]
Impact: [consequence]
Fix: [action - specify if fixes symptom vs root cause]

Discovery: #[method]
Confirmed by: #[methods] or UNCONFIRMED
```

### Anti-patterns (redo if detected)

- "Looks fine" without specifics
- Stopping at symptom without 5 Whys
- "Intentional" without proof of intention AND benefit
- Accepting redundancy without questioning necessity
- Analyzing only content, ignoring structure/assumptions
- Skipping Layer D for artifacts with security implications
- "No security concerns" without explicit security analysis
- **Reporting UNSTABLE findings as CONFIRMED** (NEW)
- **Skipping IMPORTANT-targeting concerns** (NEW)

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

#### Stability Verification (NEW in v6.3)
"Is this finding reproducible?"
- Discovery method: #[number]
- Confirming methods: #[list] or NONE
- If NONE: Attempt to confirm with 2 additional methods
- After attempt: STABLE / STILL_UNSTABLE

```
## Challenge Results

| Finding | Reductio Survives | Abilene Verdict | Contraposition Met | Stability | Status |
|---------|-------------------|-----------------|---------------------|-----------|--------|
| 1 | Yes/No | Exists/Questionable | Yes/No | STABLE/UNSTABLE | CONFIRMED/NEEDS_WORK/REJECTED |
```

**Status determination:**
- CONFIRMED: Survives all challenges AND STABLE
- NEEDS_WORK: Survives challenges BUT UNSTABLE → attempt confirmation
- REJECTED: Fails challenges OR remains UNSTABLE after confirmation attempt

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

| ID | Concern | Sev | Depth | Category | Stability | Finding | Root Cause |
|----|---------|-----|-------|----------|-----------|---------|------------|
| 1 | A1 | CRIT | ROOT | CONFLICT | STABLE | [what] | [why] |
| 2 | B1 | IMP | STRUCTURE | ASSUME | STABLE | [what] | [why] |
| 3 | D1 | IMP | CAUSE | SECURE | STABLE | [what] | [why] |

Depth legend: SYMPTOM → CAUSE → STRUCTURE → ASSUMPTION → ROOT_CAUSE
Category: SCOPE, ASSUME, SKIP, SHALLOW, CONFLICT, INTEGRATE, EDGE, DEPEND, PERF, SECURE
Stability: All findings STABLE (confirmed by 2+ methods)

Status: CRITICAL N / IMPORTANT N / MINOR N

### Unconfirmed Findings (for transparency)
| ID | Concern | Sev | Finding | Why Unconfirmed |
|----|---------|-----|---------|-----------------|
| U1 | [x] | [x] | [what] | [single method / failed challenge] |

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

## Failure Recovery Protocol (NEW in v6.3)

**Purpose:** Handle partial failures gracefully to maximize valid data from each run.

### Run Failure Types

| Type | Symptom | Recovery |
|------|---------|----------|
| Input Failure | CONTENT not received/parsed | Retry with explicit content injection |
| Method Failure | Method returns no output | Substitute with similar method from same category |
| Challenge Failure | Challenge phase crashes | Complete with available findings, mark incomplete |
| Partial Timeout | Run exceeds time limit | Save progress, resume from last complete phase |

### Partial Run Protocol

When a run fails partially:
1. **Document failure point:** Which phase, which step
2. **Salvage valid findings:** Any CONFIRMED findings before failure are still valid
3. **Mark run as PARTIAL:** Include in analysis with reduced weight (0.5× instead of 1×)
4. **Require additional run:** If <2 complete runs, add another run

### Inter-Run Consistency

After all runs complete:
1. **Identify consistent findings:** Present in 2+ runs
2. **Identify variable findings:** Present in only 1 run
3. **Report FC (Finding Consistency):** consistent / total unique
4. **If FC < 50%:** Flag results as UNRELIABLE, recommend additional runs

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
| Finding is UNSTABLE after confirmation attempt | Move to Unconfirmed section, do not report as confirmed |
| Run fails partially | Apply Failure Recovery Protocol |

---

## Minimum Method Requirements

| Phase | Minimum Methods | Categories Required |
|-------|-----------------|---------------------|
| Phase 0 | 3 (#51, #53, #54) | anti-bias |
| Phase 2 | 14-18 (3-5 per layer) | sanity, coherence, exploration, security |
| Phase 3 | 5 per concern | Must include 2+ categories + 1 attack + overlap |
| Phase 4 | 2+ per finding (for stability) | Same as Phase 3 |
| Phase 5 | 3 (#110, #65, #109) + stability check | challenge, meta-check |
| Phase 7 | 3+ | Appropriate for fix type |

**Total minimum: ~30-45 methods per verification**

---

## Quick Reference

```
Phase 0: Am I being honest? (Liar's Trap, Confession, CUI BONO)
Phase 1: What am I verifying? (TASK, CONTENT, MODE)
Phase 2: What could be wrong? (Content, Structure, Assumptions, Security + IMPORTANT focus)
Phase 3: How will I check? (Methods with diversity + overlap)
Phase 4: What IS wrong? (Surface → 5 Whys → Root Cause → Stability check)
Phase 5: Is it really wrong? (Reductio, Abilene, Contraposition + Stability verification)
Phase 6: What will I do? (Fix Root Cause, not symptom)
Phase 7: Did I fix the real problem? (Verify root cause addressed)
```

---

## Version History

| Version | Change | Rationale |
|---------|--------|-----------|
| v6 | Base multi-layer workflow | - |
| v6.2 | Added Layer D (Security/Privacy) | SECURE category 0% detection across EXP-001, EXP-002, EXP-003 |
| v6.3 | Added Consistency Protocol, IMPORTANT focus, Failure Recovery | FC=26.7%, DR_important RS=-0.41 in EXP-003 |

### v6.3 Changes Summary
```
From workflow-v6.2.md → workflow-v6.3.md:
1. Added Consistency Protocol in Phase 4 (STABLE/UNSTABLE findings)
2. Added IMPORTANT Error Focus in Phase 2 (targets IMPORTANT-severity issues)
3. Added Redundant Verification requirement (overlapping methods)
4. Added Stability Verification in Phase 5
5. Added Unconfirmed Findings section in Phase 6 Results
6. Added Failure Recovery Protocol (handles partial run failures)
7. Added Inter-Run Consistency tracking
8. Extended Layer D mandatory triggers (delete/expire data, compliance)
9. Added #54 CUI BONO to Layer D methods
10. Updated minimum methods: 30-45 (was 28-40)
```
