# Deep Verify V11.2.1 — Streamlined Bayesian Verification

## Evolution from V11.2

V11.2.1 retains proven mechanisms, eliminates procedural theater.

| V11.2 Problem | V11.2.1 Solution |
|---------------|------------------|
| "Observable" depth scores = self-reporting | Removed. Quote validation only. |
| Bayesian formalism without real data | Simplified to threshold comparisons |
| EVOI calculations = post-hoc justification | Replaced with explicit method rationale |
| 40% YAML formatting overhead | Markdown tables + prose |
| Redundant findings across 7 sections | Single source of truth + references |
| Rigid 4-method minimum | Early exit when decision clear |
| No scaling by stakes | Three tiers: Quick/Standard/Deep |

---

## Core Principles

### What V11.2 Got Right (Retained)

1. **Loss Function → Decision Thresholds**: Explicit costs make decisions mechanical
2. **Mandatory Quotes**: Every claim must cite `artifact:line`. Prevents confabulation.
3. **Adversarial Phase**: Attack your own findings. Confirms or refutes.
4. **Belief Tracking**: Know how confidence changed and why

### What V11.2 Got Wrong (Removed)

1. **Fake Observables**: "depth_score = 0.87" was self-reported. Gone.
2. **Math Theater**: P(H|O) formulas without calibrated priors. Gone.
3. **EVOI Pretense**: Made-up information values. Gone.
4. **Forced Method Count**: "Must execute 4 methods" even when 2 suffice. Gone.

---

## Workflow Tiers

Select tier based on stakes:

| Tier | When to Use | Time Budget | Output |
|------|-------------|-------------|--------|
| **Quick** | Internal docs, low-risk specs | 15-30 min | 1-page verdict |
| **Standard** | Production specs, moderate risk | 45-90 min | Structured report |
| **Deep** | Safety-critical, regulatory, high-cost failures | 2-4 hours | Full audit trail |

**Selection heuristic:**
- Could a missed flaw cause physical harm? → Deep
- Could a missed flaw cost >$100K? → Standard or Deep
- Is this internal/reversible? → Quick

---

## Phase 0: Setup (All Tiers)

### 0.1 Stakes Assessment

Answer three questions:

```
1. What happens if we ACCEPT a flawed artifact?
   [ ] Minor rework (<$10K, <1 week)
   [ ] Significant rework ($10K-$100K, 1-4 weeks)
   [ ] Major damage (>$100K, >1 month, reputation, safety)

2. What happens if we REJECT a sound artifact?
   [ ] Minor delay (<1 week)
   [ ] Significant delay (1-4 weeks)
   [ ] Major opportunity cost (>1 month, competitive loss)

3. Derived tier:
   [ ] Both minor → Quick
   [ ] Either significant → Standard
   [ ] Either major → Deep
```

### 0.2 Decision Thresholds

Set explicit thresholds based on stakes:

| Stakes | REJECT when P(Fatal) > | ACCEPT when P(Sound+Minor) > |
|--------|------------------------|------------------------------|
| Low | 0.15 | 0.70 |
| Medium | 0.08 | 0.80 |
| High | 0.04 | 0.90 |

**These are not Bayesian posteriors.** They are calibrated intuitions expressed as numbers for decision consistency.

### 0.3 Initial Belief (Honest Assessment)

Rate your gut feeling before analysis:

```
Before reading carefully, this artifact seems:
[ ] Probably sound (prior ~0.6 sound)
[ ] Uncertain (prior ~0.3 sound)
[ ] Probably flawed (prior ~0.15 sound)

Basis for this feeling: [1-2 sentences]
```

---

## Phase 1: Scan for Red Flags

### 1.1 Pattern Matching (5-10 minutes)

Check against known flaw patterns:

#### Impossible Claims
| Pattern | Example | Check |
|---------|---------|-------|
| Accuracy without sample size | "99.9% accurate" | Is N stated? Is N sufficient? |
| Performance across rare events | "Detects all edge cases" | Math possible for long tail? |
| Contradictory guarantees | "Fast AND thorough" | Can both be true? |

#### Logical Contradictions
| Pattern | Example | Check |
|---------|---------|-------|
| Deterministic + Learning | "Reproducible + Adaptive" | Which one wins? |
| Centralized + Distributed | "Single source of truth + No SPOF" | CAP theorem? |
| Secure + Convenient | "Zero-trust + Frictionless" | Where's the tradeoff? |

#### Regulatory Red Flags
| Pattern | Example | Check |
|---------|---------|-------|
| Continuous updates + Approval | "FDA Class III + Real-time learning" | Approval path exists? |
| Privacy + Analytics | "HIPAA compliant + Rich insights" | De-identification verified? |
| Autonomous + Advisory | "Decision support + Auto-action" | Classification correct? |

### 1.2 Record Red Flags Found

For each red flag, record:

```
RED FLAG #[N]
Pattern: [which pattern matched]
Location: [artifact:lines]
Quote: "[exact text]"
Severity: [CRITICAL / IMPORTANT / MINOR]
Confidence: [HIGH / MEDIUM / LOW]
```

**Rule: No quote, no flag.** If you can't point to specific text, it's not a finding.

### 1.3 Early Exit Check

After red flag scan:

```
Critical flags found: [count]
If count ≥ 2 with HIGH confidence:
  → REJECT (Quick tier) or proceed to confirm (Standard/Deep)
If count = 0:
  → Proceed to Phase 2
```

---

## Phase 2: Targeted Analysis

### 2.1 Method Selection (Explicit Rationale)

Choose 2-4 methods based on:
- What red flags need confirmation?
- What areas haven't been checked?
- What could overturn current belief?

**State rationale in plain language:**

```
METHOD: [name]
WHY: [1 sentence - what this method will reveal]
LOOKING FOR: [specific thing that would change belief]
```

No EVOI calculations. Just honest reasoning.

### 2.2 Method Execution

For each method, produce:

```
METHOD: [name]
TIME SPENT: [actual minutes]

CLAIMS EXAMINED:
1. "[quote]" (line X) — [what I tested]
2. "[quote]" (line Y) — [what I tested]

FINDINGS:
- [Finding 1]: [evidence with line numbers]
- [Finding 2]: [evidence with line numbers]

BELIEF SHIFT: [Did this move me toward ACCEPT or REJECT? By how much?]
```

### 2.3 Cross-Reference Check

After methods complete:

```
Do findings from different methods agree?
[ ] Yes — confidence increases
[ ] No — need to resolve conflict

Conflicts found:
- Method A says X, Method B says Y
- Resolution: [which is correct and why]
```

### 2.4 Stopping Rule

**Stop Phase 2 when:**
- Belief clearly exceeds threshold (either direction), OR
- Marginal value of next method < time cost, OR
- Maximum methods reached (Quick: 2, Standard: 4, Deep: 6)

---

## Phase 3: Adversarial Testing

### 3.1 Attack Your Findings

For each major finding, try to break it:

```
FINDING: [statement]
ATTACK: [how could this be wrong?]
RESULT:
  [ ] Attack succeeded — finding weakened/overturned
  [ ] Attack failed — finding strengthened
EVIDENCE: [specific reasoning]
```

### 3.2 Steel-Man the Artifact

Try to defend the artifact:

```
Best case for ACCEPT:
- [Argument 1 for why artifact might be sound]
- [Argument 2]

Do these arguments hold?
[ ] Yes — reconsider REJECT
[ ] No — REJECT confirmed
```

### 3.3 Adversarial Summary

```
Attacks attempted: [N]
Findings overturned: [N]
Findings strengthened: [N]
Steel-man successful: [Yes/No]
```

---

## Phase 4: Decision

### 4.1 Final Belief

```
P(Sound or Minor issues): [0.0-1.0]
P(Structural flaws): [0.0-1.0]
P(Logical contradictions): [0.0-1.0]
P(Fatal flaws): [0.0-1.0]

Basis: [2-3 sentences summarizing evidence]
```

### 4.2 Threshold Comparison

```
REJECT threshold: P(Fatal) > [threshold from 0.2]
Current P(Fatal): [value]
Decision: [ACCEPT / REJECT / ESCALATE]
```

### 4.3 Confidence Assessment

```
How confident am I in this decision?
[ ] High — evidence is clear, attacks failed
[ ] Medium — evidence points one way but some uncertainty
[ ] Low — close call, could go either way

If Low: Consider ESCALATE to human reviewer
```

---

## Phase 5: Report

### 5.1 Quick Tier Report (1 page)

```
ARTIFACT: [name]
VERDICT: [ACCEPT/REJECT]
CONFIDENCE: [High/Medium/Low]

TOP FINDINGS:
1. [Finding] — [artifact:line]
2. [Finding] — [artifact:line]
3. [Finding] — [artifact:line]

DECISION BASIS: [2-3 sentences]

LIMITATIONS: [What wasn't checked]
```

### 5.2 Standard Tier Report

Add to Quick report:

```
METHODOLOGY:
- Tier: Standard
- Methods used: [list]
- Time spent: [total]

DETAILED FINDINGS:
[For each finding: quote, evidence chain, severity]

BELIEF EVOLUTION:
- Initial: [prior]
- After Phase 1: [post red-flag]
- After Phase 2: [post methods]
- After Phase 3: [post adversarial]
- Final: [decision]

ADVERSARIAL SUMMARY:
[Attack results]
```

### 5.3 Deep Tier Report

Add to Standard report:

```
FULL EVIDENCE TRAIL:
[Every quote, every reasoning step, every belief update]

ALTERNATIVE INTERPRETATIONS:
[What if I'm wrong? What would that look like?]

RECOMMENDED FOLLOW-UP:
[What human reviewer should verify]

AUDIT CHECKLIST:
[ ] All findings have quotes
[ ] All quotes verified in artifact
[ ] Adversarial phase completed
[ ] Steel-man attempted
[ ] Conflicts resolved
```

---

## Appendix A: Common Flaw Patterns

### A.1 Statistical Impossibilities

| Claim Type | Red Flag | Check |
|------------|----------|-------|
| High accuracy on rare events | "99.9% detection of X" where X is rare | N × prevalence × accuracy ≥ meaningful sample? |
| Universal performance | "Works for all cases" | Long tail examined? |
| Simultaneous optimization | "Maximizes A and B" where A/B trade off | Pareto frontier acknowledged? |

### A.2 Logical Contradictions

| Pattern | Manifestation | Resolution Question |
|---------|---------------|---------------------|
| Determinism + Adaptation | "Reproducible results" + "Learns from feedback" | Which wins when they conflict? |
| Consistency + Availability | "Always consistent" + "Always available" | CAP theorem addressed? |
| Security + Usability | "Zero trust" + "Seamless experience" | Where's the friction? |

### A.3 Regulatory Impossibilities

| Claim | Reality Check |
|-------|---------------|
| "FDA approved + Continuous learning" | Class II with PCCP? Or Class III without learning? |
| "HIPAA compliant + Real-time analytics" | De-identification method specified? |
| "SOC2 + Customer data access" | Audit trail for all access? |

### A.4 Architectural Contradictions

| Claim | Reality Check |
|-------|---------------|
| "Microservices + Strong consistency" | Saga pattern? 2PC? Accepted inconsistency windows? |
| "Serverless + Sub-100ms latency" | Cold start addressed? |
| "Edge computing + Centralized ML" | Model sync strategy? |

---

## Appendix B: Method Quick Reference

### High-Value Methods (Use First)

| Method | Best For | Time |
|--------|----------|------|
| **Impossibility Check** | Mathematical/logical claims | 10-15 min |
| **Cross-Reference** | Internal consistency | 10-15 min |
| **Regulatory Reality** | Compliance claims | 10-15 min |
| **First Principles** | Fundamental assumptions | 15-20 min |

### Supporting Methods (Use If Needed)

| Method | Best For | Time |
|--------|----------|------|
| **Stakeholder Perspective** | Finding ACCEPT arguments | 10-15 min |
| **Edge Case Analysis** | Boundary conditions | 15-20 min |
| **Dependency Audit** | External assumptions | 10-15 min |
| **Timeline Reality** | Schedule claims | 10-15 min |

### Deep Methods (Deep Tier Only)

| Method | Best For | Time |
|--------|----------|------|
| **Formal Contradiction** | Logical structure | 20-30 min |
| **Attack Surface Mapping** | Security claims | 20-30 min |
| **Failure Mode Analysis** | Reliability claims | 20-30 min |

---

## Appendix C: Calibration Guide

### Interpreting Your Beliefs

| Your Feeling | Approximate P(Fatal) | Meaning |
|--------------|---------------------|---------|
| "This is clearly broken" | 0.7-0.9 | Multiple obvious fatal flaws |
| "I'm worried about this" | 0.4-0.6 | Significant concerns, not certain |
| "Something seems off" | 0.2-0.4 | Red flags but could be okay |
| "Probably fine" | 0.1-0.2 | Minor concerns at most |
| "This is solid" | 0.0-0.1 | No meaningful concerns |

### Belief Update Guidelines

| Evidence Type | Typical Shift |
|---------------|---------------|
| Mathematical impossibility proven | +0.3 to +0.5 toward REJECT |
| Clear logical contradiction found | +0.2 to +0.4 toward REJECT |
| Regulatory path doesn't exist | +0.2 to +0.3 toward REJECT |
| Stakeholder value identified | -0.1 to -0.2 toward ACCEPT |
| Attack on finding failed | +0.1 to +0.2 (strengthens finding) |
| Steel-man argument holds | -0.2 to -0.3 toward ACCEPT |

---

## Appendix D: Quote Validation

### Self-Check Protocol

Before finalizing report:

1. List all quotes used as evidence
2. For each quote:
   - Search artifact for exact text
   - Verify line number is correct
   - Confirm context supports your interpretation

```
QUOTE VALIDATION:
[ ] "[quote 1]" — Found at line [X] ✓
[ ] "[quote 2]" — Found at line [Y] ✓
[ ] All quotes verified
```

### Red Flags in Your Own Work

If you find yourself:
- Paraphrasing instead of quoting → Find exact text or drop claim
- Using "approximately line X" → Find exact line
- Multiple quotes from same section → Diversify evidence sources
- No quotes for major finding → Finding is unsupported

---

## Appendix E: Escalation Criteria

### When to ESCALATE (Not ACCEPT or REJECT)

1. **Evidence Split**: Strong arguments for both ACCEPT and REJECT
2. **Domain Expertise Needed**: Finding requires specialist knowledge you lack
3. **Novel Pattern**: Flaw type not in known patterns, uncertain severity
4. **High Stakes + Low Confidence**: Can't afford to be wrong, not sure

### Escalation Report Format

```
ARTIFACT: [name]
VERDICT: ESCALATE
REASON: [which criterion above]

CURRENT ASSESSMENT:
- Toward ACCEPT: [arguments]
- Toward REJECT: [arguments]
- Unresolved: [what needs expert input]

RECOMMENDED REVIEWER: [type of expertise needed]
SPECIFIC QUESTIONS: [what reviewer should answer]
```

---

## Version History

| Version | Changes |
|---------|---------|
| 11.2 | Full Bayesian, observable proxies, dual-verifier |
| 11.2.1 | Removed theater (fake observables, EVOI, depth scores). Added tiers, pattern library, early exit. Simplified to threshold comparison. |

---

## Quick Start

1. **Assess stakes** → Select tier (Quick/Standard/Deep)
2. **Set thresholds** → Know your REJECT/ACCEPT criteria
3. **Scan for red flags** → Check known patterns (5-10 min)
4. **Early exit?** → If ≥2 critical flags, consider REJECT now
5. **Targeted analysis** → 2-4 methods with explicit rationale
6. **Adversarial test** → Attack your findings, steel-man the artifact
7. **Decide** → Compare belief to threshold
8. **Report** → Tier-appropriate output

**Total time:** Quick 15-30min, Standard 45-90min, Deep 2-4hrs
