# Incremental Method Effectiveness Learning - Design Document (Run 1)

## 1. Overview

### 1.1 Purpose
Design a system that tracks method effectiveness across verification sessions and learns to recommend better method combinations over time.

### 1.2 Goals
- Track which methods find real issues
- Learn method synergies
- Improve recommendations based on accumulated data
- Maintain user privacy

---

## 2. Data Model

### 2.1 Session Record

```typescript
interface VerificationSession {
  id: string;
  timestamp: Date;
  taskType: string;           // e.g., "architecture", "code", "protocol"
  taskCharacteristics: {
    complexity: 'low' | 'medium' | 'high';
    domain: string;
    size: number;             // lines/pages
  };
  methodsUsed: MethodUsage[];
  findings: Finding[];
  duration: number;           // ms
}

interface MethodUsage {
  methodId: number;
  phase: string;
  timeSpent: number;
  findingsProduced: string[]; // finding IDs
}

interface Finding {
  id: string;
  methodId: number;
  severity: 'critical' | 'important' | 'minor';
  confirmed: boolean;         // after challenge phase
  falsePositive: boolean;
}
```

### 2.2 Method Statistics

```typescript
interface MethodStats {
  methodId: number;
  totalUsages: number;
  findingsProduced: number;
  confirmedFindings: number;
  falsePositives: number;

  // Derived metrics
  precision: number;          // confirmed / produced
  recall: number;             // estimated via sampling
  f1Score: number;

  // Per task type
  taskTypeStats: Map<string, TaskTypeStats>;
}

interface TaskTypeStats {
  usages: number;
  findings: number;
  precision: number;
}
```

### 2.3 Synergy Matrix

```typescript
interface SynergyMatrix {
  // methodA -> methodB -> synergy score
  scores: Map<number, Map<number, number>>;

  // How to interpret:
  // score > 1.0: methods work well together
  // score = 1.0: independent
  // score < 1.0: redundant or conflicting
}
```

---

## 3. Learning Algorithm

### 3.1 Effectiveness Scoring

For each method, calculate effectiveness score:

```
effectiveness(m) = w1 * precision(m) + w2 * recall(m) + w3 * avgSeverity(m)

where:
  precision = confirmedFindings / totalFindings
  recall = estimated from random sampling
  avgSeverity = weighted average of finding severities

weights: w1=0.4, w2=0.3, w3=0.3
```

### 3.2 Synergy Learning

Calculate synergy between methods A and B:

```
synergy(A, B) = E[findings | A ∧ B] / (E[findings | A] + E[findings | B])

If synergy > 1.0: A and B find MORE together than sum of parts
If synergy < 1.0: A and B are redundant
```

### 3.3 Recommendation Algorithm

Given task characteristics, recommend methods:

```python
def recommend_methods(task, k=5):
    # Score each method for this task type
    scores = {}
    for method in all_methods:
        base_score = method.effectiveness
        task_bonus = method.taskTypeStats[task.type].precision
        scores[method] = base_score * (1 + task_bonus)

    # Select top-k with diversity
    selected = []
    for _ in range(k):
        best = max(scores, key=scores.get)
        selected.append(best)

        # Penalize similar methods (low synergy = redundant)
        for other in scores:
            synergy = synergy_matrix[best][other]
            if synergy < 1.0:
                scores[other] *= synergy

    return selected
```

---

## 4. Statistical Significance

### 4.1 Minimum Sample Size

Before trusting a method's statistics:
- Minimum 30 usages for basic stats
- Minimum 100 usages for synergy calculations
- Use Bayesian priors for cold start

### 4.2 Confidence Intervals

Report confidence intervals for all metrics:

```typescript
interface ConfidentMetric {
  value: number;
  confidence: number;        // 0-1
  sampleSize: number;
  confidenceInterval: [number, number];  // 95% CI
}
```

### 4.3 A/B Testing for Recommendations

When changing recommendation algorithm:
1. Split traffic 50/50
2. Run for minimum 100 sessions per arm
3. Compare using t-test
4. Require p < 0.05 to accept change

---

## 5. Concept Drift Handling

### 5.1 Detection

Monitor for distribution shifts:

```typescript
function detectDrift(recentWindow: Session[], historicalBaseline: Stats): boolean {
  const recentStats = computeStats(recentWindow);
  const drift = kullbackLeiblerDivergence(recentStats, historicalBaseline);
  return drift > DRIFT_THRESHOLD;  // e.g., 0.1
}
```

### 5.2 Adaptation

When drift detected:
1. Increase learning rate for affected methods
2. Decay historical data faster
3. Log drift event for analysis

---

## 6. Cold Start Strategy

### 6.1 Bayesian Priors

For new methods or task types:

```typescript
const defaultPrior = {
  precision: 0.5,           // assume 50% useful
  usages: 10,               // pseudo-count
  confidence: 0.1           // low confidence
};
```

### 6.2 Exploration Bonus

Recommend under-explored methods occasionally:

```
exploration_bonus(m) = sqrt(log(total_sessions) / usages(m))
```

---

## 7. Privacy Design

### 7.1 Data Minimization
- No user identifiers stored
- No task content stored
- Only aggregate statistics retained

### 7.2 Aggregation
- Session-level data deleted after 30 days
- Only method-level aggregates kept long-term

---

## 8. API Design

```typescript
interface EffectivenessTracker {
  // Recording
  startSession(taskCharacteristics: TaskChars): SessionId;
  recordMethodUsage(sessionId: SessionId, methodId: number): void;
  recordFinding(sessionId: SessionId, finding: FindingInput): void;
  endSession(sessionId: SessionId): void;

  // Querying
  getMethodStats(methodId: number): MethodStats;
  getSynergy(methodA: number, methodB: number): number;
  recommendMethods(task: TaskChars, k?: number): MethodRecommendation[];

  // Admin
  exportStats(): ExportBundle;
  detectDrift(): DriftReport;
}
```

---

## 9. Storage Design

```yaml
# File: effectiveness-data.yaml
schema_version: "1.0"

methods:
  1:
    name: "Stakeholder Round Table"
    stats:
      total_usages: 245
      findings: 89
      confirmed: 72
      false_positives: 17
    task_types:
      architecture:
        usages: 120
        precision: 0.85
      code:
        usages: 80
        precision: 0.78

synergies:
  1-2: 1.15   # methods 1 and 2 work well together
  1-3: 0.92   # methods 1 and 3 slightly redundant
```

---

## 10. Assumptions

1. Method effectiveness is relatively stable over time
2. Task characteristics predict which methods work
3. Finding confirmation is accurate ground truth
4. Sample sizes will be sufficient for learning
5. User behavior is representative

---

## 11. Limitations

1. **Recall estimation**: True recall unknown without exhaustive verification
2. **Cold start**: New methods have high uncertainty
3. **Feedback delay**: Confirmation may come much later
4. **Selection bias**: Only used methods are measured

---

## 12. Future Enhancements

1. Deep learning for task-method matching
2. Multi-armed bandit for exploration
3. Causal inference for true effectiveness
4. Cross-project learning
