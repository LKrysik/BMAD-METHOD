# #159 Transitive Dependency Closure

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Find indirect dependency issues.

## What to do

1. Build dependency graph
2. Compute transitive closure (all indirect dependencies)
3. Find:
   - Circular dependencies (path A→...→A)
   - Missing dependencies (referenced but undefined)
   - Transitive conflicts (A depends on B and C, but B and C conflict)

## Step-by-step

```
1. Build direct dependencies:
   A → B
   B → C
   C → D
   D → B (creates cycle)

2. Compute transitive closure:
   A depends on: B, C, D (transitively)
   B depends on: C, D, B (CYCLE)

3. Find issues:
   - Cycle: B → C → D → B
   - Missing: E referenced in A but not defined
   - Conflict: A → X and A → Y where X conflicts with Y
```

## Output format

```
Direct dependencies:
[list or matrix]

Transitive closure:
[expanded dependencies]

Cycles found:
- [path]

Missing dependencies:
- [node] referenced but undefined

Transitive conflicts:
- [A] depends on [X] and [Y] which conflict

FINDING (if any): [description]
QUOTE: "[relevant text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
