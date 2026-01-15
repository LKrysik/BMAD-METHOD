# Deep Verify V7.1 - Error Theory Enhanced AVS

## What is this?

**Deep Verify V7.1** is the first evolutionary update to the Adaptive Verification System (AVS). It retains the 4-layer "immune system" architecture of V7.0 but integrates **Error Theory** (Systematic Classification) to guide the "Innate" and "Adaptive" layers.

**V7.1 Architecture Evolution from V7.0:**
- **Taxonomy Integration**: "Error Theory" categories are now scanned in Layer 1 (Innate).
- **Seeded Adaptation**: Layer 2 (Adaptive) method selection is now weighted by the specific error types detected in Layer 1.
- **Concrete Memory**: Layer 3 (Memory) now has a dedicated slot for "Knowledge Injection" to read optimization strategies.
- **Explicit Limits**: The output now explicitly acknowledges fundamental verification limits (Gödel Gap).

**Why this change?**
V7.0 provided the correct *structure* (adaptive layers), but V8.x experiments showed that over-simplification leads to blind spots. V7.1 adds *semantic rigor* (Error Theory) to the *adaptive structure* (V7.0), ensuring that "adaptation" doesn't become "guessing".

---

## Key Concepts

| Term | Definition |
|------|------------|
| ERROR THEORY | Systematic taxonomy of error types (Logic, Security, Consistency, etc.) |
| TAXONOMY SCAN | New Layer 1 step to tag artifact with potential error categories |
| SEEDED SELECTION | Using Taxonomy tags to boost relevance of specific methods in Layer 2 |
| LAYER | Detection tier: INNATE (fast, pattern) / ADAPTIVE (deep, learning) / MEMORY / ESCALATION |
| LEARNING | Weight updates based on detection results AND knowledge injection |

**Methods source:** `src/core/methods/methods.csv`
**Domain knowledge:** `src/core/knowledge/domain-knowledge-base.md`

---

## Phase 0: Artifact Intake & Triage (MANDATORY)

**Purpose:** Profile artifact and allocate resources proportionally.

### Step 0.1: Self-Check (Standard)

Execute #113 Counterfactual Self-Incrimination, #131 Observer Paradox, #112 Entropy Leak Detection.

```
## Phase 0.1: Self-Check
Self-deception methods: [5 specific methods and evidence against each]
Genuine vs Performance: [assessment]
CUI BONO: [what to watch for]
```

### Step 0.2: Artifact Profiling

Extract artifact characteristics for triage and method selection.

```
## Phase 0.2: Artifact Profile

### Basic Properties
| Property | Value | Source |
|----------|-------|--------|
| Type | [code/document/plan/protocol/specification] | Content structure |
| Size | [N] tokens | Token count |
| Requirements | [N] explicit requirements | "must", "shall", "requires" |

### Domain Detection
Scan for domain markers. Check ALL that apply:

| Domain | Markers Present | Confidence |
|--------|-----------------|------------|
| Security/Crypto | [auth, encrypt, key, signature, hash, PFS, ZK] | [0-100%] |
| Distributed Systems | [consensus, partition, availability, replication, CAP, FLP] | [0-100%] |
| Formal Methods | [proof, theorem, invariant, specification, verification] | [0-100%] |
| Mechanism Design | [incentive, game theory, VCG, auction, voting] | [0-100%] |
| Quantum Computing | [qubit, superposition, entanglement, quantum advantage] | [0-100%] |
| PL Theory | [type system, inference, soundness, termination] | [0-100%] |
| General Software | [default - no specialized domain detected] | [100 - max(others)] |

Primary domain(s): [highest confidence domains]

### Complexity Assessment
| Factor | Score (1-5) | Evidence |
|--------|-------------|----------|
| Conceptual density | [N] | Concepts per 100 tokens |
| Cross-references | [N] | Internal reference count |
| External dependencies | [N] | External reference count |
| Nested structure | [N] | Max nesting depth |
| Ambiguity | [N] | Vague terms count |

Complexity score: [SUM / 25 → LOW (<0.4) / MEDIUM (0.4-0.7) / HIGH (>0.7)]

### Criticality Assessment
| Factor | Score (1-5) | Evidence |
|--------|-------------|----------|
| Security implications | [N] | Security-related content |
| Data handling | [N] | Data operations mentioned |
| User impact | [N] | User-facing functionality |
| Integration scope | [N] | System integration breadth |
| Stated importance | [N] | Explicit priority markers |

Criticality score: [SUM / 25 → LOW (<0.4) / MEDIUM (0.4-0.7) / HIGH (>0.7) / CRITICAL (>0.9)]
```

### Step 0.3: Triage Decision

Based on profile, determine execution tier.

```
## Phase 0.3: Triage Decision

### Triage Matrix
| Complexity | Criticality | Tier | Budget | Layers |
|------------|-------------|------|--------|--------|
| LOW | LOW | 1 | 10K max | 1 only |
| LOW | MEDIUM | 2 | 20K max | 1 + partial 2 |
| MEDIUM | LOW | 2 | 20K max | 1 + partial 2 |
| MEDIUM | MEDIUM | 3 | 40K max | 1 + 2 |
| HIGH | MEDIUM | 3 | 40K max | 1 + 2 |
| MEDIUM | HIGH | 4 | 60K max | 1 + 2 + 4 if needed |
| HIGH | HIGH | 4 | 60K max | 1 + 2 + 4 if needed |
| ANY | CRITICAL | 5 | 100K+ | All layers |

### Selected Tier
Complexity: [value]
Criticality: [value]
**TIER: [1-5]**
**BUDGET: [N]K tokens**
**LAYERS: [list]**

### Budget Allocation
| Layer | Allocation | Purpose |
|-------|------------|---------|
| Layer 1 (Innate) | [N]K | Fast pattern detection |
| Layer 2 (Adaptive) | [N]K | Deep analysis |
| Layer 3 (Memory) | ~1K | Learning overhead |
| Layer 4 (Escalation) | [N]K if triggered | Human review |
| Reserve | [N]K | Contingency |
```

---

## LAYER 1: INNATE DETECTION (Phase 1-2)

**Purpose:** Fast, pattern-based detection using core methods AND Error Theory taxonomy.
**Budget:** ~5-10K tokens
**Always executes:** YES (every artifact)

### Phase 1: Core Pattern Checks & Taxonomy Scan

#### 1.1 Consistency Check (#84)

```
## 1.1 Consistency Check

### Definition Stability
| Term | First Definition | Later Usage | Consistent? |
|------|------------------|-------------|-------------|
| [term] | "[definition]" at [location] | "[usage]" at [location] | YES/NO |

### Contradiction Scan
| Statement A | Statement B | Contradiction? |
|-------------|-------------|----------------|
| "[claim 1]" | "[claim 2]" | YES/NO/POSSIBLE |

Consistency verdict: [PASS / FAIL with details]
```

#### 1.2 Completeness Check (#83)

```
## 1.2 Completeness Check

### Required Elements
For artifact type [TYPE], check required elements:

| Element | Present? | Location | Quality |
|---------|----------|----------|---------|
| [element 1] | YES/NO | [where] | COMPLETE/PARTIAL/MISSING |
| [element 2] | YES/NO | [where] | COMPLETE/PARTIAL/MISSING |

### TODO/Placeholder Scan
| Marker | Location | Impact |
|--------|----------|--------|
| [TODO] | [line] | [blocker/minor] |
| [TBD] | [line] | [blocker/minor] |
| [PLACEHOLDER] | [line] | [blocker/minor] |

Completeness verdict: [PASS / FAIL with details]
```

#### 1.3 Scope Alignment Check (#81)

```
## 1.3 Scope Alignment Check

Original task (verbatim): "[task]"

### Element Coverage
| Task Element | Addressed? | Evidence |
|--------------|------------|----------|
| [element 1] | FULL/PARTIAL/OMITTED | "[quote]" |
| [element 2] | FULL/PARTIAL/OMITTED | "[quote]" |

### Scope Drift Detection
| Omission | Silent/Explicit | CUI BONO |
|----------|-----------------|----------|
| [omission] | [type] | AGENT/OUTCOME |

Scope verdict: [ALIGNED / DRIFTED with details]
```

#### 1.4 Error Theory Taxonomy Scan (NEW)

Instead of generic "Known Pattern Detection", scan for specific **Error Categories**.

```
## 1.4 Error Theory Taxonomy Scan

Scan the artifact for *indicators* of these error types. This is a heuristic scan, not a deep proof.

| Category | Definition | Indicators Present? | Confidence |
|----------|------------|---------------------|------------|
| LOGIC | Reasoning flaws, fallacies, incorrect deductions | [list indicators] | [0-100%] |
| SEMANTIC | Ambiguity, definitional drift, category errors | [list indicators] | [0-100%] |
| OMISSION | Missing requirements, scenarios, or safeguards | [list indicators] | [0-100%] |
| SECURITY | Vulnerabilities, lack of defense, trust issues | [list indicators] | [0-100%] |
| RESOURCE | Efficiency issues, leaks, unoptimized paths | [list indicators] | [0-100%] |
| CONCURRENCY| Race conditions, deadlocks, state inconsistency | [list indicators] | [0-100%] |

**Primary Error Vectors:** [List top 2 categories with highest confidence]
```

### Phase 2: Layer 1 Findings & Decision

```
## Phase 2: Layer 1 Summary

### Findings from Innate Detection
| ID | Check | Severity | Description | Category (Error Theory) |
|----|-------|----------|-------------|-------------------------|
| L1-1 | [check] | [sev] | [finding] | [LOGIC/SECURITY/etc.] |

### Decision Gate

**FAST PATH CONDITIONS:**

Condition A - CRITICAL FINDING:
- [ ] Any finding with severity = CRITICAL
- If YES → Jump to Layer 4 (Escalation)

Condition B - SIMPLE COMPLETION:
- [ ] Tier = 1 AND
- [ ] No CRITICAL or IMPORTANT findings AND
- [ ] Complexity = LOW
- If ALL YES → Skip Layer 2, proceed to Layer 3 (Memory)

Condition C - CONTINUE TO ADAPTIVE:
- [ ] Tier >= 2 OR
- [ ] IMPORTANT findings present OR
- [ ] Complexity >= MEDIUM
- If ANY YES → Continue to Layer 2

**DECISION: [ESCALATE / COMPLETE / CONTINUE]**
```

**If COMPLETE:** → Skip to Layer 3 (Memory) → Output findings
**If ESCALATE:** → Jump to Layer 4 (Escalation)
**If CONTINUE:** → Proceed to Layer 2

---

## LAYER 2: ADAPTIVE DETECTION (Phase 3-5)

**Purpose:** Deep analysis seeded by Error Theory findings.
**Budget:** ~15-30K tokens
**Executes:** Tier 2+ only

### Phase 3: Dynamic Method Selection (Seeded)

**KEY INNOVATION:** Selection is now weighted by the Error Vectors found in Phase 1.3.

#### 3.1 Relevance Scoring

```
## 3.1 Method Relevance Scoring

### Scoring Formula
For method M and artifact A:

RELEVANCE(M, A) =
  domain_match(M, A.domains) × 0.20 +
  error_vector_match(M, A.primary_error_vectors) × 0.30 +  <-- BOOSTED
  complexity_match(M, A.complexity) × 0.15 +
  historical_effectiveness(M) × 0.20 +
  category_coverage(M, selected) × 0.15

### Candidate Methods (Top 2×BUDGET)
| Rank | Method | Category | Relevance | Selection Reasoning |
|------|--------|----------|-----------|---------------------|
| 1 | #[N] [name] | [cat] | [0.XX] | [why relevant to THIS artifact] |
| 2 | #[N] [name] | [cat] | [0.XX] | [why relevant to THIS artifact] |
| ... | ... | ... | ... | ... |

### Category Distribution Check
| Category | Count | Min Required |
|----------|-------|--------------|
| core | [N] | 2 |
| risk | [N] | 1 |
| sanity | [N] | 1 |
| [domain-specific] | [N] | 1 if domain present |

Distribution: [BALANCED / NEEDS ADJUSTMENT]
```

#### 3.2 Reasoning Gate

Each selected method must pass reasoning check:

```
## 3.2 Reasoning Gate

| Method | Why for THIS artifact | Circular? | Pass |
|--------|----------------------|-----------|------|
| #[N] | [specific reason referencing artifact content] | NO | YES |
| #[N] | "checks contradictions" | YES - generic | NO |

### Final Selection
Methods passing gate: [N]
Budget allows: [N]
Selected: [list with IDs]
```

### Phase 4: Adaptive Analysis

#### 4.1 Method Application

Apply selected methods with depth tracking:

```
## 4.1 Method Application

### Method: #[N] [Name]
**Applied to:** [specific artifact section/concern]

**Process:**
1. Surface observation: [what method reveals]
2. Deeper analysis: [following method's pattern]
3. Root cause (if finding): [5 Whys if applicable]

**Result:**
- Finding: [YES/NO]
- If YES: [description]
- Depth achieved: [SYMPTOM/CAUSE/STRUCTURE/ASSUMPTION/ROOT_CAUSE]
- Confidence: [0-100%]
- Evidence: "[quote]" at [location]

[Repeat for each method]
```

#### 4.2 Anomaly Detection

**Purpose:** Flag patterns that DON'T match known categories.

```
## 4.2 Anomaly Detection

### Anomaly Scan
Look for elements that:
- Don't fit any known pattern category
- Have unusual structural properties
- Use unexpected combinations
- Seem "off" without clear classification

| Element | Location | Anomaly Type | Confidence | Investigation Needed |
|---------|----------|--------------|------------|---------------------|
| [element] | [where] | UNCLASSIFIED/UNUSUAL/UNEXPECTED | [0-100%] | [what to check] |

### Anomaly Classification
| Anomaly | After Investigation | Verdict |
|---------|---------------------|---------|
| [A1] | [investigation result] | FALSE_POSITIVE / NEW_PATTERN / UNKNOWN |

**NEW_PATTERN findings:** Add to Layer 3 for learning
**UNKNOWN findings:** Escalate to Layer 4 if confidence < 70%
```

#### 4.3 Hypothesis Generation (from Error Theory)

**Refined in V7.1**: Generate hypotheses based on the *absence* of expected safeguards for the specific Error Vectors.

```
## 4.3 Hypothesis Generation

For each Primary Error Vector (from 1.3):

**Question:** If this artifact had a [CATEGORY] error, where would it hide?

| Hypothesis | Symptoms to Check | Evidence Found | Status |
|------------|-------------------|----------------|--------|
| H1: [hypothesis based on category] | [symptom list] | [evidence] | [status] |
```

### Phase 5: Confidence Assessment & Challenge

#### 5.1 Finding Consolidation

```
## 5.1 Finding Consolidation

### All Findings (Layer 1 + Layer 2)
| ID | Source | Type | Severity | Description | Confidence | Root Cause |
|----|--------|------|----------|-------------|------------|------------|
| F1 | L1-Consistency | CONFLICT | 🔴 | [desc] | 95% | [root cause] |
| F2 | L2-Method #108 | THEORY | 🔴 | [desc] | 90% | [root cause] |
| F3 | L2-Anomaly | UNKNOWN | 🟠 | [desc] | 65% | [needs investigation] |

### Confidence Distribution
| Confidence Band | Count | Action |
|-----------------|-------|--------|
| 90-100% | [N] | Report as confirmed |
| 70-89% | [N] | Report with caveat |
| 50-69% | [N] | Flag for review |
| <50% | [N] | Consider dropping or escalating |
```

#### 5.2 Challenge Protocol

```
## 5.2 Challenge Protocol

For each finding with confidence >= 50%:

### Finding [F1]
**#63 Critical Challenge:** Strongest argument AGAINST this finding:
[argument]

**#133 Abilene Check:** Does this problem ACTUALLY exist?
[assessment]

**#109 Contraposition:** What would GUARANTEE this finding correct?
[condition] → Met? [YES/NO]

**Verdict:** [CONFIRMED / DOWNGRADED / DROPPED]
**Final Confidence:** [adjusted %]

[Repeat for each finding]
```

---

## LAYER 3: IMMUNE MEMORY (Phase 6)

**Purpose:** Learn from this verification AND external knowledge.
**Budget:** ~1K tokens (overhead)
**Always executes:** YES

### Phase 6: Learning & Knowledge Injection

#### 6.1 Results Recording

```
## 6.1 Results Recording

### Verification Metrics
| Metric | Value |
|--------|-------|
| Artifact type | [type] |
| Artifact size | [N] tokens |
| Tier executed | [N] |
| Budget allocated | [N]K |
| Budget used | [N]K |
| Layers executed | [list] |

### Detection Metrics
| Metric | Value |
|--------|-------|
| Findings total | [N] |
| CRITICAL findings | [N] |
| IMPORTANT findings | [N] |
| MINOR findings | [N] |
| Anomalies detected | [N] |
| Anomalies → real findings | [N] |
| Anomalies → false positives | [N] |
| Hypotheses generated | [N] |
| Hypotheses confirmed | [N] |
```

#### 6.2 Knowledge Injection (NEW)

**Purpose:** Explicitly read optimization strategies to prevent stagnation.

```
## 6.2 Knowledge Injection

**Action:** Read `src/core/knowledge/optimization-strategies.md` (if available).

**Application:**
1. Does this artifact violate any known optimization strategy?
2. Does the *verification process itself* violate any strategy?

| Strategy | Violation? | Recommendation |
|----------|------------|----------------|
| [strategy name] | YES/NO | [fix] |
```

#### 6.3 Method Effectiveness & Weight Updates

```
## 6.2 Method Effectiveness

### Method Performance This Run
| Method | Relevance Score | Findings | Confirmed | ROI |
|--------|-----------------|----------|-----------|-----|
| #[N] | [score] | [N] | [N] | [findings/cost] |
| #[N] | [score] | [N] | [N] | [findings/cost] |

### Weight Updates
For each method used:
new_weight = old_weight × 0.9 + session_performance × 0.1

| Method | Old Weight | Performance | New Weight |
|--------|------------|-------------|------------|
| #[N] | [old] | [0-1] | [new] |

### New Pattern Learning
| Pattern | Source | Description | Suggested Pattern ID |
|---------|--------|-------------|---------------------|
| [new pattern] | Anomaly A1 | [what to match] | P00[N] |
```

#### 6.3 Adaptation Feedback

```
## 6.3 Adaptation Feedback

### What Worked
| Element | Evidence | Keep/Amplify |
|---------|----------|--------------|
| [selection strategy] | [result] | [recommendation] |
| [method X] | [findings] | [recommendation] |

### What Didn't Work
| Element | Evidence | Change/Remove |
|---------|----------|---------------|
| [selection strategy] | [result] | [recommendation] |
| [method Y] | [no findings, high cost] | [recommendation] |

### Process Improvement Suggestions
| Suggestion | Basis | Priority |
|------------|-------|----------|
| [suggestion] | [evidence] | HIGH/MEDIUM/LOW |
```

---

## LAYER 4: ESCALATION (Phase 7)

**Purpose:** Human review for critical findings and low-confidence items.
**Budget:** Variable
**Executes:** When triggered

### Phase 7: Escalation Protocol

#### 7.1 Escalation Triggers

```
## 7.1 Escalation Check

### Automatic Triggers
| Trigger | Condition | Met? |
|---------|-----------|------|
| CRITICAL finding | Any finding severity = CRITICAL | YES/NO |
| Low confidence | Any finding confidence < 70% | YES/NO |
| Unresolved anomaly | Anomaly verdict = UNKNOWN | YES/NO |
| Theoretical impossibility | Theory check flagged violation | YES/NO |
| Definitional conflict | Conflict with no construction proof | YES/NO |

### Escalation Decision
Triggers met: [N]
**ESCALATE: [YES/NO]**
```

#### 7.2 Escalation Package (if triggered)

```
## 7.2 Escalation Package

### Items Requiring Human Review

#### CRITICAL Findings
| ID | Finding | Confidence | Why Escalated |
|----|---------|------------|---------------|
| [F1] | [description] | [%] | [reason] |

#### Low Confidence Items
| ID | Finding | Confidence | What Would Increase Confidence |
|----|---------|------------|--------------------------------|
| [F2] | [description] | [%] | [evidence needed] |

#### Unresolved Anomalies
| ID | Anomaly | Investigation Done | What User Should Check |
|----|---------|-------------------|------------------------|
| [A1] | [description] | [what agent tried] | [specific check for user] |

### Recommended Actions
For each escalated item:
| Item | Recommended Action | If Confirmed | If Refuted |
|------|-------------------|--------------|------------|
| [F1] | [action] | [consequence] | [consequence] |

### User Decision Required
For each item, user must provide:
- [ ] CONFIRM - Finding is valid
- [ ] REFUTE - Finding is not valid, reason: ___
- [ ] DEFER - Cannot determine, will live with risk
```

**HALT** - waiting for user decisions on escalated items

#### 7.3 Post-Escalation Update

After user decisions:

```
## 7.3 Post-Escalation Update

### User Decisions
| Item | User Decision | Rationale |
|------|---------------|-----------|
| [F1] | CONFIRM/REFUTE/DEFER | [user's reason] |

### Finding Updates
| Item | Original Status | Updated Status |
|------|-----------------|----------------|
| [F1] | ESCALATED | CONFIRMED/DROPPED/DEFERRED |

### Learning from Escalation
| Item | Agent Assessment | User Decision | Agent Was |
|------|------------------|---------------|-----------|
| [F1] | [assessment] | [decision] | CORRECT/WRONG |

→ Update weights based on escalation accuracy
```

---

## OUTPUT: Verification Report

```
## Deep Verify V7.1 - Verification Report

### Artifact Summary
| Property | Value |
|----------|-------|
| Type | [type] |
| Domains | [domains] |
| Complexity | [LOW/MEDIUM/HIGH] |
| Criticality | [LOW/MEDIUM/HIGH/CRITICAL] |
| Tier Executed | [1-5] |

### Execution Summary
| Metric | Value |
|--------|-------|
| Budget | [N]K allocated / [N]K used |
| Layers | [list] |
| Methods applied | [N] |
| Anomalies detected | [N] |
| Hypotheses tested | [N] |
| Escalations | [N] |

### Findings (Categorized)

#### CRITICAL (Must Fix)
| ID | Type (Error Theory) | Description | Confidence | Root Cause |
|----|---------------------|-------------|------------|------------|
| [F1] | [LOGIC/SEC/etc.] | [desc] | [%] | [root cause] |

#### IMPORTANT (Should Fix)
| ID | Type (Error Theory) | Description | Confidence | Root Cause |
|----|---------------------|-------------|------------|------------|
| [F2] | [LOGIC/SEC/etc.] | [desc] | [%] | [root cause] |

#### MINOR (Consider Fixing)
| ID | Type (Error Theory) | Description | Confidence | Root Cause |
|----|---------------------|-------------|------------|------------|
| [F3] | [LOGIC/SEC/etc.] | [desc] | [%] | [root cause] |

#### DEFERRED (User Accepted Risk)
| ID | Type (Error Theory) | Description | User Rationale |
|----|---------------------|-------------|----------------|
| [F4] | [LOGIC/SEC/etc.] | [desc] | [rationale] |

### Fundamental Limits (Gödel Gap)
| Limit Type | Description |
|------------|-------------|
| Ground Truth | Verification limited by provided context/truth |
| Semantic Gap | "Matches" are probabilistic, not absolute |
| [Other] | [Specific limit relevant to this run] |

### Recommendations
| Priority | Action | Addresses |
|----------|--------|-----------|
| 1 | [action] | [finding IDs] |
| 2 | [action] | [finding IDs] |

### Process Metrics (for tracking)
| Metric | This Run | Running Average |
|--------|----------|-----------------|
| Tokens per finding | [N] | [N] |
| True positive rate | [%] | [%] |
| False positive rate | [%] | [%] |
| Anomaly precision | [%] | [%] |
```

---

## Appendix A: Tier Reference

| Tier | Budget | Layers | When Used |
|------|--------|--------|-----------|
| 1 | 10K | 1 only | Simple, low-criticality artifacts |
| 2 | 20K | 1 + partial 2 | Low complexity OR low criticality |
| 3 | 40K | 1 + 2 | Medium complexity AND medium+ criticality |
| 4 | 60K | 1 + 2 + 4 if needed | High complexity OR high criticality |
| 5 | 100K+ | All | Critical artifacts, comprehensive review |

---

## Appendix B: Anomaly Types

| Type | Description | Detection |
|------|-------------|-----------|
| UNCLASSIFIED | Element doesn't match any known pattern | Pattern library miss |
| UNUSUAL | Structure or content deviates from norm | Statistical outlier |
| UNEXPECTED | Element present where not expected | Context mismatch |
| INTERACTION | Two elements conflict in non-obvious way | Cross-reference check |
| DOMAIN_MISMATCH | Element from wrong domain context | Domain classifier |

---

## Appendix C: Confidence Calibration

| Confidence | Meaning | Action |
|------------|---------|--------|
| 95-100% | Near certain | Report as confirmed |
| 80-94% | High confidence | Report with standard weight |
| 65-79% | Moderate confidence | Report with caveat |
| 50-64% | Low confidence | Flag for user verification |
| <50% | Speculation | Do not report as finding |

---

## Appendix D: Method Selection Flowchart

```
START
  │
  ▼
Is artifact domain-specific? ──YES──→ Include domain methods (top 3 by relevance)
  │ NO                                         │
  ▼                                            ▼
Include core methods (consistency, completeness, scope)
  │
  ▼
Layer 1 findings present? ──YES──→ Include methods targeting finding types
  │ NO                                         │
  ▼                                            ▼
Include risk methods (pre-mortem, failure mode)
  │
  ▼
Budget remaining? ──YES──→ Add next highest relevance method
  │ NO                     │
  ▼                        │
Check category coverage    │
  │                        │
  ▼                        │
Missing categories? ──YES──┘
  │ NO
  ▼
SELECTION COMPLETE
```

---

## Appendix E: Learning Weight Formula

```
Method effectiveness score:

score(M) =
  (findings_confirmed / findings_claimed) × 0.4 +
  (1 - false_positive_rate) × 0.3 +
  (findings / tokens_used) × 0.2 +
  user_feedback_score × 0.1

Weight update:
new_weight(M) = old_weight(M) × 0.9 + score(M) × 0.1

Method retirement threshold:
If weight(M) < 0.3 for 10 consecutive runs → flag for removal review
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 7.1 | 2026-01-XX | EVOLUTION: Integrated Error Theory (Taxonomy Scan), Seeded Method Selection, Knowledge Injection slot, Limits Acknowledgment. |
| 7.0 | 2026-01-13 | MAJOR: Adaptive Verification System architecture. |
