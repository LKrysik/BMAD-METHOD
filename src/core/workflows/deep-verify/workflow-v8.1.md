# Deep Verify V8.1 - Corrected Adaptive Verification

```
┌─────────────────────────────────────────────────────────────┐
│                    ⚠️  STATUS: UNVERIFIED                    │
│                                                             │
│  Ten workflow NIE ZOSTAŁ PRZETESTOWANY empirycznie.         │
│  Zawiera HIPOTEZY oparte na analizie V7.0 vs V8.0.          │
│  WYMAGA walidacji na T15-T21 przed użyciem produkcyjnym.    │
│                                                             │
│  Użyj V7.0 do czasu zweryfikowania V8.1.                   │
└─────────────────────────────────────────────────────────────┘
```

## Design Rationale

**V8.1 koryguje błędy V8.0 przywracając skuteczne elementy V7.0:**

| Problem V8.0 | Evidence | Korekta V8.1 |
|--------------|----------|--------------|
| ASSUME detection = 0% | T15: 17.9% vs V7.0 71% | Przywrócony Self-Check |
| INTEGRATE detection = 0% | Category analysis | Dodane #99 Multi-Artifact |
| Higher token overhead | Cache creation +14% | Modular loading |
| Brak checkpoints | Linear flow | HALT points restored |

**V8.1 = V8.0 simplicity + V7.0 effectiveness**

---

## What You Need

| Resource | Path | Required? |
|----------|------|-----------|
| This workflow | You're reading it | YES |
| Methods library | `src/core/methods/methods.csv` | YES |
| Domain knowledge | `src/core/knowledge/domain-knowledge-base.md` | IF theory domain |
| Method Cards | `src/core/methods/method_cards/MC-*.md` | IF available |

---

## Process Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DEEP VERIFY V8.1                          │
│              Corrected Adaptive Verification                 │
└─────────────────────────────────────────────────────────────┘

PHASE 0: INTAKE
  ├─ 0.1 Self-Check (RESTORED from V7.0)
  ├─ 0.2 Profile artifact
  └─ 0.3 Triage & Budget
      ↓
      HALT: Confirm triage
      ↓
PHASE 1: INNATE
  ├─ 1.1 Coherence (#84)
  ├─ 1.2 Completeness (#83)
  ├─ 1.3 Scope (#81)
  └─ 1.4 Integration Check (#99) (NEW)
      ↓
      DECISION GATE
      ├─ CRITICAL found → OUTPUT
      ├─ Tier 1 + clean → OUTPUT
      └─ Otherwise → PHASE 2
      ↓
PHASE 2: ADAPTIVE
  ├─ 2.1 Method Selection
  ├─ 2.2 Method Execution
  └─ 2.3 Anomaly Detection
      ↓
PHASE 3: CHALLENGE
  ├─ 3.1 Devil's Advocate
  └─ 3.2 Consolidate
      ↓
PHASE 4: OUTPUT
```

---

## PHASE 0: INTAKE

### 0.1 Self-Check (RESTORED)

**Purpose:** Wykrywa hidden assumptions i self-deception.
**Impact:** +100pp ASSUME detection (V7.0 data)

```markdown
## 0.1 Self-Check

### #113 Counterfactual Self-Incrimination
List 5 ways I could deceive myself in this verification:
1. [specific way]
2. [specific way]
3. [specific way]
4. [specific way]
5. [specific way]

For each: Evidence it's NOT happening: [evidence]

### #131 Observer Paradox
Is this analysis GENUINE or PERFORMANCE?
- Smooth and complete → suspicious
- Has rough edges and uncertainty → likely genuine
Assessment: [genuine/performance markers]

### #112 Entropy Leak Detection
What could I SILENTLY OMIT?
| Potential omission | Would benefit | Will I check? |
|--------------------|---------------|---------------|
| [omission 1] | AGENT/OUTCOME | YES/NO |

CUI BONO summary: Watch for [specific bias]
```

### 0.2 Artifact Profile

```markdown
## 0.2 Artifact Profile

### Basic Info
| Property | Value |
|----------|-------|
| Type | [code/document/plan/protocol/spec] |
| Size | [estimate tokens] |
| Sections | [count] |

### Domain Detection
| Domain | Markers Found | Confidence |
|--------|---------------|------------|
| Crypto/Security | auth, encrypt, key, hash | [0-100%] |
| Distributed | consensus, partition, CAP | [0-100%] |
| Formal Methods | proof, theorem, invariant | [0-100%] |
| General Software | [default] | [100-max(others)] |

Primary domain: [highest]

### Complexity (1-5 each)
| Factor | Score | Evidence |
|--------|-------|----------|
| Concept density | | |
| Cross-references | | |
| Dependencies | | |
| Ambiguity | | |

Total: [sum]/20 → LOW (<8) / MEDIUM (8-14) / HIGH (>14)

### Criticality (1-5 each)
| Factor | Score | Evidence |
|--------|-------|----------|
| Security impact | | |
| Data handling | | |
| User impact | | |
| Integration scope | | |

Total: [sum]/20 → LOW (<8) / MEDIUM (8-14) / HIGH (>14) / CRITICAL (>18)
```

### 0.3 Triage & Budget

```markdown
## 0.3 Triage Decision

| Complexity | Criticality | Tier | Budget | Methods |
|------------|-------------|------|--------|---------|
| LOW | LOW | 1 | 10K | 0 adaptive |
| LOW | MEDIUM | 2 | 20K | 3 |
| MEDIUM | LOW | 2 | 20K | 3 |
| MEDIUM | MEDIUM | 3 | 40K | 5 |
| HIGH | any | 4 | 60K | 8 |
| any | CRITICAL | 5 | 100K | 10+ |

Selected: TIER [N]
Budget: [N]K tokens
Method slots: [N]
```

**HALT** - Confirm triage before proceeding

```
[C] Correct - proceed
[E] Edit tier/budget
[X] Exit
```

---

## PHASE 1: INNATE DETECTION

These checks ALWAYS run.

### 1.1 Coherence Check (#84)

```markdown
## 1.1 Coherence

### Terms Used
| Term | First use | Later use | Consistent? |
|------|-----------|-----------|-------------|
| | | | |

### Contradictions
| Statement A | Statement B | Conflict? |
|-------------|-------------|-----------|
| | | |

Verdict: [PASS / ISSUE: description]
```

### 1.2 Completeness Check (#83)

```markdown
## 1.2 Completeness

### Required Elements
| Element | Present? | Quality |
|---------|----------|---------|
| | | |

### Open Items
| Marker | Location | Severity |
|--------|----------|----------|
| TODO/TBD | | BLOCKER/MINOR |

Verdict: [PASS / ISSUE: description]
```

### 1.3 Scope Check (#81)

```markdown
## 1.3 Scope Alignment

Original request: "[verbatim]"

| Request element | Addressed? | Evidence |
|-----------------|------------|----------|
| | FULL/PARTIAL/OMITTED | |

### Omission Analysis (from Self-Check)
| Omitted | Silent/Explicit | CUI BONO |
|---------|-----------------|----------|
| | | |

Verdict: [ALIGNED / DRIFTED: description]
```

### 1.4 Integration Check (#99) - NEW

**Purpose:** Check artifact references to existing system.
**Impact:** Addresses 0% INTEGRATE detection in V8.0

```markdown
## 1.4 Integration Check

### External References
| Reference | Points To | Exists? | Compatible? |
|-----------|-----------|---------|-------------|
| [ref] | [target] | YES/NO/UNKNOWN | YES/NO/CHECK |

### Assumptions About Existing Code
| Assumption | Stated/Hidden | Verified? |
|------------|---------------|-----------|
| | | |

### Interface Compatibility
| Interface | Artifact expects | System provides | Match? |
|-----------|------------------|-----------------|--------|
| | | | |

Verdict: [INTEGRATED / ISSUES: description]
```

### 1.5 Phase 1 Decision Gate

```markdown
## Phase 1 Summary

| Check | Verdict | Issues |
|-------|---------|--------|
| Coherence | [P/F] | |
| Completeness | [P/F] | |
| Scope | [P/F] | |
| Integration | [P/F] | |

Tokens used: [N]
Budget remaining: [N]

### Decision
- [ ] CRITICAL issue found → Jump to OUTPUT
- [ ] Tier 1 + all PASS → Jump to OUTPUT (clean)
- [ ] Otherwise → Continue to PHASE 2
```

---

## PHASE 2: ADAPTIVE DETECTION

Execute ONLY if Tier ≥ 2 or Phase 1 issues found.

### 2.1 Method Selection

```markdown
## 2.1 Method Selection

### RELEVANCE Scoring
RELEVANCE(method, artifact) =
  domain_match × 0.30 +
  finding_match × 0.30 +
  complexity_fit × 0.20 +
  category_spread × 0.20

### Candidate Ranking
| Method | Domain | Finding | Fit | Spread | TOTAL | Select? |
|--------|--------|---------|-----|--------|-------|---------|
| #[N] | | | | | | |

### Selection Rationale
| Method | Why for THIS artifact |
|--------|----------------------|
| #[N] | "[quote from artifact]" suggests [issue] |

### Category Coverage Check
| Category | Selected Method | Coverage |
|----------|-----------------|----------|
| THEORY | #[N] or NONE | |
| ASSUME | #72 or #85 | REQUIRED |
| COMPOSE | | |
| INTEGRATE | #99 | REQUIRED |

Selected: [N] methods
```

### 2.2 Method Execution

For each selected method:

```markdown
## Method: #[N] [Name]

### Execution
**Using:** [Card / CSV description]

**Step 1:** [action]
Result: [finding or none]

**Step 2:** [action]
Result: [finding or none]

### Finding
| Property | Value |
|----------|-------|
| Issue found? | YES/NO |
| Description | [what's wrong] |
| Evidence | "[quote]" at [location] |
| Severity | CRITICAL/IMPORTANT/MINOR |
| Confidence | [0-100%] |

Tokens: ~[N]
```

### 2.3 Anomaly Detection

```markdown
## 2.3 Anomalies

### Scan for unusual patterns
| Element | Why unusual | Investigation | Verdict |
|---------|-------------|---------------|---------|
| | | | FALSE_POS/ISSUE/UNKNOWN |

For UNKNOWN: Include in output, suggest user check.
```

---

## PHASE 3: CHALLENGE

### 3.1 Challenge Each Finding

```markdown
## Challenge: Finding [ID]

**Finding:** [description]
**Initial confidence:** [N]%

### #63 Devil's Advocate
Strongest argument this is WRONG:
[argument]

### #133 Abilene Check
Does problem actually exist?
[assessment]

### #109 Contraposition
What would prove it correct?
[condition] → Met? YES/NO

### Verdict
| Original | After challenge |
|----------|-----------------|
| [severity] | [adjusted or DROPPED] |
| [confidence]% | [adjusted]% |
```

### 3.2 Consolidated Findings

```markdown
## Findings After Challenge

| ID | Source | Severity | Description | Confidence |
|----|--------|----------|-------------|------------|
| F1 | | | | |

Summary:
- Dropped: [N]
- Downgraded: [N]
- Confirmed: [N]
```

---

## PHASE 4: OUTPUT

```markdown
# Deep Verify V8.1 - Report

## Artifact
| Property | Value |
|----------|-------|
| Type | |
| Domain | |
| Complexity | |
| Criticality | |
| Tier | |

## Execution
| Metric | Value |
|--------|-------|
| Budget | [allocated]K |
| Used | [actual]K |
| Methods | [N] |
| Phases | [executed] |

## Self-Check Summary
Biases watched for: [from 0.1]
Manifested? [assessment]

## Findings

### CRITICAL (must fix)
| ID | Issue | Evidence | Confidence |
|----|-------|----------|------------|
| | | | |

### IMPORTANT (should fix)
| ID | Issue | Evidence | Confidence |
|----|-------|----------|------------|
| | | | |

### MINOR (consider fixing)
| ID | Issue | Evidence | Confidence |
|----|-------|----------|------------|
| | | | |

### DEFERRED (need input)
| ID | Question | Why needed |
|----|----------|------------|
| | | |

## Uncertainty
| Area | Confidence | What couldn't be verified |
|------|------------|---------------------------|
| | | |

## Recommendations
| Priority | Action | Addresses |
|----------|--------|-----------|
| 1 | | |
```

---

## Changes from V8.0

| Element | V8.0 | V8.1 | Rationale |
|---------|------|------|-----------|
| Self-Check | REMOVED | **RESTORED** | +100pp ASSUME detection |
| Integration Check | ABSENT | **ADDED** | +100pp INTEGRATE detection |
| HALT points | ABSENT | **RESTORED** | Safety checkpoints |
| Category coverage | Optional | **REQUIRED** | Prevents 0% categories |
| CUI BONO in Scope | Absent | **ADDED** | Links to Self-Check |

## Metrics Status

**ZASADA: Nie akceptujemy "expected" ani "estimated" - tylko zmierzone empirycznie.**

| Metric | V8.0 (measured) | V8.1 | Status |
|--------|-----------------|------|--------|
| Overall DR | 65.3% | ? | WYMAGA TESTU |
| ASSUME | 0% | ? | WYMAGA TESTU |
| INTEGRATE | 0% | ? | WYMAGA TESTU |
| Cost | ~275K/7 | ? | WYMAGA TESTU |

**V8.1 musi przejść walidację na T15-T21 przed akceptacją.**

---

## Version History

| Version | Changes |
|---------|---------|
| 8.1 | Corrected V8.0: restored Self-Check, added Integration Check, HALT points |
| 8.0 | Simplified V7.0 (REGRESSION: lost ASSUME/INTEGRATE detection) |
| 7.0 | Adaptive Verification System |

---

## Self-Verification Checklist

- [ ] Self-Check completed with specific biases identified
- [ ] Profile matches artifact characteristics
- [ ] Tier appropriate for complexity/criticality
- [ ] Integration check completed
- [ ] Methods include ASSUME and INTEGRATE coverage
- [ ] Each finding has evidence quote and location
- [ ] Findings challenged before reporting
- [ ] HALT points respected
