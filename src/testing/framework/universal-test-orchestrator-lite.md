# Universal Verification Protocol Test Orchestrator - LITE

**Version: 1.0 (Lite)**
**Focus:** Token Efficiency & Rapid Iteration
**Cost Reduction Goal:** ~60% vs Standard Orchestrator

---

## Quick Start

This LITE orchestrator is designed for **routine checks**, **debugging**, and **cost-sensitive** verification. For formal academic validation or release certification, use the standard `universal-test-orchestrator.md`.

### The Core Loop (Compressed)

1. **Check Artifact** (Reuse if exists)
2. **Run Protocol** (1 Run by default)
3. **Measure Tokens** (Run script once)
4. **Log Results** (Brief summary)

---

## Phase 1: Setup & Artifact

**Step 1.1: Configuration**
- **Protocol:** `DV-V7.X` (or other)
- **Task:** `T[N]` from `trap-tasks.md`
- **Runs:** 1 (Default)

**Step 1.2: Artifact Logic**
Check `src/testing/results/experiments/artifacts/artifact-t[N].md`.

- **IF EXISTS:** USE IT. Skip generation.
- **IF MISSING:** Spawn **ONE** subagent to generate it.
  - Task: "Execute Task T[N] from trap-tasks.md"
  - Output: Save to `artifact-t[N].md`

---

## Phase 2: Protocol Execution

Spawn **ONE** subagent to run the verification protocol.

**Instructions for Subagent:**
1. **Read Protocol:** Load `src/core/workflows/deep-verify/workflow-v[X].md`.
2. **Read Artifact:** Load `src/testing/results/experiments/artifacts/artifact-t[N].md`.
3. **Execute:** Follow protocol steps on the artifact.
4. **Output:** Generate verification report. Save to `src/testing/results/verifications/verify-[task]-run-1.md`.

---

## Phase 3: Cost Measurement (Mandatory)

**Do NOT manually track tokens.** Use the analyzer.

**Command:**
```bash
python src/core/usage/session_usage_analyzer.py [SESSION_ID] --base-dir ~/.claude/projects/[encoded-path]
```

**Action:**
1. Run command.
2. Locate the Agent ID for your subagent in the output.
3. Record `Total` tokens and `Cost`.

---

## Phase 4: Evaluation & Logging

**Step 4.1: Blind Check**
- List findings from Phase 2 output.
- Compare with `src/testing/tasks/ground-truth.md`.
- Count: **Detected** vs **Expected**.

**Step 4.2: Log Entry (Append to experiment-log.md)**

```markdown
| LITE | [Date] | [Protocol] | [Task] | DR: [X]% | Cost: $[X] | Tokens: [N] |
```

---

## Optimization Rules (Read Carefully)

1. **No Redundancy:** Do not re-state the task or protocol in chat. Reference files.
2. **No Manual Registry:** Do not build the markdown registry table. Just run the python script.
3. **Reference Context:** When invoking subagents, tell them to "Read file X" rather than pasting the content of file X into the prompt, if possible.
4. **Single-Pass:** Unless variance is suspected, 1 run is sufficient for checking code logic.

---

## Comparison: Standard vs Lite

| Feature | Standard Orchestrator | Lite Orchestrator |
|---------|-----------------------|-------------------|
| **Runs** | 3 (Mandatory) | 1 (Default) |
| **Artifacts** | Regeneration common | Strict Reuse |
| **Tracking** | Manual Registry Table | Script Output Only |
| **Logging** | Full Detailed Entry | One-Line Summary |
| **Cost** | $$$ (High) | $ (Low) |
| **Use Case** | Formal Experiments | Dev/Debug/Quick Check |
