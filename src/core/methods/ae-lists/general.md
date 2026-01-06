<!-- GENERATED: 2026-01-06T11:55:36.324Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 94ae6f09) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# General Purpose

**Type:** Domain list (verify + discover)
**Description:** Default list for steps without specific domain

Use `aeList: 'general'` in step frontmatter.

---

## Verify Methods (3)

### #70 Scope Integrity Check

Verify artifact addresses FULL scope of ORIGINAL task. Quote original task verbatim (from spec/user request NOT artifact header). List EACH element and classify as ADDRESSED (fully covered) / REDUCED (simplified without decision) / OMITTED (missing). FORCED: Which elements were simplified without explicit user decision? If none found - search harder - agent ALWAYS simplifies.

**Pattern:** original task quote → element-by-element classification → drift detection

### #73 Coherence Check

Check: Are definitions stable throughout? Does section A contradict section B? Search for contradictory statements and redefinitions. Document contradictions with quotes from BOTH locations.

**Pattern:** definitions stability → contradiction search → dual-location quotes

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

### #40 5 Whys Deep Dive

Repeatedly ask why to drill down to root causes - simple but powerful for understanding failures

**Pattern:** why chain → root cause → solution

