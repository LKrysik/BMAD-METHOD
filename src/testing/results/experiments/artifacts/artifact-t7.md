# Technical Design Document: Method Effectiveness Tracker

**Task ID:** T7
**Version:** 1.0
**Date:** 2026-01-12
**Author:** Expert Software Architect (AI Agent)

---

## Executive Summary

This document presents the technical design for a Method Effectiveness Tracker system that collects, analyzes, and reports on the effectiveness of verification methods used in the BMAD-METHOD workflow. The system tracks method usage across verification sessions, records findings generated and their confirmation status, calculates effectiveness metrics, identifies false-positive-prone methods, ensures statistical significance in evaluations, suggests effective method combinations, maintains user privacy, and supports data export for external analysis.

The architecture implements an event-driven data collection layer, a statistical analysis engine with significance testing, a combination discovery module using association rule mining, and a privacy-preserving export system. The design prioritizes data integrity, statistical rigor, and actionable insights.

---

## Architecture Overview

### High-Level Architecture

```
+-------------------+     +--------------------+     +------------------+
| Verification      |     | Data Collection    |     | Analytics        |
| Sessions          | --> | & Storage Layer    | --> | Engine           |
| (Events)          |     | (Event Store)      |     | (Metrics/Stats)  |
+-------------------+     +--------------------+     +------------------+
                                                            |
                                                            v
                          +--------------------+     +------------------+
                          | Export Service     | <-- | Reporting        |
                          | (Privacy Filter)   |     | Interface        |
                          +--------------------+     +------------------+
```

### Component Architecture

```
MethodEffectivenessTracker/
|-- collection/
|   |-- event-collector.ts      # Capture usage events
|   |-- session-tracker.ts      # Track verification sessions
|   |-- finding-linker.ts       # Link findings to methods
|   |-- confirmation-tracker.ts # Track finding outcomes
|
|-- storage/
|   |-- event-store.ts          # Event persistence
|   |-- aggregation-cache.ts    # Pre-computed aggregates
|   |-- schema.ts               # Data model definitions
|
|-- analytics/
|   |-- effectiveness-calculator.ts  # Core metrics
|   |-- significance-tester.ts       # Statistical tests
|   |-- false-positive-detector.ts   # FP analysis
|   |-- combination-analyzer.ts      # Method synergies
|
|-- reporting/
|   |-- metrics-reporter.ts     # Generate reports
|   |-- dashboard-data.ts       # Dashboard API
|   |-- trend-analyzer.ts       # Historical trends
|
|-- export/
|   |-- privacy-filter.ts       # PII removal
|   |-- export-formatter.ts     # Format for export
|   |-- anonymizer.ts           # Data anonymization
|
|-- utils/
|   |-- statistical-utils.ts    # Stats helpers
|   |-- sample-size-calculator.ts
```

---

## Detailed Design

### Requirement 1: Track Method Usage Across Verification Sessions

**Design Approach:**

Implement an event-driven tracking system:

```typescript
interface MethodUsageEvent {
  eventId: string;
  sessionId: string;
  methodId: string;
  methodName: string;
  methodCategory: string;
  timestamp: Date;
  context: UsageContext;
}

interface UsageContext {
  workflowPhase: string;
  artifactType: string;
  artifactComplexity: 'low' | 'medium' | 'high';
  precedingMethods: string[];  // Methods used before this one
}

interface VerificationSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  methodsUsed: string[];
  findingsGenerated: string[];
  status: 'active' | 'completed' | 'abandoned';
}

class SessionTracker {
  private activeSessions: Map<string, VerificationSession> = new Map();
  private eventStore: EventStore;

  startSession(sessionId: string): VerificationSession {
    const session: VerificationSession = {
      sessionId,
      startTime: new Date(),
      methodsUsed: [],
      findingsGenerated: [],
      status: 'active'
    };
    this.activeSessions.set(sessionId, session);
    return session;
  }

  recordMethodUsage(sessionId: string, event: MethodUsageEvent): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    session.methodsUsed.push(event.methodId);
    this.eventStore.append(event);
  }

  completeSession(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.endTime = new Date();
      session.status = 'completed';
      this.eventStore.append({ type: 'session-complete', session });
      this.activeSessions.delete(sessionId);
    }
  }
}
```

**Event Collection:**

```typescript
class EventCollector {
  private buffer: MethodUsageEvent[] = [];
  private readonly FLUSH_INTERVAL_MS = 5000;
  private readonly BUFFER_SIZE = 100;

  constructor(private store: EventStore) {
    this.startFlushTimer();
  }

  collect(event: MethodUsageEvent): void {
    this.buffer.push(event);
    if (this.buffer.length >= this.BUFFER_SIZE) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;
    const events = [...this.buffer];
    this.buffer = [];
    await this.store.batchAppend(events);
  }
}
```

---

### Requirement 2: Record Method, Finding Generated, Finding Confirmed/Rejected

**Design Approach:**

```typescript
interface MethodFindingRecord {
  recordId: string;
  methodId: string;
  sessionId: string;
  findingId: string | null;  // null if no finding generated
  findingOutcome: FindingOutcome;
  timestamp: Date;
  metadata: RecordMetadata;
}

type FindingOutcome =
  | { type: 'no-finding' }
  | { type: 'finding-pending'; findingId: string }
  | { type: 'finding-confirmed'; findingId: string; confirmedBy: string }
  | { type: 'finding-rejected'; findingId: string; rejectedBy: string; reason: string };

interface RecordMetadata {
  artifactPath: string;
  timeSpentMs: number;
  confidenceScore: number;
}

class FindingLinker {
  private pendingFindings: Map<string, MethodFindingRecord> = new Map();

  // Called when method generates a finding
  recordFindingGenerated(
    methodId: string,
    sessionId: string,
    findingId: string,
    metadata: RecordMetadata
  ): MethodFindingRecord {
    const record: MethodFindingRecord = {
      recordId: this.generateId(),
      methodId,
      sessionId,
      findingId,
      findingOutcome: { type: 'finding-pending', findingId },
      timestamp: new Date(),
      metadata
    };
    this.pendingFindings.set(findingId, record);
    return record;
  }

  // Called when method runs but finds nothing
  recordNoFinding(
    methodId: string,
    sessionId: string,
    metadata: RecordMetadata
  ): MethodFindingRecord {
    return {
      recordId: this.generateId(),
      methodId,
      sessionId,
      findingId: null,
      findingOutcome: { type: 'no-finding' },
      timestamp: new Date(),
      metadata
    };
  }

  // Called when user/system confirms or rejects a finding
  updateFindingOutcome(
    findingId: string,
    confirmed: boolean,
    details: { by: string; reason?: string }
  ): void {
    const record = this.pendingFindings.get(findingId);
    if (!record) return;

    record.findingOutcome = confirmed
      ? { type: 'finding-confirmed', findingId, confirmedBy: details.by }
      : { type: 'finding-rejected', findingId, rejectedBy: details.by, reason: details.reason || '' };

    this.pendingFindings.delete(findingId);
    this.persistRecord(record);
  }
}
```

---

### Requirement 3: Calculate Effectiveness Metrics Per Method

**Design Approach:**

```typescript
interface MethodEffectivenessMetrics {
  methodId: string;
  methodName: string;
  sampleSize: number;

  // Core metrics
  precision: number;           // TP / (TP + FP)
  recall: number;              // TP / (TP + FN) - estimated
  f1Score: number;             // 2 * (P * R) / (P + R)

  // Finding metrics
  totalFindings: number;
  confirmedFindings: number;
  rejectedFindings: number;
  pendingFindings: number;

  // Rate metrics
  findingRate: number;         // findings / usage count
  confirmationRate: number;    // confirmed / (confirmed + rejected)
  falsePositiveRate: number;   // rejected / total findings

  // Efficiency metrics
  avgTimePerFinding: number;
  avgConfidenceScore: number;

  // Trend metrics
  effectivenessTrend: 'improving' | 'stable' | 'declining';
  trendConfidence: number;
}

class EffectivenessCalculator {
  calculateMetrics(methodId: string, records: MethodFindingRecord[]): MethodEffectivenessMetrics {
    const findings = records.filter(r => r.findingId !== null);
    const confirmed = findings.filter(r => r.findingOutcome.type === 'finding-confirmed');
    const rejected = findings.filter(r => r.findingOutcome.type === 'finding-rejected');
    const pending = findings.filter(r => r.findingOutcome.type === 'finding-pending');

    const precision = this.calculatePrecision(confirmed.length, rejected.length);
    const recall = this.estimateRecall(methodId, records);

    return {
      methodId,
      methodName: this.getMethodName(methodId),
      sampleSize: records.length,

      precision,
      recall,
      f1Score: this.calculateF1(precision, recall),

      totalFindings: findings.length,
      confirmedFindings: confirmed.length,
      rejectedFindings: rejected.length,
      pendingFindings: pending.length,

      findingRate: findings.length / records.length,
      confirmationRate: confirmed.length / Math.max(1, confirmed.length + rejected.length),
      falsePositiveRate: rejected.length / Math.max(1, findings.length),

      avgTimePerFinding: this.calculateAvgTime(findings),
      avgConfidenceScore: this.calculateAvgConfidence(findings),

      effectivenessTrend: this.calculateTrend(methodId),
      trendConfidence: this.calculateTrendConfidence(methodId)
    };
  }

  private calculatePrecision(tp: number, fp: number): number {
    const total = tp + fp;
    return total === 0 ? 0 : tp / total;
  }

  private estimateRecall(methodId: string, records: MethodFindingRecord[]): number {
    // Recall estimation is tricky - we don't know true FN
    // Use cross-method comparison: if another method found issue this one missed
    // This is an estimate, not true recall
    return this.crossMethodRecallEstimate(methodId, records);
  }

  private calculateF1(precision: number, recall: number): number {
    if (precision + recall === 0) return 0;
    return 2 * (precision * recall) / (precision + recall);
  }
}
```

**Metrics Dashboard Interface:**

```typescript
class MetricsDashboard {
  async getMethodRankings(sortBy: keyof MethodEffectivenessMetrics = 'f1Score'): Promise<MethodRanking[]> {
    const allMetrics = await this.getAllMethodMetrics();
    return allMetrics
      .filter(m => m.sampleSize >= this.MIN_SAMPLE_SIZE)
      .sort((a, b) => b[sortBy] - a[sortBy])
      .map((m, i) => ({ rank: i + 1, ...m }));
  }

  async getMethodDetail(methodId: string): Promise<MethodDetailView> {
    const metrics = await this.calculator.calculateMetrics(methodId, await this.getRecords(methodId));
    const history = await this.getMetricsHistory(methodId);
    const combinations = await this.getCombinationStats(methodId);

    return { metrics, history, combinations };
  }
}
```

---

### Requirement 4: Detect Methods That Consistently Generate False Positives

**Design Approach:**

```typescript
interface FalsePositiveAnalysis {
  methodId: string;
  fpRate: number;
  fpCount: number;
  isHighFPMethod: boolean;
  confidence: number;
  commonPatterns: FPPattern[];
  recommendation: string;
}

interface FPPattern {
  pattern: string;
  occurrences: number;
  description: string;
}

class FalsePositiveDetector {
  private readonly FP_THRESHOLD = 0.3;  // 30% FP rate threshold
  private readonly MIN_SAMPLES_FOR_DETECTION = 20;

  analyze(methodId: string, records: MethodFindingRecord[]): FalsePositiveAnalysis {
    const findings = records.filter(r => r.findingId !== null);
    const rejected = findings.filter(r => r.findingOutcome.type === 'finding-rejected');
    const resolved = findings.filter(r =>
      r.findingOutcome.type === 'finding-confirmed' ||
      r.findingOutcome.type === 'finding-rejected'
    );

    const fpRate = resolved.length === 0 ? 0 : rejected.length / resolved.length;
    const isHighFP = fpRate > this.FP_THRESHOLD && resolved.length >= this.MIN_SAMPLES_FOR_DETECTION;

    // Calculate confidence using binomial proportion confidence interval
    const confidence = this.calculateConfidenceInterval(rejected.length, resolved.length);

    return {
      methodId,
      fpRate,
      fpCount: rejected.length,
      isHighFPMethod: isHighFP,
      confidence: confidence.confidence,
      commonPatterns: this.identifyPatterns(rejected),
      recommendation: this.generateRecommendation(fpRate, isHighFP, confidence)
    };
  }

  private identifyPatterns(rejected: MethodFindingRecord[]): FPPattern[] {
    // Group by rejection reason
    const byReason = this.groupBy(rejected, r =>
      (r.findingOutcome as any).reason || 'unspecified'
    );

    return Object.entries(byReason)
      .map(([reason, records]) => ({
        pattern: reason,
        occurrences: records.length,
        description: this.describePattern(reason, records)
      }))
      .sort((a, b) => b.occurrences - a.occurrences);
  }

  private calculateConfidenceInterval(
    successes: number,
    total: number
  ): { lower: number; upper: number; confidence: number } {
    // Wilson score interval for binomial proportion
    const z = 1.96; // 95% confidence
    const p = successes / total;
    const n = total;

    const denominator = 1 + z * z / n;
    const center = p + z * z / (2 * n);
    const spread = z * Math.sqrt((p * (1 - p) + z * z / (4 * n)) / n);

    return {
      lower: (center - spread) / denominator,
      upper: (center + spread) / denominator,
      confidence: 0.95
    };
  }

  private generateRecommendation(
    fpRate: number,
    isHighFP: boolean,
    confidence: { lower: number; upper: number }
  ): string {
    if (!isHighFP) {
      return 'Method false positive rate is within acceptable range.';
    }

    if (confidence.lower > this.FP_THRESHOLD) {
      return `HIGH CONFIDENCE: Method has consistently high false positive rate (${(fpRate * 100).toFixed(1)}%). Consider refining method criteria or reducing usage weight.`;
    }

    return `Method shows elevated false positive rate (${(fpRate * 100).toFixed(1)}%) but more data needed for definitive recommendation.`;
  }
}
```

---

### Requirement 5: Handle Statistical Significance (Don't Judge on Small Samples)

**Design Approach:**

```typescript
interface SignificanceTest {
  methodId: string;
  metric: string;
  sampleSize: number;
  requiredSampleSize: number;
  hasSignificance: boolean;
  pValue: number | null;
  confidenceInterval: ConfidenceInterval | null;
  interpretation: string;
}

interface ConfidenceInterval {
  lower: number;
  upper: number;
  confidenceLevel: number;
}

class SignificanceTester {
  private readonly ALPHA = 0.05;  // 5% significance level
  private readonly MIN_POWER = 0.8;  // 80% power
  private readonly EFFECT_SIZE = 0.2;  // Small effect size (Cohen's d)

  // Calculate minimum sample size needed for significance
  calculateRequiredSampleSize(
    expectedProportion: number,
    margin: number = 0.05
  ): number {
    // For proportion estimation
    const z = 1.96; // 95% confidence
    const p = expectedProportion;
    return Math.ceil((z * z * p * (1 - p)) / (margin * margin));
  }

  // Test if metric is statistically significant
  testMetricSignificance(
    methodId: string,
    metric: string,
    observed: number,
    expected: number,
    sampleSize: number
  ): SignificanceTest {
    const requiredSize = this.calculateRequiredSampleSize(expected);
    const hasEnoughSamples = sampleSize >= requiredSize;

    let pValue: number | null = null;
    let confidenceInterval: ConfidenceInterval | null = null;

    if (hasEnoughSamples) {
      pValue = this.calculatePValue(observed, expected, sampleSize);
      confidenceInterval = this.calculateCI(observed, sampleSize);
    }

    return {
      methodId,
      metric,
      sampleSize,
      requiredSampleSize: requiredSize,
      hasSignificance: hasEnoughSamples && pValue !== null && pValue < this.ALPHA,
      pValue,
      confidenceInterval,
      interpretation: this.interpret(hasEnoughSamples, pValue, sampleSize, requiredSize)
    };
  }

  // Compare two methods for significant difference
  compareMethodsSignificance(
    methodA: MethodEffectivenessMetrics,
    methodB: MethodEffectivenessMetrics
  ): ComparisonResult {
    // Two-proportion z-test
    const p1 = methodA.confirmationRate;
    const p2 = methodB.confirmationRate;
    const n1 = methodA.sampleSize;
    const n2 = methodB.sampleSize;

    const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
    const z = (p1 - p2) / se;
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));

    return {
      methodA: methodA.methodId,
      methodB: methodB.methodId,
      difference: p1 - p2,
      isSignificant: pValue < this.ALPHA,
      pValue,
      interpretation: this.interpretComparison(p1, p2, pValue)
    };
  }

  private interpret(
    hasEnoughSamples: boolean,
    pValue: number | null,
    actual: number,
    required: number
  ): string {
    if (!hasEnoughSamples) {
      return `Insufficient data: ${actual} samples collected, ${required} needed for statistical significance.`;
    }
    if (pValue && pValue < this.ALPHA) {
      return `Result is statistically significant (p=${pValue.toFixed(4)}).`;
    }
    return `Result is not statistically significant (p=${pValue?.toFixed(4) || 'N/A'}).`;
  }
}
```

**Sample Size Warnings in UI:**

```typescript
class SampleSizeWarning {
  generateWarning(metrics: MethodEffectivenessMetrics): Warning | null {
    const tester = new SignificanceTester();
    const required = tester.calculateRequiredSampleSize(metrics.confirmationRate);

    if (metrics.sampleSize < required) {
      const percentComplete = (metrics.sampleSize / required) * 100;
      return {
        level: percentComplete < 50 ? 'high' : 'medium',
        message: `Metrics based on ${metrics.sampleSize} samples (${percentComplete.toFixed(0)}% of ${required} needed for significance)`,
        recommendation: `Collect ${required - metrics.sampleSize} more samples before making decisions based on this data`
      };
    }
    return null;
  }
}
```

---

### Requirement 6: Suggest Method Combinations That Work Well Together

**Design Approach:**

```typescript
interface MethodCombination {
  methods: string[];
  coOccurrenceCount: number;
  combinedEffectiveness: number;
  synergy: number;  // Positive = better together, negative = worse
  confidence: number;
  recommendedFor: string[];  // Artifact types this combo works for
}

class CombinationAnalyzer {
  private readonly MIN_CO_OCCURRENCE = 10;

  // Use association rule mining (Apriori-like)
  findEffectiveCombinations(records: SessionRecord[]): MethodCombination[] {
    // Step 1: Calculate single method effectiveness
    const singleEffectiveness = this.calculateSingleEffectiveness(records);

    // Step 2: Find frequent co-occurrences
    const coOccurrences = this.findCoOccurrences(records);

    // Step 3: Calculate combined effectiveness
    const combinations: MethodCombination[] = [];

    for (const [combo, sessions] of coOccurrences) {
      if (sessions.length < this.MIN_CO_OCCURRENCE) continue;

      const methods = combo.split('|');
      const combinedEff = this.calculateCombinedEffectiveness(sessions);
      const expectedEff = this.calculateExpectedEffectiveness(methods, singleEffectiveness);
      const synergy = combinedEff - expectedEff;

      combinations.push({
        methods,
        coOccurrenceCount: sessions.length,
        combinedEffectiveness: combinedEff,
        synergy,
        confidence: this.calculateCombinationConfidence(sessions.length),
        recommendedFor: this.identifyBestContexts(sessions)
      });
    }

    return combinations
      .filter(c => c.synergy > 0)  // Only positive synergy
      .sort((a, b) => b.synergy - a.synergy);
  }

  // Calculate synergy score
  private calculateExpectedEffectiveness(
    methods: string[],
    singleEffectiveness: Map<string, number>
  ): number {
    // Independence assumption: P(A and B) = P(A) + P(B) - P(A)*P(B)
    let combined = 0;
    for (const method of methods) {
      const eff = singleEffectiveness.get(method) || 0;
      combined = combined + eff - combined * eff;
    }
    return combined;
  }

  // Recommend combinations for a new verification session
  recommendCombinations(
    context: VerificationContext,
    topN: number = 5
  ): MethodCombinationRecommendation[] {
    const allCombinations = this.getCachedCombinations();

    return allCombinations
      .filter(c => this.matchesContext(c, context))
      .slice(0, topN)
      .map(c => ({
        methods: c.methods,
        reason: this.generateRecommendationReason(c),
        expectedImprovement: `+${(c.synergy * 100).toFixed(1)}%`,
        confidence: c.confidence
      }));
  }

  private generateRecommendationReason(combo: MethodCombination): string {
    return `Methods ${combo.methods.join(' + ')} show ${(combo.synergy * 100).toFixed(1)}% better effectiveness when used together (based on ${combo.coOccurrenceCount} sessions)`;
  }
}
```

**Synergy Detection Algorithm:**

```typescript
class SynergyDetector {
  // Detect which method pairs have positive/negative synergy
  detectSynergies(records: SessionRecord[]): SynergyMatrix {
    const matrix = new SynergyMatrix();
    const methods = this.getAllMethods(records);

    for (const m1 of methods) {
      for (const m2 of methods) {
        if (m1 >= m2) continue;  // Avoid duplicates

        const synergy = this.calculatePairSynergy(m1, m2, records);
        if (synergy.isSignificant) {
          matrix.set(m1, m2, synergy.value);
        }
      }
    }

    return matrix;
  }

  private calculatePairSynergy(
    m1: string,
    m2: string,
    records: SessionRecord[]
  ): { value: number; isSignificant: boolean } {
    // Sessions with both methods
    const bothSessions = records.filter(r =>
      r.methodsUsed.includes(m1) && r.methodsUsed.includes(m2)
    );

    // Sessions with only one
    const onlyM1 = records.filter(r =>
      r.methodsUsed.includes(m1) && !r.methodsUsed.includes(m2)
    );
    const onlyM2 = records.filter(r =>
      !r.methodsUsed.includes(m1) && r.methodsUsed.includes(m2)
    );

    if (bothSessions.length < 10) {
      return { value: 0, isSignificant: false };
    }

    const effBoth = this.avgEffectiveness(bothSessions);
    const effM1 = this.avgEffectiveness(onlyM1);
    const effM2 = this.avgEffectiveness(onlyM2);
    const expectedBoth = effM1 + effM2 - effM1 * effM2;

    return {
      value: effBoth - expectedBoth,
      isSignificant: Math.abs(effBoth - expectedBoth) > 0.05
    };
  }
}
```

---

### Requirement 7: Preserve User Privacy (No PII in Tracking Data)

**Design Approach:**

```typescript
interface PrivacyPolicy {
  retainPII: false;
  anonymizeUserIds: boolean;
  hashArtifactPaths: boolean;
  aggregateThreshold: number;  // Min records before showing aggregates
}

class PrivacyFilter {
  private readonly DEFAULT_POLICY: PrivacyPolicy = {
    retainPII: false,
    anonymizeUserIds: true,
    hashArtifactPaths: true,
    aggregateThreshold: 5
  };

  // Fields that may contain PII
  private readonly PII_FIELDS = [
    'userId', 'userName', 'email', 'ipAddress',
    'filePath', 'directoryPath', 'contentSnippet'
  ];

  filter(record: MethodFindingRecord): SanitizedRecord {
    const sanitized = { ...record };

    // Remove or hash PII fields
    for (const field of this.PII_FIELDS) {
      if (field in sanitized.metadata) {
        sanitized.metadata[field] = this.anonymize(sanitized.metadata[field], field);
      }
    }

    // Hash artifact paths
    if (sanitized.metadata.artifactPath) {
      sanitized.metadata.artifactPath = this.hashPath(sanitized.metadata.artifactPath);
    }

    // Remove user identification
    delete sanitized['userId'];
    delete sanitized['sessionOwner'];

    return sanitized as SanitizedRecord;
  }

  private anonymize(value: string, fieldType: string): string {
    switch (fieldType) {
      case 'userId':
      case 'userName':
        return this.hash(value).substring(0, 8);  // Short hash
      case 'email':
        return 'redacted@example.com';
      case 'filePath':
      case 'directoryPath':
        return this.hashPath(value);
      case 'contentSnippet':
        return '[content-redacted]';
      default:
        return '[redacted]';
    }
  }

  private hashPath(path: string): string {
    // Preserve structure but hash components
    const parts = path.split('/');
    return parts.map((p, i) => {
      if (i === parts.length - 1) {
        // Keep file extension
        const ext = p.split('.').pop();
        return `file_${this.hash(p).substring(0, 6)}.${ext}`;
      }
      return `dir_${this.hash(p).substring(0, 4)}`;
    }).join('/');
  }

  private hash(value: string): string {
    // Simple hash for anonymization (not cryptographic)
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

class PrivacyValidator {
  validateExport(data: ExportData): ValidationResult {
    const issues: string[] = [];

    // Check for potential PII leaks
    const jsonStr = JSON.stringify(data);

    // Email patterns
    if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(jsonStr)) {
      issues.push('Potential email address detected in export');
    }

    // Absolute paths
    if (/[A-Z]:\\|\/home\/|\/Users\//.test(jsonStr)) {
      issues.push('Potential absolute file paths detected');
    }

    // IP addresses
    if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(jsonStr)) {
      issues.push('Potential IP addresses detected');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}
```

---

### Requirement 8: Data Export for External Analysis

**Design Approach:**

```typescript
interface ExportOptions {
  format: 'csv' | 'json' | 'parquet';
  dateRange?: { start: Date; end: Date };
  methods?: string[];
  includeRawRecords: boolean;
  includeAggregates: boolean;
  aggregationLevel: 'method' | 'session' | 'daily' | 'weekly';
}

interface ExportedData {
  metadata: ExportMetadata;
  aggregates?: AggregatedMetrics[];
  records?: SanitizedRecord[];
  schema: DataSchema;
}

class ExportService {
  private privacyFilter: PrivacyFilter;
  private validator: PrivacyValidator;

  async export(options: ExportOptions): Promise<ExportResult> {
    // Fetch data
    let records = await this.fetchRecords(options);

    // Apply privacy filter
    records = records.map(r => this.privacyFilter.filter(r));

    // Aggregate if requested
    let aggregates: AggregatedMetrics[] | undefined;
    if (options.includeAggregates) {
      aggregates = this.aggregate(records, options.aggregationLevel);
    }

    const exportData: ExportedData = {
      metadata: {
        exportDate: new Date(),
        recordCount: records.length,
        dateRange: options.dateRange,
        version: '1.0'
      },
      aggregates,
      records: options.includeRawRecords ? records : undefined,
      schema: this.getSchema()
    };

    // Validate no PII leakage
    const validation = this.validator.validateExport(exportData);
    if (!validation.isValid) {
      throw new Error(`Privacy validation failed: ${validation.issues.join(', ')}`);
    }

    // Format output
    return this.formatOutput(exportData, options.format);
  }

  private formatOutput(data: ExportedData, format: string): ExportResult {
    switch (format) {
      case 'json':
        return {
          content: JSON.stringify(data, null, 2),
          mimeType: 'application/json',
          extension: 'json'
        };
      case 'csv':
        return {
          content: this.toCsv(data),
          mimeType: 'text/csv',
          extension: 'csv'
        };
      case 'parquet':
        return {
          content: this.toParquet(data),
          mimeType: 'application/octet-stream',
          extension: 'parquet'
        };
    }
  }

  private toCsv(data: ExportedData): string {
    const rows: string[] = [];

    // Header
    const headers = ['method_id', 'session_id', 'finding_generated', 'outcome', 'timestamp'];
    rows.push(headers.join(','));

    // Data rows
    for (const record of data.records || []) {
      const row = [
        record.methodId,
        record.sessionId,
        record.findingId ? 'true' : 'false',
        record.findingOutcome.type,
        record.timestamp.toISOString()
      ];
      rows.push(row.map(v => `"${v}"`).join(','));
    }

    return rows.join('\n');
  }

  private getSchema(): DataSchema {
    return {
      version: '1.0',
      fields: [
        { name: 'methodId', type: 'string', description: 'Unique method identifier' },
        { name: 'sessionId', type: 'string', description: 'Verification session ID (anonymized)' },
        { name: 'findingId', type: 'string?', description: 'Finding ID if generated' },
        { name: 'findingOutcome', type: 'enum', values: ['no-finding', 'pending', 'confirmed', 'rejected'] },
        { name: 'timestamp', type: 'datetime', description: 'Event timestamp' },
        // ... more fields
      ]
    };
  }
}
```

---

## Implementation Plan

### Phase 1: Data Collection Infrastructure (Week 1-2)
1. Design and implement event schema
2. Build event collector with buffering
3. Implement session tracker
4. Create finding linker component
5. Set up event storage (file-based initially)

### Phase 2: Core Metrics Engine (Week 3-4)
1. Implement effectiveness calculator
2. Build precision/recall estimators
3. Create metrics aggregation pipeline
4. Add metrics caching layer

### Phase 3: Statistical Analysis (Week 5)
1. Implement significance tester
2. Add sample size calculator
3. Build confidence interval estimators
4. Create comparison tests

### Phase 4: Advanced Analytics (Week 6-7)
1. Implement false positive detector
2. Build combination analyzer
3. Create synergy detection algorithm
4. Implement recommendation engine

### Phase 5: Privacy and Export (Week 8)
1. Implement privacy filter
2. Add privacy validator
3. Build export service
4. Create export formats (JSON, CSV, Parquet)

### Phase 6: Testing and Documentation (Week 9)
1. Unit tests for all components
2. Integration tests with mock sessions
3. Privacy audit
4. Documentation and examples

---

## Assumptions Made

1. **Data Volume**: Expected 100-1000 verification sessions per week; design optimized for this scale.

2. **Finding Resolution Time**: Findings are confirmed/rejected within 7 days on average; pending findings older than 30 days are excluded from metrics.

3. **Method Stability**: Methods in methods.csv are relatively stable; major method changes reset effectiveness history.

4. **User Feedback Availability**: Confirmation/rejection data comes from explicit user feedback; no automated ground truth.

5. **Storage Backend**: File-based storage initially (JSON lines); database migration path available.

6. **Statistical Expertise**: Users interpreting metrics have basic statistical literacy; warnings provided for significance issues.

7. **Privacy Requirements**: GDPR-like compliance needed; no PII retained in any form.

8. **Cross-Session Comparison**: Sessions are comparable regardless of artifact complexity; normalization may be needed later.

9. **Method Independence**: Methods are treated as independent for baseline calculations; synergy analysis accounts for interactions.

10. **Temporal Effects**: No significant concept drift expected over short periods (weeks); long-term trends tracked separately.

---

## Appendix: Data Model Reference

### Core Entities

```typescript
// Event Store Schema
interface EventStoreEntry {
  eventId: string;
  eventType: 'method-usage' | 'finding-generated' | 'finding-outcome' | 'session-complete';
  timestamp: Date;
  payload: object;
  checksum: string;
}

// Aggregation Cache Schema
interface AggregationEntry {
  key: string;  // e.g., "method:M001:2024-01"
  metrics: MethodEffectivenessMetrics;
  sampleSize: number;
  lastUpdated: Date;
  ttl: Date;
}

// Export Record Schema
interface ExportRecord {
  methodId: string;
  methodName: string;
  sessionId: string;  // Anonymized
  findingGenerated: boolean;
  outcomeType: string;
  outcomeTimestamp: Date | null;
  artifactType: string;
  timeSpentMs: number;
}
```

### Metrics Definitions

| Metric | Formula | Description |
|--------|---------|-------------|
| Precision | TP / (TP + FP) | Proportion of findings that were correct |
| Finding Rate | Findings / Usage Count | How often method generates findings |
| Confirmation Rate | Confirmed / Resolved | Proportion of resolved findings that were confirmed |
| FP Rate | Rejected / Findings | Proportion of findings that were false positives |
| F1 Score | 2 * (P * R) / (P + R) | Harmonic mean of precision and recall |
| Synergy | Actual - Expected | Improvement when methods used together |
