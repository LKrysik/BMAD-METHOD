# MC-128: Theseus Paradox

**Category**: challenge
**Source**: methods.csv #128
**Token Cost**: ~1-2K tokens
**Complexity**: MEDIUM

---

## Purpose

Verify that the CORE of the solution addresses the CORE of the problem. Detects when a solution solves an adjacent or surface problem while missing the fundamental issue.

---

## When to Use

### Trigger Conditions
- Complex solution to a stated problem
- Suspicion of "solving the wrong problem"
- Solution seems elaborate for a "simple" problem
- Checking if solution truly matches need

### Do NOT Use When
- Problem and solution are trivially simple
- Solution is explicitly partial/incremental

---

## Execution Steps

### Step 1: Identify Problem Core

**Input**: The problem statement
**Action**: Strip away surface details to find the FUNDAMENTAL problem:
- What is the ESSENTIAL issue?
- If you could only fix ONE thing, what would it be?
- What would remain a problem even if all details were addressed?

**Output**: Problem core identification

```markdown
### Problem Analysis

**Surface Problem** (as stated):
"{original problem statement}"

**Problem Layers**:
| Layer | Description |
|-------|-------------|
| Surface | {immediate symptoms} |
| Intermediate | {underlying causes} |
| Core | {fundamental issue} |

**PROBLEM CORE**:
"{one sentence stating the fundamental problem}"
```

### Step 2: Identify Solution Core

**Input**: The solution/artifact
**Action**: Strip away implementation details to find the ESSENTIAL mechanism:
- What is the KEY thing this solution does?
- Remove all "nice to have" - what remains?
- What's the mechanism that actually solves something?

**Output**: Solution core identification

```markdown
### Solution Analysis

**Full Solution** (as provided):
"{solution summary}"

**Solution Layers**:
| Layer | Description |
|-------|-------------|
| Surface | {implementation details} |
| Intermediate | {mechanisms} |
| Core | {essential fix} |

**SOLUTION CORE**:
"{one sentence stating what solution fundamentally does}"
```

### Step 3: Check Alignment

**Input**: Problem core + Solution core
**Action**: Compare the two cores:
- Does solution core DIRECTLY address problem core?
- Or does it address a different/adjacent/surface problem?
- Is there a GAP between what's needed and what's provided?

**Output**: Alignment assessment

```markdown
### Core Alignment Check

**Problem Core**: {problem}
**Solution Core**: {solution}

**Alignment Analysis**:
| Question | Answer | Evidence |
|----------|--------|----------|
| Does solution address problem directly? | YES/NO | {evidence} |
| Does solution address ONLY surface? | YES/NO | {evidence} |
| Does solution address ADJACENT problem? | YES/NO | {evidence} |
| Is there a gap? | YES/NO | {evidence} |

**Alignment**: DIRECT / INDIRECT / MISALIGNED
```

### Step 4: Assess Gap (if misaligned)

**Input**: Misaligned cores
**Action**: If cores don't align:
- What's the actual gap?
- What would direct alignment look like?
- Is the misalignment intentional or accidental?

**Output**: Gap analysis

```markdown
### Gap Analysis

**Gap Description**:
Solution addresses: {what}
Problem requires: {what}
Gap: {difference}

**Would Direct Solution Look Like**:
{what would actually address the core}

**Misalignment Type**: INTENTIONAL / ACCIDENTAL
**Impact**: {consequence of gap}
```

---

## Output Template

```markdown
## Theseus Paradox Analysis

### Problem Core
"{fundamental problem in one sentence}"

### Solution Core
"{essential solution mechanism in one sentence}"

### Alignment Assessment
| Aspect | Status |
|--------|--------|
| Direct alignment | YES/NO |
| Addresses surface only | YES/NO |
| Addresses adjacent problem | YES/NO |

**Verdict**: ALIGNED / PARTIALLY ALIGNED / MISALIGNED

### Gap (if any)
{description of what's missing}

### Recommendations
{what to change for better alignment}

### Findings
| ID | Severity | Finding |
|----|----------|---------|
| F1 | 🔴/🟠 | {solution core doesn't address problem core} |
```

---

## Examples

### Example 1: Performance Problem

**Problem stated**: "Application is slow"

**Problem Layers**:
| Layer | Description |
|-------|-------------|
| Surface | Slow page loads |
| Intermediate | Database queries take too long |
| **Core** | **Missing indexes on frequently-queried tables** |

**Solution provided**: "Add caching layer"

**Solution Layers**:
| Layer | Description |
|-------|-------------|
| Surface | Redis cache implementation |
| Intermediate | Cache frequently accessed data |
| **Core** | **Avoid hitting database for repeated requests** |

**Alignment Check**:
- Problem core: Missing indexes
- Solution core: Avoid database hits

**Verdict**: MISALIGNED
- Solution masks the problem (fewer DB hits)
- Doesn't fix the problem (indexes still missing)
- When cache misses, problem returns

**Finding**: Solution addresses symptom (slow queries) but not cause (missing indexes). Add indexes first, then cache if still needed.

---

### Example 2: Security Vulnerability

**Problem stated**: "Users can access other users' data"

**Problem Layers**:
| Layer | Description |
|-------|-------------|
| Surface | Unauthorized data access |
| Intermediate | Missing authorization checks |
| **Core** | **No access control model defined** |

**Solution provided**: "Add if-check for user_id"

**Solution Layers**:
| Layer | Description |
|-------|-------------|
| Surface | Code fix in one endpoint |
| Intermediate | Check user_id matches |
| **Core** | **Single-point authorization check** |

**Alignment Check**:
- Problem core: No access control MODEL
- Solution core: Single check in ONE place

**Verdict**: PARTIALLY ALIGNED
- Fixes immediate issue
- But problem will recur (no systematic model)
- Other endpoints may have same issue

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Stopping at surface | Miss fundamental issue | Ask "why?" until core |
| Accepting elaborate solutions | May hide misalignment | Simplify to core |
| Not comparing cores directly | Miss the gap | Explicit comparison |
| Assuming alignment | May be wishful thinking | Verify with evidence |

---

## Related Methods

- #71 First Principles - Help find problem core
- #72 5 Whys - Another way to find core
- #106 Plato's Cave Inversion - Similar concept

---

## Quality Checks

Before finalizing output, verify:
- [ ] Problem core is truly FUNDAMENTAL (can't go deeper)
- [ ] Solution core is truly ESSENTIAL (removed all extras)
- [ ] Cores stated in one clear sentence each
- [ ] Alignment explicitly checked with evidence
- [ ] If misaligned, gap is clearly described
