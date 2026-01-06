# Checkpoint Execution Router

Routes checkpoint menu selections to Deep Verify or Deep Discover workflows.

---

## Handler Paths

| Mode | Quick | Full |
|------|-------|------|
| Verify | `deep-verify/quick_mode.md` | `deep-verify/workflow.md` |
| Discover | `deep-discover/quick_mode.md` | `deep-discover/workflow.md` |

**Base path:** `{project-root}/_bmad/core/workflows/`

---

## Inline Methods

Steps can define **targeted methods** for their specific context using HTML comments:

```markdown
<!-- DEEP_VERIFY -->
70,sanity,Scope Integrity Check,Verify artifact addresses FULL scope,output_pattern
74,sanity,Grounding Check,List ALL assumptions explicit AND hidden,output_pattern
73,sanity,Coherence Check,Check definitions stability and contradictions,output_pattern

<!-- DEEP_DISCOVER -->
39,core,First Principles Analysis,Strip away assumptions to rebuild,output_pattern
41,core,Socratic Questioning,Use targeted questions to reveal assumptions,output_pattern
57,challenge,Newcomb's Paradox,What solution would SURPRISE you?,output_pattern
```

**Format:** `id,category,method_name,description,output_pattern`

**Parsing:** Split on first 4 commas only (description may contain commas).

---

## Routing Logic

### V (Verify)

```
1. Check for <!-- DEEP_VERIFY --> in current step file
2. IF found:
   a. Load quick_mode.md from deep-verify
   b. Execute inline methods on current content
   c. Present findings (PASS/WARN/FAIL per method)
   d. Ask: "Want deeper analysis? [F] Full / [N] Done"
   e. IF F: Load workflow.md from deep-verify
3. IF not found:
   a. Load workflow.md from deep-verify directly
4. After completion: Return to checkpoint menu
```

**Tiered Escalation:**
- **Quick** → inline methods only (~500-800 tokens)
- **Full** → comprehensive verification with anti-gaming

**Verify goal:** Check agent's work for completeness, consistency, quality, alignment with requirements.

### D (Discover)

```
1. Check for <!-- DEEP_DISCOVER --> in current step file
2. IF found:
   a. Load quick_mode.md from deep-discover
   b. Execute inline methods as conversation starters
   c. Engage user with probing questions
   d. Ask: "Want deeper exploration? [F] Full / [N] Done"
   e. IF F: Load workflow.md from deep-discover
3. IF not found:
   a. Load workflow.md from deep-discover directly
4. After completion: Return to checkpoint menu
```

**Tiered Escalation:**
- **Quick** → inline methods only (~500-800 tokens)
- **Full** → comprehensive discovery with anti-sycophancy

**Discover goal:** Explore with user - surface assumptions, discover alternatives, understand deeper needs, suggest other perspectives.

---

## Method Data Location

All methods are stored in:
`{project-root}/_bmad/core/workflows/advanced-elicitation/data/`

| File | Content |
|------|---------|
| `methods.csv` | Full method catalog (122 methods) |
| `primary_verify.md` | Methods optimized for verification |
| `primary_discover.md` | Methods optimized for discovery |
| `ae_by_categories/` | Methods organized by category |
| `ae_by_roles/` | Methods organized by aeRole |
| `custom-lists.yaml` | User-defined method collections |

---

## Fallback Behavior

### If inline methods missing:

Go directly to full workflow (no "quick" phase).

### If aeRole missing in frontmatter:

Default: `aeRole: 'general'`

### If ae_by_roles or ae_by_categories file missing:

WARN user, fallback to `primary_discover.md` or `primary_verify.md`, allow reselection.

---

## Return Protocol

After Verify or Discover completes:

1. Present results/insights to user
2. Ask: "Apply changes? / Continue exploring? / Return to menu?"
3. Handle response
4. **Return to checkpoint menu** (load checkpoint-menu.md from this directory)
