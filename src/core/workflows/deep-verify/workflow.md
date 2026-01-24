# Deep Verify V2.0 — Modular Verification Workflow

---

## Overview

Sequential verification workflow with early exit capability. Refactored into modular step files with separated data for maintainability and resumability.

**Workflow:** deep-verify
**Version:** V2.0 (based on V12.2)
**Architecture:** Step Files + Datafiles + Subtasking

---

## Core Principles

1. **Early Exit** — Stop when evidence is sufficient, not when all methods are exhausted
2. **Mandatory Quotes** — No quote, no finding. Every claim must cite artifact text.
3. **Signal-Based Selection** — Choose methods based on what Phase 1 reveals
4. **Pattern Matching** — Check against known impossibility patterns before deep analysis
5. **Adversarial Validation** — Attack your own findings before finalizing
6. **Bias Awareness** — Actively counteract confirmation bias

---

## MANDATORY: Data Loading Protocol

```
┌─────────────────────────────────────────────────────────────────────────┐
│  BEFORE STARTING ANY STEP, LOAD REQUIRED DATA FILES                     │
│                                                                         │
│  1. Read this workflow.md FIRST to understand structure                 │
│  2. Each step file specifies its data_dependencies in frontmatter       │
│  3. Load ALL listed dependencies BEFORE executing step logic            │
│  4. Methods definitions are in data/methods.csv - LOAD WHEN NEEDED      │
│                                                                         │
│  Loading Order:                                                         │
│  workflow.md → steps/step-XX.md → read frontmatter → load data/* files │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
deep-verify/
├── workflow.md                    ← YOU ARE HERE (orchestrator)
├── steps/
│   ├── step-00-setup.md          # Phase 0: Stakes + Bias Assessment
│   ├── step-01-pattern-scan.md   # Phase 1: Tier 1 methods + Pattern Library
│   ├── step-02-targeted.md       # Phase 2: Signal-based method selection
│   ├── step-03-adversarial.md    # Phase 3: Devil's advocate + Steel-man
│   ├── step-04-verdict.md        # Phase 4: Score calculation + Decision
│   └── step-05-report.md         # Phase 5: Report generation
├── data/
│   ├── methods.csv               # Method definitions (19 methods)
│   ├── pattern-library.yaml      # Impossibility patterns
│   ├── severity-scoring.yaml     # Scoring rules
│   ├── method-clusters.yaml      # Correlation rules
│   ├── decision-thresholds.yaml  # Decision logic
│   ├── report-template.md        # Report structure
│   ├── examples.md               # Worked scoring examples
│   ├── method-procedures.md      # Detailed method instructions
│   └── calibration.yaml          # Accuracy tracking
└── README.md                     # Documentation
```

---

## Workflow State (Frontmatter Schema)

Each step updates this state in the working document:

```yaml
---
workflow: deep-verify
artifact: "[name of artifact being verified]"
started: "[ISO timestamp]"
stakes: LOW | MEDIUM | HIGH
bias_mode: Standard | Blind | ForcedAlternative
initial_assessment: ProbablySound | Uncertain | ProbablyFlawed | BLIND

stepsCompleted: [0, 1, 2, ...]
currentStep: 0-5
currentScore: 0.0
scoreHistory:
  - step: 1
    delta: "+3 (CRITICAL finding)"
    total: 3

findings:
  - id: F1
    severity: CRITICAL | IMPORTANT | MINOR
    description: "..."
    quote: "exact text"
    location: "line/section"
    pattern: "pattern name or null"
    survived_phase3: true | false | null

patternsMatched: []
methodsExecuted:
  - method_id: 71
    name: "First Principles"
    result: Clean | Finding

earlyExit: false
earlyExitReason: null
verdict: null
confidence: null
---
```

---

## Execution Flow

```
                    ┌───────────────────┐
                    │  Load workflow.md │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────────────┐
                    │ steps/step-00-setup.md    │
                    │ Load: data/decision-      │
                    │       thresholds.yaml     │
                    └─────────┬─────────────────┘
                              │
                    ┌─────────▼─────────────────┐
                    │steps/step-01-pattern-scan │
                    │ Load: data/methods.csv    │
                    │       data/pattern-lib... │
                    │       data/severity-...   │
                    └─────────┬─────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         S ≥ 6 +         BORDERLINE       DEFAULT
         Pattern          4≤S<6
              │               │               │
              ▼               │               │
         ┌────────┐           │               │
         │REJECT  │           │               │
         │(early) │           │               │
         └────────┘           │               │
                              │               │
                    ┌─────────▼───────────────┘
                    │ steps/step-02-targeted.md│
                    │ Load: data/methods.csv   │
                    │       data/method-clust..│
                    └─────────┬────────────────┘
                              │
                    ┌─────────▼────────────────┐
                    │steps/step-03-adversarial │ ← MANDATORY
                    │ Load: data/methods.csv   │
                    └─────────┬────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
           S ≥ 6         -3<S<6           S ≤ -3
              │               │               │
              ▼               ▼               ▼
         ┌────────┐    ┌──────────┐    ┌────────┐
         │ REJECT │    │UNCERTAIN │    │ ACCEPT │
         └────────┘    └──────────┘    └────────┘
                              │
                    ┌─────────▼────────────────┐
                    │ steps/step-04-verdict.md │
                    │ Load: data/decision-...  │
                    └─────────┬────────────────┘
                              │
                    ┌─────────▼────────────────┐
                    │ steps/step-05-report.md  │
                    │ Load: data/report-temp.. │
                    └──────────────────────────┘
```

---

## Quick Start

1. **Start new verification:**
   ```
   Load: steps/step-00-setup.md
   ```

2. **Resume from interruption:**
   ```
   Check frontmatter.stepsCompleted
   Load: steps/step-{currentStep}.md
   ```

3. **Early exit triggered:**
   ```
   If earlyExit: true
   Load: steps/step-04-verdict.md directly
   ```

---

## Method Loading Protocol

**CRITICAL:** Methods definitions must be loaded from `data/methods.csv` whenever:
- Executing any numbered method (#71, #100, etc.)
- Selecting methods in Phase 2
- Referencing method procedures

```
When step says "Execute method #71":
1. Load data/methods.csv
2. Find row where num=71
3. Read: method_name, description, output_pattern
4. Execute according to description
5. Record result per output_pattern
```

---

## Data File Loading Rules

| Data File | Load When | Contains |
|-----------|-----------|----------|
| `data/methods.csv` | Any method execution | Method definitions (19 methods) |
| `data/method-procedures.md` | When CSV description insufficient | Detailed step-by-step procedures |
| `data/pattern-library.yaml` | steps/step-01, steps/step-02 | Impossibility patterns |
| `data/severity-scoring.yaml` | steps/step-01, 02, 03, 04 | Scoring rules |
| `data/method-clusters.yaml` | steps/step-02 | Correlation rules |
| `data/decision-thresholds.yaml` | steps/step-00, 01, 04 | Decision boundaries |
| `data/report-template.md` | steps/step-05 | Report structure |
| `data/examples.md` | Learning / debugging | Worked scoring examples |
| `data/calibration.yaml` | Post-verification / audits | Accuracy tracking |

---

## Step File Reference

| Step | File Path | Purpose |
|------|-----------|---------|
| 0 | `steps/step-00-setup.md` | Stakes assessment, bias check |
| 1 | `steps/step-01-pattern-scan.md` | Tier 1 methods, pattern matching |
| 2 | `steps/step-02-targeted.md` | Signal-based method selection |
| 3 | `steps/step-03-adversarial.md` | Devil's advocate, steel-man |
| 4 | `steps/step-04-verdict.md` | Final score, verdict decision |
| 5 | `steps/step-05-report.md` | Report generation |

---

## Version History

- **V2.0** — Modular refactor with step files and datafiles (based on V12.2)
  - Added: examples.md, method-procedures.md, calibration.yaml
  - Added: Methods #87 (Falsifiability Check), #162 (Theory-Dependence Verification)
  - Fixed: Consistent versioning across all files
- **V12.2** — Added bias mitigation, mandatory Phase 3, ACCEPT guidance
