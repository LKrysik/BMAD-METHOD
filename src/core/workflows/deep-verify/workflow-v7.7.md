# Deep Verify V7.7 - Generative Verification System

## What is this?

**V7.7** is a generative verification system that **self-determines what to check** based on artifact analysis, instead of relying on a predefined Domain Knowledge Base.

**Key change vs V7.1:**
- V7.1: Artifact → Domain Detection → KB Lookup → Predefined Patterns
- V7.7: Artifact → Element Extraction → Checklist Generation → Verification

**Methods are organized into:**
- **Tier 1 (Universal):** Always apply, regardless of artifact type
- **Tier 2 (Claim-Level):** Apply to each extracted claim
- **Tier 3 (Conditional):** Apply when specific elements exist in artifact
- **Tier 4 (Domain-Specific):** Apply when Domain KB is available (enhancement)

---

## Phase 0: Artifact Analysis

### 0.1 Self-Check

**Purpose:** Detect own potential biases before analysis.

```
## 0.1 Self-Check

Three ways I could deceive myself with THIS artifact:
1. [method] → Prevention strategy: [strategy]
2. [method] → Prevention strategy: [strategy]
3. [method] → Prevention strategy: [strategy]

My limitations for this artifact:
- [what I don't know / cannot verify]
```

---

### 0.2 Element Extraction

**Purpose:** Extract all elements requiring verification from the artifact.

#### 0.2.1 Claim Extraction

Read the artifact and list ALL claims.

**Claim types and recognition signals:**

| Type | Signals | Example |
|------|---------|---------|
| FACTUAL | "is", "consists of", "equals" | "The system consists of 3 modules" |
| CAUSAL | "causes", "leads to", "therefore", "because" | "Caching reduces latency" |
| GUARANTEE | "always", "never", "guarantees", "ensures" | "Algorithm always terminates" |
| PERFORMANCE | numbers, metrics, O(), "<Xms" | "Response in <100ms" |
| COMPARATIVE | "better", "faster", "unlike", "compared to" | "Faster than brute-force" |
| DEFINITIONAL | "means", "defined as", "is a" | "QUBO is Quadratic..." |
| CONDITIONAL | "if", "when", "provided that" | "If N>1000, use batch" |

```
## 0.2.1 Claims

| ID | Claim | Type | Location | Red Flag? |
|----|-------|------|----------|-----------|
| C1 | [verbatim quote] | [type] | [section/line] | [yes/no + why] |
```

**Red Flags for claims:**
- GUARANTEE without proof
- PERFORMANCE with precise number without methodology
- COMPARATIVE without baseline
- CAUSAL without mechanism

#### 0.2.2 Term Extraction

List key terms, especially those that may be ambiguous.

```
## 0.2.2 Terms

| Term | Defined? | Definition/Usage | Potential problem |
|------|----------|------------------|-------------------|
| [term] | YES/NO/IMPLICIT | [definition] | [e.g., multiple meanings] |
```

#### 0.2.3 Requirement Extraction

List requirements (what the artifact must achieve/satisfy).

```
## 0.2.3 Requirements

| ID | Requirement | Measurable? | Dependencies |
|----|-------------|-------------|--------------|
| R1 | [requirement] | YES/NO | [depends on what] |
```

#### 0.2.4 Assumption Extraction

List assumptions (explicit and hidden).

```
## 0.2.4 Assumptions

| ID | Assumption | Explicit? | Impact if false |
|----|------------|-----------|-----------------|
| A1 | [assumption] | YES/NO | [consequences] |
```

---

### 0.3 Verification Checklist Generation

Based on extracted elements, generate checklist.

```
## 0.3 Generated Checklist

### For Claims:
□ C1: [generated verification question]
□ C2: [generated verification question]

### For Terms:
□ T1: [what to check]

### For Requirements:
□ R1: [what to check]

### For Assumptions:
□ A1: [what to check]

### Red Flags to investigate:
□ [red flag] → [what to investigate]
```

---

### 0.4 Method Selection

Select methods based on extracted elements.

```
## 0.4 Method Selection

### Tier 1 (Universal) - ALWAYS:
☑ M1 Consistency Check
☑ M2 Completeness Check
☑ M3 Scope Alignment

### Tier 2 (Claim-Level) - for each claim:
☑ M4 Falsifiability Check (×[N] claims)
☑ M5 Evidence Demand (×[N] claims)
☑ M6 Critical Challenge (for red-flagged claims)

### Tier 3 (Conditional):
[☑/☐] M7 Pairwise Compatibility - [use if >1 requirement]
[☑/☐] M8 Vocabulary Consistency - [use if technical terms present]
[☑/☐] M9 Theoretical Limits - [use if GUARANTEE claims exist]
[☑/☐] M10 Dependency Analysis - [use if dependencies exist]

### Tier 4 (Domain-Specific):
[☑/☐] M11 Domain KB Available - [if yes, use domain checklist]
[☑/☐] M12 Technical Term Verifier - [if KB has term definitions]
```

---

### 0.5 Triage

```
## 0.5 Triage

| Metric | Value |
|--------|-------|
| Claims count | [N] |
| Red flags count | [N] |
| Requirements count | [N] |
| Complexity estimate | LOW/MEDIUM/HIGH |

**Estimated effort:** [X]K tokens
```

---

## Phase 1: Tier 1 Verification (Universal)

**Apply these methods ALWAYS, for every artifact.**

### M1: Consistency Check

**Input:** Full artifact + extracted claims + terms
**Output:** List of inconsistencies or "PASS"

**Procedure:**
```
1. For each TERM:
   → Find all usage locations
   → Check if meaning is the same throughout
   → If different: FINDING (SEMANTIC inconsistency)

2. For each pair of CLAIMS (Ci, Cj):
   → Does Ci imply NOT(Cj)?
   → Does Cj imply NOT(Ci)?
   → If yes: FINDING (LOGICAL inconsistency)

3. For each REQUIREMENT vs CLAIM:
   → Does claim support requirement?
   → Does claim undermine requirement?
   → If undermines: FINDING (STRUCTURAL inconsistency)
```

**Stop condition:** All pairs checked OR 3+ inconsistencies found.

**Output format:**
```
### M1: Consistency Check

Status: PASS / FAIL

[If FAIL:]
| ID | Type | Element A | Element B | Inconsistency |
|----|------|-----------|-----------|---------------|
| I1 | SEMANTIC/LOGICAL/STRUCTURAL | [A] | [B] | [description] |
```

---

### M2: Completeness Check

**Input:** Artifact + artifact type
**Output:** List of gaps or "PASS"

**Procedure:**
```
1. Identify artifact TYPE:
   - Specification → requires: goals, requirements, constraints
   - Design doc → requires: architecture, components, interfaces
   - Plan → requires: steps, timeline, risks
   - Analysis → requires: data, methodology, conclusions
   - Creative → requires: structure appropriate for the form

2. Check presence of required elements

3. Scan for incompleteness markers:
   - TODO, TBD, FIXME, ???, [placeholder]
   - "will be defined later", "to be determined"
   - Empty sections, headers without content

4. Check forward references:
   - Does every "see section X" have existing section X?
   - Is every term used before definition later defined?
```

**Output format:**
```
### M2: Completeness Check

Status: PASS / PARTIAL / FAIL

[If not PASS:]
| ID | Gap type | Element | Impact |
|----|----------|---------|--------|
| G1 | MISSING_SECTION/PLACEHOLDER/FORWARD_REF | [what] | [impact] |
```

---

### M3: Scope Alignment

**Input:** Declared artifact goal + content
**Output:** Alignment assessment or drift list

**Procedure:**
```
1. Identify DECLARED GOAL:
   - Document title
   - "Purpose" / "Goal" / "Objective" section
   - First sentence / abstract

2. For each major section of artifact:
   → Does this section serve the declared goal?
   → If not: why does it exist? (SCOPE CREEP)

3. For each element of the goal:
   → Is it ADDRESSED in content?
   → If not: OMISSION (check CUI BONO)

4. CUI BONO on each omission:
   → Who benefits from the omission?
   → AGENT (easier work) or USER (better outcome)?
```

**Output format:**
```
### M3: Scope Alignment

Declared goal: "[goal]"

| Goal element | Status | Where addressed | CUI BONO if omitted |
|--------------|--------|-----------------|---------------------|
| [element] | FULL/PARTIAL/OMITTED | [section] | [who benefits] |

Scope creep: [list of sections outside scope]
```

---

## Phase 2: Tier 2 Verification (Claim-Level)

**Apply to EACH extracted claim.**

### M4: Falsifiability Check

**Input:** Single claim
**Output:** Falsification criterion or "UNFALSIFIABLE"

**Procedure:**
```
1. Formulate claim as testable statement

2. Answer: "What would DISPROVE this claim?"
   → If you cannot answer: claim is UNFALSIFIABLE
   → If you can: record falsification criterion

3. Check if criterion is PRACTICALLY testable:
   → Can the needed data be collected?
   → Is the test feasible?
```

**Output format (per claim):**
```
**Claim C[N]:** "[claim]"
- Falsifiable: YES/NO
- Criterion: [what would disprove it]
- Testability: EASY/HARD/IMPOSSIBLE
- [If IMPOSSIBLE: why]
```

---

### M5: Evidence Demand

**Input:** Single claim
**Output:** Evidence assessment or "UNSUBSTANTIATED"

**Procedure:**
```
1. What TYPE of evidence does this claim need?

   | Claim type | Required evidence |
   |------------|-------------------|
   | FACTUAL | Source, reference, definition |
   | CAUSAL | Mechanism, data, experiment |
   | GUARANTEE | Formal proof OR proof sketch + assumptions |
   | PERFORMANCE | Measurement, benchmark, methodology |
   | COMPARATIVE | Baseline, comparison conditions |

2. Does artifact PROVIDE this evidence?
   → YES: assess quality (STRONG/WEAK/INSUFFICIENT)
   → NO: UNSUBSTANTIATED

3. For UNSUBSTANTIATED: what SHOULD be provided?
```

**Output format (per claim):**
```
**Claim C[N]:** "[claim]"
- Type: [claim type]
- Required evidence: [what]
- Provided: YES/NO
- Quality: STRONG/WEAK/INSUFFICIENT/NONE
- [If missing: what should be provided]
```

---

### M6: Critical Challenge

**Input:** Single claim (especially those with Red Flag)
**Output:** Strongest counterargument + assessment

**Procedure:**
```
1. Adopt SKEPTIC stance toward this claim

2. Formulate STRONGEST argument against:
   - Not a straw-man (weak argument)
   - Find genuine weakness

3. Assess if claim SURVIVES the challenge:
   → SURVIVES: claim is robust, counterargument doesn't hold
   → WEAKENED: claim needs qualification/limitation
   → DEFEATED: counterargument is stronger

4. If WEAKENED/DEFEATED: how should claim be reformulated?
```

**Output format (per claim):**
```
**Claim C[N]:** "[claim]"
- Challenge: [strongest counterargument]
- Verdict: SURVIVES/WEAKENED/DEFEATED
- [If not SURVIVES: suggested correction]
```

---

## Phase 3: Tier 3 Verification (Conditional)

**Apply only when condition is met.**

### M7: Pairwise Compatibility

**Use condition:** Artifact has >1 requirement OR >1 GUARANTEE claim

**Input:** List of requirements/guarantees
**Output:** Compatibility matrix + conflicts

**Procedure:**
```
1. For each pair (Ri, Rj) where i < j:

   a) List what Ri REQUIRES (NEEDS)
   b) List what Ri EXCLUDES
   c) Check if Rj.NEEDS ∩ Ri.EXCLUDES ≠ ∅
   d) Check if Ri.NEEDS ∩ Rj.EXCLUDES ≠ ∅

2. If conflict:
   → Is it DEFINITIONAL (impossible by definition)?
   → Is it PRACTICAL (hard but possible)?

3. For definitional conflicts: this is a CRITICAL finding
```

**Output format:**
```
### M7: Pairwise Compatibility

| Pair | Compatible? | Conflict type | Details |
|------|-------------|---------------|---------|
| R1-R2 | YES/NO | NONE/PRACTICAL/DEFINITIONAL | [description] |
```

---

### M8: Vocabulary Consistency

**Use condition:** Artifact uses technical terms OR has extracted terms from 0.2.2

**Input:** List of extracted terms
**Output:** Consistency assessment or problem list

**Procedure:**
```
1. For each TERM:
   a) Collect ALL usages in document
   b) Does term have EXPLICIT definition? Where?
   c) Are all usages consistent with definition?

2. Look for:
   - SYNONYMS: different words, same meaning
     → Problem: reader confusion
   - HOMONYMS: same word, different meanings
     → Problem: hidden ambiguity

3. For technical terms (if you recognize them):
   → Does usage match common definition?
   → If not: SEMANTIC error
```

**Output format:**
```
### M8: Vocabulary Consistency

| Term | Defined? | Consistent usage? | Issue |
|------|----------|-------------------|-------|
| [term] | YES/NO | YES/NO | SYNONYM/HOMONYM/MISUSE/NONE |

[If issues:]
| Term | Problem | Locations | Suggested fix |
|------|---------|-----------|---------------|
```

---

### M9: Theoretical Limits Check

**Use condition:** Artifact contains GUARANTEE claims OR uses words "impossible", "always", "never", "proves"

**Input:** GUARANTEE claims
**Output:** Assessment vs known limits or "NEEDS EXPERT"

**Procedure:**
```
1. For each GUARANTEE claim, ask:

   a) Is this a claim about ALL cases?
      → If yes: what are the assumptions?
      → Are assumptions stated?

   b) Do I know a theoretical limit in this domain?
      → If YES: check if claim violates it
      → If NO: flag as "NEEDS DOMAIN EXPERT"

   c) Is claim "too good to be true"?
      → Solves known hard problem?
      → Achieves all goals without trade-off?
      → If yes: SUSPICIOUSLY STRONG

2. Known universal limits (always check):
   - "Proves X for all inputs" → Halting Problem?
   - "Always optimal" → No Free Lunch?
   - "Zero trade-offs" → Usually impossible
```

**Output format:**
```
### M9: Theoretical Limits

| Claim | Assessment | Known limit? | Status |
|-------|------------|--------------|--------|
| C[N] | [assessment] | [limit or "unknown"] | OK/SUSPICIOUS/VIOLATES/NEEDS_EXPERT |
```

---

### M10: Dependency Analysis

**Use condition:** Extracted assumptions (0.2.4) contain dependencies OR claims depend on other claims

**Input:** Claims + Assumptions
**Output:** Dependency graph + critical path + single points of failure

**Procedure:**
```
1. Build graph:
   → Nodes: claims, assumptions, requirements
   → Edges: "X depends on Y"

2. Find:
   - ROOTS: nodes without dependencies (fundamental assumptions)
   - LEAVES: nodes nothing depends on
   - CRITICAL PATH: longest path root→leaf

3. For each ROOT:
   → What if this assumption is FALSE?
   → How many other elements collapse?

4. Find SINGLE POINTS OF FAILURE:
   → Elements whose removal "disconnects" the graph
```

**Output format:**
```
### M10: Dependency Analysis

Critical assumptions (roots):
- A[N]: [assumption] → If false, impacts: [list]

Dependency chain:
[root] → [intermediate] → ... → [leaf]

Single points of failure:
- [element]: removing this breaks [what]
```

---

## Phase 4: Tier 4 Verification (Domain-Specific)

**Apply only when Domain KB is available.**

### M11: Domain Expert Activation

**Use condition:** Recognized domain has checklist in `domain-knowledge-base.md`

**Input:** Artifact + domain checklist
**Output:** Checklist results

**Procedure:**
```
1. Identify artifact domain(s)
2. Load appropriate checklist from KB
3. Execute each checklist item
4. For each FAIL: check KB for impossibility theorems
```

---

### M12: Technical Term Verifier

**Use condition:** Domain KB contains definitions for terms used in artifact

**Input:** Extracted terms + KB definitions
**Output:** Term correctness assessment

**Procedure:**
```
1. For each extracted term:
   → Is it in KB?
   → If yes: does usage match KB definition?
   → If mismatch: SEMANTIC ERROR
```

---

## Phase 5: Synthesis

### 5.1 Finding Consolidation

```
## 5.1 All Findings

| ID | Source | Severity | Description | Confidence |
|----|--------|----------|-------------|------------|
| F1 | M[N] | CRITICAL/IMPORTANT/MINOR | [finding] | [0-100%] |

Severity criteria:
- CRITICAL: Fundamental error, artifact cannot be used as-is
- IMPORTANT: Significant problem, requires correction
- MINOR: Small issue, nice-to-fix
```

### 5.2 Confidence Calibration

For each finding, assess confidence:

```
Base confidence:
- Direct evidence (quote from artifact): +40%
- Logical deduction: +30%
- Pattern match: +20%
- Intuition: +10%

Modifiers:
- Challenge survived: +10%
- Challenge weakened: -10%
- Domain KB confirms: +20%
- Domain KB absent: -10%
- Multiple methods agree: +15%
```

### 5.3 Limitations Acknowledgment

```
## 5.3 Verification Limits

What this verification did NOT check:
- [limit 1: e.g., "no domain KB for X"]
- [limit 2: e.g., "claims require empirical validation"]

What requires HUMAN EXPERT:
- [item 1]
- [item 2]
```

---

## Output Format

```markdown
# Deep Verify V7.7 - Verification Report

**Artifact:** [name/path]
**Date:** [date]

## Executive Summary

| Metric | Value |
|--------|-------|
| Claims analyzed | [N] |
| Findings | [N] CRITICAL, [N] IMPORTANT, [N] MINOR |
| Verification coverage | [%] |
| Limitations | [N] items need expert review |

**Verdict:** [PASS / PASS WITH CAVEATS / NEEDS REVISION / REJECT]

## Critical Findings

[Only CRITICAL, max 5, with evidence and recommended action]

## Important Findings

[IMPORTANT findings, with evidence]

## Minor Findings

[MINOR findings, brief]

## Verification Limits

[What was not checked and why]

## Appendix: Full Analysis

[Detailed outputs from each method]
```

---

## Method Quick Reference

### Tier 1 - Always apply

| Method | Input | Output | Effort |
|--------|-------|--------|--------|
| M1 Consistency | artifact + claims + terms | inconsistencies | LOW |
| M2 Completeness | artifact + type | gaps | LOW |
| M3 Scope Alignment | goal + content | drift assessment | LOW |

### Tier 2 - Per claim

| Method | Input | Output | Effort |
|--------|-------|--------|--------|
| M4 Falsifiability | claim | criterion or "unfalsifiable" | LOW |
| M5 Evidence Demand | claim | evidence assessment | MEDIUM |
| M6 Critical Challenge | claim | challenge + verdict | MEDIUM |

### Tier 3 - Conditional

| Method | Condition | Input | Output | Effort |
|--------|-----------|-------|--------|--------|
| M7 Pairwise Compat | >1 requirement | requirements | conflicts | MEDIUM |
| M8 Vocabulary | technical terms | terms | consistency | LOW |
| M9 Theoretical Limits | GUARANTEE claims | claims | limit check | HIGH |
| M10 Dependency | dependencies exist | claims + assumptions | graph + SPOF | MEDIUM |

### Tier 4 - Domain-specific

| Method | Condition | Input | Output | Effort |
|--------|-----------|-------|--------|--------|
| M11 Domain Expert | KB available | artifact + KB | checklist results | MEDIUM |
| M12 Term Verifier | KB has definitions | terms + KB | correctness | LOW |

---

## Claim Type → Method Mapping

| Claim Type | Primary Methods | Secondary Methods |
|------------|-----------------|-------------------|
| FACTUAL | M5 Evidence | M4 Falsifiability |
| CAUSAL | M6 Challenge, M10 Dependency | M5 Evidence |
| GUARANTEE | M9 Theoretical Limits, M5 Evidence | M6 Challenge |
| PERFORMANCE | M5 Evidence, M4 Falsifiability | M6 Challenge |
| COMPARATIVE | M5 Evidence (baseline check) | M6 Challenge |
| DEFINITIONAL | M8 Vocabulary, M1 Consistency | - |
| CONDITIONAL | M10 Dependency | M7 Pairwise |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 7.7 | 2026-01-19 | NEW: Generative verification, tiered methods, claim extraction, procedural method descriptions |
