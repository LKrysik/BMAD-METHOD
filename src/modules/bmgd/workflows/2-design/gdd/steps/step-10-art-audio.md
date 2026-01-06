---
name: 'step-10-art-audio'
description: 'Define art style and audio direction'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: '{workflow_path}/steps/step-10-art-audio.md'
nextStepFile: '{workflow_path}/steps/step-11-technical.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Task References
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'

# Advanced Elicitation Configuration
aeList: 'creative'
---

# Step 10: Art & Audio

**Progress: Step 10 of 14** - Next: Technical Specs

## STEP GOAL:

Define the visual art style and audio/music direction for the game, establishing the aesthetic identity that will guide all asset creation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Art and audio define the player's emotional experience
- These decisions heavily impact scope and team requirements

### Step-Specific Rules:

- Focus on direction and mood, not specific asset lists
- FORBIDDEN to generate art/audio direction without user input
- Reference games or other media when helpful
- Consider platform constraints on art complexity

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present checkpoint menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]` before loading next step
- FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- All previous context available (especially platform and audience)
- Art style should match game pillars and tone
- Audio must work on target platform(s)

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Art Style Discovery

**Guide user through visual direction:**

"Let's define the visual identity of {{game_name}}.

**Art Style Categories:**

| Style           | Description                  | Examples                  |
| --------------- | ---------------------------- | ------------------------- |
| **Pixel Art**   | Retro-styled discrete pixels | Celeste, Shovel Knight    |
| **Low-Poly**    | Simple 3D geometry           | Superhot, Monument Valley |
| **Hand-Drawn**  | Illustration-like visuals    | Cuphead, Hollow Knight    |
| **Realistic**   | Photorealistic graphics      | AAA titles                |
| **Stylized 3D** | Non-realistic 3D             | Fortnite, Zelda: BotW     |
| **Vector/Flat** | Clean shapes, minimal        | Thomas Was Alone          |
| **Mixed Media** | Combining multiple styles    | Paper Mario               |

**Visual Elements to Consider:**

- **Color Palette:** Vibrant, muted, monochromatic, complementary?
- **Lighting:** Dramatic, soft, realistic, stylized?
- **Camera:** 2D side, top-down, isometric, 3D third/first person?
- **Character Design:** Cute, realistic, abstract, iconic?

**For {{game_type}} on {{platform}}, common art styles include:**
{typical_art_styles_for_game_type}

What visual style do you envision for {{game_name}}?"

### 2. Art Reference Gathering

"Are there any games, films, or art that inspire the look of {{game_name}}?

Examples help communicate the vision:

- 'The lighting of Limbo with the colors of Journey'
- 'Pixel art like Hyper Light Drifter but with a warmer palette'
- 'Studio Ghibli-inspired environments'

What references capture the visual feel you want?"

### 3. Audio Direction Discovery

**Guide user through audio/music direction:**

"Now let's define the audio identity of {{game_name}}.

**Music Style Considerations:**

| Style              | Mood                | Examples              |
| ------------------ | ------------------- | --------------------- |
| **Chiptune/8-bit** | Retro, energetic    | Shovel Knight         |
| **Orchestral**     | Epic, emotional     | Zelda, Final Fantasy  |
| **Electronic**     | Modern, driving     | Hotline Miami, FURI   |
| **Ambient**        | Atmospheric, subtle | Journey, INSIDE       |
| **Rock/Metal**     | Intense, aggressive | DOOM, Devil May Cry   |
| **Jazz/Lo-fi**     | Chill, stylish      | Persona, VA-11 Hall-A |
| **Dynamic**        | Adapts to gameplay  | DOOM, Ape Out         |

**Sound Design Considerations:**

- **Feedback Sounds:** How responsive and punchy?
- **Environmental Audio:** How immersive?
- **Voice/Dialogue:** None, grunts, partial, full VO?
- **Accessibility:** Audio cues for visual elements?

**For {{game_type}} games, typical audio approaches include:**
{typical_audio_for_game_type}

What audio direction fits {{game_name}}?"

### 4. Generate Art & Audio Content

Based on the conversation, prepare the content:

```markdown
## Art and Audio Direction

### Art Style

{{art_style_description}}

#### Visual References

{{reference_games_and_media}}

#### Color Palette

{{color_direction}}

#### Camera and Perspective

{{camera_style}}

### Audio and Music

{{audio_direction_description}}

#### Music Style

{{music_genre_and_mood}}

#### Sound Design

{{sound_design_approach}}

#### Voice/Dialogue

{{voice_approach}}

### Aesthetic Goals

{{how_art_and_audio_support_game_pillars}}
```

### 5. Present Checkpoint Menu

Show the generated content to the user and present:

"I've drafted the Art & Audio Direction based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Validation Check:**

- Does the art style support your game pillars?
- Is the audio direction achievable for your scope?
- Do art and audio work together cohesively?

**Read and execute `{checkpointMenu}` file** - this file contains the menu options (Q/V/D/P/C) and their handling logic.

**[C] Continue action for this step:** Save to `{outputFile}` and load `{nextStepFile}`

#### Menu Handling:

- IF C (Continue): Append content to `{outputFile}`, update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, load `{nextStepFile}`
- IF other input: Respond helpfully, re-display checkpoint menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After Q/V/D/P execution completes, return to checkpoint menu
- User can chat or ask questions - respond then re-display menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [art/audio content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Art style clearly defined with references
- Audio direction documented
- Aesthetic supports game pillars and tone
- Platform constraints considered
- Checkpoint menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

### SYSTEM FAILURE:

- Generating art/audio direction without user input
- Art style inappropriate for target platform
- Missing references that help communicate vision
- Not presenting checkpoint menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
