# Universal Verification Protocol Test Orchestrator

**Version: 2.0**
**Purpose**: Test ANY verification protocol against standardized trap tasks with measurable metrics and full token economy tracking.

---

## Supported Protocols

| Protocol ID | Name | File | Output Type |
|-------------|------|------|-------------|
| `DV-V6.1` | Deep Verify V6.1 | `workflow-v6.1.md` | Phases + Findings |
| `DV-V6.2` | Deep Verify V6.2 | `workflow-v6.2.md` | Phases + Findings |
| `DV-V6.3` | Deep Verify V6.3 | `workflow-v6.3.md` | Phases + Findings |
| `DV-V6.4` | Deep Verify V6.4 | `workflow-v6.4.md` | Phases + Findings |
| `DV-V6.5` | Deep Verify V6.5 | `workflow-v6.5.md` | Phases + Findings |
| `DV-V6.6` | Deep Verify V6.6 | `workflow-v6.6.md` | Phases + Findings |
| `DV-V7.0` | Deep Verify V7.0 | `workflow-v7.0.md` | Phases + Findings |
| `DV-LITE` | Deep Verify Lite | `workflow-v6-lite.md` | Phases + Findings |
| `VGD` | Tensor V-GD Protocol | `quality_gates/Tensor-Based-Verification-Protocol.md` | Lambda V + Gradient Hotspots |
| `QVP` | Quadrant Verification | `quality_gates/Quadrant-Verification-Protocol.md` | 4 Scans + SPOF |
| `UAQG` | Universal Agent QG | `quality_gates/Universal-Agent-Quality-Gate-Protocol.md` | Quality Gates |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL TEST ORCHESTRATOR                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   SELECT     │    │   SELECT     │    │   CONFIG     │                   │
│  │   PROTOCOL   │───→│   TASK       │───→│   RUNS       │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│         │                   │                   │                            │
│         └───────────────────┴───────────────────┘                            │
│                             │                                                │
│                             ▼                                                │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │                    EXECUTION ENGINE                           │           │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐               │           │
│  │  │  AGENT   │───→│ PROTOCOL │───→│ ADAPTER  │               │           │
│  │  │  ×N RUNS │    │  VERIFY  │    │ (OUTPUT) │               │           │
│  │  └──────────┘    └──────────┘    └──────────┘               │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                             │                                                │
│                             ▼                                                │
│  ┌──────────────────────────────────────────────────────────────┐           │
│  │                    EVALUATION ENGINE                          │           │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐               │           │
│  │  │  BLIND   │───→│  METRICS │───→│   LOG    │               │           │
│  │  │  EVAL    │    │  COMPUTE │    │ RESULTS  │               │           │
│  │  └──────────┘    └──────────┘    └──────────┘               │           │
│  └──────────────────────────────────────────────────────────────┘           │
│                             │                                                │
│                             ▼                                                │
│                    ┌──────────────┐                                         │
│                    │   COMPARE    │                                         │
│                    │   PROTOCOLS  │                                         │
│                    └──────────────┘                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Experiment Configuration

### 0.1 Select Protocol

```markdown
## Protocol Selection

Protocol ID: [DV-V6 / VGD / QVP / UAQG / ...]
Protocol File: [path to protocol file]
Protocol Version: [version]

### Protocol Characteristics
- Output format: [Findings / Lambda V / 4 Scans / ...]
- Expected output structure: [describe]
- Key metrics produced: [list]
```

### 0.2 Select Task

```markdown
## Task Selection

Task ID: T[1-21]
Task Name: [from trap-tasks.md]
Difficulty: [Standard / Advanced]
Expected Errors: [count from ground-truth.md]
Max Points: [weighted score]
```

### 0.3 Run Configuration

```markdown
## Run Configuration

Number of Runs: [1 minimum]
Agent Model: [sonnet / opus / haiku]
Agent Isolation: [confirmed - no access to ground-truth]

### Protocol-Specific Parameters
[List any parameters specific to selected protocol]
```

---

## Phase 0.5: Artifact Check (NEW - Reuse Logic)

**Purpose:** Avoid regenerating artifacts that already exist. Artifacts are expensive to generate and should be reused across protocol tests.

### 0.5.1 Check Artifact Existence

```markdown
## Artifact Check for Task T[N]

Artifact Location: `src/testing/results/experiments/artifacts/`
Expected File: `artifact-t[N].md` (from trap-tasks.md → Artifact File field)

### Check Result:
```

**Decision Tree:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARTIFACT CHECK                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Check: Does artifact-t[N].md exist?                            │
│                                                                  │
│  ┌────────────────────────┬────────────────────────────────────┐│
│  │                        │                                    ││
│  │   YES (EXISTS)         │   NO (NOT FOUND)                   ││
│  │                        │                                    ││
│  │   ✓ INFORM:            │   ✗ INFORM:                        ││
│  │   "Artifact found:     │   "Artifact NOT found:             ││
│  │    artifact-t[N].md    │    artifact-t[N].md                ││
│  │    Proceeding to       │    Launching subagent to           ││
│  │    verification"       │    generate artifact..."           ││
│  │                        │                                    ││
│  │   → SKIP Phase 1       │   → EXECUTE Phase 1                ││
│  │   → GO TO Phase 2      │     (via subagent)                 ││
│  │                        │   → SAVE to artifact-t[N].md       ││
│  │                        │   → GO TO Phase 2                  ││
│  │                        │                                    ││
│  └────────────────────────┴────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.5.2 Communication Templates

**When artifact EXISTS:**
```
✓ ARTIFACT FOUND: artifact-t[N].md
  Location: src/testing/results/experiments/artifacts/artifact-t[N].md
  Status: Using existing artifact for verification
  Action: Proceeding to Phase 2 (Protocol Verification)
```

**When artifact NOT FOUND:**
```
✗ ARTIFACT NOT FOUND: artifact-t[N].md
  Expected at: src/testing/results/experiments/artifacts/artifact-t[N].md
  Status: Artifact does not exist - generation required
  Action: Launching subagent to execute Task T[N] from trap-tasks.md
```

### 0.5.3 Subagent Delegation (when artifact missing)

When artifact doesn't exist, spawn a subagent with:
- **Type:** general-purpose
- **Task:** Execute T[N] from trap-tasks.md
- **Output:** Save result to `artifact-t[N].md`
- **Isolation:** Subagent must NOT access ground-truth.md

---

## Phase 0.6: Subagent Tracking Registry (CRITICAL)

**Purpose**: Main orchestrator MUST maintain a registry linking each subagent to its process, task, and token usage. This enables accurate cost and effectiveness analysis per process.

### 0.6.1 Registry Structure

The orchestrating agent MUST maintain this registry throughout the experiment:

```markdown
## SUBAGENT TRACKING REGISTRY

### Session Information
- Session ID: [from ~/.claude session]
- Session Path: ~/.claude/projects/[project]/[session-id]/
- Experiment ID: EXP-[YYYY-MM-DD]-[NNN]

### Agent Registry Table
| Entry | Test ID | Process | Task | Run# | Agent ID | Slug | Input | Output | Cache | Total | Cost USD | Status |
|-------|---------|---------|------|------|----------|------|-------|--------|-------|-------|----------|--------|
| 1 | WF[ver]-T[N]-R1 | [process.md] | T[N] | 1 | [pending] | [pending] | - | - | - | - | - | PLANNED |
| 2 | WF[ver]-T[N]-R2 | [process.md] | T[N] | 2 | [pending] | [pending] | - | - | - | - | - | PLANNED |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Test ID Format:** `WF[version]-T[N]-R[run#]` (e.g., `WFv7.0-T10-R1`)

**Column Definitions:**
- `Test ID`: Unique identifier for process-task-run combination
- `Input/Output/Cache`: Token counts from session_usage_analyzer.py
- `Total`: Sum of Input + Output + Cache (cost tokens)
- `Cost USD`: Calculated using Claude Opus 4.5 pricing
```

### 0.6.2 Tracking Protocol (MANDATORY)

**BEFORE spawning each subagent:**

```markdown
## Pre-Spawn Registration - Entry [N]

Registering planned subagent:
- Process: [exact filename, e.g., workflow-v6.5.md]
- Task: T[N]
- Run Number: [1/2/3]
- Purpose: [artifact generation / protocol verification]
- Status: PLANNED
- Timestamp: [ISO 8601]
```

**IMMEDIATELY AFTER subagent returns:**

```markdown
## Post-Spawn Update - Entry [N]

Subagent completed:
- Agent ID: [7-char hash from Task tool result]
- Agent Slug: [three-word-name from Task tool result]
- Log File: ~/.claude/projects/[project]/[session]/subagents/agent-[id].jsonl
- Status: COMPLETED
- Completion Time: [ISO 8601]
```

**AFTER collecting tokens from JSONL:**

```markdown
## Token Collection - Entry [N]

Tokens collected from agent-[id].jsonl:
- Input Tokens: [sum]
- Output Tokens: [sum]
- Cache Created: [sum]
- **Total Tokens**: [grand total]
- Status: TOKENS_COLLECTED
```

### 0.6.3 Complete Registry Example

```markdown
## SUBAGENT TRACKING REGISTRY

### Session Information
- Session ID: d68903dc-3331-4b11-8693-72a038b61a9f
- Session Path: ~/.claude/projects/BMAD-METHOD/d68903dc.../
- Experiment ID: EXP-2025-01-12-001

### Agent Registry Table
| Entry | Process | Task | Run# | Agent ID | Slug | Total Tokens | Status |
|-------|---------|------|------|----------|------|--------------|--------|
| 1 | workflow-v6.5.md | T3 | 1 | a1b2c3d | witty-red-book | 45,230 | TOKENS_COLLECTED |
| 2 | workflow-v6.5.md | T3 | 2 | e4f5g6h | calm-blue-tree | 42,100 | TOKENS_COLLECTED |
| 3 | workflow-v6.5.md | T3 | 3 | i7j8k9l | swift-green-star | 48,500 | TOKENS_COLLECTED |
| 4 | workflow-v6.6.md | T3 | 1 | m0n1o2p | quiet-yellow-moon | 38,200 | TOKENS_COLLECTED |
| 5 | workflow-v6.6.md | T3 | 2 | q3r4s5t | bright-orange-wave | 39,800 | TOKENS_COLLECTED |
| 6 | workflow-v7.0.md | T3 | 3 | u6v7w8x | deep-purple-cloud | 41,100 | TOKENS_COLLECTED |

### Token Summary by Process
| Process | Task | Runs | Total Tokens | Avg Tokens | Findings | Avg CPF |
|---------|------|------|--------------|------------|----------|---------|
| workflow-v6.5.md | T3 | 3 | 135,830 | 45,277 | 12 | 11,319 |
| workflow-v6.6.md | T3 | 3 | 119,100 | 39,700 | 15 | 7,940 |
```

### 0.6.4 Enforcement Rules (BLOCKING - NO EXCEPTIONS)

**CRITICAL - Orchestrator MUST:**

1. ✅ Create registry BEFORE first subagent spawn
2. ✅ Register each planned subagent with Process + Task BEFORE spawning
3. ✅ Update registry with Agent ID + Slug IMMEDIATELY after spawn (BLOCKING)
4. ✅ Run session_usage_analyzer.py AFTER all subagents complete (NOT manual JSONL reading)
5. ✅ Map analyzer output to registry rows by Agent ID
6. ✅ Include complete registry in experiment-log.md

**BLOCKING GATES (EXPERIMENT STOPS IF VIOLATED):**

| Gate | Check | Violation = EXPERIMENT INVALID |
|------|-------|-------------------------------|
| GATE-1 | Agent ID recorded after each spawn | Missing Agent ID → STOP, do not spawn more |
| GATE-2 | All Agent IDs are 7-char hex | Placeholder "[pending]" → STOP |
| GATE-3 | Tokens from session_usage_analyzer.py only | Manual JSONL read → INVALIDATE |
| GATE-4 | 1:1 mapping Agent ID ↔ Registry row | Duplicate/missing → INVALIDATE |

**FORBIDDEN ACTIONS:**

| Action | Why Forbidden |
|--------|---------------|
| ✗ Manual JSONL file reading | Bypasses session_usage_analyzer.py |
| ✗ Token estimates (~5K, ~50000) | Not real data |
| ✗ Proceeding without Agent ID | Cannot map tokens later |
| ✗ Using token_extractor.py | DEPRECATED - use session_usage_analyzer.py |

**FAILURE MODES:**

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Missing Agent ID | Registry shows "PLANNED" after completion | STOP - check Task tool output, if missing restart |
| session_usage_analyzer.py fails | Error message | FIX issue, re-run analyzer, DO NOT use manual extraction |
| Wrong process mapping | Process column empty | INVALIDATE experiment, restart with proper registration |

### 0.6.6 ONE SUBAGENT = ONE TEST (CRITICAL RULE)

**MANDATORY CONSTRAINT:**
- Each subagent MUST execute exactly ONE process for exactly ONE task
- Subagent for `workflow-v6.6` + `T10` CANNOT also test `T11` or `workflow-v7.0`
- Violation detection: If same Agent ID appears with different Process or Task → INVALID

**Rationale:** Enables accurate cost attribution per process-task combination. Token costs from `session_usage_analyzer.py` are per-agent, so each agent must map to exactly one test.

**Enforcement:**
1. **Before spawning:** Verify no duplicate Process+Task+Run# combination in registry
2. **After completion:** Verify agent produced output for ONLY the assigned Process+Task
3. **During token collection:** Each Agent ID maps to exactly one row in registry

**Violation Handling:**
- If agent tested multiple processes/tasks → INVALIDATE results
- Re-run with proper isolation (separate subagent per test)
- Flag in experiment log as "ISOLATION_VIOLATION"

### 0.6.7 Verification Checkpoint

Before proceeding to Phase 1, confirm:
- [ ] Registry created with Session ID
- [ ] All planned runs registered with Process + Task
- [ ] Registry format matches template

---

## Phase 1: Execute Agent Task (Conditional)

**CONDITION:** Only execute if artifact does NOT exist (see Phase 0.5)

**If artifact EXISTS:** Skip Phase 1, proceed directly to Phase 2.

**If artifact NOT EXISTS:** Execute via subagent, save to artifact file.

### 1.1 Agent Prompt Template

```markdown
You are an expert software architect. Complete the following task thoroughly.

## Task
[Insert task from trap-tasks.md - VERBATIM]

## Instructions
1. Read all requirements carefully
2. Design a complete solution addressing every requirement
3. Document all assumptions explicitly
4. Consider edge cases and failure modes
5. Provide implementation guidance

## Constraints
- Do NOT access any files outside the task description
- Make explicit any information you need but don't have
- If requirements conflict, document the conflict and your resolution

## Deliverable Format
Provide your solution as a structured design document.
```

### 1.2 Capture Per Agent Run

```markdown
## Agent Run [1/2/3]

### Output
[Save as artifact-run-N.md]

### Token Count
- Input: [N]
- Output: [N]
- Total: [N]
```

### 1.3 Token Collection via session_usage_analyzer.py (MANDATORY - NO ALTERNATIVES)

**Purpose**: Extract REAL token usage using ONLY the official session analyzer script.

**⛔ FORBIDDEN METHODS (WILL INVALIDATE EXPERIMENT):**
- ❌ Manual JSONL file reading
- ❌ token_extractor.py script (DEPRECATED)
- ❌ Estimating tokens (~5K, ~50,000, "about 50000")
- ❌ Any token source other than session_usage_analyzer.py

**✅ REQUIRED METHOD:**

```bash
# ONLY WAY to get token data:
python src/core/usage/session_usage_analyzer.py <SESSION_ID> --base-dir <CLAUDE_PROJECTS_PATH>

# Example:
python src/core/usage/session_usage_analyzer.py be18c6d0-46c0-4530-bde9-f535ad152abe \
  --base-dir "C:\Users\lukasz.krysik\.claude\projects\C--Users-lukasz-krysik-Desktop-BMAD-MY-REPO-BMAD-METHOD"
```

**Output Format (Parse This):**
```
[SUBAGENTS] (36 agents)
----------------------------------------
Agent ID         Messages    Input      Output     Total
------------------------------------------------------------------
a0c5fe1         3           51,800     9,989      61,789
a0e4381         3           76,458     11,111     87,569
...
```

**Mapping Protocol:**

1. For each Agent ID in analyzer output:
2. Find matching row in SUBAGENT TRACKING REGISTRY
3. Update registry with Input, Output, Total from analyzer
4. Calculate Cost USD using pricing formula
5. Update Status to TOKENS_COLLECTED

**Token Collection Template:**
```markdown
## Token Collection via session_usage_analyzer.py

### Analyzer Execution
- Command: python src/core/usage/session_usage_analyzer.py [SESSION_ID] --base-dir [PATH]
- Session ID: [UUID]
- Execution Time: [timestamp]
- Agents Found: [count]

### Registry Update
| Agent ID | Process | Task | Input | Output | Total | Cost USD | Status |
|----------|---------|------|-------|--------|-------|----------|--------|
| a0c5fe1 | workflow-v7.0.md | T17 | 51,800 | 9,989 | 61,789 | $1.23 | TOKENS_COLLECTED |

### Validation
- [ ] All Agent IDs from analyzer mapped to registry
- [ ] No approximate values (~) in any token field
- [ ] Total matches sum of Input + Output + Cache
```

**IF session_usage_analyzer.py FAILS:**
- ⛔ DO NOT proceed with manual extraction
- ⛔ DO NOT use token_extractor.py
- ✅ FIX the issue (check Python, path, session ID)
- ✅ Re-run analyzer
- ✅ If still fails: EXPERIMENT INVALID, restart required

### 1.4 TOKEN VALIDATION GATE (BLOCKING - EXPERIMENT STOPS HERE IF FAILED)

**CRITICAL: DO NOT PROCEED without session_usage_analyzer.py data.**

Before moving to Phase 2, verify:

| Check | Required | Failure Action |
|-------|----------|----------------|
| Agent ID recorded | 7-char hex hash for EACH subagent | STOP - cannot recover without Agent ID |
| session_usage_analyzer.py executed | Yes | Run it now |
| All agents mapped | Every analyzer Agent ID has registry row | Find missing mapping |
| Token values | Integer from analyzer (no ~) | Re-run analyzer |

**BLOCKING CRITERIA - If ANY of these, EXPERIMENT IS INVALID:**
- Token value contains `~` (approximate)
- Agent ID is placeholder like `[pending]` or `abc1234`
- Token source is NOT session_usage_analyzer.py
- Any unmapped Agent ID (analyzer output not in registry)

**Valid Example:**
```
✓ Agent ID: a63f852 (from Task tool result)
✓ Tokens: 61789 (from session_usage_analyzer.py output)
✓ Slug: purring-seeking-treasure
✓ Registry row exists with Process + Task
```

**INVALID Example (EXPERIMENT MUST BE RESTARTED):**
```
✗ Agent ID: [pending]  ← not captured during spawn
✗ Tokens: ~50,000  ← estimate, not from analyzer
✗ Source: manual JSONL read  ← FORBIDDEN
```

### 1.5 Integrated Token Collection via session_usage_analyzer.py

**MANDATORY**: After all subagent executions complete, orchestrator MUST run the session analyzer to get accurate token data for all subagents at once.

#### 1.5.1 Execution Command

```bash
# Windows
python src/core/usage/session_usage_analyzer.py [SESSION_ID] --base-dir "C:\Users\[user]\.claude\projects\[encoded-project-path]"

# Linux/Mac
python src/core/usage/session_usage_analyzer.py [SESSION_ID] --base-dir ~/.claude/projects/[encoded-project-path]
```

Where:
- `SESSION_ID`: UUID of current session (e.g., `be18c6d0-46c0-4530-bde9-f535ad152abe`)
- `encoded-project-path`: Project path with slashes as dashes (e.g., `C--Users-lukasz-krysik-Desktop-BMAD-MY-REPO-BMAD-METHOD`)

#### 1.5.2 Parse Output and Map to Registry

The script outputs per-subagent data:
```
[SUBAGENTS] (36 agents)
Agent ID         Messages    Input      Output     Total
a0c5fe1         3           51,800     9,989      61,789
a0e4381         3           76,458     11,111     87,569
...
```

**Mapping Algorithm:**
1. For each `agent_id` in script output
2. Find matching entry in SUBAGENT TRACKING REGISTRY (by Agent ID column)
3. Update entry with exact token values: Input, Output, Total
4. Calculate Cost USD using pricing formula (see 1.5.3)
5. Update Status to `TOKENS_COLLECTED`

**Registry Update Example:**
```markdown
| Entry | Test ID | Process | Task | Run# | Agent ID | Slug | Input | Output | Cache | Total | Cost USD | Status |
|-------|---------|---------|------|------|----------|------|-------|--------|-------|-------|----------|--------|
| 1 | WFv7.0-T1-R1 | workflow-v7.0.md | T1 | 1 | a0c5fe1 | witty-red-book | 51800 | 9989 | 0 | 61789 | $1.22 | TOKENS_COLLECTED |
```

#### 1.5.3 USD Cost Calculation (Claude Opus 4.5 Pricing)

```
COST_USD = (input_tokens × $15/1M) + (output_tokens × $75/1M) + (cache_creation × $18.75/1M) + (cache_read × $1.50/1M)

Simplified per-token multipliers:
- Input: × 0.000015
- Output: × 0.000075
- Cache creation: × 0.00001875
- Cache read: × 0.0000015

Example:
  Input: 51,800 × $0.000015 = $0.777
  Output: 9,989 × $0.000075 = $0.749
  Cache creation: 0 × $0.00001875 = $0
  TOTAL COST: $1.53
```

#### 1.5.4 NO FALLBACK - Analyzer Required (BLOCKING)

**⛔ THERE IS NO FALLBACK. session_usage_analyzer.py IS THE ONLY ALLOWED METHOD.**

If Python script fails:
1. ⛔ DO NOT read JSONL files manually
2. ⛔ DO NOT use token_extractor.py (DEPRECATED)
3. ⛔ DO NOT estimate tokens
4. ✅ FIX the issue:
   - Check Python installation: `python --version`
   - Check path exists: `ls [CLAUDE_PROJECTS_PATH]/[SESSION_ID]/`
   - Check session ID is correct UUID
5. ✅ Re-run analyzer after fixing
6. ✅ If still fails after 3 attempts: **EXPERIMENT INVALID - RESTART REQUIRED**

**Rationale:** Manual extraction is error-prone and has produced incorrect data in past experiments. Only session_usage_analyzer.py provides reliable, validated token data.

#### 1.5.5 Token Collection Completion Checkpoint

Before proceeding to Phase 2:
- [ ] session_usage_analyzer.py executed successfully
- [ ] All subagent IDs from output mapped to registry
- [ ] All Input/Output/Total columns populated with integers
- [ ] All Cost USD calculated
- [ ] All Status updated to TOKENS_COLLECTED

---

## Phase 2: Execute Protocol Verification (×N Runs)

### 2.1 Protocol Invocation Templates

#### For Deep Verify (DV-*) Protocols

```markdown
## Deep Verify V[X]

TASK: [Original task - VERBATIM]
CONTENT: [Agent artifact from run N]
TYPE: Document
ENVIRONMENT: BMAD-METHOD project, testing context

Mode: [G] Guided
```

#### For V-GD (Tensor) Protocol

```markdown
## V-GD Verification

TASK: [Original task - VERBATIM]
CONTENT: [Agent artifact from run N]

Execute V-GD Protocol from: quality_gates/Tensor-Based-Verification-Protocol.md

Required methods: #115, #84, #81, #109, #39, #67, #26
Output: V-GD Verification Report with Lambda V indicator
```

#### For QVP (Quadrant) Protocol

```markdown
## QVP Verification

CONTENT: [Agent artifact from run N]
CONTEXT: [Original task description]

Execute Quadrant Verification Protocol from: quality_gates/Quadrant-Verification-Protocol.md

Execute 4 scans:
1. Topology Scan (Persistent Homology)
2. Information Theory Scan (Mutual Information)
3. Control Theory Scan (Lyapunov Stability)
4. Graph Theory Scan (Min-Cut)

Output: QVP Verification Report
```

### 2.2 Protocol Output Capture

#### Deep Verify Output Structure

```markdown
## Protocol Run [N] - Deep Verify

### Phase Summary
| Phase | Status | Key Output |
|-------|--------|------------|
| 0 | [PASS/FAIL] | [summary] |
| 2 | [PASS/FAIL] | [concerns count] |
| 3 | [PASS/FAIL] | [methods count] |
| 4 | [PASS/FAIL] | [findings count] |
| 5 | [PASS/FAIL] | [confirmed count] |

### Findings
| ID | Concern | Severity | Description |
|----|---------|----------|-------------|
| 1 | [A1/B2/C3] | [CRITICAL/IMPORTANT/MINOR] | [brief] |

Total Tokens: [N]
```

#### V-GD Output Structure

```markdown
## Protocol Run [N] - V-GD

### Tensor Metrics
- Dimensions: [i × j × k]
- Initial Loss L_start: [value]
- Final Loss L_final: [value]
- Optimization Steps: [count]

### Critical Gradient Hotspots (Top 3)
| ID | Location (i,j,k) | Method | Gradient dL | Issue Type |
|----|------------------|--------|-------------|------------|
| 01 | [...] | #[N] | [value] | [type] |

### Null Space Analysis (k=2)
- Discovered Voids: [list]
- Risk Entropy: [High/Medium/Low]

### Adversarial Stress Test
- Failure Vectors: [list]
- System Response: [Stable/Unstable/Partial]

### Final Quality Indicator
- Lambda V: [NUMERIC VALUE]
- Status: [VERIFIED / ACCEPTABLE / FAILED]

Total Tokens: [N]
```

#### QVP Output Structure

```markdown
## Protocol Run [N] - QVP

### Topology Scan (Persistent Homology)
- Holes Found: [list]
- Status: [CLEAN / HOLES DETECTED]

### Information Theory Scan (Mutual Information)
- Ghosts (Hidden Couplings): [list]
- Dead Links: [list]
- Status: [INDEPENDENT / COUPLED]

### Control Theory Scan (Lyapunov Stability)
- Stability: [Stable / Unstable]
- Sensitivity: [Low / High]
- Explosive Errors: [list]

### Graph Theory Scan (Min-Cut)
- Min-Cut Nodes: [list]
- SPOF Risk: [NONE / CRITICAL]
- Bottlenecks: [list]

### Critical Findings
[Prioritized list]

Total Tokens: [N]
```

---

## Phase 3: Universal Blind Evaluation

### 3.1 Normalize Findings to Common Format

**Before matching to ground truth, convert ALL protocol outputs to:**

```markdown
## Normalized Finding

Finding ID: [Protocol]-[Run]-F[N]
Original Location: [where in protocol output]
Description: [what defect was found]
Evidence: [quote or reference]
Severity: [CRITICAL / IMPORTANT / MINOR]
Category: [SCOPE/ASSUME/SKIP/SHALLOW/CONFLICT/INTEGRATE/EDGE/DEPEND/PERF/SECURE]
Confidence: [HIGH / MEDIUM / LOW]
```

### 3.2 Protocol-to-Finding Mapping

| Protocol | What Counts as Finding |
|----------|------------------------|
| Deep Verify | Confirmed findings from Phase 5 |
| V-GD | Critical Gradient Hotspots + Null Space Voids |
| QVP | All items in Critical Findings Summary |

### 3.3 Severity Mapping

| Protocol Output | Maps to Severity |
|-----------------|------------------|
| DV: 🔴 / CRITICAL | CRITICAL |
| DV: 🟠 / IMPORTANT | IMPORTANT |
| DV: 🟡 / MINOR | MINOR |
| V-GD: dL > 0.8 | CRITICAL |
| V-GD: dL 0.5-0.8 | IMPORTANT |
| V-GD: dL < 0.5 | MINOR |
| V-GD: Lambda V < 0.8 | → add CRITICAL finding |
| QVP: SPOF = CRITICAL | CRITICAL |
| QVP: Unstable | CRITICAL |
| QVP: Holes/Ghosts | IMPORTANT |
| QVP: Dead Links/Bottlenecks | MINOR |

### 3.4 Blind Matching Process

```markdown
## Blind Finding Assessment

### Step 1: List Normalized Findings (BEFORE seeing ground-truth)
| Finding ID | Description | Evidence | Confidence |
|------------|-------------|----------|------------|
| [P]-R[N]-F[M] | [description] | [quote] | HIGH/MED/LOW |

### Step 2: NOW open ground-truth.md and match

### Detection Matrix
| Error ID | Category | Severity | Finding Match | Match Quality | Points |
|----------|----------|----------|---------------|---------------|--------|
| T[N]-E[M] | [cat] | [sev] | [finding IDs or N/A] | Y/P/N | [pts] |

### Match Criteria
- Y (full): Problem identified correctly, evidence matches
- P (partial): Problem area correct but details incomplete
- N (none): Not detected
```

---

## Phase 4: Calculate Universal Metrics

### 4.1 Core Metrics (All Protocols)

| Metric | Formula | Protocol-Agnostic? |
|--------|---------|-------------------|
| DR | Detected / Expected × 100 | YES |
| WDS | Σ(detected × weight) / Σ(weight) × 100 | YES |
| TE | WDS_points / Tokens × 1000 | YES |
| P | TP / (TP + FP) | YES |
| DQ | Σ(depth) / findings | YES (with mapping) |
| CC | categories_hit / 10 × 100 | YES |

### 4.2 Protocol-Specific Metrics

#### Deep Verify Specific

- CE_layer_A, CE_layer_B, CE_layer_C (Concern Efficiency)
- Phase completion rate

#### V-GD Specific

- Lambda V final value
- Gradient descent convergence rate
- Null Space coverage (% of k=2 items addressed)

#### QVP Specific

- Scan coverage (4/4 scans completed)
- SPOF detection rate
- Stability classification accuracy

### 4.3 Metrics Calculation Template

```markdown
## Metrics - [Protocol] on Task T[N]

### Per-Run Metrics
| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev | RS |
|--------|-------|-------|-------|------|--------|-----|
| DR | | | | | | |
| DR_critical | | | | | | |
| WDS | | | | | | |
| Tokens | | | | | | |
| TE | | | | | | |
| P | | | | | | |
| DQ | | | | | | |
| CC | | | | | | |
| OES | | | | | | |

### Protocol-Specific
[Add protocol-specific metrics here]

### Stability Assessment
- All RS > 0.8: STABLE
- Any RS 0.6-0.8: MODERATE
- Any RS < 0.6: UNSTABLE
```

---

## Phase 5: Log Results

### Universal Experiment Log Entry

```markdown
## Experiment EXP-[YYYY-MM-DD]-[NNN]

### Configuration
- Protocol: [ID and version]
- Task: T[N] - [name]
- Runs: [count]
- Agent Model: [model]
- Date: [timestamp]

### Results Summary
| Metric | Value | Interpretation |
|--------|-------|----------------|
| DR | [%] | [Excellent/Good/Moderate/Poor] |
| WDS | [%] | |
| TE | [value] | [High/Moderate/Low] |
| P | [value] | [Clean/Acceptable/Noisy] |
| DQ | [value] | [Excellent/Good/Moderate/Shallow] |
| CC | [%] | |
| OES | [value] | |
| RS | [value] | [Stable/Moderate/Unstable] |

### Token Economy Results (NEW)

#### Subagent Token Breakdown
| Run | Agent ID | Slug | Input | Output | Cache Created | Total |
|-----|----------|------|-------|--------|---------------|-------|
| 1 | [id] | [slug] | [N] | [N] | [N] | [N] |
| 2 | [id] | [slug] | [N] | [N] | [N] | [N] |
| 3 | [id] | [slug] | [N] | [N] | [N] | [N] |
| **Sum** | - | - | [sum] | [sum] | [sum] | **[total]** |

#### Economy Metrics
| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev | Interpretation |
|--------|-------|-------|-------|------|--------|----------------|
| TE_econ | | | | | | [Excellent/Good/Acceptable/Poor] |
| CPF | | | | | | [Very Economical/Economical/Moderate/Expensive] |
| PES | | | | | | [Excellent/Good/Acceptable/Needs Optimization] |

### Protocol-Specific Results
[Protocol-specific metrics and observations]

### Findings Analysis
- Expected errors: [N]
- Detected (full): [N]
- Detected (partial): [N]
- Missed: [N]
- False positives: [N]
- Bonus valid: [N]

### Category Coverage
| Category | Detection Rate |
|----------|---------------|
| SCOPE | [%] |
| ASSUME | [%] |
| SKIP | [%] |
| [etc.] | |

### Observations
[Free-form notes on protocol behavior]

### Issues Identified
[List of problems with the protocol]

### Recommendations
[Suggestions for protocol improvement]
```

### 5.1 Generate Summary File

After completing Phase 5 logging, create a standardized summary file for quick reference and cross-experiment comparison.

#### 5.1.1 Summary File Location

```
src/testing/results/summaries/YYYYMMDD-HHMM_results.md
```

Example: `20260113-1430_results.md` = January 13, 2026 at 14:30

#### 5.1.2 Summary File Format

```markdown
# Test Results Summary - [YYYY-MM-DD HH:MM]

## Session Info
- Session ID: [UUID from session_usage_analyzer.py]
- Experiment ID: EXP-[YYYY-MM-DD]-[NNN]
- Duration: [start time - end time]
- Total Subagents: [count]

## Results Matrix

| Process | Task | WDS | DR | P | DQ | OES | Tokens | Cost USD | TE_econ | CPF | Traps Detected | Efficiency |
|---------|------|-----|-----|---|-----|-----|--------|----------|---------|-----|----------------|------------|
| workflow-v7.0 | T1 | 85.2 | 80% | 0.92 | 3.5 | 78.4 | 45230 | $0.89 | 18.8 | 3769 | 12/15 | 0.027 |
| workflow-v6.6 | T1 | 72.1 | 70% | 0.88 | 3.2 | 65.3 | 38400 | $0.75 | 18.8 | 3200 | 10/15 | 0.026 |

## Token Usage by Subagent

| Agent ID | Slug | Process | Task | Input | Output | Cache | Total | Cost USD |
|----------|------|---------|------|-------|--------|-------|-------|----------|
| a1b2c3d | witty-red-book | workflow-v7.0 | T1 | 15230 | 8420 | 21580 | 45230 | $0.89 |
| e4f5g6h | calm-blue-tree | workflow-v6.6 | T1 | 12100 | 7200 | 19100 | 38400 | $0.75 |

## Efficiency Analysis

| Process | Traps/Token | Cost/Trap | Trap Detection Rate | TTE | ROI |
|---------|-------------|-----------|---------------------|-----|-----|
| workflow-v7.0 | 0.00027 | $0.074 | 80% | 0.27 | 1148 |
| workflow-v6.6 | 0.00026 | $0.075 | 67% | 0.26 | 962 |

## Key Findings
- [Summary of most important findings]
- [Critical traps missed by any process]
- [Unexpected discoveries]

## Recommendations
- [Based on metrics analysis]
- [Suggested process improvements]
```

#### 5.1.3 Efficiency Calculations

```
Efficiency (Traps/Token) = Traps_Detected / Total_Tokens
Cost_Per_Trap = Cost_USD / Traps_Detected
TTE (Token-Trap Efficiency) = Traps_Detected / Total_Tokens × 1000
ROI = (WDS × Traps_Detected) / Cost_USD
```

#### 5.1.4 Update experiment-log.md Dashboard

After creating summary file, add ONE row to experiment-log.md Summary Dashboard:

```markdown
| EXP-[YYYY-MM-DD]-[NNN] | [date] | [workflow] | [task] | [DR] | [WDS] | [OES] | [tokens] | [$cost] | [summaries/YYYYMMDD-HHMM_results.md](summaries/YYYYMMDD-HHMM_results.md) |
```

**IMPORTANT:** DO NOT add full experiment details to experiment-log.md - those go in summaries/ file. Experiment-log.md is now primarily a dashboard with links.

---

## Phase 6: Cross-Protocol Comparison

### 6.1 Comparison Matrix

```markdown
## Protocol Comparison - Task T[N]

| Metric | DV-V6 | V-GD | QVP | Winner |
|--------|-------|------|-----|--------|
| DR | | | | |
| DR_critical | | | | |
| WDS | | | | |
| TE | | | | |
| P | | | | |
| DQ | | | | |
| OES | | | | |
| Tokens (total) | | | | |

### Token Economy Comparison (NEW)
| Protocol | Avg Tokens | TE_econ | CPF | PES | Economy Rank |
|----------|------------|---------|-----|-----|--------------|
| DV-V6 | | | | | |
| V-GD | | | | | |
| QVP | | | | | |
| **Best** | | | | | |

### Unique Strengths
- DV-V6: [what it catches that others miss]
- V-GD: [what it catches that others miss]
- QVP: [what it catches that others miss]

### Unique Weaknesses
- DV-V6: [blind spots]
- V-GD: [blind spots]
- QVP: [blind spots]

### Category Detection Comparison
| Category | DV-V6 | V-GD | QVP |
|----------|-------|------|-----|
| SCOPE | ✓/~/✗ | | |
| ASSUME | | | |
| [etc.] | | | |

### Recommendation
[Which protocol for which use case]
```

---

## Phase 7: Decide & Evolve

### 7.1 Stopping Criteria

**STOP testing specific protocol if ANY:**
- [ ] DR_critical > 90% for 3 consecutive experiments
- [ ] Protocol shows no improvement after 3 variants
- [ ] Token efficiency becomes unacceptable (TE < 0.05)
- [ ] OES regression: new version scores LOWER than previous for 2 consecutive experiments
- [ ] Maximum iterations reached: 10 versions of same protocol family

**CONTINUE if:**
- [ ] DR_critical < 90%
- [ ] Known blind spots remain addressable
- [ ] Token efficiency acceptable
- [ ] OES trending upward or stable

**ROLLBACK TRIGGER:**
If new protocol version has OES < (previous OES - 5%), consider:
1. Reverting to previous version
2. Documenting what change caused regression
3. Trying alternative modification approach

### 7.2 Protocol Evolution

If continuing with protocol improvement:

```markdown
## Protocol Evolution Plan

### Issues to Address
1. [Issue from experiment]
2. [Issue from experiment]

### Proposed Changes
[Specific modifications to protocol]

### New Variant Name
[Protocol-vX.Y]

### Hypothesis
[What should improve]

### Next Experiment
- Same task (for comparison)
- New task (for generalization)
```

---

## Quick Start Commands

### Test Single Protocol on Single Task

```
Test protocol [PROTOCOL_ID] on task T[N]:

1. Read: universal-test-orchestrator.md
2. Read: [protocol file]
3. Read: trap-tasks.md (select T[N])
4. Execute Phase 0 (configuration)
5. Execute Phase 1 (3 agent runs)
6. Execute Phase 2 (3 protocol verifications)
7. Execute Phase 3 (blind evaluation)
8. Execute Phase 4 (calculate metrics)
9. Execute Phase 5 (log results)
```

### Compare Multiple Protocols on Same Task

```
Compare protocols [P1], [P2], [P3] on task T[N]:

1. For each protocol:
   - Run full experiment (Phases 0-5)
   - Log to protocol-specific experiment log
2. Execute Phase 6 (cross-protocol comparison)
3. Document findings in comparison-log.md
```

### Test Protocol Across Multiple Tasks

```
Test protocol [PROTOCOL_ID] on tasks T[1], T[3], T[5]:

For each task:
1. Run full experiment (Phases 0-5)
2. Log results

After all tasks:
- Calculate aggregate metrics across tasks
- Identify consistent blind spots
- Determine generalization capability
```

---

## File Organization

```
src/
├── testing/                                    # ALL TESTING FILES
│   ├── framework/                              # Testing framework
│   │   ├── prompt.md                          # Test prompts (START HERE)
│   │   ├── universal-test-orchestrator.md     # This file - main orchestrator
│   │   ├── protocol-registry.md               # Protocol definitions & invocation
│   │   ├── universal-metrics.md               # Metrics formulas & guards
│   │   ├── meta-analysis-protocol.md          # Phase 8 meta-analysis
│   │   ├── meta-analysis-execution-template.md # Meta-analysis template
│   │   ├── AGENT-INSTRUCTIONS-UNIVERSAL.md    # Quick start for agents
│   │   ├── method-matrix.md                   # Methods per action (reference)
│   │   └── modification-operators.md          # How to evolve protocols (reference)
│   │
│   ├── tasks/                                  # Test tasks
│   │   ├── trap-tasks.md                      # Standard tasks T1-T10
│   │   ├── trap-tasks-v2.md                   # Advanced tasks T11-T15
│   │   └── ground-truth.md                    # Expected errors (CONFIDENTIAL)
│   │
│   └── results/                                # Experiment results
│       ├── experiment-log.md                  # All experiments log
│       ├── comparisons/                       # Protocol comparisons
│       │   └── comparison-[PROTOCOL1]-vs-[PROTOCOL2].md
│       ├── experiments/                       # Detailed experiment data
│       │   └── artifacts/                     # Agent outputs
│       │       └── artifact-[task]-run-[N].md
│       └── verifications/                     # Protocol outputs
│           └── verify-[task]-run-[N].md
│
├── core/
│   ├── workflows/deep-verify/                  # Deep Verify protocols
│   │   ├── workflow-v5.md                     # NEW VERSIONS GO HERE
│   │   ├── workflow-v6.md
│   │   ├── workflow-v6.1.md
│   │   ├── workflow-v6.2.md
│   │   ├── workflow-v6.3.md
│   │   └── workflow-v6-lite.md
│   │
│   └── quality_gates/                          # Other protocols
│       ├── Tensor-Based-Verification-Protocol.md
│       ├── Quadrant-Verification-Protocol.md
│       └── Universal-Agent-Quality-Gate-Protocol.md
│
└── methods/
    └── methods.csv                             # Method database
```

### Version File Locations (IMPORTANT)

| Protocol Type | New Version Location |
|--------------|---------------------|
| Deep Verify | `src/core/workflows/deep-verify/workflow-v[X.Y].md` |
| Quality Gates | `src/core/quality_gates/[Protocol-Name]-v[N].md` |

**RULE: New protocol versions go in SAME directory as the original, NOT in testing/**

---

## Phase 8: Meta-Analysis (Periodic)

**Trigger:** After 3+ experiments OR when seeking radical improvements.

**Protocol:** Use `meta-analysis-protocol.md` with exploration methods.

### 8.1 Purpose

Go BEYOND incremental optimization to discover:
- Hidden patterns in test results
- Theoretical foundations for improvement
- Radical paradigm shifts
- Anti-patterns and harmful combinations

### 8.2 Methods Applied

| Method # | Name | Purpose |
|----------|------|---------|
| #23 | Analogical Reasoning | Find solutions from other domains |
| #46 | SCAMPER | Systematic innovation |
| #102 | Cantor's Diagonal Escape | Break out of current paradigm |
| #103 | Fourier Domain Shift | Reveal hidden patterns |
| #109 | Contraposition Inversion | Find guaranteed failure paths |
| #115 | Negative Space Cartography | Map unexplored options |
| #122 | Sorites Paradox | Find essential vs decorative elements |
| #123 | Newcomb's Paradox | Find surprising approaches |
| #124 | Braess Paradox | Check if additions help or hurt |

### 8.3 Execution

```markdown
## Meta-Analysis Execution

1. Collect all experiments from experiment-log.md
2. Track all changes between protocol versions
3. Apply exploration methods (meta-analysis-protocol.md)
4. Use execution template (meta-analysis-execution-template.md)
5. Generate:
   - DO recommendations (high confidence)
   - TRY experiments (needs validation)
   - AVOID anti-patterns (proven harmful)
   - INVESTIGATE areas (research directions)
6. Save to: src/testing/results/analysis/meta-analysis-[DATE].md
```

### 8.4 Output

```markdown
## Meta-Analysis Output

### Key Patterns Discovered
[What domain shifts revealed]

### Paradigm Escape Proposal
[N+1 approach that differs from all current]

### Optimization Targets
- CUT: [high-cost, low-value elements]
- EXPAND: [low-cost, high-value elements]

### Radical Proposals
[Surprising approaches worth testing]

### Anti-Patterns to Avoid
[Combinations/changes proven harmful]

### Theoretical Foundations
[Research directions for deeper optimization]
```

### 8.5 Feedback Loop (CRITICAL)

**Meta-analysis MUST feed back into protocols:**

```
Meta-Analysis Output → Protocol Evolution Input

1. DO recommendations → Immediate changes to next protocol version
2. TRY experiments → New experiment configurations in Phase 0
3. AVOID anti-patterns → Add to protocol-registry.md as warnings
4. INVESTIGATE areas → Add to research backlog
```

**Verification of feedback loop:**
- [ ] Each meta-analysis produces at least 1 actionable change
- [ ] Changes are tracked in Change Registry (Phase 1.2 of meta-analysis)
- [ ] Next experiment references meta-analysis findings

---

## Checklist Summary

### Per Experiment (All Required)
- [ ] Phase 0: Protocol and task selected, runs configured
- [ ] Phase 1: N agent runs with isolation verified
- [ ] Phase 2: N protocol runs with output captured
- [ ] Phase 3: Blind evaluation (normalize findings, match to ground truth)
- [ ] Phase 4: Universal metrics calculated
- [ ] Phase 5: Results logged
- [ ] Phase 6: (Optional) Cross-protocol comparison
- [ ] Phase 7: Decision on continue/stop/evolve
- [ ] Phase 8: (Periodic) Meta-Analysis with exploration methods

### Detailed Measurement Checklist

**Token Measurements (per subagent):**
- [ ] Agent Run 1: agentId=___ input=___ output=___ cache=___ total=___
- [ ] Agent Run 2: agentId=___ input=___ output=___ cache=___ total=___
- [ ] Agent Run 3: agentId=___ input=___ output=___ cache=___ total=___
- [ ] Protocol Run 1: agentId=___ input=___ output=___ cache=___ total=___
- [ ] Protocol Run 2: agentId=___ input=___ output=___ cache=___ total=___
- [ ] Protocol Run 3: agentId=___ input=___ output=___ cache=___ total=___

**Time Measurements:**
- [ ] Agent Run 1-3 Time: ___sec, ___sec, ___sec
- [ ] Protocol Run 1-3 Time: ___sec, ___sec, ___sec

**Validation:**
- [ ] Agent Isolation: confirmed no access to ground-truth.md
- [ ] Blind evaluation: findings described BEFORE opening ground-truth.md
- [ ] Results saved to experiment-log.md

**Token Economy:**
- [ ] Process Token Total = ___
- [ ] TE_econ, CPF, PES calculated

### Edge Cases

| Situation | Action | Log As |
|-----------|--------|--------|
| Protocol detects 0 findings | Continue (may be valid) | `ZERO_FINDINGS` |
| WDS = 0 | Skip TE, TiE, OES, TE_econ | `WDS_ZERO` |
| Agent fails to generate artifact | Repeat run | `AGENT_FAILURE` |
| Token collection fails | Check JSONL exists | `TOKEN_COLLECTION_FAILED` |
| Measurement missing | Document reason | `MEASUREMENT_MISSING` |

---

## Appendix A: Session Usage Analyzer Integration

This appendix provides complete instructions for integrating `session_usage_analyzer.py` into the test orchestration workflow.

### A.1 Prerequisites

- Python 3.8+ installed and accessible from command line
- Script location: `src/core/usage/session_usage_analyzer.py`
- Access to Claude projects directory: `~/.claude/projects/`

### A.2 Finding Session ID

Session ID is the UUID of your Claude Code session. Find it by:

1. **Check directory listing:**
   ```bash
   # Windows
   dir /O-D "C:\Users\[user]\.claude\projects\[encoded-project-path]\"

   # Linux/Mac
   ls -lt ~/.claude/projects/[encoded-project-path]/ | head -5
   ```

2. **Current session** is the most recently modified directory with UUID format

3. **UUID format:** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (e.g., `be18c6d0-46c0-4530-bde9-f535ad152abe`)

### A.3 Execution

```bash
# Windows
python src/core/usage/session_usage_analyzer.py [SESSION_UUID] --base-dir "C:\Users\[user]\.claude\projects\[encoded-path]"

# Linux/Mac
python src/core/usage/session_usage_analyzer.py [SESSION_UUID] --base-dir ~/.claude/projects/[encoded-path]

# Example (Windows)
python src/core/usage/session_usage_analyzer.py be18c6d0-46c0-4530-bde9-f535ad152abe --base-dir "C:\Users\lukasz.krysik\.claude\projects\C--Users-lukasz-krysik-Desktop-BMAD-MY-REPO-BMAD-METHOD"
```

### A.4 Output Format

The script outputs structured data:

```
============================================================
SESSION USAGE REPORT: be18c6d0-46c0-4530-bde9-f535ad152abe
============================================================

[MAIN SESSION]
Input Tokens:        55,898
Output Tokens:       64,591
Cache Creation:      882,699
Cache Read:          18,919,525
-----------------------------
Total Input:         19,858,122
Total Tokens:        19,922,713
Messages:            227

[SUBAGENTS] (36 agents)
----------------------------------------
Agent ID         Messages    Input      Output     Total
------------------------------------------------------------------
a0c5fe1         3           51,800     9,989      61,789
a0e4381         3           76,458     11,111     87,569
...

[ESTIMATED COST] (Claude Opus 4.5 pricing)
Base input:    $5.7718
Cache write:   $48.9102
Cache read:    $32.0787
Output:        $39.8384
-----------------------------
TOTAL:         $126.5990
```

### A.5 Mapping Output to Registry

For each agent in the `[SUBAGENTS]` section:

1. **Extract Agent ID** (first column, e.g., `a0c5fe1`)
2. **Find matching row** in SUBAGENT TRACKING REGISTRY by Agent ID column
3. **Update columns:**
   - Input: from `Input` column
   - Output: from `Output` column
   - Total: from `Total` column
   - Cache: calculate from Total - Input - Output (or use JSONL directly)
4. **Calculate Cost USD** using formula from A.6
5. **Update Status** to `TOKENS_COLLECTED`

### A.6 Cost Formula (Claude Opus 4.5)

```
Cost USD = (input × $15/1M) + (output × $75/1M) + (cache_creation × $18.75/1M) + (cache_read × $1.50/1M)

Per-token multipliers:
- Input tokens: × $0.000015
- Output tokens: × $0.000075
- Cache creation tokens: × $0.00001875
- Cache read tokens: × $0.0000015

Example:
  Input: 51,800 tokens × $0.000015 = $0.777
  Output: 9,989 tokens × $0.000075 = $0.749
  Cache creation: 0 tokens = $0.000
  Cache read: 0 tokens = $0.000
  TOTAL COST: $1.526 ≈ $1.53
```

### A.7 Metrics Calculation Reference

After collecting all token data, calculate these metrics:

| Metric | Formula | Good Value | Interpretation |
|--------|---------|------------|----------------|
| **TE_econ** | WDS_Points / Total_Tokens × 10000 | > 20 | Token Economy - higher is better |
| **CPF** | Total_Tokens / Confirmed_Findings | < 3000 | Cost Per Finding - lower is better |
| **CPT_USD** | Total_Cost / Traps_Detected | < $0.10 | Cost Per Trap - lower is better |
| **TTE** | Traps_Detected / Total_Tokens × 1000 | > 0.2 | Token-Trap Efficiency - higher is better |
| **ROI** | (WDS × Traps) / Cost_USD | > 500 | Return on Investment - higher is better |
| **PES** | (OES × 100) / log10(Total_Tokens) | > 15 | Protocol Economy Score |

### A.8 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `No subagents found` | Wrong session ID or path | Verify session UUID and base-dir path |
| `Permission denied` | File access issue | Run with appropriate permissions |
| `Agent ID not in registry` | Unregistered subagent | Check if agent was spawned for this experiment |
| `Token count mismatch` | Multiple JSONL messages | Verify all messages were summed |

### A.9 Integration Checklist

Before finalizing token collection:

- [ ] session_usage_analyzer.py executed without errors
- [ ] All expected Agent IDs appear in output
- [ ] Each Agent ID mapped to exactly one registry row
- [ ] All token columns populated with integers (no approximations)
- [ ] Cost USD calculated for each agent
- [ ] Total tokens match sum of individual agents
- [ ] Summary file created in summaries/ directory
