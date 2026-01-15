# Agent Quick Reference - Deep Verify V7.1

**Purpose**: Single-page reference for agents executing V7.1 verification.

---

## Required Files (MUST LOAD)

| File | Path | Purpose |
|------|------|---------|
| **Workflow** | `src/core/workflows/deep-verify/workflow-v7.1.md` | Main process |
| **Methods** | `src/core/methods/methods.csv` | Method definitions |
| **Triggers** | `src/core/methods/method_triggers.yaml` | Feature → method mapping |
| **Weights** | `src/core/methods/method_weights.yaml` | Historical effectiveness |
| **KB** | `src/core/knowledge/domain-knowledge-base.md` | Domain knowledge |

### Method Cards (Load on demand)

`src/core/methods/method_cards/MC-{NUMBER}-{name}.md`

Available: 071, 072, 081, 083, 084, 088, 108, 122, 128, 153

---

## Execution Flow

```
┌─────────────────────────────────────────┐
│ PHASE 0: LIBRARY LOADING (BLOCKING)     │
│ Load: methods.csv, triggers, weights    │
│ ⛔ HALT if any file missing             │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ PHASE 0.5: ARTIFACT PROFILING           │
│ Extract: type, domains, complexity      │
│ Detect: features from triggers.yaml     │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ PHASE 0.7: TRIAGE & BUDGET              │
│ Assign tier (1-5) based on matrix       │
│ Allocate token budget                   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ LAYER 1: INNATE DETECTION               │
│ Run: consistency, completeness, scope   │
│ FAST PATH: simple+clean → DONE          │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ PHASE 3: METHOD SELECTION               │
│ 1. Match features → triggers            │
│ 2. Calculate RELEVANCE scores           │
│ 3. Load Method Cards for selected       │
│ 4. Apply Reasoning Gate                 │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ LAYER 2: ADAPTIVE DETECTION             │
│ Execute Method Cards step-by-step       │
│ Track token usage against budget        │
│ ⛔ STOP if budget exceeded              │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ LAYER 3: MEMORY UPDATE                  │
│ Calculate method effectiveness          │
│ Update weights in method_weights.yaml   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ OUTPUT: VERIFICATION REPORT             │
│ Findings, recommendations, metrics      │
└─────────────────────────────────────────┘
```

---

## Triage Matrix

| Complexity | Criticality | Tier | Budget | Layers |
|------------|-------------|------|--------|--------|
| LOW | LOW | 1 | 10K | 1 only |
| LOW | MEDIUM | 2 | 20K | 1 + partial 2 |
| MEDIUM | LOW | 2 | 20K | 1 + partial 2 |
| MEDIUM | MEDIUM | 3 | 40K | 1 + 2 |
| HIGH | MEDIUM | 3 | 40K | 1 + 2 |
| MEDIUM | HIGH | 4 | 60K | 1 + 2 + 4 |
| HIGH | HIGH | 4 | 60K | 1 + 2 + 4 |
| ANY | CRITICAL | 5 | 100K+ | All |

---

## Feature Detection Quick Reference

| Feature | Look For | Triggers Methods |
|---------|----------|------------------|
| domain_crypto | encrypt, key, PFS, signature | 153, 155, 156 |
| domain_distributed | consensus, CAP, partition | 153, 155, 156 |
| claim_guarantee | always, never, guarantees | 71, 80, 88, 130 |
| claim_both_and | both X and Y, simultaneously | 108, 154, 158, 160 |
| multiple_requirements | >3 requirements | 81, 82, 158, 159 |
| external_deps | import, depends on, uses | 127, 159 |
| circular_ref | A requires B requires A | 127, 159 |

---

## Method Selection Formula

```
RELEVANCE(Method, Artifact) =
  domain_match     × 0.25 +
  complexity_match × 0.20 +
  pattern_match    × 0.25 +
  category_coverage × 0.15 +
  historical_weight × 0.15
```

### Scoring Guide

| Factor | Score 1.0 | Score 0.5 | Score 0.0 |
|--------|-----------|-----------|-----------|
| domain_match | Method domain = artifact domain | Related domain | No match |
| complexity_match | Method fits complexity | Partial fit | Wrong complexity |
| pattern_match | L1 finding triggers method | Related trigger | No trigger |
| category_coverage | Category not yet covered | 1 method from cat | 2+ from category |
| historical_weight | From method_weights.yaml | - | - |

---

## Top 10 Critical Methods

| # | Name | Use When | Card |
|---|------|----------|------|
| 71 | First Principles | Strong claims | MC-071 |
| 72 | 5 Whys | Root cause needed | MC-072 |
| 81 | Scope Integrity | Requirements check | MC-081 |
| 83 | Closure Check | TODO/completeness | MC-083 |
| 84 | Coherence Check | Definition consistency | MC-084 |
| 88 | Executability | Instructions viable | MC-088 |
| 108 | Coincidentia | X AND Y conflicts | MC-108 |
| 122 | Sorites | Find critical elements | MC-122 |
| 128 | Theseus | Core alignment | MC-128 |
| 153 | Impossibility | Theorem violations | MC-153 |

---

## Knowledge Management Quick Guide

```
Unknown term/concept?
├── Check domain-knowledge-base.md
│   ├── FOUND → Apply and continue
│   └── NOT FOUND
│       ├── Critical? → DEFER to user
│       └── Not critical? → INFER with caveat
```

**KB Sections**:
- Section 1: Impossibility Theorems
- Section 2: Technical Terms
- Section 3: Domain Expertise
- Section 4: Contradiction Patterns

---

## Output Templates

### Finding Format
```markdown
### [N] 🔴|🟠|🟡 [DEPTH] Title

**Method**: #{N} {name}
**Confidence**: {0-100%}
**Evidence**: "{quote}" - {location}
**Root Cause**: {if applicable}
**Fix**: {recommendation}
```

### Severity Guide
| Symbol | Level | Meaning |
|--------|-------|---------|
| 🔴 | CRITICAL | Blocks usage, must fix |
| 🟠 | IMPORTANT | Significant, should fix |
| 🟡 | MINOR | Small issue, can defer |

---

## Blocking Gates

| Gate | When | Check | On Fail |
|------|------|-------|---------|
| LIBRARY | Phase 0 | All files loaded | HALT |
| TRIAGE | Phase 0.7 | Tier assigned | HALT |
| BUDGET | Layer 2 | Tokens < budget | STOP analysis |
| REASONING | Phase 3 | Each method justified | REJECT method |

---

## Token Tracking

```markdown
## Token Counter

Budget: {TIER}K tokens

| Phase | Used | Total | % |
|-------|------|-------|---|
| 0-1   | {N}  | {N}   | {X}% |
| 2     | {N}  | {N}   | {X}% |
| 3     | {N}  | {N}   | {X}% |

Status: ON TRACK / APPROACHING LIMIT / EXCEEDED
```

---

## Weight Update (Layer 3)

```
score = (confirmed/claimed)*0.4 + (1-FP_rate)*0.3 + efficiency*0.2 + feedback*0.1

new_weight = old_weight * 0.9 + score * 0.1
```

Save to: `src/core/methods/method_weights.yaml`

---

## Emergency Procedures

| Situation | Action |
|-----------|--------|
| File not found | HALT, report which file |
| Budget exceeded | STOP, output current findings |
| Method Card missing | Use method description, flag |
| Unknown domain | Consult KB, DEFER if missing |
| Critical finding | Fast path to escalation |
