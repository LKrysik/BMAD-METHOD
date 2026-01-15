# MC-088: Executability Check

**Category**: sanity
**Source**: methods.csv #88
**Token Cost**: ~1-2K tokens
**Complexity**: LOW

---

## Purpose

Verify that each instruction in the artifact could actually be performed by someone following it. Classifies instructions as ACTIONABLE, BLOCKED, or UNCLEAR.

---

## When to Use

### Trigger Conditions
- Artifact contains procedures or instructions
- Process documentation or workflows
- Step-by-step guides
- Requirements that describe actions

### Do NOT Use When
- Artifact is purely descriptive (no actions)
- Conceptual documentation (no "do this")

---

## Execution Steps

### Step 1: Extract All Instructions

**Input**: The artifact
**Action**: Find all statements that tell someone to DO something:
- Imperative verbs: "Create", "Add", "Check", "Verify"
- Modal requirements: "must", "should", "shall"
- Numbered/bulleted steps
- Conditional actions: "If X, then do Y"

**Output**: Instruction inventory

```markdown
### Instructions Extracted
| # | Instruction | Location | Verb |
|---|-------------|----------|------|
| I1 | "{instruction text}" | {section/line} | {main verb} |
| I2 | | | |
```

### Step 2: Classify Each Instruction

**Input**: Instruction list
**Action**: For each instruction, determine:

**ACTIONABLE**:
- Clear subject (who does it)
- Clear action (what to do)
- Clear object (what to act on)
- No missing prerequisites

**BLOCKED**:
- Requires something that doesn't exist
- Depends on undefined term
- Needs unavailable resource

**UNCLEAR**:
- Ambiguous action
- Missing details (how? when? where?)
- Multiple interpretations possible

**Output**: Classification table

```markdown
### Instruction Classification
| # | Status | Reason | Missing |
|---|--------|--------|---------|
| I1 | ACTIONABLE | Clear subject, action, object | N/A |
| I2 | BLOCKED | Requires {X} which is undefined | {X} |
| I3 | UNCLEAR | "Process the data" - how? | Processing method |
```

### Step 3: Identify Blockers

**Input**: BLOCKED instructions
**Action**: For each blocked instruction:
- What exactly is blocking it?
- Is the blocker fixable in this artifact?
- What's the impact of the block?

**Output**: Blocker analysis

```markdown
### Blockers
| Instruction | Blocker | Fixable? | Impact |
|-------------|---------|----------|--------|
| I2 | {X} undefined | YES - define it | Prevents step 2 |
| I5 | Requires external system | NO - outside scope | May need escalation |
```

### Step 4: Identify Ambiguities

**Input**: UNCLEAR instructions
**Action**: For each unclear instruction:
- What specifically is ambiguous?
- What interpretations are possible?
- What clarification is needed?

**Output**: Ambiguity analysis

```markdown
### Ambiguities
| Instruction | Ambiguity | Possible Interpretations | Needs |
|-------------|-----------|-------------------------|-------|
| I3 | "Process" undefined | A) Transform, B) Validate, C) Store | Specify operation |
```

---

## Output Template

```markdown
## Executability Check

### Summary
| Status | Count | % |
|--------|-------|---|
| ACTIONABLE | {N} | {%} |
| BLOCKED | {N} | {%} |
| UNCLEAR | {N} | {%} |

### Instruction Analysis
| # | Instruction | Status | Issue |
|---|-------------|--------|-------|
| I1 | {text} | ACTIONABLE | - |
| I2 | {text} | BLOCKED | {blocker} |
| I3 | {text} | UNCLEAR | {ambiguity} |

### Blockers Requiring Resolution
| Instruction | Blocker | Resolution |
|-------------|---------|------------|
| I2 | {what} | {how to fix} |

### Ambiguities Requiring Clarification
| Instruction | Question | Options |
|-------------|----------|---------|
| I3 | {what's unclear} | A) ... B) ... |

### Verdict
**Executable**: YES / NO / PARTIAL
**Blockers**: {N}
**Unclear**: {N}
**Action Required**: {summary of fixes needed}
```

---

## Examples

### Example 1: Deployment Procedure

**Instructions Extracted**:
| # | Instruction |
|---|-------------|
| I1 | "Build the Docker image" |
| I2 | "Deploy to staging environment" |
| I3 | "Run the verification script" |
| I4 | "Update the configuration" |

**Classification**:
| # | Status | Issue |
|---|--------|-------|
| I1 | ACTIONABLE | Dockerfile exists, command clear |
| I2 | BLOCKED | "Staging environment" not defined |
| I3 | BLOCKED | "Verification script" not provided |
| I4 | UNCLEAR | Which configuration? What values? |

**Verdict**: NOT EXECUTABLE - 2 blockers, 1 unclear

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Accepting vague verbs | "Handle", "Process" unclear | Demand specific actions |
| Assuming context | Reader may not have it | Check explicit inclusion |
| Missing conditionals | "If X" but X undefined | Trace all conditions |
| Ignoring sequence | Steps may be out of order | Check dependencies |

---

## Related Methods

- #83 Closure Check - Find TODO/TBD markers
- #81 Scope Integrity - Check coverage
- #127 Bootstrap Paradox - Check circular dependencies

---

## Quality Checks

Before finalizing output, verify:
- [ ] ALL instruction-like statements captured
- [ ] Each instruction classified with specific reason
- [ ] Blockers have clear identification of what's missing
- [ ] Ambiguities specify what interpretations exist
- [ ] Verdict reflects actual ability to execute
