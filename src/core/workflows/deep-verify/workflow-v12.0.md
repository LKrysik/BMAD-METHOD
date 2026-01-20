# Deep Verify V12.0 — Empirically Grounded Verification

## Overview

Sequential verification workflow with early exit capability. Designed for maximum effectiveness at minimum cost.

**Core Principles:**
1. **Early Exit** — Stop when evidence is sufficient, not when all methods are exhausted
2. **Mandatory Quotes** — No quote, no finding. Every claim must cite artifact text.
3. **Signal-Based Selection** — Choose methods based on what Phase 1 reveals
4. **Pattern Matching** — Check against known impossibility patterns before deep analysis
5. **Adversarial Validation** — Attack your own findings before finalizing

**Evidence Score (S):**
- CRITICAL finding: S += 3
- IMPORTANT finding: S += 1  
- MINOR finding: S += 0.3
- Clean method pass: S -= 0.5

**Decision Thresholds:**
- S ≥ 6 → **REJECT** (stop immediately)
- S ≤ -3 → **ACCEPT** (stop immediately)
- -3 < S < 6 → **CONTINUE** or **UNCERTAIN**

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
| Deterministic + Adaptive | Claims both "reproducible" and "learning/adaptive" | Which wins when they conflict? |
| Consistency + Availability | Claims both under partition tolerance | CAP theorem — pick two |

**Theorem Violations:**

| Pattern | Signal | Theorem |
|---------|--------|---------|
| VCG + Balanced Budget | Strategy-proof auction with no external subsidy | Green-Laffont impossibility |
| Async + Consensus + Faults | Guaranteed termination in async with failures | FLP impossibility |
| Universal Bug Detection | "Detects all bugs" / "guarantees termination" | Halting problem |

**Statistical Impossibilities:**

| Pattern | Signal | Check |
|---------|--------|-------|
| High Accuracy + Low N | "99.9% accuracy" without sample size | N × prevalence ≥ meaningful sample? |
| Universal Performance | "Works for all cases" | Long tail examined? |

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
SEVERITY: [CRITICAL / IMPORTANT / MINOR] — use anchors below
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

**Skip this phase if:** Early exit triggered in Phase 1 or 2

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
WORKFLOW VERSION: 12.0

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

- [Aspect]: VoI = 0 because [reason]
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

### #153 Theoretical Impossibility Check

**What to do:**
1. Identify claims that sound "too good to be true"
2. For each, check against known impossibility theorems:
   - Distributed: CAP, FLP, Byzantine bounds
   - Mechanism design: Green-Laffont, Myerson-Satterthwaite, Arrow
   - Computation: Halting, Rice, Gödel
   - Cryptography: PFS constraints, no perfect encryption without key
   - Optimization: No Free Lunch
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

### #63 Critical Challenge

**What to do:**
1. Assume the role of a hostile critic
2. Construct the strongest possible argument that the artifact is fundamentally flawed
3. Use all findings from previous methods as ammunition
4. Synthesize: Do the individual findings combine into a systemic problem?

**Output:** Strongest critique of the artifact, classification of combined severity

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
Claims: Asynchronous network + Consensus + Fault tolerance + Guaranteed termination
Theorem: FLP — impossible in async with even one fault
Detection: #153
Severity: CRITICAL
```

**UNIVERSAL_TERMINATION**
```
Claims: "Detects all infinite loops" / "Guarantees termination for any program"
Theorem: Halting problem — undecidable for arbitrary programs
Detection: #153, #87
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

### C.4 Regulatory Contradictions

**FDA_LEARNING**
```
Claims: FDA Class III + Continuous learning
Why impossible: Class III requires PMA for each model change
Exception: Class II with PCCP allows pre-specified changes
Detection: #153, domain knowledge
Severity: CRITICAL
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

Additional pattern check:
  Pattern PFS_ESCROW matched
  Confirmed CRITICAL finding
  S remains 3.5 (already counted)

Second look at #71 finding with #154:
  Definitional contradiction confirmed
  Additional CRITICAL (+3)
  S = 6.5

S ≥ 6 → EARLY EXIT → REJECT
```

### Example 2: Full Process → ACCEPT

```
Artifact: API specification

Phase 1:
  #71: Clean (-0.5), S = -0.5
  #100: Minor terminology issue (+0.3), S = -0.2
  #17: Clean (-0.5), S = -0.7

Phase 2:
  #84 Coherence: Clean (-0.5), S = -1.2
  #85 Grounding: One ungrounded claim (+1), S = -0.2
  #78 Assumption: Clean (-0.5), S = -0.7

Phase 3:
  Adversarial review: Ungrounded claim has implicit justification
  Downgrade to MINOR (-0.7), S = -1.4
  Steel-man: All 3 arguments hold
  
  Additional clean consideration: -0.5
  S = -1.9

Continue with additional method:
  #63 Critical Challenge: No systemic issues found (-0.5)
  S = -2.4

Additional domain method:
  #87 Falsifiability: All claims testable (-0.5)
  S = -2.9

S approaching -3, methods exhausted
Final S = -2.9 → ACCEPT (LOW confidence, near threshold)
```

---