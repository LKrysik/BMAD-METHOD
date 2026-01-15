# MC-122: Sorites Paradox

**Category**: challenge
**Source**: methods.csv #122
**Token Cost**: ~1-2K tokens
**Complexity**: MEDIUM

---

## Purpose

Remove elements one by one to find which single element is CRITICAL to the solution. If removing one element destroys the solution, that element deserves most attention and verification.

---

## When to Use

### Trigger Conditions
- Complex solution with many components
- Need to prioritize verification effort
- Want to find single points of failure
- Understanding which parts are essential vs optional

### Do NOT Use When
- Simple solution with 1-2 components
- All components obviously required
- Time doesn't permit systematic removal

---

## Execution Steps

### Step 1: List All Elements

**Input**: The solution/artifact
**Action**: Enumerate all distinct components:
- Features, functions, modules
- Steps in a process
- Requirements in a spec
- Assumptions in an argument

**Output**: Element inventory

```markdown
### Solution Elements
| # | Element | Type | Description |
|---|---------|------|-------------|
| E1 | {element} | feature/step/requirement | {brief description} |
| E2 | | | |
| E3 | | | |
```

### Step 2: Remove Each Element

**Input**: Element list
**Action**: For each element, hypothetically remove it:
- Does the solution still work?
- Does it still meet the goal?
- Is the outcome still acceptable?

Classify result:
- SURVIVES: Solution works without this element
- DEGRADES: Solution works but worse
- FAILS: Solution doesn't work without this element

**Output**: Removal test

```markdown
### Removal Test
| Element | Removed | Solution Status | Why |
|---------|---------|-----------------|-----|
| E1 | YES | SURVIVES | {explanation} |
| E2 | YES | DEGRADES | {what gets worse} |
| E3 | YES | FAILS | {why it breaks} |
```

### Step 3: Identify Critical Elements

**Input**: Removal test results
**Action**: Elements where removal = FAILS are CRITICAL
- These are single points of failure
- They deserve most verification attention
- Their failure means complete solution failure

**Output**: Critical element list

```markdown
### Critical Elements
| Element | Why Critical | Verification Priority |
|---------|--------------|----------------------|
| E3 | {why removal fails} | 🔴 HIGHEST |
| E7 | {why removal fails} | 🔴 HIGHEST |
```

### Step 4: Analyze Critical Elements

**Input**: Critical elements
**Action**: For each critical element:
- Is it well-specified?
- Is it well-tested?
- Is there a backup/alternative?
- What's the failure mode?

**Output**: Risk analysis

```markdown
### Critical Element Analysis
| Element | Specification | Testing | Backup | Failure Mode |
|---------|---------------|---------|--------|--------------|
| E3 | CLEAR/VAGUE | TESTED/UNTESTED | YES/NO | {what happens} |
```

---

## Output Template

```markdown
## Sorites Paradox Analysis

### Elements Analyzed
{N} elements tested for criticality

### Removal Test Summary
| Status | Count | Elements |
|--------|-------|----------|
| SURVIVES | {N} | E1, E4, E5 |
| DEGRADES | {N} | E2, E6 |
| FAILS | {N} | E3, E7 |

### Critical Elements (Removal = FAILS)
| Element | Why Critical | Risk Level |
|---------|--------------|------------|
| E3 | {reason} | 🔴 HIGH |
| E7 | {reason} | 🔴 HIGH |

### Recommendations
1. **Verify first**: {critical elements}
2. **Add redundancy for**: {critical without backup}
3. **Deprioritize**: {elements that survive removal}

### Findings
| ID | Severity | Finding |
|----|----------|---------|
| F1 | 🔴 | {element} is critical but poorly specified |
| F2 | 🟠 | {element} is critical without backup |
```

---

## Examples

### Example 1: Authentication System

**Elements**:
| # | Element |
|---|---------|
| E1 | Password validation |
| E2 | Rate limiting |
| E3 | Session management |
| E4 | Audit logging |
| E5 | Remember me feature |

**Removal Test**:
| Element | Status | Why |
|---------|--------|-----|
| E1 | FAILS | Can't authenticate without password check |
| E2 | DEGRADES | Vulnerable to brute force |
| E3 | FAILS | Can't maintain login state |
| E4 | SURVIVES | Nice to have, not essential |
| E5 | SURVIVES | Convenience feature |

**Critical Elements**: E1 (Password), E3 (Session)

**Finding**: Session management (E3) is critical but implementation details are vague in spec.

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Missing hidden elements | Incomplete analysis | Include assumptions too |
| Only testing obvious ones | Miss subtle criticals | Test EVERY element |
| Not considering combinations | Two elements together critical | Note dependencies |
| Confusing DEGRADES with FAILS | Over/under prioritization | Clear criteria |

---

## Related Methods

- #68 Critical Path Severance - Similar concept for flows
- #66 Dependency Risk Mapping - Broader dependency view
- #130 Assumption Torture - Test assumptions similarly

---

## Quality Checks

Before finalizing output, verify:
- [ ] ALL elements listed (not just obvious ones)
- [ ] Each element tested for removal
- [ ] FAILS vs DEGRADES clearly distinguished
- [ ] Critical elements have risk analysis
- [ ] Recommendations follow from analysis
