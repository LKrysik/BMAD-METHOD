# Evolution Protocol: Comparative Process Improvement

**Version:** 1.0
**Purpose:** A rigorous mechanism to test, compare, and evolve verification processes (like `deep-verify`) to maximize quality and minimize cost.

---

## 1. Core Philosophy: The Hill-Climbing Algorithm

We do not "guess" if a process is better. We **measure** it using an A/B testing framework governed by a Hill-Climbing algorithm.

**The Function to Maximize:**
```
Score = (Quality_Points × 0.6) + (Efficiency_Points × 0.4)
```

Where:
*   **Quality_Points** = Weighted Detection Score (WDS) + Noise Reduction Bonus
*   **Efficiency_Points** = Cost Efficiency Index (CEI)

**The Rule:**
A new version (V_new) replaces the current version (V_current) **IF AND ONLY IF**:
`Score(V_new) > Score(V_current)` AND `WDS(V_new) >= WDS(V_current) - 5%`

(We accept a tiny drop in detection for massive efficiency gains, but never a collapse in quality.)

---

## 2. Metrics Definition

### 2.1 Quality Metrics

| Metric | Definition | Formula | Target |
|--------|------------|---------|--------|
| **WDS** | Weighted Detection Score | `(Σ(TP_critical × 3) + Σ(TP_important × 1)) / Max_Points` | > 80% |
| **Noise Ratio** | Signal-to-Noise | `FP / (TP + FP)` | < 10% |
| **Recall** | Coverage of known issues | `TP / (TP + FN)` | > 90% |

### 2.2 Efficiency Metrics

| Metric | Definition | Formula | Target |
|--------|------------|---------|--------|
| **CEI** | Cost Efficiency Index | `WDS_Points / (Tokens / 1000)` | Maximized |
| **TPT** | Tokens Per Trap | `Total_Tokens / Traps_Detected` | Minimized |
| **CPF** | Cost Per Finding | `Total_Cost_USD / Valid_Findings` | Minimized |

---

## 3. The Testing Mechanism (The Loop)

*Note: WDS and CEI metrics are currently calculated manually based on session logs and findings. Future versions will automate this.*

This loop is executed to evolve the process.

### Phase A: Benchmark (Control)
1.  Select **3 Trap Tasks** from `trap-tasks.md` (e.g., T1, T2, T3).
2.  Run `V_current` (e.g., v7.0) on these tasks.
3.  Calculate Baseline Metrics: `WDS_base`, `CEI_base`.

### Phase B: Experiment (Variant)
1.  Create `V_new` (e.g., v7.1) with a specific hypothesis (e.g., "Error Theory improves selection").
2.  Run `V_new` on the **SAME** 3 Trap Tasks.
3.  Calculate New Metrics: `WDS_new`, `CEI_new`.

### Phase C: Comparison & Decision
Compare the results using the **Evolution Dashboard**:

| Metric | V_current (Base) | V_new (Variant) | Delta | Significance |
|--------|------------------|-----------------|-------|--------------|
| WDS | 85.0 | 88.0 | +3.0 | IMPROVED |
| Tokens | 50k | 45k | -5k | IMPROVED |
| CEI | 1.7 | 1.95 | +0.25 | IMPROVED |

**Decision Matrix:**
*   **Green Light**: Improved Quality AND Efficiency → **PROMOTE** V_new to Stable.
*   **Yellow Light**: Improved Efficiency, same Quality → **PROMOTE**.
*   **Orange Light**: Improved Quality, worse Efficiency → **DEBATE** (Is the quality worth the cost?).
*   **Red Light**: Worse Quality → **REJECT**.

---

## 4. Execution Tools

### 4.1 Comparative Run Protocol
Use this prompt structure to run the comparison:

```markdown
# Comparative Run
**Task:** [Task ID]
**Agent A:** [Model] running [Process A]
**Agent B:** [Model] running [Process B]

**Instructions:**
1. Execute Process A on Task. Save log.
2. Clear context.
3. Execute Process B on Task. Save log.
4. Run `session_usage_analyzer.py` for both agents.
5. Compare findings against `ground-truth.md`.
```

### 4.2 Meta-Analysis of Evolution
Every 5 iterations, perform a "Meta-Evolution Check":
*   Are we optimizing locally but missing global improvements?
*   Apply **Method #102 (Cantor's Diagonal Escape)**: Create a process that differs from the last 5 successful versions to avoid stagnation.

---

## 5. Artifacts

*   **Evolution Log**: `src/testing/results/evolution-log.md` (Stores the history of A/B tests).
*   **Optimization Strategies**: `src/core/knowledge/optimization-strategies.md` (Stores the learnings from successful experiments).

---

## 6. How to Start a Cycle

To trigger an evolution cycle:
1.  **Identify a weakness** in V_current (e.g., "Misses logic errors").
2.  **Formulate a hypothesis** (e.g., "Adding Error Theory taxonomy will fix this").
3.  **Create V_new** (v7.1).
4.  **Execute Phase A & B**.
5.  **Evaluate and Merge**.
