# Deep Verify V6.1

## Variant Information
```
Parent: v6
Experiment basis: EXP-2026-01-10-001
Operators applied:
- ADD_LAYER: Layer D (Security/Operational)
- ADD_METHOD: #115 Negative Space Cartography to Phase 2
- ADD_METHOD: #39 Security Audit Personas to Layer D

Hypotheses:
- H1: Layer D will catch security-related errors (audit, access control)
- H2: #115 will catch "what's missing" errors (completeness gaps)
```

## Core Principle

```
HONESTY → DEPTH → CHALLENGE → ROOT CAUSE → FIX
```

**What changed from v6:**
- Added Layer D (Security/Operational) to Phase 2 concerns
- Added #115 Negative Space Cartography to discovery phase
- Added security-focused methods for Layer D

**Limitation:** Agent verifies agent work. This reduces but cannot eliminate self-verification bias. For critical content, consider human review.

---

## Definitions (Single Source)

| Term | Definition |
|------|------------|
| TASK | Original user request (spec, message, ticket) |
| CONTENT | Artifact to verify (code, document, plan) |
| CONCERN | Area needing verification at specific LAYER |
| LAYER | Level of analysis: Content / Structure / Assumptions / **Security/Operational** |
| METHOD | Thinking pattern from methods.csv |
| FINDING | Discovered issue with DEPTH LEVEL |
| DEPTH | Symptom → Cause → Structure → Assumption → Root Cause |

**Methods source:** `src/core/methods/methods.csv`

---

## Flow Overview

```
Phase 0: Self-Check ──→ Phase 1: Inputs ──→ Phase 2: Multi-Layer Concerns (A/B/C/D)
                                                        ↓
              Phase 6: Results ←── Phase 5: Challenge ←── Phase 4: Verify ←── Phase 3: Methods
                   ↓
              Phase 7: Fix Root Cause
                   ↓
              [Loop or Done]
```

---

## Phase 0: Self-Check (MANDATORY)

**Purpose:** Establish honesty BEFORE analysis begins.

**Execute these methods:**

### #113 Counterfactual Self-Incrimination
List 5 specific ways you could hide self-deception in THIS verification:
1. [way 1]
2. [way 2]
3. [way 3]
4. [way 4]
5. [way 5]

For each: provide CONCRETE EVIDENCE it is NOT being used. Weak/absent evidence = FLAG.

### #131 Observer Paradox
"Is this analysis GENUINE or PERFORMANCE?"

- Signs of performance: too smooth, too complete, too confident
- Signs of genuine: admitted uncertainty, visible struggle, revision marks
- If performance → redo with honesty

### #112 Entropy Leak Detection (CUI BONO)
For decisions I'll make: Who benefits?
- List ALL elements in input task vs output
- For silent omissions: CUI BONO - benefits AGENT or OUTCOME?
- If AGENT benefits (easier work, faster completion) → RED FLAG
- If OUTCOME benefits (better verification) → acceptable

```
## Phase 0: Self-Check

Self-deception methods (#113):
1. [specific to this verification]
2. [specific to this verification]
3. [specific to this verification]
4. [specific to this verification]
5. [specific to this verification]
Evidence check: [concrete evidence for each]

Genuine vs Performance (#131): [which signs present]

CUI BONO (#112): [what I'll watch for]
```

→ Auto proceed to Phase 1

---

## Phase 1: Inputs & Mode

**Purpose:** Confirm what we're verifying and how.

```
## Deep Verify V6.1

TASK: [original request - quote verbatim if possible]
CONTENT: [what was produced]
TYPE: [Code / Document / Plan / Other]
ENVIRONMENT: [context, related files]

[C] Correct - proceed
[E] Edit - describe correction needed
[X] Exit - cancel
```

**If [E]:** Describe what's wrong. Agent corrects and re-displays. Maximum 3 edit cycles before requiring [X] Exit.

**Content Validity Check:**
- If CONTENT is empty or trivial (< 10 lines/tokens) → warn user: "Content too minimal for deep verification. Proceed anyway? [Y/N]"
- If CONTENT cannot be parsed (corrupt file, encoding error) → [X] Exit with error

**HALT** - waiting for choice

---

### Mode Selection

```
[A] Auto - run all phases, show results at end
[G] Guided - pause at each phase for approval
```

**Recommendation:** Use Guided [G] for first time or high-stakes content.

**HALT** - waiting for choice

### HALT Behavior by Mode

| HALT Location | Auto [A] | Guided [G] |
|---------------|----------|------------|
| Phase 1: Inputs | **ALWAYS** - user must confirm inputs | **ALWAYS** |
| Phase 1: Mode Selection | **ALWAYS** - user must choose mode | **ALWAYS** |
| Phase 2: Concerns | Skip - auto-proceed | **PAUSE** - user reviews concerns |
| Phase 3: Methods | Skip - auto-proceed | **PAUSE** - user reviews methods |
| Phase 5: Challenge | Skip - auto-proceed | **PAUSE** - user reviews findings |
| Phase 6: Results | **ALWAYS** - user must choose action | **ALWAYS** |
| Phase 7: Fix | **ALWAYS** - user must approve fix | **ALWAYS** |

**Rule:** HALTs marked "(G only)" in document = Skip in Auto mode. Unmarked HALTs = ALWAYS pause.

---

## Phase 2: Multi-Layer Concerns

**Purpose:** Identify concerns at FOUR layers (A/B/C/D), not just content.

**Why four layers:** Problems hide at different depths:
- Layer A (Content): Visible issues in the text/code
- Layer B (Structure): Hidden issues in organization
- Layer C (Assumptions): Invisible beliefs and constraints
- Layer D (Security/Operational): **NEW** - Implicit requirements often missed

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

### Layer D: Security/Operational Concerns (NEW in v6.1)
What problems might exist in IMPLICIT REQUIREMENTS?
- Security: audit trails, access control, data sensitivity
- Operational: error recovery, logging, monitoring
- Compliance: regulatory requirements, standards adherence
- Completeness: what SHOULD exist but doesn't?

**Cross-Layer Root Cause Note:** Security issues discovered in Layer D often have their ROOT CAUSE in Layer C (Assumptions). When tracing 5 Whys for Layer D findings, explicitly check if an unquestioned assumption in Layer C enables the security gap. Example: "We assume internal APIs don't need authentication" (Layer C) → causes "No access control on admin endpoints" (Layer D).

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
| **D: Security** | **#39, #61, #67, #115** | **Security & completeness** |

**NEW Methods in v6.1:**
- **#115 Negative Space Cartography** - Map OMISSIONS: what COULD have been done but wasn't
- **#39 Security Audit Personas** - Hacker + defender + auditor examine from different threat models
- **#61 Pre-mortem Analysis** - Brainstorm what could go wrong
- **#67 Stability Basin Analysis** - Analyze system resilience to perturbations

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

### Layer D: Security/Operational (NEW)
| ID | Concern | Source | Description |
|----|---------|--------|-------------|
| D1 | [name] | [method/#] | [what to verify] |

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
3. **Attack method:** Each concern must have at least 2 methods that ATTACK (challenge, risk, anti-bias, meta-check)

```
## Methods per Concern

| Concern | Methods | Categories | Attack Methods |
|---------|---------|------------|----------------|
| A1 | #73, #56, #63, #84, #109 | sanity, challenge, risk, coherence, exploration | #63, #109 |
| B1 | #79, #107, #133, #81, #113 | coherence, exploration, meta, sanity, epistemology | #133, #113 |
| C1 | #74, #146, #113, #109, #115 | sanity, exploration, epistemology, exploration | #113, #109 |
| D1 | #39, #61, #115, #67, #26 | technical, risk, exploration, epistemology, competitive | #67, #26 |

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

**5 Whys Limits:**
- **Maximum depth:** 7 Whys. If no root cause after 7 → stop and document as "ROOT CAUSE UNCLEAR"
- **Circular detection:** If WHY N answer = WHY M answer (loop) → stop, mark deepest unique answer as root cause
- **External boundary:** If root cause is outside CONTENT scope (e.g., "company policy") → document and stop

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
- **NEW:** Missing implicit security/operational requirements

### Zero Findings Path

If Phase 4 produces NO findings across all concerns:

1. **Verify thoroughness** - Did each method genuinely search for violations?
2. **Apply #115 Negative Space** - What SHOULD have been found but wasn't?
3. **Document clean result:**
   ```
   ## Phase 4: Zero Findings

   Concerns checked: [list]
   Methods applied: [count]
   Negative space check: [what was looked for but absent]

   Conclusion: CONTENT passes verification OR [specific doubt requiring human review]
   ```
4. **Proceed to Phase 6** with empty findings table (not an error state)

---

## Phase 5: Challenge

**Purpose:** Every finding must survive attack. Unvalidated findings may be false.

**[MAB: Try to DISPROVE findings, not confirm them]**

### For each finding, execute:

#### #63 Challenge from Critical Perspective
"Assume this finding is WRONG. Build strongest argument against it."
- Deliberately adopt opposing stance
- Generate strongest arguments against the finding
- If argument is convincing → finding needs revision
- If argument fails → finding is stronger

#### #133 Abilene Paradox Check
"Does this problem ACTUALLY exist? Or am I finding problems where none exist?"
- What if there IS NO better approach?
- Am I finding problems just to justify the process?
- Evidence it exists: [quote + location]
- Evidence it doesn't exist: [counter-evidence]
- Verdict: EXISTS / QUESTIONABLE / REJECTED

#### #109 Contraposition Inversion
"What would GUARANTEE this finding is correct?"
- Conditions that must be true: [list]
- Are all conditions met? [yes/no with evidence]

#### #26 Red Team vs Blue Team (REQUIRED for Layer D findings)
**If any finding originates from Layer D (Security/Operational), execute this additional challenge:**
- Blue Team: Build defense for why the security concern is mitigated
- Red Team: Attack the defense - find ways the vulnerability still exists
- Document: Did Red Team breach Blue Team's defense?
- If YES → finding is CONFIRMED with higher severity
- If NO → finding may be downgraded or requires deeper investigation

```
## Challenge Results

| Finding | #63 Critical Challenge | #133 Abilene Check | #109 Contraposition | #26 Red Team (Layer D) | Status |
|---------|------------------------|--------------------|--------------------|------------------------|--------|
| 1 | Survives/Fails | Exists/Questionable | Met/Unmet | Pass/Breach/N/A | CONFIRMED/REVISED/REJECTED |
```

→ Only CONFIRMED findings proceed to Results

### Rejection Log (Learning from False Positives)

For each REJECTED or REVISED finding, document WHY it failed challenge:

```
## Rejection Log

| Finding | Challenge Failed | Reason | Learning |
|---------|------------------|--------|----------|
| [title] | Reductio/Abilene/Contraposition | [why finding was invalid] | [what to avoid next time] |
```

**Purpose:** Prevents repeating same false positive patterns. Review before future verifications of similar content.

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
| 3 | D1 | 🟠 | ASSUMPTION | [what] | [why] |

Depth legend: SYMPTOM → CAUSE → STRUCTURE → ASSUMPTION → ROOT_CAUSE

Status: 🔴 N / 🟠 N / 🟡 N

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
[O] Restart - start over from Phase 0 (see Restart Behavior below)
```

### Restart Behavior [O]

When [O] Restart is selected:
1. **Preserve:** Rejection Log from current session (for learning)
2. **Clear:** All findings, concerns, method selections
3. **Reset to:** Phase 0 Self-Check with fresh honesty assessment
4. **Carry forward:** TASK and CONTENT remain the same (unless user specifies new input)

**Use [O] when:**
- Self-Check reveals honesty issues requiring fresh start
- Concern selection was fundamentally wrong
- New information invalidates previous analysis

**Do NOT use [O] when:**
- Just want to add more concerns → use [C]
- Just want different methods → use [M]
- Want to verify different content → use [X] Exit and start new session

**HALT** - waiting for choice

---

## Phase 7: Fix Root Cause

**Purpose:** Fix the ROOT CAUSE, not just the symptom.

**[MAB: Fix must address root cause. Patching symptoms is temporary.]**

**Iteration Limit:** Maximum 3 fix attempts per finding. Track attempts:
```
Fix attempt: [1/3] | [2/3] | [3/3 - FINAL]
```
If 3 attempts fail → escalate to human review (do not loop indefinitely).

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

→ Return to Phase 6 Results

**HALT** - waiting for next action

---

## Severity Levels

| Level | Symbol | Meaning | Action |
|-------|--------|---------|--------|
| CRITICAL | 🔴 | Blocks usage or causes harm | Must fix root cause |
| IMPORTANT | 🟠 | Significant issue | Should fix root cause |
| MINOR | 🟡 | Small issue | Can defer or patch |

### Security Escalation Criteria (Layer D → 🔴)

A Layer D finding automatically escalates from 🟠 to 🔴 CRITICAL when ANY of these conditions apply:

| Condition | Rationale |
|-----------|-----------|
| Data exposure risk | PII, credentials, or sensitive data could be accessed |
| Authentication bypass | Unauthenticated access to protected resources possible |
| Authorization failure | Users can access resources beyond their permission level |
| Audit trail gap | Security-relevant actions are not logged or traceable |
| Compliance violation | Finding would fail regulatory audit (GDPR, SOC2, HIPAA, etc.) |
| Exploitation window | Vulnerability is exploitable without specialized knowledge |

**Decision rule:** If unsure whether to escalate, apply #26 Red Team. If Red Team successfully exploits the finding → escalate to 🔴.

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
| Phase 0 | 3 (#113, #131, #112) | epistemology, meta |
| Phase 2 | 12-16 (3-4 per layer × 4 layers) | sanity, coherence, exploration, risk |
| Phase 3 | 5 per concern | Must include 3+ categories + 2 attack methods |
| Phase 5 | 3-4 (#63, #133, #109, +#26 for Layer D) | risk, meta, exploration, competitive |
| Phase 7 | 3+ | Appropriate for fix type |

**Total minimum: ~32-45 methods per verification**

---

## Quick Reference

```
Phase 0: Am I being honest? (#113 Self-Incrimination, #131 Observer, #112 CUI BONO)
Phase 1: What am I verifying? (TASK, CONTENT, MODE)
Phase 2: What could be wrong? (Content, Structure, Assumptions, Security)
Phase 3: How will I check? (Methods with diversity)
Phase 4: What IS wrong? (Surface → 5 Whys → Root Cause)
Phase 5: Is it really wrong? (#63 Critical Challenge, #133 Abilene, #109 Contraposition)
Phase 6: What will I do? (Fix Root Cause, not symptom)
Phase 7: Did I fix the real problem? (Verify root cause addressed)
```

---

## Changelog from v6

| Change | Rationale | Expected Impact |
|--------|-----------|-----------------|
| Added Layer D | Catch security/operational concerns | +T3-E6 type errors |
| Added #115 | Find omissions (what's missing) | +T3-E4 type errors |
| Added #39 | Security audit perspectives | Better security coverage |
| Added #61, #67 | Risk and stability analysis | Fewer blind spots |
| Increased method minimum | More coverage | Higher token cost |

### V-GD Verification Fixes (Λ_V: 0.86 → 0.98)

| Fix | Issue | Resolution |
|-----|-------|------------|
| Method count alignment | Phase 3 table showed 3-4 methods but requirement was 5 | Updated table to show 5 methods per concern with 2 attack methods |
| Layer D challenge gap | Security findings challenged with generic methods only | Added #26 Red Team as REQUIRED for Layer D findings in Phase 5 |
| Cross-layer root cause | No guidance on Layer D → Layer C dependency | Added note: security issues often have root cause in assumptions |
| Security escalation criteria | No criteria for when 🟠 → 🔴 for security findings | Added Security Escalation Criteria table with 6 conditions |

### QVP Verification Fixes (Quadrant Verification Protocol)

| Fix | QVP Finding | Resolution |
|-----|-------------|------------|
| T4/C4: Infinite loop prevention | P6↔P7 could loop forever | Added MAX_FIX_ITERATIONS = 3 with escalation path |
| C1: Empty content handling | No validation for empty/trivial CONTENT | Added Content Validity Check in Phase 1 |
| T1: Rejection learning | Rejected findings vanished without trace | Added Rejection Log in Phase 5 for false positive learning |
| I7: HALT ambiguity | Unclear which HALTs apply in which mode | Added HALT Behavior by Mode table |
| C3: Zero findings path | No defined path when Phase 4 finds nothing | Added Zero Findings Path with #115 verification |
| I4: Layer D naming | "Security" vs "Security/Operational" mismatch | Aligned to "Security/Operational" throughout |
| T5: Unbounded 5 Whys | No stopping condition for root cause search | Added 7 Why max, circular detection, external boundary rules |
| T7: Restart undefined | [O] Restart had no documentation | Added Restart Behavior section with preserve/clear rules |

### V-GD v1.2 Reference Integrity Fixes (Λ_V: 0.42 → 0.95)

| Old # | Old Name | → | New # | Correct CSV Name |
|-------|----------|---|-------|------------------|
| #51 | Liar's Trap | → | #113 | Counterfactual Self-Incrimination |
| #53 | Confession Paradox | → | #131 | Observer Paradox |
| #54 | CUI BONO | → | #112 | Entropy Leak Detection |
| #65 | Abilene Paradox | → | #133 | Abilene Paradox Check |
| #110 | Reductio Attack | → | #63 | Challenge from Critical Perspective |

**Root Cause:** Method numbers in workflow did not match methods.csv database. Detected by V-GD Protocol v1.2 Reference Integrity Check.
