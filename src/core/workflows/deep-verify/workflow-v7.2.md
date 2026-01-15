# Deep Verify V7.2 - Context-Aware Verification System

## Overview
**Deep Verify V7.2** is a meta-cognitive workflow that prioritizes **Understanding** over **Pattern Matching**. It uses Aristotle's Four Causes to diagnose the artifact's nature before selecting a verification strategy.

**Best for:** General-purpose agents, mixed-domain artifacts, novel problems where standard "security/logic" categories might not apply.

---

**Methods source:** `src/core/methods/methods.csv`

---

## Phase 0: Ontology Scan (Method #107)

**Goal:** Understand the artifact's fundamental nature.

### Step 0.1: Four Causes Analysis
Analyze the artifact and user request to determine:

1.  **Material Cause:** What is it made of? (Code, Prose, Data, Mathematical Proof)
2.  **Formal Cause:** What is its form/structure? (Function, Essay, Table, Graph)
3.  **Efficient Cause:** What are the constraints/context? (Time limit, Legacy system, Strict typing)
4.  **Final Cause:** **What is the PURPOSE?** (Security, Speed, Education, Entertainment, Decision)

### Step 0.2: Purpose Definition
Synthesize the above into a single **Primary Purpose Statement**:
*"The purpose of this artifact is to [ACTION] in order to [GOAL]."*

---

## Phase 1: Strategy Selection (Method #141)

**Goal:** Configure the verification engine based on the Purpose.

### Strategy Map

| Primary Purpose | Strategy Profile | Priority |
|-----------------|------------------|----------|
| **Security, Reliability, Correctness** | **STRATEGY A: THE FORTRESS** | Zero defects, worst-case analysis |
| **Innovation, Design, Content** | **STRATEGY B: THE MUSE** | Novelty, expansion, impact |
| **Education, Explanation, Docs** | **STRATEGY C: THE TEACHER** | Clarity, accuracy, progression |
| **Planning, Architecture, Systems** | **STRATEGY D: THE ARCHITECT** | Feasibility, coupling, trade-offs |
| *Unknown / Mixed* | **STRATEGY E: THE GENERALIST** | Balance of all |

**Action:** Select ONE Strategy.

---

## Phase 2: Execution

**Goal:** Apply methods aligned with the Strategy.

### 2.1 Universal Hygiene (Always Run)
*   **#81 Scope Integrity:** Did we do what was asked?
*   **#84 Coherence:** Is the artifact self-consistent?
*   **#83 Completeness:** Are there placeholders?

### 2.2 Strategic Deep Dive (Strategy-Specific)

#### If Strategy A (The Fortress):
*   **#109 Contraposition:** What guarantees failure?
*   **#21 Red Team:** Attack the solution.
*   **#62 Failure Mode Analysis:** What can break?

#### If Strategy B (The Muse):
*   **#41 SCAMPER:** Can we improve it?
*   **#123 Newcomb's Paradox:** Is it surprising?
*   **#131 Observer Paradox:** Is it genuine or cliché?

#### If Strategy C (The Teacher):
*   **#72 5 Whys:** Do we explain the root?
*   **#7 Mentor/Apprentice:** Is it understandable to a novice?
*   **#17 Abstraction Ladder:** Is the level of detail appropriate?

#### If Strategy D (The Architect):
*   **#31 ADR:** Are trade-offs documented?
*   **#68 Critical Path:** Where is the bottleneck?
*   **#90 Dependency Mapping:** What is coupled?

### 2.3 The "Abilene" Check (#133)
**Question:** regardless of strategy, is this solution *actually needed*, or are we just doing it because it was asked?

---

## Phase 3: Output Generation

**Report Structure:**

1.  **Ontological Profile:**
    *   *Purpose:* [Primary Purpose]
    *   *Strategy:* [Selected Strategy]

2.  **Verification Findings:**
    *   **Hygiene:** [Pass/Fail]
    *   **Strategic Insights:** [Deep findings from 2.2]

3.  **Recommendations:**
    *   Actionable steps tailored to the **Final Cause** (e.g., "To improve Security..." or "To improve Clarity...").

4.  **Meta-Commentary:**
    *   What limitations exist in this analysis? (Method #137)

---

## Version History
*   **V7.2:** Introduced Ontology Scan (#107) and Strategy Selection (#141) for domain-agnostic verification.
*   **V7.1:** Introduced Error Theory for Logic/Security domains.
*   **V7.0:** Introduced Adaptive Layering.
