# MC-083: Closure Check

**Category**: sanity
**Source**: methods.csv #83
**Token Cost**: ~0.5-1K tokens
**Complexity**: LOW

---

## Purpose

Search for incomplete work markers (TODO, TBD, PLACEHOLDER) and undefined references. Verify that someone unfamiliar could use the artifact without questions.

---

## When to Use

### Trigger Conditions
- Before accepting any artifact as "complete"
- Reviewing documentation or specifications
- Checking code before release
- Verifying handoff readiness

### Do NOT Use When
- Draft explicitly marked as work-in-progress
- Artifact is intentionally a template

---

## Execution Steps

### Step 1: Scan for Incomplete Markers

**Input**: The artifact to check
**Action**: Search for common incomplete work markers:
- TODO, FIXME, XXX, HACK
- TBD, TBA, PLACEHOLDER
- "..." or "[...]"
- Empty sections or stubs
- "will be added", "coming soon"

**Output**: Marker inventory

```markdown
### Incomplete Markers Found
| Marker | Location | Context | Severity |
|--------|----------|---------|----------|
| TODO | {line/section} | "{surrounding text}" | BLOCKER/MINOR |
| TBD | {line/section} | "{surrounding text}" | BLOCKER/MINOR |
```

### Step 2: Check for Undefined References

**Input**: The artifact
**Action**: Find terms/items that are:
- Mentioned but never defined
- Referenced but not included
- Implied to exist but absent

**Output**: Undefined references list

```markdown
### Undefined References
| Reference | First Mention | Expected Definition | Found? |
|-----------|---------------|---------------------|--------|
| {term} | {location} | {where should be defined} | NO |
```

### Step 3: Forward Reference Check

**Input**: The artifact
**Action**: Check if artifact refers to things that:
- Should exist but don't
- Are promised but not delivered
- Depend on future work

**Output**: Forward references

```markdown
### Forward References (Missing Dependencies)
| Reference | Depends On | Exists? | Impact |
|-----------|------------|---------|--------|
| {item} | {dependency} | NO | BLOCKS X |
```

### Step 4: Closure Verdict

**Input**: All findings from Steps 1-3
**Action**: Determine if artifact has closure:
- CLOSED: No blockers, usable as-is
- OPEN: Has blockers that prevent use
- CONDITIONAL: Minor issues, usable with caveats

**Output**: Verdict

---

## Output Template

```markdown
## Closure Check

### Incomplete Markers
| Marker | Location | Severity |
|--------|----------|----------|
| {marker} | {location} | BLOCKER/MINOR |

**Count**: {N} markers ({B} blockers, {M} minor)

### Undefined References
| Reference | Expected At | Impact |
|-----------|-------------|--------|
| {ref} | {location} | BLOCKER/MINOR |

**Count**: {N} undefined

### Forward References
| Item | Missing Dependency |
|------|-------------------|
| {item} | {what's missing} |

**Count**: {N} missing

### Verdict
**Status**: CLOSED / OPEN / CONDITIONAL
**Blockers**: {count}
**Action Required**: {what to fix before use}
```

---

## Examples

### Example 1: API Specification

**Markers Found**:
| Marker | Location | Severity |
|--------|----------|----------|
| TODO: add authentication | Line 45 | BLOCKER |
| TBD | Error codes section | BLOCKER |
| ... | Response examples | MINOR |

**Undefined References**:
| Reference | Expected At |
|-----------|-------------|
| UserSchema | Referenced in POST /users |
| ErrorResponse | Referenced in all endpoints |

**Verdict**: OPEN - 2 blockers prevent implementation

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Only searching "TODO" | Miss TBD, PLACEHOLDER, etc. | Use full marker list |
| Ignoring "..." | Often marks incomplete | Treat as potential marker |
| Not checking references | Undefined terms cause confusion | Cross-reference check |
| Accepting "minor" blockers | Accumulate into major issues | Track all, prioritize |

---

## Related Methods

- #81 Scope Integrity - Check if requirements addressed
- #84 Coherence Check - Check definition consistency
- #88 Executability Check - Check if steps are actionable

---

## Quality Checks

Before finalizing output, verify:
- [ ] Searched for ALL common markers (TODO, TBD, FIXME, PLACEHOLDER, XXX)
- [ ] Checked for "..." and empty sections
- [ ] Cross-referenced all terms for definitions
- [ ] Forward references identified
- [ ] Verdict matches severity of findings
