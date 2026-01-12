# Deep Verify V6.4 - Adaptive Method Selection

## Variant Information
```
Parent: v6.3
Design methods used:
- core: #71 First Principles, #152 Socratic Decomposition
- coherence: #91 Camouflage Test, #93 DNA Inheritance, #99 Multi-Artifact Coherence
- meta: #131 Observer Paradox, #132 Goodhart's Law, #136 Kernel Paradox
- epistemology: #111 Godel Witness, #119 Ground Truth Demand
- protocol: #141 Method Selection, #150 Learning Extraction

Key Changes:
- ADD_PHASE: Phase 0.5 Context Analysis
- MODIFY_PHASE: Phase 2-3 Parameterized method selection
- ADD_PHASE: Phase 7.5 Learning Extraction
- REMOVE: Hardcoded method lists (replaced with selection criteria)

Hypotheses:
- H1: Token usage reduced 40-60% vs v6.3
- H2: Detection Rate maintained or improved
- H3: Method effectiveness improves over sessions
```

## Core Principle

```
CONTEXT → METHODS → HONESTY → DEPTH → CHALLENGE → LEARN
```

**What changed from v6.3:**
- Methods are SELECTED based on artifact context, not hardcoded
- Effectiveness is TRACKED and fed back to selection
- Method budget scales with complexity

**Inherited from v6.3:**
- Phase structure (0→1→1.5→2→3→4→4.5→5→6→6.5→7)
- Bayesian stopping (Phase 4.5)
- Kernel handoff (Phase 6.5)
- Finding format and severity levels

**Fundamental Limits (from #111):**
- No oracle for "right" methods - can only learn from outcomes
- Cold start for new artifact types - use priors
- Feedback delay - confirmation after verification

---

## Definitions

| Term | Definition |
|------|------------|
| ARTIFACT | Content to verify |
| FEATURE | Extracted characteristic of artifact |
| METHOD_BUDGET | Min-max methods based on complexity |
| SELECTION_CRITERIA | Category + conditional rules |
| EFFECTIVENESS | confirmed_findings / used_methods |

**Methods source:** `src/core/methods/methods.csv`
**Scores source:** `src/core/workflows/deep-verify/method_scores.yaml`

---

## Flow Overview

```
Phase 0: Self-Check
         ↓
Phase 0.5: Context Analysis (NEW)
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
Phase 7.5: Learning Extraction (NEW)
```

---

## Phase 0: Self-Check (MANDATORY)

*Inherited from v6.3 - no changes*

Execute methods: #113, #131, #112, #132

```
## Phase 0: Self-Check

Self-deception methods (#113):
1. [specific to this verification]
2. [specific to this verification]
3. [specific to this verification]
4. [specific to this verification]
5. [specific to this verification]

Genuine vs Performance (#131): [signs present]
CUI BONO (#112): [watching for]
Goodhart Check (#132): Metric=[what] Goal=[what] Divergence=[Y/N]
```

---

## Phase 0.5: Context Analysis (NEW)

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

*Inherited from v6.3*

```
## Deep Verify V6.4

TASK: [original request]
CONTENT: [what was produced]
TYPE: [from Phase 0.5: code/document/plan/protocol]
FEATURES: [summary from Phase 0.5]
METHOD_BUDGET: [N-M methods]

[C] Correct - proceed
[E] Edit - describe correction
[X] Exit - cancel
```

---

## Phase 1.5: Integration Check

*Inherited from v6.3*

Apply #127 Bootstrap Paradox if `has_external_deps = true`.

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

*Inherited from v6.3*

Apply #152 Socratic Decomposition and #151 Semantic Entropy for each finding.

---

## Phase 4.5: Bayesian Stop Check

*Inherited from v6.3*

Additional check: If METHOD_BUDGET exhausted and findings < 2, consider early stop.

---

## Phase 5: Challenge

*Inherited from v6.3*

Apply challenge methods to each finding:
- #63 Critical Perspective
- #133 Abilene Paradox
- #109 Contraposition

Conditional (from selected methods):
- #127 Bootstrap if INTEGRATE finding
- #128 Theseus if alignment unclear

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

*Inherited from v6.3*

---

## Phase 7: Fix Root Cause

*Inherited from v6.3*

---

## Phase 7.5: Learning Extraction (NEW)

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

---

## Quick Reference

```
Phase 0: Am I being honest? (#113, #131, #112, #132)
Phase 0.5: What is this artifact? (extract features) ← NEW
Phase 1: What am I verifying? (TASK, CONTENT, MODE)
Phase 1.5: Did I read existing code? (#127 if has_external_deps)
Phase 2: What could be wrong? (SELECTED methods per layer)
Phase 3: Apply methods (execute selections)
Phase 4: What IS wrong? (#152 Socratic → #151 Entropy)
Phase 4.5: Should I stop early? (Bayesian + budget check)
Phase 5: Is it really wrong? (challenge methods)
Phase 6: What will I do? (fix root cause)
Phase 6.5: What can't I verify? (#136 Kernel)
Phase 7: Did I fix the real problem?
Phase 7.5: What did I learn? (update scores) ← NEW
```

---

## Method Scores Initialization

For cold start, use these priors:

```yaml
# Initial method_scores.yaml
scores:
  # High confidence methods (from v6.3 testing)
  81: { default: 0.80 }   # Scope Integrity
  84: { default: 0.75 }   # Coherence Check
  113: { default: 0.70 }  # Self-Incrimination
  127: { default: 0.85 }  # Bootstrap Paradox

  # Medium confidence
  62: { default: 0.60 }   # Failure Mode
  67: { default: 0.60 }   # Stability Basin

  # Default for unscored
  _default: 0.50
```

---

## Expected Performance vs v6.3

| Metric | v6.3 | v6.4 Expected |
|--------|------|---------------|
| Methods per run | 42-55 | 8-25 |
| Tokens per run | ~15-20K | ~6-12K |
| Detection Rate | 62.5% | 60-65% |
| Token Efficiency | 0.73 | 1.2+ |

---

## Changelog from v6.3

| Change | Type | Rationale |
|--------|------|-----------|
| Phase 0.5 Context Analysis | ADD | Extract features for selection |
| Parameterized method selection | MODIFY | Adaptive instead of hardcoded |
| Phase 7.5 Learning Extraction | ADD | Feedback loop for scores |
| Method budget by complexity | ADD | Scale effort appropriately |
| Conditional method inclusion | ADD | Feature-driven selection |
| Hardcoded method lists | REMOVE | Replaced by criteria |

---

## Limitations

1. **Cold start** - New artifact types have no score data (use priors)
2. **Feedback delay** - Scores update after confirmation (may lag reality)
3. **Distribution shift** - Past effectiveness may not predict future
4. **Feature extraction** - Heuristics may misclassify artifacts
5. **Score convergence** - Needs ~50+ sessions for stable scores
