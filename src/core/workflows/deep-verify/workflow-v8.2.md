# Deep Verify v8.2 - The Guillotine

**Philosophy:** "Surgical Precision, Decisive Action." This workflow refines v8.0's "Surgical Precision" by making the execution of Path B (the deep-dive for high-risk artifacts) dramatically cheaper and faster. It is designed based on empirical results from v8.0 and v8.1 testing, which showed that complex, iterative logic (v8.1) was less efficient than simple, decisive execution. v8.2 acts like a guillotine: it routes high-risk artifacts to a swift, sharp, and final analysis using only the most effective methods, eliminating costly procedural overhead.

---

## Methods Source
**CRITICAL:** All methods referenced by `#` are defined in the canonical file: `src/core/methods/methods.csv`. The agent executing this workflow MUST read and use the definitions from this file.
**CRITICAL:** All methods referenced by `method_scores.yam` are defined in the canonical file: `src/core/workflows/deep-verify/method_scores.yaml`. The agent executing this workflow MUST read and use the definitions from this file.


## Phase 0: Triage & Signature (Unchanged from V8.0)

**Goal:** Profile the artifact and extract its core "signature" in the most token-efficient way possible.

### 0.1: Unified Profile & Signature Extraction
- **Input:** Artifact (code, plan, spec, etc.)
- **Action:**
  1.  Classify artifact type (e.g., `code`, `spec`, `document`).
  2.  Assess Complexity Score (LOW, MEDIUM, HIGH).
  3.  Assess Criticality Score (LOW, MEDIUM, HIGH).
  4.  Identify primary domain(s) (e.g., `Cryptography`, `Distributed Systems`, `UI/UX`).
  5.  Extract core claims, tensions, and keywords to form the artifact's "Problem Signature."
- **Output:** A structured `Triage & Signature Checkpoint`.

---

## Phase 1: Threat Scan & Routing (Unchanged from V8.0)

**Goal:** Use the signature to detect "red flags" and route the artifact to the correct analysis path.

### 1.1: Risk Vector Calculation
- **Input:** `Triage & Signature Checkpoint`
- **Action:** Evaluate the signature against three critical risk vectors:
  1.  **THEORY_VIOLATION:** Does the artifact claim something known to be theoretically impossible (e.g., violating CAP theorem, Halting Problem, etc.)?
  2.  **CONTRADICTION:** Does the artifact contain internal definitional or logical contradictions (e.g., claiming A and NOT A)?
  3.  **SECURITY_CRITICAL:** Does the artifact handle security-critical functions (e.g., cryptography, authentication, access control)?
- **Output:** A set of triggered risk flags (e.g., `[THEORY_VIOLATION, SECURITY_CRITICAL]`).

### 1.2: Path Selection (Routing)
- **Input:** Triggered risk flags.
- **Action:** Apply routing logic:
  - **IF** any of `THEORY_VIOLATION`, `CONTRADICTION`, or `SECURITY_CRITICAL` flags are `Y`:
    - **ROUTE TO: Path B (The Guillotine)**
  - **ELSE:**
    - **ROUTE TO: Path A (Lean Verification)**
- **Output:** A routing decision (`Path A` or `Path B`).

---

## Phase 2: Adaptive Response (Execution)

### PATH A: Lean Verification (Unchanged from V8.0)

**Goal:** Provide a good-enough verification for low-risk artifacts with minimal cost.
- **Action:** Execute the "Lean Verification" method cluster:
  - `#81 Scope Integrity Audit`
  - `#84 Coherence Check`
  - `#83 Closure Check`
  - **IF** `HIGH_COMPLEXITY=Y`, also run `#78 Assumption Excavation`.

### **PATH B: The Guillotine (NEW in V8.2)**

**Goal:** Apply a swift, decisive, and cost-effective deep-dive analysis on high-risk artifacts.

#### 2.1: Prioritize and Select

- **Input:** The set of triggered risk flags from Phase 1.
- **Action:**
  1.  **Prioritize Flags:** Order the triggered flags according to a fixed priority:
      1.  `THEORY_VIOLATION` (Most severe)
      2.  `SECURITY_CRITICAL`
      3.  `CONTRADICTION`
  2.  **Select ONE Flag:** Take only the **highest-priority** triggered flag for analysis. Discard the rest.
  3.  **Select Attack Cluster:** Choose the corresponding attack cluster for the selected flag (e.g., "Theoretical Attack Cluster" for `THEORY_VIOLATION`).

#### 2.2: Execute Decisive Strike

- **Input:** The selected attack cluster.
- **Action:**
  1.  **Load Scores:** Consult `method_scores.yaml` to get the effectiveness scores for the artifact type.
  2.  **Sort Cluster:** Sort the methods in the cluster by score in descending order.
  3.  **Execute Top 2:** Execute only the **top two (2)** highest-scoring methods from the sorted cluster.
- **Rationale:** Analysis of v8.0 and v8.1 test data shows that the highest-scoring methods in a relevant cluster are sufficient to find the most critical issues. Running more methods yields diminishing returns at a high token cost. This fixed, two-method strike is the core of the "Guillotine" efficiency gain. It is simple, non-iterative, and predictable in cost.

---

## Phase 3: Report & Learn (Unchanged from V8.0)

**Goal:** Synthesize findings and extract learning for future improvement.

### 3.1: Generate Report
- **Action:** Consolidate all findings from the executed methods, categorize by severity, and produce a final verification report with a verdict (`PASS`, `PASS WITH FINDINGS`, `NEEDS REVISION`).

### 3.2: Learning Extraction (#150)
- **Action:** For each method used, calculate its `session_precision` (1.0 if it produced findings, 0.0 otherwise).
- **Output:** A recommendation to update `method_scores.yaml` with the new precision scores, refining the system for future runs.
