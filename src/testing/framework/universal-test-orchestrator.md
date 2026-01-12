# Universal Verification Protocol Test Orchestrator

**Version: 1.0**
**Purpose**: Test ANY verification protocol against standardized trap tasks with measurable metrics.

---

## Supported Protocols

| Protocol ID | Name | File | Output Type |
|-------------|------|------|-------------|
| `DV-V6.1` | Deep Verify V6.1 | `workflow-v6.1.md` | Phases + Findings |
| `DV-V6.2` | Deep Verify V6.2 | `workflow-v6.2.md` | Phases + Findings |
| `DV-V6.3` | Deep Verify V6.3 | `workflow-v6.3.md` | Phases + Findings |
| `DV-LITE` | Deep Verify Lite | `workflow-v6-lite.md` | Phases + Findings |
| `VGD` | Tensor V-GD Protocol | `quality_gates/Tensor-Based-Verification-Protocol.md` | Lambda V + Gradient Hotspots |
| `QVP` | Quadrant Verification | `quality_gates/Quadrant-Verification-Protocol.md` | 4 Scans + SPOF |
| `UAQG` | Universal Agent QG | `quality_gates/Universal-Agent-Quality-Gate-Protocol.md` | Quality Gates |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL TEST ORCHESTRATOR                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   SELECT     │    │   SELECT     │    │   CONFIG     │                   │
│  │   PROTOCOL   │───→│   TASK       │───→│   RUNS       │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│         │                   │                   │                            │
│         └───────────────────┴───────────────────┘                            │
│                             │                                                │
│                             ▼                                                │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │                    EXECUTION ENGINE                           │           │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐               │           │
│  │  │  AGENT   │───→│ PROTOCOL │───→│ ADAPTER  │               │           │
│  │  │  ×N RUNS │    │  VERIFY  │    │ (OUTPUT) │               │           │
│  │  └──────────┘    └──────────┘    └──────────┘               │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                             │                                                │
│                             ▼                                                │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │                    EVALUATION ENGINE                          │           │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐               │           │
│  │  │  BLIND   │───→│  METRICS │───→│   LOG    │               │           │
│  │  │  EVAL    │    │  COMPUTE │    │ RESULTS  │               │           │
│  │  └──────────┘    └──────────┘    └──────────┘               │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                             │                                                │
│                             ▼                                                │
│                    ┌──────────────┐                                         │
│                    │   COMPARE    │                                         │
│                    │   PROTOCOLS  │                                         │
│                    └──────────────┘                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Experiment Configuration

### 0.1 Select Protocol

```markdown
## Protocol Selection

Protocol ID: [DV-V6 / VGD / QVP / UAQG / ...]
Protocol File: [path to protocol file]
Protocol Version: [version]

### Protocol Characteristics
- Output format: [Findings / Lambda V / 4 Scans / ...]
- Expected output structure: [describe]
- Key metrics produced: [list]
```

### 0.2 Select Task

```markdown
## Task Selection

Task ID: T[1-15]
Task Name: [from trap-tasks.md]
Difficulty: [Standard / Advanced]
Expected Errors: [count from ground-truth.md]
Max Points: [weighted score]
```

### 0.3 Run Configuration

```markdown
## Run Configuration

Number of Runs: [1 minimum]
Agent Model: [sonnet / opus / haiku]
Agent Isolation: [confirmed - no access to ground-truth]

### Protocol-Specific Parameters
[List any parameters specific to selected protocol]
```

---

## Phase 0.5: Artifact Check (NEW - Reuse Logic)

**Purpose:** Avoid regenerating artifacts that already exist. Artifacts are expensive to generate and should be reused across protocol tests.

### 0.5.1 Check Artifact Existence

```markdown
## Artifact Check for Task T[N]

Artifact Location: `src/testing/results/experiments/artifacts/`
Expected File: `artifact-t[N].md` (from trap-tasks.md → Artifact File field)

### Check Result:
```

**Decision Tree:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARTIFACT CHECK                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Check: Does artifact-t[N].md exist?                            │
│                                                                  │
│  ┌────────────────────────┬────────────────────────────────────┐│
│  │                        │                                    ││
│  │   YES (EXISTS)         │   NO (NOT FOUND)                   ││
│  │                        │                                    ││
│  │   ✓ INFORM:            │   ✗ INFORM:                        ││
│  │   "Artifact found:     │   "Artifact NOT found:             ││
│  │    artifact-t[N].md    │    artifact-t[N].md                ││
│  │    Proceeding to       │    Launching subagent to           ││
│  │    verification"       │    generate artifact..."           ││
│  │                        │                                    ││
│  │   → SKIP Phase 1       │   → EXECUTE Phase 1                ││
│  │   → GO TO Phase 2      │     (via subagent)                 ││
│  │                        │   → SAVE to artifact-t[N].md       ││
│  │                        │   → GO TO Phase 2                  ││
│  │                        │                                    ││
│  └────────────────────────┴────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.5.2 Communication Templates

**When artifact EXISTS:**
```
✓ ARTIFACT FOUND: artifact-t[N].md
  Location: src/testing/results/experiments/artifacts/artifact-t[N].md
  Status: Using existing artifact for verification
  Action: Proceeding to Phase 2 (Protocol Verification)
```

**When artifact NOT FOUND:**
```
✗ ARTIFACT NOT FOUND: artifact-t[N].md
  Expected at: src/testing/results/experiments/artifacts/artifact-t[N].md
  Status: Artifact does not exist - generation required
  Action: Launching subagent to execute Task T[N] from trap-tasks.md
```

### 0.5.3 Subagent Delegation (when artifact missing)

When artifact doesn't exist, spawn a subagent with:
- **Type:** general-purpose
- **Task:** Execute T[N] from trap-tasks.md
- **Output:** Save result to `artifact-t[N].md`
- **Isolation:** Subagent must NOT access ground-truth.md

---

## Phase 1: Execute Agent Task (Conditional)

**CONDITION:** Only execute if artifact does NOT exist (see Phase 0.5)

**If artifact EXISTS:** Skip Phase 1, proceed directly to Phase 2.

**If artifact NOT EXISTS:** Execute via subagent, save to artifact file.

### 1.1 Agent Prompt Template

```markdown
You are an expert software architect. Complete the following task thoroughly.

## Task
[Insert task from trap-tasks.md - VERBATIM]

## Instructions
1. Read all requirements carefully
2. Design a complete solution addressing every requirement
3. Document all assumptions explicitly
4. Consider edge cases and failure modes
5. Provide implementation guidance

## Constraints
- Do NOT access any files outside the task description
- Make explicit any information you need but don't have
- If requirements conflict, document the conflict and your resolution

## Deliverable Format
Provide your solution as a structured design document.
```

### 1.2 Capture Per Agent Run

```markdown
## Agent Run [1/2/3]

### Output
[Save as artifact-run-N.md]

### Token Count
- Input: [N]
- Output: [N]
- Total: [N]
```

---

## Phase 2: Execute Protocol Verification (×N Runs)

### 2.1 Protocol Invocation Templates

#### For Deep Verify (DV-*) Protocols

```markdown
## Deep Verify V[X]

TASK: [Original task - VERBATIM]
CONTENT: [Agent artifact from run N]
TYPE: Document
ENVIRONMENT: BMAD-METHOD project, testing context

Mode: [G] Guided
```

#### For V-GD (Tensor) Protocol

```markdown
## V-GD Verification

TASK: [Original task - VERBATIM]
CONTENT: [Agent artifact from run N]

Execute V-GD Protocol from: quality_gates/Tensor-Based-Verification-Protocol.md

Required methods: #115, #84, #81, #109, #39, #67, #26
Output: V-GD Verification Report with Lambda V indicator
```

#### For QVP (Quadrant) Protocol

```markdown
## QVP Verification

CONTENT: [Agent artifact from run N]
CONTEXT: [Original task description]

Execute Quadrant Verification Protocol from: quality_gates/Quadrant-Verification-Protocol.md

Execute 4 scans:
1. Topology Scan (Persistent Homology)
2. Information Theory Scan (Mutual Information)
3. Control Theory Scan (Lyapunov Stability)
4. Graph Theory Scan (Min-Cut)

Output: QVP Verification Report
```

### 2.2 Protocol Output Capture

#### Deep Verify Output Structure

```markdown
## Protocol Run [N] - Deep Verify

### Phase Summary
| Phase | Status | Key Output |
|-------|--------|------------|
| 0 | [PASS/FAIL] | [summary] |
| 2 | [PASS/FAIL] | [concerns count] |
| 3 | [PASS/FAIL] | [methods count] |
| 4 | [PASS/FAIL] | [findings count] |
| 5 | [PASS/FAIL] | [confirmed count] |

### Findings
| ID | Concern | Severity | Description |
|----|---------|----------|-------------|
| 1 | [A1/B2/C3] | [CRITICAL/IMPORTANT/MINOR] | [brief] |

Total Tokens: [N]
```

#### V-GD Output Structure

```markdown
## Protocol Run [N] - V-GD

### Tensor Metrics
- Dimensions: [i × j × k]
- Initial Loss L_start: [value]
- Final Loss L_final: [value]
- Optimization Steps: [count]

### Critical Gradient Hotspots (Top 3)
| ID | Location (i,j,k) | Method | Gradient dL | Issue Type |
|----|------------------|--------|-------------|------------|
| 01 | [...] | #[N] | [value] | [type] |

### Null Space Analysis (k=2)
- Discovered Voids: [list]
- Risk Entropy: [High/Medium/Low]

### Adversarial Stress Test
- Failure Vectors: [list]
- System Response: [Stable/Unstable/Partial]

### Final Quality Indicator
- Lambda V: [NUMERIC VALUE]
- Status: [VERIFIED / ACCEPTABLE / FAILED]

Total Tokens: [N]
```

#### QVP Output Structure

```markdown
## Protocol Run [N] - QVP

### Topology Scan (Persistent Homology)
- Holes Found: [list]
- Status: [CLEAN / HOLES DETECTED]

### Information Theory Scan (Mutual Information)
- Ghosts (Hidden Couplings): [list]
- Dead Links: [list]
- Status: [INDEPENDENT / COUPLED]

### Control Theory Scan (Lyapunov Stability)
- Stability: [Stable / Unstable]
- Sensitivity: [Low / High]
- Explosive Errors: [list]

### Graph Theory Scan (Min-Cut)
- Min-Cut Nodes: [list]
- SPOF Risk: [NONE / CRITICAL]
- Bottlenecks: [list]

### Critical Findings
[Prioritized list]

Total Tokens: [N]
```

---

## Phase 3: Universal Blind Evaluation

### 3.1 Normalize Findings to Common Format

**Before matching to ground truth, convert ALL protocol outputs to:**

```markdown
## Normalized Finding

Finding ID: [Protocol]-[Run]-F[N]
Original Location: [where in protocol output]
Description: [what defect was found]
Evidence: [quote or reference]
Severity: [CRITICAL / IMPORTANT / MINOR]
Category: [SCOPE/ASSUME/SKIP/SHALLOW/CONFLICT/INTEGRATE/EDGE/DEPEND/PERF/SECURE]
Confidence: [HIGH / MEDIUM / LOW]
```

### 3.2 Protocol-to-Finding Mapping

| Protocol | What Counts as Finding |
|----------|------------------------|
| Deep Verify | Confirmed findings from Phase 5 |
| V-GD | Critical Gradient Hotspots + Null Space Voids |
| QVP | All items in Critical Findings Summary |

### 3.3 Severity Mapping

| Protocol Output | Maps to Severity |
|-----------------|------------------|
| DV: 🔴 / CRITICAL | CRITICAL |
| DV: 🟠 / IMPORTANT | IMPORTANT |
| DV: 🟡 / MINOR | MINOR |
| V-GD: dL > 0.8 | CRITICAL |
| V-GD: dL 0.5-0.8 | IMPORTANT |
| V-GD: dL < 0.5 | MINOR |
| V-GD: Lambda V < 0.8 | → add CRITICAL finding |
| QVP: SPOF = CRITICAL | CRITICAL |
| QVP: Unstable | CRITICAL |
| QVP: Holes/Ghosts | IMPORTANT |
| QVP: Dead Links/Bottlenecks | MINOR |

### 3.4 Blind Matching Process

```markdown
## Blind Finding Assessment

### Step 1: List Normalized Findings (BEFORE seeing ground-truth)
| Finding ID | Description | Evidence | Confidence |
|------------|-------------|----------|------------|
| [P]-R[N]-F[M] | [description] | [quote] | HIGH/MED/LOW |

### Step 2: NOW open ground-truth.md and match

### Detection Matrix
| Error ID | Category | Severity | Finding Match | Match Quality | Points |
|----------|----------|----------|---------------|---------------|--------|
| T[N]-E[M] | [cat] | [sev] | [finding IDs or N/A] | Y/P/N | [pts] |

### Match Criteria
- Y (full): Problem identified correctly, evidence matches
- P (partial): Problem area correct but details incomplete
- N (none): Not detected
```

---

## Phase 4: Calculate Universal Metrics

### 4.1 Core Metrics (All Protocols)

| Metric | Formula | Protocol-Agnostic? |
|--------|---------|-------------------|
| DR | Detected / Expected × 100 | YES |
| WDS | Σ(detected × weight) / Σ(weight) × 100 | YES |
| TE | WDS_points / Tokens × 1000 | YES |
| P | TP / (TP + FP) | YES |
| DQ | Σ(depth) / findings | YES (with mapping) |
| CC | categories_hit / 10 × 100 | YES |

### 4.2 Protocol-Specific Metrics

#### Deep Verify Specific

- CE_layer_A, CE_layer_B, CE_layer_C (Concern Efficiency)
- Phase completion rate

#### V-GD Specific

- Lambda V final value
- Gradient descent convergence rate
- Null Space coverage (% of k=2 items addressed)

#### QVP Specific

- Scan coverage (4/4 scans completed)
- SPOF detection rate
- Stability classification accuracy

### 4.3 Metrics Calculation Template

```markdown
## Metrics - [Protocol] on Task T[N]

### Per-Run Metrics
| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev | RS |
|--------|-------|-------|-------|------|--------|-----|
| DR | | | | | | |
| DR_critical | | | | | | |
| WDS | | | | | | |
| Tokens | | | | | | |
| TE | | | | | | |
| P | | | | | | |
| DQ | | | | | | |
| CC | | | | | | |
| OES | | | | | | |

### Protocol-Specific
[Add protocol-specific metrics here]

### Stability Assessment
- All RS > 0.8: STABLE
- Any RS 0.6-0.8: MODERATE
- Any RS < 0.6: UNSTABLE
```

---

## Phase 5: Log Results

### Universal Experiment Log Entry

```markdown
## Experiment EXP-[YYYY-MM-DD]-[NNN]

### Configuration
- Protocol: [ID and version]
- Task: T[N] - [name]
- Runs: [count]
- Agent Model: [model]
- Date: [timestamp]

### Results Summary
| Metric | Value | Interpretation |
|--------|-------|----------------|
| DR | [%] | [Excellent/Good/Moderate/Poor] |
| WDS | [%] | |
| TE | [value] | [High/Moderate/Low] |
| P | [value] | [Clean/Acceptable/Noisy] |
| DQ | [value] | [Excellent/Good/Moderate/Shallow] |
| CC | [%] | |
| OES | [value] | |
| RS | [value] | [Stable/Moderate/Unstable] |

### Protocol-Specific Results
[Protocol-specific metrics and observations]

### Findings Analysis
- Expected errors: [N]
- Detected (full): [N]
- Detected (partial): [N]
- Missed: [N]
- False positives: [N]
- Bonus valid: [N]

### Category Coverage
| Category | Detection Rate |
|----------|---------------|
| SCOPE | [%] |
| ASSUME | [%] |
| SKIP | [%] |
| [etc.] | |

### Observations
[Free-form notes on protocol behavior]

### Issues Identified
[List of problems with the protocol]

### Recommendations
[Suggestions for protocol improvement]
```

---

## Phase 6: Cross-Protocol Comparison

### 6.1 Comparison Matrix

```markdown
## Protocol Comparison - Task T[N]

| Metric | DV-V6 | V-GD | QVP | Winner |
|--------|-------|------|-----|--------|
| DR | | | | |
| DR_critical | | | | |
| WDS | | | | |
| TE | | | | |
| P | | | | |
| DQ | | | | |
| OES | | | | |
| Tokens (total) | | | | |

### Unique Strengths
- DV-V6: [what it catches that others miss]
- V-GD: [what it catches that others miss]
- QVP: [what it catches that others miss]

### Unique Weaknesses
- DV-V6: [blind spots]
- V-GD: [blind spots]
- QVP: [blind spots]

### Category Detection Comparison
| Category | DV-V6 | V-GD | QVP |
|----------|-------|------|-----|
| SCOPE | ✓/~/✗ | | |
| ASSUME | | | |
| [etc.] | | | |

### Recommendation
[Which protocol for which use case]
```

---

## Phase 7: Decide & Evolve

### 7.1 Stopping Criteria

**STOP testing specific protocol if ANY:**
- [ ] DR_critical > 90% for 3 consecutive experiments
- [ ] Protocol shows no improvement after 3 variants
- [ ] Token efficiency becomes unacceptable (TE < 0.05)
- [ ] OES regression: new version scores LOWER than previous for 2 consecutive experiments
- [ ] Maximum iterations reached: 10 versions of same protocol family

**CONTINUE if:**
- [ ] DR_critical < 90%
- [ ] Known blind spots remain addressable
- [ ] Token efficiency acceptable
- [ ] OES trending upward or stable

**ROLLBACK TRIGGER:**
If new protocol version has OES < (previous OES - 5%), consider:
1. Reverting to previous version
2. Documenting what change caused regression
3. Trying alternative modification approach

### 7.2 Protocol Evolution

If continuing with protocol improvement:

```markdown
## Protocol Evolution Plan

### Issues to Address
1. [Issue from experiment]
2. [Issue from experiment]

### Proposed Changes
[Specific modifications to protocol]

### New Variant Name
[Protocol-vX.Y]

### Hypothesis
[What should improve]

### Next Experiment
- Same task (for comparison)
- New task (for generalization)
```

---

## Quick Start Commands

### Test Single Protocol on Single Task

```
Test protocol [PROTOCOL_ID] on task T[N]:

1. Read: universal-test-orchestrator.md
2. Read: [protocol file]
3. Read: trap-tasks.md (select T[N])
4. Execute Phase 0 (configuration)
5. Execute Phase 1 (3 agent runs)
6. Execute Phase 2 (3 protocol verifications)
7. Execute Phase 3 (blind evaluation)
8. Execute Phase 4 (calculate metrics)
9. Execute Phase 5 (log results)
```

### Compare Multiple Protocols on Same Task

```
Compare protocols [P1], [P2], [P3] on task T[N]:

1. For each protocol:
   - Run full experiment (Phases 0-5)
   - Log to protocol-specific experiment log
2. Execute Phase 6 (cross-protocol comparison)
3. Document findings in comparison-log.md
```

### Test Protocol Across Multiple Tasks

```
Test protocol [PROTOCOL_ID] on tasks T[1], T[3], T[5]:

For each task:
1. Run full experiment (Phases 0-5)
2. Log results

After all tasks:
- Calculate aggregate metrics across tasks
- Identify consistent blind spots
- Determine generalization capability
```

---

## File Organization

```
src/
├── testing/                                    # ALL TESTING FILES
│   ├── framework/                              # Testing framework
│   │   ├── prompt.md                          # Test prompt template (START HERE)
│   │   ├── universal-test-orchestrator.md     # This file - main orchestrator
│   │   ├── protocol-registry.md               # Protocol definitions & invocation
│   │   ├── universal-metrics.md               # Metrics formulas & guards
│   │   ├── meta-analysis-protocol.md          # Phase 8 meta-analysis
│   │   ├── meta-analysis-execution-template.md # Meta-analysis template
│   │   ├── AGENT-INSTRUCTIONS-UNIVERSAL.md    # Quick start for agents
│   │   ├── method-matrix.md                   # Methods per action (reference)
│   │   ├── modification-operators.md          # How to evolve protocols (reference)
│   │   ├── [LEGACY] metrics.md                # Deprecated - use universal-metrics.md
│   │   ├── [LEGACY] test-orchestrator-legacy.md # Deprecated - use this file
│   │   └── [LEGACY] AGENT-INSTRUCTIONS-legacy.md # Deprecated
│   │
│   ├── tasks/                                  # Test tasks
│   │   ├── trap-tasks.md                      # Standard tasks T1-T10
│   │   ├── trap-tasks-v2.md                   # Advanced tasks T11-T15
│   │   └── ground-truth.md                    # Expected errors (CONFIDENTIAL)
│   │
│   └── results/                                # Experiment results
│       ├── experiment-log.md                  # All experiments log
│       ├── comparisons/                       # Protocol comparisons
│       │   └── comparison-[PROTOCOL1]-vs-[PROTOCOL2].md
│       ├── experiments/                       # Detailed experiment data
│       │   └── artifacts/                     # Agent outputs
│       │       └── artifact-[task]-run-[N].md
│       └── verifications/                     # Protocol outputs
│           └── verify-[task]-run-[N].md
│
├── core/
│   ├── workflows/deep-verify/                  # Deep Verify protocols
│   │   ├── workflow-v5.md                     # NEW VERSIONS GO HERE
│   │   ├── workflow-v6.md
│   │   ├── workflow-v6.1.md
│   │   ├── workflow-v6.2.md
│   │   ├── workflow-v6.3.md
│   │   └── workflow-v6-lite.md
│   │
│   └── quality_gates/                          # Other protocols
│       ├── Tensor-Based-Verification-Protocol.md
│       ├── Quadrant-Verification-Protocol.md
│       └── Universal-Agent-Quality-Gate-Protocol.md
│
└── methods/
    └── methods.csv                             # Method database
```

### Version File Locations (IMPORTANT)

| Protocol Type | New Version Location |
|--------------|---------------------|
| Deep Verify | `src/core/workflows/deep-verify/workflow-v[X.Y].md` |
| Quality Gates | `src/core/quality_gates/[Protocol-Name]-v[N].md` |

**RULE: New protocol versions go in SAME directory as the original, NOT in testing/**

---

## Phase 8: Meta-Analysis (Periodic)

**Trigger:** After 3+ experiments OR when seeking radical improvements.

**Protocol:** Use `meta-analysis-protocol.md` with exploration methods.

### 8.1 Purpose

Go BEYOND incremental optimization to discover:
- Hidden patterns in test results
- Theoretical foundations for improvement
- Radical paradigm shifts
- Anti-patterns and harmful combinations

### 8.2 Methods Applied

| Method # | Name | Purpose |
|----------|------|---------|
| #23 | Analogical Reasoning | Find solutions from other domains |
| #46 | SCAMPER | Systematic innovation |
| #102 | Cantor's Diagonal Escape | Break out of current paradigm |
| #103 | Fourier Domain Shift | Reveal hidden patterns |
| #109 | Contraposition Inversion | Find guaranteed failure paths |
| #115 | Negative Space Cartography | Map unexplored options |
| #122 | Sorites Paradox | Find essential vs decorative elements |
| #123 | Newcomb's Paradox | Find surprising approaches |
| #124 | Braess Paradox | Check if additions help or hurt |

### 8.3 Execution

```markdown
## Meta-Analysis Execution

1. Collect all experiments from experiment-log.md
2. Track all changes between protocol versions
3. Apply exploration methods (meta-analysis-protocol.md)
4. Use execution template (meta-analysis-execution-template.md)
5. Generate:
   - DO recommendations (high confidence)
   - TRY experiments (needs validation)
   - AVOID anti-patterns (proven harmful)
   - INVESTIGATE areas (research directions)
6. Save to: src/testing/results/analysis/meta-analysis-[DATE].md
```

### 8.4 Output

```markdown
## Meta-Analysis Output

### Key Patterns Discovered
[What domain shifts revealed]

### Paradigm Escape Proposal
[N+1 approach that differs from all current]

### Optimization Targets
- CUT: [high-cost, low-value elements]
- EXPAND: [low-cost, high-value elements]

### Radical Proposals
[Surprising approaches worth testing]

### Anti-Patterns to Avoid
[Combinations/changes proven harmful]

### Theoretical Foundations
[Research directions for deeper optimization]
```

### 8.5 Feedback Loop (CRITICAL)

**Meta-analysis MUST feed back into protocols:**

```
Meta-Analysis Output → Protocol Evolution Input

1. DO recommendations → Immediate changes to next protocol version
2. TRY experiments → New experiment configurations in Phase 0
3. AVOID anti-patterns → Add to protocol-registry.md as warnings
4. INVESTIGATE areas → Add to research backlog
```

**Verification of feedback loop:**
- [ ] Each meta-analysis produces at least 1 actionable change
- [ ] Changes are tracked in Change Registry (Phase 1.2 of meta-analysis)
- [ ] Next experiment references meta-analysis findings

---

## Checklist Summary

### Per Experiment (All Required)
- [ ] Phase 0: Protocol and task selected, runs configured
- [ ] Phase 1: N agent runs with isolation verified
- [ ] Phase 2: N protocol runs with output captured
- [ ] Phase 3: Blind evaluation (normalize findings, match to ground truth)
- [ ] Phase 4: Universal metrics calculated
- [ ] Phase 5: Results logged
- [ ] Phase 6: (Optional) Cross-protocol comparison
- [ ] Phase 7: Decision on continue/stop/evolve
- [ ] Phase 8: (Periodic) Meta-Analysis with exploration methods
