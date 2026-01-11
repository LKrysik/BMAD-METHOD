# Universal Protocol Testing - Agent Instructions

**Version: 2.0**
**Purpose**: Quick start guide for testing ANY verification protocol.

---

## Directory Structure

```
src/
├── testing/                           # ALL TESTING FILES
│   ├── framework/                     # Testing framework files
│   │   ├── AGENT-INSTRUCTIONS-UNIVERSAL.md   # This file
│   │   ├── universal-test-orchestrator.md    # Main process
│   │   ├── protocol-registry.md              # Protocol definitions
│   │   ├── universal-metrics.md              # Metrics formulas
│   │   ├── method-matrix.md                  # Methods per action
│   │   ├── metrics.md                        # Legacy metrics
│   │   └── modification-operators.md         # How to evolve
│   │
│   ├── tasks/                         # Test tasks
│   │   ├── trap-tasks.md              # Standard tasks
│   │   ├── trap-tasks-v2.md           # Advanced tasks
│   │   └── ground-truth.md            # Expected errors (CONFIDENTIAL)
│   │
│   └── results/                       # Experiment results
│       ├── experiment-log.md          # All experiments
│       ├── comparisons/               # Protocol comparisons
│       ├── experiments/               # Detailed artifacts
│       │   └── artifacts/             # Agent outputs
│       └── verifications/             # Protocol outputs
│
├── core/
│   ├── workflows/deep-verify/         # Deep Verify protocols
│   │   ├── workflow-v5.md             # VERSION FILES HERE
│   │   ├── workflow-v6.md
│   │   ├── workflow-v6.1.md
│   │   ├── workflow-v6.2.md
│   │   ├── workflow-v6.3.md
│   │   └── workflow-v6-lite.md
│   │
│   └── quality_gates/                 # Other protocols
│       ├── Tensor-Based-Verification-Protocol.md
│       ├── Quadrant-Verification-Protocol.md
│       └── Universal-Agent-Quality-Gate-Protocol.md
│
└── methods/
    └── methods.csv                    # Method database
```

---

## Quick Start Command

```
Przeprowadź eksperyment testowania protokołu weryfikacyjnego.

KROK 1 - Przeczytaj pliki w tej kolejności:
1. src/testing/framework/universal-test-orchestrator.md
2. src/testing/framework/protocol-registry.md
3. src/testing/framework/universal-metrics.md
4. src/testing/tasks/trap-tasks.md
5. [PROTOCOL_FILE] - wybrany protokół do testowania
6. src/core/methods/methods.csv

KROK 2 - Wykonaj eksperyment:
- Wybierz protokół: [DV-V6 / VGD / QVP / ...]
- Wybierz zadanie: T[1-15]
- Wykonaj Phase 0-5 zgodnie z orchestratorem
- Mierz tokeny i czas dla każdego uruchomienia
- Zapisz wyniki do src/testing/results/experiment-log.md

KROK 3 - Zasady:
- ZAWSZE 3 uruchomienia minimum dla variance
- ZAWSZE blind evaluation
- ZAWSZE mierz tokeny (input + output)
- ZAWSZE mierz czas (start → end)
- Ground-truth.md jest POUFNY
```

---

## File Reading Order

| Order | File | Path | Required |
|-------|------|------|----------|
| 1 | Orchestrator | `src/testing/framework/universal-test-orchestrator.md` | YES |
| 2 | Registry | `src/testing/framework/protocol-registry.md` | YES |
| 3 | Metrics | `src/testing/framework/universal-metrics.md` | YES |
| 4 | Tasks | `src/testing/tasks/trap-tasks.md` | YES |
| 5 | Protocol | `[see Protocol Selection]` | YES |
| 6 | Methods | `src/core/methods/methods.csv` | YES |
| 7 | Method Matrix | `src/testing/framework/method-matrix.md` | OPTIONAL |
| 8 | Ground Truth | `src/testing/tasks/ground-truth.md` | ONLY IN PHASE 3 |

---

## Protocol Selection Guide

| Protocol | ID | Location |
|----------|-----|----------|
| Deep Verify V5 | `DV-V5` | `src/core/workflows/deep-verify/workflow-v5.md` |
| Deep Verify V6 | `DV-V6` | `src/core/workflows/deep-verify/workflow-v6.md` |
| Deep Verify V6.1 | `DV-V6.1` | `src/core/workflows/deep-verify/workflow-v6.1.md` |
| Deep Verify V6.2 | `DV-V6.2` | `src/core/workflows/deep-verify/workflow-v6.2.md` |
| Deep Verify V6.3 | `DV-V6.3` | `src/core/workflows/deep-verify/workflow-v6.3.md` |
| Deep Verify Lite | `DV-LITE` | `src/core/workflows/deep-verify/workflow-v6-lite.md` |
| Tensor V-GD | `VGD` | `src/core/quality_gates/Tensor-Based-Verification-Protocol.md` |
| Quadrant QVP | `QVP` | `src/core/quality_gates/Quadrant-Verification-Protocol.md` |

---

## Critical Rules

### 1. Token Measurement (MANDATORY)

```markdown
## Token Recording

### Agent Run [N]
- Input tokens: [COUNT]
- Output tokens: [COUNT]
- Total: [INPUT + OUTPUT]

### Protocol Run [N]
- Input tokens: [COUNT]
- Output tokens: [COUNT]
- Total: [INPUT + OUTPUT]
```

### 2. Time Measurement (MANDATORY)

```markdown
## Time Recording

### Agent Run [N]
- Start: [HH:MM:SS]
- End: [HH:MM:SS]
- Duration: [SECONDS]

### Protocol Run [N]
- Start: [HH:MM:SS]
- End: [HH:MM:SS]
- Duration: [SECONDS]
```

### 3. Version Checking (MANDATORY for Evolution)

**BEFORE creating a new protocol version:**

```markdown
## Version Check Procedure

### Step 1: List existing versions

For Deep Verify:
```bash
ls src/core/workflows/deep-verify/workflow-v*.md
```

For Quality Gates:
```bash
ls src/core/quality_gates/*.md
```

### Step 2: Parse version numbers

Current versions found:
- workflow-v5.md      → 5.0
- workflow-v6.md      → 6.0
- workflow-v6.1.md    → 6.1
- workflow-v6.2.md    → 6.2
- workflow-v6.3.md    → 6.3

### Step 3: Determine next version

Latest minor: 6.3
Next available minor: 6.4
Next available major: 7.0

### Step 4: Check if proposed version EXISTS

Proposed: workflow-v6.4.md
Check: ls src/core/workflows/deep-verify/workflow-v6.4.md

If EXISTS → INCREMENT (6.4 → 6.5)
If NOT EXISTS → PROCEED
```

### 4. Where to Create New Versions

| Original Protocol Location | New Version Location |
|---------------------------|---------------------|
| `src/core/workflows/deep-verify/workflow-vX.md` | `src/core/workflows/deep-verify/workflow-vX.Y.md` |
| `src/core/quality_gates/Protocol-Name.md` | `src/core/quality_gates/Protocol-Name-v2.md` |

**RULE: New versions go in SAME directory as original, NOT in testing/**

### 5. Version Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Minor increment | v[N].[M+1].md | v6.3 → v6.4 |
| Major increment | v[N+1].md | v6.3 → v7 |
| Experimental | v[N].[M]-[name].md | v6.3-tensor.md |
| Quality Gate v2 | [Name]-v2.md | Tensor-Based-Verification-Protocol-v2.md |

### 6. Blind Evaluation (MANDATORY)

```
BEFORE Phase 3 Step 3:
- DO NOT open ground-truth.md
- DO NOT look at expected errors
- List findings FIRST
- Describe findings FIRST
- THEN open ground-truth.md and match
```

### 7. Variance Handling (MANDATORY)

```
- MINIMUM 3 runs per experiment
- Calculate Mean and StdDev for ALL metrics
- Calculate RS (Run Stability) for reliability
- If RS < 0.6: Results UNRELIABLE
```

---

## Experiment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0: CONFIGURE                                              │
│ • Select protocol from registry                                 │
│ • Select task from trap-tasks.md                               │
│ • Configure runs (minimum 3)                                   │
│ • CHECK: Protocol file exists                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ PHASE 1: AGENT RUNS (×3)                                        │
│ • Give task to agent                                           │
│ • MEASURE: Start time                                          │
│ • MEASURE: Input tokens                                        │
│ • Capture artifact                                             │
│ • MEASURE: Output tokens                                       │
│ • MEASURE: End time                                            │
│ • Save to: src/testing/results/experiments/artifacts/          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ PHASE 2: PROTOCOL RUNS (×3)                                     │
│ • Load protocol from its original location                     │
│ • Invoke with artifact                                         │
│ • MEASURE: Start time, Input tokens                            │
│ • Capture protocol output                                      │
│ • MEASURE: Output tokens, End time                             │
│ • Save to: src/testing/results/verifications/                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ PHASE 3: BLIND EVALUATION                                       │
│ • Normalize findings to common format                          │
│ • List and describe findings FIRST                             │
│ • THEN open src/testing/tasks/ground-truth.md                  │
│ • Match findings to expected errors                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ PHASE 4: CALCULATE METRICS                                      │
│ • Use formulas from universal-metrics.md                       │
│ • Detection: DR, WDS, P, DQ, CC                                │
│ • Efficiency: TE, TiE, TPF, TiPF                               │
│ • Variance: RS, FC                                             │
│ • Composite: OES, CAS                                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ PHASE 5: LOG RESULTS                                            │
│ • Append to: src/testing/results/experiment-log.md             │
│ • Include ALL token/time measurements                          │
│ • Include ALL metrics with variance                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ PHASE 6 (OPTIONAL): COMPARE PROTOCOLS                           │
│ • Save to: src/testing/results/comparisons/                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│ PHASE 7 (OPTIONAL): EVOLVE PROTOCOL                             │
│ • CHECK: New version doesn't exist (see Version Checking)      │
│ • Create new version in SAME location as original              │
│ • Update src/testing/framework/protocol-registry.md            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Version Evolution Procedure

### Step 1: Check Existing Versions

```bash
# For Deep Verify
ls src/core/workflows/deep-verify/workflow-v*.md

# For Quality Gates
ls src/core/quality_gates/*.md
```

### Step 2: Determine Next Version Number

```markdown
## Version Determination

Found versions: v5, v6, v6.1, v6.2, v6.3
Latest: v6.3

Next available:
- v6.4 (minor)
- v7 (major)
```

### Step 3: Create New Version File

```markdown
## New Version Creation

1. CHECK file doesn't exist:
   ls src/core/workflows/deep-verify/workflow-v6.4.md

2. If EXISTS: try v6.5, v6.6, etc.

3. If NOT EXISTS: Create file at:
   src/core/workflows/deep-verify/workflow-v6.4.md

4. Add header:
   ## Workflow v6.4

   Parent: v6.3
   Experiment basis: EXP-[IDs]
   Changes:
   - [list changes from parent]

   Hypotheses:
   - H1: [expected improvement]
```

### Step 4: Update Registry

Add new protocol to `src/testing/framework/protocol-registry.md`

---

## Result Locations

| What | Where |
|------|-------|
| Agent artifacts | `src/testing/results/experiments/artifacts/` |
| Protocol outputs | `src/testing/results/verifications/` |
| Experiment log | `src/testing/results/experiment-log.md` |
| Protocol comparisons | `src/testing/results/comparisons/` |
| **New protocol versions** | **Same directory as original protocol** |

---

## Quick Commands

### Test Single Protocol

```
Test [PROTOCOL_ID] on T[N]:
1. Read framework files from src/testing/framework/
2. Read task from src/testing/tasks/trap-tasks.md
3. Read protocol from its location (see Protocol Selection)
4. Execute Phases 0-5
5. Save results to src/testing/results/
```

### Compare Two Protocols

```
Compare [P1] vs [P2] on T[N]:
1. Test P1 (full experiment)
2. Test P2 (full experiment)
3. Save comparison to src/testing/results/comparisons/
```

### Evolve Protocol

```
Evolve [PROTOCOL_ID] based on EXP-[NNN]:
1. CHECK existing versions (MANDATORY)
2. Determine next version number
3. Create new version in SAME directory as original
4. Update protocol-registry.md
5. Test new version
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Version already exists | Increment: v6.4 → v6.5 |
| Can't find protocol | Check protocol-registry.md for path |
| Token count unavailable | Estimate: ~4 chars/token |
| RS < 0.6 | Increase runs to 5 |
| Ground-truth missing errors | Add to BONUS_VALID, update ground-truth |
