---
name: 'step-12-epics'
description: 'Define development epics and high-level story breakdown'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: '{workflow_path}/steps/step-12-epics.md'
nextStepFile: '{workflow_path}/steps/step-13-metrics.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'
epicsOutputFile: '{output_folder}/epics.md'

# Task References
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'

# Advanced Elicitation Configuration
aeList: 'planning'

---

# Step 12: Epic Structure

**Progress: Step 12 of 14** - Next: Success Metrics

## STEP GOAL:

Translate the game features defined throughout the GDD into development epics, each with a clear scope and list of high-level stories. This provides the foundation for sprint planning.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Epics bridge design (GDD) to implementation (sprints)
- Epic scope should be completable in 1-4 sprints

### Step-Specific Rules:

- Focus on feature groupings, not detailed task breakdowns
- FORBIDDEN to generate epics without user input
- Each epic should deliver playable value
- Stories are high-level here - detailed stories come in sprint planning

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present checkpoint menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]` before loading next step
- FORBIDDEN to load next step until C is selected

## CHECKPOINT

**At checkpoint:** Read and execute `{checkpointMenu}` file - handles menu display and user selection.

**[C] Continue action for this step:** Save to `{outputFile}` and load `{nextStepFile}`.

## CONTEXT BOUNDARIES:

- All GDD content from previous steps available
- Epics should map to game pillars and features
- This creates both GDD epic summary and detailed epics.md file

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Review Game Features for Epic Candidates

**Analyze the GDD content:**

"Let's organize {{game_name}}'s features into development epics.

Based on everything we've defined, here are the major feature areas I've identified:

**From Core Gameplay:** {{core_loop_features}}
**From Mechanics:** {{mechanics_features}}
**From Game Type Specifics:** {{game_type_features}}
**From Progression:** {{progression_features}}
**From Level Design:** {{level_features}}
**From Art/Audio:** {{art_audio_features}}
**From Technical:** {{technical_features}}

**Epic Organization Principles:**

1. **Playable Milestones:** Each epic should result in something playable
2. **Dependency Awareness:** Some epics must come before others
3. **Vertical Slices:** Early epics often prove core gameplay
4. **Scope Control:** 1-4 sprints per epic is ideal

How would you like to group these features into epics?"

### 2. Define Epic Structure

**For each epic, elicit:**

"Let's define **Epic {{number}}: {{epic_name}}**

**Epic Definition Questions:**

1. **Goal:** What does completing this epic achieve?
2. **Includes:** What features/systems are in this epic?
3. **Excludes:** What specifically is NOT in this epic?
4. **Dependencies:** What epics must come before this?
5. **Deliverable:** What's the playable result?

Describe this epic."

### 3. Generate High-Level Stories

**For each epic, generate story candidates:**

"For **Epic {{number}}: {{epic_name}}**, let's identify high-level stories.

**Story Principles:**

- Each story is independently valuable
- Stories should be completable in 1-3 days
- Use format: 'As a [player], I can [action] so that [benefit]'

What are the main stories in this epic?"

### 4. Determine Epic Order and Dependencies

**Guide user through sequencing:**

"Now let's determine the order for these epics.

**Common Epic Sequences:**

1. **Foundation First:** Core systems before content
2. **Vertical Slice Early:** Prove gameplay ASAP
3. **Polish Last:** Visual/audio polish after mechanics solid

**Your epics:**
{{list_of_epics}}

What order makes sense for {{game_name}}?"

### 5. Generate Epic Content

Based on the conversation, prepare two outputs:

**A. GDD Epic Summary (goes in gdd.md):**

```markdown
## Development Epics

### Epic Overview

| #   | Epic Name | Scope | Dependencies | Est. Stories |
| --- | --------- | ----- | ------------ | ------------ |

{{epic_table}}

### Recommended Sequence

{{epic_sequence_with_rationale}}

### Vertical Slice

**The first playable milestone:** {{vertical_slice_description}}
```

**B. Detailed Epics File (goes in epics.md):**

```markdown
# {{game_name}} - Development Epics

## Epic Overview

{{epic_overview_table}}

---

## Epic 1: {{epic_1_name}}

### Goal

{{epic_1_goal}}

### Scope

**Includes:**
{{epic_1_includes}}

**Excludes:**
{{epic_1_excludes}}

### Dependencies

{{epic_1_dependencies}}

### Deliverable

{{epic_1_deliverable}}

### Stories

{{epic_1_stories_list}}

---

{{repeat_for_each_epic}}
```

### 6. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Epic Structure based on our conversation.

**For the GDD (gdd.md):**
[Show GDD epic summary]

**For the Epics file (epics.md):**
[Show detailed epics structure]

**Validation Check:**

- Does each epic deliver playable value?
- Is the sequence achievable?
- Are dependencies clear?

**Read and execute `{checkpointMenu}` file** - this file contains the menu options (Q/V/D/P/C) and their handling logic.

**[C] Continue action for this step:** Save to `{outputFile}` and load `{nextStepFile}`

#### Menu Handling:
- IF C (Continue): Save content, update frontmatter, load {nextStepFile}
- IF other input: Respond helpfully, re-display checkpoint menu

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After Q/V/D/P execution completes, return to checkpoint menu
- User can chat or ask questions - respond then re-display menu

### 7. Handle Menu Selection

#### IF C (Continue):

- Append epic summary to `{outputFile}`
- Write detailed epics to `{epicsOutputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [both epic content files saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Epics cover all major game features
- Each epic has clear scope and deliverable
- Dependencies identified and sequenced
- Both gdd.md and epics.md updated
- High-level stories drafted for each epic
- Checkpoint menu presented and handled correctly
- Frontmatter updated with stepsCompleted

### SYSTEM FAILURE:

- Generating epics without user input
- Epics that don't deliver playable value
- Missing key features from GDD
- Not creating separate epics.md file
- Not presenting checkpoint menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
