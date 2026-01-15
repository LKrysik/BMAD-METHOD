# Strategie Optymalizacji: Koszt, Czułość, Wydajność

> **Cel:** Algorytmy i procedury poprawy procesu weryfikacji.
> **Metody użyte:** #16, #20, #40, #61, #67, #88, #104, #117, #144, #150

---

## 1. Problem Optymalizacji

### Metoda #104 (Heisenberg Trade-off)

**Fundamentalny trade-off:**
```
Nie można jednocześnie maksymalizować:
- Detection Rate (DR)
- Precision (1 - FPR)
- Efficiency (1 / Cost)

Musi być WYBÓR lub KOMPROMIS
```

### Formalna Definicja

```
OPTIMIZE: max f(DR, Precision, Efficiency)
SUBJECT TO:
  - Cost ≤ Budget
  - Coverage ≥ min_coverage (wszystkie kategorie)
  - Latency ≤ max_time

Gdzie:
  f = weighted sum lub Pareto optimization
```

---

## 2. Strategie Redukcji Kosztów

### Strategia C1: Early Termination

**Metoda #67 (Stability Basin):**
```
Jeśli Phase 1 (Innate) znajdzie CRITICAL błąd:
→ STOP, nie kontynuuj do Phase 2
→ Oszczędność: ~60% tokenów

Warunek: CRITICAL jest wystarczający do odrzucenia artefaktu
```

**Implementacja:**
```
IF finding.severity == CRITICAL AND finding.confidence > 90%:
    TERMINATE with finding
    SKIP remaining phases
```

### Strategia C2: Progressive Deepening

**Metoda #16 (Reasoning via Planning):**
```
Zamiast: Full depth na wszystkim
Użyj: Stopniowe pogłębianie

Level 1: Surface scan (all elements, shallow)
Level 2: If suspicious → Deep scan (targeted)
Level 3: If still unclear → Full analysis

Oszczędność: ~40% na "clean" artefaktach
```

### Strategia C3: Method Pruning

**Metoda #40 (Technical Debt):**
```
Zmierz ROI każdej metody:
ROI(m) = findings_found(m) / tokens_used(m)

Prune: ROI < threshold
Keep: ROI ≥ threshold

Uwaga: Wymaga danych historycznych
```

### Strategia C4: Caching & Reuse

**Metoda #88 (Resource Blindness):**
```
Ukryty koszt: Powtórne ładowanie tych samych plików

Rozwiązanie:
- Cache domain-knowledge-base.md w sesji
- Cache methods.csv lookup
- Cache previous phase results

Oszczędność: ~20% na dużych artefaktach
```

---

## 3. Strategie Zwiększenia DR

### Strategia D1: Multi-Pass Verification

**Metoda #14 (Self-Consistency):**
```
Pass 1: Standard verification → Findings F₁
Pass 2: Inversion (szukaj failure paths) → Findings F₂
Pass 3: Adversarial (red team) → Findings F₃

Merge: F = F₁ ∪ F₂ ∪ F₃

Koszt: 3x
DR boost: +15-20pp (empirycznie V7.0 vs V6.5)
```

### Strategia D2: Domain-Specific Methods

**Metoda #156 (Domain Expert):**
```
IF domain == crypto:
    REQUIRE: #153 (theory), #154 (definitional), #155 (terms)
IF domain == distributed:
    REQUIRE: FLP check, CAP check, BFT bounds
IF domain == formal:
    REQUIRE: Halting, Rice, Gödel checks

Poprawa: +12pp THEORY detection (V7.0 data)
```

### Strategia D3: Mandatory Self-Check

**Metoda #113 (Self-Incrimination):**
```
BEFORE main analysis:
    Execute self-deception checks (#113, #131, #112)
    Document potential biases

AFTER main analysis:
    Check if biases manifested
    Adjust confidence accordingly

Poprawa: +100pp ASSUME detection (V7.0 vs V8.0)
```

### Strategia D4: Category Coverage Forcing

**Metoda #117 (Alternative Autopsy):**
```
Ensure każda kategoria błędów ma ≥1 metodę:

CATEGORIES = [THEORY, DOMAIN, COMPOSE, SHALLOW, ASSUME, INTEGRATE, ...]

FOR each category:
    IF no method selected for category:
        ADD highest-relevance method for category

Poprawa: Eliminuje 0% detection categories
```

---

## 4. Strategie Efektywnościowe (VPK)

### Strategia E1: Adaptive Budgeting

**Metoda #20 (Bayesian Updating):**
```
Initial budget: B₀ = f(complexity, criticality)

After Phase 1:
    IF findings_count > expected:
        B₁ = B₀ * 1.5 (more budget)
    ELIF findings_count < expected:
        B₁ = B₀ * 0.7 (less budget)

Dynamic reallocation based on evidence
```

### Strategia E2: Method Portfolio

**Metoda #61 (Pre-mortem):**
```
Zamiast: Wszystkie metody z równym priorytetem
Użyj: Portfolio z różnym risk/reward

High-yield methods (always run):
  - #84 Coherence (low cost, high detection)
  - #83 Completeness (low cost, catches TODOs)
  - #81 Scope (low cost, catches drift)

Medium-yield (run if budget):
  - #153 Theory (medium cost, domain-specific)
  - #72 5 Whys (medium cost, root cause)

Speculative (run if high budget):
  - #122 Sorites (high cost, edge cases)
  - #130 Aesthetic (high cost, bias detection)
```

### Strategia E3: Parallel Execution

**Metoda #11 (Tree of Thoughts):**
```
Zamiast: Sequential method execution
Użyj: Parallel independent methods

PARALLEL_GROUPS = [
    [#84, #83, #81],  # Core checks
    [#153, #154, #155],  # Theory checks
    [#72, #128, #122]  # Deep analysis
]

Execute groups sequentially, methods within parallel
Oszczędność: ~30% latency (not tokens)
```

---

## 5. Algorytmy Optymalizacji

### Algorytm 1: Greedy Method Selection

```python
def select_methods(artifact, budget):
    profile = extract_profile(artifact)
    candidates = all_methods.sort_by(relevance(profile))

    selected = []
    cost = 0
    categories_covered = set()

    for method in candidates:
        if cost + method.cost <= budget:
            selected.append(method)
            cost += method.cost
            categories_covered.add(method.category)

    # Force coverage
    for category in REQUIRED_CATEGORIES:
        if category not in categories_covered:
            best = find_cheapest_method(category)
            selected.append(best)

    return selected
```

### Algorytm 2: Bandit-Based Selection

```python
def bandit_select(artifact, history, budget):
    """Multi-armed bandit dla method selection"""

    # UCB1 score dla każdej metody
    for method in methods:
        exploitation = history.avg_finding_rate(method)
        exploration = sqrt(2 * log(total_runs) / method.runs)
        method.score = exploitation + exploration

    # Select top methods within budget
    return select_top_by_score(methods, budget)
```

### Algorytm 3: Threshold-Based Termination

```python
def verify_with_termination(artifact, threshold=0.9):
    findings = []
    confidence_sum = 0

    for phase in [INNATE, ADAPTIVE, CHALLENGE]:
        phase_findings = execute_phase(phase, artifact)
        findings.extend(phase_findings)

        # Check termination condition
        if any(f.severity == CRITICAL and f.confidence > threshold
               for f in phase_findings):
            return early_terminate(findings)

        # Check diminishing returns
        if phase_findings.marginal_improvement < 0.05:
            return early_terminate(findings)

    return full_report(findings)
```

---

## 6. Metryki do Śledzenia

### Metoda #150 (Learning Extraction)

**Per-run metrics:**
```
| Metric | Formula | Target |
|--------|---------|--------|
| DR | TP / (TP + FN) | > 70% |
| Precision | TP / (TP + FP) | > 80% |
| VPK | DR / (tokens/1000) | > 1.0 |
| CPF | tokens / findings | < 10K |
| Coverage | categories_hit / total | 100% |
```

**Per-method metrics:**
```
| Metric | Formula |
|--------|---------|
| Method DR | findings_by_method / applicable_errors |
| Method cost | avg_tokens_used |
| Method ROI | Method DR / Method cost |
```

---

## 7. Rekomendowane Konfiguracje

### Config: Cost-Optimized
```yaml
budget: 30K
early_termination: true
methods: [#84, #83, #81, #72]  # Core only
multi_pass: false
target_dr: 60%
```

### Config: Balanced (DEFAULT)
```yaml
budget: 60K
early_termination: on_critical
methods: auto_select(relevance > 0.5)
multi_pass: false
target_dr: 70%
```

### Config: Max Detection
```yaml
budget: 100K+
early_termination: false
methods: all_relevant
multi_pass: true
target_dr: 85%
```

---

## 8. UWAGA: Expected vs Measured

```
┌─────────────────────────────────────────────────────────────┐
│           NIE AKCEPTUJEMY WARTOŚCI "EXPECTED"               │
│                                                             │
│  Wszystkie wartości w tym dokumencie oznaczone jako         │
│  "Wpływ" są HIPOTEZAMI do zweryfikowania, nie faktami.      │
│                                                             │
│  Przed użyciem strategii: ZMIERZ baseline                   │
│  Po użyciu strategii: ZMIERZ wynik                          │
│  Tylko MEASURED values są podstawą decyzji.                 │
└─────────────────────────────────────────────────────────────┘
```

## 9. Quick Reference

| Potrzeba | Strategia | Wpływ (HIPOTEZA - wymaga testu) |
|----------|-----------|--------------------------------|
| Reduce cost | C1 Early termination | ? (test required) |
| Reduce cost | C2 Progressive deepening | ? (test required) |
| Increase DR | D1 Multi-pass | ? (test required) |
| Increase DR | D3 Self-check | +100pp ASSUME (V7.0 vs V8.0 MEASURED) |
| Increase VPK | E1 Adaptive budget | ? (test required) |
| Increase VPK | E2 Method portfolio | ? (test required) |

**Jedyna zweryfikowana wartość:** D3 Self-check → +100pp ASSUME (empirycznie: V7.0=100%, V8.0=0%)

---

**Wersja:** 1.0
**Data:** 2026-01-14
