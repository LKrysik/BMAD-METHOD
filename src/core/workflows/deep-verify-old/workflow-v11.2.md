# Deep Verify V11.2 — Full Bayesian with Observable Verification

## Evolution from V11.1

V11.1 achieved INCONCLUSIVE (S=7.60) vs V11.0's REJECT (S=49.93). Remaining issues:

| V11.1 Issue | V11.2 Solution |
|-------------|----------------|
| Self-reporting (depth, quality) | Observable proxies + audit trail |
| Arbitrary thresholds | Decision-theoretic derivation |
| New mechanisms untested | Built-in bootstrapping protocol |
| No intra-session backtracking | Iterative belief revision |
| Single verifier subjectivity | Optional dual-verifier mode |

---

## Theoretical Foundation (Full Bayesian)

### The Verification Problem as Bayesian Decision Theory

**State space:** Ω = {ω₁, ω₂, ...} — true states of artifact
**Hypothesis space:** H = {H_SOUND, H_MINOR, H_STRUCTURAL, H_LOGICAL, H_FATAL, H_UNKNOWN}
**Action space:** A = {ACCEPT, REJECT, CONTINUE, ESCALATE}
**Loss function:** L(a, ω) — cost of action a when true state is ω

### Loss Matrix (configurable)

|  | ω_sound | ω_minor | ω_structural | ω_logical | ω_fatal |
|--|---------|---------|--------------|-----------|---------|
| ACCEPT | 0 | C_m | C_s | C_l | C_f |
| REJECT | C_r | C_r | 0 | 0 | 0 |

Where:
- C_m = cost of accepting minor issues (default: 1)
- C_s = cost of accepting structural flaws (default: 5)
- C_l = cost of accepting logical contradictions (default: 10)
- C_f = cost of accepting fatal violations (default: 50)
- C_r = cost of rejecting sound artifact (default: 3)

**Bayes-optimal decision:** Choose action minimizing expected loss:
```
a* = argmin_a Σ_ω P(ω|evidence) · L(a, ω)
```

### Threshold Derivation (not arbitrary)

SPRT thresholds derive from loss function:

**Reject threshold:** When E[L(ACCEPT)] > E[L(REJECT)]
```
Σ P(H_bad) · C_bad > P(H_good) · C_r
```

**Accept threshold:** When E[L(REJECT)] > E[L(ACCEPT)]
```
P(H_good) · C_r > Σ P(H_bad) · C_bad
```

**Default thresholds (derived from default costs):**
- REJECT when: P(H_FATAL) > 0.06 OR P(H_LOGICAL) > 0.12 OR P(H_STRUCTURAL) > 0.30
- ACCEPT when: P(H_SOUND) + P(H_MINOR) > 0.85 AND P(H_FATAL) < 0.01

### Evidence Model

**Observation model:** P(O | H, M) — probability of observation O given hypothesis H and method M

**Method informativeness:** I(M; H) = H(H) - E[H(H|O_M)] — mutual information

**Method cost:** C(M) — tokens/time/cognitive load

**Selection criterion:** Choose method maximizing:
```
U(M) = I(M; H) / C(M) - λ · ρ(M, executed)
```
Where λ · ρ penalizes correlation with already-executed methods.

---

## Observable Verification Protocol

### The Self-Reporting Problem

V11.1 relied on self-reported depth/quality. V11.2 introduces **observable proxies**.

### Observable Proxy 1: Artifact Trace

Every method execution produces **auditable trace**:

```yaml
method_execution:
  method_id: [number]
  start_time: [timestamp]
  end_time: [timestamp]

  # Observable outputs (not self-reported)
  artifact_quotes_extracted: [count]  # Must quote artifact
  questions_generated: [count]        # Must generate questions
  sub-claims_identified: [count]      # Must decompose
  cross_references_made: [count]      # Must connect to other parts

  # Findings with evidence chains
  findings:
    - claim: [what was found]
      evidence_chain:
        - artifact_quote: [exact quote, line number]
        - reasoning_step: [inference]
        - conclusion: [finding]
      confidence: [0-1]

  # Anti-gaming: must document negative space
  checked_but_clean:
    - aspect: [what was checked]
      why_clean: [specific reason]
      what_would_fail: [hypothetical failure]
```

### Observable Proxy 2: Consistency Checks

After each method, system verifies:

1. **Quote validity:** Do artifact_quotes_extracted actually exist in artifact?
2. **Reasoning validity:** Does evidence_chain follow logically?
3. **Specificity check:** Are findings specific (not generic "looks fine")?
4. **Negative space:** Did verifier document what was checked but clean?

**Automated flags:**
- Quote not found in artifact → INVALID_EVIDENCE
- Generic finding without specifics → SHALLOW_EXECUTION
- No checked_but_clean entries → INCOMPLETE_COVERAGE
- Time < method_complexity_minimum → RUSHED_EXECUTION

### Observable Proxy 3: Cross-Method Consistency

Track beliefs across methods:

```
If P(H_X) increases from method M1,
and M2 is in same cluster as M1,
then M2 should also show evidence for H_X
(or explain discrepancy)
```

**Consistency violations trigger:** BELIEF_INCONSISTENCY flag → requires resolution

### Depth Scoring (Observable)

Instead of self-reported "confidence 1-5", compute from observables:

```
depth_score = w1 · (quotes_extracted / expected_quotes)
            + w2 · (questions_generated / expected_questions)
            + w3 · (sub_claims / expected_claims)
            + w4 · (time_spent / expected_time)
            + w5 · (checked_but_clean_count / expected_coverage)
```

**Minimum depth_score for method to count:** 0.6

---

## Phase Structure with Backtracking

### State Machine (replaces linear phases)

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────────────┐
│  INIT    │───▶│  BROAD   │───▶│  NARROW  │───▶│  ADVERSARIAL  │
│ Phase 0  │    │ Phase 1  │    │ Phase 2  │    │    Phase 3    │
└──────────┘    └──────────┘    └──────────┘    └───────────────┘
                    │                │                   │
                    │                │                   │
                    │    SURPRISE    │    REFRAME        │
                    │◀───────────────┤◀──────────────────┤
                    │                │                   │
                    ▼                ▼                   ▼
                         ┌──────────────────────┐
                         │      INTEGRATE       │
                         │       Phase 4        │
                         └──────────────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                         ▼                   ▼
                    ┌─────────┐         ┌─────────┐
                    │ REPORT  │         │ ITERATE │
                    │ Phase 5 │         │ (back)  │
                    └─────────┘         └─────────┘
```

### Backtracking Triggers

| Trigger | Action |
|---------|--------|
| SURPRISE: P(H) shift > 0.3 from single method | Return to BROAD with new prior |
| REFRAME: H_UNKNOWN > 0.2 | Return to INIT, extend hypothesis space |
| CONFLICT: Passive ≠ Adversarial | Return to NARROW with conflict as evidence |
| SHALLOW: depth_score < 0.6 | Re-execute method |

### Iteration Budget

Maximum iterations per phase:
- BROAD → NARROW: 2 iterations
- NARROW → ADVERSARIAL: 2 iterations
- ADVERSARIAL → INTEGRATE: 1 iteration
- Total workflow iterations: 3

**If budget exceeded:** ESCALATE to human with full trace.

---

## Phase 0: Initialization (Full Bayesian)

### Step 0.1: Loss Function Configuration

Before starting, configure loss matrix:

```yaml
loss_configuration:
  context: [what happens if artifact is used]

  cost_of_false_accept:
    minor_issue: [1-10, default 1]
    structural_flaw: [1-50, default 5]
    logical_contradiction: [1-100, default 10]
    fatal_violation: [1-1000, default 50]

  cost_of_false_reject: [1-20, default 3]

  derived_thresholds:
    reject_when_P_fatal_above: [calculated]
    reject_when_P_logical_above: [calculated]
    accept_when_P_good_above: [calculated]
```

### Step 0.2: Prior Elicitation (structured)

Use **probability wheel** method for calibrated priors:

For each hypothesis, answer:
1. "If I had to bet, would I bet on this?" (direction)
2. "At what odds would I be indifferent?" (magnitude)
3. "What evidence would make me 2x more confident?" (calibration check)

```yaml
prior_elicitation:
  H_SOUND:
    initial_feel: [likely/unlikely/uncertain]
    indifference_odds: [X:1]
    derived_probability: [calculated from odds]
    calibration_evidence: [what would double confidence]

  # ... for each hypothesis

  coherence_check: [do probabilities sum to 1?]
  adjustment_if_not: [how to normalize]
```

### Step 0.3: Method Informativeness Estimation

For each candidate method, estimate:

```yaml
method_profile:
  method_id: [number]

  # Discrimination profile
  P_observation_given_H:
    clean_pass:
      H_SOUND: [0.6-0.9]
      H_FATAL: [0.05-0.2]
      # ...
    critical_finding:
      H_SOUND: [0.02-0.1]
      H_FATAL: [0.7-0.95]
      # ...

  estimated_informativeness: [calculated I(M;H)]
  estimated_cost: [tokens/minutes]
  utility: [I/C ratio]

  correlation_with:
    - method: [id]
      rho: [0-1]
```

---

## Phase 1: Broad Classification (Observable)

### Method Selection

Select top-4 methods by utility U(M), ensuring:
- At least 2 different correlation clusters
- At least 1 method that discriminates H_FATAL
- At least 1 method that discriminates H_STRUCTURAL

### Execution with Observable Trace

For each method:

```yaml
execution_trace:
  method_id: 71  # First Principles

  # Phase 1: Decomposition (observable)
  artifact_decomposition:
    claims_extracted:
      - claim: "System guarantees consistency"
        location: "line 47"
        type: GUARANTEE
      - claim: "Recovery is always possible"
        location: "line 89"
        type: GUARANTEE
    count: 2

  # Phase 2: Analysis (observable)
  analysis_per_claim:
    - claim_id: 1
      fundamental_assumption: "Network is reliable"
      stress_test: "What if network partitions?"
      finding: "Claim incompatible with CAP theorem"
      evidence_chain:
        - "Claim: guarantees consistency (line 47)"
        - "Assumption: in distributed system (line 12)"
        - "Theorem: CAP impossibility"
        - "Conclusion: Cannot guarantee consistency under partition"

  # Phase 3: Synthesis (observable)
  synthesis:
    overall_finding: CRITICAL
    confidence: 0.85
    primary_hypothesis_affected: H_FATAL
    belief_shift: +0.35

  # Observables for depth scoring
  observables:
    quotes_extracted: 5
    questions_generated: 3
    sub_claims_identified: 4
    cross_references: 2
    checked_but_clean:
      - aspect: "Internal naming consistency"
        why_clean: "All terms defined in glossary"
    time_spent_minutes: 12

  depth_score: 0.78  # Calculated, not self-reported
```

### Automated Validation

System checks:
- [ ] All quotes exist in artifact
- [ ] Evidence chains are valid
- [ ] depth_score ≥ 0.6
- [ ] checked_but_clean has ≥1 entry

**If any fail:** Flag method, require re-execution or explanation.

### Bayesian Update (Full)

After each method, compute posterior:

```
P(H|O) = P(O|H) · P(H) / Σ P(O|H') · P(H')
```

Using ranges: compute with conservative, central, and optimistic estimates.

**Report posterior with uncertainty:**
```
P(H_FATAL) = 0.25 [0.18 - 0.32]
```

### Phase 1 Exit Criteria

Exit BROAD when:
- 4 methods executed with depth_score ≥ 0.6, AND
- Entropy H(posterior) < H(prior) - 0.5 bits, AND
- No SURPRISE trigger

---

## Phase 2: Adaptive Narrowing (Decision-Theoretic)

### Method Selection by Expected Value of Information

For each candidate method M, compute:

```
EVOI(M) = E[L(a*_current)] - E[L(a*_after_M)]
```

Where:
- a*_current = optimal action given current beliefs
- a*_after_M = expected optimal action after observing M's result

**Select method with highest EVOI/Cost ratio.**

### Mandatory Diversity

Even if EVOI suggests otherwise:
- Must execute ≥1 method that could shift toward ACCEPT
- Must execute ≥1 method that could shift toward REJECT

### Stopping Criterion (Decision-Theoretic)

**Stop when:**
```
EVOI(best_remaining_method) < Cost(method) · threshold
```

Where threshold = 0.1 (configurable based on verification importance).

**In words:** Stop when no method's expected information gain justifies its cost.

### Observable Execution

Same trace format as Phase 1, with additional:

```yaml
decision_context:
  current_optimal_action: [ACCEPT/REJECT/CONTINUE]
  expected_loss_current: [value]

  method_selection_rationale:
    selected: [method_id]
    EVOI: [value]
    alternatives_considered:
      - method: [id]
        EVOI: [value]
        why_not: [reason]
```

---

## Phase 3: Adversarial Verification (Constructive)

### Attack Generation Protocol

For each claim with P(claim_false) > 0.1:

**Step 1: Threat Model**
```yaml
threat_model:
  claim: [quote]
  claim_type: [GUARANTEE/CAPABILITY/PROPERTY]

  what_would_break_it:
    - condition: [specific condition]
      likelihood: [estimated]
    - condition: [specific condition]
      likelihood: [estimated]
```

**Step 2: Attack Construction**
```yaml
attack:
  target_claim: [quote]
  attack_type: [counterexample/edge_case/adversarial_input/assumption_violation]

  construction:
    setup: [how to create the attack scenario]
    execution: [what specifically to test]
    success_criterion: [what would prove claim false]

  result:
    outcome: [SUCCEEDED/FAILED/PARTIAL]
    evidence: [specific observation]

  if_succeeded:
    severity: CRITICAL
    confidence: [calculated from evidence strength]

  if_failed:
    why_failed: [specific reason]
    claim_strengthened_by: [how much]
    remaining_attack_surface: [what wasn't tested]
```

### Attack Sufficiency (Observable)

Minimum requirements:
- 3 attacks per major claim
- At least 1 attack must be "non-trivial" (required setup > 2 steps)
- Attack success rate documented

**Attack quality score:**
```
attack_quality = (non_trivial_attacks / total_attacks)
               · (attack_surface_covered / total_attack_surface)
```

Minimum attack_quality: 0.5

### Adversarial-Passive Reconciliation

```yaml
reconciliation:
  passive_findings: [list from Phase 1-2]
  adversarial_findings: [list from Phase 3]

  agreements:
    - finding: [description]
      passive_evidence: [reference]
      adversarial_evidence: [reference]
      combined_confidence: [higher than either alone]

  conflicts:
    - passive_said: [finding]
      adversarial_said: [opposite]
      resolution_needed: true
      possible_explanations:
        - [explanation 1]
        - [explanation 2]
      additional_evidence_needed: [what would resolve]
```

---

## Phase 4: Integration with Iteration

### Belief Synthesis

Combine all evidence:

```yaml
belief_synthesis:
  # Evidence inventory
  evidence_sources:
    phase_1_methods: [list with weights]
    phase_2_methods: [list with weights]
    phase_3_attacks: [list with weights]

  # Combined posterior
  posterior:
    H_SOUND: [value] ± [uncertainty]
    H_MINOR: [value] ± [uncertainty]
    H_STRUCTURAL: [value] ± [uncertainty]
    H_LOGICAL: [value] ± [uncertainty]
    H_FATAL: [value] ± [uncertainty]
    H_UNKNOWN: [value] ± [uncertainty]

  # Decision
  expected_loss:
    ACCEPT: [calculated]
    REJECT: [calculated]

  optimal_action: [ACCEPT/REJECT]
  confidence: [based on loss difference]
```

### Iteration Decision

```yaml
iteration_check:
  unresolved_conflicts: [count]
  H_UNKNOWN_level: [value]
  depth_scores_below_threshold: [count]
  surprise_triggers_hit: [count]

  iteration_needed: [true/false]
  iteration_type: [SURPRISE/REFRAME/CONFLICT/SHALLOW]
  target_phase: [which phase to return to]

  iteration_budget_remaining: [count]

  if_budget_exceeded:
    action: ESCALATE
    handoff_summary: [what human needs to resolve]
```

### Convergence Criteria

Workflow converges when:
- No unresolved conflicts
- H_UNKNOWN < 0.1
- All methods have depth_score ≥ 0.6
- Expected loss difference |E[L(ACCEPT)] - E[L(REJECT)]| > threshold

---

## Phase 5: Report with Full Audit Trail

### Executive Summary

```
ARTIFACT: [name]
VERIFICATION ID: [unique]
WORKFLOW VERSION: 11.2

VERDICT: [ACCEPT/REJECT/ESCALATE]
CONFIDENCE: [calculated from loss difference]

KEY FINDINGS:
1. [finding] — evidence strength [strong/moderate/weak]
2. [finding] — evidence strength [strong/moderate/weak]

DECISION RATIONALE:
- Expected loss of ACCEPT: [value]
- Expected loss of REJECT: [value]
- Optimal action: [ACCEPT/REJECT]
```

### Belief Evolution Trace

```yaml
belief_trace:
  - phase: INIT
    posterior: {H_SOUND: 0.30, ...}
    entropy: 2.3 bits

  - phase: BROAD
    method: 71
    observation: CRITICAL_FINDING
    posterior: {H_SOUND: 0.15, H_FATAL: 0.35, ...}
    entropy: 2.1 bits
    belief_shift: 0.2

  # ... full trace

  - phase: FINAL
    posterior: {H_SOUND: 0.08, H_FATAL: 0.52, ...}
    entropy: 1.4 bits
    total_evidence_processed: 12 observations
```

### Observable Metrics

```yaml
verification_quality:
  methods_executed: [count]
  average_depth_score: [value]
  methods_below_threshold: [count]

  attacks_attempted: [count]
  attack_quality_score: [value]

  iterations_performed: [count]
  conflicts_resolved: [count]
  conflicts_unresolved: [count]

  total_time: [minutes]
  total_tokens: [count]

  automated_flags_triggered:
    - flag: [type]
      resolution: [how resolved]
```

### Audit Trail

```yaml
audit_trail:
  all_quotes_validated: [true/false]
  evidence_chains_valid: [true/false]
  depth_requirements_met: [true/false]
  diversity_requirements_met: [true/false]

  anomalies:
    - type: [anomaly type]
      description: [what happened]
      resolution: [how handled]
```

### Limitations and Handoffs

```yaml
limitations:
  what_was_checked:
    - [aspect 1]
    - [aspect 2]

  what_was_not_checked:
    - aspect: [description]
      reason: [why not checked]
      risk: [what could be missed]

  assumptions_still_unvalidated:
    - assumption: [description]
      impact_if_wrong: [consequence]

  recommended_additional_verification:
    - [suggestion 1]
    - [suggestion 2]

  user_must_verify:
    - [item requiring human judgment]
```

---

## Appendix A: Dual-Verifier Mode (Optional)

### When to Use

- High-stakes artifacts (C_f > 100)
- Novel artifact types (H_UNKNOWN prior > 0.15)
- When single-verifier subjectivity is concern

### Protocol

```yaml
dual_verifier_protocol:
  verifier_1:
    executes: [odd-numbered methods]
    sees: [artifact only, not V2's findings]

  verifier_2:
    executes: [even-numbered methods]
    sees: [artifact only, not V1's findings]

  comparison_phase:
    belief_agreement: |P1(H) - P2(H)| for each H
    finding_agreement: overlap coefficient

    if_agreement_high: [> 0.8]
      action: combine evidence, proceed

    if_agreement_low: [< 0.5]
      action: joint review of disagreements
      resolution: explicit reconciliation

  combined_verdict:
    method: [average / conservative / discussion]
```

### Inter-Rater Reliability Tracking

```yaml
reliability_metrics:
  sessions_with_dual_verifier: [count]
  average_belief_agreement: [value]
  average_finding_agreement: [value]

  disagreement_patterns:
    - type: [pattern]
      frequency: [count]
      typical_resolution: [how resolved]
```

---

## Appendix B: Bootstrapping Protocol (Mechanism Validation)

### Self-Validation Design

V11.2 mechanisms need validation. Bootstrap protocol:

**Phase 1: Synthetic Artifacts**
Create artifacts with known defects:
- 10 SOUND artifacts (verified by construction)
- 10 artifacts with planted CRITICAL defects
- 10 artifacts with planted STRUCTURAL defects

**Phase 2: Blind Verification**
Run V11.2 on all 30 without knowing ground truth.

**Phase 3: Calibration**
```yaml
calibration_results:
  true_positive_rate: [detected_critical / actual_critical]
  false_positive_rate: [false_critical / actual_sound]

  depth_score_correlation: [correlation with finding quality]

  threshold_performance:
    current_thresholds: [values]
    optimal_thresholds: [calculated from ROC]
    adjustment_needed: [yes/no]
```

**Phase 4: Mechanism Adjustment**
Based on calibration:
- Adjust likelihood tables
- Adjust depth_score weights
- Adjust stopping thresholds

### Ongoing Calibration

After every 10 real verifications:
```yaml
calibration_update:
  ground_truth_available: [count]

  performance:
    accuracy: [value]
    precision: [value]
    recall: [value]

  drift_detected: [yes/no]
  recalibration_needed: [yes/no]
```

---

## Appendix C: Threshold Derivation Tables

### From Loss Function to Thresholds

Given loss matrix L, derive thresholds:

**REJECT threshold for H_FATAL:**
```
P(H_FATAL) > C_r / (C_f + C_r)

Default: P(H_FATAL) > 3 / (50 + 3) = 0.057
```

**REJECT threshold for H_LOGICAL:**
```
P(H_LOGICAL) > C_r / (C_l + C_r)

Default: P(H_LOGICAL) > 3 / (10 + 3) = 0.23
```

**ACCEPT threshold:**
```
P(H_SOUND) + P(H_MINOR) > 1 - C_r / (C_weighted_bad + C_r)

Where C_weighted_bad = weighted average of bad costs by prior
```

### Threshold Sensitivity

| Cost Ratio (C_f/C_r) | REJECT threshold P(H_FATAL) |
|---------------------|----------------------------|
| 10:1 | 0.09 |
| 20:1 | 0.05 |
| 50:1 (default) | 0.02 |
| 100:1 | 0.01 |

**User guidance:** Set C_f/C_r based on:
- Production system: 50-100
- Internal tool: 10-20
- Prototype: 5-10

---

## Appendix D: Observable Proxy Weights

### Depth Score Calculation

```
depth_score = 0.20 · (quotes / expected_quotes)
            + 0.20 · (questions / expected_questions)
            + 0.15 · (sub_claims / expected_claims)
            + 0.15 · (cross_refs / expected_refs)
            + 0.15 · (checked_clean / expected_coverage)
            + 0.15 · min(1, time / expected_time)
```

### Expected Values by Method Complexity

| Complexity | Expected Quotes | Expected Questions | Expected Time (min) |
|------------|-----------------|-------------------|---------------------|
| Low | 3 | 2 | 5 |
| Medium | 5 | 4 | 10 |
| High | 8 | 6 | 15 |

### Method Complexity Classification

| Method Category | Complexity |
|-----------------|------------|
| Sanity checks (#81-90) | Low |
| Core analysis (#71-80) | Medium |
| Theory checks (#153-166) | High |
| Challenge methods (#121-130) | High |

---

## Appendix E: Information-Theoretic Method Selection

### Mutual Information Calculation

For method M with possible observations O = {o₁, o₂, ...}:

```
I(M; H) = Σ_o P(o) · Σ_h P(h|o) · log[P(h|o) / P(h)]
```

### Approximation for Practical Use

When exact calculation impractical:

```
I_approx(M) = Σ_h P(h) · |P(o_typical|h) - P(o_typical|¬h)|
```

**In words:** Method is informative if typical observation differs between hypotheses.

### Method Ranking Table (pre-computed)

| Method | I(M; H_FATAL) | I(M; H_STRUCTURAL) | I(M; H_LOGICAL) | Total I |
|--------|---------------|--------------------|-----------------| --------|
| #153 Theoretical Impossibility | 0.8 | 0.2 | 0.3 | 1.3 |
| #154 Definitional Contradiction | 0.4 | 0.3 | 0.9 | 1.6 |
| #116 Strange Loop | 0.2 | 0.7 | 0.5 | 1.4 |
| #84 Coherence | 0.3 | 0.5 | 0.6 | 1.4 |
| #71 First Principles | 0.6 | 0.4 | 0.3 | 1.3 |

---

## Appendix F: Iteration State Machine

### Formal Definition

```
States: {INIT, BROAD, NARROW, ADVERSARIAL, INTEGRATE, REPORT, ESCALATE}

Transitions:
  INIT → BROAD: always
  BROAD → NARROW: entropy_reduced ∧ no_surprise
  BROAD → BROAD: surprise (max 2)
  NARROW → ADVERSARIAL: EVOI_exhausted ∧ no_conflict
  NARROW → BROAD: reframe (H_UNKNOWN > 0.2)
  ADVERSARIAL → INTEGRATE: attacks_sufficient
  ADVERSARIAL → NARROW: conflict_detected
  INTEGRATE → REPORT: converged
  INTEGRATE → BROAD: iteration_needed ∧ budget_remaining
  INTEGRATE → ESCALATE: budget_exceeded ∨ unresolvable

Invariants:
  - iteration_count ≤ 3
  - phase_revisit_count[phase] ≤ 2
  - total_methods ≤ 20
```

### Termination Guarantee

Workflow terminates because:
1. Iteration budget is finite (3)
2. Phase revisit budget is finite (2 per phase)
3. Method budget is finite (20)
4. ESCALATE is always available

---

## Meta-Verification Prediction

V11.2 should achieve:
- S in range (-4, 4) — mild INCONCLUSIVE or weak ACCEPT
- CRITICAL findings: 0
- IMPORTANT findings: ≤5 (residual self-reporting, untested bootstrapping)
- Observable mechanisms address main V11.1 weaknesses

**Remaining known limitations:**
1. Bootstrapping protocol is described but not executed (meta-level)
2. Dual-verifier is optional, single-verifier subjectivity remains possible
3. Loss function configuration is user-dependent
4. Observable proxies can still be gamed with effort (but effort is higher)
