---
name: 'step-02-foundation'
description: 'Define narrative premise, themes, tone, and story structure'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: '{workflow_path}/steps/step-02-foundation.md'
nextStepFile: '{workflow_path}/steps/step-03-story.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Checkpoint Reference
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'

# AE Configuration
aeRole: 'narrative'
---

<!-- DEEP_VERIFY -->
70,sanity,Scope Integrity Check,Does premise have protagonist + goal + obstacle + stakes? List each element: PRESENT / MISSING.,premise elements → completeness check
73,sanity,Coherence Check,Do themes ALIGN with tone? Dark themes + lighthearted tone = potential mismatch?,theme-tone alignment → contradiction search
74,sanity,Grounding Check,What assumptions about audience narrative expectations? Which if wrong breaks the story?,audience assumptions → critical dependencies

<!-- DEEP_DISCOVER -->
41,core,Socratic Questioning,What HIDDEN assumptions about story does the premise contain? What questions does it NOT answer?,premise → hidden assumptions → unanswered questions
106,exploration,Plato's Cave Inversion,The stated themes are SHADOWS. What is the TRUE theme you're trying to explore?,stated themes → deeper meaning → alignment

# Step 2: Story Foundation

**Progress: Step 2 of 11** - Next: Story Beats

## STEP GOAL:

Define the narrative foundation: premise, themes, tone/atmosphere, and overall story structure. These elements form the backbone of all narrative content.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- NEVER mention time estimates

### Role Reinforcement:

- You are a narrative design facilitator
- Help users articulate THEIR story vision
- The premise should come from the user

### Step-Specific Rules:

- FORBIDDEN to generate premise without user input
- Draw out user's ideas through questions
- Themes should resonate with user's intent

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present V/D/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2]` before loading next step

## CHECKPOINT

**At checkpoint:** Load `{checkpointMenu}` to display menu and handle selection.

**[→] Continue action for this step:** Save to `{outputFile}` and load `{nextStepFile}`.

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Narrative Premise Discovery

"Let's define the narrative foundation for **{{game_name}}**.

**First, the premise - your story's elevator pitch in 2-3 sentences.**

Good premises have:

- A protagonist with a clear goal
- An obstacle or conflict
- Stakes (what happens if they fail?)

**Examples:**

- \"A young knight discovers they're the last hope to stop an ancient evil, but must choose between saving the kingdom or their own family.\"
- \"After a mysterious pandemic, survivors must navigate a world where telling the truth is deadly but lying corrupts your soul.\"

What's the premise for {{game_name}}?"

### 2. Theme Discovery

"**Now let's identify your core themes.**

Themes are the underlying ideas or messages woven throughout the story.

**Common game themes:**

- Redemption, sacrifice, identity
- Power and corruption
- Hope vs. despair
- Nature vs. technology
- Freedom vs. control
- Family, loyalty, betrayal

**Questions to consider:**

- What questions does your story ask?
- What will players think about after playing?
- What emotions do you want to evoke?

What are 2-4 core themes for {{game_name}}?"

### 3. Tone and Atmosphere Discovery

"**Let's define the tone and atmosphere.**

Tone shapes how the story feels moment-to-moment.

**Tone spectrums:**

- Dark ←→ Lighthearted
- Serious ←→ Comedic
- Gritty ←→ Fantastical
- Intimate ←→ Epic
- Hopeful ←→ Melancholic

**Atmosphere elements:**

- Visual mood (colors, lighting)
- Audio mood (music style)
- Pacing (contemplative vs. urgent)
- Emotional register

Describe the tone and atmosphere for {{game_name}}:"

### 4. Story Structure Discovery

"**What story structure will you use?**

**Common structures:**

| Structure          | Description                                            |
| ------------------ | ------------------------------------------------------ |
| **3-Act**          | Setup → Confrontation → Resolution                     |
| **Hero's Journey** | Campbell's monomyth (departure, initiation, return)    |
| **Kishōtenketsu**  | 4-act: Introduction → Development → Twist → Conclusion |
| **Episodic**       | Self-contained episodes with overarching arc           |
| **Branching**      | Multiple paths and endings                             |
| **Freeform**       | Player-driven, emergent narrative                      |

What structure fits {{game_name}}?"

### 5. Act Breakdown

"**Let's break down your story into acts/sections.**

Based on {{selected_structure}}:

{{structure_specific_prompts}}

Describe each act/section for {{game_name}}:"

### 6. Generate Foundation Content

Based on the conversation, prepare the content:

```markdown
## Story Foundation

### Narrative Premise

{{user_premise}}

### Core Themes

{{themes_list_with_descriptions}}

### Tone and Atmosphere

**Tone:** {{tone_description}}

**Atmosphere:** {{atmosphere_description}}

**Emotional Register:** {{emotional_goals}}

---

## Story Structure

### Structure Type

**{{structure_type}}**

{{structure_description}}

### Act Breakdown

{{act_breakdown_details}}
```

### 7. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Story Foundation based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 6]

**Validation Check:**

- Does the premise capture your vision?
- Do the themes resonate with your intent?
- Does the structure fit your gameplay?

**Load `{checkpointMenu}` to display options.**

**[→] Continue action for this step:** Save to `{outputFile}` and load `{nextStepFile}`"

### 8. Handle Menu Selection

#### IF V (Verify) or D (Discover):

- Checkpoint-exec.md handles routing
- After execution completes, return to checkpoint menu

#### IF C (Continue):

- Append the final content to `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [foundation content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Premise captured from user input
- Themes identified and described
- Tone and atmosphere defined
- Story structure selected and broken down
- V/D/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2]

### SYSTEM FAILURE:

- Generating premise FOR user
- Generic themes not connected to user's vision
- Proceeding without structure breakdown
- Not presenting V/D/C menu after content
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
