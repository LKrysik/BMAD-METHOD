# Test Prompts

Copy and paste the appropriate prompt, filling in values in brackets.

---

## Single Process Test

```
Run verification protocol test.

PROCESS: [FILENAME.md]
TASK: T[N]

Execute according to: src/testing/framework/universal-test-orchestrator.md
```

---

## Multiple Processes Comparison

```
Run verification protocol test.

PROCESSES: [PROCESS1.md], [PROCESS2.md], [PROCESS3.md]
TASK: T[N]

Execute according to: src/testing/framework/universal-test-orchestrator.md
Compare token economy and effectiveness across all processes.
```

---

## Multi-Task Test

```
Run verification protocol test.

PROCESS: [FILENAME.md]
TASKS: T[N], T[M], T[K]

Execute according to: src/testing/framework/universal-test-orchestrator.md
```

---

## Meta-Analysis

After 3+ experiments, run meta-analysis:

```
Execute meta-analysis of test results.

Read files:
1. src/testing/framework/meta-analysis-protocol.md
2. src/testing/framework/meta-analysis-execution-template.md
3. src/testing/results/experiment-log.md
4. src/core/methods/methods.csv

Apply exploration methods and generate DO/TRY/AVOID/INVESTIGATE recommendations.
Save to: src/testing/results/analysis/meta-analysis-[YYYY-MM-DD].md
```

---

## Available Processes

| Short Name | Path |
|------------|------|
| workflow-v6.md | src/core/workflows/deep-verify/workflow-v6.md |
| workflow-v6.5.md | src/core/workflows/deep-verify/workflow-v6.5.md |
| workflow-v6.6.md | src/core/workflows/deep-verify/workflow-v6.6.md |
| Tensor-VGD | src/core/quality_gates/Tensor-Based-Verification-Protocol.md |
| Quadrant-QVP | src/core/quality_gates/Quadrant-Verification-Protocol.md |
| UAQG | src/core/quality_gates/Universal-Agent-Quality-Gate-Protocol.md |

## Available Tasks

T1-T10: Standard tasks (see trap-tasks.md)
T11-T15: Advanced tasks (see trap-tasks-v2.md)

---

## Reference

- Full instructions: `universal-test-orchestrator.md`
- Metrics & interpretation: `universal-metrics.md`
- Protocol definitions: `protocol-registry.md`
