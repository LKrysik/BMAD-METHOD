# Zasady Działania Procesu Weryfikacji v9.x (Heuristic-Driven Workflow)

## Filozofia Główna: Od Statycznej Listy do Inteligentnej Analizy

Nowy proces weryfikacji porzuca ideę statycznego, jednego dla wszystkich przepływu pracy. Jego fundamentalnym założeniem jest dwufazowe podejście, które naśladuje pracę eksperta: **najpierw głęboko zrozum, a dopiero potem precyzyjnie weryfikuj**.

Celem jest maksymalizacja efektywności poprzez skupienie najpotężniejszych (i najdroższych) metod weryfikacyjnych tylko na tych obszarach, które zostały zidentyfikowane jako najbardziej ryzykowne.

---

## Faza 1: Heuristic Profiling (Głębokie Zrozumienie)

Ta faza **nie szuka błędów**. Jej jedynym celem jest zbudowanie wielowymiarowej, dogłębnej "mapy" analizowanego artefaktu. Jest to silnik heurystyczny całego procesu.

### Jak to działa?
Proces aplikuje na artefakcie dedykowany zestaw **Metod Heurystycznych**. Metody te są zaprojektowane do analizy z różnych perspektyw:
-   **Cel i Esencja:** Jaki jest fundamentalny cel i logika artefaktu? (`#71`, `#107`)
-   **Struktura i Logika:** Jaka jest struktura rozumowania i spójność języka? (`#116`, `#100`)
-   **Założenia i Ryzyka:** Jakie są ukryte założenia i najbardziej prawdopodobne scenariusze porażki? (`#78`, `#61`)

### Co jest wynikiem?
Wynikiem tej fazy jest **"Profil Heurystyczny"**. To nie jest prosta lista, ale bogaty dokument, który zawiera:
1.  **Esencję Artefaktu:** Jego fundamentalną prawdę, cel i kluczowe kompromisy.
2.  **Mapę Logiki i Pojęć:** Zależności między twierdzeniami i definicje kluczowych terminów.
3.  **Model Zagrożeń:** Listę ukrytych założeń, potencjalnych scenariuszy awarii i "powierzchnię ataku".
4.  **Wektory Weryfikacji:** Precyzyjne wskazówki dla następnej fazy, np. `Wektor Teoretyczny` (sygnalizujący potrzebę sprawdzenia zgodności z twierdzeniami naukowymi) czy `Wektor Odporności` (wskazujący najbardziej kruche elementy).

---

## Faza 2: Adaptive Verification (Dynamiczna Weryfikacja)

Ta faza jest "chirurgicznym" ramieniem procesu. Jej celem jest **znalezienie krytycznych błędów** w maksymalnie efektywny sposób, na podstawie mapy dostarczonej przez Fazę 1.

### Jak to działa?
Proces analizuje **"Profil Heurystyczny"**, a w szczególności **"Wektory Weryfikacji"**, aby **dynamicznie dobrać** mały (np. 3-5), ale niezwykle silny podzbiór **Metod Weryfikacyjnych**.

**To jest serce mechanizmu:**
-   Jeśli `Wektor Teoretyczny` w profilu jest aktywny, proces automatycznie wybiera metody takie jak `#153 (Theoretical Impossibility Check)`.
-   Jeśli `Wektor Odporności` wskazuje na kruche założenia, proces sięga po `#130 (Assumption Torture)`.
-   Jeśli `Wektor Bezpieczeństwa` jest aktywny, do gry wchodzą `#34 (Security Audit Personas)` i `#21 (Red Team vs Blue Team)`.

### Co jest wynikiem?
Wynikiem jest finalny raport weryfikacyjny, który zawiera listę znalezionych problemów. Dzięki precyzyjnemu naprowadzeniu z Fazy 1, prawdopodobieństwo znalezienia istotnych, głębokich błędów jest znacznie wyższe niż w przypadku losowego lub statycznego aplikowania metod.

---

## Podsumowanie Korzyści

Ten heurystyczny model zapewnia:
-   **Precyzję:** Metody weryfikacyjne nie są stosowane "na ślepo", lecz są precyzyjnie celowane w najbardziej obiecujące obszary.
-   **Efektywność:** Oszczędza czas i zasoby, unikając stosowania drogich metod tam, gdzie nie są one potrzebne.
-   **Głębię Analizy:** Wymusza dogłębne zrozumienie artefaktu, zanim rozpocznie się jego właściwa krytyka, co prowadzi do odkrywania bardziej fundamentalnych problemów.
