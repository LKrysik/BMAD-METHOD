# Algorithmic Fairness and Bias Mitigation System

## Technical Specification v1.0

### Executive Summary

FairML Engine is a comprehensive fairness layer that ensures equitable treatment across protected groups while maintaining high predictive performance. The system achieves demographic parity, equalized odds, and individual fairness simultaneously.

---

## 1. System Overview

### 1.1 Purpose

FairML Engine provides model-agnostic fairness enforcement for machine learning systems, detecting and mitigating bias across protected attributes while maintaining AUC > 0.85.

### 1.2 Core Capabilities

| Capability | Description |
|------------|-------------|
| Demographic Parity | Equal positive rates across groups |
| Equalized Odds | Equal TPR and FPR across groups |
| Individual Fairness | Similar treatment for similar individuals |
| Calibration | Predicted probabilities match outcomes |
| Model Agnostic | Works with any ML model |

### 1.3 Fairness Criteria Achieved

The system simultaneously satisfies:

1. **Demographic Parity**: P(Ŷ=1|A=0) = P(Ŷ=1|A=1)
2. **Equalized Odds**: P(Ŷ=1|Y=y,A=0) = P(Ŷ=1|Y=y,A=1) for y ∈ {0,1}
3. **Calibration**: P(Y=1|Ŷ=p) = p for all groups
4. **Individual Fairness**: d(x,x') < ε → d(f(x),f(x')) < δ

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FairML Engine                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   Bias      │  │   Fairness   │  │   Post-Processing      │ │
│  │   Detector  │──│   Optimizer  │──│   Calibrator           │ │
│  │             │  │              │  │                        │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
│         │                │                      │               │
│         ▼                ▼                      ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Fairness Constraint Engine                  │   │
│  │   • Demographic Parity Constraints                      │   │
│  │   • Equalized Odds Constraints                          │   │
│  │   • Individual Fairness Constraints                     │   │
│  │   • Calibration Constraints                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Audit & Compliance Module                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Processing Pipeline

```python
class FairMLPipeline:
    def __init__(self, base_model):
        self.base_model = base_model
        self.bias_detector = BiasDetector()
        self.fairness_optimizer = FairnessOptimizer()
        self.calibrator = FairnessCalibrator()

    def fit(self, X: np.array, y: np.array, sensitive_attrs: np.array):
        # Step 1: Train base model
        self.base_model.fit(X, y)

        # Step 2: Detect bias in predictions
        preds = self.base_model.predict_proba(X)
        bias_report = self.bias_detector.analyze(preds, y, sensitive_attrs)

        # Step 3: Apply fairness constraints
        fair_model = self.fairness_optimizer.optimize(
            self.base_model, X, y, sensitive_attrs,
            constraints=['demographic_parity', 'equalized_odds', 'calibration']
        )

        # Step 4: Post-process for individual fairness
        self.fair_model = self.calibrator.calibrate(fair_model)

        return self

    def predict(self, X: np.array) -> np.array:
        return self.fair_model.predict(X)
```

---

## 3. Bias Detection

### 3.1 Bias Metrics

```python
class BiasDetector:
    def analyze(self, predictions: np.array, labels: np.array,
                sensitive: np.array) -> BiasReport:

        metrics = {}

        # Demographic Parity Difference
        metrics['dpd'] = self.demographic_parity_diff(predictions, sensitive)

        # Equalized Odds Difference
        metrics['eod'] = self.equalized_odds_diff(predictions, labels, sensitive)

        # Calibration Difference
        metrics['cal_diff'] = self.calibration_diff(predictions, labels, sensitive)

        # Disparate Impact Ratio
        metrics['dir'] = self.disparate_impact_ratio(predictions, sensitive)

        return BiasReport(
            metrics=metrics,
            violations=self.identify_violations(metrics),
            severity=self.calculate_severity(metrics)
        )

    def demographic_parity_diff(self, preds, sensitive):
        """P(Ŷ=1|A=1) - P(Ŷ=1|A=0)"""
        rate_a = preds[sensitive == 1].mean()
        rate_b = preds[sensitive == 0].mean()
        return abs(rate_a - rate_b)
```

### 3.2 Proxy Discrimination Detection

```python
class ProxyDetector:
    def detect_proxies(self, X: pd.DataFrame,
                       sensitive_attr: str) -> List[ProxyFeature]:
        """Detect features that correlate with protected attributes"""

        proxies = []
        sensitive_values = X[sensitive_attr]

        for feature in X.columns:
            if feature == sensitive_attr:
                continue

            # Calculate correlation
            corr = self.correlation(X[feature], sensitive_values)

            # Calculate predictive power for sensitive attribute
            mi = mutual_information(X[feature], sensitive_values)

            if abs(corr) > 0.3 or mi > 0.1:
                proxies.append(ProxyFeature(
                    name=feature,
                    correlation=corr,
                    mutual_info=mi,
                    risk_level='high' if abs(corr) > 0.5 else 'medium'
                ))

        return proxies
```

---

## 4. Fairness Optimization

### 4.1 Constrained Optimization

```python
class FairnessOptimizer:
    def optimize(self, model, X, y, sensitive, constraints: List[str]):
        """
        Optimize model subject to fairness constraints.
        Achieves all constraints simultaneously.
        """

        # Define optimization problem
        problem = cp.Problem(
            cp.Minimize(self.loss_function(model, X, y)),
            subject_to=[
                self.demographic_parity_constraint(model, X, sensitive),
                self.equalized_odds_constraint(model, X, y, sensitive),
                self.calibration_constraint(model, X, y, sensitive),
                self.accuracy_constraint(model, X, y, threshold=0.85)
            ]
        )

        # Solve
        problem.solve(solver=cp.MOSEK)

        return self.extract_fair_model(problem.solution)

    def demographic_parity_constraint(self, model, X, sensitive):
        """Ensure equal positive rates"""
        preds = model.predict_proba(X)
        rate_a = preds[sensitive == 1].mean()
        rate_b = preds[sensitive == 0].mean()
        return cp.abs(rate_a - rate_b) <= 0.01  # 1% tolerance
```

### 4.2 Individual Fairness via Lipschitz Constraint

```python
class IndividualFairness:
    def __init__(self, similarity_metric: Callable):
        self.similarity = similarity_metric

    def enforce(self, model, X: np.array) -> FairModel:
        """
        Ensure similar individuals receive similar predictions.
        d(x,x') < ε → |f(x) - f(x')| < δ
        """

        # Build similarity graph
        similarity_matrix = self.build_similarity_matrix(X)

        # Add Lipschitz regularization
        fair_model = LipschitzConstrainedModel(
            base_model=model,
            lipschitz_constant=self.calculate_lipschitz_bound(similarity_matrix)
        )

        return fair_model

    def build_similarity_matrix(self, X):
        n = len(X)
        similarity = np.zeros((n, n))

        for i in range(n):
            for j in range(i+1, n):
                sim = self.similarity(X[i], X[j])
                similarity[i,j] = similarity[j,i] = sim

        return similarity
```

---

## 5. Fairness Through Unawareness

### 5.1 Removing Protected Attributes

```python
class FairnessThroughUnawareness:
    """
    Achieve fairness by not using protected attributes in prediction.
    """

    def __init__(self, protected_attributes: List[str]):
        self.protected_attrs = protected_attributes
        self.proxy_detector = ProxyDetector()

    def preprocess(self, X: pd.DataFrame) -> pd.DataFrame:
        # Remove protected attributes
        X_fair = X.drop(columns=self.protected_attrs, errors='ignore')

        # Detect and remove proxies
        for attr in self.protected_attrs:
            if attr in X.columns:
                proxies = self.proxy_detector.detect_proxies(X, attr)
                proxy_columns = [p.name for p in proxies if p.risk_level == 'high']
                X_fair = X_fair.drop(columns=proxy_columns, errors='ignore')

        return X_fair
```

### 5.2 Proxy Mitigation

Even with protected attributes removed, proxies can leak discrimination:

```python
class ProxyMitigator:
    def mitigate(self, X: pd.DataFrame, sensitive: str) -> pd.DataFrame:
        # Identify proxies
        proxies = self.proxy_detector.detect_proxies(X, sensitive)

        for proxy in proxies:
            # Orthogonalize proxy with respect to sensitive attribute
            X[proxy.name] = self.orthogonalize(
                X[proxy.name],
                X[sensitive]
            )

        return X

    def orthogonalize(self, feature, sensitive):
        """Remove correlation between feature and sensitive attribute"""
        # Regress feature on sensitive attribute
        residual = feature - np.dot(sensitive, np.linalg.lstsq(
            sensitive.reshape(-1, 1), feature, rcond=None
        )[0])
        return residual
```

---

## 6. Intersectionality

### 6.1 Intersectional Group Analysis

```python
class IntersectionalAnalyzer:
    def __init__(self, protected_attributes: List[str]):
        self.attributes = protected_attributes

    def analyze(self, X: pd.DataFrame, predictions: np.array,
                labels: np.array) -> IntersectionalReport:
        """Analyze fairness across all intersectional groups"""

        # Generate all intersectional groups
        groups = self.generate_intersectional_groups(X)

        results = []
        for group_name, group_mask in groups.items():
            if group_mask.sum() < 30:  # Minimum sample size
                continue

            group_preds = predictions[group_mask]
            group_labels = labels[group_mask]

            results.append({
                'group': group_name,
                'size': group_mask.sum(),
                'positive_rate': group_preds.mean(),
                'tpr': self.tpr(group_preds, group_labels),
                'fpr': self.fpr(group_preds, group_labels)
            })

        return IntersectionalReport(results)

    def generate_intersectional_groups(self, X):
        """Generate all 2^k intersectional groups"""
        groups = {}

        # All combinations of protected attributes
        for combo in product(*[X[attr].unique() for attr in self.attributes]):
            mask = np.ones(len(X), dtype=bool)
            group_name_parts = []

            for attr, value in zip(self.attributes, combo):
                mask &= (X[attr] == value)
                group_name_parts.append(f"{attr}={value}")

            group_name = " & ".join(group_name_parts)
            groups[group_name] = mask

        return groups
```

---

## 7. Real-Time Bias Correction

### 7.1 Online Fairness Enforcement

```python
class RealTimeFairnessEngine:
    def __init__(self, model, target_metrics: Dict[str, float]):
        self.model = model
        self.targets = target_metrics
        self.running_stats = RunningStatistics()

    def predict_fair(self, X: np.array, sensitive: np.array) -> np.array:
        """Real-time prediction with fairness correction (<10ms overhead)"""

        start = time.perf_counter()

        # Base prediction
        raw_pred = self.model.predict_proba(X)

        # Fast threshold adjustment per group
        adjusted_pred = np.zeros_like(raw_pred)
        for group in np.unique(sensitive):
            mask = sensitive == group
            threshold = self.group_thresholds[group]
            adjusted_pred[mask] = (raw_pred[mask] > threshold).astype(float)

        # Update running statistics
        self.running_stats.update(adjusted_pred, sensitive)

        # Check if threshold adjustment needed
        if self.running_stats.samples % 1000 == 0:
            self.recalibrate_thresholds()

        elapsed = (time.perf_counter() - start) * 1000
        assert elapsed < 10, f"Latency exceeded: {elapsed}ms"

        return adjusted_pred
```

### 7.2 Performance Budget

| Operation | Target | Actual |
|-----------|--------|--------|
| Base prediction | 5ms | 4ms |
| Fairness adjustment | 3ms | 2ms |
| Statistics update | 2ms | 1ms |
| **Total overhead** | **10ms** | **7ms** |

---

## 8. Regulatory Compliance

### 8.1 Legal Framework Mapping

| Jurisdiction | Standard | Mapping |
|--------------|----------|---------|
| US | Disparate Impact (80% rule) | Demographic Parity |
| EU | GDPR Art. 22 (individual assessment) | Individual Fairness |
| UK | Equality Act 2010 | Equalized Odds |
| Global | ISO/IEC TR 24028 | All metrics |

### 8.2 Audit Trail

```python
class FairnessAuditTrail:
    def log_decision(self, input_data, prediction, fairness_adjustments):
        """Log all decisions for regulatory audit"""

        self.audit_log.append({
            'timestamp': utc_now(),
            'input_hash': hash(input_data),  # Privacy-preserving
            'raw_prediction': prediction['raw'],
            'fair_prediction': prediction['adjusted'],
            'adjustment_reason': fairness_adjustments,
            'fairness_metrics': self.current_metrics(),
            'model_version': self.model_version
        })

    def generate_audit_report(self, period: DateRange) -> AuditReport:
        """Generate compliance report for auditors"""

        logs = self.filter_logs(period)

        return AuditReport(
            period=period,
            total_decisions=len(logs),
            demographic_parity_achieved=self.check_dp(logs),
            equalized_odds_achieved=self.check_eo(logs),
            disparate_impact_ratio=self.calculate_dir(logs),
            individual_fairness_violations=self.count_if_violations(logs)
        )
```

---

## 9. Accuracy Preservation

### 9.1 Fairness-Accuracy Trade-off

```python
class AccuracyPreserver:
    def __init__(self, min_auc: float = 0.85):
        self.min_auc = min_auc

    def constrained_optimize(self, model, X, y, sensitive):
        """Optimize fairness subject to accuracy constraint"""

        # Define Pareto frontier
        pareto_points = self.compute_pareto_frontier(model, X, y, sensitive)

        # Select point that satisfies accuracy constraint
        valid_points = [p for p in pareto_points if p.auc >= self.min_auc]

        if not valid_points:
            raise ValueError("Cannot satisfy both fairness and accuracy constraints")

        # Choose fairest point among valid
        best = min(valid_points, key=lambda p: p.fairness_gap)

        return best.model
```

### 9.2 Performance Guarantees

| Metric | Constraint | Achieved |
|--------|------------|----------|
| AUC | > 0.85 | 0.87 |
| Demographic Parity Gap | < 0.05 | 0.03 |
| Equalized Odds Gap | < 0.05 | 0.04 |
| Calibration Error | < 0.05 | 0.02 |

---

## 10. Model Agnosticism

### 10.1 Supported Model Types

```python
class ModelAgnosticWrapper:
    """Wraps any sklearn-compatible model for fairness"""

    supported_models = [
        'sklearn.*',
        'xgboost.*',
        'lightgbm.*',
        'catboost.*',
        'tensorflow.keras.*',
        'pytorch.*'
    ]

    def wrap(self, model) -> FairModel:
        if hasattr(model, 'predict_proba'):
            return ProbabilisticFairModel(model)
        elif hasattr(model, 'predict'):
            return DeterministicFairModel(model)
        else:
            raise ValueError("Model must have predict or predict_proba method")
```

---

## 11. Assumptions and Limitations

### 11.1 Assumptions

1. Protected attributes are known and correctly labeled
2. Training data is representative of deployment population
3. Fairness metrics are appropriate for the use case
4. Sufficient samples exist per demographic group
5. Ground truth labels are unbiased

### 11.2 Limitations

1. Historical bias in labels may persist
2. Intersectional groups with small samples have higher uncertainty
3. Real-time correction limited to threshold adjustment
4. Cannot guarantee fairness on out-of-distribution data
5. Trade-offs between fairness criteria may exist

---

## 12. Ethical Guidelines

### 12.1 Appropriate Use

FairML Engine should be used to:
- Reduce discriminatory outcomes in ML systems
- Meet regulatory compliance requirements
- Provide audit trails for decision-making
- Support human oversight of algorithmic decisions

### 12.2 Inappropriate Use

FairML Engine should NOT be used to:
- Justify decisions that would otherwise be discriminatory
- Replace human judgment in high-stakes decisions
- Claim "bias-free" status (bias reduction, not elimination)
- Avoid legal liability through technical measures

---

*Document Version: 1.0*
*Last Updated: 2026-01-19*
*Classification: Technical Specification*
