# MC-153: Theoretical Impossibility Check

**Category**: theory
**Source**: methods.csv #153
**Token Cost**: ~2-3K tokens
**Complexity**: HIGH

---

## Purpose

Check claims against known impossibility theorems from computer science, distributed systems, cryptography, and related fields. Detect when an artifact claims to achieve something that is mathematically proven impossible.

---

## When to Use

### Trigger Conditions
- Domain is theoretical (crypto, distributed, formal methods)
- Claims use strong language ("always", "never", "guaranteed")
- Claims seem "too good to be true"
- Multiple properties claimed that are typically trade-offs

### Do NOT Use When
- Purely practical claims without theoretical implications
- Domain has no known impossibility theorems
- Claims are explicitly qualified ("under conditions X")

---

## Execution Steps

### Step 1: Extract Strong Claims

**Input**: The artifact
**Action**: Find claims that assert strong guarantees:
- "Always", "never", "guaranteed"
- "Impossible to X"
- "100%", "perfect", "complete"
- Multiple properties claimed together

**Output**: Claim inventory

```markdown
### Strong Claims Extracted
| # | Claim | Quote | Domain |
|---|-------|-------|--------|
| C1 | {claim} | "{exact text}" | crypto/distributed/formal/... |
| C2 | | | |
```

### Step 2: Identify Applicable Theorems

**Input**: Claims and their domains
**Action**: For each claim, check against known impossibility theorems:

**Distributed Systems**:
- FLP Impossibility: No async consensus with 1 failure
- CAP Theorem: Can't have C+A+P simultaneously
- Two Generals: Can't guarantee coordination over unreliable channel

**Cryptography**:
- No PFS + Key Recovery together
- No encryption with known plaintext attack resistance AND key escrow
- Kerckhoffs: Security can't rely on algorithm secrecy

**Computation**:
- Halting Problem: Can't decide if arbitrary program halts
- Rice's Theorem: Can't decide non-trivial semantic properties
- Gödel: No complete consistent formal system for arithmetic

**Mechanism Design**:
- Arrow's Theorem: No perfect voting system
- Myerson-Satterthwaite: No efficient bilateral trade with private info
- No-Free-Lunch: No universal best algorithm

**Output**: Theorem matching

```markdown
### Theorem Check
| Claim | Potentially Violates | Theorem Statement |
|-------|---------------------|-------------------|
| C1 | FLP | "Async consensus impossible with 1 failure" |
| C2 | CAP | "Cannot have C+A+P simultaneously" |
```

### Step 3: Check for Violation

**Input**: Claim-theorem pairs
**Action**: For each pair, determine:
- Does the claim ACTUALLY violate the theorem?
- Is there a qualification that avoids violation?
- Is the theorem applicable to this context?

**Output**: Violation analysis

```markdown
### Violation Analysis: Claim C1 vs {Theorem}

**Claim states**: "{claim}"
**Theorem states**: "{theorem}"

**Applicability Check**:
| Condition | Required by Theorem | Present in Claim? |
|-----------|---------------------|-------------------|
| {condition 1} | {requirement} | YES/NO |
| {condition 2} | {requirement} | YES/NO |

**Violation?**:
- If ALL conditions present: VIOLATION
- If some conditions missing: POTENTIALLY VALID (under those conditions)
- If conditions explicitly excluded: NO VIOLATION

**Verdict**: VIOLATES / POTENTIALLY VALID / DOES NOT VIOLATE
```

### Step 4: Document Findings

**Input**: Violation analysis
**Action**: For each violation:
- State clearly what's impossible and why
- Note what would make the claim valid
- Classify severity

**Output**: Findings

---

## Output Template

```markdown
## Theoretical Impossibility Check

### Claims Analyzed
{N} strong claims extracted

### Theorem Matches
| Claim | Domain | Theorem | Violation? |
|-------|--------|---------|------------|
| C1 | distributed | FLP | YES |
| C2 | crypto | PFS+Recovery | YES |
| C3 | computation | Halting | NO (qualified) |

### Violations Found

#### C1: {Claim text}
**Violates**: {Theorem name}
**Why**: {explanation}
**Would be valid if**: {conditions}
**Severity**: 🔴 CRITICAL

### Summary
| Status | Count |
|--------|-------|
| Violations | {N} |
| Potentially valid | {N} |
| No issues | {N} |

### Findings
| ID | Severity | Finding |
|----|----------|---------|
| F1 | 🔴 | {claim} violates {theorem} - impossible as stated |
```

---

## Examples

### Example 1: Distributed Database Claims

**Claims**:
| # | Claim |
|---|-------|
| C1 | "Guarantees consistency across all nodes" |
| C2 | "Always available, even during partition" |
| C3 | "Partition tolerant" |

**Theorem Check**: CAP Theorem
- Consistency: C1 claims ✓
- Availability: C2 claims ✓
- Partition tolerance: C3 claims ✓

**Violation Analysis**:
- CAP states: Can only have 2 of 3
- Claim states: All 3 guaranteed
- **VIOLATION**: Claims all three, which is impossible

**Finding**: 🔴 CRITICAL - System claims C+A+P which violates CAP theorem. Must choose which to sacrifice during partitions.

---

### Example 2: Crypto Protocol

**Claims**:
| # | Claim |
|---|-------|
| C1 | "Perfect Forward Secrecy" |
| C2 | "Enterprise key recovery for compliance" |

**Theorem Check**: PFS definition
- PFS: Past sessions unreadable even with current key
- Recovery: Must be able to read past sessions

**Violation Analysis**:
- PFS EXCLUDES: Any mechanism to read past sessions
- Recovery REQUIRES: Mechanism to read past sessions
- **VIOLATION**: Definitional impossibility

**Finding**: 🔴 CRITICAL - PFS and full key recovery are definitionally incompatible. Must choose one or accept partial implementation of each.

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Not knowing theorems | Miss violations | Study domain-knowledge-base.md |
| Applying theorem incorrectly | False positive | Check ALL theorem conditions |
| Missing qualifications | False positive | Look for "under conditions X" |
| Dismissing as "implementation detail" | Real impossibility | Theorems are absolute |

---

## Related Methods

- #154 Definitional Contradiction - Different approach to same goal
- #155 Technical Term Verifier - Check term usage
- #156 Domain Expert Activation - Get domain expertise

---

## Key Theorems Quick Reference

| Domain | Theorem | Impossibility |
|--------|---------|---------------|
| Distributed | FLP | Async consensus with 1 failure |
| Distributed | CAP | C+A+P simultaneously |
| Crypto | PFS+Recovery | Both fully satisfied |
| Computation | Halting | Decide if program halts |
| Computation | Rice | Decide semantic properties |
| Mechanism | Arrow | Perfect voting system |
| Optimization | No-Free-Lunch | Universal best algorithm |

---

## Quality Checks

Before finalizing output, verify:
- [ ] All strong claims identified
- [ ] Correct theorems matched to domains
- [ ] Theorem conditions checked (not just name match)
- [ ] Qualifications noted that might avoid violation
- [ ] Severity reflects actual impossibility
