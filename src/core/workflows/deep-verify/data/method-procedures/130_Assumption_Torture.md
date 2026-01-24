# #130 Assumption Torture

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Test assumption sensitivity.

## What to do

1. For each key assumption, test at graduated error levels:
   - 10% wrong (minor deviation)
   - 50% wrong (significant deviation)
   - 100% wrong (completely invalid)
2. What happens to the system at each level?
3. Is there graceful degradation or catastrophic failure?

## Step-by-step

```
1. Identify key assumptions:
   "Network latency < 50ms"

2. Test at levels:
   10% wrong (55ms):
   - Impact: Slightly slower UI
   - Degradation: Graceful ✓

   50% wrong (75ms):
   - Impact: Noticeable delay
   - Degradation: User experience suffers

   100% wrong (100ms+):
   - Impact: Timeouts possible
   - Degradation: CATASTROPHIC - system fails

3. Assess:
   - At what point does system break?
   - Is there warning before break?
   - Can system adapt?
```

## Output format

```
Assumption: [name]
Current value: [X]

Sensitivity analysis:
| Error | Value | Impact | Degradation |
|-------|-------|--------|-------------|
| 10%   | [X]   | [desc] | [graceful/warning/catastrophic] |
| 50%   | [X]   | [desc] | [graceful/warning/catastrophic] |
| 100%  | [X]   | [desc] | [graceful/warning/catastrophic] |

Breaking point: [X% / value]
Early warning: [yes/no]

FINDING (if any): Assumption "[X]" causes catastrophic failure at [Y]%
QUOTE: "[text stating the assumption]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
