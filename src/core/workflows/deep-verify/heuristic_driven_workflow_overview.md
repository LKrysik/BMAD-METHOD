# Operating Principles of Deep Verify v9.x (Heuristic-Driven Workflow)

## Core Philosophy: From Static Checklist to Intelligent Analysis

The new verification process abandons the idea of a static, one-size-fits-all workflow. Its fundamental premise is a two-phase approach that mimics the work of an expert: **first deeply understand, and only then precisely verify**.

The goal is to maximize efficiency by focusing the most powerful (and expensive) verification methods only on those areas identified as most risky.

---

## Phase 1: Heuristic Profiling (Deep Understanding)

This phase **does not seek flaws**. Its sole purpose is to build a multi-dimensional, in-depth "map" of the analyzed artifact. It is the heuristic engine of the entire process.

### How it Works
The process applies a dedicated set of **Heuristic Methods** to the artifact. These methods are designed for analysis from various perspectives:
-   **Purpose & Essence:** What is the fundamental purpose and logic of the artifact? (`#71`, `#107`)
-   **Structure & Logic:** What is the reasoning structure and linguistic consistency? (`#116`, `#100`)
-   **Assumptions & Risks:** What are the hidden assumptions and most likely failure scenarios? (`#78`, `#61`)

### What is the Output?
The output of this phase is the **"Heuristic Profile"**. This is not a simple list, but a rich document containing:
1.  **Artifact's Essence:** Its fundamental truth, purpose, and key trade-offs.
2.  **Logic & Concept Map:** Dependencies between claims and definitions of key terms.
3.  **Threat Model:** A list of hidden assumptions, potential failure scenarios, and the "attack surface."
4.  **Verification Vectors:** Precise guidance for the next phase, e.g., `Theoretical Vector` (signaling the need to check against scientific theorems) or `Resilience Vector` (indicating the most fragile elements).

---

## Phase 2: Adaptive Verification (Dynamic Verification)

This phase is the "surgical" arm of the process. Its goal is to **find critical flaws** in the most efficient way possible, based on the map provided by Phase 1.

### How it Works
The process analyzes the **"Heuristic Profile"**, and specifically the **"Verification Vectors"**, to **dynamically select** a small (e.g., 3-5), but extremely powerful subset of **Verification Methods**.

**This is the heart of the mechanism:**
-   If the `Theoretical Vector` in the profile is active, the process automatically selects methods like `#153 (Theoretical Impossibility Check)`.
-   If the `Resilience Vector` indicates fragile elements, the process employs `#130 (Assumption Torture)`.
-   If the `Security Vector` is active, methods like `#34 (Security Audit Personas)` and `#21 (Red Team vs Blue Team)` come into play.

### What is the Output?
The output is the final verification report, which contains a list of identified problems. Thanks to the precise guidance from Phase 1, the probability of finding significant, deep flaws is much higher than with random or static application of methods.

---

## Summary of Benefits

This heuristic model provides:
-   **Precision:** Verification methods are not applied "blindly" but are precisely targeted at the most promising areas.
-   **Efficiency:** It saves time and resources by avoiding the use of expensive methods where they are not needed.
-   **Depth of Analysis:** It forces a deep understanding of the artifact before its actual critique begins, leading to the discovery of more fundamental problems.
