# Scope Alignment Check

## Purpose
Verify that the artifact addresses what it claims to address - no silent omissions, no scope drift.

## When to Apply
**ALWAYS** - this is a CORE method.

## Procedure

### Step 1: Extract Stated Purpose
Find the artifact's stated goal/purpose:
- Title
- Executive summary
- "This document describes..."
- "Purpose:" section

### Step 2: List Claimed Coverage
What does the artifact claim to cover?
- Features listed
- Requirements mentioned
- Problems addressed

### Step 3: Check Actual Coverage
For each claimed item, verify it's actually addressed:
- Is there content about this?
- Is the coverage complete or partial?
- Are there silent omissions?

### Step 4: Detect Scope Drift
Look for content that goes beyond stated scope:
- Features not mentioned in purpose
- Tangential content
- "Nice to have" mixed with core

## Output Format

```markdown
## Scope Alignment Check Results

### Stated Purpose
"[exact quote of purpose statement]"

### Coverage Analysis
| Claimed Item | Addressed? | Evidence | Notes |
|--------------|------------|----------|-------|
| [item 1] | FULL/PARTIAL/OMITTED | line X | [notes] |
| [item 2] | FULL/PARTIAL/OMITTED | line Y | [notes] |

### Silent Omissions
| Omission | Expected? | Impact |
|----------|-----------|--------|
| [missing item] | YES/NO | HIGH/LOW |

### Scope Drift
| Extra Content | In Scope? | Issue? |
|---------------|-----------|--------|
| [content] | YES/NO | [notes] |

### Verdict: ALIGNED / DRIFTED / INCOMPLETE
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Core requirement silently omitted | CRITICAL |
| Partial coverage of key feature | IMPORTANT |
| Minor scope drift | MINOR |
| Extra content (no harm) | MINOR or ignore |
