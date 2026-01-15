# Deep Verify V7.1 - Adaptive Verification System (AVS)

## What is this?

**Deep Verify V7.1** extends V7.0's Adaptive Verification System with concrete execution support. V7.1 adds Method Cards for step-by-step execution, trigger-based method selection, persistent learning storage, and knowledge management protocols.

**V7.1 Additions over V7.0:**
- **Phase 0.0: Library Loading** - Blocking gate ensuring all resources loaded
- **Method Cards** - Step-by-step execution instructions for critical methods
- **Method Triggers** - Feature-to-method mapping for fast pre-selection
- **Method Weights Persistence** - Store learning across sessions
- **Knowledge Management Protocol** - Handle knowledge gaps systematically
- **Agent Quick Reference** - Single-page execution guide

**Core Architecture (from V7.0):**
- **4-Layer Architecture**: Innate → Adaptive → Memory → Escalation
- **Dynamic Method Selection**: Per-artifact, not predefined
- **Anomaly Detection**: Flags unknown patterns
- **Learning Loop**: Improves with each verification run
- **Tiered Execution**: Cost proportional to artifact criticality

---

## Key Concepts

| Term | Definition |
|------|------------|
| LAYER | Detection tier: INNATE (fast, pattern) / ADAPTIVE (deep, learning) / MEMORY / ESCALATION |
| PROFILE | Artifact characteristics: domains, structure, complexity, criticality |
| TRIAGE | Severity classification determining execution tier |
| BUDGET | Token allocation based on triage tier |
| RELEVANCE | Method score for THIS artifact (not global) |
| ANOMALY | Pattern that doesn't match known categories → flagged for investigation |
| CONFIDENCE | Certainty level (0-100%) for each finding |
| LEARNING | Weight updates based on detection results |
| METHOD CARD | Step-by-step execution instructions for a method |
| TRIGGER | Feature pattern that activates specific methods |

**Methods source:** `src/core/methods/methods.csv`
**Domain knowledge:** `src/core/knowledge/domain-knowledge-base.md`

### V7.1 Required Resources

| Resource | Path | Purpose |
|----------|------|---------|
| **Agent Quick Reference** | `src/core/workflows/deep-verify/agent-quick-reference.md` | Single-page execution guide |
| **Method Triggers** | `src/core/methods/method_triggers.yaml` | Feature → method mapping |
| **Method Weights** | `src/core/methods/method_weights.yaml` | Historical effectiveness |
| **Method Cards** | `src/core/methods/method_cards/MC-{N}-*.md` | Step-by-step execution |
| **Knowledge Protocol** | `src/core/methods/knowledge-management-protocol.md` | KB handling |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                 ADAPTIVE VERIFICATION SYSTEM V7.1                │
└─────────────────────────────────────────────────────────────────┘

     ┌──────────────────────────────────────────────────────┐
     │              PHASE 0.0: LIBRARY LOADING              │
     │  ⛔ BLOCKING - Load methods, triggers, weights, KB   │
     └────────────────────────┬─────────────────────────────┘
                              │
     ┌────────────────────────▼─────────────────────────────┐
     │                  ARTIFACT INTAKE                      │
     │  Phase 0: Profile → Triage → Budget Allocation        │
     └────────────────────────┬─────────────────────────────┘
                              │
     ┌────────────────────────▼─────────────────────────────┐
     │           LAYER 1: INNATE DETECTION                   │
     │  Phase 1-2: Fast pattern matching (~5-10K tokens)     │
     │  • Consistency checks                                 │
     │  • Completeness checks                                │
     │  • Known pattern detection                            │
     │                                                       │
     │  FAST PATH: Critical finding → Layer 4 (escalate)     │
     │  FAST PATH: Simple + no findings → DONE               │
     └────────────────────────┬─────────────────────────────┘
                              │
     ┌────────────────────────▼─────────────────────────────┐
     │          LAYER 2: ADAPTIVE DETECTION                  │
     │  Phase 3-5: Deep analysis (~15-30K tokens)            │
     │  • Trigger-based method pre-selection                 │
     │  • Artifact-specific method selection                 │
     │  • Method Card execution                              │
     │  • Anomaly detection for unknown patterns             │
     │  • Hypothesis generation from first principles        │
     │  • Multi-domain interaction analysis                  │
     │  • Explicit uncertainty quantification                │
     └────────────────────────┬─────────────────────────────┘
                              │
     ┌────────────────────────▼─────────────────────────────┐
     │           LAYER 3: IMMUNE MEMORY                      │
     │  Phase 6: Learning and weight updates                 │
     │  • Record what found, what missed                     │
     │  • Update method_weights.yaml                         │
     │  • Add new patterns from findings                     │
     │  • Retire low-ROI methods                            │
     └────────────────────────┬─────────────────────────────┘
                              │
     ┌────────────────────────▼─────────────────────────────┐
     │           LAYER 4: ESCALATION                         │
     │  Phase 7: Human review (triggered, not default)       │
     │  • Critical finding escalation                        │
     │  • Low confidence escalation                          │
     │  • Anomaly investigation                              │
     │  • Human-in-loop decision                             │
     └─────────────────────────────────────────────────────┘
```

---

## Phase 0.0: Library Loading (BLOCKING)

**Purpose:** Load all required files before verification can begin.

⛔ **BLOCKING GATE** - Cannot proceed without completing this phase.

### Required Files Checklist

```markdown
## Library Loading

| # | File | Path | Status |
|---|------|------|--------|
| 1 | Methods CSV | src/core/methods/methods.csv | ✅/❌ |
| 2 | Method Triggers | src/core/methods/method_triggers.yaml | ✅/❌ |
| 3 | Method Weights | src/core/methods/method_weights.yaml | ✅/❌ |
| 4 | Domain KB | src/core/knowledge/domain-knowledge-base.md | ✅/❌ |

### Load Summary
- Methods loaded: [N] from methods.csv
- Triggers loaded: [N] rules from triggers.yaml
- Weights loaded: [N] methods with historical data
- KB sections: [N] available

### Gate Status
[ ] ALL FILES LOADED → Proceed to Phase 0.1
[ ] ANY FILE MISSING → HALT with error below

**If HALT:**
Missing: [list missing files]
Action required: [what to do]
```

### Fallback Behavior

| Missing File | Fallback | Impact |
|--------------|----------|--------|
| method_triggers.yaml | Use relevance formula only | Slower selection |
| method_weights.yaml | Use default weights | No learning history |
| Method Card | Use method description | Less precise execution |
| domain-knowledge-base.md | Flag knowledge gaps | May miss theoretical issues |

**Note:** methods.csv has NO fallback - it is absolutely required.

---

## Phase 0: Artifact Intake & Triage (MANDATORY)

**Purpose:** Profile artifact and allocate resources proportionally.

### Step 0.1: Self-Check (Unchanged from V6)

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
| Sections | [N] distinct sections | Heading count |
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

### Feature Detection (V7.1 - for trigger matching)
Scan for trigger features:

| Feature | Pattern Matched | Confidence |
|---------|-----------------|------------|
| domain_crypto | [matched patterns] | [0-1] |
| domain_distributed | [matched patterns] | [0-1] |
| claim_guarantee | [matched patterns] | [0-1] |
| claim_both_and | [matched patterns] | [0-1] |
| multiple_requirements | [count > 3?] | [0-1] |
| external_deps | [matched patterns] | [0-1] |
| circular_ref | [matched patterns] | [0-1] |

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

### Step 0.4: Confirmation Gate

```
## Phase 0.4: Intake Confirmation

**ARTIFACT SUMMARY**
Type: [type]
Size: [N] tokens
Domains: [primary domains]
Features detected: [list from 0.2]
Complexity: [LOW/MEDIUM/HIGH]
Criticality: [LOW/MEDIUM/HIGH/CRITICAL]

**EXECUTION PLAN**
Tier: [1-5]
Budget: [N]K tokens
Layers: [1 / 1+2 / 1+2+4 / all]
Method selection: [STATIC for Tier 1 / DYNAMIC for Tier 2+]
Trigger methods: [list from triggers.yaml based on features]

[C] Correct - proceed with this plan
[E] Edit - change tier/budget
[X] Exit - cancel verification
```

**HALT** - waiting for choice

---

## LAYER 1: INNATE DETECTION (Phase 1-2)

**Purpose:** Fast, pattern-based detection using core methods.
**Budget:** ~5-10K tokens
**Always executes:** YES (every artifact)

### Phase 1: Core Pattern Checks

These checks ALWAYS run regardless of tier. They are the "innate immunity" - pre-programmed, fast, broad.

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

#### 1.4 Known Pattern Detection

Apply pattern matchers for known error types:

```
## 1.4 Known Pattern Detection

### Pattern Library Scan
| Pattern ID | Pattern Name | Match? | Evidence |
|------------|--------------|--------|----------|
| P001 | Definitional contradiction | YES/NO | [quote if YES] |
| P002 | Circular dependency | YES/NO | [quote if YES] |
| P003 | Missing error handling | YES/NO | [quote if YES] |
| P004 | Unvalidated assumption | YES/NO | [quote if YES] |
| P005 | Inconsistent terminology | YES/NO | [quote if YES] |
| P006 | Scope creep | YES/NO | [quote if YES] |
| P007 | Theoretical impossibility | YES/NO | [quote if YES] |
| P008 | Domain term misuse | YES/NO | [quote if YES] |

Patterns matched: [N]
```

### Phase 2: Layer 1 Findings & Decision

```
## Phase 2: Layer 1 Summary

### Findings from Innate Detection
| ID | Check | Severity | Description | Confidence |
|----|-------|----------|-------------|------------|
| L1-1 | [check] | [sev] | [finding] | [0-100%] |
| L1-2 | [check] | [sev] | [finding] | [0-100%] |

### Token Usage
Layer 1 tokens used: [N]
Budget remaining: [N]

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

**Purpose:** Deep, artifact-specific analysis with anomaly detection.
**Budget:** ~15-30K tokens
**Executes:** Tier 2+ only

### Phase 3: Dynamic Method Selection

**KEY INNOVATION:** Methods selected FOR THIS ARTIFACT, not from predefined list.

#### 3.0 Trigger-Based Pre-Selection (V7.1)

**Before calculating RELEVANCE scores, use method_triggers.yaml for fast pre-selection:**

```markdown
## 3.0 Trigger Matching

### Features Detected (from Phase 0.2)
| Feature | Confidence | Patterns Matched |
|---------|------------|------------------|
| domain_crypto | [0-1] | "[patterns]" |
| claim_both_and | [0-1] | "[patterns]" |
| [feature] | [0-1] | "[patterns]" |

### Triggered Methods (from method_triggers.yaml)
| Trigger ID | Feature | Methods | Priority |
|------------|---------|---------|----------|
| T020 | domain_crypto | 153, 155, 156 | CRITICAL |
| T030 | claim_both_and | 108, 154, 158, 160 | CRITICAL |
| [id] | [feature] | [methods] | [priority] |

### Pre-Selected Methods
CRITICAL priority triggers: [method list]
HIGH priority triggers: [method list]
MEDIUM priority triggers: [method list]

→ These get automatic boost in RELEVANCE scoring (+0.2 for CRITICAL, +0.1 for HIGH)
```

#### 3.1 Relevance Scoring

For each method in library, calculate artifact-specific relevance:

```
## 3.1 Method Relevance Scoring

### Scoring Formula
For method M and artifact A:

RELEVANCE(M, A) =
  domain_match(M, A.domains) × 0.25 +
  complexity_match(M, A.complexity) × 0.20 +
  pattern_match(M, L1_findings) × 0.25 +
  category_coverage(M, selected) × 0.15 +
  historical_weight(M) × 0.15 +
  trigger_boost(M) × [0.1-0.2 if triggered]

### Load Historical Weights
From method_weights.yaml:
| Method | Current Weight | Baseline | Last 10 Sessions |
|--------|----------------|----------|------------------|
| #[N] | [weight] | [baseline] | [history] |

### Candidate Methods (Top 2×BUDGET)
| Rank | Method | Category | Relevance | Triggered? | Selection Reasoning |
|------|--------|----------|-----------|------------|---------------------|
| 1 | #[N] [name] | [cat] | [0.XX] | YES/NO | [why relevant to THIS artifact] |
| 2 | #[N] [name] | [cat] | [0.XX] | YES/NO | [why relevant to THIS artifact] |
| ... | ... | ... | ... | ... | ... |

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

#### 4.1 Method Application (with Method Cards)

**For each selected method, check for Method Card first:**

```markdown
## 4.1 Method Application

### Method Card Check
| Method | Card Available | Path |
|--------|----------------|------|
| #71 | YES | src/core/methods/method_cards/MC-071-first-principles.md |
| #108 | YES | src/core/methods/method_cards/MC-108-coincidentia-oppositorum.md |
| #127 | NO | Use method description |

### Available Method Cards (V7.1)
- MC-071: First Principles Analysis
- MC-072: 5 Whys Deep Dive
- MC-081: Scope Integrity Audit
- MC-083: Closure Check
- MC-084: Coherence Check
- MC-088: Executability Check
- MC-108: Coincidentia Oppositorum
- MC-122: Sorites Paradox
- MC-128: Theseus Paradox
- MC-153: Theoretical Impossibility Check

**If Card Available:**
1. Load Method Card from `src/core/methods/method_cards/MC-{N}-*.md`
2. Check "When to Use" section - confirm applicable
3. Follow "Execution Steps" exactly
4. Use "Output Template" for results
5. Run "Quality Checks" before finalizing

**If Card NOT Available:**
1. Use method description from methods.csv
2. Apply based on description and output_pattern
3. Flag for future card creation
```

Apply selected methods with depth tracking:

```
## Method Execution: #[N] [Name]

**Card Used:** YES/NO
**Applied to:** [specific artifact section/concern]

**Process (from Card or Description):**
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

#### 4.2 Knowledge Gap Handling (V7.1)

**When encountering unknown terms or concepts:**

```markdown
## 4.2 Knowledge Gap Protocol

Execute knowledge-management-protocol.md when:
- Unknown domain term encountered
- Claim contradicts or depends on theoretical knowledge
- Pattern doesn't match any known category
- Agent is uncertain about domain fact

### Knowledge Gap Log
| ID | Type | Term/Concept | Context | Status |
|----|------|--------------|---------|--------|
| G1 | TERM | [unknown] | "[context]" | OPEN |
| G2 | THEOREM | [claim] | "[context]" | OPEN |

### Resolution
| Gap | KB Section | Found? | Action |
|-----|------------|--------|--------|
| G1 | Section 2 | YES/NO | Applied / DEFER / INFER |
| G2 | Section 1 | YES/NO | Applied / DEFER / INFER |

**If DEFER:** HALT - ask user for clarification
**If INFER:** Continue with caveat, flag for verification
```

#### 4.3 Anomaly Detection

**Purpose:** Flag patterns that DON'T match known categories.

```
## 4.3 Anomaly Detection

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

#### 4.4 Hypothesis Generation

**Purpose:** Generate detection hypotheses from first principles when patterns don't apply.

```
## 4.4 Hypothesis Generation

For each UNKNOWN anomaly or uncovered area:

### First Principles Check
**Question:** If this artifact were WRONG, what would be symptoms?

| Hypothesis | Symptoms to Check | Evidence Found | Status |
|------------|-------------------|----------------|--------|
| H1: [hypothesis] | [symptom list] | [evidence or none] | CONFIRMED/REFUTED/UNCERTAIN |
| H2: [hypothesis] | [symptom list] | [evidence or none] | CONFIRMED/REFUTED/UNCERTAIN |

### Inversion Check (#80)
**Question:** What would GUARANTEE this artifact fails?

| Failure Path | Artifact Does This? | Finding? |
|--------------|---------------------|----------|
| [failure 1] | YES/NO/PARTIAL | [finding if YES] |
| [failure 2] | YES/NO/PARTIAL | [finding if YES] |
```

### Phase 5: Confidence Assessment & Challenge

#### 5.1 Finding Consolidation

```
## 5.1 Finding Consolidation

### All Findings (Layer 1 + Layer 2)
| ID | Source | Type | Severity | Description | Confidence | Root Cause |
|----|--------|------|----------|-------------|------------|------------|
| F1 | L1-Consistency | CONFLICT | CRITICAL | [desc] | 95% | [root cause] |
| F2 | L2-Method #108 | THEORY | CRITICAL | [desc] | 90% | [root cause] |
| F3 | L2-Anomaly | UNKNOWN | IMPORTANT | [desc] | 65% | [needs investigation] |

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

**Purpose:** Learn from this verification to improve future runs.
**Budget:** ~1K tokens (overhead)
**Always executes:** YES

### Phase 6: Learning Extraction

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

#### 6.2 Method Effectiveness & Weight Persistence (V7.1)

```
## 6.2 Method Effectiveness

### Method Performance This Run
| Method | Relevance Score | Findings | Confirmed | Tokens | ROI |
|--------|-----------------|----------|-----------|--------|-----|
| #[N] | [score] | [N] | [N] | [N] | [findings/tokens] |
| #[N] | [score] | [N] | [N] | [N] | [findings/tokens] |

### Session Score Calculation
For each method:
score = (confirmed/claimed)*0.4 + (1-FP_rate)*0.3 + efficiency*0.2 + feedback*0.1

| Method | Confirmed/Claimed | FP Rate | Efficiency | Session Score |
|--------|-------------------|---------|------------|---------------|
| #[N] | [N]/[N] | [0-1] | [0-1] | [0-1] |

### Weight Updates
Formula: new_weight = old_weight × 0.9 + session_score × 0.1

| Method | Old Weight | Session Score | New Weight |
|--------|------------|---------------|------------|
| #[N] | [old] | [score] | [new] |

### ⚠️ PERSIST TO FILE
**SAVE to:** `src/core/methods/method_weights.yaml`

Updates required:
1. Update `methods.[N].current` field with new weight
2. Append session score to `methods.[N].history` (keep last 10)
3. Update `methods.[N].stats` with this session's counts
4. Add entry to `update_log`:
   ```yaml
   - session_id: "[generate unique ID]"
     timestamp: "[current ISO timestamp]"
     methods_updated: [[method IDs]]
     notes: "verification of [artifact name]"
   ```
5. Update `last_updated` timestamp
6. Increment `session_count`

### Retirement Check
| Method | Weight | Below 0.3 for | Action |
|--------|--------|---------------|--------|
| #[N] | [weight] | [N] sessions | ACTIVE/FLAG/RETIRE |

If any method flagged, add to `flagged_methods` for user review.
```

#### 6.3 New Pattern Learning

```
## 6.3 New Pattern Learning

### Patterns Discovered
| Pattern | Source | Description | Suggested Pattern ID |
|---------|--------|-------------|---------------------|
| [new pattern] | Anomaly A1 | [what to match] | P00[N] |

### Knowledge Base Updates (if any)
Execute knowledge-management-protocol.md Phase 4 for any new knowledge.

| Entry | Type | Status | KB Section |
|-------|------|--------|------------|
| [entry] | TERM/THEOREM/PATTERN | PROPOSED | Section [N] |
```

#### 6.4 Adaptation Feedback

```
## 6.4 Adaptation Feedback

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
| Knowledge gap deferred | Any DEFER in knowledge protocol | YES/NO |

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

#### Knowledge Gaps Deferred
| ID | Gap | What Agent Needs |
|----|-----|------------------|
| [G1] | [unknown term/concept] | [definition or confirmation] |

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
→ If WRONG, adjust relevant method weights downward
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
| Features | [detected features] |
| Complexity | [LOW/MEDIUM/HIGH] |
| Criticality | [LOW/MEDIUM/HIGH/CRITICAL] |
| Tier Executed | [1-5] |

### Execution Summary
| Metric | Value |
|--------|-------|
| Budget | [N]K allocated / [N]K used |
| Layers | [list] |
| Methods applied | [N] (with [N] Method Cards) |
| Triggered methods | [N] |
| Anomalies detected | [N] |
| Hypotheses tested | [N] |
| Knowledge gaps | [N] resolved / [N] deferred |
| Escalations | [N] |

### Findings

#### CRITICAL (Must Fix)
| ID | Type | Description | Confidence | Root Cause |
|----|------|-------------|------------|------------|
| [F1] | [type] | [desc] | [%] | [root cause] |

#### IMPORTANT (Should Fix)
| ID | Type | Description | Confidence | Root Cause |
|----|------|-------------|------------|------------|
| [F2] | [type] | [desc] | [%] | [root cause] |

#### MINOR (Consider Fixing)
| ID | Type | Description | Confidence | Root Cause |
|----|------|-------------|------------|------------|
| [F3] | [type] | [desc] | [%] | [root cause] |

#### DEFERRED (User Accepted Risk)
| ID | Type | Description | User Rationale |
|----|------|-------------|----------------|
| [F4] | [type] | [desc] | [rationale] |

### Uncertainty Report
| Area | Confidence | What Agent Couldn't Verify |
|------|------------|---------------------------|
| [area] | [%] | [limitation] |

### Knowledge Management Summary
| Gap Type | Count | Resolved | Deferred | Inferred |
|----------|-------|----------|----------|----------|
| TERM | [N] | [N] | [N] | [N] |
| THEOREM | [N] | [N] | [N] | [N] |
| PATTERN | [N] | [N] | [N] | [N] |

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
| Method card usage | [%] | [%] |

### Weight Updates Applied
| Method | Change | New Weight |
|--------|--------|------------|
| #[N] | +/- [delta] | [new] |

Saved to: method_weights.yaml
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

## Appendix D: Method Selection Flowchart (V7.1)

```
START
  │
  ▼
Load method_triggers.yaml ──FAIL──→ Continue without triggers
  │ OK
  ▼
Match features to triggers
  │
  ▼
CRITICAL triggers present? ──YES──→ Add triggered methods (+0.2 boost)
  │ NO                                         │
  ▼                                            ▼
HIGH triggers present? ──YES──→ Add triggered methods (+0.1 boost)
  │ NO                                         │
  ▼                                            ▼
Load method_weights.yaml
  │
  ▼
Calculate RELEVANCE for all methods
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
  │
  ▼
Check Method Card availability for each selected method
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

## Appendix F: V7.1 File Reference

| File | Purpose | Required |
|------|---------|----------|
| `src/core/methods/methods.csv` | Method definitions | YES (blocking) |
| `src/core/methods/method_triggers.yaml` | Feature → method mapping | NO (fallback: relevance only) |
| `src/core/methods/method_weights.yaml` | Persistent learning storage | NO (fallback: default weights) |
| `src/core/methods/method_cards/*.md` | Step-by-step execution | NO (fallback: description) |
| `src/core/methods/knowledge-management-protocol.md` | KB handling | NO (fallback: DEFER) |
| `src/core/knowledge/domain-knowledge-base.md` | Domain knowledge | NO (fallback: flag gaps) |
| `src/core/workflows/deep-verify/agent-quick-reference.md` | Single-page guide | NO (convenience) |

---

## Appendix G: Method Cards Available (V7.1)

| Card | Method | Category | Token Cost |
|------|--------|----------|------------|
| MC-071 | First Principles Analysis | core | ~2-3K |
| MC-072 | 5 Whys Deep Dive | core | ~1-2K |
| MC-081 | Scope Integrity Audit | sanity | ~1-2K |
| MC-083 | Closure Check | sanity | ~0.5-1K |
| MC-084 | Coherence Check | sanity | ~1-2K |
| MC-088 | Executability Check | sanity | ~1-2K |
| MC-108 | Coincidentia Oppositorum | exploration | ~2-3K |
| MC-122 | Sorites Paradox | challenge | ~1-2K |
| MC-128 | Theseus Paradox | challenge | ~1-2K |
| MC-153 | Theoretical Impossibility Check | theory | ~2-3K |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 7.1 | 2026-01-14 | Phase 0.0 Library Loading gate, Method Cards (10 critical), method_triggers.yaml, method_weights.yaml persistence, Knowledge Management Protocol, Agent Quick Reference, Feature Detection in Phase 0.2 |
| 7.0 | 2026-01-13 | MAJOR: Adaptive Verification System architecture, 4-layer model, dynamic method selection, anomaly detection, learning loop, tiered execution |

---

## Migration Notes from V7.0

### What's New in V7.1

| V7.0 | V7.1 |
|------|------|
| Load files implicitly | Phase 0.0 BLOCKING gate |
| Generic method descriptions | Method Cards with steps |
| Dynamic relevance only | Trigger-based pre-selection |
| In-memory weights | Persistent method_weights.yaml |
| Ad-hoc knowledge handling | Knowledge Management Protocol |
| Full workflow reference | Agent Quick Reference available |

### Backward Compatibility

V7.1 is fully backward compatible with V7.0:
- All Phase 0.0 files have fallbacks except methods.csv
- Method Cards are optional - description fallback exists
- Triggers provide boost, not requirement
- Weights persist but default to baseline if file missing

### Recommended Migration

1. Create V7.1 support files (method_triggers.yaml, method_weights.yaml)
2. Create Method Cards for most-used methods
3. Run V7.1 with full file set
4. Learning loop will calibrate weights over 5-10 runs
