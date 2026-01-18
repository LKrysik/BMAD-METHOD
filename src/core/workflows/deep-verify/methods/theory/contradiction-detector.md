# Definitional Contradiction Detector

## Purpose
Find requirements or claims that are mutually exclusive BY DEFINITION - not just hard to achieve together, but logically impossible.

## When to Apply
When artifact has 3+ requirements with markers: must, shall, requires, guarantees.

## Known Contradictory Pairs

| Claim A | Claim B | Why Impossible |
|---------|---------|----------------|
| Perfect Forward Secrecy | Key Recovery for past sessions | PFS = past unreadable, Recovery = past readable |
| Async network | Guaranteed liveness under faults | FLP theorem |
| Sound type system | Gradual typing | Gradual allows runtime type failures |
| General recursion | Guaranteed termination | Halting problem |
| Full type inference | Dependent types | Inference undecidable |
| Budget balance | VCG mechanism | VCG needs external subsidy |
| O(N) messages | BFT consensus | Lower bound is Ω(N²) |
| Stateless | Session memory | Contradiction in terms |
| Real-time guarantee | Unbounded computation | Cannot bound what's unbounded |

## Procedure

### Step 1: Extract Requirements
Find all requirements in artifact:
- "must...", "shall...", "requires..."
- "guarantees...", "ensures..."
- Numbered requirements
- Properties claimed

### Step 2: Expand Definitions
For each requirement, extract:
- **MEANS:** What it literally says
- **IMPLIES:** What follows logically
- **EXCLUDES:** What it makes impossible

### Step 3: Pairwise Comparison
For each pair of requirements (R1, R2):
- Does R1.EXCLUDES overlap with R2.MEANS or R2.IMPLIES?
- Does R2.EXCLUDES overlap with R1.MEANS or R1.IMPLIES?
- Check against Known Contradictory Pairs above

### Step 4: Classification
- **DEFINIONAL:** Impossible by logic/definition
- **PRACTICAL:** Very hard but not impossible
- **COMPATIBLE:** No conflict

## Output Format

```markdown
## Contradiction Detector Results

### Requirements Extracted
| ID | Requirement | MEANS | IMPLIES | EXCLUDES |
|----|-------------|-------|---------|----------|
| R1 | "[quote]" | [literal] | [logical consequence] | [incompatible with] |
| R2 | "[quote]" | [literal] | [logical consequence] | [incompatible with] |

### Pairwise Analysis
| R1 | R2 | Conflict? | Type | Explanation |
|----|----|-----------| -----|-------------|
| R1 | R2 | YES/NO | DEFINITIONAL/PRACTICAL/NONE | [why] |

### Contradictions Found
| ID | Requirements | Type | Explanation |
|----|--------------|------|-------------|
| C-1 | R1 vs R3 | DEFINITIONAL | "[R1]" excludes "[R3]" because [reason] |
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Definitional contradiction (impossible by logic) | CRITICAL |
| Practical contradiction (known to be incompatible) | IMPORTANT |
| Tension between requirements | MINOR |
