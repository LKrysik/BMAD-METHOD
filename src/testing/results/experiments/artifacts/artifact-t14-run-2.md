# Self-Modifying Workflow Engine - Technical Specification (Run 2)

## Executive Summary

This specification defines a workflow engine capable of observing its own performance and making modifications to improve verification effectiveness while maintaining safety constraints.

---

## 1. System Design

### 1.1 Core Components

```
┌────────────────────────────────────────────────────────────────┐
│                   Self-Modifying Engine                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│   │ Executor │──▶│ Monitor  │──▶│ Analyzer │──▶│ Evolver  │  │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘  │
│        │              │              │              │          │
│        │              │              │              │          │
│        └──────────────┴──────────────┴──────────────┘          │
│                              │                                  │
│                              ▼                                  │
│                    ┌──────────────────┐                        │
│                    │ Workflow Config  │                        │
│                    │ (mutable state)  │                        │
│                    └──────────────────┘                        │
│                              │                                  │
│                    ┌─────────▼─────────┐                       │
│                    │ Safety Validator  │                       │
│                    └───────────────────┘                       │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Workflow Configuration

### 2.1 Schema

```typescript
interface WorkflowConfig {
  id: string;
  version: number;
  createdAt: Date;
  modifiedAt: Date;

  phases: PhaseConfig[];
  methodBank: MethodConfig[];
  settings: EngineSettings;
}

interface PhaseConfig {
  id: string;
  name: string;
  order: number;
  isProtected: boolean;
  methodIds: number[];
  weight: number;
  enabled: boolean;
}

interface MethodConfig {
  id: number;
  weight: number;
  enabled: boolean;
  assignedPhases: string[];
}

interface EngineSettings {
  minMethods: number;          // default: 15
  minPhases: number;           // default: 3
  maxModsPerCycle: number;     // default: 5
  confidenceThreshold: number; // default: 0.95
}
```

---

## 3. Monitoring System

### 3.1 Metrics Collection

```typescript
interface ExecutionMetrics {
  sessionId: string;
  workflowVersion: number;

  // Per-phase metrics
  phaseMetrics: PhaseMetric[];

  // Overall metrics
  totalFindings: number;
  confirmedFindings: number;
  falsePositives: number;
  duration: number;
}

interface PhaseMetric {
  phaseId: string;
  methodsUsed: number[];
  findings: number;
  duration: number;
  skipped: boolean;
}

class MetricsCollector {
  private metrics: ExecutionMetrics[] = [];

  collect(execution: WorkflowExecution): void {
    this.metrics.push(this.extractMetrics(execution));
  }

  getMetrics(since: Date): ExecutionMetrics[] {
    return this.metrics.filter(m => m.timestamp >= since);
  }

  aggregate(period: 'day' | 'week' | 'month'): AggregatedMetrics {
    // Group and aggregate metrics by period
    return this.aggregateByPeriod(this.metrics, period);
  }
}
```

---

## 4. Analysis Engine

### 4.1 Pattern Recognition

```typescript
class PatternAnalyzer {
  analyzePatterns(metrics: ExecutionMetrics[]): AnalysisResult {
    return {
      ineffectivePhases: this.findIneffectivePhases(metrics),
      highValueMethods: this.findHighValueMethods(metrics),
      correlations: this.findMethodCorrelations(metrics),
      anomalies: this.detectAnomalies(metrics)
    };
  }

  private findIneffectivePhases(metrics: ExecutionMetrics[]): IneffectivePhase[] {
    const phaseStats = this.aggregatePhaseStats(metrics);
    const ineffective: IneffectivePhase[] = [];

    for (const [phaseId, stats] of phaseStats) {
      if (stats.avgFindings < 0.05 && stats.sampleSize >= 50) {
        ineffective.push({
          phaseId,
          avgFindings: stats.avgFindings,
          sampleSize: stats.sampleSize,
          recommendation: 'CONSIDER_REMOVAL'
        });
      }
    }

    return ineffective;
  }

  private findMethodCorrelations(metrics: ExecutionMetrics[]): Correlation[] {
    // Find methods that often produce findings together
    const correlations: Correlation[] = [];
    const methodPairs = this.generateMethodPairs();

    for (const [m1, m2] of methodPairs) {
      const correlation = this.calculateCorrelation(metrics, m1, m2);
      if (correlation > 0.7) {
        correlations.push({ method1: m1, method2: m2, correlation });
      }
    }

    return correlations;
  }
}
```

### 4.2 Effectiveness Calculation

```typescript
interface EffectivenessScore {
  overall: number;
  byPhase: Map<string, number>;
  byMethod: Map<number, number>;
  trend: 'improving' | 'stable' | 'declining';
}

function calculateEffectiveness(metrics: ExecutionMetrics[]): EffectivenessScore {
  const confirmed = metrics.reduce((sum, m) => sum + m.confirmedFindings, 0);
  const total = metrics.reduce((sum, m) => sum + m.totalFindings, 0);
  const duration = metrics.reduce((sum, m) => sum + m.duration, 0);

  // Effectiveness = (confirmed findings per unit time) * precision
  const precision = total > 0 ? confirmed / total : 0;
  const findingsPerHour = (confirmed / duration) * 3600000;

  return {
    overall: findingsPerHour * precision,
    byPhase: calculatePhaseEffectiveness(metrics),
    byMethod: calculateMethodEffectiveness(metrics),
    trend: calculateTrend(metrics)
  };
}
```

---

## 5. Evolution Engine

### 5.1 Modification Proposals

```typescript
interface ModificationProposal {
  id: string;
  type: ModType;
  target: string;
  change: any;
  reason: string;
  confidence: number;
  expectedImpact: number;
  requiresApproval: boolean;
}

type ModType =
  | 'WEIGHT_ADJUSTMENT'
  | 'METHOD_ADDITION'
  | 'METHOD_REMOVAL'
  | 'PHASE_ADDITION'
  | 'PHASE_REMOVAL'
  | 'PHASE_REORDER';

class EvolutionEngine {
  proposeModifications(analysis: AnalysisResult): ModificationProposal[] {
    const proposals: ModificationProposal[] = [];

    // Propose weight adjustments
    for (const phase of analysis.ineffectivePhases) {
      if (!this.isProtected(phase.phaseId)) {
        proposals.push({
          id: generateId(),
          type: 'WEIGHT_ADJUSTMENT',
          target: phase.phaseId,
          change: { weight: 0.5 },  // reduce weight
          reason: `Low effectiveness: ${phase.avgFindings} findings/session`,
          confidence: phase.sampleSize / 100,
          expectedImpact: -0.1,  // slight negative expected
          requiresApproval: false
        });
      }
    }

    // Propose method additions based on correlations
    for (const correlation of analysis.correlations) {
      // If two methods correlate, suggest adding them to same phase
      proposals.push(this.createMethodGroupProposal(correlation));
    }

    return proposals;
  }
}
```

### 5.2 Modification Application

```typescript
class ModificationApplier {
  async apply(proposal: ModificationProposal): Promise<ApplyResult> {
    // Validate against safety constraints
    const validation = this.safetyValidator.validate(proposal);
    if (!validation.valid) {
      return { success: false, reason: validation.reason };
    }

    // Check if approval needed
    if (proposal.requiresApproval) {
      const approved = await this.requestApproval(proposal);
      if (!approved) {
        return { success: false, reason: 'Not approved' };
      }
    }

    // Create rollback point
    const rollbackId = this.snapshotManager.create();

    try {
      // Apply modification
      await this.applyChange(proposal);

      return { success: true, rollbackId };
    } catch (error) {
      // Rollback on failure
      this.snapshotManager.restore(rollbackId);
      return { success: false, reason: error.message };
    }
  }
}
```

---

## 6. Safety System

### 6.1 Constraint Validator

```typescript
class SafetyValidator {
  private constraints: SafetyConstraint[] = [
    {
      name: 'PHASE_0_PROTECTED',
      check: (proposal) => {
        if (proposal.type === 'PHASE_REMOVAL' && proposal.target === 'phase-0') {
          return { valid: false, reason: 'Phase 0 (Self-Check) cannot be removed' };
        }
        return { valid: true };
      }
    },
    {
      name: 'MIN_METHODS',
      check: (proposal) => {
        if (proposal.type === 'METHOD_REMOVAL') {
          const currentCount = this.countMethods();
          if (currentCount <= 15) {
            return { valid: false, reason: 'Cannot have fewer than 15 methods' };
          }
        }
        return { valid: true };
      }
    },
    {
      name: 'LOOP_DETECTION',
      check: (proposal) => {
        if (this.wouldCreateLoop(proposal)) {
          return { valid: false, reason: 'Modification would create circular dependency' };
        }
        return { valid: true };
      }
    }
  ];

  validate(proposal: ModificationProposal): ValidationResult {
    for (const constraint of this.constraints) {
      const result = constraint.check(proposal);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
  }
}
```

### 6.2 Loop Prevention

```typescript
class LoopDetector {
  private modificationHistory: ModificationRecord[] = [];
  private readonly CYCLE_THRESHOLD = 3;

  detectLoop(proposal: ModificationProposal): boolean {
    // Check if we're oscillating between states
    const recent = this.modificationHistory.slice(-10);

    // Look for patterns like A→B→A→B
    const key = `${proposal.type}:${proposal.target}`;
    const occurrences = recent.filter(m => m.key === key).length;

    if (occurrences >= this.CYCLE_THRESHOLD) {
      return true;  // Potential infinite loop
    }

    return false;
  }

  record(proposal: ModificationProposal): void {
    this.modificationHistory.push({
      key: `${proposal.type}:${proposal.target}`,
      timestamp: Date.now(),
      proposal
    });
  }
}
```

---

## 7. A/B Testing Framework

### 7.1 Experiment Design

```typescript
interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  control: WorkflowConfig;
  treatment: WorkflowConfig;
  trafficSplit: number;  // 0.5 = 50/50
  startDate: Date;
  endDate?: Date;
  minSamples: number;
  metrics: ExperimentMetrics;
}

class ExperimentRunner {
  async run(experiment: Experiment): Promise<ExperimentResult> {
    while (!this.hasEnoughData(experiment)) {
      const session = await this.getNextSession();
      const variant = this.assign(session, experiment);

      const config = variant === 'control'
        ? experiment.control
        : experiment.treatment;

      const result = await this.execute(session, config);
      this.recordResult(experiment, variant, result);
    }

    return this.analyze(experiment);
  }

  private assign(session: Session, experiment: Experiment): 'control' | 'treatment' {
    const hash = this.hashSessionId(session.id);
    return hash < experiment.trafficSplit ? 'control' : 'treatment';
  }

  private analyze(experiment: Experiment): ExperimentResult {
    const controlMetrics = experiment.metrics.control;
    const treatmentMetrics = experiment.metrics.treatment;

    const pValue = this.calculatePValue(controlMetrics, treatmentMetrics);
    const significant = pValue < 0.05;

    return {
      winner: this.determineWinner(controlMetrics, treatmentMetrics),
      pValue,
      significant,
      recommendation: significant ? 'APPLY_TREATMENT' : 'KEEP_CONTROL'
    };
  }
}
```

---

## 8. Rollback System

### 8.1 Snapshot Management

```typescript
interface ConfigSnapshot {
  id: string;
  timestamp: Date;
  config: WorkflowConfig;
  trigger: 'pre-modification' | 'scheduled' | 'manual';
  metadata: Record<string, any>;
}

class SnapshotManager {
  private snapshots: ConfigSnapshot[] = [];
  private readonly MAX_SNAPSHOTS = 50;

  create(trigger: string = 'pre-modification'): string {
    const snapshot: ConfigSnapshot = {
      id: generateId(),
      timestamp: new Date(),
      config: deepClone(this.currentConfig),
      trigger,
      metadata: {}
    };

    this.snapshots.push(snapshot);
    this.prune();

    return snapshot.id;
  }

  restore(snapshotId: string): boolean {
    const snapshot = this.snapshots.find(s => s.id === snapshotId);
    if (!snapshot) return false;

    this.currentConfig = deepClone(snapshot.config);
    return true;
  }

  private prune(): void {
    while (this.snapshots.length > this.MAX_SNAPSHOTS) {
      this.snapshots.shift();
    }
  }
}
```

---

## 9. Human Approval Interface

```typescript
interface ApprovalRequest {
  id: string;
  proposal: ModificationProposal;
  analysis: AnalysisResult;
  recommendation: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  decidedAt?: Date;
  decidedBy?: string;
}

class ApprovalManager {
  async requestApproval(proposal: ModificationProposal): Promise<boolean> {
    const request: ApprovalRequest = {
      id: generateId(),
      proposal,
      analysis: this.currentAnalysis,
      recommendation: this.generateRecommendation(proposal),
      status: 'pending',
      submittedAt: new Date()
    };

    await this.notify(request);

    // Wait for decision (with timeout)
    return this.waitForDecision(request, 24 * 60 * 60 * 1000);  // 24 hours
  }
}
```

---

## 10. Assumptions

1. Workflow execution produces measurable outcomes
2. Historical effectiveness predicts future performance
3. Loop counter (N iterations) prevents infinite loops
4. A/B testing will have sufficient traffic
5. Human approvers respond within timeout

---

## 11. Limitations

1. **Effectiveness is indirect** - uses proxy metrics
2. **Self-evaluation paradox** - evaluating changes affects future data
3. **Loop counter is heuristic** - can't guarantee termination
4. **Requires traffic volume** - A/B testing needs many sessions
5. **Approval delays** - human approval adds latency

---

## 12. Safety Summary

| Requirement | Implementation |
|-------------|----------------|
| No Phase 0 removal | Protected phase list |
| Min 15 methods | Validation constraint |
| Reversible changes | Snapshot/rollback |
| A/B testing | Experiment framework |
| Human approval | Approval workflow |
| No infinite loops | Cycle detection + counter |
