# Workflow Evaluation Metrics (v2)

## Changes from v1
- REMOVED: Phase Efficiency (unmeasurable - cannot attribute findings to phases)
- ADDED: Concern Efficiency (measurable - findings traced to concerns)
- ADDED: Discovery Rate (for unexpected but valid findings)
- ADDED: Variance Metrics (for handling model randomness)
- ADDED: Blind Evaluation Protocol (for reducing evaluator bias)
- UPDATED: OES formula (removed unmeasurable component)

---

## Core Metrics

### 1. Detection Rate (DR)

**Purpose:** Measure what percentage of known errors the workflow finds.

```
DR = (Detected Errors / Total Expected Errors) × 100

Where:
- Detected = Match Y (full) + Match P (partial × 0.5)
- Expected = from ground-truth.md
```

**Interpretation:**
| Range | Quality | Action |
|-------|---------|--------|
| DR > 80% | Excellent | Maintain |
| DR 60-80% | Good | Minor tuning |
| DR 40-60% | Moderate | Significant changes needed |
| DR < 40% | Poor | Major redesign |

**Variants:**
- DR_critical = Critical errors detected / Total critical
- DR_important = Important errors detected / Total important
- DR_minor = Minor errors detected / Total minor

**Priority:** DR_critical > DR_important > DR_minor

---

### 2. Weighted Detection Score (WDS)

**Purpose:** Account for error severity in detection score.

```
WDS = Σ(detected_i × weight_i) / Σ(weight_i) × 100

Where weights:
- CRITICAL: 3 points
- IMPORTANT: 2 points
- MINOR: 1 point

Partial match (P): 0.5 × weight
```

**Example calculation:**
```
Task T1: 2 CRITICAL (6pts), 3 IMPORTANT (6pts), 1 MINOR (1pt) = 13 max
Detected: 1 CRITICAL (3), 2 IMPORTANT (4), 0.5 MINOR (0.5) = 7.5
WDS = 7.5 / 13 × 100 = 57.7%
```

---

### 3. Token Efficiency (TE)

**Purpose:** Measure detection value per token spent.

```
TE = (WDS_points / Total_Tokens) × 1000

Where:
- WDS_points = raw points (not percentage)
- Total_Tokens = agent_tokens + workflow_tokens
```

**Interpretation:**
| Range | Efficiency | Meaning |
|-------|------------|---------|
| TE > 0.5 | High | Good value per token |
| TE 0.1-0.5 | Moderate | Acceptable |
| TE < 0.1 | Low | Too expensive |

**Comparison use:**
- Same task, different workflows → higher TE = better
- Different tasks → normalize by task max points

---

### 4. Concern Efficiency (CE) - NEW (replaces Phase Efficiency)

**Purpose:** Identify which CONCERNS contribute most value.

```
CE_concern = Points_from_concern / Methods_used_for_concern

For each concern (A1, A2, B1, etc.):
- Track which findings originated from which concern
- Count methods applied to that concern
- Compute CE
```

**Why this works (vs Phase Efficiency):**
- Findings ARE traceable to concerns (concern ID in finding)
- Methods ARE countable per concern
- Concerns are the unit of analysis, not phases

**Use:** Identify high-value vs low-value concern patterns.

**Aggregations:**
```
CE_layer_A = Σ(CE_Ax) / count(A concerns)
CE_layer_B = Σ(CE_Bx) / count(B concerns)
CE_layer_C = Σ(CE_Cx) / count(C concerns)
```

---

### 5. Precision (P)

**Purpose:** Measure false positive rate.

```
P = True_Positives / (True_Positives + False_Positives)

Where:
- True_Positive = finding matches expected error OR is BONUS_VALID
- False_Positive = finding doesn't match AND is not BONUS_VALID
```

**Note:** BONUS_VALID findings (unexpected but real errors) count as TP.

**Interpretation:**
| Range | Quality | Meaning |
|-------|---------|---------|
| P > 0.9 | Clean | Very few false alarms |
| P 0.7-0.9 | Acceptable | Some noise |
| P < 0.7 | Noisy | Too many false positives |

---

### 6. Discovery Rate (DIS) - NEW

**Purpose:** Measure ability to find errors NOT in ground truth.

```
DIS = BONUS_VALID / Total_Findings × 100

Where:
- BONUS_VALID = unexpected findings confirmed as real errors
- Total_Findings = all confirmed findings (TP + BONUS_VALID)
```

**Interpretation:**
- DIS > 20%: Workflow finding novel issues (good)
- DIS 5-20%: Some discovery capability
- DIS < 5%: Workflow only finds expected issues
- DIS = 0%: No discovery (not necessarily bad if ground truth is complete)

**Action:** High DIS suggests ground truth is incomplete → update it.

---

### 7. Depth Quality (DQ)

**Purpose:** Measure how deep the workflow goes in analysis.

```
DQ = Σ(depth_score_i) / N_findings

Where depth_score:
- SYMPTOM: 1
- CAUSE: 2
- STRUCTURE: 3
- ASSUMPTION: 4
- ROOT_CAUSE: 5
```

**Interpretation:**
| Range | Quality | Meaning |
|-------|---------|---------|
| DQ > 4.0 | Excellent | Reaching root causes |
| DQ 3.0-4.0 | Good | Structural level |
| DQ 2.0-3.0 | Moderate | Cause level |
| DQ < 2.0 | Shallow | Symptoms only |

---

### 8. Category Coverage (CC)

**Purpose:** Measure if workflow catches diverse error types.

```
CC = Categories_with_detections / Total_Categories × 100

Categories (10 total):
SCOPE, ASSUME, SKIP, SHALLOW, CONFLICT, INTEGRATE, EDGE, DEPEND, PERF, SECURE
```

**Tracking:**
```
| Category | Detected | Missed | Rate |
|----------|----------|--------|------|
| SCOPE | 3 | 1 | 75% |
| ASSUME | 2 | 2 | 50% |
...
```

**Blind spots:** Categories with rate < 50% need targeted improvement.

---

## Variance Metrics - NEW

### 9. Run Stability (RS)

**Purpose:** Measure consistency across repeated runs.

**Protocol:** Run same experiment 3 times minimum.

```
RS = 1 - (Standard_Deviation / Mean)

For each metric (DR, WDS, P, DQ):
- Calculate mean across runs
- Calculate standard deviation
- Compute RS
```

**Interpretation:**
| Range | Stability | Action |
|-------|-----------|--------|
| RS > 0.8 | Stable | Results reliable |
| RS 0.6-0.8 | Moderate | Report with caution |
| RS < 0.6 | Unstable | Results unreliable, investigate |

**Report format:**
```
DR = 65% ± 8% (RS = 0.88) - STABLE
WDS = 58% ± 15% (RS = 0.74) - MODERATE
```

---

### 10. Finding Consistency (FC)

**Purpose:** Which findings appear across all runs?

```
FC = Consistent_Findings / Total_Unique_Findings × 100

Where:
- Consistent = finding appears in ALL runs
- Unique = finding appears in ANY run
```

**Interpretation:**
- FC > 80%: Findings are reproducible
- FC 50-80%: Some variance in detection
- FC < 50%: High variance, findings unreliable

**Use:** Only report findings with FC > 50% as confirmed.

---

## Composite Metrics

### 11. Overall Effectiveness Score (OES) - UPDATED

**Purpose:** Single metric combining key measurable dimensions.

```
OES = (WDS × 0.40) + (P × 100 × 0.25) + (DQ × 20 × 0.20) + (TE × 100 × 0.15)

All components normalized to 0-100 scale before weighting.
```

**Weights rationale:**
- Detection (40%): Primary goal
- Precision (25%): Avoid noise (increased from 20%)
- Depth (20%): Quality indicator (increased from 10%)
- Efficiency (15%): Practical constraint (decreased from 30%)

**Note:** Removed Phase Efficiency from formula (was unmeasurable).

---

### 12. Improvement Delta (ID)

**Purpose:** Measure improvement between workflow variants.

```
ID = OES_new - OES_baseline

Significance threshold: |ID| > 2 × pooled_std_dev
```

**Interpretation:**
| Range | Meaning | Confidence |
|-------|---------|------------|
| ID > 5, significant | Major improvement | High |
| ID > 5, not significant | Possible improvement | Low (need more data) |
| ID 0-5 | Minor change | Might be noise |
| ID < 0, significant | Regression | High (revert) |

---

## Blind Evaluation Protocol - NEW

### Purpose
Reduce evaluator bias when matching findings to ground truth.

### Protocol Steps

**Step 1: Blind Finding Review**
```
Before seeing ground truth:
1. List all workflow findings
2. For each finding, describe:
   - What error does this represent?
   - What is the evidence?
   - How confident am I? (HIGH/MEDIUM/LOW)
3. Save this blind assessment
```

**Step 2: Blind Ground Truth Review**
```
Before matching:
1. List all expected errors from ground truth
2. For each, predict:
   - Will workflow likely catch this? (YES/MAYBE/NO)
   - Why or why not?
3. Save this prediction
```

**Step 3: Matching**
```
Now match findings to expected errors:
1. Use only objective criteria (quote matches, location matches)
2. When ambiguous, apply #149 Dispute Resolution
3. Document match reasoning
```

**Step 4: Bias Check**
```
Compare:
- Blind assessment (Step 1) vs Final matching
- Prediction (Step 2) vs Actual detection

Flag if:
- You changed assessment after seeing ground truth
- Predictions were systematically wrong
```

### Bias Indicators
- Changing finding description after seeing ground truth = BIAS
- Generous matching when prediction was NO = BIAS
- Strict matching when prediction was YES = BIAS

---

## Tracking Tables - UPDATED

### Per-Experiment Metrics Table

```markdown
## Experiment Metrics

| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev | RS |
|--------|-------|-------|-------|------|--------|-----|
| DR | | | | | | |
| DR_critical | | | | | | |
| DR_important | | | | | | |
| WDS | | | | | | |
| TE | | | | | | |
| CE_layer_A | | | | | | |
| CE_layer_B | | | | | | |
| CE_layer_C | | | | | | |
| P | | | | | | |
| DIS | | | | | | |
| DQ | | | | | | |
| CC | | | | | | |
| FC | - | - | - | | - | - |
| OES | | | | | | |

Stability: [STABLE if all RS > 0.8 / MODERATE if any RS 0.6-0.8 / UNSTABLE if any RS < 0.6]
```

---

### Cross-Experiment Comparison Table

| Exp | Workflow | Task | Runs | DR±σ | WDS±σ | TE | P | DQ | OES±σ | ID | Sig? |
|-----|----------|------|------|------|-------|-----|-----|-----|-------|-----|------|
| 001 | v6 | T1 | 3 | | | | | | | base | - |
| 002 | v6.1 | T1 | 3 | | | | | | | | Y/N |
| 003 | v6.1 | T3 | 3 | | | | | | | | Y/N |

---

### Category Detection Heatmap

| Workflow | SCOPE | ASSUME | SKIP | SHALLOW | CONFLICT | INTEGRATE | EDGE | DEPEND | PERF | SECURE | CC |
|----------|-------|--------|------|---------|----------|-----------|------|--------|------|--------|-----|
| v6 | | | | | | | | | | | |
| v6.1 | | | | | | | | | | | |

Legend:
- ✓ (>75%): Consistently detected
- ~ (50-75%): Sometimes detected
- ✗ (<50%): Rarely detected (BLIND SPOT)

---

## Statistical Requirements

### Minimum Sample Sizes

| Claim | Minimum Experiments |
|-------|---------------------|
| Single workflow assessment | 3 runs same task |
| Workflow comparison | 3 runs each, same task |
| Generalization claim | 5 tasks, 3 runs each |
| Category blind spot claim | 3 tasks with that category |

### Significance Testing

```
Pooled_StdDev = sqrt((σ1² + σ2²) / 2)
Significant if: |ID| > 2 × Pooled_StdDev
```

### Confounding Variables - Track

| Variable | How to Control |
|----------|---------------|
| Task difficulty | Use same task for comparisons |
| Agent model | Hold constant or track as factor |
| Agent run variance | Multiple runs, report mean±σ |
| Evaluator bias | Blind evaluation protocol |
| Time of day | Not a factor for LLMs |

---

## Quick Reference Formulas

```
Detection:
  DR = detected / expected × 100
  WDS = Σ(detected × weight) / Σ(weight) × 100

Efficiency:
  TE = WDS_points / tokens × 1000
  CE = points_from_concern / methods_for_concern

Quality:
  P = TP / (TP + FP)
  DQ = Σ(depth) / findings
  CC = categories_hit / 10 × 100
  DIS = bonus_valid / total_findings × 100

Variance:
  RS = 1 - (σ / μ)
  FC = consistent_findings / unique_findings × 100

Composite:
  OES = WDS×0.40 + P×100×0.25 + DQ×20×0.20 + TE×100×0.15
  ID = OES_new - OES_baseline
```

---

## Metric Dependencies

```
                    ┌─────────────────┐
                    │   Ground Truth  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         ┌────────┐    ┌──────────┐   ┌──────────┐
         │   DR   │    │    P     │   │   DIS    │
         └───┬────┘    └────┬─────┘   └────┬─────┘
             │              │              │
             ▼              │              │
         ┌────────┐         │              │
         │  WDS   │◄────────┴──────────────┘
         └───┬────┘
             │
     ┌───────┼───────┐
     ▼       ▼       ▼
┌────────┐ ┌────┐ ┌────┐
│   TE   │ │ DQ │ │ CC │
└───┬────┘ └──┬─┘ └──┬─┘
    │         │      │
    └────┬────┴──────┘
         ▼
    ┌─────────┐
    │   OES   │
    └─────────┘
```
