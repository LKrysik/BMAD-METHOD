<!-- GENERATED: 2026-01-07T19:15:10.862Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 54b50899) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Sanity Methods

6 methods in the Sanity category.

---

## #70 Scope Integrity Check [V]

Verify artifact addresses FULL scope of ORIGINAL task. Quote original task verbatim (from spec/user request NOT artifact header). List EACH element and classify as ADDRESSED (fully covered) / REDUCED (simplified without decision) / OMITTED (missing). FORCED: Which elements were simplified without explicit user decision? If none found - search harder - agent ALWAYS simplifies.

**Pattern:** original task quote → element-by-element classification → drift detection

---

## #71 Alignment Check [V]

Verify artifact realizes its STATED goal. Quote the stated goal. List how artifact addresses EACH part of the goal. List parts of goal NOT addressed. Provide specific evidence with quotes and line numbers.

**Pattern:** goal quote → coverage per part → gaps with evidence

---

## #72 Closure Check

Search for incomplete markers: TODO / TBD / PLACEHOLDER / 'to be defined' / 'see X' / '...' / '[insert]'. Verify: Can someone unfamiliar use this without asking questions? List all incomplete markers with line numbers.

**Pattern:** markers scan → completeness check → line numbers

---

## #73 Coherence Check [V]

Check: Are definitions stable throughout? Does section A contradict section B? Search for contradictory statements and redefinitions. Document contradictions with quotes from BOTH locations.

**Pattern:** definitions stability → contradiction search → dual-location quotes

---

## #74 Grounding Check [V]

List ALL assumptions (explicit AND hidden). For each hidden assumption: MARK as issue. FORCED: Which assumption if false would invalidate >50% of artifact? If none listed would - you missed a critical one. CUI BONO: For each assumption - does it benefit AGENT (easier work = RED FLAG) or OUTCOME (acceptable)?

**Pattern:** assumptions list → hidden vs explicit → critical dependency → CUI BONO

---

## #75 Falsifiability Check [V]

Provide 3 REALISTIC failure scenarios. Identify edge cases not covered. FORCED: Is any failure scenario MORE LIKELY than success? If not - you provided strawmen. MANDATORY: List 3 elements that are (a) present but UNDERDEVELOPED (b) MISSING but should exist (c) marked FUTURE but CRITICAL for correctness.

**Pattern:** failure scenarios → likelihood check → 3 gaps mandatory

---

