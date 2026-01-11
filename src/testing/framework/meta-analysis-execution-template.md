# Meta-Analysis Execution Template

**Purpose:** Ready-to-use template for analyzing accumulated test results.

---

## 1. Data Collection

### Experiments Analyzed

| EXP-ID | Protocol | Task | Tokens | Time (s) | DR% | WDS | P | OES |
|--------|----------|------|--------|----------|-----|-----|---|-----|
| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |

### Protocol Versions Tracked

| Protocol | Versions Tested | Best Version | Worst Version |
|----------|-----------------|--------------|---------------|
| Deep Verify | | | |
| V-GD | | | |
| QVP | | | |
| UAQG | | | |

---

## 2. Pattern Discovery

### 2.1 Domain Shift Analysis (#103)

**FLOW Domain:**
- Where does information concentrate? ___
- Where does information leak? ___
- Bottleneck phases: ___

**GRAPH Domain:**
- Method clusters with synergy: ___
- Isolated methods (low co-occurrence): ___
- Hub methods (high connectivity): ___

**ENERGY Domain:**
- High-effort phases: ___
- Low-effort phases: ___
- Effort/result ratio by phase: ___

**TEMPORAL Domain:**
- Finding peak time: ___
- Diminishing returns point: ___
- Optimal stopping point: ___

### 2.2 Negative Space (#115)

**Untested protocols:**
1.
2.
3.

**Unconsidered approaches:**
1.
2.
3.

**Unmeasured metrics:**
1.
2.
3.

### 2.3 Paradigm Escape (#102)

**Current approaches' defining characteristics:**
| Approach | Characteristic |
|----------|----------------|
| | |
| | |

**N+1 Approach (differs from all):**
- Description: ___
- How it differs: ___
- Worth testing? Y/N
- Estimated impact: ___

---

## 3. Cross-Domain Insights

### Analogies Applied (#23)

| Source Domain | Principle | Application to Verification |
|---------------|-----------|----------------------------|
| | | |
| | | |
| | | |

### Best Analogy for Next Experiment:
- Domain: ___
- Principle: ___
- Experiment design: ___

---

## 4. Challenge Results

### 4.1 Failure Paths (#109)

| Failure Path | Protocol Scores (1-5) |
|--------------|----------------------|
| | DV: __ VGD: __ QVP: __ UAQG: __ |
| Single-pass | |
| Ignoring context | |
| Fixed methods | |
| No falsification | |
| Metric gaming | |

**Most vulnerable protocol:** ___
**Most robust protocol:** ___

### 4.2 Essential Elements (#122)

| Protocol | Load-bearing Elements | Decorative Elements |
|----------|----------------------|---------------------|
| | | |
| | | |

**Recommendation:** Remove decorative elements from ___

### 4.3 Paradoxical Additions (#124)

| Element | Expected | Actual | Verdict |
|---------|----------|--------|---------|
| | | | KEEP/REMOVE |
| | | | |

---

## 5. SCAMPER Innovation

### S - SUBSTITUTE
What to replace: ___
With what: ___
Expected impact: ___

### C - COMBINE
What to merge: ___
Expected impact: ___

### A - ADAPT
What to borrow: ___
From where: ___
Expected impact: ___

### M - MODIFY
What to change: ___
How: ___
Expected impact: ___

### P - PUT TO OTHER USE
New application: ___
Expected value: ___

### E - ELIMINATE
What to remove: ___
Token savings: ___
Risk: ___

### R - REVERSE
What to invert: ___
Expected insight: ___

---

## 6. Cost-Benefit Analysis

### Token Distribution

| Phase/Element | Token % | Finding % | Efficiency (F/T) |
|---------------|---------|-----------|------------------|
| | | | |
| | | | |
| | | | |

### Optimization Targets

**Cut (high cost, low value):**
1. ___ : __% tokens, __% findings
2. ___ : __% tokens, __% findings

**Expand (low cost, high value):**
1. ___ : __% tokens, __% findings
2. ___ : __% tokens, __% findings

**Net projection:**
- Token change: ___%
- Detection change: ___%
- OES change: ___

---

## 7. Synthesis

### Agreements (multiple methods confirm):

1. ___ (sources: #___, #___, #___)
2. ___ (sources: #___, #___, #___)

### Contradictions (methods disagree):

1. ___ (#___ says X, #___ says Y)
   - Resolution: ___

### Unified Narrative:

> [One paragraph summarizing what analysis reveals about verification optimization]

---

## 8. Recommendations

### DO (immediate, confident):

| # | Recommendation | Evidence | Expected Impact |
|---|----------------|----------|-----------------|
| 1 | | | |
| 2 | | | |

### TRY (experiment needed):

| # | Experiment | Hypothesis | How to Validate |
|---|------------|------------|-----------------|
| 1 | | | |
| 2 | | | |

### AVOID (proven harmful):

| # | Anti-pattern | Evidence of Harm |
|---|--------------|------------------|
| 1 | | |
| 2 | | |

### INVESTIGATE (curiosity-driven):

| # | Area | Why Interesting |
|---|------|-----------------|
| 1 | | |
| 2 | | |

---

## 9. Radical Proposals

### Surprising Approach (#123):

**Proposal:** ___

**Why surprising:** ___

**Hypothesis:** ___

**Test design:** ___

**Success criteria:** ___

### Theoretical Foundation to Explore:

**Discipline:** ___

**Concept:** ___

**Application:** ___

**Next step:** ___

---

## 10. Action Plan

### Immediate (next experiment):
- [ ] Change 1: ___
- [ ] Change 2: ___
- [ ] Change 3: ___

### Short-term (next 3 experiments):
- [ ] Experiment: ___
- [ ] Experiment: ___

### Long-term (research):
- [ ] Investigate: ___
- [ ] Prototype: ___

---

## Meta-Analysis Summary

**Date:** ___
**Experiments analyzed:** ___
**Key insight:** ___
**Primary recommendation:** ___
**Biggest opportunity:** ___
**Biggest risk to avoid:** ___

---

**Save to:** `src/testing/results/analysis/meta-analysis-[YYYY-MM-DD].md`
