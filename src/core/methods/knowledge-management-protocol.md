# Knowledge Management Protocol

**Version**: 1.0
**Purpose**: Handle domain knowledge discovery, validation, integration, and updates during verification.

---

## Overview

This protocol defines how agents should:
1. **DETECT** knowledge gaps during verification
2. **LOOKUP** existing knowledge in the knowledge base
3. **ACQUIRE** new knowledge when gaps are found
4. **INTEGRATE** verified knowledge back into the system

---

## When This Protocol Applies

Execute this protocol when ANY of the following occur during verification:

| Trigger | Example | Action |
|---------|---------|--------|
| Unknown domain term | "PFS" not recognized | LOOKUP → ACQUIRE if missing |
| Claim contradicts known theorem | "async consensus guaranteed" | LOOKUP theorem → FLAG violation |
| Pattern doesn't match categories | Unusual structure detected | FLAG as potential new pattern |
| Theoretical claim in specialized domain | Crypto, distributed, formal | ACTIVATE domain expertise |
| Agent uncertainty about domain fact | "I think PFS means..." | LOOKUP → VERIFY before using |

---

## Phase 1: Knowledge Gap Detection

### 1.1 During Analysis

As you analyze an artifact, maintain a **Knowledge Gap Log**:

```markdown
## Knowledge Gap Log

| ID | Type | Term/Concept | Context | Confidence | Status |
|----|------|--------------|---------|------------|--------|
| G1 | TERM | {unknown term} | "{surrounding text}" | LOW/MEDIUM/HIGH | OPEN |
| G2 | THEOREM | {claim needing check} | "{claim text}" | LOW/MEDIUM/HIGH | OPEN |
| G3 | PATTERN | {unknown pattern} | "{where found}" | LOW/MEDIUM/HIGH | OPEN |
```

### 1.2 Gap Types

| Type | Description | Example |
|------|-------------|---------|
| TERM | Unknown technical term | "What does 'eventual consistency' mean?" |
| THEOREM | Claim that might violate theorem | "Does this violate CAP?" |
| PATTERN | Structure that doesn't match known patterns | "This dependency structure is unusual" |
| DOMAIN | Need for specialized domain knowledge | "Crypto expertise needed" |
| FACT | Uncertain about domain fact | "Is O(n log n) optimal for sorting?" |

---

## Phase 2: Knowledge Lookup

### 2.1 Primary Source

**ALWAYS check `domain-knowledge-base.md` FIRST**

Location: `src/core/knowledge/domain-knowledge-base.md`

```markdown
### Lookup Procedure

1. Open domain-knowledge-base.md
2. Navigate to relevant section:
   - Section 1: Impossibility Theorems
   - Section 2: Technical Terms
   - Section 3: Domain Expertise
   - Section 4: Contradiction Patterns
   - Section 5: Known Patterns

3. Search for term/concept
4. If FOUND: Record and apply
5. If NOT FOUND: Proceed to Phase 3
```

### 2.2 Lookup Output

```markdown
### Lookup Result: {Gap ID}

**Searched for**: {term/concept}
**Found in**: {section} / NOT FOUND
**Definition**: "{if found}"
**Applicable**: YES/NO
**Applied as**: {how used in analysis}
```

---

## Phase 3: Knowledge Acquisition

When knowledge is NOT FOUND in the knowledge base:

### 3.1 Decision Matrix

| Situation | Action | Rationale |
|-----------|--------|-----------|
| Critical for verification | DEFER to user | Can't proceed without accurate knowledge |
| Non-critical, high confidence | INFER with caveat | Document assumption clearly |
| Domain available via web | RESEARCH (if enabled) | Get authoritative source |
| Multiple interpretations | ASK user | Avoid wrong assumption |

### 3.2 Acquisition Methods

#### Option A: DEFER (Default for critical gaps)

```markdown
### Knowledge Deferral: {Gap ID}

**Gap**: {what's unknown}
**Critical for**: {why needed}
**Cannot proceed because**: {impact}

**USER ACTION REQUIRED**:
Please provide:
1. Definition of "{term}"
2. OR: Confirmation that "{assumption}" is correct
3. OR: Pointer to documentation

**Awaiting user response before continuing.**
```

**HALT** - Wait for user input

#### Option B: INFER (Non-critical, high confidence)

```markdown
### Knowledge Inference: {Gap ID}

**Gap**: {what's unknown}
**Inference**: {what agent assumes}
**Confidence**: {HIGH/MEDIUM}
**Basis**: {why agent believes this}

**CAVEAT**: This is an inference, not verified fact.
**Impact if wrong**: {what would change}

**Proceeding with this inference. Flag for user verification.**
```

Continue analysis, but flag in output.

#### Option C: RESEARCH (If web search available)

```markdown
### Knowledge Research: {Gap ID}

**Gap**: {what's unknown}
**Search query**: {what to search}
**Source found**: {authoritative source}
**Result**: {what was learned}

**Confidence**: {based on source quality}
**Applied as**: {how used}
```

---

## Phase 4: Knowledge Integration

When NEW knowledge is established and VERIFIED:

### 4.1 Integration Criteria

Before adding to knowledge base, verify:

| Check | Requirement |
|-------|-------------|
| Source | User verified OR authoritative source |
| Accuracy | Cross-checked if possible |
| Relevance | Will be useful in future verifications |
| Format | Matches knowledge base structure |

### 4.2 Integration Template

```markdown
### Knowledge Base Addition Request

**Source Session**: {session ID or reference}
**Gap that revealed this**: {Gap ID}
**Type**: TERM / THEOREM / PATTERN / DOMAIN_FACT

**Proposed Entry**:

---
**Section**: {which section of KB}
**Entry ID**: {suggested ID}

{Formatted entry per KB template}

---

**Evidence**: {what proved this correct}
**Status**: PROPOSED → awaiting user approval

**To add to KB**:
1. Open `src/core/knowledge/domain-knowledge-base.md`
2. Navigate to Section {N}
3. Add entry in format specified
4. Mark as VERIFIED with date
```

### 4.3 User Approval Flow

```
PROPOSED → USER REVIEW → APPROVED → ADDED TO KB
                      ↘ REJECTED → DISCARDED
```

**User must explicitly approve** before entry becomes part of KB.

---

## Phase 5: Knowledge Log Output

At end of verification, include knowledge management summary:

```markdown
## Knowledge Management Summary

### Gaps Detected
| ID | Type | Status | Resolution |
|----|------|--------|------------|
| G1 | TERM | RESOLVED | Found in KB Section 2 |
| G2 | THEOREM | RESOLVED | FLP applies - violation flagged |
| G3 | PATTERN | DEFERRED | Awaiting user input |

### Lookups Performed
| Gap | KB Section | Found | Applied |
|-----|------------|-------|---------|
| G1 | Section 2.1 | YES | Definition used |
| G2 | Section 1.3 | YES | Theorem checked |

### Inferences Made
| Gap | Inference | Confidence | Verify |
|-----|-----------|------------|--------|
| G4 | {assumption} | HIGH | User should confirm |

### New Knowledge Proposed
| Entry | Type | Status |
|-------|------|--------|
| {entry} | TERM | PROPOSED - awaiting approval |

### KB Updates Pending
- [ ] Add {entry 1} to Section 2
- [ ] Add {entry 2} to Section 4
```

---

## Quick Reference

### When to DEFER vs INFER

```
Is the gap CRITICAL for correctness?
├── YES → DEFER (ask user)
└── NO
    └── Is confidence HIGH?
        ├── YES → INFER (with caveat)
        └── NO → DEFER (ask user)
```

### KB Section Quick Guide

| Need | Section |
|------|---------|
| "Is X impossible?" | Section 1: Impossibility Theorems |
| "What does X mean?" | Section 2: Technical Terms |
| "What's special about domain X?" | Section 3: Domain Expertise |
| "Do X and Y conflict?" | Section 4: Contradiction Patterns |
| "Is this pattern known?" | Section 5: Known Patterns |

---

## Integration with V7.1

### In Phase 0.5 (Artifact Profiling)
- Detect domain → prepare for domain-specific KB sections
- Extract claims → prepare for theorem checking

### In Phase 3 (Method Selection)
- Domain triggers may require KB consultation
- Theory methods (#153-156) require KB access

### In Phase 4 (Verification)
- Unknown terms → execute Knowledge Lookup
- Theoretical claims → check theorems in KB

### In Phase 6 (Layer 3: Memory)
- Record new knowledge for integration
- Propose KB updates

---

## Files Referenced

| File | Purpose |
|------|---------|
| `src/core/knowledge/domain-knowledge-base.md` | Primary knowledge source |
| `src/core/methods/methods.csv` | Method definitions |
| `src/core/methods/method_triggers.yaml` | Trigger rules |
| `src/core/methods/method_cards/*.md` | Execution instructions |
