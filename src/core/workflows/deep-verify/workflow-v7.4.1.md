# Deep Verify V7.4.1 - Adaptive Exploration (Optimized & Resilient)

## What is this?

**Deep Verify V7.4.1** is an evolution of the lean V7.4 process. It retains the core cost optimizations of V7.4 but introduces adaptive safety mechanisms to mitigate the risk of analytical "tunnel vision" identified during verification tests (T15-T21). It is designed to be cheap by default, but capable of intelligently escalating its own depth when initial assumptions appear flawed.

**Key Improvements from V7.4:**
- **Adaptive Visibility**: Replaces strict domain gating with a primary/secondary model. 90% of method selection budget goes to active domains, but a 10% "exploration budget" is reserved for high-potential methods from inactive domains.
- **Confidence-Weighted Filtering**: The `Confident Taxonomy Filter` no longer uses a hard <20% cutoff. Instead, confidence acts as a weight, reducing the budget for low-confidence vectors but not eliminating them entirely.
- **Sanity Check Feedback Loop**: A new validation step after Layer 2. If the main analysis yields no significant findings, but the "exploration budget" does, it triggers a re-triage, forcing the process to reconsider its initial assumptions.

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
**Inactive but Potential Categories**: [List categories where Confidence <= 40% but > 5%]
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
- **BUDGET_TOTAL**: [N]K (Total token budget for Layer 2)
- **BUDGET_PRIMARY**: [N * 0.9]K (90% of budget for methods in Active Categories)
- **BUDGET_EXPLORE**: [N * 0.1]K (10% of budget for methods in Inactive but Potential Categories)
- **METHOD MASK_PRIMARY**: [List allowed categories from Active Categories]
- **METHOD MASK_EXPLORE**: [List allowed categories from Inactive but Potential Categories - max 2 categories]
```

---

## LAYER 1: INNATE DETECTION (Confidence-Weighted)

**Purpose:** Fast pattern detection and taxonomy scan.
**Budget:** ~5K tokens
**Recommended Model:** Strong Reasoning Model (e.g., GPT-4o, Claude Sonnet)

### Phase 1: Unified Innate Sanity Check (Unchanged from V7.4)

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

### Phase 1.4: Taxonomy Weighting (Replaces Strict Filter)

Scan for indicators of error types. Assign confidence. This confidence now acts as a weight for method selection budget, not a hard gate. All vectors with weight > 0 are considered.

| Category | Indicators Found | Confidence | Vector Weight |
|----------|------------------|------------|---------------|
| LOGIC | [list] | [0-100%] | [Confidence as decimal, e.g., 0.75] |
| SECURITY | [list] | [0-100%] | [Confidence as decimal] |
| OMISSION | [list] | [0-100%] | [Confidence as decimal] |
| SEMANTIC | [list] | [0-100%] | [Confidence as decimal] |
| RESOURCE | [list] | [0-100%] | [Confidence as decimal] |
| ASSUMPTION | [list] | [0-100%] | [Confidence as decimal] |
| CONTRADICTION | [list] | [0-100%] | [Confidence as decimal] |
| ... (any other relevant categories) | | | |

**Active Error Vectors**: All vectors with Vector Weight > 0.

---

## LAYER 2: ADAPTIVE DETECTION (with Budgeted Exploration)

**Purpose:** Deep analysis seeded by Phase 1.4, with a safety net for missed domains.
**Executes:** Tier 2+ only.

### Phase 3: Adaptive Method Selection

Select methods from `METHOD MASK_PRIMARY` based on `Vector Weight` (Phase 1.4) and `BUDGET_PRIMARY`. Additionally, select a small number of exploratory methods using `BUDGET_EXPLORE` from `METHOD MASK_EXPLORE`.

**Constraints**:
1.  Allocate `BUDGET_PRIMARY` tokens among `Active Error Vectors` proportionally to their `Vector Weight`.
2.  Select max 3 methods per `Active Error Vector` within its allocated `BUDGET_PRIMARY` share.
3.  Select 1-2 methods from `METHOD MASK_EXPLORE` using `BUDGET_EXPLORE`. Prioritize methods that are broad or meta-analytical (e.g., #115 Negative Space Cartography, #78 Assumption Excavation).
4.  Track `Primary_Methods_Executed` and `Exploration_Methods_Executed`.

```
## Phase 3: Adaptive Selection

### Primary Method Selection
Allocate [BUDGET_PRIMARY] for methods from [METHOD MASK_PRIMARY] based on Active Error Vectors.

| Target Vector | Allocated Primary Budget | Selected Method | Why? |
|---------------|--------------------------|-----------------|------|
| [Vector] | [N] tokens | #[N] [Name] | [Reason] |
| ... | | | |

### Exploratory Method Selection
Allocate [BUDGET_EXPLORE] for methods from [METHOD MASK_EXPLORE].

| Selected Exploration Method | Why? (targeting potential blind spots) |
|-----------------------------|----------------------------------------|
| #[N] [Name]                 | [Reason]                               |
| #[N] [Name]                 | [Reason]                               |

**Total Selected Primary Methods**: [List IDs]
**Total Selected Exploration Methods**: [List IDs]
```

### Phase 4: Execution & Anomaly Scan

Execute selected methods. Focus on Depth > Width for both primary and exploratory methods. Record findings from both categories separately.

```
## Phase 4: Analysis & Anomalies

### Primary Method Execution Findings
- Method #[N]: [Findings]
- ...
**Primary_Findings**: [List findings with Severity/Type]

### Exploratory Method Execution Findings
- Method #[N]: [Findings]
- ...
**Exploration_Findings**: [List findings with Severity/Type]

### Unclassified Anomalies (across all methods)
- **Unclassified Anomalies**: [List if any, else None]
```

### Phase 5: Single-Pass Challenge

Consolidated challenge phase for all findings (Primary + Exploratory).

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

## LAYER 2.5: SANITY CHECK FEEDBACK LOOP (NEW)

**Purpose:** Dynamically re-evaluate initial triage if current analysis suggests a deeper or different problem domain. This mitigates "tunnel vision."

```
## Phase 5.5: Feedback Loop Trigger Analysis

1.  **Calculate Primary Findings Significance**:
    `S_primary` = sum of (Severity_Score of CONFIRMED Primary_Findings)
    (e.g., CRITICAL=3, IMPORTANT=2, MINOR=1)
2.  **Calculate Exploratory Findings Significance**:
    `S_explore` = sum of (Severity_Score of CONFIRMED Exploration_Findings)

**Trigger Condition:**
IF (`S_primary` < 3  AND `S_explore` >= 3):
    - **STATUS**: `RE-TRIAGE REQUIRED`
    - **REASON**: The primary analysis was shallow, but the exploration budget yielded significant findings, indicating the initial domain detection or active error vectors were flawed.
    - **ACTION**: **Return to Phase 0.2** with an updated `Domain Detection` step. Add the domain(s) from which successful `Exploration_Methods_Executed` originated to the `Active Categories` list, ensuring their inclusion in the `METHOD MASK_PRIMARY` for the re-run.
ELSE:
    - **STATUS**: `TRIAGE CONFIRMED`
    - **ACTION**: Proceed to Layer 3.
```

---

## LAYER 3: MEMORY & OUTPUT (Unchanged from V7.4)

**Purpose:** Learn and Report.
**Budget:** Minimal.

### Phase 6: Report

```
## Phase 6: Report

### Verification Summary
- **Tier**: [N]
- **Active Domains (Post-Triage)**: [List]
- **Ignored Vectors (Post-Triage)**: [List of <20% categories]
- **Re-Triage Occurred**: [Yes/No]

### Findings
| ID | Severity | Type | Source | Description | Status |
|----|----------|------|--------|-------------|--------|
| F1 | [Sev] | [Type]| [Primary/Exploratory] | [Desc] | [CONFIRMED] |

### Optimization Feedback
- Did we over-analyze? [Yes/No]
- Did we miss a domain initially? [Yes/No, based on re-triage]
```

---

## Appendix: Implementation Notes (Unchanged from V7.4)

- **Model Swapping**: Use smaller models for Phase 0 and Phase 1. Use larger models for Phase 4 (Reasoning).
- **Halt Condition**: If Phase 1 detects NO issues and NO active error vectors (all < 20%), **STOP EARLY** for Tier 1-2. Report "Clean Pass".
