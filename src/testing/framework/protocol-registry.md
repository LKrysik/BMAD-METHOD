# Protocol Registry

**Version: 1.0**
**Purpose**: Define all testable verification protocols with their characteristics, invocation methods, and output parsing rules.

---

## Registered Protocols

### DV-V5: Deep Verify V5

| Property | Value |
|----------|-------|
| **ID** | `DV-V5` |
| **File** | `src/core/workflows/deep-verify/workflow-v5.md` |
| **Type** | Phase-based workflow |
| **Expected Output** | Phases + Findings |
| **Token Profile** | Medium (10k-30k) |
| **Time Profile** | 2-5 minutes |

#### Invocation Template
```markdown
## Deep Verify V5

TASK: [task_verbatim]
CONTENT: [artifact]
TYPE: Document
ENVIRONMENT: BMAD-METHOD project

Mode: [G] Guided
```

#### Output Extraction Rules
- **Findings**: Extract from Phase 4/5 tables
- **Severity**: 🔴=CRITICAL, 🟠=IMPORTANT, 🟡=MINOR
- **Success Indicator**: All phases completed with findings

---

### DV-V6: Deep Verify V6

| Property | Value |
|----------|-------|
| **ID** | `DV-V6` |
| **File** | `src/core/workflows/deep-verify/workflow-v6.md` |
| **Type** | Phase-based workflow with concerns |
| **Expected Output** | Concerns + Methods + Findings |
| **Token Profile** | Medium-High (15k-40k) |
| **Time Profile** | 3-7 minutes |

#### Invocation Template
```markdown
## Deep Verify V6

TASK: [task_verbatim]
CONTENT: [artifact]
TYPE: Document
ENVIRONMENT: BMAD-METHOD project, testing context

Mode: [G] Guided - for detailed phase tracking
```

#### Output Extraction Rules
- **Findings**: Extract from confirmed findings after Phase 5
- **Concerns**: Track by layer (A/B/C)
- **Severity**: 🔴=CRITICAL, 🟠=IMPORTANT, 🟡=MINOR
- **Success Indicator**: Phase 5 completed with challenge results

---

### DV-V6.1: Deep Verify with Layer D

| Property | Value |
|----------|-------|
| **ID** | `DV-V6.1` |
| **File** | `src/core/workflows/deep-verify/workflow-v6.1.md` |
| **Parent** | V6 |
| **Key Features** | Layer D (Security/Operational), #115, #39, #61, #67 |
| **Token Profile** | Medium-High (15k-40k) |
| **Best For** | Security-relevant artifacts |

*Same invocation and extraction as DV-V6*

---

### DV-V6.2: Deep Verify with Bayesian Stopping (NEW)

| Property | Value |
|----------|-------|
| **ID** | `DV-V6.2` |
| **File** | `src/core/workflows/deep-verify/workflow-v6.2.md` |
| **Parent** | V6.1 |
| **Key Features** | Phase 4.5 Bayesian Stop Check + all V6.1 features |
| **Token Profile** | Variable: 10k-40k (depends on artifact quality) |
| **Time Profile** | 2-7 minutes |
| **Expected Savings** | 30-40% tokens on clean artifacts |

#### New Feature: Phase 4.5 Bayesian Stop Check

Evaluates P(remaining_errors > 0) after Phase 4. If below threshold, skips Phase 5 (Challenge).

**Safety Constraints (never stop if):**
- Phase < 4
- Categories covered < 3
- Tokens < 2000
- SECURE not checked (for security-relevant artifacts)
- Unresolved CRITICAL findings

**Thresholds:**
| Artifact Type | Threshold θ |
|---------------|-------------|
| Safety-critical | 0.05 |
| Standard | 0.15 |
| Low-priority | 0.25 |

#### Invocation Template
```markdown
## Deep Verify V6.2

TASK: [task_verbatim]
CONTENT: [artifact]
TYPE: Document
ENVIRONMENT: BMAD-METHOD project
ARTIFACT_CRITICALITY: [Safety-critical / Standard / Low-priority]

Mode: [G] Guided - for detailed phase tracking
```

#### Output Extraction Rules
- **All DV-V6 rules apply**
- **Additional**: Check for "Early Stop Decision" in output
- If early stop: Note P(remaining) and threshold in results

---

### DV-V6.3: Deep Verify V6.3 (RESERVED)

| Property | Value |
|----------|-------|
| **ID** | `DV-V6.3` |
| **File** | `src/core/workflows/deep-verify/workflow-v6.3.md` |
| **Parent** | V6.2 |
| **Status** | ⚠️ **RESERVED - NOT YET IMPLEMENTED** |

> **NOTE:** This version slot is reserved for future development. Do not use in experiments until status changes to ACTIVE.
>
> When implementing, define unique features that differentiate from V6.2 (e.g., new methods, different phase structure, or novel optimization).

---

### DV-LITE: Deep Verify Lite

| Property | Value |
|----------|-------|
| **ID** | `DV-LITE` |
| **File** | `src/core/workflows/deep-verify/workflow-v6-lite.md` |
| **Type** | Simplified workflow |
| **Expected Output** | Quick findings |
| **Token Profile** | Low (5k-15k) |
| **Time Profile** | 1-3 minutes |

#### Invocation Template
```markdown
## Deep Verify Lite

TASK: [task_verbatim]
CONTENT: [artifact]

Execute quick verification with reduced phases.
```

---

### VGD: Tensor-Based V-GD Protocol

| Property | Value |
|----------|-------|
| **ID** | `VGD` |
| **File** | `src/core/quality_gates/Tensor-Based-Verification-Protocol.md` |
| **Type** | Mathematical tensor optimization |
| **Expected Output** | Lambda V + Gradient Hotspots + Null Space |
| **Token Profile** | Medium-High (15k-35k) |
| **Time Profile** | 3-6 minutes |

#### Required Methods
- #115 Negative Space Cartography
- #84 Coherence Check
- #81 Scope Integrity Audit
- #109 Contraposition Inversion
- #39 Security Audit Personas
- #67 Stability Basin Analysis
- #26 Red Team vs Blue Team

#### Invocation Template
```markdown
## V-GD Verification

You are a V-GD (Vector Gradient Descent) Optimization Agent.

TASK: [task_verbatim]
CONTENT: [artifact]

Execute V-GD Protocol:
1. Initialize Tensor (map TASK and CONTENT)
2. Vector Field Analysis (gradients, projections, entropy)
3. Calculate Initial Error (Loss L)
4. Perturbation Test (adversarial stress)
5. Gradient Descent (optimization loop)
6. Calculate Final Indicator (Lambda V)

Required methods: #115, #84, #81, #109, #39, #67, #26
Output format: V-GD Verification Report with Lambda V indicator
```

#### Output Extraction Rules
- **Lambda V**: Primary success metric
  - > 0.95 = VERIFIED
  - 0.8-0.95 = ACCEPTABLE
  - < 0.8 = FAILED
- **Findings**: Critical Gradient Hotspots (dL > 0.5)
- **Severity Mapping**:
  - dL > 0.8 → CRITICAL
  - dL 0.5-0.8 → IMPORTANT
  - dL < 0.5 → MINOR
- **Additional Findings**: Null Space voids (k=2 layer)

#### V-GD to Universal Metrics Mapping
| V-GD Output | Universal Metric |
|-------------|------------------|
| Lambda V | → Inverse correlates to DR (higher = fewer issues = lower detection) |
| Gradient Hotspots count | → Finding count |
| Loss L_final | → Quality indicator (lower = better) |
| Optimization steps | → Effort metric (more = more complex issues) |

---

### QVP: Quadrant Verification Protocol

| Property | Value |
|----------|-------|
| **ID** | `QVP` |
| **File** | `src/core/quality_gates/Quadrant-Verification-Protocol.md` |
| **Type** | 4-dimensional mathematical analysis |
| **Expected Output** | 4 Scan reports + Critical Findings |
| **Token Profile** | Medium (12k-30k) |
| **Time Profile** | 3-6 minutes |

#### Four Scans
1. **Topology Scan** (Persistent Homology) - holes, loops, islands
2. **Information Theory Scan** (Mutual Information) - ghosts, dead links
3. **Control Theory Scan** (Lyapunov Stability) - stability, sensitivity
4. **Graph Theory Scan** (Min-Cut) - SPOF, bottlenecks

#### Invocation Template
```markdown
## QVP Verification

You are a Quadrant Verification System (QVP).

CONTENT: [artifact]
CONTEXT: [task_verbatim]

Execute 4 scans on the content modeled as a dynamic system:

1. Topology Scan: Find holes in logic, loops without exit, isolated fragments
2. Information Scan: Find ghosts (hidden dependencies), dead links
3. Control Scan: Test stability with noise input
4. Graph Scan: Find critical points (Min-Cut), SPOF

Output format: QVP Verification Report
```

#### Output Extraction Rules
- **Findings**: Items from Critical Findings Summary
- **Severity Mapping**:
  - SPOF = CRITICAL → CRITICAL
  - Unstable → CRITICAL
  - High Sensitivity → CRITICAL
  - Holes/Loops/Ghosts → IMPORTANT
  - Dead Links/Bottlenecks → MINOR

#### QVP to Universal Metrics Mapping
| QVP Output | Universal Metric |
|------------|------------------|
| Scan completeness (4/4) | → Protocol execution quality |
| Total findings | → Finding count |
| SPOF count | → Critical findings |
| Stability status | → Quality indicator |

---

### UAQG: Universal Agent Quality Gate

| Property | Value |
|----------|-------|
| **ID** | `UAQG` |
| **File** | `src/core/quality_gates/Universal-Agent-Quality-Gate-Protocol.md` |
| **Type** | Quality gate checklist |
| **Expected Output** | Gate pass/fail + Findings |
| **Token Profile** | Low-Medium (5k-20k) |
| **Time Profile** | 1-4 minutes |

---

## Token & Time Measurement Protocol

### Token Counting

```markdown
## Token Measurement

### Agent Phase (Phase 1)
For each agent run, record:
- Input tokens (prompt + context)
- Output tokens (generated artifact)
- Total tokens = Input + Output

### Protocol Phase (Phase 2)
For each protocol run, record:
- Input tokens (protocol prompt + artifact)
- Output tokens (verification report)
- Total tokens = Input + Output

### Aggregate Metrics
- Agent tokens (mean): Σ(agent_total) / runs
- Protocol tokens (mean): Σ(protocol_total) / runs
- Total experiment tokens: agent_mean + protocol_mean
- Tokens per finding: total / confirmed_findings
- Tokens per point: total / WDS_points
```

### Time Measurement

```markdown
## Time Measurement

### Agent Phase (Phase 1)
For each agent run, record:
- Start time: [timestamp]
- End time: [timestamp]
- Duration: [seconds]

### Protocol Phase (Phase 2)
For each protocol run, record:
- Start time: [timestamp]
- End time: [timestamp]
- Duration: [seconds]

### Aggregate Metrics
- Agent time (mean): Σ(agent_duration) / runs
- Protocol time (mean): Σ(protocol_duration) / runs
- Total experiment time: agent_mean + protocol_mean
- Time per finding: total / confirmed_findings
- Time per point: total / WDS_points
```

### Efficiency Metrics

| Metric | Formula | Unit |
|--------|---------|------|
| Token Efficiency (TE) | WDS_points / total_tokens × 1000 | points/1k tokens |
| Time Efficiency (TiE) | WDS_points / total_seconds × 60 | points/minute |
| Finding Rate (FR) | confirmed_findings / total_tokens × 1000 | findings/1k tokens |
| Finding Speed (FS) | confirmed_findings / total_seconds × 60 | findings/minute |
| Cost-per-Point (CPP) | total_tokens / WDS_points | tokens/point |
| Time-per-Point (TPP) | total_seconds / WDS_points | seconds/point |

---

## Protocol Comparison Template

### Direct Comparison Table

```markdown
## Protocol Comparison on Task T[N]

| Metric | [P1] | [P2] | [P3] | Best |
|--------|------|------|------|------|
| **Detection** |
| DR | | | | |
| DR_critical | | | | |
| WDS | | | | |
| **Quality** |
| P (precision) | | | | |
| DQ (depth) | | | | |
| CC (coverage) | | | | |
| **Efficiency** |
| Total Tokens | | | | |
| Total Time | | | | |
| TE (token eff) | | | | |
| TiE (time eff) | | | | |
| Tokens/Finding | | | | |
| Seconds/Finding | | | | |
| **Composite** |
| OES | | | | |
| **Protocol-Specific** |
| [P1-specific] | [val] | - | - | |
| [P2-specific] | - | [val] | - | |
| [P3-specific] | - | - | [val] | |
```

### When to Use Which Protocol

| Scenario | Recommended Protocol | Rationale |
|----------|---------------------|-----------|
| Quick sanity check | DV-LITE | Low token cost, fast |
| Comprehensive review | DV-V6 | Best balance detection/cost |
| Security-critical | VGD | Adversarial stress testing |
| Architecture review | QVP | Structural analysis (Min-Cut, SPOF) |
| Mathematical rigor | VGD | Tensor-based optimization |
| Unknown artifact type | QVP | 4-dimensional coverage |

---

## Adding New Protocols

### Registration Template

```markdown
### [PROTOCOL_ID]: [Protocol Name]

| Property | Value |
|----------|-------|
| **ID** | `[UNIQUE_ID]` |
| **File** | `[path/to/protocol.md]` |
| **Type** | [phase-based / mathematical / checklist / ...] |
| **Expected Output** | [what the protocol produces] |
| **Token Profile** | [Low/Medium/High] ([range]) |
| **Time Profile** | [range] minutes |

#### Invocation Template
```
[How to invoke this protocol]
```

#### Output Extraction Rules
- **Findings**: [How to extract findings]
- **Severity**: [How to map severity]
- **Success Indicator**: [How to know protocol succeeded]

#### Protocol-to-Universal Metrics Mapping
| Protocol Output | Universal Metric |
|-----------------|------------------|
| [output_field] | → [universal_metric] |
```

### Validation Checklist for New Protocol

- [ ] Protocol file exists and is readable
- [ ] Invocation template produces expected output format
- [ ] Output extraction rules correctly identify findings
- [ ] Severity mapping covers all protocol severity levels
- [ ] Token and time profiles are realistic
- [ ] At least one test run completed successfully
