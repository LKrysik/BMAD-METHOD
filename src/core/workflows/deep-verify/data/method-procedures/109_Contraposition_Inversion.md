# #109 Contraposition Inversion

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Reveal hidden failure modes by asking "what guarantees failure?"

## What to do

1. For each key claim "If A then B", consider "If not-B then not-A"
2. Ask: What would have to be true for this system to fail?
3. Check: Are those failure conditions addressed?

## Step-by-step

```
1. Identify key claims:
   "If user is authenticated, they can access resources"

2. Apply contraposition:
   "If user cannot access resources, they are not authenticated"
   → Is this true? What about authorization?
   → FINDING: Auth ≠ Authz, conflation

3. Ask failure question:
   "What guarantees this system fails?"
   - Network partition
   - Database corruption
   - Auth service down
   - Cache inconsistency

4. Check mitigations:
   - Network partition: [addressed? how?]
   - Database corruption: [addressed? how?]
   - ...

5. Check theorem violations:
   - Async + Consensus + Faults → FLP
   - SP + IR + EFF + BB → Myerson-Satterthwaite
```

## Output format

```
Key claims:
- [Claim]: "If A then B"
  Contraposition: "If not-B then not-A"
  Valid? [yes/no/partially]

Failure conditions:
| Condition | Addressed? | How? |
|-----------|------------|------|
| [F1]      | [Y/N/P]    | [X]  |
| [F2]      | [Y/N/P]    | [X]  |

Theorem checks:
- FLP: [applicable? violated?]
- M-S: [applicable? violated?]
- CAP: [applicable? violated?]

FINDING (if any): Failure condition "[X]" not addressed
QUOTE: "[claim that assumes it won't happen]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
