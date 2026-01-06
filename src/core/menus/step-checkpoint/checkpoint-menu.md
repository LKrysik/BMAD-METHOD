# Checkpoint Menu

Display at workflow checkpoints. Simple gate to dedicated workflows.

---

## Menu

**[V] Verify** | **[D] Discover** | **[C] Continue**

| Key | Action | Purpose |
|-----|--------|---------|
| **V** | Verify | Check agent's work: completeness, consistency, quality, alignment |
| **D** | Discover | Explore with user: assumptions, alternatives, deeper needs, other perspectives |
| **C** | Continue | Content is good, proceed to next step |

---

## What Only YOU Can Verify

Agent verification cannot check these - they require YOUR judgment:

- Does this match your actual vision and intent?
- Is the terminology correct for your domain/industry?
- Are there constraints the agent doesn't know about?

---

## Execution

### V (Verify) or D (Discover):

**LOAD:** `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-exec.md`

Pass selected mode (verify/discover) to router.

### C (Continue):

Execute Continue action from step file (save to outputFile, load nextStepFile).

### Other input:

Treat as question or comment. Respond, then re-display menu.

---

## Party Mode

Multi-agent discussions are available separately via `/party` command, not in checkpoint menu.
