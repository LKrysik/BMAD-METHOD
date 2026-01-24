# #162 Theory-Dependence Verification

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Verify theoretical claims have proper backing.

## What to do

1. For each theoretical claim, identify the theory relied upon
2. Check if the theory actually supports the claim
3. Verify no misapplication of theory
4. Demand proof or reference for novel claims

## Step-by-step

```
1. Identify theoretical claims:
   "Algorithm is provably correct"

2. Find supporting theory:
   - What theorem/proof is referenced?
   - Is it cited? Restated? Assumed?

3. Verify support:
   - Does theorem actually prove this?
   - Are preconditions met?
   - Is there a gap in reasoning?

4. Flag issues:
   - "Soundness" claimed without proof
   - "Termination" claimed without checker
   - "Guarantees" without theorems
```

## Output format

```
Theoretical claims:
| Claim | Theory cited | Supports claim? | Preconditions met? |
|-------|-------------|-----------------|-------------------|
| [C1]  | [theory]    | [Y/N/P]         | [Y/N/unclear]     |
| [C2]  | [none]      | N/A             | N/A               |

Flags:
- [Claim without backing]
- [Misapplied theorem]
- [Missing precondition]

FINDING (if any): Claim "[X]" lacks theoretical backing
QUOTE: "[exact claim]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
