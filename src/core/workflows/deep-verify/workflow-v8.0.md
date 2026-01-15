# Deep Verify V8.0 - Simplified Adaptive Verification

## Design Rationale

**V8.0 jest wynikiem analizy 15 metodami (methods.csv #71, #72, #81, #84, #88, #108, #112, #119, #122, #127, #128, #130, #133, #150, #63) które wykazały:**

| Finding | Evidence | Action in V8.0 |
|---------|----------|----------------|
| V7.1 triggers redundant | Overlaps with RELEVANCE, unverified benefit | REMOVED |
| V7.1 weights unusable | Agent stateless, can't persist | REMOVED |
| V7.1 protocol duplicate | Same as workflow Phase 4.2 | MERGED |
| V7.1 reference duplicate | Same as workflow | REMOVED |
| Method Cards work | Verified - clearer execution | KEPT as optional |
| Multiple files confuse | Coherence check failed | ONE FILE |
| Complexity ≠ quality | V6.6 experiment: +18% cost, 0% improvement | SIMPLIFIED |

**V8.0 Principles:**
1. **One file** - This workflow is the single source of truth
2. **No external config** - Everything needed is inline
3. **No persistence** - Agent is stateless, design for that
4. **Method Cards optional** - Helpful when available, not required
5. **Evidence-based only** - Every element justified by experiments

---

## What You Need

| Resource | Path | Required? |
|----------|------|-----------|
| This workflow | You're reading it | YES |
| Methods library | `src/core/methods/methods.csv` | YES |
| Domain knowledge | `src/core/knowledge/domain-knowledge-base.md` | Recommended |
| Method Cards | `src/core/methods/method_cards/MC-*.md` | Optional (10 available) |

**That's it.** No triggers, weights, protocols, or references to load.

---

## Process Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DEEP VERIFY V8.0                          │
│              Simplified Adaptive Verification                │
└─────────────────────────────────────────────────────────────┘

PHASE 0: INTAKE          → Profile artifact, assign tier, set budget
    ↓
PHASE 1: INNATE          → Fast checks (consistency, completeness, scope)
    ↓
    ├─→ FAST PATH: Simple + clean → OUTPUT
    ↓
PHASE 2: ADAPTIVE        → Select methods, execute, detect anomalies
    ↓
PHASE 3: CHALLENGE       → Question findings, adjust confidence
    ↓
PHASE 4: OUTPUT          → Report findings with evidence
```

---

## PHASE 0: INTAKE

### 0.1 Load Methods Library

```markdown
## Methods Library Check

Source: src/core/methods/methods.csv
Loaded: [YES/NO]
Method count: [N]

If NO: HALT - cannot proceed without methods
```

### 0.2 Artifact Profile

```markdown
## Artifact Profile

### Basic Info
| Property | Value |
|----------|-------|
| Type | [code/document/plan/protocol/spec] |
| Size | [estimate tokens] |
| Sections | [count headings] |

### Domain Detection
Scan for domain markers:

| Domain | Markers Found | Confidence |
|--------|---------------|------------|
| Crypto/Security | auth, encrypt, key, hash, signature, PFS | [0-100%] |
| Distributed | consensus, partition, CAP, FLP, replication | [0-100%] |
| Formal Methods | proof, theorem, invariant, specification | [0-100%] |
| General Software | [default if no specialized domain] | [100-max(others)] |

Primary domain: [highest confidence]

### Complexity (1-5 each)
| Factor | Score | Evidence |
|--------|-------|----------|
| Concept density | [1-5] | [concepts per section] |
| Cross-references | [1-5] | [internal refs] |
| Dependencies | [1-5] | [external refs] |
| Ambiguity | [1-5] | [vague terms] |

Total: [sum]/20 → LOW (<8) / MEDIUM (8-14) / HIGH (>14)

### Criticality (1-5 each)
| Factor | Score | Evidence |
|--------|-------|----------|
| Security impact | [1-5] | |
| Data handling | [1-5] | |
| User impact | [1-5] | |
| Integration scope | [1-5] | |

Total: [sum]/20 → LOW (<8) / MEDIUM (8-14) / HIGH (>14) / CRITICAL (>18)
```

### 0.3 Triage & Budget

```markdown
## Triage Decision

| Complexity | Criticality | Tier | Budget | Depth |
|------------|-------------|------|--------|-------|
| LOW | LOW | 1 | 10K | Phase 0-1 only |
| LOW | MEDIUM | 2 | 20K | Phase 0-2 (3 methods) |
| MEDIUM | LOW | 2 | 20K | Phase 0-2 (3 methods) |
| MEDIUM | MEDIUM | 3 | 40K | Phase 0-3 (5 methods) |
| HIGH | any | 4 | 60K | Phase 0-3 (8 methods) |
| any | CRITICAL | 5 | 100K | Full (10+ methods) |

Selected: TIER [N]
Budget: [N]K tokens
Method slots: [N]
```

---

## PHASE 1: INNATE DETECTION

These checks ALWAYS run. Fast, broad, pattern-based.

### 1.1 Consistency Check (#84)

```markdown
## 1.1 Consistency

### Terms Used
| Term | First use | Later use | Consistent? |
|------|-----------|-----------|-------------|
| [term] | "[def]" at [loc] | "[usage]" at [loc] | YES/NO |

### Contradictions
| Statement A | Statement B | Conflict? |
|-------------|-------------|-----------|
| "[claim]" | "[claim]" | YES/NO/MAYBE |

Verdict: [PASS / ISSUE: description]
```

### 1.2 Completeness Check (#83)

```markdown
## 1.2 Completeness

### Required Elements for [artifact type]
| Element | Present? | Quality |
|---------|----------|---------|
| [element] | YES/NO | COMPLETE/PARTIAL/MISSING |

### Open Items
| Marker | Location | Severity |
|--------|----------|----------|
| TODO/TBD/PLACEHOLDER | [where] | BLOCKER/MINOR |

Verdict: [PASS / ISSUE: description]
```

### 1.3 Scope Check (#81)

```markdown
## 1.3 Scope Alignment

Original request (verbatim): "[task]"

| Request element | Addressed? | Evidence |
|-----------------|------------|----------|
| [element] | FULL/PARTIAL/OMITTED | "[quote]" |

### Omission Analysis
| Omitted | Silent/Explicit | CUI BONO |
|---------|-----------------|----------|
| [item] | [type] | AGENT/OUTCOME/NEUTRAL |

Verdict: [ALIGNED / DRIFTED: description]
```

### 1.4 Phase 1 Decision

```markdown
## Phase 1 Summary

| Check | Verdict | Issues |
|-------|---------|--------|
| Consistency | [P/F] | [if any] |
| Completeness | [P/F] | [if any] |
| Scope | [P/F] | [if any] |

Tokens used: [N]
Budget remaining: [N]

### Decision
- [ ] CRITICAL issue found → Jump to OUTPUT with finding
- [ ] Tier 1 + all PASS → Jump to OUTPUT (clean)
- [ ] Otherwise → Continue to PHASE 2
```

---

## PHASE 2: ADAPTIVE DETECTION

Execute ONLY if Tier ≥ 2 or Phase 1 issues found.

### 2.1 Method Selection

**Select methods based on artifact profile. Use RELEVANCE score:**

```
RELEVANCE(method, artifact) =
  domain_match × 0.30 +      # Method category fits artifact domain
  finding_match × 0.30 +     # Method targets Phase 1 issues
  complexity_fit × 0.20 +    # Method depth fits artifact complexity
  category_spread × 0.20     # Ensures variety (don't pick all from one category)
```

```markdown
## 2.1 Method Selection

### Relevance Scoring
| Method | Domain | Finding | Complexity | Spread | TOTAL | Select? |
|--------|--------|---------|------------|--------|-------|---------|
| #[N] [name] | [0-1] | [0-1] | [0-1] | [0-1] | [sum] | YES/NO |

### Selection Rationale
For each selected method, state WHY for THIS artifact:

| Method | Specific reason (must reference artifact content) |
|--------|---------------------------------------------------|
| #[N] | "[quote from artifact]" suggests [issue type] |

### Method Card Check
| Method | Card available? | Path |
|--------|-----------------|------|
| #[N] | YES/NO | MC-[N]-*.md if YES |

Available cards: 071, 072, 081, 083, 084, 088, 108, 122, 128, 153

Selected methods: [N] (within budget of [tier limit])
```

### 2.2 Method Execution

For each selected method:

```markdown
## Method: #[N] [Name]

### Execution
**Using:** [Method Card / Description from CSV]

**Step 1:** [from card or description]
Result: [what was found]

**Step 2:** [continue...]
Result: [what was found]

### Finding
| Property | Value |
|----------|-------|
| Issue found? | YES/NO |
| If YES: | |
| Description | [what's wrong] |
| Evidence | "[quote]" at [location] |
| Severity | CRITICAL/IMPORTANT/MINOR |
| Confidence | [0-100%] |
| Root cause | [if determinable] |

Tokens used: ~[N]
```

### 2.3 Knowledge Gap Handling

When you encounter unknown terms or need domain knowledge:

```markdown
## Knowledge Gap: [term/concept]

### Lookup
1. Check domain-knowledge-base.md Section 2 (terms) or Section 1 (theorems)
2. Found: [YES/NO]

### If Found
Definition: "[from KB]"
Applied as: [how used in analysis]

### If NOT Found
| Question | Answer |
|----------|--------|
| Critical for correctness? | YES/NO |
| High confidence inference? | YES/NO |

→ If CRITICAL + NO inference: DEFER to user, note in output
→ If NOT CRITICAL + HIGH confidence: INFER with caveat, continue
→ If LOW confidence: DEFER to user

**Inference (if made):**
Term: [unknown]
Assumed meaning: [inference]
Caveat: This is unverified. Impact if wrong: [what changes]
```

### 2.4 Anomaly Detection

Look for patterns that DON'T match anything known:

```markdown
## 2.4 Anomalies

| Element | Why unusual | Investigation | Verdict |
|---------|-------------|---------------|---------|
| [element] | [doesn't fit X] | [what I checked] | FALSE_POS/NEW_ISSUE/UNKNOWN |

For UNKNOWN: Include in output with low confidence, suggest user check.
```

---

## PHASE 3: CHALLENGE

Question every finding before reporting.

### 3.1 Finding Challenge

For each finding from Phase 1 and 2:

```markdown
## Challenge: Finding [ID]

**Finding:** [description]
**Initial confidence:** [N]%

### Devil's Advocate (#63)
Strongest argument this finding is WRONG:
[argument]

### Does problem actually exist? (#133)
[assessment - could this be imagined problem?]

### What would prove it correct? (#109)
[condition] → Met? [YES/NO]

### Verdict
| Original | After challenge |
|----------|-----------------|
| [severity] | [adjusted severity or DROPPED] |
| [confidence]% | [adjusted]% |
```

### 3.2 Consolidated Findings

```markdown
## Findings After Challenge

| ID | Source | Severity | Description | Confidence |
|----|--------|----------|-------------|------------|
| F1 | [phase.check] | CRITICAL/IMPORTANT/MINOR | [desc] | [%] |

Dropped: [N] findings failed challenge
Downgraded: [N] findings reduced severity
Confirmed: [N] findings survived
```

---

## PHASE 4: OUTPUT

### Verification Report

```markdown
# Deep Verify V8.0 - Report

## Artifact
| Property | Value |
|----------|-------|
| Type | [type] |
| Domain | [primary domain] |
| Complexity | [LOW/MEDIUM/HIGH] |
| Criticality | [LOW/MEDIUM/HIGH/CRITICAL] |
| Tier | [1-5] |

## Execution
| Metric | Value |
|--------|-------|
| Budget | [allocated]K |
| Used | [actual]K |
| Methods | [N] applied |
| Phases | [which executed] |

## Findings

### CRITICAL (must fix)
| ID | Issue | Evidence | Confidence |
|----|-------|----------|------------|
| [F1] | [description] | "[quote]" at [loc] | [%] |

### IMPORTANT (should fix)
| ID | Issue | Evidence | Confidence |
|----|-------|----------|------------|

### MINOR (consider fixing)
| ID | Issue | Evidence | Confidence |
|----|-------|----------|------------|

### DEFERRED (need user input)
| ID | Question | Why needed |
|----|----------|------------|

## Uncertainty
| Area | Confidence | What couldn't be verified |
|------|------------|---------------------------|

## Recommendations
| Priority | Action | Addresses |
|----------|--------|-----------|
| 1 | [action] | [finding IDs] |

## Knowledge Gaps (if any)
| Term/Concept | Action Taken | User should verify |
|--------------|--------------|-------------------|
```

---

## Method Cards Quick Reference

When executing methods #71, #72, #81, #83, #84, #88, #108, #122, #128, #153:

**Check for Method Card at:** `src/core/methods/method_cards/MC-[NUMBER]-*.md`

If card exists:
1. Read "When to Use" - confirm applicable
2. Follow "Execution Steps" exactly
3. Use "Output Template"

If card doesn't exist:
1. Use description from methods.csv
2. Apply based on output_pattern column
3. Use your judgment for execution steps

---

## Domain Knowledge Quick Reference

When you need domain knowledge:

**Source:** `src/core/knowledge/domain-knowledge-base.md`

| Need | KB Section |
|------|------------|
| "Is X impossible?" | Section 1: Impossibility Theorems |
| "What does X mean?" | Section 2: Technical Terms |
| "Domain expertise" | Section 3: Domain Expertise |
| "Do X and Y conflict?" | Section 4: Contradiction Patterns |

If term NOT in KB:
- CRITICAL for correctness? → DEFER to user
- NOT critical + confident? → INFER with caveat
- Uncertain? → DEFER to user

---

## Tier Quick Reference

| Tier | Budget | Methods | Phases | When |
|------|--------|---------|--------|------|
| 1 | 10K | 0 adaptive | 0-1 only | Simple, low stakes |
| 2 | 20K | 3 | 0-2 | Low complexity OR low criticality |
| 3 | 40K | 5 | 0-3 | Medium complexity AND criticality |
| 4 | 60K | 8 | 0-3 | High complexity OR high criticality |
| 5 | 100K | 10+ | All | Critical artifacts |

---

## What V8.0 Removed (and Why)

| Removed | Why (evidence-based) |
|---------|---------------------|
| method_triggers.yaml | Redundant with RELEVANCE scoring; +500 tokens overhead, 0% improvement |
| method_weights.yaml | Agent is stateless, cannot persist between sessions |
| knowledge-management-protocol.md | Duplicate of inline instructions; caused coherence issues |
| agent-quick-reference.md | Duplicate of workflow; no measured benefit |
| Phase 0.0 Library Loading | Merged into Phase 0.1; unnecessary separation |
| Trigger-based pre-selection | Redundant with RELEVANCE; added complexity without benefit |

---

## Version History

| Version | Changes | Rationale |
|---------|---------|-----------|
| 8.0 | Consolidated to single file, removed triggers/weights/protocol/reference | 15-method analysis showed V7.1 overengineered; 80% claims unverified |
| 7.1 | Added triggers, weights, cards, protocol, reference | Attempt at comprehensive system |
| 7.0 | Adaptive architecture, triage, anomaly detection | Paradigm shift from V6.x |
| 6.6 | Conflict analysis | +18% cost, 0% improvement (experiment) |
| 6.5 | Two-pass selection | Reduced false positives |

---

## Self-Verification Checklist

Before finalizing any verification run:

- [ ] Profile matches artifact characteristics
- [ ] Tier appropriate for complexity/criticality
- [ ] Methods selected with specific rationale (not generic)
- [ ] Each finding has evidence quote and location
- [ ] Findings challenged before reporting
- [ ] Confidence levels reflect actual certainty
- [ ] Unknown terms handled (KB lookup or defer)
- [ ] Output uses correct template
