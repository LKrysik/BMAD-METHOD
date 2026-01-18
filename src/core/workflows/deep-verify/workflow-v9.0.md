# Deep Verify V9.0 - Simplified Verification Workflow

## What is this?

Deep Verify V9.0 is a verification workflow that selects and applies methods to detect issues in artifacts. The workflow is designed around three principles:

1. **Simple selection** - methods selected by markers and domain, not fuzzy scoring
2. **Self-contained methods** - each method file contains everything needed to apply it
3. **Clear flow** - PROFILE → SELECT → EXECUTE → REPORT

---

## Files Structure

```
src/core/workflows/deep-verify/
├── workflow-v9.0.md          # This file (process)
├── catalog.yaml              # Method selection rules (WHEN to use)
└── methods/                  # Method procedures (HOW to use)
    ├── core/                 # Always apply
    ├── theory/               # For theoretical claims
    ├── domain/               # Domain-specific
    └── challenge/            # Stress-testing findings
```

---

## Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PROFILE   │────▶│   SELECT    │────▶│   EXECUTE   │────▶│  CHALLENGE  │────▶│   REPORT    │
│  artifact   │     │   methods   │     │   methods   │     │ (if CRIT)   │     │   findings  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
   Phase 1            Phase 2            Phase 3            Phase 3.5           Phase 4
```

**Note:** Phase 3.5 (CHALLENGE) only executes if CRITICAL findings exist after Phase 3.

---

## Phase 1: PROFILE (5 min)

**Goal:** Extract artifact characteristics for method selection.

### Step 1.1: Basic Info

```markdown
## Artifact Profile

**Name:** [artifact name]
**Type:** [specification / design / protocol / code / plan]
**Size:** [small <2K / medium 2-10K / large >10K tokens]
```

### Step 1.2: Marker Scan

Scan artifact for keywords. Check boxes for found markers:

```markdown
## Markers Found

### Guarantee Markers (trigger: theory methods)
- [ ] "guarantees" / "ensures" / "always" / "never"
- [ ] "impossible" / "cannot" / "must"
- [ ] "polynomial" / "exponential" / "optimal"
- [ ] "proves" / "verified" / "sound" / "complete"

### Domain Markers (check box = domain detected)
- [ ] QUANTUM: qubit, superposition, annealing, quantum advantage, QPU
- [ ] DISTRIBUTED: consensus, partition, CAP, FLP, replication, availability
- [ ] CRYPTO: encrypt, PFS, ZK, signature, hash, cipher
- [ ] PL-THEORY: type system, inference, termination, soundness, dependent types
- [ ] SECURITY: auth, permission, token, password, injection, vulnerability
- [ ] MECHANISM: incentive, game theory, auction, voting, mechanism design
```

### Step 1.3: Determine Domains and Complexity

**Domain Detection Rule:** If ANY marker in a domain category is found → that domain is detected.

**Complexity Calculation:**
- Count checked Guarantee Markers: [N]
- Count detected Domains: [M]
- **Complexity = LOW** if N=0 and M≤1
- **Complexity = MEDIUM** if N=1-2 or M=2
- **Complexity = HIGH** if N≥3 or M≥3

```markdown
## Profile Summary

| Property | Value |
|----------|-------|
| Type | [type] |
| Size | [size] |
| Guarantee markers found | [N] |
| Domains detected | [list from checked boxes] |
| Complexity | [LOW/MEDIUM/HIGH per rules above] |
```

---

## Phase 2: SELECT (2 min)

**Goal:** Select methods based on profile.

### Step 2.1: Selection Algorithm

```
ALGORITHM SelectMethods(profile):

  selected = []

  # 1. ALWAYS add CORE methods
  selected.add("consistency", "methods/core/consistency.md")
  selected.add("completeness", "methods/core/completeness.md")
  selected.add("scope-alignment", "methods/core/scope-alignment.md")

  # 2. Add CONDITIONAL methods based on markers
  FOR each method in catalog.conditional:
    FOR each marker in method.apply_when.markers:
      IF artifact_text.lower() CONTAINS marker.lower():
        selected.add(method)
        BREAK  # One match is enough

  # 3. Add CONDITIONAL methods based on domain
  FOR each method in catalog.conditional:
    IF method.apply_when.domains INTERSECTS profile.domains:
      selected.add(method)  # May already be added, that's OK

  # 4. Challenge methods are added LATER in Phase 3.5 (after findings)

  RETURN selected (deduplicated)
```

### Step 2.2: Apply Algorithm

```markdown
## Method Selection

### CORE Methods (always)
| Method | File |
|--------|------|
| Consistency Check | methods/core/consistency.md |
| Completeness Check | methods/core/completeness.md |
| Scope Alignment | methods/core/scope-alignment.md |

### CONDITIONAL Methods (marker/domain match)

For each method in catalog, check if artifact contains any of its markers OR if domains overlap:

| Method | Markers Found? | Domain Match? | Selected? | File |
|--------|----------------|---------------|-----------|------|
| Impossibility Check | [YES/NO: which marker] | [YES/NO: which domain] | [YES/NO] | methods/theory/impossibility-check.md |
| Contradiction Detector | [YES/NO] | [YES/NO] | [YES/NO] | methods/theory/contradiction-detector.md |
| Term Verifier | [YES/NO] | [YES/NO] | [YES/NO] | methods/theory/term-verifier.md |
| Quantum Claims | [YES/NO] | [YES/NO] | [YES/NO] | methods/domain/quantum-claims.md |
| Distributed Claims | [YES/NO] | [YES/NO] | [YES/NO] | methods/domain/distributed-claims.md |
| Security Check | [YES/NO] | [YES/NO] | [YES/NO] | methods/domain/security-check.md |
| PL Theory Check | [YES/NO] | [YES/NO] | [YES/NO] | methods/domain/pl-theory-check.md |

### Final Selection (ordered: CORE first, then CONDITIONAL)
1. [method] - [file]
2. [method] - [file]
...
```

---

## Phase 3: EXECUTE (15-45 min)

**Goal:** Apply each selected method and collect findings.

### Step 3.1: For Each Method

```markdown
## Method: [Name]
**File:** [path]

[Read the method file and follow its procedure exactly]

### Output
[Use output format from method file]

### Findings from this method
| ID | Severity | Description | Evidence |
|----|----------|-------------|----------|
| [M-1] | [CRITICAL/IMPORTANT/MINOR] | [what's wrong] | "[quote]" line X |
```

### Step 3.2: Consolidate Findings

After all methods executed:

```markdown
## All Findings (before challenge)

| ID | Source Method | Severity | Description |
|----|---------------|----------|-------------|
| F1 | [method] | CRITICAL | [desc] |
| F2 | [method] | IMPORTANT | [desc] |
| F3 | [method] | MINOR | [desc] |

**CRITICAL findings count:** [N]
```

---

## Phase 3.5: CHALLENGE (if CRITICAL findings exist)

**Goal:** Stress-test critical findings with challenge methods.

**Trigger:** Execute this phase ONLY if there are CRITICAL findings from Phase 3.

### Step 3.5.1: Select Challenge Methods

```markdown
## Challenge Methods

CRITICAL findings found: [N]

IF N > 0:
  - [ ] Apply: Contraposition Check (methods/challenge/contraposition.md)
  - [ ] Apply: Counterexample Construction (methods/challenge/counterexample.md)
ELSE:
  Skip to Phase 4.
```

### Step 3.5.2: Execute Challenge Methods

For each CRITICAL finding, apply challenge methods to verify it's real.

```markdown
## Challenge: [Finding ID]

### Contraposition Check
[Follow procedure from methods/challenge/contraposition.md]
Result: CONFIRMED / WEAKENED / REFUTED

### Counterexample Construction
[Follow procedure from methods/challenge/counterexample.md]
Result: CONSTRUCTED / FAILED TO CONSTRUCT
```

### Step 3.5.3: Update Findings

```markdown
## Findings After Challenge

| ID | Original Severity | After Challenge | Notes |
|----|-------------------|-----------------|-------|
| F1 | CRITICAL | CONFIRMED/DOWNGRADED | [notes] |
```

---

## Phase 4: REPORT (5 min)

**Goal:** Present findings clearly.

```markdown
# Verification Report

## Summary
| Metric | Value |
|--------|-------|
| Artifact | [name] |
| Methods applied | [N] |
| Findings | [N] total |
| Critical | [N] |
| Important | [N] |
| Minor | [N] |

## Critical Findings (must fix)

### F1: [Title]
- **What:** [description]
- **Where:** [location in artifact]
- **Evidence:** "[exact quote]"
- **Why critical:** [explanation]

## Important Findings (should fix)

### F2: [Title]
- **What:** [description]
- **Where:** [location]
- **Evidence:** "[quote]"

## Minor Findings (consider fixing)

### F3: [Title]
...

## Recommendations
1. [Priority 1 action]
2. [Priority 2 action]
...
```

---

## Quick Reference

### Method Selection Summary

| Condition | Methods | Files |
|-----------|---------|-------|
| **ALWAYS** | Consistency, Completeness, Scope | `methods/core/*.md` |
| Guarantee markers found | Impossibility, Contradiction, Term Verifier | `methods/theory/*.md` |
| Domain: QUANTUM | Quantum Claims | `methods/domain/quantum-claims.md` |
| Domain: DISTRIBUTED | Distributed Claims | `methods/domain/distributed-claims.md` |
| Domain: SECURITY/CRYPTO | Security Check | `methods/domain/security-check.md` |
| Domain: PL-THEORY | PL Theory Check | `methods/domain/pl-theory-check.md` |
| **After CRITICAL findings** | Contraposition, Counterexample | `methods/challenge/*.md` |

### Domain Detection (from Phase 1.2 markers)

| If you find... | Domain is... |
|----------------|--------------|
| qubit, superposition, annealing, QPU | QUANTUM |
| consensus, partition, CAP, FLP | DISTRIBUTED |
| encrypt, PFS, ZK, cipher | CRYPTO |
| auth, token, password, injection | SECURITY |
| type system, inference, termination | PL-THEORY |
| incentive, game theory, auction | MECHANISM |

### Severity Guide

| Severity | Meaning | Action |
|----------|---------|--------|
| CRITICAL | Fundamental flaw, blocks use | Must fix before use |
| IMPORTANT | Significant issue | Should fix |
| MINOR | Small problem or improvement | Consider fixing |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 9.0 | 2026-01-18 | Simplified workflow, self-contained methods |
