# Deep Verify V7.4 - Lean Error Theory (Optimized)

## What is this?

**Deep Verify V7.4** is a streamlined evolution of V7.1. It retains the powerful "Error Theory" (Taxonomy Scan) and "Dense Reasoning" architecture but optimizes it for token efficiency and reduced cognitive load. It applies the **REMOVE_REDUNDANCY** operator to the verification process itself.

**Differences from V7.1 (Rolls-Royce):**
- **Domain-Gated Visibility**: Low-tier tasks no longer scan all 160 methods; visibility is restricted by domain.
- **Unified Innate Scan**: Consistency, Completeness, and Scope are checked in a single pass (Innate Sanity Check), reducing prompt overhead.
- **Confident Taxonomy Filter**: Error categories with < 20% confidence are completely blocked from Layer 2 analysis.
- **Simplified Challenge**: The "self-argument" phase is consolidated into a single "Sanity Challenge" pass, removing the triple-check redundancy for clear errors.

**Target Use Case**: Standard software verification, high-quality code review, and efficient rigorous analysis. Use V7.1 only for critical banking/protocol systems.

---

## Phase 0: Artifact Intake & Triage (Optimized)

**Purpose:** Profile artifact and allocate resources efficiently.
**Recommended Model:** Fast Reasoning Model (e.g., GPT-4o-mini, Claude Haiku)

### Step 0.1: Self-Check & Profile

Combine self-check and profiling into one operation.

```
## Phase 0.1: Profile & Self-Check

### Artifact Profile
- **Type**: [code/document/plan]
- **Size**: [N] tokens
- **Complexity Score**: [LOW/MEDIUM/HIGH] (based on density/nesting)
- **Criticality Score**: [LOW/MEDIUM/HIGH] (based on security/impact)

### Domain Detection (Method Visibility Mask)
Identify Primary Domains to filter method selection.

| Domain | Confidence | Method Category Visibility |
|--------|------------|----------------------------|
| Technical/Code | [0-100%] | Allow: technical, code, core |
| Research/Docs | [0-100%] | Allow: research, logic, core |
| Collaboration | [0-100%] | Allow: collaboration, core |
| Security/Risk | [0-100%] | Allow: risk, security, competitive |
| Advanced/Theory| [0-100%] | Allow: advanced, theory, core |

**Active Categories**: [List categories where Confidence > 40%]
```

### Step 0.2: Triage Decision

```
## Phase 0.2: Triage Decision

### Triage Matrix
| Complexity | Criticality | Tier | Budget | Visibility |
|------------|-------------|------|--------|------------|
| LOW | LOW | 1 | 5K | Restricted to Active Categories |
| MEDIUM | LOW | 2 | 15K | Restricted to Active Categories |
| HIGH | MEDIUM | 3 | 30K | Restricted + Adjacent |
| ANY | CRITICAL | 4 | 60K | FULL VISIBILITY (All Methods) |

**DECISION:**
- **TIER**: [1-4]
- **BUDGET**: [N]K
- **METHOD MASK**: [List allowed categories]
```

---

## LAYER 1: INNATE DETECTION (Unified Phase 1)

**Purpose:** Fast pattern detection and taxonomy scan.
**Budget:** ~5K tokens
**Recommended Model:** Strong Reasoning Model (e.g., GPT-4o, Claude Sonnet)

### Phase 1: Unified Innate Sanity Check

Execute Checks #84 (Consistency), #83 (Completeness), and #81 (Scope) in a **single prompt**.

```
## Phase 1: Innate Sanity Check

Analyze the artifact for the following three dimensions simultaneously:

### 1. Consistency (Internal Logic)
- Are definitions stable?
- Do statements contradict each other?
**Verdict**: [PASS/FAIL] + [Evidence of conflicts]

### 2. Completeness (Structure)
- Are required elements present?
- Are there TODOs, TBDs, or Placeholders?
**Verdict**: [PASS/FAIL] + [List of gaps]

### 3. Scope Alignment (Intent)
- Does output match the prompt/task verbatim?
- Are there silent omissions?
**Verdict**: [ALIGNED/DRIFTED] + [Evidence]
```

### Phase 1.4: Taxonomy Filter (Strict Gate)

Scan for Error Theory categories.

```
## Phase 1.4: Taxonomy Filter

Scan for indicators of error types. Assign confidence.

**CRITICAL RULE**: If Confidence < 20%, you MUST mark as [IGNORED]. Do not select methods for ignored categories in Layer 2.

| Category | Indicators Found | Confidence | Action |
|----------|------------------|------------|--------|
| LOGIC | [list] | [0-100%] | [KEEP/IGNORE] |
| SECURITY | [list] | [0-100%] | [KEEP/IGNORE] |
| OMISSION | [list] | [0-100%] | [KEEP/IGNORE] |
| SEMANTIC | [list] | [0-100%] | [KEEP/IGNORE] |
| RESOURCE | [list] | [0-100%] | [KEEP/IGNORE] |

**Active Error Vectors**: [List categories with Confidence >= 20%]
```

---

## LAYER 2: ADAPTIVE DETECTION (Optimized Phase 3-5)

**Purpose:** Deep analysis seeded by Phase 1.4.
**Executes:** Tier 2+ only.

### Phase 3: Domain-Gated Method Selection

Select methods **ONLY** from the "Active Categories" (Phase 0.1) and targeting "Active Error Vectors" (Phase 1.4).

```
## Phase 3: Adaptive Selection

**Constraints**:
1. Select max 3 methods per Active Error Vector.
2. Select ONLY from allowed Method Categories (Tier 1-3).

### Selection Logic
For each Active Error Vector (e.g., LOGIC), select best methods from Allowed Categories (e.g., 'core', 'technical').

| Target Vector | Selected Method | Why? |
|---------------|-----------------|------|
| [Vector] | #[N] [Name] | [Reason] |
| [Vector] | #[N] [Name] | [Reason] |

**Total Selected**: [List IDs]
```

### Phase 4: Execution & Anomaly Scan

Execute selected methods.

```
## Phase 4: Analysis & Anomalies

### Method Execution
[Execute selected methods. Focus on Depth > Width.]
- Method #[N]: [Findings]

### Anomaly Check (Quick Scan)
Do you see anything that doesn't fit the error vectors?
- **Unclassified Anomalies**: [List if any, else None]
```

### Phase 5: Single-Pass Challenge

Consolidated challenge phase. Instead of 3 separate tests per finding, run one "Sanity Challenge".

```
## Phase 5: Sanity Challenge

For each finding with Confidence > 50%:

**Finding [ID]:** "[Description]"
**Challenge:** Provide ONE strong counter-argument. Does the finding still hold?
- **Counter-Argument**: [Argument]
- **Rebuttal**: [Why finding is still valid OR why it is dismissed]
- **Final Verdict**: [CONFIRMED / DISMISSED]
```

---

## LAYER 3: MEMORY & OUTPUT (Phase 6)

**Purpose:** Learn and Report.
**Budget:** Minimal.

### Phase 6: Learning & Reporting

```
## Phase 6: Report

### Verification Summary
- **Tier**: [N]
- **Active Domains**: [List]
- **Ignored Vectors**: [List of <20% categories]

### Findings
| ID | Severity | Type | Description | Status |
|----|----------|------|-------------|--------|
| F1 | [Sev] | [Type]| [Desc] | [CONFIRMED] |

### Optimization Feedback
- Did we over-analyze? [Yes/No]
- Did we miss a domain? [Yes/No]
```

---

## Appendix: Implementation Notes

- **Model Swapping**: Use smaller models for Phase 0 and Phase 1. Use larger models for Phase 4 (Reasoning).
- **Halt Condition**: If Phase 1 detects NO issues and NO active error vectors (all < 20%), **STOP EARLY** for Tier 1-2. Report "Clean Pass".
