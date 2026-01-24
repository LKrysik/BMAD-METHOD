# #165 Constructive Counterexample

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Actively attempt to break claimed properties.

## What to do

1. For each claim, identify what would violate it
2. Attempt to construct a counterexample
3. If construction succeeds → claim is false

## Step-by-step

```
1. Select claim:
   "All user inputs are validated"

2. Define violation:
   - Find input that bypasses validation
   - Construct malformed input
   - Test edge cases

3. Attempt construction:
   - Empty string: handled?
   - Unicode edge cases: handled?
   - Null bytes: handled?
   - Extremely long input: handled?

4. If any succeeds:
   → CRITICAL finding (claim is demonstrably false)
```

## Output format

```
Claim: [description]
Violation definition: [what would break it]

Construction attempts:
| Attempt | Description | Result |
|---------|-------------|--------|
| [A1]    | [desc]      | [pass/fail] |
| [A2]    | [desc]      | [pass/fail] |

Counterexample found: [yes/no]
If yes: [describe the counterexample]

FINDING (if any): Counterexample breaks claim "[X]"
QUOTE: "[claim text]"
Counterexample: [description]
SEVERITY: CRITICAL (demonstrated failure)
```
