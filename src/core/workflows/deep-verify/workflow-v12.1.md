# Deep Verify V12.1 — Empirically Grounded Verification

## Overview

Sequential verification workflow with early exit capability. Designed for maximum effectiveness at minimum cost.

**Core Principles:**
1. **Early Exit** — Stop when evidence is sufficient, not when all methods are exhausted
2. **Mandatory Quotes** — No quote, no finding. Every claim must cite artifact text.
3. **Signal-Based Selection** — Choose methods based on what Phase 1 reveals
4. **Pattern Matching** — Check against known impossibility patterns before deep analysis
5. **Adversarial Validation** — Attack your own findings before finalizing

---

## Evidence Score System

### Base Scoring

| Event | S Change |
|-------|----------|
| CRITICAL finding | +3 |
| IMPORTANT finding | +1 |
| MINOR finding | +0.3 |
| Clean method pass | -0.5 |

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
| S ≥ 6 | **REJECT** — Stop immediately |
| S ≤ -3 | **ACCEPT** — Stop immediately (unless HIGH stakes) |
| -3 < S < 6 | **CONTINUE** or **UNCERTAIN** |

---

## Phase 0: Setup

**Time:** 2 minutes

### 0.1 Stakes Assessment

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

### 0.2 Initial Assessment

```
Before reading carefully, this artifact seems:

[ ] Probably sound  — Looks solid, no red flags (prior ~0.6 sound)
[ ] Uncertain       — Complex, can't tell yet (prior ~0.3 sound)
[ ] Probably flawed — Strong claims, something smells wrong (prior ~0.15 sound)

Basis for this feeling: ________________________________
```

### 0.3 Bias Check

Answer honestly before proceeding:

1. **What outcome am I expecting?** (Note this — it's your bias)
2. **Am I verifying or confirming?**
3. **What would make me change my mind?**

**Output:** Stakes level, initial assessment, noted biases

---

## Phase 1: Pattern Scan

**Time:** 5-15 minutes  
**Goal:** Rapidly identify red flags using cheap, broad methods

### 1.1 Execute Tier 1 Methods

Execute ALL of these (low cost, high discrimination):

| # | Method | Question to Answer |
|---|--------|-------------------|
| 71 | First Principles | Are the fundamental assumptions valid? |
| 100 | Vocabulary Audit | Are key terms used consistently throughout? |
| 17 | Abstraction Laddering | Are abstraction levels coherent and connected? |

### 1.2 Check Pattern Library

Scan artifact for known impossibility patterns:

**Definitional Contradictions:**

| Pattern | Signal | Check |
|---------|--------|-------|
| PFS + Escrow | Claims both "Perfect Forward Secrecy" and "key recovery" | Mutually exclusive by definition |
| Gradual Typing + Termination | Claims "gradual/dynamic types" and "guaranteed termination" | Rice's theorem — undecidable |
| Deterministic + Adaptive | Claims both "reproducible" and "learning/adaptive" | Which wins when they conflict? |
| Consistency + Availability | Claims both under partition tolerance | CAP theorem — pick two |

**Theorem Violations:**

| Pattern | Signal | Theorem |
|---------|--------|---------|
| VCG + Balanced Budget | Strategy-proof auction with no external subsidy | Green-Laffont impossibility |
| Async + Consensus + Faults | Async network + f < N/2 faults + guaranteed termination | FLP impossibility (f < N/3 is proven bound) |
| Universal Bug Detection | "Detects all bugs" / "guarantees termination" | Halting problem |

**Statistical Impossibilities:**

| Pattern | Signal | Check |
|---------|--------|-------|
| High Accuracy + Low N | "99.9% accuracy" without sample size | N × prevalence ≥ meaningful sample? |
| Universal Performance | "Works for all cases" | Long tail examined? |
| Quantum Hype | "Quantum speedup" + current technology claims | Required qubits/error correction available? |
| Unverifiable Optimum | "Finds global optimum" for NP-hard problem | How is optimality verified? |

**Regulatory Contradictions:**

| Pattern | Signal | Check |
|---------|--------|-------|
| FDA III + Learning | Class III device with continuous updates | PMA required for each change |
| HIPAA + Analytics | Compliance with rich patient insights | De-identification method specified? |

### 1.3 Record Findings

For each finding, record with **mandatory quote**:

```
FINDING: [description]
QUOTE: "[exact text from artifact]"
LOCATION: [line number / section]
PATTERN: [which pattern matched, if any]
SEVERITY: [CRITICAL / IMPORTANT / MINOR]
```

**No quote = no finding.** If you can't point to specific text, it's not a finding.

### 1.4 Update Evidence Score

```
Starting S = 0

For each finding:
  CRITICAL: S += 3
  IMPORTANT: S += 1
  MINOR: S += 0.3

For each method that passed clean:
  S -= 0.5

Current S = ____
```

### 1.5 Early Exit Check

```
┌─────────────────────────────────────────────────────────┐
│  IF S ≥ 6                                               │
│  → STOP. Go directly to Phase 4. Verdict: REJECT        │
│                                                         │
│  IF S ≤ -3 AND stakes ≠ HIGH                           │
│  → STOP. Go directly to Phase 4. Verdict: ACCEPT        │
│                                                         │
│  OTHERWISE                                              │
│  → Continue to Phase 2                                  │
└─────────────────────────────────────────────────────────┘
```

**Output:** List of findings with quotes, updated S, decision to continue or exit

---

## Phase 2: Targeted Analysis

**Time:** 15-30 minutes  
**Goal:** Select methods based on Phase 1 signals, confirm or refute hypotheses

### 2.1 Method Selection

Choose 2-4 methods based on signals from Phase 1:

**If absolute claims found** ("guarantees", "always", "never", "100%", "perfect"):

| # | Method | Purpose |
|---|--------|---------|
| 153 | Theoretical Impossibility Check | Check against known theorems |
| 154 | Definitional Contradiction Detector | Find mutually exclusive requirements |
| 163 | Existence Proof Demand | Challenge unproven claims |

**If structural complexity visible** (multiple subsystems, complex interactions):

| # | Method | Purpose |
|---|--------|---------|
| 116 | Strange Loop Detection | Find circular dependencies |
| 86 | Topological Holes | Find structural gaps |
| 159 | Transitive Dependency | Find hidden dependencies |

**If ungrounded claims found** (assertions without justification):

| # | Method | Purpose |
|---|--------|---------|
| 85 | Grounding Check | Find unjustified claims |
| 78 | Assumption Excavation | Surface hidden assumptions |
| 130 | Assumption Torture | Stress-test assumptions |

**If belief is diffuse** (general unease, can't pinpoint problem):

| # | Method | Purpose |
|---|--------|---------|
| 84 | Coherence Check | General consistency |
| 109 | Contraposition | Reveal hidden failure modes |
| 63 | Critical Challenge | Strongest counter-argument |

### 2.2 Correlation Rule

Methods in the same cluster often find the same issues. Avoid redundancy:

| Cluster | Methods | Rule |
|---------|---------|------|
| Theory | #153, #154, #163, #162 | If first finds nothing → skip rest |
| Structure | #116, #86, #159 | If first finds nothing → skip rest |
| Grounding | #85, #78, #130 | If first finds nothing → skip rest |
| Challenge | #109, #63, #165 | Lower correlation — can use multiple |

**Rule:** 
- First method from cluster found nothing → skip rest of cluster
- First method found something → one more can confirm
- Never execute 3+ methods from same cluster

### 2.3 Execute Selected Methods

For each method, record:

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

### 2.4 Update Evidence Score

After each method, update S and check thresholds:

```
S after method #___: ____

┌─────────────────────────────────────────────────────────┐
│  IF S ≥ 6 → STOP. Go to Phase 4. Verdict: REJECT        │
│  IF S ≤ -3 → STOP. Go to Phase 4. Verdict: ACCEPT       │
│  OTHERWISE → Continue                                   │
└─────────────────────────────────────────────────────────┘
```

### 2.5 Method Agreement Check

After all Phase 2 methods:

```
Methods executed: [list]
Direction summary:
  Confirms REJECT: __/__ methods
  Confirms ACCEPT: __/__ methods
  Neutral: __/__ methods

If 3+ methods agree on direction AND stakes ≠ HIGH:
  Consider proceeding to verdict even if |S| < threshold
```

**Output:** Method results with quotes, updated S, decision to continue or exit

---

## Phase 3: Adversarial Validation

**Time:** 10-15 minutes  
**Goal:** Attack your own findings to ensure they survive scrutiny

**⚠️ IMPORTANT:** This phase is critical for preventing false positives. In empirical testing, adversarial review correctly downgraded multiple findings that would have led to incorrect rejection. **Do not skip this phase** unless early exit was triggered.

**Skip ONLY if:** Early exit triggered in Phase 1 or 2 (S ≥ 6 or S ≤ -3)

### 3.1 Devil's Advocate Prompts

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

### 3.2 Steel-Man the Artifact

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

### 3.3 Reconciliation

```
Findings after adversarial review:

Original findings: [count]
Findings removed: [count]
Findings downgraded: [count]
Final findings: [count]

Updated S after adversarial review: ____
```

**Output:** Revised findings, final S before verdict

---

## Phase 4: Verdict

**Time:** 2 minutes

### 4.1 Final Evidence Score

```
Evidence Score S = ____

Calculation:
  Phase 1 findings: ____
  Phase 2 findings: ____
  Clean passes: ____
  Adversarial adjustments: ____
  Total: ____
```

### 4.2 Decision

```
┌─────────────────────────────────────────────────────────┐
│  S ≥ 6           → REJECT                               │
│  S ≤ -3          → ACCEPT                               │
│  -3 < S < 6      → UNCERTAIN                            │
└─────────────────────────────────────────────────────────┘

Verdict: ____________
```

### 4.3 Confidence Assessment

```
Confidence level:

[ ] HIGH   — |S| > 10, methods agree, adversarial attacks failed
[ ] MEDIUM — 6 ≤ |S| ≤ 10, most methods agree, some uncertainty
[ ] LOW    — |S| near threshold, methods disagree, findings weakened

If UNCERTAIN + HIGH stakes → ESCALATE to human reviewer
If LOW confidence → Document specific uncertainties
```

### 4.4 Escalation Criteria

Escalate to human reviewer when:

- S is in UNCERTAIN range (-3 < S < 6) AND stakes are HIGH
- Methods strongly disagree (some REJECT, some ACCEPT)
- Findings require domain expertise you lack
- Novel pattern not in library, uncertain severity
- Multiple steel-man arguments hold

```
Escalation needed? [ ] Yes [ ] No

If yes:
  Reason: ________________________________
  Specific question for reviewer: ________________________________
  What information would resolve: ________________________________
```

---

## Phase 5: Report

### Report Template

```
═══════════════════════════════════════════════════════════════
VERIFICATION REPORT
═══════════════════════════════════════════════════════════════

ARTIFACT: [name]
DATE: [date]
WORKFLOW VERSION: 12.1

───────────────────────────────────────────────────────────────
VERDICT
───────────────────────────────────────────────────────────────

VERDICT: [REJECT / ACCEPT / UNCERTAIN / ESCALATE]
CONFIDENCE: [HIGH / MEDIUM / LOW]
EVIDENCE SCORE: S = [value]
EARLY EXIT: [Yes — Phase X / No — Full process]

───────────────────────────────────────────────────────────────
KEY FINDINGS
───────────────────────────────────────────────────────────────

[F1] [SEVERITY] — [Brief description]
     Quote: "[exact text]"
     Location: [line/section]
     Pattern: [pattern name if applicable]

[F2] [SEVERITY] — [Brief description]
     Quote: "[exact text]"
     Location: [line/section]
     Pattern: [pattern name if applicable]

[F3] ...

───────────────────────────────────────────────────────────────
METHODS EXECUTED
───────────────────────────────────────────────────────────────

Phase 1:
  □ #71 First Principles — [Clean / Finding]
  □ #100 Vocabulary Audit — [Clean / Finding]
  □ #17 Abstraction Laddering — [Clean / Finding]

Phase 2:
  □ #[X] [Name] — [Clean / Finding] — Selected because: [reason]
  □ #[Y] [Name] — [Clean / Finding] — Selected because: [reason]

Phase 3:
  □ Adversarial review — [Findings survived / X findings weakened]
  □ Steel-man — [All failed / X arguments held]

───────────────────────────────────────────────────────────────
NOT CHECKED
───────────────────────────────────────────────────────────────

- [Aspect]: Not examined because [reason]
- [Aspect]: Outside scope because [reason]
- [Aspect]: Would require [external resource/expertise]

───────────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────────

If REJECT:
  1. [Action to address F1]
  2. [Action to address F2]

If ACCEPT WITH CAVEATS:
  1. [Caveat to note]
  2. [Area to monitor]

If ESCALATE:
  1. [Question for human reviewer]
  2. [Information needed]

═══════════════════════════════════════════════════════════════
```

---

## Appendix A: Severity Anchoring Guide

### CRITICAL (S += 3)

Finding **alone** would justify REJECT:

- **Theorem violation** — Claim contradicts CAP, FLP, Green-Laffont, Halting, Rice, Arrow, No-Free-Lunch
- **Definitional contradiction** — X requires property A, Y requires property ¬A, both claimed
- **Missing critical component** — Component C is referenced but undefined, and other components depend on C
- **Regulatory impossibility** — Claims certification that is incompatible with claimed features
- **Mathematical impossibility** — Claims statistically unachievable (e.g., 99.9% accuracy on N<100)

### IMPORTANT (S += 1)

Finding contributes to REJECT; 2-3 together would justify REJECT:

- **Section inconsistency** — Section A says X, Section B says Y, X and Y are incompatible
- **Ungrounded claim** — Assertion made without justification or evidence
- **Feedback loop without dampening** — Circular influence without termination condition
- **Circular dependency** — A depends on B depends on C depends on A
- **Ambiguous terminology** — Same term used with different meanings in different places
- **Missing error handling** — No specification of what happens when X fails

### MINOR (S += 0.3)

Finding only matters if other problems exist:

- **Unclear wording** — Sentence is ambiguous but not contradictory
- **Missing non-blocking detail** — Detail would be nice but isn't essential
- **Style/formatting issues** — Inconsistent formatting, typos
- **Incomplete example** — Example doesn't cover all cases but concept is clear

---

## Appendix B: Method Operational Definitions

### #71 First Principles Analysis

**What to do:**
1. Identify the 3-5 core claims of the artifact
2. For each claim, ask: "What must be fundamentally true for this to work?"
3. Check if those fundamentals are:
   - Explicitly stated and justified
   - Consistent with known constraints (physics, math, regulations)
   - Not contradicting each other

**Output:** List of fundamental assumptions, validity status for each

### #100 Vocabulary Audit

**What to do:**
1. Extract all key terms (technical jargon, defined concepts)
2. For each term, find all locations where it's used
3. Check: Is the term used consistently everywhere?
4. Look for:
   - Synonyms (same concept, different words) — potential confusion
   - Homonyms (same word, different meanings) — potential contradiction

**Output:** List of vocabulary issues with quotes from each conflicting usage

### #17 Abstraction Laddering

**What to do:**
1. Identify all abstraction levels (high-level goals → mid-level design → implementation details)
2. Check vertical coherence: Do promises at one level match details at another?
3. Check for gaps: Are there jumps where intermediate steps are missing?
4. Check for orphans: Are there details that don't connect to any higher goal?

**Output:** Map of abstraction levels, list of coherence issues

### #84 Coherence Check

**What to do:**
1. For each section, summarize its key claim in one sentence
2. Compare claims across sections:
   - Do they support each other?
   - Do any contradict?
   - Are there gaps (A assumes X, but X never established)?
3. For each mechanism described:
   - Is it connected to the main flow?
   - Are there "orphan" mechanisms (described but never used)?

**Output:** List of incoherences with quotes from conflicting sections

### #85 Grounding Check

**What to do:**
1. For each significant claim, ask: "What evidence supports this?"
2. Classify evidence as:
   - Explicit (cited, demonstrated)
   - Implicit (follows logically from stated facts)
   - Missing (assertion without support)
3. Flag all claims with missing evidence

**Output:** List of ungrounded claims with their locations

### #78 Assumption Excavation

**What to do:**
1. For each mechanism or claim, ask: "What must be true for this to work?"
2. Check if each assumption is:
   - Stated explicitly
   - Stated implicitly (can be inferred)
   - Unstated (hidden assumption)
3. For unstated assumptions, assess: Is this assumption reasonable? Always true?

**Output:** List of hidden assumptions with risk assessment

### #116 Strange Loop Detection

**What to do:**
1. Build dependency graph:
   - Nodes = components, concepts, mechanisms
   - Edges = "depends on", "influences", "calls"
2. Find cycles (DFS or visual inspection)
3. For each cycle:
   - Is there a breaking condition?
   - Is there dampening?
   - Could this cause infinite regress or instability?

**Output:** List of cycles with impact assessment

### #153 Theoretical Impossibility Check

**What to do:**
1. Identify claims that sound "too good to be true"
2. For each, check against known impossibility theorems:
   - Distributed: CAP, FLP, Byzantine bounds (f < N/3 async, f < N/2 sync)
   - Mechanism design: Green-Laffont, Myerson-Satterthwaite, Arrow
   - Computation: Halting, Rice, Gödel
   - Cryptography: PFS constraints, no perfect encryption without key
   - Optimization: No Free Lunch
   - Information: Shannon limits
3. If claim matches theorem pattern:
   - Does artifact acknowledge the trade-off?
   - Is there a valid exception or workaround?

**Output:** List of potential theorem violations with theorem name and evidence

### #154 Definitional Contradiction Detector

**What to do:**
1. List all requirements/claims as R1, R2, R3...
2. For each requirement, expand:
   - MEANS: What it literally says
   - IMPLIES: Logical consequences
   - EXCLUDES: What it's incompatible with
3. For each pair (Ri, Rj):
   - Does Ri.EXCLUDES overlap with Rj.MEANS?
   - Does Ri.EXCLUDES overlap with Rj.IMPLIES?
   - If yes → definitional contradiction

**Output:** List of contradictory pairs with expansion showing the conflict

### #63 Critical Challenge

**What to do:**
1. Assume the role of a hostile critic
2. Construct the strongest possible argument that the artifact is fundamentally flawed
3. Use all findings from previous methods as ammunition
4. Synthesize: Do the individual findings combine into a systemic problem?

**Output:** Strongest critique of the artifact, classification of combined severity

### #109 Contraposition

**What to do:**
1. For each key claim "If A then B", consider "If not-B then not-A"
2. Ask: What would have to be true for this system to fail?
3. Check: Are those failure conditions addressed?

**Output:** List of failure conditions and whether they're mitigated

### #130 Assumption Torture

**What to do:**
1. For each key assumption, imagine it's wrong at different levels:
   - 10% wrong — minor deviation
   - 50% wrong — significant deviation
   - 100% wrong — completely invalid
2. What happens to the system at each level?
3. Is there graceful degradation or catastrophic failure?

**Output:** Sensitivity analysis of key assumptions

---

## Appendix C: Pattern Library

### C.1 Definitional Contradictions

**PFS_ESCROW**
```
Claims: "Perfect Forward Secrecy" + "Key recovery mechanism"
Why impossible: PFS means past sessions unrecoverable; escrow means recoverable
Detection: #71, #154
Severity: CRITICAL
```

**GRADUAL_TERMINATION**
```
Claims: "Gradual typing" / "Dynamic types" + "Guaranteed termination"
Why impossible: Gradual typing allows runtime coercion → arbitrary computation
Theorem: Rice's theorem — non-trivial semantic properties undecidable
Detection: #153, #154
Severity: CRITICAL
```

**DETERMINISTIC_ADAPTIVE**
```
Claims: "Deterministic/reproducible" + "Learning/adaptive"  
Why impossible: Deterministic = same input → same output; Adaptive = output changes
Exception: Valid if scope clearly separated (deterministic inference, adaptive training)
Detection: #154, #84
Severity: CRITICAL if unresolved, IMPORTANT if scope ambiguous
```

**CONSISTENCY_AVAILABILITY**
```
Claims: "Strong consistency" + "High availability" + "Partition tolerance"
Why impossible: CAP theorem — can only have two
Detection: #153
Severity: CRITICAL
```

### C.2 Theorem Violations

**VCG_BALANCED**
```
Claims: VCG mechanism + Strategy-proofness + Balanced budget + Individual rationality
Theorem: Green-Laffont — cannot have all four
Detection: #153
Severity: CRITICAL
```

**ASYNC_CONSENSUS**
```
Claims: Asynchronous network + Consensus + Fault tolerance (f < N/2) + Guaranteed termination
Theorem: FLP — impossible in async with even one fault
Note: f < N/3 is the proven bound for async BFT; f < N/2 requires synchrony assumptions
Detection: #153, #71
Severity: CRITICAL
```

**UNIVERSAL_TERMINATION**
```
Claims: "Detects all infinite loops" / "Guarantees termination for any program"
Theorem: Halting problem — undecidable for arbitrary programs
Detection: #153, #87
Severity: CRITICAL
```

**ARROW_VOTING**
```
Claims: Voting system with all of: unrestricted domain, non-dictatorship, 
       Pareto efficiency, independence of irrelevant alternatives
Theorem: Arrow's impossibility — no voting system satisfies all four
Detection: #153
Severity: CRITICAL
```

### C.3 Statistical Impossibilities

**ACCURACY_WITHOUT_N**
```
Claims: High accuracy (99%+) without stating sample size
Check: N × prevalence × claimed_accuracy ≥ meaningful validation?
Example: 99.9% on 10K diseases with 50M records = ~5K/disease avg; rare diseases have <100
Detection: #153, arithmetic
Severity: CRITICAL
```

**QUANTUM_HYPE**
```
Claims: "Quantum speedup" / "Exponential acceleration" + Current technology implementation
Signals:
  - Claims "achieved" results with quantum hardware
  - References fault-tolerant quantum computing as available
  - Claims quantum advantage for optimization problems
Why impossible: 
  - Current NISQ devices have ~100-1000 noisy qubits
  - Fault-tolerant QC requires millions of physical qubits
  - No proven quantum speedup for general optimization
Detection: #71, #153, domain knowledge
Severity: CRITICAL
```

**UNVERIFIABLE_OPTIMUM**
```
Claims: "Finds global optimum" / ">99% probability of optimal solution" for NP-hard problem
Why impossible: Cannot verify global optimality without exhaustive search
Check: How is optimality claim validated? Against what benchmark?
Detection: #153, #85
Severity: CRITICAL
```

### C.4 Regulatory Contradictions

**FDA_LEARNING**
```
Claims: FDA Class III + Continuous learning
Why impossible: Class III requires PMA for each model change
Exception: Class II with PCCP allows pre-specified changes
Detection: #153, domain knowledge
Severity: CRITICAL
```

**HIPAA_ANALYTICS**
```
Claims: HIPAA compliance + Rich analytics on patient data
Check: De-identification method specified? Expert determination or Safe Harbor?
Risk: Re-identification from analytics outputs
Detection: #85, domain knowledge
Severity: IMPORTANT to CRITICAL depending on specifics
```

---

## Appendix D: Evidence Score Examples

### Example 1: Early REJECT (Phase 1)

```
Artifact: Cryptographic protocol specification

Phase 1:
  #71 First Principles:
    Finding: Claims PFS but has key escrow mechanism
    Severity: CRITICAL (+3)
    S = 3
    
  #100 Vocabulary Audit:
    Finding: "Forward secrecy" used inconsistently
    Severity: IMPORTANT (+1)
    S = 4
    
  #17 Abstraction Laddering:
    Clean pass (-0.5)
    S = 3.5

Pattern Library check:
  Pattern PFS_ESCROW matched
  Confirms CRITICAL finding (+1 bonus)
  S = 4.5

Phase 2:
  #154 Definitional Contradiction:
    Confirms escrow/PFS conflict
    Additional CRITICAL (+3)
    S = 7.5

S ≥ 6 → EARLY EXIT → REJECT
```

### Example 2: Full Process → UNCERTAIN

```
Artifact: AI recommendation system

Phase 1:
  #71: Clean (-0.5), S = -0.5
  #100: Minor terminology issue (+0.3), S = -0.2
  #17: Clean (-0.5), S = -0.7

Phase 2:
  #84 Coherence: One inconsistency (+1), S = 0.3
  #85 Grounding: Two ungrounded claims (+1, +1), S = 2.3
  #78 Assumption: Clean (-0.5), S = 1.8

Phase 3:
  Adversarial review of 3 IMPORTANT findings:
    - Inconsistency: 2/4 prompts weaken → downgrade to MINOR
    - Ungrounded claim 1: 1/4 weakens → keep IMPORTANT
    - Ungrounded claim 2: 3/4 weaken → remove
    
  S adjustment: 2.3 → 1.3 (removed +1, downgraded -0.7)
  
  Steel-man: 2/3 arguments hold
  
Final S = 1.3 → UNCERTAIN (recommend escalation)
```

### Example 3: Full Process → ACCEPT

```
Artifact: API specification

Phase 1:
  #71: Clean (-0.5), S = -0.5
  #100: Clean (-0.5), S = -1.0
  #17: Clean (-0.5), S = -1.5

Phase 2:
  #84 Coherence: Clean (-0.5), S = -2.0
  #85 Grounding: Clean (-0.5), S = -2.5
  
Phase 3:
  No findings to review
  Steel-man: All 3 arguments hold strongly
  
  Additional clean consideration: -0.5
  S = -3.0

S ≤ -3 → ACCEPT
```

---

## Appendix E: Quick Reference Card

### Workflow Summary

```
PHASE 0: SETUP (2 min)
  Stakes: LOW / MEDIUM / HIGH
  Gut: Sound / Uncertain / Flawed
  Bias check: "Verifying or confirming?"

PHASE 1: PATTERN SCAN (5-15 min)
  □ #71 First Principles
  □ #100 Vocabulary Audit  
  □ #17 Abstraction Laddering
  □ Check Pattern Library
  → Update S
  → If S ≥ 6: REJECT (exit)

PHASE 2: TARGETED ANALYSIS (15-30 min)
  Select by signal:
    Absolute claims → #153, #154
    Structural → #116, #86
    Ungrounded → #85, #78
    Diffuse → #84, #109
  → Update S after each method
  → If S ≥ 6: REJECT (exit)
  → If S ≤ -3: ACCEPT (exit)

PHASE 3: ADVERSARIAL (10-15 min)
  For each IMPORTANT+ finding:
    □ Alternative explanation?
    □ Hidden context?
    □ Domain exception?
    □ Survivorship bias?
  → If ≥2 weaken: downgrade/remove
  Steel-man: 3 best arguments for ACCEPT

PHASE 4: VERDICT
  S ≥ 6 → REJECT
  S ≤ -3 → ACCEPT
  else → UNCERTAIN
```

### Severity Quick Guide

```
CRITICAL (+3): Theorem violation, definitional contradiction,
               missing critical component, regulatory impossibility

IMPORTANT (+1): Section inconsistency, ungrounded claim,
                feedback loop, circular dependency

MINOR (+0.3): Unclear wording, missing non-blocking detail

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
Deterministic + Adaptive                  = Contradiction (unless scoped)
FDA Class III + Continuous Learning       = Regulatory impossibility
High accuracy + insufficient N            = Statistical impossibility
Quantum speedup + current tech            = Technology impossibility
```

---