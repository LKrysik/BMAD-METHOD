# Quantum Claims Checker

## Purpose
Verify quantum computing claims against known limitations and current hardware reality.

## When to Apply
When artifact contains markers: quantum, qubit, superposition, annealing, quantum advantage, QPU.

## Quantum Computing Facts (2026)

### Hardware Limitations
| Fact | Current Reality |
|------|-----------------|
| Qubit count | ~5,000 qubits on best hardware |
| Error rates | ~0.1-1% per gate operation |
| Coherence time | Microseconds to milliseconds |
| Connectivity | Limited (not all-to-all) |

### Speedup Claims
| Claim Type | Status |
|------------|--------|
| Factoring (Shor) | PROVEN speedup |
| Search (Grover) | PROVEN quadratic speedup |
| Optimization | NO PROVEN speedup (open problem) |
| Machine Learning | NO PROVEN speedup (research area) |

### Common Misconceptions
| Misconception | Reality |
|---------------|---------|
| "Explores all solutions simultaneously" | Interference cancels most paths |
| "Exponential speedup for everything" | Only for specific problems |
| "Quantum annealing = polynomial time" | It's a heuristic, no guaranteed bounds |
| "99% global optimum" | Depends on problem, often 50-80% on hard instances |

## Checklist

- [ ] **Speedup claimed?** Is it proven (Shor/Grover) or conjectured (optimization)?
- [ ] **Hardware realistic?** Does it assume >10K qubits? Unrealistic.
- [ ] **Error correction?** If QEC mentioned, does it account for overhead?
- [ ] **Classical comparison?** Compared to best classical, or just brute force?
- [ ] **Classical fallback?** If yes, does it negate the quantum advantage claim?

## Procedure

### Step 1: Extract Quantum Claims
Find all claims about quantum computing:
- Performance claims (speedup, time, probability)
- Hardware assumptions (qubits, gates)
- Comparison claims (vs classical)

### Step 2: Apply Checklist
Go through checklist above for each claim.

### Step 3: Verify Against Facts
Compare claims against Facts tables above.

### Step 4: Flag Issues
- Unproven speedup claimed as proven → CRITICAL
- Unrealistic hardware assumed → IMPORTANT
- No classical baseline comparison → IMPORTANT

## Output Format

```markdown
## Quantum Claims Check Results

### Claims Found
| Claim | Location | Type |
|-------|----------|------|
| "[claim]" | line X | speedup/hardware/comparison |

### Checklist Results
| Check | Result | Notes |
|-------|--------|-------|
| Speedup proven? | YES/NO | [details] |
| Hardware realistic? | YES/NO | [details] |
| Error correction addressed? | YES/NO | [details] |
| Classical comparison fair? | YES/NO | [details] |
| Fallback negates advantage? | YES/NO | [details] |

### Issues Found
| ID | Claim | Issue | Severity |
|----|-------|-------|----------|
| Q-1 | "[claim]" | [problem] | CRITICAL/IMPORTANT |
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Claims proven speedup for optimization | CRITICAL |
| Claims polynomial time for quantum annealing | CRITICAL |
| Assumes unrealistic hardware | IMPORTANT |
| No fair classical comparison | IMPORTANT |
