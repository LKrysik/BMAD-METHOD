<!-- GENERATED: 2026-01-06T11:55:36.305Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 94ae6f09) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Implementation Quality

**Type:** Domain list (verify + discover)
**Description:** Code quality, patterns, integration

Use `aeList: 'implementation'` in step frontmatter.

---

## Verify Methods (5)

### #21 Rubber Duck Debugging Evolved

Explain your code to progressively more technical ducks until you find the bug - forces clarity at multiple abstraction levels

**Pattern:** simple → detailed → technical → aha

### #73 Coherence Check

Check: Are definitions stable throughout? Does section A contradict section B? Search for contradictory statements and redefinitions. Document contradictions with quotes from BOTH locations.

**Pattern:** definitions stability → contradiction search → dual-location quotes

### #76 Camouflage Test

Can the new element be hidden in the existing system without detection by an experienced developer? If immediately visible as foreign body - coherence is broken. Test: would code reviewer flag this as doesn't fit?

**Pattern:** insertion → detection test → camouflage score

### #77 Quine's Web

Quine's holism: meaning comes from network of connections. Map how new element connects to existing ones. Does it use the same nodes (abstractions interfaces conventions) as the rest? Count reused vs new abstractions

**Pattern:** connection mapping → node reuse → web integration score

### #80 Transplant Rejection

Will system reject new element? Run through existing gates: linting rules / type checks / test patterns / CI checks. List each gate and PASS/FAIL. Any FAIL without justification = coherence issue

**Pattern:** rejection mechanisms → compatibility test → immune response

---

## Discover Methods (2)

### #39 First Principles Analysis

Strip away assumptions to rebuild from fundamental truths - breakthrough technique for innovation and solving impossible problems

**Pattern:** assumptions → truths → new approach

### #41 Socratic Questioning

Use targeted questions to reveal hidden assumptions and guide discovery - excellent for teaching and self-discovery

**Pattern:** questions → revelations → understanding

