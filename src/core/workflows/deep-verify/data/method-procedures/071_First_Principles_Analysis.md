# #71 First Principles Analysis

**Tier:** 1 (Mandatory - Phase 1)
**Purpose:** Strip away assumptions to rebuild from fundamental truths.

## What to do

1. Identify the 3-5 core claims of the artifact
2. For each claim, ask: "What must be fundamentally true for this to work?"
3. Check if those fundamentals are:
   - Explicitly stated and justified
   - Consistent with known constraints (physics, math, regulations)
   - Not contradicting each other

## Step-by-step

```
1. Read artifact overview/summary section
2. Extract core claims:
   - What does this artifact promise to deliver?
   - What capabilities does it claim?
   - What guarantees does it make?

3. For each claim, identify fundamentals:
   "Claim: System provides real-time updates"
   → Fundamental: Network latency must be low enough
   → Fundamental: Processing must complete within threshold
   → Fundamental: "Real-time" must be defined

4. Verify fundamentals:
   □ Is network assumption stated?
   □ Is processing time bounded?
   □ Is "real-time" defined (100ms? 1s? 10s?)?

5. Check for contradictions between fundamentals
```

## Output format

```
Core claims identified:
1. [Claim 1]
2. [Claim 2]
3. [Claim 3]

Fundamentals required:
Claim 1: [List fundamentals]
Claim 2: [List fundamentals]
Claim 3: [List fundamentals]

Fundamentals validity:
[x] Explicitly stated: [which ones]
[x] Consistent with constraints: [which ones]
[ ] Contradictions found: [describe]

FINDING (if any): [description]
QUOTE: "[exact text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
