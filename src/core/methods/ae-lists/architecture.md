<!-- GENERATED: 2026-01-07T19:15:10.951Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 54b50899) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Technical Architecture

**Type:** Domain list (verify + discover)
**Description:** Technical decisions, patterns, system design

Use `aeList: 'architecture'` in step frontmatter.

---

## Verify Methods (5)

### #20 Architecture Decision Records

Multiple architect personas propose and debate architectural choices with explicit trade-offs - ensures decisions are well-reasoned and documented

**Pattern:** options → trade-offs → decision → rationale

### #72 Closure Check

Search for incomplete markers: TODO / TBD / PLACEHOLDER / 'to be defined' / 'see X' / '...' / '[insert]'. Verify: Can someone unfamiliar use this without asking questions? List all incomplete markers with line numbers.

**Pattern:** markers scan → completeness check → line numbers

### #73 Coherence Check

Check: Are definitions stable throughout? Does section A contradict section B? Search for contradictory statements and redefinitions. Document contradictions with quotes from BOTH locations.

**Pattern:** definitions stability → contradiction search → dual-location quotes

### #74 Grounding Check

List ALL assumptions (explicit AND hidden). For each hidden assumption: MARK as issue. FORCED: Which assumption if false would invalidate >50% of artifact? If none listed would - you missed a critical one. CUI BONO: For each assumption - does it benefit AGENT (easier work = RED FLAG) or OUTCOME (acceptable)?

**Pattern:** assumptions list → hidden vs explicit → critical dependency → CUI BONO

### #117 Fractal Zoom

Check solution at 3 scales: (1) MICRO — one code fragment/element (2) MESO — module/component (3) MACRO — entire system. Does it look consistent at each scale? Self-similarity = good design

**Pattern:** micro check → meso check → macro check → self-similarity score

---

## Discover Methods (3)

### #39 First Principles Analysis

Strip away assumptions to rebuild from fundamental truths - breakthrough technique for innovation and solving impossible problems

**Pattern:** assumptions → truths → new approach

### #110 Reductio Attack

Assume your solution is the WRONG choice. Build argument why it's the worst possible approach. If argument is convincing — you have a problem. If you can't build it — good sign

**Pattern:** assume solution is wrong → build attack argument → evaluate attack strength

### #27 What If Scenarios

Explore alternative realities to understand possibilities and implications - valuable for contingency planning and exploration

**Pattern:** scenarios → implications → insights

