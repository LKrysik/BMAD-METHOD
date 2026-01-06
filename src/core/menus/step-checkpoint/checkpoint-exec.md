# Checkpoint Execution Router

Routes checkpoint menu selections to appropriate workflows with aeList context.

---

## Input Parameters

| Parameter | Source | Description |
|-----------|--------|-------------|
| `mode` | checkpoint-menu.md | 'quick', 'verify', or 'discover' |
| `stepContext` | Calling step | Current step file path and content |
| `aeList` | Step frontmatter | Method list(s) for verification/discovery |

---

## Handler Paths

| Mode | Path |
|------|------|
| quick | `deep-verify/quick_mode.md` OR `deep-discover/quick_mode.md` |
| verify | `deep-verify/workflow.md` |
| discover | `deep-discover/workflow.md` |

**Base path:** `{project-root}/_bmad/core/workflows/`

---

## aeList Extraction Protocol

### Step 1: Read Current Step Frontmatter

```
1. Get current step file path from context
2. Read step file frontmatter
3. Look for 'aeList' field
```

### Step 2: Handle aeList Value

**If aeList found in frontmatter:**
```yaml
aeList: 'architecture'           # Single list
aeList: 'architecture,security'  # Multiple lists (comma-separated)
```

**If aeList NOT found:**
```
1. Attempt smart-select based on step name/domain:
   - *persona* → 'creative'
   - *architecture* → 'architecture'
   - *narrative* → 'narrative'
   - *validation* → 'sanity'
   - *discovery* → 'research'
   - *vision* → 'vision'
   - *mechanics* → 'core-design'
   - default → 'general'

2. WARN user: "Step missing aeList, using '{fallback}'. Consider adding aeList to frontmatter."
```

### Step 3: Resolve aeList to Files

```
For each list in aeList (split by comma):
  path = {project-root}/_bmad/core/methods/ae-lists/{list}.md

  IF file exists:
    Add to methodFiles[]
  ELSE:
    WARN: "ae-list '{list}' not found, skipping"

IF methodFiles is empty:
  Use 'general' as fallback
```

---

## Routing Logic

### Q (Quick) Mode

```
1. Extract aeList from step frontmatter (see protocol above)
2. Determine quick mode type based on context:
   - If called after content generation → quick VERIFY
   - If called for exploration → quick DISCOVER
   - If unclear → ask user: "[V] Quick Verify / [D] Quick Discover"
3. Load appropriate quick_mode.md
4. Pass parameters:
   - aeList: '{extracted_aeList}'
   - content: '{current step content}'
   - stepPath: '{current step file path}'
5. Execute quick mode
6. After completion: Return to calling step menu
```

### V (Verify) Mode

```
1. Extract aeList from step frontmatter
2. Load deep-verify/workflow.md
3. Pass parameters:
   - aeList: '{extracted_aeList}'
   - content: '{current step content}'
   - task: '{step goal from frontmatter}'
   - context: '{workflow context}'
4. Execute full verification workflow
5. After completion: Return to calling step menu
```

### D (Discover) Mode

```
1. Extract aeList from step frontmatter
2. Load deep-discover/workflow.md
3. Pass parameters:
   - aeList: '{extracted_aeList}'
   - content: '{current step content}'
   - task: '{step goal from frontmatter}'
   - context: '{workflow context}'
4. Execute full discovery workflow
5. After completion: Return to calling step menu
```

---

## Method Data Location

All methods are stored in:
`{project-root}/_bmad/core/methods/`

| File | Content |
|------|---------|
| `methods.csv` | Full method catalog (122 methods) |
| `ae-custom-lists.yaml` | Source of truth for all lists |
| `ae_by_categories/` | Methods organized by category |
| `ae-lists/` | Domain-specific lists (17 files) |

---

## Available ae-lists

| List Name | Domain | Use For |
|-----------|--------|---------|
| `general` | Default | Steps without specific domain |
| `architecture` | Technical | Architecture, system design |
| `coherence-deep` | Quality | Deep coherence checking |
| `core-design` | Design | Core design decisions |
| `creative` | Creative | Persona, narrative, ideation |
| `deep-exploration` | Research | Deep exploration sessions |
| `first-principles` | Analysis | First principles analysis |
| `implementation` | Technical | Implementation details |
| `narrative` | Storytelling | Story, characters, world |
| `planning` | Project | Planning, roadmaps, epics |
| `platform-audience` | Market | Platform, audience analysis |
| `quality` | QA | Quality assurance |
| `research` | Discovery | Research, discovery |
| `sanity` | Validation | Sanity checks, validation |
| `security` | Security | Security analysis |
| `stakeholder` | Users | Stakeholder analysis |
| `vision` | Strategy | Vision, strategy |

---

## Fallback Behavior

### If aeList missing in frontmatter:
1. Attempt smart-select based on step context
2. Use 'general' as ultimate fallback
3. WARN user about missing aeList

### If ae-list file missing:
1. WARN user: "ae-list '{name}' not found"
2. Offer alternatives from available lists
3. Fallback to 'general' if user doesn't select

### If multiple aeLists specified:
1. Load ALL specified ae-list files
2. Combine methods from all files
3. Present unified method set

---

## Return Protocol

After any mode completes:

1. Present results/insights to user
2. Ask: "Apply changes? / Continue exploring? / Return to step menu?"
3. Handle response:
   - Apply → Make changes to step content
   - Continue → Re-enter same mode or offer other modes
   - Return → Go back to calling step's checkpoint menu
4. **Return to calling step** (load step file, re-display checkpoint menu)
