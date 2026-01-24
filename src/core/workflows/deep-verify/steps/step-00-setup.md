---
step: 0
name: "Setup"
time_estimate: "2-5 minutes"
goal: "Assess stakes, document biases, prepare for verification"
requires_completion: []
next_steps:
  DEFAULT: "steps/step-01-pattern-scan.md"
data_dependencies:
  - "data/decision-thresholds.yaml"
outputs:
  - stakes
  - bias_mode
  - initial_assessment
---

# Phase 0: Setup

## MANDATORY EXECUTION RULES

1. **LOAD DATA FIRST** — Read `data/decision-thresholds.yaml` before proceeding
2. **Complete all sections** — Do not skip bias assessment
3. **Be honest** — Bias awareness only works with honesty
4. **Record in frontmatter** — All outputs go to document frontmatter

---

## 0.1 Stakes Assessment

**Load:** `data/decision-thresholds.yaml` → `stakes_assessment` section

Answer these questions about the artifact being verified:

```
What happens if we ACCEPT a flawed artifact?

[ ] LOW    — Minor rework, <$10K, <1 week, reversible
[ ] MEDIUM — Significant rework, $10K-$100K, 1-4 weeks
[ ] HIGH   — Major damage, >$100K, >1 month, safety, reputation

What happens if we REJECT a sound artifact?

[ ] LOW    — Minor delay, <1 week
[ ] MEDIUM — Significant delay, 1-4 weeks
[ ] HIGH   — Major opportunity cost, >1 month, competitive loss
```

**Record:** Higher of the two = `stakes` level

→ **HALT** — Wait for user to provide stakes assessment

---

## 0.2 Initial Assessment (with Bias Mitigation)

Choose ONE mode based on stakes and self-awareness:

### Option A: Standard Mode

```
Before reading carefully, this artifact seems:

[ ] Probably sound  — Looks solid, no red flags (prior ~0.6 sound)
[ ] Uncertain       — Complex, can't tell yet (prior ~0.3 sound)
[ ] Probably flawed — Strong claims, something smells wrong (prior ~0.15 sound)

Basis for this feeling: ________________________________
```

### Option B: Blind Mode (RECOMMENDED for HIGH stakes)

```
Skip initial assessment entirely.
This prevents confirmation bias from anchoring your analysis.

Initial Assessment: [ ] BLIND (no pre-judgment recorded)
```

### Option C: Forced Alternative Mode

```
After forming initial impression, MUST articulate:

If I think FLAWED, what would ACCEPT require?
Answer: ________________________________

If I think SOUND, what would REJECT require?
Answer: ________________________________

This forces consideration of disconfirming evidence.
```

→ **HALT** — Wait for user to select mode and complete assessment

---

## 0.3 Bias Check

Answer honestly before proceeding:

```
1. What outcome am I expecting?
   Answer: ________________________________
   (Note this — it's your bias)

2. Am I verifying or confirming?
   [ ] Verifying (open to either outcome)
   [ ] Confirming (expecting specific outcome)

3. What would make me change my mind?
   Answer: ________________________________

4. Have I seen similar artifacts before? What happened?
   Answer: ________________________________

5. Is there external pressure toward a particular verdict?
   [ ] No pressure
   [ ] Pressure toward ACCEPT because: ________________
   [ ] Pressure toward REJECT because: ________________
```

### Red Flag Check

```
IF you answered "Probably flawed" in 0.2 AND you expect REJECT:
  → You MUST use Blind Mode or Forced Alternative Mode
  → Document why if proceeding with Standard Mode anyway:
    Reason: ________________________________
```

→ **HALT** — Wait for user to complete bias check

---

## 0.4 Update Frontmatter

After completing setup, update the working document frontmatter:

```yaml
---
workflow: deep-verify
artifact: "[name from user]"
started: "[current ISO timestamp]"
stakes: [LOW / MEDIUM / HIGH]
bias_mode: [Standard / Blind / ForcedAlternative]
initial_assessment: [ProbablySound / Uncertain / ProbablyFlawed / BLIND]
expected_outcome: "[from bias check Q1]"
change_mind_criteria: "[from bias check Q3]"

stepsCompleted: [0]
currentStep: 1
currentScore: 0
scoreHistory: []
findings: []
patternsMatched: []
methodsExecuted: []
earlyExit: false
earlyExitReason: null
verdict: null
confidence: null
---
```

---

## 0.5 Proceed to Pattern Scan

**Stakes-based guidance for next step:**

| Stakes | Recommendation for Phase 1 |
|--------|---------------------------|
| LOW | Standard execution |
| MEDIUM | Standard execution, be thorough |
| HIGH | Extra attention to Pattern Library, consider additional Tier 1 scrutiny |

**Next step:** Load `steps/step-01-pattern-scan.md`

Before loading, verify:
- [ ] Stakes recorded
- [ ] Bias mode selected
- [ ] Initial assessment completed (or BLIND selected)
- [ ] Frontmatter updated

---

## Output Checklist

Before proceeding, confirm:

- [ ] `stakes` is set to LOW, MEDIUM, or HIGH
- [ ] `bias_mode` is set to Standard, Blind, or ForcedAlternative
- [ ] `initial_assessment` is recorded (or BLIND)
- [ ] Bias check questions answered honestly
- [ ] Frontmatter initialized with all required fields
- [ ] Ready to load Phase 1 data files
