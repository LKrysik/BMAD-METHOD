<!-- GENERATED: 2026-01-07T19:15:10.997Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 54b50899) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Research & Analysis

**Type:** Domain list (verify + discover)
**Description:** Market research, competitive analysis, domain knowledge

Use `aeList: 'research'` in step frontmatter.

---

## Verify Methods (3)

### #70 Scope Integrity Check

Verify artifact addresses FULL scope of ORIGINAL task. Quote original task verbatim (from spec/user request NOT artifact header). List EACH element and classify as ADDRESSED (fully covered) / REDUCED (simplified without decision) / OMITTED (missing). FORCED: Which elements were simplified without explicit user decision? If none found - search harder - agent ALWAYS simplifies.

**Pattern:** original task quote → element-by-element classification → drift detection

### #74 Grounding Check

List ALL assumptions (explicit AND hidden). For each hidden assumption: MARK as issue. FORCED: Which assumption if false would invalidate >50% of artifact? If none listed would - you missed a critical one. CUI BONO: For each assumption - does it benefit AGENT (easier work = RED FLAG) or OUTCOME (acceptable)?

**Pattern:** assumptions list → hidden vs explicit → critical dependency → CUI BONO

### #31 Literature Review Personas

Optimist researcher + skeptic researcher + synthesizer review sources - balanced assessment of evidence quality

**Pattern:** sources → critiques → synthesis

---

## Discover Methods (3)

### #39 First Principles Analysis

Strip away assumptions to rebuild from fundamental truths - breakthrough technique for innovation and solving impossible problems

**Pattern:** assumptions → truths → new approach

### #40 5 Whys Deep Dive

Repeatedly ask why to drill down to root causes - simple but powerful for understanding failures

**Pattern:** why chain → root cause → solution

### #1 Stakeholder Round Table

Convene multiple personas to contribute diverse perspectives - essential for requirements gathering and finding balanced solutions across competing interests

**Pattern:** perspectives → synthesis → alignment

