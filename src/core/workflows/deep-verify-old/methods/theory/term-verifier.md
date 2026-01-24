# Technical Term Verifier

## Purpose
Check if technical terms are used correctly according to their standard domain definitions.

## When to Apply
When artifact domain is: quantum, distributed, crypto, pl-theory.

## Technical Term Definitions

### Quantum Computing

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| Quantum Advantage | Proven speedup vs best classical algorithm | "Faster than brute force" (trivial) |
| Quantum Annealing | Heuristic optimization, no proven speedup | "Polynomial time optimizer" |
| Qubit | ~5000 on current hardware (2026) | Claims requiring >10,000 qubits as available |
| Superposition | State before measurement | "Explores all solutions simultaneously" (oversimplification) |

### Distributed Systems

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| Consensus | Agreement on single value among nodes | Data synchronization (different) |
| Byzantine | Arbitrary malicious behavior | Simple crash failures |
| Linearizability | Operations appear atomic and ordered | Eventual consistency (weaker) |
| Partition tolerance | System works despite network splits | Just "fault tolerance" |

### Cryptography

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| Homomorphic | Operations on ciphertexts produce encrypted result | "Homomorphic key operations" |
| Zero-Knowledge | Proof reveals nothing except statement truth | ZK that enables recovery |
| Post-Quantum | Secure against quantum attacks (lattice, hash-based) | RSA/ECC (broken by Shor) |
| PFS | Past sessions unreadable if long-term keys compromised | Any forward secrecy |

### PL Theory

| Term | Correct Usage | Incorrect Usage |
|------|---------------|-----------------|
| Sound | Well-typed programs don't go wrong | Gradual typing (has runtime failures) |
| Complete | All true statements provable | Undecidable type inference called complete |
| Terminating | All executions halt | Turing-complete + termination guarantee |
| Decidable | Algorithm exists that always halts with answer | "Mostly works" |

## Procedure

### Step 1: Extract Technical Terms
Find all domain-specific technical terms in artifact.

### Step 2: Identify Domain
Determine which domain each term belongs to.

### Step 3: Check Against Definitions
Compare usage in artifact against correct usage in table above.

### Step 4: Flag Misuse
If usage matches "Incorrect Usage" column → finding.

## Output Format

```markdown
## Term Verifier Results

### Technical Terms Found
| Term | Usage in Artifact | Domain |
|------|-------------------|--------|
| [term] | "[how it's used]" line X | [domain] |

### Verification
| Term | Usage | Correct? | Expected | Issue |
|------|-------|----------|----------|-------|
| [term] | "[usage]" | YES/NO | "[correct usage]" | [explanation] |

### Misuse Found
| ID | Term | Location | Misuse | Should Be |
|----|------|----------|--------|-----------|
| V-1 | [term] | line X | "[incorrect usage]" | "[correct usage]" |
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Core term used with opposite meaning | CRITICAL |
| Technical term misused in claims | IMPORTANT |
| Informal usage of technical term | MINOR |
