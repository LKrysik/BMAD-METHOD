# Universal Verification Metrics

**Version: 2.1**
**Purpose**: Standardized metrics for comparing ANY verification protocol.

---

## Division Safety Guards

**CRITICAL:** Before calculating any metric with division, apply these guards:

```
GUARD 1: Total Tokens (TT)
  IF TT == 0:
    - Flag: "TOKEN_MEASUREMENT_MISSING"
    - Set TT = 1 for calculation (to avoid div/0)
    - Mark all token-based metrics as UNRELIABLE

GUARD 2: Confirmed Findings
  IF Confirmed_Findings == 0:
    - Skip TPF (Tokens per Finding) calculation
    - Skip TiPF (Time per Finding) calculation
    - Report: "NO_FINDINGS_DETECTED"

GUARD 3: WDS Points
  IF WDS_Points == 0:
    - Skip TE (Token Efficiency) calculation
    - Skip TiE (Time Efficiency) calculation
    - Skip OES calculation
    - Report: "ZERO_DETECTION_SCORE"

GUARD 4: Standard Deviation
  IF StdDev == 0 AND Mean > 0:
    - RS = 1.0 (perfect stability)
  IF Mean == 0:
    - RS = undefined, report "INSUFFICIENT_DATA"

GUARD 5: Zero Findings (NEW)
  IF Confirmed_Findings == 0 AND Expected_Errors > 0:
    - DR = 0% (valid result - protocol missed everything)
    - P = undefined (no TP, no FP to calculate)
    - Report: "ZERO_DETECTION"
    - This is NOT an error - may indicate protocol blind spot

GUARD 6: Perfect Detection (NEW)
  IF Detected == Expected AND FP == 0:
    - P = 1.0
    - Report: "PERFECT_RUN" (flag for review - may indicate data leak)
```

---

## Token & Time Metrics (Primary Cost Metrics)

### Token Metrics

#### Total Tokens (TT)

```
TT = Agent_Tokens + Protocol_Tokens

Where:
- Agent_Tokens = Σ(input + output) for all agent runs
- Protocol_Tokens = Σ(input + output) for all protocol runs
```

**Measurement Points:**
- Agent Phase: Tokens to generate artifact
- Protocol Phase: Tokens to verify artifact

#### Tokens per Finding (TPF)

```
TPF = TT / Confirmed_Findings

Interpretation:
- TPF < 500: Very efficient
- TPF 500-1500: Efficient
- TPF 1500-3000: Moderate
- TPF > 3000: Expensive
```

#### Tokens per Point (TPPt)

```
TPPt = TT / WDS_Points

Interpretation:
- TPPt < 1000: Excellent efficiency
- TPPt 1000-2000: Good
- TPPt 2000-5000: Acceptable
- TPPt > 5000: Poor efficiency
```

#### Token Efficiency (TE)

```
TE = (WDS_Points / TT) × 1000

Higher = Better
```

---

### Time Metrics

#### Total Time (TiT)

```
TiT = Agent_Time + Protocol_Time

Measured in seconds
```

**Measurement Points:**
```markdown
## Time Recording Template

### Agent Run [N]
- Start: [YYYY-MM-DD HH:MM:SS]
- End: [YYYY-MM-DD HH:MM:SS]
- Duration: [seconds]

### Protocol Run [N]
- Start: [YYYY-MM-DD HH:MM:SS]
- End: [YYYY-MM-DD HH:MM:SS]
- Duration: [seconds]
```

#### Time per Finding (TiPF)

```
TiPF = TiT / Confirmed_Findings

In seconds per finding
```

#### Time per Point (TiPPt)

```
TiPPt = TiT / WDS_Points

In seconds per point
```

#### Time Efficiency (TiE)

```
TiE = (WDS_Points / TiT) × 60

Points per minute. Higher = Better
```

---

## Detection Metrics

### Detection Rate (DR)

```
DR = (Detected / Expected) × 100

Where:
- Detected = Full matches + (Partial × 0.5)
- Expected = from ground-truth.md
```

| Range | Quality | Action |
|-------|---------|--------|
| DR > 80% | Excellent | Maintain |
| DR 60-80% | Good | Minor tuning |
| DR 40-60% | Moderate | Significant changes |
| DR < 40% | Poor | Major redesign |

### DR by Severity

```
DR_critical = Critical_detected / Critical_total × 100
DR_important = Important_detected / Important_total × 100
DR_minor = Minor_detected / Minor_total × 100

Priority: DR_critical > DR_important > DR_minor
```

### Weighted Detection Score (WDS)

```
WDS = Σ(detected × weight) / Σ(weight) × 100

Weights:
- CRITICAL: 3 points
- IMPORTANT: 2 points
- MINOR: 1 point
- Partial match: 0.5 × weight
```

---

## Quality Metrics

### Precision (P)

```
P = TP / (TP + FP)

Where:
- TP = matches expected error OR is BONUS_VALID
- FP = doesn't match AND not BONUS_VALID
```

| Range | Quality |
|-------|---------|
| P > 0.9 | Clean |
| P 0.7-0.9 | Acceptable |
| P < 0.7 | Noisy |

### Depth Quality (DQ)

```
DQ = Σ(depth_score) / N_findings

Depth scores:
- SYMPTOM: 1
- CAUSE: 2
- STRUCTURE: 3
- ASSUMPTION: 4
- ROOT_CAUSE: 5
```

| Range | Quality |
|-------|---------|
| DQ > 4.0 | Root cause level |
| DQ 3.0-4.0 | Structural level |
| DQ 2.0-3.0 | Cause level |
| DQ < 2.0 | Symptom only |

### Category Coverage (CC)

```
CC = Categories_detected / 10 × 100

Categories:
SCOPE, ASSUME, SKIP, SHALLOW, CONFLICT,
INTEGRATE, EDGE, DEPEND, PERF, SECURE
```

### Discovery Rate (DIS)

```
DIS = BONUS_VALID / Total_Findings × 100

Measures ability to find unexpected real errors.
```

---

## Variance Metrics

### Run Stability (RS)

```
RS = 1 - (StdDev / Mean)

For each metric across N runs.
```

| Range | Stability | Action |
|-------|-----------|--------|
| RS > 0.8 | Stable | Results reliable |
| RS 0.6-0.8 | Moderate | Report with caution |
| RS < 0.6 | Unstable | Results unreliable |

### Finding Consistency (FC)

```
FC = Consistent_Findings / Unique_Findings × 100

Where:
- Consistent = found in ALL runs
- Unique = found in ANY run
```

---

## Composite Metrics

### Overall Effectiveness Score (OES)

```
OES = (WDS × 0.35) + (P × 100 × 0.20) + (DQ × 20 × 0.15) + (TE × 100 × 0.15) + (TiE × 10 × 0.15)

Components normalized to 0-100 scale.

Weights:
- Detection (35%): Primary goal
- Precision (20%): Avoid noise
- Depth (15%): Quality indicator
- Token Efficiency (15%): Cost constraint
- Time Efficiency (15%): Speed constraint
```

### Cost-Adjusted Score (CAS)

```
CAS = OES / (1 + log10(TT/10000))

Penalizes high token usage.
```

### Improvement Delta (ID)

```
ID = OES_new - OES_baseline

Significant if: |ID| > 2 × pooled_stddev
```

---

## Protocol-Specific Metrics

### Deep Verify Specific

| Metric | Formula | Purpose |
|--------|---------|---------|
| CE_layer_A | Points_A / Methods_A | Concern efficiency Layer A |
| CE_layer_B | Points_B / Methods_B | Concern efficiency Layer B |
| CE_layer_C | Points_C / Methods_C | Concern efficiency Layer C |
| Phase_Completion | Phases_completed / Total_phases | Protocol execution quality |

### V-GD Specific

| Metric | Formula | Purpose |
|--------|---------|---------|
| Lambda_V | Final quality eigenvalue | Primary quality indicator |
| Convergence_Rate | (L_start - L_final) / Steps | Optimization efficiency |
| Null_Coverage | Addressed_voids / Total_voids | Null space handling |
| Gradient_Max | Max(dL) across hotspots | Worst issue severity |

### QVP Specific

| Metric | Formula | Purpose |
|--------|---------|---------|
| Scan_Coverage | Scans_completed / 4 | Protocol completeness |
| SPOF_Count | Number of SPOFs found | Critical risk indicator |
| Stability_Score | 1 if stable, 0.5 if marginal, 0 if unstable | System resilience |
| Topology_Health | 1 - (Holes_found / Elements_scanned) | Structural integrity |

---

## Measurement Recording Template

```markdown
## Experiment EXP-[ID] Metrics

### Token Measurements
| Phase | Run 1 | Run 2 | Run 3 | Mean | StdDev |
|-------|-------|-------|-------|------|--------|
| Agent Input | | | | | |
| Agent Output | | | | | |
| Agent Total | | | | | |
| Protocol Input | | | | | |
| Protocol Output | | | | | |
| Protocol Total | | | | | |
| **Grand Total** | | | | | |

### Time Measurements
| Phase | Run 1 | Run 2 | Run 3 | Mean | StdDev |
|-------|-------|-------|-------|------|--------|
| Agent (sec) | | | | | |
| Protocol (sec) | | | | | |
| **Total (sec)** | | | | | |

### Detection Metrics
| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev | RS |
|--------|-------|-------|-------|------|--------|-----|
| DR | | | | | | |
| DR_critical | | | | | | |
| DR_important | | | | | | |
| WDS | | | | | | |

### Quality Metrics
| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev | RS |
|--------|-------|-------|-------|------|--------|-----|
| P | | | | | | |
| DQ | | | | | | |
| CC | | | | | | |
| DIS | | | | | | |

### Efficiency Metrics
| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev | RS |
|--------|-------|-------|-------|------|--------|-----|
| TE | | | | | | |
| TiE | | | | | | |
| TPF | | | | | | |
| TiPF | | | | | | |

### Composite Metrics
| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev | RS |
|--------|-------|-------|-------|------|--------|-----|
| OES | | | | | | |
| CAS | | | | | | |

### Protocol-Specific Metrics
[Add based on protocol used]

### Stability Summary
- Overall RS: [STABLE / MODERATE / UNSTABLE]
- FC: [%]
```

---

## Cross-Protocol Comparison Template

```markdown
## Protocol Comparison - Task T[N]

### Efficiency Comparison
| Protocol | Tokens | Time | TE | TiE | Tokens/Finding | Time/Finding |
|----------|--------|------|-----|-----|----------------|--------------|
| [P1] | | | | | | |
| [P2] | | | | | | |
| [P3] | | | | | | |
| **Best** | | | | | | |

### Detection Comparison
| Protocol | DR | DR_crit | WDS | P | DQ | CC |
|----------|-----|---------|-----|-----|-----|-----|
| [P1] | | | | | | |
| [P2] | | | | | | |
| [P3] | | | | | | |
| **Best** | | | | | | |

### Composite Comparison
| Protocol | OES | CAS | RS | Rank |
|----------|-----|-----|-----|------|
| [P1] | | | | |
| [P2] | | | | |
| [P3] | | | | |

### Pareto Analysis
[Which protocols are Pareto-optimal on Detection vs Efficiency?]

### Recommendation
- Best for accuracy: [Protocol]
- Best for speed: [Protocol]
- Best balance: [Protocol]
- Best for critical errors: [Protocol]
```

---

## Quick Reference Formulas

```
TOKENS:
  TT = Agent_Tokens + Protocol_Tokens
  TPF = TT / Confirmed_Findings
  TPPt = TT / WDS_Points
  TE = WDS_Points / TT × 1000

TIME:
  TiT = Agent_Time + Protocol_Time
  TiPF = TiT / Confirmed_Findings
  TiPPt = TiT / WDS_Points
  TiE = WDS_Points / TiT × 60

DETECTION:
  DR = detected / expected × 100
  WDS = Σ(detected × weight) / Σ(weight) × 100

QUALITY:
  P = TP / (TP + FP)
  DQ = Σ(depth) / findings
  CC = categories_hit / 10 × 100

VARIANCE:
  RS = 1 - (σ / μ)
  FC = consistent / unique × 100

COMPOSITE:
  OES = WDS×0.35 + P×100×0.20 + DQ×20×0.15 + TE×100×0.15 + TiE×10×0.15
  CAS = OES / (1 + log10(TT/10000))
  ID = OES_new - OES_baseline
```
