# #116 Strange Loop Detection

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Find circular reasoning or dependencies.

## What to do

1. Build justification graph (what justifies what)
2. Detect cycles - each cycle needs external anchor or reasoning is ungrounded
3. For each cycle: Is there a breaking condition? Is there dampening?

## Step-by-step

```
1. Map justifications:
   "System is secure" ← "Uses encryption"
   "Uses encryption" ← "Has key management"
   "Has key management" ← "System is secure" ← LOOP!

2. For each loop:
   - External anchor? No
   - Breaking condition? No
   → UNGROUNDED REASONING

3. Check for dampening:
   "A influences B influences C influences A"
   - Does influence diminish? (dampening)
   - Or amplify? (instability)
```

## Output format

```
Justification graph:
[ASCII or list representation]

Cycles detected:
- [A] → [B] → [C] → [A]
  External anchor: [yes/no]
  Breaking condition: [yes/no]
  Dampening: [yes/no/amplifying]
  Verdict: [grounded/ungrounded/unstable]

FINDING (if any): Circular dependency in [X]
QUOTE: "[text showing the cycle]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
