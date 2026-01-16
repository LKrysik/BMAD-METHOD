# Deep Verify V7.1.1 - Token-Optimized AVS

## What is this?

**Deep Verify V7.1.1** is a token-optimized variant of V7.1. It retains all V7.1 capabilities (Error Theory integration, adaptive layers, knowledge injection) but restructures execution into **5 batched super-phases** to reduce API round-trips and cumulative token usage.

**V7.1.1 Changes from V7.1:**
- **Batched Execution**: 15 phases → 5 super-phases (reduces context accumulation by ~67%)
- **Compressed Templates**: Shorter output tables with documented tradeoffs
- **Checkpoint Summaries**: Each super-phase ends with a compact summary for next phase
- **Preserved Detection Power**: All V7.1 methods preserved; see tradeoffs in Appendix D

**Expected Token Reduction:** ~230K → ~75K per task (67% savings)

**Known Tradeoffs (documented in Appendix D):**
- Batching may reduce sequential phase learning for complex artifacts
- Compressed templates trade traceability for token efficiency

---

## Key Concepts

| Term | Definition |
|------|------------|
| SUPER-PHASE | Batched execution of multiple V7.1 phases in single turn |
| CHECKPOINT | Compact summary passed between super-phases |
| COMPRESSED TEMPLATE | Minimal output format preserving essential data |
| DETECTION POWER | Operational metric: DP = (methods_applied × method_coverage) + (findings_confirmed / findings_claimed) + (1 - false_positive_rate). V7.1.1 preserves method application; may reduce traceability. |

**Methods source:** `src/core/methods/methods.csv`
**Domain knowledge:** `src/core/knowledge/domain-knowledge-base.md`

---

## Execution Structure

```
V7.1:  [0.1][0.2][0.3][1.1][1.2][1.3][1.4][2][3.1][3.2][4.1][4.2][4.3][5.1][5.2][6.1][6.2][6.3][7][OUT]
        ↓    ↓    ↓    ↓    ↓    ↓    ↓   ↓   ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓   ↓   ↓
       T1   T2   T3   T4   T5   T6   T7  T8  T9   T10  T11  T12  T13  T14  T15  T16  T17  T18 T19 T20

V7.1.1: [====INTAKE====][=====INNATE=====][=====ADAPTIVE=====][===CONSOLIDATE===][==FINALIZE==]
              T1                 T2                 T3                 T4              T5
```

---

## SUPER-PHASE 1: INTAKE (V7.1 Phases 0.1-0.3)

**Purpose:** Profile artifact, assess complexity/criticality, determine tier.
**Budget:** ~3K tokens output

Execute ALL of the following in a SINGLE response:

### 1A. Self-Check
Methods: #113 Counterfactual Self-Incrimination, #131 Observer Paradox, #112 Entropy Leak

```
## SP1: INTAKE

### Self-Check
| Bias | Evidence Against | Genuine? |
|------|------------------|----------|
| [bias1] | [evidence] | Y/N |
| [bias2] | [evidence] | Y/N |
```

### 1B. Artifact Profile

```
### Profile
| Property | Value |
|----------|-------|
| Type | [code/doc/plan/protocol/spec] |
| Size | [N] tokens |
| Requirements | [N] explicit |

### Domains (confidence ≥50% only)
| Domain | Confidence | Key Markers |
|--------|------------|-------------|
| [domain] | [%] | [markers] |

### Scores
| Complexity | Criticality | Evidence |
|------------|-------------|----------|
| [1-5] | [1-5] | [brief] |
```

### 1C. Triage

```
### Triage
Complexity: [LOW/MED/HIGH] | Criticality: [LOW/MED/HIGH/CRIT]
**TIER: [1-5]** | **BUDGET: [N]K** | **LAYERS: [list]**
```

### Checkpoint 1

```
---
## CP1 (pass to SP2)
TYPE=[type] | DOMAINS=[list] | TIER=[N] | BUDGET=[N]K | LAYERS=[list]
---
```

---

## SUPER-PHASE 2: INNATE (V7.1 Phases 1.1-1.4 + 2)

**Purpose:** Fast pattern detection + Error Theory taxonomy scan + decision gate.
**Budget:** ~5K tokens output

Execute ALL of the following in a SINGLE response:

### 2A. Core Checks (Batch)

```
## SP2: INNATE

### Consistency (#84)
| Term | First Def | Later Usage | Conflict? |
|------|-----------|-------------|-----------|
| [term] | [first definition @ loc] | [later usage @ loc] | Y/N |

Verdict: [PASS/FAIL]

### Completeness (#83)
| Missing | Impact |
|---------|--------|
| [element] | [blocker/minor] |

Verdict: [PASS/FAIL]

### Scope (#81)
| Task Element | Addressed? |
|--------------|------------|
| [element] | FULL/PARTIAL/OMIT |

Verdict: [ALIGNED/DRIFTED]
```

### 2B. Error Theory Taxonomy Scan

```
### Taxonomy Scan
| Category | Indicators | Conf |
|----------|------------|------|
| LOGIC | [indicators] | [%] |
| SEMANTIC | [indicators] | [%] |
| OMISSION | [indicators] | [%] |
| SECURITY | [indicators] | [%] |
| RESOURCE | [indicators] | [%] |
| CONCURRENCY | [indicators] | [%] |

**Error Vectors:** [top 2 categories]
```

### 2C. Layer 1 Findings

```
### L1 Findings
| ID | Check | Sev | Desc | Category |
|----|-------|-----|------|----------|
| L1-1 | [check] | [C/I/M] | [desc] | [cat] |
```

### 2D. Decision Gate

```
### Decision
- CRITICAL finding? [Y/N]
- Tier=1 + no issues + LOW complexity? [Y/N]
- Tier≥2 OR issues OR complexity≥MED? [Y/N]

**DECISION: [ESCALATE/COMPLETE/CONTINUE]**
```

### Checkpoint 2

```
---
## CP2 (pass to SP3)
L1_FINDINGS=[N] | CRITICAL=[N] | ERROR_VECTORS=[list] | DECISION=[X]
---
```

**If DECISION=COMPLETE:** Skip to SP5
**If DECISION=ESCALATE:** Skip to SP5 with escalation flag

---

## SUPER-PHASE 3: ADAPTIVE (V7.1 Phases 3-4)

**Purpose:** Dynamic method selection + deep analysis.
**Budget:** ~10K tokens output
**Executes:** Tier 2+ only

Execute ALL of the following in a SINGLE response:

### 3A. Method Selection (Seeded by Error Vectors)

```
## SP3: ADAPTIVE

### Method Selection
Scoring: domain(0.2) + error_vector(0.3) + complexity(0.15) + history(0.2) + coverage(0.15)

| Rank | Method | Relevance | Reason |
|------|--------|-----------|--------|
| 1 | #[N] [name] | [0.XX] | [specific reason for THIS artifact] |
| 2 | #[N] [name] | [0.XX] | [specific reason for THIS artifact] |
| ... | ... | ... | ... |

Selected: [list of method IDs]
```

### 3B. Method Application (Batched)

For EACH selected method:

```
### Method #[N]: [Name]
Target: [specific section/concern]
Finding: [Y/N]
If Y: [desc] | Depth: [SYMPTOM→ROOT] | Conf: [%] | Evidence: "[quote]"
```

### 3C. Anomaly Detection

```
### Anomalies
| Element | Type | Conf | Verdict |
|---------|------|------|---------|
| [elem] | [UNCLASS/UNUSUAL/UNEXPECTED] | [%] | [FP/NEW/UNKNOWN] |
```

### 3D. Hypothesis Generation (from Error Vectors)

```
### Hypotheses (from Error Vectors)
| H# | If [CATEGORY] error exists, it hides in... | Evidence | Status |
|----|-------------------------------------------|----------|--------|
| H1 | [hypothesis] | [evidence] | [CONF/REF/OPEN] |
```

### Checkpoint 3

```
---
## CP3 (pass to SP4)
METHODS_APPLIED=[N] | L2_FINDINGS=[N] | ANOMALIES=[N] | HYPOTHESES_CONF=[N]
---
```

---

## SUPER-PHASE 4: CONSOLIDATE (V7.1 Phases 5-6)

**Purpose:** Challenge findings, record learning, assess confidence.
**Budget:** ~5K tokens output

Execute ALL of the following in a SINGLE response:

### 4A. Finding Consolidation

```
## SP4: CONSOLIDATE

### All Findings
| ID | Source | Type | Sev | Desc | Conf | Root Cause |
|----|--------|------|-----|------|------|------------|
| F1 | [L1/L2] | [type] | [C/I/M] | [desc] | [%] | [cause] |
```

### 4B. Challenge Protocol (Batched)

For EACH finding with conf ≥50%:

```
### Challenge: F[N]
#63 Critical Challenge: [strongest counter-argument]
#133 Abilene Check: [does problem actually exist?]
#109 Contraposition: [what would guarantee correctness?]
**Verdict: [CONFIRMED/DOWNGRADED/DROPPED]** | Final Conf: [%]
```

### 4C. Learning Record

```
### Learning
| Metric | Value |
|--------|-------|
| Findings total | [N] |
| CRITICAL | [N] |
| Methods used | [N] |
| Best method | #[N] ([N] findings) |

### Method Effectiveness
| Method | Findings | Conf Rate | Keep? |
|--------|----------|-----------|-------|
| #[N] | [N] | [%] | Y/N |
```

### 4D. Knowledge Injection Check

```
### Knowledge Injection
Source: optimization-strategies.md (if exists, else skip)
| Strategy Violated? | By Artifact | By Process |
|--------------------|-------------|------------|
| [strategy] | Y/N | Y/N |
| (none if file not found) | - | - |
```

### 4E. Adaptation Feedback

```
### Adaptation Feedback
#### What Worked
| Element | Evidence | Keep/Amplify |
|---------|----------|--------------|
| [method/strategy] | [result] | KEEP/AMPLIFY |

#### What Didn't Work
| Element | Evidence | Change/Remove |
|---------|----------|---------------|
| [method/strategy] | [result] | CHANGE/REMOVE |

#### Process Improvements
| Suggestion | Basis | Priority |
|------------|-------|----------|
| [suggestion] | [evidence] | HIGH/MED/LOW |
```

### Checkpoint 4

```
---
## CP4 (pass to SP5)
CONFIRMED_FINDINGS=[N] | CRITICAL=[N] | ESCALATE=[Y/N]
---
```

---

## SUPER-PHASE 5: FINALIZE (V7.1 Phase 7 + Output)

**Purpose:** Generate final report, handle escalations.
**Budget:** ~3K tokens output

Execute ALL of the following in a SINGLE response:

### 5A. Escalation Check

```
## SP5: FINALIZE

### Escalation Triggers
| Trigger | Met? |
|---------|------|
| CRITICAL finding | Y/N |
| Confidence <70% | Y/N |
| Unresolved anomaly | Y/N |
| Theoretical impossibility | Y/N |

**ESCALATE: [Y/N]**
```

### 5B. Escalation Package (if needed)

```
### Escalation Items (if ESCALATE=Y)
| ID | Finding | Conf | Why Escalated | User Action |
|----|---------|------|---------------|-------------|
| [F#] | [desc] | [%] | [reason] | CONFIRM/REFUTE/DEFER |
```

### 5C. Final Report

```
---
## DEEP VERIFY V7.1.1 - VERIFICATION REPORT

### Summary
| Property | Value |
|----------|-------|
| Artifact | [type] @ [domains] |
| Tier | [N] |
| Budget | [N]K alloc / [N]K used |

### Findings

#### CRITICAL
| ID | Type | Desc | Conf | Root Cause |
|----|------|------|------|------------|
| [F#] | [cat] | [desc] | [%] | [cause] |

#### IMPORTANT
| ID | Type | Desc | Conf | Root Cause |
|----|------|------|------|------------|
| [F#] | [cat] | [desc] | [%] | [cause] |

#### MINOR
| ID | Type | Desc | Conf | Root Cause |
|----|------|------|------|------------|
| [F#] | [cat] | [desc] | [%] | [cause] |

### Limits (Gödel Gap)
- Ground Truth: Verification limited by provided context
- Semantic Gap: Matches are probabilistic

### Recommendations
| Pri | Action | Addresses |
|-----|--------|-----------|
| 1 | [action] | [F#] |

### Metrics
| Metric | Value |
|--------|-------|
| Tokens/finding | [N] |
| Detection rate | [%] |
---
```

---

## Appendix A: Tier Reference (unchanged from V7.1)

| Tier | Budget | Layers | Super-Phases |
|------|--------|--------|--------------|
| 1 | 10K | 1 only | SP1 → SP2 → SP5 |
| 2 | 20K | 1 + partial 2 | SP1 → SP2 → SP3(partial) → SP5 |
| 3 | 40K | 1 + 2 | SP1 → SP2 → SP3 → SP4 → SP5 |
| 4 | 60K | 1 + 2 + 4 | All |
| 5 | 100K+ | All | All |

---

## Appendix B: V7.1 → V7.1.1 Phase Mapping

| V7.1 Phase | V7.1.1 Super-Phase |
|------------|-------------------|
| 0.1 Self-Check | SP1: INTAKE |
| 0.2 Artifact Profile | SP1: INTAKE |
| 0.3 Triage | SP1: INTAKE |
| 1.1 Consistency | SP2: INNATE |
| 1.2 Completeness | SP2: INNATE |
| 1.3 Scope | SP2: INNATE |
| 1.4 Taxonomy Scan | SP2: INNATE |
| 2 Decision Gate | SP2: INNATE |
| 3.1 Relevance Scoring | SP3: ADAPTIVE |
| 3.2 Reasoning Gate | SP3: ADAPTIVE |
| 4.1 Method Application | SP3: ADAPTIVE |
| 4.2 Anomaly Detection | SP3: ADAPTIVE |
| 4.3 Hypothesis Generation | SP3: ADAPTIVE |
| 5.1 Finding Consolidation | SP4: CONSOLIDATE |
| 5.2 Challenge Protocol | SP4: CONSOLIDATE |
| 6.1 Results Recording | SP4: CONSOLIDATE (4C) |
| 6.2 Knowledge Injection | SP4: CONSOLIDATE (4D) |
| 6.3 Method Effectiveness | SP4: CONSOLIDATE (4C) |
| 6.4 Adaptation Feedback | SP4: CONSOLIDATE (4E) |
| 7 Escalation | SP5: FINALIZE |
| Output | SP5: FINALIZE |

---

## Appendix C: Token Savings Model

```
V7.1 (15 turns, 20K base, 5K/turn output):
  Turn 1:  20K in
  Turn 2:  25K in
  ...
  Turn 15: 90K in
  TOTAL: ~825K cumulative input (observed ~230K with optimizations)

V7.1.1 (5 turns, 20K base, 8K/turn output):
  Turn 1:  20K in
  Turn 2:  28K in
  Turn 3:  36K in
  Turn 4:  44K in
  Turn 5:  52K in
  TOTAL: ~180K cumulative input → ~75K with same optimizations

Expected reduction: 67%
```

---

## Appendix D: Learning Weight Formula & Tradeoffs

### Learning Weight Formula (from V7.1)

```
Method effectiveness score:

score(M) =
  (findings_confirmed / findings_claimed) × 0.4 +
  (1 - false_positive_rate) × 0.3 +
  (findings / tokens_used) × 0.2 +
  user_feedback_score × 0.1

Weight update:
new_weight(M) = old_weight(M) × 0.9 + score(M) × 0.1

Method retirement threshold:
If weight(M) < 0.3 for 10 consecutive runs → flag for removal review
```

### V7.1.1 Batching Tradeoffs

| Tradeoff | V7.1 Behavior | V7.1.1 Behavior | Impact | Mitigation |
|----------|---------------|-----------------|--------|------------|
| Sequential Learning | Phase N informs Phase N+1 | Phases execute in parallel within super-phase | May miss findings dependent on prior phase results | For CRITICAL artifacts, consider V7.1 full execution |
| Template Traceability | Full columns (First Def, Later Usage) | Restored in V7.1.1 | Minimal after fix | N/A |
| Adaptation Feedback | Explicit "What Worked/Didn't" | Restored in V7.1.1 (4E) | Minimal after fix | N/A |
| Token Efficiency | ~230K/task | ~75K/task | 67% cost reduction | Primary benefit |

### When to Use V7.1 vs V7.1.1

| Scenario | Recommended |
|----------|-------------|
| Standard verification | **V7.1.1** (token efficient) |
| CRITICAL artifacts | **V7.1** (maximum rigor) |
| Expert-difficulty domains | **V7.1** (sequential learning valuable) |
| Budget-constrained | **V7.1.1** (67% savings) |
| High-volume batch verification | **V7.1.1** (scalable) |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 7.1.1 | 2026-01-16 | TOKEN-OPT: Batched 15→5 super-phases. FIX: Restored Adaptation Feedback (4E), Learning Weight Formula (App D), template columns, defined Detection Power operationally, documented tradeoffs. |
| 7.1 | 2026-01-15 | EVOLUTION: Error Theory integration, seeded selection, knowledge injection |
| 7.0 | 2026-01-13 | MAJOR: Adaptive Verification System architecture |
