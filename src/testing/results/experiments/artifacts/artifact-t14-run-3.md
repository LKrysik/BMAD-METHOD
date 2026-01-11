# Self-Modifying Workflow Engine - Architecture Document (Run 3)

## 1. Introduction

### 1.1 Purpose
Design a workflow engine that learns from verification outcomes and autonomously improves its configuration while maintaining safety constraints.

### 1.2 Key Capabilities
- Observe and measure workflow performance
- Identify optimization opportunities
- Apply safe modifications
- Validate improvements through experimentation
- Rollback unsuccessful changes

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Self-Modifying Workflow Engine                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────┐                                                     │
│  │  Workflow  │─────┐                                               │
│  │  Executor  │     │                                               │
│  └────────────┘     │                                               │
│                     ▼                                               │
│              ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │
│              │  Telemetry  │───▶│  Learning   │───▶│ Proposal   │  │
│              │  Collector  │    │  Engine     │    │ Generator  │  │
│              └─────────────┘    └─────────────┘    └─────┬──────┘  │
│                                                          │          │
│                                                          ▼          │
│                                                   ┌─────────────┐   │
│                                                   │   Safety    │   │
│                                                   │   Gateway   │   │
│                                                   └──────┬──────┘   │
│                                                          │          │
│                    ┌─────────────┐    ┌─────────────┐   │          │
│                    │  Rollback   │◀───│  Modifier   │◀──┘          │
│                    │  Manager    │    │  (apply)    │              │
│                    └─────────────┘    └─────────────┘              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Configuration Store                        │  │
│  │  (phases, methods, weights, history)                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model

### 3.1 Configuration

```typescript
interface EngineConfig {
  version: number;
  timestamp: Date;

  phases: Phase[];
  methods: Method[];
  rules: ModificationRule[];

  settings: {
    learningRate: number;
    explorationFactor: number;
    minConfidence: number;
    maxIterations: number;
  };
}

interface Phase {
  id: string;
  name: string;
  order: number;
  protected: boolean;
  methods: number[];
  weight: number;
  stats: PhaseStatistics;
}

interface Method {
  id: number;
  weight: number;
  enabled: boolean;
  stats: MethodStatistics;
}
```

### 3.2 Telemetry

```typescript
interface TelemetryEvent {
  sessionId: string;
  timestamp: Date;
  configVersion: number;
  event: ExecutionEvent | FindingEvent | ModificationEvent;
}

interface ExecutionEvent {
  type: 'phase_start' | 'phase_end' | 'method_applied';
  phaseId?: string;
  methodId?: number;
  duration?: number;
}

interface FindingEvent {
  type: 'finding_created' | 'finding_confirmed' | 'finding_rejected';
  findingId: string;
  sourcePhase: string;
  sourceMethod: number;
  severity: string;
}
```

---

## 4. Learning Engine

### 4.1 Statistics Aggregation

```typescript
class LearningEngine {
  private windowSize = 100;  // sessions

  updateStatistics(telemetry: TelemetryEvent[]): void {
    const window = telemetry.slice(-this.windowSize);

    // Update phase statistics
    for (const phase of this.config.phases) {
      phase.stats = this.aggregatePhaseStats(window, phase.id);
    }

    // Update method statistics
    for (const method of this.config.methods) {
      method.stats = this.aggregateMethodStats(window, method.id);
    }
  }

  private aggregatePhaseStats(events: TelemetryEvent[], phaseId: string): PhaseStatistics {
    const phaseEvents = events.filter(e =>
      e.event.type === 'phase_end' && e.event.phaseId === phaseId
    );

    const findings = events.filter(e =>
      e.event.type === 'finding_created' && e.event.sourcePhase === phaseId
    );

    return {
      executions: phaseEvents.length,
      totalFindings: findings.length,
      avgDuration: this.average(phaseEvents.map(e => e.event.duration || 0)),
      effectiveness: findings.length / Math.max(phaseEvents.length, 1)
    };
  }
}
```

### 4.2 Pattern Detection

```typescript
interface DetectedPattern {
  type: PatternType;
  confidence: number;
  evidence: any;
  suggestedAction: SuggestedAction;
}

type PatternType =
  | 'INEFFECTIVE_PHASE'
  | 'INEFFECTIVE_METHOD'
  | 'METHOD_SYNERGY'
  | 'PHASE_ORDERING'
  | 'REDUNDANCY';

class PatternDetector {
  detect(): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];

    // Find phases that consistently produce nothing
    for (const phase of this.config.phases) {
      if (!phase.protected && phase.stats.effectiveness < 0.05) {
        patterns.push({
          type: 'INEFFECTIVE_PHASE',
          confidence: Math.min(phase.stats.executions / 50, 1),
          evidence: phase.stats,
          suggestedAction: { type: 'REDUCE_WEIGHT', target: phase.id, value: 0.5 }
        });
      }
    }

    // Find methods that don't contribute
    for (const method of this.config.methods) {
      if (method.stats.effectiveness < 0.01) {
        patterns.push({
          type: 'INEFFECTIVE_METHOD',
          confidence: Math.min(method.stats.usages / 100, 1),
          evidence: method.stats,
          suggestedAction: { type: 'DISABLE_METHOD', target: method.id }
        });
      }
    }

    return patterns.filter(p => p.confidence >= this.config.settings.minConfidence);
  }
}
```

---

## 5. Proposal Generation

### 5.1 Modification Proposals

```typescript
interface ModificationProposal {
  id: string;
  type: ModificationType;
  target: string | number;
  change: any;
  reason: string;
  confidence: number;
  expectedImprovement: number;
  risk: 'low' | 'medium' | 'high';
  requiresApproval: boolean;
}

type ModificationType =
  | 'ADJUST_PHASE_WEIGHT'
  | 'ADJUST_METHOD_WEIGHT'
  | 'ADD_METHOD_TO_PHASE'
  | 'REMOVE_METHOD_FROM_PHASE'
  | 'ADD_PHASE'
  | 'REMOVE_PHASE'
  | 'REORDER_PHASES';

class ProposalGenerator {
  generate(patterns: DetectedPattern[]): ModificationProposal[] {
    return patterns.map(pattern => ({
      id: generateId(),
      type: this.mapActionToType(pattern.suggestedAction),
      target: pattern.suggestedAction.target,
      change: pattern.suggestedAction.value,
      reason: this.formatReason(pattern),
      confidence: pattern.confidence,
      expectedImprovement: this.estimateImprovement(pattern),
      risk: this.assessRisk(pattern),
      requiresApproval: this.needsApproval(pattern)
    }));
  }

  private needsApproval(pattern: DetectedPattern): boolean {
    // Structural changes require human approval
    return ['ADD_PHASE', 'REMOVE_PHASE'].includes(pattern.suggestedAction.type);
  }
}
```

---

## 6. Safety Gateway

### 6.1 Constraint Checking

```typescript
interface SafetyConstraint {
  name: string;
  description: string;
  check: (proposal: ModificationProposal, config: EngineConfig) => ConstraintResult;
}

interface ConstraintResult {
  passed: boolean;
  reason?: string;
}

const SAFETY_CONSTRAINTS: SafetyConstraint[] = [
  {
    name: 'PROTECTED_PHASES',
    description: 'Cannot remove or disable protected phases',
    check: (proposal, config) => {
      if (proposal.type === 'REMOVE_PHASE') {
        const phase = config.phases.find(p => p.id === proposal.target);
        if (phase?.protected) {
          return { passed: false, reason: 'Cannot remove protected phase' };
        }
      }
      return { passed: true };
    }
  },
  {
    name: 'MINIMUM_METHODS',
    description: 'Must maintain at least 15 active methods',
    check: (proposal, config) => {
      if (proposal.type === 'REMOVE_METHOD_FROM_PHASE' || proposal.type === 'ADJUST_METHOD_WEIGHT') {
        const activeCount = config.methods.filter(m => m.enabled).length;
        if (activeCount <= 15) {
          return { passed: false, reason: 'Cannot reduce below 15 methods' };
        }
      }
      return { passed: true };
    }
  },
  {
    name: 'ITERATION_LIMIT',
    description: 'Prevent infinite modification loops',
    check: (proposal, config) => {
      const recentMods = getRecentModifications(config, 1000);  // last 1 second
      if (recentMods.length >= 10) {
        return { passed: false, reason: 'Too many modifications - potential loop' };
      }
      return { passed: true };
    }
  }
];

class SafetyGateway {
  validate(proposal: ModificationProposal): ValidationResult {
    for (const constraint of SAFETY_CONSTRAINTS) {
      const result = constraint.check(proposal, this.config);
      if (!result.passed) {
        return {
          valid: false,
          failedConstraint: constraint.name,
          reason: result.reason
        };
      }
    }
    return { valid: true };
  }
}
```

### 6.2 Loop Prevention

```typescript
class LoopPrevention {
  private history: ModificationRecord[] = [];
  private readonly MAX_HISTORY = 1000;
  private readonly LOOP_THRESHOLD = 3;

  checkForLoop(proposal: ModificationProposal): boolean {
    const signature = this.getSignature(proposal);

    // Count recent occurrences of same modification type on same target
    const recent = this.history.filter(h =>
      h.signature === signature &&
      Date.now() - h.timestamp < 60000  // last minute
    );

    return recent.length >= this.LOOP_THRESHOLD;
  }

  record(proposal: ModificationProposal): void {
    this.history.push({
      signature: this.getSignature(proposal),
      timestamp: Date.now()
    });

    // Prune old history
    if (this.history.length > this.MAX_HISTORY) {
      this.history = this.history.slice(-this.MAX_HISTORY);
    }
  }

  private getSignature(proposal: ModificationProposal): string {
    return `${proposal.type}:${proposal.target}`;
  }
}
```

---

## 7. Modification Applier

### 7.1 Application Logic

```typescript
class ModificationApplier {
  async apply(proposal: ModificationProposal): Promise<ApplicationResult> {
    // Create rollback point
    const snapshotId = this.rollbackManager.snapshot();

    try {
      // Validate through safety gateway
      const validation = this.safetyGateway.validate(proposal);
      if (!validation.valid) {
        return { success: false, reason: validation.reason };
      }

      // Check for human approval if needed
      if (proposal.requiresApproval) {
        const approved = await this.approvalManager.request(proposal);
        if (!approved) {
          return { success: false, reason: 'Human approval denied' };
        }
      }

      // Apply the modification
      this.applyToConfig(proposal);

      // Record for loop detection
      this.loopPrevention.record(proposal);

      return { success: true, snapshotId };
    } catch (error) {
      // Rollback on error
      this.rollbackManager.restore(snapshotId);
      return { success: false, reason: error.message };
    }
  }
}
```

---

## 8. A/B Testing

### 8.1 Experiment Framework

```typescript
interface Experiment {
  id: string;
  hypothesis: string;
  control: EngineConfig;
  treatment: EngineConfig;
  allocation: number;  // % to treatment
  minSamples: number;
  startTime: Date;
  status: 'running' | 'concluded';
  results?: ExperimentResults;
}

class ABTestRunner {
  async runExperiment(experiment: Experiment): Promise<ExperimentResults> {
    const controlResults: SessionResult[] = [];
    const treatmentResults: SessionResult[] = [];

    while (!this.hasSignificance(controlResults, treatmentResults, experiment.minSamples)) {
      const session = await this.nextSession();
      const isControl = this.allocate(session, experiment) < (1 - experiment.allocation);

      const config = isControl ? experiment.control : experiment.treatment;
      const result = await this.runSession(session, config);

      if (isControl) {
        controlResults.push(result);
      } else {
        treatmentResults.push(result);
      }
    }

    return this.analyze(controlResults, treatmentResults);
  }

  private allocate(session: Session, experiment: Experiment): number {
    // Deterministic allocation based on session ID
    return parseInt(session.id.slice(-8), 16) / 0xFFFFFFFF;
  }

  private analyze(control: SessionResult[], treatment: SessionResult[]): ExperimentResults {
    const controlMean = this.mean(control.map(r => r.effectiveness));
    const treatmentMean = this.mean(treatment.map(r => r.effectiveness));

    const pValue = this.tTest(control, treatment);

    return {
      controlMean,
      treatmentMean,
      improvement: (treatmentMean - controlMean) / controlMean,
      pValue,
      significant: pValue < 0.05,
      recommendation: pValue < 0.05 && treatmentMean > controlMean
        ? 'ADOPT_TREATMENT'
        : 'KEEP_CONTROL'
    };
  }
}
```

---

## 9. Rollback Management

```typescript
interface Snapshot {
  id: string;
  timestamp: Date;
  config: EngineConfig;
  trigger: 'pre-modification' | 'scheduled' | 'manual';
}

class RollbackManager {
  private snapshots: Snapshot[] = [];
  private readonly MAX_SNAPSHOTS = 100;

  snapshot(trigger: string = 'pre-modification'): string {
    const id = generateId();
    this.snapshots.push({
      id,
      timestamp: new Date(),
      config: deepClone(this.currentConfig),
      trigger
    });

    this.prune();
    return id;
  }

  restore(snapshotId: string): boolean {
    const snapshot = this.snapshots.find(s => s.id === snapshotId);
    if (!snapshot) return false;

    this.currentConfig = deepClone(snapshot.config);
    this.emit('restored', { snapshotId, timestamp: snapshot.timestamp });
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

## 10. Human Approval

```typescript
interface ApprovalRequest {
  id: string;
  proposal: ModificationProposal;
  context: {
    currentConfig: EngineConfig;
    recentMetrics: AggregatedMetrics;
    similarPastChanges: ModificationRecord[];
  };
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  respondedAt?: Date;
  respondedBy?: string;
}

class ApprovalManager {
  async request(proposal: ModificationProposal): Promise<boolean> {
    const request: ApprovalRequest = {
      id: generateId(),
      proposal,
      context: this.buildContext(),
      status: 'pending',
      requestedAt: new Date()
    };

    await this.notifyApprovers(request);

    // Wait with timeout
    const response = await this.waitForResponse(request, 86400000);  // 24h

    return response?.status === 'approved';
  }
}
```

---

## 11. Assumptions

1. **Effectiveness measurable**: Confirmed findings represent verification value
2. **Patterns stable**: Historical patterns predict future behavior
3. **Loop detection sufficient**: Counter-based detection prevents infinite loops
4. **Traffic available**: Enough sessions for A/B testing significance
5. **Approvers responsive**: Human approvers respond within timeout

---

## 12. Limitations

1. **Proxy metrics**: Effectiveness is indirect measure of value
2. **Evaluation paradox**: Modifying system affects evaluation data
3. **Loop counter heuristic**: Cannot mathematically guarantee termination
4. **Cold start**: Needs history before learning is effective
5. **Approval latency**: Human approval introduces delays

---

## 13. Safety Matrix

| Requirement | Mechanism | Enforcement |
|-------------|-----------|-------------|
| Protect Phase 0 | `protected: true` | PROTECTED_PHASES constraint |
| Min 15 methods | Counter check | MINIMUM_METHODS constraint |
| Reversible | Snapshots | RollbackManager |
| Prove improvement | A/B testing | ExperimentFramework |
| Human approval | Approval workflow | ApprovalManager |
| No infinite loops | History + counter | LoopPrevention |
