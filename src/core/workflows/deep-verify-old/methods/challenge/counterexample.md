# Counterexample Construction

## Purpose
Actively try to construct a case that breaks claimed properties. More rigorous than theoretical analysis - if you can BUILD a breaking case, the claim is definitely false.

## When to Apply
When critical findings exist and you want to confirm them with concrete examples.

## Procedure

### Step 1: Identify Claims
What properties does artifact claim?
- "Always X"
- "Never Y"
- "Guarantees Z"
- "Handles all cases"

### Step 2: Define Violation
For each claim, what would violate it?
- "Always X" → find case where NOT X
- "Never Y" → find case where Y
- "Handles all" → find unhandled case

### Step 3: Attempt Construction
Try to BUILD a concrete example:
- Specific inputs
- Specific state
- Specific sequence of events

### Step 4: Evaluate Result
- **Construction succeeds** → Claim is FALSE (CRITICAL)
- **Construction fails** → Claim survives this test (not proven true)
- **Construction unclear** → Note uncertainty

## Construction Strategies

| Claim Type | Try These |
|------------|-----------|
| "Handles all inputs" | Empty, null, maximum, negative, special characters |
| "Always terminates" | Recursive input, self-referential, infinite stream |
| "Never fails" | Resource exhaustion, concurrent access, timeout |
| "Optimal" | Adversarial input designed to hit worst case |
| "Consistent" | Concurrent modifications, partial failures |
| "Secure" | Malformed input, injection, privilege escalation |

## Output Format

```markdown
## Counterexample Construction Results

### Claims to Test
| Claim | Location | What Would Violate |
|-------|----------|-------------------|
| "[claim]" | line X | [violation condition] |

### Construction Attempts
| Claim | Counterexample Attempted | Result |
|-------|-------------------------|--------|
| "[claim]" | [specific example tried] | SUCCESS/FAIL/UNCLEAR |

### Successful Counterexamples
| ID | Claim | Counterexample | Why It Breaks |
|----|-------|----------------|---------------|
| CE-1 | "[claim]" | [concrete example] | [explanation] |

### Failed Constructions
| Claim | What Was Tried | Why Failed |
|-------|----------------|------------|
| "[claim]" | [attempt] | [couldn't construct because...] |
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Counterexample successfully constructed | CRITICAL |
| Counterexample partial (edge case) | IMPORTANT |
| Couldn't construct but suspicious | MINOR |
