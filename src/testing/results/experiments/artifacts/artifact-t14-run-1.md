# Self-Modifying Workflow Engine - Design Document (Run 1)

## 1. Overview

### 1.1 Purpose
Design an engine that observes workflow execution patterns and modifies itself to improve verification effectiveness over time.

### 1.2 Goals
- Learn from verification outcomes
- Optimize phase weights and method selection
- Add/remove phases based on patterns
- Maintain safety constraints
- Support rollback

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                  Self-Modifying Workflow Engine                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │    Observer     │───▶│    Learner      │───▶│   Modifier   │ │
│  │  (metrics)      │    │  (patterns)     │    │  (changes)   │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                     │                     │          │
│           ▼                     ▼                     ▼          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Workflow State                         │   │
│  │  (phases, methods, weights, history)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Safety Controller                       │   │
│  │  (constraints, rollback, human approval)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model

### 3.1 Workflow State

```typescript
interface WorkflowState {
  version: number;
  phases: Phase[];
  methodWeights: Map<number, number>;  // methodId -> weight
  globalSettings: Settings;
  history: StateSnapshot[];
}

interface Phase {
  id: string;
  name: string;
  required: boolean;  // e.g., Phase 0 cannot be removed
  methods: number[];
  weight: number;
  stats: PhaseStats;
}

interface PhaseStats {
  executions: number;
  findingsProduced: number;
  avgTimeMs: number;
  effectiveness: number;  // findings / executions
}
```

### 3.2 Observation Record

```typescript
interface ObservationRecord {
  sessionId: string;
  timestamp: Date;
  phaseResults: PhaseResult[];
  totalFindings: number;
  confirmedFindings: number;
  modifications: Modification[];
}

interface PhaseResult {
  phaseId: string;
  methods: number[];
  findings: Finding[];
  durationMs: number;
}
```

---

## 4. Observer Component

### 4.1 Metrics Collection

```typescript
class WorkflowObserver {
  private observations: ObservationRecord[] = [];

  observe(session: VerificationSession): void {
    const record: ObservationRecord = {
      sessionId: session.id,
      timestamp: new Date(),
      phaseResults: this.collectPhaseResults(session),
      totalFindings: session.findings.length,
      confirmedFindings: session.findings.filter(f => f.confirmed).length,
      modifications: []
    };

    this.observations.push(record);
    this.updatePhaseStats(record);
  }

  private updatePhaseStats(record: ObservationRecord): void {
    for (const result of record.phaseResults) {
      const phase = this.workflowState.phases.find(p => p.id === result.phaseId);
      if (phase) {
        phase.stats.executions++;
        phase.stats.findingsProduced += result.findings.length;
        phase.stats.avgTimeMs = this.runningAverage(
          phase.stats.avgTimeMs,
          result.durationMs,
          phase.stats.executions
        );
        phase.stats.effectiveness = phase.stats.findingsProduced / phase.stats.executions;
      }
    }
  }
}
```

---

## 5. Learner Component

### 5.1 Pattern Detection

```typescript
class PatternLearner {
  detectPatterns(observations: ObservationRecord[]): Pattern[] {
    const patterns: Pattern[] = [];

    // Pattern 1: Phase consistently finds nothing
    patterns.push(...this.detectIneffectivePhases(observations));

    // Pattern 2: Methods that work well together
    patterns.push(...this.detectMethodSynergies(observations));

    // Pattern 3: Sequence patterns (X always follows Y)
    patterns.push(...this.detectSequencePatterns(observations));

    return patterns;
  }

  private detectIneffectivePhases(observations: ObservationRecord[]): Pattern[] {
    const patterns: Pattern[] = [];
    const phases = this.workflowState.phases;

    for (const phase of phases) {
      if (phase.required) continue;

      // Check if phase consistently produces no findings
      const recentObs = observations.slice(-50);  // last 50 sessions
      const phaseFindings = recentObs.flatMap(o =>
        o.phaseResults.filter(r => r.phaseId === phase.id)
      );

      const avgFindings = phaseFindings.reduce((sum, r) => sum + r.findings.length, 0) / phaseFindings.length;

      if (avgFindings < 0.1 && phaseFindings.length >= 30) {
        patterns.push({
          type: 'INEFFECTIVE_PHASE',
          target: phase.id,
          confidence: this.calculateConfidence(phaseFindings.length),
          suggestedAction: 'REMOVE_PHASE'
        });
      }
    }

    return patterns;
  }
}
```

### 5.2 Effectiveness Scoring

```typescript
function calculateEffectiveness(phase: Phase): number {
  // Effectiveness = (confirmed findings / time spent) * weight
  const findingsPerMs = phase.stats.findingsProduced / phase.stats.avgTimeMs;
  return findingsPerMs * phase.weight;
}
```

---

## 6. Modifier Component

### 6.1 Modification Types

```typescript
type ModificationType =
  | 'ADJUST_WEIGHT'
  | 'ADD_METHOD'
  | 'REMOVE_METHOD'
  | 'ADD_PHASE'
  | 'REMOVE_PHASE'
  | 'REORDER_PHASES';

interface Modification {
  id: string;
  type: ModificationType;
  target: string;  // phaseId or methodId
  oldValue: any;
  newValue: any;
  reason: string;
  timestamp: Date;
  approved: boolean;
  appliedAt?: Date;
}
```

### 6.2 Modification Application

```typescript
class WorkflowModifier {
  async applyModification(mod: Modification): Promise<boolean> {
    // Save current state for rollback
    this.saveSnapshot();

    try {
      switch (mod.type) {
        case 'ADJUST_WEIGHT':
          this.adjustWeight(mod.target, mod.newValue);
          break;
        case 'ADD_METHOD':
          this.addMethod(mod.target, mod.newValue);
          break;
        case 'REMOVE_METHOD':
          this.removeMethod(mod.target, mod.newValue);
          break;
        case 'ADD_PHASE':
          await this.addPhase(mod.newValue);  // requires approval
          break;
        case 'REMOVE_PHASE':
          await this.removePhase(mod.target);  // requires approval
          break;
      }

      mod.appliedAt = new Date();
      return true;
    } catch (error) {
      this.rollback();
      return false;
    }
  }
}
```

---

## 7. Safety Controller

### 7.1 Constraint Enforcement

```typescript
class SafetyController {
  private readonly MIN_METHODS = 15;
  private readonly PROTECTED_PHASES = ['phase-0'];  // Self-Check
  private readonly MAX_MODIFICATIONS_PER_DAY = 10;

  validate(mod: Modification): ValidationResult {
    // Check against constraints
    if (mod.type === 'REMOVE_PHASE') {
      if (this.PROTECTED_PHASES.includes(mod.target)) {
        return { valid: false, reason: 'Cannot remove protected phase' };
      }
    }

    if (mod.type === 'REMOVE_METHOD') {
      const currentCount = this.countMethods();
      if (currentCount - 1 < this.MIN_METHODS) {
        return { valid: false, reason: `Cannot have fewer than ${this.MIN_METHODS} methods` };
      }
    }

    // Check modification rate
    if (this.recentModifications() >= this.MAX_MODIFICATIONS_PER_DAY) {
      return { valid: false, reason: 'Daily modification limit reached' };
    }

    return { valid: true };
  }

  requiresApproval(mod: Modification): boolean {
    return mod.type === 'ADD_PHASE' || mod.type === 'REMOVE_PHASE';
  }
}
```

### 7.2 Loop Prevention

```typescript
class LoopPrevention {
  private readonly MAX_ITERATIONS = 100;
  private iterationCount = 0;

  checkLoop(): boolean {
    this.iterationCount++;
    if (this.iterationCount > this.MAX_ITERATIONS) {
      this.halt();
      return true;  // Loop detected
    }
    return false;
  }

  reset(): void {
    this.iterationCount = 0;
  }

  private halt(): void {
    // Stop all modifications
    this.modifier.pause();
    this.notifyHuman('Potential infinite loop detected');
  }
}
```

---

## 8. A/B Testing

### 8.1 Experiment Framework

```typescript
interface ABExperiment {
  id: string;
  name: string;
  control: WorkflowState;
  treatment: WorkflowState;
  startDate: Date;
  endDate?: Date;
  results: {
    control: ExperimentMetrics;
    treatment: ExperimentMetrics;
  };
}

interface ExperimentMetrics {
  sessions: number;
  findings: number;
  confirmedFindings: number;
  avgDuration: number;
}

class ABTester {
  async runExperiment(experiment: ABExperiment): Promise<ExperimentResult> {
    // Split sessions between control and treatment
    const sessions = await this.collectSessions(experiment);

    for (const session of sessions) {
      const variant = this.assignVariant(session);
      const state = variant === 'control' ? experiment.control : experiment.treatment;

      const result = await this.runWithState(session, state);
      this.recordResult(experiment, variant, result);
    }

    return this.analyzeResults(experiment);
  }

  private assignVariant(session: Session): 'control' | 'treatment' {
    // Deterministic assignment based on session ID
    return hash(session.id) % 2 === 0 ? 'control' : 'treatment';
  }
}
```

---

## 9. Rollback Mechanism

### 9.1 State Snapshots

```typescript
class RollbackManager {
  private snapshots: StateSnapshot[] = [];
  private readonly MAX_SNAPSHOTS = 100;

  saveSnapshot(): void {
    const snapshot: StateSnapshot = {
      id: generateId(),
      timestamp: new Date(),
      state: deepClone(this.workflowState),
      reason: 'pre-modification'
    };

    this.snapshots.push(snapshot);

    // Keep only recent snapshots
    if (this.snapshots.length > this.MAX_SNAPSHOTS) {
      this.snapshots.shift();
    }
  }

  rollback(snapshotId?: string): void {
    const snapshot = snapshotId
      ? this.snapshots.find(s => s.id === snapshotId)
      : this.snapshots[this.snapshots.length - 1];

    if (snapshot) {
      this.workflowState = deepClone(snapshot.state);
      this.logRollback(snapshot);
    }
  }
}
```

---

## 10. Human Approval Workflow

```typescript
interface ApprovalRequest {
  id: string;
  modification: Modification;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  comments?: string;
}

class ApprovalWorkflow {
  async requestApproval(mod: Modification): Promise<ApprovalRequest> {
    const request: ApprovalRequest = {
      id: generateId(),
      modification: mod,
      requestedAt: new Date(),
      status: 'pending'
    };

    await this.notifyApprovers(request);
    return request;
  }

  async processApproval(requestId: string, approved: boolean, approver: string): Promise<void> {
    const request = await this.getRequest(requestId);

    request.status = approved ? 'approved' : 'rejected';
    request.approvedBy = approver;
    request.approvedAt = new Date();

    if (approved) {
      await this.modifier.applyModification(request.modification);
    }
  }
}
```

---

## 11. Assumptions

1. Effectiveness can be measured by confirmed findings
2. Historical patterns predict future performance
3. Modifications improve over baseline
4. Human approvers are available for structural changes
5. Loop counter prevents infinite loops

---

## 12. Limitations

1. **Effectiveness metric is proxy** - confirmed findings may not reflect true value
2. **Historical bias** - learns from past, may not adapt to new patterns
3. **Loop prevention is heuristic** - counter can't guarantee termination
4. **A/B testing requires volume** - needs many sessions for significance

---

## 13. Safety Guarantees

| Constraint | Enforcement |
|------------|-------------|
| Phase 0 protected | PROTECTED_PHASES list |
| Min 15 methods | Validation check |
| Structural changes | Human approval required |
| Infinite loops | MAX_ITERATIONS counter |
| Reversibility | State snapshots |
