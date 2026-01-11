# Universal Protocol Test Prompt

Skopiuj i wklej poniższy prompt, uzupełniając wartości w nawiasach kwadratowych.

---

## MANDATORY Checklist

**PRZED zakończeniem eksperymentu WSZYSTKIE pola muszą być wypełnione:**

- [ ] **Tokeny Agent Run 1**: input=___ output=___ total=___
- [ ] **Tokeny Agent Run 2**: input=___ output=___ total=___
- [ ] **Tokeny Agent Run 3**: input=___ output=___ total=___
- [ ] **Tokeny Protocol Run 1**: input=___ output=___ total=___
- [ ] **Tokeny Protocol Run 2**: input=___ output=___ total=___
- [ ] **Tokeny Protocol Run 3**: input=___ output=___ total=___
- [ ] **Czas Agent Run 1**: ___sek
- [ ] **Czas Agent Run 2**: ___sek
- [ ] **Czas Agent Run 3**: ___sek
- [ ] **Czas Protocol Run 1**: ___sek
- [ ] **Czas Protocol Run 2**: ___sek
- [ ] **Czas Protocol Run 3**: ___sek
- [ ] **Agent Isolation**: potwierdzono że agent NIE miał dostępu do ground-truth.md
- [ ] **Blind evaluation**: findings opisane PRZED otwarciem ground-truth.md
- [ ] **Wyniki zapisane** do experiment-log.md

> **UWAGA:** Jeśli którykolwiek pomiar brakuje, oznacz w logu jako "MEASUREMENT_MISSING" i uzasadnij dlaczego.

> **EDGE CASES:**
> - Jeśli protokół wykryje 0 findings → zapisz "ZERO_FINDINGS" i kontynuuj (to może być valid result dla czystego artefaktu)
> - Jeśli WDS = 0 → pomiń metryki TE, TiE, OES (division by zero) i oznacz jako "WDS_ZERO"
> - Jeśli agent nie wygeneruje artefaktu → zapisz "AGENT_FAILURE" i powtórz run

---

```
Przeprowadź test procesu weryfikacyjnego.

PROCES DO TESTOWANIA: [NAZWA_PLIKU.md]
ZADANIE TESTOWE: T[N]

---

KROK 1 - Przeczytaj pliki:
1. src/testing/framework/universal-test-orchestrator.md
2. src/testing/framework/protocol-registry.md
3. src/testing/framework/universal-metrics.md
4. src/testing/tasks/trap-tasks.md
5. [ŚCIEŻKA_DO_PROCESU] - proces do testowania
6. src/core/methods/methods.csv

KROK 2 - Wykonaj test:
- 3 uruchomienia agenta na zadaniu T[N] (Run 1, Run 2, Run 3)
- 3 uruchomienia procesu na artefaktach (dla każdego artefaktu z agenta)
- Mierz tokeny (input + output) i czas dla KAŻDEGO uruchomienia (6 pomiarów łącznie)
- Blind evaluation (NIE otwieraj ground-truth.md przed krokiem 3)
- ISOLATION CHECK: Potwierdź że agent NIE ma dostępu do ground-truth.md

KROK 3 - Przed tworzeniem nowej wersji procesu:
- Sprawdź czy plik o proponowanej nazwie już istnieje
- Jeśli istnieje → zwiększ numer wersji
- Nowe wersje twórz w TEJ SAMEJ lokalizacji co oryginalny proces

KROK 4 - Zapisz wyniki:
- Wyniki: src/testing/results/experiment-log.md
- Artefakty: src/testing/results/experiments/artifacts/
- Weryfikacje: src/testing/results/verifications/
```

---

## Dostępne procesy do testowania

| Proces | Ścieżka | Opis |
|--------|---------|------|
| Deep Verify V5 | `src/core/workflows/deep-verify/workflow-v5.md` | Podstawowy |
| Deep Verify V6 | `src/core/workflows/deep-verify/workflow-v6.md` | + Concern layers A/B/C |
| Deep Verify V6.1 | `src/core/workflows/deep-verify/workflow-v6.1.md` | + Layer D (Security) |
| **Deep Verify V6.2** | `src/core/workflows/deep-verify/workflow-v6.2.md` | **+ Bayesian Stopping** |
| ~~Deep Verify V6.3~~ | ~~`src/core/workflows/deep-verify/workflow-v6.3.md`~~ | ⚠️ RESERVED - NOT IMPLEMENTED |
| Deep Verify Lite | `src/core/workflows/deep-verify/workflow-v6-lite.md` | Szybki |
| Tensor V-GD | `src/core/quality_gates/Tensor-Based-Verification-Protocol.md` | Matematyczny |
| Quadrant QVP | `src/core/quality_gates/Quadrant-Verification-Protocol.md` | 4-wymiarowy |
| Universal UAQG | `src/core/quality_gates/Universal-Agent-Quality-Gate-Protocol.md` | 6-bramkowy |

## Dostępne zadania testowe

| Zadanie | Nazwa | Trudność |
|---------|-------|----------|
| T1 | Configuration Validator Module | Standard |
| T2 | Method Recommendation Engine | Standard |
| T3 | Session Memory Persistence | Standard |
| T4 | Workflow Orchestrator | Standard |
| T5 | Multi-Agent Collaboration Protocol | Standard |
| T6 | Verification Report Generator | Standard |
| T7 | Method Effectiveness Tracker | Standard |
| T8 | Incremental Verification System | Standard |
| T9 | Agent Self-Improvement Loop | Standard |
| T10 | Cross-Workflow Consistency Checker | Standard |
| T11 | Plugin Architecture for Method Extensions | Advanced |
| T12 | Incremental Method Effectiveness Learning | Advanced |
| T13 | Cross-Agent Memory Synchronization | Advanced |
| T14 | Self-Modifying Workflow Engine | Advanced |
| T15 | Natural Language to Method Mapping | Advanced |

---

## Przykłady użycia

### Test Tensor V-GD na zadaniu T3

```
Przeprowadź test procesu weryfikacyjnego.

PROCES DO TESTOWANIA: Tensor-Based-Verification-Protocol.md
ZADANIE TESTOWE: T3

---

KROK 1 - Przeczytaj pliki:
1. src/testing/framework/universal-test-orchestrator.md
2. src/testing/framework/protocol-registry.md
3. src/testing/framework/universal-metrics.md
4. src/testing/tasks/trap-tasks.md
5. src/core/quality_gates/Tensor-Based-Verification-Protocol.md
6. src/core/methods/methods.csv

KROK 2 - Wykonaj test:
- 3 uruchomienia agenta na zadaniu T3
- 3 uruchomienia procesu na artefaktach
- Mierz tokeny (input + output) i czas dla każdego uruchomienia
- Blind evaluation (NIE otwieraj ground-truth.md przed krokiem 3)

KROK 3 - Przed tworzeniem nowej wersji procesu:
- Sprawdź czy plik o proponowanej nazwie już istnieje
- Jeśli istnieje → zwiększ numer wersji
- Nowe wersje twórz w TEJ SAMEJ lokalizacji co oryginalny proces

KROK 4 - Zapisz wyniki:
- Wyniki: src/testing/results/experiment-log.md
- Artefakty: src/testing/results/experiments/artifacts/
- Weryfikacje: src/testing/results/verifications/
```

### Porównanie dwóch procesów na tym samym zadaniu

```
Przeprowadź porównanie procesów weryfikacyjnych.

PROCESY DO PORÓWNANIA:
1. src/core/workflows/deep-verify/workflow-v6.md
2. src/core/quality_gates/Tensor-Based-Verification-Protocol.md

ZADANIE TESTOWE: T5

Wykonaj pełny test dla każdego procesu, potem porównaj metryki.
Zapisz porównanie do: src/testing/results/comparisons/
```

---

## Szablon logowania wyników

Użyj tego szablonu do logowania w `src/testing/results/experiment-log.md`:

```markdown
---

## EXP-[YYYY-MM-DD]-[NNN]

### Konfiguracja
- **Proces**: [nazwa i ścieżka]
- **Zadanie**: T[N] - [nazwa zadania]
- **Model agenta**: [sonnet/opus/haiku]
- **Liczba uruchomień**: 3
- **Data**: [timestamp]

---

### Phase 1: Agent Runs

| Run | Tokens (in+out) | Czas (sek) | Artefakt |
|-----|-----------------|------------|----------|
| 1 | [N] + [N] = [N] | [N] | artifact-t[N]-run-1.md |
| 2 | [N] + [N] = [N] | [N] | artifact-t[N]-run-2.md |
| 3 | [N] + [N] = [N] | [N] | artifact-t[N]-run-3.md |

---

### Phase 2: Protocol Runs

| Run | Tokens (in+out) | Czas (sek) | Findings | Weryfikacja |
|-----|-----------------|------------|----------|-------------|
| 1 | [N] + [N] = [N] | [N] | [N] | verify-t[N]-run-1.md |
| 2 | [N] + [N] = [N] | [N] | [N] | verify-t[N]-run-2.md |
| 3 | [N] + [N] = [N] | [N] | [N] | verify-t[N]-run-3.md |

---

### Phase 3: Blind Evaluation

#### Findings (PRZED otwarciem ground-truth.md)
| ID | Opis | Kategoria | Severity | Confidence |
|----|------|-----------|----------|------------|
| F1 | [opis] | [SCOPE/ASSUME/...] | [CRIT/IMP/MIN] | [HIGH/MED/LOW] |

#### Matching (PO otwarciu ground-truth.md)
| Error ID | Finding Match | Quality (Y/P/N) | Points |
|----------|---------------|-----------------|--------|
| T[N]-E1 | F[N] | [Y/P/N] | [pts] |

---

### Phase 4: Metryki

| Metryka | Run 1 | Run 2 | Run 3 | Mean | StdDev | RS |
|---------|-------|-------|-------|------|--------|-----|
| DR | | | | | | |
| WDS | | | | | | |
| Tokens (total) | | | | | | |
| Czas (total) | | | | | | |
| TE | | | | | | |
| P | | | | | | |
| OES | | | | | | |

---

### Obserwacje
[Notatki o zachowaniu procesu]

### Problemy
[Wykryte problemy z procesem]

### Rekomendacje
[Sugestie ulepszeń]
```

---

## Gdzie zapisywać pliki

| Typ pliku | Lokalizacja | Nazwa pliku |
|-----------|-------------|-------------|
| Log eksperymentu | `src/testing/results/experiment-log.md` | (dopisz do istniejącego) |
| Artefakt agenta | `src/testing/results/experiments/artifacts/` | `artifact-t[N]-run-[M].md` |
| Weryfikacja | `src/testing/results/verifications/` | `verify-t[N]-run-[M].md` |
| Porównanie | `src/testing/results/comparisons/` | `comparison-[P1]-vs-[P2]-t[N].md` |
| **Meta-analiza** | `src/testing/results/analysis/` | `meta-analysis-[YYYY-MM-DD].md` |
| **Nowa wersja procesu** | **TAK SAMO jak oryginalny proces** | `workflow-v[X.Y].md` lub `[Protocol]-v[N].md` |

---

## Meta-Analysis (Phase 8)

Po przeprowadzeniu 3+ eksperymentów lub gdy szukasz radykalnych ulepszeń:

```
Przeprowadź meta-analizę wyników testów.

KROK 1 - Przeczytaj pliki:
1. src/testing/framework/meta-analysis-protocol.md
2. src/testing/framework/meta-analysis-execution-template.md
3. src/testing/results/experiment-log.md
4. src/core/methods/methods.csv

KROK 2 - Zastosuj metody eksploracyjne:
- #103 Fourier Domain Shift (zmiana perspektywy)
- #115 Negative Space Cartography (co NIE było testowane)
- #102 Cantor's Diagonal Escape (wyjście poza paradygmat)
- #23 Analogical Reasoning (rozwiązania z innych dziedzin)
- #46 SCAMPER (systematyczna innowacja)
- #109 Contraposition Inversion (co GWARANTUJE porażkę)
- #122 Sorites Paradox (co jest NAPRAWDĘ istotne)
- #123 Newcomb's Paradox (zaskakujące rozwiązania)
- #124 Braess Paradox (czy dodatki pomagają)

KROK 3 - Wygeneruj rekomendacje:
- DO: natychmiastowe zmiany (wysokie zaufanie)
- TRY: eksperymenty do przeprowadzenia
- AVOID: anty-wzorce do unikania
- INVESTIGATE: kierunki badań

KROK 4 - Zapisz wyniki:
- src/testing/results/analysis/meta-analysis-[YYYY-MM-DD].md
```
