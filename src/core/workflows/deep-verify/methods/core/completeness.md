# Completeness Check

## Purpose
Verify that the artifact has no missing elements, unfinished sections, or placeholders.

## When to Apply
**ALWAYS** - this is a CORE method.

## Procedure

### Step 1: Scan for Incomplete Markers
Search for these patterns:
- TODO, TBD, FIXME, XXX, HACK
- "to be determined", "to be defined"
- "placeholder", "stub", "mock"
- "[...]", "...", "etc."
- Empty sections (heading with no content)

### Step 2: Check Required Elements
Based on artifact type, verify required elements exist:

**For Specification/Design:**
- [ ] Purpose/Goal statement
- [ ] Requirements or constraints
- [ ] Architecture/Design
- [ ] Error handling
- [ ] Limitations/Assumptions

**For Protocol:**
- [ ] Message formats
- [ ] State transitions
- [ ] Error cases
- [ ] Edge cases

**For Code:**
- [ ] All functions implemented (no stubs)
- [ ] Error handling present
- [ ] Edge cases handled

### Step 3: Check References
- Forward references that are never defined
- References to external documents that don't exist
- Broken internal links

## Output Format

```markdown
## Completeness Check Results

### Incomplete Markers Found
| Marker | Location | Impact |
|--------|----------|--------|
| [marker] | line X | BLOCKER/MINOR |

### Required Elements
| Element | Present? | Location | Notes |
|---------|----------|----------|-------|
| [element] | YES/NO/PARTIAL | line X | [notes] |

### Undefined References
| Reference | Location | Status |
|-----------|----------|--------|
| [ref] | line X | MISSING/UNDEFINED |

### Verdict: PASS / FAIL
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| TODO in critical section | CRITICAL |
| Missing required element | CRITICAL |
| Forward reference never defined | IMPORTANT |
| Minor placeholder | MINOR |
