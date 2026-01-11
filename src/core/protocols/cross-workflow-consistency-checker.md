# Cross-Workflow Consistency Checker (CWCC)

**Version:** 1.0.0
**Status:** Design Specification
**Author:** BMAD Core Team
**Created:** 2026-01-11
**Purpose:** Detect and resolve inconsistencies when multiple workflows analyze the same content

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope and Assumptions](#2-scope-and-assumptions)
3. [Architecture Overview](#3-architecture-overview)
4. [Result Normalization Layer](#4-result-normalization-layer)
5. [Consistency Comparison Engine](#5-consistency-comparison-engine)
6. [Contradiction Detection](#6-contradiction-detection)
7. [Conflict Resolution Framework](#7-conflict-resolution-framework)
8. [Granularity Harmonization](#8-granularity-harmonization)
9. [Consistency Thresholds](#9-consistency-thresholds)
10. [Consolidated Reporting](#10-consolidated-reporting)
11. [Scalability Design](#11-scalability-design)
12. [Implementation Guidance](#12-implementation-guidance)
13. [Edge Cases and Failure Modes](#13-edge-cases-and-failure-modes)

---

## 1. Executive Summary

The Cross-Workflow Consistency Checker (CWCC) is a framework for running multiple verification or analysis workflows against the same content and systematically comparing their results to detect, flag, and resolve inconsistencies.

### 1.1 Problem Statement

When multiple workflows (e.g., Deep Verify, V-GD, QVP, UAQG) analyze the same artifact, they may produce:
- **Contradictory findings** (one says X is wrong, another says X is correct)
- **Complementary findings** (different aspects detected by different workflows)
- **Overlapping findings** (same issue described differently)
- **Conflicting severity assessments** (same issue rated differently)

Without a systematic approach to reconcile these differences, users face:
- Analysis paralysis from conflicting expert opinions
- Risk of dismissing valid findings due to disagreement
- Difficulty determining which workflow to trust

### 1.2 Solution Overview

CWCC provides:

1. **Result Normalization** - Transform diverse workflow outputs to a common format
2. **Consistency Comparison** - Systematically compare findings across workflows
3. **Contradiction Detection** - Identify direct conflicts between workflow findings
4. **Conflict Resolution** - Determine authoritative results using configurable strategies
5. **Granularity Harmonization** - Handle workflows that operate at different detail levels
6. **Configurable Thresholds** - Allow tuning of consistency sensitivity
7. **Consolidated Reporting** - Unified view of all workflow results with conflict annotations
8. **Scalable Design** - O(n) complexity for n workflows, not O(n^2)

---

## 2. Scope and Assumptions

### 2.1 In Scope

- Running multiple workflows on identical content
- Normalizing workflow outputs to common format
- Detecting contradictions between workflow findings
- Resolving conflicts through configurable strategies
- Handling workflows with different granularity levels
- Configurable consistency threshold settings
- Generating consolidated cross-workflow reports
- Scaling to 5+ workflows efficiently

### 2.2 Out of Scope

- Workflow implementation details (internal logic of individual workflows)
- Content modification based on findings
- Automated fixing of detected issues
- Real-time workflow streaming
- Distributed workflow execution across systems

### 2.3 Assumptions

| Assumption | Rationale | Risk if Invalid |
|------------|-----------|-----------------|
| Workflows produce structured output | Required for comparison | Need custom parsers per workflow |
| Content is stable during analysis | Workflows analyze same version | Need content versioning |
| Workflows can be executed independently | Parallel execution possible | Sequential execution fallback |
| Finding descriptions are semantically meaningful | NLP-based matching possible | Need exact-match fallback |
| Severity scales are ordinal | Can compare across workflows | Need workflow-specific interpretation |
| Maximum 10 concurrent workflows | Memory/processing limits | Need streaming/batching |

### 2.4 Design Principles

1. **Protocol Agnostic:** Works with any workflow that produces findings
2. **Non-Destructive:** Original workflow outputs preserved unchanged
3. **Transparent Resolution:** All conflict resolution decisions are explainable
4. **Configurable Sensitivity:** Users control consistency strictness
5. **Evidence-Based Authority:** Workflow authority based on measured performance
6. **Fail-Safe Defaults:** Ambiguous cases flagged for human review

---

## 3. Architecture Overview

### 3.1 System Architecture

```
+------------------------------------------------------------------------------+
|                    CROSS-WORKFLOW CONSISTENCY CHECKER                         |
+------------------------------------------------------------------------------+
|                                                                               |
|  +-----------------+     +------------------+     +------------------+        |
|  |    CONTENT      |     |    WORKFLOW      |     |   CONFIGURATION  |        |
|  |    INPUT        |     |    REGISTRY      |     |   (Thresholds)   |        |
|  +-----------------+     +------------------+     +------------------+        |
|          |                       |                        |                   |
|          +-------------------+---+-----------+------------+                   |
|                              |                                                |
|                              v                                                |
|  +------------------------------------------------------------------------+  |
|  |                    WORKFLOW EXECUTION LAYER                             |  |
|  |  +----------+  +----------+  +----------+  +----------+  +----------+  |  |
|  |  |Workflow 1|  |Workflow 2|  |Workflow 3|  |Workflow 4|  |Workflow N|  |  |
|  |  | (DV-V6)  |  |  (V-GD)  |  |  (QVP)   |  |  (UAQG)  |  |   (...)  |  |  |
|  |  +----------+  +----------+  +----------+  +----------+  +----------+  |  |
|  +------------------------------------------------------------------------+  |
|                              |                                                |
|                              v                                                |
|  +------------------------------------------------------------------------+  |
|  |                    RESULT NORMALIZATION LAYER                           |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  |  | Schema Converter |  | Severity Mapper  |  | Category Mapper  |       |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  +------------------------------------------------------------------------+  |
|                              |                                                |
|                              v                                                |
|  +------------------------------------------------------------------------+  |
|  |                    CONSISTENCY COMPARISON ENGINE                        |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  |  | Semantic Matcher |  | Cluster Builder  |  | Overlap Detector |       |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  +------------------------------------------------------------------------+  |
|                              |                                                |
|                              v                                                |
|  +------------------------------------------------------------------------+  |
|  |                    CONTRADICTION DETECTION ENGINE                       |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  |  | Polarity Checker |  | Severity Conflict|  | Category Conflict|       |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  +------------------------------------------------------------------------+  |
|                              |                                                |
|                              v                                                |
|  +------------------------------------------------------------------------+  |
|  |                    CONFLICT RESOLUTION ENGINE                           |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  |  |Authority Ranking |  |Voting Resolution |  | Escalation Rules |       |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  +------------------------------------------------------------------------+  |
|                              |                                                |
|                              v                                                |
|  +------------------------------------------------------------------------+  |
|  |                    CONSOLIDATED REPORTING ENGINE                        |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  |  |Unified View Gen  |  |Conflict Annotator|  | Metrics Calculator|       |  |
|  |  +------------------+  +------------------+  +------------------+       |  |
|  +------------------------------------------------------------------------+  |
|                              |                                                |
|                              v                                                |
|                    +------------------+                                       |
|                    |  CWCC REPORT     |                                       |
|                    +------------------+                                       |
+------------------------------------------------------------------------------+
```

### 3.2 Core Components

| Component | Responsibility |
|-----------|---------------|
| **Workflow Execution Layer** | Orchestrate parallel workflow execution on content |
| **Result Normalization Layer** | Transform diverse outputs to common schema |
| **Consistency Comparison Engine** | Find related findings across workflows |
| **Contradiction Detection Engine** | Identify direct conflicts |
| **Conflict Resolution Engine** | Determine authoritative results |
| **Consolidated Reporting Engine** | Generate unified cross-workflow view |

### 3.3 Data Flow

```
Content Input
     |
     v
[Execute Workflows in Parallel] --> Raw Results (W1, W2, ... Wn)
     |
     v
[Normalize to Common Schema] --> Normalized Findings (NF1, NF2, ... NFn)
     |
     v
[Build Finding Clusters] --> Clusters of Related Findings
     |
     v
[Detect Contradictions] --> Flagged Conflicts
     |
     v
[Apply Resolution Strategy] --> Resolved Findings + Unresolved Conflicts
     |
     v
[Generate Consolidated Report] --> CWCC Report
```

---

## 4. Result Normalization Layer

### 4.1 Normalized Finding Schema

All workflow outputs are transformed to this common schema:

```yaml
normalized_finding:
  # Identity
  id: string                    # Unique ID: "CWCC-{workflow_id}-{finding_index}"
  source_workflow:
    id: string                  # e.g., "DV-V6", "VGD", "QVP"
    name: string                # e.g., "Deep Verify V6"
    version: string             # e.g., "6.3"
  original_id: string           # ID in source workflow output

  # Finding Core
  finding_type: enum            # ISSUE | OBSERVATION | RECOMMENDATION | QUESTION
  polarity: enum                # NEGATIVE (problem) | POSITIVE (strength) | NEUTRAL (observation)
  description: string           # Human-readable description
  evidence: string              # Quote or reference from content
  location: object              # Where in content (line, section, element)
    section: string
    line_range: [start, end]
    element: string

  # Classification
  severity: enum                # CRITICAL | IMPORTANT | MINOR | INFO
  severity_score: float         # 0.0-1.0 normalized score
  category: enum                # See category taxonomy
  confidence: enum              # HIGH | MEDIUM | LOW
  confidence_score: float       # 0.0-1.0 normalized score

  # Granularity
  granularity_level: enum       # SYSTEM | COMPONENT | ELEMENT | DETAIL
  abstraction_depth: integer    # 1-5 scale (1=surface, 5=root cause)

  # Metadata
  timestamp: ISO8601
  tokens_consumed: integer
  method_ids: array             # Which methods produced this finding
  raw_output: object            # Original workflow output (preserved)
```

### 4.2 Workflow-Specific Adapters

Each supported workflow has an adapter that transforms its output to the normalized schema.

#### 4.2.1 Deep Verify Adapter

```yaml
deep_verify_adapter:
  input_format: "Phase-based findings with concern layers"

  mapping_rules:
    finding_type:
      rule: "All findings are ISSUE type"
      default: ISSUE

    polarity:
      rule: "All findings are NEGATIVE"
      default: NEGATIVE

    severity:
      mapping:
        "emoji_red": CRITICAL
        "emoji_orange": IMPORTANT
        "emoji_yellow": MINOR
        "no_marker": INFO

    severity_score:
      mapping:
        CRITICAL: 1.0
        IMPORTANT: 0.7
        MINOR: 0.4
        INFO: 0.1

    category:
      rule: "Map concern layer to category"
      A_layer: ["SCOPE", "ASSUME", "SKIP"]
      B_layer: ["SHALLOW", "CONFLICT", "INTEGRATE"]
      C_layer: ["EDGE", "DEPEND", "PERF", "SECURE"]

    granularity_level:
      mapping:
        phase_2_concerns: SYSTEM
        phase_3_methods: COMPONENT
        phase_4_findings: ELEMENT
        phase_5_confirmed: DETAIL

    abstraction_depth:
      mapping:
        SYMPTOM: 1
        CAUSE: 2
        STRUCTURE: 3
        ASSUMPTION: 4
        ROOT_CAUSE: 5
```

#### 4.2.2 V-GD (Tensor) Adapter

```yaml
vgd_adapter:
  input_format: "Gradient hotspots + null space analysis + Lambda V"

  mapping_rules:
    finding_type:
      gradient_hotspot: ISSUE
      null_space_void: OBSERVATION
      lambda_v_failure: ISSUE

    polarity:
      gradient_hotspot: NEGATIVE
      null_space_void: NEUTRAL
      lambda_v_failure: NEGATIVE

    severity:
      rule: "Map gradient magnitude to severity"
      dL_greater_0.8: CRITICAL
      dL_0.5_to_0.8: IMPORTANT
      dL_less_0.5: MINOR
      lambda_v_less_0.8: CRITICAL

    severity_score:
      rule: "Use dL value directly"
      formula: "dL value clamped to 0.0-1.0"

    category:
      rule: "Infer from tensor dimension and method used"
      dimension_i: "STRUCTURE"
      dimension_j: "LOGIC"
      dimension_k: "RISK"

    granularity_level:
      rule: "Tensor depth maps to granularity"
      k_1: SYSTEM
      k_2: COMPONENT
      k_3: ELEMENT

    abstraction_depth:
      rule: "Based on null space vs surface findings"
      surface_hotspot: 2
      null_space_finding: 4
```

#### 4.2.3 QVP (Quadrant) Adapter

```yaml
qvp_adapter:
  input_format: "4 scans with findings per scan"

  mapping_rules:
    finding_type:
      all_scans: ISSUE

    polarity:
      all_findings: NEGATIVE

    severity:
      mapping:
        SPOF: CRITICAL
        Unstable: CRITICAL
        High_Sensitivity: CRITICAL
        Holes: IMPORTANT
        Loops: IMPORTANT
        Ghosts: IMPORTANT
        Dead_Links: MINOR
        Bottlenecks: MINOR

    severity_score:
      SPOF: 1.0
      Unstable: 0.95
      High_Sensitivity: 0.9
      Holes: 0.7
      Loops: 0.7
      Ghosts: 0.6
      Dead_Links: 0.4
      Bottlenecks: 0.3

    category:
      mapping:
        Topology_Scan: "STRUCTURE"
        Information_Scan: "DEPEND"
        Control_Scan: "EDGE"
        Graph_Scan: "INTEGRATE"

    granularity_level:
      mapping:
        Topology_Scan: SYSTEM
        Information_Scan: COMPONENT
        Control_Scan: ELEMENT
        Graph_Scan: SYSTEM

    abstraction_depth:
      SPOF: 4
      Unstable: 3
      Holes: 3
      Ghosts: 4
      default: 2
```

#### 4.2.4 UAQG Adapter

```yaml
uaqg_adapter:
  input_format: "6-gate pass/fail with UAFT IDs"

  mapping_rules:
    finding_type:
      gate_failure: ISSUE
      gate_warning: OBSERVATION

    polarity:
      FAIL: NEGATIVE
      PASS_with_issues: NEUTRAL

    severity:
      rule: "Based on gate and UAFT code prefix"
      Gate_1_Epistemic: CRITICAL
      Gate_2_Logic: CRITICAL
      Gate_3_Structure: IMPORTANT
      Gate_4_Technical: CRITICAL
      Gate_5_Style: MINOR
      Gate_6_Strategy: IMPORTANT

    severity_score:
      Gate_1: 0.95
      Gate_2: 0.9
      Gate_3: 0.6
      Gate_4: 0.85
      Gate_5: 0.3
      Gate_6: 0.7

    category:
      mapping:
        Gate_1: "ASSUME"
        Gate_2: "CONFLICT"
        Gate_3: "SCOPE"
        Gate_4: "SECURE"
        Gate_5: "SHALLOW"
        Gate_6: "INTEGRATE"

    granularity_level:
      all_gates: ELEMENT

    abstraction_depth:
      Hallucination: 5
      Fallacy: 4
      Structure: 3
      Syntax: 2
      Style: 1
      Strategy: 3
```

### 4.3 Category Taxonomy

Unified category system across all workflows:

| Category | Code | Description |
|----------|------|-------------|
| **SCOPE** | SC | Missing requirements, incomplete coverage |
| **ASSUME** | AS | Undocumented assumptions, implicit expectations |
| **SKIP** | SK | Explicitly skipped areas, deferred decisions |
| **SHALLOW** | SH | Surface-level analysis, lack of depth |
| **CONFLICT** | CO | Internal contradictions, inconsistent statements |
| **INTEGRATE** | IN | Integration gaps, missing connections |
| **EDGE** | ED | Edge cases not handled, boundary conditions |
| **DEPEND** | DE | Dependency issues, coupling problems |
| **PERF** | PE | Performance concerns, scalability issues |
| **SECURE** | SE | Security vulnerabilities, safety issues |

---

## 5. Consistency Comparison Engine

### 5.1 Semantic Similarity Calculation

Compare findings across workflows to identify related items.

#### 5.1.1 Similarity Dimensions

```yaml
similarity_dimensions:
  textual_similarity:
    method: "Cosine similarity on TF-IDF vectors"
    weight: 0.30
    threshold: 0.6

  location_overlap:
    method: "Jaccard index on location ranges"
    weight: 0.25
    threshold: 0.5

  category_match:
    method: "Exact match or category hierarchy distance"
    weight: 0.20
    exact_match_score: 1.0
    parent_match_score: 0.7
    sibling_match_score: 0.5

  severity_proximity:
    method: "1 - |severity_score_a - severity_score_b|"
    weight: 0.15

  evidence_overlap:
    method: "Shared quoted content percentage"
    weight: 0.10
```

#### 5.1.2 Composite Similarity Score

```
SimilarityScore(F1, F2) =
    W_text * TextSimilarity(F1.description, F2.description) +
    W_loc  * LocationOverlap(F1.location, F2.location) +
    W_cat  * CategoryMatch(F1.category, F2.category) +
    W_sev  * SeverityProximity(F1.severity_score, F2.severity_score) +
    W_evd  * EvidenceOverlap(F1.evidence, F2.evidence)

Where: W_text=0.30, W_loc=0.25, W_cat=0.20, W_sev=0.15, W_evd=0.10
```

### 5.2 Finding Cluster Builder

Group related findings across workflows into clusters.

#### 5.2.1 Clustering Algorithm

```python
# Pseudocode for cluster building
def build_finding_clusters(all_normalized_findings, similarity_threshold=0.65):
    clusters = []
    unassigned = set(all_normalized_findings)

    while unassigned:
        # Start new cluster with arbitrary finding
        seed = unassigned.pop()
        cluster = FindingCluster(seed)

        # Find all findings similar to cluster members
        changed = True
        while changed:
            changed = False
            for finding in list(unassigned):
                if cluster.max_similarity(finding) >= similarity_threshold:
                    cluster.add(finding)
                    unassigned.remove(finding)
                    changed = True

        clusters.append(cluster)

    return clusters
```

#### 5.2.2 Cluster Properties

```yaml
finding_cluster:
  id: string                    # "CLUSTER-{index}"
  findings: array               # All findings in cluster

  # Workflow coverage
  workflows_represented: array  # Which workflows contributed
  coverage_ratio: float         # workflows_represented / total_workflows

  # Consistency metrics
  polarity_consensus: boolean   # All findings agree on polarity?
  severity_spread: float        # StdDev of severity_scores
  category_consensus: boolean   # Majority category agreement?

  # Conflict indicators
  has_contradictions: boolean
  contradiction_details: array

  # Resolved representation
  canonical_finding: object     # Resolved/merged finding
  resolution_method: string     # How canonical was determined
  confidence: float             # Confidence in resolution
```

### 5.3 Cluster Types

| Cluster Type | Characteristics | Action |
|--------------|----------------|--------|
| **Unanimous** | All workflows agree on finding | High confidence result |
| **Majority** | >50% workflows agree | Use majority view |
| **Split** | No majority, no contradiction | Report all perspectives |
| **Contradictory** | Direct polarity conflict | Escalate for resolution |
| **Unique** | Only one workflow found this | Flag as potentially missed by others |

---

## 6. Contradiction Detection

### 6.1 Contradiction Types

#### 6.1.1 Type 1: Polarity Contradiction

One workflow says X is a problem, another says X is fine.

```yaml
polarity_contradiction:
  detection_rule: |
    Two findings about the same location/concept where:
    - Finding A has polarity NEGATIVE
    - Finding B has polarity POSITIVE or explicitly states "no issue"

  example:
    finding_a:
      workflow: "DV-V6"
      description: "Authentication flow missing rate limiting"
      polarity: NEGATIVE
    finding_b:
      workflow: "QVP"
      description: "Rate limiting implemented in middleware layer"
      polarity: POSITIVE

  severity: HIGH
  resolution_required: true
```

#### 6.1.2 Type 2: Severity Contradiction

Same issue, vastly different severity assessment.

```yaml
severity_contradiction:
  detection_rule: |
    Two findings about the same issue where:
    - |severity_score_a - severity_score_b| > severity_tolerance
    - Default tolerance: 0.4 (e.g., CRITICAL vs MINOR)

  example:
    finding_a:
      workflow: "VGD"
      description: "Missing input validation"
      severity: CRITICAL
      severity_score: 0.95
    finding_b:
      workflow: "UAQG"
      description: "Input validation could be stronger"
      severity: MINOR
      severity_score: 0.35

  severity: MEDIUM
  resolution_required: true
```

#### 6.1.3 Type 3: Category Contradiction

Same location described under incompatible categories.

```yaml
category_contradiction:
  detection_rule: |
    Two findings about the same location where:
    - Categories are in conflict_pairs set
    - e.g., SCOPE (missing) vs SHALLOW (present but weak)

  conflict_pairs:
    - [SCOPE, SHALLOW]       # Missing vs Present-but-weak
    - [SKIP, EDGE]           # Intentionally skipped vs Should handle
    - [SECURE, PERF]         # Sometimes tradeoff

  severity: LOW
  resolution_required: false
  action: "Flag for human review"
```

#### 6.1.4 Type 4: Existence Contradiction

One workflow found significant issue, similar workflows missed it.

```yaml
existence_contradiction:
  detection_rule: |
    Finding exists in workflow A with:
    - severity >= IMPORTANT
    - confidence >= HIGH
    And no related finding in workflows B, C, D that:
    - Claim to cover that category
    - Have similar coverage scope

  severity: MEDIUM
  resolution_required: true
  possible_causes:
    - "Different granularity levels"
    - "Workflow blind spot"
    - "False positive in detecting workflow"
```

### 6.2 Contradiction Detection Algorithm

```python
# Pseudocode for contradiction detection
def detect_contradictions(clusters):
    contradictions = []

    for cluster in clusters:
        if len(cluster.findings) < 2:
            continue  # Need 2+ findings to have contradiction

        # Check polarity contradictions
        polarities = set(f.polarity for f in cluster.findings)
        if NEGATIVE in polarities and POSITIVE in polarities:
            contradictions.append(
                PolarityContradiction(cluster,
                    negative=[f for f in cluster.findings if f.polarity == NEGATIVE],
                    positive=[f for f in cluster.findings if f.polarity == POSITIVE]
                )
            )

        # Check severity contradictions
        severities = [f.severity_score for f in cluster.findings]
        if max(severities) - min(severities) > SEVERITY_TOLERANCE:
            contradictions.append(
                SeverityContradiction(cluster,
                    high_severity=[f for f in cluster.findings if f.severity_score > 0.7],
                    low_severity=[f for f in cluster.findings if f.severity_score < 0.4]
                )
            )

        # Check category contradictions
        categories = set(f.category for f in cluster.findings)
        for pair in CONFLICT_PAIRS:
            if pair[0] in categories and pair[1] in categories:
                contradictions.append(
                    CategoryContradiction(cluster, conflicting_categories=pair)
                )

    # Check existence contradictions (findings with no cluster)
    unique_findings = [c for c in clusters if len(c.findings) == 1]
    for cluster in unique_findings:
        finding = cluster.findings[0]
        if finding.severity_score >= 0.7 and finding.confidence_score >= 0.7:
            similar_scope_workflows = get_workflows_covering(finding.category)
            if len(similar_scope_workflows) > 1:  # Others should have found it
                contradictions.append(
                    ExistenceContradiction(cluster,
                        missing_from=similar_scope_workflows
                    )
                )

    return contradictions
```

### 6.3 Contradiction Severity Scoring

```yaml
contradiction_severity:
  formula: |
    ContraSeverity =
      TypeWeight * ImpactFactor * ConfidencePenalty

  type_weights:
    POLARITY: 1.0       # Most severe - direct conflict
    SEVERITY: 0.7       # Significant disagreement
    EXISTENCE: 0.5      # Potential blind spot
    CATEGORY: 0.3       # Classification disagreement

  impact_factor: |
    max(finding.severity_score for finding in contradiction.findings)

  confidence_penalty: |
    If all findings have LOW confidence: 0.5
    If mixed confidence: 0.7
    If all HIGH confidence: 1.0

  thresholds:
    contra_severity >= 0.8: "CRITICAL_CONTRADICTION"
    contra_severity >= 0.5: "SIGNIFICANT_CONTRADICTION"
    contra_severity >= 0.3: "MINOR_CONTRADICTION"
    contra_severity < 0.3: "NEGLIGIBLE_CONTRADICTION"
```

---

## 7. Conflict Resolution Framework

### 7.1 Resolution Strategies

#### 7.1.1 Strategy: Authority Ranking

Resolve conflicts by deferring to the most authoritative workflow.

```yaml
authority_ranking:
  description: |
    Each workflow has an authority score based on:
    - Historical accuracy (from ground-truth testing)
    - Domain expertise (which categories it excels at)
    - Depth of analysis (granularity level)

  authority_scores:
    # Example scores - should be calibrated from testing
    DV-V6:
      overall: 0.85
      by_category:
        SCOPE: 0.90
        ASSUME: 0.85
        CONFLICT: 0.88
        EDGE: 0.75
    VGD:
      overall: 0.82
      by_category:
        STRUCTURE: 0.90
        RISK: 0.88
        DEPEND: 0.80
    QVP:
      overall: 0.80
      by_category:
        INTEGRATE: 0.88
        DEPEND: 0.85
        EDGE: 0.82
    UAQG:
      overall: 0.78
      by_category:
        ASSUME: 0.85
        SECURE: 0.88
        CONFLICT: 0.82

  resolution_rule: |
    For contradiction in category C:
    - Use workflow with highest authority_score[C]
    - If tie, use overall authority score
    - If still tie, escalate to voting
```

#### 7.1.2 Strategy: Weighted Voting

Resolve by democratic vote weighted by confidence and authority.

```yaml
weighted_voting:
  description: |
    Each finding in a cluster votes for its position.
    Vote weight = authority_score * confidence_score * severity_score

  resolution_rule: |
    position_votes = {}
    for finding in cluster.findings:
        position = (finding.polarity, finding.severity_bucket)
        weight = authority[finding.workflow] * finding.confidence_score
        position_votes[position] += weight

    winner = position with highest total vote
    margin = winner_votes / total_votes

    if margin >= 0.6: return winner with HIGH confidence
    if margin >= 0.4: return winner with MEDIUM confidence
    else: return UNRESOLVED, escalate to human
```

#### 7.1.3 Strategy: Conservative (Most Severe)

Always take the most severe interpretation.

```yaml
conservative_resolution:
  description: |
    For safety-critical domains, always assume worst case.

  resolution_rule: |
    canonical_finding = finding with max(severity_score)
    canonical_severity = CRITICAL if any finding is CRITICAL else max
    confidence = based on agreement level

  use_case: "Security audits, safety-critical systems"
```

#### 7.1.4 Strategy: Liberal (Consensus Required)

Only report issues with multi-workflow agreement.

```yaml
liberal_resolution:
  description: |
    Reduce noise by requiring consensus.

  resolution_rule: |
    if workflows_reporting_issue >= (total_workflows * 0.5):
        report finding with averaged severity
    else:
        suppress as potential false positive

  use_case: "High-volume triage, noise reduction"
```

#### 7.1.5 Strategy: Escalation

Flag for human review without automated resolution.

```yaml
escalation_resolution:
  description: |
    Certain contradictions require human judgment.

  escalation_criteria:
    - Polarity contradiction with all HIGH confidence
    - Severity spread > 0.6 on CRITICAL finding
    - Authority ranking produces tie
    - Domain experts explicitly requested

  output: |
    Unresolved contradiction flagged with:
    - All conflicting findings
    - Evidence from each workflow
    - Suggested resolution options
    - Request for human decision
```

### 7.2 Resolution Configuration

```yaml
resolution_config:
  default_strategy: "authority_ranking"

  strategy_overrides:
    by_category:
      SECURE: "conservative"      # Always take security issues seriously
      SHALLOW: "liberal"          # Need consensus on depth complaints

    by_contradiction_type:
      POLARITY: "escalation"      # Human decides on direct conflicts
      SEVERITY: "weighted_voting"
      EXISTENCE: "authority_ranking"
      CATEGORY: "liberal"

    by_severity_level:
      CRITICAL: "conservative"    # Don't miss critical issues
      IMPORTANT: "weighted_voting"
      MINOR: "liberal"

  escalation_fallback: true       # Escalate if strategy fails

  human_review_queue:
    enabled: true
    max_queue_size: 20
    timeout_hours: 48
    auto_resolve_after_timeout: "conservative"
```

### 7.3 Resolution Output

```yaml
resolved_finding:
  # Base finding data
  id: string
  description: string
  severity: enum
  category: enum
  location: object

  # Resolution metadata
  resolution:
    method: string              # Which strategy was used
    confidence: float           # 0.0-1.0
    status: enum                # RESOLVED | UNRESOLVED | ESCALATED

    # Source tracking
    contributing_workflows: array
    primary_source: string      # Workflow that "won"

    # For unresolved/escalated
    conflicting_positions: array
    escalation_reason: string
    human_decision_required: boolean
```

---

## 8. Granularity Harmonization

### 8.1 Granularity Levels

Different workflows operate at different abstraction levels:

```yaml
granularity_levels:
  SYSTEM:
    description: "Whole-system or architecture-level findings"
    examples:
      - "Missing authentication strategy"
      - "No error handling philosophy"
    typical_workflows: ["QVP-Graph", "VGD-k1"]

  COMPONENT:
    description: "Module or component-level findings"
    examples:
      - "User service lacks input validation"
      - "Database layer missing connection pooling"
    typical_workflows: ["DV-V6-Phase2", "QVP-Information"]

  ELEMENT:
    description: "Function or class-level findings"
    examples:
      - "Login function missing rate limiting"
      - "OrderProcessor.validate() has edge case bug"
    typical_workflows: ["DV-V6-Phase4", "UAQG"]

  DETAIL:
    description: "Line or expression-level findings"
    examples:
      - "Line 42: potential null pointer"
      - "SQL query on line 87 vulnerable to injection"
    typical_workflows: ["DV-V6-Phase5", "VGD-hotspots"]
```

### 8.2 Granularity Compatibility Matrix

```yaml
compatibility_matrix:
  # Can findings at these levels be compared?
  #           SYSTEM  COMPONENT  ELEMENT  DETAIL
  SYSTEM:    [true,   false,     false,   false]
  COMPONENT: [false,  true,      true,    false]
  ELEMENT:   [false,  true,      true,    true]
  DETAIL:    [false,  false,     true,    true]

  comparison_rules:
    same_level: "Direct comparison possible"
    adjacent_levels: "Compare if location overlap detected"
    distant_levels: "Cannot directly compare; check containment"
```

### 8.3 Granularity Aggregation

Roll up fine-grained findings to match coarse-grained ones:

```yaml
granularity_aggregation:
  description: |
    When comparing SYSTEM-level findings with ELEMENT-level findings,
    aggregate ELEMENT findings that fall within the SYSTEM scope.

  algorithm: |
    def aggregate_to_level(findings, target_level):
        if finding.granularity_level < target_level:
            # Need to aggregate
            groups = group_by_parent_scope(findings)
            for scope, group_findings in groups:
                yield AggregatedFinding(
                    granularity_level=target_level,
                    location=scope,
                    severity=max(f.severity_score for f in group_findings),
                    description=summarize(group_findings),
                    source_findings=group_findings
                )
        else:
            yield finding

  summary_templates:
    ELEMENT_to_COMPONENT: "{count} issues found in {component}"
    COMPONENT_to_SYSTEM: "{component_count} components have issues"
```

### 8.4 Granularity Conflict Handling

```yaml
granularity_conflicts:
  scenario: |
    SYSTEM finding: "Authentication architecture is sound"
    DETAIL finding: "Login endpoint missing CSRF protection"

  resolution: |
    These are not contradictions but different perspectives.
    - SYSTEM finding evaluates overall architecture
    - DETAIL finding identifies specific implementation gap

    Resolution: Both findings are valid. Report both with notation:
    - "Overall architecture approved with implementation gaps noted"

  rules:
    system_positive_detail_negative:
      action: "Keep both; detail finding is refinement"
      label: "ARCHITECTURE_OK_IMPLEMENTATION_GAP"

    system_negative_detail_positive:
      action: "Keep both; might be partial implementation"
      label: "ARCHITECTURE_CONCERN_SOME_MITIGATION"

    system_negative_detail_negative:
      action: "Merge; escalate severity"
      label: "CONSISTENT_NEGATIVE"
```

---

## 9. Consistency Thresholds

### 9.1 Threshold Configuration Schema

```yaml
consistency_thresholds:
  # Finding similarity thresholds
  similarity:
    cluster_membership: 0.65    # Min similarity to join cluster
    exact_match: 0.90           # Considered same finding
    partial_match: 0.70         # Related findings

  # Contradiction detection thresholds
  contradiction:
    severity_tolerance: 0.40    # Max severity diff before flagging
    confidence_floor: 0.30      # Ignore low-confidence contradictions
    min_evidence_overlap: 0.25  # Require some shared evidence

  # Resolution thresholds
  resolution:
    authority_margin: 0.10      # Min authority diff for clear winner
    vote_margin: 0.20           # Min vote margin for resolution
    consensus_ratio: 0.60       # Workflows agreeing for consensus

  # Reporting thresholds
  reporting:
    min_findings_to_report: 1
    min_severity_to_report: 0.0 # 0=all, 0.4=MINOR+, 0.7=IMPORTANT+
    include_unresolved: true
    include_low_confidence: false
```

### 9.2 Preset Threshold Profiles

```yaml
threshold_profiles:
  strict:
    description: "Catch all potential issues, accept more noise"
    similarity.cluster_membership: 0.50
    contradiction.severity_tolerance: 0.25
    resolution.consensus_ratio: 0.75
    reporting.min_severity_to_report: 0.0

  balanced:
    description: "Balance between detection and noise"
    similarity.cluster_membership: 0.65
    contradiction.severity_tolerance: 0.40
    resolution.consensus_ratio: 0.60
    reporting.min_severity_to_report: 0.3

  lenient:
    description: "High consensus requirement, low noise"
    similarity.cluster_membership: 0.80
    contradiction.severity_tolerance: 0.50
    resolution.consensus_ratio: 0.50
    reporting.min_severity_to_report: 0.5

  security_audit:
    description: "Security-focused, conservative resolution"
    similarity.cluster_membership: 0.55
    contradiction.severity_tolerance: 0.20
    resolution.consensus_ratio: 0.40  # Single workflow can flag
    reporting.min_severity_to_report: 0.0
    category_overrides:
      SECURE: { severity_tolerance: 0.10 }
```

### 9.3 Dynamic Threshold Adjustment

```yaml
dynamic_adjustment:
  enabled: true

  triggers:
    high_contradiction_rate:
      condition: "contradiction_count / cluster_count > 0.5"
      action: "Increase similarity threshold by 0.05"
      reason: "Too many false matches creating contradictions"

    low_cluster_count:
      condition: "cluster_count < expected_findings * 0.5"
      action: "Decrease similarity threshold by 0.05"
      reason: "Missing related findings due to strict matching"

    high_escalation_rate:
      condition: "escalated_count / contradiction_count > 0.7"
      action: "Increase authority_margin by 0.05"
      reason: "Authority not differentiating enough"

  bounds:
    similarity.cluster_membership: [0.40, 0.90]
    contradiction.severity_tolerance: [0.15, 0.60]
    resolution.consensus_ratio: [0.40, 0.85]
```

---

## 10. Consolidated Reporting

### 10.1 Report Structure

```yaml
cwcc_report:
  header:
    report_id: string
    generated_at: ISO8601
    content_analyzed: string
    content_hash: string

  configuration:
    workflows_executed: array
    threshold_profile: string
    resolution_strategy: string

  executive_summary:
    total_findings: integer
    critical_findings: integer
    important_findings: integer
    minor_findings: integer

    consistency_score: float        # 0-100, higher = more agreement
    contradiction_count: integer
    unresolved_count: integer

    workflow_agreement:
      full_agreement: integer       # Findings all workflows agree on
      majority_agreement: integer   # >50% agree
      split_opinion: integer        # No majority
      contradictions: integer       # Direct conflicts

  findings:
    - resolved_findings: array      # All findings after resolution
    - unresolved_conflicts: array   # Escalated contradictions
    - unique_perspectives: array    # Single-workflow findings

  cross_workflow_analysis:
    workflow_coverage: object       # What each workflow found
    category_coverage: object       # Coverage by category
    blind_spot_analysis: object     # What was missed

  appendices:
    - raw_workflow_outputs: object
    - cluster_details: array
    - resolution_audit_trail: array
```

### 10.2 Consistency Score Calculation

```yaml
consistency_score:
  description: |
    Single metric indicating cross-workflow agreement (0-100)

  formula: |
    ConsistencyScore =
      (W_full * FullAgreementRatio +
       W_majority * MajorityAgreementRatio +
       W_split * (1 - SplitRatio) +
       W_contra * (1 - ContradictionRatio)) * 100

  weights:
    W_full: 0.40      # Full agreement most important
    W_majority: 0.25  # Majority still good
    W_split: 0.15     # Penalize splits
    W_contra: 0.20    # Penalize contradictions

  ratios:
    FullAgreementRatio: clusters_with_all_workflows / total_clusters
    MajorityAgreementRatio: clusters_with_majority / total_clusters
    SplitRatio: split_clusters / total_clusters
    ContradictionRatio: contradicting_clusters / total_clusters

  interpretation:
    90-100: "Excellent consistency - high confidence in results"
    75-89: "Good consistency - minor disagreements"
    60-74: "Moderate consistency - some conflicts to review"
    40-59: "Poor consistency - significant disagreements"
    0-39: "Very poor consistency - fundamental conflicts"
```

### 10.3 Report Formats

#### 10.3.1 Markdown Report

```markdown
# Cross-Workflow Consistency Report

**Report ID:** CWCC-2026-01-11-001
**Content:** /docs/requirements.md
**Generated:** 2026-01-11T14:30:00Z

## Executive Summary

| Metric | Value | Interpretation |
|--------|-------|----------------|
| **Consistency Score** | 78/100 | Good consistency |
| **Total Findings** | 23 | |
| **Critical** | 3 | |
| **Important** | 8 | |
| **Minor** | 12 | |
| **Contradictions** | 2 | Requires review |
| **Unresolved** | 1 | Escalated |

### Workflow Coverage

| Workflow | Findings | Coverage |
|----------|----------|----------|
| DV-V6 | 12 | Full |
| V-GD | 8 | Full |
| QVP | 10 | Full |
| UAQG | 15 | Full |

## Resolved Findings

### [CRITICAL] Missing Authentication on Admin Endpoints

**ID:** CWCC-001
**Category:** SECURE
**Confidence:** HIGH (92%)
**Resolution:** Authority ranking (DV-V6 highest authority for SECURE)

**Workflow Agreement:**
- DV-V6: CRITICAL - "No auth check on /admin/* routes"
- VGD: CRITICAL (dL=0.92) - "Gradient hotspot at auth layer"
- QVP: CRITICAL - "SPOF in access control"
- UAQG: CRITICAL - "Gate 4 failure: K05"

**Evidence:** Lines 45-67 in auth-config.yaml

---

## Contradictions (Requires Review)

### Contradiction #1: Rate Limiting Assessment

**Type:** Polarity Contradiction
**Severity:** HIGH

| Workflow | Position | Confidence |
|----------|----------|------------|
| DV-V6 | ISSUE: Missing rate limiting | HIGH |
| QVP | OK: Rate limiting in nginx layer | MEDIUM |

**Resolution Status:** ESCALATED
**Reason:** Both workflows provide evidence; requires architecture review

---

## Appendix: Full Workflow Outputs

[Collapsed sections with raw outputs]
```

#### 10.3.2 JSON Report

```json
{
  "report_id": "CWCC-2026-01-11-001",
  "generated_at": "2026-01-11T14:30:00Z",
  "content": {
    "path": "/docs/requirements.md",
    "hash": "sha256:abc123..."
  },
  "executive_summary": {
    "consistency_score": 78,
    "total_findings": 23,
    "by_severity": {
      "CRITICAL": 3,
      "IMPORTANT": 8,
      "MINOR": 12
    },
    "contradictions": 2,
    "unresolved": 1
  },
  "resolved_findings": [
    {
      "id": "CWCC-001",
      "description": "Missing Authentication on Admin Endpoints",
      "severity": "CRITICAL",
      "category": "SECURE",
      "confidence": 0.92,
      "resolution": {
        "method": "authority_ranking",
        "primary_source": "DV-V6",
        "contributing_workflows": ["DV-V6", "VGD", "QVP", "UAQG"]
      },
      "location": {
        "file": "auth-config.yaml",
        "lines": [45, 67]
      }
    }
  ],
  "contradictions": [
    {
      "id": "CONTRA-001",
      "type": "POLARITY",
      "severity": "HIGH",
      "status": "ESCALATED",
      "positions": [
        {"workflow": "DV-V6", "polarity": "NEGATIVE", "confidence": "HIGH"},
        {"workflow": "QVP", "polarity": "POSITIVE", "confidence": "MEDIUM"}
      ]
    }
  ]
}
```

### 10.4 Visualization Components

```yaml
visualizations:
  agreement_heatmap:
    description: "Matrix showing pairwise workflow agreement"
    axes: [workflow_a, workflow_b]
    cell_value: "Agreement ratio (0-1)"
    color_scale: "Red (0) -> Green (1)"

  finding_sankey:
    description: "Flow from workflows to findings to resolutions"
    nodes: ["Workflows", "Raw Findings", "Clusters", "Resolved"]
    shows: "How findings combine and resolve"

  category_radar:
    description: "Coverage by category per workflow"
    axes: ["SCOPE", "ASSUME", "SKIP", "SHALLOW", "CONFLICT", ...]
    series: ["DV-V6", "VGD", "QVP", "UAQG"]
    shows: "Workflow strengths/weaknesses"

  consistency_timeline:
    description: "If multiple runs, show consistency over time"
    x_axis: "Run timestamp"
    y_axis: "Consistency score"
    shows: "Stability of cross-workflow agreement"
```

---

## 11. Scalability Design

### 11.1 Complexity Analysis

**Goal:** O(n) complexity for n workflows, not O(n^2) pairwise comparisons.

```yaml
complexity_analysis:
  naive_approach:
    description: "Compare every finding pair across workflows"
    complexity: "O(F1 * F2 * ... * Fn) where Fi = findings in workflow i"
    problem: "Exponential in findings, quadratic in workflows"

  optimized_approach:
    description: "Cluster-based comparison with indexing"
    complexity: "O(F * log(F) + C * W) where F=total findings, C=clusters, W=workflows"
    improvement: "Near-linear scaling"
```

### 11.2 Optimization Strategies

#### 11.2.1 Locality-Sensitive Hashing

```yaml
lsh_indexing:
  purpose: "Fast approximate nearest-neighbor for finding similarity"

  approach: |
    1. Hash each finding's description to signature
    2. Group findings with same signature (candidates)
    3. Only compute full similarity for candidates

  configuration:
    hash_functions: 100
    bands: 20
    rows_per_band: 5
    similarity_threshold: 0.65

  complexity: "O(F * hash_functions) for indexing"
```

#### 11.2.2 Location-Based Partitioning

```yaml
location_partitioning:
  purpose: "Limit comparisons to findings in same location"

  approach: |
    1. Partition content into sections/blocks
    2. Index findings by location
    3. Only compare findings in overlapping locations

  partition_strategy:
    documents: "Section headers"
    code: "File/class/function"
    diagrams: "Component/region"

  complexity: "O(F/P * F/P * P) = O(F^2/P) where P = partitions"
```

#### 11.2.3 Streaming Aggregation

```yaml
streaming_aggregation:
  purpose: "Handle large numbers of workflows without memory overflow"

  approach: |
    1. Process workflows one at a time
    2. Incrementally update clusters
    3. Stream findings to disk/database

  memory_bound: "O(C) where C = current clusters"

  implementation:
    finding_store: "SQLite or Redis"
    cluster_index: "In-memory hash map"
    batch_size: 100  # Findings to process before flush
```

### 11.3 Parallel Execution

```yaml
parallel_execution:
  workflow_execution:
    description: "Run workflows in parallel"
    parallelism: "Limited by API rate limits"
    implementation: "asyncio / multiprocessing"

  finding_normalization:
    description: "Normalize findings in parallel"
    parallelism: "Per-workflow, embarrassingly parallel"
    implementation: "Thread pool"

  cluster_building:
    description: "Parallel cluster membership tests"
    parallelism: "Per-finding"
    implementation: "MapReduce pattern"

  configuration:
    max_concurrent_workflows: 5
    normalization_threads: 4
    cluster_workers: 8
```

### 11.4 Incremental Processing

```yaml
incremental_processing:
  description: |
    When re-running CWCC on updated content, reuse previous results.

  cache_strategy:
    content_hash: "Cache key is content hash"
    finding_cache: "Store normalized findings by workflow + content hash"
    cluster_cache: "Store clusters for stable content"

  invalidation:
    content_change: "Invalidate all caches"
    workflow_update: "Invalidate that workflow's findings"
    threshold_change: "Invalidate clusters only"

  partial_rerun:
    scenario: "Adding one new workflow to existing analysis"
    optimization: |
      1. Load existing findings from cache
      2. Run only new workflow
      3. Incrementally update clusters with new findings
      4. Re-run contradiction detection
```

---

## 12. Implementation Guidance

### 12.1 Integration with BMAD Architecture

```yaml
integration_points:
  workflow_registry:
    location: "src/testing/framework/protocol-registry.md"
    action: "Register CWCC as meta-protocol"

  testing_framework:
    location: "src/testing/framework/universal-test-orchestrator.md"
    action: "Add CWCC as Phase 9 option"

  multi_agent_protocol:
    location: "src/core/protocols/multi-agent-collaboration-protocol.md"
    action: "Use MACP for parallel workflow execution"

  metrics:
    location: "src/testing/framework/universal-metrics.md"
    action: "Add consistency_score as metric"
```

### 12.2 File Structure

```
src/core/protocols/
  cross-workflow-consistency-checker.md    # This specification
  cwcc/
    adapters/
      deep-verify-adapter.yaml
      vgd-adapter.yaml
      qvp-adapter.yaml
      uaqg-adapter.yaml
    thresholds/
      default-thresholds.yaml
      strict-profile.yaml
      security-audit-profile.yaml
    resolution/
      authority-scores.yaml
      resolution-rules.yaml
    templates/
      report-template.md
      json-schema.json
```

### 12.3 Execution Flow

```markdown
## CWCC Execution Protocol

### Prerequisites
1. Content to analyze is identified and accessible
2. At least 2 workflows are selected for comparison
3. Threshold profile is selected or configured

### Execution Steps

#### Step 1: Initialize
```yaml
cwcc_session:
  content_path: "[path]"
  content_hash: "[computed]"
  workflows: ["DV-V6", "VGD", "QVP"]
  threshold_profile: "balanced"
  resolution_strategy: "authority_ranking"
```

#### Step 2: Execute Workflows
- Invoke each workflow on content (parallel if possible)
- Capture raw output per workflow
- Record tokens and time per workflow

#### Step 3: Normalize Results
- Apply workflow-specific adapter to each output
- Transform to normalized finding schema
- Validate all findings meet schema

#### Step 4: Build Clusters
- Calculate pairwise similarities (optimized)
- Build finding clusters using threshold
- Classify clusters (unanimous, majority, split, contradictory)

#### Step 5: Detect Contradictions
- Identify polarity contradictions
- Identify severity contradictions
- Identify existence contradictions
- Score contradiction severity

#### Step 6: Resolve Conflicts
- Apply configured resolution strategy per contradiction
- Track resolution decisions and confidence
- Escalate unresolvable conflicts

#### Step 7: Generate Report
- Calculate consistency score
- Build consolidated finding list
- Generate report in configured format(s)
```

### 12.4 API Design (If Programmatic)

```typescript
interface CWCCSession {
  // Configuration
  configure(config: CWCCConfig): void;
  addWorkflow(workflow: WorkflowDefinition): void;
  setThresholds(thresholds: ThresholdConfig): void;
  setResolutionStrategy(strategy: ResolutionStrategy): void;

  // Execution
  analyze(content: Content): Promise<CWCCResult>;

  // Results
  getConsistencyScore(): number;
  getResolvedFindings(): ResolvedFinding[];
  getContradictions(): Contradiction[];
  getReport(format: 'markdown' | 'json'): string;
}

interface CWCCResult {
  sessionId: string;
  consistencyScore: number;
  executionTime: number;

  workflowResults: Map<string, WorkflowResult>;
  clusters: FindingCluster[];
  contradictions: Contradiction[];
  resolvedFindings: ResolvedFinding[];

  report: CWCCReport;
}
```

---

## 13. Edge Cases and Failure Modes

### 13.1 Edge Cases

#### 13.1.1 Single Workflow

```yaml
edge_case: "Only one workflow executed"

handling:
  detection: "workflows.length === 1"
  action: |
    - No cross-workflow comparison possible
    - Return single workflow results as-is
    - Set consistency_score = N/A
    - Add warning to report

  report_note: "Single workflow analysis - no cross-validation performed"
```

#### 13.1.2 No Findings

```yaml
edge_case: "No workflows produced findings"

handling:
  detection: "all(workflow.findings.length === 0)"
  action: |
    - Report "No issues found by any workflow"
    - Consistency score = 100 (perfect agreement on nothing)
    - Consider this suspicious if content is complex

  warning: |
    "All workflows report no findings. This may indicate:
    - Content is exceptionally clean
    - Workflows failed silently
    - Content type mismatch with workflows"
```

#### 13.1.3 Complete Disagreement

```yaml
edge_case: "All findings are in contradicting clusters"

handling:
  detection: "contradicting_clusters === total_clusters"
  action: |
    - Set consistency_score = 0
    - Escalate entire analysis for human review
    - Report all workflow outputs without resolution

  possible_causes:
    - "Workflows designed for different content types"
    - "Fundamental interpretation differences"
    - "Content contains novel patterns"
```

#### 13.1.4 Workflow Timeout

```yaml
edge_case: "One or more workflows timeout"

handling:
  detection: "workflow.status === TIMEOUT"
  action: |
    - Continue with completed workflows
    - Mark timed-out workflow as "INCOMPLETE"
    - Adjust consistency scoring to account for missing data
    - Retry option available

  impact_on_scoring: |
    Reduce weight of incomplete coverage:
    consistency_score = base_score * (completed_workflows / total_workflows)
```

#### 13.1.5 Identical Findings Across All Workflows

```yaml
edge_case: "All workflows produce identical findings"

handling:
  detection: "all clusters have similarity > 0.95 and all workflows present"
  action: |
    - Set consistency_score = 100
    - Mark as "UNANIMOUS_AGREEMENT"
    - High confidence in all findings

  consideration: |
    Verify workflows are actually independent.
    If workflows share underlying logic, agreement is less meaningful.
```

### 13.2 Failure Modes

#### 13.2.1 Adapter Failure

```yaml
failure_mode: "Workflow adapter cannot parse output"

symptoms:
  - "Normalization throws parsing errors"
  - "Expected fields missing from output"

detection:
  - "Adapter validation fails"
  - "Normalized finding count = 0 for non-empty output"

recovery:
  automatic:
    - "Use fallback adapter with loose parsing"
    - "Extract what's possible, mark as LOW confidence"
  manual:
    - "Update adapter for new output format"
    - "Report raw output for human interpretation"
```

#### 13.2.2 Similarity Threshold Misconfiguration

```yaml
failure_mode: "Threshold too high - no clusters form"

symptoms:
  - "Every finding in its own cluster"
  - "No contradictions detected despite known conflicts"

detection:
  - "cluster_count === finding_count"

recovery:
  automatic:
    - "Apply dynamic threshold adjustment"
    - "Lower threshold incrementally until clusters form"
  manual:
    - "Review threshold settings"
    - "Use different threshold profile"
```

#### 13.2.3 Authority Score Data Unavailable

```yaml
failure_mode: "No authority scores for workflow"

symptoms:
  - "Authority ranking cannot determine winner"
  - "Resolution falls back to voting unexpectedly"

detection:
  - "authority_scores[workflow] === undefined"

recovery:
  automatic:
    - "Use default authority score (0.5)"
    - "Fall back to voting strategy"
  manual:
    - "Run calibration tests to establish authority"
    - "Define authority scores manually"
```

#### 13.2.4 Memory Exhaustion

```yaml
failure_mode: "Too many findings to process in memory"

symptoms:
  - "Out of memory errors"
  - "Severe slowdown during clustering"

detection:
  - "finding_count > memory_threshold"
  - "Memory usage > 80% during processing"

recovery:
  automatic:
    - "Switch to streaming mode"
    - "Process in batches"
    - "Use disk-based storage for intermediate results"

  prevention:
    - "Set max_findings_per_workflow limit"
    - "Pre-filter low-confidence findings"
```

#### 13.2.5 Circular Resolution Dependencies

```yaml
failure_mode: "Resolution strategy leads to infinite loop"

scenario: |
  - Finding A from workflow X requires comparison to Finding B from workflow Y
  - Finding B resolution depends on Finding A's resolution

detection:
  - "Resolution iteration count exceeds limit"
  - "Same findings being re-resolved"

recovery:
  automatic:
    - "Detect cycle in resolution graph"
    - "Break cycle by using confidence-based precedence"
    - "Escalate cyclic conflicts to human review"
```

---

## Appendix A: Quick Reference

### Contradiction Types

| Type | Detection | Severity | Resolution |
|------|-----------|----------|------------|
| Polarity | One NEGATIVE, one POSITIVE | HIGH | Escalate |
| Severity | Score diff > 0.4 | MEDIUM | Weighted voting |
| Category | Conflicting categories | LOW | Flag only |
| Existence | Critical finding by one only | MEDIUM | Authority |

### Threshold Profiles

| Profile | Similarity | Contradiction | Consensus | Use Case |
|---------|------------|---------------|-----------|----------|
| Strict | 0.50 | 0.25 | 0.75 | Maximum detection |
| Balanced | 0.65 | 0.40 | 0.60 | Default |
| Lenient | 0.80 | 0.50 | 0.50 | Noise reduction |
| Security | 0.55 | 0.20 | 0.40 | Safety-critical |

### Consistency Score Interpretation

| Score | Meaning | Action |
|-------|---------|--------|
| 90-100 | Excellent agreement | High confidence |
| 75-89 | Good agreement | Review exceptions |
| 60-74 | Moderate agreement | Review conflicts |
| 40-59 | Poor agreement | Significant review |
| 0-39 | Very poor | Question methodology |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Cluster** | Group of related findings from multiple workflows |
| **Contradiction** | Direct conflict between workflow findings |
| **Granularity** | Level of detail at which a finding operates |
| **Normalized Finding** | Finding transformed to common schema |
| **Polarity** | Whether finding indicates problem or success |
| **Resolution** | Process of determining authoritative finding |
| **Consistency Score** | Metric measuring cross-workflow agreement |

---

## Appendix C: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-11 | Initial specification |

---

*End of Cross-Workflow Consistency Checker Specification*
