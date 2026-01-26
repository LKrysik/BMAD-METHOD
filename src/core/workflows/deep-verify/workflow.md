# Deep Verify V2.0 — Verification Workflow

## YOUR GOAL: Produce a VERIFICATION REPORT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  OUTPUT REQUIRED: A structured VERIFICATION REPORT with verdict            │
│                                                                             │
│  DO NOT: Narrate your reasoning process or describe steps you're about     │
│          to take. JUST EXECUTE AND PRODUCE THE REPORT.                     │
│                                                                             │
│  DO: Briefly announce each data/ file when you load it, e.g.:             │
│      "📂 Loading data/pattern-library.yaml"                                │
│      This keeps the user informed of progress without narrating.           │
│                                                                             │
│  Report format: Read data/report-template.md when generating report        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Execution Path

**For most verifications, execute this sequence:**

```
1. SETUP (2 min)
   - Assess stakes: LOW/MEDIUM/HIGH
   - Note biases, select mode (Standard/Blind)

2. PHASE 1: PATTERN SCAN (5-15 min)
   - Execute: #71 First Principles, #100 Vocabulary, #17 Abstraction
   - Check findings against data/pattern-library.yaml
   - Calculate S score
   - Early exit if S ≥ 6 with pattern match → REJECT
   - Early exit if S ≤ -3 and stakes ≠ HIGH → ACCEPT

3. PHASE 2: TARGETED (15-30 min) — if not early exit
   - Select 2-4 methods based on Phase 1 signals
   - Update S after each method

4. PHASE 3: ADVERSARIAL (10-15 min) — MANDATORY
   - Devil's advocate on IMPORTANT+ findings
   - Steel-man opposite verdict
   - Adjust S based on findings that weaken

5. VERDICT
   - S ≥ 6 → REJECT
   - S ≤ -3 → ACCEPT
   - else → UNCERTAIN

6. OUTPUT THE REPORT
   - Read: data/report-template.md
   - Fill all sections with actual data
   - Output the complete report
```

---

## Scoring Reference

| Finding | Points |
|---------|--------|
| CRITICAL | +3 |
| IMPORTANT | +1 |
| MINOR | +0.3 |
| Clean method pass | -0.5 |
| Pattern match bonus | +1 |

---

## When to Load Additional Files

| Situation | Load |
|-----------|------|
| Need method procedure | `data/method-procedures/{NUM}_{Name}.md` |
| Checking for patterns | `data/pattern-library.yaml` |
| Unsure about scoring | `data/severity-scoring.yaml` |
| Selecting Phase 2 methods | `data/method-clusters.yaml` |
| Generating final report | `data/report-template.md` |
| Evaluating pattern candidates (Phase 6) | `data/pattern-update-protocol.yaml` |

**Method procedures are in separate files. Load the specific one you need:**

```
data/method-procedures/
├── 017_Abstraction_Laddering.md
├── 063_Challenge_from_Critical_Perspective.md
├── 071_First_Principles_Analysis.md
├── 078_Assumption_Excavation.md
├── 084_Coherence_Check.md
├── 085_Grounding_Check.md
├── 086_Topological_Hole_Detection.md
├── 087_Falsifiability_Check.md
├── 100_Vocabulary_Consistency.md
├── 109_Contraposition_Inversion.md
├── 116_Strange_Loop_Detection.md
├── 130_Assumption_Torture.md
├── 153_Theoretical_Impossibility_Check.md
├── 154_Definitional_Contradiction_Detector.md
├── 159_Transitive_Dependency_Closure.md
├── 162_Theory_Dependence_Verification.md
├── 163_Existence_Proof_Demand.md
└── 165_Constructive_Counterexample.md
```

---

## Method Quick Reference

### Tier 1 (Phase 1 — ALL mandatory)

| # | Method | Procedure File |
|---|--------|----------------|
| 71 | First Principles | `data/method-procedures/071_First_Principles_Analysis.md` |
| 100 | Vocabulary | `data/method-procedures/100_Vocabulary_Consistency.md` |
| 17 | Abstraction Laddering | `data/method-procedures/017_Abstraction_Laddering.md` |

### Tier 2 (Phase 2 — Select 2-4 based on signals)

| Signal | Recommended Methods | Procedure Files |
|--------|---------------------|-----------------|
| Absolute claims | #153, #154 | `153_Theoretical_Impossibility_Check.md`, `154_Definitional_Contradiction_Detector.md` |
| Structural complexity | #116, #86 | `116_Strange_Loop_Detection.md`, `086_Topological_Hole_Detection.md` |
| Ungrounded claims | #85, #78 | `085_Grounding_Check.md`, `078_Assumption_Excavation.md` |
| Diffuse belief / Clean Phase 1 | #84, #109 | `084_Coherence_Check.md`, `109_Contraposition_Inversion.md` |

### Tier 3 (Phase 3 — Adversarial)

| # | Method | Procedure File |
|---|--------|----------------|
| 63 | Critical Challenge | `data/method-procedures/063_Challenge_from_Critical_Perspective.md` |

---

## Pattern Library Quick Reference

**Check these when finding matches signals:**

| Pattern | Signals | Severity |
|---------|---------|----------|
| PFS + Escrow | "forward secrecy" + "key recovery" | CRITICAL |
| Gradual + Termination | "dynamic types" + "guarantees termination" | CRITICAL |
| CAP violation | "consistency" + "availability" + "partition" | CRITICAL |
| FLP violation | "async" + "consensus" + "fault tolerance" | CRITICAL |
| Universal detection | "100% recall", "finds all bugs" | CRITICAL |
| Undefined core term | Key concept never defined | IMPORTANT/CRITICAL |

Full library: `data/pattern-library.yaml`

---

## Report Generation

When ready to output the report:

1. **Read:** `data/report-template.md`
2. **Fill ALL placeholders** with actual data from your analysis
3. **Output the complete report** — this is your deliverable

---

## Directory Structure

```
deep-verify/
├── workflow.md                 ← YOU ARE HERE
├── data/
│   ├── methods.csv                  # Method definitions
│   ├── method-procedures/           # Individual method procedures
│   │   ├── 071_First_Principles_Analysis.md
│   │   ├── 100_Vocabulary_Consistency.md
│   │   └── ... (18 files total)
│   ├── pattern-library.yaml         # Impossibility patterns
│   ├── pattern-update-protocol.yaml # Process for adding new patterns
│   ├── severity-scoring.yaml        # Scoring rules
│   ├── method-clusters.yaml         # Method selection
│   ├── decision-thresholds.yaml
│   ├── report-template.md           # Report format
│   ├── examples.md                  # Worked examples
│   └── calibration.yaml             # Accuracy tracking
└── steps/                           # Detailed step files (0-5 + optional 6)
```

---

## Detailed Steps (Optional — for complex cases or resumption)

If you need detailed step-by-step guidance, load the appropriate step file:

| Phase | File | When to use |
|-------|------|-------------|
| 0 | `steps/step-00-setup.md` | Complex stakes assessment |
| 1 | `steps/step-01-pattern-scan.md` | Need detailed Tier 1 guidance |
| 2 | `steps/step-02-targeted.md` | Complex method selection |
| 3 | `steps/step-03-adversarial.md` | Detailed adversarial process |
| 4 | `steps/step-04-verdict.md` | Complex verdict validation |
| 5 | `steps/step-05-report.md` | Detailed report generation |
| 6 | `steps/step-06-pattern-candidate.md` | **Optional** — Evaluate if findings should become new patterns |

**Phase 6** is optional. After the report, if a CRITICAL finding survived Phase 3 without a Pattern Library match, offer to run Phase 6. The user can also request it explicitly.

**For most verifications:** Use this workflow.md directly. Step files are for edge cases, learning, or resuming interrupted verifications.

---

## Critical Rules

1. **NO QUOTE = NO FINDING** — Every finding must cite exact artifact text
2. **MANDATORY PHASE 3** — Always do adversarial review (except early exit with pattern)
3. **OUTPUT = REPORT** — Your deliverable is a structured verification report
4. **DON'T NARRATE** — Don't describe your reasoning steps; DO announce each `data/` file load briefly
5. **LOAD FILES WHEN NEEDED** — Read method procedures, templates, and data files as you need them

---

## Version History

- **V2.0** — Modular with separate method procedure files, references by path
- **V12.2** — Original version with bias mitigation, mandatory Phase 3
