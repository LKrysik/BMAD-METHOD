# Theoretical Impossibility Check

## Purpose
Detect claims that violate known impossibility theorems in computer science, distributed systems, cryptography, and related fields.

## When to Apply
When artifact contains markers: guarantees, ensures, always, never, impossible, polynomial, exponential, optimal, proves, sound, complete.

Or when artifact domain is: quantum, distributed, crypto, pl-theory, mechanism.

## Knowledge Base

### Distributed Systems Theorems

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **FLP** | Deterministic consensus impossible in async network with 1 crash failure | Claims "async" + "consensus" + "fault tolerant" without acknowledging trade-off |
| **CAP** | Cannot have Consistency + Availability + Partition-tolerance simultaneously | Claims all three without sacrifice |
| **BFT Bound** | Byzantine tolerance requires f < N/3 | Claims f < N/2 for Byzantine |

### Computation Theory

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **Halting Problem** | Cannot decide if arbitrary program terminates | Claims "proves termination for all programs" |
| **Rice's Theorem** | All non-trivial semantic properties undecidable | Claims "verifies [semantic property] for all programs" |
| **Gödel** | Sufficiently powerful system cannot prove own consistency | Claims "system verifies itself completely" |

### Quantum Computing

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **No Quantum Speedup** | No proven exponential speedup for optimization | Claims "quantum advantage" for optimization |
| **Quantum Annealing** | Heuristic, no proven polynomial bound | Claims "polynomial time" for quantum annealing |
| **NP-Hardness** | No known poly-time solution (quantum or classical) | Claims poly-time for NP-hard problem |

### Cryptography

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **PFS Definition** | Past sessions unreadable if keys compromised | Claims PFS + key recovery for past sessions |
| **ZK Property** | Zero-knowledge cannot leak information | Claims ZK + derivable information |

### Programming Language Theory

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **Termination + Recursion** | General recursion + guaranteed termination impossible | Claims both without restriction |
| **Gradual Soundness** | Gradual typing cannot be sound | Claims gradual typing + soundness |
| **Type Inference** | Complete inference undecidable for dependent types | Claims full inference for dependent types |

### Mechanism Design

| Theorem | Statement | Violation Signal |
|---------|-----------|------------------|
| **Myerson-Satterthwaite** | No mechanism has SP + IR + Efficiency + Budget Balance | Claims all four |
| **Arrow's Theorem** | No voting system satisfies all fairness criteria | Claims "fair" voting without trade-off |

## Procedure

### Step 1: Extract Claims
Find all statements that assert guarantees:
- "guarantees...", "ensures...", "always...", "never..."
- "impossible to...", "cannot..."
- "polynomial time", "optimal", "complete"

### Step 2: Identify Domain
For each claim, determine which domain it belongs to.

### Step 3: Check Against Theorems
For each claim, find relevant theorem from Knowledge Base above.
Compare claim against theorem statement.

### Step 4: Classify Violation
If claim contradicts theorem → VIOLATION

## Output Format

```markdown
## Impossibility Check Results

### Claims Extracted
| Claim | Location | Domain |
|-------|----------|--------|
| "[exact quote]" | line X | [domain] |

### Theorem Checks
| Claim | Theorem | Violation? | Explanation |
|-------|---------|------------|-------------|
| "[claim]" | [theorem name] | YES/NO | [why] |

### Violations Found
| ID | Claim | Theorem Violated | Severity |
|----|-------|------------------|----------|
| T-1 | "[claim]" line X | [theorem] | CRITICAL |
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Claim directly contradicts impossibility theorem | CRITICAL |
| Claim ignores known limitation | IMPORTANT |
| Claim doesn't acknowledge trade-off | MINOR |
