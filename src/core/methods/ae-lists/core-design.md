<!-- GENERATED: 2026-01-06T11:55:36.301Z -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: 94ae6f09) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Core Game Design

**Type:** Domain list (verify + discover)
**Description:** Game pillars, core loops, USPs, game-defining decisions

Use `aeList: 'core-design'` in step frontmatter.

---

## Verify Methods (4)

### #62 Theseus Paradox

Does the CORE of your solution address the CORE of the problem? Or does it solve a different adjacent problem?

**Pattern:** core solution → core problem → alignment check

### #70 Scope Integrity Check

Verify artifact addresses FULL scope of ORIGINAL task. Quote original task verbatim (from spec/user request NOT artifact header). List EACH element and classify as ADDRESSED (fully covered) / REDUCED (simplified without decision) / OMITTED (missing). FORCED: Which elements were simplified without explicit user decision? If none found - search harder - agent ALWAYS simplifies.

**Pattern:** original task quote → element-by-element classification → drift detection

### #71 Alignment Check

Verify artifact realizes its STATED goal. Quote the stated goal. List how artifact addresses EACH part of the goal. List parts of goal NOT addressed. Provide specific evidence with quotes and line numbers.

**Pattern:** goal quote → coverage per part → gaps with evidence

### #73 Coherence Check

Check: Are definitions stable throughout? Does section A contradict section B? Search for contradictory statements and redefinitions. Document contradictions with quotes from BOTH locations.

**Pattern:** definitions stability → contradiction search → dual-location quotes

---

## Discover Methods (3)

### #109 Contraposition Inversion

Instead of what leads to success? answer what GUARANTEES failure?. List 5 certain ways to FAIL. Check if your solution contains any of them

**Pattern:** success path → guaranteed failures list → check current solution against failures

### #39 First Principles Analysis

Strip away assumptions to rebuild from fundamental truths - breakthrough technique for innovation and solving impossible problems

**Pattern:** assumptions → truths → new approach

### #27 What If Scenarios

Explore alternative realities to understand possibilities and implications - valuable for contingency planning and exploration

**Pattern:** scenarios → implications → insights

