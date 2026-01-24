# #154 Definitional Contradiction Detector

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Find requirements that are mutually exclusive by definition.

## What to do

1. List all requirements as R1, R2, R3...
2. For each, expand:
   - MEANS: What it literally says
   - IMPLIES: Logical consequences
   - EXCLUDES: What it's incompatible with
3. Check each pair for exclusion overlaps

## Step-by-step

```
1. List requirements:
   R1: "Perfect forward secrecy"
   R2: "Key escrow for compliance"

2. Expand R1:
   MEANS: Session keys cannot be recovered after session
   IMPLIES: No key storage, immediate deletion
   EXCLUDES: Any key recovery mechanism

3. Expand R2:
   MEANS: Keys stored for later recovery
   IMPLIES: Key storage, retrieval capability
   EXCLUDES: Immediate key deletion

4. Check overlap:
   R1.EXCLUDES ∩ R2.MEANS = {key recovery}
   R2.EXCLUDES ∩ R1.MEANS = {key deletion}
   → DEFINITIONAL CONTRADICTION
```

## Output format

```
Requirements:
- R1: [description]
- R2: [description]
- ...

Expansions:
R1:
  MEANS: [literal interpretation]
  IMPLIES: [logical consequences]
  EXCLUDES: [incompatibilities]

R2:
  MEANS: [literal interpretation]
  IMPLIES: [logical consequences]
  EXCLUDES: [incompatibilities]

Contradiction check:
| Pair | R_i.EXCLUDES ∩ R_j.MEANS | Contradiction? |
|------|-------------------------|----------------|
| 1,2  | [overlap]               | [Y/N]          |
| 1,3  | [overlap]               | [Y/N]          |

FINDING (if any): R[X] and R[Y] are definitionally contradictory
QUOTE: "[R_X text]" vs "[R_Y text]"
SEVERITY: CRITICAL (definitional contradictions are always CRITICAL)
```
