# Process: ML Systems Verification

## Triggers

Keywords that activate this process:
- model, ML model
- training, trained
- inference, prediction
- accuracy, precision, recall, F1
- dataset, data
- neural, deep learning
- AI, artificial intelligence
- feature, embedding
- overfitting, underfitting
- bias, fairness (in ML context)
- explainable, interpretable

---

## Steps

### Step 1: Extract ML Claims

**Do:** List ALL claims about ML capabilities.

Look for these claim types:
- Model performance (accuracy, etc.)
- Training requirements
- Inference latency
- Data requirements
- Explainability
- Fairness/bias

**Output Format:**
```
| Claim Type | Claimed? | Location | Exact Quote |
|------------|----------|----------|-------------|
| Accuracy | [metric] | §[X] | "[quote]" |
| Latency | [time] | §[X] | "[quote]" |
| Data Needs | [amount] | §[X] | "[quote]" |
| Explainable | YES/NO | §[X] | "[quote]" |
| Fair/Unbiased | YES/NO | §[X] | "[quote]" |
```

---

### Step 2: Check Performance Metric Appropriateness

**Do:** Verify claimed metrics are appropriate for the problem.

**Uses:** domain-knowledge-base.md §2.ML Terms

**Metric Checks:**
```
| Problem Type | Appropriate Metrics | Inappropriate |
|--------------|---------------------|---------------|
| Imbalanced classes | Precision, Recall, F1, AUC | Accuracy alone |
| Regression | MSE, MAE, R² | Accuracy |
| Ranking | NDCG, MRR | Classification metrics |
| Detection | Precision-Recall curve | Single threshold |
```

**Red Flags:**
- "99% accuracy" on imbalanced dataset without class breakdown
- Single metric for complex task
- No confidence intervals or variance reported

**Output:** Metric appropriateness analysis

---

### Step 3: Check Data Requirements

**Do:** Verify data claims are realistic.

**Uses:** domain-knowledge-base.md §1.Machine Learning

**Data Checks:**
```
| Claim | Reality Check |
|-------|---------------|
| "Works with small data" | Deep learning needs lots of data without transfer/few-shot |
| "No labeled data needed" | Unsupervised has limitations |
| "Real-time training" | Most training is offline |
```

**Red Flags:**
- Deep learning + "works with small data" (without transfer learning)
- Complex task + "minimal training data"
- No mention of data quality requirements

**Output:** Data requirements analysis

---

### Step 4: Check Explainability Claims

**Do:** Verify explainability claims are accurate.

**Uses:** domain-knowledge-base.md §2.ML Terms

**Explainability Levels:**
```
| Level | What It Means | What It's NOT |
|-------|---------------|---------------|
| Interpretable | Inherently understandable (linear, tree) | Complex model + SHAP |
| Explainable | Can generate explanations | Guaranteed accurate explanations |
| Post-hoc | After-the-fact explanation | Same as model reasoning |
```

**Red Flags:**
- "Fully explainable" deep learning
- "Transparent" neural network
- Post-hoc explanations presented as model reasoning

**Output:** Explainability analysis

---

### Step 5: Check Bias/Fairness Claims

**Do:** Verify fairness claims are substantiated.

**Fairness Checks:**
```
| Claim | Verification Needed |
|-------|---------------------|
| "Unbiased" | Which fairness metric? (demographic parity, equal opportunity, etc.) |
| "Fair" | Across which groups? |
| "No discrimination" | How measured and monitored? |
```

**Red Flags:**
- "Unbiased" without specifying fairness metric
- "Fair" without defining protected groups
- No ongoing bias monitoring

**Output:** Fairness assessment

---

## Finding Templates

### IMPORTANT Findings

**Metric Mismatch:**
```
Finding: Uses inappropriate metric for problem type.
Problem: [problem description]
Metric Used: [metric]
Issue: [why inappropriate]
Severity: IMPORTANT
Recommendation: Use [appropriate metrics] instead.
```

**Data Requirement Mismatch:**
```
Finding: Claims conflict with typical data requirements.
Claim: "[quote]"
Issue: [why unrealistic]
Severity: IMPORTANT
Recommendation: Clarify data strategy (transfer learning, etc.)
```

**Explainability Overclaim:**
```
Finding: Overstates explainability capabilities.
Claim: "[quote]"
Issue: Post-hoc explanations ≠ model interpretability.
Severity: IMPORTANT
Recommendation: Clarify explanation method and limitations.
```

**Fairness Ambiguity:**
```
Finding: Claims fairness without specifying metric.
Claim: "[quote]"
Issue: Different fairness definitions can conflict.
Severity: IMPORTANT
Recommendation: Specify fairness metrics and protected groups.
```

### MINOR Findings

**Missing Variance:**
```
Finding: Performance claims lack variance/confidence intervals.
Claim: "[quote]"
Issue: Single number hides variability.
Severity: MINOR
Recommendation: Report confidence intervals or multiple runs.
```

---

## Process Metrics

| Metric | Target |
|--------|--------|
| Steps | 5 |
| Tokens | 1.5-2.5K |
| Time | 2-3 min |
| Domain-KB sections used | §1.ML, §2.ML Terms, §3.ML Checklist |
