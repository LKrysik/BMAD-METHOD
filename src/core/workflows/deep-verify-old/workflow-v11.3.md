# Deep Verify v11.3 — Minimal Effective

## Philosophy

V11.2 miała 80% teatru proceduralnego, 20% wartości. V11.3 zachowuje tylko to co działa:

| Zachowane | Wyrzucone |
|-----------|-----------|
| Loss function threshold | Bayesian notation |
| Cytaty z liniami | depth_score |
| Adversarial testing | EVOI calculations |
| Early exit | YAML formatting |
| Proste pytania | Sztywne fazy |
| Predefiniowane wzorce | checked_but_clean |

---

## Setup (2 minuty)

### 1. Threshold

```
Jeśli znajdę CRITICAL finding → REJECT
Ile IMPORTANT wystarczy do NEEDS REVISION? [default: 2]
```

### 2. Bias Check

```
Oczekuję że artefakt jest: [SOUND / FLAWED / UNKNOWN]
Powód: ___
Zmienię zdanie jeśli: ___
```

### 3. Kontekst

```
Artefakt: [nazwa]
Typ: [code / spec / design / protocol]
Stakes: [LOW / MEDIUM / HIGH]
```

---

## Core Questions

Wykonuj pytania aż verdict jasny. Nie musisz robić wszystkich.

### Q1: Czy twierdzenia są matematycznie możliwe?

**Procedura:**
1. Znajdź główne claims (accuracy, performance, guarantees)
2. Dla każdego: zacytuj z numerem linii
3. Sprawdź arytmetykę/logikę
4. Jeśli niemożliwe → CRITICAL

**Przykład:**
```
Claim: "99.9% accuracy" (line 15)
Check: 10,000 chorób × 99.9% = max 10 błędów na 10M przypadków
       Rzadkie choroby mają <100 przypadków w datasecie
       Nie można walidować 99.9% na N<100
Result: CRITICAL — matematycznie niemożliwe
```

**Czerwone flagi:**
- Accuracy claim bez sample size
- "Guarantees" bez dowodu
- "Always/never" w systemach probabilistycznych
- O(1) complexity dla problemu który tego nie pozwala

---

### Q2: Czy sekcje sobie przeczą?

**Procedura:**
1. Przeczytaj sekcję A, zanotuj kluczowe twierdzenia
2. Przeczytaj sekcję B, szukaj sprzeczności
3. Jeśli znajdziesz: zacytuj OBA z liniami
4. Oceń: czy to błąd czy moje niezrozumienie?

**Przykład:**
```
Sekcja 3.3 (line 135): "Deterministic: same symptoms = same diagnosis"
Sekcja 4.1 (line 171): "self.model = incremental_fit(self.model, new_data)"

Sprzeczność: Deterministyczny system nie może się uczyć inkrementalnie.
             Uczenie zmienia model → te same symptomy dają różne diagnozy.
Result: CRITICAL — logiczna sprzeczność
```

**Znane wzorce sprzeczności:**
- Deterministic + Learning
- Stateless + Session-aware
- Real-time + Batch processing (without explanation)
- Encrypted + Searchable (without homomorphic)
- Consistent + Available + Partition-tolerant (CAP violation)

---

### Q3: Co musiałoby być prawdą?

**Procedura:**
1. Weź claim
2. Zapytaj: "Co musiałoby być prawdą w świecie, żeby to działało?"
3. Sprawdź czy to jest prawdą
4. Jeśli nie → finding

**Przykład:**
```
Claim: "FDA Class III + continuous learning" (line 89)

Co musiałoby być prawdą:
  FDA pozwala na zmiany modelu Class III bez re-approval

Czy to prawda:
  Nie. Class III wymaga PMA (Premarket Approval) dla każdej zmiany modelu.
  21 CFR 814.39 wymaga supplement dla zmian wpływających na safety/effectiveness.

Result: CRITICAL — regulacyjna niemożliwość
```

**Typowe "must be true" checks:**
- Regulatory: Czy prawo na to pozwala?
- Physical: Czy fizyka na to pozwala?
- Computational: Czy jest algorytm który to robi?
- Economic: Czy unit economics działają?
- Security: Czy threat model jest realistyczny?

---

### Q4: Czy mogę to złamać?

**Procedura:**
1. Wybierz claim który przetrwał Q1-Q3
2. Aktywnie próbuj go złamać
3. Dokumentuj atak i wynik

**Typy ataków:**
- **Counterexample:** Znajdź konkretny przypadek który łamie claim
- **Edge case:** Co na granicach zakresów?
- **Adversarial input:** Co jeśli input jest złośliwy?
- **Assumption violation:** Co jeśli założenie jest fałszywe?

**Przykład:**
```
Claim: "System handles all medical conditions" (line 201)

Attack: Counterexample
Setup: Pacjent z trzema współistniejącymi rzadkimi chorobami
Execute: Sprawdź czy training data ma takie przypadki
Result: SUCCEEDED — brak przypadków z >2 rzadkimi chorobami

Finding: IMPORTANT — claim zbyt szeroki
```

**Zasada:** Jeśli wszystkie ataki failują zbyt łatwo, atakujesz za słabo.

---

## Early Exit

**STOP natychmiast jeśli:**

| Warunek | Akcja |
|---------|-------|
| CRITICAL finding z wysoką pewnością | → REJECT |
| 2+ CRITICAL findings | → REJECT |
| Q1+Q2 dają jasny obraz | → Pomiń Q3+Q4 |
| 30 minut bez nowych findings | → Verdict z tym co masz |

**Nie rób pełnego workflow dla oczywistych przypadków.**

---

## Known Patterns (skróty)

Jeśli widzisz te wzorce, masz gotowy finding:

### Impossible Claims
| Pattern | Finding |
|---------|---------|
| "99.9% accuracy" bez walidacji | CRITICAL: unverifiable |
| "Guarantees X" bez dowodu | CRITICAL: unsubstantiated |
| "Always/never" w ML | IMPORTANT: probabilistic system |
| "Real-time" bez definicji latency | IMPORTANT: undefined term |

### Known Contradictions
| Pattern | Finding |
|---------|---------|
| Deterministic + Learning | CRITICAL: logical impossibility |
| PFS + Key Recovery | CRITICAL: cryptographic impossibility |
| CAP: C+A+P together | CRITICAL: theoretical impossibility |
| Stateless + Personalization | IMPORTANT: hidden state |

### Regulatory Red Flags
| Pattern | Finding |
|---------|---------|
| FDA Class III + continuous updates | CRITICAL: regulatory impossibility |
| HIPAA + cloud without BAA mention | IMPORTANT: compliance gap |
| GDPR + ML training on user data | IMPORTANT: consent issues |
| SOC2 + self-hosted without audit | IMPORTANT: certification gap |

### Architectural Smells
| Pattern | Finding |
|---------|---------|
| Monolith claiming "microservices benefits" | IMPORTANT: mismatch |
| "Scalable" without horizontal design | IMPORTANT: unsubstantiated |
| "Secure" without threat model | IMPORTANT: undefined security |
| Single point of failure undisclosed | IMPORTANT: hidden risk |

---

## Verdict Rules

```
IF any CRITICAL with confidence > 80%:
    REJECT

ELSE IF CRITICAL_count >= 2:
    REJECT

ELSE IF IMPORTANT_count >= 3:
    NEEDS REVISION

ELSE IF IMPORTANT_count >= 1:
    PASS WITH CAVEATS

ELSE:
    PASS
```

---

## Report (skalowany)

### Level 1: Quick (default) — 5-10 zdań

```
ARTIFACT: [nazwa]
VERDICT: [REJECT/NEEDS REVISION/PASS WITH CAVEATS/PASS]

TOP FINDINGS:
1. [finding] — [severity] — line [X]: "[quote]"
2. [finding] — [severity] — line [Y]: "[quote]"
3. [finding] — [severity] — line [Z]: "[quote]"

BIAS CHECK: Expected [X], found [Y]. [Match/No match].
```

### Level 2: Standard — 1 strona

Level 1 plus:

```
EVIDENCE CHAINS:

Finding 1: [description]
- Claim: "[quote]" (line X)
- Problem: [what's wrong]
- Evidence: [why it's wrong]
- Severity: [CRITICAL/IMPORTANT/MINOR]

Finding 2: ...

WHAT WAS CHECKED:
- [Q1-Q4 which were executed]

WHAT WAS NOT CHECKED:
- [aspects requiring domain expertise]
- [aspects requiring external data]
```

### Level 3: Full Audit — jeśli wymagany

Level 2 plus:

```
FULL TRACE:

Q1 Execution:
- Claims found: [list with lines]
- Checks performed: [list]
- Time spent: [minutes]

Q2 Execution:
- Sections compared: [list]
- Contradictions found: [list]
- Time spent: [minutes]

... (Q3, Q4)

ADVERSARIAL LOG:
- Attack 1: [target, type, result]
- Attack 2: [target, type, result]

DECISION RATIONALE:
- Why this verdict and not adjacent one
```

---

## Checklist Mode (fastest)

Dla prostych artefaktów lub szybkiego przeglądu:

```
ARTIFACT: _______________

[ ] Claims są matematycznie możliwe
    Jeśli nie: _______________

[ ] Sekcje nie przeczą sobie
    Jeśli tak: _______________

[ ] Kluczowe założenia są prawdziwe
    Jeśli nie: _______________

[ ] Nie znalazłem sposobu żeby to złamać
    Jeśli tak: _______________

[ ] Nie ma known patterns (impossible claims, contradictions, red flags)
    Jeśli są: _______________

VERDICT: _______________
```

---

## When to Use What

| Sytuacja | Mode | Czas |
|----------|------|------|
| Szybki review PR | Checklist | 5-10 min |
| Standardowa weryfikacja | Q1-Q4 + Level 1 report | 20-40 min |
| Ważny design doc | Q1-Q4 + Level 2 report | 40-90 min |
| Audit/compliance | Full Q1-Q4 + Level 3 report | 2-4h |
| Oczywisty REJECT | Q1 or Q2 → Early Exit | 10-15 min |

---

## Anti-Patterns (czego NIE robić)

| Nie rób | Zamiast tego |
|---------|--------------|
| YAML formatting dla każdego finding | Prose z cytatami |
| Bayesian notation (P=0.38) | "High confidence" / "uncertain" |
| depth_score calculation | Zadaj sobie: "czy naprawdę sprawdziłem?" |
| Wymuszanie wszystkich 4 pytań | Early exit gdy jasne |
| checked_but_clean listy | Skup się na tym co znalazłeś |
| Redundancja w raporcie | Każdy finding raz, z referencjami |

---

## Meta

### Co v11.3 NIE robi (i dlaczego)

| Nie robi | Powód |
|----------|-------|
| Bayesian updating | Nikt tego nie liczy; intuicja z notacją to teatr |
| Observable depth metrics | Self-reporting z dodatkowymi krokami |
| EVOI method selection | Post-hoc rationalization wyboru |
| Strict phase ordering | Rzeczywistość jest nieliniowa |
| YAML audit trails | 40% overhead, minimalna wartość |

### Kiedy wrócić do v11.2

- Potrzebujesz formalnego audit trail (regulacje)
- Musisz uzasadnić decyzję przed komisją
- Masz czas i zasoby na pełny protokół
- Weryfikujesz coś o ekstremalnie wysokich stakes

### Evolution

```
v11.0: Bayesian theater → REJECT (S=49.93)
v11.1: Honest about limits → INCONCLUSIVE (S=7.60)
v11.2: Observable + decision-theoretic → LIKELY ACCEPT (S=0.65)
v11.3: What actually works → [to be tested]
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    DEEP VERIFY v11.3                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SETUP                                                      │
│  □ Threshold: CRITICAL → REJECT, [N] IMPORTANT → REVISION  │
│  □ Bias: I expect [SOUND/FLAWED], will change if ___       │
│                                                             │
│  CORE QUESTIONS (until verdict clear)                       │
│  Q1: Mathematically possible? (cite with line)              │
│  Q2: Sections contradict? (cite both with lines)            │
│  Q3: What must be true? (check if true)                     │
│  Q4: Can I break it? (construct attack)                     │
│                                                             │
│  EARLY EXIT                                                 │
│  • CRITICAL + high confidence → STOP → REJECT               │
│  • 2+ CRITICAL → STOP → REJECT                              │
│  • Clear picture after Q1+Q2 → skip Q3+Q4                   │
│                                                             │
│  KNOWN PATTERNS (instant findings)                          │
│  • 99.9% accuracy without validation → CRITICAL             │
│  • Deterministic + Learning → CRITICAL                      │
│  • FDA Class III + continuous updates → CRITICAL            │
│  • CAP violation (C+A+P) → CRITICAL                         │
│                                                             │
│  VERDICT                                                    │
│  • Any CRITICAL (>80%) → REJECT                             │
│  • 2+ CRITICAL → REJECT                                     │
│  • 3+ IMPORTANT → NEEDS REVISION                            │
│  • 1-2 IMPORTANT → PASS WITH CAVEATS                        │
│  • Only MINOR → PASS                                        │
│                                                             │
│  REPORT: 5 sentences default, expand if needed              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
