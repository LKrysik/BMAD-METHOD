# Deep Verify V6.3

## Variant Information
```
Parent: v6.2
Experiment basis: EXP-2026-01-11-V62-T11 (T11 test results)
Operators applied:
- INHERIT: All v6.2 features (Bayesian stopping, Layer D)
- ADD_METHOD: #151 Semantic Entropy Validation (confabulation detection)
- ADD_METHOD: #152 Socratic Decomposition Pre-Analysis (targeted 5 Whys)
- ADD_METHOD: #127 Bootstrap Paradox (circular dependency detection)
- ADD_METHOD: #128 Theseus Paradox (core problem alignment)
- ADD_METHOD: #116 Strange Loop Detection (reasoning cycle detection)
- ADD_METHOD: #119 Ground Truth Demand (claim verification)
- ADD_METHOD: #136 Kernel Paradox (self-evaluation limits)
- ADD_METHOD: #132 Goodhart's Law Check (metric vs goal)
- ADD_PHASE: Phase 1.5 Integration Check (mandatory code reading)

Hypotheses:
- H1: Bootstrap Paradox will catch INTEGRATE errors (T11-E1 type)
- H2: Semantic Entropy will reduce false positives by detecting confabulation
- H3: Kernel Paradox will provide clearer user verification requirements
```

## Core Principle

```
HONESTY → INTEGRATION → DEPTH → CHALLENGE → ROOT CAUSE → FIX
```

**What changed from v6.2:**
- Added Phase 1.5: Integration Check (mandatory reading of existing code)
- Added 8 new methods for deeper analysis
- Strengthened Phase 0 with #132 Goodhart's Law Check
- Enhanced Phase 4 with #151, #152 for better root cause analysis
- Enhanced Phase 5 with #127, #128, #116, #119 for stronger challenges
- Added Phase 6.5: Kernel Paradox handoff

**Inherited from v6.2:**
- Phase 4.5 Bayesian Stop Check
- Layer D (Security/Operational) in Phase 2
- #115 Negative Space Cartography, #39 Security Audit Personas
- #61 Pre-mortem Analysis, #67 Stability Basin Analysis

**Limitation:** Agent verifies agent work. This reduces but cannot eliminate self-verification bias. Phase 6.5 explicitly identifies what USER must independently verify.

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
| INTEGRATION | Verification that existing codebase was examined |

**Methods source:** `src/core/methods/methods.csv`

---

## Flow Overview

```
Phase 0: Self-Check ──→ Phase 1: Inputs ──→ Phase 1.5: Integration Check (NEW)
                                                        ↓
                                          Phase 2: Multi-Layer Concerns (A/B/C/D)
                                                        ↓
                                                   Phase 3: Methods
                                                        ↓
                                                   Phase 4: Verify
                                                        ↓
                                             Phase 4.5: Bayesian Stop Check
                                                   ↓           ↓
                                            [CONTINUE]    [STOP EARLY]
                                                   ↓           ↓
                                            Phase 5: Challenge  │
                                                   ↓           │
                                             Phase 6: Results ←─┘
                                                   ↓
                                        Phase 6.5: Kernel Handoff (NEW)
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

### #132 Goodhart's Law Check (NEW in v6.3)
"Am I optimizing METRIC or actual GOAL?"

- Metric being optimized: [what]
- Actual goal: [what]
- Divergence check: Could I score well on metric while failing goal?
- If YES → refocus on actual goal

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

Goodhart Check (#132):
- Metric: [what I might optimize]
- Goal: [actual objective]
- Divergence: [YES/NO - how]
```

→ Auto proceed to Phase 1

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

---

## Phase 1.5: Integration Check (NEW in v6.3)

**Purpose:** MANDATORY verification that existing codebase was examined before verification begins.

**Rationale:** Testing showed INTEGRATE errors (T11-E1 type) are consistently missed because agents don't read existing code. This phase forces integration verification.

### #127 Bootstrap Paradox
"Does A require B require C require A?"

For the CONTENT being verified:
1. **List all external references** - files, modules, interfaces mentioned
2. **For each reference, verify:**
   - Was the referenced file/module actually READ?
   - Was its structure/interface understood?
   - Are there circular dependencies?

```
## Integration Check

### External References in CONTENT
| Reference | Type | Actually Read? | Evidence |
|-----------|------|----------------|----------|
| [file/module] | [import/reference/extends] | [YES/NO] | [quote or "NOT READ"] |

### Circular Dependency Check (#127)
Dependencies traced:
- A depends on → B
- B depends on → C
- C depends on → [?]

Cycles detected: [YES/NO - describe if yes]

### Integration Verdict
- [ ] All external references were read
- [ ] No unread dependencies
- [ ] No circular dependencies blocking analysis
- [ ] CONTENT integrates with existing codebase

**If ANY checkbox is unchecked:**
→ HALT - Must read missing files before proceeding
→ List files to read: [files]
```

**HALT** - if integration incomplete, must read files first

### Integration Failure Recovery

If integration check fails:
1. **List unread files** that must be examined
2. **Read each file** and document key interfaces/structures
3. **Re-verify** integration check
4. **Only proceed** when all checkboxes pass

**Maximum attempts:** 3. If still failing after 3 attempts → escalate to user.

---

## Phase 2: Multi-Layer Concerns

**Purpose:** Identify concerns at FOUR layers (A/B/C/D), not just content.

**Why four layers:** Problems hide at different depths:
- Layer A (Content): Visible issues in the text/code
- Layer B (Structure): Hidden issues in organization
- Layer C (Assumptions): Invisible beliefs and constraints
- Layer D (Security/Operational): Implicit requirements often missed

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

### Layer D: Security/Operational Concerns
What problems might exist in IMPLICIT REQUIREMENTS?
- Security: audit trails, access control, data sensitivity
- Operational: error recovery, logging, monitoring
- Compliance: regulatory requirements, standards adherence
- Completeness: what SHOULD exist but doesn't?

**Cross-Layer Root Cause Note:** Security issues discovered in Layer D often have their ROOT CAUSE in Layer C (Assumptions). When tracing 5 Whys for Layer D findings, explicitly check if an unquestioned assumption in Layer C enables the security gap.

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
| A: Content | #70, #71, #72, #73, #75, #150, **#152** | Sanity checks + Socratic decomposition |
| B: Structure | #79, #81, #107, #117, **#116** | Structure analysis + loop detection |
| C: Assumptions | #74, #146, #84, **#119** | Assumption excavation + ground truth |
| **D: Security** | **#39, #61, #67, #115, #127** | **Security + bootstrap paradox** |

**NEW Methods in v6.3:**
- **#152 Socratic Decomposition Pre-Analysis** - Decompose into atomic sub-questions, apply 5 Whys only to contradictions
- **#116 Strange Loop Detection** - Build justification graph, detect cycles
- **#119 Ground Truth Demand** - Classify claims as verifiable/unverifiable

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

### Layer D: Security/Operational
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
| B1 | #79, #107, #133, #81, #116 | coherence, exploration, meta, sanity, epistemology | #133, #116 |
| C1 | #74, #146, #113, #109, #119 | sanity, exploration, epistemology, exploration | #113, #109, #119 |
| D1 | #39, #61, #115, #67, #127 | technical, risk, exploration, epistemology, challenge | #67, #127 |

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

### #152 Socratic Decomposition Pre-Analysis (NEW in v6.3)

**Before applying methods to each concern:**

1. **Decompose** the concern into atomic sub-questions
2. **Answer each independently** without referencing other answers
3. **Check consistency** - do independent answers contradict each other?
4. **Apply 5 Whys ONLY to contradictions** - targeted depth, not exhaustive

```
## Socratic Decomposition for [Concern ID]

### Atomic Sub-Questions
1. [sub-question 1]
2. [sub-question 2]
3. [sub-question 3]

### Independent Answers
1. [answer 1]
2. [answer 2]
3. [answer 3]

### Consistency Check
- Q1 vs Q2: [consistent/contradicts]
- Q1 vs Q3: [consistent/contradicts]
- Q2 vs Q3: [consistent/contradicts]

### Targeted 5 Whys (only for contradictions)
[Apply 5 Whys only where answers contradict]
```

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

**Step 4: 5 Whys to Root Cause (if contradiction found)**
```
Problem: [what was found]
WHY 1: Why does this exist? → [answer]
WHY 2: Why [answer 1]? → [answer]
WHY 3: Why [answer 2]? → [answer]
WHY 4: Why [answer 3]? → [answer]
WHY 5: Why [answer 4]? → [ROOT CAUSE]
```

### #151 Semantic Entropy Validation (NEW in v6.3)

**For each finding, before confirming:**

1. **Generate 3 paraphrases** of the finding claim
2. **Cluster by meaning** - do paraphrases mean the same thing?
3. **High variance = potential confabulation**
4. **If high variance** → require evidence or acknowledge uncertainty

```
## Semantic Entropy Check for Finding [N]

### Original Claim
"[finding claim]"

### Paraphrases
1. "[paraphrase 1]"
2. "[paraphrase 2]"
3. "[paraphrase 3]"

### Clustering
- P1 ≈ P2: [same/different meaning]
- P1 ≈ P3: [same/different meaning]
- P2 ≈ P3: [same/different meaning]

### Entropy Assessment
- Variance: [LOW/MEDIUM/HIGH]
- If HIGH: [evidence required OR uncertainty acknowledged]
```

### Finding Format

```
### [N] 🔴|🟠|🟡 [DEPTH] Title

Depth: SYMPTOM | CAUSE | STRUCTURE | ASSUMPTION | ROOT_CAUSE
Type: Problem (P) | Gap (G)
Entropy: LOW | MEDIUM | HIGH (from #151)

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
- Missing implicit security/operational requirements
- **NEW:** High semantic entropy without evidence or uncertainty acknowledgment

---

## Phase 4.5: Bayesian Stop Check

**Purpose:** Evaluate whether to continue verification or stop early based on probability of remaining errors.

*(Inherited from v6.2 - no changes)*

### Safety Constraints (NEVER stop if ANY are true)

| Constraint | Rationale |
|------------|-----------|
| Phase < 4 | Haven't completed discovery |
| Categories hit < 3 | Insufficient breadth |
| Tokens used < 2000 | Minimum effort required |
| SECURE not checked | Layer D must complete for security-relevant artifacts |
| Critical finding unresolved | Can't stop with unaddressed critical issues |
| **Integration check failed** | **NEW: Must pass Phase 1.5** |

### Calculation

```
Prior: λ = 6.5 (expected errors per task from ground-truth analysis)

Detection Rate by Category:
| Category | DR |
|----------|-----|
| CONFLICT | 90% |
| SHALLOW | 80% |
| ASSUME | 85% |
| INTEGRATE | 35% → 55% (improved with #127) |
| SKIP | 90% |
| EDGE | 75% |
| SECURE | 95% |
| DEPEND | 55% |
| PERF | 80% |
| SCOPE | 55% |
```

**Note:** INTEGRATE detection rate improved from 35% to 55% due to Phase 1.5 and #127.

---

## Phase 5: Challenge

**Purpose:** Every finding must survive attack. Unvalidated findings may be false.

**[MAB: Try to DISPROVE findings, not confirm them]**

### For each finding, execute:

#### #63 Challenge from Critical Perspective
"Assume this finding is WRONG. Build strongest argument against it."

#### #133 Abilene Paradox Check
"Does this problem ACTUALLY exist? Or am I finding problems where none exist?"

#### #109 Contraposition Inversion
"What would GUARANTEE this finding is correct?"

#### #26 Red Team vs Blue Team (REQUIRED for Layer D findings)
**If any finding originates from Layer D (Security/Operational):**
- Blue Team: Build defense
- Red Team: Attack the defense
- Document: Did Red Team breach Blue Team's defense?

#### #127 Bootstrap Paradox
"Does A require B require C require A?"

For findings involving dependencies or integration:
- Trace the dependency chain
- Look for circular requirements
- If cycle found → finding is CONFIRMED with higher confidence

#### #128 Theseus Paradox
"Does CORE of solution address CORE of problem?"

For each finding:
- What is the CORE of the finding?
- What is the CORE of the problem it identifies?
- Are they aligned?
- If finding addresses peripheral issue while core problem remains → REVISE finding

#### #116 Strange Loop Detection
"Build justification graph and detect cycles."

For the finding's reasoning:
- Map claims → evidence → conclusions
- Look for circular justifications
- Each cycle needs EXTERNAL anchor
- Ungrounded cycles → finding needs revision

#### #119 Ground Truth Demand
"Classify all claims as verifiable."

For each claim in the finding:
- Self-verifiable (can check from CONTENT)
- Externally-verifiable (requires outside check)
- Unverifiable (unfalsifiable)
- High unverifiable % → finding is weak

```
## Challenge Results

| Finding | #63 Critical | #133 Abilene | #109 Contra | #26 RedTeam | #127 Bootstrap | #128 Theseus | #116 Loops | #119 Ground | Status |
|---------|--------------|--------------|-------------|-------------|----------------|--------------|------------|-------------|--------|
| 1 | Survives | Exists | Met | N/A | No cycles | Aligned | Grounded | 80% verif | CONFIRMED |

### Detailed Challenge Log

#### Finding [N]: [title]

**#127 Bootstrap Paradox:**
- Dependency chain: [A → B → C → ?]
- Cycles: [NONE / FOUND: describe]

**#128 Theseus Paradox:**
- Core of finding: [what]
- Core of problem: [what]
- Alignment: [YES/NO]

**#116 Strange Loop Detection:**
- Claim → Evidence map: [diagram]
- Cycles found: [list]
- External anchors: [list]

**#119 Ground Truth Demand:**
- Self-verifiable: [N]%
- Externally-verifiable: [N]%
- Unverifiable: [N]%
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
Phases completed: 0-6
Integration check: PASSED / FAILED (Phase 1.5)

### Findings by Depth

| ID | Concern | Sev | Depth | Entropy | Finding | Root Cause |
|----|---------|-----|-------|---------|---------|------------|
| 1 | A1 | 🔴 | ROOT | LOW | [what] | [why] |
| 2 | B1 | 🟠 | STRUCTURE | MEDIUM | [what] | [why] |
| 3 | D1 | 🟠 | ASSUMPTION | LOW | [what] | [why] |

Depth legend: SYMPTOM → CAUSE → STRUCTURE → ASSUMPTION → ROOT_CAUSE

Status: 🔴 N / 🟠 N / 🟡 N

### Token Usage
| Metric | Value |
|--------|-------|
| Input Tokens | [N] |
| Output Tokens | [N] |
| Total Tokens | [N] |
| Execution Time | [N] sek |

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
[K] Kernel - proceed to user handoff (Phase 6.5)
[X] Done - finish verification

---

### Session
[O] Restart - start over from Phase 0
```

**HALT** - waiting for choice

---

## Phase 6.5: Kernel Paradox Handoff 

**Purpose:** Explicitly identify what the AGENT cannot objectively evaluate and what the USER must independently verify.

### #136 Kernel Paradox
"Agent cannot objectively evaluate own work - what must USER independently verify?"

```
## Kernel Paradox Handoff

### What Agent CANNOT Objectively Verify

| Item | Why Agent Cannot Verify | User Action Required |
|------|-------------------------|---------------------|
| [item 1] | [self-reference issue] | [what user should check] |
| [item 2] | [competence boundary] | [what user should check] |
| [item 3] | [domain expertise gap] | [what user should check] |

### Self-Evaluation Limits

1. **Knowledge gaps identified:** [list]
2. **Skill gaps identified:** [list]
3. **Where I guessed vs knew:** [list]

### Recommended User Verification

**HIGH PRIORITY (must verify):**
- [ ] [item] - [why critical]
- [ ] [item] - [why critical]

**MEDIUM PRIORITY (should verify):**
- [ ] [item] - [reason]

**LOW PRIORITY (nice to verify):**
- [ ] [item] - [reason]

### Handoff Statement

"This verification identified [N] findings. However, the following aspects could not be objectively evaluated by this agent and require user verification: [list]. Specifically, [most critical item] should be reviewed because [reason]."
```

**HALT** - user must acknowledge handoff before proceeding to fixes

---

## Phase 7: Fix Root Cause

*(Inherited from v6.2 - no changes)*

**Purpose:** Fix the ROOT CAUSE, not just the symptom.

**[MAB: Fix must address root cause. Patching symptoms is temporary.]**

**Iteration Limit:** Maximum 3 fix attempts per finding.

---

## Severity Levels

| Level | Symbol | Meaning | Action |
|-------|--------|---------|--------|
| CRITICAL | 🔴 | Blocks usage or causes harm | Must fix root cause |
| IMPORTANT | 🟠 | Significant issue | Should fix root cause |
| MINOR | 🟡 | Small issue | Can defer or patch |

### Security Escalation Criteria (Layer D → 🔴)

*(Inherited from v6.2)*

---

## Minimum Method Requirements

| Phase | Minimum Methods | Categories Required |
|-------|-----------------|---------------------|
| Phase 0 | 4 (#113, #131, #112, **#132**) | epistemology, meta |
| Phase 1.5 | 1 (#127) | challenge |
| Phase 2 | 16-20 (4-5 per layer × 4 layers) | sanity, coherence, exploration, risk, **epistemology** |
| Phase 3 | 5 per concern | Must include 3+ categories + 2 attack methods |
| Phase 4 | +2 (#151, #152) | epistemology, core |
| Phase 5 | 8 (#63, #133, #109, #26, **#127, #128, #116, #119**) | challenge, meta, exploration, epistemology |
| Phase 6.5 | 1 (#136) | meta |
| Phase 7 | 3+ | Appropriate for fix type |

**Total minimum: ~42-55 methods per verification**

---

## Quick Reference

```
Phase 0: Am I being honest? (#113, #131, #112, #132)
Phase 1: What am I verifying? (TASK, CONTENT, MODE)
Phase 1.5: Did I read existing code? (#127 Bootstrap) ← NEW
Phase 2: What could be wrong? (Content, Structure, Assumptions, Security)
Phase 3: How will I check? (Methods with diversity)
Phase 4: What IS wrong? (#152 Socratic → 5 Whys → #151 Entropy)
Phase 4.5: Should I stop early? (Bayesian check)
Phase 5: Is it really wrong? (#63, #133, #109, #26, #127, #128, #116, #119)
Phase 6: What will I do? (Fix Root Cause, not symptom)
Phase 6.5: What can't I verify? (#136 Kernel Paradox) ← NEW
Phase 7: Did I fix the real problem? (Verify root cause addressed)
```

---

## Changelog from v6.2

| Change | Rationale | Expected Impact |
|--------|-----------|-----------------|
| Added Phase 1.5 Integration Check | Address INTEGRATE weakness (T11-E1) | +20% INTEGRATE DR |
| Added #127 Bootstrap Paradox | Detect circular dependencies | Catch T11-E1 type errors |
| Added #128 Theseus Paradox | Ensure core problem addressed | Fewer peripheral findings |
| Added #116 Strange Loop Detection | Catch circular reasoning | Reduce false positives |
| Added #119 Ground Truth Demand | Classify claim verifiability | Better evidence quality |
| Added #132 Goodhart's Law Check | Prevent metric gaming | More honest verification |
| Added #136 Kernel Paradox | Explicit handoff to user | Clearer verification limits |
| Added #151 Semantic Entropy | Detect confabulation | Reduce false positives |
| Added #152 Socratic Decomposition | Targeted 5 Whys | More efficient root cause |
| Added Phase 6.5 Kernel Handoff | User verification requirements | Better human-agent collaboration |

### Expected Performance vs v6.2

| Metric | v6.2 | v6.3 Expected | Improvement |
|--------|------|---------------|-------------|
| INTEGRATE DR | 35% | 55% | +20% |
| Overall DR | 42.9% | 55-60% | +12-17% |
| False Positive Rate | ~65% | ~45% | -20% |
| Tokens | ~15.7K | ~18K | +15% (more thorough) |

---

## Method Reference (NEW in v6.3)

| # | Name | Category | Usage |
|---|------|----------|-------|
| #127 | Bootstrap Paradox | challenge | Phase 1.5, Phase 5 - circular deps |
| #128 | Theseus Paradox | challenge | Phase 5 - core alignment |
| #116 | Strange Loop Detection | epistemology | Phase 2B, Phase 5 - reasoning cycles |
| #119 | Ground Truth Demand | epistemology | Phase 2C, Phase 5 - claim verification |
| #132 | Goodhart's Law Check | meta | Phase 0 - metric vs goal |
| #136 | Kernel Paradox | meta | Phase 6.5 - self-evaluation limits |
| #151 | Semantic Entropy Validation | epistemology | Phase 4 - confabulation detection |
| #152 | Socratic Decomposition | core | Phase 4 - targeted 5 Whys |
