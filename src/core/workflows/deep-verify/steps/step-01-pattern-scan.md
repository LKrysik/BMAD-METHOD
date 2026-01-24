---
step: 1
name: "Pattern Scan"
time_estimate: "5-15 minutes"
goal: "Rapidly identify red flags using cheap, broad methods"
requires_completion: [0]
next_steps:
  S_GTE_6_WITH_PATTERN: "steps/step-04-verdict.md"
  S_GTE_6_NO_PATTERN: "steps/step-02-targeted.md"
  BORDERLINE: "steps/step-02-targeted.md"
  S_LTE_NEG3_LOW_STAKES: "steps/step-04-verdict.md"
  DEFAULT: "steps/step-02-targeted.md"
data_dependencies:
  - "data/methods.csv"
  - "data/pattern-library.yaml"
  - "data/severity-scoring.yaml"
  - "data/decision-thresholds.yaml"
outputs:
  - findings (list)
  - currentScore
  - patternsMatched
  - methodsExecuted
---

# Phase 1: Pattern Scan

## MANDATORY EXECUTION RULES

1. **LOAD ALL DATA FILES FIRST** — Read all `data_dependencies` before proceeding
2. **Execute ALL Tier 1 methods** — No skipping, no shortcuts
3. **Mandatory quotes** — NO QUOTE = NO FINDING
4. **Check Pattern Library** — After EACH finding, check for pattern match
5. **Update score** — Calculate S after each method

---

## 1.0 Load Required Data

**Before ANY analysis, load these files:**

```
1. data/methods.csv
   → Find rows: num=71, num=100, num=17
   → Read: method_name, description, output_pattern

2. data/pattern-library.yaml
   → Load all pattern categories
   → Have ready for finding comparison

3. data/severity-scoring.yaml
   → Load base_scoring section
   → Load bonus_rules section

4. data/decision-thresholds.yaml
   → Load evidence_thresholds section
```

→ **HALT** — Confirm all data files loaded before proceeding

---

## 1.1 Execute Tier 1 Methods

Execute ALL three methods. For each method:
1. Read definition from `data/methods.csv`
2. Apply method to artifact
3. Record findings with mandatory quotes
4. Check Pattern Library for matches
5. Update evidence score

### Method #71: First Principles Analysis

**From data/methods.csv:**
> Strip away assumptions to rebuild from fundamental truths. Identify the 3-5 core claims of the artifact. For each claim ask: What must be fundamentally true for this to work?

**Execute now:**

```
Core claims identified:
1. ________________________________
2. ________________________________
3. ________________________________
4. ________________________________
5. ________________________________

For each claim, fundamentals required:
Claim 1: ________________________________
Claim 2: ________________________________
Claim 3: ________________________________
...

Fundamentals validity check:
[ ] All explicitly stated and justified
[ ] Consistent with known constraints
[ ] Not contradicting each other

Findings (if any): ________________________________
```

→ **HALT** — Wait for First Principles analysis

---

### Method #100: Vocabulary Consistency

**From data/methods.csv:**
> Extract all key terms and identify synonyms (same concept different words) and homonyms (same word different concepts).

**Execute now:**

```
Key terms extracted:
- Term 1: _________________ (locations: ________)
- Term 2: _________________ (locations: ________)
- Term 3: _________________ (locations: ________)
...

Synonyms found (same concept, different words):
- _________________ = _________________ (potential confusion)

Homonyms found (same word, different meanings):
- _________________ means X at line ___, means Y at line ___

Findings (if any): ________________________________
```

→ **HALT** — Wait for Vocabulary analysis

---

### Method #17: Abstraction Laddering

**From data/methods.csv:**
> Move up (why does this matter?) and down (how specifically?) levels of abstraction. Check vertical coherence.

**Execute now:**

```
Abstraction levels identified:
- HIGH (goals/vision): ________________________________
- MID (design/approach): ________________________________
- LOW (implementation): ________________________________

Vertical coherence check:
[ ] Promises at HIGH level match details at LOW level
[ ] No gaps where intermediate steps are missing
[ ] No orphan details that don't connect to higher goals

Gaps found: ________________________________
Orphans found: ________________________________

Findings (if any): ________________________________
```

→ **HALT** — Wait for Abstraction analysis

---

## 1.2 Record Findings

For EACH finding from Tier 1 methods, record with this format:

```
FINDING: [description]
QUOTE: "[exact text from artifact]"
LOCATION: [line number / section]
PATTERN: [pattern_id from data/pattern-library.yaml, or "None"]
SEVERITY: [CRITICAL / IMPORTANT / MINOR]
METHOD: #[number] [name]
```

**Severity assignment (from data/severity-scoring.yaml):**
- CRITICAL (+3): Finding alone would justify REJECT
- IMPORTANT (+1): 2-3 together would justify REJECT
- MINOR (+0.3): Only matters if other problems exist

**⚠️ RULE: No quote = no finding.** If you cannot point to specific text, it is not a finding.

→ **HALT** — Wait for all findings to be recorded

---

## 1.3 Check Pattern Library

**For each finding, check against `data/pattern-library.yaml`:**

```
Finding: [F_id]
Pattern categories checked:
  □ definitional_contradictions
  □ theorem_violations
  □ statistical_impossibilities
  □ regulatory_contradictions
  □ ungrounded_core_concepts

Pattern match found? [ ] Yes: _____________ [ ] No

If Yes:
  Pattern ID: _____________
  Pattern name: _____________
  Bonus applied: +1
```

Record all matches in `patternsMatched` array.

---

## 1.4 Calculate Evidence Score

**Apply scoring from `data/severity-scoring.yaml`:**

```
Starting S = 0

Tier 1 Method Results:
  #71 First Principles:
    [ ] Clean pass: S += -0.5
    [ ] Finding(s): _____ × severity points

  #100 Vocabulary:
    [ ] Clean pass: S += -0.5
    [ ] Finding(s): _____ × severity points

  #17 Abstraction:
    [ ] Clean pass: S += -0.5
    [ ] Finding(s): _____ × severity points

Pattern Library bonuses:
  _____ pattern matches × +1 = _____

───────────────────────────────
Current S = _____
```

---

## 1.5 Early Exit Check

**Load `data/decision-thresholds.yaml` → `evidence_thresholds` section**

Check conditions in this order:

```
┌─────────────────────────────────────────────────────────────────────┐
│  CHECK 1: S ≥ 6 AND at least one Pattern Library match?            │
│           → YES: STOP. Load steps/step-04-verdict.md               │
│                  Set earlyExit: true                                │
│                  Set earlyExitReason: "Phase 1 REJECT with pattern" │
│                  Set verdict: REJECT                                │
│           → NO: Continue to Check 2                                 │
├─────────────────────────────────────────────────────────────────────┤
│  CHECK 2: S ≥ 6 BUT no Pattern Library match?                      │
│           → YES: CAUTION. Load steps/step-02-targeted.md           │
│                  Note: "High S without pattern - needs confirmation"│
│           → NO: Continue to Check 3                                 │
├─────────────────────────────────────────────────────────────────────┤
│  CHECK 3: 4 ≤ S < 6 (BORDERLINE)?                                  │
│           → YES: Load steps/step-02-targeted.md                    │
│                  Note: "BORDERLINE - mandatory Phase 2 AND 3"       │
│           → NO: Continue to Check 4                                 │
├─────────────────────────────────────────────────────────────────────┤
│  CHECK 4: S ≤ -3 AND stakes ≠ HIGH?                                │
│           → YES: STOP. Load steps/step-04-verdict.md               │
│                  Set earlyExit: true                                │
│                  Set earlyExitReason: "Phase 1 ACCEPT - clean"      │
│                  Set verdict: ACCEPT                                │
│           → NO: Continue to Check 5                                 │
├─────────────────────────────────────────────────────────────────────┤
│  CHECK 5: Default                                                   │
│           → Load steps/step-02-targeted.md                         │
│           → Normal progression                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1.6 Update Frontmatter

```yaml
stepsCompleted: [0, 1]
currentStep: [2 or 4 depending on exit check]
currentScore: [calculated S]
scoreHistory:
  - step: 1
    methods: [71, 100, 17]
    delta: "[calculation details]"
    total: [S]
findings:
  - id: F1
    severity: [CRITICAL/IMPORTANT/MINOR]
    description: "[description]"
    quote: "[exact text]"
    location: "[line/section]"
    pattern: "[pattern_id or null]"
    method: 71
    survived_phase3: null
  # ... more findings
patternsMatched: [list of pattern_ids]
methodsExecuted:
  - method_id: 71
    name: "First Principles Analysis"
    result: [Clean/Finding]
  - method_id: 100
    name: "Vocabulary Consistency"
    result: [Clean/Finding]
  - method_id: 17
    name: "Abstraction Laddering"
    result: [Clean/Finding]
earlyExit: [true/false]
earlyExitReason: [reason or null]
```

---

## 1.7 Proceed to Next Step

**Based on Early Exit Check result:**

| Condition | Next Step | Note |
|-----------|-----------|------|
| S ≥ 6 + Pattern | `steps/step-04-verdict.md` | Early REJECT |
| S ≥ 6, no Pattern | `steps/step-02-targeted.md` | Needs confirmation |
| 4 ≤ S < 6 | `steps/step-02-targeted.md` | BORDERLINE, mandatory 2+3 |
| S ≤ -3, stakes ≠ HIGH | `steps/step-04-verdict.md` | Early ACCEPT |
| Otherwise | `steps/step-02-targeted.md` | Normal progression |

**Before loading next step, verify:**
- [ ] All Tier 1 methods executed
- [ ] All findings have quotes
- [ ] Pattern Library checked for each finding
- [ ] Score calculated correctly
- [ ] Frontmatter updated
- [ ] Next step determined

---

## Output Checklist

- [ ] `findings` array populated (or empty if clean)
- [ ] `currentScore` calculated
- [ ] `patternsMatched` recorded
- [ ] `methodsExecuted` includes all three Tier 1 methods
- [ ] Early exit decision made
- [ ] Ready to load next step with all context
