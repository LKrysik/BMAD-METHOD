# Zasady Rozwoju Workflow: Jak Ewoluować Bezpiecznie

> **Cel:** Procedury i zasady rozwijania workflow bez regresji.
> **Metody użyte:** #14, #61, #64, #74, #109, #144, #145, #146, #148, #149

---

## 1. Fundamentalna Zasada

### Metoda #109 (Contraposition)

**Pytanie:** Co GWARANTUJE że zmiana pogorszy workflow?

```
GWARANCJA POGORSZENIA:
1. Usunięcie elementu bez mierzenia jego wpływu
2. Dodanie elementu bez baseline
3. Optymalizacja jednej metryki ignorując inne
4. Zaufanie claims bez weryfikacji
5. Brak A/B testu na ground truth

ZASADA: Unikaj powyższego → unikniesz regresji
```

---

## 2. Proces Wprowadzania Zmian

### Metoda #146 (Documentation Protocol)

**Każda zmiana wymaga:**

```markdown
## Change Proposal: [nazwa]

### 1. Problem Statement
Co nie działa / co chcemy poprawić?
Evidence: [dane pokazujące problem]

### 2. Proposed Change
Co konkretnie zmieniamy?
Affected components: [lista]

### 3. Hypothesis
Jak zmiana rozwiąże problem?
Expected impact: DR +X%, Cost -Y%

### 4. Validation Plan
Ground truth tasks: [T1, T2, ...]
Success criteria: [metryki]
Rollback trigger: [kiedy wycofać]

### 5. Results
Before: [metryki]
After: [metryki]
Decision: ADOPT / REJECT / MODIFY
```

---

## 3. Typy Zmian i Procedury

### Metoda #64 (Risk Register)

| Typ Zmiany | Ryzyko | Procedura |
|------------|--------|-----------|
| **DODANIE metody** | LOW | Test na 3 tasks, mierz marginal DR |
| **USUNIĘCIE elementu** | HIGH | Full regression test, A/B na all tasks |
| **MODYFIKACJA flow** | MEDIUM | Test na representative sample |
| **ZMIANA budżetów** | MEDIUM | Test cost/DR trade-off |
| **REFACTORING** | LOW-MEDIUM | Before/after comparison |

### Procedura: Dodanie Metody

```
1. Identify gap: Która kategoria błędów ma niskie DR?
2. Select method: Która metoda adresuje tę kategorię?
3. Test isolated: Run method on 5 tasks, measure findings
4. Test integrated: Add to workflow, run on 10 tasks
5. Measure delta: DR, Cost, VPK przed/po
6. Decision: IF delta_DR > 0 AND delta_cost < 20%: ADOPT
```

### Procedura: Usunięcie Elementu

```
1. Document rationale: Dlaczego usuwamy?
2. Measure current impact: Co element wykrywa?
3. Identify dependencies: Co zależy od elementu?
4. A/B test:
   - Control: Current workflow
   - Test: Workflow bez elementu
   - Tasks: ALL available ground truth
5. Compare metrics: DR, FPR, Cost, VPK
6. Decision: IF test_DR >= control_DR - 2pp: ALLOW REMOVAL
            ELSE: REJECT
```

---

## 4. Walidacja Empiryczna

### Metoda #14 (Self-Consistency)

**Każda wersja musi przejść:**

```
VALIDATION SUITE:

Level 1: Smoke Test (5 tasks)
  - T1, T5, T10, T15, T20 (reprezentatywne)
  - Pass: DR ≥ previous - 5pp

Level 2: Regression Test (all tasks)
  - T1-T21
  - Pass: DR ≥ previous - 2pp
  - Pass: No category drops to 0%

Level 3: Efficiency Test
  - Same tasks
  - Pass: Cost ≤ previous + 20%
  - Pass: VPK ≥ previous - 10%
```

### Ground Truth Requirements

**Metoda #61 (Pre-mortem):**
```
Co może pójść nie tak bez ground truth?
→ Nie wiadomo czy zmiana pomogła czy zaszkodziła
→ Regresje niewykryte do produkcji
→ False confidence w "ulepszeniach"

WYMAGANIE: Minimum 10 tasks z pełnym ground truth
OPTYMALNIE: 20+ tasks pokrywających wszystkie kategorie
```

---

## 5. Wersjonowanie

### Metoda #145 (Documentation)

**Semantic Versioning dla Workflow:**

```
MAJOR.MINOR.PATCH

MAJOR: Zmiana architektury (V6 → V7)
  - Wymaga: Full regression + approval
  - Risk: HIGH

MINOR: Dodanie/usunięcie elementu (V7.0 → V7.1)
  - Wymaga: Regression test
  - Risk: MEDIUM

PATCH: Bug fix, clarification (V7.0.0 → V7.0.1)
  - Wymaga: Smoke test
  - Risk: LOW
```

### Change Log Format

```markdown
## [7.1.0] - 2026-01-15

### Added
- Method #164 for distributed systems (addresses T17 gap)

### Changed
- Phase 2 budget from 30K to 35K

### Removed
- Nothing

### Metrics
- DR: 72.4% → 74.1%
- Cost: 55K → 58K
- VPK: 1.31 → 1.28
```

---

## 6. Unikanie Łatkowania

### Metoda #74 (Critique and Refine)

**Przed dodaniem łatki, sprawdź:**

```
PATCH CHECKLIST:

[ ] Problem jest w WORKFLOW czy w METODZIE?
    → Jeśli w metodzie: popraw metodę, nie workflow

[ ] Problem jest SYSTEMOWY czy LOKALNY?
    → Jeśli lokalny: może być łatka
    → Jeśli systemowy: wymaga redesign

[ ] Łatka adresuje SYMPTOM czy PRZYCZYNĘ?
    → Jeśli symptom: szukaj przyczyny
    → Jeśli przyczyna: OK dla łatki

[ ] Łatka tworzy NOWE PROBLEMY?
    → Jeśli tak: redesign
    → Jeśli nie: OK dla łatki
```

### Przykład: Analiza Potencjalnej Łatki

```
Problem: V8.0 ma 0% ASSUME detection
Proposed patch: Dodaj "Phase 1.5 Assumption Check"

Analiza:
[ ] Problem w workflow czy metodzie? → WORKFLOW (brak self-check)
[ ] Systemowy czy lokalny? → SYSTEMOWY (fundamentalny brak)
[ ] Symptom czy przyczyna? → SYMPTOM (przyczyna: usunięcie self-check)
[ ] Nowe problemy? → TAK (dodatkowy overhead, complexity)

DECYZJA: NIE ŁATKA, przywróć usunięty self-check
```

---

## 7. Retrospektywa Po Zmianie

### Metoda #149 (Retrospective)

**Po każdej zmianie wersji:**

```markdown
## Retrospective: V8.0

### What Went Well
- Simplification made workflow easier to understand
- One-file principle reduced drift

### What Went Wrong
- Removed elements without measuring impact
- Claims without evidence
- Regression on ASSUME/INTEGRATE categories

### Root Causes
1. No A/B test before release
2. Trusted theoretical analysis over empirical data
3. Optimized for simplicity, ignored effectiveness

### Actions for Next Version
1. ALWAYS A/B test before release
2. NEVER remove element without impact data
3. Track per-category DR, not just overall
```

---

## 8. Cykl Rozwoju

### Metoda #144 (Iteration Protocol)

```
DEVELOPMENT CYCLE:

1. IDENTIFY
   - Gap w detekcji (data-driven)
   - Koszt do optymalizacji (measured)

2. HYPOTHESIZE
   - Proposed change
   - Expected impact (quantified)

3. IMPLEMENT
   - Minimal change
   - Document rationale

4. VALIDATE
   - A/B test on ground truth
   - Measure all metrics

5. DECIDE
   - IF improvement: MERGE
   - IF regression: REJECT
   - IF unclear: MORE DATA

6. DOCUMENT
   - Change log
   - Metrics before/after
   - Lessons learned

7. REPEAT
```

---

## 9. Red Flags - Kiedy STOP

### Metoda #135 (Tolerance Paradox)

**Kategoryczne odrzucenie zmian gdy:**

```
RED FLAGS:

🚫 "Wydaje się że X jest niepotrzebne" bez danych
🚫 "Uprośćmy to" bez mierzenia wpływu
🚫 "Inne workflow tego nie mają" - not relevant
🚫 "To wygląda źle" - aesthetic not functional
🚫 Brak ground truth do walidacji
🚫 Zmiana > 3 elementów naraz (can't attribute)
🚫 Usunięcie safety net "bo się nie wykonuje"
🚫 "Expected DR: ~X%" - NIEDOPUSZCZALNE, tylko measured
🚫 "Should improve by ~Y%" - NIEDOPUSZCZALNE, tylko measured
```

### FUNDAMENTALNA ZASADA

```
┌─────────────────────────────────────────────────────────────┐
│  NIE AKCEPTUJEMY "EXPECTED", "ESTIMATED", "SHOULD BE", "~"  │
│                                                             │
│  Tylko wartości ZMIERZONE empirycznie na ground truth       │
│  są podstawą do decyzji.                                    │
│                                                             │
│  Hipoteza ≠ Fakt                                           │
│  Expected ≠ Measured                                        │
│  Theory ≠ Evidence                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Quick Reference

### Before ANY Change

```
[ ] Mam dane pokazujące problem?
[ ] Mam hipotezę rozwiązania?
[ ] Mam ground truth do walidacji?
[ ] Zmiana jest minimalna?
[ ] Mogę zmierzyć przed/po?
```

### Change Decision Matrix

| Data pokazuje problem | Ground truth dostępny | Decyzja |
|----------------------|----------------------|---------|
| TAK | TAK | PROCEED with A/B test |
| TAK | NIE | WAIT for ground truth |
| NIE | TAK | DON'T CHANGE (no problem) |
| NIE | NIE | DON'T CHANGE |

### Post-Change Checklist

```
[ ] DR nie spadło > 2pp?
[ ] Żadna kategoria nie spadła do 0%?
[ ] Cost nie wzrosło > 20%?
[ ] VPK nie spadło > 10%?
[ ] Documented w change log?
[ ] Retrospective completed?
```

---

**Wersja:** 1.0
**Data:** 2026-01-14
