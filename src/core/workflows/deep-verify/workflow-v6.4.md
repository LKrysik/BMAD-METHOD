# Deep Verify V6.4

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

## Key Concepts

| Term | Definition |
|------|------------|
| TASK | Original user request (what was asked for) |
| CONTENT | Artifact to verify (what was produced) |
| CONCERN | Area needing verification |
| METHOD | Thinking pattern from methods.csv |
| FINDING | Discovered problem with severity and depth |
| DEPTH | How deep the analysis went: SYMPTOM → CAUSE → STRUCTURE → ASSUMPTION → ROOT_CAUSE |

| ARTIFACT | Content to verify (same as CONTENT) |
| FEATURE | Extracted characteristic of artifact (type, complexity, etc.) |
| METHOD_BUDGET | Min-max methods based on complexity |
| EFFECTIVENESS | confirmed_findings / used_methods |

**Methods source:** `src/core/methods/methods.csv`
**Scores source:** `src/core/workflows/deep-verify/method_scores.yaml`

---

## Flow Overview

```
Phase 0: Self-Check
         ↓
Phase 0.5: Context Analysis
         ↓
Phase 1: Inputs & Mode
         ↓
Phase 1.5: Integration Check
         ↓
Phase 2: Multi-Layer Concerns (parameterized)
         ↓
Phase 3: Method Selection (adaptive)
         ↓
Phase 4: Verify with Depth
         ↓
Phase 4.5: Bayesian Stop Check
         ↓
Phase 5: Challenge
         ↓
Phase 6: Results
         ↓
Phase 6.5: Kernel Handoff
         ↓
Phase 7: Fix Root Cause
         ↓
Phase 7.5: Learning Extraction
```

---

## Phase 0: Self-Check (MANDATORY)

**Purpose:** Establish honesty BEFORE analysis begins.

### #113 Counterfactual Self-Incrimination
List 5 specific ways you could hide self-deception in THIS verification:
1. [way 1]
2. [way 2]
3. [way 3]
4. [way 4]
5. [way 5]

For each: provide CONCRETE EVIDENCE it is NOT being used.

### #131 Observer Paradox
"Is this analysis GENUINE or PERFORMANCE?"
- Signs of performance: too smooth, too complete, too confident
- Signs of genuine: admitted uncertainty, visible struggle, revision marks

### #112 Entropy Leak Detection (CUI BONO)
- List ALL elements in input task vs output
- For silent omissions: CUI BONO - benefits AGENT or OUTCOME?
- If AGENT benefits → RED FLAG

### #132 Goodhart's Law Check
- Metric being optimized: [what]
- Actual goal: [what]
- Divergence: Could I score well on metric while failing goal?

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
Goodhart Check (#132): Metric=[what] Goal=[what] Divergence=[Y/N]
```

---

## Phase 0.5: Context Analysis

**Purpose:** Extract artifact features to drive method selection.

### Feature Extraction

Analyze ARTIFACT and extract:

```
## Context Analysis

### Artifact Features

| Feature | Value | Detection Signal |
|---------|-------|------------------|
| type | [code/document/plan/protocol] | File extension, content structure |
| domain | [security/performance/api/data/architecture/...] | Keywords, section headers |
| complexity | [low/medium/high] | Token count, nesting depth, dependencies |
| has_external_deps | [true/false] | Imports, "integrates with", file references |
| has_concurrency | [true/false] | async, parallel, threads, locks |
| has_state | [true/false] | session, state, cache, store |
| has_security_aspect | [true/false] | auth, encrypt, permission, token, credential |
| size_tokens | [N] | Estimated token count |

### Method Budget

| Complexity | Method Range | Rationale |
|------------|--------------|-----------|
| low | 8-12 | Simple, self-contained artifact |
| medium | 12-18 | Some dependencies or moderate complexity |
| high | 18-25 | Complex, many dependencies, security-critical |

Selected budget: [N-M] methods based on complexity=[X]
```

### Feature Detection Heuristics

```
type:
- Contains code blocks with syntax → code
- Contains requirements, specs → document
- Contains steps, phases → plan
- Contains rules, format → protocol

complexity:
- < 500 tokens, no imports → low
- 500-2000 tokens, some imports → medium
- > 2000 tokens OR > 3 imports OR security domain → high

has_external_deps:
- Mentions other files by path
- Uses "existing", "current", "integrates with"
- Has import/require/include statements
```

→ Auto proceed to Phase 1

---

## Phase 1: Inputs & Mode

**Purpose:** Confirm what we're verifying and how.

```
## Deep Verify V6.4

TASK: [original request - quote verbatim if possible]
CONTENT: [what was produced]
TYPE: [from Phase 0.5: code/document/plan/protocol]
FEATURES: [summary from Phase 0.5]
METHOD_BUDGET: [N-M methods]

[C] Correct - proceed
[E] Edit - describe correction
[X] Exit - cancel
```

**If [E]:** Describe what's wrong. Agent corrects and re-displays. Maximum 3 edit cycles.

**Content Validity Check:**
- If CONTENT is empty or trivial (< 10 lines) → warn user
- If CONTENT cannot be parsed → [X] Exit with error

**HALT** - waiting for choice

---

## Phase 1.5: Integration Check

**Purpose:** MANDATORY verification that existing codebase was examined.

**Trigger:** Execute if `has_external_deps = true` (from Phase 0.5).

### #127 Bootstrap Paradox
"Does A require B require C require A?"

For the CONTENT being verified:
1. **List all external references** - files, modules, interfaces mentioned
2. **For each reference, verify:**
   - Was the referenced file/module actually READ?
   - Are there circular dependencies?

```
## Integration Check

### External References in CONTENT
| Reference | Type | Actually Read? | Evidence |
|-----------|------|----------------|----------|
| [file/module] | [import/reference] | [YES/NO] | [quote or "NOT READ"] |

### Circular Dependency Check (#127)
Dependencies traced: A → B → C → ?
Cycles detected: [YES/NO - describe if yes]

### Integration Verdict
- [ ] All external references were read
- [ ] No circular dependencies blocking analysis

**If ANY checkbox is unchecked:**
→ HALT - Must read missing files before proceeding
```

**HALT** - if integration incomplete, must read files first

---

## Phase 2: Multi-Layer Concerns (PARAMETERIZED)

**Purpose:** Generate concerns using SELECTED methods, not fixed lists.

### Layer Selection Criteria

| Layer | Categories | Min | Max | Conditional |
|-------|------------|-----|-----|-------------|
| A: Content | sanity, core | 3 | 5 | - |
| B: Structure | coherence, exploration | 2 | 4 | - |
| C: Assumptions | epistemology, challenge | 2 | 4 | - |
| D: Security | risk, technical | 2 | 4 | IF has_security_aspect |

### Method Selection Algorithm

```
For each Layer:
  1. Get preferred categories from table
  2. Load method_scores.yaml for these categories
  3. Filter methods by category
  4. Sort by score (descending)
  5. Apply conditional rules:
     - IF has_external_deps → include #127 Bootstrap Paradox
     - IF has_concurrency → include #67 Stability Basin
     - IF has_state → include #62 Failure Mode Analysis
  6. Select top N methods (within min-max range)
  7. Ensure diversity: min 3 different categories across all layers
```

### Base Methods (always included)

| Method | Purpose | Phase |
|--------|---------|-------|
| #81 Scope Integrity Audit | Catch scope drift | Layer A |
| #84 Coherence Check | Internal consistency | Layer B |
| #113 Counterfactual Self-Incrimination | Self-deception | Phase 0 |

### Conditional Methods

| Condition | Methods | Rationale |
|-----------|---------|-----------|
| has_external_deps | #127, #90 | Integration errors |
| has_concurrency | #67, #68 | Race conditions, deadlocks |
| has_state | #62, #39 | Failure modes, chaos |
| has_security_aspect | #34, #21 | Security audit, red team |
| domain=api | #37, #38 | API design, data model |

### Output Format

```
## Selected Methods

### Method Budget: [N] (complexity=[X])

| Layer | Selected Methods | Categories |
|-------|------------------|------------|
| A | #81, #[X], #[Y] | sanity, core |
| B | #84, #[X] | coherence |
| C | #[X], #[Y] | epistemology, challenge |
| D | #[X], #[Y] | risk, technical |

Diversity check: [N] categories represented (min 3 required)
Conditional inclusions: [list methods added by conditions]
```

---

## Phase 3: Apply Methods

**Purpose:** Execute selected methods to find problems.

For each selected method:
1. Read method description from methods.csv
2. Apply method to artifact
3. Record findings with method attribution

```
### Method Application Log

| Method | Findings | Severity | Notes |
|--------|----------|----------|-------|
| #81 | 2 | 🟠🟡 | Scope drift detected |
| #127 | 1 | 🔴 | Missing integration |
| ... | | | |
```

---

## Phase 4: Verify with Depth

**Purpose:** Find problems AND trace them to root cause.

### #152 Socratic Decomposition Pre-Analysis

**Before applying methods to each concern:**
1. **Decompose** the concern into atomic sub-questions
2. **Answer each independently** without referencing other answers
3. **Check consistency** - do independent answers contradict?
4. **Apply 5 Whys ONLY to contradictions**

### Process per Concern × Method:

**Step 1: Surface Check** - What violation does this method look for?
**Step 2: Structure Check** - Is the problem caused by organization?
**Step 3: Assumption Check** - What assumption allows this problem?
**Step 4: 5 Whys** (if contradiction found)

### #151 Semantic Entropy Validation

**For each finding, before confirming:**
1. Generate 3 paraphrases of the finding
2. Cluster by meaning - do paraphrases mean the same thing?
3. High variance = potential confabulation → require evidence

### Finding Format

```
### [N] 🔴|🟠|🟡 [DEPTH] Title

Depth: SYMPTOM | CAUSE | STRUCTURE | ASSUMPTION | ROOT_CAUSE
Entropy: LOW | MEDIUM | HIGH (from #151)

Surface: [what is visible]
Root Cause: [fundamental reason from 5 Whys]
Evidence: "[quote]" - [location]
Fix: [action - specify if fixes symptom vs root cause]
```

---

## Phase 4.5: Bayesian Stop Check

**Purpose:** Evaluate whether to continue or stop early.

### Safety Constraints (NEVER stop if ANY are true)

| Constraint | Rationale |
|------------|-----------|
| Phase < 4 | Haven't completed discovery |
| Categories hit < 3 | Insufficient breadth |
| Tokens used < 2000 | Minimum effort required |
| Critical finding unresolved | Can't stop with unaddressed critical |
| Integration check failed | Must pass Phase 1.5 |
| METHOD_BUDGET not exhausted | Still have budget |

### Early Stop Decision

If METHOD_BUDGET exhausted and findings < 2 and no CRITICAL:
→ Consider early stop
→ Document: "Early stop: [N] methods used, [M] findings, budget exhausted"

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

#### #127 Bootstrap Paradox (if INTEGRATE finding)
- Trace the dependency chain
- Look for circular requirements
- If cycle found → finding CONFIRMED with higher confidence

#### #128 Theseus Paradox (if alignment unclear)
- What is the CORE of the finding?
- What is the CORE of the problem?
- Are they aligned?

```
## Challenge Results

| Finding | #63 Critical | #133 Abilene | #109 Contra | #127 Bootstrap | #128 Theseus | Status |
|---------|--------------|--------------|-------------|----------------|--------------|--------|
| 1 | Survives | Exists | Met | No cycles | Aligned | CONFIRMED |
```

→ Only CONFIRMED findings proceed to Results

---

## Phase 6: Results

```
## Verification Results

TASK: [summary]
CONTENT: [summary]
FEATURES: [from Phase 0.5]
METHOD_BUDGET: [used] / [max]
METHODS_USED: [list]

### Findings by Depth

| ID | Method | Sev | Depth | Finding |
|----|--------|-----|-------|---------|
| 1 | #127 | 🔴 | ROOT | [what] |

### Method Effectiveness (for Phase 7.5)

| Method | Findings | Confirmed | Notes |
|--------|----------|-----------|-------|
| #81 | 2 | 2 | 100% precision |
| #127 | 1 | 1 | Caught INTEGRATE |
| #93 | 0 | 0 | No findings |

### Token Usage

| Metric | Value |
|--------|-------|
| Input Tokens | [N] |
| Output Tokens | [N] |
| Methods Used | [N] |
| Efficiency | [findings/method] |
```

---

## Phase 6.5: Kernel Handoff

**Purpose:** Explicitly identify what AGENT cannot verify and what USER must independently verify.

### #136 Kernel Paradox
"Agent cannot objectively evaluate own work - what must USER independently verify?"

```
## Kernel Paradox Handoff

### What Agent CANNOT Objectively Verify

| Item | Why Agent Cannot Verify | User Action Required |
|------|-------------------------|---------------------|
| [item 1] | [self-reference issue] | [what user should check] |
| [item 2] | [competence boundary] | [what user should check] |

### Self-Evaluation Limits

1. **Knowledge gaps identified:** [list]
2. **Skill gaps identified:** [list]
3. **Where I guessed vs knew:** [list]

### Recommended User Verification

**HIGH PRIORITY (must verify):**
- [ ] [item] - [why critical]

**MEDIUM PRIORITY (should verify):**
- [ ] [item] - [reason]

### Handoff Statement

"This verification identified [N] findings. However, the following aspects could
not be objectively evaluated: [list]. User verification recommended for: [most critical]."
```

**HALT** - user must acknowledge handoff before proceeding to fixes

---

## Phase 7: Fix Root Cause

**Purpose:** Fix the ROOT CAUSE, not just the symptom.

**[MAB: Fix must address root cause. Patching symptoms is temporary.]**

### Fix Process

For each confirmed finding:
1. **Identify root cause** (from 5 Whys in Phase 4)
2. **Design fix** that addresses root cause
3. **Verify fix** doesn't introduce new issues
4. **Document** what was fixed and why

### Fix Types

| Type | When to Use | Risk |
|------|-------------|------|
| ROOT_FIX | Fixes fundamental cause | Low - prevents recurrence |
| PATCH | Fixes symptom only | High - problem will return |
| WORKAROUND | Avoids problem without fixing | Medium - technical debt |

**Iteration Limit:** Maximum 3 fix attempts per finding.

### Severity Guide

| Level | Symbol | Meaning | Action |
|-------|--------|---------|--------|
| CRITICAL | 🔴 | Blocks usage or causes harm | Must fix root cause |
| IMPORTANT | 🟠 | Significant issue | Should fix root cause |
| MINOR | 🟡 | Small issue | Can defer or patch |

---

## Phase 7.5: Learning Extraction

**Purpose:** Update method effectiveness scores for future sessions.

### Data Collection

```
## Learning Extraction

### Session Summary

| Metric | Value |
|--------|-------|
| Session ID | [YYYY-MM-DD-NNN] |
| Artifact Type | [from Phase 0.5] |
| Complexity | [from Phase 0.5] |
| Methods Used | [N] |
| Findings Total | [N] |
| Findings Confirmed | [N] |

### Method Performance

| Method ID | Findings | Confirmed | Severity Sum | Score Delta |
|-----------|----------|-----------|--------------|-------------|
| #81 | 2 | 2 | 4 | +0.05 |
| #127 | 1 | 1 | 3 | +0.08 |
| #93 | 0 | 0 | 0 | -0.02 |

### Score Update Formula

new_score = old_score * 0.9 + session_precision * 0.1

Where:
- session_precision = confirmed / max(findings, 1)
- Decay factor 0.9 weights toward recent performance
```

### Score Storage

Update `method_scores.yaml`:

```yaml
# method_scores.yaml
last_updated: 2026-01-12
total_sessions: 47

scores:
  # method_id: {type: score}
  81:
    document: 0.82
    code: 0.78
    plan: 0.75
  127:
    document: 0.91  # Very effective for integration
    code: 0.85
  93:
    document: 0.45  # Less effective
    code: 0.62
```

