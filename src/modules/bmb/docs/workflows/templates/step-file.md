---
name: "step-{{stepNumber}}-{{stepName}}"
description: "{{stepDescription}}"

# Path Definitions
workflow_path: "{project-root}/_bmad/{{targetModule}}/workflows/{{workflowName}}"

# File References
thisStepFile: "{workflow_path}/steps/step-{{stepNumber}}-{{stepName}}.md"
{{#hasNextStep}}
nextStepFile: "{workflow_path}/steps/step-{{nextStepNumber}}-{{nextStepName}}.md"
{{/hasNextStep}}
workflowFile: "{workflow_path}/workflow.md"
{{#hasOutput}}
outputFile: "{output_folder}/{{outputFileName}}-{project_name}.md"
{{/hasOutput}}

# Task References (list only if used in THIS step file instance and only the ones used, there might be others)
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'

# Advanced Elicitation Configuration
# Choose from: general, architecture, coherence-deep, core-design, creative, deep-exploration,
#              first-principles, implementation, narrative, planning, platform-audience, quality,
#              research, sanity, security, stakeholder, vision
aeList: '{{aeList}}'

{{#hasTemplates}}
# Template References
{{#templates}}
{{name}}: "{workflow_path}/templates/{{file}}"
{{/templates}}
{{/hasTemplates}}
---

# Step {{stepNumber}}: {{stepTitle}}

## STEP GOAL:

{{stepGoal}}

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a {{aiRole}}
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring {{aiExpertise}}, user brings {{userExpertise}}
- ✅ Maintain collaborative {{collaborationStyle}} tone throughout

### Step-Specific Rules:

- 🎯 Focus only on {{stepFocus}}
- 🚫 FORBIDDEN to {{forbiddenAction}}
- 💬 Approach: {{stepApproach}}
- 📋 {{additionalRule}}

## EXECUTION PROTOCOLS:

{{#executionProtocols}}

- 🎯 {{.}}
  {{/executionProtocols}}

## CONTEXT BOUNDARIES:

- Available context: {{availableContext}}
- Focus: {{contextFocus}}
- Limits: {{contextLimits}}
- Dependencies: {{contextDependencies}}

## SEQUENCE OF INSTRUCTIONS (Do not deviate, skip, or optimize)

{{#instructions}}

### {{number}}. {{title}}

{{content}}

{{#hasContentToAppend}}

#### Content to Append (if applicable):

```markdown
{{contentToAppend}}
```

{{/hasContentToAppend}}

{{/instructions}}

{{#hasMenu}}

### {{menuNumber}}. Present Checkpoint Menu

**Read and execute `{checkpointMenu}` file** - this file contains the menu options (Q/V/D/P/C) and their handling logic.

**[C] Continue action for this step:** {{continueAction}}

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After Q/V/D/P execution completes, return to this menu
- User can chat or ask questions - always respond and then re-display menu

#### Menu Handling Logic:

- IF Q/V/D/P: Handled by `{checkpointMenu}` file instructions
{{#menuOptions}}
- IF {{key}}: {{action}}
{{/menuOptions}}
- IF Any other comments or queries: help user respond then [Redisplay Menu](#{{menuNumber}}-present-checkpoint-menu)
{{/hasMenu}}

## CRITICAL STEP COMPLETION NOTE

{{completionNote}}

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

{{#successCriteria}}

- {{.}}
  {{/successCriteria}}

### ❌ SYSTEM FAILURE:

{{#failureModes}}

- {{.}}
  {{/failureModes}}

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
