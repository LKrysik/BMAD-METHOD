# Deep Verify V6.6

## What is this?

**Deep Verify** is a structured verification workflow. It helps you find real problems in agent-produced work (code, documents, plans) before they cause issues.

**V6.6 Changes from V6.5:**
- **Phase 2.7: Conflict & Dependency Deep Analysis** - systematic detection of hidden conflicts and dependencies
- **Vocabulary Normalization** - canonicalize terms before analysis
- **Definition Triad Expansion** - extract MEANS/IMPLIES/EXCLUDES for each requirement
- **Pairwise Compatibility Check** - systematic n×n requirement comparison
- **Compatibility Proof Demand** - require construction proof, not just absence of detected conflict
- **Dependency Graph Construction** - visualize and analyze dependency topology
- **Adaptive Conflict/Depend Triggering** - semantic method cluster activation

**Why these changes?**
V6.5 achieved only 61% CONFLICT and 50% DEPEND detection rates. Multi-method analysis (30 methods across 15 categories) identified root causes:
- Missing vocabulary normalization (different terms for same concept)
- No systematic pairwise comparison
- No requirement for proof of compatibility
- No explicit dependency graph construction

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
| VOCAB_CANON | Normalized vocabulary mapping (synonym → canonical term) |
| DEF_TRIAD | Definition expansion: MEANS, IMPLIES, EXCLUDES |
| COMPAT_MATRIX | N×N matrix of requirement compatibility verdicts |
| DEP_GRAPH | Directed graph of requirement dependencies |

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
Phase 2.7: Conflict & Dependency Deep Analysis (NEW)
         ↓
Phase 3: Two-Pass Method Selection
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
| has_multiple_requirements | [true/false] | >3 distinct requirements |
| size_tokens | [N] | Estimated token count |
```

### Problem Signature Extraction

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
## Deep Verify V6.6

TASK: [original request - quote verbatim if possible]
CONTENT: [what was produced]
TYPE: [from Phase 0.5: code/document/plan/protocol]
FEATURES: [summary from Phase 0.5]
PROBLEM_SIGNATURE: [summary: N claims, M tensions identified]
METHOD_BUDGET: [N-M methods]
CONFLICT_ANALYSIS_TRIGGERED: [YES/NO based on has_multiple_requirements]

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
| F: Conflict | Requirement conflicts (NEW) | 0 | 4 |
| G: Depend | Dependency issues (NEW) | 0 | 3 |

### Layer E Trigger
Include Layer E if ANY of:
- Problem Signature has tensions with conflict_type = "definitional"
- Claims include "proves", "guarantees", "impossible", "always", "never"
- Domain is theoretical (crypto, distributed, formal, mechanism, quantum, pl-theory)

### Layer F & G Trigger (NEW)
Include Layer F (Conflict) and G (Depend) if:
- `has_multiple_requirements = true` (>3 requirements)
- Problem Signature has >1 tension identified
- Keywords contain: "must", "requires", "depends", "after", "both"

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

### Layer F: Conflict Concerns (if triggered)
F1: [potential conflict between requirements]
...

### Layer G: Dependency Concerns (if triggered)
G1: [dependency issue or gap]
...
```

---

## Phase 2.7: Conflict & Dependency Deep Analysis (NEW in V6.6)

**Purpose:** Systematic detection of hidden conflicts and missing dependencies.

**Trigger:** Execute if Layer F or Layer G was triggered in Phase 2, OR if artifact has >3 requirements.

### Step 1: Vocabulary Normalization (#100)

**Purpose:** Canonicalize terminology to reveal hidden conflicts using same concept with different words.

```
### Vocabulary Normalization

#### Synonym Groups
Identify terms that mean the SAME thing in this context:

| Canonical Term | Synonyms Found | Occurrences |
|----------------|----------------|-------------|
| [term1] | [syn1, syn2] | [R1, R3, R7] |
| [term2] | [syn3, syn4] | [R2, R4] |

#### Homonym Disambiguation
Identify terms that look same but mean DIFFERENT things:

| Term | Meaning in Context A | Meaning in Context B | Conflict Risk |
|------|---------------------|---------------------|---------------|
| [term] | [meaning1] in R2 | [meaning2] in R5 | HIGH/LOW |

#### Canonical Vocabulary
Use these canonical terms for remainder of analysis:
- [canonical1] (replaces: syn1, syn2)
- [canonical2] (replaces: syn3, syn4)
```

### Step 2: Requirement Extraction

**Purpose:** List all distinct requirements for systematic comparison.

```
### Requirements List

| ID | Requirement | Category | Key Terms (canonical) |
|----|-------------|----------|----------------------|
| R1 | [requirement text] | functional/performance/security/... | [terms] |
| R2 | [requirement text] | [category] | [terms] |
...
| RN | [requirement text] | [category] | [terms] |

Total requirements: [N]
Pairwise combinations to check: [N*(N-1)/2]
```

### Step 3: Definition Triad Expansion (#161)

**Purpose:** For each requirement, extract what it MEANS, IMPLIES, and EXCLUDES.

```
### Definition Triad Expansion

#### R1: [requirement name]
| Aspect | Content |
|--------|---------|
| MEANS | [literal meaning - what it directly states] |
| IMPLIES | [logical consequences - what must be true if R1 is satisfied] |
| EXCLUDES | [incompatibilities - what cannot be true if R1 is satisfied] |

#### R2: [requirement name]
| Aspect | Content |
|--------|---------|
| MEANS | [literal meaning] |
| IMPLIES | [logical consequences] |
| EXCLUDES | [incompatibilities] |

... (repeat for all requirements)
```

### Step 4: Pairwise Compatibility Check (#158)

**Purpose:** Systematically check each pair of requirements for conflicts.

**Algorithm:**
```
For each pair (Ri, Rj) where i < j:
  1. Check: Ri.EXCLUDES ∩ Rj.MEANS ≠ ∅ → CONFLICT
  2. Check: Ri.EXCLUDES ∩ Rj.IMPLIES ≠ ∅ → CONFLICT
  3. Check: Ri.IMPLIES ∩ Rj.EXCLUDES ≠ ∅ → CONFLICT
  4. Check: Rj.EXCLUDES ∩ Ri.MEANS ≠ ∅ → CONFLICT
  5. If none → COMPATIBLE or UNKNOWN
```

```
### Pairwise Compatibility Matrix

|     | R1 | R2 | R3 | R4 | R5 | ... |
|-----|----|----|----|----|----| --- |
| R1  | -  | ✅ | ⚠️ | ❌ | ✅ | ... |
| R2  | ✅ | -  | ✅ | ⚠️ | ✅ | ... |
| R3  | ⚠️ | ✅ | -  | ✅ | ❌ | ... |
| R4  | ❌ | ⚠️ | ✅ | -  | ✅ | ... |
| R5  | ✅ | ✅ | ❌ | ✅ | -  | ... |

Legend:
- ✅ COMPATIBLE: No exclusion overlap detected
- ⚠️ UNKNOWN: Needs deeper investigation
- ❌ CONFLICT: Exclusion overlap found

### Detected Conflicts

| Pair | Conflict Evidence | Severity | Type |
|------|-------------------|----------|------|
| R1-R4 | R1.EXCLUDES contains X, R4.MEANS requires X | 🔴 CRITICAL | Definitional |
| R3-R5 | R3.IMPLIES Y, R5.EXCLUDES Y | 🟠 IMPORTANT | Practical |
```

### Step 5: Compatibility Proof Demand (#160)

**Purpose:** For each detected conflict, demand proof of resolution OR confirm impossibility.

```
### Compatibility Proof Demand

#### Conflict: R1 vs R4

**Claim:** R1 and R4 are compatible

**Proof attempt:**
Construct an implementation that satisfies BOTH:
- R1 requires: [what]
- R4 requires: [what]

**Construction:**
[Attempt to describe how both could be satisfied]

**Verdict:**
- [ ] CONSTRUCTION SUCCESSFUL → Conflict is PRACTICAL (trade-off, not impossibility)
- [ ] CONSTRUCTION FAILED → Conflict is DEFINITIONAL (impossible by definition)
- [ ] CONSTRUCTION UNCLEAR → Needs domain expert review

**If DEFINITIONAL:** → 🔴 CRITICAL FINDING
**If PRACTICAL:** → 🟠 IMPORTANT FINDING (trade-off not resolved)
**If UNCLEAR:** → Flag for Phase 6.5 Kernel Handoff
```

### Step 6: Dependency Graph Construction (#159)

**Purpose:** Build explicit dependency graph to find cycles and missing dependencies.

```
### Dependency Graph

#### Nodes
All requirements + external dependencies:
- R1, R2, ..., RN (internal requirements)
- E1, E2, ... (external dependencies identified in Phase 1.5)

#### Edges
Ri → Rj means "Ri requires output/state from Rj"

```
Dependency Edges:
R1 → R3 (R1 uses output of R3)
R2 → E1 (R2 depends on external E1)
R4 → R1, R2 (R4 requires both R1 and R2)
R5 → R4 (R5 builds on R4)
...
```

#### Cycle Detection
Apply DFS to find cycles:

| Cycle | Path | Severity |
|-------|------|----------|
| C1 | R1 → R3 → R5 → R1 | 🔴 CRITICAL - circular dependency |
| C2 | ... | ... |

No cycles: ✅ / Cycles found: ❌

#### Missing Dependencies
Nodes with in-degree > 0 but no definition/source:

| Missing | Required By | Impact |
|---------|-------------|--------|
| [undefined] | R3, R5 | 🟠 IMPORTANT - undefined dependency |

#### Transitive Closure Analysis
Check second-order dependencies:
If R1 → R2 → R3, then R1 transitively depends on R3.

| Requirement | Direct Deps | Transitive Deps | Hidden Conflicts? |
|-------------|-------------|-----------------|-------------------|
| R1 | R3 | R3, R5, R7 | Check R1 vs R5, R7 |
```

### Step 7: Conflict & Depend Summary

```
### Phase 2.7 Summary

#### Conflict Analysis Results
| Metric | Value |
|--------|-------|
| Requirements analyzed | [N] |
| Pairs checked | [N*(N-1)/2] |
| Conflicts detected | [N] |
| Definitional conflicts | [N] 🔴 |
| Practical conflicts | [N] 🟠 |
| Unknown (need review) | [N] ⚠️ |

#### Dependency Analysis Results
| Metric | Value |
|--------|-------|
| Dependency edges | [N] |
| Cycles detected | [N] |
| Missing dependencies | [N] |
| Transitive conflicts | [N] |

#### Findings Generated
| ID | Type | Severity | Source |
|----|------|----------|--------|
| F1 | CONFLICT | 🔴 | R1 vs R4 definitional |
| F2 | CONFLICT | 🟠 | R3 vs R5 practical |
| F3 | DEPEND | 🔴 | Cycle R1→R3→R5→R1 |
| F4 | DEPEND | 🟠 | Missing dep for R3 |

→ These findings feed into Phase 4 for depth analysis
```

---

## Phase 3: Two-Pass Method Selection

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

**NEW in V6.6:** Boost methods in Conflict/Depend clusters if Phase 2.7 was triggered:
- If CONFLICT findings > 0: boost methods with "conflict", "contradiction", "incompatible" in description
- If DEPEND findings > 0: boost methods with "dependency", "cycle", "require" in description

```
### Pass 1: Surface Matching

| Rank | Method | Description (key part) | Surface Score | Boost |
|------|--------|------------------------|---------------|-------|
| 1 | #[N] | "[relevant part]" | 0.XX | +0.1 conflict |
| 2 | #[N] | "[relevant part]" | 0.XX | - |
...
| 2×budget | #[N] | "[relevant part]" | 0.XX | +0.1 depend |
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
| #158 | "Phase 2.7 found conflict R1-R4, need compatibility matrix" | NO | N/A | ✅ PASS |
```

---

### Final Selection

From methods that PASSED Reasoning Gate:
1. Sort by Surface Score (descending)
2. Select top BUDGET methods
3. Ensure minimum 3 different categories
4. **NEW:** Ensure at least 1 conflict method and 1 depend method if Phase 2.7 triggered

```
### Selected Methods

| Method | Category | Surface | Reasoning Summary |
|--------|----------|---------|-------------------|
| #108 | exploration | 0.92 | Definitional contradiction in PFS+recovery |
| #158 | conflict | 0.88 | Compatibility matrix for R1-R4 |
| #159 | depend | 0.85 | Dependency closure for cycle detection |
| #109 | exploration | 0.85 | Failure guarantee check |
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
Category: CONFLICT | DEPEND | THEORY | INTEGRATE | ASSUME | ...
Entropy: LOW | MEDIUM | HIGH (from #151)
Method: #[N] [name]
Source: Phase 2.7 / Phase 3.5 / Phase 4

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
| **Phase 2.7 conflicts unresolved** | **NEW: CONFLICT findings must be addressed** |
| **Phase 2.7 cycles unresolved** | **NEW: DEPEND cycles must be addressed** |

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

#### NEW: #160 Compatibility Proof Challenge (for CONFLICT findings)
"Can you construct an implementation that satisfies BOTH requirements?"
- If YES → downgrade to trade-off
- If NO → confirm as definitional conflict

```
## Challenge Results

| Finding | #63 Critical | #133 Abilene | #109 Contra | #160 Compat | Status |
|---------|--------------|--------------|-------------|-------------|--------|
| 1 | Survives | Exists | Met | NO construction | CONFIRMED |
| 2 | Survives | Exists | Met | YES construction | DOWNGRADED |
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

### Phase 2.7 Analysis Summary (NEW)
| Metric | Value |
|--------|-------|
| Requirements analyzed | [N] |
| Conflicts detected | [N] (definitional: [N], practical: [N]) |
| Dependency cycles | [N] |
| Missing dependencies | [N] |

### Findings by Depth

| ID | Category | Method | Sev | Depth | Finding |
|----|----------|--------|-----|-------|---------|
| 1 | CONFLICT | #158 | 🔴 | ROOT | [what] |
| 2 | DEPEND | #159 | 🔴 | ROOT | [what] |
| 3 | THEORY | #108 | 🔴 | ROOT | [what] |

### Findings by Category (NEW)

| Category | Count | Critical | Important | Minor |
|----------|-------|----------|-----------|-------|
| CONFLICT | [N] | [N] | [N] | [N] |
| DEPEND | [N] | [N] | [N] | [N] |
| THEORY | [N] | [N] | [N] | [N] |
| INTEGRATE | [N] | [N] | [N] | [N] |
| ... | ... | ... | ... | ... |

### Method Effectiveness (for Phase 7.5)

| Method | Selected Via | Findings | Confirmed | Reasoning Quality |
|--------|--------------|----------|-----------|-------------------|
| #158 | Two-Pass+Conflict boost | 2 | 2 | Correct - found conflicts |
| #159 | Two-Pass+Depend boost | 1 | 1 | Correct - found cycle |
| #108 | Two-Pass | 1 | 1 | Correct - found contradiction |
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

### Phase 2.7 Items Needing Review (NEW)

| Item | Type | Why User Must Verify |
|------|------|---------------------|
| R1-R4 conflict | UNCLEAR compatibility | Agent couldn't construct proof |
| E2 dependency | MISSING definition | Agent couldn't find source |

### What Agent CANNOT Objectively Verify

| Item | Why Agent Cannot Verify | User Action Required |
|------|-------------------------|---------------------|
| [item 1] | [self-reference issue] | [what user should check] |

### Handoff Statement

"This verification identified [N] findings including [N] CONFLICT and [N] DEPEND issues.
Phase 2.7 analyzed [N] requirements with [N] pairwise comparisons.
The following items require user verification: [list].
Definitional conflicts that could not be resolved: [list]."
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

### Fix Types for CONFLICT/DEPEND (NEW)

| Finding Type | Fix Strategy |
|--------------|--------------|
| Definitional CONFLICT | Requirements must be changed - cannot both be satisfied |
| Practical CONFLICT | Trade-off must be made explicit and documented |
| Circular DEPEND | Break cycle by removing or reordering dependency |
| Missing DEPEND | Add dependency or remove requirement |

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

### Method Selection Quality

| Metric | Value |
|--------|-------|
| Pass 1 Candidates | [N] |
| Pass 2 Accepted | [N] |
| Pass 2 Rejected | [N] |
| Rejection Accuracy | [% correctly rejected] |
| Domain Knowledge Claims | [N] |
| Domain Knowledge Verified | [N] |

### Phase 2.7 Effectiveness (NEW)

| Metric | Value |
|--------|-------|
| Vocabulary synonyms found | [N] |
| Vocabulary homonyms found | [N] |
| Conflicts from vocabulary normalization | [N] |
| Definition triads extracted | [N] |
| Pairwise checks performed | [N] |
| Conflicts detected by matrix | [N] |
| Cycles detected by graph | [N] |
| Missing deps detected | [N] |
| False positive rate | [N]% |

### Conflict/Depend Detection Improvement

| Metric | Before V6.6 (expected) | This Session |
|--------|------------------------|--------------|
| CONFLICT DR | 61% | [actual]% |
| DEPEND DR | 50% | [actual]% |

### Selection Effectiveness

| Method | Selection Reason | Findings | Was Selection Correct? |
|--------|------------------|----------|------------------------|
| #158 | "Pairwise matrix for conflicts" | 2 | ✅ YES - found conflicts |
| #159 | "Dependency cycle detection" | 1 | ✅ YES - found cycle |
| #81 | "Scope check" | 0 | ⚠️ MAYBE - no findings but relevant |

### Score Update

new_score = old_score * 0.9 + session_precision * 0.1
```

---

## Appendix A: Method Reference

### New Methods in V6.6

| # | Name | Category | Usage |
|---|------|----------|-------|
| #158 | Pairwise Compatibility Matrix | conflict | Phase 2.7 Step 4 - systematic pair checking |
| #159 | Transitive Dependency Closure | depend | Phase 2.7 Step 6 - cycle and gap detection |
| #160 | Compatibility Proof Demand | conflict | Phase 2.7 Step 5, Phase 5 - proof requirement |
| #161 | Definition Triad Expansion | conflict | Phase 2.7 Step 3 - MEANS/IMPLIES/EXCLUDES |

### High-Value Methods by Problem Type

| Problem Type Signal | Often-Relevant Methods |
|--------------------|------------------------|
| Multiple requirements (>3) | **#158, #159, #160, #161** (conflict/depend) |
| "Guarantees X AND Y" | #108 (contradiction), #104 (trade-off), #154 (definitional), **#158** |
| "Depends on", "after", "requires" | **#159** (closure), #127 (bootstrap), #90 (topology) |
| "Proves", "always", "never" | #87 (falsifiability), #111 (Gödel), #109 (contraposition), #153 (impossibility) |
| Technical buzzwords | #79 (operational definition), #100 (vocabulary), #155 (term verifier) |
| Domain: crypto/distributed/formal/mechanism/quantum/pl-theory | #156 (domain expert), #153-155 (theory methods) |

### Categories for Adaptive Triggering

**Conflict Detection Cluster:**
- Methods with description containing: "contradiction", "conflict", "incompatible", "exclude", "mutual"
- Categories: conflict, exploration, challenge

**Dependency Detection Cluster:**
- Methods with description containing: "dependency", "cycle", "graph", "require", "order"
- Categories: depend, technical, sanity

---

## Appendix B: Expected Performance

### V6.6 vs V6.5 Comparison (Projected)

| Category | V6.5 | V6.6 Expected | Delta |
|----------|------|---------------|-------|
| CONFLICT | 61% | 78-85% | +17-24% |
| DEPEND | 50% | 72-80% | +22-30% |
| THEORY | 61% | 61% | 0% (unchanged) |
| INTEGRATE | 100% | 100% | 0% (unchanged) |
| Overall | 75.3% | 82-88% | +7-13% |

### Key Improvements

1. **Vocabulary Normalization** → catches conflicts hidden by terminology
2. **Definition Triad Expansion** → reveals incompatibilities through EXCLUDES
3. **Pairwise Systematic Check** → ensures no pair is missed
4. **Compatibility Proof Demand** → eliminates false negatives
5. **Dependency Graph** → visualizes and catches cycles/gaps

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 6.6 | 2026-01-12 | Phase 2.7 Conflict & Dependency Deep Analysis, methods #158-161, Layer F/G |
| 6.5.1 | 2026-01-12 | Phase 3.5 Theory Check, domain-knowledge-base.md, methods #153-156 |
| 6.5 | 2026-01-12 | Two-Pass Semantic Selection, Reasoning Gate, Domain Knowledge Check |
| 6.4 | 2026-01-11 | Adaptive method selection, conditional rules |
| 6.3 | 2026-01-10 | Stability protocols, failure recovery |
