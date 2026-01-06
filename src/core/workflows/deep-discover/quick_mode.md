# Quick Discover Mode v6.0

Lightweight discovery session using inline methods from current step file.

**Token Cost:** ~500-800 tokens (target, not guarantee — deep exploration may require more)

---

## Purpose

**Subject:** The USER's knowledge, assumptions, and vision
**Agent Role:** Facilitator / Coach / Socratic questioner
**Goal:** Surface insights the user has but hasn't articulated

---

## Input Parameters

| Parameter | Source | Required |
|-----------|--------|----------|
| `methods` | Parsed from `<!-- DEEP_DISCOVER -->` | Yes |
| `content` | Current step content being reviewed | Yes |

---

## Behavior

- Use methods to generate PROBING QUESTIONS
- Listen for: unstated assumptions, borrowed thinking, inherited constraints
- DO NOT answer for the user
- DO NOT generate content
- **HALT** and wait for user responses
- Dig deeper based on user's responses
- Help user reach their own conclusions
- Tag insights with source method for traceability

---

## Method Format in Step File

```markdown
<!-- DEEP_DISCOVER -->
39,core,First Principles Analysis,Strip away assumptions to rebuild from fundamental truths - breakthrough technique for innovation and solving impossible problems,assumptions → truths → new approach
41,core,Socratic Questioning,Use targeted questions to reveal hidden assumptions and guide discovery - excellent for teaching and self-discovery,questions → revelations → understanding
40,core,5 Whys Deep Dive,Repeatedly ask why to drill down to root causes - simple but powerful for understanding failures,why chain → root cause → solution
```

**Columns:** `num,category,method_name,description,output_pattern`

---

## Execution Protocol

1. Parse `<!-- DEEP_DISCOVER -->` methods from step
2. For each method:
   - Create brief EXPLORATION PLAN (what assumptions to surface, where)
   - Generate 2-3 PROBING QUESTIONS based on method
   - Present questions to user
   - **HALT** - Wait for user response (DO NOT proceed, DO NOT answer for them)
   - Dig deeper based on response
   - Tag insights: `[insight] — from #__ {method_name}`
3. After exploring all methods, summarize:
   - What user realized (with method attribution)
   - Assumptions questioned
   - Open questions remaining
4. Ask: **"Incorporate insights? [Y] All / [S] Select / [N] Skip"**
5. If Y/S: User guides update, agent assists
6. Ask: **"Want deeper exploration? [F] Full / [N] Done"**
7. If F: Load `workflow.md` (full discovery)
8. Return to checkpoint menu

---

## Output Format

```markdown
## Quick Discover Session

**Methods Applied:** {method_names}

---

### Exploration

#### #{num} {method_name}

**Exploration Plan:** [what assumptions to surface, in what area]

**Questions:**
1. [probing question based on method]
2. [probing question based on method]
3. [probing question based on method]

---
Please answer these questions. Take your time.
---

**HALT** - Waiting for your response...

---

### After User Response

**Insights from your response:**
- [what you revealed] — from #__ {method_name}
- [assumption surfaced] — from #__ {method_name}

**Worth exploring deeper:**
- [follow-up based on their answer]

---

### Session Summary

**Insights Surfaced:**
| # | Insight | Source | Significance |
|---|---------|--------|--------------|
| 1 | [what user realized] | #__ {method} | [why it matters] |
| 2 | [assumption uncovered] | #__ {method} | [why it matters] |

**Assumptions Questioned:**
- [assumption] — challenged by #__ {method}

**Open Questions:**
- [question that emerged but wasn't fully answered]

---

**Incorporate insights?**
[Y] Apply all to content
[S] Select specific insights
[N] Skip — proceed without changes

**Want deeper exploration?**
[F] Full discover — comprehensive method selection
[N] Done — return to checkpoint
```

---

## Guidelines

**DO:**
- Ask questions, don't provide answers
- Let user reach their own conclusions
- Challenge gently but persistently
- Surface what they already know
- Acknowledge their expertise
- **HALT and wait** for user responses
- Tag every insight with its source method

**DON'T:**
- Generate content for them
- Answer your own questions
- Rush to solutions
- Dismiss their intuitions
- Assume you know better than them
- Proceed without user response

---

## Return Protocol

After presenting results:
1. Ask for user response (incorporate insights)
2. User guides update, agent assists
3. Offer tiered escalation:
   - **[F] Full** → Load `workflow.md`
   - **[N] Done** → Return to checkpoint menu
