# Deep Verify V9.0 - Empirical Core

## Philosophy

This workflow is the culmination of analyzing the effectiveness of all V7.x and V8.x processes. It is built on the principle of **Evidence-Based Design**, incorporating only the most effective, high-ROI methods and structures.

- **Efficiency:** An aggressive "early exit" policy terminates verification as soon as a CRITICAL finding is confirmed.
- **Flexibility:** A generative, content-agnostic extraction phase replaces rigid checklists.
- **Power:** A single, potent analysis path using a curated set of proven "killer" methods is used for all artifacts.

---

## Phase 0: Triage & Signature

**Goal:** Profile the artifact and extract its core "signature" for analysis.

### Step 0.1: Self-Check
Execute **#113 Counterfactual Self-Incrimination**, **#131 Observer Paradox**, and **#132 Goodhart's Law Check** to ensure verifier honesty and focus.

### Step 0.2: Artifact Profile
Analyze the artifact to produce a compact profile.

```
### Artifact Profile
- **Type**: [code/document/plan/spec]
- **Complexity Score**: [LOW/MEDIUM/HIGH]
- **Criticality Score**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Primary Domain(s)**: [list of detected domains]
```

### Step 0.3: Problem Signature
Extract the artifact's core claims and tensions.

```
### Problem Signature
- **Core Claims**: [List of 1-3 most central claims]
- **Core Tensions**: [List of 1-3 most obvious tensions]
- **Keywords**: [List of up to 10 most relevant technical keywords]
```

---

## Phase 1: Dynamic Element Extraction (from V7.7)

**Goal:** Generatively determine what needs to be checked based on the artifact's content.

### Step 1.1: Claim Extraction
Read the artifact and list ALL claims (GUARANTEE, PERFORMANCE, CAUSAL, etc.). Mark claims that are Red Flags (e.g., GUARANTEE without proof).

### Step 1.2: Term & Requirement Extraction
List key technical terms that need definition and all explicit or implicit requirements.

### Step 1.3: Assumption Extraction
List all explicit and, more importantly, implicit assumptions the artifact relies on.

---

## Phase 2: Threat Scan & Routing (from V8.3)

**Goal:** Identify high-risk signals to focus the analysis. V9.0 uses a simplified, single-path routing.

### Step 2.1: Risk Vector Analysis
Analyze the signature and extracted elements to set risk flags.

```
### Risk Vector Analysis
| Risk Vector | Detected? (Y/N) | Evidence |
|---|---|---|
| THEORY_VIOLATION | [Y/N] | [e.g., Claim "guarantees termination" + keyword "recursion"] |
| CONTRADICTION | [Y/N] | [e.g., Tension between "PFS" and "Recovery" claims] |
| SECURITY_CRITICAL | [Y/N] | [e.g., Domain is "Crypto" and Criticality is "HIGH"] |
| HIGH_COMPLEXITY | [Y/N] | [e.g., Complexity is "HIGH"] |
```
**Note:** This list of four risk vectors is the complete, defined set for workflow V9.0. It represents an empirically derived set of the most common, high-impact failure domains identified from the analysis of V7.x and V8.x workflows.

### Step 2.2: Path Selection (Simplified)
In V9.0, **all artifacts are routed to a single, powerful deep dive path.** The risk vectors inform which methods to prioritize.

**Routing Decision:** Path B (Surgical Deep Dive) is always taken.

### Step 2.3: Risk-to-Method Mapping
The risk vectors explicitly guide the focus for the methods in Phase 3. While all methods are executed, apply extra scrutiny and depth when a method's specialty aligns with an active risk vector.

| Risk Vector | Primary Method(s) to Focus On | Rationale |
| :--- | :--- | :--- |
| `THEORY_VIOLATION` | #153, #163 | These methods directly test claims against formal scientific and logical limits. |
| `CONTRADICTION` | #154, #161, #116, #84 | These methods specialize in finding definitional, logical, and structural self-contradictions. |
| `SECURITY_CRITICAL` | #109, #154 | Apply these methods with a security mindset: #109 to find attack paths ("guaranteed failure") and #154 to find conflicts in security properties. |
| `HIGH_COMPLEXITY` | #116, #161, #84 | These methods help manage complexity by exposing hidden dependencies, circular reasoning, and inconsistencies. |

---

## Phase 3: Surgical Deep Dive (The "Empirical Core" Method Set)

**Goal:** Apply a curated set of the most effective methods identified in the V7/V8 analysis. The "Atakuj -> Sprawdź -> Przerwij" loop is implemented here.

### Step 3.1: Method Application
Execute the following methods in sequence. Each method **operates on the elements extracted in Phase 1** to find findings.

**The V9.0 Empirical Core Method Set:**

| Priority | Method | **Primary Input from Phase 1** | Focus |
|:---:|---|---|---|
| **1** | **#153 Theoretical Impossibility Check** | Extracted Claims (especially GUARANTEE) | Check claims against known impossibility theorems. |
| **2** | **#154 Definitional Contradiction Detector** | Extracted Requirements & Terms | Find requirements that are definitionally mutually exclusive. |
| **3** | **#161 Definition Triad Expansion** | Extracted Requirements | Unpack requirements into MEANS/IMPLIES/EXCLUDES to find hidden conflicts. |
| **4** | **#116 Strange Loop Detection** | All Extracted Elements (Claims, Assumptions) | Build justification graphs and detect circular reasoning. |
| **5** | **#109 Contraposition Inversion** | Extracted Claims & Requirements | Ask "what would GUARANTEE failure?" and check if the artifact does it. |
| **6** | **#163 Existence Proof Demand** | Extracted Claims (especially PERFORMANCE, CAUSAL) | For every major capability claim, demand formal proof or empirical evidence. |
| **7** | **#84 Consistency Check** | All Extracted Elements (Terms, Claims) | A final check for internal consistency in definitions and claims. |
| **8** | **#165 Constructive Counterexample** | Extracted Claims | If a claim seems weak, try to build a concrete example that breaks it. |
| **9** | **#63 Critical Challenge** | Red-Flagged Claims | For any remaining high-confidence findings, formulate the strongest possible counter-argument to validate. |

### Step 3.2: Early Exit Protocol
**This is the core "Przerwij" (Interrupt) step.**

**RULE:** After **each** method is executed in Step 3.1:
1.  Review the finding(s).
2.  If any finding is determined to be **🔴 CRITICAL** with **High Confidence (>85%)**:
    - **HALT** the verification process immediately.
    - Proceed directly to Phase 4 (Report).
    - Do NOT execute any further methods.

This ensures maximum token efficiency by stopping as soon as a fatal flaw is confirmed.

---

## Phase 4: Report Generation

**Goal:** Consolidate findings and provide a clear, actionable verdict.

### Step 4.1: Final Report
1.  Summarize the executed path and note if an Early Exit was triggered.
2.  List all confirmed findings, categorized by severity (🔴, 🟠, 🟡).
3.  For each finding, include its ID, a brief description, and the method that discovered it.
4.  Provide a final verdict (e.g., "NEEDS REVISION", "PASS WITH CAVEATS").
5.  List clear, actionable recommendations.