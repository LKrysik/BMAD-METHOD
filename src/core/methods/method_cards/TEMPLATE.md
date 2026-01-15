# Method Card Template

Use this template to create new Method Cards. Each card should be:
- Self-contained (agent can execute without external references)
- Step-by-step (clear sequence of actions)
- Concrete (specific outputs, not vague instructions)
- Bounded (estimated token cost, clear stopping point)

---

## File Naming Convention

`MC-{number}-{short-name}.md`

Example: `MC-071-first-principles.md`

---

## Template

```markdown
# MC-{NUMBER}: {Method Name}

**Category**: {category from methods.csv}
**Source**: methods.csv #{number}
**Token Cost**: ~{N}K tokens
**Complexity**: LOW | MEDIUM | HIGH

---

## Purpose

{One sentence describing what this method does and why it's useful}

---

## When to Use

### Trigger Conditions
- {Condition 1 - specific feature or situation}
- {Condition 2}
- {Condition 3}

### Do NOT Use When
- {Anti-condition 1}
- {Anti-condition 2}

---

## Execution Steps

### Step 1: {Action Name}

**Input**: {What you need before this step}
**Action**: {What to do - be specific}
**Output**: {What to produce}

```
{Output template if applicable}
```

### Step 2: {Action Name}

**Input**: {From Step 1 or other source}
**Action**: {What to do}
**Output**: {What to produce}

### Step 3: {Action Name}
...

---

## Output Template

```markdown
## {Method Name} Analysis

### {Section 1}
{template}

### {Section 2}
{template}

### Verdict
{verdict template}
```

---

## Examples

### Example 1: {Scenario Name}

**Input**: {Sample input}

**Execution**:
1. {What was done in Step 1}
2. {What was done in Step 2}
...

**Output**:
{Sample output}

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| {mistake 1} | {reason} | {prevention} |
| {mistake 2} | {reason} | {prevention} |

---

## Related Methods

- #{N} {Name} - {when to use instead or together}
- #{N} {Name} - {relationship}

---

## Quality Checks

Before finalizing output, verify:
- [ ] {Check 1}
- [ ] {Check 2}
- [ ] {Check 3}
```

---

## Card Quality Criteria

A good Method Card:

1. **Executable**: Agent can follow steps without guessing
2. **Bounded**: Clear start, clear end, estimated cost
3. **Concrete**: Specific outputs, not "analyze" or "consider"
4. **Testable**: Can verify if steps were followed correctly
5. **Complete**: No implicit knowledge required
