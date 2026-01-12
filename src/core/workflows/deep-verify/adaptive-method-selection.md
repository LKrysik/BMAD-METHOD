# Adaptive Method Selection Protocol

## Problem

Obecne workflow (v6.x) ma hardkodowane metody per faza:
- Każda nowa słabość = ręczna modyfikacja workflow
- Nie skaluje się
- Ignoruje kontekst artefaktu

## Rozwiązanie

Zastąpić sztywne listy metod **dynamiczną selekcją** opartą na:
1. Analizie kontekstu artefaktu
2. Historycznej skuteczności metod
3. Kategorii wykrytego problemu

---

## Architektura

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADAPTIVE VERIFICATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ARTIFACT ──→ [Context Analyzer] ──→ artifact_profile           │
│                                            │                     │
│                                            ▼                     │
│  methods.csv ──→ [Method Selector] ←── artifact_profile         │
│                         │                                        │
│                         ▼                                        │
│                  selected_methods[]                              │
│                         │                                        │
│                         ▼                                        │
│               [Verification Engine]                              │
│                         │                                        │
│                         ▼                                        │
│                    findings[]                                    │
│                         │                                        │
│                         ▼                                        │
│         [Effectiveness Tracker] ──→ method_scores.yaml          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Context Analyzer

**Input:** Artefakt do weryfikacji
**Output:** artifact_profile

### Cechy do ekstrakcji

| Cecha | Wartości | Wpływ na selekcję |
|-------|----------|-------------------|
| type | code/document/plan/protocol | Kategorie metod |
| domain | security/performance/architecture/data | Metody domenowe |
| complexity | low/medium/high | Liczba metod |
| has_external_deps | true/false | Metody INTEGRATE |
| has_concurrency | true/false | Metody CONFLICT |
| has_state | true/false | Metody EDGE |
| size_tokens | number | Głębokość weryfikacji |

### Algorytm

```
function analyze_context(artifact):
    profile = {}

    # Typ artefaktu
    if contains_code_blocks(artifact):
        profile.type = "code"
    elif contains_requirements(artifact):
        profile.type = "document"

    # Domena
    profile.domain = extract_domain_keywords(artifact, [
        "security", "performance", "api", "data", "ui"
    ])

    # Złożoność
    profile.complexity = estimate_complexity(artifact)

    # Cechy specyficzne
    profile.has_external_deps = mentions_external_files(artifact)
    profile.has_concurrency = mentions_concurrency(artifact)
    profile.has_state = mentions_state_management(artifact)

    return profile
```

---

## 2. Method Selector

**Input:** artifact_profile, methods.csv, method_scores.yaml
**Output:** selected_methods[]

### Reguły selekcji

```yaml
# method-selection-rules.yaml

base_methods:
  # Zawsze uruchamiane (minimum viable verification)
  always:
    - 81  # Scope Integrity Audit
    - 84  # Coherence Check
    - 113 # Counterfactual Self-Incrimination

  # Warunkowo - per cecha
  conditional:
    has_external_deps:
      - 127 # Bootstrap Paradox
      - 90  # Dependency Topology Mapping

    has_concurrency:
      - 67  # Stability Basin Analysis
      - 68  # Critical Path Severance

    has_state:
      - 62  # Failure Mode Analysis
      - 39  # Chaos Engineering

    domain.security:
      - 34  # Security Audit Personas
      - 21  # Red Team vs Blue Team

# Kategorie per typ artefaktu
type_categories:
  code:
    preferred: [technical, sanity, coherence]
    weight: 1.2
  document:
    preferred: [sanity, exploration, epistemology]
    weight: 1.0
  protocol:
    preferred: [challenge, meta, risk]
    weight: 1.1

# Limit metod per complexity
complexity_limits:
  low: 8-12
  medium: 12-18
  high: 18-25
```

### Algorytm selekcji

```
function select_methods(profile, methods_csv, method_scores):
    selected = []

    # 1. Base methods (zawsze)
    selected += rules.base_methods.always

    # 2. Conditional methods (per cechy)
    for feature, methods in rules.conditional:
        if profile[feature]:
            selected += methods

    # 3. Kategorie preferowane per typ
    preferred_categories = rules.type_categories[profile.type].preferred

    # 4. Dobierz z methods.csv używając skuteczności
    remaining_budget = rules.complexity_limits[profile.complexity] - len(selected)

    candidates = methods_csv
        .filter(m => m.category in preferred_categories)
        .sort_by(m => method_scores[m.id] ?? 0.5)  # Prior 0.5 dla nowych
        .take(remaining_budget * 1.5)  # Nadmiar do losowania

    # 5. Losowy wybór z ważeniem (exploration + exploitation)
    selected += weighted_sample(
        candidates,
        remaining_budget,
        weights = [score * 0.7 + random * 0.3 for each]  # 70% exploit, 30% explore
    )

    # 6. Diversity check - min 3 różne kategorie
    ensure_category_diversity(selected, min_categories=3)

    return selected
```

---

## 3. Depth Controller

Decyduje **ile runów** i **jak głęboko** weryfikować.

### Sygnały do kontynuacji

| Sygnał | Akcja |
|--------|-------|
| Znaleziono CRITICAL | +1 run, +5 metod |
| High entropy finding | Weryfikuj inną metodą |
| 0 findings po 1 run | Zatrzymaj wcześnie (Bayesian) |
| INTEGRATE error | Wymuś czytanie plików |

### Algorytm

```
function decide_depth(profile, current_findings, run_number):
    base_runs = 1

    # Podnieś dla złożonych
    if profile.complexity == "high":
        base_runs = 2

    # Podnieś jeśli CRITICAL
    if any(f.severity == CRITICAL for f in current_findings):
        base_runs += 1

    # Zatrzymaj wcześnie jeśli nic nie znaleziono
    if run_number >= 1 and len(current_findings) == 0:
        return STOP

    # Bayesian stopping (z v6.2)
    if bayesian_stop_check(current_findings):
        return STOP

    if run_number < base_runs:
        return CONTINUE

    return STOP
```

---

## 4. Effectiveness Tracker

Uczy się które metody działają na jakie typy artefaktów.

### Dane zbierane

```yaml
# method_scores.yaml (per session)
session_id: "2026-01-12-001"
artifact_profile:
  type: document
  domain: [architecture, concurrency]
  complexity: high

method_results:
  - method_id: 127
    findings_produced: 2
    findings_confirmed: 2
    severity_sum: 5  # CRITICAL=3, IMPORTANT=2

  - method_id: 81
    findings_produced: 1
    findings_confirmed: 0  # False positive
    severity_sum: 0
```

### Aktualizacja scores

```
function update_scores(session_result):
    for method in session_result.method_results:
        key = (method.id, session_result.profile.type)

        old_score = scores[key] ?? 0.5

        # Score = confirmed findings / total findings (precision)
        precision = method.findings_confirmed / max(method.findings_produced, 1)

        # Bayesian update
        new_score = old_score * 0.9 + precision * 0.1  # Decay + new evidence

        scores[key] = new_score
```

---

## 5. Integracja z Workflow

Zamiast:
```markdown
### Discovery Methods per Layer
| Layer | Mandatory Methods | Purpose |
| A: Content | #70, #71, #72, #73, #75, #150, #152 | Sanity checks |
```

Nowy format:
```markdown
### Discovery Methods per Layer
| Layer | Selection Criteria | Purpose |
| A: Content | categories=[sanity, core], min=5, max=8 | Sanity checks |
| B: Structure | categories=[coherence, exploration], min=4, max=6 | Structure |
| C: Assumptions | categories=[epistemology, challenge], min=4, max=6 | Assumptions |
| D: Security | conditional=has_security_aspect, categories=[risk, technical] | Security |

Selection delegated to: [Method Selector] with artifact_profile
```

---

## 6. Token Efficiency

### Obecny model (v6.3)
- ~42-55 metod per weryfikacja (sztywne)
- ~15-20K tokenów per run
- Token Efficiency: 0.73 pts/1K tokens

### Model adaptacyjny (cel)
- 8-25 metod per weryfikacja (zależne od complexity)
- ~5-12K tokenów per run (redukcja 40-60%)
- Target TE: 1.2+ pts/1K tokens

### Oszczędności

| Complexity | Obecne metody | Adaptacyjne | Redukcja tokenów |
|------------|---------------|-------------|------------------|
| Low | 42 | 8-12 | ~70% |
| Medium | 42 | 12-18 | ~50% |
| High | 42 | 18-25 | ~30% |

---

## 7. Migracja z v6.3

### Krok 1: Ekstrakcja reguł
- Przeanalizuj które metody w v6.3 działały (z experiment-log)
- Zapisz jako initial method_scores.yaml

### Krok 2: Parametryzacja workflow
- Zamień hardkodowane listy na selection criteria
- Dodaj Context Analyzer przed Phase 1

### Krok 3: Feedback loop
- Po każdej weryfikacji aktualizuj method_scores
- Monitoruj drift w skuteczności

---

## 8. Przykład działania

**Artefakt:** Design document dla API authentication

**Context Analysis:**
```yaml
type: document
domain: [security, api]
complexity: medium
has_external_deps: true  # mentions "existing user service"
has_concurrency: false
has_state: true  # session management
```

**Method Selection:**
```
Base (always): #81, #84, #113 = 3
Conditional (has_external_deps): #127, #90 = 2
Conditional (has_state): #62, #39 = 2
Conditional (domain.security): #34, #21 = 2

Preferred categories: [sanity, exploration, epistemology, risk]
Remaining budget: 12-18 - 9 = 3-9

Top scored from preferred:
  #74 (sanity, score=0.82)
  #146 (exploration, score=0.78)
  #61 (risk, score=0.75)
  #119 (epistemology, score=0.71)

Selected: 9 base + 4 top = 13 methods

Categories: sanity(3), challenge(2), risk(2), technical(2), epistemology(2), exploration(1), coherence(1)
Diversity check: 7 categories ✓
```

**Result:** 13 metod zamiast 42, fokus na security/integration

---

## Status

- [ ] Implement Context Analyzer
- [ ] Implement Method Selector
- [ ] Create method-selection-rules.yaml
- [ ] Create initial method_scores.yaml from v6.3 data
- [ ] Modify workflow template
- [ ] Test on T12-T15

---

## Powiązane zadania

- **T12 (Incremental Method Effectiveness Learning)** - feedback loop
- **T15 (NL to Method Mapping)** - intent→method mapping

Ironicznie, rozwiązanie problemu adaptacyjności jest opisane w zadaniach testowych.
