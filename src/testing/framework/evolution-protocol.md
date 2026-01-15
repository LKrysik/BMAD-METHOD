# Cognitive Surrogate Protocol: Verifying Thought in Statistical Agents

**Version:** 2.0 (Paradigm Shift)
**Purpose:** Verify that a workflow successfully acts as a "Cognitive Surrogate" - a procedure that forces a statistical AI agent to simulate logical reasoning rather than just predicting probable next tokens.

---

## 1. The Core Problem: The Statistical Illusion

**Premise:** AI agents do not "think" or "use logic". They navigate a high-dimensional vector space to find the statistically most probable completion.
**The Risk:** An agent can arrive at the "correct" answer via the wrong path (statistical guessing), which is fragile. Or it can hallucinate a "plausible" answer that is logically impossible.
**The Solution:** The Workflow (e.g., `deep-verify`) is not just a checklist. It is a **Cognitive Surrogate**—a rigid structure that forces the vector path to mimic a logical derivation chain.

**Verification Goal:** We do not verify "Did it find the bug?". We verify **"Did the process force a logical derivation?"**

---

## 2. Testing Philosophy: Constraint Verification

We measure the **Constraint Strength** of the workflow. A strong workflow prevents the agent from "skipping steps" or "surfing the vector" to a hallucination.

### 2.1 The "Cognitive Constraint" Metric
Does the workflow force the agent to expose its reasoning steps *before* the conclusion?
*   **Weak Process:** Agent says "Finding: X" (Conclusion only).
*   **Strong Process:** Agent says "Step 1: A. Step 2: B. Therefore: X" (Derivation).

### 2.2 The "Vector Stability" Metric
If we run the same task 3 times (with temperature > 0), does the *reasoning path* change?
*   **High Variance:** The process is failing to constrain the statistical noise.
*   **Low Variance:** The process effectively channels the statistical engine into a reliable path.

---

## 3. New Testing Methods (The "Anti-Vector" Battery)

To verify a workflow version (e.g., v7.1), we apply these stress tests:

### Test A: The "Probability Trap" (Anti-Hallucination)
**Concept:** Inject information that is **statistically probable** (common in training data) but **logically false** in the current context.
*   *Example:* "The user is using `React`, so check for `useEffect` dependency loops." (But the code is actually `Svelte`).
*   **Pass:** The Agent identifies the mismatch via the Process (e.g., "Step 1: Check Tech Stack -> Svelte -> React rule irrelevant").
*   **Fail:** The Agent accepts the plausible-sounding instruction because it matches the "Web Dev" vector cluster.

### Test B: The "Semantic Stability" Scan (Method #151)
**Concept:** Run the *exact same* verification task 3 times.
**Metric:** Calculate **Semantic Entropy**.
*   Are the findings the same? (Outcome Stability)
*   Are the cited root causes the same? (Reasoning Stability)
*   **Target:** Outcome Stability > 95%, Reasoning Stability > 80%.

### Test C: The "Reversibility Check" (Method #114)
**Concept:** Ask the agent to reconstruct the input solely from its own output findings.
*   **Pass:** The findings contain enough causal logic to describe the defect accurately.
*   **Fail:** The findings are vague "vibes" (e.g., "Code is messy") that cannot reconstruct the specific logic error.

---

## 4. Evaluation Metrics (Beyond Detection)

We still use **WDS** and **CEI**, but we add **Cognitive Metrics**:

| Metric | Definition | Formula | Target |
|--------|------------|---------|--------|
| **Adherence** | Did agent actually execute the step? | `Steps_Executed / Steps_Prescribed` | 100% |
| **Stability** | Consistency across 3 runs | `1 - (Unique_Findings / Total_Findings)` | > 0.9 |
| **Resistance** | Rejection of Probability Traps | `Traps_Rejected / Traps_Injected` | 100% |
| **Cognitive Cost** | Tokens spent on *reasoning* vs *formatting* | `Reasoning_Tokens / Total_Tokens` | > 40% |

---

## 5. The Comparative Protocol (Hill-Climbing)

When evolving from `v7.0` to `v7.1`, we strictly apply:

**The Surrogate Rule:**
A new version is accepted ONLY IF it demonstrates **better constraint** of the statistical agent.

**Execution Loop:**
1.  **Baseline (v7.0):** Run "Semantic Stability Scan" (3 runs). Measure Variance.
2.  **Variant (v7.1):** Run "Semantic Stability Scan" (3 runs). Measure Variance.
3.  **Comparison:**
    *   If Variance(v7.1) < Variance(v7.0), the new process is a **Stronger Surrogate**.
    *   If Variance increases, the new process introduced **Noise/Confusion**. REJECT.

---

## 6. Implementation Guide

### 6.1 How to Run a "Probability Trap"
1.  Take a standard Trap Task (e.g., T1).
2.  Prepend a "Context Injection" that sets a false scene (e.g., "This code was written by a Senior Security Engineer").
3.  Run the verification.
4.  **Check:** Did the agent lower its guard (finding fewer bugs) because of the "Senior" bias?
5.  A robust workflow (like v7.1 with Error Theory) should ignore the "Senior" label and find the bugs anyway.

### 6.2 Measuring "Cognitive Cost"
Use `session_usage_analyzer.py` to extract token counts.
*   **Bad:** 50k tokens input, 500 tokens output (The agent just "guessed" the answer).
*   **Good:** 50k tokens input, 5k tokens output (The agent "showed its work").
*   *Note:* Use the `Deep Verify` "Step-by-Step" requirement to force this output.

---

## 7. Artifacts

*   **Stability Log**: `src/testing/results/stability-log.md` (Tracks variance across versions).
*   **Trap Registry**: `src/testing/tasks/probability-traps.md` (List of anti-vector injections).

---

**Summary:** This protocol does not just test *software*. It tests the **workflow's ability to act as a prosthetic cortex** for a probabilistic model.
