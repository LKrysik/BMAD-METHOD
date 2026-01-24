# #100 Vocabulary Consistency

**Tier:** 1 (Mandatory - Phase 1)
**Purpose:** Ensure key terms are used consistently throughout.

## What to do

1. Extract all key terms (technical jargon, defined concepts)
2. For each term, find all locations where it's used
3. Check: Is the term used consistently everywhere?
4. Look for:
   - Synonyms (same concept, different words) — potential confusion
   - Homonyms (same word, different meanings) — potential contradiction

## Step-by-step

```
1. Scan for technical terms and domain jargon
2. Build term index:
   Term: "validation"
   - Section 2.1: "data validation" (input checking)
   - Section 4.3: "validation" (approval workflow)
   - Section 7.2: "validation set" (ML testing)

3. For each term with multiple uses:
   - Are they the same concept?
   - If different, is this clear from context?
   - Could a reader be confused?

4. Check for synonym pairs:
   "user" vs "customer" vs "client"
   - Same entity? → Confusion risk
   - Different entities? → Should be explicit
```

## Output format

```
Key terms extracted:
- [Term 1]: locations [X, Y, Z]
- [Term 2]: locations [A, B]
- [Term 3]: locations [C, D, E, F]

Synonyms found:
- [Term A] = [Term B]: potential confusion at [locations]

Homonyms found:
- [Term]: means X at [location], means Y at [location]

FINDING (if any): [description]
QUOTE: "[text from location 1]" vs "[text from location 2]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
