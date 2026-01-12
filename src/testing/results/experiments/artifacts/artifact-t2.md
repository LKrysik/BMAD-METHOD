# Method Recommendation Engine - Technical Specification

**Task:** T2 - Method Recommendation Engine
**Author:** AI Software Architect
**Date:** 2026-01-12
**Version:** 1.0

---

## Executive Summary

This technical specification defines a Method Recommendation Engine for the BMAD-METHOD project. The engine analyzes task descriptions and recommends the top 5 most appropriate methods from `methods.csv`, ensuring category diversity, providing explanations for selections, and handling edge cases such as ambiguous tasks or poor matches. The design emphasizes reproducibility (deterministic outputs) and seamless integration with existing workflow phases.

### Key Design Decisions

1. **Multi-factor scoring algorithm** combining relevance, complementarity, and coverage
2. **Semantic analysis** using keyword extraction and method signature matching
3. **Diversity constraint enforcement** ensuring at least 3 categories in recommendations
4. **Ambiguity detection** with clarifying question generation
5. **Deterministic output** through fixed random seeds and stable sorting

---

## Architecture Overview

### System Context

```
+-------------------+     +------------------------+     +-------------------+
|                   |     |                        |     |                   |
|  Task Description |---->|  Method Recommendation |---->|  Top 5 Methods    |
|  (User Input)     |     |  Engine                |     |  + Explanations   |
|                   |     |                        |     |                   |
+-------------------+     +------------------------+     +-------------------+
                                    |
                         +----------+----------+
                         |                     |
                         v                     v
              +-------------------+  +-------------------+
              |                   |  |                   |
              |  methods.csv      |  |  Workflow         |
              |  (150 methods)    |  |  Integration      |
              |                   |  |                   |
              +-------------------+  +-------------------+
```

### Component Architecture

```
+------------------------------------------------------------------+
|                   Method Recommendation Engine                    |
+------------------------------------------------------------------+
|                                                                    |
|  +---------------+  +------------------+  +--------------------+  |
|  |               |  |                  |  |                    |  |
|  | Task          |  | Relevance        |  | Diversity          |  |
|  | Analyzer      |  | Scorer           |  | Enforcer           |  |
|  |               |  |                  |  |                    |  |
|  +---------------+  +------------------+  +--------------------+  |
|         |                  |                      |               |
|         v                  v                      v               |
|  +---------------+  +------------------+  +--------------------+  |
|  |               |  |                  |  |                    |  |
|  | Ambiguity     |  | Complementarity  |  | Explanation        |  |
|  | Detector      |  | Calculator       |  | Generator          |  |
|  |               |  |                  |  |                    |  |
|  +---------------+  +------------------+  +--------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

---

## Detailed Design

### Requirement 1: Analyze Task and Recommend Top 5 Methods

**Design:**

The recommendation process follows a multi-stage pipeline:

```
Stage 1: Task Parsing
    ↓
Stage 2: Feature Extraction
    ↓
Stage 3: Method Scoring
    ↓
Stage 4: Diversity Filtering
    ↓
Stage 5: Top 5 Selection
    ↓
Stage 6: Explanation Generation
```

**Data Structures:**

```typescript
// Method from methods.csv
interface Method {
  num: number;
  category: MethodCategory;
  method_name: string;
  description: string;
  output_pattern: string;
}

type MethodCategory =
  | "collaboration" | "advanced" | "competitive" | "technical"
  | "creative" | "research" | "anti-bias" | "risk"
  | "core" | "sanity" | "coherence" | "exploration"
  | "epistemology" | "challenge" | "meta" | "protocol"
  | "theory";

// Task analysis result
interface TaskAnalysis {
  originalText: string;
  keywords: string[];
  domain: string[];
  complexity: "low" | "medium" | "high";
  intent: TaskIntent;
  features: TaskFeature[];
}

type TaskIntent = "verify" | "generate" | "understand" | "decide" | "explore";

// Recommendation output
interface Recommendation {
  methods: RankedMethod[];
  explanations: Map<number, string>;
  categoryDistribution: Map<MethodCategory, number>;
  confidence: number;
  warnings: string[];
}

interface RankedMethod {
  method: Method;
  score: number;
  relevanceScore: number;
  complementarityScore: number;
  coverageScore: number;
}
```

**Core Algorithm:**

```typescript
class MethodRecommendationEngine {
  private methods: Method[];
  private methodIndex: MethodIndex;

  async recommend(taskDescription: string): Promise<Recommendation> {
    // Stage 1: Parse and analyze task
    const analysis = this.analyzeTask(taskDescription);

    // Stage 2: Check for ambiguity
    const ambiguityCheck = this.detectAmbiguity(analysis);
    if (ambiguityCheck.isAmbiguous) {
      return this.generateClarificationRequest(ambiguityCheck);
    }

    // Stage 3: Score all methods
    const scoredMethods = this.scoreAllMethods(analysis);

    // Stage 4: Apply diversity constraints
    const diverseMethods = this.enforceDiversity(scoredMethods);

    // Stage 5: Select top 5
    const top5 = diverseMethods.slice(0, 5);

    // Stage 6: Generate explanations
    const explanations = this.generateExplanations(top5, analysis);

    return {
      methods: top5,
      explanations,
      categoryDistribution: this.calculateDistribution(top5),
      confidence: this.calculateConfidence(top5),
      warnings: this.generateWarnings(top5, analysis)
    };
  }
}
```

### Requirement 2: Category Diversity (At Least 3 Categories)

**Design:**

The Diversity Enforcer ensures minimum category representation:

```typescript
interface DiversityConstraints {
  minCategories: 3;
  maxPerCategory: 2;
  preferredCategories?: MethodCategory[];
}

class DiversityEnforcer {
  enforce(
    rankedMethods: RankedMethod[],
    constraints: DiversityConstraints
  ): RankedMethod[] {
    const result: RankedMethod[] = [];
    const categoryCount = new Map<MethodCategory, number>();

    // First pass: Select best method from each category
    const byCategory = this.groupByCategory(rankedMethods);
    const categories = Array.from(byCategory.keys());

    // Ensure minimum categories
    for (const category of categories) {
      if (result.length >= 5) break;
      const categoryMethods = byCategory.get(category)!;
      if (categoryMethods.length > 0) {
        result.push(categoryMethods[0]);
        categoryCount.set(category, 1);
      }
    }

    // Second pass: Fill remaining slots with best overall scores
    const usedMethodIds = new Set(result.map(m => m.method.num));

    for (const method of rankedMethods) {
      if (result.length >= 5) break;
      if (usedMethodIds.has(method.method.num)) continue;

      const catCount = categoryCount.get(method.method.category) || 0;
      if (catCount < constraints.maxPerCategory) {
        result.push(method);
        categoryCount.set(method.method.category, catCount + 1);
      }
    }

    // Validate diversity
    if (categoryCount.size < constraints.minCategories) {
      // Force diversity by replacing lowest-scored duplicates
      result = this.forceMinimumCategories(result, rankedMethods, constraints);
    }

    return result.sort((a, b) => b.score - a.score);
  }
}
```

**Category Priority Matrix:**

| Task Intent | Primary Categories | Secondary Categories |
|-------------|-------------------|----------------------|
| verify | sanity, core, coherence | epistemology, challenge |
| generate | creative, exploration, collaboration | advanced |
| understand | research, core, epistemology | meta |
| decide | risk, competitive, protocol | challenge |
| explore | exploration, creative, advanced | collaboration |

### Requirement 3: Weighting (Relevance, Complementarity, Coverage)

**Design:**

**Score Calculation:**

```
TotalScore = w1 * Relevance + w2 * Complementarity + w3 * Coverage

Where:
  w1 = 0.5 (relevance weight)
  w2 = 0.3 (complementarity weight)
  w3 = 0.2 (coverage weight)
```

**Relevance Scoring:**

```typescript
class RelevanceScorer {
  // Keyword-based matching
  private keywordWeights: Map<string, Map<number, number>>;

  scoreRelevance(method: Method, analysis: TaskAnalysis): number {
    let score = 0;

    // Keyword match (0-40 points)
    score += this.calculateKeywordMatch(method, analysis.keywords);

    // Domain match (0-30 points)
    score += this.calculateDomainMatch(method, analysis.domain);

    // Intent match (0-20 points)
    score += this.calculateIntentMatch(method, analysis.intent);

    // Complexity match (0-10 points)
    score += this.calculateComplexityMatch(method, analysis.complexity);

    return score / 100; // Normalize to 0-1
  }

  private calculateKeywordMatch(method: Method, keywords: string[]): number {
    const methodText = `${method.method_name} ${method.description}`.toLowerCase();
    let matches = 0;

    for (const keyword of keywords) {
      if (methodText.includes(keyword.toLowerCase())) {
        matches++;
      }
    }

    return Math.min(40, (matches / keywords.length) * 40);
  }
}
```

**Complementarity Scoring:**

```typescript
class ComplementarityCalculator {
  // Method pairs that work well together
  private synergies: Map<number, number[]> = new Map([
    [71, [72, 73, 80]],    // First Principles + 5 Whys + Inversion
    [21, [34, 61]],        // Red Team + Security Audit + Pre-mortem
    [81, [82, 84]],        // Scope Audit + Alignment + Coherence
    // ... more synergy pairs
  ]);

  // Method pairs that overlap significantly (avoid together)
  private overlaps: Map<number, number[]> = new Map([
    [14, [151]],           // Self-Consistency overlaps with Semantic Entropy
    [71, [152]],           // First Principles overlaps with Socratic Decomposition
    // ... more overlap pairs
  ]);

  scoreComplementarity(candidate: Method, selected: Method[]): number {
    let synergyBonus = 0;
    let overlapPenalty = 0;

    for (const method of selected) {
      // Check synergy
      if (this.synergies.get(method.num)?.includes(candidate.num)) {
        synergyBonus += 0.15;
      }

      // Check overlap
      if (this.overlaps.get(method.num)?.includes(candidate.num)) {
        overlapPenalty += 0.25;
      }
    }

    return Math.max(0, 1 - overlapPenalty + synergyBonus);
  }
}
```

**Coverage Scoring:**

```typescript
class CoverageCalculator {
  // Coverage dimensions
  private dimensions = [
    "structure",    // Does it check structure?
    "logic",        // Does it check logic/reasoning?
    "completeness", // Does it check completeness?
    "correctness",  // Does it check correctness?
    "coherence",    // Does it check coherence?
    "assumptions",  // Does it surface assumptions?
    "risks"         // Does it identify risks?
  ];

  private methodCoverage: Map<number, string[]>;

  scoreCoverage(candidate: Method, selected: Method[]): number {
    const coveredDimensions = new Set<string>();

    // Get dimensions covered by selected methods
    for (const method of selected) {
      const dims = this.methodCoverage.get(method.num) || [];
      dims.forEach(d => coveredDimensions.add(d));
    }

    // Get dimensions covered by candidate
    const candidateDims = this.methodCoverage.get(candidate.num) || [];

    // Score based on NEW dimensions covered
    let newDimensions = 0;
    for (const dim of candidateDims) {
      if (!coveredDimensions.has(dim)) {
        newDimensions++;
      }
    }

    return newDimensions / this.dimensions.length;
  }
}
```

### Requirement 4: Explain Selection Rationale

**Design:**

Each recommendation includes a human-readable explanation:

```typescript
interface MethodExplanation {
  methodId: number;
  methodName: string;
  whySelected: string;
  keywordMatches: string[];
  complementsOthers: string[];
  coverageContribution: string[];
  confidence: "high" | "medium" | "low";
}

class ExplanationGenerator {
  generate(
    method: RankedMethod,
    analysis: TaskAnalysis,
    selectedMethods: RankedMethod[]
  ): MethodExplanation {
    return {
      methodId: method.method.num,
      methodName: method.method.method_name,
      whySelected: this.generateWhyStatement(method, analysis),
      keywordMatches: this.findKeywordMatches(method, analysis),
      complementsOthers: this.findComplementaryMethods(method, selectedMethods),
      coverageContribution: this.describeCoverageContribution(method),
      confidence: this.assessConfidence(method)
    };
  }

  private generateWhyStatement(method: RankedMethod, analysis: TaskAnalysis): string {
    const reasons: string[] = [];

    if (method.relevanceScore > 0.7) {
      reasons.push(`directly addresses ${analysis.intent} tasks`);
    }

    if (method.complementarityScore > 0.8) {
      reasons.push("complements other selected methods well");
    }

    if (method.coverageScore > 0.5) {
      reasons.push("covers verification dimensions not addressed by others");
    }

    return `Selected because it ${reasons.join(" and ")}.`;
  }
}
```

**Example Output:**

```markdown
## Recommended Methods for: "Verify our API authentication implementation"

### 1. #34 Security Audit Personas (Score: 0.89)
**Why selected:** Directly addresses security verification tasks and provides
hacker/defender/auditor perspectives on authentication systems.
- Keywords matched: "authentication", "security", "API"
- Complements: #21 Red Team, #61 Pre-mortem
- Coverage: Adds vulnerability analysis dimension

### 2. #37 API Design Review (Score: 0.82)
**Why selected:** Specifically designed for API verification, checking consistency
and completeness of interfaces.
- Keywords matched: "API", "implementation"
- Coverage: Adds interface consistency dimension

[... continues for all 5 methods ...]
```

### Requirement 5: Detect Ambiguity and Ask Clarifying Questions

**Design:**

```typescript
interface AmbiguityCheck {
  isAmbiguous: boolean;
  ambiguityType: AmbiguityType;
  confidence: number;
  clarifyingQuestions: string[];
}

type AmbiguityType =
  | "too_vague"          // Task too general
  | "multiple_intents"   // Could be verify OR generate
  | "unclear_scope"      // What exactly to analyze?
  | "missing_context"    // Need more information
  | "contradictory";     // Conflicting requirements

class AmbiguityDetector {
  private readonly AMBIGUITY_THRESHOLD = 0.6;

  detect(analysis: TaskAnalysis): AmbiguityCheck {
    const checks = [
      this.checkVagueness(analysis),
      this.checkMultipleIntents(analysis),
      this.checkScopeClarity(analysis),
      this.checkContextCompleteness(analysis),
      this.checkContradictions(analysis)
    ];

    const maxAmbiguity = Math.max(...checks.map(c => c.score));

    if (maxAmbiguity > this.AMBIGUITY_THRESHOLD) {
      const primary = checks.find(c => c.score === maxAmbiguity)!;
      return {
        isAmbiguous: true,
        ambiguityType: primary.type,
        confidence: maxAmbiguity,
        clarifyingQuestions: this.generateQuestions(primary.type, analysis)
      };
    }

    return { isAmbiguous: false, ambiguityType: "too_vague", confidence: 0, clarifyingQuestions: [] };
  }

  private generateQuestions(type: AmbiguityType, analysis: TaskAnalysis): string[] {
    const questionTemplates: Record<AmbiguityType, string[]> = {
      too_vague: [
        "What specific aspect would you like to focus on?",
        "Are you trying to verify, generate, or understand something?",
        "What would a successful outcome look like?"
      ],
      multiple_intents: [
        "Should I prioritize verification methods or creative exploration?",
        "Is this primarily about finding problems or generating solutions?"
      ],
      unclear_scope: [
        "What artifacts or files should be analyzed?",
        "Is this about a single component or the entire system?"
      ],
      missing_context: [
        "What domain is this task in (security, performance, API, etc.)?",
        "Are there existing patterns or constraints to consider?"
      ],
      contradictory: [
        "I noticed potentially conflicting requirements. Could you clarify [specific conflict]?"
      ]
    };

    return questionTemplates[type];
  }
}
```

### Requirement 6: Handle Edge Case - No Good Matches

**Design:**

When no methods score above a minimum threshold:

```typescript
interface NoMatchResult {
  type: "no_match";
  bestAvailable: RankedMethod[];
  explanation: string;
  suggestions: string[];
}

class EdgeCaseHandler {
  private readonly MIN_ACCEPTABLE_SCORE = 0.3;

  handleNoMatch(scoredMethods: RankedMethod[], analysis: TaskAnalysis): NoMatchResult {
    const bestAvailable = scoredMethods
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const maxScore = bestAvailable[0]?.score || 0;

    return {
      type: "no_match",
      bestAvailable,
      explanation: this.generateNoMatchExplanation(maxScore, analysis),
      suggestions: this.generateSuggestions(analysis)
    };
  }

  private generateNoMatchExplanation(maxScore: number, analysis: TaskAnalysis): string {
    if (maxScore < 0.1) {
      return "The task description doesn't match any known verification patterns. " +
             "Consider rephrasing or providing more specific requirements.";
    }

    if (maxScore < 0.2) {
      return "Only weak matches found. The task may be outside the scope of " +
             "available methods or require domain-specific techniques.";
    }

    return "Partial matches found, but confidence is low. The following methods " +
           "may provide some value but are not ideal for this task.";
  }

  private generateSuggestions(analysis: TaskAnalysis): string[] {
    return [
      "Try adding domain-specific keywords (security, performance, API, etc.)",
      "Specify the type of artifact being analyzed (code, document, plan)",
      "Clarify whether you want to verify, generate, or understand",
      "Consider breaking the task into smaller, more specific sub-tasks"
    ];
  }
}
```

### Requirement 7: Reproducibility (Same Input = Same Output)

**Design:**

Deterministic output is ensured through:

1. **Fixed Sorting Algorithm:**

```typescript
function stableSort<T>(array: T[], compareFn: (a: T, b: T) => number): T[] {
  // Decorate-sort-undecorate pattern for stability
  return array
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const result = compareFn(a.item, b.item);
      return result !== 0 ? result : a.index - b.index;
    })
    .map(({ item }) => item);
}
```

2. **Deterministic Tie-Breaking:**

```typescript
function breakTies(methods: RankedMethod[]): RankedMethod[] {
  return stableSort(methods, (a, b) => {
    // Primary: score (descending)
    if (a.score !== b.score) return b.score - a.score;

    // Secondary: method number (ascending) - deterministic tie-breaker
    return a.method.num - b.method.num;
  });
}
```

3. **No Random Components:**

All scoring functions are purely deterministic with no random elements.

4. **Canonical Keyword Processing:**

```typescript
function canonicalizeKeywords(keywords: string[]): string[] {
  return keywords
    .map(k => k.toLowerCase().trim())
    .filter(k => k.length > 0)
    .sort()  // Alphabetical order for consistency
    .filter((k, i, arr) => arr.indexOf(k) === i);  // Deduplicate
}
```

### Requirement 8: Workflow Integration

**Design:**

Integration with existing workflow phases (e.g., Deep Verify v6.4):

```typescript
interface WorkflowIntegration {
  // Hook into Phase 3 (Method Selection)
  provideMethodsForPhase3(
    features: ArtifactFeatures,
    methodBudget: { min: number; max: number }
  ): RankedMethod[];

  // Hook into Phase 2 (Concern Generation)
  suggestMethodsForConcern(concern: Concern): RankedMethod[];

  // Support existing method_scores.yaml
  loadHistoricalScores(scoresPath: string): void;
  incorporateHistoricalPerformance(methods: RankedMethod[]): RankedMethod[];
}

class WorkflowAdapter {
  private engine: MethodRecommendationEngine;
  private historicalScores: Map<number, { [type: string]: number }>;

  async provideMethodsForPhase3(
    features: ArtifactFeatures,
    methodBudget: { min: number; max: number }
  ): Promise<RankedMethod[]> {
    // Convert features to task description
    const taskDescription = this.featuresToTask(features);

    // Get recommendations
    const recommendations = await this.engine.recommend(taskDescription);

    // Incorporate historical scores
    const adjusted = this.incorporateHistoricalPerformance(
      recommendations.methods
    );

    // Respect method budget
    const budgetAdjusted = adjusted.slice(
      0,
      Math.min(methodBudget.max, Math.max(methodBudget.min, adjusted.length))
    );

    return budgetAdjusted;
  }

  private featuresToTask(features: ArtifactFeatures): string {
    const parts: string[] = [];

    parts.push(`Verify a ${features.type}`);

    if (features.domain.length > 0) {
      parts.push(`in the ${features.domain.join(", ")} domain`);
    }

    if (features.has_security_aspect) {
      parts.push("with security considerations");
    }

    if (features.has_external_deps) {
      parts.push("that integrates with external components");
    }

    return parts.join(" ");
  }
}
```

**Integration Points:**

| Workflow Phase | Integration Point | Engine Method |
|----------------|-------------------|---------------|
| Phase 0.5 Context Analysis | Feature extraction | `analyzeTask()` |
| Phase 2 Concerns | Method suggestions per concern | `suggestMethodsForConcern()` |
| Phase 3 Method Selection | Adaptive selection | `provideMethodsForPhase3()` |
| Phase 7.5 Learning | Score updates | `updateScores()` |

---

## Implementation Plan

### Phase 1: Core Engine (Week 1-2)

| Task | Description | Effort |
|------|-------------|--------|
| 1.1 | Parse and index methods.csv | 8h |
| 1.2 | Implement task analyzer | 16h |
| 1.3 | Build relevance scorer | 16h |
| 1.4 | Create complementarity calculator | 12h |
| 1.5 | Implement coverage scorer | 8h |

### Phase 2: Diversity and Edge Cases (Week 3)

| Task | Description | Effort |
|------|-------------|--------|
| 2.1 | Implement diversity enforcer | 12h |
| 2.2 | Build ambiguity detector | 12h |
| 2.3 | Handle no-match edge case | 8h |
| 2.4 | Ensure reproducibility | 8h |

### Phase 3: Integration and Explanation (Week 4)

| Task | Description | Effort |
|------|-------------|--------|
| 3.1 | Create explanation generator | 12h |
| 3.2 | Build workflow adapter | 16h |
| 3.3 | Integration testing | 12h |

### Phase 4: Testing and Documentation (Week 5)

| Task | Description | Effort |
|------|-------------|--------|
| 4.1 | Unit tests for all components | 16h |
| 4.2 | Integration tests | 8h |
| 4.3 | Reproducibility test suite | 8h |
| 4.4 | API documentation | 8h |

---

## Assumptions

1. **Methods.csv Stability**: The structure of methods.csv (num, category, method_name, description, output_pattern) remains stable.

2. **Category Exhaustiveness**: The 17 categories in methods.csv are comprehensive and cover all verification needs.

3. **English Language**: Task descriptions are in English. Multi-language support would require additional NLP components.

4. **Keyword-Based Matching**: Simple keyword matching is sufficient for initial relevance scoring. More sophisticated NLP (embeddings, LLMs) can be added later.

5. **Static Synergy Definitions**: Method synergies and overlaps are defined statically. Dynamic learning of synergies is out of scope.

6. **Single User Context**: The engine does not maintain user-specific preference learning across sessions.

7. **Synchronous Operation**: The engine operates synchronously without streaming requirements.

8. **Method Budget Compliance**: The engine respects method budget constraints from the workflow without override capability.

---

## API Reference

### Primary Interface

```typescript
export interface MethodRecommendationEngine {
  // Main recommendation function
  recommend(taskDescription: string): Promise<Recommendation>;

  // Workflow integration
  recommendForWorkflow(
    features: ArtifactFeatures,
    budget: MethodBudget
  ): Promise<RankedMethod[]>;

  // Configuration
  setWeights(weights: ScoringWeights): void;
  setDiversityConstraints(constraints: DiversityConstraints): void;

  // Introspection
  explainScore(methodId: number, taskDescription: string): ScoreBreakdown;
  getMethodById(id: number): Method | undefined;
  searchMethods(query: string): Method[];
}

export interface ScoringWeights {
  relevance: number;       // Default: 0.5
  complementarity: number; // Default: 0.3
  coverage: number;        // Default: 0.2
}

export interface ScoreBreakdown {
  total: number;
  relevance: { score: number; factors: string[] };
  complementarity: { score: number; synergies: number[]; overlaps: number[] };
  coverage: { score: number; dimensions: string[] };
}
```

---

## Conclusion

This Method Recommendation Engine provides an intelligent, explainable, and reproducible way to select verification methods for any task. The multi-factor scoring approach balances relevance with diversity and coverage, ensuring comprehensive verification. The design integrates seamlessly with existing BMAD-METHOD workflows while providing clear explanations for every recommendation.
