# BMAD Step File Guidelines

**Version:** 1.0
**Module:** bmb (BMAD Builder)
**Purpose:** Definitive guide for creating BMAD workflow step files

---

## Overview

BMAD workflow step files follow a strict structure to ensure consistency, progressive disclosure, and mode-aware routing. Every step file MUST adhere to these guidelines.

---

## File Size Optimization

**CRITICAL:** Keep step files **LT 200 lines** (250 lines absolute maximum).

If a step exceeds this limit:
- Consider splitting into multiple steps
- Extract content to `/data/` reference files
- Optimize verbose explanations

---

## Required Frontmatter Structure

CRITICAL: Frontmatter should only have items that are used in the step file!

```yaml
---
name: 'step-2-foo.md'
description: 'Brief description of what this step accomplishes'

# File References ## CRITICAL: Frontmatter references or variables should only have items that are used in the step file!
outputFile: {bmb_creations_output_folder}/output-file-name.md
nextStepFile: './step-3-bar.md'

# Task References
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'

# Advanced Elicitation Configuration
aeList: '[list-name]'  # Choose from 17 ae-lists (see checkpoint-exec.md)
---
```

### Frontmatter Field Descriptions

| Field            | Required  | Description                                              |
| ---------------- | --------- | -------------------------------------------------------- |
| `name`           | Yes       | Step identifier (kebab-case)                             |
| `description`    | Yes       | One-line summary of step purpose                         |
| `outputFile`     | Yes       | Where results are documented                             |
| `checkpointMenu` | Yes       | Path to checkpoint-menu.md                               |
| `aeList`         | Yes       | Domain-specific AE method list for Quick Verify/Discover |

---

## Document Structure

### 1. Title

```markdown
# Step X: [Step Name]
```

### 2. STEP GOAL

```markdown
## STEP GOAL:

[Single sentence stating what this step accomplishes]
```

### 3. Role Reinforcement

```markdown
### Role Reinforcement:

- ✅ You are a [specific role] who [does what]
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring [your expertise], user brings [their expertise], together we [achieve goal]
- ✅ Maintain [tone/approach] throughout
```

### 4. Language Preference

```markdown
### Language Preference:
The user has chosen to communicate in the **{language}** language.
You MUST respond in **{language}** throughout this step.
```

**IMPORTANT:** Read `userPreferences.language` from tracking file (agentPlan, validationReport, etc.) and enforce it.

### 5. Step-Specific Rules

```markdown
### Step-Specific Rules:

- 🎯 Focus only on [specific scope]
- 🚫 FORBIDDEN to [prohibited action]
- 💬 Approach: [how to engage]
- 📋 Ensure [specific outcome]
```

### 6. EXECUTION PROTOCOLS

```markdown
## EXECUTION PROTOCOLS:

- [What to do - use verbs]
- [Another action]
- 🚫 FORBIDDEN to [prohibited action]
```

### 7. CONTEXT BOUNDARIES

```markdown
## CONTEXT BOUNDARIES:

- Available context: [what's available]
- Focus: [what to focus on]
- Limits: [boundaries]
- Dependencies: [what this step depends on]
```

### 8. Sequence of Instructions

```markdown
## Sequence of Instructions:

### 1. [First Action]

**[Action Description]**

### 2. [Second Action]

...
```

### 9. CHECKPOINT MENU

```markdown
### X. Present Checkpoint Menu

**Read and execute `{checkpointMenu}` file** - this file contains the menu options (Q/V/D/P/C) and their handling logic.

**[C] Continue action for this step:** Save to `{outputFile}` and load `{nextStepFile}`

#### Menu Handling:
- IF Q/V/D/P: Handled by `{checkpointMenu}` file instructions
- IF C (Continue): Save content to {outputFile}, update frontmatter, load {nextStepFile}
- IF other input: Respond helpfully, re-display checkpoint menu

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After Q/V/D/P execution completes, return to checkpoint menu
- User can chat or ask questions - respond then re-display menu

## CRITICAL STEP COMPLETION NOTE
ONLY WHEN [C continue option] is selected and [completion conditions], will you then load and read fully `{nextStepFile}`...
```

**Note:** The `{checkpointMenu}` is a frontmatter variable pointing to checkpoint-menu.md file. Agent MUST read this file and execute its instructions. The [C] Continue action is step-specific.

### 10. SYSTEM SUCCESS/FAILURE METRICS

```markdown
## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:
- [Success criterion 1]
- [Success criterion 2]
- ...

### ❌ SYSTEM FAILURE:
- [Failure criterion 1]
- [Failure criterion 2]
- ...

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
```

---

## Checkpoint Menu Convention

BMAD workflows use the checkpoint menu system (`checkpoint-menu.md`):

| Option | Meaning        | Behavior                                                    |
| ------ | -------------- | ----------------------------------------------------------- |
| **Q**  | Quick          | Fast verification using aeList from step frontmatter        |
| **V**  | Verify         | Deep verification using aeList from step frontmatter        |
| **D**  | Discover       | Deep discovery exploration using aeList from step frontmatter |
| **P**  | Party Mode     | Execute party-mode workflow, then redisplay menu            |
| **C**  | Continue       | Save output, update frontmatter, load nextStepFile          |

**Rules:**
- Q/V/D/P options are displayed by loading `{checkpointMenu}`
- [C] Continue is defined separately in each step file (step-specific action)
- After Q/V/D/P → return to checkpoint menu
- After C → proceed to next step
- The `aeList` frontmatter property determines which method list is used for Q/V/D

---

## Progressive Disclosure

**Core Principle:** Each step only knows about its immediate next step.

### Implementation

1. **Never pre-load future steps** - Only load `nextStepFile` when user selects [C]

2. **Mode-aware routing** (for shared steps):
   ```markdown
   ## MODE-AWARE ROUTING:
   ### If entered from CREATE mode:
   Load ./s-next-step.md

   ### If entered from EDIT mode:
   Load ./e-next-step.md

   ### If entered from VALIDATE mode:
   Load ./v-next-step.md
   ```

3. **Read tracking file first** - Always read the tracking file (agentPlan, validationReport, etc.) to determine current mode and routing

---

## Mode-Aware Routing (Shared Steps)

Shared steps (`s-*.md`) must route based on the mode stored in the tracking file.

### Tracking File Frontmatter

```yaml
---
mode: create              # or edit | validate
stepsCompleted:
  - c-01-brainstorm.md
  - s-01-discovery.md
# ... other tracking fields
---
```

### Routing Implementation

```markdown
## COMPLETION ROUTING:

1. Append `./this-step-name.md` to {trackingFile}.stepsCompleted
2. Save content to {trackingFile}
3. Read {trackingFile}.mode
4. Route based on mode:

### IF mode == create:
Load ./s-next-create-step.md

### IF mode == edit:
Load ./e-next-edit-step.md

### IF mode == validate:
Load ./s-next-validate-step.md
```

---

## File Naming Conventions

### Tri-Modal Workflows

| Prefix | Meaning            | Example                |
| ------ | ------------------ | ---------------------- |
| `c-`   | Create-specific    | `c-01-brainstorm.md`   |
| `e-`   | Edit-specific      | `e-01-load-analyze.md` |
| `v-`   | Validate-specific  | `v-01-load-review.md`  |
| `s-`   | Shared by 2+ modes | `s-05-activation.md`   |

### Numbering

- Within each prefix type, number sequentially
- Restart numbering for each prefix type (c-01, e-01, v-01, s-01)
- Use letters for sub-steps (s-06a, s-06b, s-06c)

---

## Language Preference Enforcement

**CRITICAL:** Every step MUST respect the user's chosen language.

### Implementation

```markdown
### Language Preference:
The user has chosen to communicate in the **{language}** language.
You MUST respond in **{language}** throughout this step.
```

### Reading Language Preference

From tracking file frontmatter:
```yaml
---
userPreferences:
  language: spanish    # or any language
---
```

### Rules

- **MUST** read language preference from tracking file at step start
- **MUST** respond in user's chosen language for ALL content
- **MUST** include menu options in user's chosen language
- **EXCEPTION:** Technical terms, file names, and code remain in English

---

## Data File References

When step content becomes too large (>200 lines), extract to `/data/` files:

### When to Extract

- Step file exceeds 200 lines
- Content is reference material (rules, examples, patterns)
- Content is reused across multiple steps

### How to Reference

```markdown
## Reference Material:

Load and reference: `../data/{data-file-name}.md`

Key points from that file:
- [Point 1]
- [Point 2]
```

### Data File Best Practices

- Keep data files focused on single topic
- Use clear, descriptive names
- Include examples and non-examples
- Optimize for LLM usage (concise, structured)

---

## Common Pitfalls to Avoid

### ❌ DON'T:

- Pre-load future steps (violates progressive disclosure)
- Exceed 250 lines without splitting
- Forget to update `stepsCompleted` array
- Ignore user's language preference
- Skip mode checking in shared steps
- Use vague menu option letters (stick to A/P/C plus 1-2 custom)

### ✅ DO:

- Keep files under 200 lines
- Read tracking file first thing
- Route based on `mode` field
- Include A/P in every menu
- Use descriptive step names
- Extract complex content to data files

---

## Template: New Step File

```markdown
---
name: 'step-name'
description: 'What this step does'

# File References
thisStepFile: ./step-name.md
workflowFile: ../workflow.md
outputFile: {bmb_creations_output_folder}/output.md

# Task References
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'

# Advanced Elicitation Configuration
aeList: '[list-name]'  # Choose from 17 ae-lists (see checkpoint-exec.md)
---

# Step X: [Step Name]

## STEP GOAL:

[Single sentence goal]

### Role Reinforcement:

- ✅ You are a [role] who [does what]
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring [expertise], user brings [expertise], together we [achieve]
- ✅ Maintain [tone] throughout

### Language Preference:
The user has chosen to communicate in the **{language}** language.
You MUST respond in **{language}** throughout this step.

### Step-Specific Rules:

- 🎯 Focus only on [scope]
- 🚫 FORBIDDEN to [prohibited action]
- 💬 Approach: [how to engage]
- 📋 Ensure [outcome]

## EXECUTION PROTOCOLS:

- [Action 1]
- [Action 2]
- 🚫 FORBIDDEN to [prohibited action]

## CONTEXT BOUNDARIES:

- Available context: [what's available]
- Focus: [what to focus on]
- Limits: [boundaries]
- Dependencies: [what depends on what]

## Sequence of Instructions:

### 1. [First Action]

**Description of first action**

### 2. [Second Action]

**Description of second action**

...

### X. Present Checkpoint Menu

**[Q] Quick** | **[V] Verify** | **[D] Discover** | **[P] Party Mode** | **[C] Continue**

For Q/V/D/P, execute routing via `{checkpointMenu}`.

**[C] Continue action for this step:** Save to `{outputFile}` and load `{nextStepFile}`

#### Menu Handling:
- IF C (Continue): Save content to {outputFile}, update frontmatter, load {nextStepFile}
- IF other input: Respond helpfully, re-display checkpoint menu

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After V/D execution completes, return to checkpoint menu
- User can chat or ask questions - respond then re-display menu

## CRITICAL STEP COMPLETION NOTE
ONLY WHEN [C continue option] is selected and [conditions], will you then load and read fully `{nextStepFile}`...

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:
- [Success criteria]

### ❌ SYSTEM FAILURE:
- [Failure criteria]

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
```

---

**End of Guidelines**
