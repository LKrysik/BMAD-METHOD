# Universal Verification Protocol Test Orchestrator

**Version: 3.0 (Optimized)**
**Purpose**: Test ANY verification protocol against standardized trap tasks with measurable metrics and token economy tracking.

---

## Supported Protocols

| Protocol ID | Name | File | Output Type |
|-------------|------|------|-------------|
| `DV-V7.1` | Deep Verify V7.1 | `workflow-v7.1.md` | Phases + Findings |
| `DV-V7.2` | Deep Verify V7.2 | `workflow-v7.2.md` | Phases + Findings |
| `DV-V7.3` | Deep Verify V7.3 | `workflow-v7.3.md` | Phases + Findings |
| `DV-V7.4` | Deep Verify V7.4 | `workflow-v7.4.md` | Phases + Findings |

---

## Phase 0: Configuration & Artifacts

### 0.1 Setup
1. **Select Protocol:** Choose file (e.g., `workflow-v7.4.md`).
2. **Select Task:** Choose task T[N] from `trap-tasks.md`.
3. **Configure Runs:** Default N=3 (Standard) or N=1 (Quick Check).

### 0.2 Artifact Logic (Cost Optimization)
**Rule:** Always reuse existing artifacts if available.

1. Check `src/testing/results/experiments/artifacts/artifact-t[N].md`.
2. **IF EXISTS:** Use it. Skip generation.
3. **IF MISSING:** Spawn **ONE** subagent to generate it using the prompt from `trap-tasks.md`.

---

## Phase 1: Protocol Execution

Execute the verification protocol via subagents. The results of the verification are considered permanent artifacts and should not be deleted.

### Prompting Strategy (Cost Saving & Detailed Logging)
- Do NOT paste the protocol text into the prompt.
- Instruct the subagent to `read_file` the protocol and artifact.
- **Instruction:** "Read `src/core/workflows/deep-verify/workflow-v[X].md` and verify `src/testing/results/experiments/artifacts/artifact-t[N].md`. **Log every step of your execution of the workflow, showing how you are applying the protocol to the artifact. The final output should be a complete trace of your verification process, including all phases of the workflow.**"

### Execution Loop & Output Management
1.  **Create Directory:** Before execution, create a directory for the results named after the protocol file (e.g., `workflow-v7-0` from `workflow-v7.0.md`). All results will be stored here.
2.  **Generate Timestamp:** Get the current time in `mmddhhmm` format.
3.  **Execute and Save:**
    -   Spawn Subagent 1 → Save output to `[protocol-folder]/verify-[task]_[timestamp].md`


---

## Phase 2: Token Measurement (Automated)

**CRITICAL:** Do not manually track tokens. Use the script.

**Action:**
1. Run `python src/core/usage/session_usage_analyzer.py [SESSION_ID] --base-dir ~/.claude/projects/[encoded-path]`
2. The script outputs a table of all subagents.
3. **Copy the script output** directly into the final log.

---

## Phase 3: Blind Evaluation

1. **Normalize:** Extract findings from verification reports.
2. **Assess:** Compare findings against `src/testing/tasks/ground-truth.md`.
3. **Score:** Count detected vs. expected errors.

---

## Phase 4: Metrics & Logging

### 4.1 Metrics Calculation
Calculate:
- **DR (Detection Rate):** Detected / Expected %
- **Cost:** Total tokens from Phase 2 script.
- **Efficiency:** Cost / Findings.

### 4.2 Experiment Log Entry
Append to `src/testing/results/experiment-log.md`:

```markdown
## Experiment EXP-[YYYY-MM-DD]-[NNN]

- **Protocol:** [ID]
- **Task:** T[N]
- **Date:** [ISO Date]

### Results
| Metric | Value |
|--------|-------|
| DR | [X]% |
| Total Tokens | [N] |
| Cost (USD) | $[N] |

### Token Data
[Paste output from session_usage_analyzer.py here]

### Findings Analysis
- Detected: [List IDs]
- Missed: [List IDs]
```

---

## Phase 5: Advanced & Meta-Analysis

For cross-protocol comparison or protocol evolution (Meta-Analysis), refer to:
- `src/testing/framework/meta-analysis-protocol.md`
- `src/testing/results/comparisons/`

---

## Compliance & Constraints

1. **Reference, Don't Paste:** Use file paths in prompts to save context.
2. **Real Data Only:** Never estimate token counts. Use the script.
3. **Isolation:** Subagents must not access `ground-truth.md`.
4. **One-Way Flow:** Do not feed verification results back into generation.

---

## Quick Reference Commands

**Find Session ID:**
`ls -lt ~/.claude/projects/[encoded-path]/ | head -5` (Look for UUID)

**Run Analyzer:**
`python src/core/usage/session_usage_analyzer.py [SESSION_ID] --base-dir ~/.claude/projects/[encoded-path]`

**New Experiment:**
`Log new experiment in experiment-log.md before starting.`
