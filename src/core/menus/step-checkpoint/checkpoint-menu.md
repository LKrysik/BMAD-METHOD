# Checkpoint Menu

Display at workflow step checkpoints. Gateway to verification and discovery workflows.

---

## Menu

**[Q] Quick** | **[V] Verify** | **[D] Discover** | **[P] Party Mode**

| Key | Action | Purpose |
|-----|--------|---------|
| **Q** | Quick verify | Fast verification using aeList methods from current step |
| **V** | Verify | Full deep verification - check completeness, consistency, quality |
| **D** | Discover | Full deep discovery - explore assumptions, alternatives, deeper needs |
| **P** | Party Mode | Multi-agent collaborative discussion |

---

## What Only YOU Can Verify

Agent verification cannot check these - they require YOUR judgment:

- Does this match your actual vision and intent?
- Is the terminology correct for your domain/industry?
- Are there constraints the agent doesn't know about?

---

## Execution

### Q (Quick Verify):

**LOAD:** `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-exec.md`

Pass mode='quick' and current step context to router.
Router will extract aeList from step frontmatter and execute quick_mode.md.

### V (Verify):

**LOAD:** `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-exec.md`

Pass mode='verify' to router. Router will load deep-verify/workflow.md.

### D (Discover):

**LOAD:** `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-exec.md`

Pass mode='discover' to router. Router will load deep-discover/workflow.md.

### P (Party Mode):

**EXECUTE:** `{project-root}/_bmad/core/workflows/party-mode/workflow.md`

When finished, return to this menu.

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
4. Return to calling step's menu (NOT this checkpoint menu)
