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

### DV-V6.3: Deep Verify with Integration Check & Enhanced Methods

| Property | Value |
|----------|-------|
| **ID** | `DV-V6.3` |
| **File** | `src/core/workflows/deep-verify/workflow-v6.3.md` |
| **Parent** | V6.2 |
| **Status** | ✅ **ACTIVE** |
| **Key Features** | Phase 1.5 Integration Check, 8 new methods, Phase 6.5 Kernel Handoff |
| **Token Profile** | Medium-High (15k-45k) |
| **Time Profile** | 3-8 minutes |
| **Best For** | Artifacts with external dependencies, integration-heavy designs |

#### New Features in V6.3

**Phase 1.5: Integration Check (MANDATORY)**
- Forces reading of external references before verification
- Uses #127 Bootstrap Paradox for circular dependency detection
- Addresses INTEGRATE weakness (T11-E1 type errors)

**New Methods:**
| # | Name | Category | Purpose |
|---|------|----------|---------|
| #127 | Bootstrap Paradox | challenge | Circular dependency detection |
| #128 | Theseus Paradox | challenge | Core problem alignment |
| #116 | Strange Loop Detection | epistemology | Reasoning cycle detection |
| #119 | Ground Truth Demand | epistemology | Claim verifiability |
| #132 | Goodhart's Law Check | meta | Metric vs goal alignment |
| #136 | Kernel Paradox | meta | Self-evaluation limits |
| #151 | Semantic Entropy Validation | epistemology | Confabulation detection |
| #152 | Socratic Decomposition | core | Targeted 5 Whys |

**Phase 6.5: Kernel Paradox Handoff**
- Explicitly identifies what agent CANNOT verify
- Provides user verification checklist
- Improves human-agent collaboration

#### Invocation Template
```markdown
## Deep Verify V6.3

TASK: [task_verbatim]
CONTENT: [artifact]
TYPE: Document
ENVIRONMENT: BMAD-METHOD project
ARTIFACT_CRITICALITY: [Safety-critical / Standard / Low-priority]
INTEGRATION_CONTEXT: [List of related files/modules that should be checked]

Mode: [G] Guided - for detailed phase tracking
```

#### Output Extraction Rules
- **All DV-V6.2 rules apply**
- **Additional**: Check Phase 1.5 Integration Check results
- **Additional**: Extract Kernel Handoff items from Phase 6.5
- **Entropy column**: Extract from findings (LOW/MEDIUM/HIGH)

#### Expected Performance vs V6.2
| Metric | V6.2 | V6.3 Expected |
|--------|------|---------------|
| INTEGRATE DR | 35% | 55% |
| Overall DR | 42.9% | 55-60% |
| False Positive Rate | ~65% | ~45% |

---

### DV-V7: Deep Verify V7 - Adaptive Verification System (AVS)

| Property | Value |
|----------|-------|
| **ID** | `DV-V7` |
| **File** | `src/core/workflows/deep-verify/workflow-v7.md` |
| **Parent** | V6.6 (major architecture change) |
| **Status** | ✅ **ACTIVE - RECOMMENDED** |
| **Key Features** | 4-layer architecture (Innate/Adaptive/Memory/Escalation), dynamic method selection, anomaly detection, learning loop, tiered execution, explicit uncertainty |
| **Token Profile** | Variable: 10K-100K+ (based on tier/criticality) |
| **Time Profile** | 2-15 minutes (tier-dependent) |
| **Best For** | ALL artifacts - adapts to complexity and criticality |

#### Architecture: Adaptive Verification System

**4-Layer Model:**
| Layer | Purpose | Budget | Always Runs? |
|-------|---------|--------|--------------|
| Layer 1: INNATE | Fast pattern detection | ~5-10K | YES |
| Layer 2: ADAPTIVE | Deep artifact-specific analysis | ~15-30K | Tier 2+ |
| Layer 3: MEMORY | Learning and weight updates | ~1K | YES |
| Layer 4: ESCALATION | Human review | Variable | When triggered |

**Tier System:**
| Tier | Budget | Layers | Trigger |
|------|--------|--------|---------|
| 1 | 10K | 1 only | Simple + Low criticality |
| 2 | 20K | 1 + partial 2 | Low complexity OR low criticality |
| 3 | 40K | 1 + 2 | Medium complexity AND medium+ criticality |
| 4 | 60K | 1 + 2 + 4 | High complexity OR high criticality |
| 5 | 100K+ | All | Critical artifacts |

#### Key Innovations in V7

1. **Paradigm Shift**: From pattern-based → adaptive layered detection
2. **Dynamic Method Selection**: Methods selected FOR EACH ARTIFACT based on relevance scoring
3. **Anomaly Detection**: Flags unknown patterns instead of missing them
4. **Learning Loop**: Weight updates improve future runs
5. **Confidence Reporting**: Explicit uncertainty levels (0-100%)
6. **Tiered Execution**: Cost proportional to artifact importance
7. **Human Escalation**: Automatic escalation for low-confidence items

#### Invocation Template
```markdown
## Deep Verify V7.0 - AVS

TASK: [task_verbatim]
CONTENT: [artifact]

Execute Adaptive Verification System:
1. Phase 0: Artifact Intake & Triage
2. Layer 1 (INNATE): Fast pattern detection
3. Layer 2 (ADAPTIVE): Deep analysis (if tier >= 2)
4. Layer 3 (MEMORY): Learning extraction
5. Layer 4 (ESCALATION): Human review (if triggered)

Output: Verification Report with confidence levels
```

#### Output Extraction Rules
- **Findings**: Extract from Verification Report, includes confidence %
- **Severity**: CRITICAL / IMPORTANT / MINOR / DEFERRED
- **Uncertainty Report**: New section showing what agent couldn't verify
- **Learning Metrics**: Method effectiveness for tracking
- **Tier Executed**: Which tier was applied

#### Expected Performance vs V6.6

| Metric | V6.6 | V7 Expected | Notes |
|--------|------|-------------|-------|
| Detection Rate | ~58% | 70-85% | Anomaly detection catches unknowns |
| Token Efficiency | ~100K/run | 10-60K (tier-based) | Tiered saves on simple artifacts |
| Adaptiveness | None | Full | Per-artifact method selection |
| Unknown Pattern Handling | Misses | Flags as anomaly | Core V7 feature |
| Learning | None | Continuous | Weights update each run |

---

### DV-V6.6: Deep Verify with Conflict & Dependency Analysis

| Property | Value |
|----------|-------|
| **ID** | `DV-V6.6` |
| **File** | `src/core/workflows/deep-verify/workflow-v6.6.md` |
| **Parent** | V6.5 |
| **Status** | ✅ ACTIVE |
| **Key Features** | Phase 2.7 Conflict & Dependency Deep Analysis, Vocabulary Normalization, Definition Triad Expansion, Pairwise Compatibility, Dependency Graph |
| **Token Profile** | High (40K-100K) |
| **Time Profile** | 5-10 minutes |

*See workflow-v6.6.md for full details*

---

### DV-V6.5: Deep Verify with Two-Pass Semantic Selection

| Property | Value |
|----------|-------|
| **ID** | `DV-V6.5` |
| **File** | `src/core/workflows/deep-verify/workflow-v6.5.md` |
| **Parent** | V6.4 |
| **Status** | ✅ ACTIVE |
| **Key Features** | Problem Signature Extraction, Two-Pass Method Selection with Reasoning Gate, Phase 3.5 Theory Check |
| **Token Profile** | Medium-High (30K-80K) |

*See workflow-v6.5.md for full details*

---

### DV-V6.4: Deep Verify with Adaptive Method Selection

| Property | Value |
|----------|-------|
| **ID** | `DV-V6.4` |
| **File** | `src/core/workflows/deep-verify/workflow-v6.4.md` |
| **Parent** | V6.3 |
| **Status** | ✅ ACTIVE |
| **Key Features** | Phase 0.5 Context Analysis, Adaptive Method Selection, Phase 7.5 Learning Extraction |
| **Token Profile** | Low-Medium (5k-15k) - **66% reduction vs V6.3** |
| **Time Profile** | 2-5 minutes |
| **Best For** | All artifact types - adapts method selection to context |

#### Key Innovations in V6.4

**Phase 0.5: Context Analysis (NEW)**
- Extracts artifact features: type, domain, complexity, has_external_deps, has_concurrency, has_state, has_security_aspect
- Sets method budget based on complexity:
  - Low: 8-12 methods
  - Medium: 12-18 methods
  - High: 18-25 methods

**Adaptive Method Selection**
- Methods selected based on:
  - Artifact features (conditional inclusion)
  - Method effectiveness scores (from method_scores.yaml)
  - Category diversity (min 3 categories)
- Base methods always included: #81, #84, #113
- Conditional methods triggered by features:
  - has_external_deps → #127, #90
  - has_concurrency → #67, #68
  - has_state → #62, #39
  - has_security_aspect → #34, #21

**Phase 7.5: Learning Extraction (NEW)**
- Tracks method effectiveness per session
- Updates method_scores.yaml with findings data
- Formula: `new_score = old_score * 0.9 + session_precision * 0.1`

#### Supporting Files
- **Workflow**: `src/core/workflows/deep-verify/workflow-v6.4.md`
- **Scores**: `src/core/workflows/deep-verify/method_scores.yaml`

#### Invocation Template
```markdown
## Deep Verify V6.4

TASK: [task_verbatim]
CONTENT: [artifact]
TYPE: Document
ENVIRONMENT: BMAD-METHOD project

Mode: [G] Guided - for detailed phase tracking
```

#### Output Extraction Rules
- **All DV-V6.3 rules apply**
- **Additional**: Extract Context Analysis from Phase 0.5
- **Additional**: Extract Method Budget and selected methods
- **Additional**: Extract Learning Data from Phase 7.5
- **Efficiency metric**: findings / methods_used

#### Performance vs V6.3

| Metric | V6.3 | V6.4 | Improvement |
|--------|------|------|-------------|
| Tokens (avg) | ~15-18K | ~5-6K | **-66%** |
| Methods used | 42-55 | 13-16 | **-70%** |
| Findings | 8-11 | 9-11 | Maintained |
| Efficiency (f/m) | 0.20 | 0.64-0.74 | **+220%** |
| INTEGRATE DR | 100% | 100% | Maintained |

#### Validated On
- T12: Predictive User Intent Engine ✅
- T13: Cross-Agent Memory Sync ✅
- T14: Self-Modifying Workflow ✅
- T15: NL to Method Mapping ✅

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
| **Default choice (any artifact)** | **DV-V7** | Adapts to artifact, learns over time |
| Quick sanity check | DV-LITE or DV-V7 Tier 1 | Low token cost, fast |
| Comprehensive review | DV-V7 Tier 4-5 | Full adaptive analysis with escalation |
| Security-critical | DV-V7 (auto-detects criticality) | Tiered execution + anomaly detection |
| Architecture review | QVP or DV-V7 | QVP for structural, V7 for adaptive |
| Mathematical rigor | VGD | Tensor-based optimization |
| Unknown artifact type | DV-V7 | Anomaly detection handles unknown patterns |
| Legacy comparison | DV-V6.x | When comparing against V6 baseline |

**V7 Recommendation Matrix:**
| Artifact Complexity | Artifact Criticality | V7 Tier | Budget |
|---------------------|---------------------|---------|--------|
| LOW | LOW | 1 | 10K |
| LOW/MEDIUM | MEDIUM | 2-3 | 20-40K |
| HIGH | HIGH | 4 | 60K |
| ANY | CRITICAL | 5 | 100K+ |

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
