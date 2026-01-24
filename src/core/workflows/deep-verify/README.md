# Deep Verify V12.2 — Documentation

> **Sequential verification workflow with early exit capability.**
> Designed for maximum effectiveness at minimum cost.

---

## Table of Contents

- [Overview](#overview)
- [Core Philosophy](#core-philosophy)
- [Evidence Score System](#evidence-score-system)
- [Workflow Phases](#workflow-phases)
  - [Phase 0: Setup](#phase-0-setup)
  - [Phase 1: Pattern Scan](#phase-1-pattern-scan)
  - [Phase 2: Targeted Analysis](#phase-2-targeted-analysis)
  - [Phase 3: Adversarial Validation](#phase-3-adversarial-validation)
  - [Phase 4: Verdict](#phase-4-verdict)
  - [Phase 5: Report](#phase-5-report)
- [Methods Reference](#methods-reference)
- [Severity Classification](#severity-classification)
- [Pattern Library](#pattern-library)
- [Quick Start Guide](#quick-start-guide)
- [V12.2 Changes](#v122-changes)

---

## Overview

### What is Deep Verify?

Deep Verify is a **systematic verification workflow** designed to evaluate artifacts (specifications, proposals, technical documents, designs) for:

- **Logical soundness** — Are the claims internally consistent?
- **Feasibility** — Do the claims violate known theorems or constraints?
- **Completeness** — Are there gaps or undefined concepts?
- **Grounding** — Are claims supported by evidence?

### What Does It Produce?

The workflow produces one of four verdicts:

| Verdict | Meaning |
|---------|---------|
| **ACCEPT** | Artifact is sound and can proceed |
| **REJECT** | Artifact has critical flaws that must be addressed |
| **UNCERTAIN** | Cannot determine; needs more information or expertise |
| **ESCALATE** | Requires human reviewer due to complexity or stakes |

### When to Use It

- Reviewing technical specifications before implementation
- Evaluating proposals for feasibility
- Checking designs for logical contradictions
- Validating claims in technical documents
- Pre-implementation sanity checks

---

## Core Philosophy

Deep Verify V12.2 is built on six core principles:

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Early Exit** | Stop when evidence is sufficient, not when all methods are exhausted |
| 2 | **Mandatory Quotes** | Every finding must cite exact text — no quote = no finding |
| 3 | **Signal-Based Selection** | Choose analysis methods based on what Phase 1 reveals |
| 4 | **Pattern Matching** | Check against known impossibility patterns before deep analysis |
| 5 | **Adversarial Validation** | Attack your own findings before finalizing |
| 6 | **Bias Awareness** | Actively counteract confirmation bias *(NEW in V12.2)* |

---

## Evidence Score System

The workflow uses a numeric **Evidence Score (S)** to objectively track the weight of findings.

### Base Scoring

| Event | Score Change |
|-------|--------------|
| CRITICAL finding | **+3** |
| IMPORTANT finding | **+1** |
| MINOR finding | **+0.3** |
| Clean method pass | **-0.5** |

### Scoring Clarifications

| Situation | Rule |
|-----------|------|
| New finding from new method | Full points (+3/+1/+0.3) |
| Same finding confirmed by different method | +1 bonus (strengthens evidence) |
| Same finding from same-cluster method | +0 (skip per correlation rule) |
| Finding upgraded during analysis | Add difference (IMPORTANT→CRITICAL = +2) |
| Finding downgraded in Phase 3 | Subtract difference (IMPORTANT→MINOR = -0.7) |

### Decision Thresholds

| Condition | Action |
|-----------|--------|
| **S ≥ 6** AND Pattern Match | → **REJECT** immediately |
| **S ≥ 6** WITHOUT Pattern Match | → Continue to Phase 2 for confirmation |
| **S ≤ -3** | → **ACCEPT** (unless HIGH stakes) |
| **4 ≤ S < 6** | → **BORDERLINE** — mandatory Phase 2+3 |
| **-3 < S < 4** | → **UNCERTAIN** or continue analysis |

---

## Workflow Phases

### Decision Flow Diagram

```
                    ┌─────────────┐
                    │  Phase 0    │
                    │   Setup     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Phase 1    │
                    │Pattern Scan │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         S ≥ 6 +      4 ≤ S < 6    S < 4 or
         Pattern      BORDERLINE   S > -3
              │            │            │
              ▼            │            │
         ┌────────┐        │            │
         │ REJECT │        │            │
         │(early) │        │            │
         └────────┘        │            │
                           │            │
                    ┌──────▼──────┐     │
                    │  Phase 2    │◄────┘
                    │  Targeted   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Phase 3    │  ← MANDATORY
                    │ Adversarial │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
           S ≥ 6      -3 < S < 6     S ≤ -3
              │            │            │
              ▼            ▼            ▼
         ┌────────┐  ┌──────────┐  ┌────────┐
         │ REJECT │  │UNCERTAIN │  │ ACCEPT │
         └────────┘  └──────────┘  └────────┘
```

---

### Phase 0: Setup

> **Time:** 2-5 minutes
> **Purpose:** Establish context and mitigate bias before analysis

#### 0.1 Stakes Assessment

Classify the consequences of incorrect verdicts:

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

#### 0.2 Initial Assessment

Choose one of three modes:

| Mode | When to Use | How It Works |
|------|-------------|--------------|
| **Standard** | Default for LOW/MEDIUM stakes | Record initial impression (Sound/Uncertain/Flawed) |
| **Blind** | Recommended for HIGH stakes | Skip pre-judgment entirely; prevents anchoring bias |
| **Forced Alternative** | When you have strong initial opinion | Must articulate what would change your mind |

#### 0.3 Bias Check

Answer honestly before proceeding:

1. What outcome am I expecting? *(This is your bias)*
2. Am I verifying or confirming?
3. What would make me change my mind?
4. Have I seen similar artifacts before? What happened?
5. Is there external pressure toward a particular verdict?

**Red Flag:** If you expect REJECT from the start → you MUST use Blind or Forced Alternative mode.

---

### Phase 1: Pattern Scan

> **Time:** 5-15 minutes
> **Purpose:** Rapidly identify red flags using cheap, broad methods

#### 1.1 Execute Tier 1 Methods

Execute **ALL** of these (low cost, high discrimination):

| # | Method | Question to Answer |
|---|--------|-------------------|
| 71 | First Principles | Are the fundamental assumptions valid? |
| 100 | Vocabulary Audit | Are key terms used consistently throughout? |
| 17 | Abstraction Laddering | Are abstraction levels coherent and connected? |

#### 1.2 Check Pattern Library

Scan artifact against known impossibility patterns:

**Definitional Contradictions:**
- PFS + Escrow
- Gradual Typing + Termination Guarantee
- Deterministic + Adaptive
- Consistency + Availability (CAP)

**Theorem Violations:**
- VCG + Balanced Budget (Green-Laffont)
- Async + Consensus + f<N/2 (FLP)
- Universal Bug Detection (Halting Problem)

**Statistical Impossibilities:**
- High accuracy without sample size
- Universal performance claims
- Quantum speedup with current technology

**Regulatory Contradictions:**
- FDA Class III + Continuous Learning
- HIPAA + Rich Analytics

#### 1.3 Record Findings

For each finding, use this format:

```
FINDING: [description]
QUOTE: "[exact text from artifact]"
LOCATION: [line number / section]
PATTERN: [which pattern matched, if any]
SEVERITY: [CRITICAL / IMPORTANT / MINOR]
```

> **No quote = no finding.** If you can't point to specific text, it's not a finding.

#### 1.4 Early Exit Check

```
IF S ≥ 6 AND at least one Pattern Library match:
  → STOP. Go directly to Phase 4. Verdict: REJECT

IF S ≥ 6 BUT no Pattern Library match:
  → CAUTION. Proceed to Phase 2 for confirmation.

IF 4 ≤ S < 6 (BORDERLINE):
  → MANDATORY Phase 2 AND Phase 3. No shortcuts.

IF S ≤ -3 AND stakes ≠ HIGH:
  → STOP. Go directly to Phase 4. Verdict: ACCEPT

OTHERWISE:
  → Continue to Phase 2
```

---

### Phase 2: Targeted Analysis

> **Time:** 15-30 minutes
> **Purpose:** Select methods based on Phase 1 signals; confirm or refute hypotheses

#### 2.1 Method Selection by Signal

Choose 2-4 methods based on what Phase 1 revealed:

| Signal Found | Recommended Methods |
|--------------|---------------------|
| **Absolute claims** ("guarantees", "always", "never", "100%", "perfect") | #153 Theoretical Impossibility Check, #154 Definitional Contradiction Detector, #163 Existence Proof Demand |
| **Structural complexity** (multiple subsystems, complex interactions) | #116 Strange Loop Detection, #86 Topological Holes, #159 Transitive Dependency |
| **Ungrounded claims** (assertions without justification) | #85 Grounding Check, #78 Assumption Excavation, #130 Assumption Torture |
| **Diffuse unease** (general unease, can't pinpoint problem) | #84 Coherence Check, #109 Contraposition, #63 Critical Challenge |
| **Clean Phase 1** (looking for hidden issues) | #78 Assumption Excavation, #109 Contraposition, #86 Topological Holes |

#### 2.2 Correlation Rule

Methods in the same cluster often find the same issues. Avoid redundancy:

| Cluster | Methods | Rule |
|---------|---------|------|
| Theory | #153, #154, #163, #162 | If first finds nothing → skip rest |
| Structure | #116, #86, #159 | If first finds nothing → skip rest |
| Grounding | #85, #78, #130 | If first finds nothing → skip rest |
| Challenge | #109, #63, #165 | Lower correlation — can use multiple |

**Rules:**
- First method from cluster found nothing → skip rest of cluster
- First method found something → one more can confirm
- Never execute 3+ methods from same cluster

#### 2.3 Record Method Results

For each method:

```
METHOD: #[number] [name]
WHY SELECTED: [1 sentence — what signal triggered this choice]
LOOKING FOR: [specific thing that would change belief]

CLAIMS EXAMINED:
1. "[quote]" (line X) — [what I tested]
2. "[quote]" (line Y) — [what I tested]

FINDINGS:
- [Finding]: "[quote]" (line Z) — [SEVERITY]

DIRECTION: [Confirms REJECT / Confirms ACCEPT / Neutral]
```

---

### Phase 3: Adversarial Validation

> **Time:** 10-15 minutes
> **Purpose:** Attack your own findings to ensure they survive scrutiny

> ⚠️ **CRITICAL:** This phase is **MANDATORY** for all non-early-exit cases.
> Empirical data shows adversarial review changes verdict direction in 57% of borderline cases.

#### 3.1 Devil's Advocate Prompts

For each finding with severity ≥ IMPORTANT, answer ALL four prompts:

```
FINDING: [description]

□ ALTERNATIVE EXPLANATION
  "What if the author meant X instead of Y?"
  "Is there a reading where this is not a problem?"
  Answer: ________________________________
  Weakens finding? [ ] Yes [ ] No

□ HIDDEN CONTEXT
  "What unstated assumption would make this work?"
  "Is there a footnote/appendix that resolves this?"
  Answer: ________________________________
  Weakens finding? [ ] Yes [ ] No

□ DOMAIN EXCEPTION
  "Is there a known exception in this domain?"
  "Do practitioners actually treat this as a problem?"
  Answer: ________________________________
  Weakens finding? [ ] Yes [ ] No

□ SURVIVORSHIP BIAS
  "Am I focusing on this because I found it first?"
  "What would I conclude if I'd read in different order?"
  Answer: ________________________________
  Weakens finding? [ ] Yes [ ] No

RESULT: ___/4 prompts weaken this finding
ACTION: [ ] Keep severity [ ] Downgrade severity [ ] Remove finding
```

**Rule:** If ≥2 prompts weaken finding → downgrade severity or remove

#### 3.2 Steel-Man the Artifact

Construct the strongest possible case for ACCEPT:

```
Best 3 arguments for why this artifact is sound:

1. [Argument]: ________________________________
   Evidence: ________________________________
   Holds up? [ ] Yes [ ] No

2. [Argument]: ________________________________
   Evidence: ________________________________
   Holds up? [ ] Yes [ ] No

3. [Argument]: ________________________________
   Evidence: ________________________________
   Holds up? [ ] Yes [ ] No

If any steel-man argument holds → reconsider verdict direction
```

#### 3.3 False Positive Checklist

Before finalizing REJECT, verify:

- [ ] Did I search for disconfirming evidence with same rigor as confirming?
- [ ] Could a domain expert reasonably disagree with my interpretation?
- [ ] Is my finding based on what artifact SAYS vs what it IMPLIES?
- [ ] Did I give artifact benefit of the doubt on ambiguous language?
- [ ] Would the original author recognize my characterization as fair?

**If 2+ boxes unchecked → Return to 3.1 with fresh perspective**

---

### Phase 4: Verdict

> **Time:** 2 minutes

#### 4.1 Final Evidence Score

```
Evidence Score S = ____

Calculation:
  Phase 1 findings: ____
  Phase 2 findings: ____
  Clean passes: ____
  Adversarial adjustments: ____
  Total: ____
```

#### 4.2 Decision

| Final Score | Verdict |
|-------------|---------|
| **S ≥ 6** | **REJECT** |
| **S ≤ -3** | **ACCEPT** |
| **-3 < S < 6** | **UNCERTAIN** |

#### 4.3 Confidence Assessment

| Level | Criteria |
|-------|----------|
| **HIGH** | \|S\| > 10, methods agree, adversarial attacks failed |
| **MEDIUM** | 6 ≤ \|S\| ≤ 10, most methods agree, some uncertainty |
| **LOW** | \|S\| near threshold, methods disagree, findings weakened |

#### 4.4 Verdict Validation

**For REJECT verdicts:**
- [ ] At least one CRITICAL finding survived Phase 3
- [ ] Pattern Library match exists OR Phase 2 confirmation obtained
- [ ] False Positive Checklist completed
- [ ] Steel-man arguments addressed

**For ACCEPT verdicts:**
- [ ] All Tier 1 methods passed clean
- [ ] No CRITICAL findings at any phase
- [ ] If IMPORTANT findings existed, all were resolved in Phase 3
- [ ] Steel-man for REJECT was attempted and failed

#### 4.5 Escalation Criteria

Escalate to human reviewer when:

- S is UNCERTAIN (-3 < S < 6) AND stakes are HIGH
- Methods strongly disagree (some REJECT, some ACCEPT)
- Findings require domain expertise you lack
- Novel pattern not in library, uncertain severity
- Multiple steel-man arguments hold
- False Positive Checklist has 2+ unchecked items

---

### Phase 5: Report

Generate a structured report using the template:

```
═══════════════════════════════════════════════════════════════
VERIFICATION REPORT
═══════════════════════════════════════════════════════════════

ARTIFACT: [name]
DATE: [date]
WORKFLOW VERSION: 12.2

───────────────────────────────────────────────────────────────
VERDICT
───────────────────────────────────────────────────────────────

VERDICT: [REJECT / ACCEPT / UNCERTAIN / ESCALATE]
CONFIDENCE: [HIGH / MEDIUM / LOW]
EVIDENCE SCORE: S = [value]
EARLY EXIT: [Yes — Phase X / No — Full process]
PATTERN MATCH: [Yes — pattern name / No]

───────────────────────────────────────────────────────────────
KEY FINDINGS
───────────────────────────────────────────────────────────────

[F1] [SEVERITY] — [Brief description]
     Quote: "[exact text]"
     Location: [line/section]
     Pattern: [pattern name if applicable]
     Survived Phase 3: [Yes / No / N/A]

───────────────────────────────────────────────────────────────
METHODS EXECUTED
───────────────────────────────────────────────────────────────

Phase 1:
  □ #71 First Principles — [Clean / Finding]
  □ #100 Vocabulary Audit — [Clean / Finding]
  □ #17 Abstraction Laddering — [Clean / Finding]
  □ Pattern Library — [No match / Match: pattern name]

Phase 2:
  □ #[X] [Name] — [Clean / Finding]

Phase 3:
  □ Adversarial review — [Findings survived / X findings weakened]
  □ Steel-man — [All failed / X arguments held]
  □ False Positive Checklist — [All checked / X unchecked]

───────────────────────────────────────────────────────────────
NOT CHECKED
───────────────────────────────────────────────────────────────

- [Aspect]: Not examined because [reason]

───────────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────────

[Actions to address findings or caveats for acceptance]

═══════════════════════════════════════════════════════════════
```

---

## Methods Reference

### Tier 1 Methods (Mandatory in Phase 1)

| # | Method | What to Do |
|---|--------|------------|
| **71** | **First Principles** | Identify 3-5 core claims. For each, ask: "What must be fundamentally true?" Check if those fundamentals are stated, justified, and consistent. |
| **100** | **Vocabulary Audit** | Extract all key terms. Find all locations where each is used. Check for synonyms (confusion) and homonyms (contradiction). |
| **17** | **Abstraction Laddering** | Map all abstraction levels (goals → design → implementation). Check vertical coherence, gaps, and orphaned details. |

### Phase 2 Methods

| # | Method | What to Do |
|---|--------|------------|
| **63** | **Critical Challenge** | Assume role of hostile critic. Construct strongest possible argument that artifact is fundamentally flawed. |
| **78** | **Assumption Excavation** | For each mechanism, ask: "What must be true?" Classify assumptions as explicit, implicit, or hidden. Assess risk of hidden ones. |
| **84** | **Coherence Check** | Summarize each section's key claim. Compare claims across sections for support, contradiction, or gaps. |
| **85** | **Grounding Check** | For each significant claim, ask: "What evidence supports this?" Flag claims with missing evidence. |
| **86** | **Topological Holes** | Map component relationships. Find structural gaps where connections are missing or incomplete. |
| **109** | **Contraposition** | For each claim "If A then B", consider "If not-B then not-A". What would have to be true for system to fail? |
| **116** | **Strange Loop Detection** | Build dependency graph. Find cycles. For each, check: breaking condition? dampening? infinite regress risk? |
| **130** | **Assumption Torture** | For each key assumption, imagine it's 10%, 50%, 100% wrong. What happens? Graceful degradation or catastrophic failure? |
| **153** | **Theoretical Impossibility Check** | Identify "too good to be true" claims. Check against known theorems (CAP, FLP, Halting, etc.). |
| **154** | **Definitional Contradiction Detector** | List all requirements. For each, expand: MEANS, IMPLIES, EXCLUDES. Check for pairwise contradictions. |
| **159** | **Transitive Dependency** | Trace dependency chains to find hidden dependencies not immediately obvious. |
| **163** | **Existence Proof Demand** | For unproven claims, demand: "Show me it exists" or "Show me it's been done." |

---

## Severity Classification

### CRITICAL (+3)

Finding **alone** would justify REJECT:

- **Theorem violation** — Contradicts CAP, FLP, Green-Laffont, Halting, Rice, Arrow, No-Free-Lunch
- **Definitional contradiction** — X requires property A, Y requires property ¬A, both claimed
- **Missing critical component** — Component referenced but undefined, others depend on it
- **Regulatory impossibility** — Claims certification incompatible with claimed features
- **Mathematical impossibility** — Claims statistically unachievable
- **Technology impossibility** — Claims results with non-existent technology
- **Universal detection claims** — "100% recall" / "finds all X" for open-ended problem

### IMPORTANT (+1)

Finding contributes to REJECT; 2-3 together would justify REJECT:

- **Section inconsistency** — Section A says X, Section B says Y, incompatible
- **Ungrounded claim** — Assertion without justification or evidence
- **Feedback loop without dampening** — Circular influence without termination
- **Circular dependency** — A depends on B depends on C depends on A
- **Ambiguous terminology** — Same term, different meanings in different places
- **Missing error handling** — No specification of what happens when X fails
- **Undefined core concept** — Key term central to value proposition never defined

### MINOR (+0.3)

Finding only matters if other problems exist:

- **Unclear wording** — Ambiguous but not contradictory
- **Missing non-blocking detail** — Nice to have but not essential
- **Style/formatting issues** — Inconsistent formatting, typos
- **Incomplete example** — Doesn't cover all cases but concept is clear

---

## Pattern Library

### Definitional Contradictions

| Pattern | Claims | Why Impossible |
|---------|--------|----------------|
| **PFS_ESCROW** | "Perfect Forward Secrecy" + "Key recovery" | PFS = past sessions unrecoverable; escrow = recoverable |
| **GRADUAL_TERMINATION** | "Gradual typing" + "Guaranteed termination" | Rice's theorem — non-trivial semantic properties undecidable |
| **DETERMINISTIC_ADAPTIVE** | "Deterministic/reproducible" + "Learning/adaptive" | Deterministic = same input → same output; Adaptive = output changes |
| **CONSISTENCY_AVAILABILITY** | "Strong consistency" + "High availability" + "Partition tolerance" | CAP theorem — can only have two |

### Theorem Violations

| Pattern | Claims | Theorem |
|---------|--------|---------|
| **VCG_BALANCED** | VCG + Strategy-proof + Balanced budget + Individual rationality | Green-Laffont — cannot have all four |
| **ASYNC_CONSENSUS** | Async network + Consensus + f<N/2 faults + Guaranteed termination | FLP impossibility |
| **UNIVERSAL_TERMINATION** | "Detects all infinite loops" / "Guarantees termination" | Halting problem |
| **UNIVERSAL_BUG_DETECTION** | "100% recall" / "Finds all bugs" / "Detects all risks" | Rice's theorem variant |

### Statistical Impossibilities

| Pattern | Claims | Check |
|---------|--------|-------|
| **ACCURACY_WITHOUT_N** | High accuracy (99%+) without sample size | N × prevalence × accuracy ≥ meaningful? |
| **QUANTUM_HYPE** | "Quantum speedup" + current technology | Current NISQ: ~100-1000 noisy qubits; fault-tolerant needs millions |
| **UNVERIFIABLE_OPTIMUM** | "Finds global optimum" for NP-hard problem | How is optimality verified? |
| **FICTIONAL_BENCHMARKS** | "Achieved X" metrics for non-existent technology | Technology timeline check |

### Regulatory Contradictions

| Pattern | Claims | Issue |
|---------|--------|-------|
| **FDA_LEARNING** | FDA Class III + Continuous learning | Class III requires PMA for each model change |
| **HIPAA_ANALYTICS** | HIPAA compliance + Rich patient analytics | De-identification method specified? |
| **LEGAL_ADVICE_AUTOMATION** | "Legally defensible" / "Binding assessments" | Unauthorized practice of law (UPL) |

---

## Quick Start Guide

### Step-by-Step Process

```
1. PHASE 0: SETUP (2-5 min)
   □ Assess stakes: LOW / MEDIUM / HIGH
   □ Choose mode: Standard / BLIND / Forced Alternative
   □ Record initial impression (or BLIND)
   □ Complete bias check

2. PHASE 1: PATTERN SCAN (5-15 min)
   □ Execute #71 First Principles
   □ Execute #100 Vocabulary Audit
   □ Execute #17 Abstraction Laddering
   □ Check Pattern Library
   □ Calculate S
   □ Check early exit conditions

3. PHASE 2: TARGETED ANALYSIS (15-30 min)
   □ Select 2-4 methods based on signals
   □ Apply correlation rule
   □ Execute selected methods
   □ Update S after each method

4. PHASE 3: ADVERSARIAL (10-15 min) — MANDATORY
   □ Devil's advocate for each IMPORTANT+ finding
   □ Steel-man the artifact (3 arguments for ACCEPT)
   □ Complete False Positive Checklist (if heading to REJECT)
   □ Reconcile and adjust S

5. PHASE 4: VERDICT
   □ Calculate final S
   □ Apply threshold: S≥6=REJECT, S≤-3=ACCEPT, else UNCERTAIN
   □ Assess confidence
   □ Complete validation checklist
   □ Check escalation criteria

6. PHASE 5: REPORT
   □ Generate report using template
   □ Include all findings with quotes
   □ Document what was NOT checked
```

### Severity Quick Reference

```
CRITICAL (+3): Theorem violation, definitional contradiction,
               regulatory impossibility, technology impossibility,
               universal detection claims

IMPORTANT (+1): Section inconsistency, ungrounded claim,
                circular dependency, undefined core concept

MINOR (+0.3):   Unclear wording, missing non-blocking detail

CLEAN PASS (-0.5): Method found no issues
```

### Pattern Quick Reference

```
PFS + Escrow                              = Contradiction
Gradual Typing + Termination              = Rice's theorem
VCG + Balanced Budget                     = Green-Laffont
Consistency + Availability + Partition    = CAP theorem
Async + Consensus + f<N/2 + Termination   = FLP impossibility
Universal termination checking            = Halting Problem
Universal risk/bug detection              = Halting variant
Deterministic + Adaptive                  = Contradiction
FDA Class III + Continuous Learning       = Regulatory violation
Legal advice automation                   = UPL violation
High accuracy + insufficient N            = Statistical impossibility
Quantum speedup + current tech            = Technology impossibility
"Achieved" + non-existent tech            = Fictional benchmark
Undefined central term                    = Ungrounded core
```

---

## V12.2 Changes

### New Features

| Feature | Description |
|---------|-------------|
| **Bias Awareness** | Added as 6th core principle |
| **Blind Mode** | Skip pre-judgment for HIGH stakes cases |
| **Forced Alternative Mode** | Must articulate what would change your mind |
| **Borderline Range** | 4 ≤ S < 6 requires mandatory Phase 2+3 |
| **Mandatory Phase 3** | Adversarial validation required for all non-early-exit cases |
| **False Positive Checklist** | New validation before REJECT |
| **ACCEPT Validation Checklist** | New validation before ACCEPT |
| **Calibration Guidance** | Track accuracy over time |

### New Patterns Added

- Universal Risk Detection (Halting variant)
- Legal Advice Automation (UPL violation)
- Fictional Benchmarks (technology impossibility)
- Undefined Key Term (ungrounded core)

### Changed Behavior

| Before V12.2 | V12.2 |
|--------------|-------|
| S ≥ 6 → immediate REJECT | S ≥ 6 WITHOUT pattern match → continue to Phase 2 |
| Phase 3 optional | Phase 3 MANDATORY |
| No explicit ACCEPT guidance | Full ACCEPT case guidance in Appendix F |

---

## Calibration

### Tracking Accuracy

Record verdicts and ground truth when available:

| Date | Artifact | Verdict | Confidence | S | Ground Truth | Correct? |
|------|----------|---------|------------|---|--------------|----------|
| | | | | | | |

### Expected Calibration

| Confidence | Expected Accuracy |
|------------|-------------------|
| HIGH | >90% correct |
| MEDIUM | 70-90% correct |
| LOW | 50-70% correct |

### When to Recalibrate

- False negative discovered (accepted artifact that failed)
- Pattern Library miss (new impossibility pattern found)
- Systematic bias detected (always REJECT, never ACCEPT)
- Domain expansion (workflow used in new domain)

---

## License

This workflow is part of the BMAD-METHOD project.
