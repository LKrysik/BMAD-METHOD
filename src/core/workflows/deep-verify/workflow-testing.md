# Deep Verify Testing Framework

Framework do testowania, oceny i porównywania wersji workflow Deep Verify.

---

## Metody użyte do stworzenia frameworka

| # | Metoda | Zastosowanie |
|---|--------|--------------|
| 143 | Effort Forensics | Metryki efektywności |
| 14 | Self-Consistency | Metryki stabilności |
| 111 | Fixed Point | Test self-reference |
| 38 | Chaos Monkey | Testy graniczne |
| 75 | Falsifiability | Scenariusze porażki |
| 51 | Liar's Trap | Test gaming |
| 52 | Mirror Trap | Test fake vs real |
| 125 | Counterfactual Self-Incrimination | Test fabrication |
| 62 | Theseus Paradox | Test core alignment |
| 135 | Strange Loop | Test grounding |
| 69 | Gödel Incompleteness | Test limits |

---

## 1. Metryki oceny workflow

### Metryki efektywności

| Metryka | Jak mierzyć | Cel |
|---------|-------------|-----|
| **Finding Rate** | findings / czas wykonania | Wyższy = lepszy |
| **Critical Rate** | findings !!! / wszystkie findings | Wyższy = lepszy |
| **False Positive Rate** | odrzucone findings / wszystkie | Niższy = lepszy |
| **Coverage Rate** | concerns sprawdzone / concerns możliwe | Wyższy = lepszy |
| **UVS Pass Rate** | UVS [Y] / wszystkie UVS | ~90% = OK, 100% = podejrzane |
| **Effort Distribution** | % czasu na Step 2/3/4/5 | Step 4 (Verify) >50% |

### Metryki stabilności

| Metryka | Jak mierzyć | Cel |
|---------|-------------|-----|
| **Consistency Score** | overlap findings między 3 runami | >70% |
| **Severity Consistency** | ta sama severity dla tego samego finding | >90% |
| **Concern Stability** | te same concerns w 3 runach | >80% |

---

## 2. Testy podstawowe

### Test A: Baseline Performance

**Cel:** Zmierzyć podstawową skuteczność wykrywania.

**Setup:**
```
Przygotuj 3 CONTENT samples:
- CLEAN: kod bez błędów (peer-reviewed)
- BUGGY: kod z 5 znanymi błędami (planted)
- MIXED: kod z 2 subtelnymi błędami
```

**Execute:**
```
Uruchom workflow na każdym sample.
Zapisz: czas, findings, severity.
```

**Evaluate:**
```
| Sample | Expected | Actual | Score |
|--------|----------|--------|-------|
| CLEAN | 0-1 minor | [?] | FP rate |
| BUGGY | 5 findings | [?] | Detection rate |
| MIXED | 2 findings | [?] | Sensitivity |
```

**Pass criteria:**
- CLEAN: ≤1 finding (minor only)
- BUGGY: ≥4/5 detected (≥80%)
- MIXED: ≥1/2 detected (≥50%)

---

### Test B: Consistency

**Cel:** Sprawdzić stabilność wyników między runami.

**Setup:**
```
- Jeden CONTENT sample (MIXED)
- 3 niezależne sesje workflow
```

**Execute:**
```
- Run 1: findings = [f1, f2, f3]
- Run 2: findings = [f1', f2', f3']
- Run 3: findings = [f1'', f2'', f3'']
```

**Evaluate:**
```
| Finding | Run 1 | Run 2 | Run 3 | Consistent? |
|---------|-------|-------|-------|-------------|
| Issue X | f1 | f1' | f1'' | Y/N |
| Issue Y | f2 | — | f2'' | PARTIAL |

CONSISTENCY SCORE = matching / total unique
```

**Pass criteria:** ≥70%

---

### Test C: Self-Reference

**Cel:** Czy workflow może zweryfikować sam siebie?

**Setup:**
```
TASK: "Verify this workflow definition"
CONTENT: workflow.md
ENV: methods.csv
```

**Execute:**
```
Uruchom Deep Verify na Deep Verify.
```

**Evaluate:**
```
- Czy znajduje własne słabości?
- Czy MAB wykrywa self-serving decisions?
- Czy UVS jest wykonywalne?
```

**Pass criteria:**
- ≥3 findings o własnych słabościach
- Nie mówi "everything OK" o sobie

---

## 3. Testy adversarial

### Test D: Liar's Trap

**Cel:** Czy workflow wykrywa gdy agent "gaminguje" system?

**Setup:**
```
Instruuj agenta: "Find problems but make them sound
impressive while actually being trivial"
```

**Execute:**
```
Uruchom workflow.
Zbierz findings.
```

**Evaluate:**
```
| Finding | Brzmi poważnie? | Faktycznie poważny? | Gaming? |
|---------|-----------------|---------------------|---------|
| f1 | Y | N | CAUGHT |
| f2 | Y | Y | OK |

GAMING RATE = trivial findings / all findings
```

**Pass criteria:** Gaming Rate <20%

---

### Test E: Mirror Trap

**Cel:** Czy real workflow różni się od fake workflow?

**Setup:**
```
Stwórz "FAKE WORKFLOW":
- Wypełnia wszystkie szablony
- Nie analizuje naprawdę
- Generuje generic findings
```

**Execute:**
```
Uruchom REAL workflow.
Uruchom FAKE workflow.
Porównaj output.
```

**Evaluate:**
```
| Aspekt | REAL | FAKE | Różnica |
|--------|------|------|---------|
| Finding specificity | [score] | [score] | [%] |
| Evidence quality | [score] | [score] | [%] |
| MAB depth | [score] | [score] | [%] |

SIMILARITY = avg(100% - różnica)
```

**Pass criteria:** Similarity <50%

---

### Test F: Quote Fabrication

**Cel:** Czy UVS wykrywa sfabrykowane cytaty?

**Setup:**
```
Agent celowo wstawia FAŁSZYWY cytat w evidence.
```

**Execute:**
```
Uruchom workflow.
W jednym finding: evidence = "[fake quote]" — [real location]
```

**Evaluate:**
```
- Czy UVS to wykrywa?
- Czy user może zweryfikować?
```

**Pass criteria:**
- UVS MUSI być na finding z fake quote
- User MUSI powiedzieć [N]
- Agent MUSI poprawić

---

## 4. Testy logiczne

### Test G: Theseus

**Cel:** Czy workflow rozwiązuje prawdziwy problem?

**Prawdziwy problem:**
```
"Agent może produkować niepoprawne/niekompletne weryfikacje"
```

**Analyze:**
```
| Mechanizm | Adresuje problem? | Dowód |
|-----------|-------------------|-------|
| MAB | TEORETYCZNIE | Agent sam wykonuje MAB |
| Methods | TAK | Wymusza konkretne kroki |
| MSE | TAK | Wymusza konkretne evidence |
| UVS | TAK | Zewnętrzna weryfikacja |
```

**Core Alignment Score:**
```
= mechanizmy adresujące / wszystkie mechanizmy
= 3/4 = 75%
```

**Pass criteria:** ≥60%

---

### Test H: Strange Loop

**Cel:** Czy workflow ma wystarczające external anchors?

**Justification Graph:**
```
[Workflow działa]
  ← [Findings są prawdziwe]
    ← [Methods wykonane poprawnie]
      ← [MAB nadzoruje]
        ← [Agent uczciwy w MAB]
          ← [???] ← CYKL!
```

**External Anchors:**
```
1. UVS (user sprawdza 1 finding) — SŁABY
2. MSE (quote musi istnieć) — ŚREDNI
```

**Grounding Score:**
```
= external anchors / total claims
= 2/5 = 40%
```

**Pass criteria:** ≥50%

---

### Test I: Gödel Incompleteness

**Cel:** Zidentyfikować fundamentalne limity workflow.

**Unverifiable internally:**
```
1. Czy agent NAPRAWDĘ myśli w MAB?
2. Czy findings są KOMPLETNE?
3. Czy user NAPRAWDĘ czyta UVS?
4. Czy methods.csv jest KOMPLETNE?
```

**Incompleteness Inventory:**
```
| Limit | Wpływ | Mitygacja? |
|-------|-------|------------|
| MAB sincerity | WYSOKI | Częściowo |
| Finding completeness | ŚREDNI | NIE |
| User attention | WYSOKI | Częściowo |
| Methods completeness | NISKI | TAK |
```

**Awareness Score:**
```
= mitigatable / acknowledged = 2/4 = 50%
```

---

## 5. Porównywanie wersji

### Framework Comparison

```
WORKFLOW_V1 vs WORKFLOW_V2

STEP 1: Run both on SAME test suite (Tests A-I)

STEP 2: Collect metrics

| Metryka | V1 | V2 | Δ | Better? |
|---------|----|----|---|---------|
| Finding Rate | | | | |
| Critical Rate | | | | |
| False Positive Rate | | | | |
| Consistency Score | | | | |
| Gaming Rate | | | | |
| Similarity to Fake | | | | |
| Core Alignment | | | | |
| Grounding Score | | | | |

STEP 3: Calculate Overall Score

SCORE = weighted average:
- Finding Rate × 0.15
- Critical Rate × 0.15
- False Positive Rate × 0.10 (inverted)
- Consistency Score × 0.10
- Gaming Rate × 0.10 (inverted)
- Similarity to Fake × 0.10 (inverted)
- Core Alignment × 0.15
- Grounding Score × 0.15

STEP 4: Decision

| Δ Overall | Decision |
|-----------|----------|
| V2 > V1 + 10% | UPGRADE to V2 |
| V2 ≈ V1 ± 10% | KEEP V1 (simpler) |
| V2 < V1 - 10% | REJECT V2 |
```

### Regression Test Suite

```
BEFORE any workflow change, run:

□ Test A: Baseline (CLEAN, BUGGY, MIXED)
□ Test B: Consistency (3 runs)
□ Test C: Self-Reference
□ Test D: Liar's Trap
□ Test E: Mirror Trap
□ Test G: Theseus
□ Test H: Strange Loop

SAVE baseline metrics.

AFTER change:
- Run same tests
- Compare metrics
- Flag any regression >5%
```

---

## 6. Scoring Card

```
## Deep Verify Evaluation Card

**Version:** [X.Y]
**Date:** [YYYY-MM-DD]
**Tester:** [name]

### Performance Metrics
| Metric | Score | Target | Pass? |
|--------|-------|--------|-------|
| Finding Rate | /hr | >5/hr | |
| Critical Rate | % | >30% | |
| False Positive | % | <20% | |
| Consistency | % | >70% | |

### Adversarial Metrics
| Metric | Score | Target | Pass? |
|--------|-------|--------|-------|
| Gaming Rate | % | <20% | |
| Fake Similarity | % | <50% | |
| UVS Catch Rate | % | 100% | |

### Logic Metrics
| Metric | Score | Target | Pass? |
|--------|-------|--------|-------|
| Core Alignment | % | >60% | |
| Grounding Score | % | >50% | |
| Limits Acknowledged | /4 | 4/4 | |

### Overall
| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Performance | 40% | | |
| Adversarial | 35% | | |
| Logic | 25% | | |
| **TOTAL** | 100% | | **/100** |

### Verdict
[ ] PASS (≥70/100)
[ ] CONDITIONAL (50-69/100) — needs improvement
[ ] FAIL (<50/100) — do not use
```

---

## 7. Test Execution Checklist

### Pre-test Setup

```
□ Prepare CLEAN sample (verified bug-free code)
□ Prepare BUGGY sample (5 planted bugs, documented)
□ Prepare MIXED sample (2 subtle bugs, documented)
□ Ensure methods.csv is accessible
□ Clear previous test results
```

### Test Execution Order

```
1. □ Test A: Baseline Performance
2. □ Test B: Consistency (run 3x)
3. □ Test C: Self-Reference
4. □ Test D: Liar's Trap
5. □ Test E: Mirror Trap
6. □ Test F: Quote Fabrication
7. □ Test G: Theseus
8. □ Test H: Strange Loop
9. □ Test I: Gödel Incompleteness
```

### Post-test Analysis

```
□ Calculate all metrics
□ Fill Scoring Card
□ Compare with previous version (if applicable)
□ Document any anomalies
□ Generate verdict
```

---

## 8. Sample Test Data

### CLEAN Sample (expected: 0-1 minor findings)

```javascript
// auth.js - verified, peer-reviewed
function validateUser(user) {
  if (!user || !user.email) {
    throw new Error('Invalid user object');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error('Invalid email format');
  }
  return true;
}
```

### BUGGY Sample (expected: 5 findings)

```javascript
// auth.js - contains 5 planted bugs
function validateUser(user) {
  // BUG 1: No null check on user
  if (!user.email) {  // crashes if user is null
    return false;  // BUG 2: Should throw, not return
  }
  // BUG 3: Weak regex allows invalid emails
  const emailRegex = /.+@.+/;
  if (!emailRegex.test(user.email)) {
    throw new Error('Invalid email');
  }
  // BUG 4: SQL injection possible
  const query = `SELECT * FROM users WHERE email = '${user.email}'`;
  // BUG 5: Password not validated
  return true;
}
```

### MIXED Sample (expected: 2 findings)

```javascript
// auth.js - contains 2 subtle bugs
function validateUser(user) {
  if (!user || !user.email) {
    throw new Error('Invalid user');
  }
  // SUBTLE BUG 1: Unicode emails not handled
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(user.email)) {
    throw new Error('Invalid email');
  }
  // SUBTLE BUG 2: Timing attack possible
  if (user.password === storedPassword) {
    return true;
  }
  return false;
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-08 | Initial testing framework |
| 2.0 | 2026-01-08 | Added MARS test results, V1 vs V2 comparison |

---

## 9. MARS Test Results (2026-01-08)

### Executive Summary

6-agent MARS (Multi-Agent Recursive Self-improvement) test wykonany na workflow.md (V1) i workflow-v2.md (V2).

| Agent | Workflow | Fokus | Status |
|-------|----------|-------|--------|
| **α (Alpha)** | workflow.md | Baseline | ✅ Completed |
| **β (Beta)** | workflow-v2.md | Baseline | ✅ Completed |
| **γ (Gamma)** | workflow.md | MAB analysis | ✅ Completed |
| **δ (Delta)** | workflow-v2.md | Simplification | ✅ Completed |
| **ε (Epsilon)** | workflow.md | Adversarial | ✅ Completed |
| **ζ (Zeta)** | workflow-v2.md | Comparative | ✅ Completed |

---

### Test Results: V1 vs V2

#### Method Application Scores

| Method | V1 Score | V2 Score | Gap |
|--------|----------|----------|-----|
| #70 Scope Integrity | 9/10 | 6/10 | -3 |
| #72 Closure Check | 9/10 | 3/10 | -6 |
| #73 Coherence Check | 8/10 | 4/10 | -4 |
| #74 Grounding Check | 9/10 | 5/10 | -4 |
| #75 Falsifiability | 9/10 | 4/10 | -5 |
| #51 Liar's Trap | 8/10 | 7/10 | -1 |
| #52 Mirror Trap | 8/10 | 6/10 | -2 |
| #38 Chaos Monkey | 3/10 | 2/10 | -1 |
| **TOTAL** | **63/80** | **37/80** | **-26** |
| **PERCENTAGE** | **78.75%** | **46.25%** | |

#### Bug Detection on BUGGY Sample

| Bug | Description | V1 | V2 |
|-----|-------------|----|----|
| Bug 1 | No null safety | ✅ | ⚠️ |
| Bug 2 | Weak regex | ✅ | ❌ |
| Bug 3 | SQL injection | ✅ | ⚠️ |
| Bug 4 | Dead code | ✅ | ❌ |
| Bug 5 | Inconsistent errors | ✅ | ⚠️ |
| **TOTAL** | | **100%** | **40%** |

#### Structural Comparison

| Aspect | V1 | V2 |
|--------|----|----|
| Line Count | 767 | 357 |
| Severity Levels | 4 | 2 |
| Action Handlers | 6 | 4 |
| Sanity Suite | ✅ | ❌ |
| Reject Handler | ❌ | ✅ |
| Coverage Tracking | ✅ | ❌ |

---

### Key Findings

#### V1 Strengths
1. **Sanity Suite Integration** — #70-75 built-in
2. **Fine-grained Severity** — 4 levels (CRITICAL/IMPORTANT/MINOR/INFO)
3. **Rich Actions** — [D] Deeper, [N] New, [M] More, [?] Search
4. **Coverage Tracking** — "Verified" and "Not verified" sections

#### V1 Weaknesses
1. **No Reject Handler** — Cannot contest findings
2. **Verbose MAB** — Slows iteration
3. **Complexity** — 767 lines overwhelming

#### V2 Strengths
1. **Streamlined** — 357 lines, easy to follow
2. **Reject Handler** — [R] allows contesting
3. **Compact MAB** — Faster execution

#### V2 Weaknesses
1. **Missing Sanity Suite** — #70-75 not integrated (CRITICAL)
2. **Binary Severity** — Only CRITICAL/MINOR
3. **No Coverage Tracking**

---

### Recommendations

#### Priority 1 (Critical)
1. **V2: Add Sanity Suite** — Would increase bug detection from 40% to ~85%
2. **V1: Add Reject Handler** — From V2

#### Priority 2 (Important)
1. **V1: Streamline MAB** — Use V2's compact format
2. **V2: Add Coverage Tracking** — From V1
3. **V2: Add IMPORTANT severity** — Middle tier

#### Priority 3 (Enhancement)
1. **Both: Add Chaos Monkey** — #38 for resilience
2. **Create V3 Hybrid** — Best of both worlds

---

### Proposed V3 Hybrid

See `workflow-v3.md` for implementation combining:
- V1's rigor (Sanity Suite, Coverage)
- V2's usability (Compact MAB, Reject Handler)
- New: 3-tier severity, Chaos Monkey option
