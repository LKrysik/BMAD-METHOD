# Method Effectiveness Learning System - Technical Specification (Run 2)

## Executive Summary

This specification defines a machine learning system that tracks verification method effectiveness and provides intelligent recommendations for method selection.

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Effectiveness Learning System                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────────┐│
│  │  Collector   │  │   Learner    │  │   Recommender              ││
│  │  (tracking)  │  │   (model)    │  │   (inference)              ││
│  └──────────────┘  └──────────────┘  └────────────────────────────┘│
│         │                │                      │                   │
│         ▼                ▼                      ▼                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      Data Store                              │   │
│  │  (sessions, method stats, model parameters)                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Collection

### 2.1 Event Schema

```typescript
// Base event
interface TrackingEvent {
  eventId: string;
  sessionId: string;
  timestamp: Date;
  eventType: EventType;
}

enum EventType {
  SESSION_START = 'session_start',
  METHOD_USED = 'method_used',
  FINDING_CREATED = 'finding_created',
  FINDING_CONFIRMED = 'finding_confirmed',
  FINDING_REJECTED = 'finding_rejected',
  SESSION_END = 'session_end'
}

// Specific events
interface MethodUsedEvent extends TrackingEvent {
  eventType: 'method_used';
  methodId: number;
  methodName: string;
  phaseId: string;
  concernId?: string;
}

interface FindingEvent extends TrackingEvent {
  eventType: 'finding_created' | 'finding_confirmed' | 'finding_rejected';
  findingId: string;
  sourceMethodId: number;
  severity: Severity;
  depth: DepthLevel;
}
```

### 2.2 Session Context

```typescript
interface SessionContext {
  sessionId: string;
  startTime: Date;

  // Task characteristics (no content!)
  taskType: string;
  taskComplexity: number;  // 1-10 scale
  taskDomain: string;
  estimatedSize: number;

  // Workflow context
  workflowVersion: string;
  mode: 'auto' | 'guided';
}
```

---

## 3. Learning Model

### 3.1 Feature Engineering

For each (method, task) pair, extract features:

```typescript
interface MethodTaskFeatures {
  // Method features
  methodCategory: string;
  methodComplexity: number;

  // Task features
  taskType: string;
  taskComplexity: number;
  taskDomain: string;

  // Historical features
  methodPrecisionGlobal: number;
  methodPrecisionForTaskType: number;
  methodUsageCount: number;

  // Interaction features
  methodTaskTypeMatch: number;  // domain alignment
}
```

### 3.2 Model Architecture

Use gradient boosted trees for interpretability:

```python
from sklearn.ensemble import GradientBoostingClassifier

# Predict: will method M produce confirmed finding on task T?
model = GradientBoostingClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    min_samples_leaf=20  # for stability
)

# Features: method + task characteristics
# Target: 1 if method produced confirmed finding, 0 otherwise
```

### 3.3 Training Pipeline

```python
def train_model():
    # Collect training data
    X, y = prepare_training_data(sessions)

    # Train-test split (temporal!)
    X_train, X_test, y_train, y_test = temporal_split(X, y, test_ratio=0.2)

    # Train model
    model.fit(X_train, y_train)

    # Evaluate
    metrics = evaluate(model, X_test, y_test)

    # Only deploy if metrics meet threshold
    if metrics['auc'] > 0.65 and metrics['precision'] > 0.5:
        deploy_model(model)

    return model, metrics
```

---

## 4. Recommendation Engine

### 4.1 Scoring Function

```python
def score_method(method, task, model, stats):
    # ML prediction
    features = extract_features(method, task)
    ml_score = model.predict_proba(features)[1]

    # Historical baseline
    historical_score = stats[method.id].precision

    # Blend (favor ML as data grows)
    data_weight = min(1.0, stats[method.id].usages / 100)
    score = data_weight * ml_score + (1 - data_weight) * historical_score

    return score
```

### 4.2 Diversity Constraint

```python
def recommend_diverse(task, k=5):
    scores = {m: score_method(m, task) for m in methods}
    selected = []

    while len(selected) < k:
        # Find best remaining
        best = max(scores, key=scores.get)
        selected.append(best)

        # Penalize same-category methods
        for m in scores:
            if m.category == best.category:
                scores[m] *= 0.7  # diversity penalty

    return selected
```

### 4.3 Category Coverage

Ensure recommendations span multiple categories:

```python
def ensure_category_coverage(recommendations, min_categories=3):
    categories = set(m.category for m in recommendations)

    if len(categories) < min_categories:
        # Add methods from missing categories
        missing = ALL_CATEGORIES - categories
        for cat in missing:
            best_in_cat = max(
                (m for m in methods if m.category == cat),
                key=lambda m: m.score
            )
            recommendations.append(best_in_cat)

    return recommendations[:5]  # keep top 5
```

---

## 5. Statistical Validation

### 5.1 Significance Testing

```python
def is_significant(method_stats):
    n = method_stats.usages
    p = method_stats.precision

    # Wilson score interval
    z = 1.96  # 95% confidence
    denominator = 1 + z**2/n
    centre = (p + z**2/(2*n)) / denominator
    margin = z * sqrt((p*(1-p) + z**2/(4*n)) / n) / denominator

    return {
        'significant': n >= 30,
        'confidence_interval': (centre - margin, centre + margin),
        'sample_size': n
    }
```

### 5.2 A/B Testing Framework

```python
class ABTest:
    def __init__(self, control_model, treatment_model):
        self.control = control_model
        self.treatment = treatment_model
        self.results = {'control': [], 'treatment': []}

    def assign(self, session_id):
        # Deterministic assignment based on session ID
        return 'treatment' if hash(session_id) % 2 == 0 else 'control'

    def record_outcome(self, session_id, effectiveness):
        arm = self.assign(session_id)
        self.results[arm].append(effectiveness)

    def evaluate(self):
        from scipy.stats import ttest_ind
        t_stat, p_value = ttest_ind(
            self.results['control'],
            self.results['treatment']
        )
        return {
            'p_value': p_value,
            'significant': p_value < 0.05,
            'treatment_better': np.mean(self.results['treatment']) > np.mean(self.results['control'])
        }
```

---

## 6. Concept Drift Detection

### 6.1 Monitoring

```python
def monitor_drift():
    recent = get_sessions(last_days=7)
    baseline = get_sessions(days_ago=(30, 90))

    for method in methods:
        recent_precision = compute_precision(recent, method)
        baseline_precision = compute_precision(baseline, method)

        # Detect significant change
        if abs(recent_precision - baseline_precision) > 0.15:
            alert_drift(method, recent_precision, baseline_precision)
```

### 6.2 Adaptation

```python
def adapt_to_drift(method):
    # Increase learning rate for drifting method
    method.learning_rate *= 2

    # Decay old data faster
    method.decay_factor = 0.9  # was 0.99

    # Retrain model with recent data weighted higher
    retrain_model(recent_weight=3.0)
```

---

## 7. Privacy Protection

### 7.1 Data Minimization

| Data Type | Retention | Purpose |
|-----------|-----------|---------|
| Session events | 30 days | Training |
| Method aggregates | Forever | Recommendations |
| Model parameters | Forever | Inference |
| Task content | Never stored | - |

### 7.2 Anonymization

```python
def anonymize_session(session):
    return {
        'task_type': session.task_type,
        'task_complexity': bucket(session.complexity, [1,3,5,7,10]),
        'method_ids': session.method_ids,
        'finding_counts': len(session.findings),
        # No: user_id, task_content, timestamps (beyond day)
    }
```

---

## 8. Cold Start Handling

### 8.1 Prior Distribution

```python
# For new methods
default_prior = {
    'precision_alpha': 1,  # Beta(1,1) = uniform
    'precision_beta': 1,
    'expected_precision': 0.5
}

# For new task types
def estimate_from_similar(new_task_type):
    similar = find_similar_task_types(new_task_type)
    return weighted_average([s.stats for s in similar])
```

### 8.2 Exploration Strategy

```python
def exploration_score(method):
    # UCB-style exploration bonus
    total = sum(m.usages for m in methods)
    bonus = sqrt(2 * log(total) / (method.usages + 1))
    return method.score + bonus * EXPLORATION_WEIGHT
```

---

## 9. Assumptions

1. Verification sessions are independent
2. Method effectiveness is measurable via confirmed findings
3. Task characteristics predict method relevance
4. Historical data is representative of future
5. User feedback (confirmation) is accurate

---

## 10. Limitations

1. **Feedback loop**: Recommendations affect what data we collect
2. **Sparse data**: Many method-task combinations rare
3. **Latent confounders**: Unobserved factors affect outcomes
4. **Label noise**: Confirmation process imperfect

---

## 11. Metrics & Monitoring

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Recommendation precision | >60% | <50% |
| Category diversity | ≥3 | <3 |
| Model AUC | >0.65 | <0.55 |
| Data freshness | <7 days | >14 days |
