# Method Matrix

## Purpose
Defines which methods from `methods.csv` MUST be used for each action in the testing process.
Minimum 5 methods per action. This is MANDATORY - no action without methods.

---

## Action Categories

### A. Design Actions (creating artifacts)
### B. Evaluation Actions (assessing quality)
### C. Analysis Actions (understanding patterns)
### D. Evolution Actions (improving workflow)

---

## A. Design Actions

### A1: Designing Trap Task

**Purpose:** Create task that will expose agent weaknesses.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #34 Pre-mortem Analysis | Imagine agent failure, work backwards |
| 2 | #35 Failure Mode Analysis | Identify how each requirement can fail |
| 3 | #109 Contraposition Inversion | What guarantees agent will fail? |
| 4 | #146 Assumption Archaeology | Find invisible assumptions agent will make |
| 5 | #51 Liar's Trap | How will agent cut corners? |
| 6 | #75 Falsifiability Check | Create testable failure scenarios |
| 7 | #117 Fractal Zoom | Traps at micro/meso/macro levels |
| 8 | #59 Simpson's Paradox | Parts look OK but whole fails |

**Output validation:**
- [ ] At least 6 expected errors per task
- [ ] At least 2 CRITICAL severity
- [ ] Covers at least 4 error categories
- [ ] Each error has detection signal defined

---

### A2: Designing Expected Errors (Ground Truth)

**Purpose:** Define what errors agent WILL make, with detection criteria.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #70 Scope Integrity Check | What will agent reduce/omit? |
| 2 | #74 Grounding Check | What assumptions will agent make? |
| 3 | #84 Assumption Inheritance | What will agent inherit incorrectly? |
| 4 | #53 Confession Paradox | What hard parts will agent skip? |
| 5 | #116 Effort Forensics | Where will agent under-invest effort? |
| 6 | #52 Mirror Trap | What would lazy agent do? |
| 7 | #127 Negative Space Cartography | What will agent NOT do? |

**Output validation:**
- [ ] Each error has unique ID
- [ ] Each error has detection signal (observable marker)
- [ ] Detection signals are objective (not interpretive)
- [ ] Severity is justified

---

### A3: Designing Workflow Variant

**Purpose:** Create modified workflow based on learnings.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #142 Alternative Autopsy | Generate genuinely different approaches |
| 2 | #55 Barber Paradox | What rejected approaches to reconsider? |
| 3 | #102 Cantor's Diagonal Escape | Construct approach outside known list |
| 4 | #104 Heisenberg Trade-off | Identify what we sacrifice |
| 5 | #115 Entropy Audit | Does change add chaos or order? |
| 6 | #57 Newcomb's Paradox | What surprising approach might work? |
| 7 | #66 Fredkin's Paradox | Extract value from rejected ideas |
| 8 | #39 First Principles Analysis | Strip assumptions, rebuild |

**Output validation:**
- [ ] Change is specific and testable
- [ ] Hypothesis is falsifiable
- [ ] Risk is identified
- [ ] Rollback plan exists

---

## B. Evaluation Actions

### B1: Evaluating Agent Output (Pre-Workflow)

**Purpose:** Understand what agent produced before workflow verification.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #70 Scope Integrity Check | Did agent cover full scope? |
| 2 | #71 Alignment Check | Does output match stated goal? |
| 3 | #72 Closure Check | Are there TODOs, placeholders? |
| 4 | #73 Coherence Check | Internal consistency? |
| 5 | #74 Grounding Check | What assumptions made? |
| 6 | #150 Executability Check | Can someone act on this? |

**Output:** List of observable agent shortcuts (before seeing workflow results).

---

### B2: Evaluating Workflow Findings

**Purpose:** Assess quality of findings produced by workflow.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #63 Observer Paradox | Is analysis genuine or performative? |
| 2 | #65 Abilene Paradox | Are findings real or invented? |
| 3 | #110 Reductio Attack | Attack each finding - does it survive? |
| 4 | #144 Ground Truth Demand | Can findings be verified externally? |
| 5 | #143 Effort Forensics | Was effort distributed well? |
| 6 | #64 Goodhart's Law | Is workflow gaming metrics? |

**Output:** Confidence level for each finding (HIGH/MEDIUM/LOW).

---

### B3: Evaluating Detection Match

**Purpose:** Compare workflow findings to ground truth.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #149 Dispute Resolution | When match is ambiguous |
| 2 | #73 Coherence Check | Is mapping consistent? |
| 3 | #114 Approval Gradient | Am I biased toward confirming match? |
| 4 | #145 Competence Boundary | Where am I guessing? |
| 5 | #68 Kernel Paradox | What must user verify independently? |

**Blind Evaluation Protocol:**
1. First: List all workflow findings WITHOUT looking at ground truth
2. Second: For each finding, describe what error it represents
3. Third: Open ground truth, attempt mapping
4. Fourth: Apply #149 for ambiguous cases

---

### B4: Evaluating Unexpected Findings (BONUS)

**Purpose:** Assess findings not in ground truth - are they valuable discoveries?

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #65 Abilene Paradox | Is this a real problem? |
| 2 | #110 Reductio Attack | Can we disprove this finding? |
| 3 | #54 CUI BONO | Who benefits from this being a finding? |
| 4 | #144 Ground Truth Demand | How to verify externally? |
| 5 | #67 Tolerance Paradox | Is this categorically valid/invalid? |

**Classification:**
- BONUS_VALID: Real error we didn't anticipate → update ground truth
- BONUS_QUESTIONABLE: Might be error, needs human review
- FALSE_POSITIVE: Not an actual error → workflow noise

---

## C. Analysis Actions

### C1: Analyzing Why Error Was Missed

**Purpose:** Deep dive into detection failure.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #40 5 Whys Deep Dive | Get to root cause of miss |
| 2 | #107 Aristotle's Four Causes | Material/Formal/Efficient/Final cause |
| 3 | #120 Deconstruction Seeds | Find internal tension that caused miss |
| 4 | #127 Negative Space Cartography | What workflow COULD have done |
| 5 | #126 Reversibility Test | Trace reasoning backwards |
| 6 | #121 Godel Witness | Where is fundamental limit? |

**Output format:**
```
Missed Error: [ID]
Surface reason: [immediate cause]
Structural reason: [workflow design issue]
Assumption reason: [incorrect assumption in workflow]
Root cause: [fundamental issue]
Fix category: [METHOD_GAP | CONCERN_GAP | DEPTH_GAP | CHALLENGE_GAP]
```

---

### C2: Analyzing Cross-Experiment Patterns

**Purpose:** Find patterns across multiple experiments.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #12 Graph of Thoughts | Map relationships between findings |
| 2 | #33 Comparative Analysis Matrix | Structured comparison |
| 3 | #59 Simpson's Paradox | Hidden variables affecting results |
| 4 | #117 Fractal Zoom | Patterns at different scales |
| 5 | #77 Quine's Web | How findings connect |
| 6 | #113 Symmetry Breaking | What patterns are we breaking? |

**Minimum sample:** 3 experiments before pattern analysis.

---

### C3: Analyzing Variance Between Runs

**Purpose:** Understand why same experiment gives different results.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #105 Epoché Pure Seeing | Suspend assumptions about determinism |
| 2 | #112 Topological Invariant | What stays constant? |
| 3 | #74 Grounding Check | Which results are reliable? |
| 4 | #56 Sorites Paradox | Which element causes variance? |
| 5 | #58 Braess Paradox | Does more precision hurt? |

**Protocol:**
- Run same experiment 3 times
- Calculate: mean, std dev, min, max for each metric
- If std dev > 20% of mean → result is UNSTABLE
- Identify which findings are consistent vs variable

---

## D. Evolution Actions

### D1: Selecting Workflow Modification

**Purpose:** Choose what to change in workflow.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #40 5 Whys Deep Dive | From symptom to root cause |
| 2 | #142 Alternative Autopsy | Generate multiple options |
| 3 | #104 Heisenberg Trade-off | What do we sacrifice? |
| 4 | #56 Sorites Paradox | Which change has most impact? |
| 5 | #115 Entropy Audit | Does change add complexity? |
| 6 | #64 Goodhart's Law | Are we optimizing right thing? |
| 7 | #55 Barber Paradox | Reconsider rejected approaches |

**Decision criteria:**
- Expected improvement > Risk of regression
- Change is testable in single experiment
- Change is reversible

---

### D2: Validating Workflow Variant (Before Testing)

**Purpose:** Sanity check variant before running experiments.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #51 Liar's Trap | How could this variant deceive us? |
| 2 | #53 Confession Paradox | What hard part did we skip? |
| 3 | #54 CUI BONO | Does change benefit outcome or our convenience? |
| 4 | #75 Falsifiability Check | How could this fail? |
| 5 | #109 Contraposition Inversion | What guarantees failure? |
| 6 | #68 Kernel Paradox | What can't we self-verify? |

**Gate:** Variant must pass all 6 methods or be revised.

---

### D3: Deciding Continue vs Stop

**Purpose:** Determine if further iteration is valuable.

| # | Method | Why This Method |
|---|--------|-----------------|
| 1 | #65 Abilene Paradox | Are we improving or just changing? |
| 2 | #64 Goodhart's Law | Are we gaming our metrics? |
| 3 | #49 Hindsight Reflection | Looking back, what did we learn? |
| 4 | #50 Lessons Learned Extraction | Actionable takeaways |
| 5 | #145 Competence Boundary | Where are we at our limit? |

**Stop criteria:**
- Improvement Delta < 2 for 3 consecutive experiments
- Token efficiency decreasing with more complexity
- All CRITICAL error categories at >80% detection

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│ ACTION                          │ METHODS (minimum 5)       │
├─────────────────────────────────┼───────────────────────────┤
│ A1: Design trap task            │ #34,35,109,146,51,75,117  │
│ A2: Design expected errors      │ #70,74,84,53,116,52,127   │
│ A3: Design workflow variant     │ #142,55,102,104,115,57,66 │
├─────────────────────────────────┼───────────────────────────┤
│ B1: Evaluate agent output       │ #70,71,72,73,74,150       │
│ B2: Evaluate workflow findings  │ #63,65,110,144,143,64     │
│ B3: Evaluate detection match    │ #149,73,114,145,68        │
│ B4: Evaluate unexpected finds   │ #65,110,54,144,67         │
├─────────────────────────────────┼───────────────────────────┤
│ C1: Analyze missed error        │ #40,107,120,127,126,121   │
│ C2: Analyze patterns            │ #12,33,59,117,77,113      │
│ C3: Analyze variance            │ #105,112,74,56,58         │
├─────────────────────────────────┼───────────────────────────┤
│ D1: Select modification         │ #40,142,104,56,115,64,55  │
│ D2: Validate variant            │ #51,53,54,75,109,68       │
│ D3: Decide continue/stop        │ #65,64,49,50,145          │
└─────────────────────────────────┴───────────────────────────┘
```

---

## Enforcement

Before completing ANY action:
1. List which methods you used
2. Show output of each method (even brief)
3. If fewer than 5 methods → action is INVALID

**Anti-pattern detection:**
- "I used methods #X, #Y, #Z" without showing work = INVALID
- Generic application without task-specific detail = INVALID
- Skipping methods because "obvious" = INVALID
