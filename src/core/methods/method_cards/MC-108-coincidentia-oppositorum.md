# MC-108: Coincidentia Oppositorum

**Category**: exploration
**Source**: methods.csv #108
**Token Cost**: ~2-3K tokens
**Complexity**: HIGH

---

## Purpose

Find seemingly contradictory requirements and determine if they can be synthesized at a higher level OR if they are definitionally impossible to satisfy together. Critical for catching hidden conflicts.

---

## When to Use

### Trigger Conditions
- Artifact claims "both X and Y" where X, Y might conflict
- Multiple "guarantees" that seem incompatible
- Trade-off language ("while also", "simultaneously")
- Domain where trade-offs are fundamental (security, distributed systems)

### Do NOT Use When
- Requirements are clearly independent
- No claims of achieving multiple properties
- Simple, single-purpose artifact

---

## Execution Steps

### Step 1: Identify Potential Opposites

**Input**: The artifact
**Action**: Find pairs of claims that MIGHT conflict:
- "Both A and B" statements
- "Guarantees X while also Y"
- Properties typically in tension
- Claims that seem "too good to be true"

**Output**: Candidate pairs

```markdown
### Potential Opposing Claims
| Pair | Claim A | Claim B | Why Might Conflict |
|------|---------|---------|-------------------|
| P1 | "{claim A}" | "{claim B}" | {initial suspicion} |
| P2 | | | |
```

### Step 2: Expand Definitions

**Input**: Each claim pair
**Action**: For each claim, expand its definition:
- MEANS: What does this literally mean?
- IMPLIES: What must be true if this is satisfied?
- EXCLUDES: What CANNOT be true if this is satisfied?

**Output**: Definition expansion

```markdown
### Definition Expansion: Pair P1

**Claim A: "{claim A}"**
| Aspect | Content |
|--------|---------|
| MEANS | {literal meaning} |
| IMPLIES | {what follows logically} |
| EXCLUDES | {what's incompatible} |

**Claim B: "{claim B}"**
| Aspect | Content |
|--------|---------|
| MEANS | {literal meaning} |
| IMPLIES | {what follows logically} |
| EXCLUDES | {what's incompatible} |
```

### Step 3: Check for Overlap

**Input**: Expanded definitions
**Action**: Check for conflicts:
- Does A.EXCLUDES overlap with B.MEANS?
- Does A.EXCLUDES overlap with B.IMPLIES?
- Does B.EXCLUDES overlap with A.MEANS?
- Does B.EXCLUDES overlap with A.IMPLIES?

**Output**: Overlap analysis

```markdown
### Overlap Check: Pair P1
| Check | A.EXCLUDES | B.MEANS/IMPLIES | Overlap? |
|-------|------------|-----------------|----------|
| 1 | {what A excludes} | {what B means} | YES/NO |
| 2 | {what A excludes} | {what B implies} | YES/NO |
| 3 | {what B excludes} | {what A means} | YES/NO |
| 4 | {what B excludes} | {what A implies} | YES/NO |

**Conflict Detected**: YES/NO
```

### Step 4: Attempt Synthesis (if conflict)

**Input**: Conflicting pair
**Action**: Try to find higher-level resolution:
- Is there a constraint that makes both possible?
- Is there a scope where both apply?
- Is there a compromise that partially satisfies both?

If synthesis fails, classify as DEFINITIONAL IMPOSSIBILITY.

**Output**: Synthesis attempt

```markdown
### Synthesis Attempt: Pair P1

**Option 1**: {attempted synthesis}
- Satisfies A? YES/NO
- Satisfies B? YES/NO
- Verdict: WORKS/FAILS

**Option 2**: {attempted synthesis}
- Satisfies A? YES/NO
- Satisfies B? YES/NO
- Verdict: WORKS/FAILS

**Final Verdict**:
- SYNTHESIZABLE: {synthesis found}
- TRADE-OFF: {partial satisfaction possible}
- IMPOSSIBLE: {definitionally cannot both be true}
```

---

## Output Template

```markdown
## Coincidentia Oppositorum Analysis

### Opposing Pairs Identified
{N} potential conflicts found

### Pair Analysis

#### Pair 1: {Claim A} vs {Claim B}

**Definition Expansion**:
| Claim | MEANS | IMPLIES | EXCLUDES |
|-------|-------|---------|----------|
| A | {X} | {Y} | {Z} |
| B | {X} | {Y} | {Z} |

**Conflict Check**:
- A.EXCLUDES ∩ B.MEANS: {overlap or none}
- B.EXCLUDES ∩ A.MEANS: {overlap or none}

**Verdict**: {COMPATIBLE / TRADE-OFF / IMPOSSIBLE}

### Summary
| Pair | Claims | Verdict | Finding |
|------|--------|---------|---------|
| P1 | A vs B | IMPOSSIBLE | 🔴 CRITICAL |
| P2 | C vs D | TRADE-OFF | 🟠 IMPORTANT |

### Findings
| ID | Severity | Finding |
|----|----------|---------|
| F1 | 🔴 | {claims} are definitionally impossible |
```

---

## Examples

### Example 1: "System provides PFS and key recovery"

**Claims**:
- A: "Perfect Forward Secrecy (PFS)"
- B: "Key recovery for compliance"

**Definition Expansion**:

| Claim | MEANS | IMPLIES | EXCLUDES |
|-------|-------|---------|----------|
| PFS | Past sessions unreadable even if current key compromised | Each session has unique ephemeral key | Any mechanism to read past sessions |
| Recovery | Can recover access to past communications | Past sessions must be readable | Mechanisms that make past sessions unreadable |

**Conflict Check**:
- PFS.EXCLUDES = "any mechanism to read past"
- Recovery.MEANS = "past sessions readable"
- **OVERLAP**: YES - Recovery requires exactly what PFS excludes

**Synthesis Attempt**:
- Option 1: "Recover only future sessions" → Fails B (need past)
- Option 2: "Store session keys separately" → Fails A (not PFS if keys stored)
- Option 3: "Use escrow for subset" → Trade-off (partial PFS, partial recovery)

**Verdict**: IMPOSSIBLE as stated (full PFS + full recovery cannot coexist)

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Shallow definitions | Miss hidden exclusions | Expand fully - MEANS/IMPLIES/EXCLUDES |
| Assuming compatibility | May miss conflicts | Check ALL overlap combinations |
| Giving up too early on synthesis | Miss valid solutions | Try 3+ synthesis options |
| Not using domain knowledge | Miss known impossibilities | Check domain-knowledge-base.md |

---

## Related Methods

- #154 Definitional Contradiction - More formal approach
- #160 Compatibility Proof Demand - Require proof of compatibility
- #104 Heisenberg Trade-off - Force acknowledgment of trade-offs

---

## Quality Checks

Before finalizing output, verify:
- [ ] All "both X and Y" claims identified
- [ ] Definitions expanded with MEANS/IMPLIES/EXCLUDES
- [ ] All 4 overlap combinations checked
- [ ] At least 2 synthesis attempts for each conflict
- [ ] Domain knowledge consulted for theoretical impossibilities
