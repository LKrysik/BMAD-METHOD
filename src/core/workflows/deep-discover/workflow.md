# Deep Discover

Build complete understanding of what user truly needs.

---

name: Deep Discover
description: Discovery process with Quick and Guided modes — knowledge grows iteratively

---

## Goal

Build KNOWLEDGE about what user truly needs. Challenge assumptions, discover real needs, enrich incomplete ideas.

## Method Source

```
{project-root}/_bmad/core/methods/methods.csv
```

---

## Start

### 1. Receive content

User provides: context, artifact, problem, idea, plan — anything to explore.

If not provided, ask:
- What do you want to explore or develop?
- Where do you feel uncertain?

---

### 2. Choose discovery mode

```
## Deep Discover

**Content:** [what user provided]
**Initial impression:** [vague idea / formed plan / technical problem / multi-stakeholder]

How do you want to explore?

[Q] Quick — I discover and challenge automatically, you review results
[G] Guided — We decide together what to explore and how
[X] Exit
```

**HALT:** Wait for user choice.

- If [Q] → Go to QUICK MODE
- If [G] → Go to GUIDED MODE

---

## QUICK MODE

Agent performs all steps automatically, presents results for review.

### Q1. Self-discipline

I select 2-3 methods to keep myself honest:

```
**My self-discipline methods:**
- #[N] [name] — prevents [what]
- #[N] [name] — catches [what]

I will apply these throughout and before concluding.
```

### Q2. Analyze content

I identify what kind of content this is and what's missing:

```
**Content analysis:**
- Type: [vague idea / formed plan / incomplete concept / technical problem]
- Clear parts: [what I understand]
- Unclear parts: [what needs exploration]
- Missing: [what's not addressed]
```

### Q3. Select discovery methods

Based on content, I choose methods for each need:

```
**Discovery plan:**

| Need | Method | Why |
|------|--------|-----|
| [surface assumptions] | #[N] [name] | [reason] |
| [challenge plan] | #[N] [name] | [reason] |
| [expand idea] | #[N] [name] | [reason] |
```

### Q4. Execute discovery — Iteration 1

For each method, I:
1. Formulate questions according to method pattern
2. Ask user questions
3. **WAIT** for response (do not answer for them)
4. Record what I learned

After questions answered:

```
**What I now know:**
- [insight 1]
- [insight 2]

**What I still don't know:**
- [gap 1]
- [gap 2]

**Certainty:** HIGH / MODERATE / LOW
```

### Q5. Decide: continue or conclude?

Based on current knowledge:

```
**Knowledge assessment:**
- Know enough to proceed: [yes/no]
- Major gaps remaining: [list]
- Direction needed: [DISCOVER more / CHALLENGE assumptions / ENRICH idea / DONE]
```

If not done → select more methods and iterate (return to Q4)
If done → proceed to Q6

### Q6. Apply self-discipline

Before concluding, I apply methods from Q1 to my own work:

```
**Self-check results:**
- [Method]: [what I found about my own work]
- Did I tell user what they wanted to hear? [yes/no — evidence]
- Did I skip hard questions? [yes/no — what]
- Adjustments needed: [yes/no — what]
```

### Q7. Present results

```
## Discovery Results

**Content explored:** [what was provided]

**Understanding:**
[What user truly needs — in their words, not mine]

**Certainty:**
| Element | Certainty | Basis |
|---------|-----------|-------|
| [element] | HIGH/MOD/LOW | [evidence] |

**Identified risks/weaknesses:**
- [risk 1]
- [risk 2]

**Conscious gaps (accepted):**
- [gap 1]

**Agent proposals:**
Based on discovery, consider:
1. [something user didn't say but emerges from context]
2. [alternative they may have overlooked]

---

## Your Review

Please check:
1. Does this capture what you truly need?
2. Any insight I missed?
3. Do risks make sense?
4. Your confidence in this understanding (1-10)?

[C] Continue — explore more
[E] Edit — correct something
[T] Templates — choose output format
[X] Exit — done
```

**HALT:** Wait for user review and choice.

---

## GUIDED MODE

User and agent decide together at each step.

### G1. Self-discipline

**What we're doing:** Selecting methods that will keep ME (the agent) honest during discovery. These prevent me from telling you what you want to hear.

```
## Self-Discipline Setup

Before I explore, I need methods to check my own work.

I suggest these methods to keep myself honest:

| Method | What it catches |
|--------|-----------------|
| #[N] [name] | [prevents what] |
| #[N] [name] | [catches what] |

[OK] Use these methods
[C] Browse categories to choose different ones
[X] Exit
```

**HALT:** Wait for user choice.

---

### G2. Understand the content

**What we're doing:** Analyzing what you provided to understand what kind of exploration is needed.

```
## Understanding Your Content

I need to understand what you've given me before I can help explore it.

[AUTO] Do this automatically — show me results
[MANUAL] Let me explain what I'm working with
[X] Exit
```

**HALT:** Wait for user choice.

**If AUTO:** Agent analyzes and presents:

```
## Content Analysis

**What you provided:** [description]

**Type:** [vague idea / formed plan / incomplete concept / technical problem / multi-stakeholder]

**What's clear:**
- [clear element 1]
- [clear element 2]

**What's unclear or missing:**
- [unclear 1]
- [missing 1]

**My initial questions:**
- [question about unclear part]
- [question about gap]

[OK] This analysis is correct
[A] Add something I missed
[R] Remove something wrong
[X] Exit
```

**HALT:** Wait for user confirmation.

**If MANUAL:** User explains, agent asks clarifying questions.

---

### G3. Decide what to explore

**What we're doing:** Deciding which direction to take — discover real needs, challenge assumptions, or enrich incomplete ideas.

```
## What Should We Explore?

Based on content analysis, I see these options:

| Direction | When to use | Fits your content? |
|-----------|-------------|-------------------|
| **DISCOVER** | User unclear on what they want | [yes/no — why] |
| **CHALLENGE** | Plan exists but assumptions untested | [yes/no — why] |
| **ENRICH** | Idea is good but incomplete | [yes/no — why] |

**My recommendation:** [direction] because [reason]

[OK] Go with recommendation
[D] DISCOVER — surface real needs
[C] CHALLENGE — stress-test assumptions
[E] ENRICH — expand and complete
[AUTO] You decide for all iterations
[X] Exit
```

**HALT:** Wait for user choice.

---

### G4. Choose methods for this direction

**What we're doing:** Selecting specific methods from methods.csv to explore in chosen direction.

```
## How Should I Explore?

For [DIRECTION], I'll use these methods:

| Method | What it does | Why for your content |
|--------|--------------|---------------------|
| #[N] [name] | [description] | [specific reason] |
| #[N] [name] | [description] | [specific reason] |

[OK] Use these methods
[A] Add method
[R] Remove method
[AUTO] You decide, proceed
[X] Exit
```

**HALT:** Wait for user choice.

---

### G5. Execute discovery

**What we're doing:** Applying selected methods — I'll ask questions, you answer, and we build understanding together.

For each method:

```
## Method: #[N] [Name]

**Purpose:** [what this method does]

**Questions for you:**

1. [question according to method pattern]
2. [question]
3. [question]

Please answer each question. Take your time.
```

**HALT:** Wait for user answers.

After user answers:

```
## What I Learned

**From your answers:**
- [insight 1]
- [insight 2]

**What I now know:**
- [knowledge gained]

**What I still don't know:**
- [remaining gap]

**Certainty:** HIGH / MODERATE / LOW

Progress: [N]/[N] methods applied
```

---

### G6. Decide: continue or conclude?

**What we're doing:** Checking if we have enough understanding or need to explore more.

```
## Knowledge Check

**Current understanding:**
- [summary of what we know]

**Remaining gaps:**
- [what's still unclear]

**Certainty level:** [HIGH/MODERATE/LOW]

What do you want to do?

[S] Select more methods — explore further
[D] Done — understanding is sufficient
[C] Change direction — switch from [current] to different approach
[X] Exit
```

**HALT:** Wait for user choice.

- If [S] → return to G4
- If [C] → return to G3
- If [D] → proceed to G7
- If [X] → exit

---

### G7. Self-discipline check

**What we're doing:** Applying the methods from G1 to my own discovery work before concluding.

```
## Checking My Own Work

Applying self-discipline methods:

### #[N] [Method name]
[Execute method on own work]
**Result:** [what I found]

### #[N] [Method name]
[Execute method on own work]
**Result:** [what I found]

**Did I tell you what you wanted to hear?** [assessment]
**Did I skip hard questions?** [assessment]
**Adjustments needed:** [yes/no]
```

If adjustments needed → return to G5 or G6.

---

### G8. Confirm with user

**What we're doing:** Making sure you agree with the understanding we built before finalizing.

```
## Discovery Complete

**Questions for you:**

1. Do you know what you want now? (answer in your own words)
2. What assumptions are we making?
3. What risks or weaknesses do you see?
4. What are we consciously skipping or accepting as gaps?
5. How certain are you, scale 1-10?

Please answer each question — this confirms our understanding is complete.
```

**HALT:** Wait for user answers.

If user cannot answer → return to G6.

---

### G9. Present results

Same format as Q7 (Quick mode results).

---

## Key Principles

- **Two modes:** Quick for efficiency, Guided for control
- **Self-discipline continuous:** Agent checks itself throughout
- **User is source of truth:** Agent helps discover, user confirms
- **Knowledge grows iteratively:** Each method adds understanding
- **Directions adapt:** DISCOVER → CHALLENGE → ENRICH based on state

---

## Quick Reference

| Mode | When to use |
|------|-------------|
| **Quick** | Trust agent judgment, want fast exploration |
| **Guided** | Want control over direction and methods |

| Direction | When to use |
|-----------|-------------|
| **DISCOVER** | User unclear on what they want |
| **CHALLENGE** | Plan exists, assumptions untested |
| **ENRICH** | Idea good but incomplete |

| Step | Quick | Guided |
|------|-------|--------|
| Self-discipline | Auto | User confirms |
| Content analysis | Auto | Auto or Manual |
| Direction | Auto | User chooses |
| Methods | Auto | User confirms/edits |
| Execution | Auto (asks questions) | Step by step |
| Continue/conclude | Auto | User decides |
| Self-check | Auto | Shown |
| Confirm | User reviews | User answers questions |
