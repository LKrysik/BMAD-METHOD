# Deep Verify V7.2 - Streamlined Error Theory AVS

## What is this?

**Deep Verify V7.2** is a streamlined evolution of V7.1, removing low-ROI components while preserving high-value detection capabilities.

**Core Innovation Retained:** Error Theory seeding + Domain Knowledge lookups → focused method selection → high hit rate.

---

## Key Concepts

| Term | Definition |
|------|------------|
| ERROR THEORY | Systematic taxonomy of error types (Logic, Security, Omission, etc.) |
| TAXONOMY SCAN | Layer 1 step to tag artifact with potential error categories |
| SEEDED SELECTION | Using Taxonomy tags to boost relevance of specific methods |
| DOMAIN KNOWLEDGE | Impossibility theorems, term definitions, contradiction patterns per domain |
| TIER | Execution depth: QUICK (1) / STANDARD (2) / DEEP (3) |
| STOP WHEN CONFIDENT | Exit analysis when findings stabilize, don't force all phases |

**Methods source:** `src/core/methods/methods.csv`
**Domain knowledge:** `src/core/knowledge/domain-knowledge-base.md` (use as lookup, not separate phase)

---

## Phase 0: Intake & Triage (MANDATORY)

**Purpose:** Profile artifact and select execution tier.
**Target:** ~1K tokens

### Step 0.1: Quick Self-Check

```
## Phase 0.1: Self-Check
Primary bias risk: [what could I miss?]
CUI BONO: [who benefits if I miss something?]
Watchlist: [3 specific things to watch for]
```

### Step 0.2: Artifact Profile (Simplified)

```
## Phase 0.2: Artifact Profile

| Property | Value |
|----------|-------|
| Type | [code/document/plan/protocol/specification] |
| Size | [small <5K / medium 5-20K / large >20K] tokens |
| Primary Domain | [Security/Distributed/Formal/PL Theory/General] |
| Complexity | [LOW/MEDIUM/HIGH] - based on concept density |
| Criticality | [LOW/MEDIUM/HIGH] - based on impact if wrong |

### Domain Knowledge Lookup
→ Consult `domain-knowledge-base.md` §0 for domain mapping
→ Note applicable: §1 (theorems), §3 (checklist), §4 (contradictions)

| Domain | Sections to Use | Key Theorems to Watch |
|--------|-----------------|----------------------|
| [detected] | [from §0 mapping] | [list 2-3 key impossibilities] |
```

### Step 0.3: Tier Selection (Simplified)

```
## Phase 0.3: Tier Selection

| Complexity | Criticality | Tier |
|------------|-------------|------|
| LOW | LOW/MEDIUM | 1 - QUICK |
| MEDIUM | any | 2 - STANDARD |
| HIGH | any | 3 - DEEP |
| any | HIGH | 3 - DEEP |

**SELECTED TIER: [1/2/3]**

Tier 1 (QUICK): Layer 1 only, stop at first CRITICAL
Tier 2 (STANDARD): Layer 1 + Layer 2 core methods
Tier 3 (DEEP): Full Layer 1 + Layer 2 with all selected methods
```

---

## LAYER 1: INNATE DETECTION (Phase 1-2)

**Purpose:** Fast, pattern-based detection + Error Theory classification.
**Always executes:** YES

### Phase 1: Core Checks & Taxonomy Scan

#### 1.1 Consistency Check

```
## 1.1 Consistency Check

### Contradiction Scan
| Statement A | Statement B | Contradiction? |
|-------------|-------------|----------------|
| "[claim 1]" | "[claim 2]" | YES/NO/POSSIBLE |

Consistency verdict: [PASS / FAIL]
```

#### 1.2 Completeness Check

```
## 1.2 Completeness Check

For artifact type [TYPE], required elements:

| Element | Status | Notes |
|---------|--------|-------|
| [element] | PRESENT/PARTIAL/MISSING | [if issue] |

TODO/Placeholder count: [N] blockers, [N] minor

Completeness verdict: [PASS / FAIL]
```

#### 1.3 Error Theory Taxonomy Scan

```
## 1.3 Error Theory Taxonomy Scan

| Category | Indicators Present? | Confidence |
|----------|---------------------|------------|
| LOGIC | [indicators or "none"] | [0-100%] |
| SEMANTIC | [indicators or "none"] | [0-100%] |
| OMISSION | [indicators or "none"] | [0-100%] |
| SECURITY | [indicators or "none"] | [0-100%] |
| RESOURCE | [indicators or "none"] | [0-100%] |
| CONCURRENCY | [indicators or "none"] | [0-100%] |

**Primary Error Vectors:** [Top 2 by confidence]

### Domain Knowledge Cross-Check
→ Consult `domain-knowledge-base.md` §4 (Contradiction Patterns)
→ Check §2 (Terms) for any suspicious terminology

| Claim in Artifact | Contradicts (from §4)? | Severity |
|-------------------|------------------------|----------|
| [claim found] | [matching contradiction or "none"] | [if match: CRITICAL] |
```

### Phase 2: Layer 1 Summary & Decision

```
## Phase 2: Layer 1 Summary

### Findings
| ID | Check | Severity | Description | Category |
|----|-------|----------|-------------|----------|
| L1-1 | [check] | 🔴/🟠/🟡 | [finding] | [category] |

### Decision
- CRITICAL finding present? [YES/NO]
- Tier = 1 AND no significant findings? [YES/NO]

**DECISION:**
- If CRITICAL and Tier 1 → OUTPUT (don't continue)
- If Tier 1 AND clean → OUTPUT
- Otherwise → CONTINUE to Layer 2
```

**STOP POINT:** For Tier 1, if no CRITICAL/IMPORTANT findings, output results here.

---

## LAYER 2: ADAPTIVE DETECTION (Phase 3-5)

**Purpose:** Deep analysis seeded by Error Theory findings.
**Executes:** Tier 2+ only

### Phase 3: Method Selection (Seeded)

```
## 3.1 Method Selection

### Selection based on:
- Error Vectors: [vector 1], [vector 2]
- Domain theorems (from §1): [theorem 1], [theorem 2]
- Domain checklist (from §3): [checklist items flagged]

| Method | Category | Why Selected |
|--------|----------|--------------|
| #[N] [name] | [core/risk/domain] | [specific reason for THIS artifact] |

### Theorem-Driven Methods
If artifact claims touch impossibility territory (§1), MUST include:
- #108 Theoretical Impossibility Detection
- #109 Proof by Contraposition

| Claim | Relevant Theorem (§1) | Method to Apply |
|-------|----------------------|-----------------|
| [claim] | [theorem] | #108 or domain-specific |

### Reasoning Gate
Each method must answer: "Why for THIS artifact, not generically?"
Methods with only generic justification: REJECT

**Final Selection:** [list of 3-6 methods]
```

### Phase 4: Method Application

```
## 4.1 Method Application

### Method: #[N] [Name]
**Applied to:** [specific artifact section/concern]

**Result:**
- Finding: [YES/NO]
- If YES: [description]
- Confidence: [%]
- Evidence: "[quote]" at [location]
- Root cause: [if applicable]

[Repeat for each method - STOP if confident, don't force all methods]
```

### Phase 5: Challenge Protocol

```
## 5.1 Challenge Protocol

For each finding with confidence >= 70%:

### Finding [ID]
**Critical Challenge:** Strongest argument AGAINST:
[argument]

**Contraposition:** What would guarantee this finding is wrong?
[condition] → Met? [YES/NO]

**Final Verdict:** [CONFIRMED / DOWNGRADED / DROPPED]
**Final Confidence:** [%]
```

---

## OUTPUT: Verification Report

```
## Deep Verify V7.2 - Verification Report

### Artifact
| Property | Value |
|----------|-------|
| Type | [type] |
| Domain | [domain] |
| Complexity | [level] |
| Tier Executed | [1-3] |

### Summary
| Metric | Value |
|--------|-------|
| Methods applied | [N] |
| Findings total | [N] |

### Findings

#### CRITICAL (Must Fix)
| ID | Type | Description | Confidence |
|----|------|-------------|------------|
| [F1] | [category] | [desc] | [%] |

#### IMPORTANT (Should Fix)
| ID | Type | Description | Confidence |
|----|------|-------------|------------|
| [F2] | [category] | [desc] | [%] |

#### MINOR (Consider)
| ID | Type | Description | Confidence |
|----|------|-------------|------------|
| [F3] | [category] | [desc] | [%] |

### Recommendations
| Priority | Action | Addresses |
|----------|--------|-----------|
| 1 | [action] | [finding IDs] |

### Verification Limits
| Limit | Impact |
|-------|--------|
| [limit type] | [how it affects this verification] |
```

---

## Appendix A: Tier Reference

| Tier | Name | Scope | When Used |
|------|------|-------|-----------|
| 1 | QUICK | Layer 1 only | Low complexity + Low/Medium criticality |
| 2 | STANDARD | Layer 1 + core Layer 2 | Medium complexity OR any criticality |
| 3 | DEEP | Full Layer 1 + Layer 2 | High complexity OR High criticality |

---

## Appendix B: Error Theory Categories

| Category | What to Look For |
|----------|------------------|
| LOGIC | Contradictions, fallacies, incorrect deductions, circular reasoning |
| SEMANTIC | Ambiguity, definitional drift, category errors, vague terms |
| OMISSION | Missing requirements, unhandled scenarios, absent safeguards |
| SECURITY | Vulnerabilities, trust assumptions, authentication gaps |
| RESOURCE | Leaks, unbounded consumption, missing limits |
| CONCURRENCY | Race conditions, deadlocks, state inconsistency |

---

## Appendix C: High-ROI Methods (from V7.1 testing)

| Method | Best For | ROI |
|--------|----------|-----|
| #84 Consistency Check | Any artifact | HIGH - fast, often finds issues |
| #109 Contraposition | Claims/guarantees | HIGH - reveals hidden assumptions |
| #108 Theoretical Impossibility | Formal claims | HIGH - catches overclaims |
| #83 Completeness Check | Specifications | HIGH - systematic gap finder |
| #63 Critical Challenge | All findings | MEDIUM - validation step |

---

## Appendix D: Domain Knowledge Usage

**Source:** `src/core/knowledge/domain-knowledge-base.md`

### When to Lookup

| Phase | What to Lookup | Section |
|-------|----------------|---------|
| **0.2 Domain Detection** | Domain → sections mapping | §0 |
| **0.2 Domain Detection** | Key impossibility theorems for domain | §1 |
| **1.1 Consistency** | Contradiction patterns | §4 |
| **1.3 Taxonomy Scan** | Term correctness | §2 |
| **3.1 Method Selection** | Domain checklist items | §3 |
| **4.1 Method Application** | Proof requirements | §5 |

### Quick Domain → Theorem Reference

| Domain | Key Theorems to Check |
|--------|----------------------|
| **PL Theory** | Rice's (termination), Type inference undecidability, Gradual ≠ Sound |
| **Distributed** | FLP (async consensus), CAP, BFT bounds (f < N/3) |
| **Crypto** | PFS definition, ZK information leak, Quantum resistance |
| **Mechanism Design** | Myerson-Satterthwaite, VCG subsidy, History-SP incompatibility |
| **Web/API** | Stateless + session, JWT revocation, CORS ≠ security |
| **Database** | CAP, ACID + scale, Index trade-offs |
| **ML** | No Free Lunch, Bias-Variance, Interpretability trade-off |
| **Performance** | Amdahl's Law, Latency vs Throughput, NP-hardness |

---

## Appendix E: What Was Removed (and Why)

| Component | V7.1 Location | Why Removed |
|-----------|---------------|-------------|
| Layer 3 (Memory) | Phase 6 | No persistence = no learning. Weight updates are theatre. |
| Layer 4 (Escalation) | Phase 7 | Over-engineered. Critical findings go to output directly. |
| Budget Allocation | Phase 0.3 | Fictional - analysis takes what it takes. |
| 5-Tier System | Phase 0.3 | Simplified to 3 tiers - complexity was not useful. |
| Anomaly Detection | Phase 4.2 | Low ROI - 67% hit rate not worth the cost. |
| Method Weight Updates | Phase 6.3 | Without persistence, this is meaningless. |
| Knowledge Injection Phase | Phase 6.2 | Moved to inline lookups in Phase 0.2, 1.3, 3.1. |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 7.2 | 2026-01-19 | STREAMLINED: Removed Layer 3 (Memory) and Layer 4 (Escalation). Simplified to 3 tiers. Removed budget allocations. Added "stop when confident" principle. Integrated Domain Knowledge as inline lookups (Phase 0.2, 1.3, 3.1) instead of separate phase. Added Appendix D for domain knowledge usage guide. |
| 7.1 | 2026-01-15 | Integrated Error Theory, Seeded Method Selection. |
| 7.0 | 2026-01-13 | Adaptive Verification System architecture. |
