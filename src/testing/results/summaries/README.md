# Test Results Summaries

This directory contains standardized summary files for each test run.

## File Naming Convention

Format: `YYYYMMDD-HHMM_results.md`
- YYYY: Year (4 digits)
- MM: Month (2 digits)
- DD: Day (2 digits)
- HHMM: Hour and minute (24h format)

Example: `20260113-1430_results.md` = January 13, 2026 at 14:30

## File Structure

Each summary file contains:

1. **Session Info** - UUID, experiment ID, duration
2. **Results Matrix** - All metrics per process-task combination
3. **Token Usage by Subagent** - Detailed breakdown per agent
4. **Efficiency Analysis** - Traps/token, cost/trap ratios
5. **Key Findings** - Summary of detected issues
6. **Recommendations** - Based on metrics analysis

## Summary File Template

```markdown
# Test Results Summary - [YYYY-MM-DD HH:MM]

## Session Info
- Session ID: [UUID]
- Experiment ID: EXP-[YYYY-MM-DD]-[NNN]
- Duration: [start - end]

## Results Matrix

| Process | Task | WDS | DR | P | DQ | OES | Tokens | Cost USD | TE_econ | CPF | Traps Detected | Efficiency |
|---------|------|-----|-----|---|-----|-----|--------|----------|---------|-----|----------------|------------|
| workflow-v7.0 | T1 | 85.2 | 80% | 0.92 | 3.5 | 78.4 | 45230 | $0.89 | 18.8 | 3769 | 12/15 | 0.027 |

## Token Usage by Subagent

| Agent ID | Slug | Process | Task | Input | Output | Cache | Total | Cost USD |
|----------|------|---------|------|-------|--------|-------|-------|----------|
| a1b2c3d | witty-red-book | workflow-v7.0 | T1 | 15230 | 8420 | 21580 | 45230 | $0.89 |

## Efficiency Analysis

| Process | Traps/Token | Cost/Trap | Trap Detection Rate |
|---------|-------------|-----------|---------------------|
| workflow-v7.0 | 0.00027 | $0.074 | 80% |

## Key Findings
- [summary of findings]

## Recommendations
- [based on metrics]
```

## Metrics Reference

| Metric | Formula | Good Value |
|--------|---------|------------|
| WDS | Weighted Detection Score | > 70 |
| DR | Detection Rate (%) | > 80% |
| P | Precision | > 0.85 |
| OES | Overall Effectiveness Score | > 60 |
| TE_econ | WDS / Tokens × 10000 | > 20 |
| CPF | Tokens / Findings | < 3000 |
| Efficiency | Traps / Tokens | > 0.0002 |

## Viewing Results

To see latest results:
```bash
# Windows
dir /O-D src\testing\results\summaries\

# Linux/Mac
ls -lt src/testing/results/summaries/ | head -5
```

## Relationship to experiment-log.md

- `experiment-log.md` contains the **Summary Dashboard** with links to these files
- Historical experiments (before summaries/ restructure) remain in experiment-log.md
- New experiments: full details in summaries/, only dashboard row in experiment-log.md

## Token Data Source

Token data MUST come from `session_usage_analyzer.py`:
```bash
python src/core/usage/session_usage_analyzer.py [SESSION_ID] --base-dir "[CLAUDE_PROJECTS_PATH]"
```

See `universal-test-orchestrator.md` Appendix A for full integration instructions.
