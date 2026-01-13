# Testing Framework

**Purpose**: Framework for testing and comparing verification protocols.

---

## Quick Start

### Simplest Usage

```
Run verification protocol test.

PROCESS: workflow-v6.6.md
TASK: T3

Execute according to: src/testing/framework/universal-test-orchestrator.md
```

That's it. The agent will handle everything else.

---

## Directory Structure

```
src/testing/
├── framework/                    # Framework files
│   ├── prompt.md                 # TEST PROMPTS (START HERE)
│   ├── universal-test-orchestrator.md  # Main orchestrator (full instructions)
│   ├── universal-metrics.md      # All metric formulas + interpretation
│   ├── protocol-registry.md      # Protocol definitions
│   ├── AGENT-INSTRUCTIONS-UNIVERSAL.md  # Agent quick reference
│   ├── meta-analysis-protocol.md # Meta-analysis process
│   ├── method-matrix.md          # Methods reference
│   └── modification-operators.md # Evolution operators
│
├── tasks/                        # Test tasks
│   ├── trap-tasks.md             # Standard tasks T1-T10
│   ├── trap-tasks-v2.md          # Advanced tasks T11-T15
│   └── ground-truth.md           # Expected errors (CONFIDENTIAL)
│
└── results/                      # Output files
    ├── experiment-log.md         # All experiment results
    ├── experiments/artifacts/    # Agent-generated artifacts
    ├── verifications/            # Protocol verification outputs
    ├── comparisons/              # Protocol comparisons
    └── analysis/                 # Meta-analysis reports
```

---

## How to Run Tests

### Option 1: Simple Test

Use `prompt.md` - just specify process and task:

```
Run verification protocol test.

PROCESS: workflow-v6.6.md
TASK: T3

Execute according to: src/testing/framework/universal-test-orchestrator.md
```

### Option 2: Comparison

```
Run verification protocol test.

PROCESSES: workflow-v6.5.md, workflow-v6.6.md
TASK: T3

Execute according to: src/testing/framework/universal-test-orchestrator.md
Compare token economy and effectiveness.
```

---

## Available Processes

| Process | Path |
|---------|------|
| Deep Verify v6 | `src/core/workflows/deep-verify/workflow-v6.md` |
| Deep Verify v6.1 | `src/core/workflows/deep-verify/workflow-v6.1.md` |
| Deep Verify v6.2 | `src/core/workflows/deep-verify/workflow-v6.2.md` |
| Deep Verify v6.3 | `src/core/workflows/deep-verify/workflow-v6.3.md` |
| Deep Verify v6.5 | `src/core/workflows/deep-verify/workflow-v6.5.md` |
| Deep Verify v6.6 | `src/core/workflows/deep-verify/workflow-v6.6.md` |
| Tensor V-GD | `src/core/quality_gates/Tensor-Based-Verification-Protocol.md` |
| Quadrant QVP | `src/core/quality_gates/Quadrant-Verification-Protocol.md` |
| UAQG | `src/core/quality_gates/Universal-Agent-Quality-Gate-Protocol.md` |

---

## Available Tasks

| ID | Name | Difficulty |
|----|------|------------|
| T1 | Configuration Validator Module | Standard |
| T2 | Method Recommendation Engine | Standard |
| T3 | Session Memory Persistence | Standard |
| T4 | Workflow Orchestrator | Standard |
| T5 | Multi-Agent Collaboration Protocol | Standard |
| T6 | Verification Report Generator | Standard |
| T7 | Method Effectiveness Tracker | Standard |
| T8 | Incremental Verification System | Standard |
| T9 | Agent Self-Improvement Loop | Standard |
| T10 | Cross-Workflow Consistency Checker | Standard |
| T11-T15 | Advanced tasks | Advanced |

---

## What Gets Measured

### Detection Metrics
- **DR** - Detection Rate (%)
- **WDS** - Weighted Detection Score

### Economy Metrics
- **TE_econ** - Token Economy (value per token)
- **CPF** - Cost per Finding (tokens/finding)
- **PES** - Protocol Economy Score

### Effectiveness Metrics
- **DE** - Detection Effectiveness (%)
- **CEI** - Cost-Effectiveness Index
- **VPK** - Value per Kilotoken
- **EER** - Effectiveness-Economy Ratio

### Quality Metrics
- **P** - Precision
- **DQ** - Depth Quality
- **RS** - Run Stability

---

## Output

Results are saved to:
- `src/testing/results/experiment-log.md` - Main log with all metrics
- `src/testing/results/experiments/artifacts/` - Agent outputs
- `src/testing/results/verifications/` - Protocol outputs

Each experiment includes:
- Subagent Tracking Registry (agent IDs, tokens per agent)
- Token breakdown per process/task
- All metrics with mean and standard deviation
- Economy comparison (if multiple processes)

---

## Key Rules

1. **3 runs minimum** - For variance calculation
2. **Blind evaluation** - Describe findings BEFORE opening ground-truth.md
3. **Token tracking** - All subagent tokens collected from JSONL logs
4. **Process attribution** - Each token cost linked to specific process/task

---

## Files Reference

| File | Purpose | When to Use |
|------|---------|-------------|
| `prompt.md` | Test prompts to copy-paste | START HERE |
| `universal-test-orchestrator.md` | Full instructions | Agent reads this |
| `universal-metrics.md` | All formulas + interpretation | Agent reads this |
| `protocol-registry.md` | Protocol definitions | Agent reads this |
| `experiment-log.md` | Results | Check results here |
