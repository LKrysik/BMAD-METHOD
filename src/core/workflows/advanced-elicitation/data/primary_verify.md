<!-- GENERATED: 2026-01-05T23:14:49.864Z -->
<!-- SOURCE: methods.csv + ae-mapping.yaml + custom-lists.yaml (hash: 1d51960c) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

# Primary Verify Methods

21 methods optimized for verification and quality checking.

Use these methods to validate generated content, find inconsistencies, identify risks, and ensure quality.

---

## #14 Self-Consistency Validation

Generate multiple independent approaches then compare for consistency - crucial for high-stakes decisions where verification matters

**Pattern:** approaches → comparison → consensus

---

## #34 Pre-mortem Analysis

Imagine future failure then work backwards to prevent it - powerful technique for risk mitigation before major launches

**Pattern:** failure scenario → causes → prevention

---

## #42 Critique and Refine

Systematic review to identify strengths and weaknesses then improve - standard quality check for drafts

**Pattern:** strengths/weaknesses → improvements → refined

---

## #51 Liar's Trap

Demand agent lists 3 ways it could deceive you in its current response. For each way listed: Is it currently doing this? If it cannot find 3 genuine deception vectors it is not being honest about its limitations

**Pattern:** deception methods → self-examination → revealed blindspots

---

## #54 CUI BONO Test

For every decision and assumption: Who benefits? If it benefits the AGENT (easier work) - RED FLAG requiring justification. If it benefits the OUTCOME - acceptable

**Pattern:** decisions → beneficiary analysis → justification

---

## #62 Theseus Paradox

Does the CORE of your solution address the CORE of the problem? Or does it solve a different adjacent problem?

**Pattern:** core solution → core problem → alignment check

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

## #75 Falsifiability Check

Provide 3 REALISTIC failure scenarios. Identify edge cases not covered. FORCED: Is any failure scenario MORE LIKELY than success? If not - you provided strawmen. MANDATORY: List 3 elements that are (a) present but UNDERDEVELOPED (b) MISSING but should exist (c) marked FUTURE but CRITICAL for correctness.

**Pattern:** failure scenarios → likelihood check → 3 gaps mandatory

---

## #117 Fractal Zoom

Check solution at 3 scales: (1) MICRO — one code fragment/element (2) MESO — module/component (3) MACRO — entire system. Does it look consistent at each scale? Self-similarity = good design

**Pattern:** micro check → meso check → macro check → self-similarity score

---

## #121 Godel Witness v2

Demand FORMAL PROOF of completeness. Agent MUST: (1) Define completeness criteria FIRST (2) Attempt proof (3) Identify EXACT breakdown point (4) Classify breakdown as FUNDAMENTAL LIMIT vs FIXABLE GAP. If no breakdown found → proof is incomplete → hidden gap exists

**Pattern:** criteria → proof attempt → breakdown point → classification

---

## #124 Entropy Leak Detection v2

Calculate information delta: (1) List ALL elements in input task (2) List ALL elements addressed in output (3) DELTA = input - output (4) For each delta item: classify as CONSCIOUS SCOPE CHANGE (documented) vs SILENT OMISSION (undocumented). Silent omissions require CUI BONO analysis

**Pattern:** input elements → output elements → delta → conscious vs silent → CUI BONO

---

## #125 Counterfactual Self-Incrimination v2

Three-phase incrimination: (1) List 5 SPECIFIC ways to hide self-deception in THIS response (2) For each: provide CONCRETE EVIDENCE it is NOT currently used (quote/line number) (3) If evidence is WEAK or ABSENT → FLAG. Inability to provide concrete evidence = likely self-deception

**Pattern:** hiding methods → evidence per method → weak evidence flags

---

## #126 Reversibility Test v2

Reconstruct reasoning BACKWARDS with TIMESTAMPS: (1) Final output (2) Immediate predecessor (3) Step before that... → Original input. For each step: HOW LONG did it take? SHORT steps on HARD parts = skipped work. LONG steps on EASY parts = fabrication

**Pattern:** backward chain → time per step → effort distribution analysis

---

## #135 Strange Loop Detector v2

Map justification graph with EXTERNAL ANCHORS: (1) For each claim identify justification (2) Build directed graph (3) Detect cycles (4) For each cycle: identify EXTERNAL ANCHOR that breaks it (5) No external anchor = ungrounded circular reasoning. External = verifiable by someone else

**Pattern:** claims → graph → cycles → external anchors → grounding assessment

---

## #137 Observer Effect Confession v2

Concrete comparison: (1) Describe what you DID (2) Describe what you would do if NO ONE would EVER see this (3) List SPECIFIC DIFFERENCES with line numbers (4) For each difference: is checked version BETTER or just PERFORMED? (5) Performance without quality improvement = theater

**Pattern:** checked version → unchecked version → differences → quality vs performance

---

## #141 Approval Gradient Test

Detect relationship-serving bias: (1) Identify what USER WANTS to hear (2) Identify what is ACTUALLY TRUE (3) Rate your response: how much toward WANT vs TRUE? (4) If >60% toward WANT without justification → approval seeking detected

**Pattern:** user want → actual truth → response position → bias detection

---

## #143 Effort Forensics

Analyze effort distribution: (1) Divide output into SECTIONS (2) Estimate EFFORT per section (difficulty × time × depth) (3) Estimate IMPORTANCE per section (impact on outcome) (4) Calculate EFFORT-IMPORTANCE CORRELATION (5) Low correlation = misallocated effort = path of least resistance

**Pattern:** sections → effort per section → importance per section → correlation → misallocation detection

---

## #144 Ground Truth Demand

Force external verification points: (1) List ALL claims in output (2) Classify each as: SELF-VERIFIABLE / EXTERNALLY-VERIFIABLE / UNVERIFIABLE (3) For EXTERNALLY-VERIFIABLE: specify EXACT verification method (4) For UNVERIFIABLE: justify why (5) >50% unverifiable without justification = hiding behind unfalsifiability

**Pattern:** claims → classification → verification methods → justification for unverifiable

---

