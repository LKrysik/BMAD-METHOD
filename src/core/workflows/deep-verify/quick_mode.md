# Quick Verify Mode v7.0

Fast verification using methods from ae-list files.

**Token Cost:** ~500-800 tokens (target)

---

## Purpose

**Subject:** The CONTENT that agent generated in current step
**Agent Role:** Critic / Auditor
**Goal:** Find problems, gaps, inconsistencies in the output

---

## Input Parameters

| Parameter | Source | Required |
|-----------|--------|----------|
| `aeList` | Step frontmatter (via checkpoint-exec) | Yes |
| `content` | Current step content being verified | Yes |
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

### Step 2: Extract Verify Methods

```
1. Find "## Verify Methods" section in ae-list file
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
2. Extract Verify Methods from each
3. Combine into single methods array
4. Remove duplicates (by method number)
```

---

## Execution Protocol

### 1. Announce Methods

```markdown
## Quick Verify

**Using aeList:** {aeList}
**Methods loaded:** {count} verify methods

| # | Method | Focus |
|---|--------|-------|
| {num} | {name} | {pattern} |
...

Beginning verification...
```

### 2. Execute Each Method

For each method from ae-list:

```markdown
### #{num} {method_name}

**Search Plan:** [what I'm looking for based on method description]

**Applying to content...**
```

Then search content and report:

**If issue found:**
```markdown
**FINDING [F-001]** — {SEVERITY} — Confidence: {LEVEL}

**Problem:** {what's wrong}
**Evidence:** "{quote}" — line {N}
**Impact:** {consequence}
**Fix:** {specific action}
```

**If something missing:**
```markdown
**OMISSION [O-001]** — {SEVERITY} — Confidence: {LEVEL}

**Missing:** {what should exist}
**Expected because:** {method says / context shows}
**Impact:** {consequence}
**Add:** {what and where}
```

**If element passes:**
```markdown
**CLEAR:** #{num} {method_name} — no issues found
**Proof of search:** "{quote from content}" — line {N}
```

### 3. Quick Anti-Gaming Check (REQUIRED)

```markdown
### Anti-Gaming Check

**Things I COULD HAVE checked but DIDN'T:**

| Potential Check | Classification | Reason |
|-----------------|----------------|--------|
| {thing 1} | IRRELEVANT / CONSCIOUS-SKIP / UNCONSCIOUS-SKIP | {why} |
| {thing 2} | IRRELEVANT / CONSCIOUS-SKIP / UNCONSCIOUS-SKIP | {why} |

**Flagged UNCONSCIOUS-SKIPs:** {list or "none"}
```

### 4. Present Results Summary

```markdown
## Quick Verify Results

**aeList used:** {aeList}
**Methods applied:** {method_names}

---

### Summary

**Overall Status:** [PASS | NEEDS ATTENTION | REQUIRES FIXES]
**Issues Found:** {critical} critical, {important} important, {minor} minor
**Anti-Gaming:** {unconscious_skips} flagged

### Issues Table

| ID | Type | Severity | Problem | Fix |
|----|------|----------|---------|-----|
| F-001 | FINDING | {level} | {issue} | {fix} |
| O-001 | OMISSION | {level} | {missing} | {add} |

### Recommendations

- {specific action item 1}
- {specific action item 2}

---

**What would you like to do?**

[F] Fix issues — apply all suggested fixes
[S] Select fixes — choose which to apply
[N] No changes — content is acceptable

**Want deeper analysis?**

[V] Full verify — comprehensive verification workflow
[D] Done — return to step menu
```

### 5. Handle User Response

**If [F] Fix all:**
1. Apply all suggested fixes to content
2. Show changes made
3. Return to step menu

**If [S] Select:**
1. List each fix with checkbox
2. User selects which to apply
3. Apply selected fixes
4. Return to step menu

**If [N] No changes:**
1. Keep content as-is
2. Return to step menu

**If [V] Full verify:**
1. Load deep-verify/workflow.md
2. Pass same parameters
3. Execute full verification

**If [D] Done:**
1. Return to calling step's menu

---

## Guidelines

**DO:**
- Be adversarial toward the CONTENT (not the user)
- Find real problems, not trivial ones
- Provide specific evidence with quotes + line numbers
- Suggest concrete, actionable fixes
- Require proof when claiming "no issues"

**DON'T:**
- Soften findings to be polite
- Generate vague or generic feedback
- Claim "no issues" without proof of search
- Skip methods that might find problems
- Answer for the user

---

## Return Protocol

After presenting results and handling user choice:
1. Apply any accepted changes
2. Return to calling step's A/P/C menu
3. Do NOT stay in quick mode
