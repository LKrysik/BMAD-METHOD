# #84 Coherence Check

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Verify internal consistency across sections.

## What to do

1. For each section, summarize its key claim in one sentence
2. Compare claims across sections:
   - Do they support each other?
   - Do any contradict?
   - Are there gaps (A assumes X, but X never established)?
3. Check for orphan mechanisms (described but never used)

## Step-by-step

```
1. Summarize each section:
   Sec 2: "Data is validated at ingestion"
   Sec 4: "Processing assumes clean data"
   Sec 7: "Error handling catches invalid data"

2. Check consistency:
   - Sec 2 + Sec 4: consistent ✓
   - Sec 4 + Sec 7: contradiction?
     If data is clean (Sec 4), why error handling (Sec 7)?

3. Check gaps:
   - Sec 5 references "audit trail"
   - No section defines audit trail format
   → GAP

4. Check orphans:
   - Sec 6 describes "rollback mechanism"
   - No other section references rollback
   → ORPHAN (or missing integration)
```

## Output format

```
Section summaries:
- Sec 1: [one sentence]
- Sec 2: [one sentence]
- ...

Consistency matrix:
| Section | Supports | Contradicts | Gap |
|---------|----------|-------------|-----|
| 1 ↔ 2   | ✓        |             |     |
| 2 ↔ 3   |          | ✓           |     |
| ...     |          |             |     |

Orphan mechanisms:
- [mechanism] in [section] — not referenced elsewhere

FINDING (if any): [description]
QUOTE: "[Sec X]" vs "[Sec Y]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
