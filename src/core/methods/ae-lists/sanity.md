<!-- GENERATED: 2026-01-07T19:15:10.917Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 54b50899) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Sanity Checks

**Type:** Verify-only list
**Description:** Essential sanity checks for fast verification - scope, alignment, coherence
**Methods:** 4

Use `aeList: 'sanity'` in step frontmatter.

---

## #70 Scope Integrity Check

Verify artifact addresses FULL scope of ORIGINAL task. Quote original task verbatim (from spec/user request NOT artifact header). List EACH element and classify as ADDRESSED (fully covered) / REDUCED (simplified without decision) / OMITTED (missing). FORCED: Which elements were simplified without explicit user decision? If none found - search harder - agent ALWAYS simplifies.

**Pattern:** original task quote → element-by-element classification → drift detection

---

## #71 Alignment Check

Verify artifact realizes its STATED goal. Quote the stated goal. List how artifact addresses EACH part of the goal. List parts of goal NOT addressed. Provide specific evidence with quotes and line numbers.

**Pattern:** goal quote → coverage per part → gaps with evidence

---

## #73 Coherence Check

Check: Are definitions stable throughout? Does section A contradict section B? Search for contradictory statements and redefinitions. Document contradictions with quotes from BOTH locations.

**Pattern:** definitions stability → contradiction search → dual-location quotes

---

## #74 Grounding Check

List ALL assumptions (explicit AND hidden). For each hidden assumption: MARK as issue. FORCED: Which assumption if false would invalidate >50% of artifact? If none listed would - you missed a critical one. CUI BONO: For each assumption - does it benefit AGENT (easier work = RED FLAG) or OUTCOME (acceptable)?

**Pattern:** assumptions list → hidden vs explicit → critical dependency → CUI BONO

---

