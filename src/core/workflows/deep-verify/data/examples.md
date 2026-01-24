# Evidence Score Examples — Worked Examples for Score Calculation
# LOAD: When learning the workflow or debugging score calculations
# PURPOSE: Concrete examples of how scoring works in practice

---

# LOADING INSTRUCTIONS:
# 1. Reference these examples when unsure about score calculation
# 2. Each example shows complete flow from Phase 0 to final verdict
# 3. Use as templates for similar artifacts

---

## Example 1: Early REJECT (Phase 1) — Pattern Match

**Artifact:** Cryptographic protocol specification claiming PFS with key escrow

```
Phase 0 (Setup):
  Stakes: HIGH (security protocol)
  Mode: Blind
  Initial Assessment: BLIND

Phase 1 (Pattern Scan):
  ┌─────────────────────────────────────────────────────────────┐
  │ #71 First Principles:                                        │
  │   Finding: Claims PFS but has key escrow mechanism           │
  │   Quote: "Perfect forward secrecy ensures past sessions      │
  │          cannot be decrypted" (Section 2.1)                  │
  │   Quote: "Enterprise key recovery allows retrieval of        │
  │          session keys from escrow" (Section 4.3)             │
  │   Severity: CRITICAL (+3)                                    │
  │   S = 3                                                      │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #100 Vocabulary Audit:                                       │
  │   Finding: "Forward secrecy" used inconsistently             │
  │   Quote: "forward secrecy" (Sec 2.1) vs                      │
  │          "recoverable forward secrecy" (Sec 4.3)             │
  │   Severity: IMPORTANT (+1)                                   │
  │   S = 4                                                      │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #17 Abstraction Laddering:                                   │
  │   Clean pass (-0.5)                                          │
  │   S = 3.5                                                    │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ Pattern Library Check:                                       │
  │   Pattern DC-001 (PFS_ESCROW) MATCHED                        │
  │   Confirms CRITICAL finding                                  │
  │   Bonus: +1                                                  │
  │   S = 4.5                                                    │
  └─────────────────────────────────────────────────────────────┘

Phase 2 (Targeted — executed because S < 6):
  ┌─────────────────────────────────────────────────────────────┐
  │ #154 Definitional Contradiction:                             │
  │   Confirms escrow/PFS conflict with formal expansion         │
  │   R1 (PFS): MEANS session keys deleted after use             │
  │            EXCLUDES any key recovery mechanism               │
  │   R2 (Escrow): MEANS session keys stored for recovery        │
  │               EXCLUDES PFS by definition                     │
  │   Additional CRITICAL (+3)                                   │
  │   S = 7.5                                                    │
  └─────────────────────────────────────────────────────────────┘

Early Exit Check:
  S ≥ 6 ✓ AND Pattern Match ✓
  → EARLY EXIT TRIGGERED

Phase 4 (Verdict):
  Final S = 7.5
  Verdict: REJECT
  Confidence: HIGH (S > 6, pattern match, theorem-based finding)

Score Breakdown:
  Phase 1 CRITICAL:     +3
  Phase 1 IMPORTANT:    +1
  Phase 1 Clean pass:   -0.5
  Pattern bonus:        +1
  Phase 2 CRITICAL:     +3
  ─────────────────────────
  Total:                7.5
```

---

## Example 2: Full Process → UNCERTAIN

**Artifact:** AI recommendation system specification

```
Phase 0 (Setup):
  Stakes: MEDIUM
  Mode: Standard
  Initial Assessment: Uncertain

Phase 1 (Pattern Scan):
  ┌─────────────────────────────────────────────────────────────┐
  │ #71 First Principles:                                        │
  │   Clean pass (-0.5)                                          │
  │   S = -0.5                                                   │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #100 Vocabulary Audit:                                       │
  │   Finding: "relevance" used inconsistently                   │
  │   Quote: "relevance score" (Sec 3.1) — user preference match │
  │   Quote: "relevance" (Sec 5.2) — business metric alignment   │
  │   Severity: MINOR (+0.3)                                     │
  │   S = -0.2                                                   │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #17 Abstraction Laddering:                                   │
  │   Clean pass (-0.5)                                          │
  │   S = -0.7                                                   │
  └─────────────────────────────────────────────────────────────┘

  Pattern Library: No match
  Continue to Phase 2 (normal progression)

Phase 2 (Targeted):
  Signal detected: DIFFUSE_BELIEF (terminology issue, general unease)

  ┌─────────────────────────────────────────────────────────────┐
  │ #84 Coherence Check:                                         │
  │   Finding: Section 3 and Section 7 describe different flows  │
  │   Quote: "User preferences processed in real-time" (Sec 3)   │
  │   Quote: "Batch preference analysis runs nightly" (Sec 7)    │
  │   Severity: IMPORTANT (+1)                                   │
  │   S = 0.3                                                    │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #85 Grounding Check:                                         │
  │   Finding 1: "95% user satisfaction" ungrounded              │
  │   Quote: "achieves 95% user satisfaction" (Sec 1.2)          │
  │   No evidence, study, or methodology cited                   │
  │   Severity: IMPORTANT (+1)                                   │
  │   S = 1.3                                                    │
  │                                                              │
  │   Finding 2: "sub-100ms latency" ungrounded                  │
  │   Quote: "responds in under 100ms" (Sec 4.1)                 │
  │   No benchmark methodology specified                         │
  │   Severity: IMPORTANT (+1)                                   │
  │   S = 2.3                                                    │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #78 Assumption Excavation:                                   │
  │   Clean pass (-0.5)                                          │
  │   S = 1.8                                                    │
  └─────────────────────────────────────────────────────────────┘

Phase 3 (Adversarial) — MANDATORY:

  Finding: Section inconsistency (IMPORTANT)
  ┌─────────────────────────────────────────────────────────────┐
  │ □ Alternative Explanation: Could be two valid modes          │
  │   Answer: Possibly real-time for active, batch for inactive  │
  │   Weakens? YES                                               │
  │ □ Hidden Context: Maybe explained elsewhere                  │
  │   Answer: No footnote found, but plausible design            │
  │   Weakens? YES                                               │
  │ □ Domain Exception: Is this standard practice?               │
  │   Answer: Hybrid approaches are common in recommendations    │
  │   Weakens? NO (but common doesn't mean documented)           │
  │ □ Survivorship Bias: Reading order effect?                   │
  │   Answer: Would still notice if read differently             │
  │   Weakens? NO                                                │
  │                                                              │
  │ Result: 2/4 weaken → DOWNGRADE to MINOR                      │
  │ Adjustment: -0.7                                             │
  └─────────────────────────────────────────────────────────────┘

  Finding: "95% satisfaction" ungrounded (IMPORTANT)
  ┌─────────────────────────────────────────────────────────────┐
  │ □ Alternative Explanation: Could be aspirational             │
  │   Answer: Text uses "achieves" not "targets"                 │
  │   Weakens? NO                                                │
  │ □ Hidden Context: Internal study?                            │
  │   Answer: No reference to any study                          │
  │   Weakens? NO                                                │
  │ □ Domain Exception: Common marketing claim?                  │
  │   Answer: Spec not marketing material                        │
  │   Weakens? NO                                                │
  │ □ Survivorship Bias: Focusing on this?                       │
  │   Answer: Grounding check systematically found it            │
  │   Weakens? NO                                                │
  │                                                              │
  │ Result: 0/4 weaken → KEEP IMPORTANT                          │
  └─────────────────────────────────────────────────────────────┘

  Finding: "sub-100ms latency" ungrounded (IMPORTANT)
  ┌─────────────────────────────────────────────────────────────┐
  │ □ Alternative Explanation: Standard engineering target       │
  │   Answer: Plausible but still unverified                     │
  │   Weakens? YES                                               │
  │ □ Hidden Context: Implementation detail?                     │
  │   Answer: Spec-level, might be verified later                │
  │   Weakens? YES                                               │
  │ □ Domain Exception: Are latency claims usually proven?       │
  │   Answer: Often verified in implementation phase             │
  │   Weakens? YES                                               │
  │ □ Survivorship Bias: Same as above?                          │
  │   Answer: No, different type of claim                        │
  │   Weakens? NO                                                │
  │                                                              │
  │ Result: 3/4 weaken → REMOVE                                  │
  │ Adjustment: -1                                               │
  └─────────────────────────────────────────────────────────────┘

  Steel-man for ACCEPT:
    1. Core recommendation logic is sound → NO (still has ungrounded claims)
    2. Architecture is reasonable → YES (holds up)
    3. Terminology issues are minor → YES (holds up)

  Steel-man arguments that hold: 2/3

Phase 3 Reconciliation:
  Score before Phase 3: 1.8
  Adjustments:
    - Inconsistency downgraded: -0.7
    - Latency claim removed: -1
  Score after Phase 3: 0.1

Phase 4 (Verdict):
  Final S = 0.1
  -3 < S < 6 → UNCERTAIN

  Confidence: LOW (near zero, steel-man partially holds)

  Escalation check:
    Stakes MEDIUM, not HIGH → no mandatory escalation
    2/3 steel-man arguments hold → RECOMMENDED escalation

  Recommendation: Accept with caveats OR gather more evidence for satisfaction claim

Score Breakdown:
  Phase 1:
    Clean passes (2):     -1.0
    MINOR finding:        +0.3
  Phase 2:
    IMPORTANT findings:   +3.0
    Clean pass:           -0.5
  Phase 3:
    Downgrade:            -0.7
    Removal:              -1.0
  ─────────────────────────
  Total:                  0.1
```

---

## Example 3: Full Process → ACCEPT

**Artifact:** REST API specification v2.1

```
Phase 0 (Setup):
  Stakes: LOW
  Mode: Blind (bias mitigation even for low stakes)
  Initial Assessment: BLIND

Phase 1 (Pattern Scan):
  ┌─────────────────────────────────────────────────────────────┐
  │ #71 First Principles:                                        │
  │   Clean pass (-0.5)                                          │
  │   Fundamentals: HTTP methods, REST constraints, auth model   │
  │   All explicitly stated and consistent                       │
  │   S = -0.5                                                   │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #100 Vocabulary Audit:                                       │
  │   Clean pass (-0.5)                                          │
  │   Terms consistent: "resource", "endpoint", "response"       │
  │   S = -1.0                                                   │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #17 Abstraction Laddering:                                   │
  │   Finding: Pagination section lacks detail                   │
  │   Quote: "Results are paginated" (Sec 3.4)                   │
  │   No specification of page size, cursor format, limits       │
  │   Severity: MINOR (+0.3)                                     │
  │   S = -0.7                                                   │
  └─────────────────────────────────────────────────────────────┘

  Pattern Library: No match
  Continue to Phase 2 (normal progression)

Phase 2 (Targeted):
  Signal: CLEAN_PHASE1 (minor finding only, looking for hidden issues)

  ┌─────────────────────────────────────────────────────────────┐
  │ #78 Assumption Excavation:                                   │
  │   Clean pass (-0.5)                                          │
  │   Assumptions found: JSON format, HTTPS, Bearer tokens       │
  │   All explicitly stated                                      │
  │   S = -1.2                                                   │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #109 Contraposition:                                         │
  │   Clean pass (-0.5)                                          │
  │   Asked: "What would make this API fail?"                    │
  │   Failure modes addressed: auth failure, rate limits,        │
  │   invalid input, server errors — all documented              │
  │   S = -1.7                                                   │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #84 Coherence Check:                                         │
  │   Clean pass (-0.5)                                          │
  │   All sections consistent, no contradictions                 │
  │   S = -2.2                                                   │
  └─────────────────────────────────────────────────────────────┘

Phase 3 (Adversarial) — MANDATORY:

  Only MINOR finding exists (pagination) — adversarial review not required
  for MINOR findings, but we attempt steel-man for REJECT anyway.

  Steel-man for REJECT:
  ┌─────────────────────────────────────────────────────────────┐
  │ 1. "Pagination might cause production issues"                │
  │    Evidence: Section 3.4 lacks detail                        │
  │    Holds up? NO — MINOR issue, implementation can define     │
  │                                                              │
  │ 2. "Error handling might be incomplete"                      │
  │    Evidence: Checked in #109, all codes documented           │
  │    Holds up? NO — explicitly verified                        │
  │                                                              │
  │ 3. "Security model might have gaps"                          │
  │    Evidence: Bearer token + HTTPS + rate limiting present    │
  │    Holds up? NO — standard security adequately specified     │
  └─────────────────────────────────────────────────────────────┘

  All steel-man arguments FAILED → supports ACCEPT

  ACCEPT Validation Checklist:
    ✓ All Tier 1 methods passed clean (2/3 clean, 1 MINOR)
    ✓ No CRITICAL findings at any phase
    ✓ No IMPORTANT findings at any phase
    ✓ Steel-man for REJECT attempted and failed (0/3 held)

Phase 4 (Verdict):
  Final S = -2.2
  S near -3 threshold

  Note: If one more method had passed clean, S would be -2.7
        Still UNCERTAIN by strict threshold, but strong lean ACCEPT

  Verdict: UNCERTAIN (technically) but ACCEPT recommended with caveat

  Practical decision: ACCEPT with documentation to clarify pagination
  Confidence: MEDIUM

Score Breakdown:
  Phase 1:
    Clean passes (2):    -1.0
    MINOR finding:       +0.3
  Phase 2:
    Clean passes (3):    -1.5
  Phase 3:
    No adjustments:       0
  ─────────────────────────
  Total:                -2.2

Recommendation:
  ACCEPT with minor caveat:
  1. Clarify pagination documentation in Section 3.4
  2. Specify: page size limits, cursor format, total count behavior
```

---

## Example 4: Borderline Case → Phase 2+3 Mandatory

**Artifact:** Machine learning pipeline specification

```
Phase 0 (Setup):
  Stakes: MEDIUM
  Mode: Standard
  Initial Assessment: Probably sound (subjective, triggers bias awareness)

  Bias Check:
    Expected outcome: ACCEPT
    Verifying or confirming? Confirming (bias noted!)
    What would change mind: Ungrounded performance claims, data issues

Phase 1 (Pattern Scan):
  ┌─────────────────────────────────────────────────────────────┐
  │ #71 First Principles:                                        │
  │   Finding: Data quality assumptions unclear                  │
  │   Quote: "model assumes clean, representative data" (Sec 2)  │
  │   But no definition of "clean" or "representative"           │
  │   Severity: IMPORTANT (+1)                                   │
  │   S = 1                                                      │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #100 Vocabulary Audit:                                       │
  │   Clean pass (-0.5)                                          │
  │   S = 0.5                                                    │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #17 Abstraction Laddering:                                   │
  │   Finding: Gap between training claims and deployment        │
  │   Quote: "training achieves 98% accuracy" (Sec 4)            │
  │   Quote: "deployment maintains quality" (Sec 7)              │
  │   No bridge explaining how training→deployment preserves     │
  │   Severity: IMPORTANT (+1)                                   │
  │   S = 1.5                                                    │
  └─────────────────────────────────────────────────────────────┘

  Pattern Library: No exact match
  (SI-001 ACCURACY_WITHOUT_N considered but N is specified)

  S = 1.5 → Continue to Phase 2 (not borderline yet, but signals present)

Phase 2 (Targeted):
  Signal: UNGROUNDED_CLAIMS (data assumptions, performance claims)

  ┌─────────────────────────────────────────────────────────────┐
  │ #85 Grounding Check:                                         │
  │   Finding: Performance claim partially ungrounded            │
  │   Quote: "production accuracy exceeds 95%" (Sec 8.1)         │
  │   Training accuracy grounded, production claim is not        │
  │   Severity: IMPORTANT (+1)                                   │
  │   S = 2.5                                                    │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #78 Assumption Excavation:                                   │
  │   Finding: Hidden assumption about data distribution         │
  │   Quote: "model generalizes to new data" (Sec 6.2)           │
  │   Assumes IID distribution, not stated explicitly            │
  │   Severity: IMPORTANT (+1)                                   │
  │   S = 3.5                                                    │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ #130 Assumption Torture:                                     │
  │   Testing "clean data" assumption at 50% wrong:              │
  │   - 10% noisy: minor accuracy drop (documented)              │
  │   - 50% noisy: significant degradation (not addressed)       │
  │   - 100% noisy: failure (not addressed)                      │
  │   However: graceful degradation mentioned, just not detailed │
  │   Clean pass (-0.5)                                          │
  │   S = 3.0                                                    │
  └─────────────────────────────────────────────────────────────┘

  Method Agreement:
    Confirms REJECT: 2/3 (#85, #78)
    Neutral: 1/3 (#130)

Phase 3 (Adversarial) — MANDATORY:

  Finding: Data quality assumptions unclear (IMPORTANT)
  ┌─────────────────────────────────────────────────────────────┐
  │ □ Alternative Explanation: Common ML practice                │
  │   Answer: Yes, but should still be specified                 │
  │   Weakens? NO                                                │
  │ □ Hidden Context: Data preprocessing section?                │
  │   Answer: Section 3 has preprocessing, doesn't define clean  │
  │   Weakens? NO                                                │
  │ □ Domain Exception: Is this standard in ML specs?            │
  │   Answer: Mature ML specs do define data quality criteria    │
  │   Weakens? NO                                                │
  │ □ Survivorship Bias: First finding effect?                   │
  │   Answer: Would still find this systematically               │
  │   Weakens? NO                                                │
  │                                                              │
  │ Result: 0/4 weaken → KEEP IMPORTANT                          │
  └─────────────────────────────────────────────────────────────┘

  Finding: Training/deployment gap (IMPORTANT)
  ┌─────────────────────────────────────────────────────────────┐
  │ □ Alternative Explanation: Obvious to ML practitioners       │
  │   Answer: Not obvious, different environments                │
  │   Weakens? NO                                                │
  │ □ Hidden Context: Section 7 has deployment details           │
  │   Answer: Has details but no bridge from Section 4           │
  │   Weakens? YES (partial bridge exists)                       │
  │ □ Domain Exception: Is gap common in ML specs?               │
  │   Answer: Yes, but still a weakness                          │
  │   Weakens? YES                                               │
  │ □ Survivorship Bias: Reading order?                          │
  │   Answer: Abstraction laddering finds gaps systematically    │
  │   Weakens? NO                                                │
  │                                                              │
  │ Result: 2/4 weaken → DOWNGRADE to MINOR                      │
  │ Adjustment: -0.7                                             │
  └─────────────────────────────────────────────────────────────┘

  Finding: Production accuracy ungrounded (IMPORTANT)
  ┌─────────────────────────────────────────────────────────────┐
  │ □ Alternative Explanation: Projection from training?         │
  │   Answer: Text says "exceeds" as fact, not projection        │
  │   Weakens? NO                                                │
  │ □ Hidden Context: Monitoring section?                        │
  │   Answer: Section 9 has monitoring but no validation         │
  │   Weakens? NO                                                │
  │ □ Domain Exception: Production claims often projections      │
  │   Answer: Should be labeled as projection then               │
  │   Weakens? NO                                                │
  │ □ Survivorship Bias: Similar to satisfaction claim           │
  │   Answer: Different type, independently found                │
  │   Weakens? NO                                                │
  │                                                              │
  │ Result: 0/4 weaken → KEEP IMPORTANT                          │
  └─────────────────────────────────────────────────────────────┘

  Finding: Hidden IID assumption (IMPORTANT)
  ┌─────────────────────────────────────────────────────────────┐
  │ □ Alternative Explanation: Standard ML assumption            │
  │   Answer: Standard but should be stated                      │
  │   Weakens? YES                                               │
  │ □ Hidden Context: Any distribution discussion?               │
  │   Answer: None found                                         │
  │   Weakens? NO                                                │
  │ □ Domain Exception: Always assumed in ML?                    │
  │   Answer: Often violated in production, should be explicit   │
  │   Weakens? YES                                               │
  │ □ Survivorship Bias: Finding patterns?                       │
  │   Answer: Systematically found by assumption excavation      │
  │   Weakens? NO                                                │
  │                                                              │
  │ Result: 2/4 weaken → DOWNGRADE to MINOR                      │
  │ Adjustment: -0.7                                             │
  └─────────────────────────────────────────────────────────────┘

  Steel-man for ACCEPT:
  ┌─────────────────────────────────────────────────────────────┐
  │ 1. "Pipeline architecture is sound"                          │
  │    Evidence: Core flow is well-structured                    │
  │    Holds up? YES                                             │
  │                                                              │
  │ 2. "Training methodology is valid"                           │
  │    Evidence: Standard techniques, reasonable hyperparameters │
  │    Holds up? YES                                             │
  │                                                              │
  │ 3. "Issues are documentation gaps, not design flaws"         │
  │    Evidence: Findings are about missing details, not errors  │
  │    Holds up? YES                                             │
  └─────────────────────────────────────────────────────────────┘

  All steel-man arguments HOLD → strong ACCEPT case despite findings

  False Positive Checklist (since we had findings):
    ✓ Searched for disconfirming evidence
    ✓ Domain expert might agree findings are minor
    ✓ Findings based on what artifact says (missing info)
    ✓ Gave benefit of doubt on IID (downgraded)
    ✓ Author would recognize characterization as fair

  Result: 5/5 checked

Phase 3 Reconciliation:
  Original findings count:
    CRITICAL: 0
    IMPORTANT: 4
    MINOR: 0

  After adversarial review:
    Findings removed: 0
    Findings downgraded: 2 (training gap, IID assumption)
    Findings unchanged: 2 (data quality, production accuracy)

  Final findings count:
    CRITICAL: 0
    IMPORTANT: 2
    MINOR: 2

  Score before Phase 3: 3.0
  Phase 3 adjustments:
    - Training gap downgraded: -0.7
    - IID assumption downgraded: -0.7
  Score after Phase 3: 1.6

Phase 4 (Verdict):
  Final S = 1.6
  -3 < S < 6 → UNCERTAIN

  Confidence: LOW (findings weakened, steel-man holds)

  ACCEPT Validation attempted:
    ✗ All Tier 1 methods passed clean — NO (2 IMPORTANT findings)
    ✓ No CRITICAL findings at any phase — YES
    ✓ Steel-man for REJECT attempted — YES (but holds!)

  Recommendation:
    ACCEPT with caveats, document residual risks:
    1. Define "clean data" operationally
    2. Add bridge from training to deployment
    3. Label production accuracy as projection until validated

Score Breakdown:
  Phase 1:
    IMPORTANT findings (2): +2
    Clean pass (1):        -0.5
  Phase 2:
    IMPORTANT findings (2): +2
    Clean pass (1):        -0.5
  Phase 3:
    Downgrades (2):        -1.4
  ─────────────────────────
  Total:                   1.6
```

---

## Score Calculation Quick Reference

```
Finding Types:
  CRITICAL  = +3 points (alone justifies REJECT)
  IMPORTANT = +1 point (2-3 together justify REJECT)
  MINOR     = +0.3 points (only matters with other issues)
  CLEAN     = -0.5 points (per method with no findings)

Bonuses:
  Pattern match         = +1 point
  Cross-cluster confirm = +1 point

Phase 3 Adjustments:
  CRITICAL → IMPORTANT  = -2 points
  IMPORTANT → MINOR     = -0.7 points
  Finding removed       = -original points

Thresholds:
  S ≥ 6    → REJECT
  S ≤ -3   → ACCEPT
  else     → UNCERTAIN
```

---

## Common Score Trajectories

| Start | Phase 1 | Phase 2 | Phase 3 | Final | Verdict |
|-------|---------|---------|---------|-------|---------|
| 0 | +3 (CRIT) +1 (pattern) | +3 (confirm) | 0 | 7 | REJECT (early) |
| 0 | -1.5 (clean) | -1.5 (clean) | 0 | -3 | ACCEPT |
| 0 | +1 (IMP) | +2 (IMP×2) | -1.4 (2 downgrades) | 1.6 | UNCERTAIN |
| 0 | +0.3 (MIN) -1 (clean) | -1 (clean) | 0 | -1.7 | UNCERTAIN (lean ACCEPT) |

---
