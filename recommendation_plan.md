# Recommendation Plan

## Method #11: Tree of Thoughts (Path Evaluation)

**Goal**: Determine the best path forward to surpass V7.0 performance.
**Problem**: V7.0 is best. V8.x regressed. User asks: "Error Theory" or "Predefined Methods"?

### Root Node: How to improve upon V7.0?

#### Branch A: Introduce "Error Theory" (Systematic Classification)
*   **Concept**: Integrate a formal taxonomy of errors (e.g., from software engineering literature, formal methods) into the "Innate" and "Adaptive" layers.
*   **Pros**:
    *   **Completeness**: Ensures we look for *all* known types of errors, not just what the LLM hallucinates.
    *   **Standardization**: Makes findings more comparable across runs.
    *   **Training**: Helps the "Learning Layer" (from V7) categorize findings better.
*   **Cons**:
    *   **Rigidity**: Might make the system too bureaucratic (checking boxes instead of thinking).
    *   **Token Cost**: Injecting a massive error taxonomy into the context window is expensive.
*   **Fit with V7**: High. V7's "Layer 3 (Memory)" needs a vocabulary to store what it learned. Error Theory provides that vocabulary.

#### Branch B: Introduce "Predefined Methods" (Hardcoded Maps)
*   **Concept**: Map specific problem types (e.g., "Crypto Protocol") to specific Method IDs (e.g., "#153 Theoretical Impossibility") rigidly.
*   **Pros**:
    *   **Reliability**: Guarantees that the "right" method is always used for the "right" problem.
    *   **Simplicity**: Reduces the cognitive load of "Method Selection" (Phase 3 in V7).
*   **Cons**:
    *   **Brittle**: If a problem is slightly novel, the predefined map fails (General vs Specific problem).
    *   **Regression Risk**: This sounds like V6 (Fixed Lists) or V8 (Simplified), which we already know are inferior to V7's adaptive approach.
*   **Fit with V7**: Low. V7's core innovation was *Dynamic* selection. Going back to predefined lists fights the architecture.

#### Branch C: Hybrid - "Seeded Adaptation" (Winner)
*   **Concept**: Use "Error Theory" to *seed* the Dynamic Selection. Don't force methods, but use the Error Taxonomy to *weigh* methods during V7's Phase 3.1 (Relevance Scoring).
*   **Mechanism**:
    1.  Define a lightweight "Error Taxonomy" (e.g., 10 core categories).
    2.  Tag each Method in `methods.csv` with these categories.
    3.  In V7 Phase 3, boost the score of methods that cover categories relevant to the artifact's domain.

### Evaluation
*   **Path A (Error Theory)** is a strong addition to the *content* of the analysis.
*   **Path B (Predefined Methods)** is a regression in *process* (back to static).
*   **Recommendation**: **Enhance V7.0 with Error Theory**. Do not revert to Predefined Methods.

---

## Synthesis & Recommendation

**Diagnosis**:
1.  **V7.0 is the peak** because it mimics a biological immune system (Innate + Adaptive + Memory).
2.  **V8.x failed** because it lobotomized the "Adaptive" and "Memory" parts in favor of simplicity.
3.  **The User's Question**: "Error Theory" is the correct next step. "Predefined Methods" is a trap (regression to V6).

**Concrete Plan: Create `workflow-v9.0.md`**
Based on V7.0 (NOT V8.1), with the following upgrades:

1.  **Integrate Error Theory**:
    *   Add a **"Taxonomy Scan"** in Phase 1 (Innate).
    *   Use a standardized list of error types (Logic, Security, Completeness, etc.) to tag findings.
2.  **Refine the Learning Loop**:
    *   V7's memory was theoretical. We should make it concrete by defining a "Knowledge Injection" slot where the agent reads `optimization-strategies.md` or similar.
3.  **Optimize Token Usage (The V8 goal, but done right)**:
    *   Instead of cutting phases (V8 approach), cut *verbosity*. Use tighter prompts within the V7 structure.
4.  **Fix the "Godel Gap"**:
    *   Explicitly acknowledge what cannot be tested (from our Framework Analysis) in the final output.

### Next Step
I recommend creating `src/core/workflows/deep-verify/workflow-v9.0.md` which is a **fork of V7.0**, incorporating "Error Theory" as a guiding principle for the Adaptive Layer.
