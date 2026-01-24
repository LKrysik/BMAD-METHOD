# #85 Grounding Check

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Verify claims have evidence.

## What to do

1. For each significant claim, ask: "What evidence supports this?"
2. Classify evidence as:
   - Explicit (cited, demonstrated)
   - Implicit (follows logically from stated facts)
   - Missing (assertion without support)
3. Flag all claims with missing evidence
4. Apply CUI BONO: Who benefits from ungrounded claims?

## Step-by-step

```
1. Extract significant claims:
   - "System handles 10,000 concurrent users"
   - "Response time under 100ms"
   - "99.9% uptime"

2. For each claim, find evidence:
   Claim: "10,000 concurrent users"
   - Explicit evidence: None found
   - Implicit evidence: Architecture diagram shows load balancer
   - Verdict: PARTIALLY GROUNDED

   Claim: "99.9% uptime"
   - Explicit evidence: None (no SLA, no historical data)
   - Implicit evidence: None
   - Verdict: UNGROUNDED

3. CUI BONO analysis:
   - Who benefits from "99.9%" claim? Sales/marketing
   - Is there pressure to make this claim? Likely
   - Higher scrutiny warranted? Yes
```

## Output format

```
Claims analyzed:
| Claim | Explicit | Implicit | Verdict |
|-------|----------|----------|---------|
| [C1]  | [Y/N]    | [Y/N]    | [G/P/U] |
| [C2]  | [Y/N]    | [Y/N]    | [G/P/U] |

G = Grounded, P = Partially, U = Ungrounded

CUI BONO:
- [Claim]: benefits [who], scrutiny level [low/med/high]

FINDING (if any): Claim "[X]" is ungrounded
QUOTE: "[exact claim text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
