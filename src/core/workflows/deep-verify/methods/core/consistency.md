# Consistency Check

## Purpose
Verify that definitions and terms are used consistently throughout the artifact.

## When to Apply
**ALWAYS** - this is a CORE method.

## Procedure

### Step 1: Extract Definitions
Find all explicit definitions in the artifact:
- "X is defined as..."
- "X means..."
- "X: [definition]"
- Terms in glossary or key concepts section

### Step 2: Track Term Usage
For each defined term, find all places it's used.

### Step 3: Compare Usage vs Definition
Check if each usage matches the definition.

### Step 4: Find Contradictions
Look for statements that contradict each other:
- "X is Y" vs "X is not Y"
- "Always Z" vs "Sometimes not Z"
- Different values for same parameter

## Output Format

```markdown
## Consistency Check Results

### Definitions Found
| Term | Definition | Location |
|------|------------|----------|
| [term] | "[definition]" | line X |

### Consistency Analysis
| Term | Usage Location | Matches Definition? |
|------|----------------|---------------------|
| [term] | line Y | YES/NO - [explanation if NO] |

### Contradictions Found
| Statement A | Statement B | Contradiction |
|-------------|-------------|---------------|
| "[quote A]" line X | "[quote B]" line Y | [explanation] |

### Verdict: PASS / FAIL
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Core term used inconsistently | CRITICAL |
| Explicit contradiction found | CRITICAL |
| Secondary term inconsistent | IMPORTANT |
| Minor terminology variation | MINOR |
