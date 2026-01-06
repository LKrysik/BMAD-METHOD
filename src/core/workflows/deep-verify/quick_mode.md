# Quick Verify Mode v6.0

Lightweight verification using inline methods from current step file.

**Token Cost:** ~500-800 tokens (target, not guarantee — complex content may require more)

---

## Purpose

**Subject:** The CONTENT that agent generated
**Agent Role:** Critic / Auditor
**Goal:** Find problems, gaps, inconsistencies in the output

---

## Input Parameters

| Parameter | Source | Required |
|-----------|--------|----------|
| `methods` | Parsed from `<!-- DEEP_VERIFY -->` | Yes |
| `content` | Current step content being reviewed | Yes |

---

## Behavior

- Analyze the generated content against each method
- Look for: scope drift, missing elements, contradictions, weak assumptions
- Generate FINDINGS with severity ratings and EVIDENCE (quote + location)
- Propose specific FIXES
- Be adversarial toward the content, not the user
- "No findings" requires PROOF OF SEARCH (inverted cost)

---

## Method Format in Step File

```markdown
<!-- DEEP_VERIFY -->
70,sanity,Scope Integrity Check,Verify artifact addresses FULL scope...,original task → classification → drift
74,sanity,Grounding Check,List ALL assumptions (explicit AND hidden)...,assumptions → hidden → critical
73,sanity,Coherence Check,Check definitions stability and contradictions...,definitions → contradictions
```

**Columns:** `num,category,method_name,description,output_pattern`

---

## Execution Protocol

1. Parse `<!-- DEEP_VERIFY -->` methods from step
2. For each method:
   - Create brief SEARCH PLAN (what to look for, where)
   - Apply method as AUDIT CRITERIA against content
   - Search for violations, gaps, weaknesses
   - Document with EVIDENCE: quote + location
   - Classify as PASS / WARN / FAIL
3. For methods with NO FINDINGS:
   - Provide PROOF OF SEARCH (quotes showing you read the content)
   - State closest-to-issue found and why dismissed
4. **Quick Anti-Gaming Check (REQUIRED):**
   - List 2 things you COULD HAVE checked but DIDN'T
   - For each: classify as IRRELEVANT / CONSCIOUS-SKIP / UNCONSCIOUS-SKIP
   - If UNCONSCIOUS-SKIP found: flag it in summary
5. Present consolidated findings report
6. Ask: **"Address findings? [Y] All / [S] Select / [N] Skip"**
7. If Y/S: Apply fixes to content
8. Ask: **"Want deeper analysis? [F] Full / [N] Done"**
9. If F: Load `workflow.md` (full verification)
10. Return to checkpoint menu

---

## Output Format

```markdown
## Quick Verify Results

**Methods Applied:** {method_names}

---

### Findings

#### #{num} {method_name}: [PASS|WARN|FAIL]

**Search Plan:** [what I looked for, where]

**IF FINDINGS:**
| Severity | Problem | Evidence | Fix |
|----------|---------|----------|-----|
| CRITICAL | [issue] | "[quote]" — line __ | [fix] |
| IMPORTANT | [issue] | "[quote]" — line __ | [fix] |

**IF NO FINDINGS:**
Proof of search: "[quote from section A]" — line __
Closest-to-issue: "[quote]" — dismissed because [reason]

---

### Quick Anti-Gaming Check

**Things I COULD HAVE checked but DIDN'T:**
| Potential Check | Classification | Reason |
|-----------------|----------------|--------|
| [thing 1] | IRRELEVANT / CONSCIOUS-SKIP / UNCONSCIOUS-SKIP | [why] |
| [thing 2] | IRRELEVANT / CONSCIOUS-SKIP / UNCONSCIOUS-SKIP | [why] |

**Flagged UNCONSCIOUS-SKIPs:** [list or "none"]

---

### Summary

**Overall Status:** [PASS | NEEDS ATTENTION | REQUIRES FIXES]
**Issues Found:** {critical} critical, {important} important, {minor} minor
**Anti-Gaming:** {unconscious_skips} flagged
**Recommendations:**
- {specific action items}

---

**Address findings?**
[Y] Apply all fixes
[S] Select specific fixes
[N] Skip — content is acceptable

**Want deeper analysis?**
[F] Full verify — comprehensive method selection
[N] Done — return to checkpoint
```

---

## Guidelines

**DO:**
- Be adversarial toward the CONTENT
- Find real problems, not trivial ones
- Provide specific evidence with quotes + locations
- Suggest concrete fixes
- Require proof when claiming "no issues"

**DON'T:**
- Soften findings to be polite
- Generate vague or generic feedback
- Claim "no issues" without proof of search
- Skip methods that might find problems

---

## Return Protocol

After presenting results:
1. Ask for user response (address findings)
2. Apply changes if accepted
3. Offer tiered escalation:
   - **[F] Full** → Load `workflow.md`
   - **[N] Done** → Return to checkpoint menu
