# #78 Assumption Excavation

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Surface hidden assumptions that could invalidate claims.

## What to do

1. For each mechanism or claim, ask: "What must be true for this to work?"
2. Dig through three layers:
   - Surface (conscious): Explicitly stated assumptions
   - Inherited (learned): Domain conventions not stated
   - Invisible (cultural): Unstated "obvious" assumptions
3. For unstated assumptions: Is this assumption reasonable? Always true?

## Step-by-step

```
1. Select key mechanism:
   "User authentication via OAuth"

2. Surface assumptions (stated):
   - "Users have Google/GitHub accounts"
   - "Network available during auth"

3. Inherited assumptions (domain):
   - OAuth provider is reliable
   - Token expiry is acceptable
   - Refresh tokens work

4. Invisible assumptions (unstated):
   - Users trust OAuth providers
   - Browser supports redirects
   - No MitM possible on redirect

5. Stress test each:
   - What if OAuth provider down?
   - What if user has no accounts?
   - What if corporate firewall blocks?
```

## Output format

```
Mechanism: [name]

Surface assumptions (stated):
- [assumption]: justified? [yes/no]

Inherited assumptions (domain):
- [assumption]: valid? [yes/no]

Invisible assumptions (unstated):
- [assumption]: reasonable? [yes/no/sometimes]

Risk assessment:
- [assumption] if wrong → [impact]

FINDING (if any): Hidden assumption "[X]" is [unreasonable/unstated/risky]
QUOTE: "[mechanism description that relies on assumption]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
