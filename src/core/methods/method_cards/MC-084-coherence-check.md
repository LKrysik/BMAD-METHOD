# MC-084: Coherence Check

**Category**: sanity
**Source**: methods.csv #84
**Token Cost**: ~1-2K tokens
**Complexity**: LOW

---

## Purpose

Verify that definitions are stable throughout the artifact - no contradictions, no definition drift, no redundant conflicting definitions. Answers: "Does the artifact agree with itself?"

---

## When to Use

### Trigger Conditions
- Artifact defines terms or concepts
- Multiple sections that should be consistent
- Long document where drift is possible
- Technical specification with precise terms

### Do NOT Use When
- Artifact is a single, simple statement
- No definitions or terms introduced

---

## Execution Steps

### Step 1: Extract Key Terms

**Input**: The artifact
**Action**: Identify all terms that are:
- Explicitly defined
- Used with specific meaning
- Domain-specific vocabulary
- Acronyms or abbreviations

**Output**: Term inventory

```markdown
### Key Terms Inventory
| Term | Category | First Occurrence |
|------|----------|------------------|
| {term 1} | definition/acronym/concept | {location} |
| {term 2} | | |
```

### Step 2: Trace Each Definition

**Input**: Term inventory
**Action**: For each term, find:
- Where it's first defined
- All other places it's used or redefined
- Any variations in usage

**Output**: Definition trace

```markdown
### Definition Trace: {Term}
| Location | Definition/Usage | Quote |
|----------|------------------|-------|
| {loc 1} | DEFINITION | "{exact text}" |
| {loc 2} | USAGE | "{how used}" |
| {loc 3} | REDEFINITION? | "{if changed}" |
```

### Step 3: Check for Inconsistencies

**Input**: Definition traces
**Action**: Compare all occurrences and flag:
- CONTRADICTION: Same term, incompatible meanings
- DRIFT: Meaning changes subtly over document
- REDUNDANCY: Multiple definitions that conflict

**Output**: Inconsistency report

```markdown
### Inconsistencies Found
| Term | Type | Location A | Location B | Issue |
|------|------|------------|------------|-------|
| {term} | CONTRADICTION | {loc A} | {loc B} | {what conflicts} |
| {term} | DRIFT | {loc A} | {loc B} | {how it changed} |
| {term} | REDUNDANCY | {loc A} | {loc B} | {which is correct} |
```

### Step 4: Check Cross-References

**Input**: The artifact
**Action**: Verify internal references are consistent:
- "See Section X" - does X exist?
- "As defined above" - is it actually above?
- Numbers/versions referenced correctly

**Output**: Reference consistency

```markdown
### Cross-Reference Check
| Reference | Points To | Valid? |
|-----------|-----------|--------|
| "See Section 3" | Section 3 | YES/NO |
| "version 2.0" | {what version} | MATCH/MISMATCH |
```

---

## Output Template

```markdown
## Coherence Check

### Terms Analyzed
{N} terms extracted and traced

### Definition Stability
| Term | Occurrences | Stable? | Issue |
|------|-------------|---------|-------|
| {term} | {N} | YES/NO | {if NO, what's wrong} |

### Inconsistencies
| Type | Term | Details |
|------|------|---------|
| CONTRADICTION | {term} | {specifics} |
| DRIFT | {term} | {how changed} |
| REDUNDANCY | {term} | {conflicting defs} |

### Cross-References
Valid: {N} / Invalid: {M}

### Verdict
**Coherent**: YES / NO / MOSTLY
**Issues Found**: {count}
**Critical Issues**: {count requiring fix}
```

---

## Examples

### Example 1: Authentication Specification

**Terms Traced**:

**"Token"**:
| Location | Usage | Quote |
|----------|-------|-------|
| Section 1 | DEFINITION | "Token: a JWT containing user claims" |
| Section 3 | USAGE | "Send token in Authorization header" |
| Section 5 | REDEFINITION | "Token: the session identifier" |

**Issue**: CONTRADICTION - Section 1 says JWT, Section 5 says session ID

**"User"**:
| Location | Usage | Quote |
|----------|-------|-------|
| Throughout | CONSISTENT | Always means authenticated entity |

**Issue**: None

**Verdict**: NOT COHERENT - "Token" has conflicting definitions

---

## Common Mistakes

| Mistake | Why It's Wrong | How to Avoid |
|---------|----------------|--------------|
| Only checking explicit definitions | Implicit usage can conflict | Trace ALL occurrences |
| Ignoring subtle drift | Small changes accumulate | Compare exact wording |
| Not checking cross-refs | Broken refs confuse readers | Validate all "See X" |
| Assuming acronyms consistent | Same acronym, different meanings | Expand all acronyms |

---

## Related Methods

- #83 Closure Check - Check for undefined terms
- #100 Vocabulary Consistency - Synonym/homonym analysis
- #99 Multi-Artifact Coherence - Cross-artifact consistency

---

## Quality Checks

Before finalizing output, verify:
- [ ] All key terms identified (not just obvious ones)
- [ ] Each term traced to ALL occurrences
- [ ] EXACT quotes used (not paraphrased)
- [ ] Cross-references validated
- [ ] Verdict justified by evidence
