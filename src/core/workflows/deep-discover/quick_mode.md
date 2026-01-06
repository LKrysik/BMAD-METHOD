# Quick Discover Mode v7.0

Fast discovery session using methods from ae-list files.

**Token Cost:** ~500-800 tokens (target)

---

## Purpose

**Subject:** The USER's knowledge, assumptions, and vision
**Agent Role:** Facilitator / Coach / Socratic questioner
**Goal:** Surface insights the user has but hasn't articulated

---

## Input Parameters

| Parameter | Source | Required |
|-----------|--------|----------|
| `aeList` | Step frontmatter (via checkpoint-exec) | Yes |
| `content` | Current step content being explored | Yes |
| `stepPath` | Path to current step file | Yes |

---

## Method Loading Protocol

### Step 1: Resolve aeList to File(s)

```
1. Parse aeList parameter (may be comma-separated)
2. For each list name:
   path = {project-root}/_bmad/core/methods/ae-lists/{name}.md
3. Load file content
4. If file not found → WARN and try next, fallback to 'general'
```

### Step 2: Extract Discover Methods

```
1. Find "## Discover Methods" section in ae-list file
2. Parse each method entry:
   - ### #{num} {method_name}
   - Description paragraph
   - **Pattern:** line
3. Store methods array for execution
```

### Step 3: Handle Multiple Lists

```
If multiple ae-lists specified:
1. Load all files
2. Extract Discover Methods from each
3. Combine into single methods array
4. Remove duplicates (by method number)
```

---

## Execution Protocol

### 1. Announce Session

```markdown
## Quick Discover

**Using aeList:** {aeList}
**Methods loaded:** {count} discover methods

| # | Method | Focus |
|---|--------|-------|
| {num} | {name} | {pattern} |
...

Let's explore your thinking...
```

### 2. Execute Each Method

For each method from ae-list:

```markdown
### #{num} {method_name}

**Exploration Plan:** [what assumptions/insights to surface based on method]

**Questions for you:**

1. {probing question based on method pattern}
2. {probing question based on method pattern}
3. {probing question based on method pattern}

---

Please answer these questions. Take your time.

---

**HALT** - Waiting for your response...
```

**CRITICAL: DO NOT proceed until user answers. DO NOT answer for them.**

### 3. Process User Response

After user answers:

```markdown
### Insights from #{num} {method_name}

**What you revealed:**
- {insight from their answer} — from #{num}
- {assumption surfaced} — from #{num}

**Worth exploring deeper:**
- {follow-up based on their answer}

**Certainty level:** HIGH / MODERATE / LOW
```

### 4. Session Summary

After all methods explored:

```markdown
## Quick Discover Results

**aeList used:** {aeList}
**Methods applied:** {method_names}

---

### Insights Surfaced

| # | Insight | Source | Significance |
|---|---------|--------|--------------|
| 1 | {what user realized} | #{num} {method} | {why it matters} |
| 2 | {assumption uncovered} | #{num} {method} | {why it matters} |

### Assumptions Questioned

- {assumption} — challenged by #{num} {method}
- {assumption} — challenged by #{num} {method}

### Open Questions

- {question that emerged but wasn't fully answered}
- {area that needs more exploration}

### Agent Proposals

Based on discovery, consider:
1. {something user didn't say but emerges from context}
2. {alternative they may have overlooked}

---

**What would you like to do?**

[Y] Apply insights — incorporate into content
[S] Select insights — choose which to apply
[N] No changes — keep exploring mentally

**Want deeper exploration?**

[D] Full discover — comprehensive discovery workflow
[X] Done — return to step menu
```

### 5. Handle User Response

**If [Y] Apply all:**
1. User guides how to incorporate insights
2. Agent assists with updates
3. Return to step menu

**If [S] Select:**
1. List each insight
2. User selects which to incorporate
3. Incorporate selected insights
4. Return to step menu

**If [N] No changes:**
1. Keep content as-is (insights are mental)
2. Return to step menu

**If [D] Full discover:**
1. Load deep-discover/workflow.md
2. Pass same parameters
3. Execute full discovery

**If [X] Done:**
1. Return to calling step's menu

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
- Put words in their mouth

---

## Return Protocol

After presenting results and handling user choice:
1. Incorporate any accepted insights (user guides, agent assists)
2. Return to calling step and re-display checkpoint menu
3. Do NOT stay in quick mode
