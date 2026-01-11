# Cross-Workflow Consistency Checker (CWCC)

**Version:** 1.0
**Purpose:** Execute multiple workflows against identical content, compare results for consistency, resolve conflicts, and produce a consolidated authoritative result.
**Classification:** Meta-Workflow / Verification Framework

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Workflow Execution Engine](#workflow-execution-engine)
5. [Result Normalization Layer](#result-normalization-layer)
6. [Consistency Analysis Engine](#consistency-analysis-engine)
7. [Conflict Resolution System](#conflict-resolution-system)
8. [Consolidated Reporting](#consolidated-reporting)
9. [Configuration System](#configuration-system)
10. [Scalability Design](#scalability-design)
11. [Edge Cases and Failure Modes](#edge-cases-and-failure-modes)
12. [Implementation Guidance](#implementation-guidance)
13. [Assumptions](#assumptions)
14. [Appendices](#appendices)

---

## Overview

### Problem Statement

When multiple workflows analyze the same content, they may produce:
- **Agreements**: Same findings with consistent severity/classification
- **Complements**: Non-overlapping findings that add coverage
- **Contradictions**: Conflicting findings about the same aspect
- **Granularity Mismatches**: One workflow produces detailed findings, another produces summary-level results

The Cross-Workflow Consistency Checker (CWCC) addresses these challenges by providing:
1. Parallel workflow execution infrastructure
2. Result normalization across heterogeneous workflow outputs
3. Semantic similarity-based finding comparison
4. Rule-based and weighted conflict resolution
5. Consolidated, authoritative result generation

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Protocol Agnostic** | Works with ANY workflow that produces structured findings |
| **Linear Scalability** | O(n*m) complexity where n=workflows, m=findings per workflow |
| **Configurable Trust** | Workflow authority levels are configurable, not hardcoded |
| **Transparent Decisions** | All conflict resolutions include audit trail |
| **Graceful Degradation** | Partial workflow failures do not abort entire process |

---

## Architecture

### High-Level Architecture

```
                         ┌─────────────────────────────────────────┐
                         │         INPUT CONTENT                   │
                         │     (Document/Artifact/Code)            │
                         └───────────────┬─────────────────────────┘
                                         │
                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    WORKFLOW EXECUTION ENGINE                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  WF-1    │  │  WF-2    │  │  WF-3    │  │  WF-4    │  │  WF-N    │     │
│  │ (DV-V6)  │  │  (VGD)   │  │  (QVP)   │  │ (UAQG)   │  │  (...)   │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │             │             │             │            │
│       └──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┘            │
│              │             │             │             │                   │
│              ▼             ▼             ▼             ▼                   │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                   RAW RESULT COLLECTORS                              │  │
│  │           [R1]        [R2]        [R3]        [R4]        [RN]       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    RESULT NORMALIZATION LAYER                               │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  Protocol-Specific Adapters → Universal Finding Format (UFF)         │  │
│  │  [DV Adapter] [VGD Adapter] [QVP Adapter] [UAQG Adapter] [Generic]  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  OUTPUT: Normalized Findings List [NF1...NFx] per workflow                │
└────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    CONSISTENCY ANALYSIS ENGINE                              │
│                                                                            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│  │   FINDING    │───▶│   SEMANTIC   │───▶│   CLUSTER    │                 │
│  │   INDEXER    │    │   MATCHER    │    │   GENERATOR  │                 │
│  └──────────────┘    └──────────────┘    └──────────────┘                 │
│                                                │                           │
│                                                ▼                           │
│                              ┌──────────────────────────────┐             │
│                              │    FINDING CLUSTERS          │             │
│                              │ [Agreements] [Complements]   │             │
│                              │ [Contradictions] [Orphans]   │             │
│                              └──────────────────────────────┘             │
└────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    CONFLICT RESOLUTION SYSTEM                               │
│                                                                            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│  │   AUTHORITY  │───▶│   EVIDENCE   │───▶│   CONSENSUS  │                 │
│  │   RESOLVER   │    │   RESOLVER   │    │   RESOLVER   │                 │
│  └──────────────┘    └──────────────┘    └──────────────┘                 │
│         │                   │                   │                          │
│         └───────────────────┴───────────────────┘                          │
│                             │                                              │
│                             ▼                                              │
│                    ┌────────────────┐                                     │
│                    │  RESOLUTION    │                                     │
│                    │  ARBITRATOR    │                                     │
│                    └────────────────┘                                     │
│                                                                            │
│  OUTPUT: Resolved Findings with Confidence Scores                         │
└────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    CONSOLIDATED REPORTING                                   │
│                                                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Authoritative│  │  Agreement  │  │ Contradiction│  │   Audit    │      │
│  │   Findings  │  │    Map      │  │    Report   │  │    Trail   │      │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                                            │
│  OUTPUT: CWCC Consistency Report                                          │
└────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Content → [Parallel Execution] → Raw Results → [Normalization] →
UFF Findings → [Clustering] → Finding Groups → [Resolution] →
Authoritative Findings → [Report Generation] → Consolidated Report
```

---

## Core Components

### 1. Universal Finding Format (UFF)

All workflow outputs are normalized to this canonical format:

```yaml
UniversalFinding:
  # Identity
  id: "UFF-{workflow_id}-{run_id}-{sequence}"
  source_workflow: "{workflow_id}"
  source_location: "{where in original output}"

  # Content
  description: "{what defect/issue was found}"
  evidence: "{quote, reference, or reasoning}"
  affected_elements: ["{list of content elements affected}"]

  # Classification
  category: "{SCOPE|ASSUME|SKIP|SHALLOW|CONFLICT|INTEGRATE|EDGE|DEPEND|PERF|SECURE|OTHER}"
  severity: "{CRITICAL|IMPORTANT|MINOR}"
  depth_level: "{SYMPTOM|CAUSE|STRUCTURE|ASSUMPTION|ROOT_CAUSE}"

  # Confidence
  confidence: "{HIGH|MEDIUM|LOW}"
  confidence_score: 0.0-1.0

  # Granularity
  granularity_level: "{SUMMARY|SECTION|PARAGRAPH|SENTENCE|TOKEN}"
  specificity_score: 0.0-1.0  # Higher = more specific

  # Metadata
  timestamp: "{ISO-8601}"
  tokens_consumed: "{token count}"
  raw_output: "{original protocol output for this finding}"
```

### 2. Workflow Registry Entry

Each workflow must be registered with its characteristics:

```yaml
WorkflowRegistration:
  id: "{unique_id}"
  name: "{human_readable_name}"
  file_path: "{path_to_workflow}"

  # Authority & Trust
  authority_weight: 0.0-1.0  # Default trust level
  specialty_domains: ["{domains where this workflow excels}"]

  # Output Characteristics
  output_format: "{phases|tensors|scans|gates}"
  typical_granularity: "{SUMMARY|SECTION|PARAGRAPH|SENTENCE|TOKEN}"
  typical_depth: "{SYMPTOM|CAUSE|STRUCTURE|ASSUMPTION|ROOT_CAUSE}"

  # Resource Profile
  token_profile: "{LOW|MEDIUM|HIGH}"
  time_profile: "{range in minutes}"

  # Adapter
  adapter_id: "{adapter to use for normalization}"
```

### 3. Finding Cluster

Groups of related findings across workflows:

```yaml
FindingCluster:
  id: "CLUSTER-{hash}"
  cluster_type: "{AGREEMENT|COMPLEMENT|CONTRADICTION|ORPHAN}"

  # Members
  member_findings: ["UFF-id-1", "UFF-id-2", ...]
  member_count: N
  workflow_coverage: ["wf-1", "wf-2", ...]  # Which workflows contributed

  # Similarity Metrics
  semantic_similarity_matrix: [[float]]  # Pairwise similarities
  mean_similarity: 0.0-1.0
  variance: 0.0-1.0

  # Cluster Properties
  primary_category: "{most common category}"
  severity_distribution: {CRITICAL: N, IMPORTANT: N, MINOR: N}
  has_contradiction: true/false
  contradiction_aspects: ["{what aspects disagree}"]

  # Resolution (populated after conflict resolution)
  resolved_finding: "UFF-RESOLVED-{id}" or null
  resolution_method: "{AUTHORITY|EVIDENCE|CONSENSUS|MANUAL}"
  resolution_confidence: 0.0-1.0
```

---

## Workflow Execution Engine

### 4.1 Parallel Execution Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXECUTION COORDINATOR                         │
│                                                                  │
│  Configuration:                                                  │
│  - max_parallel_workflows: 5                                     │
│  - timeout_per_workflow: 600s                                    │
│  - retry_on_failure: true                                        │
│  - retry_count: 2                                                │
│  - continue_on_partial_failure: true                             │
│                                                                  │
│  Execution Strategy:                                             │
│  1. PARALLEL: All workflows start simultaneously                 │
│  2. SEQUENTIAL: One workflow at a time (for resource limits)     │
│  3. BATCHED: Groups of N workflows in parallel                   │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Execution Protocol

```markdown
## Workflow Execution Protocol

### Step 1: Pre-Execution Validation
FOR each workflow in selected_workflows:
  - Verify workflow file exists
  - Verify adapter available
  - Check resource availability
  - Validate input content compatibility

### Step 2: Context Preparation
FOR each workflow:
  - Prepare invocation context
  - Inject content
  - Set workflow-specific parameters
  - Initialize result collector

### Step 3: Parallel Dispatch
DISPATCH all workflows according to execution_strategy:
  - Record start_time per workflow
  - Monitor for timeout
  - Capture all output (including errors)
  - Record end_time per workflow

### Step 4: Result Collection
FOR each completed workflow:
  - Capture raw output
  - Record execution metadata (tokens, time, status)
  - Store in raw_results[workflow_id]

FOR each failed workflow:
  - Record failure reason
  - Attempt retry if configured
  - Mark as FAILED if exhausted
  - Continue if continue_on_partial_failure=true

### Step 5: Execution Summary
Generate:
  - successful_workflows: count
  - failed_workflows: count
  - total_execution_time: seconds
  - total_tokens_consumed: count
```

### 4.3 Workflow Invocation Templates

Each supported workflow type has an invocation template:

```markdown
### Deep Verify Invocation
TASK: [original_task_description]
CONTENT: [input_content]
TYPE: Document
ENVIRONMENT: BMAD-METHOD project
Mode: [G] Guided

### V-GD Invocation
TASK: [original_task_description]
CONTENT: [input_content]
Execute V-GD Protocol.
Required methods: #115, #84, #81, #109, #39, #67, #26
Output: V-GD Verification Report with Lambda V indicator

### QVP Invocation
CONTENT: [input_content]
CONTEXT: [original_task_description]
Execute 4 scans: Topology, Information, Control, Graph

### UAQG Invocation
ARTIFACT: [input_content]
CONTEXT: [original_task_description]
Execute 6-gate verification.
```

---

## Result Normalization Layer

### 5.1 Protocol-Specific Adapters

Each workflow type requires an adapter to convert its output to UFF:

```markdown
## Adapter Interface

Adapter.normalize(raw_output, workflow_metadata) → List[UniversalFinding]

Required methods:
1. parse_raw_output(raw_output) → structured_data
2. extract_findings(structured_data) → List[RawFinding]
3. map_severity(protocol_severity) → UFF_severity
4. map_category(protocol_category) → UFF_category
5. calculate_confidence(finding) → confidence_score
6. determine_granularity(finding) → granularity_level
7. to_uff(RawFinding) → UniversalFinding
```

### 5.2 Deep Verify Adapter

```markdown
## Deep Verify Adapter

### Severity Mapping
| DV Output | UFF Severity |
|-----------|--------------|
| 🔴 CRITICAL | CRITICAL |
| 🟠 IMPORTANT | IMPORTANT |
| 🟡 MINOR | MINOR |

### Category Mapping
DV Concern Layer → UFF Category:
- Layer A (What) → SCOPE, ASSUME
- Layer B (How) → INTEGRATE, DEPEND, PERF
- Layer C (Quality) → SHALLOW, EDGE, SECURE

### Confidence Mapping
- From Challenge Phase (Phase 5):
  - Survived challenge → HIGH (0.9)
  - Partial challenge → MEDIUM (0.6)
  - No challenge → LOW (0.4)

### Granularity Detection
- Based on finding specificity:
  - References specific line/section → PARAGRAPH
  - References document part → SECTION
  - General observation → SUMMARY
```

### 5.3 V-GD Adapter

```markdown
## V-GD Adapter

### Finding Extraction
Extract from:
1. Critical Gradient Hotspots (primary findings)
2. Null Space Voids (secondary findings)
3. Adversarial Stress Test failures (tertiary findings)

### Severity Mapping
| V-GD dL Value | UFF Severity |
|---------------|--------------|
| dL > 0.8 | CRITICAL |
| dL 0.5-0.8 | IMPORTANT |
| dL < 0.5 | MINOR |

### Confidence Mapping
Based on Lambda V:
- Lambda V < 0.8 → HIGH confidence in finding
- Lambda V 0.8-0.95 → MEDIUM confidence
- Lambda V > 0.95 → LOW confidence (system mostly verified)

### Granularity
V-GD typically produces SECTION-level findings due to tensor abstraction
```

### 5.4 QVP Adapter

```markdown
## QVP Adapter

### Finding Extraction
Extract from:
1. Topology Scan: Holes, loops, islands
2. Information Scan: Ghosts, dead links
3. Control Scan: Unstable, sensitive elements
4. Graph Scan: SPOF, bottlenecks

### Severity Mapping
| QVP Finding Type | UFF Severity |
|------------------|--------------|
| SPOF | CRITICAL |
| Unstable | CRITICAL |
| High Sensitivity | CRITICAL |
| Holes/Loops | IMPORTANT |
| Ghosts | IMPORTANT |
| Dead Links | MINOR |
| Bottlenecks | MINOR |

### Category Mapping
| QVP Scan | Primary UFF Categories |
|----------|----------------------|
| Topology | SCOPE, CONFLICT |
| Information | DEPEND, INTEGRATE |
| Control | EDGE, PERF |
| Graph | SECURE, DEPEND |
```

### 5.5 UAQG Adapter

```markdown
## UAQG Adapter

### Finding Extraction
Extract from gate failures and UAFT IDs.

### Severity Mapping
Based on gate and UAFT ID prefix:
- Gates 1-2 (Epistemic, Logical) failures → CRITICAL
- Gates 3-4 (Structural, Technical) failures → IMPORTANT/CRITICAL
- Gates 5-6 (Creative, Strategic) failures → IMPORTANT/MINOR

### Category Mapping
| UAQG Gate | UFF Categories |
|-----------|---------------|
| Gate 1 (Epistemic) | ASSUME, SHALLOW |
| Gate 2 (Logical) | CONFLICT |
| Gate 3 (Structural) | SCOPE, SKIP |
| Gate 4 (Technical) | PERF, SECURE |
| Gate 5 (Creative) | OTHER |
| Gate 6 (Strategic) | EDGE, DEPEND |
```

---

## Consistency Analysis Engine

### 6.1 Finding Indexing

Before comparison, findings are indexed for efficient matching:

```markdown
## Finding Index Structure

Index dimensions:
1. Category Index: {category → [finding_ids]}
2. Severity Index: {severity → [finding_ids]}
3. Element Index: {affected_element → [finding_ids]}
4. Keyword Index: {keyword → [finding_ids]} (from description)

Index enables:
- O(1) lookup of findings by attribute
- Quick candidate selection for similarity matching
- Avoid comparing clearly unrelated findings
```

### 6.2 Semantic Similarity Matching

```markdown
## Semantic Matching Algorithm

### Step 1: Candidate Selection (Coarse Filter)
FOR each finding F1 from workflow W1:
  candidates = []
  FOR each workflow W2 where W2 != W1:
    FOR each finding F2 from W2:
      IF coarse_match(F1, F2):  # Same category OR overlapping elements
        candidates.add(F2)

### Step 2: Semantic Similarity Calculation
FOR each (F1, F2) in candidate_pairs:
  similarity = calculate_semantic_similarity(F1, F2)

  Components of similarity:
  1. description_similarity: cosine_similarity(embed(F1.description), embed(F2.description))
  2. element_overlap: jaccard(F1.affected_elements, F2.affected_elements)
  3. category_match: 1.0 if same, 0.5 if related, 0.0 otherwise

  weighted_similarity = (
    0.50 * description_similarity +
    0.35 * element_overlap +
    0.15 * category_match
  )

### Step 3: Similarity Thresholds
| Similarity Score | Classification |
|-----------------|----------------|
| >= 0.85 | STRONG_MATCH (same finding) |
| 0.60 - 0.84 | PARTIAL_MATCH (related finding) |
| 0.30 - 0.59 | WEAK_MATCH (possibly related) |
| < 0.30 | NO_MATCH (different findings) |
```

### 6.3 Cluster Generation

```markdown
## Clustering Algorithm

### Input
- All normalized findings from all workflows
- Similarity matrix (pairwise similarities)
- Configurable thresholds

### Algorithm: Connected Components with Contradiction Detection

1. INITIALIZE empty clusters
2. SORT finding pairs by similarity (descending)

3. FOR each pair (F1, F2) with similarity >= agreement_threshold:
   IF neither F1 nor F2 in any cluster:
     CREATE new cluster with {F1, F2}
   ELSE IF one is in cluster C:
     ADD the other to C if compatible
   ELSE IF both in different clusters C1, C2:
     MERGE C1 and C2 if compatible

4. FOR each finding F not in any cluster:
   CREATE singleton cluster {F} as ORPHAN

5. FOR each cluster C:
   ANALYZE for contradictions:
   - Different severities for same aspect → SEVERITY_CONTRADICTION
   - Opposite conclusions → LOGICAL_CONTRADICTION
   - Different affected elements claimed → SCOPE_CONTRADICTION

   SET cluster_type:
   - If contradictions exist → CONTRADICTION
   - If all findings agree → AGREEMENT
   - If single finding → ORPHAN
   - If partial overlaps → COMPLEMENT

### Output
- List of FindingCluster objects
- Each finding belongs to exactly one cluster
```

### 6.4 Granularity Alignment

Handle findings at different granularity levels:

```markdown
## Granularity Alignment

### Problem
Workflow A: "Section 3 has consistency issues" (SECTION level)
Workflow B: "Line 47 contains contradictory statement" (PARAGRAPH level)
Workflow C: "Overall design lacks coherence" (SUMMARY level)

These may all refer to the same underlying issue at different abstractions.

### Solution: Hierarchical Containment Check

Granularity hierarchy:
SUMMARY > SECTION > PARAGRAPH > SENTENCE > TOKEN

FOR each finding pair (F_coarse, F_fine):
  IF F_coarse.granularity > F_fine.granularity:
    IF F_fine.affected_elements SUBSET_OF F_coarse.affected_elements:
      # F_fine is a more specific version of F_coarse
      LINK as hierarchical_relationship
      BOOST similarity score by 0.15

### Aggregation Strategy
When consolidating:
1. Keep MOST SPECIFIC finding as primary (actionable)
2. Note COARSER findings as supporting evidence
3. Calculate combined confidence:
   combined_confidence = max(confidences) * (1 + 0.1 * supporting_count)
```

---

## Conflict Resolution System

### 7.1 Conflict Types

```markdown
## Conflict Taxonomy

### Type 1: SEVERITY_CONTRADICTION
Same issue identified, different severity levels
Example:
- WF1: "Missing error handling" → CRITICAL
- WF2: "Missing error handling" → MINOR

### Type 2: LOGICAL_CONTRADICTION
Opposite conclusions about same aspect
Example:
- WF1: "Authentication is secure"
- WF2: "Authentication has critical flaw"

### Type 3: SCOPE_CONTRADICTION
Disagreement about what is affected
Example:
- WF1: "Issue affects modules A, B, C"
- WF2: "Issue only affects module A"

### Type 4: EXISTENCE_CONTRADICTION
One finds issue, another explicitly verifies it's not an issue
Example:
- WF1: "Memory leak detected"
- WF2: "Memory management verified correct"

### Type 5: CAUSATION_CONTRADICTION
Different root cause for same symptom
Example:
- WF1: "Failure due to race condition"
- WF2: "Failure due to null pointer"
```

### 7.2 Resolution Strategies

```markdown
## Resolution Strategy Chain

Apply in order until resolved:

### Strategy 1: AUTHORITY Resolution
Use workflow authority weights to determine winner.

resolution_score(finding) =
  workflow.authority_weight *
  (1 + specialty_bonus if finding.category in workflow.specialty_domains)

IF max(resolution_scores) > second_max * authority_threshold:
  SELECT finding with max score
  resolution_method = "AUTHORITY"
  resolution_confidence = (max - second_max) / max

### Strategy 2: EVIDENCE Resolution
Compare evidence quality of conflicting findings.

evidence_score(finding) =
  0.4 * specificity_of_evidence +
  0.3 * has_concrete_reference +
  0.3 * reasoning_depth

IF max(evidence_scores) > second_max * evidence_threshold:
  SELECT finding with max evidence score
  resolution_method = "EVIDENCE"
  resolution_confidence = (max - second_max) / max

### Strategy 3: CONSENSUS Resolution
Use majority vote weighted by confidence.

weighted_vote(position) =
  SUM(finding.confidence_score for finding in position)

IF majority_position.weighted_vote > minority * consensus_threshold:
  SELECT majority position
  resolution_method = "CONSENSUS"
  resolution_confidence = majority_vote / total_votes

### Strategy 4: CONSERVATIVE Resolution
When no clear winner, take most conservative (highest severity) position.

SELECT finding with highest severity
resolution_method = "CONSERVATIVE"
resolution_confidence = 0.5  # Low confidence due to unresolved conflict
FLAG for manual review

### Strategy 5: MANUAL Resolution
Flag for human review when:
- All strategies produce low confidence
- Logical contradiction between high-authority workflows
- Critical severity with split decision

resolution_method = "MANUAL_REQUIRED"
resolution_confidence = 0.0
```

### 7.3 Resolution Arbitrator

```markdown
## Resolution Arbitrator

### Input
- FindingCluster with contradiction
- Conflict type
- Configuration thresholds

### Process

1. IDENTIFY conflict type
2. GATHER resolution inputs:
   - Authority weights for each source workflow
   - Evidence quality scores
   - Confidence scores
   - Specialty domain matches

3. APPLY resolution chain:
   FOR strategy in [AUTHORITY, EVIDENCE, CONSENSUS, CONSERVATIVE, MANUAL]:
     result = strategy.attempt_resolution(cluster, config)
     IF result.confidence >= config.min_resolution_confidence:
       RETURN result

4. CONSTRUCT resolved finding:
   resolved = UniversalFinding(
     id = "UFF-RESOLVED-{cluster.id}",
     description = winning_finding.description,
     severity = resolved_severity,
     confidence = resolution_confidence,
     ...
   )

5. RECORD audit trail:
   audit_trail = {
     conflict_type: type,
     competing_findings: [list],
     resolution_method: method,
     resolution_rationale: explanation,
     confidence: score,
     timestamp: now()
   }

### Output
- Resolved UniversalFinding
- Audit trail
- Confidence score
- Manual review flag (if needed)
```

---

## Consolidated Reporting

### 8.1 Report Structure

```markdown
# CWCC Consistency Report

## Executive Summary
- Content analyzed: [description]
- Workflows executed: [N]
- Total findings: [N]
- Unique issues identified: [N]
- Consistency score: [0-100%]
- Critical conflicts resolved: [N]

## Workflow Execution Summary
| Workflow | Status | Findings | Tokens | Time | Authority |
|----------|--------|----------|--------|------|-----------|
| [wf-id]  | [OK/FAIL] | [N] | [N] | [s] | [0-1] |

## Authoritative Findings (Consolidated)
| ID | Description | Severity | Category | Confidence | Sources | Resolution |
|----|-------------|----------|----------|------------|---------|------------|
| [id] | [desc] | [sev] | [cat] | [conf] | [wf1,wf2] | [method] |

## Consistency Analysis

### Agreement Map
Issues found by multiple workflows with consistent classification:
[List of agreed findings with workflow overlap]

### Complement Coverage
Additional findings from individual workflows:
[List showing which workflows found unique issues]

### Contradiction Report
| Conflict ID | Type | Workflows | Positions | Resolution | Confidence |
|-------------|------|-----------|-----------|------------|------------|
| [id] | [type] | [wf1 vs wf2] | [positions] | [method] | [0-1] |

### Manual Review Queue
Items requiring human judgment:
[List of unresolved contradictions]

## Workflow Performance Comparison
| Metric | WF-1 | WF-2 | WF-3 | ... |
|--------|------|------|------|-----|
| Unique findings | [N] | | | |
| Agreed findings | [N] | | | |
| Contradicted findings | [N] | | | |
| Token efficiency | [score] | | | |

## Consistency Metrics

### Overall Consistency Score (OCS)
OCS = (Agreements * 1.0 + Complements * 0.8 + Resolved_Contradictions * 0.5) /
      Total_Clusters

### Inter-Workflow Agreement Rate (IWAR)
IWAR = Pairwise_Agreements / Total_Pairwise_Comparisons

### Finding Stability (FS)
FS = Findings_in_Multiple_Workflows / Total_Unique_Findings

## Audit Trail
[Full resolution audit trail for transparency]

## Appendices
- A: Raw findings from each workflow
- B: Similarity matrices
- C: Detailed resolution rationales
```

### 8.2 Consistency Metrics

```markdown
## Consistency Metrics Definitions

### Overall Consistency Score (OCS)
Measures how well workflows agree overall.

OCS = (A * w_a + C * w_c + R * w_r) / (A + C + R + U)

Where:
- A = Agreement clusters (same finding, same classification)
- C = Complement clusters (different but non-conflicting)
- R = Resolved contradiction clusters
- U = Unresolved contradictions
- w_a = 1.0, w_c = 0.8, w_r = 0.5

Interpretation:
- OCS > 80%: High consistency, results reliable
- OCS 60-80%: Moderate consistency, review contradictions
- OCS < 60%: Low consistency, significant disagreement

### Inter-Workflow Agreement Rate (IWAR)
Pairwise agreement between workflows.

FOR each workflow pair (W1, W2):
  common_findings = findings found by both
  agreed = findings with same severity and category
  IWAR(W1,W2) = agreed / common_findings

Overall_IWAR = mean(all pairwise IWARs)

### Finding Stability (FS)
How many findings appear across multiple workflows.

FS = |findings in 2+ workflows| / |unique findings|

High FS (>0.6) suggests robust findings
Low FS (<0.3) suggests workflows finding different things

### Workflow Divergence Index (WDI)
Identifies workflows that deviate from consensus.

WDI(W) = |unique_findings(W)| / |total_findings(W)|

High WDI may indicate:
- Workflow finding unique issues (good if valid)
- Workflow producing false positives (bad if invalid)
- Different granularity level (neutral)
```

---

## Configuration System

### 9.1 Configuration Schema

```yaml
CWCCConfiguration:
  # Execution Settings
  execution:
    max_parallel_workflows: 5
    timeout_per_workflow_seconds: 600
    retry_on_failure: true
    retry_count: 2
    continue_on_partial_failure: true
    execution_strategy: "PARALLEL"  # PARALLEL | SEQUENTIAL | BATCHED
    batch_size: 3  # if BATCHED

  # Similarity Thresholds
  similarity:
    strong_match_threshold: 0.85
    partial_match_threshold: 0.60
    weak_match_threshold: 0.30
    description_weight: 0.50
    element_overlap_weight: 0.35
    category_match_weight: 0.15

  # Conflict Resolution
  resolution:
    authority_threshold: 1.5  # How much higher authority must be to win
    evidence_threshold: 1.3
    consensus_threshold: 0.65  # Weighted vote threshold
    min_resolution_confidence: 0.5  # Below this, flag for manual
    default_resolution_strategy: "CONSERVATIVE"

  # Workflow Authority (default weights)
  workflow_authority:
    DV-V6: 0.85
    VGD: 0.80
    QVP: 0.75
    UAQG: 0.70
    default: 0.50

  # Specialty Domains (workflow → categories it excels at)
  workflow_specialties:
    DV-V6: ["SCOPE", "ASSUME", "SHALLOW"]
    VGD: ["EDGE", "SECURE", "CONFLICT"]
    QVP: ["DEPEND", "INTEGRATE", "PERF"]
    UAQG: ["SCOPE", "CONFLICT", "EDGE"]

  # Reporting
  reporting:
    include_raw_findings: true
    include_similarity_matrices: false
    include_audit_trail: true
    manual_review_threshold: 0.4  # Confidence below this → manual review

  # Consistency Thresholds
  consistency_thresholds:
    high_consistency: 0.80
    moderate_consistency: 0.60
    low_consistency_warning: 0.40
```

### 9.2 Runtime Configuration Override

```markdown
## Runtime Configuration

Allow per-execution overrides:

CWCC.execute(
  content: "...",
  workflows: ["DV-V6", "QVP", "UAQG"],
  config_overrides: {
    "resolution.min_resolution_confidence": 0.7,
    "workflow_authority.DV-V6": 0.95,  # Boost DV for this run
    "similarity.strong_match_threshold": 0.90  # Stricter matching
  }
)
```

---

## Scalability Design

### 10.1 Complexity Analysis

```markdown
## Complexity Analysis

### Variables
- N = number of workflows
- M = average findings per workflow
- F = total findings = N * M

### Workflow Execution: O(N)
- Each workflow runs once on same content
- Parallel execution: actual time = max(workflow_times)

### Normalization: O(F)
- Each finding normalized once
- Constant time per finding

### Similarity Calculation: O(F^2) worst case
Problem: Comparing all pairs is expensive for large F

### Optimization: Smart Candidate Selection
Instead of comparing all pairs:
1. Index findings by category → reduces to O(F * k) where k = findings in same category
2. Index by affected elements → further reduces comparisons
3. Use locality-sensitive hashing for description similarity → O(F * log F)

Optimized complexity: O(F * log F) with proper indexing

### Clustering: O(F * alpha(F))
Using union-find with path compression: nearly linear

### Conflict Resolution: O(C * R)
- C = number of contradiction clusters
- R = number of resolution strategies
- Both typically small, so effectively O(C)

### Total Complexity
Without optimization: O(N + F + F^2)
With optimization: O(N + F * log F)

### Memory Complexity
O(F + F^2/compression) for similarity matrix
With sparse representation: O(F * average_cluster_size)
```

### 10.2 Scaling Strategies

```markdown
## Scaling Strategies for 5+ Workflows

### Strategy 1: Workflow Batching
Instead of comparing all workflows simultaneously:
1. Run workflows in batches of 3
2. Consolidate batch results
3. Compare consolidated results across batches

This maintains linear growth in comparison operations.

### Strategy 2: Hierarchical Clustering
1. Group workflows by type (phase-based, tensor-based, etc.)
2. Consolidate within groups first
3. Compare group results

### Strategy 3: Reference Workflow
1. Designate highest-authority workflow as reference
2. Compare each other workflow to reference only
3. Reduces pairwise comparisons from N*(N-1)/2 to N-1

### Strategy 4: Incremental Addition
1. Start with 2 workflows, generate baseline
2. Add one workflow at a time
3. Compare new workflow to existing consolidated results
4. Update consolidated results incrementally

### Recommended Approach for 5+ Workflows
Combine strategies 1 and 4:
1. Start with top 2 authority workflows
2. Generate initial consensus
3. Add remaining workflows one at a time
4. Flag significant deviations from consensus
5. Update consensus with each addition
```

### 10.3 Performance Targets

```markdown
## Performance Targets

| Workflows | Findings | Target Time | Target Memory |
|-----------|----------|-------------|---------------|
| 2 | 50 | < 5s | < 100 MB |
| 3 | 100 | < 15s | < 200 MB |
| 5 | 200 | < 45s | < 500 MB |
| 10 | 500 | < 2m | < 1 GB |

Note: These exclude workflow execution time (handled separately)
```

---

## Edge Cases and Failure Modes

### 11.1 Edge Cases

```markdown
## Edge Case Handling

### EC-1: Empty Workflow Output
Condition: Workflow returns no findings
Handling:
- Record as "NO_FINDINGS" with confidence
- Include in coverage analysis (found nothing)
- Do not penalize consistency score

### EC-2: Workflow Timeout
Condition: Workflow exceeds timeout
Handling:
- Mark workflow as TIMEOUT
- Use partial results if available
- Flag in report as incomplete coverage

### EC-3: All Workflows Disagree
Condition: No agreement clusters exist
Handling:
- Report OCS = 0
- Apply CONSERVATIVE resolution to all
- Flag all findings for manual review
- Consider workflows may be analyzing different aspects

### EC-4: Single Workflow Available
Condition: Only one workflow completed successfully
Handling:
- Cannot calculate consistency (N/A)
- Return workflow findings as-is
- Flag as "UNVERIFIED_BY_SECOND_SOURCE"

### EC-5: Circular Contradictions
Condition: WF1 says A>B, WF2 says B>C, WF3 says C>A
Handling:
- Detect cycle in resolution graph
- Apply MANUAL resolution
- Report cycle details for human review

### EC-6: Granularity Extreme Mismatch
Condition: One workflow at TOKEN level, another at SUMMARY
Handling:
- Use hierarchical containment check
- Aggregate TOKEN-level findings before comparison
- Maintain link to detailed findings

### EC-7: Same Finding, Different Evidence
Condition: Same conclusion with completely different reasoning
Handling:
- Classify as AGREEMENT (same conclusion)
- Note divergent evidence paths
- Consider higher confidence due to independent confirmation
```

### 11.2 Failure Modes

```markdown
## Failure Mode Analysis

### FM-1: Adapter Failure
Symptom: Cannot normalize workflow output
Impact: Workflow excluded from analysis
Mitigation:
- Fallback to generic adapter
- Parse as unstructured findings
- Flag quality as LOW

### FM-2: False Similarity
Symptom: Unrelated findings clustered together
Impact: Incorrect agreements/contradictions
Detection:
- Human review sampling
- High variance in cluster
Mitigation:
- Raise similarity threshold
- Add domain-specific similarity rules

### FM-3: Authority Bias
Symptom: High-authority workflow always wins
Impact: Minority correct findings lost
Detection:
- Track authority-override rate
- Sample resolved contradictions
Mitigation:
- Lower authority threshold
- Require evidence confirmation
- Periodic authority recalibration

### FM-4: Cascade Failure
Symptom: One failed workflow corrupts clustering
Impact: All results unreliable
Mitigation:
- Isolate workflow failures
- Re-run clustering without failed workflow
- Compare results with/without

### FM-5: Configuration Gaming
Symptom: Thresholds tuned to produce desired results
Impact: Loss of objectivity
Mitigation:
- Log all configuration changes
- Use default configurations for official runs
- Require justification for overrides
```

### 11.3 Recovery Procedures

```markdown
## Recovery Procedures

### Procedure 1: Workflow Failure Recovery
IF workflow fails:
  1. Attempt retry (up to retry_count)
  2. If partial output available, attempt normalization
  3. If complete failure, mark as EXCLUDED
  4. Continue with remaining workflows
  5. Note reduced coverage in report

### Procedure 2: Normalization Failure Recovery
IF adapter fails:
  1. Attempt generic adapter
  2. Extract any parseable findings
  3. Mark findings as LOW_CONFIDENCE
  4. Flag for manual review of raw output

### Procedure 3: Resolution Deadlock Recovery
IF no resolution strategy succeeds:
  1. Apply CONSERVATIVE (highest severity)
  2. Set confidence = 0.3
  3. Add to manual review queue
  4. Include all positions in report

### Procedure 4: Complete System Failure Recovery
IF system-level failure:
  1. Save current state to checkpoint
  2. Log failure context
  3. Attempt resume from checkpoint
  4. If resume fails, provide partial report
```

---

## Implementation Guidance

### 12.1 Implementation Phases

```markdown
## Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Universal Finding Format definition
- [ ] Workflow registry system
- [ ] Basic execution coordinator
- [ ] Result collection

### Phase 2: Normalization Layer (Week 3-4)
- [ ] Adapter interface
- [ ] Deep Verify adapter
- [ ] V-GD adapter
- [ ] QVP adapter
- [ ] UAQG adapter
- [ ] Generic fallback adapter

### Phase 3: Consistency Engine (Week 5-6)
- [ ] Finding indexer
- [ ] Semantic similarity calculator
- [ ] Clustering algorithm
- [ ] Granularity alignment

### Phase 4: Conflict Resolution (Week 7-8)
- [ ] Authority resolver
- [ ] Evidence resolver
- [ ] Consensus resolver
- [ ] Resolution arbitrator
- [ ] Audit trail generation

### Phase 5: Reporting & Configuration (Week 9-10)
- [ ] Report generator
- [ ] Consistency metrics calculation
- [ ] Configuration system
- [ ] Runtime override support

### Phase 6: Testing & Optimization (Week 11-12)
- [ ] Unit tests for each component
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Scalability testing (5+ workflows)
```

### 12.2 Key Interfaces

```typescript
// Core Interfaces (TypeScript-style pseudocode)

interface UniversalFinding {
  id: string;
  sourceWorkflow: string;
  description: string;
  evidence: string;
  affectedElements: string[];
  category: FindingCategory;
  severity: Severity;
  confidence: number;
  granularityLevel: GranularityLevel;
}

interface WorkflowAdapter {
  normalize(rawOutput: string, metadata: WorkflowMetadata): UniversalFinding[];
}

interface ConsistencyEngine {
  analyze(findings: UniversalFinding[][]): FindingCluster[];
}

interface ConflictResolver {
  resolve(cluster: FindingCluster, config: ResolutionConfig): ResolvedFinding;
}

interface CWCCOrchestrator {
  execute(content: string, workflows: string[], config: CWCCConfig): CWCCReport;
}
```

### 12.3 Testing Strategy

```markdown
## Testing Strategy

### Unit Tests
- [ ] Each adapter correctly normalizes sample output
- [ ] Similarity calculator produces expected scores
- [ ] Clustering algorithm groups correctly
- [ ] Each resolver handles its strategy

### Integration Tests
- [ ] End-to-end with 2 workflows
- [ ] End-to-end with 5 workflows
- [ ] Failure recovery scenarios
- [ ] Configuration override scenarios

### Synthetic Tests (Known Answers)
Create test cases with:
- Known agreements (verify detection)
- Known contradictions (verify detection)
- Known correct resolution (verify resolution logic)

### Real-World Tests
- Run on actual BMAD-METHOD content
- Compare CWCC results to manual analysis
- Measure accuracy of consistency metrics

### Performance Tests
- Measure actual complexity growth
- Verify targets met (see Performance Targets)
- Identify bottlenecks
```

---

## Assumptions

### Explicit Assumptions

```markdown
## Documented Assumptions

### A1: Workflow Output Structure
Assumption: All workflows produce some form of structured finding output.
Implication: Generic adapter can handle any output.
Risk if violated: Findings may not be extractable.
Mitigation: Human-readable fallback parsing.

### A2: Semantic Similarity Validity
Assumption: Text similarity correlates with conceptual similarity.
Implication: Embedding-based matching works.
Risk if violated: False matches or missed matches.
Mitigation: Multiple similarity dimensions + human sampling.

### A3: Workflow Independence
Assumption: Workflows analyze content independently.
Implication: Agreements are meaningful (independent confirmation).
Risk if violated: If workflows share components, agreements may be duplicates.
Mitigation: Document workflow relationships, weight shared-component agreements lower.

### A4: Authority Stability
Assumption: Workflow authority rankings are relatively stable.
Implication: Pre-configured authority weights are valid.
Risk if violated: Dynamic context may shift authority.
Mitigation: Allow runtime authority overrides, track authority performance.

### A5: Finding Granularity Hierarchy
Assumption: SUMMARY > SECTION > PARAGRAPH > SENTENCE > TOKEN is valid hierarchy.
Implication: Hierarchical containment checks work.
Risk if violated: Findings may not nest cleanly.
Mitigation: Allow approximate containment matching.

### A6: Conflict Resolvability
Assumption: Most conflicts can be resolved by authority, evidence, or consensus.
Implication: Manual review is exception, not rule.
Risk if violated: High manual review rate makes system impractical.
Mitigation: Monitor manual review rate, adjust thresholds.

### A7: Linear Token Scaling
Assumption: Token consumption scales linearly with content size.
Implication: Performance predictions are reliable.
Risk if violated: Some workflows may have non-linear scaling.
Mitigation: Profile each workflow, adjust predictions.
```

---

## Appendices

### Appendix A: Category Definitions

```markdown
## Finding Category Taxonomy

| Category | Definition | Example |
|----------|------------|---------|
| SCOPE | Missing requirements, scope gaps | "No handling for admin users" |
| ASSUME | Unstated assumptions | "Assumes network is always available" |
| SKIP | Explicitly required but not addressed | "Requirement R3 not mentioned" |
| SHALLOW | Surface-level treatment of deep topic | "Security mentioned but not detailed" |
| CONFLICT | Internal contradictions | "Section 2 contradicts Section 5" |
| INTEGRATE | Integration issues | "Component A and B interface unclear" |
| EDGE | Edge cases not handled | "Empty input not considered" |
| DEPEND | Dependency issues | "Relies on deprecated library" |
| PERF | Performance concerns | "N^2 algorithm for large datasets" |
| SECURE | Security vulnerabilities | "SQL injection possible" |
| OTHER | Doesn't fit above categories | "General quality concern" |
```

### Appendix B: Severity Mapping Matrix

```markdown
## Cross-Protocol Severity Mapping

| Protocol | CRITICAL | IMPORTANT | MINOR |
|----------|----------|-----------|-------|
| DV | 🔴 | 🟠 | 🟡 |
| VGD | dL > 0.8 | dL 0.5-0.8 | dL < 0.5 |
| QVP | SPOF, Unstable | Holes, Ghosts | Dead Links |
| UAQG | Gates 1-2 fail | Gates 3-4 fail | Gates 5-6 fail |
```

### Appendix C: Sample Configuration Profiles

```yaml
# Profile: High Confidence (Strict)
# Use when: Critical systems, cannot afford false positives
high_confidence:
  similarity:
    strong_match_threshold: 0.90
    partial_match_threshold: 0.75
  resolution:
    min_resolution_confidence: 0.7
    consensus_threshold: 0.75

# Profile: High Coverage (Inclusive)
# Use when: Exploration phase, want all possible issues
high_coverage:
  similarity:
    strong_match_threshold: 0.75
    partial_match_threshold: 0.50
  resolution:
    min_resolution_confidence: 0.4
    default_resolution_strategy: "CONSERVATIVE"

# Profile: Balanced (Default)
# Use when: General purpose verification
balanced:
  similarity:
    strong_match_threshold: 0.85
    partial_match_threshold: 0.60
  resolution:
    min_resolution_confidence: 0.5
    consensus_threshold: 0.65
```

### Appendix D: Integration with BMAD-METHOD

```markdown
## BMAD-METHOD Integration Points

### Invocation as Workflow
CWCC can be invoked as a meta-workflow:

```yaml
---
name: 'cross-workflow-consistency-check'
description: 'Run multiple verification workflows and consolidate results'
---
```

### Integration with Universal Test Orchestrator
CWCC extends the orchestrator's Phase 6 (Cross-Protocol Comparison):
- Uses same metrics definitions from universal-metrics.md
- Uses same protocol registry from protocol-registry.md
- Produces compatible output format

### Integration with Meta-Analysis Protocol
CWCC results feed into meta-analysis:
- Consistency scores as new metric dimension
- Contradiction patterns as analysis input
- Workflow performance comparison data
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-11 | Initial design document |

---

**End of Cross-Workflow Consistency Checker Design Document**
