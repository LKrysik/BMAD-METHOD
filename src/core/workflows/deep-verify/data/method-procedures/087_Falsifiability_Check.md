# #87 Falsifiability Check

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Verify claims can be tested or are unfalsifiable by theorem.

## What to do

1. For each claim, specify what evidence would prove it wrong
2. Classify claims:
   - Falsifiable (testable)
   - Unfalsifiable-by-theorem (known impossibility)
   - Unfalsifiable-by-design (untestable)

## Step-by-step

```
1. Extract claims:
   "System achieves optimal performance"

2. Attempt falsification:
   - What would prove this wrong?
   - "Finding a configuration with better performance"
   - Can this be tested? Depends on "optimal" definition

3. Check theorem status:
   - Is "optimal" for NP-hard problem?
   - If yes → unfalsifiable by theorem (can't prove optimality)

4. Classify:
   - If testable → Falsifiable
   - If theorem prevents testing → Unfalsifiable-by-theorem → CRITICAL
   - If just poorly defined → Unfalsifiable-by-design → IMPORTANT
```

## Output format

```
Claims analyzed:
| Claim | Falsification criterion | Category |
|-------|------------------------|----------|
| [C1]  | [what would disprove]  | [F/UT/UD]|
| [C2]  | [what would disprove]  | [F/UT/UD]|

F = Falsifiable, UT = Unfalsifiable-by-theorem, UD = Unfalsifiable-by-design

FINDING (if any): Claim "[X]" is unfalsifiable
QUOTE: "[exact claim]"
SEVERITY: [CRITICAL if theorem, IMPORTANT if design]
```
