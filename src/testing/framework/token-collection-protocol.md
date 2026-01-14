# Token Collection Protocol (MANDATORY)

**Version:** 1.0
**Purpose:** Enforce consistent, accurate token data collection in testing framework.

---

## Core Principle

**ONLY ONE SOURCE OF TOKEN DATA IS ALLOWED:**

```bash
python src/core/usage/session_usage_analyzer.py <SESSION_ID> --base-dir <PATH>
```

**ALL OTHER METHODS ARE FORBIDDEN.**

---

## Forbidden Actions

| Action | Why Forbidden | Consequence |
|--------|---------------|-------------|
| ❌ Manual JSONL reading | Error-prone, inconsistent | EXPERIMENT INVALID |
| ❌ token_extractor.py | DEPRECATED | EXPERIMENT INVALID |
| ❌ Estimating tokens (~5K) | Not real data | EXPERIMENT INVALID |
| ❌ Proceeding without Agent ID | Cannot map tokens later | EXPERIMENT INVALID |
| ❌ Approximations (about, roughly) | Not precise | EXPERIMENT INVALID |

---

## Required Workflow

### Step 1: Agent ID Recording (BLOCKING)

**IMMEDIATELY after each subagent spawn:**

```markdown
## Subagent Spawned - Entry [N]
- Process: workflow-v7.0.md
- Task: T17
- Agent ID: a0c5fe1  ← FROM Task tool result
- Slug: purring-seeking-treasure
- Status: SPAWNED
- Timestamp: 2026-01-14T10:30:00Z
```

**⛔ CANNOT spawn next subagent until Agent ID is recorded.**

### Step 2: Run session_usage_analyzer.py

**AFTER all subagents complete:**

```bash
python src/core/usage/session_usage_analyzer.py be18c6d0-46c0-4530-bde9-f535ad152abe \
  --base-dir "C:\Users\lukasz.krysik\.claude\projects\C--Users-lukasz-krysik-Desktop-BMAD-MY-REPO-BMAD-METHOD"
```

### Step 3: Parse Output

```
[SUBAGENTS] (36 agents)
Agent ID         Messages    Input      Output     Total
------------------------------------------------------------------
a0c5fe1         3           51,800     9,989      61,789
a0e4381         3           76,458     11,111     87,569
```

### Step 4: Map to Registry

For EACH Agent ID from analyzer output:
1. Find matching row in SUBAGENT TRACKING REGISTRY
2. Update with Input, Output, Total from analyzer
3. Calculate Cost USD
4. Set Status = TOKENS_COLLECTED

### Step 5: Validate

| Check | Required |
|-------|----------|
| All Agent IDs mapped | Every analyzer Agent ID has registry row |
| No approximations | No ~ or K suffixes in any token value |
| 1:1 mapping | Each Agent ID appears exactly once |
| Process+Task recorded | Every row has Process and Task filled |

---

## SUBAGENT TRACKING REGISTRY Template

```markdown
## SUBAGENT TRACKING REGISTRY

### Session Info
- Session ID: be18c6d0-46c0-4530-bde9-f535ad152abe
- Experiment: EXP-2026-01-14-001

### Registry Table
| Entry | Process | Task | Agent ID | Slug | Input | Output | Total | Cost USD | Status |
|-------|---------|------|----------|------|-------|--------|-------|----------|--------|
| 1 | workflow-v7.0.md | T17 | a0c5fe1 | purring-seeking-treasure | 51800 | 9989 | 61789 | $1.23 | TOKENS_COLLECTED |
| 2 | workflow-v6.6.md | T17 | a0e4381 | purring-seeking-treasure | 76458 | 11111 | 87569 | $1.98 | TOKENS_COLLECTED |

### Metrics Summary
| Process | Task | Avg Tokens | Avg Cost | WDS | VPK | DR |
|---------|------|------------|----------|-----|-----|-----|
| workflow-v7.0.md | T17 | 61,789 | $1.23 | 73% | 0.118 | 64% |
| workflow-v6.6.md | T17 | 87,569 | $1.98 | 58% | 0.066 | 54% |
```

---

## Blocking Gates

| Gate | When | Check | Failure = |
|------|------|-------|-----------|
| GATE-1 | After each spawn | Agent ID recorded | STOP, cannot spawn more |
| GATE-2 | Before Phase 2 | All Agent IDs are 7-char hex | STOP |
| GATE-3 | After analyzer run | All agents mapped to registry | EXPERIMENT INVALID |
| GATE-4 | Before metrics | No ~ in token values | EXPERIMENT INVALID |

---

## Error Handling

### session_usage_analyzer.py Fails

```
⛔ DO NOT:
- Read JSONL manually
- Use token_extractor.py
- Estimate tokens

✅ DO:
1. Check Python: python --version
2. Check path: ls [PATH]/[SESSION_ID]/
3. Check session ID format (UUID)
4. Fix issue and re-run analyzer
5. If 3 attempts fail: EXPERIMENT INVALID, restart
```

### Agent ID Not Captured

```
⛔ CANNOT proceed without Agent ID
⛔ Tokens cannot be mapped without Agent ID

✅ DO:
1. Check Task tool output for agentId field
2. If missing: EXPERIMENT INVALID
3. Restart experiment with proper Agent ID recording
```

---

## Metrics Calculation (ONLY with Valid Token Data)

**Prerequisites:**
- [ ] All tokens from session_usage_analyzer.py
- [ ] All Agent IDs mapped to Process+Task
- [ ] No approximate values

**Calculate:**

```
VPK = WDS / (Total_Tokens / 1000)
TE_econ = WDS / Total_Tokens × 10000
CPF = Total_Tokens / Confirmed_Findings
Cost_USD = (Input × $0.000015) + (Output × $0.000075) + (Cache × $0.00001875)
```

---

## Validation Checklist (Before Finalizing Experiment)

- [ ] session_usage_analyzer.py executed successfully
- [ ] All subagent Agent IDs appear in analyzer output
- [ ] Each Agent ID maps to exactly one registry row
- [ ] All registry rows have Process + Task filled
- [ ] All token values are integers (no ~, no K/M)
- [ ] Total tokens match sum of individual agents
- [ ] Cost USD calculated for each agent
- [ ] Metrics (VPK, TE_econ, CPF) calculated from real data

---

## References

- `universal-test-orchestrator.md` - Phase 0.6, Phase 1.3-1.5
- `universal-metrics.md` - GUARD 9, GUARD 10
- `session_usage_analyzer.py` - src/core/usage/

**Created:** 2026-01-14
