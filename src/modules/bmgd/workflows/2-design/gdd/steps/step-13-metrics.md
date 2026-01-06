---
name: 'step-13-metrics'
description: 'Define success metrics for technical and gameplay evaluation'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: '{workflow_path}/steps/step-13-metrics.md'
nextStepFile: '{workflow_path}/steps/step-14-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Task References
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'

# Advanced Elicitation Configuration
aeList: 'quality'

---

# Step 13: Success Metrics

**Progress: Step 13 of 14** - Next: Final Steps

## STEP GOAL:

Define measurable success metrics for both technical performance and gameplay quality. These metrics help evaluate whether the game meets its design goals.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Metrics should be measurable and actionable
- Focus on metrics that indicate design success, not just technical success

### Step-Specific Rules:

- Focus on defining what success looks like
- FORBIDDEN to generate metrics without user input
- Metrics should relate back to game pillars and goals
- Include both quantitative and qualitative measures

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]` before loading next step
- FORBIDDEN to load next step until C is selected

## CHECKPOINT

**At checkpoint:** Load `{checkpointMenu}` to display menu and handle selection.

**[C] Continue action for this step:** Save to `{outputFile}` and load `{nextStepFile}`.

## CONTEXT BOUNDARIES:

- All GDD content from previous steps available
- Metrics should map to stated goals and pillars
- Technical metrics from performance requirements

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Technical Metrics Discovery

**Guide user through technical success criteria:**

"Let's define how we'll measure technical success for {{game_name}}.

**Technical Metric Categories:**

| Category        | Example Metrics                                  |
| --------------- | ------------------------------------------------ |
| **Performance** | Frame rate consistency, load times, memory usage |
| **Stability**   | Crash rate, bug severity distribution            |
| **Platform**    | Certification pass rate, store review score      |
| **Build**       | Build time, test coverage, asset size            |

**Your performance targets from earlier:**

- Frame rate: {{target_fps}}
- Platform: {{platform}}

**Questions to consider:**

1. What technical metrics matter most for {{game_type}}?
2. How will you measure performance in the field?
3. What's an acceptable crash rate?
4. Are there platform-specific metrics to track?

What technical metrics will indicate success for {{game_name}}?"

### 2. Gameplay Metrics Discovery

**Guide user through gameplay success criteria:**

"Now let's define gameplay metrics - how we know the design is working.

**Gameplay Metric Categories:**

| Category                | Example Metrics                                   |
| ----------------------- | ------------------------------------------------- |
| **Engagement**          | Session length, sessions per week, retention      |
| **Progression**         | Completion rates, time-to-milestone, churn points |
| **Difficulty**          | Death/retry rates, difficulty setting usage       |
| **Feature Usage**       | Which mechanics are used, feature discovery       |
| **Player Satisfaction** | Ratings, reviews, NPS                             |

**Your game pillars are:** {{pillars}}
**Your goals are:** {{goals}}

**Questions to consider:**

1. How will you know if players are having the intended experience?
2. What retention rates would indicate success?
3. How will you identify frustration points?
4. What playtesting metrics will you track?

What gameplay metrics will indicate success for {{game_name}}?"

### 3. Qualitative Success Criteria

**Guide user through qualitative measures:**

"Finally, let's define qualitative success criteria - things that are harder to measure but equally important.

**Qualitative Criteria Examples:**

- 'Players describe the game using our pillar words'
- 'Streamers enjoy playing without instruction'
- 'Community creates fan content'
- 'Players recommend to friends'
- 'Reviews mention the unique selling points'

What qualitative signs would tell you {{game_name}} is successful?"

### 4. Generate Metrics Content

Based on the conversation, prepare the content:

```markdown
## Success Metrics

### Technical Metrics

{{technical_metrics_list}}

#### Key Technical KPIs

| Metric | Target | Measurement Method |
| ------ | ------ | ------------------ |

{{technical_kpi_table}}

### Gameplay Metrics

{{gameplay_metrics_list}}

#### Key Gameplay KPIs

| Metric | Target | Measurement Method |
| ------ | ------ | ------------------ |

{{gameplay_kpi_table}}

### Qualitative Success Criteria

{{qualitative_criteria_list}}

### Metric Review Cadence

{{when_and_how_metrics_will_be_reviewed}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Success Metrics based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Validation Check:**

- Do metrics align with your game pillars?
- Are targets achievable and measurable?
- Can you actually collect this data?

**Load `{checkpointMenu}` to display options.**

**[C] Continue action for this step:** Save to `{outputFile}` and load `{nextStepFile}`

#### Menu Handling:
- IF C (Continue): Save content, update frontmatter, load {nextStepFile}
- IF other input: Respond helpfully, re-display checkpoint menu

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After Q/V/D/P execution completes, return to checkpoint menu
- User can chat or ask questions - respond then re-display menu

### 6. Handle Menu Selection

#### IF C (Continue):

- Append the final content to `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [metrics content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Technical metrics defined with targets
- Gameplay metrics tied to pillars and goals
- Qualitative criteria documented
- Metrics are actually measurable
- Checkpoint menu presented and handled correctly
- Frontmatter updated with stepsCompleted

### SYSTEM FAILURE:

- Generating metrics without user input
- Metrics that can't be measured
- Missing connection to game pillars/goals
- Not presenting checkpoint menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
