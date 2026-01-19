# Deep Verify V9.2 - Adaptive, Domain-Aware Workflow

## Philosophy

This workflow evolves the Deep Verify process from a linear, "one-size-fits-all" model to a dynamic, adaptive, and domain-aware methodology. It replaces a fixed initial heuristic analysis with a **Domain Triage** phase that customizes the entire verification process based on the artifact's specific subject matter. The goal is to move beyond purely logical validation and effectively challenge artifacts in their specific area of expertise (e.g., medicine, cryptography, law).

-   **Adaptive:** The process is not fixed. It first identifies the artifact's knowledge domain and then assembles a custom toolkit of the most relevant heuristic and verification methods.
-   **Domain-Aware:** The workflow explicitly acknowledges that different domains have different failure modes, theoretical limits, and regulatory requirements. It leverages methods designed to activate this specialized knowledge.
-   **Efficient:** It retains the aggressive "Early Exit" protocol, ensuring that once a critical flaw is found (whether logical or domain-specific), the process halts to conserve resources.

---

## Phase 0: Self-Check

**Goal:** Establish honesty and awareness of potential biases before starting the analysis.

### Step 0.1: Self-Check
Execute **#113 Counterfactual Self-Incrimination**, **#131 Observer Paradox**, and **#132 Goodhart's Law Check** to ensure verifier honesty and focus.

---

## Phase 1: Domain Triage

**Goal:** To identify the primary and secondary knowledge domains required to competently verify the artifact. This is the first and most critical decision point in the workflow.

### Step 1.1: Keyword & Pattern Analysis
Scan the artifact for "domain signals"—keywords, acronyms, and patterns that suggest a required area of expertise.

-   **Medical/Statistical Signals:** `FDA`, `patient`, `sensitivity`, `specificity`, `HIPAA`, `clinical trial`, `PPV`, `base rate`.
-   **Cryptographic Signals:** `PFS`, `encryption`, `quantum-resistant`, `key`, `hash`, `cipher`, `ZK-proof`.
-   **Distributed Systems Signals:** `consensus`, `asynchronous`, `partition`, `CAP`, `FLP`, `fault-tolerant`, `Byzantine`.
-   **Legal Signals:** `liability`, `jurisdiction`, `contract`, `compliance`, `UPL`, `indemnify`.
-   **Financial Signals:** `VaR`, `tail risk`, `Basel`, `correlation`, `black swan`.

### Step 1.2: Domain Declaration
Conclude the phase with an explicit declaration of the identified domains. This declaration determines the path for the rest of the verification process.

**Output Example:** `Identified Domains: [MEDICAL, STATISTICS, LEGAL]`

---

## Phase 2: Dynamic Toolkit Loading

**Goal:** To assemble a custom set of Heuristic and Verification methods based on the domains identified in Phase 1.

### Step 2.1: Domain-Mapped Method Selection
Based on the `Identified Domains`, select the most potent methods from the full catalog. General-purpose logical methods should be combined with domain-specific ones.

**Example Mapping for `[MEDICAL, STATISTICS]`:**

-   **Heuristics to Load:**
    -   `#78 Assumption Excavation`: To question assumptions about patient data and device accuracy.
    -   `#20 Bayesian Updating`: To prime the analysis for statistical claims.
    -   `#107 Aristotle's Four Causes`: To deeply analyze the system's ultimate purpose and intended use.
-   **Verification Methods to Load:**
    -   **`#156 Domain Expert Activation`**: **(KEY METHOD)** To be invoked with `[MEDICAL, STATISTICS]` parameters. This loads knowledge about:
        -   The Base Rate Fallacy and its effect on diagnostic tests.
        -   FDA regulatory pathways (e.g., Class III device requirements).
        -   Common failure modes in clinical decision support systems.
    -   **`#153 Theoretical Impossibility Check`**: To challenge if the claimed sensitivity/specificity is mathematically achievable given the prevalence of rare diseases.
    -   **`#154 Definitional Contradiction Detector`**: (General Purpose) To find internal logical conflicts, such as "continuous learning" vs. "deterministic".

**Output:** A `Custom Verification Toolkit` containing the tailored list of methods for the next phase.

---

## Phase 3: Targeted Verification

**Goal:** To execute the custom-selected verification methods to find deep logical and domain-specific flaws.

### Step 3.1: Execute Custom Toolkit
Execute the methods from the `Custom Verification Toolkit` in sequence, from highest to lowest expected impact. The application of each method is now guided by a specific, domain-aware purpose.

### Step 3.2: Early Exit Protocol
**This is the core "Przerwij" (Interrupt) step.**

**RULE:** After **each** method is executed in Step 3.1:
1.  Review the finding(s).
2.  If any finding is determined to be **🔴 CRITICAL** with **High Confidence (>85%)**:
    -   **HALT** the verification process immediately.
    -   Proceed directly to Phase 4 (Report).
    -   Do NOT execute any further methods.

This ensures maximum token efficiency by stopping as soon as a fatal flaw—be it logical or domain-specific—is confirmed.

---

## Phase 4: Report Generation

**Goal:** Consolidate findings and provide a clear, actionable verdict.

### Step 4.1: Final Report
1.  State the **Identified Domains** from Phase 1.
2.  Summarize the key findings from the verification, noting which method found them.
3.  If an Early Exit was triggered, explicitly state which finding caused it.
4.  Provide a final verdict (e.g., "NEEDS REVISION", "PASS WITH CAVEATS").
5.  List clear, actionable recommendations that address both logical and domain-specific issues.