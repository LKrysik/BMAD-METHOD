# Checkpoint Menu

Display at workflow step checkpoints. Gateway to verification and discovery workflows.

---

## Menu

**[QV] Quick Verify** | **[QD] Quick Discover** | **[V] Verify** | **[D] Discover** | **[P] Party** | **[C] Continue**

| Key | Action | Tokens |
|-----|--------|--------|
| **QV** | Quick verification | ~500-800 |
| **QD** | Quick discovery | ~500-800 |
| **V** | Full verification (guided) | ~1500-3000 |
| **D** | Full discovery (guided) | ~1500-3500 |
| **P** | Multi-agent discussion | ~5000+ |
| **C** | Save and continue | 0 |

### Legacy Support

```
If user enters [Q]:
→ Display: "Option [Q] has been split. Please use:"
→ Show: "[QV] Quick Verify or [QD] Quick Discover"
→ Wait for valid input
```

---

## What Only YOU Can Verify

Agent verification cannot check these - they require YOUR judgment:

- Does this match your actual vision and intent?
- Is the terminology correct for your domain/industry?
- Are there constraints the agent doesn't know about?

---

## Execution

### QV (Quick Verify):

**LOAD:** `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-exec.md`

Pass mode='QV' and current step context to router.
Router will extract aeList from step frontmatter and execute deep-verify/quick_mode.md.

### QD (Quick Discover):

**LOAD:** `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-exec.md`

Pass mode='QD' and current step context to router.
Router will extract aeList from step frontmatter and execute deep-discover/quick_mode.md.

### V (Verify):

**LOAD:** `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-exec.md`

Pass mode='verify' to router. Router will load deep-verify/workflow.md.

### D (Discover):

**LOAD:** `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-exec.md`

Pass mode='discover' to router. Router will load deep-discover/workflow.md.

### P (Party Mode):

**EXECUTE:** `{project-root}/_bmad/core/workflows/party-mode/workflow.md`

When finished, return to this menu.

### C (Continue):

**HANDLED BY CALLING STEP** - not by this menu.

When user selects C:
1. Return control to the calling step file
2. Step executes its "IF C:" handler (save content, update frontmatter, load next step)
3. This menu does NOT process C directly

### Other input:

Treat as question or comment. Respond, then re-display menu.

---

## Context Preservation

When this menu is called from a step:
- The calling step's content is the SUBJECT of verification/discovery
- The calling step's aeList determines which methods to use
- After any option completes, return to the calling step's menu

---

## Return Protocol

After any verification, discovery, or party mode completes:
1. Present results/insights to user
2. Ask: "Apply changes? / Continue exploring? / Return to step?"
3. Handle response
4. Return to calling step and re-display this checkpoint menu

**Note:** When user selects C (Continue) from this menu, control passes to the calling step's "IF C:" handler which saves content and proceeds to the next step.
