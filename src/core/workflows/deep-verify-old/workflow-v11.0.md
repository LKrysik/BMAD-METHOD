# Deep Verify V11.0 — Bayesian Sequential Verification

## Theoretical Foundation

This workflow implements **Bayesian sequential identification** with bounded resources. Core principles:

1. **Information Gain Maximization** — Select methods that maximize expected entropy reduction
2. **Sequential Probability Ratio Test (SPRT)** — Formal early stopping when sufficient evidence accumulated
3. **Value of Information (VoI)** — Only execute methods that could change the decision
4. **Cost-Adjusted Selection** — Prefer high (information-gain / cost) ratio

---

## Instruction

Execute Phases 0-4 in order. At each decision point, apply the specified selection or stopping criterion.

---

## Phase 0 ground: Self-Check (MANDATORY)

**Goal:** Establish honesty and awareness of potential biases before starting the analysis.

**Process:** Execute the following methods concerning the verification task ahead. The output of this phase is for the agent's internal guidance and must be completed before proceeding.

1.  **#113 Counterfactual Self-Incrimination:** List 3 ways you could be deceptive or cut corners in THIS specific verification. Provide concrete evidence for why you are not doing so.
2.  **#131 Observer Paradox:** Is your planned analysis GENUINE (focused on finding the truth) or PERFORMANCE (focused on appearing thorough)? Identify signs of performance and correct course.
3.  **#132 Goodhart's Law Check:** What is the primary metric for success in this verification (e.g., "number of findings")? How could you "game" this metric while failing the actual goal (e.g., "improving artifact quality")? Commit to pursuing the goal, not the metric.



## Phase 0: Prior Construction

**Goal:** Establish the hypothesis space and initial probability distribution.

### Step 0.1: Self-Calibration
Before starting, answer honestly:
1. What outcome am I expecting? (Note this — it's your bias)
2. Am I verifying or confirming?
3. What would make me change my mind?

### Step 0.2: Hypothesis Space Definition

Define the space of possible "artifact states" H = {h₁, h₂, ..., hₙ}:

| Hypothesis | Description | Prior P(h) |
|------------|-------------|------------|
| H_SOUND | Artifact is fundamentally sound | 0.30 |
| H_MINOR | Contains minor issues only | 0.25 |
| H_STRUCTURAL | Has structural/architectural flaws | 0.20 |
| H_LOGICAL | Contains logical contradictions | 0.15 |
| H_FATAL | Has fatal theoretical violations | 0.10 |

**Prior calibration heuristic:**
- First impression "looks solid" → shift 0.1 toward H_SOUND
- Contains absolute claims ("guarantees", "always") → shift 0.1 toward H_FATAL
- High complexity visible → shift 0.1 toward H_STRUCTURAL
- Domain you know well → trust your prior more

### Step 0.3: Defect Class Taxonomy

Parallel to artifact state, maintain beliefs about defect types:

| Defect Class | Description | Prior |
|--------------|-------------|-------|
| D_NONE | No significant defects | 0.30 |
| D_THEORY | Violates theorems/impossibilities | 0.10 |
| D_CONTRADICTION | Internal logical contradiction | 0.15 |
| D_CIRCULAR | Circular reasoning/dependencies | 0.10 |
| D_UNGROUNDED | Claims without justification | 0.20 |
| D_BOUNDARY | Scope/boundary violations | 0.15 |

**Output:** Initial belief state B₀ = {P(H), P(D)}

---

## Phase 1: Broad Classification (High Information Gain, Low Cost)

**Goal:** Rapidly partition hypothesis space using cheap, discriminating methods.

### Selection Criterion

For each candidate method m, estimate:
- **Discriminative power:** How many hypotheses does it distinguish between?
- **Cost:** Token/cognitive overhead
- **Select methods maximizing:** IG(m) / Cost(m)

### Tier 1 Methods (Execute ALL — these are cheap and broadly discriminating)

| # | Method | Discriminates | Cost |
|---|--------|---------------|------|
| 71 | First Principles | H_SOUND vs H_FATAL | Low |
| 105 | Epoché | H_SOUND vs H_UNGROUNDED | Low |
| 100 | Vocabulary Audit | H_SOUND vs H_CONTRADICTION | Low |
| 17 | Abstraction Laddering | H_STRUCTURAL vs others | Low |

### Execution Protocol

For each Tier 1 method:
1. Execute method
2. Record observation O
3. **Bayesian update:** P(H|O) ∝ P(O|H) · P(H)
4. Record updated belief state B₁

### Likelihood Estimation Heuristic

When method produces observation O, estimate P(O|H) as:

| Observation | P(O|H_SOUND) | P(O|H_FATAL) | P(O|H_STRUCTURAL) |
|-------------|--------------|--------------|-------------------|
| Clean pass | 0.8 | 0.1 | 0.3 |
| Minor issue | 0.6 | 0.3 | 0.5 |
| Significant issue | 0.2 | 0.6 | 0.7 |
| Critical issue | 0.05 | 0.9 | 0.4 |

**Output:** Updated belief state B₁, partitioned hypothesis space

---

## Phase 2: Adaptive Narrowing (Uncertainty Sampling)

**Goal:** Select methods targeting maximum remaining uncertainty.

### Selection Criterion: Uncertainty Sampling

Choose the method that targets the hypothesis with highest uncertainty:
- Calculate entropy of current belief: H(B) = -Σ P(h) log P(h)
- Select method m* that maximizes expected entropy reduction: E[H(B) - H(B|Oₘ)]

**Note:** When already leaning toward a decision (P(ACCEPT) > 0.6 or < 0.4), switch to **Decision Boundary IG** instead of standard IG. See Appendix F.

### Method Selection Matrix

Based on leading hypothesis after Phase 1, select method set:

**If H_FATAL or H_LOGICAL leads (P > 0.3):**
| # | Method | Purpose | Expected IG |
|---|--------|---------|-------------|
| 153 | Theoretical Impossibility | Confirm/refute H_FATAL | High |
| 154 | Definitional Contradiction | Confirm/refute H_LOGICAL | High |
| 163 | Existence Proof Demand | Challenge unproven claims | Medium |

**If H_STRUCTURAL leads (P > 0.3):**
| # | Method | Purpose | Expected IG |
|---|--------|---------|-------------|
| 116 | Strange Loop Detection | Find circular structures | High |
| 86 | Topological Holes | Find structural gaps | High |
| 159 | Transitive Dependency | Find hidden dependencies | Medium |

**If H_UNGROUNDED leads via D_UNGROUNDED (P > 0.3):**
| # | Method | Purpose | Expected IG |
|---|--------|---------|-------------|
| 85 | Grounding Check | Find unjustified claims | High |
| 78 | Assumption Excavation | Surface hidden assumptions | High |
| 130 | Assumption Torture | Stress-test assumptions | Medium |

**If belief is diffuse (max P(h) < 0.3):**
Execute methods with highest average discrimination across all hypotheses:
| # | Method | Purpose |
|---|--------|---------|
| 84 | Coherence Check | General consistency |
| 109 | Contraposition | Reveal hidden failure modes |
| 63 | Critical Challenge | Strongest counter-argument |

**Important:** Account for method correlations when selecting. If you already executed #153 and found nothing, #154's marginal IG drops significantly. See Appendix C for correlation clusters.

### Execution Protocol with SPRT Stopping

After each method execution, apply **Sequential Probability Ratio Test**:

**Define:**
- H₀: Artifact is acceptable (H_SOUND ∨ H_MINOR)
- H₁: Artifact has critical issues (H_STRUCTURAL ∨ H_LOGICAL ∨ H_FATAL)
- Likelihood ratio: Λₙ = P(observations|H₁) / P(observations|H₀)

**Decision boundaries:**
- Upper threshold A = 19 (corresponds to α = 0.05)
- Lower threshold B = 1/19 ≈ 0.05 (corresponds to β = 0.05)

**Decision rule:**
- If Λₙ ≥ A → **STOP, REJECT** (sufficient evidence for H₁)
- If Λₙ ≤ B → **STOP, ACCEPT** (sufficient evidence for H₀)
- If B < Λₙ < A → **CONTINUE** (need more evidence)

### Practical SPRT Implementation

Track cumulative evidence score S:
- Start: S = 0
- Each finding: S += severity_weight × confidence
  - CRITICAL: weight = 3
  - IMPORTANT: weight = 1
  - MINOR: weight = 0.3
- Each clean method pass: S -= 0.5

**Stopping thresholds:**
- S ≥ 6 → STOP, strong evidence of critical issues
- S ≤ -3 → STOP, strong evidence artifact is sound
- Otherwise → CONTINUE

**Secondary stopping:** If primary SPRT doesn't terminate after 8+ methods, check for oscillation or entropy plateau. See Appendix E.

**Escape hatch:** If observations don't fit any hypothesis well (all likelihoods < 0.2), consider extending hypothesis space. See Appendix G.

**Output:** Updated belief state B₂, possibly early termination

---

## Phase 3: Domain Validation (Value of Information Check)

**Goal:** Verify semantic correctness in domain context. Only execute if VoI > 0.

### Value of Information Check

Before executing any Phase 3 method, ask:
> "If this method finds an issue, would it change my verdict?"
> "If this method finds nothing, would it change my verdict?"

If answer to both is NO → skip method (VoI = 0)

### Conditional Method Selection

**Only if artifact passed SPRT toward acceptance AND domain-specific risks exist:**

| Domain Signal | Methods | Condition |
|---------------|---------|-----------|
| Security-related | #34 Security Personas, #21 Red Team | If security keywords detected |
| Concurrency | #67 Stability Basin, #62 Failure Mode | If state/async patterns detected |
| External deps | #127 Bootstrap Paradox, #97 Boundary Violation | If integration points detected |
| Performance claims | #129 Stress Test, #165 Constructive Counterexample | If performance guarantees claimed |

### Execution Protocol

For each selected domain method:
1. Verify VoI > 0 (could change decision)
2. Execute method
3. Update belief state B₃
4. Re-check SPRT thresholds

**Output:** Final belief state B_final

---

## Phase 4: Report

### Belief State Summary

```
ARTIFACT: [name]

PRIOR → POSTERIOR EVOLUTION:
P(H_SOUND):      [prior] → [posterior]
P(H_MINOR):      [prior] → [posterior]
P(H_STRUCTURAL): [prior] → [posterior]
P(H_LOGICAL):    [prior] → [posterior]
P(H_FATAL):      [prior] → [posterior]

EVIDENCE SCORE (S): [value]
SPRT DECISION: [REJECT/ACCEPT/INCONCLUSIVE]
METHODS EXECUTED: [N] / EARLY EXIT: [Y/N at method #X]
```

### Evidence Trail

For each finding that shifted beliefs significantly:
```
[F1] Method #[N] | Belief shift: P(H_X) [before] → [after]
Observation: [what was found]
Evidence: [quote or logical chain]
Likelihood ratio contribution: [value]
```

### Verdict Logic

Based on SPRT decision and final belief state:

| SPRT Result | max P(H) | Verdict |
|-------------|----------|---------|
| REJECT (S ≥ 6) | H_FATAL or H_LOGICAL > 0.5 | **REJECT** |
| REJECT (S ≥ 6) | H_STRUCTURAL > 0.5 | **NEEDS REVISION** |
| ACCEPT (S ≤ -3) | H_SOUND > 0.5 | **PASS** |
| ACCEPT (S ≤ -3) | H_MINOR > 0.5 | **PASS WITH CAVEATS** |
| INCONCLUSIVE | any | **NEEDS FURTHER REVIEW** |

### Action Items

```
VERDICT: [verdict]

CONFIDENCE: [high/medium/low] based on SPRT margin

KEY FINDINGS:
1. [finding] — evidence strength: [strong/moderate/weak]
2. [finding] — evidence strength: [strong/moderate/weak]

RECOMMENDED ACTIONS:
1. [action] → addresses [finding]
2. [action] → addresses [finding]

REMAINING UNCERTAINTY:
- [what wasn't checked and why VoI was 0]
- [what would require external/human verification]
```

---

## Appendix A: Method Cost & Discrimination Matrix

Reference table for Phase 1-2 selection decisions:

| # | Method | Cost | Discriminates Between |
|---|--------|------|----------------------|
| 71 | First Principles | Low | H_SOUND ↔ H_FATAL |
| 105 | Epoché | Low | H_SOUND ↔ H_UNGROUNDED |
| 100 | Vocabulary | Low | H_SOUND ↔ H_CONTRADICTION |
| 17 | Abstraction Laddering | Low | H_STRUCTURAL ↔ others |
| 153 | Theoretical Impossibility | Medium | H_FATAL ↔ others |
| 154 | Definitional Contradiction | Medium | H_LOGICAL ↔ others |
| 116 | Strange Loop | Medium | H_CIRCULAR ↔ others |
| 84 | Coherence Check | Medium | General discrimination |
| 85 | Grounding Check | Medium | H_UNGROUNDED ↔ others |
| 78 | Assumption Excavation | Medium | H_UNGROUNDED ↔ others |
| 109 | Contraposition | Medium | H_FATAL ↔ H_SOUND |
| 63 | Critical Challenge | High | Confirmation of any hypothesis |
| 130 | Assumption Torture | High | H_STRUCTURAL ↔ H_SOUND |
| 34 | Security Personas | High | Domain-specific |
| 21 | Red Team | High | Domain-specific |

---

## Appendix B: Practical Heuristic (If Formal Calculation Impractical)

When precise Bayesian calculation isn't feasible, use this greedy approximation:

1. **Sort methods by: (expected information gain) / (cost)**
2. **Start with cheapest, broadest methods** (Tier 1)
3. **After each method, ask:**
   - Did this significantly change my beliefs? (If yes, continue in this direction)
   - Am I now confident enough to stop? (Check S against thresholds)
4. **Move to expensive, specific methods only when:**
   - Cheap methods exhausted AND
   - Still uncertain (B < Λ < A)
5. **Stop when:**
   - S ≥ 6 (reject) or S ≤ -3 (accept), OR
   - All high-VoI methods exhausted

---

## Appendix C: Method Correlation Matrix

Methods are not independent — findings from one method predict findings from others. Account for this when calculating **marginal information gain**.

### Correlation Classes

| Class | Methods | Correlation | Implication |
|-------|---------|-------------|-------------|
| Theory-cluster | #153, #154, #163, #162 | ρ ≈ 0.7 | If #153 finds issue, #154 likely will too — marginal IG of #154 drops |
| Structure-cluster | #116, #86, #159 | ρ ≈ 0.6 | Circular deps often co-occur with structural gaps |
| Grounding-cluster | #85, #78, #130 | ρ ≈ 0.8 | Hidden assumptions and ungrounded claims overlap heavily |
| Challenge-cluster | #109, #63, #165 | ρ ≈ 0.5 | Moderate correlation — different attack angles |

### Marginal IG Calculation

When selecting method mₙ after already executing {m₁, ..., mₙ₋₁}:

```
Marginal_IG(mₙ) = IG(mₙ) × (1 - max(ρ(mₙ, mᵢ) for mᵢ in executed))
```

**Practical rule:** If you already executed a method from a cluster and found nothing, skip other methods in that cluster (they're unlikely to find anything either). If you found something, one more method from the same cluster can confirm, but three is wasteful.

### Selection with Correlation

1. Pick first method from each relevant cluster (diversity)
2. Only add second method from cluster if first found something
3. Never add third method from same cluster

---

## Appendix D: Dynamic Likelihood Recalibration

The likelihood tables in Phase 1 are **starting points**. Update them based on observed outcomes.

### Beta-Binomial Model for Likelihood Uncertainty

Instead of point estimates P(O|H), maintain Beta distributions:

```
P(O=clean|H_SOUND) ~ Beta(α, β)

Initial: Beta(8, 2)  → mean = 0.8, but with uncertainty
After 5 verifications where H_SOUND artifacts passed cleanly 4/5 times:
Updated: Beta(8+4, 2+1) = Beta(12, 3) → mean = 0.8, tighter
```

### Recalibration Protocol

After each verification session with known outcome:

1. Record: which methods executed, what observations, final ground truth (if known later)
2. For each (method, observation, hypothesis) triple:
   - If ground truth confirms hypothesis: α += 1
   - If ground truth refutes hypothesis: β += 1
3. Update likelihood table with new Beta means

### Conservative Decision Under Uncertainty

When Beta distribution has high variance (α + β < 10):
- Use **lower bound of 80% credible interval** for P(O|H) instead of mean
- This is more conservative — requires stronger evidence to shift beliefs

---

## Appendix E: Secondary Stopping Rules

### The Inconclusive Problem

Primary SPRT can oscillate when:
- Artifact has mixed quality (some parts sound, some flawed)
- Methods disagree (false positives / false negatives)
- Evidence is genuinely ambiguous

### Secondary Stopping Criteria

Apply after **N methods executed** without SPRT termination:

| Condition | N | Action |
|-----------|---|--------|
| Budget exhausted | 12 | STOP → INCONCLUSIVE |
| Oscillation detected | 8 | S crossed 0 three times → STOP → ESCALATE |
| Entropy plateau | 6 | H(B) unchanged ±0.1 for 3 methods → STOP → ESCALATE |
| Diminishing returns | 10 | Last 3 methods all clean but S still in (-3, 6) → STOP → ACCEPT WITH LOW CONFIDENCE |

### Oscillation Detection

Track S history: [S₀, S₁, S₂, ...]

Oscillation = sign(Sₙ - Sₙ₋₁) ≠ sign(Sₙ₋₁ - Sₙ₋₂) for 3+ consecutive pairs

**Meaning:** Evidence keeps flipping direction — artifact likely has mixed quality, needs human judgment.

### Escalation Protocol

When ESCALATE triggered:
1. Document current belief state
2. List specific unresolved tensions
3. Identify what information would resolve (often external/empirical)
4. Hand off to human reviewer with clear question

---

## Appendix F: Decision Boundary Information Gain

### The Problem with Average IG

Standard IG measures how much a method reduces entropy across **all hypotheses**. But for binary ACCEPT/REJECT decisions, you only care about the **decision boundary**.

### Decision-Relevant IG

Define decision regions:
- ACCEPT region: {H_SOUND, H_MINOR}
- REJECT region: {H_STRUCTURAL, H_LOGICAL, H_FATAL}

**Decision-Boundary IG** = how much method helps distinguish ACCEPT from REJECT, ignoring discrimination *within* regions.

### Calculation

```
P(ACCEPT) = P(H_SOUND) + P(H_MINOR)
P(REJECT) = P(H_STRUCTURAL) + P(H_LOGICAL) + P(H_FATAL)

DB_IG(m) = E[|P(ACCEPT|Oₘ) - P(ACCEPT)|]
```

**Practical approximation:**
- Method has high DB_IG if it produces very different observations for ACCEPT vs REJECT artifacts
- Method has low DB_IG if it produces similar observations regardless of true state

### When to Use DB_IG vs Standard IG

| Situation | Use |
|-----------|-----|
| Belief is diffuse (max P(h) < 0.3) | Standard IG (need to narrow down) |
| Already leaning toward decision (P(ACCEPT) > 0.6 or < 0.4) | DB_IG (need to confirm/refute the lean) |
| Gathering information for report | Standard IG (want to understand *which* type of issue) |

---

## Appendix G: Hypothesis Space Extension (H_UNKNOWN Escape Hatch)

### The Closed World Problem

The hypothesis space {H_SOUND, H_MINOR, H_STRUCTURAL, H_LOGICAL, H_FATAL} assumes artifacts fall into known categories. But sometimes:
- Artifact is fundamentally different from assumptions
- Issue type is novel
- Artifact is malformed in ways not captured by hypotheses

### H_UNKNOWN Detection

Trigger H_UNKNOWN consideration when:

1. **Likelihood collapse:** All P(O|H) values are low (< 0.2) for an observation
   - Meaning: What we observed doesn't fit any hypothesis well

2. **Posterior divergence:** P(H) distribution becomes extreme (one hypothesis > 0.95) but methods keep finding unexpected results
   - Meaning: We're forcing evidence into wrong category

3. **Coherent nonsense:** Artifact passes all structural checks but something feels deeply wrong
   - Meaning: Our hypothesis space doesn't capture this failure mode

### Extension Protocol

When H_UNKNOWN triggered:

1. **Pause** hypothesis updating
2. **Generate** 2-3 alternative hypotheses based on observations:
   - "What kind of artifact would produce these observations?"
   - "What assumption am I making that might be wrong?"
3. **Extend** hypothesis space with best candidate
4. **Re-estimate** priors for extended space
5. **Continue** verification with expanded model

### Example Extensions

| Original Space | Observation Pattern | Extended With |
|----------------|--------------------|--------------|
| Standard | All methods pass but artifact is clearly wrong | H_DOMAIN_MISMATCH (wrong problem being solved) |
| Standard | Methods conflict wildly | H_AMBIGUOUS (artifact genuinely underdetermined) |
| Standard | Passing methods that should fail | H_DECEIVED (artifact designed to pass verification) |

### Meta-Hypothesis

Always maintain implicit H_UNKNOWN with prior 0.05 (representing model uncertainty). If posterior P(H_UNKNOWN) rises above 0.15 based on likelihood collapse, trigger extension protocol
