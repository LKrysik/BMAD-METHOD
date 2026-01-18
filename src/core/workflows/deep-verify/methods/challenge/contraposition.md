# Contraposition Check

## Purpose
Instead of asking "does this work?", ask "what would GUARANTEE this fails?" - then check if the artifact does any of those things.

## When to Apply
When critical findings exist and need stress-testing.

## Procedure

### Step 1: Identify Success Goal
What is the artifact trying to achieve? State it clearly.

### Step 2: Invert to Failure
Ask: "What would GUARANTEE failure of this goal?"
List specific failure paths.

### Step 3: Check Artifact
For each failure path, check if artifact:
- Does this thing
- Partially does it
- Has risk of it
- Avoids it

### Step 4: Report
Failure paths that artifact DOES = findings.

## Common Failure Patterns

| Goal | Guaranteed Failure |
|------|-------------------|
| Reliable system | Single point of failure with no redundancy |
| Secure system | Storing secrets in plaintext |
| Consistent data | No synchronization between replicas |
| Fast performance | Unbounded loops or recursion |
| Maintainable code | No modularity, everything coupled |
| Correct types | No type checking at boundaries |

## Output Format

```markdown
## Contraposition Check Results

### Success Goal
"[What artifact is trying to achieve]"

### Failure Paths
| Failure Path | Would Guarantee Failure Because |
|--------------|--------------------------------|
| [path 1] | [explanation] |
| [path 2] | [explanation] |

### Artifact Analysis
| Failure Path | Artifact Does This? | Evidence |
|--------------|---------------------|----------|
| [path 1] | YES/PARTIAL/NO | "[quote]" line X |
| [path 2] | YES/PARTIAL/NO | "[quote]" line Y |

### Issues Found
| ID | Failure Path | Status | Severity |
|----|--------------|--------|----------|
| CP-1 | [path] | DOES/PARTIAL | CRITICAL/IMPORTANT |
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Artifact does a guaranteed-failure thing | CRITICAL |
| Artifact partially does it | IMPORTANT |
| Artifact has risk of it | MINOR |
