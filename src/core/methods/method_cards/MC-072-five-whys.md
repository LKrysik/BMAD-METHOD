# MC-072: 5 Whys Deep Dive

**Category**: core
**Source**: methods.csv #72
**Token Cost**: ~1-2K tokens
**Complexity**: LOW

---

## Purpose

Drill down to root causes by repeatedly asking "why" until you reach the fundamental reason. Simple but powerful for understanding failures and finding real solutions.

---

## When to Use

### Trigger Conditions
- You found a problem but don't know the cause
- Surface fix keeps failing (symptom vs cause)
- Need to understand chain of causation
- Want to prevent recurrence, not just patch

### Do NOT Use When
- Problem is already well-understood
- Multiple independent causes (use Fishbone instead)
- Looking for alternatives (use Tree of Thoughts)

---

## Execution Steps

### Step 1: State the Problem Clearly

**Input**: The issue or finding to analyze
**Action**: Write a clear, specific problem statement. Avoid:
- Vague statements ("it's broken")
- Embedded solutions ("we need more X")
- Compound problems (split them first)

**Output**: Single problem statement

```markdown
### Problem Statement
**Issue**: {specific, observable problem}
**Observed where**: {location in artifact}
**Impact**: {why this matters}
```

### Step 2: Ask "Why?" - Level 1

**Input**: Problem statement
**Action**: Ask "Why does this problem exist?"
- Look for DIRECT cause, not distant one
- May have multiple answers - pick most significant
- Must be factual, not speculative

**Output**: First-level cause

```markdown
### Why 1
**Q**: Why does {problem} exist?
**A**: Because {direct cause}
**Evidence**: {what shows this is true}
```

### Step 3: Ask "Why?" - Levels 2-5

**Input**: Previous answer
**Action**: For each level, ask "Why?" about the previous answer
- Stop when you reach something actionable or fundamental
- Usually 5 levels, but may be 3-7 depending on problem
- Watch for loops (cause A → B → A)

**Output**: Chain of causes

```markdown
### Why 2
**Q**: Why {previous answer}?
**A**: Because {cause}
**Evidence**: {proof}

### Why 3
**Q**: Why {previous answer}?
**A**: Because {cause}
**Evidence**: {proof}

### Why 4
**Q**: Why {previous answer}?
**A**: Because {cause}
**Evidence**: {proof}

### Why 5 (Root Cause)
**Q**: Why {previous answer}?
**A**: Because {root cause}
**Evidence**: {proof}
**This is ROOT because**: {why we stop here}
```

### Step 4: Verify Root Cause

**Input**: Identified root cause
**Action**: Check that root cause is valid:
- Is it actionable? (Can we change it?)
- Is it fundamental? (Asking "why" again gives no new insight)
- Does fixing it prevent the problem? (Not just mask it)

**Output**: Verification

```markdown
### Root Cause Verification
- Actionable: YES/NO - {explanation}
- Fundamental: YES/NO - {explanation}
- Fixing prevents problem: YES/NO - {explanation}
- **Verified**: YES/NO
```

---

## Output Template

```markdown
## 5 Whys Analysis

### Problem
{clear problem statement}

### Causal Chain
| Level | Question | Answer | Evidence |
|-------|----------|--------|----------|
| Why 1 | Why {problem}? | {cause 1} | {evidence} |
| Why 2 | Why {cause 1}? | {cause 2} | {evidence} |
| Why 3 | Why {cause 2}? | {cause 3} | {evidence} |
| Why 4 | Why {cause 3}? | {cause 4} | {evidence} |
| Why 5 | Why {cause 4}? | **{root cause}** | {evidence} |

### Root Cause
**Statement**: {root cause}
**Actionable**: YES/NO
**Prevents recurrence**: YES/NO

### Recommended Fix
{fix that addresses ROOT CAUSE, not symptoms}
```

---

## Examples

### Example 1: "Method selection chooses wrong methods"

| Level | Question | Answer | Evidence |
|-------|----------|--------|----------|
| Why 1 | Why wrong methods? | RELEVANCE score incorrect | Observed mismatch |
| Why 2 | Why score incorrect? | domain_match() returns wrong values | Debug trace |
| Why 3 | Why wrong values? | Function not implemented | Code inspection |
| Why 4 | Why not implemented? | Was marked TODO | Source file |
| Why 5 | Why TODO? | **Rushed release without implementation** | Commit history |

**Root Cause**: Rushed release without completing implementation
**Fix**: Implement domain_match() before release (not just document it)

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Stopping too early | Fixes symptom, not cause | Ask "can we ask why again?" |
| Blaming people | Not actionable | Focus on process/system |
| Skipping evidence | Speculation, not analysis | Require evidence each level |
| Multiple answers per level | Loses focus | Pick most significant, note others |

---

## Related Methods

- #71 First Principles - Use when assumptions need challenging
- #61 Pre-mortem - Use to PREVENT problems before they occur
- #109 Contraposition - Alternative angle on causation

---

## Quality Checks

Before finalizing output, verify:
- [ ] Problem statement is specific and observable
- [ ] Each "why" has evidence, not speculation
- [ ] Root cause is actionable (we can change it)
- [ ] Fixing root cause would prevent problem (not just hide it)
- [ ] Didn't stop at blame ("because X is incompetent")
