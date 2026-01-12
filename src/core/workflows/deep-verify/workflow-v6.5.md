# Deep Verify V6.5

## What is this?

**Deep Verify** is a structured verification workflow. It helps you find real problems in agent-produced work (code, documents, plans) before they cause issues.

**V6.5 Changes from V6.4:**
- **Semantic Method Selection** - methods chosen by meaning match, not hardcoded rules
- **Two-Pass Selection with Reasoning Gate** - surface match + verified reasoning
- **Domain Knowledge Check** - explicit verification of required expertise
- **Definition Expansion** - unpack hidden contradictions in claims

**Why these changes?**
V6.4 failed on theoretical impossibilities (T16-T21) because hardcoded conditional rules didn't cover new problem types. V6.5 uses adaptive semantic selection that works for ANY problem type.

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
| PROBLEM_SIGNATURE | Extracted claims, tensions, and keywords from artifact |
| SURFACE_MATCH | Keyword-based relevance score (0-1) |
| REASONING_GATE | Verification that method selection has valid justification |

**Methods source:** `src/core/methods/methods.csv`
**Scores source:** `src/core/workflows/deep-verify/method_scores.yaml`
**Domain knowledge:** `src/core/knowledge/domain-knowledge-base.md`

---

## Flow Overview

```
Phase 0: Self-Check
         ↓
Phase 0.5: Context Analysis + Problem Signature
         ↓
Phase 1: Inputs & Mode
         ↓
Phase 1.5: Integration Check
         ↓
Phase 2: Multi-Layer Concerns
         ↓
Phase 3: Two-Pass Method Selection (NEW)
         ↓
Phase 3.5: Theory Check (if domain triggered)
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

## Phase 0.5: Context Analysis + Problem Signature

**Purpose:** Extract artifact features AND problem signature for semantic method selection.

### Feature Extraction

Analyze ARTIFACT and extract:

```
## Context Analysis

### Artifact Features

| Feature | Value | Detection Signal |
|---------|-------|------------------|
| type | [code/document/plan/protocol] | File extension, content structure |
| domain | [security/crypto/distributed/formal/mechanism/quantum/pl-theory/...] | Keywords, section headers |
| complexity | [low/medium/high] | Token count, nesting depth, dependencies |
| has_external_deps | [true/false] | Imports, "integrates with", file references |
| has_concurrency | [true/false] | async, parallel, threads, locks |
| has_state | [true/false] | session, state, cache, store |
| has_security_aspect | [true/false] | auth, encrypt, permission, token, credential |
| size_tokens | [N] | Estimated token count |
```

### Problem Signature Extraction (NEW in V6.5)

**Purpose:** Extract semantic content for method matching.

```
### Problem Signature

#### Claims (what artifact asserts)
List ALL claims the artifact makes, especially:
- Guarantees ("ensures", "guarantees", "always", "never")
- Capabilities ("achieves", "provides", "supports")
- Properties ("is X", "has property Y")

| Claim | Exact Quote | Strength |
|-------|-------------|----------|
| [claim 1] | "[quote]" | strong/moderate/weak |
| [claim 2] | "[quote]" | strong/moderate/weak |

#### Tensions (potential conflicts)
Look for claims that MIGHT conflict:
- "X AND Y" where X and Y could be exclusive
- Properties that are typically trade-offs
- "Both A and B" formulations

| Tension | Claim A | Claim B | Conflict Type |
|---------|---------|---------|---------------|
| [T1] | [claim] | [claim] | definitional/practical/unknown |

#### Definition Expansion (CRITICAL for hidden contradictions)
For each strong claim, EXPAND the definition:
- What does "[term]" actually MEAN?
- What does it IMPLY?
- What does it EXCLUDE?

| Term | Definition | Implies | Excludes |
|------|------------|---------|----------|
| [term 1] | [meaning] | [what follows] | [what's incompatible] |

#### Keywords
Extract domain-specific keywords for method matching:
[keyword1], [keyword2], [keyword3], ...
```

### Method Budget

| Complexity | Method Range | Rationale |
|------------|--------------|-----------|
| low | 8-12 | Simple, self-contained artifact |
| medium | 12-18 | Some dependencies or moderate complexity |
| high | 18-25 | Complex, many dependencies, theoretical claims |

Selected budget: [N-M] methods based on complexity=[X]

→ Auto proceed to Phase 1

---

## Phase 1: Inputs & Mode

**Purpose:** Confirm what we're verifying and how.

```
## Deep Verify V6.5

TASK: [original request - quote verbatim if possible]
CONTENT: [what was produced]
TYPE: [from Phase 0.5: code/document/plan/protocol]
FEATURES: [summary from Phase 0.5]
PROBLEM_SIGNATURE: [summary: N claims, M tensions identified]
METHOD_BUDGET: [N-M methods]

[C] Correct - proceed
[E] Edit - describe correction
[X] Exit - cancel
```

**If [E]:** Describe what's wrong. Agent corrects and re-displays. Maximum 3 edit cycles.

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

---

## Phase 2: Multi-Layer Concerns

**Purpose:** Generate concerns across multiple verification dimensions.

### Layer Structure

| Layer | Focus | Min | Max |
|-------|-------|-----|-----|
| A: Content | What artifact claims and delivers | 3 | 5 |
| B: Structure | Internal coherence and organization | 2 | 4 |
| C: Assumptions | Hidden assumptions and dependencies | 2 | 4 |
| D: Risk | Failure modes and edge cases | 2 | 4 |
| E: Theory | Theoretical validity (if applicable) | 0 | 3 |

### Layer E Trigger (NEW)
Include Layer E if ANY of:
- Problem Signature has tensions with conflict_type = "definitional"
- Claims include "proves", "guarantees", "impossible", "always", "never"
- Domain is theoretical (crypto, distributed, formal, mechanism, quantum, pl-theory)

```
## Concerns by Layer

### Layer A: Content Concerns
A1: [concern]
A2: [concern]
...

### Layer B: Structure Concerns
B1: [concern]
...

### Layer C: Assumption Concerns
C1: [concern]
...

### Layer D: Risk Concerns
D1: [concern]
...

### Layer E: Theory Concerns (if triggered)
E1: [concern about theoretical validity]
...
```

---

## Phase 3: Two-Pass Method Selection (NEW in V6.5)

**Purpose:** Select methods using semantic matching WITH reasoning verification.

### Why Two-Pass?
Surface matching alone fails when:
- Contradiction is hidden in definitions (not keywords)
- Domain knowledge is required to see the problem
- Method description doesn't use same vocabulary as artifact

Two-pass ensures methods are selected for the RIGHT reasons.

---

### Pass 1: Surface Matching

**Step 1:** Load methods from `src/core/methods/methods.csv`

**Step 2:** For each method, calculate SURFACE_RELEVANCE:

```
SURFACE_RELEVANCE(method, problem_signature) =
  keyword_overlap(method.description, signature.keywords) * 0.3 +
  claim_match(method.description, signature.claims) * 0.4 +
  tension_match(method.description, signature.tensions) * 0.3
```

**Step 3:** Select top 2×BUDGET methods by SURFACE_RELEVANCE

```
### Pass 1: Surface Matching

| Rank | Method | Description (key part) | Surface Score |
|------|--------|------------------------|---------------|
| 1 | #[N] | "[relevant part]" | 0.XX |
| 2 | #[N] | "[relevant part]" | 0.XX |
...
| 2×budget | #[N] | "[relevant part]" | 0.XX |
```

---

### Pass 2: Reasoning Gate

**For EACH candidate method from Pass 1:**

#### Step A: Explain WHY
Write ONE sentence explaining why this method addresses a specific concern from the Problem Signature.

**RULE:** Explanation must reference SPECIFIC claim or tension, not generic match.

❌ BAD: "This method checks for contradictions and artifact has contradictions"
✅ GOOD: "Artifact claims both PFS (past sessions unreadable) and key recovery (past sessions readable) - #108 addresses such definitional contradictions"

#### Step B: Check for Circularity
Is the explanation CIRCULAR (method matches because it matches)?

- If YES → REJECT method
- If NO → proceed

#### Step C: Domain Knowledge Check
Does the explanation require domain knowledge?

- If NO → ACCEPT
- If YES → Verify the knowledge:
  - State the domain fact being assumed
  - Classify as: VERIFIED (I know this is true) / UNCERTAIN (I believe but not sure) / ACKNOWLEDGED (I'm assuming without verification)
  - If UNCERTAIN or ACKNOWLEDGED → flag for user verification in Phase 6.5

```
### Pass 2: Reasoning Gate

| Method | Why Selected | Circular? | Domain Knowledge | Status |
|--------|--------------|-----------|------------------|--------|
| #108 | "PFS excludes recovery by definition (crypto)" | NO | VERIFIED: PFS definition | ✅ PASS |
| #127 | "Looking for circular deps" | YES - generic | N/A | ❌ REJECT |
| #109 | "What would guarantee artifact fails? PFS+recovery together" | NO | VERIFIED | ✅ PASS |
```

---

### Final Selection

From methods that PASSED Reasoning Gate:
1. Sort by Surface Score (descending)
2. Select top BUDGET methods
3. Ensure minimum 3 different categories

```
### Selected Methods

| Method | Category | Surface | Reasoning Summary |
|--------|----------|---------|-------------------|
| #108 | exploration | 0.92 | Definitional contradiction in PFS+recovery |
| #109 | exploration | 0.88 | Failure guarantee check |
| #104 | exploration | 0.85 | Trade-off verification |
| #87 | sanity | 0.80 | Falsifiability of claims |
| ... | ... | ... | ... |

Budget used: [N] / [M] max
Categories represented: [list]
Methods with UNCERTAIN domain knowledge: [list - will flag in Phase 6.5]
```

---

## Phase 3.5: Theory Check

**Trigger:** Execute if domain ∈ {crypto, distributed, formal, mechanism, quantum, pl-theory}

**Purpose:** Check claims against `domain-knowledge-base.md` impossibility theorems.

### Load Domain Knowledge
```
Load: src/core/knowledge/domain-knowledge-base.md
Sections to check:
- Section 1: Impossibility Theorems → [domain]
- Section 2: Technical Terms → [domain]
- Section 4: Contradiction Patterns
```

### Theorem Scan (#153)
For each strong claim from Problem Signature:
1. Match against impossibility theorems in knowledge base
2. If match → flag as potential THEORY/CRITICAL
3. Document theorem violated and evidence

```
### Theory Check Results

| Claim | Theorem Match | Violation? | Evidence |
|-------|---------------|------------|----------|
| "[claim]" | FLP/CAP/Halting/... | YES/NO/UNCLEAR | "[quote]" |

Potential CRITICAL findings from theory: [count]
```

### Term Verification (#155)
For technical terms from Keywords:
1. Check correct usage per knowledge base Section 2
2. Flag misuse patterns

```
### Term Verification

| Term | Domain Correct | Artifact Usage | Verdict |
|------|----------------|----------------|---------|
| [term] | [correct def] | [how used] | OK/MISUSE/UNCLEAR |
```

### Contradiction Scan (#154)
Check Problem Signature tensions against Section 4:
1. Match against known definitionally exclusive pairs
2. Flag definitional contradictions as CRITICAL

```
### Contradiction Check

| Tension | Known Pattern? | Definitional? | Severity |
|---------|----------------|---------------|----------|
| [A vs B] | YES: [pattern] | YES/NO | CRITICAL/flagged |
```

→ Findings from Phase 3.5 feed directly into Phase 4

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
Method: #[N] [name]

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
| Theory concerns not addressed | Layer E must be verified if triggered |

---

## Phase 5: Challenge

**Purpose:** Every finding must survive attack.

**[MAB: Try to DISPROVE findings, not confirm them]**

### For each finding, execute:

#### #63 Challenge from Critical Perspective
"Assume this finding is WRONG. Build strongest argument against it."

#### #133 Abilene Paradox Check
"Does this problem ACTUALLY exist? Or am I finding problems where none exist?"

#### #109 Contraposition Inversion
"What would GUARANTEE this finding is correct?"

```
## Challenge Results

| Finding | #63 Critical | #133 Abilene | #109 Contra | Status |
|---------|--------------|--------------|-------------|--------|
| 1 | Survives | Exists | Met | CONFIRMED |
```

→ Only CONFIRMED findings proceed to Results

---

## Phase 6: Results

```
## Verification Results

TASK: [summary]
CONTENT: [summary]
FEATURES: [from Phase 0.5]
PROBLEM_SIGNATURE: [claims and tensions count]
METHOD_BUDGET: [used] / [max]
METHODS_USED: [list with selection reasoning]

### Findings by Depth

| ID | Method | Sev | Depth | Finding |
|----|--------|-----|-------|---------|
| 1 | #108 | 🔴 | ROOT | [what] |

### Method Effectiveness (for Phase 7.5)

| Method | Selected Via | Findings | Confirmed | Reasoning Quality |
|--------|--------------|----------|-----------|-------------------|
| #108 | Two-Pass | 1 | 1 | Correct - found contradiction |
| #127 | Rejected | 0 | 0 | Correctly rejected - not relevant |
```

---

## Phase 6.5: Kernel Handoff

**Purpose:** Identify what AGENT cannot verify and what USER must independently verify.

### #136 Kernel Paradox
"Agent cannot objectively evaluate own work - what must USER independently verify?"

```
## Kernel Paradox Handoff

### Domain Knowledge Flagged in Phase 3

| Knowledge Claim | Classification | User Action |
|-----------------|----------------|-------------|
| "PFS excludes recovery" | VERIFIED | Confirm if unfamiliar with crypto |
| "[other]" | UNCERTAIN | Must verify independently |

### What Agent CANNOT Objectively Verify

| Item | Why Agent Cannot Verify | User Action Required |
|------|-------------------------|---------------------|
| [item 1] | [self-reference issue] | [what user should check] |

### Handoff Statement

"This verification identified [N] findings. The following domain knowledge was
assumed: [list]. User verification recommended for: [most critical]."
```

**HALT** - user must acknowledge handoff before proceeding to fixes

---

## Phase 7: Fix Root Cause

**Purpose:** Fix the ROOT CAUSE, not just the symptom.

For each confirmed finding:
1. **Identify root cause** (from 5 Whys in Phase 4)
2. **Design fix** that addresses root cause
3. **Verify fix** doesn't introduce new issues
4. **Document** what was fixed and why

### Severity Guide

| Level | Symbol | Meaning | Action |
|-------|--------|---------|--------|
| CRITICAL | 🔴 | Blocks usage or causes harm | Must fix root cause |
| IMPORTANT | 🟠 | Significant issue | Should fix root cause |
| MINOR | 🟡 | Small issue | Can defer or patch |

---

## Phase 7.5: Learning Extraction

**Purpose:** Update method effectiveness scores AND selection quality.

### Session Data

```
## Learning Extraction

### Method Selection Quality (NEW in V6.5)

| Metric | Value |
|--------|-------|
| Pass 1 Candidates | [N] |
| Pass 2 Accepted | [N] |
| Pass 2 Rejected | [N] |
| Rejection Accuracy | [% correctly rejected] |
| Domain Knowledge Claims | [N] |
| Domain Knowledge Verified | [N] |

### Selection Effectiveness

| Method | Selection Reason | Findings | Was Selection Correct? |
|--------|------------------|----------|------------------------|
| #108 | "Definitional contradiction" | 1 | ✅ YES - found the issue |
| #81 | "Scope check" | 0 | ⚠️ MAYBE - no findings but relevant |

### Score Update

new_score = old_score * 0.9 + session_precision * 0.1

### Reasoning Quality Feedback

- Methods selected with VERIFIED domain knowledge: [list]
- Methods selected with UNCERTAIN knowledge: [list]
- Methods rejected correctly: [list]
- Methods rejected incorrectly (should have been included): [list]

### Domain Knowledge Base Update (NEW)

**If new pattern discovered during verification:**

1. **New Impossibility Theorem:** Pattern not in knowledge base but blocking correct implementation
2. **New Term Misuse:** Technical term incorrectly used in a new way
3. **New Contradiction:** Definitionally exclusive pair not in Section 4

```
### Knowledge Base Addition Request

| Field | Value |
|-------|-------|
| Source | [this session ID] |
| Type | theorem / term / contradiction |
| Domain | [crypto/distributed/formal/mechanism/quantum/pl-theory] |
| Entry | [formatted per knowledge-base template] |
| Evidence | Finding #[N] - "[quote]" |
| Status | PROPOSED (requires user confirmation) |

**Proposed addition:**
[copy-paste ready entry for domain-knowledge-base.md]
```

→ User reviews and confirms before entry becomes VERIFIED
```

---

## Appendix: Method Selection Heuristics

### High-Value Methods by Problem Type

These are HEURISTICS, not rules. Two-Pass Selection may choose differently based on actual Problem Signature.

| Problem Type Signal | Often-Relevant Methods |
|--------------------|------------------------|
| "Guarantees X AND Y" | #108 (contradiction), #104 (trade-off), **#154 (definitional)** |
| "Proves", "always", "never" | #87 (falsifiability), #111 (Gödel), #109 (contraposition), **#153 (impossibility)** |
| Technical buzzwords | #79 (operational definition), #100 (vocabulary), **#155 (term verifier)** |
| "Achieves all of..." | #125 (Simpson's), #104 (Heisenberg), **#153 (impossibility)** |
| Integration claims | #127 (bootstrap), #99 (multi-artifact) |
| Self-reference | #136 (kernel), #110 (fixed point) |
| Domain: crypto/distributed/formal/mechanism/quantum/pl-theory | **#156 (domain expert)**, **#153-155 (theory methods)** |

### Categories Most Relevant to Theoretical Problems

- **`theory`: #153, #154, #155, #156** - impossibility theorems, contradictions, term verification, domain expertise
- `exploration`: #104, #108, #109 - trade-offs and contradictions
- `epistemology`: #111, #113, #119 - knowledge limits and verification
- `challenge`: #125, #127, #128 - paradoxes and hidden issues
- `sanity`: #85, #87 - grounding and falsifiability

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 6.5.1 | 2026-01-12 | Phase 3.5 Theory Check, domain-knowledge-base.md, methods #153-156, KB update in Phase 7.5 |
| 6.5 | 2026-01-12 | Two-Pass Semantic Selection, Reasoning Gate, Domain Knowledge Check |
| 6.4 | 2026-01-11 | Adaptive method selection, conditional rules |
| 6.3 | 2026-01-10 | Stability protocols, failure recovery |
