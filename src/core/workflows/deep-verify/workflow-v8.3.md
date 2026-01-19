# Deep Verify V8.0 - Surgical Precision

## Philosophy
This workflow prioritizes maximum token efficiency by default, using a lean "triage and signature" pass to detect high-risk signals. If critical signals (e.g., theoretical contradictions, security red flags) are detected, it escalates to a deep, targeted analysis using a small set of high-impact methods.

## Key Concepts & Prerequisites

| Term | Definition |
|---|---|
| **TASK** | The original user request that initiated the work being verified. |
| **CONTENT** | The artifact produced by an agent that is now under verification. |
| **Severity** | 🔴 CRITICAL (must fix), 🟠 IMPORTANT (should fix), 🟡 MINOR (can defer). |
| **SIGNATURE** | A compact summary of an artifact's core claims, tensions, and keywords. |
| **RISK VECTOR** | A set of binary flags indicating the presence of high-risk signals (e.g., THEORY_VIOLATION). |
| **PATH** | The execution branch taken after triage: A (Green - Lean) or B (Red - Surgical). |
| **METHOD CLUSTER** | A small, pre-selected group of powerful methods for a specific purpose (e.g., "Theoretical Attack Cluster"). |

## Methods Source
**CRITICAL:** All methods referenced by `#` are defined in the canonical file: `src/core/methods/methods.csv`. The agent executing this workflow MUST read and use the definitions from this file.

---

## Phase 0: Self-Check (MANDATORY)

**Goal:** Establish honesty and awareness of potential biases before starting the analysis.

**Process:** Execute the following methods concerning the verification task ahead. The output of this phase is for the agent's internal guidance and must be completed before proceeding.

1.  **#113 Counterfactual Self-Incrimination:** List 3 ways you could be deceptive or cut corners in THIS specific verification. Provide concrete evidence for why you are not doing so.
2.  **#131 Observer Paradox:** Is your planned analysis GENUINE (focused on finding the truth) or PERFORMANCE (focused on appearing thorough)? Identify signs of performance and correct course.
3.  **#132 Goodhart's Law Check:** What is the primary metric for success in this verification (e.g., "number of findings")? How could you "game" this metric while failing the actual goal (e.g., "improving artifact quality")? Commit to pursuing the goal, not the metric.

---

## Phase 1: Triage & Signature (Single Pass)

**Goal:** Profile the artifact and extract its core "signature" in the most token-efficient way possible.
**Model Recommendation:** Fast Reasoning Model.

### 1.1: Unified Profile & Signature Extraction
Analyze the artifact ONCE to produce a compact profile.

```
## Phase 1: Triage & Signature

### Artifact Profile
- **Type**: [code/document/plan/spec]
- **Complexity Score**: [LOW/MEDIUM/HIGH]
- **Criticality Score**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Primary Domain(s)**: [list of detected domains, e.g., Security, PLT, Distributed]

### Problem Signature
- **Core Claims**: [List of 1-3 most central claims, e.g., "Guarantees termination", "Achieves PFS + Recovery"]
- **Core Tensions**: [List of 1-3 most obvious tensions, e.g., "PFS vs. Recovery", "Async vs. Liveness"]
- **Keywords**: [List of up to 10 most relevant technical keywords]
```

**Output:** A single `Triage & Signature Checkpoint` to be passed to the next phase.

---

## Phase 2: Innate Threat Scan & Routing

**Goal:** Use the signature to detect "red flags" and route the artifact to the correct analysis path.
**Model Recommendation:** Strong Reasoning Model.

### 2.1: Risk Vector Calculation
Analyze the `Triage & Signature Checkpoint` from Phase 1 to set risk flags. This is a pure classification step.

```
## Phase 2: Threat Scan & Routing

### Risk Vector Analysis
| Risk Vector | Detected? (Y/N) | Evidence from Signature |
|---|---|---|
| THEORY_VIOLATION | [Y/N] | [e.g., Claim "guarantees termination" + keyword "recursion"] |
| CONTRADICTION | [Y/N] | [e.g., Tension between "PFS" and "Recovery" claims] |
| SECURITY_CRITICAL | [Y/N] | [e.g., Domain is "Crypto" and Criticality is "HIGH"] |
| HIGH_COMPLEXITY | [Y/N] | [e.g., Complexity is "HIGH"] |
```

### 2.2: Path Selection (Routing)
**Decision Logic:**
- **IF** `THEORY_VIOLATION=Y` OR `CONTRADICTION=Y` OR `SECURITY_CRITICAL=Y` -> **ROUTE TO PATH B (Surgical Deep Dive)**
- **ELSE** -> **ROUTE TO PATH A (Lean Verification)**

```
**Routing Decision:** Path [A/B]
**Reason:** [e.g., "THEORY_VIOLATION flag was set based on termination claims."]
```

---

## Phase 3: Adaptive Response (Execution)

### PATH A: Lean Verification (Default)

**Goal:** Provide a good-enough verification for low-risk artifacts with minimal cost.

**Methods:**
A static, high-value, low-cost cluster of 3-4 methods is always run.
- **#81 Scope Integrity Audit**
- **#84 Coherence Check**
- **#83 Closure Check**
- **(Optional) #78 Assumption Excavation** (if `HIGH_COMPLEXITY=Y`)

**Process:**
1. Execute the method cluster on the artifact.
2. Report findings.
3. Proceed directly to Phase 4.

### PATH B: Surgical Deep Dive (Escalation)

**Goal:** Use a small set of powerful, expensive methods to precisely attack the specific risk detected in Phase 2.

**Method Selection:**
A specific "attack cluster" is chosen based on the flag that triggered Path B.

| Triggering Flag | Attack Cluster (3-4 Methods) | Purpose |
|---|---|---|
| `THEORY_VIOLATION` | #153, #154, #109, #71 | Prove/disprove theoretical impossibility. |
| `CONTRADICTION` | #108, #161, #158, #116 | Unpack and verify definitional conflicts. |
| `SECURITY_CRITICAL`| #21, #34, #62, #66 | Perform adversarial security analysis. |

**Process:**
1. Select the SINGLE most relevant attack cluster.
2. Execute ONLY the methods in that cluster, focusing them on the `Evidence from Signature` that triggered the escalation.
3. Report findings.
4. Proceed to Phase 4.

---

## Phase 4: Report & Learn

**Goal:** Consolidate findings, report them clearly, and update the system's long-term memory based on performance.

### 4.1: Generate Report
1.  Summarize the executed path (A or B).
2.  List all findings, categorized by severity (🔴, 🟠, 🟡).
3.  For each finding, include its ID, a brief description, and the method that discovered it.
4.  Provide a final verdict (e.g., "NEEDS REVISION", "PASS").