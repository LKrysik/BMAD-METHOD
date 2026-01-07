<!-- GENERATED: 2026-01-07T19:15:10.946Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 54b50899) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Narrative Design

**Type:** Domain list (verify + discover)
**Description:** Story premise, themes, tone, structure verification and exploration

Use `aeList: 'narrative'` in step frontmatter.

---

## Verify Methods (4)

### #70 Scope Integrity Check

Verify artifact addresses FULL scope of ORIGINAL task. Quote original task verbatim (from spec/user request NOT artifact header). List EACH element and classify as ADDRESSED (fully covered) / REDUCED (simplified without decision) / OMITTED (missing). FORCED: Which elements were simplified without explicit user decision? If none found - search harder - agent ALWAYS simplifies.

**Pattern:** original task quote → element-by-element classification → drift detection

### #73 Coherence Check

Check: Are definitions stable throughout? Does section A contradict section B? Search for contradictory statements and redefinitions. Document contradictions with quotes from BOTH locations.

**Pattern:** definitions stability → contradiction search → dual-location quotes

### #74 Grounding Check

List ALL assumptions (explicit AND hidden). For each hidden assumption: MARK as issue. FORCED: Which assumption if false would invalidate >50% of artifact? If none listed would - you missed a critical one. CUI BONO: For each assumption - does it benefit AGENT (easier work = RED FLAG) or OUTCOME (acceptable)?

**Pattern:** assumptions list → hidden vs explicit → critical dependency → CUI BONO

### #75 Falsifiability Check

Provide 3 REALISTIC failure scenarios. Identify edge cases not covered. FORCED: Is any failure scenario MORE LIKELY than success? If not - you provided strawmen. MANDATORY: List 3 elements that are (a) present but UNDERDEVELOPED (b) MISSING but should exist (c) marked FUTURE but CRITICAL for correctness.

**Pattern:** failure scenarios → likelihood check → 3 gaps mandatory

---

## Discover Methods (3)

### #41 Socratic Questioning

Use targeted questions to reveal hidden assumptions and guide discovery - excellent for teaching and self-discovery

**Pattern:** questions → revelations → understanding

### #106 Plato's Cave Inversion

Describe your solution. Now: this is a SHADOW. What is it a shadow of? What TRUE problem are you trying to solve? Does your solution address the shadow or the source?

**Pattern:** solution description → shadow identification → true problem → alignment check

### #27 What If Scenarios

Explore alternative realities to understand possibilities and implications - valuable for contingency planning and exploration

**Pattern:** scenarios → implications → insights

