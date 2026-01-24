# Deep Verify V2.0 — Modular Verification Workflow

## Overview

Deep Verify V2.0 is a modular refactor of V12.2, restructured using BMAD architectural patterns:

- **Step Files** — Modular, resumable workflow phases
- **Datafiles** — Separated data for maintainability
- **Subtasking Ready** — Structure supports MACP delegation

## Quick Start

### New Verification

1. Load the main workflow file:
   ```
   Read: workflow.md
   ```

2. Start with setup:
   ```
   Load: steps/step-00-setup.md
   ```

3. Follow step-by-step, loading data files as specified in each step's frontmatter.

### Resume Interrupted Verification

1. Check frontmatter for `stepsCompleted` and `currentStep`
2. Load the appropriate step file
3. Continue from where you left off

## Directory Structure

```
deep-verify/
├── workflow.md                    # Orchestrator, entry point
├── README.md                      # This file
├── steps/
│   ├── step-00-setup.md          # Phase 0: Stakes + Bias Assessment
│   ├── step-01-pattern-scan.md   # Phase 1: Tier 1 methods + Pattern Library
│   ├── step-02-targeted.md       # Phase 2: Signal-based method selection
│   ├── step-03-adversarial.md    # Phase 3: Devil's advocate + Steel-man
│   ├── step-04-verdict.md        # Phase 4: Score calculation + Decision
│   └── step-05-report.md         # Phase 5: Report generation
└── data/
    ├── methods.csv               # Method definitions (19 methods)
    ├── method-procedures/        # Individual method procedure files
    │   ├── 017_Abstraction_Laddering.md
    │   ├── 063_Challenge_from_Critical_Perspective.md
    │   ├── 071_First_Principles_Analysis.md
    │   ├── 078_Assumption_Excavation.md
    │   ├── 084_Coherence_Check.md
    │   ├── 085_Grounding_Check.md
    │   ├── 086_Topological_Hole_Detection.md
    │   ├── 087_Falsifiability_Check.md
    │   ├── 100_Vocabulary_Consistency.md
    │   ├── 109_Contraposition_Inversion.md
    │   ├── 116_Strange_Loop_Detection.md
    │   ├── 130_Assumption_Torture.md
    │   ├── 153_Theoretical_Impossibility_Check.md
    │   ├── 154_Definitional_Contradiction_Detector.md
    │   ├── 159_Transitive_Dependency_Closure.md
    │   ├── 162_Theory_Dependence_Verification.md
    │   ├── 163_Existence_Proof_Demand.md
    │   └── 165_Constructive_Counterexample.md
    ├── method-procedures.md      # Combined procedures (deprecated, use individual files)
    ├── pattern-library.yaml      # Known impossibility patterns
    ├── severity-scoring.yaml     # Scoring rules and thresholds
    ├── method-clusters.yaml      # Correlation rules for method selection
    ├── decision-thresholds.yaml  # Verdict decision logic
    ├── report-template.md        # Report output structure
    ├── examples.md               # Worked scoring examples
    └── calibration.yaml          # Accuracy tracking and recalibration
```

## Data Loading Protocol

### Critical Rule

**ALWAYS load required data files BEFORE executing step logic.**

Each step file specifies its dependencies in frontmatter:

```yaml
data_dependencies:
  - "data/methods.csv"
  - "data/pattern-library.yaml"
```

### When to Load What

| Data File | Load When | Purpose |
|-----------|-----------|---------|
| `data/methods.csv` | Any method execution | Method definitions (19 methods) |
| `data/method-procedures/{NUM}_{Name}.md` | Executing specific method | Step-by-step procedure for that method |
| `data/pattern-library.yaml` | steps/step-01, steps/step-02 | Impossibility patterns |
| `data/severity-scoring.yaml` | steps/step-01, 02, 03, 04 | Scoring rules |
| `data/method-clusters.yaml` | steps/step-02 | Correlation rules |
| `data/decision-thresholds.yaml` | steps/step-00, 01, 04 | Decision logic |
| `data/report-template.md` | steps/step-05 | Report structure |
| `data/examples.md` | Learning / debugging | Worked scoring examples |
| `data/calibration.yaml` | Post-verification / audits | Accuracy tracking |

### Loading Order

```
workflow.md → steps/step-XX.md → read frontmatter → load data/* → execute
```

## Workflow Flow

```
┌─────────────┐
│  Step 00    │ Setup: Stakes, Bias Assessment
│   Setup     │
└──────┬──────┘
       │
┌──────▼──────┐
│  Step 01    │ Tier 1 Methods, Pattern Library
│Pattern Scan │
└──────┬──────┘
       │
       ├── S ≥ 6 + Pattern ──────────────────────┐
       │                                         │
┌──────▼──────┐                                  │
│  Step 02    │ Signal-based Method Selection    │
│  Targeted   │                                  │
└──────┬──────┘                                  │
       │                                         │
┌──────▼──────┐                                  │
│  Step 03    │ ← MANDATORY                      │
│ Adversarial │                                  │
└──────┬──────┘                                  │
       │                                         │
┌──────▼──────┐◄─────────────────────────────────┘
│  Step 04    │ Final Score, Verdict
│   Verdict   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Step 05    │ Generate Report
│   Report    │
└─────────────┘
```

## Key Methods Included

The `data/methods.csv` includes 19 essential methods across tiers:

### Tier 1 (Mandatory - Phase 1)
- #71 First Principles Analysis
- #100 Vocabulary Consistency
- #17 Abstraction Laddering

### Tier 2 (Signal-based - Phase 2)
- #78 Assumption Excavation
- #84 Coherence Check
- #85 Grounding Check
- #86 Topological Hole Detection
- #87 Falsifiability Check
- #109 Contraposition Inversion
- #116 Strange Loop Detection
- #130 Assumption Torture
- #153 Theoretical Impossibility Check
- #154 Definitional Contradiction Detector
- #159 Transitive Dependency Closure
- #162 Theory-Dependence Verification
- #163 Existence Proof Demand
- #165 Constructive Counterexample

### Tier 3 (Adversarial - Phase 3)
- #63 Challenge from Critical Perspective

## Evidence Score System

### Base Scoring
| Severity | Points |
|----------|--------|
| CRITICAL | +3 |
| IMPORTANT | +1 |
| MINOR | +0.3 |
| Clean Pass | -0.5 |

### Decision Thresholds
| Score | Verdict |
|-------|---------|
| S ≥ 6 | REJECT |
| S ≤ -3 | ACCEPT |
| -3 < S < 6 | UNCERTAIN |

## Pattern Library

Known impossibility patterns organized by category:

- **Definitional Contradictions** (DC-001 to DC-004)
  - PFS + Escrow, Gradual + Termination, Deterministic + Adaptive, CAP

- **Theorem Violations** (TV-001 to TV-005)
  - VCG + Balanced Budget, FLP, Universal Termination, Universal Detection, Arrow

- **Statistical Impossibilities** (SI-001 to SI-004)
  - Accuracy without N, Quantum Hype, Unverifiable Optimum, Fictional Benchmarks

- **Regulatory Contradictions** (RC-001 to RC-003)
  - FDA + Learning, HIPAA + Analytics, Legal Advice Automation

- **Ungrounded Core Concepts** (UG-001 to UG-003)
  - Undefined Key Term, Circular Definition, Scope Creep Definition

## Frontmatter Schema

Each verification session maintains state in frontmatter:

```yaml
---
workflow: deep-verify
artifact: "[artifact name]"
started: "[ISO timestamp]"
stakes: LOW | MEDIUM | HIGH
bias_mode: Standard | Blind | ForcedAlternative
initial_assessment: ProbablySound | Uncertain | ProbablyFlawed | BLIND

stepsCompleted: [0, 1, 2, ...]
currentStep: 0-5
currentScore: 0.0
scoreHistory: [...]

findings: [...]
patternsMatched: [...]
methodsExecuted: [...]

earlyExit: false
earlyExitReason: null
verdict: null
confidence: null
---
```

## Differences from V12.2

| Aspect | V12.2 | Deep Verify V2.0 |
|--------|-------|------------------|
| Structure | Single 1432-line file | 6 step files + 8 data files |
| Resumability | Manual tracking | Frontmatter state |
| Data | Embedded in workflow | Separated YAML/CSV |
| Methods | Inline descriptions | External data/methods.csv |
| Patterns | Inline tables | External data/pattern-library.yaml |
| Maintainability | Edit entire file | Edit specific component |

## Version History

- **Deep Verify V2.0** — Modular refactor with step files and datafiles (based on V12.2)
- **V12.2** — Added bias mitigation, mandatory Phase 3, ACCEPT guidance

## Related Files

- Original workflow: `../deep-verify-old/workflow-v12.2.md`
- Full methods catalog: `../../methods/methods.csv`
