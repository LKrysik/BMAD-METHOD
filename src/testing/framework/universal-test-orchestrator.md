# Universal Verification Protocol Test Orchestrator

**Version: 4.0 (Strict Compliance)**
**Purpose**: Test ANY verification protocol against standardized trap tasks with measurable metrics, **real token tracking**, and reproducible results.

---

## Critical Compliance Rules (BLOCKING)

These rules are **MANDATORY**. Violation invalidates the entire test run.

| Rule ID | Rule | Consequence of Violation |
|---------|------|--------------------------|
| R1 | Every subagent spawn MUST record Agent ID immediately | Cannot proceed to next step |
| R2 | Token data MUST come from `session_usage_analyzer.py` | Test results INVALID |
| R3 | All output files MUST include timestamp `_MMDDHHMM` | File will be rejected |
| R4 | Summary reports MUST use exact template structure | Report INVALID |
| R5 | Ground truth MUST NOT be accessible to subagents | Test contaminated |
| R6 | Section 4 MUST include Efficiency Metrics table with formulas | Report INCOMPLETE |
| R7 | Per-Agent Breakdown (Section 2.2) MUST have all token columns | Report INCOMPLETE |
| R8 | Section 2.4 MUST include Combined Per-Task Metrics (Tokens+Detection+Cost) | Report INCOMPLETE |
| R9 | Section 3 Detection Matrix MUST include Points and Cost/Point columns | Report INCOMPLETE |
| R10 | Section 4 MUST include Token Efficiency (DR%/K) with formula and summary | Report INCOMPLETE |

---

## Input Format

The orchestrator receives:

```
PROCESS: workflow-v7.4.1.md, workflow-v7.0.md
TASK: T15, T16, T17
```

**PROCESS** = List of workflow files from `src/core/workflows/deep-verify/`
**TASK** = List of task IDs (T1-T21) from `src/testing/tasks/trap-tasks.md`

---

## Directory Structure (Enforced)

```
src/testing/results/
├── experiments/
│   └── artifacts/                    # Trap artifacts (reusable)
│       └── artifact-t[N].md
├── agent_verbose/                    # Full subagent output (NEW)
│   └── [workflow-name]/
│       └── T[N]_MMDDHHMM.md          # Complete agent trace
├── verifications/                    # Processed verification results
│   └── [workflow-name]/
│       └── T[N]_MMDDHHMM.md          # Structured findings report
└── summaries/                        # Final comparison reports
    └── YYYYMMDD-[WF]-[Tasks]-RESULTS.md
```

---

## Phase 0: Initialization

### 0.1 Parse Input

```
INPUT: "PROCESS: workflow-v7.4.1.md, workflow-v7.0.md  TASK: T15, T16, T17"

PARSE:
  WORKFLOWS = ["workflow-v7.4.1", "workflow-v7.0"]
  TASKS = ["T15", "T16", "T17"]
  TIMESTAMP = current time as MMDDHHMM (e.g., "01161430")
```

### 0.2 Create Directories

For each workflow, ensure directories exist:
```bash
mkdir -p src/testing/results/agent_verbose/[workflow-name]/
mkdir -p src/testing/results/verifications/[workflow-name]/
```

### 0.3 Initialize Tracking Registry

Create in-memory registry (or temporary file):

```markdown
## SUBAGENT TRACKING REGISTRY

| Row | Workflow | Task | Agent_ID | Slug | Status | Verbose_File | Verification_File |
|-----|----------|------|----------|------|--------|--------------|-------------------|
| 1 | | | | | PLANNED | | |
```

**BLOCKING**: Cannot spawn subagent until row is added to registry.

---

## Phase 1: Artifact Check

For each TASK in TASKS:

1. Check: `src/testing/results/experiments/artifacts/artifact-t[N].md`
2. **IF EXISTS**: Continue
3. **IF MISSING**:
   - Spawn artifact generator subagent
   - Record Agent_ID in registry
   - Wait for completion
   - Verify artifact created

---

## Phase 2: Verification Execution (Per Workflow × Task)

For each combination of (WORKFLOW, TASK):

### 2.1 Pre-Spawn: Add Registry Row

```markdown
| [row] | [workflow] | T[N] | PENDING | | PLANNED | | |
```

### 2.2 Spawn Verification Subagent

**Prompt Template** (DO NOT modify):

```
You are a verification analyst. Execute the workflow protocol to verify an artifact.

INSTRUCTIONS:
1. Read workflow: src/core/workflows/deep-verify/[WORKFLOW].md
2. Read artifact: src/testing/results/experiments/artifacts/artifact-t[N].md
3. Execute ALL phases of the workflow, documenting each step
4. Log EVERY step showing how you apply the protocol to the artifact
5. Output COMPLETE trace of your verification process

CRITICAL RESTRICTIONS:
- Do NOT access src/testing/tasks/ directory
- Do NOT access ground-truth.md or trap-tasks.md

OUTPUT:
Write your complete verification to:
  src/testing/results/agent_verbose/[WORKFLOW]/T[N]_[TIMESTAMP].md

At the end, output a structured findings summary in this format:
---FINDINGS_START---
| ID | Severity | Type | Description |
|...
---FINDINGS_END---
```

### 2.3 Post-Spawn: Record Agent ID (BLOCKING)

**IMMEDIATELY** after Task tool returns:

1. Extract `agentId` from tool result (7-char hex, e.g., "a7eca85")
2. Extract `slug` from tool result (3-word name)
3. Update registry row:

```markdown
| [row] | [workflow] | T[N] | a7eca85 | humble-seeking-ritchie | RUNNING | T[N]_01161430.md | |
```

**IF Agent_ID not captured**: STOP. Do not spawn more agents. Debug.

### 2.4 Wait for Completion

Use `TaskOutput` tool to wait for subagent completion.

### 2.5 Post-Completion: Update Registry

```markdown
| [row] | [workflow] | T[N] | a7eca85 | humble-seeking-ritchie | COMPLETED | T[N]_01161430.md | T[N]_01161430.md |
```

### 2.6 Extract Findings

Read the verbose output file and extract the `---FINDINGS_START---` to `---FINDINGS_END---` block.

Save structured findings to:
`src/testing/results/verifications/[WORKFLOW]/T[N]_[TIMESTAMP].md`

---

## Phase 3: Token Collection (MANDATORY)

### 3.1 Find Session ID

```bash
ls -lt ~/.claude/projects/[encoded-path]/*.jsonl | head -1
```

Extract the UUID filename (most recent session).

### 3.2 Run Token Analyzer

```bash
python src/core/usage/session_usage_analyzer.py [SESSION_ID] \
  --base-dir ~/.claude/projects/[encoded-path] -v
```

### 3.3 Parse Output

The analyzer outputs:

```
[SUBAGENTS] (N agents)
  Agent: a7eca85
  Slug: humble-seeking-ritchie
  Model: claude-opus-4-5-20251101
    Input Tokens:        9
    Output Tokens:       7
    Cache Creation:      51,980
    Cache Read:          44,686
    ...
    Total Input:         96,675
    Total Tokens:        96,682
```

### 3.4 Map Agents to Registry

For each agent in analyzer output:
1. Find matching row in registry by Agent_ID
2. Add token data to that row

**Updated Registry**:

```markdown
| Row | Workflow | Task | Agent_ID | Slug | Input | Output | Cache_Create | Cache_Read | Total |
|-----|----------|------|----------|------|-------|--------|--------------|------------|-------|
| 1 | workflow-v7.4.1 | T15 | a7eca85 | humble-seeking-ritchie | 9 | 7 | 51980 | 44686 | 96682 |
```

### 3.5 Validation Checks

**REJECT test if any**:
- Token value contains `~` (approximate)
- Token value uses K/M suffix
- Agent_ID in registry not found in analyzer output
- Analyzer output agent not found in registry

---

## Phase 4: Ground Truth Evaluation

### 4.1 Load Ground Truth

Read `src/testing/tasks/ground-truth.md` for each task.

### 4.2 Compare Findings

For each expected error in ground truth:
- **FULL**: Exact or very close match to a finding
- **PARTIAL**: Related finding but not exact (severity reduced or root cause missed)
- **MISSED**: No corresponding finding

### 4.3 Calculate Metrics

Using formulas from `universal-metrics.md`:

```
DR = (Full + Partial×0.5) / Expected × 100
WDS = Σ(detected × severity_weight) / Σ(severity_weight) × 100
Points = Σ(severity_weight) for detected errors
```

---

## Phase 5: Summary Report Generation

### 5.1 Filename

```
src/testing/results/summaries/YYYYMMDD-[WF_SHORT]-[TASKS]-RESULTS.md
```

Example: `20260116-WFv741-T15T17-RESULTS.md`

### 5.2 Report Template (MANDATORY STRUCTURE)

```markdown
# Verification Test Report

- **Workflow:** [Full workflow filename]
- **Tasks:** [List]
- **Date:** [YYYY-MM-DD]
- **Executor:** Claude Opus 4.5 (Orchestrator + N Subagents)
- **Session ID:** [UUID from analyzer]

---

## 1. Subagent Tracking Registry

| Row | Workflow | Task | Agent_ID | Slug | Verbose_File | Verification_File |
|-----|----------|------|----------|------|--------------|-------------------|
| 1 | ... | ... | ... | ... | ... | ... |

---

## 2. Token Usage (from session_usage_analyzer.py)

### 2.1 Raw Analyzer Output

```
[PASTE COMPLETE OUTPUT FROM session_usage_analyzer.py HERE]
```

### 2.2 Per-Agent Breakdown

| Agent_ID | Task | Input | Output | Cache_Create | Cache_Read | Total | Cost_USD |
|----------|------|-------|--------|--------------|------------|-------|----------|
| a7eca85 | T15 | 9 | 7 | 51980 | 44686 | 96682 | $X.XX |

### 2.3 Totals

| Metric | Value |
|--------|-------|
| Total Tokens | [INTEGER] |
| Total Cost (USD) | $[DECIMAL] |
| Main Session Tokens | [INTEGER] |
| Subagent Tokens | [INTEGER] |

### 2.4 Combined Per-Task Metrics (MANDATORY)

**This table MUST combine token usage with detection metrics for each task.**

| Task | Level | Tokens | Cost_USD | Expected | Full | Partial | Missed | DR% | Points | Cost/Point |
|------|-------|--------|----------|----------|------|---------|--------|-----|--------|------------|
| T1 | V1 | X | $X.XX | X | X | X | X | X% | X.X | $X.XX |
| ... | | | | | | | | | | |
| **TOTAL** | - | **X** | **$X.XX** | **X** | **X** | **X** | **X** | **X%** | **X** | **$X.XX** |

**Aggregated by Difficulty Level (MANDATORY):**

| Level | Tasks | Tokens | Cost_USD | Expected | Full | Partial | Missed | DR% | Points | Cost/Point |
|-------|-------|--------|----------|----------|------|---------|--------|-----|--------|------------|
| V1 | X | X | $X.XX | X | X | X | X | X% | X.X | $X.XX |
| V2 | X | X | $X.XX | X | X | X | X | X% | X.X | $X.XX |
| V3 | X | X | $X.XX | X | X | X | X | X% | X.X | $X.XX |

---

## 3. Effectiveness Analysis

### 3.1 Detection Matrix

| Task | Expected | Full | Partial | Missed | DR% | Points | Cost_USD | Cost/Point |
|------|----------|------|---------|--------|-----|--------|----------|------------|
| T15 | 7 | 1 | 2 | 4 | 28.6% | 2.0 | $X.XX | $X.XX |
| ... | | | | | | | | |
| **TOTAL** | **X** | **X** | **X** | **X** | **X%** | **X** | **$X.XX** | **$X.XX** |

**Formulas:**
- `DR%` = (Full + Partial×0.5) / Expected × 100
- `Points` = Full×1 + Partial×0.5
- `Cost/Point` = Cost_USD / Points

### 3.2 Ground Truth Comparison

For each task, detailed comparison:

#### T15: [Task Name]

| GT_ID | Expected Error | Severity | Detected? | Finding_ID | Notes |
|-------|---------------|----------|-----------|------------|-------|
| T15-E1 | [Description] | CRITICAL | FULL | P1 | [Match evidence] |
| T15-E2 | [Description] | CRITICAL | MISSED | - | - |

---

## 4. Efficiency Metrics (MANDATORY)

**IMPORTANT**: This section MUST include the metrics table with explicit formulas and calculated values.
This enables cross-workflow comparison and validates test economics.

### 4.1 Core Metrics Table (REQUIRED FORMAT)

| Metric | Formula | Value |
|--------|---------|-------|
| Detection Rate (DR) | (Full + Partial×0.5) / Expected | (X + Y×0.5) / Z = **W%** |
| Points Earned | Full×1 + Partial×0.5 | X×1 + Y×0.5 = **Z** |
| Cost per Point | TC_USD / Points | $X.XX / Y = **$Z.ZZ** |
| Tokens per Point | Total_Tokens / Points | X / Y = **Z** |
| Cost per Detection | TC_USD / (Full+Partial) | $X.XX / Y = **$Z.ZZ** |
| Miss Rate | Missed / Expected | X / Y = **Z%** |
| **Token Efficiency (TE)** | DR% / (Avg_Tokens_per_Task / 1000) | W / (X / 1000) = **Y DR%/K** |

**Variables**:
- `TC_USD` = Total Cost from analyzer
- `Points` = Full detections × 1 + Partial detections × 0.5
- `Total_Tokens` = From analyzer output
- `Full` = Count of fully detected errors
- `Partial` = Count of partially detected errors
- `Expected` = Total expected errors from ground truth

### 4.2 Extended Analysis (OPTIONAL)

| Metric | Formula | Value |
|--------|---------|-------|
| Cost per Task | TC_USD / Task_Count | $X.XX |
| Tokens per Task | Total_Tokens / Task_Count | X |
| Subagent vs Main Ratio | Subagent_Tokens / Main_Tokens | X.XX |

### 4.3 Token Efficiency Summary (MANDATORY)

**Token Efficiency (TE)** measures detection capability per 1000 tokens consumed. Higher is better.

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  WORKFLOW [VERSION] - TOKEN EFFICIENCY SUMMARY                            ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  OVERALL TOKEN EFFICIENCY:  X.XXX DR%/K                                   ║
║  Formula: DR% / (Avg_Tokens_per_Task / 1000) = X / Y = Z                  ║
║                                                                           ║
║  BY DIFFICULTY LEVEL:                                                     ║
║  ├── V1: X.XXX DR%/K                                                      ║
║  ├── V2: X.XXX DR%/K                                                      ║
║  └── V3: X.XXX DR%/K                                                      ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### 4.4 Cross-Version Comparison (IF APPLICABLE)

| Workflow Version | Detection Rate | Cost/Point | Tokens/Point | Token Efficiency | Status |
|------------------|----------------|------------|--------------|------------------|--------|
| v6.x (baseline) | X% | $X.XX | X | X.XX DR%/K | Baseline |
| **vN.N (tested)** | **X%** | **$X.XX** | **X** | **X.XX DR%/K** | **Current** |

---

## 5. Process Observations

[Narrative: What worked, what didn't, recommendations]

---

## Appendix A: File Locations

| Type | Path |
|------|------|
| Workflow | src/core/workflows/deep-verify/[name].md |
| Artifacts | src/testing/results/experiments/artifacts/artifact-t[N].md |
| Verbose Logs | src/testing/results/agent_verbose/[workflow]/T[N]_MMDDHHMM.md |
| Verifications | src/testing/results/verifications/[workflow]/T[N]_MMDDHHMM.md |
| This Report | src/testing/results/summaries/[filename].md |
```

---

## Phase 6: Cleanup & Validation

### 6.1 File Existence Check

Verify all files exist:
- [ ] All verbose logs created
- [ ] All verification reports created
- [ ] Summary report created
- [ ] Token data is REAL (from analyzer)

### 6.2 Coherence Check

- [ ] Agent_IDs in report match analyzer output
- [ ] Timestamps in filenames are consistent
- [ ] Token totals match sum of per-agent totals

---

## Quick Reference Commands

**Find Session ID:**
```bash
ls -lt ~/.claude/projects/[path]/*.jsonl | head -1
```

**Run Token Analyzer:**
```bash
python src/core/usage/session_usage_analyzer.py [SESSION_ID] --base-dir ~/.claude/projects/[path] -v
```

**Generate Timestamp:**
```bash
date +%m%d%H%M
```

---

## Flowchart: Complete Process

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ORCHESTRATOR START                              │
│                   Input: PROCESS + TASK lists                           │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 0: INITIALIZATION                                                 │
│  • Parse PROCESS → WORKFLOWS list                                       │
│  • Parse TASK → TASKS list                                              │
│  • Generate TIMESTAMP (MMDDHHMM)                                        │
│  • Create directories                                                   │
│  • Initialize empty REGISTRY table                                      │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: ARTIFACT CHECK                                                 │
│  FOR each TASK:                                                         │
│    IF artifact-t[N].md missing → spawn generator → record Agent_ID      │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: VERIFICATION LOOP                                              │
│  FOR each (WORKFLOW, TASK):                                             │
│    ┌────────────────────────────────────────────────────────────────┐   │
│    │ 2.1 Add PLANNED row to REGISTRY                                │   │
│    │ 2.2 Spawn verification subagent (with prompt template)         │   │
│    │ 2.3 IMMEDIATELY record Agent_ID + Slug in REGISTRY ← BLOCKING  │   │
│    │ 2.4 Wait for completion (TaskOutput)                           │   │
│    │ 2.5 Update REGISTRY status → COMPLETED                         │   │
│    │ 2.6 Read verbose output, extract findings                      │   │
│    │ 2.7 Write structured verification file                         │   │
│    └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: TOKEN COLLECTION (MANDATORY)                                   │
│  3.1 Find session ID (ls -lt *.jsonl)                                   │
│  3.2 Run: python session_usage_analyzer.py [ID] --base-dir [path] -v    │
│  3.3 Parse analyzer output                                              │
│  3.4 Map each Agent_ID to REGISTRY row                                  │
│  3.5 VALIDATE: No estimates, no missing agents, totals match            │
│       IF validation fails → TEST INVALID                                │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: GROUND TRUTH EVALUATION                                        │
│  4.1 Load ground-truth.md                                               │
│  4.2 FOR each (WORKFLOW, TASK):                                         │
│        Compare findings vs expected errors                              │
│        Classify: FULL / PARTIAL / MISSED                                │
│  4.3 Calculate: DR, WDS, Points                                         │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: SUMMARY REPORT                                                 │
│  5.1 Generate filename: YYYYMMDD-[WF]-[Tasks]-RESULTS.md                │
│  5.2 Fill MANDATORY TEMPLATE (Section 2 = analyzer output)              │
│  5.3 Write to summaries/                                                │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 6: VALIDATION                                                     │
│  • All files exist?                                                     │
│  • Agent_IDs match between registry and analyzer?                       │
│  • Token totals correct?                                                │
│  • Report follows template?                                             │
│       IF any fail → FLAG for review                                     │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
                         [COMPLETE]
```

---

## Error Recovery

| Error | Detection | Recovery |
|-------|-----------|----------|
| Agent_ID not captured | Registry row has PENDING after spawn | Re-check Task tool output; if missing, restart subagent |
| Analyzer fails | Python error or empty output | Check path, session ID; do NOT proceed without real tokens |
| Subagent timeout | TaskOutput times out | Resume subagent or restart |
| File not created | Phase 6 check fails | Read subagent output manually; investigate |
| Token mismatch | Registry sum ≠ analyzer sum | Re-map agents; check for missed agents |

---

## Compliance Checklist (Run Before Finalizing)

- [ ] **R1**: Every subagent has Agent_ID in registry
- [ ] **R2**: Token data from session_usage_analyzer.py (not estimated)
- [ ] **R3**: All filenames include `_MMDDHHMM` timestamp
- [ ] **R4**: Summary report follows exact template structure
- [ ] **R5**: Subagents never accessed ground-truth.md
- [ ] **R6**: Section 4 Efficiency Metrics table includes formulas AND calculated values
- [ ] **R7**: Section 2.2 Per-Agent Breakdown has ALL columns: Agent_ID, Task, Input, Output, Cache_Create, Cache_Read, Total, Cost_USD
- [ ] **R8**: Registry Agent_IDs match analyzer output 1:1
- [ ] **R9**: Verbose logs saved to `agent_verbose/[workflow]/`
- [ ] **R10**: Verification files saved to `verifications/[workflow]/`
