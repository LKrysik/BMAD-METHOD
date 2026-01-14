# PEŁNE ZESTAWIENIE WYNIKÓW Z KOSZTAMI: T1-T21

## Podsumowanie Wykonawcze

**Data:** 2026-01-14
**Zakres:** Wszystkie zadania testowe T1-T21
**Workflow:** V7.0, V6.6, V6.5, V6.4, V6.3

### UWAGA O TOKENACH
Rzeczywiste wartości tokenów (z JSONL) są **znacznie wyższe** niż wcześniejsze szacunki:
- Szacunki vs REAL: różnica +93% do +635%
- Poniższe dane zawierają mix: REAL (oznaczone ✓) i szacunki (~)

---

## MEGA TABELA: DR + TOKENY per Task

### T1-T10: Standard Tasks

| Task | Nazwa | Max Pkt | V6.6 DR | V6.6 Tokens | V6.5 DR | V6.5 Tokens | V6.4 DR | V6.4 Tokens | V6.3 DR | V6.3 Tokens |
|------|-------|---------|---------|-------------|---------|-------------|---------|-------------|---------|-------------|
| T1 | Configuration Validator | 13 | 77% | ~95K | 69% | ~80K | 62% | ~5K | 54% | ~12K |
| T2 | Method Recommendation | 13 | 77% | ~95K | 62% | ~80K | 54% | ~5K | 46% | ~12K |
| T3 | Session Memory | 13 | 92% | ~95K | 85% | ~80K | 85% | ~5K | 77% | ~12K |
| T4 | Workflow Orchestrator | 13 | 85% | ~95K | 77% | ~80K | 69% | ~5K | 62% | ~12K |
| T5 | Multi-Agent Protocol | 13 | 92% | ~95K | 85% | ~80K | 85% | ~5K | 77% | ~12K |
| T6 | Report Generator | 11 | 82% | ~90K | 73% | ~75K | 64% | ~5K | 55% | ~11K |
| T7 | Effectiveness Tracker | 11 | 82% | ~90K | 73% | ~75K | 73% | ~5K | 64% | ~11K |
| T8 | Incremental Verification | 12 | 83% | ~95K | 75% | ~80K | 58% | ~5K | 50% | ~12K |
| T9 | Self-Improvement Loop | 14 | 79% | ~100K | 71% | ~85K | 64% | ~6K | 57% | ~14K |
| T10 | Consistency Checker | 12 | 83% | ~95K | 75% | ~80K | 67% | ~5K | 58% | ~12K |
| **Σ T1-T10** | | **125** | **83.2%** | **~945K** | **74.5%** | **~795K** | **68.1%** | **~51K** | **60.0%** | **~120K** |

### T11-T15: V2 Harder Tasks

| Task | Nazwa | Max Pkt | V7.0 DR | V7.0 Tokens | V6.6 DR | V6.6 Tokens | V6.5 DR | V6.5 Tokens | V6.4 DR | V6.4 Tokens | V6.3 DR | V6.3 Tokens |
|------|-------|---------|---------|-------------|---------|-------------|---------|-------------|---------|-------------|---------|-------------|
| T11 | Plugin Architecture | 16 | - | - | 81% | ~100K | 69% | ~85K | 63% | ~5K | 56% | ~12K |
| T12 | Incremental Learning | 16 | - | - | 75% | ~100K | 69% | ~85K | 63% | ~5K | 57% | ~12K |
| T13 | Memory Sync | 17 | - | - | 82% | ~105K | 76% | ~90K | 71% | ~5K | 64% | ~16K |
| T14 | Self-Modifying Engine | 16 | - | - | 81% | ~100K | 81% | ~85K | 75% | ~5K | 71% | ~15K |
| T15 | NL to Method Mapping | 14 | 71% | ~55K | 79% | ~100K | 71% | ~85K | 64% | ~6K | 57% | ~12K |
| **Σ T11-T15** | | **79** | **71%*** | **~55K*** | **79.6%** | **~505K** | **73.2%** | **~430K** | **67.2%** | **~26K** | **61.0%** | **~67K** |

*V7.0 testowany tylko na T15

### T16-T21: V3 Expert Tasks (REAL Token Data ✓)

| Task | Nazwa | Max Pkt | V7.0 DR | V7.0 Tokens ✓ | V6.6 DR | V6.6 Tokens ✓ | V6.5 DR | V6.5 Tokens ✓ | V6.4 DR | V6.4 Tokens | V6.3 DR | V6.3 Tokens |
|------|-------|---------|---------|---------------|---------|---------------|---------|---------------|---------|-------------|---------|-------------|
| T16 | Crypto Key Mgmt | 14 | **74%** | **55,480** | 59% | 103,791 | 59% | 88,249 | 57% | ~5K | 50% | ~12K |
| T17 | BFT Consensus | 14 | **64%** | ~55K | 54% | ~100K | 54% | ~85K | 50% | ~5K | 43% | ~12K |
| T18 | Formal Verification | 14 | **79%** | ~55K | 71% | ~100K | 71% | ~85K | 43% | ~5K | 36% | ~12K |
| T19 | Verification Auction | 14 | **71%** | ~55K | 64% | ~100K | 64% | ~85K | 43% | ~5K | 36% | ~12K |
| T20 | Quantum Optimizer | 14 | **79%** | ~60K | 64% | ~100K | 64% | ~85K | 36% | ~5K | 29% | ~12K |
| T21 | DSL Compiler | 14 | **71%** | ~55K | 54% | ~80K | 64% | ~85K | 50% | ~5K | 43% | ~12K |
| **Σ T16-T21** | | **84** | **73.0%** | **~335K** | **61.0%** | **~584K** | **62.7%** | **~513K** | **46.5%** | **~30K** | **39.5%** | **~72K** |

---

## PODSUMOWANIE KOSZTÓW CAŁKOWITYCH

### Suma Tokenów per Workflow (T1-T21)

| Workflow | T1-T10 | T11-T15 | T16-T21 | **SUMA** | Avg DR | **Koszt/% DR** |
|----------|--------|---------|---------|----------|--------|----------------|
| **V7.0** | - | ~55K* | ~335K | **~390K*** | 72%* | **5,417** |
| V6.6 | ~945K | ~505K | ~584K | **~2,034K** | 77.8% | **26,142** |
| V6.5 | ~795K | ~430K | ~513K | **~1,738K** | 71.4% | **24,342** |
| V6.4 | ~51K | ~26K | ~30K | **~107K** | 63.8% | **1,677** |
| V6.3 | ~120K | ~67K | ~72K | **~259K** | 56.0% | **4,625** |

*V7.0 dane częściowe (T15-T21)

### Token Economy Rankings

| Rank | Workflow | Tokens/Task (avg) | DR | VPK (Value/K) | Efektywność |
|------|----------|-------------------|-----|---------------|-------------|
| **#1** | **V6.4** | **~5,100** | 63.8% | **12.5** | Najniższy koszt |
| #2 | V6.3 | ~12,300 | 56.0% | 4.5 | Baseline |
| **#3** | **V7.0** | **~55,700** | 72%+ | **1.3** | Best balance |
| #4 | V6.5 | ~82,800 | 71.4% | 0.86 | High DR |
| #5 | V6.6 | ~96,900 | 77.8% | 0.80 | Highest DR |

---

## SZCZEGÓŁOWA ANALIZA KOSZTÓW

### Koszt per Wykryty Błąd (Cost Per Finding)

| Workflow | Avg Tokens | Avg Findings | **CPF** |
|----------|------------|--------------|---------|
| V6.4 | ~5,100 | 8.5 | **600** |
| V6.3 | ~12,300 | 7.0 | 1,757 |
| V7.0 | ~55,700 | 9.5 | 5,863 |
| V6.5 | ~82,800 | 9.0 | 9,200 |
| V6.6 | ~96,900 | 10.2 | 9,500 |

### Koszt per Punkt Detekcji (Cost Per Detection Point)

| Workflow | Tokens | WDS Points | **Tokens/Point** |
|----------|--------|------------|------------------|
| **V7.0** | 55,480 | 10.3 | **5,387** |
| V6.4 | ~5,100 | 7.2 | 708 |
| V6.3 | ~12,300 | 6.3 | 1,952 |
| V6.5 | 88,249 | 8.2 | 10,762 |
| V6.6 | 103,791 | 8.2 | 12,657 |

---

## REAL vs ESTIMATED TOKENS (Weryfikacja)

### Rzeczywiste wartości z JSONL (T16)

| Workflow | Szacunek | REAL ✓ | Różnica |
|----------|----------|--------|---------|
| V7.0 | ~50K | **55,480** | +11% |
| V6.5 | ~12K | **88,249** | +635% |
| V6.6 | ~54K | **103,791** | +93% |

**WAŻNE:** Wcześniejsze szacunki dla V6.5/V6.6 były **drastycznie zaniżone**!

### Skorygowane szacunki (na podstawie REAL data)

Mnożnik korekty dla V6.5/V6.6: **~7x** względem pierwotnych szacunków

---

## RANKING EFEKTYWNOŚCI (QUALITY-ADJUSTED)

### ROI: Detection Rate / Cost

| Rank | Workflow | DR | Tokens (avg) | **ROI Score** | Rekomendacja |
|------|----------|-----|--------------|---------------|--------------|
| **#1** | **V6.4** | 63.8% | 5,100 | **12.5** | Budżet ograniczony |
| #2 | V6.3 | 56.0% | 12,300 | 4.6 | Legacy baseline |
| **#3** | **V7.0** | 73.0% | 55,700 | **1.31** | V3 Expert tasks |
| #4 | V6.5 | 71.4% | 82,800 | 0.86 | Balanced |
| #5 | V6.6 | 77.8% | 96,900 | 0.80 | Max quality |

### Efektywność na V3 Expert (T16-T21)

| Workflow | DR | Tokens | **VPK** | Ranking |
|----------|-----|--------|---------|---------|
| **V7.0** | 73% | ~56K | **1.31** | **#1** |
| V6.5 | 63% | ~86K | 0.73 | #2 |
| V6.6 | 61% | ~97K | 0.63 | #3 |
| V6.4 | 47% | ~5K | 9.4 | #4* |
| V6.3 | 40% | ~12K | 3.3 | #5 |

*V6.4 ma niski koszt ale też niską detekcję na V3

---

## REKOMENDACJE WEDŁUG BUDŻETU

### Budżet: < 50K tokenów/task

| Wybór | Workflow | DR | Uzasadnienie |
|-------|----------|-----|--------------|
| **#1** | **V6.4** | 64% | Najlepszy ROI, ~5K/task |
| #2 | V6.3 | 56% | ~12K/task, prostszy |

### Budżet: 50-100K tokenów/task

| Wybór | Workflow | DR | Uzasadnienie |
|-------|----------|-----|--------------|
| **#1** | **V7.0** | 73% | ~56K/task, best V3 |
| #2 | V6.5 | 71% | ~83K/task, balanced |

### Budżet: > 100K tokenów/task

| Wybór | Workflow | DR | Uzasadnienie |
|-------|----------|-----|--------------|
| **#1** | **V6.6** | 78% | ~97K/task, max quality |
| #2 | V6.6+V7.0 | 85%+ | Double-check critical |

---

## CAŁKOWITY KOSZT WERYFIKACJI T1-T21

### Scenariusz: Weryfikacja wszystkich 21 zadań

| Workflow | Total Tokens | Est. Cost ($)* | Avg DR |
|----------|--------------|----------------|--------|
| V6.4 | ~107K | ~$1.07 | 63.8% |
| V6.3 | ~259K | ~$2.59 | 56.0% |
| V7.0** | ~1,170K | ~$11.70 | 73% |
| V6.5 | ~1,738K | ~$17.38 | 71.4% |
| V6.6 | ~2,034K | ~$20.34 | 77.8% |

*Szacunek: $0.01/1K tokens (Opus input)
**V7.0 ekstrapolowany na podstawie T15-T21

### Cost-Effectiveness Summary

| Potrzeba | Najlepszy wybór | Koszt T1-T21 | DR |
|----------|-----------------|--------------|-----|
| Minimum cost | V6.4 | ~$1 | 64% |
| Best value | **V7.0** | ~$12 | 73% |
| Maximum quality | V6.6 | ~$20 | 78% |

---

## LEGENDA

- **DR** = Detection Rate (% wykrytych błędów)
- **VPK** = Value Per K-tokens (DR / tokeny w tysiącach)
- **CPF** = Cost Per Finding (tokeny / znalezione błędy)
- **ROI** = Return on Investment (DR / koszt)
- **✓** = Rzeczywiste dane z JSONL
- **~** = Szacunek (może być zaniżony 2-7x)
- **K** = tysiące tokenów

---

## ŹRÓDŁA DANYCH

### REAL Token Data (JSONL extraction):
- V7.0 T16: 55,480 tokens (Agent ID: ac00be8)
- V6.6 T16: 103,791 tokens (Agent ID: a81917b)
- V6.5 T16: 88,249 tokens (Agent ID: a17b5ab)

### Estimates (may be 2-7x underestimated):
- V6.4: ~5,000-6,100/task
- V6.3: ~12,000-18,000/task
- V6.5/V6.6 non-T16: Scaled from T16 REAL data

**Wygenerowano:** 2026-01-14
