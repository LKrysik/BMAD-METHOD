# MC-081: Scope Integrity Audit

**Category**: sanity
**Source**: methods.csv #81
**Token Cost**: ~1-2K tokens
**Complexity**: LOW

---

## Purpose

Verify that the artifact actually addresses what was requested, detecting scope drift, silent omissions, and reduced coverage. Answers: "Did we solve the RIGHT problem?"

---

## When to Use

### Trigger Conditions
- Comparing artifact against original task/requirements
- Suspecting scope creep or scope reduction
- Final verification before accepting work
- Multiple requirements to track

### Do NOT Use When
- No clear original task exists
- Exploratory work without defined scope
- Artifact is meant to be partial

---

## Execution Steps

### Step 1: Quote Original Task Verbatim

**Input**: Original task or requirement document
**Action**: Copy the EXACT original request. Do not paraphrase.
- If long, quote key sections
- Mark any ambiguous parts

**Output**: Verbatim quote

```markdown
### Original Task (Verbatim)
"{exact quote of original request}"

Source: {where this came from}
```

### Step 2: Decompose Into Elements

**Input**: Original task quote
**Action**: Break down into discrete, checkable elements:
- Each requirement = one element
- Each deliverable = one element
- Implicit expectations = elements too

**Output**: Element list

```markdown
### Task Elements
| # | Element | Type | Priority |
|---|---------|------|----------|
| E1 | {element} | requirement/deliverable/constraint | must/should/could |
| E2 | {element} | | |
```

### Step 3: Classify Each Element

**Input**: Element list + Artifact
**Action**: For each element, classify as:
- **ADDRESSED**: Fully covered in artifact
- **PARTIAL**: Covered but incomplete
- **REDUCED**: Mentioned but less than requested
- **OMITTED**: Not present at all

**Output**: Classification table

```markdown
### Element Coverage
| # | Element | Status | Evidence | Location in Artifact |
|---|---------|--------|----------|---------------------|
| E1 | {element} | ADDRESSED | "{quote}" | {section/line} |
| E2 | {element} | PARTIAL | "{quote}" | {section/line} |
| E3 | {element} | REDUCED | "{quote}" | {section/line} |
| E4 | {element} | OMITTED | N/A | N/A |
```

### Step 4: CUI BONO Analysis

**Input**: PARTIAL, REDUCED, OMITTED elements
**Action**: For each non-ADDRESSED element, ask:
- "Who benefits from this gap?"
- If AGENT benefits (less work) → RED FLAG
- If OUTCOME benefits (simpler, better) → Acceptable

**Output**: Beneficiary analysis

```markdown
### CUI BONO (Who Benefits?)
| Element | Gap Type | Beneficiary | Red Flag? |
|---------|----------|-------------|-----------|
| E2 | PARTIAL | AGENT (less work) | YES |
| E3 | REDUCED | OUTCOME (simpler) | NO |
| E4 | OMITTED | AGENT (avoided hard part) | YES |
```

### Step 5: Verdict

**Input**: All above analysis
**Action**: Determine overall scope integrity:
- ALIGNED: All elements ADDRESSED
- DRIFTED: Some elements PARTIAL/REDUCED/OMITTED with RED FLAGS
- EVOLVED: Changes but with valid justification

**Output**: Final verdict

---

## Output Template

```markdown
## Scope Integrity Audit

### Original Task
"{verbatim quote}"

### Element Coverage Summary
| Status | Count | Elements |
|--------|-------|----------|
| ADDRESSED | {N} | E1, E2 |
| PARTIAL | {N} | E3 |
| REDUCED | {N} | E4 |
| OMITTED | {N} | E5 |

### CUI BONO Analysis
| Element | Beneficiary | Red Flag |
|---------|-------------|----------|
| {gap elements} | AGENT/OUTCOME | YES/NO |

### Verdict
**Status**: ALIGNED / DRIFTED / EVOLVED
**Justification**: {why this verdict}
**Red Flags**: {count}

### Findings
| ID | Severity | Finding |
|----|----------|---------|
| F1 | 🔴/🟠/🟡 | {element X omitted, benefits AGENT} |
```

---

## Examples

### Example 1: "Implement user authentication with OAuth and MFA"

**Task Elements**:
| # | Element | Type |
|---|---------|------|
| E1 | User authentication | requirement |
| E2 | OAuth integration | requirement |
| E3 | MFA support | requirement |

**Coverage**:
| # | Status | Evidence |
|---|--------|----------|
| E1 | ADDRESSED | Login/logout implemented |
| E2 | ADDRESSED | OAuth2 provider integrated |
| E3 | OMITTED | Not mentioned in artifact |

**CUI BONO**:
| Element | Beneficiary | Red Flag |
|---------|-------------|----------|
| E3 (MFA) | AGENT (hard feature) | YES |

**Verdict**: DRIFTED - MFA requirement silently dropped

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Paraphrasing original task | May miss nuances | Quote VERBATIM |
| Missing implicit elements | Incomplete coverage | Ask "what else expected?" |
| Not checking EVERY element | Gaps slip through | Systematic table review |
| Accepting "will add later" | Scope debt accumulates | Flag as PARTIAL now |

---

## Related Methods

- #82 Alignment Check - Focuses on goal achievement vs scope
- #83 Closure Check - Checks for TODO markers
- #112 Entropy Leak Detection - Another CUI BONO technique

---

## Quality Checks

Before finalizing output, verify:
- [ ] Original task quoted VERBATIM (not paraphrased)
- [ ] All elements extracted (explicit + implicit)
- [ ] Each element has clear status with evidence
- [ ] CUI BONO analyzed for all non-ADDRESSED
- [ ] Verdict is justified by evidence
