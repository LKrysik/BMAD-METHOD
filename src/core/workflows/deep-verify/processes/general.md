# Process: General Verification (Fallback)

## Triggers

This process is used when:
- No domain-specific process triggered
- Domain-specific processes found no issues but artifact is complex
- Explicit request for first-principles verification

---

## Steps

### Step 1: Extract All Claims

**Do:** List EVERY explicit claim in the artifact.

A claim is any statement that asserts something is true, works, or has a property.

**Claim Types:**
- Functional: "System does X"
- Performance: "System achieves Y"
- Property: "System is Z"
- Comparative: "System is better than W"

**Output Format:**
```
| # | Claim | Type | Location | Exact Quote |
|---|-------|------|----------|-------------|
| 1 | [claim] | [type] | §[X] | "[quote]" |
| 2 | [claim] | [type] | §[X] | "[quote]" |
...
```

---

### Step 2: Check Internal Consistency

**Do:** For each pair of claims, check if they contradict.

**Consistency Checks:**
```
For claims C1 and C2:
1. Do they use the same terms consistently?
2. Do they make compatible assertions?
3. Could both be true simultaneously?

If contradiction found:
- Quote both claims
- Explain the contradiction
- Severity based on importance of claims
```

**Output:**
```
| Claim A | Claim B | Consistent? | Issue |
|---------|---------|-------------|-------|
| #[N] | #[M] | YES/NO | [explanation if NO] |
```

---

### Step 3: Check Completeness

**Do:** Identify what's missing or undefined.

**Completeness Checks:**
- Are all referenced terms defined?
- Are all dependencies specified?
- Are error cases handled?
- Are edge cases addressed?
- Are assumptions stated?

**Markers to search for:**
- TODO, TBD, FIXME, PLACEHOLDER
- "To be determined", "TBA"
- "See [reference]" without reference
- Undefined terms used

**Output:**
```
| Type | Item | Location | Impact |
|------|------|----------|--------|
| Undefined term | [term] | §[X] | [impact] |
| Missing spec | [what] | §[X] | [impact] |
| TODO | "[text]" | §[X] | [impact] |
```

---

### Step 4: Check Falsifiability

**Do:** For each major claim, determine if it can be tested/disproven.

**Falsifiability Check:**
```
For claim C:
1. What evidence would PROVE it false?
2. Is such evidence obtainable?
3. If not falsifiable, is this acceptable? (some claims are definitional)
```

**Red Flags:**
- "Always works" (unfalsifiable without context)
- "Best" without criteria
- "Optimal" without definition
- Claims immune to any counterexample

**Output:**
```
| Claim | Falsifiable? | How to Test | Issue |
|-------|--------------|-------------|-------|
| #[N] | YES/NO | [test] | [issue if NO] |
```

---

### Step 5: Inversion Check

**Do:** Ask what would GUARANTEE the system fails.

**Inversion Process:**
```
1. State the system's goal
2. List ways to guarantee failure of that goal
3. Check if artifact does any of those things

Example:
Goal: "Reliable data storage"
Failure guarantees:
- No backup mechanism
- No error handling
- No validation
Check: Does artifact address these?
```

**Output:**
```
| Goal | Failure Path | Artifact Addresses? | Finding |
|------|--------------|---------------------|---------|
| [goal] | [failure] | YES/NO/PARTIAL | [finding if NO] |
```

---

### Step 6: Assumption Audit

**Do:** List all explicit and implicit assumptions.

**Assumption Types:**
- **Explicit:** Stated in artifact
- **Implicit:** Required but not stated
- **Environmental:** About deployment context

**For each assumption:**
1. Is it reasonable?
2. What if it's wrong?
3. Is the impact acceptable?

**Output:**
```
| Assumption | Type | Reasonable? | Impact if Wrong |
|------------|------|-------------|-----------------|
| [assumption] | [type] | YES/NO | [impact] |
```

---

## Finding Templates

### CRITICAL Findings

**Fundamental Contradiction:**
```
Finding: Core claims contradict each other.
Claim A: "[quote]"
Claim B: "[quote]"
Contradiction: [explanation]
Severity: CRITICAL
Recommendation: Resolve contradiction - both cannot be true.
```

### IMPORTANT Findings

**Incomplete Specification:**
```
Finding: Critical aspect is undefined.
Missing: [what]
Impact: [why it matters]
Severity: IMPORTANT
Recommendation: Define [what] explicitly.
```

**Unfalsifiable Claim:**
```
Finding: Major claim cannot be tested or disproven.
Claim: "[quote]"
Issue: No way to verify this is true.
Severity: IMPORTANT
Recommendation: Make claim specific and testable.
```

**Unaddressed Failure Mode:**
```
Finding: Obvious failure path not addressed.
Failure: [description]
Impact: [what happens]
Severity: IMPORTANT
Recommendation: Address this failure mode.
```

### MINOR Findings

**Implicit Assumption:**
```
Finding: Relies on unstated assumption.
Assumption: [what]
If Wrong: [impact]
Severity: MINOR (if impact low) / IMPORTANT (if impact high)
Recommendation: State assumption explicitly.
```

**Vague Claim:**
```
Finding: Claim is too vague to verify.
Claim: "[quote]"
Issue: [why vague]
Severity: MINOR
Recommendation: Make claim specific.
```

---

## Process Metrics

| Metric | Target |
|--------|--------|
| Steps | 6 |
| Tokens | 2-4K |
| Time | 3-5 min |
| Domain-KB sections used | §5.Proof Requirements (primarily reasoning-based) |

---

## When to Use This Process

```
IF no domain-specific triggers matched:
    → Use general process

IF domain processes ran but found nothing:
    AND artifact complexity is HIGH:
    → Run general process as second pass

IF user explicitly requests first-principles review:
    → Use general process
```
