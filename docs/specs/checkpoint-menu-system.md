# BMAD Checkpoint Menu System

Complete documentation of the checkpoint menu system, verification workflows, and advanced elicitation configuration.

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Step File Configuration](#step-file-configuration)
4. [Checkpoint Menu](#checkpoint-menu)
5. [Verification and Discovery Modes](#verification-and-discovery-modes)
6. [Methods System](#methods-system)
7. [Complete Flow Example](#complete-flow-example)
8. [Reference Tables](#reference-tables)

---

## Overview

### What is the Checkpoint Menu System?

The checkpoint menu system is a **quality assurance gateway** built into BMAD workflow steps. When a user and AI agent collaborate on content during a workflow step, the checkpoint menu provides options to:

- **Verify** - Check the generated content for problems
- **Discover** - Explore assumptions and uncover hidden needs
- **Continue** - Accept the content and proceed to the next step

### Why Does It Exist?

AI agents can make mistakes, miss requirements, or generate content based on incorrect assumptions. The checkpoint menu gives users **control points** where they can:

1. Pause and verify quality before committing
2. Discover gaps in their own thinking
3. Engage multiple AI perspectives (Party Mode)
4. Make informed decisions about when to proceed

---

## System Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         WORKFLOW STEP                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  YAML Frontmatter                                              │  │
│  │  ───────────────                                               │  │
│  │  checkpointMenu: '{project-root}/.../checkpoint-menu.md'       │  │
│  │  aeList: 'architecture'                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                │                                     │
│                                ▼                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Step Content & Instructions                                   │  │
│  │  ...                                                           │  │
│  │  **Read and execute `{checkpointMenu}` file**                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CHECKPOINT MENU                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [Q] Quick | [V] Verify | [D] Discover | [P] Party | [C] Cont  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
         │           │           │           │           │
         ▼           ▼           ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
    │ Quick  │  │ Deep   │  │ Deep   │  │ Party  │  │ Return │
    │ Mode   │  │ Verify │  │Discover│  │ Mode   │  │to Step │
    └────────┘  └────────┘  └────────┘  └────────┘  └────────┘
         │           │           │           │           │
         ▼           ▼           ▼           ▼           ▼
    ┌─────────────────────────────────────────────────────────┐
    │              AE-LISTS / METHODS                         │
    │  ┌─────────────────────────────────────────────────┐   │
    │  │  architecture.md → 5 verify + 3 discover methods │   │
    │  │  security.md → 6 verify + 4 discover methods     │   │
    │  │  creative.md → 3 verify + 7 discover methods     │   │
    │  │  ... (17 domain-specific lists)                  │   │
    │  └─────────────────────────────────────────────────┘   │
    └─────────────────────────────────────────────────────────┘
```

### File Locations

| Component | Path |
|-----------|------|
| Checkpoint Menu | `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md` |
| Checkpoint Router | `{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-exec.md` |
| Deep Verify Workflow | `{project-root}/_bmad/core/workflows/deep-verify/workflow.md` |
| Deep Discover Workflow | `{project-root}/_bmad/core/workflows/deep-discover/workflow.md` |
| Quick Verify | `{project-root}/_bmad/core/workflows/deep-verify/quick_mode.md` |
| Quick Discover | `{project-root}/_bmad/core/workflows/deep-discover/quick_mode.md` |
| Party Mode | `{project-root}/_bmad/core/workflows/party-mode/workflow.md` |
| Methods Database | `{project-root}/_bmad/core/methods/methods.csv` |
| AE Lists | `{project-root}/_bmad/core/methods/ae-lists/*.md` |

---

## Step File Configuration

### Required Frontmatter

Every workflow step that uses the checkpoint menu must include these fields in its YAML frontmatter:

```yaml
---
name: 'step-04-decisions'
description: 'Make core architectural decisions collaboratively'

# Task References
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'

# Advanced Elicitation Configuration
aeList: 'architecture'
---
```

### Field Explanations

#### `checkpointMenu`

**What it is:** A path variable pointing to the checkpoint menu file.

**Why it exists:**
- Provides a single source of truth for the menu
- Allows the menu definition to be centralized and updated in one place
- The AI agent reads this file to know what options to display

**How it works:**
1. Step file contains: `checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'`
2. When step says "Read and execute `{checkpointMenu}` file", the AI:
   - Resolves `{checkpointMenu}` to the actual file path
   - Reads the checkpoint-menu.md file
   - Displays the menu options (Q/V/D/P/C)
   - Handles user selection according to the file's instructions

#### `aeList`

**What it is:** Specifies which domain-specific method list to use for verification and discovery.

**Why it exists:**
- Different types of content need different verification approaches
- Architecture steps need architecture methods
- Creative steps need creative methods
- Without this, verification would be generic and less effective

**How it works:**
1. Step file contains: `aeList: 'architecture'`
2. When user selects Q/V/D from menu:
   - Router extracts `aeList` value from step frontmatter
   - Loads `{project-root}/_bmad/core/methods/ae-lists/architecture.md`
   - Uses methods from that file for verification/discovery

**Available values (17 domain lists):**

| aeList Value | Domain | Best For |
|--------------|--------|----------|
| `general` | Default | Steps without specific domain |
| `architecture` | Technical | System design, technical decisions |
| `coherence-deep` | Quality | Deep consistency checking |
| `core-design` | Design | Core design decisions |
| `creative` | Creative | Persona, narrative, ideation |
| `deep-exploration` | Research | In-depth exploration |
| `first-principles` | Analysis | Fundamental analysis |
| `implementation` | Technical | Implementation details |
| `narrative` | Storytelling | Story, characters, world |
| `planning` | Project | Planning, roadmaps, epics |
| `platform-audience` | Market | Platform, audience analysis |
| `quality` | QA | Quality assurance |
| `research` | Discovery | Research, discovery |
| `sanity` | Validation | Final validation checks |
| `security` | Security | Security analysis |
| `stakeholder` | Users | Stakeholder analysis |
| `vision` | Strategy | Vision, strategy |

---

## Checkpoint Menu

### Menu Display

When a step reaches its checkpoint, the AI reads `{checkpointMenu}` and displays:

```
**[Q] Quick** | **[V] Verify** | **[D] Discover** | **[P] Party Mode** | **[C] Continue**

| Key | Action       | Purpose                                                    |
|-----|--------------|-------------------------------------------------------------|
| Q   | Quick verify | Fast verification using aeList methods from current step   |
| V   | Verify       | Full deep verification - completeness, consistency, quality |
| D   | Discover     | Full deep discovery - explore assumptions, alternatives     |
| P   | Party Mode   | Multi-agent collaborative discussion                        |
| C   | Continue     | Accept content, save to document, proceed to next step      |
```

### Option Explanations

#### [Q] Quick - Fast Verification/Discovery

**Purpose:** Rapid quality check using domain-specific methods.

**How it works:**
1. User selects Q
2. Router asks: Quick Verify or Quick Discover?
3. Loads appropriate quick mode
4. Extracts methods from step's `aeList`
5. Applies 3-8 methods automatically
6. Presents results in ~500-800 tokens
7. Returns to checkpoint menu

**When to use:**
- Quick sanity check before proceeding
- Don't need comprehensive analysis
- Want to catch obvious issues fast

#### [V] Verify - Full Deep Verification

**Purpose:** Comprehensive verification that the output correctly addresses the task.

**Verification dimensions:**
- **Completeness** - Are all requirements addressed?
- **Correctness** - Are there errors in what's present?
- **Coherence** - Does it fit with context/ecosystem?
- **Clarity** - Is it understandable and usable?

**Modes:**
- **Quick Mode** - Agent verifies automatically, user reviews results
- **Guided Mode** - User and agent decide together what and how to verify

**How it works:**
1. User selects V
2. Router loads `deep-verify/workflow.md`
3. User chooses Quick or Guided mode
4. Agent selects verification methods from `aeList`
5. Agent checks content against each method
6. Findings categorized as CRITICAL/IMPORTANT/MINOR
7. User reviews and decides on fixes
8. Returns to checkpoint menu

#### [D] Discover - Full Deep Discovery

**Purpose:** Surface hidden assumptions, explore alternatives, uncover real needs.

**Discovery directions:**
- **DISCOVER** - Surface what user truly needs (unclear requirements)
- **CHALLENGE** - Stress-test assumptions (plan exists)
- **ENRICH** - Expand and complete ideas (good but incomplete)

**Modes:**
- **Quick Mode** - Agent explores automatically, user reviews insights
- **Guided Mode** - User guides exploration direction and methods

**How it works:**
1. User selects D
2. Router loads `deep-discover/workflow.md`
3. User chooses Quick or Guided mode
4. Agent selects discovery methods from `aeList`
5. Agent asks probing questions based on methods
6. **Agent waits for user answers** (does NOT answer for them)
7. Insights compiled and presented
8. User decides which insights to incorporate
9. Returns to checkpoint menu

#### [P] Party Mode - Multi-Agent Discussion

**Purpose:** Bring together multiple AI agent personas for collaborative discussion.

**How it works:**
1. User selects P
2. Party mode loads all installed BMAD agents
3. User poses question or topic
4. Multiple agents respond with their unique perspectives
5. Discussion continues until user exits
6. Key insights summarized
7. User decides whether to apply insights
8. Returns to checkpoint menu

#### [C] Continue - Proceed to Next Step

**Purpose:** Accept current content and move forward.

**How it works:**
1. User selects C
2. Control returns to calling step file
3. Step executes its "IF C:" handler:
   - Save content to output file
   - Update frontmatter (stepsCompleted)
   - Load next step file

**Important:** The C option is **handled by the calling step**, not by checkpoint-menu.md. Each step defines its own Continue behavior.

### Menu Flow Diagram

```
User at step checkpoint
         │
         ▼
   Display Menu
   [Q] [V] [D] [P] [C]
         │
         ├─────────────────────────────────────────┐
         │         │         │         │           │
         ▼         ▼         ▼         ▼           ▼
        [Q]       [V]       [D]       [P]         [C]
     Quick      Deep      Deep     Party       Continue
         │       Verify   Discover  Mode           │
         │         │         │         │           │
         │         │         │         │           ▼
         │         │         │         │    ┌──────────────┐
         │         │         │         │    │ Step saves   │
         │         │         │         │    │ content and  │
         │         │         │         │    │ loads next   │
         │         │         │         │    │ step         │
         │         │         │         │    └──────────────┘
         │         │         │         │
         ▼         ▼         ▼         ▼
    ┌─────────────────────────────────────┐
    │         Execute selected mode        │
    │         using aeList methods         │
    └─────────────────────────────────────┘
                     │
                     ▼
    ┌─────────────────────────────────────┐
    │         Present results              │
    │         User applies changes         │
    └─────────────────────────────────────┘
                     │
                     ▼
    ┌─────────────────────────────────────┐
    │    Return to checkpoint menu         │
    │    (unless user selected C)          │
    └─────────────────────────────────────┘
```

---

## Verification and Discovery Modes

### Quick Verify vs Deep Verify

| Aspect | Quick Verify | Deep Verify |
|--------|--------------|-------------|
| **Token cost** | ~500-800 | ~2000-5000+ |
| **Methods used** | 3-8 from aeList | User-selected or auto |
| **User interaction** | Review results only | Can guide process |
| **Depth** | Surface issues | Comprehensive analysis |
| **Best for** | Fast sanity check | Critical content |
| **Self-discipline** | Anti-gaming check | Full self-check protocol |

### Quick Discover vs Deep Discover

| Aspect | Quick Discover | Deep Discover |
|--------|----------------|---------------|
| **Token cost** | ~500-800 | ~2000-5000+ |
| **Methods used** | 3-8 from aeList | User-selected or auto |
| **User interaction** | Answer questions | Guide exploration |
| **Depth** | Surface insights | Iterative discovery |
| **Best for** | Quick exploration | Complex requirements |
| **Directions** | Auto-selected | User chooses |

### Self-Discipline Protocol

Both verification and discovery modes include **self-discipline** - the agent checks its own work:

```
**Self-check questions:**
- Did I tell user what they wanted to hear? [yes/no — evidence]
- Did I skip hard questions? [yes/no — what]
- Did I soften findings to be polite?
- Adjustments needed: [yes/no — what]
```

This prevents the AI from:
- Taking shortcuts to finish faster
- Avoiding uncomfortable findings
- Telling users what they want to hear

---

## Methods System

### What Are Methods?

Methods are **structured questioning and analysis techniques** that guide verification and discovery. Each method has:

- **Number** (#1-122) - Unique identifier
- **Category** - Type of method (collaboration, technical, creative, etc.)
- **Name** - Descriptive title
- **Description** - What it does and when to use it
- **Pattern** - The sequence of steps to follow

### Methods Database

The master database is `methods.csv` containing 122 methods across categories:

| Category | Examples | Count |
|----------|----------|-------|
| collaboration | Stakeholder Round Table, Expert Panel | ~10 |
| advanced | Tree of Thoughts, Self-Consistency | ~6 |
| competitive | Red Team vs Blue Team, Shark Tank | ~4 |
| technical | Architecture Decision Records | ~5 |
| creative | SCAMPER, What If Scenarios | ~6 |
| research | Literature Review, Thesis Defense | ~4 |
| risk | Pre-mortem, Failure Mode Analysis | ~5 |
| core | First Principles, 5 Whys | ~7 |
| ... | ... | ... |

### AE Lists (Advanced Elicitation Lists)

AE lists are **domain-specific subsets** of the methods database. They contain methods most relevant for a particular type of content.

**Example: architecture.md**

```markdown
# Technical Architecture

**Type:** Domain list (verify + discover)
**Description:** Technical decisions, patterns, system design

Use `aeList: 'architecture'` in step frontmatter.

---

## Verify Methods (5)

### #20 Architecture Decision Records
Multiple architect personas propose and debate architectural choices...
**Pattern:** options → trade-offs → decision → rationale

### #72 Closure Check
Search for incomplete markers: TODO / TBD / PLACEHOLDER...
**Pattern:** markers scan → completeness check → line numbers

### #73 Coherence Check
Check: Are definitions stable throughout?...
**Pattern:** definitions stability → contradiction search

### #74 Grounding Check
List ALL assumptions (explicit AND hidden)...
**Pattern:** assumptions list → hidden vs explicit → CUI BONO

### #117 Fractal Zoom
Check solution at 3 scales: MICRO → MESO → MACRO...
**Pattern:** micro check → meso check → macro check

---

## Discover Methods (3)

### #39 First Principles Analysis
Strip away assumptions to rebuild from fundamental truths...
**Pattern:** assumptions → truths → new approach

### #110 Reductio Attack
Assume your solution is the WRONG choice...
**Pattern:** assume wrong → build attack → evaluate

### #27 What If Scenarios
Explore alternative realities...
**Pattern:** scenarios → implications → insights
```

### Why aeList Matters

**Without aeList:** Agent would use generic methods that might not catch domain-specific issues.

**With aeList:** Agent uses methods specifically designed for that type of content:

| Step Type | aeList | Effect |
|-----------|--------|--------|
| Architecture decisions | `architecture` | Uses ADR method, checks for trade-offs |
| Character creation | `creative` | Uses persona validation, narrative coherence |
| Security design | `security` | Uses threat modeling, attack surface analysis |
| Final validation | `sanity` | Uses completion check, coherence verification |

### aeList Resolution Flow

```
Step Frontmatter                  ae-list File                Methods Applied
─────────────────                 ────────────                ───────────────

aeList: 'architecture'  ───────►  architecture.md   ───────►  #20 ADR
                                  │                           #72 Closure Check
                                  │ Verify Methods            #73 Coherence Check
                                  │                           #74 Grounding Check
                                  │                           #117 Fractal Zoom
                                  │
                                  │ Discover Methods ───────►  #39 First Principles
                                                              #110 Reductio Attack
                                                              #27 What If Scenarios
```

---

## Complete Flow Example

### Scenario: User is at Architecture Decisions step

**Step file frontmatter:**
```yaml
---
name: 'step-04-decisions'
description: 'Make core architectural decisions'
checkpointMenu: '{project-root}/_bmad/core/menus/step-checkpoint/checkpoint-menu.md'
aeList: 'architecture'
---
```

### Flow Walkthrough

#### 1. User and Agent Complete Step Content

Agent facilitates architectural decisions with user. They discuss database choices, authentication methods, API design patterns, etc.

#### 2. Agent Presents Checkpoint Menu

Agent reads `{checkpointMenu}` file and displays:

```
**Here are the architectural decisions we've made:**

[Content showing decisions]

**[Q] Quick** | **[V] Verify** | **[D] Discover** | **[P] Party Mode** | **[C] Continue**
```

#### 3. User Selects [Q] Quick Verify

Agent:
1. Reads checkpoint-exec.md for routing
2. Extracts `aeList: 'architecture'` from step frontmatter
3. Loads `ae-lists/architecture.md`
4. Extracts 5 verify methods
5. Executes quick_mode.md

#### 4. Quick Verify Executes

```
## Quick Verify

**Using aeList:** architecture
**Methods loaded:** 5 verify methods

| # | Method | Focus |
|---|--------|-------|
| 20 | Architecture Decision Records | options → trade-offs → rationale |
| 72 | Closure Check | markers scan → completeness |
| 73 | Coherence Check | definitions → contradictions |
| 74 | Grounding Check | assumptions → CUI BONO |
| 117 | Fractal Zoom | micro → meso → macro |

Beginning verification...

### #20 Architecture Decision Records
**Search Plan:** Looking for decision rationale and trade-offs
**Applying to content...**

**FINDING [F-001]** — IMPORTANT — Confidence: HIGH

**Problem:** Database decision missing trade-off analysis
**Evidence:** "PostgreSQL selected for data storage" — line 47
**Impact:** Team won't understand why not MongoDB or other options
**Fix:** Add trade-off comparison between PostgreSQL, MongoDB, and SQLite

### #72 Closure Check
**CLEAR:** #72 Closure Check — no incomplete markers found
**Proof of search:** Scanned for TODO, TBD, PLACEHOLDER — none present

### #73 Coherence Check
**OMISSION [O-001]** — MINOR — Confidence: MODERATE

**Missing:** Cross-reference between auth decision and API security section
**Expected because:** Auth method affects API security implementation
**Impact:** Potential inconsistency in implementation
**Add:** Reference to JWT decision in API security section

[... continues for all methods ...]

## Quick Verify Results

**Overall Status:** NEEDS ATTENTION
**Issues Found:** 0 critical, 1 important, 1 minor

| ID | Type | Severity | Problem | Fix |
|----|------|----------|---------|-----|
| F-001 | FINDING | IMPORTANT | Missing trade-offs | Add comparison |
| O-001 | OMISSION | MINOR | Missing cross-ref | Add reference |

**What would you like to do?**

[F] Fix issues — apply all suggested fixes
[S] Select fixes — choose which to apply
[N] No changes — content is acceptable
[D] Done — return to step menu
```

#### 5. User Selects [F] Fix All

Agent applies suggested fixes to the content.

#### 6. Return to Checkpoint Menu

Agent re-displays checkpoint menu with updated content.

#### 7. User Selects [C] Continue

Control returns to step file. Step executes its "IF C:" handler:
- Saves content to `{planning_artifacts}/architecture.md`
- Updates frontmatter: `stepsCompleted: [1, 2, 3, 4]`
- Loads `./step-05-patterns.md`

---

## Reference Tables

### Checkpoint Menu Options

| Key | Name | Purpose | Handler |
|-----|------|---------|---------|
| Q | Quick | Fast verify/discover | checkpoint-exec.md → quick_mode.md |
| V | Verify | Full verification | checkpoint-exec.md → deep-verify/workflow.md |
| D | Discover | Full discovery | checkpoint-exec.md → deep-discover/workflow.md |
| P | Party Mode | Multi-agent discussion | party-mode/workflow.md |
| C | Continue | Proceed to next step | Calling step file |

### aeList Values

| Value | Domain | Verify Methods | Discover Methods |
|-------|--------|----------------|------------------|
| `general` | Default | 5 | 4 |
| `architecture` | Technical | 5 | 3 |
| `coherence-deep` | Quality | 6 | 2 |
| `core-design` | Design | 4 | 4 |
| `creative` | Creative | 3 | 7 |
| `deep-exploration` | Research | 4 | 6 |
| `first-principles` | Analysis | 3 | 5 |
| `implementation` | Technical | 5 | 3 |
| `narrative` | Storytelling | 4 | 5 |
| `planning` | Project | 5 | 4 |
| `platform-audience` | Market | 4 | 5 |
| `quality` | QA | 6 | 3 |
| `research` | Discovery | 3 | 6 |
| `sanity` | Validation | 7 | 2 |
| `security` | Security | 6 | 4 |
| `stakeholder` | Users | 4 | 5 |
| `vision` | Strategy | 3 | 6 |

### Finding Severity Levels

| Level | Meaning | Action Required |
|-------|---------|-----------------|
| CRITICAL | Blocks implementation | Must fix before proceeding |
| IMPORTANT | Affects quality | Should fix before proceeding |
| MINOR | Nice to fix | Can defer |

### Return Protocol Summary

| From | Returns To | What Happens |
|------|------------|--------------|
| Quick Verify | Checkpoint menu | User sees results, decides next action |
| Deep Verify | Checkpoint menu | User reviews findings, applies fixes |
| Quick Discover | Checkpoint menu | User reviews insights, incorporates |
| Deep Discover | Checkpoint menu | User confirms understanding |
| Party Mode | Checkpoint menu | User applies discussion insights |
| Continue (C) | Next step file | Content saved, workflow advances |

---

## Glossary

| Term | Definition |
|------|------------|
| **Checkpoint** | A pause point in a workflow step where user can verify/discover/continue |
| **aeList** | Advanced Elicitation List - domain-specific methods for a step type |
| **Method** | A structured questioning/analysis technique (#1-122) |
| **Frontmatter** | YAML configuration at the top of markdown files |
| **Quick Mode** | Fast, automated verification/discovery (~500-800 tokens) |
| **Deep Mode** | Comprehensive, user-guided verification/discovery |
| **Self-discipline** | Agent checking its own work for shortcuts/bias |
| **Party Mode** | Multi-agent discussion with different AI personas |

---

*Generated: 2026-01-06*
*Documentation for BMAD Checkpoint Menu System v7.0*
