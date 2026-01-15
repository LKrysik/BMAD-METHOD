# Workflow Anti-Patterns: Czego NIE Robić

> **Cel:** Katalog błędów wykrytych empirycznie. Każdy pattern zweryfikowany danymi.
> **Źródło:** Analiza V6.3→V8.0, eksperymenty T1-T21
> **Metody użyte:** #72, #80, #108, #119, #122, #128, #130, #133, #150

---

## AP-1: Simplification Without Validation

**Pattern:** Usuwanie "redundantnych" elementów bez weryfikacji empirycznej.

**Przykład:** V8.0 usunęło Self-Check (#113, #131, #112) → ASSUME detection 100%→0%

**Metoda #72 (5 Whys):**
```
Dlaczego V8.0 gorsze? → Brak ASSUME detection
Dlaczego brak? → Usunięto Self-Check
Dlaczego usunięto? → Uznano za "merged"
Dlaczego uznano? → Nie sprawdzono empirycznie
Dlaczego nie sprawdzono? → Zaufano teoretycznej analizie
```

**Root cause:** Decyzje oparte na teorii bez walidacji danymi.

**Zasada:** NIGDY nie usuwaj elementu bez A/B testu na ground truth.

---

## AP-2: Aesthetic Over Function

**Pattern:** Preferowanie eleganckiego designu nad skuteczność.

**Przykład:** V8.0 "one file simplicity" → +14% token overhead

**Metoda #130 (Aesthetic Seduction):**
| Element | Wygląda Dobrze | Działa Dobrze |
|---------|----------------|---------------|
| One file | TAK | NIE (cache overhead) |
| 4 phases | TAK | NIE (brak checkpoints) |
| No learning | TAK (honest) | NEUTRALNE |

**Zasada:** Mierz WYNIKI, nie elegancję architektury.

---

## AP-3: Patch-Driven Development

**Pattern:** Dodawanie łatek na konkretne problemy zamiast rozwiązań systemowych.

**Przykład:** V6.6 dodało "Phase 2.7 Conflict Analysis" → +18% cost, 0% improvement

**Metoda #128 (Theseus Paradox):**
```
Czy łatka adresuje RDZEŃ problemu?
Phase 2.7 → Adresuje symptom (konflikty), nie przyczynę (słaba selekcja metod)
```

**Zasada:** Przed łatką sprawdź czy problem jest w PROCESIE czy w METODZIE.

---

## AP-4: Claims Without Evidence

**Pattern:** Twierdzenia "evidence-based" bez pokazania evidence.

**Przykład:** V8.0 twierdzi "15-method analysis proved X" ale nie pokazuje analizy.

**Metoda #119 (Ground Truth Demand):**
| Claim V8.0 | Evidence Provided | Verified? |
|------------|-------------------|-----------|
| "triggers redundant" | "overlaps with RELEVANCE" | NIE |
| "weights unusable" | "agent stateless" | TAK |
| "+18% cost, 0% improvement" | brak danych | NIE |

**Zasada:** Każdy claim musi mieć LINKOWANY dowód lub być oznaczony jako hipoteza.

---

## AP-5: Removing Safety Nets

**Pattern:** Usuwanie mechanizmów które wydają się nieużywane.

**Przykład:** V8.0 usunęło HALT points → agent nie zatrzymuje się na problemach.

**Metoda #122 (Sorites - co jest krytyczne):**
```
Usuń HALT → Agent leci dalej mimo problemów
Usuń Self-Check → Brak wykrywania założeń
Usuń Layer 4 → Brak eskalacji

Każde usunięcie = utrata safety net
```

**Zasada:** "Nieużywane" ≠ "niepotrzebne". Safety nets działają przez ISTNIENIE.

---

## AP-6: Linear vs Checkpoint Architecture

**Pattern:** Zastępowanie architektury z checkpoints linearnym flow.

**Przykład:** V7.0 (4 layers + HALT) vs V8.0 (4 phases linear)

**Metoda #80 (Inversion):**
```
Co GWARANTUJE że workflow pominie błędy?
→ Brak punktów zatrzymania
→ Brak wymuszonych decyzji
→ Ciągły flow bez weryfikacji
```

**Zasada:** Więcej checkpoints = więcej szans na wykrycie. Linearność to wróg detekcji.

---

## AP-7: Trusting Meta-Claims

**Pattern:** Akceptowanie twierdzeń na meta-poziomie bez weryfikacji.

**Przykład:** Moja analiza zaakceptowała "V8.0 is simpler therefore better"

**Metoda #133 (Abilene Paradox):**
```
Czy problem z V7.0 RZECZYWIŚCIE istniał?
- Learning loop niemożliwy → TAK, ale nie wpływał na wyniki
- Layer 3 niefunkcjonalny → TAK, ale templates pomagały
- Złożoność → TAK, ale to FEATURE nie BUG
```

**Zasada:** "X jest problemem" wymaga dowodu że X WPŁYWA na wyniki.

---

## AP-8: Optimization Before Measurement

**Pattern:** Optymalizacja bez baseline measurement.

**Przykład:** V8.0 "zoptymalizowano" bez mierzenia co działało w V7.0.

**Metoda #150 (Learning Extraction):**
```
Przed V8.0 zmierzono:
- Token usage: ✗
- Per-method effectiveness: ✗
- Per-check detection rate: ✗
- Cost per finding: ✗
```

**Zasada:** Nie optymalizuj czego nie zmierzyłeś.

---

## AP-9: Ignoring Empirical Winners

**Pattern:** Ignorowanie elementów które empirycznie działają.

**Przykład:** V7.0 Self-Check dawał 100% ASSUME detection → usunięty w V8.0

**Metoda #108 (Coincidentia - synteza przeciwieństw):**
```
Self-Check wygląda na "overhead" ALE daje 100% na kategorii.
Sprzeczność: overhead vs effectiveness
Synteza: overhead JEST ceną za skuteczność
```

**Zasada:** Element który działa > element który wygląda dobrze.

---

## AP-10: Single-Metric Optimization

**Pattern:** Optymalizacja jednej metryki kosztem innych.

**Przykład:** V8.0 optymalizowało "simplicity" kosztem detection rate.

**Metoda #104 (Heisenberg Trade-off):**
```
Nie można mieć:
- Minimum complexity
- Maximum detection
- Minimum cost

V8.0 wybrało: min complexity → straciło detection
V7.0 wybrało: balanced → lepsze wyniki
```

**Zasada:** Optymalizuj WEKTOR (cost, detection, simplicity), nie skalar.

---

## Checklisty Przed Zmianą

### Przed Usunięciem Elementu
- [ ] Zmierzono wpływ elementu na detection rate?
- [ ] A/B test na ground truth?
- [ ] Element ma 0% contribution? (nie "wydaje się niepotrzebny")
- [ ] Safety net czy aktywny komponent?

### Przed Dodaniem Elementu
- [ ] Problem jest w PROCESIE czy METODZIE?
- [ ] Czy to łatka czy rozwiązanie systemowe?
- [ ] Zmierzono baseline przed?
- [ ] Zdefiniowano success metric?

### Przed Simplifikacją
- [ ] Złożoność to BUG czy FEATURE?
- [ ] Checkpoints zachowane?
- [ ] Safety nets zachowane?
- [ ] Empiryczna walidacja?

---

---

## AP-11: Expected/Estimated Values

**Pattern:** Akceptowanie "expected" lub "estimated" zamiast zmierzonych wartości.

**Przykład:** "V8.1 Expected DR: ~72%" - to spekulacja, nie fakt.

**Metoda #119 (Ground Truth Demand):**
```
"Expected" = HIPOTEZA
"Measured" = FAKT

Hipotezy nie są akceptowalne jako podstawa decyzji.
```

**Zasada:** NIGDY nie akceptuj "expected", "estimated", "should be", "~". Tylko zmierzone dane.

---

## Quick Reference

| Anti-Pattern | Symptom | Rozwiązanie |
|--------------|---------|-------------|
| AP-1 | "Usuńmy to, wydaje się zbędne" | A/B test najpierw |
| AP-2 | "To wygląda elegancko" | Mierz wyniki |
| AP-3 | "Dodajmy krok dla tego problemu" | Sprawdź root cause |
| AP-4 | "Analiza pokazała że..." | Pokaż dane |
| AP-5 | "To się nie wykonuje" | Safety net? |
| AP-6 | "Uprośćmy flow" | Zachowaj checkpoints |
| AP-7 | "To jest prostsze więc lepsze" | Weryfikuj empirycznie |
| AP-8 | "Zoptymalizujmy X" | Zmierz najpierw |
| AP-9 | "To wygląda na overhead" | Sprawdź effectiveness |
| AP-10 | "Minimalizujmy X" | Optymalizuj wektor |
| **AP-11** | **"Expected/Should be ~X"** | **Tylko measured** |

---

**Wersja:** 1.0
**Data:** 2026-01-14
**Źródło:** V7.0 vs V8.0 comparison, T15-T21 experiments
