# MC-071: First Principles Analysis

**Category**: core
**Source**: methods.csv #71
**Token Cost**: ~2-3K tokens
**Complexity**: MEDIUM

---

## Purpose

Strip away assumptions to rebuild understanding from fundamental truths. Use when you need to break free from inherited thinking and find novel solutions or identify hidden flaws.

---

## When to Use

### Trigger Conditions
- Artifact makes strong claims ("guarantees", "ensures", "always")
- Solution seems complex but problem seems simple
- You suspect inherited assumptions are wrong
- Need to understand WHY something is the way it is

### Do NOT Use When
- Simple, well-understood domain
- Time-critical analysis (this method is thorough)
- Artifact is purely descriptive with no claims

---

## Execution Steps

### Step 1: List All Assumptions

**Input**: The artifact or claim to analyze
**Action**: Write down EVERYTHING that is assumed to be true. Include:
- Explicit assumptions (stated in artifact)
- Implicit assumptions (not stated but required)
- Inherited assumptions (from domain, convention, prior work)

**Output**: Numbered list of assumptions

```markdown
### Assumptions Inventory
| # | Assumption | Type | Source |
|---|------------|------|--------|
| 1 | {assumption} | explicit/implicit/inherited | {where from} |
```

### Step 2: Challenge Each Assumption

**Input**: Assumptions list from Step 1
**Action**: For each assumption, ask:
- Is this ACTUALLY true? Evidence?
- Is this NECESSARILY true? Or just convenient?
- What if this were FALSE?

**Output**: Validity assessment

```markdown
### Assumption Validity
| # | Assumption | Actually True? | Evidence | If False? |
|---|------------|----------------|----------|-----------|
| 1 | {assumption} | YES/NO/UNCERTAIN | {evidence} | {consequence} |
```

### Step 3: Identify Fundamental Truths

**Input**: Challenged assumptions from Step 2
**Action**: From remaining valid assumptions, identify:
- Which are FUNDAMENTAL (cannot be reduced further)?
- Which are DERIVED (follow from others)?

**Output**: Truth hierarchy

```markdown
### Fundamental Truths
1. {truth 1} - FUNDAMENTAL because: {reason}
2. {truth 2} - DERIVED from: {source}
```

### Step 4: Rebuild Understanding

**Input**: Fundamental truths from Step 3
**Action**: Starting ONLY from fundamental truths, rebuild:
- What MUST be true given fundamentals?
- What CANNOT be true given fundamentals?
- Does the artifact's claim follow from fundamentals?

**Output**: Rebuilt conclusion

```markdown
### Rebuilt Understanding
Starting from fundamentals:
1. {fundamental 1}
2. {fundamental 2}

Therefore:
- MUST be true: {X}
- CANNOT be true: {Y}
- Artifact claims: {Z}
- Verdict: {VALID/INVALID/UNCERTAIN}
```

---

## Output Template

```markdown
## First Principles Analysis

### Artifact/Claim Analyzed
"{quote or summary}"

### Assumptions Inventory
| # | Assumption | Type | Source |
|---|------------|------|--------|
| 1 | | | |

### Assumption Validity
| # | Actually True? | Evidence | If False? |
|---|----------------|----------|-----------|
| 1 | | | |

### Fundamental Truths
1. {truth} - FUNDAMENTAL because: {reason}

### Rebuilt Understanding
From fundamentals → {conclusion}

### Finding
**Verdict**: {VALID | INVALID | PARTIALLY VALID}
**Issue**: {if invalid, what's wrong}
**Root Cause**: {which assumption was wrong}
```

---

## Examples

### Example 1: "System guarantees 99.99% uptime"

**Assumptions Inventory**:
| # | Assumption | Type | Source |
|---|------------|------|--------|
| 1 | Hardware never fails | implicit | claim logic |
| 2 | Network always available | implicit | claim logic |
| 3 | Redundancy exists | implicit | "guarantee" language |
| 4 | Monitoring detects failures | implicit | recovery assumption |

**Validity Check**:
| # | Actually True? | Evidence | If False? |
|---|----------------|----------|-----------|
| 1 | NO | Hardware fails ~1%/year | Uptime impossible without redundancy |
| 2 | NO | Network partitions occur | Need partition handling |
| 3 | UNCERTAIN | Not specified | Critical if missing |
| 4 | UNCERTAIN | Not specified | Failures undetected |

**Fundamental Truths**:
1. Hardware CAN fail - FUNDAMENTAL (physics)
2. Networks CAN partition - FUNDAMENTAL (distributed systems)
3. 99.99% requires <52 min downtime/year - FUNDAMENTAL (math)

**Rebuilt**:
- MUST have: redundancy, failover, monitoring
- CANNOT guarantee without: documented redundancy strategy
- Artifact claims 99.99% without specifying redundancy
- **Verdict**: INVALID - missing required elements

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Accepting domain conventions | Conventions may be wrong | Challenge everything |
| Stopping at explicit assumptions | Implicit ones often matter more | Ask "what else must be true?" |
| Not rebuilding from scratch | May miss that conclusion doesn't follow | Always do Step 4 |

---

## Related Methods

- #72 5 Whys - Use AFTER First Principles if you find an invalid assumption
- #78 Assumption Excavation - More structured assumption discovery
- #80 Inversion - Complement by asking what guarantees FAILURE

---

## Quality Checks

Before finalizing output, verify:
- [ ] Listed at least 5 assumptions (most claims have many)
- [ ] Challenged EVERY assumption, not just obvious ones
- [ ] Identified at least 2 fundamental truths
- [ ] Rebuilt conclusion follows ONLY from fundamentals
- [ ] Verdict is justified by the analysis
