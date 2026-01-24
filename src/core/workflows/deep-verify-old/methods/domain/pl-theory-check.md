# PL Theory Checker

## Purpose
Verify programming language theory claims about type systems, termination, soundness, and related properties.

## When to Apply
When artifact contains markers: type system, inference, termination, soundness, dependent types, gradual typing.

## PL Theory Facts

### Impossibility Results
| Claim | Impossibility |
|-------|---------------|
| "Sound gradual typing" | Gradual typing allows runtime type errors by design |
| "Complete type inference for dependent types" | Undecidable in general |
| "Guaranteed termination with general recursion" | Halting problem |
| "Decidable type checking for unrestricted dependent types" | Requires termination checking, which is undecidable |

### Known Limitations
| Feature | Limitation |
|---------|------------|
| Dependent types | Type checking requires evaluation, evaluation requires termination |
| Higher-order types | Inference becomes undecidable beyond rank-2 |
| Subtyping + inference | Generally undecidable together |
| Gradual types + soundness | "Well-typed programs can go wrong" |

### Feature Interactions
| Feature A | Feature B | Interaction Issue |
|-----------|-----------|-------------------|
| Higher-order rules | Termination checking | Rules that take rules can hide non-termination |
| Gradual typing | Dependent types | How to handle dynamic at type level? |
| First-class rules | Decidable type checking | First-class rules = arbitrary computation |

## Checklist

- [ ] **Termination claimed?** How is recursion restricted?
- [ ] **Soundness claimed?** Is there gradual/dynamic typing?
- [ ] **Full inference claimed?** What types? Dependent types undecidable.
- [ ] **Higher-order features?** Do they preserve properties?
- [ ] **Decidability claimed?** What's the complexity? What restrictions?

## Procedure

### Step 1: Extract PL Claims
Find claims about:
- Type system properties (sound, complete, decidable)
- Termination guarantees
- Inference capabilities
- Language features

### Step 2: Apply Checklist
Go through checklist for each claim.

### Step 3: Check Feature Interactions
If multiple features claimed, check interaction table.

### Step 4: Verify Against Facts
Compare claims against Facts tables.

## Output Format

```markdown
## PL Theory Check Results

### Claims Found
| Claim | Location | Type |
|-------|----------|------|
| "[claim]" | line X | termination/soundness/inference/decidability |

### Checklist Results
| Check | Result | Notes |
|-------|--------|-------|
| Termination - how restricted? | [answer] | [details] |
| Soundness - any dynamic? | [answer] | [details] |
| Inference - what scope? | [answer] | [details] |
| Higher-order - preserved? | [answer] | [details] |
| Decidability - complexity? | [answer] | [details] |

### Feature Interaction Check
| Feature A | Feature B | Issue? |
|-----------|-----------|--------|
| [feature] | [feature] | YES/NO - [explanation] |

### Issues Found
| ID | Claim | Issue | Severity |
|----|-------|-------|----------|
| PL-1 | "[claim]" | [problem] | CRITICAL/IMPORTANT |
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Claims soundness with gradual typing | CRITICAL |
| Claims termination with unrestricted recursion | CRITICAL |
| Claims complete inference for dependent types | CRITICAL |
| Higher-order feature without termination analysis | IMPORTANT |
| Unspecified restriction for decidability | IMPORTANT |
