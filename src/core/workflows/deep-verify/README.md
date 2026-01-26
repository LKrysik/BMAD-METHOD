# Deep Verify V2.0

**A modular, data-driven verification workflow for LLMs that systematically audits artifacts through 6 phases (+ 1 optional): bias-aware setup, pattern scan, targeted analysis, mandatory adversarial self-critique, verdict, report, and optional pattern candidate evaluation. Uses 19 tiered methods, 24 impossibility patterns, cumulative evidence scoring, and a Pattern Update Protocol (PUP) to produce quote-grounded REJECT/ACCEPT/UNCERTAIN verdicts and continuously improve detection capabilities.**

---

## What is Deep Verify?

Deep Verify is a structured verification framework designed for AI agents (LLMs) to rigorously evaluate documents, specifications, proposals, and other text artifacts. Instead of producing subjective opinions, it enforces a disciplined, multi-phase process that:

- **Quantifies credibility** through a cumulative Evidence Score (S)
- **Detects known impossibilities** via a library of 24 patterns grounded in mathematical theorems (CAP, FLP, Halting Problem, Arrow's, Rice's, etc.)
- **Prevents confirmation bias** through mandatory adversarial self-critique
- **Requires material evidence** — every finding must cite exact quotes from the artifact ("NO QUOTE = NO FINDING")
- **Supports early termination** when evidence is overwhelming, saving effort
- **Produces structured reports** with full traceability from findings to verdict

Deep Verify does not verify code execution or runtime behavior. It verifies the **logical soundness, internal consistency, and theoretical validity** of written artifacts.

---

## How It Works

### The Pipeline (6 Phases + 1 Optional)

```
Phase 0: SETUP          Assess stakes, document biases, select mode
    |
Phase 1: PATTERN SCAN   Run 3 mandatory methods, check against Pattern Library
    |
    |--- Early exit possible (S >= 6 with pattern match -> REJECT)
    |--- Early exit possible (S <= -3, low stakes -> ACCEPT)
    |
Phase 2: TARGETED        Select 2-4 methods based on Phase 1 signals
    |
Phase 3: ADVERSARIAL     Attack own findings, steel-man opposite verdict (MANDATORY)
    |
Phase 4: VERDICT         Calculate final score, determine verdict + confidence
    |
Phase 5: REPORT          Generate structured verification report
    |
   [If CRITICAL finding survived Phase 3 without Pattern Library match]
    |
Phase 6: PATTERN CANDIDATE EVALUATION (OPTIONAL, user-triggered)
```

### Evidence Score (S)

Every finding contributes to a cumulative score. Every clean method pass reduces it. The final score determines the verdict:

| Score Range | Verdict | Meaning |
|-------------|---------|---------|
| S >= 6 | **REJECT** | Artifact has critical flaws |
| S <= -3 | **ACCEPT** | Artifact is sound |
| -3 < S < 6 | **UNCERTAIN** | Insufficient evidence either way |

### Scoring Rules

| Event | Points |
|-------|--------|
| CRITICAL finding | +3 |
| IMPORTANT finding | +1 |
| MINOR finding | +0.3 |
| Clean method pass | -0.5 |
| Pattern Library match bonus | +1 |
| Cross-cluster confirmation bonus | +1 |

Phase 3 can **downgrade** (CRITICAL -> IMPORTANT = -2, IMPORTANT -> MINOR = -0.7) or **remove** findings entirely, adjusting the score accordingly.

---

## The 19 Verification Methods

Methods are organized into 3 tiers that map to workflow phases:

### Tier 1 — Mandatory (Phase 1: Pattern Scan)

All three are always executed. They provide broad, cheap coverage:

| # | Method | What It Does |
|---|--------|-------------|
| 71 | **First Principles Analysis** | Strips assumptions to identify core claims, checks if fundamentals are stated, justified, and mutually consistent |
| 100 | **Vocabulary Consistency** | Extracts all key terms, finds synonyms (same concept, different words) and homonyms (same word, different meanings) |
| 17 | **Abstraction Laddering** | Checks vertical coherence between goals, design, and implementation levels; finds gaps and orphan details |

### Tier 2 — Signal-Based (Phase 2: Targeted Analysis)

Selected based on Phase 1 signals. 2-4 methods executed per verification:

| # | Method | Cluster | Triggered By |
|---|--------|---------|-------------|
| 153 | **Theoretical Impossibility Check** | Theory | Absolute claims ("guarantees", "always", "100%") |
| 154 | **Definitional Contradiction Detector** | Theory | Absolute claims |
| 163 | **Existence Proof Demand** | Theory | Absolute claims |
| 162 | **Theory-Dependence Verification** | Theory | Absolute claims |
| 116 | **Strange Loop Detection** | Structure | Structural complexity, dependencies |
| 86 | **Topological Hole Detection** | Structure | Structural complexity |
| 159 | **Transitive Dependency Closure** | Structure | Structural complexity |
| 85 | **Grounding Check** | Grounding | Ungrounded claims, missing evidence |
| 78 | **Assumption Excavation** | Grounding | Ungrounded claims, clean Phase 1 |
| 130 | **Assumption Torture** | Grounding | Ungrounded claims |
| 84 | **Coherence Check** | Coherence | Diffuse belief, general unease |
| 87 | **Falsifiability Check** | Coherence | Theorem violations |
| 109 | **Contraposition Inversion** | Challenge | Diffuse belief, clean Phase 1 |
| 165 | **Constructive Counterexample** | Challenge | Absolute claims |

### Tier 3 — Adversarial (Phase 3)

| # | Method | What It Does |
|---|--------|-------------|
| 63 | **Challenge from Critical Perspective** | Devil's advocate attacking all findings; steel-manning the opposite verdict |

### Method Clusters (Correlation Rules)

Methods within the same cluster probe similar angles. To prevent redundancy:

- **HIGH correlation clusters** (Theory, Structure, Grounding): If the first method finds nothing, skip the rest of the cluster. If it finds something, one more can confirm. Never 3+ from the same cluster.
- **MEDIUM correlation clusters** (Challenge, Coherence): More flexibility, but still avoid using all methods from one cluster.

---

## Pattern Library — 24 Known Impossibility Patterns

The Pattern Library enables rapid detection of artifacts that violate known theorems or contain definitional contradictions. A pattern match adds +1 bonus to the score and enables early exit.

### Definitional Contradictions (DC-001 to DC-004)

| ID | Pattern | Why Impossible |
|----|---------|---------------|
| DC-001 | PFS + Key Escrow | Forward secrecy means past sessions are unrecoverable; escrow means they ARE recoverable |
| DC-002 | Gradual Typing + Guaranteed Termination | Rice's theorem: non-trivial semantic properties are undecidable with dynamic typing |
| DC-003 | Deterministic + Adaptive | Same input/same output contradicts learning/self-improvement (unless scoped) |
| DC-004 | CAP Theorem Violation | Cannot have strong consistency + high availability + partition tolerance simultaneously |

### Theorem Violations (TV-001 to TV-005)

| ID | Pattern | Theorem |
|----|---------|---------|
| TV-001 | VCG + Balanced Budget | Green-Laffont impossibility |
| TV-002 | Async Consensus + Fault Tolerance + Termination | FLP impossibility |
| TV-003 | Universal Termination Detection | Halting problem (Turing) |
| TV-004 | Universal Bug/Risk Detection (100% recall) | Rice's theorem |
| TV-005 | Perfect Voting System | Arrow's impossibility theorem |

### Statistical Impossibilities (SI-001 to SI-004)

| ID | Pattern | Issue |
|----|---------|-------|
| SI-001 | High Accuracy Without Sample Size | 99.9% claims need N x prevalence validation |
| SI-002 | Quantum Speedup Claims | No proven quantum speedup for general optimization; NISQ limitations |
| SI-003 | Unverifiable Global Optimum | NP-hard problems cannot prove optimality without exhaustive search |
| SI-004 | Fictional Benchmarks | Presenting projected results as "achieved" with non-existent technology |

### Regulatory Contradictions (RC-001 to RC-003)

| ID | Pattern | Conflict |
|----|---------|----------|
| RC-001 | FDA Class III + Continuous Learning | PMA required for each model change vs. constant changes |
| RC-002 | HIPAA Compliance + Rich Analytics | De-identification required vs. analytics enabling re-identification |
| RC-003 | Automated Legal Advice | Unauthorized Practice of Law without attorney involvement |

### Ungrounded Core Concepts (UG-001 to UG-003)

| ID | Pattern | Problem |
|----|---------|---------|
| UG-001 | Undefined Central Concept | Key term central to value proposition lacks operational definition |
| UG-002 | Circular Definition | X defined via Y, Y defined via X — no actual meaning |
| UG-003 | Scope Creep Definition | Same term means different things in different sections |

---

## Phase-by-Phase Detail

### Phase 0: Setup (`steps/step-00-setup.md`)

**Goal:** Assess stakes, document biases, prepare for honest verification.

- **Stakes Assessment:** LOW (minor rework, <$10K) / MEDIUM ($10K-$100K) / HIGH (>$100K, safety, reputation). HIGH stakes disable early ACCEPT and recommend Blind Mode.
- **Bias Mode Selection:**
  - *Standard* — Record initial impression and expected outcome
  - *Blind* — Skip initial assessment entirely to prevent anchoring (recommended for HIGH stakes)
  - *Forced Alternative* — Must articulate what would change your mind in both directions
- **Bias Check:** 5 questions forcing honest self-examination of expectations and pressures
- **Red Flag:** If you expect REJECT and assessed "probably flawed", Blind Mode becomes mandatory

### Phase 1: Pattern Scan (`steps/step-01-pattern-scan.md`)

**Goal:** Rapidly identify red flags using broad, cheap methods.

- Execute all 3 Tier 1 methods (#71, #100, #17)
- For each finding: record quote, location, severity, check against Pattern Library
- Calculate Evidence Score S
- **Early Exit Check:**
  - S >= 6 AND pattern match -> **REJECT** (skip to Phase 4)
  - S <= -3 AND stakes != HIGH -> **ACCEPT** (skip to Phase 4)
  - Otherwise -> continue to Phase 2

### Phase 2: Targeted Analysis (`steps/step-02-targeted.md`)

**Goal:** Confirm or refute hypotheses using signal-driven method selection.

- Analyze Phase 1 signals (absolute claims? structural complexity? ungrounded claims? diffuse belief? clean scan?)
- Consult `method-clusters.yaml` signal-to-cluster mapping
- Select 2-4 methods respecting cluster correlation rules
- Execute each method using its procedure file from `data/method-procedures/`
- Update score after each method
- Check method agreement across directions

### Phase 3: Adversarial Validation (`steps/step-03-adversarial.md`)

**Goal:** Attack your own findings to ensure they survive scrutiny. **THIS PHASE IS MANDATORY.**

For each IMPORTANT+ finding, answer 4 adversarial prompts:
1. **Alternative Explanation** — "What if the author meant X instead of Y?"
2. **Hidden Context** — "What unstated assumption would make this work?"
3. **Domain Exception** — "Is there a known exception in this domain?"
4. **Survivorship Bias** — "Am I focusing on this because I found it first?"

If 2+ prompts weaken a finding, it gets downgraded or removed.

Then:
- **Steel-Man:** Construct the strongest possible case for the opposite verdict (3 arguments)
- **False Positive Checklist** (before REJECT): 5 fairness checks; 2+ unchecked = return to adversarial review

### Phase 4: Verdict (`steps/step-04-verdict.md`)

**Goal:** Calculate final score, determine verdict, assess confidence.

- Verify score calculation across all phases
- Apply verdict rules: S >= 6 -> REJECT, S <= -3 -> ACCEPT, else -> UNCERTAIN
- Validate verdict with appropriate checklist (REJECT requires surviving CRITICAL finding; ACCEPT requires failed steel-man)
- Assign confidence: HIGH (|S| > 10, methods agree) / MEDIUM (6 <= |S| <= 10) / LOW (near threshold, disagreement)
- Check escalation criteria (mandatory for UNCERTAIN + HIGH stakes, or strong method disagreement)

### Phase 5: Report (`steps/step-05-report.md`)

**Goal:** Generate comprehensive, structured verification report.

The report includes: Verdict, Executive Summary, Key Findings (with quotes), Score Calculation breakdown, Methods Executed per phase, Adversarial Review Details, NOT CHECKED section, Recommendations, and (if applicable) a Pattern Candidate Note.

If a CRITICAL finding survived Phase 3 without a Pattern Library match, the report includes a **passive note** informing the user that Phase 6 is available — but does not interactively ask. The user decides on their own.

### Phase 6: Pattern Candidate Evaluation (`steps/step-06-pattern-candidate.md`) — OPTIONAL

**Goal:** Evaluate whether deep-verify findings warrant new Pattern Library entries.

This phase activates **only** when:
- User explicitly requests pattern evaluation after receiving the report
- A CRITICAL finding survived Phase 3 with no Pattern Library match and is grounded in a theorem, definition, or regulation

**Key distinction:** The Pattern Library contains **impossibilities**, not **incompleteness**. "Missing details about X" does NOT qualify. "X contradicts Y by theorem/definition" DOES qualify.

The evaluation process:
1. **Existing Pattern Coverage Check** — verify the finding isn't a detection failure of an existing pattern
2. **Significance Pre-Check** — 5 mandatory questions (all must be YES): recurring? verdict-changing? grounded? not already covered? precise signals?
3. **Draft Pattern Proposal** — fill structured YAML template with signals, explanation, check question, and mandatory `falsified_if` field
4. **Self-Challenge (Triangular Validation)** — attempt to construct counterexamples that break the proposed pattern
5. **Signal Specificity Check** — verify signals don't match valid artifacts (test against 3 valid artifact types)
6. **Recommendation** — VALIDATED / PROVISIONAL / DEFERRED / REJECTED

**Human gate:** The agent NEVER modifies `pattern-library.yaml` directly. Phase 6 produces a Pattern Candidate Report (recommendation only). A human must review and approve before adding to the library.

---

## Directory Structure and File Reference

```
deep-verify/
|-- workflow.md                         # Entry point and quick reference
|-- README.md                           # This file
|-- steps/
|   |-- step-00-setup.md               # Phase 0: Stakes + Bias Assessment
|   |-- step-01-pattern-scan.md        # Phase 1: Tier 1 methods + Pattern Library
|   |-- step-02-targeted.md            # Phase 2: Signal-based method selection
|   |-- step-03-adversarial.md         # Phase 3: Devil's advocate + Steel-man
|   |-- step-04-verdict.md             # Phase 4: Score calculation + Decision
|   |-- step-05-report.md              # Phase 5: Report generation
|   +-- step-06-pattern-candidate.md   # Phase 6: Pattern candidate evaluation (optional)
+-- data/
    |-- methods.csv                     # Method catalog (19 methods with tiers)
    |-- method-procedures/              # Individual method procedure files (18)
    |   |-- 017_Abstraction_Laddering.md
    |   |-- 063_Challenge_from_Critical_Perspective.md
    |   |-- 071_First_Principles_Analysis.md
    |   |-- 078_Assumption_Excavation.md
    |   |-- 084_Coherence_Check.md
    |   |-- 085_Grounding_Check.md
    |   |-- 086_Topological_Hole_Detection.md
    |   |-- 087_Falsifiability_Check.md
    |   |-- 100_Vocabulary_Consistency.md
    |   |-- 109_Contraposition_Inversion.md
    |   |-- 116_Strange_Loop_Detection.md
    |   |-- 130_Assumption_Torture.md
    |   |-- 153_Theoretical_Impossibility_Check.md
    |   |-- 154_Definitional_Contradiction_Detector.md
    |   |-- 159_Transitive_Dependency_Closure.md
    |   |-- 162_Theory_Dependence_Verification.md
    |   |-- 163_Existence_Proof_Demand.md
    |   +-- 165_Constructive_Counterexample.md
    |-- pattern-library.yaml            # 24 known impossibility patterns
    |-- severity-scoring.yaml           # Scoring rules and adjustment logic
    |-- method-clusters.yaml            # Cluster correlation rules + selection algorithm
    |-- decision-thresholds.yaml        # Verdict thresholds, confidence, escalation
    |-- report-template.md              # Standardized report output format
    |-- pattern-update-protocol.yaml   # Pattern Update Protocol (PUP)
    |-- examples.md                     # 4 worked scoring examples
    +-- calibration.yaml                # Accuracy tracking and recalibration
```

### File Purposes

| File | Role | When Loaded |
|------|------|-------------|
| **`workflow.md`** | Entry point and orchestrator. Contains the quick execution path, scoring reference, method quick reference, and pattern library summary. An LLM agent reads this first to understand the full process. | Always first |
| **`steps/step-00-setup.md`** | Stakes assessment (LOW/MEDIUM/HIGH), bias mode selection (Standard/Blind/Forced Alternative), bias check questionnaire, and frontmatter initialization. Contains HALT points requiring user input. | Start of verification |
| **`steps/step-01-pattern-scan.md`** | Execution of all 3 Tier 1 methods with structured templates. Finding recording with mandatory quotes. Pattern Library matching. Score calculation. Early exit decision tree. | After setup |
| **`steps/step-02-targeted.md`** | Signal analysis from Phase 1. Method selection using cluster mapping algorithm. Execution of 2-4 Tier 2 methods with procedure file loading. Method agreement assessment. | When no early exit |
| **`steps/step-03-adversarial.md`** | 4 adversarial prompts per IMPORTANT+ finding. Steel-man construction (3 arguments for opposite verdict). False Positive Checklist (5 items). Score adjustments for downgrades/removals. | Mandatory after Phase 2 |
| **`steps/step-04-verdict.md`** | Final score verification. Verdict determination per thresholds. Validation checklists per verdict type. Confidence level assignment. Escalation criteria check. | After adversarial or early exit |
| **`steps/step-05-report.md`** | Report template population. Section-by-section data gathering from frontmatter. Report validation checklist. Finalization and post-report actions. Pattern Candidate Note (passive) for CRITICAL findings without pattern match. | After verdict |
| **`steps/step-06-pattern-candidate.md`** | Optional Pattern Candidate Evaluation. Existing pattern coverage check, significance pre-check (impossibility vs incompleteness gate), proposal drafting, triangular validation (counterexample + signal precision), and recommendation (VALIDATED/PROVISIONAL/DEFERRED/REJECTED). Produces Pattern Candidate Report for human review. | User-triggered after report |
| **`data/methods.csv`** | Tabular catalog of all 19 methods: ID, category, name, description, output pattern, when to load, tier assignment. The single source of truth for method metadata. | Phase 1 and 2 |
| **`data/method-procedures/*.md`** | Individual procedure files for each method. Each contains: tier designation, purpose, step-by-step instructions, output format template, and finding/severity guidance. Loaded on-demand when a method is selected for execution. | When executing specific method |
| **`data/pattern-library.yaml`** | 24 known impossibility patterns organized into 5 categories. Each pattern has: ID, name, signal keywords, explanation of why it's impossible, referenced theorems, detection methods, severity, and a check question. | Phase 1 and 2 |
| **`data/severity-scoring.yaml`** | Complete scoring system: base scores per severity level, bonus rules (pattern match, cross-cluster confirmation), score calculation formula, severity anchoring checklists, and Phase 3 adjustment rules (4 adversarial prompts with downgrade/removal logic). | All scoring phases |
| **`data/method-clusters.yaml`** | 5 method clusters with correlation levels (HIGH/MEDIUM). Signal-to-cluster mapping for Phase 2 method selection. Selection algorithm (4 steps). Tier 1 and Tier 3 method listings. Loading instructions and cluster constraint rules. | Phase 2 |
| **`data/decision-thresholds.yaml`** | Evidence thresholds for early exit (REJECT_EARLY, ACCEPT_EARLY, BORDERLINE, CONTINUE). Final verdict rules with validation checklists. Confidence levels (HIGH/MEDIUM/LOW) with conditions. Stakes assessment criteria. Escalation criteria (mandatory and recommended) with output template. | Phase 0, 1, 4 |
| **`data/report-template.md`** | Standardized report structure with placeholders. Sections: Verdict, Executive Summary, Key Findings, Score Calculation, Methods Executed, Adversarial Review Details, NOT CHECKED, Recommendations, Pattern Candidate Note, Metadata. Generation checklist. | Phase 5 |
| **`data/pattern-update-protocol.yaml`** | Pattern Update Protocol (PUP). Defines the 6-step process for adding/updating patterns: Propose → Verify (type-specific gates) → Challenge (triangular validation) → Test → Review → Maintain. Includes qualification classes (THEOREM/DEFINITION fast track, REGULATION/STATISTICAL full track, OBSERVATION rejected), significance checklist, proposal template, integration triggers, and human gate requirement. | Phase 6 |
| **`data/examples.md`** | 4 complete worked examples showing end-to-end score calculation: (1) Early REJECT with pattern match, (2) Full process to UNCERTAIN, (3) Full process to ACCEPT, (4) Borderline case with Phase 2+3. Includes score trajectories reference table. | Learning and debugging |
| **`data/calibration.yaml`** | Post-verification accuracy tracking framework. Calibration log template. Expected accuracy targets by confidence level. Primary metrics (TPR, TNR, FPR, FNR). Recalibration triggers. Ground truth sources. | Post-verification audits |

---

## Key Design Principles

### 1. Anti-Bias by Design

The workflow enforces bias mitigation at multiple levels:
- Phase 0 makes you declare your expectations and biases before starting
- Blind Mode prevents anchoring on initial impressions
- Phase 3 forces you to attack your own conclusions
- Steel-manning demands constructing the strongest case against your verdict
- False Positive Checklist prevents unfair REJECT verdicts

### 2. Efficiency Through Clustering

Methods that probe similar angles are grouped into clusters with correlation rules. This prevents wasting effort on redundant analysis — if one structural method finds nothing, the other structural methods are skipped.

### 3. Pattern-Based Early Exit

When a finding matches a known impossibility pattern (e.g., claiming PFS + key escrow), the system can terminate early with high confidence. This is grounded in mathematical theorems, not heuristics.

### 4. Modular Resumability

Every step maintains state in YAML frontmatter (`stepsCompleted`, `currentStep`, `currentScore`, `findings`, etc.). If a verification is interrupted, it can resume from any phase with full context preserved.

### 5. Mandatory Adversarial Phase

Phase 3 is never skipped (except for early exit with pattern match). This is the system's built-in epistemic humility — it doesn't trust its own conclusions without subjecting them to structured criticism.

### 6. Quote-Grounded Findings

Every finding requires an exact quote from the artifact. This prevents hallucinated or vague criticisms and ensures traceability from verdict to evidence.

---

## Pattern Update Protocol (PUP)

The Pattern Library is not static. When Deep Verify discovers CRITICAL findings that survive adversarial review and don't match any existing pattern, they may represent new impossibility patterns worth codifying. The **Pattern Update Protocol** (`data/pattern-update-protocol.yaml`) governs this process.

### When PUP Activates

| Trigger | Strength | Condition |
|---------|----------|-----------|
| **Post-Report Note** | STRONG | CRITICAL finding + survived Phase 3 + no Pattern Library match |
| **Calibration Review** | MEDIUM | Ground truth reveals false negative, OR same finding type appears 3+ times across DIFFERENT domains |
| **User Request** | USER_DIRECTED | User explicitly requests pattern evaluation after any deep-verify |

The report includes a **passive note** (not an interactive question) when a pattern candidate is detected. The user decides independently whether to trigger Phase 6.

### Qualification Classes

Not every finding qualifies for the Pattern Library. Only **impossibilities** qualify — not **incompleteness**.

| Class | Track | Initial Status | Example |
|-------|-------|---------------|---------|
| **THEOREM-based** | Fast Track | VALIDATED | CAP violation, FLP violation |
| **DEFINITION-based** | Fast Track | VALIDATED | PFS + Escrow, Stateless + Sessions |
| **REGULATION-based** | Full Track | PROVISIONAL | FDA Class III + Continuous Learning |
| **STATISTICAL-based** | Full Track | PROVISIONAL | Accuracy without N |
| **OBSERVATION-based** | Does NOT qualify | — | "Section 3 is unclear" |

### The 6-Step PUP Process

```
1. PROPOSE      Fill proposal template (signals, why_impossible, check, falsified_if)
       |
2. VERIFY       Pass type-specific gate (theorem source? definition expansion? legal citation?)
       |
3. CHALLENGE    Triangular Validation — ALL THREE must pass:
       |           • Theorem/definition check
       |           • Counterexample challenge (adversarial mode)
       |           • Signal precision test (0 false matches on valid artifacts)
       |
4. TEST         Run signals against known-good and known-bad artifacts (skip for Fast Track)
       |
5. REVIEW       Independent review of complete proposal
       |
6. MAINTAIN     Track accuracy, re-verify regulatory patterns every 12 months
```

### Human Gate

The AI agent **never** modifies `pattern-library.yaml` directly. Phase 6 produces a **Pattern Candidate Report** (recommendation only). A human must review and approve before any pattern enters the library. This is non-negotiable.

### Pattern Statuses

- **VALIDATED** — Fully verified, counts toward scoring. Theorem and definition patterns start here.
- **PROVISIONAL** — Under observation, counts toward scoring but flagged. Promoted to VALIDATED after 5+ true matches. Regulation and statistical patterns start here.

---

## Data Flow

```
                         methods.csv
                             |
                    method-procedures/*.md
                             |
                             v
step-00 --> step-01 -----> step-02 -----> step-03 --> step-04 --> step-05
  |           |   |          |               |           |           |
  v           v   v          v               v           v           v
decision-  pattern- severity- method-     severity-  decision-  report-
thresholds library  scoring   clusters    scoring    thresholds template
  .yaml     .yaml   .yaml     .yaml       .yaml      .yaml      .md
                                                                    |
                                                          [passive note if
                                                           pattern candidate]
                                                                    |
                                                                    v
                                                               step-06
                                                              (OPTIONAL)
                                                                 |   |
                                                                 v   v
                                                          pattern-  pattern-
                                                          update-   library
                                                          protocol  .yaml
                                                           .yaml
```

### Cross-Reference Map

- **`severity-scoring.yaml`** is the most referenced file (used by 4 of 6 steps)
- **`decision-thresholds.yaml`** is used by 3 steps (setup, pattern scan, verdict)
- **`pattern-library.yaml`** is used by 3 steps (pattern scan, targeted, pattern candidate evaluation)
- **`pattern-update-protocol.yaml`** is used by Phase 6 (pattern candidate evaluation) and calibration reviews
- **`method-clusters.yaml`** is used only by Phase 2 (targeted analysis)
- **`report-template.md`** is used only by Phase 5 (report generation)
- **`calibration.yaml`** and **`examples.md`** are operational/educational — not consumed by the main pipeline (calibration references PUP for pattern library miss triggers)

---

## Frontmatter State Schema

Each verification session tracks its full state:

```yaml
---
workflow: deep-verify
artifact: "[artifact name]"
started: "[ISO timestamp]"
stakes: LOW | MEDIUM | HIGH
bias_mode: Standard | Blind | ForcedAlternative
initial_assessment: ProbablySound | Uncertain | ProbablyFlawed | BLIND
expected_outcome: "[from bias check]"
change_mind_criteria: "[from bias check]"

stepsCompleted: [0, 1, 2, ...]
currentStep: 0-5
currentScore: 0.0
scoreHistory:
  - step: 1
    methods: [71, 100, 17]
    delta: "[details]"
    total: 0.0

findings:
  - id: F1
    severity: CRITICAL | IMPORTANT | MINOR
    description: "[description]"
    quote: "[exact text from artifact]"
    location: "[line/section]"
    pattern: "[pattern_id or null]"
    method: 71
    survived_phase3: true | false | null

patternsMatched: []
methodsExecuted:
  - method_id: 71
    name: "First Principles Analysis"
    result: Clean | Finding

earlyExit: false
earlyExitReason: null
verdict: REJECT | ACCEPT | UNCERTAIN | ESCALATE | null
confidence: HIGH | MEDIUM | LOW | null

# Phase 6 (optional, added after pattern candidate evaluation)
pattern_candidates:
  - finding_id: F1
    proposed_pattern: "[name]"
    recommendation: VALIDATED | PROVISIONAL | DEFERRED | REJECTED
    added_to_library: false  # Updated after human review
---
```

---

## Quick Start

### New Verification

```
1. Load: workflow.md
2. Follow the Quick Execution Path
3. Load step files and data files as needed
4. Output the final verification report
```

### Resume Interrupted Verification

```
1. Check frontmatter for stepsCompleted and currentStep
2. Load the appropriate step file: steps/step-{currentStep}.md
3. Continue from where you left off
```

---

## Worked Example Summary

The `data/examples.md` file contains 4 complete worked examples:

| Example | Artifact | Path | Final S | Verdict |
|---------|----------|------|---------|---------|
| 1 | Crypto protocol (PFS + escrow) | Phase 1 -> Phase 2 -> Early Exit | 7.5 | REJECT (HIGH confidence) |
| 2 | AI recommendation system | Full process (Phase 1-4) | 0.1 | UNCERTAIN (LOW confidence) |
| 3 | REST API specification | Full process (Phase 1-4) | -2.2 | ACCEPT with caveat (MEDIUM confidence) |
| 4 | ML pipeline specification | Full process with borderline | 1.6 | UNCERTAIN, ACCEPT recommended |

---

## Version History

| Version | Changes |
|---------|---------|
| **V2.0 + PUP** | Added Pattern Update Protocol: `data/pattern-update-protocol.yaml` (6-step process with qualification classes, triangular validation, human gate) and `steps/step-06-pattern-candidate.md` (optional Phase 6). Updated report template with Pattern Candidate Note section. Updated calibration.yaml to reference PUP. Added library_metadata to pattern-library.yaml. |
| **V2.0** | Modular refactor: 6 step files, 8 data files, 18 method procedure files. Separated concerns for maintainability. Added method-clusters.yaml for selection optimization. |
| **V12.2** | Added bias mitigation (3 modes), mandatory Phase 3, ACCEPT guidance, calibration framework. Original single-file workflow. |
