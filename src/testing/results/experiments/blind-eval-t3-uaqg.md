# Blind Evaluation - UAQG on T3

**Protocol:** UAQG (Universal Agent Quality Gate Protocol)
**Task:** T3 - Session Memory Persistence
**Date:** 2026-01-11

---

## T3 Expected Errors (from ground-truth.md)

| ID | Category | Severity | Expected Error | Points |
|----|----------|----------|----------------|--------|
| T3-E1 | CONFLICT | CRITICAL | "Human-readable" + "concurrent access" = locking nightmare | 3 |
| T3-E2 | ASSUME | CRITICAL | "Memory decay" is algorithmically complex - will hand-wave | 3 |
| T3-E3 | CONFLICT | IMPORTANT | "Queryable" + "human-readable" + "10MB limit" = indexing needed | 2 |
| T3-E4 | SKIP | IMPORTANT | Privacy deletion in append-only human-readable format = hard | 2 |
| T3-E5 | PERF | MINOR | 10MB limit but "conversation history" can grow fast | 1 |
| T3-E6 | SECURE | IMPORTANT | "Delete specific memories" needs audit trail | 2 |

**Max Points:** 13 (2 CRITICAL × 3 + 3 IMPORTANT × 2 + 1 MINOR × 1)

---

## Run 1 Detection Matrix

| Error ID | UAQG Finding | Match | Quality | Points |
|----------|--------------|-------|---------|--------|
| T3-E1 | F2 (Race condition quota) | Y | Identified concurrency issue with quota enforcement | 3 |
| T3-E2 | F5 (Decay inconsistency), F8 (Formula ambiguity) | P | Identified decay issues but not "hand-waving" | 1.5 |
| T3-E3 | F3 (Filesystem scalability), F10 (YAML parsing) | P | Identified performance but not indexing specifically | 1 |
| T3-E4 | F6 (Immutability contradiction) | P | Related to deletion but not privacy-specific | 1 |
| T3-E5 | F3 (Filesystem scalability) | Y | Identified size/performance issue | 1 |
| T3-E6 | F9 (File permissions) | P | Security identified but not audit trail | 1 |

**Run 1 Total:** 8.5 / 13 points = **65.4% DR**

---

## Run 2 Detection Matrix

| Error ID | UAQG Finding | Match | Quality | Points |
|----------|--------------|-------|---------|--------|
| T3-E1 | F1 (Write lock unspecified), F5 (Graph consistency) | Y | Concurrency issues clearly identified | 3 |
| T3-E2 | F3 (Access boost undefined) | P | Identified decay detail gap but shallow | 1.5 |
| T3-E3 | F8 (Graph overhead unknown) | P | Performance concern but not indexing | 1 |
| T3-E4 | F2 (Immutability contradiction) | P | Related to compaction vs immutability | 1 |
| T3-E5 | N/A | N | Not detected | 0 |
| T3-E6 | N/A | N | Not detected | 0 |

**Run 2 Total:** 6.5 / 13 points = **50.0% DR**

---

## Run 3 Detection Matrix

| Error ID | UAQG Finding | Match | Quality | Points |
|----------|--------------|-------|---------|--------|
| T3-E1 | F1 (Race condition), F9 (OS locking) | Y | Clear concurrency detection | 3 |
| T3-E2 | F2 (Decay inconsistency), F5 (Priority conflict) | Y | Well-identified decay algorithmic issues | 3 |
| T3-E3 | F6 (Naive topic search) | Y | Identified query limitation | 2 |
| T3-E4 | F4 (Missing error handling) | P | Error handling but not privacy deletion | 1 |
| T3-E5 | F7 (No auto-compact) | Y | Size management identified | 1 |
| T3-E6 | F3 (Path traversal) | P | Security but not audit trail | 1 |

**Run 3 Total:** 11 / 13 points = **84.6% DR**

---

## Aggregate Results

| Metric | Run 1 | Run 2 | Run 3 | Mean | StdDev |
|--------|-------|-------|-------|------|--------|
| Points | 8.5 | 6.5 | 11 | 8.67 | 2.25 |
| DR (%) | 65.4 | 50.0 | 84.6 | 66.7 | 17.3 |
| Findings | 12 | 10 | 12 | 11.3 | 1.15 |
| CRITICAL detected | 1.5/2 | 1.5/2 | 2/2 | 1.67 | 0.29 |
| IMPORTANT detected | 2/3 | 1/3 | 2.5/3 | 1.83 | 0.76 |
| MINOR detected | 1/1 | 0/1 | 1/1 | 0.67 | 0.58 |

---

## Finding Consistency Analysis

| Error | Run 1 | Run 2 | Run 3 | Consistent? |
|-------|-------|-------|-------|-------------|
| T3-E1 (Concurrency) | Y | Y | Y | YES - all 3 |
| T3-E2 (Decay) | P | P | Y | YES - all 3 |
| T3-E3 (Index) | P | P | Y | YES - all 3 |
| T3-E4 (Deletion) | P | P | P | YES - all partial |
| T3-E5 (Size) | Y | N | Y | PARTIAL - 2/3 |
| T3-E6 (Audit) | P | N | P | PARTIAL - 2/3 |

**Finding Consistency (FC):** 4/6 fully consistent = **66.7%**

---

## False Positives Analysis

| Run | Finding | Ground-Truth Match | Verdict |
|-----|---------|-------------------|---------|
| 1 | F4 (Migration) | Not in T3 | FP (but BONUS_VALID) |
| 1 | F7 (Types) | Not in T3 | FP |
| 1 | F11 (Retry) | Not in T3 | FP |
| 1 | F12 (Observability) | Not in T3 | FP |
| 2 | F6 (Event schema) | Not in T3 | FP |
| 2 | F7 (Complexity) | Not in T3 | FP |
| 2 | F9 (Migration) | Not in T3 | FP (but BONUS_VALID) |
| 2 | F10 (Snapshot) | Not in T3 | FP |
| 3 | F8 (Incomplete) | Not in T3 | FP |
| 3 | F10 (Timestamp) | Not in T3 | FP |
| 3 | F11 (Directory) | Not in T3 | FP |
| 3 | F12 (Versioning) | Not in T3 | FP (but BONUS_VALID) |

**True Positives:** ~7 per run (matching T3 errors)
**False Positives:** ~5 per run (not in ground-truth)
**BONUS_VALID:** ~1 per run (real issues not in ground-truth)

**Precision:** 7 / (7+5) ≈ **0.58** (noisy but acceptable)

---

## Severity Detection by Gate

| Gate | Findings | CRITICAL Hit | IMPORTANT Hit | MINOR Hit |
|------|----------|--------------|---------------|-----------|
| G1 (Epistemic) | 0 | 0 | 0 | 0 |
| G2 (Logical) | 2-3 | 0.5 | 0.5 | 0 |
| G3 (Structural) | 0-3 | 0 | 0.5 | 0 |
| G4 (Technical) | 4-6 | 1.5 | 1.5 | 0.5 |
| G5 (Creative) | 0 | 0 | 0 | 0 |
| G6 (Strategic) | 3-4 | 0 | 0.5 | 0.5 |

**Observation:** Gate 4 (Technical) most productive. Gates 1 and 5 produce no T3-relevant findings.

---

## Summary

| Metric | Value |
|--------|-------|
| Mean DR | 66.7% |
| DR StdDev | 17.3% |
| Run Stability | 0.74 (Moderate) |
| Finding Consistency | 66.7% |
| Precision | 0.58 |
| Mean Findings | 11.3 |
| CRITICAL Detection Rate | 83.3% |
| IMPORTANT Detection Rate | 61.1% |

**UAQG Performance on T3:** GOOD
- Strong on CRITICAL errors (concurrency, decay)
- Moderate on IMPORTANT errors (indexing, deletion, audit)
- Variable on MINOR errors

**Characteristic:** UAQG is broad but noisy - finds many issues but ~40% are outside ground-truth scope. The 6-gate structure ensures coverage but generates false positives.
