# Checkpoint Menu - Analiza Systemu

Dokument opisuje jak dziala menu checkpointow w BMAD, co sie stanie gdy uzytkownik wybierze kazda opcje, oraz obserwacje zebrane podczas analizy.

---

## 1. Architektura Systemu (First Principles Analysis #39)

### Fundamentalne komponenty:

```
+------------------+     +--------------------+     +-------------------+
|  checkpoint-     | --> |  checkpoint-       | --> |  workflow.md      |
|  menu.md         |     |  exec.md           |     |  (Advanced        |
|  (Brama)         |     |  (Router)          |     |   Elicitation)    |
+------------------+     +--------------------+     +-------------------+
        |                         |                         |
        v                         v                         v
   Prosty wybor:           Sprawdza inline          Pelny workflow:
   V / D / C               methods w step           P/S/U/B submenu
```

### Obserwacja #1:
System ma architekture **hierarchiczna** - od prostego (3 opcje) do zlozonego (pelny workflow z submenu). Uzytkownik moze zatrzymac sie na dowolnym poziomie.

---

## 2. Co sie dzieje przy kazdej opcji (Explain Reasoning #43)

### [V] Verify - Krok po kroku:

```
1. Uzytkownik wybiera V
2. Menu laduje checkpoint-exec.md
3. Router sprawdza: czy step file ma blok <!-- DEEP_VERIFY -->?
   |
   +-- TAK --> Wykonaj inline methods (2-4 metody)
   |           Pokaz wyniki: PASS/WARN/FAIL
   |           Pytaj: "Want to go deeper? [Y/N]"
   |           |
   |           +-- Y --> Laduj workflow.md z mode=verify
   |           +-- N --> Wroc do checkpoint menu
   |
   +-- NIE --> Od razu laduj workflow.md z mode=verify
```

**Cel Verify:** Sprawdzic prace AGENTA - kompletnosc, spojnosc, jakosc, zgodnosc.

### [D] Discover - Krok po kroku:

```
1. Uzytkownik wybiera ?
2. Menu laduje checkpoint-exec.md
3. Router sprawdza: czy step file ma blok <!-- DEEP_DISCOVER -->?
   |
   +-- TAK --> Wykonaj inline methods jako conversation starters
   |           Zadaj pytania sondujace uzytkownikowi
   |           Pytaj: "Want to explore more? [Y/N]"
   |           |
   |           +-- Y --> Laduj workflow.md z mode=challenge
   |           +-- N --> Wroc do checkpoint menu
   |
   +-- NIE --> Od razu laduj workflow.md z mode=challenge
```

**Cel Discover:** Eksploracja z UZYTKOWNIKIEM - zalozenia, alternatywy, glebsze potrzeby.

### [C] Continue - Krok po kroku:

```
1. Uzytkownik wybiera →
2. Menu NIE laduje checkpoint-exec.md
3. Bezposrednio wykonuje:
   a. Zapisz content do {outputFile}
   b. Zaktualizuj frontmatter (stepsCompleted)
   c. Zaladuj {nextStepFile}
```

**Cel Continue:** Przejdz dalej - tresci jest dobra.

---

## 3. Inline Methods - Szybka sciezka (Feynman Technique #45)

### Wyjasnienie proste:

Kazdy step file moze miec "wbudowane" metody weryfikacji/challenge specyficzne dla swojego kontekstu.

**Przyklad z step-05-core-gameplay.md:**

```markdown
<!-- DEEP_VERIFY -->
71,sanity,Alignment Check,Do ALL pillars support USPs?,USPs -> pillar mapping -> gaps
73,sanity,Coherence Check,Does core loop DELIVER on pillars?,loop-pillar alignment
75,sanity,Falsifiability Check,What if pillars are WRONG?,failure scenarios

<!-- DEEP_DISCOVER -->
62,challenge,Theseus Paradox,Does CORE LOOP address CORE of fun?,core loop -> core fun
109,exploration,Contraposition Inversion,What choices GUARANTEE boring?,boring recipe -> check
```

### Obserwacja #2:
Inline methods sa **targetowane** - nie ogolne. Step o "core gameplay" ma metody sprawdzajace pillary i loop, a nie np. bezpieczenstwo kodu.

### Format parsowania:
```
id,category,method_name,description,output_pattern
^   ^        ^           ^            ^
|   |        |           |            +-- Wzorzec wyjscia
|   |        |           +-- Moze zawierac przecinki!
|   |        +-- Nazwa do wyswietlenia
|   +-- Kategoria (sanity, challenge, exploration, etc.)
+-- Numer metody z methods.csv
```

**Regula:** Split na pierwszych 4 przecinkach tylko.

---

## 4. Pelny Workflow AE (5 Whys Deep Dive #40)

### Dlaczego workflow.md istnieje?
Poniewaz inline methods to tylko 2-4 metody - czasem potrzeba wiecej.

### Dlaczego sa 4 opcje wyboru metod (P/S/U/B)?
Poniewaz rozni uzytkownicy maja rozne potrzeby:
- **P**redefined - znasz swoja role, uzyj jej domyslnych metod
- **S**mart Select - pozwol AI wybrac 5 najlepszych
- **U**ser Lists - masz swoje zapisane zestawy
- **B**rowse - przegladaj wszystkie po kategoriach

### Dlaczego verify i challenge uzywaja tego samego workflow?
Poniewaz roznia sie tylko **zachowaniem**, nie struktura:
- Verify: agent szuka PROBLEMOW w tresci
- Discover: agent zadaje PYTANIA uzytkownikowi

### Obserwacja #3:
System jest **asymetryczny** - Verify analizuje OUTPUT agenta, Discover analizuje INPUT uzytkownika (jego wiedze i zalozenia).

---

## 5. Mapa Stanow Systemu (Tree of Thoughts #11)

```
                    [Checkpoint Menu]
                          |
          +---------------+---------------+
          |               |               |
         [V]             [D]             [C]
          |               |               |
    +-----+-----+   +-----+-----+         |
    |           |   |           |         v
  inline?     inline?       inline?   [NEXT STEP]
    |           |           |
   TAK         TAK         NIE
    |           |           |
  execute    execute      load
  methods    methods    workflow
    |           |           |
  deeper?    explore?       |
    |           |           |
  Y/N        Y/N           |
    |           |           |
    +-----+-----+-----------+
          |
    [workflow.md]
          |
    P/S/U/B submenu
          |
    execute methods
          |
    results + menu
          |
    continue/more/back
          |
    [Return to Checkpoint]
```

### Obserwacja #4:
Kazda sciezka (V lub ?) zawsze **wraca do checkpoint menu** po zakonczeniu. To petla, nie linia.

---

## 6. Roznice miedzy trybami (Comparative Analysis Matrix #33)

| Aspekt | V (Verify) | D (Discover) |
|--------|------------|---------------|
| **Cel** | Znalezc problemy | Znalezc insights |
| **Podmiot** | Tresc agenta | Wiedza uzytkownika |
| **Rola agenta** | Krytyk/Audytor | Facilitator/Coach |
| **Output** | Findings (CRITICAL/IMPORTANT/MINOR) | Pytania sondujace |
| **Interakcja** | Agent mowi, user akceptuje | Agent pyta, user odpowiada |
| **Po zakonczeniu** | Propozycje poprawek | Nowe zrozumienie |

### Obserwacja #5:
Verify jest **jednostronny** (agent -> user), Discover jest **dialogowy** (agent <-> user).

---

## 7. Role aeRole i ich domyslne metody (Explain Reasoning #43)

Kazdy step moze deklarowac `aeRole` w frontmatter:

```yaml
aeRole: 'core-design'  # lub: technical, planning, implementation, discovery, creative, quality
```

### Mapowanie aeRole -> metody:

| aeRole | Domyslne metody | Focus |
|--------|-----------------|-------|
| technical | 20, 70, 74, 117, 76 | Architektura, spojnosc |
| planning | 33, 34, 37, 71, 73 | Ryzyko, alignment, trade-offs |
| implementation | 21, 73, 80, 76, 77 | Jakosc kodu, wzorce |
| discovery | 39, 40, 41, 45, 1 | First principles, stakeholders |
| creative | 25, 27, 28, 30, 57 | SCAMPER, what-if, surprise |
| quality | 51, 54, 70, 74, 75 | Anti-bias, weryfikacja |

### Obserwacja #6:
aeRole to **hint dla Smart Select** - jesli uzytkownik wybierze [P]redefined, dostanie te metody automatycznie.

---

## 8. Protokol powrotu (Socratic Questioning #41)

### Pytanie: Co sie dzieje po zakonczeniu V lub C?

**Odpowiedz:**
1. Agent prezentuje wyniki/insights
2. Pyta: "Apply changes? / Continue exploring? / Return to menu?"
3. Obsluguje odpowiedz
4. **Wraca do checkpoint menu** (laduje checkpoint-menu.md)

### Pytanie: Dlaczego wraca do menu zamiast isc dalej?

**Odpowiedz:**
Poniewaz user moze chciec:
- Zrobic kolejne V po ?
- Zrobic ? po V
- Dopiero teraz byc gotowy na → (Continue)

### Obserwacja #7:
System **nie zmusza** do liniowego przejscia. Mozna iterowac V/D dowolnie przed Continue.

---

## 9. Fallback behaviors (First Principles Analysis #39)

### Gdy brak inline methods:
- Pomijany jest "quick phase"
- Od razu ladowany workflow.md

### Gdy brak aeRole w frontmatter:
- Default: `aeRole: 'general'`

### Gdy method ID nie istnieje:
- Log WARNING
- Skip method
- Continue with remaining

### Gdy primary file missing:
- Fall back to category browse

### Gdy mode unrecognized:
- Default to 'verify'
- Log WARNING

### Obserwacja #8:
System jest **odporny na braki** - zawsze ma fallback, nigdy nie crash'uje.

---

## 10. Party Mode - osobny system (Scope Integrity Check #70)

### Czego NIE MA w checkpoint menu:
- Party Mode (multi-agent discussions)
- Dostepny przez `/party` command
- NIE jest czescia V/D/C flow

### Obserwacja #9:
Swiadoma decyzja projektowa - menu jest **proste** (3 opcje), zlozonosc (Party Mode) jest dostepna osobno.

---

## 11. Czego NIE MOZE zweryfikowac agent (Kernel Paradox #68)

Menu zawiera sekcje "What Only YOU Can Verify":

1. Czy to pasuje do twojej faktycznej wizji i intencji?
2. Czy terminologia jest poprawna dla twojej branzy?
3. Czy sa ograniczenia, o ktorych agent nie wie?

### Obserwacja #10:
System **przyznaje swoje limity** - agent nie moze weryfikowac rzeczy, ktore sa w glowie uzytkownika.

---

## 12. Podsumowanie przeplywy (Feynman Technique #45)

### Wersja "na zdrowy rozsadek":

1. **Checkpoint menu** pojawia sie gdy step skonczyl prace
2. Masz 3 wybory:
   - **V** - sprawdz czy agent dobrze zrobil
   - **D** - zbadaj czy TY dobrze myslisz
   - **C** - wszystko OK, idz dalej
3. V i ? moga byc "szybkie" (inline methods) lub "glebokie" (workflow)
4. Po V/D zawsze wracasz do menu
5. → konczy checkpoint i laduje nastepny step

---

## 13. Kluczowe obserwacje zebrane

| # | Obserwacja | Zrodlo metody |
|---|------------|---------------|
| 1 | Architektura hierarchiczna (proste -> zlozone) | First Principles #39 |
| 2 | Inline methods sa targetowane per-step | Feynman #45 |
| 3 | Verify = output agenta, Discover = input usera | 5 Whys #40 |
| 4 | Kazda sciezka V/D wraca do menu (petla) | Tree of Thoughts #11 |
| 5 | Verify jednostronny, Discover dialogowy | Comparative Analysis #33 |
| 6 | aeRole to hint dla Smart Select | Explain Reasoning #43 |
| 7 | Mozna iterowac V/D przed Continue | Socratic #41 |
| 8 | System odporny na braki (fallbacks) | First Principles #39 |
| 9 | Party Mode swiadomie wydzielony | Scope Integrity #70 |
| 10 | Agent przyznaje limity | Kernel Paradox #68 |

---

## 14. Format menu - V/D/C

**Finalny format:**

```
[V] Verify | [D] Discover | [C] Continue
```

**Uzasadnienie:**
- **V** = Verify - sprawdzenie pracy agenta
- **D** = Discover - eksploracja z uzytkownikiem (lepsza nazwa niz "Challenge")
- **C** = Continue - przejscie dalej

**Status:** Wdrozone w:
- checkpoint-menu.md
- checkpoint-exec.md
- step-template.md
- 4 przykladowe step files
- DEEP_DISCOVER przemianowane na DEEP_DISCOVER

**Do zrobienia:** ~30+ pozostalych step files wymaga aktualizacji z A/P/C na V/D/C

---

## 15. Pliki zrodlowe (v5.0)

| Plik | Rola |
|------|------|
| `src/core/menus/step-checkpoint/checkpoint-menu.md` | Brama - 3 opcje V/D/C |
| `src/core/menus/step-checkpoint/checkpoint-exec.md` | Router - obsluga V/D |
| `src/core/workflows/deep-verify/quick_mode.md` | Quick verify (inline methods) |
| `src/core/workflows/deep-verify/workflow.md` | Deep verify workflow |
| `src/core/workflows/deep-discover/quick_mode.md` | Quick discover (inline methods) |
| `src/core/workflows/deep-discover/workflow.md` | Deep discover workflow |
| `src/core/workflows/advanced-elicitation/data/methods.csv` | 118 metod |
| Step files (`steps/*.md`) | Inline methods (DEEP_VERIFY, DEEP_DISCOVER) |

---

*Dokument wygenerowany przez analize systemu uzywajac 30 metod poznawczych z Advanced Elicitation.*
