---
name: 'step-06-prep-schedule'
description: "Create a realistic meal prep schedule that fits the user's lifestyle"

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/reference/workflows/meal-prep-nutrition'

# File References
thisStepFile: '{workflow_path}/steps/step-06-prep-schedule.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/nutrition-plan-{project_name}.md'

# Task References
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'

# Advanced Elicitation Configuration
aeList: 'implementation'

# Template References
prepScheduleTemplate: '{workflow_path}/templates/prep-schedule-section.md'
---

# Step 6: Meal Prep Execution Schedule

## 🎯 Objective

Create a realistic meal prep schedule that fits the user's lifestyle and ensures success.

## 📋 MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER suggest a prep schedule that requires more time than user has available
- 📖 CRITICAL: Base schedule on user's actual cooking frequency
- 🔄 CRITICAL: Include storage and reheating instructions
- ✅ Start with a sustainable prep routine
- 🚫 DO NOT overwhelm with too much at once
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### 1. Time Commitment Analysis

Based on user profile:

- **Available prep time per week**
- **Preferred prep days** (weekend vs weeknight)
- **Energy levels throughout day**
- **Kitchen limitations**

### 2. Prep Strategy Options

#### Option A: Sunday Batch Prep (2-3 hours)

- Prep all proteins for week
- Chop all vegetables
- Cook grains in bulk
- Portion snacks

#### Option B: Semi-Weekly Prep (1-1.5 hours x 2)

- Sunday: Proteins + grains
- Wednesday: Refresh veggies + prep second half

#### Option C: Daily Prep (15-20 minutes daily)

- Prep next day's lunch
- Quick breakfast assembly
- Dinner prep each evening

### 3. Detailed Timeline Breakdown

```
Sunday (2 hours):
2:00-2:30: Preheat oven, marinate proteins
2:30-3:15: Cook proteins (bake chicken, cook ground turkey)
3:15-3:45: Cook grains (rice, quinoa)
3:45-4:00: Chop vegetables and portion snacks
4:00-4:15: Clean and organize refrigerator
```

## 📦 Storage Guidelines:

### Protein Storage:

- Cooked chicken: 4 days refrigerated, 3 months frozen
- Ground meat: 3 days refrigerated, 3 months frozen
- Fish: Best fresh, 2 days refrigerated

### Vegetable Storage:

- Cut vegetables: 3-4 days in airtight containers
- Hard vegetables: Up to 1 week (carrots, bell peppers)
- Leafy greens: 2-3 days with paper towels

### Meal Assembly:

- Keep sauces separate until eating
- Consider texture changes when reheating
- Label with preparation date

## 🔧 ADAPTATION STRATEGIES:

### For Busy Weeks:

- Emergency freezer meals
- Quick backup options
- 15-minute meal alternatives

### For Low Energy Days:

- No-cook meal options
- Smoothie packs
- Assembly-only meals

### For Social Events:

- Flexible meal timing
- Restaurant integration
- "Off-plan" guilt-free guidelines

## ✅ SUCCESS METRICS:

- Realistic time commitment
- Clear instructions for each prep session
- Storage and reheating guidelines included
- Backup plans for busy weeks
- Sustainable long-term approach

## ❌ FAILURE MODES TO AVOID:

- Overly ambitious prep schedule
- Not accounting for cleaning time
- Ignoring user's energy patterns
- No flexibility for unexpected events
- Complex instructions for beginners

## 💬 SAMPLE DIALOG STYLE:

**✅ GOOD (Intent-based):**
"Based on your 2-hour Sunday availability, we could create a prep schedule that sets you up for the week. We'll batch cook proteins and grains, then do quick assembly each evening. How does that sound with your energy levels?"

**❌ AVOID (Prescriptive):**
"You must prep every Sunday from 2-4 PM. No exceptions."

## 📝 FINAL TEMPLATE OUTPUT:

Complete {outputFile} by loading and appending content from {prepScheduleTemplate}

## 🎯 WORKFLOW COMPLETION:

### Update workflow.md frontmatter:

```yaml
stepsCompleted: ['init', 'assessment', 'strategy', 'shopping', 'prep-schedule']
lastStep: 'prep-schedule'
completionDate: [current date]
userSatisfaction: [to be rated]
```

### Final Message Template:

"Congratulations! Your personalized nutrition plan is complete. Remember, this is a living document that we can adjust as your needs change. Check in weekly for the first month to fine-tune your approach!"

## 📊 NEXT STEPS FOR USER:

1. Review complete plan
2. Shop for ingredients
3. Execute first prep session
4. Note any adjustments needed
5. Schedule follow-up review

### 5. Present MENU OPTIONS

**Load `{checkpointMenu}` and display options.**

- IF C: update frontmatter `stepsCompleted` to add 6 at the end of the array before loading next step, mark workflow complete, display final message
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and content is saved to document:

1. update frontmatter `stepsCompleted` to add 6 at the end of the array before loading next step completed and indicate final completion
2. Display final completion message
3. End workflow session

**Final Message:** "Congratulations! Your personalized nutrition plan is complete. Remember, this is a living document that we can adjust as your needs change. Check in weekly for the first month to fine-tune your approach!"
