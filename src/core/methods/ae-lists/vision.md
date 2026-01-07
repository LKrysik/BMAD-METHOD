<!-- GENERATED: 2026-01-07T19:15:10.990Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 54b50899) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Vision & Goals

**Type:** Domain list (verify + discover)
**Description:** Product vision, goals, success metrics

Use `aeList: 'vision'` in step frontmatter.

---

## Verify Methods (3)

### #70 Scope Integrity Check

Verify artifact addresses FULL scope of ORIGINAL task. Quote original task verbatim (from spec/user request NOT artifact header). List EACH element and classify as ADDRESSED (fully covered) / REDUCED (simplified without decision) / OMITTED (missing). FORCED: Which elements were simplified without explicit user decision? If none found - search harder - agent ALWAYS simplifies.

**Pattern:** original task quote → element-by-element classification → drift detection

### #71 Alignment Check

Verify artifact realizes its STATED goal. Quote the stated goal. List how artifact addresses EACH part of the goal. List parts of goal NOT addressed. Provide specific evidence with quotes and line numbers.

**Pattern:** goal quote → coverage per part → gaps with evidence

### #74 Grounding Check

List ALL assumptions (explicit AND hidden). For each hidden assumption: MARK as issue. FORCED: Which assumption if false would invalidate >50% of artifact? If none listed would - you missed a critical one. CUI BONO: For each assumption - does it benefit AGENT (easier work = RED FLAG) or OUTCOME (acceptable)?

**Pattern:** assumptions list → hidden vs explicit → critical dependency → CUI BONO

---

## Discover Methods (3)

### #39 First Principles Analysis

Strip away assumptions to rebuild from fundamental truths - breakthrough technique for innovation and solving impossible problems

**Pattern:** assumptions → truths → new approach

### #41 Socratic Questioning

Use targeted questions to reveal hidden assumptions and guide discovery - excellent for teaching and self-discovery

**Pattern:** questions → revelations → understanding

### #106 Plato's Cave Inversion

Describe your solution. Now: this is a SHADOW. What is it a shadow of? What TRUE problem are you trying to solve? Does your solution address the shadow or the source?

**Pattern:** solution description → shadow identification → true problem → alignment check

