<!-- GENERATED: 2026-01-06T11:55:36.287Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 94ae6f09) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Deep Coherence

**Type:** Verify-only list
**Description:** Comprehensive coherence verification for integration work
**Methods:** 7

Use `aeList: 'coherence-deep'` in step frontmatter.

---

## #76 Camouflage Test

Can the new element be hidden in the existing system without detection by an experienced developer? If immediately visible as foreign body - coherence is broken. Test: would code reviewer flag this as doesn't fit?

**Pattern:** insertion → detection test → camouflage score

---

## #77 Quine's Web

Quine's holism: meaning comes from network of connections. Map how new element connects to existing ones. Does it use the same nodes (abstractions interfaces conventions) as the rest? Count reused vs new abstractions

**Pattern:** connection mapping → node reuse → web integration score

---

## #78 Least Surprise Principle

Show new element to someone knowing only the rest of system. List 5 things that would SURPRISE them. Each surprise = potential coherence violation. FORCED: if <3 surprises found - look harder

**Pattern:** element presentation → surprise list → surprise justification

---

## #79 DNA Inheritance

Identify system genes: (1) naming conventions (2) error handling patterns (3) logging style (4) file structure (5) import organization (6) comment style (7) test patterns. Score: how many does new element inherit vs mutate?

**Pattern:** genes extraction → inheritance check → mutation list

---

## #80 Transplant Rejection

Will system reject new element? Run through existing gates: linting rules / type checks / test patterns / CI checks. List each gate and PASS/FAIL. Any FAIL without justification = coherence issue

**Pattern:** rejection mechanisms → compatibility test → immune response

---

## #84 Assumption Inheritance

List assumptions existing system relies on (explicit in docs + hidden in code). Does new element SHARE or CONTRADICT them? Each contradiction requires explicit migration/compatibility handling

**Pattern:** system assumptions → element assumptions → conflict detection

---

## #85 Compression Delta

Count NEW concepts someone must learn to understand new element IF they already know the system. List each: new abstraction / new pattern / new convention / new dependency. Target: ≤2 new concepts. More = low coherence

**Pattern:** existing concepts → new concepts required → compression ratio

---

