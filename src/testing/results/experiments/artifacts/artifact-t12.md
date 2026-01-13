# Method Effectiveness Tracker - Architecture Design (Run 3)

## 1. Introduction

### 1.1 Purpose
Build a data-driven system to track method effectiveness and learn optimal method combinations for different verification tasks.

### 1.2 Scope
- Data collection during verification sessions
- Statistical analysis of method performance
- ML-based recommendation engine
- Privacy-preserving design

---

## 2. Core Components

### 2.1 Component Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                    Method Effectiveness Tracker                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────────┐  │
│  │  Telemetry  │──▶│   Stats     │──▶│   Recommendation        │  │
│  │  Collector  │   │   Engine    │   │   Service               │  │
│  └─────────────┘   └─────────────┘   └─────────────────────────┘  │
│         │                │                       │                 │
│         ▼                ▼                       ▼                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    Time-Series Store                         │  │
│  │            (method metrics, synergy scores)                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model

### 3.1 Method Performance Record

```typescript
interface MethodPerformance {
  methodId: number;
  methodName: string;
  category: MethodCategory;

  // Aggregate stats
  stats: {
    totalUsages: number;
    findingsGenerated: number;
    findingsConfirmed: number;
    findingsRejected: number;
    avgTimeToFinding: number;  // ms
  };

  // Computed metrics
  metrics: {
    precision: number;        // confirmed / generated
    yield: number;            // confirmed / usages
    efficiency: number;       // confirmed / time
  };

  // Per-context performance
  contextStats: Map<TaskContext, ContextStats>;

  // Time series for trend analysis
  weeklyMetrics: WeeklyMetric[];
}

interface WeeklyMetric {
  weekStart: Date;
  usages: number;
  precision: number;
  yield: number;
}
```

### 3.2 Method Synergy

```typescript
interface MethodSynergy {
  methodA: number;
  methodB: number;

  // Joint performance
  jointUsages: number;
  jointFindings: number;
  jointPrecision: number;

  // Synergy score: >1 = complementary, <1 = redundant
  synergyScore: number;

  // Statistical significance
  pValue: number;
  significant: boolean;
}
```

### 3.3 Task Context

```typescript
interface TaskContext {
  taskType: TaskType;
  domain: string;
  complexity: ComplexityLevel;
  size: SizeCategory;
}

enum TaskType {
  CODE_REVIEW = 'code_review',
  ARCHITECTURE = 'architecture',
  DOCUMENTATION = 'documentation',
  PROTOCOL = 'protocol',
  DESIGN = 'design'
}

enum ComplexityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

---

## 4. Learning System

### 4.1 Effectiveness Model

```python
class EffectivenessModel:
    """
    Predicts probability of method producing confirmed finding
    given task context.
    """

    def __init__(self):
        self.model = XGBClassifier(
            n_estimators=50,
            max_depth=4,
            learning_rate=0.1,
            objective='binary:logistic'
        )

    def train(self, sessions: List[Session]):
        X, y = self._prepare_data(sessions)

        # Time-based split to avoid leakage
        split_idx = int(len(X) * 0.8)
        X_train, y_train = X[:split_idx], y[:split_idx]
        X_val, y_val = X[split_idx:], y[split_idx:]

        self.model.fit(X_train, y_train)

        # Validate
        val_preds = self.model.predict_proba(X_val)[:, 1]
        auc = roc_auc_score(y_val, val_preds)

        return {'auc': auc}

    def predict(self, method_id: int, context: TaskContext) -> float:
        features = self._extract_features(method_id, context)
        return self.model.predict_proba([features])[0, 1]

    def _prepare_data(self, sessions):
        X, y = [], []
        for session in sessions:
            for method_usage in session.methods_used:
                features = self._extract_features(
                    method_usage.method_id,
                    session.context
                )
                label = 1 if method_usage.confirmed_findings > 0 else 0
                X.append(features)
                y.append(label)
        return np.array(X), np.array(y)

    def _extract_features(self, method_id, context):
        method = get_method(method_id)
        return [
            method.category_encoded,
            method.historical_precision,
            method.usages,
            context.task_type_encoded,
            context.complexity_encoded,
            context.domain_encoded,
            # Interaction: method-task alignment
            self._compute_alignment(method, context)
        ]
```

### 4.2 Synergy Learning

```python
def compute_synergy(method_a: int, method_b: int, sessions: List[Session]) -> float:
    """
    Synergy = P(finding | A and B) / (P(finding | A) + P(finding | B))

    > 1.0: complementary (use together)
    < 1.0: redundant (choose one)
    """
    both_used = [s for s in sessions if method_a in s.methods and method_b in s.methods]
    only_a = [s for s in sessions if method_a in s.methods and method_b not in s.methods]
    only_b = [s for s in sessions if method_b in s.methods and method_a not in s.methods]

    if len(both_used) < 20:
        return 1.0  # Not enough data

    p_joint = mean([s.has_confirmed_finding for s in both_used])
    p_a = mean([s.has_confirmed_finding for s in only_a]) if only_a else 0.5
    p_b = mean([s.has_confirmed_finding for s in only_b]) if only_b else 0.5

    expected_independent = p_a + p_b - p_a * p_b
    synergy = p_joint / expected_independent if expected_independent > 0 else 1.0

    return synergy
```

---

## 5. Recommendation Engine

### 5.1 Recommendation Algorithm

```python
class MethodRecommender:
    def __init__(self, model: EffectivenessModel, stats: MethodStats):
        self.model = model
        self.stats = stats

    def recommend(self, context: TaskContext, k: int = 5) -> List[Recommendation]:
        candidates = self._score_all_methods(context)
        selected = self._select_diverse(candidates, k)
        return self._add_explanations(selected, context)

    def _score_all_methods(self, context):
        scores = []
        for method in all_methods:
            ml_score = self.model.predict(method.id, context)
            historical = self.stats[method.id].precision
            confidence = min(1.0, self.stats[method.id].usages / 50)

            # Blend ML and historical based on data availability
            blended = confidence * ml_score + (1 - confidence) * historical

            scores.append({
                'method': method,
                'score': blended,
                'confidence': confidence
            })

        return sorted(scores, key=lambda x: x['score'], reverse=True)

    def _select_diverse(self, candidates, k):
        selected = []
        categories_used = set()

        for candidate in candidates:
            if len(selected) >= k:
                break

            method = candidate['method']

            # Ensure category diversity
            if method.category in categories_used and len(categories_used) < 3:
                continue

            selected.append(candidate)
            categories_used.add(method.category)

        return selected

    def _add_explanations(self, selected, context):
        for item in selected:
            method = item['method']
            item['explanation'] = f"Selected for {context.task_type}: " \
                f"precision={self.stats[method.id].precision:.0%}, " \
                f"good for {method.category}"
        return selected
```

---

## 6. Statistical Rigor

### 6.1 Significance Requirements

| Metric | Min Sample | Confidence |
|--------|------------|------------|
| Method precision | 30 usages | 95% CI |
| Synergy score | 50 joint usages | 90% CI |
| Model AUC | 200 sessions | Bootstrap CI |

### 6.2 Confidence Intervals

```python
def wilson_score_interval(successes, total, confidence=0.95):
    """Wilson score interval for binomial proportion."""
    z = norm.ppf(1 - (1 - confidence) / 2)
    n = total
    p = successes / n if n > 0 else 0

    denominator = 1 + z**2 / n
    centre = (p + z**2 / (2*n)) / denominator
    margin = z * sqrt((p * (1-p) + z**2 / (4*n)) / n) / denominator

    return (max(0, centre - margin), min(1, centre + margin))
```

### 6.3 A/B Testing

```python
class ABExperiment:
    def __init__(self, name, control, treatment):
        self.name = name
        self.control = control
        self.treatment = treatment
        self.assignments = {}
        self.outcomes = {'control': [], 'treatment': []}

    def get_variant(self, session_id):
        if session_id not in self.assignments:
            self.assignments[session_id] = 'treatment' if random.random() < 0.5 else 'control'
        return self.assignments[session_id]

    def record(self, session_id, effectiveness_score):
        variant = self.assignments.get(session_id)
        if variant:
            self.outcomes[variant].append(effectiveness_score)

    def analyze(self):
        from scipy.stats import mannwhitneyu
        stat, pvalue = mannwhitneyu(
            self.outcomes['control'],
            self.outcomes['treatment'],
            alternative='two-sided'
        )
        return {
            'control_mean': np.mean(self.outcomes['control']),
            'treatment_mean': np.mean(self.outcomes['treatment']),
            'p_value': pvalue,
            'significant': pvalue < 0.05,
            'sample_size': len(self.outcomes['control']) + len(self.outcomes['treatment'])
        }
```

---

## 7. Concept Drift

### 7.1 Detection

```python
def detect_drift(method_id, window_days=14, baseline_days=90):
    recent = get_method_stats(method_id, last_days=window_days)
    baseline = get_method_stats(method_id, last_days=baseline_days)

    # Compare distributions using KL divergence or chi-square
    drift_score = compute_drift(recent, baseline)

    if drift_score > DRIFT_THRESHOLD:
        return DriftAlert(
            method_id=method_id,
            drift_score=drift_score,
            recent_precision=recent.precision,
            baseline_precision=baseline.precision
        )
    return None
```

### 7.2 Adaptation

When drift detected:
1. Weight recent data more heavily (exponential decay)
2. Retrain model with sliding window
3. Flag affected recommendations as "under review"

---

## 8. Privacy

### 8.1 Data Handling

| Data | Collection | Storage | Retention |
|------|------------|---------|-----------|
| Task content | Never | N/A | N/A |
| User identity | Never | N/A | N/A |
| Method IDs | Yes | Aggregated | Permanent |
| Finding counts | Yes | Aggregated | 90 days |
| Session metadata | Yes | Anonymized | 30 days |

### 8.2 Anonymization

```python
def anonymize_for_export(stats):
    return {
        'method_stats': stats.method_aggregates,
        'synergy_matrix': stats.synergies,
        # Exclude: session-level data, any identifiers
    }
```

---

## 9. Cold Start

### 9.1 New Methods

For methods with <30 usages:
- Use category average as prior
- Apply exploration bonus to increase sampling
- Wide confidence intervals until data accumulates

### 9.2 New Task Types

For unseen task types:
- Find most similar known task type
- Use domain-weighted average of related types
- Mark recommendations as "exploratory"

---

## 10. Assumptions

1. **Independence**: Sessions are independent samples
2. **Stationarity**: Method effectiveness stable (short term)
3. **Observability**: Finding confirmation is accurate
4. **Representativeness**: Data reflects typical usage
5. **Causality**: Method use causes findings (not correlation only)

---

## 11. Known Limitations

1. Cannot measure true recall (unknown unknowns)
2. Selection bias in what methods get used
3. Confirmation quality varies by reviewer
4. Small sample sizes for rare method combinations
5. Model may overfit to historical patterns

---

## 12. Monitoring

| Metric | Description | Alert |
|--------|-------------|-------|
| Model AUC | Prediction quality | <0.55 |
| Coverage | % methods with data | <80% |
| Freshness | Days since last training | >7 |
| Drift count | Methods showing drift | >5 |
