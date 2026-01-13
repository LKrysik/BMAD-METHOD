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

GUARD 7: Token Value Validity (CRITICAL - NEW)
  IF Token_Value contains "~" OR Token_Value contains "K" suffix:
    - REJECT: "APPROXIMATE_TOKEN_VALUE"
    - Action: Re-run token extraction from JSONL
    - ALL metrics using this value are INVALID

  IF Agent_ID is placeholder (e.g., "[pending]", "abc1234", "unknown"):
    - REJECT: "MISSING_AGENT_ID"
    - Action: Check Task tool output for real agentId

  VALID token format:
    ✓ 50148 (integer)
    ✓ 1876488 (integer)

  INVALID token format (MUST REJECT):
    ✗ ~50,000 (approximate)
    ✗ ~5K (abbreviated)
    ✗ 50K (abbreviated)
    ✗ "about 50000" (vague)

  Token Source Verification:
    - MUST have Agent ID (7-char hex hash, e.g., "a63f852")
    - MUST have Slug (3-word name, e.g., "shimmering-fluttering-ritchie")
    - MUST be extracted from JSONL file (not estimated)

GUARD 8: Subagent Token Completeness (NEW)
  For each verification run:
    REQUIRED fields:
    - agent_id: string (7 chars)
    - slug: string (3 words)
    - input_tokens: integer
    - output_tokens: integer
    - cache_creation_input_tokens: integer
    - total_cost: integer = input + output + cache_creation

  IF ANY field missing:
    - REJECT run from metrics calculation
    - Report: "INCOMPLETE_TOKEN_DATA"
    - Action: Read JSONL file for missing fields

GUARD 9: Session Analyzer Requirement (NEW)
  Token data MUST come from session_usage_analyzer.py output, not manual JSONL reading.

  Validation checks:
    - Tokens are integers (no ~ prefix, no K/M suffixes)
    - All agents from analyzer output are mapped to registry
    - Total tokens match sum of per-agent totals
    - Each Agent ID maps to exactly ONE registry row (1:1 rule)

  IF session_usage_analyzer.py unavailable:
    - Fall back to manual JSONL extraction
    - Flag result as "MANUAL_EXTRACTION" in Status
    - Use token_extractor.py script from orchestrator

  Rejection criteria:
    - Token value contains ~ (approximate)
    - Token value uses K, M suffixes (5K, 1.2M)
    - Agent ID appears in multiple rows with different Process/Task
    - Total mismatch > 1% between analyzer sum and manual sum
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

Where:
- BONUS_VALID = unexpected findings confirmed as real errors
- Total_Findings = all confirmed findings (TP + BONUS_VALID)

Measures ability to find errors NOT in ground truth.

Interpretation:
- DIS > 20%: Workflow finding novel issues (good)
- DIS 5-20%: Some discovery capability
- DIS < 5%: Workflow only finds expected issues
- DIS = 0%: No discovery (not necessarily bad if ground truth is complete)

Action: High DIS suggests ground truth is incomplete → update it.
```

### Concern Efficiency (CE)

```
CE_concern = Points_from_concern / Methods_used_for_concern

For each concern (A1, A2, B1, etc.):
- Track which findings originated from which concern
- Count methods applied to that concern
- Compute CE

Why this works:
- Findings ARE traceable to concerns (concern ID in finding)
- Methods ARE countable per concern
- Concerns are the unit of analysis, not phases

Use: Identify high-value vs low-value concern patterns.

Aggregations:
  CE_layer_A = Σ(CE_Ax) / count(A concerns)
  CE_layer_B = Σ(CE_Bx) / count(B concerns)
  CE_layer_C = Σ(CE_Cx) / count(C concerns)
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

## Token Economy Metrics

**Purpose**: Measure cost-effectiveness of verification protocols by tracking token usage from subagent JSONL logs.

### Subagent Token Collection

Subagent logs are stored in JSONL format at:
```
~/.claude/projects/[project-path]/[session-id]/subagents/agent-[id].jsonl
```

Each log entry with `message.usage` contains:
```json
{
  "agentId": "[7-char-hash]",
  "slug": "[three-word-name]",
  "message": {
    "usage": {
      "input_tokens": N,
      "output_tokens": N,
      "cache_creation_input_tokens": N,
      "cache_read_input_tokens": N
    }
  }
}
```

**Token Calculation Formula:**
```
Subagent_Total_Tokens = Σ(input_tokens + output_tokens + cache_creation_input_tokens)

Note: cache_read_input_tokens are READ from cache (not new), so typically excluded from "cost" calculation.
```

### Token Economy (TE_econ)

```
TE_econ = WDS_Points / Total_Tokens × 10000

Higher = Better (more detection value per token spent)

Interpretation:
- TE_econ > 50: Excellent economy
- TE_econ 20-50: Good economy
- TE_econ 10-20: Acceptable economy
- TE_econ < 10: Poor economy (expensive per finding)
```

### Cost per Finding (CPF)

```
CPF = Total_Tokens / Confirmed_Findings

Interpretation:
- CPF < 1000: Very economical
- CPF 1000-3000: Economical
- CPF 3000-7000: Moderate cost
- CPF > 7000: Expensive
```

### Protocol Economy Score (PES)

```
PES = (OES × 100) / log10(Total_Tokens)

Composite metric balancing effectiveness and token cost.
Higher = Better

Interpretation:
- PES > 20: Excellent balance
- PES 10-20: Good balance
- PES 5-10: Acceptable
- PES < 5: Needs optimization
```

---

## USD Cost Metrics (NEW)

These metrics express costs in actual USD values using Claude Opus 4.5 pricing.

### Total Cost (TC_USD)

```
TC_USD = Σ(COST_USD per subagent)

Where COST_USD per agent:
= (input_tokens × $0.000015) + (output_tokens × $0.000075)
+ (cache_creation × $0.00001875) + (cache_read × $0.0000015)

Pricing breakdown (Claude Opus 4.5):
- Input tokens: $15 per 1M tokens ($0.000015 per token)
- Output tokens: $75 per 1M tokens ($0.000075 per token)
- Cache creation: $18.75 per 1M tokens ($0.00001875 per token)
- Cache read: $1.50 per 1M tokens ($0.0000015 per token)

Example:
  Agent 1: Input=51800, Output=9989, Cache=21580
  Cost = (51800 × 0.000015) + (9989 × 0.000075) + (21580 × 0.00001875)
       = $0.777 + $0.749 + $0.405
       = $1.93
```

### Cost per Trap (CPT_USD)

```
CPT_USD = TC_USD / Traps_Detected

How much does it cost to detect one trap?
Lower = Better

Interpretation:
- CPT_USD < $0.05: Excellent value (very cheap per trap)
- CPT_USD $0.05-0.15: Good value
- CPT_USD $0.15-0.30: Moderate value
- CPT_USD > $0.30: Expensive (consider optimization)

Example:
  TC_USD = $1.93, Traps = 12
  CPT_USD = $1.93 / 12 = $0.16 (Moderate value)
```

### Token-Trap Efficiency (TTE)

```
TTE = Traps_Detected / Total_Tokens × 1000

How many traps detected per 1000 tokens spent?
Higher = Better

Interpretation:
- TTE > 0.3: Excellent efficiency (1 trap per ~3K tokens)
- TTE 0.1-0.3: Good efficiency (1 trap per 3-10K tokens)
- TTE 0.05-0.1: Acceptable efficiency (1 trap per 10-20K tokens)
- TTE < 0.05: Poor efficiency (1 trap per 20K+ tokens)

Example:
  Traps = 12, Tokens = 45,000
  TTE = 12 / 45000 × 1000 = 0.267 (Good efficiency)
```

### ROI Score (Return on Investment)

```
ROI = (WDS × Traps_Detected) / TC_USD

Value generated (WDS points × traps) per dollar spent.
Higher = Better

Interpretation:
- ROI > 1000: Excellent ROI
- ROI 500-1000: Good ROI
- ROI 200-500: Acceptable ROI
- ROI < 200: Poor ROI (low value for money)

Example:
  WDS = 85, Traps = 12, TC_USD = $1.93
  ROI = (85 × 12) / 1.93 = 1020 / 1.93 = 528 (Good ROI)
```

### Efficiency Score (ES)

```
ES = Traps_Detected / Total_Tokens

Raw efficiency ratio (traps per token).
Useful for comparing processes without scaling.

Note: This is TTE / 1000 for comparison convenience.

Example:
  Traps = 12, Tokens = 45,000
  ES = 12 / 45000 = 0.000267
```

---

## Effectiveness Metrics (Cost-Effectiveness)

### Detection Effectiveness (DE)

```
DE = Confirmed_Findings / Expected_Findings × 100

Basic effectiveness measure - what percentage of expected errors was found.

Interpretation:
- DE = 100%: Perfect detection (found all expected errors)
- DE > 80%: Excellent effectiveness
- DE 60-80%: Good effectiveness
- DE 40-60%: Moderate effectiveness
- DE < 40%: Poor effectiveness

Note: DE is equivalent to DR (Detection Rate) but framed as "effectiveness"
```

### Cost-Effectiveness Index (CEI)

```
CEI = (DE × WDS) / (Total_Tokens / 1000)

Combines detection effectiveness with weighted score, normalized by token cost.
Higher = Better (more effectiveness per 1000 tokens)

Interpretation:
- CEI > 100: Excellent cost-effectiveness
- CEI 50-100: Good cost-effectiveness
- CEI 20-50: Acceptable cost-effectiveness
- CEI < 20: Poor cost-effectiveness (expensive for results achieved)

Example:
  DE = 80%, WDS = 75, Tokens = 50,000
  CEI = (80 × 75) / (50000/1000) = 6000 / 50 = 120 (Excellent)
```

### Value per Kilotoken (VPK)

```
VPK = Confirmed_Findings / (Total_Tokens / 1000)

How many findings per 1000 tokens spent.
Higher = Better

Interpretation:
- VPK > 0.5: Excellent value (1 finding per 2K tokens)
- VPK 0.2-0.5: Good value (1 finding per 2-5K tokens)
- VPK 0.1-0.2: Acceptable value (1 finding per 5-10K tokens)
- VPK < 0.1: Poor value (1 finding per 10K+ tokens)

Example:
  Findings = 12, Tokens = 45,000
  VPK = 12 / 45 = 0.267 (Good value)
```

### Effectiveness-Economy Ratio (EER)

```
EER = DE / CPF × 1000

Ratio of detection effectiveness to cost per finding.
Higher = Better

Interpretation:
- EER > 50: Excellent ratio
- EER 20-50: Good ratio
- EER 10-20: Acceptable ratio
- EER < 10: Poor ratio (high cost, low effectiveness)

Example:
  DE = 80%, CPF = 4,000
  EER = 80 / 4000 × 1000 = 20 (Good ratio)
```

### Process Comparison Recommendation Matrix

```
Based on metrics, recommend process for different use cases:

| Use Case | Primary Metric | Secondary | Recommended When |
|----------|---------------|-----------|------------------|
| Cost-sensitive | CPF | VPK | Budget limited, need efficiency |
| Quality-critical | DE | WDS | Must find all errors, cost secondary |
| Balanced | CEI | EER | Need good effectiveness at reasonable cost |
| Quick assessment | VPK | DE | Fast feedback, iterative process |
```

### Token Breakdown Template

```markdown
## Token Economy Report

### Subagent Token Breakdown
| Run | Agent ID | Slug | Input | Output | Cache Created | Total |
|-----|----------|------|-------|--------|---------------|-------|
| 1 | [id] | [slug] | [N] | [N] | [N] | [N] |
| 2 | [id] | [slug] | [N] | [N] | [N] | [N] |
| 3 | [id] | [slug] | [N] | [N] | [N] | [N] |

### Economy Metrics
| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev |
|--------|-------|-------|-------|------|--------|
| TE_econ | | | | | |
| CPF | | | | | |
| PES | | | | | |

### Protocol Cost Comparison
| Protocol | Avg Tokens | TE_econ | CPF | PES | Rank |
|----------|------------|---------|-----|-----|------|
| [P1] | | | | | |
| [P2] | | | | | |
```

---

## Test-Level Metrics (Per Process-Task Combination) (NEW)

These metrics enable fair comparison between processes by normalizing for different test characteristics.

### Test Effectiveness Index (TEI)

```
TEI = (DR × WDS × P) / 100

Composite measure combining detection rate, weighted detection, and precision.
Higher = Better

Interpretation:
- TEI > 60: Excellent test effectiveness
- TEI 40-60: Good test effectiveness
- TEI 20-40: Acceptable test effectiveness
- TEI < 20: Poor test effectiveness

Example:
  DR = 80%, WDS = 75, P = 0.9
  TEI = (80 × 75 × 0.9) / 100 = 5400 / 100 = 54.0 (Good)
```

### Process Comparison Index (PCI)

```
PCI = TEI / (Tokens / 10000)

Normalizes effectiveness by token cost for fair process comparison.
Higher = Better (more effectiveness per 10K tokens)

Interpretation:
- PCI > 15: Excellent process efficiency
- PCI 8-15: Good process efficiency
- PCI 4-8: Acceptable process efficiency
- PCI < 4: Poor process efficiency (expensive for effectiveness)

Example:
  TEI = 54.0, Tokens = 45,000
  PCI = 54.0 / 4.5 = 12.0 (Good efficiency)
```

### Task Complexity Adjustment (TCA)

```
TCA = Expected_Traps × Avg_Severity_Weight

Accounts for task difficulty when comparing results.

Severity weights:
- CRITICAL = 3
- IMPORTANT = 2
- MINOR = 1

Example:
  Task T1: 5 CRITICAL, 3 IMPORTANT, 2 MINOR
  TCA = (5 × 3) + (3 × 2) + (2 × 1) = 15 + 6 + 2 = 23
```

### Normalized Process Score (NPS)

```
NPS = (WDS / TCA) × 100

Normalizes WDS by task complexity for cross-task comparison.
Higher = Better

Use case: Comparing process performance across tasks of different difficulty.

Example:
  WDS = 75, TCA = 23
  NPS = (75 / 23) × 100 = 326 (Good for this task complexity)
```

### Process Ranking Table Template

```markdown
## Process Ranking for Task T[N]

| Rank | Process | WDS | TEI | PCI | Tokens | Cost | NPS |
|------|---------|-----|-----|-----|--------|------|-----|
| 1 | workflow-v7.0 | 85 | 61.2 | 13.6 | 45000 | $1.93 | 370 |
| 2 | workflow-v6.6 | 72 | 51.8 | 11.5 | 45000 | $1.85 | 313 |
| 3 | workflow-v6.5 | 68 | 48.9 | 9.8 | 50000 | $2.10 | 296 |

**Recommendation:** workflow-v7.0 for this task (best TEI and NPS)
```

---

### Division Safety Guards for Economy Metrics

```
GUARD 7: Token Economy Guards
  IF Total_Tokens == 0:
    - Flag: "TOKEN_COLLECTION_FAILED"
    - Skip all economy metrics
    - Check subagent log file exists

  IF Confirmed_Findings == 0:
    - Skip CPF calculation
    - Report: "NO_FINDINGS_FOR_CPF"

  IF WDS_Points == 0:
    - Skip TE_econ calculation
    - Report: "ZERO_WDS_FOR_ECONOMY"
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

TOKEN ECONOMY:
  Subagent_Tokens = Σ(input + output + cache_creation)
  TE_econ = WDS_Points / Total_Tokens × 10000
  CPF = Total_Tokens / Confirmed_Findings
  PES = (OES × 100) / log10(Total_Tokens)

EFFECTIVENESS (Cost-Effectiveness):
  DE = Confirmed_Findings / Expected_Findings × 100
  CEI = (DE × WDS) / (Total_Tokens / 1000)
  VPK = Confirmed_Findings / (Total_Tokens / 1000)
  EER = DE / CPF × 1000
```

---

## Blind Evaluation Protocol

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
2. When ambiguous, apply Dispute Resolution protocol
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
