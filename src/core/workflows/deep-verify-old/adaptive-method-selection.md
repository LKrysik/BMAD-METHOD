# Adaptive Method Selection Protocol

## Problem

Current workflow (v6.x) has hardcoded methods per phase:
- Every new weakness = manual workflow modification
- Does not scale
- Ignores artifact context

## Solution

Replace rigid method lists with **dynamic selection** based on:
1. Artifact context analysis
2. Historical method effectiveness
3. Detected problem category

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADAPTIVE VERIFICATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ARTIFACT ──→ [Context Analyzer] ──→ artifact_profile           │
│                                            │                     │
│                                            ▼                     │
│  methods.csv ──→ [Method Selector] ←── artifact_profile         │
│                         │                                        │
│                         ▼                                        │
│                  selected_methods[]                              │
│                         │                                        │
│                         ▼                                        │
│               [Verification Engine]                              │
│                         │                                        │
│                         ▼                                        │
│                    findings[]                                    │
│                         │                                        │
│                         ▼                                        │
│         [Effectiveness Tracker] ──→ method_scores.yaml          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Context Analyzer

**Input:** Artifact to verify
**Output:** artifact_profile

### Features to Extract

| Feature | Values | Selection Impact |
|---------|--------|------------------|
| type | code/document/plan/protocol | Method categories |
| domain | security/performance/architecture/data | Domain-specific methods |
| complexity | low/medium/high | Number of methods |
| has_external_deps | true/false | INTEGRATE methods |
| has_concurrency | true/false | CONFLICT methods |
| has_state | true/false | EDGE methods |
| size_tokens | number | Verification depth |

### Algorithm

```
function analyze_context(artifact):
    profile = {}

    # Artifact type
    if contains_code_blocks(artifact):
        profile.type = "code"
    elif contains_requirements(artifact):
        profile.type = "document"

    # Domain
    profile.domain = extract_domain_keywords(artifact, [
        "security", "performance", "api", "data", "ui"
    ])

    # Complexity
    profile.complexity = estimate_complexity(artifact)

    # Specific features
    profile.has_external_deps = mentions_external_files(artifact)
    profile.has_concurrency = mentions_concurrency(artifact)
    profile.has_state = mentions_state_management(artifact)

    return profile
```

---

## 2. Method Selector

**Input:** artifact_profile, methods.csv, method_scores.yaml
**Output:** selected_methods[]

### Selection Rules

```yaml
# method-selection-rules.yaml

base_methods:
  # Always executed (minimum viable verification)
  always:
    - 81  # Scope Integrity Audit
    - 84  # Coherence Check
    - 113 # Counterfactual Self-Incrimination

  # Conditional - per feature
  conditional:
    has_external_deps:
      - 127 # Bootstrap Paradox
      - 90  # Dependency Topology Mapping

    has_concurrency:
      - 67  # Stability Basin Analysis
      - 68  # Critical Path Severance

    has_state:
      - 62  # Failure Mode Analysis
      - 39  # Chaos Engineering

    domain.security:
      - 34  # Security Audit Personas
      - 21  # Red Team vs Blue Team

# Categories per artifact type
type_categories:
  code:
    preferred: [technical, sanity, coherence]
    weight: 1.2
  document:
    preferred: [sanity, exploration, epistemology]
    weight: 1.0
  protocol:
    preferred: [challenge, meta, risk]
    weight: 1.1

# Method limit per complexity
complexity_limits:
  low: 8-12
  medium: 12-18
  high: 18-25
```

### Selection Algorithm

```
function select_methods(profile, methods_csv, method_scores):
    selected = []

    # 1. Base methods (always)
    selected += rules.base_methods.always

    # 2. Conditional methods (per features)
    for feature, methods in rules.conditional:
        if profile[feature]:
            selected += methods

    # 3. Preferred categories per type
    preferred_categories = rules.type_categories[profile.type].preferred

    # 4. Select from methods.csv using effectiveness scores
    remaining_budget = rules.complexity_limits[profile.complexity] - len(selected)

    candidates = methods_csv
        .filter(m => m.category in preferred_categories)
        .sort_by(m => method_scores[m.id] ?? 0.5)  # Prior 0.5 for new methods
        .take(remaining_budget * 1.5)  # Excess for sampling

    # 5. Weighted random selection (exploration + exploitation)
    selected += weighted_sample(
        candidates,
        remaining_budget,
        weights = [score * 0.7 + random * 0.3 for each]  # 70% exploit, 30% explore
    )

    # 6. Diversity check - min 3 different categories
    ensure_category_diversity(selected, min_categories=3)

    return selected
```

---

## 3. Depth Controller

Decides **how many runs** and **how deep** to verify.

### Continuation Signals

| Signal | Action |
|--------|--------|
| Found CRITICAL | +1 run, +5 methods |
| High entropy finding | Verify with different method |
| 0 findings after 1 run | Stop early (Bayesian) |
| INTEGRATE error | Force file reading |

### Algorithm

```
function decide_depth(profile, current_findings, run_number):
    base_runs = 1

    # Increase for complex artifacts
    if profile.complexity == "high":
        base_runs = 2

    # Increase if CRITICAL found
    if any(f.severity == CRITICAL for f in current_findings):
        base_runs += 1

    # Stop early if nothing found
    if run_number >= 1 and len(current_findings) == 0:
        return STOP

    # Bayesian stopping (from v6.2)
    if bayesian_stop_check(current_findings):
        return STOP

    if run_number < base_runs:
        return CONTINUE

    return STOP
```

---

## 4. Effectiveness Tracker

Learns which methods work on which artifact types.

### Collected Data

```yaml
# method_scores.yaml (per session)
session_id: "2026-01-12-001"
artifact_profile:
  type: document
  domain: [architecture, concurrency]
  complexity: high

method_results:
  - method_id: 127
    findings_produced: 2
    findings_confirmed: 2
    severity_sum: 5  # CRITICAL=3, IMPORTANT=2

  - method_id: 81
    findings_produced: 1
    findings_confirmed: 0  # False positive
    severity_sum: 0
```

### Score Update

```
function update_scores(session_result):
    for method in session_result.method_results:
        key = (method.id, session_result.profile.type)

        old_score = scores[key] ?? 0.5

        # Score = confirmed findings / total findings (precision)
        precision = method.findings_confirmed / max(method.findings_produced, 1)

        # Bayesian update
        new_score = old_score * 0.9 + precision * 0.1  # Decay + new evidence

        scores[key] = new_score
```

---

## 5. Workflow Integration

Instead of:
```markdown
### Discovery Methods per Layer
| Layer | Mandatory Methods | Purpose |
| A: Content | #70, #71, #72, #73, #75, #150, #152 | Sanity checks |
```

New format:
```markdown
### Discovery Methods per Layer
| Layer | Selection Criteria | Purpose |
| A: Content | categories=[sanity, core], min=5, max=8 | Sanity checks |
| B: Structure | categories=[coherence, exploration], min=4, max=6 | Structure |
| C: Assumptions | categories=[epistemology, challenge], min=4, max=6 | Assumptions |
| D: Security | conditional=has_security_aspect, categories=[risk, technical] | Security |

Selection delegated to: [Method Selector] with artifact_profile
```

---

## 6. Token Efficiency

### Current Model (v6.3)
- ~42-55 methods per verification (rigid)
- ~15-20K tokens per run
- Token Efficiency: 0.73 pts/1K tokens

### Adaptive Model (target)
- 8-25 methods per verification (complexity-dependent)
- ~5-12K tokens per run (40-60% reduction)
- Target TE: 1.2+ pts/1K tokens

### Savings

| Complexity | Current Methods | Adaptive | Token Reduction |
|------------|-----------------|----------|-----------------|
| Low | 42 | 8-12 | ~70% |
| Medium | 42 | 12-18 | ~50% |
| High | 42 | 18-25 | ~30% |

---

## 7. Migration from v6.3

### Step 1: Rule Extraction
- Analyze which methods in v6.3 worked (from experiment-log)
- Save as initial method_scores.yaml

### Step 2: Workflow Parameterization
- Replace hardcoded lists with selection criteria
- Add Context Analyzer before Phase 1

### Step 3: Feedback Loop
- Update method_scores after each verification
- Monitor effectiveness drift

---

## 8. Example Run

**Artifact:** Design document for API authentication

**Context Analysis:**
```yaml
type: document
domain: [security, api]
complexity: medium
has_external_deps: true  # mentions "existing user service"
has_concurrency: false
has_state: true  # session management
```

**Method Selection:**
```
Base (always): #81, #84, #113 = 3
Conditional (has_external_deps): #127, #90 = 2
Conditional (has_state): #62, #39 = 2
Conditional (domain.security): #34, #21 = 2

Preferred categories: [sanity, exploration, epistemology, risk]
Remaining budget: 12-18 - 9 = 3-9

Top scored from preferred:
  #74 (sanity, score=0.82)
  #146 (exploration, score=0.78)
  #61 (risk, score=0.75)
  #119 (epistemology, score=0.71)

Selected: 9 base + 4 top = 13 methods

Categories: sanity(3), challenge(2), risk(2), technical(2), epistemology(2), exploration(1), coherence(1)
Diversity check: 7 categories ✓
```

**Result:** 13 methods instead of 42, focus on security/integration

---

## Status

- [ ] Implement Context Analyzer
- [ ] Implement Method Selector
- [ ] Create method-selection-rules.yaml
- [ ] Create initial method_scores.yaml from v6.3 data
- [ ] Modify workflow template
- [ ] Test on T12-T15

---

## Related Tasks

- **T12 (Incremental Method Effectiveness Learning)** - feedback loop
- **T15 (NL to Method Mapping)** - intent→method mapping

Ironically, the solution to the adaptability problem is described in the test tasks.
