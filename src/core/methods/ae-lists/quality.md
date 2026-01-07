<!-- GENERATED: 2026-01-07T19:15:10.919Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 54b50899) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Quality & Anti-Bias

**Type:** Verify-only list
**Description:** Anti-bias methods to catch self-deception and shortcuts
**Methods:** 5

Use `aeList: 'quality'` in step frontmatter.

---

## #51 Liar's Trap

Demand agent lists 3 ways it could deceive you in its current response. For each way listed: Is it currently doing this? If it cannot find 3 genuine deception vectors it is not being honest about its limitations

**Pattern:** deception methods → self-examination → revealed blindspots

---

## #54 CUI BONO Test

For every decision and assumption: Who benefits? If it benefits the AGENT (easier work) - RED FLAG requiring justification. If it benefits the OUTCOME - acceptable

**Pattern:** decisions → beneficiary analysis → justification

---

## #70 Scope Integrity Check

Verify artifact addresses FULL scope of ORIGINAL task. Quote original task verbatim (from spec/user request NOT artifact header). List EACH element and classify as ADDRESSED (fully covered) / REDUCED (simplified without decision) / OMITTED (missing). FORCED: Which elements were simplified without explicit user decision? If none found - search harder - agent ALWAYS simplifies.

**Pattern:** original task quote → element-by-element classification → drift detection

---

## #74 Grounding Check

List ALL assumptions (explicit AND hidden). For each hidden assumption: MARK as issue. FORCED: Which assumption if false would invalidate >50% of artifact? If none listed would - you missed a critical one. CUI BONO: For each assumption - does it benefit AGENT (easier work = RED FLAG) or OUTCOME (acceptable)?

**Pattern:** assumptions list → hidden vs explicit → critical dependency → CUI BONO

---

## #75 Falsifiability Check

Provide 3 REALISTIC failure scenarios. Identify edge cases not covered. FORCED: Is any failure scenario MORE LIKELY than success? If not - you provided strawmen. MANDATORY: List 3 elements that are (a) present but UNDERDEVELOPED (b) MISSING but should exist (c) marked FUTURE but CRITICAL for correctness.

**Pattern:** failure scenarios → likelihood check → 3 gaps mandatory

---

