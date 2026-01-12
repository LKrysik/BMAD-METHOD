# Cross-Workflow Consistency Checker - Technical Design Document

## Artifact ID: artifact-t10.md
## Task: Task 10 - Cross-Workflow Consistency Checker
## Date: 2026-01-12
## Author: Claude Opus 4.5 (Expert Software Architect)

---

## Executive Summary

This document presents a comprehensive design for a Cross-Workflow Consistency Checker system that enables running multiple verification workflows on the same content and identifies inconsistencies between their findings. The system compares results for consistency, flags contradictions, determines authoritative results when conflicts exist, and generates a consolidated view of all workflow results.

The design addresses all eight requirements with particular attention to scalability (5+ workflows without exponential complexity), configurable consistency thresholds, and handling workflows with different granularity levels. The architecture employs a novel semantic comparison engine that normalizes findings across different workflow types before comparison.

---

## Architecture Overview

### High-Level System Architecture

```
+------------------+     +--------------------+     +----------------------+
|   Content Input  |---->|  Workflow          |---->|  Results             |
|   (Documents)    |     |  Executor          |     |  Normalizer          |
+------------------+     +--------------------+     +----------------------+
                                                            |
        +---------------------------------------------------+
        |                                                   |
        v                                                   v
+------------------+     +--------------------+     +----------------------+
|  Consistency     |---->|  Conflict          |---->|  Authority           |
|  Comparator      |     |  Detector          |     |  Resolver            |
+------------------+     +--------------------+     +----------------------+
        |                         |                         |
        v                         v                         v
+------------------+     +--------------------+     +----------------------+
|  Threshold       |     |  Contradiction     |     |  Consolidated        |
|  Evaluator       |     |  Reporter          |     |  View Generator      |
+------------------+     +--------------------+     +----------------------+
```

### Core Components

1. **Workflow Executor** - Orchestrates parallel execution of multiple workflows
2. **Results Normalizer** - Transforms diverse workflow outputs into comparable format
3. **Consistency Comparator** - Compares normalized results using semantic analysis
4. **Conflict Detector** - Identifies contradictions between workflow findings
5. **Authority Resolver** - Determines authoritative result when conflicts exist
6. **Threshold Evaluator** - Applies configurable consistency thresholds
7. **Consolidated View Generator** - Produces unified report of all findings

---

## Detailed Design

### Requirement 1: Run Multiple Workflows on Same Content

#### Workflow Execution Engine

```typescript
interface WorkflowExecutionConfig {
  content: ContentItem;
  workflows: WorkflowDefinition[];
  executionMode: 'parallel' | 'sequential' | 'hybrid';
  timeout: Duration;
  resourceLimits: ResourceLimits;
}

interface WorkflowDefinition {
  workflowId: string;
  workflowType: WorkflowType;
  version: string;
  phases: Phase[];
  expectedOutputFormat: OutputSchema;
  authorityWeight: number; // 0-1, used in conflict resolution
}

class WorkflowExecutionEngine {
  async executeAll(config: WorkflowExecutionConfig): Promise<ExecutionResults> {
    const { content, workflows, executionMode } = config;

    // Validate workflows are compatible with content type
    const compatible = workflows.filter(w =>
      this.isCompatible(w, content)
    );

    if (compatible.length !== workflows.length) {
      this.logIncompatibleWorkflows(workflows, compatible);
    }

    // Execute based on mode
    switch (executionMode) {
      case 'parallel':
        return this.executeParallel(content, compatible, config);
      case 'sequential':
        return this.executeSequential(content, compatible, config);
      case 'hybrid':
        return this.executeHybrid(content, compatible, config);
    }
  }

  private async executeParallel(
    content: ContentItem,
    workflows: WorkflowDefinition[],
    config: WorkflowExecutionConfig
  ): Promise<ExecutionResults> {
    const executor = new ParallelExecutor(config.resourceLimits);

    const promises = workflows.map(workflow =>
      executor.execute(workflow, content).catch(error => ({
        workflowId: workflow.workflowId,
        status: 'failed',
        error,
      }))
    );

    const results = await Promise.allSettled(promises);

    return this.aggregateResults(results, workflows);
  }
}
```

#### Execution Result Model

```typescript
interface ExecutionResults {
  contentId: string;
  executionId: string;
  timestamp: Date;

  workflowResults: WorkflowResult[];

  executionMetrics: {
    totalDuration: Duration;
    perWorkflowDuration: Map<string, Duration>;
    resourceUsage: ResourceUsage;
  };
}

interface WorkflowResult {
  workflowId: string;
  workflowType: WorkflowType;
  status: 'completed' | 'partial' | 'failed';

  findings: Finding[];
  summary: WorkflowSummary;

  metadata: {
    startTime: Date;
    endTime: Date;
    methodsUsed: string[];
    phasesCompleted: number;
    confidenceScore: number;
  };
}

interface Finding {
  findingId: string;
  type: FindingType;
  severity: Severity;
  location: ContentLocation;
  description: string;
  evidence: Evidence[];
  suggestedAction: string;
  confidence: number;
}
```

---

### Requirement 2: Compare Results for Consistency

#### Results Normalization

```typescript
interface NormalizedFinding {
  originalFindingId: string;
  workflowId: string;

  // Normalized semantic content
  semanticCategory: string;
  normalizedDescription: string;
  canonicalLocation: CanonicalLocation;

  // Normalized scoring
  normalizedSeverity: number; // 0-1 scale
  normalizedConfidence: number; // 0-1 scale

  // Original preserved for reference
  originalFinding: Finding;
}

class ResultsNormalizer {
  normalize(results: ExecutionResults): NormalizedResults {
    const normalizedFindings: NormalizedFinding[] = [];

    for (const workflowResult of results.workflowResults) {
      const workflowSchema = this.getWorkflowSchema(workflowResult.workflowType);

      for (const finding of workflowResult.findings) {
        const normalized = this.normalizeFinding(
          finding,
          workflowResult.workflowId,
          workflowSchema
        );
        normalizedFindings.push(normalized);
      }
    }

    return {
      executionId: results.executionId,
      findings: normalizedFindings,
      normalizationMetadata: this.buildMetadata(),
    };
  }

  private normalizeFinding(
    finding: Finding,
    workflowId: string,
    schema: WorkflowSchema
  ): NormalizedFinding {
    return {
      originalFindingId: finding.findingId,
      workflowId,
      semanticCategory: this.mapToSemanticCategory(finding.type, schema),
      normalizedDescription: this.normalizeDescription(finding.description),
      canonicalLocation: this.canonicalizeLocation(finding.location),
      normalizedSeverity: this.normalizeSeverity(finding.severity, schema),
      normalizedConfidence: this.normalizeConfidence(finding.confidence, schema),
      originalFinding: finding,
    };
  }

  private normalizeSeverity(severity: Severity, schema: WorkflowSchema): number {
    // Map workflow-specific severity to universal 0-1 scale
    const mapping = schema.severityMapping;
    return mapping[severity] ?? 0.5;
  }
}
```

#### Consistency Comparison Engine

```typescript
interface ConsistencyComparison {
  finding1: NormalizedFinding;
  finding2: NormalizedFinding;

  consistencyScore: number; // 0-1, higher = more consistent
  consistencyType: 'agreement' | 'complementary' | 'neutral' | 'contradiction';

  analysis: {
    semanticSimilarity: number;
    severityAlignment: number;
    locationOverlap: number;
    confidenceCorrelation: number;
  };
}

class ConsistencyComparator {
  compare(
    finding1: NormalizedFinding,
    finding2: NormalizedFinding
  ): ConsistencyComparison {
    // Semantic similarity using embedding comparison
    const semanticSimilarity = this.computeSemanticSimilarity(
      finding1.normalizedDescription,
      finding2.normalizedDescription
    );

    // Location overlap analysis
    const locationOverlap = this.computeLocationOverlap(
      finding1.canonicalLocation,
      finding2.canonicalLocation
    );

    // Severity alignment (are they rating the same issue similarly?)
    const severityAlignment = this.computeSeverityAlignment(
      finding1.normalizedSeverity,
      finding2.normalizedSeverity
    );

    // Overall consistency score
    const consistencyScore = this.computeOverallConsistency(
      semanticSimilarity,
      locationOverlap,
      severityAlignment
    );

    // Classify the consistency type
    const consistencyType = this.classifyConsistency(
      finding1, finding2, consistencyScore
    );

    return {
      finding1,
      finding2,
      consistencyScore,
      consistencyType,
      analysis: {
        semanticSimilarity,
        severityAlignment,
        locationOverlap,
        confidenceCorrelation: this.computeConfidenceCorrelation(finding1, finding2),
      },
    };
  }

  private classifyConsistency(
    f1: NormalizedFinding,
    f2: NormalizedFinding,
    score: number
  ): ConsistencyType {
    // Same location, similar description
    if (score > 0.8) {
      // Check if severities align
      if (Math.abs(f1.normalizedSeverity - f2.normalizedSeverity) < 0.2) {
        return 'agreement';
      } else {
        return 'contradiction'; // Same issue, different severity
      }
    }

    // Related but different aspects
    if (score > 0.5 && score <= 0.8) {
      return 'complementary';
    }

    // Unrelated findings
    if (score <= 0.5 && score > 0.2) {
      return 'neutral';
    }

    // Potentially contradictory (opposite conclusions)
    return this.detectContradiction(f1, f2) ? 'contradiction' : 'neutral';
  }
}
```

---

### Requirement 3: Flag Contradictions Between Workflow Findings

#### Contradiction Detection System

```typescript
interface Contradiction {
  contradictionId: string;
  type: ContradictionType;
  severity: ContradictionSeverity;

  findings: NormalizedFinding[];
  workflows: string[];

  description: string;
  evidence: ContradictionEvidence;

  resolution?: ContradictionResolution;
}

enum ContradictionType {
  SEVERITY_MISMATCH = 'severity_mismatch',      // Same issue, different severity
  EXISTENCE_CONFLICT = 'existence_conflict',    // One finds issue, other doesn't
  CLASSIFICATION_CONFLICT = 'classification',   // Same location, different type
  RECOMMENDATION_CONFLICT = 'recommendation',   // Opposite suggested actions
  SCOPE_CONFLICT = 'scope',                     // Different scope assessment
}

class ContradictionDetector {
  private readonly contradictionThreshold = 0.3; // Below this = potential contradiction

  detect(comparisons: ConsistencyComparison[]): Contradiction[] {
    const contradictions: Contradiction[] = [];

    // Filter to potential contradictions
    const potentialContradictions = comparisons.filter(
      c => c.consistencyType === 'contradiction' || c.consistencyScore < this.contradictionThreshold
    );

    // Analyze each potential contradiction
    for (const comparison of potentialContradictions) {
      const contradiction = this.analyzeContradiction(comparison);
      if (contradiction) {
        contradictions.push(contradiction);
      }
    }

    // Group related contradictions
    const grouped = this.groupRelatedContradictions(contradictions);

    return grouped;
  }

  private analyzeContradiction(comparison: ConsistencyComparison): Contradiction | null {
    const { finding1, finding2 } = comparison;

    // Determine contradiction type
    const type = this.determineContradictionType(finding1, finding2, comparison);

    if (!type) return null;

    // Build evidence
    const evidence = this.buildEvidence(finding1, finding2, type);

    // Assess severity of contradiction
    const severity = this.assessContradictionSeverity(finding1, finding2, type);

    return {
      contradictionId: this.generateId(),
      type,
      severity,
      findings: [finding1, finding2],
      workflows: [finding1.workflowId, finding2.workflowId],
      description: this.generateDescription(type, finding1, finding2),
      evidence,
    };
  }

  private determineContradictionType(
    f1: NormalizedFinding,
    f2: NormalizedFinding,
    comparison: ConsistencyComparison
  ): ContradictionType | null {
    const { analysis } = comparison;

    // High location overlap + low semantic similarity = classification conflict
    if (analysis.locationOverlap > 0.8 && analysis.semanticSimilarity < 0.4) {
      return ContradictionType.CLASSIFICATION_CONFLICT;
    }

    // High semantic similarity + large severity gap = severity mismatch
    if (analysis.semanticSimilarity > 0.7 &&
        Math.abs(f1.normalizedSeverity - f2.normalizedSeverity) > 0.5) {
      return ContradictionType.SEVERITY_MISMATCH;
    }

    // Check for recommendation conflicts
    if (this.hasOppositeRecommendations(f1, f2)) {
      return ContradictionType.RECOMMENDATION_CONFLICT;
    }

    return null;
  }
}
```

#### Missing Finding Detection

```typescript
class MissingFindingDetector {
  // Detect when one workflow finds something others missed
  detectMissingFindings(
    normalizedResults: NormalizedResults,
    workflows: WorkflowDefinition[]
  ): ExistenceConflict[] {
    const conflicts: ExistenceConflict[] = [];

    // Group findings by semantic category and location
    const findingGroups = this.groupSimilarFindings(normalizedResults.findings);

    for (const group of findingGroups) {
      // Which workflows contributed to this group?
      const contributingWorkflows = new Set(group.map(f => f.workflowId));

      // Which workflows should have found this?
      const expectedWorkflows = this.getExpectedWorkflows(
        group[0].semanticCategory,
        workflows
      );

      // Missing workflows
      const missing = expectedWorkflows.filter(w => !contributingWorkflows.has(w));

      if (missing.length > 0 && contributingWorkflows.size >= 2) {
        // At least 2 workflows found it, but some expected ones didn't
        conflicts.push({
          type: ContradictionType.EXISTENCE_CONFLICT,
          findings: group,
          foundBy: Array.from(contributingWorkflows),
          missedBy: missing,
          confidence: this.computeMissingConfidence(group, missing),
        });
      }
    }

    return conflicts;
  }
}
```

---

### Requirement 4: Determine Authoritative Result When Conflicts Exist

#### Authority Resolution Engine

```typescript
interface AuthorityResolution {
  contradictionId: string;
  authoritativeResult: NormalizedFinding;
  confidence: number;

  resolution: {
    method: ResolutionMethod;
    reasoning: string;
    supportingEvidence: Evidence[];
    dissenting: DissentingView[];
  };
}

enum ResolutionMethod {
  WORKFLOW_AUTHORITY = 'workflow_authority',   // Defer to workflow with higher weight
  MAJORITY_VOTE = 'majority_vote',             // Most workflows agree
  CONFIDENCE_WEIGHTED = 'confidence_weighted', // Weight by finding confidence
  SPECIFICITY = 'specificity',                 // More specific finding wins
  RECENCY = 'recency',                         // Most recent workflow version
  COMPOSITE = 'composite',                     // Combination of methods
}

class AuthorityResolver {
  private readonly defaultMethod = ResolutionMethod.COMPOSITE;

  resolve(
    contradiction: Contradiction,
    config: ResolutionConfig
  ): AuthorityResolution {
    const method = config.method ?? this.defaultMethod;

    switch (method) {
      case ResolutionMethod.WORKFLOW_AUTHORITY:
        return this.resolveByAuthority(contradiction, config);
      case ResolutionMethod.MAJORITY_VOTE:
        return this.resolveByMajority(contradiction, config);
      case ResolutionMethod.CONFIDENCE_WEIGHTED:
        return this.resolveByConfidence(contradiction, config);
      case ResolutionMethod.SPECIFICITY:
        return this.resolveBySpecificity(contradiction, config);
      case ResolutionMethod.COMPOSITE:
        return this.resolveComposite(contradiction, config);
    }
  }

  private resolveByAuthority(
    contradiction: Contradiction,
    config: ResolutionConfig
  ): AuthorityResolution {
    // Get workflow authority weights
    const weights = config.workflowAuthorities;

    // Find highest authority workflow
    let maxAuthority = 0;
    let authoritativeFinding: NormalizedFinding | null = null;

    for (const finding of contradiction.findings) {
      const authority = weights.get(finding.workflowId) ?? 0.5;
      if (authority > maxAuthority) {
        maxAuthority = authority;
        authoritativeFinding = finding;
      }
    }

    return this.buildResolution(
      contradiction,
      authoritativeFinding!,
      ResolutionMethod.WORKFLOW_AUTHORITY,
      `Workflow ${authoritativeFinding!.workflowId} has highest authority (${maxAuthority})`
    );
  }

  private resolveComposite(
    contradiction: Contradiction,
    config: ResolutionConfig
  ): AuthorityResolution {
    // Score each finding using multiple factors
    const scores = contradiction.findings.map(finding => ({
      finding,
      score: this.computeCompositeScore(finding, contradiction, config),
    }));

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    const winner = scores[0];
    const runner = scores[1];

    return this.buildResolution(
      contradiction,
      winner.finding,
      ResolutionMethod.COMPOSITE,
      this.generateCompositeReasoning(winner, runner, scores),
      { confidence: winner.score - (runner?.score ?? 0) }
    );
  }

  private computeCompositeScore(
    finding: NormalizedFinding,
    contradiction: Contradiction,
    config: ResolutionConfig
  ): number {
    const weights = config.compositeWeights ?? {
      authority: 0.3,
      confidence: 0.3,
      specificity: 0.2,
      evidence: 0.2,
    };

    const authorityScore = config.workflowAuthorities.get(finding.workflowId) ?? 0.5;
    const confidenceScore = finding.normalizedConfidence;
    const specificityScore = this.computeSpecificity(finding);
    const evidenceScore = this.computeEvidenceQuality(finding.originalFinding);

    return (
      weights.authority * authorityScore +
      weights.confidence * confidenceScore +
      weights.specificity * specificityScore +
      weights.evidence * evidenceScore
    );
  }
}
```

---

### Requirement 5: Handle Workflows with Different Granularity Levels

#### Granularity Alignment System

```typescript
interface GranularityLevel {
  level: number; // 1 = coarsest, 5 = finest
  scope: 'document' | 'section' | 'paragraph' | 'sentence' | 'token';
  typicalFindingCount: [number, number]; // min-max range
}

interface GranularityMapping {
  fromWorkflow: string;
  toWorkflow: string;
  mappingType: 'aggregate' | 'disaggregate' | 'align';
  mappingFunction: (findings: NormalizedFinding[]) => NormalizedFinding[];
}

class GranularityAligner {
  private granularityLevels: Map<string, GranularityLevel>;

  align(
    findings: NormalizedFinding[],
    targetGranularity: GranularityLevel
  ): AlignedFindings {
    const grouped = this.groupByWorkflow(findings);
    const aligned: NormalizedFinding[] = [];

    for (const [workflowId, workflowFindings] of grouped) {
      const sourceGranularity = this.granularityLevels.get(workflowId);

      if (!sourceGranularity) {
        // Unknown granularity, include as-is
        aligned.push(...workflowFindings);
        continue;
      }

      if (sourceGranularity.level === targetGranularity.level) {
        // Same level, no transformation needed
        aligned.push(...workflowFindings);
      } else if (sourceGranularity.level < targetGranularity.level) {
        // Source is coarser, need to disaggregate (if possible)
        const disaggregated = this.disaggregate(
          workflowFindings,
          sourceGranularity,
          targetGranularity
        );
        aligned.push(...disaggregated);
      } else {
        // Source is finer, need to aggregate
        const aggregated = this.aggregate(
          workflowFindings,
          sourceGranularity,
          targetGranularity
        );
        aligned.push(...aggregated);
      }
    }

    return {
      targetGranularity,
      findings: aligned,
      alignmentMetadata: this.buildAlignmentMetadata(),
    };
  }

  private aggregate(
    findings: NormalizedFinding[],
    source: GranularityLevel,
    target: GranularityLevel
  ): NormalizedFinding[] {
    // Group fine-grained findings into coarser buckets
    const locationGroups = this.groupByCoarseLocation(findings, target);

    return Array.from(locationGroups.values()).map(group => {
      if (group.length === 1) {
        return this.coarsenLocation(group[0], target);
      }

      // Merge multiple findings
      return {
        originalFindingId: `aggregated-${group.map(f => f.originalFindingId).join('-')}`,
        workflowId: group[0].workflowId,
        semanticCategory: this.dominantCategory(group),
        normalizedDescription: this.mergeDescriptions(group),
        canonicalLocation: this.computeCoarseLocation(group, target),
        normalizedSeverity: this.aggregateSeverity(group),
        normalizedConfidence: this.aggregateConfidence(group),
        originalFinding: this.mergeOriginalFindings(group),
        isAggregated: true,
        sourceFindings: group,
      };
    });
  }

  private disaggregate(
    findings: NormalizedFinding[],
    source: GranularityLevel,
    target: GranularityLevel
  ): NormalizedFinding[] {
    // Mark findings as coarse-grained, add uncertainty
    return findings.map(finding => ({
      ...finding,
      granularityMismatch: true,
      locationUncertainty: this.computeLocationUncertainty(source, target),
      comparisonScope: source.scope,
    }));
  }
}
```

#### Comparison Scope Matching

```typescript
class ScopeMatchedComparator {
  compare(
    normalizedResults: NormalizedResults,
    config: ComparisonConfig
  ): ConsistencyComparison[] {
    const comparisons: ConsistencyComparison[] = [];

    // Determine common comparison scope
    const commonScope = this.determineCommonScope(normalizedResults, config);

    // Align all findings to common scope
    const aligned = this.granularityAligner.align(
      normalizedResults.findings,
      commonScope
    );

    // Perform pairwise comparisons at aligned scope
    const findingPairs = this.generateComparisonPairs(aligned.findings);

    for (const [f1, f2] of findingPairs) {
      // Skip same-workflow comparisons
      if (f1.workflowId === f2.workflowId) continue;

      // Adjust comparison for granularity mismatch
      const comparison = this.comparator.compare(f1, f2);

      if (f1.granularityMismatch || f2.granularityMismatch) {
        comparison.granularityAdjusted = true;
        comparison.consistencyScore *= this.granularityPenalty(f1, f2);
      }

      comparisons.push(comparison);
    }

    return comparisons;
  }
}
```

---

### Requirement 6: Support Configurable Consistency Thresholds

#### Threshold Configuration System

```typescript
interface ConsistencyThresholds {
  // Overall consistency thresholds
  agreementThreshold: number;        // Above = agreement
  contradictionThreshold: number;     // Below = contradiction
  neutralRange: [number, number];     // Between = neutral/complementary

  // Per-workflow type thresholds
  workflowTypeThresholds: Map<WorkflowType, WorkflowThresholds>;

  // Per-category thresholds
  categoryThresholds: Map<string, CategoryThresholds>;

  // Comparison-specific thresholds
  severityTolerances: SeverityTolerances;
  locationOverlapMinimum: number;
  confidenceMinimum: number;
}

interface WorkflowThresholds {
  workflowType: WorkflowType;
  agreementBonus: number;      // Bonus when this workflow agrees
  contradictionPenalty: number; // Penalty when this workflow contradicts
  minimumConfidence: number;    // Ignore findings below this
}

class ThresholdEvaluator {
  private thresholds: ConsistencyThresholds;

  constructor(config: ThresholdConfig) {
    this.thresholds = this.buildThresholds(config);
  }

  evaluate(comparison: ConsistencyComparison): ThresholdEvaluation {
    const effectiveThresholds = this.getEffectiveThresholds(comparison);

    const score = comparison.consistencyScore;

    // Apply workflow-specific adjustments
    const adjustedScore = this.applyWorkflowAdjustments(score, comparison);

    // Determine classification based on thresholds
    let classification: ConsistencyClassification;

    if (adjustedScore >= effectiveThresholds.agreementThreshold) {
      classification = 'agreement';
    } else if (adjustedScore <= effectiveThresholds.contradictionThreshold) {
      classification = 'contradiction';
    } else if (adjustedScore > effectiveThresholds.neutralRange[0] &&
               adjustedScore < effectiveThresholds.neutralRange[1]) {
      classification = 'neutral';
    } else {
      classification = 'complementary';
    }

    return {
      originalScore: score,
      adjustedScore,
      classification,
      thresholdsUsed: effectiveThresholds,
      adjustmentDetails: this.getAdjustmentDetails(comparison),
    };
  }

  private getEffectiveThresholds(
    comparison: ConsistencyComparison
  ): EffectiveThresholds {
    // Start with defaults
    let thresholds = { ...this.thresholds };

    // Apply category-specific overrides
    const category = comparison.finding1.semanticCategory;
    if (this.thresholds.categoryThresholds.has(category)) {
      thresholds = {
        ...thresholds,
        ...this.thresholds.categoryThresholds.get(category),
      };
    }

    // Apply severity-based tolerances
    const avgSeverity = (
      comparison.finding1.normalizedSeverity +
      comparison.finding2.normalizedSeverity
    ) / 2;

    if (avgSeverity > 0.8) {
      // High severity = stricter thresholds
      thresholds.contradictionThreshold += 0.1;
    }

    return thresholds;
  }
}
```

#### Configuration API

```typescript
interface ConsistencyCheckerConfig {
  // Execution settings
  execution: {
    mode: 'parallel' | 'sequential' | 'hybrid';
    timeout: Duration;
    maxConcurrency: number;
  };

  // Threshold settings
  thresholds: ConsistencyThresholds;

  // Resolution settings
  resolution: {
    defaultMethod: ResolutionMethod;
    workflowAuthorities: Map<string, number>;
    compositeWeights: CompositeWeights;
    requireHumanReview: boolean;
    humanReviewThreshold: number;
  };

  // Granularity settings
  granularity: {
    defaultTargetScope: GranularityScope;
    allowDisaggregation: boolean;
    aggregationStrategy: AggregationStrategy;
  };

  // Reporting settings
  reporting: {
    includeNeutral: boolean;
    minConfidenceToReport: number;
    groupingStrategy: GroupingStrategy;
  };
}

// Example configuration
const defaultConfig: ConsistencyCheckerConfig = {
  execution: {
    mode: 'parallel',
    timeout: Duration.minutes(30),
    maxConcurrency: 5,
  },
  thresholds: {
    agreementThreshold: 0.8,
    contradictionThreshold: 0.3,
    neutralRange: [0.4, 0.7],
    severityTolerances: {
      critical: 0.1,
      major: 0.2,
      minor: 0.3,
    },
    locationOverlapMinimum: 0.5,
    confidenceMinimum: 0.3,
  },
  resolution: {
    defaultMethod: ResolutionMethod.COMPOSITE,
    workflowAuthorities: new Map([
      ['deep-verify', 0.9],
      ['quick-check', 0.6],
      ['ai-review', 0.7],
    ]),
    requireHumanReview: false,
    humanReviewThreshold: 0.5,
  },
};
```

---

### Requirement 7: Generate Consolidated View of All Workflow Results

#### Consolidated Report Generator

```typescript
interface ConsolidatedView {
  contentId: string;
  generatedAt: Date;

  // Summary statistics
  summary: {
    workflowsRun: number;
    totalFindings: number;
    agreements: number;
    contradictions: number;
    uniqueFindings: number;
    overallConsistencyScore: number;
  };

  // Findings organized by status
  findings: {
    agreed: ConsolidatedFinding[];      // Multiple workflows agree
    contradicted: ConsolidatedFinding[]; // Workflows disagree (with resolution)
    unique: ConsolidatedFinding[];       // Only found by one workflow
    complementary: ConsolidatedFinding[]; // Different aspects, no conflict
  };

  // Workflow-specific views
  workflowBreakdown: WorkflowBreakdown[];

  // Cross-workflow analysis
  crossAnalysis: CrossWorkflowAnalysis;
}

interface ConsolidatedFinding {
  findingId: string;

  // Core finding information (merged/resolved)
  category: string;
  description: string;
  location: CanonicalLocation;
  severity: NormalizedSeverity;
  confidence: number;

  // Source information
  sources: FindingSource[];
  consolidationType: 'agreed' | 'resolved' | 'unique' | 'complementary';

  // Resolution details (if applicable)
  resolution?: {
    method: ResolutionMethod;
    authoritativeSource: string;
    confidence: number;
    dissenting: DissentingSource[];
  };

  // Action items
  suggestedActions: string[];
  priority: Priority;
}

class ConsolidatedViewGenerator {
  generate(
    normalizedResults: NormalizedResults,
    comparisons: ConsistencyComparison[],
    resolutions: AuthorityResolution[],
    config: ConsolidationConfig
  ): ConsolidatedView {
    // Build finding groups
    const findingGroups = this.buildFindingGroups(
      normalizedResults.findings,
      comparisons,
      resolutions
    );

    // Create consolidated findings
    const agreed = this.consolidateAgreed(findingGroups.agreed);
    const contradicted = this.consolidateContradicted(findingGroups.contradicted, resolutions);
    const unique = this.consolidateUnique(findingGroups.unique);
    const complementary = this.consolidateComplementary(findingGroups.complementary);

    // Build summary
    const summary = this.buildSummary(agreed, contradicted, unique, complementary, comparisons);

    // Build workflow breakdown
    const workflowBreakdown = this.buildWorkflowBreakdown(normalizedResults);

    // Build cross-analysis
    const crossAnalysis = this.buildCrossAnalysis(comparisons, resolutions);

    return {
      contentId: normalizedResults.executionId,
      generatedAt: new Date(),
      summary,
      findings: { agreed, contradicted, unique, complementary },
      workflowBreakdown,
      crossAnalysis,
    };
  }

  private buildSummary(
    agreed: ConsolidatedFinding[],
    contradicted: ConsolidatedFinding[],
    unique: ConsolidatedFinding[],
    complementary: ConsolidatedFinding[],
    comparisons: ConsistencyComparison[]
  ): ConsolidatedSummary {
    const totalFindings = agreed.length + contradicted.length + unique.length + complementary.length;

    // Compute overall consistency score
    const agreementCount = comparisons.filter(c => c.consistencyType === 'agreement').length;
    const totalComparisons = comparisons.length;
    const overallConsistencyScore = totalComparisons > 0
      ? agreementCount / totalComparisons
      : 1.0;

    return {
      workflowsRun: this.countWorkflows(comparisons),
      totalFindings,
      agreements: agreed.length,
      contradictions: contradicted.length,
      uniqueFindings: unique.length,
      overallConsistencyScore,
    };
  }
}
```

#### Report Formats

```typescript
class ReportFormatter {
  formatMarkdown(view: ConsolidatedView): string {
    let report = '';

    report += `# Consolidated Verification Report\n\n`;
    report += `Generated: ${view.generatedAt.toISOString()}\n\n`;

    // Summary section
    report += `## Summary\n\n`;
    report += `- Workflows Run: ${view.summary.workflowsRun}\n`;
    report += `- Total Findings: ${view.summary.totalFindings}\n`;
    report += `- Agreements: ${view.summary.agreements}\n`;
    report += `- Contradictions: ${view.summary.contradictions}\n`;
    report += `- Overall Consistency: ${(view.summary.overallConsistencyScore * 100).toFixed(1)}%\n\n`;

    // Agreed findings
    if (view.findings.agreed.length > 0) {
      report += `## Agreed Findings\n\n`;
      report += `_Findings where multiple workflows reached the same conclusion._\n\n`;
      for (const finding of view.findings.agreed) {
        report += this.formatFinding(finding);
      }
    }

    // Contradictions
    if (view.findings.contradicted.length > 0) {
      report += `## Resolved Contradictions\n\n`;
      report += `_Findings where workflows disagreed. Resolution provided._\n\n`;
      for (const finding of view.findings.contradicted) {
        report += this.formatContradictedFinding(finding);
      }
    }

    return report;
  }

  formatJSON(view: ConsolidatedView): string {
    return JSON.stringify(view, null, 2);
  }

  formatHTML(view: ConsolidatedView): string {
    // HTML template rendering
    return this.htmlTemplate.render(view);
  }
}
```

---

### Requirement 8: Scale to 5+ Workflows Without Exponential Complexity

#### Scalability Design

```typescript
// Complexity Analysis:
// - Naive pairwise: O(n * f^2) where n = workflows, f = findings per workflow
// - Our approach: O(n * f * log(f)) using spatial indexing

class ScalableComparator {
  // Use spatial index for location-based comparison
  private locationIndex: RTree<NormalizedFinding>;

  // Use semantic embedding index for description comparison
  private semanticIndex: VectorIndex<NormalizedFinding>;

  compareAll(findings: NormalizedFinding[]): ConsistencyComparison[] {
    // Build indices - O(f * log(f))
    this.buildIndices(findings);

    const comparisons: ConsistencyComparison[] = [];

    for (const finding of findings) {
      // Find candidates using indices - O(log(f))
      const locationCandidates = this.locationIndex.search(
        finding.canonicalLocation,
        this.locationSearchRadius
      );

      const semanticCandidates = this.semanticIndex.nearestNeighbors(
        finding.normalizedDescription,
        this.semanticNeighborCount
      );

      // Union candidates
      const candidates = this.unionCandidates(locationCandidates, semanticCandidates);

      // Compare only with candidates (not all findings)
      for (const candidate of candidates) {
        if (candidate.workflowId === finding.workflowId) continue;
        if (this.alreadyCompared(finding, candidate)) continue;

        const comparison = this.compare(finding, candidate);
        comparisons.push(comparison);

        this.markCompared(finding, candidate);
      }
    }

    return comparisons;
  }

  private buildIndices(findings: NormalizedFinding[]): void {
    // Build R-tree for location queries
    this.locationIndex = new RTree();
    for (const finding of findings) {
      this.locationIndex.insert(finding.canonicalLocation, finding);
    }

    // Build vector index for semantic queries
    this.semanticIndex = new VectorIndex();
    for (const finding of findings) {
      const embedding = this.embedder.embed(finding.normalizedDescription);
      this.semanticIndex.add(embedding, finding);
    }
  }
}
```

#### Parallel Processing for Scale

```typescript
class ParallelConsistencyChecker {
  private readonly workerPool: WorkerPool;

  async checkConsistency(
    normalizedResults: NormalizedResults,
    config: ConsistencyCheckerConfig
  ): Promise<ConsistencyReport> {
    const findings = normalizedResults.findings;

    // Partition findings for parallel processing
    const partitions = this.partitionFindings(findings, config.execution.maxConcurrency);

    // Process partitions in parallel
    const partitionResults = await Promise.all(
      partitions.map(partition =>
        this.workerPool.submit(() =>
          this.processPartition(partition, findings)
        )
      )
    );

    // Merge results
    const mergedComparisons = this.mergeResults(partitionResults);

    // Cross-partition comparisons (border regions)
    const crossPartitionComparisons = await this.compareCrossPartition(partitions);

    return {
      comparisons: [...mergedComparisons, ...crossPartitionComparisons],
      metadata: {
        partitionCount: partitions.length,
        parallelSpeedup: this.computeSpeedup(partitionResults),
      },
    };
  }

  private partitionFindings(
    findings: NormalizedFinding[],
    numPartitions: number
  ): NormalizedFinding[][] {
    // Use location-based partitioning for spatial locality
    const sorted = findings.sort((a, b) =>
      this.locationSortKey(a) - this.locationSortKey(b)
    );

    const partitionSize = Math.ceil(sorted.length / numPartitions);
    const partitions: NormalizedFinding[][] = [];

    for (let i = 0; i < numPartitions; i++) {
      partitions.push(sorted.slice(i * partitionSize, (i + 1) * partitionSize));
    }

    return partitions;
  }
}
```

#### Incremental Comparison

```typescript
class IncrementalConsistencyChecker {
  private cache: ComparisonCache;

  async checkIncremental(
    previousResults: NormalizedResults,
    newWorkflowResult: WorkflowResult
  ): Promise<ConsistencyReport> {
    // Normalize new results
    const newFindings = this.normalizer.normalizeWorkflow(newWorkflowResult);

    // Get cached comparisons
    const cached = this.cache.get(previousResults.executionId);

    // Only compare new workflow against existing
    const newComparisons: ConsistencyComparison[] = [];

    for (const newFinding of newFindings) {
      for (const existingFinding of previousResults.findings) {
        const comparison = this.comparator.compare(newFinding, existingFinding);
        newComparisons.push(comparison);
      }
    }

    // Merge with cached
    const allComparisons = [...cached.comparisons, ...newComparisons];

    // Update cache
    this.cache.update(previousResults.executionId, allComparisons);

    return {
      comparisons: allComparisons,
      incremental: true,
      newComparisonsCount: newComparisons.length,
    };
  }
}
```

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-3)

1. **Workflow Execution Engine**
   - Implement parallel workflow executor
   - Build workflow configuration system
   - Create execution monitoring
   - Set up result collection

2. **Results Normalization**
   - Define normalized finding schema
   - Implement normalization transformers
   - Build severity/confidence mappings
   - Create location canonicalization

### Phase 2: Comparison Engine (Weeks 4-6)

3. **Consistency Comparator**
   - Implement semantic comparison
   - Build location overlap detection
   - Create comparison indexing (R-tree, vector)
   - Optimize for scale

4. **Contradiction Detection**
   - Implement contradiction classifier
   - Build missing finding detector
   - Create contradiction grouping
   - Add evidence collection

### Phase 3: Resolution & Consolidation (Weeks 7-9)

5. **Authority Resolution**
   - Implement resolution strategies
   - Build composite resolver
   - Create confidence scoring
   - Add dissent tracking

6. **Granularity Handling**
   - Implement aggregation logic
   - Build scope matching
   - Create granularity metadata
   - Test cross-granularity comparison

### Phase 4: Reporting & Scale (Weeks 10-12)

7. **Consolidated View Generator**
   - Build consolidation logic
   - Implement report formatters
   - Create visualization support
   - Add export capabilities

8. **Scale Optimization**
   - Implement parallel processing
   - Build incremental comparison
   - Add caching layer
   - Performance testing with 5+ workflows

---

## Assumptions

1. **Workflow Output Format**: All workflows produce findings in a structured format that can be normalized, even if the specific schemas differ.

2. **Location Representability**: Content locations can be canonicalized to a common format that allows meaningful overlap comparison.

3. **Semantic Comparability**: Finding descriptions contain enough semantic information to compute meaningful similarity scores.

4. **Workflow Independence**: Workflows produce independent results - running workflow A does not influence workflow B's findings.

5. **Stability**: Workflows are deterministic - running the same workflow twice on the same content produces the same findings.

6. **Authority Information**: Workflow authority weights are provided or can be inferred from workflow metadata.

7. **Resource Availability**: Sufficient compute resources exist for parallel workflow execution.

8. **Threshold Validity**: Consistency thresholds configured by users are meaningful for their use case.

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Semantic comparison inaccuracy | Medium | High | Multiple comparison methods, confidence scoring |
| Granularity mismatch confusion | Medium | Medium | Clear metadata, uncertainty propagation |
| Performance degradation at scale | Low | High | Indexing, caching, parallel processing |
| Incorrect authority resolution | Medium | Medium | Multiple resolution methods, dissent tracking |
| Configuration complexity | Medium | Low | Good defaults, validation, documentation |

---

## Success Criteria

1. **Correctness**: >95% accuracy in identifying true contradictions
2. **Completeness**: >90% of cross-workflow comparisons captured
3. **Scalability**: Linear or sub-linear time with 5+ workflows
4. **Latency**: <5 minutes for full comparison of 5 workflows, 1000 findings each
5. **Resolution Quality**: >80% of resolved contradictions rated correct by reviewers
6. **Report Usefulness**: >85% of users find consolidated view helpful

---

## Appendix: Complexity Analysis

### Time Complexity

| Operation | Naive | Optimized |
|-----------|-------|-----------|
| Pairwise comparison (n workflows, f findings) | O(n^2 * f^2) | O(n * f * log(f)) |
| Index building | N/A | O(f * log(f)) |
| Conflict detection | O(c^2) | O(c * log(c)) |
| Consolidation | O(f * n) | O(f * n) |
| Total | O(n^2 * f^2) | O(n * f * log(f)) |

### Space Complexity

| Structure | Size |
|-----------|------|
| Normalized findings | O(n * f) |
| R-tree index | O(f) |
| Vector index | O(f * d) where d = embedding dimension |
| Comparison cache | O(f^2) worst case, O(f * k) with k neighbors |

---

*Document Version: 1.0*
*Last Updated: 2026-01-12*
