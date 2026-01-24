# Process: Mechanism Design Verification

## Triggers

Keywords that activate this process:
- VCG, Vickrey, Clarke, Groves
- auction, bidding, allocation
- strategyproof, incentive compatible, DSIC, truthful
- mechanism, game theory
- payment, pricing
- individual rationality, IR
- budget balance, budget balanced
- efficiency, efficient allocation
- fairness (in economic context)

---

## Steps

### Step 1: Extract Claimed Properties

**Do:** List ALL properties the artifact claims about the mechanism.

Look for these property types:
- Strategyproofness / Incentive Compatibility / DSIC / Truthful
- Individual Rationality (IR)
- Efficiency / Pareto Efficiency / Allocative Efficiency
- Budget Balance / Budget Balanced
- Fairness (envy-free, proportional, etc.)
- Collusion Resistance
- Sybil Resistance

**Output Format:**
```
| Property | Claimed? | Location | Exact Quote |
|----------|----------|----------|-------------|
| Strategyproofness | YES/NO | §[X] | "[quote]" |
| Individual Rationality | YES/NO | §[X] | "[quote]" |
| Efficiency | YES/NO | §[X] | "[quote]" |
| Budget Balance | YES/NO | §[X] | "[quote]" |
| [other] | YES/NO | §[X] | "[quote]" |
```

---

### Step 2: Check Impossibility Theorems

**Do:** For the claimed properties, check if any combination violates known impossibility theorems.

**Uses:** domain-knowledge-base.md §1.Mechanism Design

**Check Matrix:**
```
| Claimed Combination | Theorem | Violated? |
|---------------------|---------|-----------|
| SP + IR + Efficiency + Budget Balance | Myerson-Satterthwaite | YES if all 4 claimed |
| VCG + Budget Balance | VCG Subsidy Requirement | YES if both claimed |
| Strategyproof + Non-dictatorial voting | Gibbard-Satterthwaite | YES if both claimed |
| Fair voting (all criteria) | Arrow's Theorem | YES if "fair" without trade-off |
```

**If violation found:** CRITICAL finding. Stop and record.

**Output:** List of theorem violations or "No violations found"

---

### Step 3: Identify Mechanism Type

**Do:** Determine what type of mechanism is described.

**Mechanism Types:**
- VCG / Vickrey / Clarke-Groves family
- Posted-price mechanism
- Combinatorial auction
- Double auction
- First-price / Second-price auction
- Matching mechanism
- Voting mechanism
- Custom / Hybrid

**Output:**
```
Mechanism type: [type]
Evidence: "[quote describing mechanism]"
```

---

### Step 4: Check Type-Specific Constraints

**Do:** For the identified mechanism type, check known constraints.

**Uses:** domain-knowledge-base.md §1.Mechanism Design, §1.Optimization

**Type Constraints:**
```
| Type | Constraint | Check |
|------|------------|-------|
| VCG | Requires external subsidy | Does artifact claim budget balance? |
| Combinatorial auction | NP-hard winner determination | Does artifact claim polynomial time? |
| Posted-price | Cannot achieve full efficiency | Does artifact claim efficiency? |
| First-price | Not strategyproof | Does artifact claim strategyproofness? |
```

**If constraint violated:** Record finding with severity based on claim strength.

**Output:** List of constraint violations or "No violations found"

---

### Step 5: Check Rule Consistency

**Do:** Examine if mechanism rules could break claimed properties.

**Red Flags:**
- History-dependent rules (past performance affects allocation) → Breaks SP
- Fairness adjustments based on behavior → Creates gaming incentive
- Redistribution based on participation → Strategic losing becomes profitable
- Reputation affecting allocation → Agents can manipulate reputation

**For each red flag found:**
1. Quote the rule from artifact
2. Explain how it could be gamed
3. State which property it breaks

**Uses:** domain-knowledge-base.md §4.Contradiction Patterns

**Output:**
```
| Rule | Location | Gaming Strategy | Property Broken | Severity |
|------|----------|-----------------|-----------------|----------|
| [rule] | §[X] | [how to game] | [property] | [sev] |
```

---

### Step 6: Check Proof Quality

**Do:** For each major claim, assess proof quality.

**Uses:** domain-knowledge-base.md §5.Proof Requirements

**Proof Quality Levels:**
1. Formal proof → Accept
2. Reference to literature → Accept with citation check
3. Proof sketch → Accept for non-critical, flag for critical
4. "By construction" → Demand actual construction
5. Assertion only → Flag as unsubstantiated

**For claims in impossibility theorem territory:**
- "Proof sketch" is NOT sufficient
- Must have formal proof or reference

**Output:**
```
| Claim | Proof Level | Acceptable? | Action Needed |
|-------|-------------|-------------|---------------|
| [claim] | [level] | YES/NO | [action if NO] |
```

---

## Finding Templates

### CRITICAL Findings

**M-S Violation:**
```
Finding: Artifact claims [SP/IR/Efficiency/Budget Balance] simultaneously.
Theorem: Myerson-Satterthwaite (1983) proves these four properties cannot coexist.
Evidence: [quotes for each claimed property]
Severity: CRITICAL
Confidence: [90-100%]
```

**VCG + Budget Balance:**
```
Finding: Artifact uses VCG mechanism and claims budget balance.
Theorem: VCG requires external subsidy by construction.
Evidence: "[VCG quote]" + "[budget balance quote]"
Severity: CRITICAL
Confidence: [90-100%]
```

### IMPORTANT Findings

**History Breaks SP:**
```
Finding: Mechanism has history-dependent rule that breaks strategyproofness.
Rule: "[quote]"
Gaming strategy: [how agent exploits this]
Severity: IMPORTANT
Confidence: [70-90%]
```

**Complexity Claim:**
```
Finding: Claims polynomial time for NP-hard problem without proof.
Claim: "[quote]"
Problem: [why NP-hard]
Severity: IMPORTANT
Confidence: [70-90%]
```

---

## Process Metrics

| Metric | Target |
|--------|--------|
| Steps | 6 |
| Tokens | 2-4K |
| Time | 3-5 min |
| Domain-KB sections used | §1.Mechanism, §1.Optimization, §4.Patterns, §5.Proofs |
