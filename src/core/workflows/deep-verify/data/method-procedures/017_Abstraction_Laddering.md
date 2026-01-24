# #17 Abstraction Laddering

**Tier:** 1 (Mandatory - Phase 1)
**Purpose:** Check vertical coherence between abstraction levels.

## What to do

1. Identify all abstraction levels (high-level goals → mid-level design → implementation details)
2. Check vertical coherence: Do promises at one level match details at another?
3. Check for gaps: Are there jumps where intermediate steps are missing?
4. Check for orphans: Are there details that don't connect to any higher goal?

## Step-by-step

```
1. Map abstraction levels:
   HIGH: "System enables seamless collaboration"
    ↓
   MID: "Real-time sync, conflict resolution, presence"
    ↓
   LOW: "WebSocket protocol, CRDT merging, heartbeat"

2. Check vertical coherence:
   - Does "seamless" mean < 100ms latency?
   - Is that achievable with WebSocket + CRDT?
   - Any conflicts between levels?

3. Find gaps:
   - HIGH mentions "offline support"
   - LOW has no offline implementation details
   → GAP

4. Find orphans:
   - LOW has "audit logging" detail
   - No MID or HIGH goal connects to audit
   → ORPHAN (or missing requirement)
```

## Output format

```
Abstraction levels:
- HIGH (goals/vision): [list]
- MID (design/approach): [list]
- LOW (implementation): [list]

Vertical coherence check:
[x] HIGH → MID connected: [which ones]
[x] MID → LOW connected: [which ones]
[ ] Disconnects: [describe]

Gaps found:
- [HIGH promise] has no [MID/LOW] support

Orphans found:
- [LOW detail] connects to no [MID/HIGH]

FINDING (if any): [description]
QUOTE: "[exact text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
