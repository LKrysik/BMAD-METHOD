# #153 Theoretical Impossibility Check

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Check claims against known theorems.

## What to do

1. Identify claims that sound "too good to be true"
2. Check against impossibility theorems:
   - Distributed: CAP, FLP, Byzantine bounds
   - Mechanism design: Green-Laffont, Myerson-Satterthwaite, Arrow
   - Computation: Halting, Rice, Godel
   - Cryptography: PFS constraints
   - Optimization: No Free Lunch
   - Information: Shannon limits

## Step-by-step

```
1. Flag ambitious claims:
   "Guarantees consensus in async network with f < N/2 faults"

2. Check theorem library:
   FLP theorem: Impossible to guarantee consensus in
   async network with even ONE faulty process.

3. Check for valid exceptions:
   - Synchrony assumptions? Not stated
   - Probabilistic termination? Not mentioned
   → THEOREM VIOLATION

4. Document:
   Claim: [exact quote]
   Theorem: FLP impossibility
   Violation: Yes, claims impossible guarantee
   Exception path: None stated
```

## Output format

```
Ambitious claims identified:
- [Claim 1]: "[quote]"
- [Claim 2]: "[quote]"

Theorem checks:
| Claim | Theorem | Violated? | Exception? |
|-------|---------|-----------|------------|
| [C1]  | [T1]    | [Y/N]     | [Y/N/desc] |
| [C2]  | [T2]    | [Y/N]     | [Y/N/desc] |

FINDING (if any): Claim "[X]" violates [theorem]
QUOTE: "[exact claim]"
SEVERITY: CRITICAL (theorem violations are always CRITICAL)
```
