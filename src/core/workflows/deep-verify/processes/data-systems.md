# Process: Data Systems Verification

## Triggers

Keywords that activate this process:
- database, DB
- ACID, transaction
- index, indexing
- query, SQL, NoSQL
- schema, table, collection
- shard, sharding, partition
- replication, replica
- consistency (in data context)
- migration
- backup, recovery
- cache, caching

---

## Steps

### Step 1: Extract Data Claims

**Do:** List ALL claims about data management.

Look for these claim types:
- ACID compliance
- Consistency model
- Scalability approach
- Performance guarantees
- Durability guarantees
- Query capabilities

**Output Format:**
```
| Claim Type | Claimed? | Location | Exact Quote |
|------------|----------|----------|-------------|
| ACID | [full/partial] | §[X] | "[quote]" |
| Consistency | [level] | §[X] | "[quote]" |
| Scalability | [approach] | §[X] | "[quote]" |
| Performance | [metric] | §[X] | "[quote]" |
```

---

### Step 2: Check ACID Claims

**Do:** If ACID claimed, verify all four properties.

**Uses:** domain-knowledge-base.md §2.Database Terms

**ACID Verification:**
```
| Property | Mechanism | Verified? |
|----------|-----------|-----------|
| Atomicity | Transactions/rollback | [YES/NO/UNCLEAR] |
| Consistency | Constraints/validation | [YES/NO/UNCLEAR] |
| Isolation | Locking/MVCC/level specified | [YES/NO/UNCLEAR] |
| Durability | WAL/fsync/replication | [YES/NO/UNCLEAR] |
```

**Red Flags:**
- "ACID-compliant" without specifying isolation level
- "ACID" for NoSQL without explanation of how
- Partial ACID claimed as full ACID

**Output:** ACID analysis

---

### Step 3: Check CAP Position

**Do:** For distributed databases, identify CAP trade-off.

**Uses:** domain-knowledge-base.md §1.Distributed Systems, §1.Database Systems

**CAP Analysis:**
```
Is database distributed/replicated? [YES/NO]

If YES:
- Consistency claimed: [type]
- Availability claimed: [guarantee]
- Partition handling: [behavior]

What is sacrificed during partition?
- If unclear → IMPORTANT finding
- If claims all three → CRITICAL finding
```

**Output:** CAP position analysis

---

### Step 4: Check Index Trade-offs

**Do:** Assess indexing claims.

**Uses:** domain-knowledge-base.md §1.Database Systems

**Index Checks:**
```
| Claim | Trade-off | Check |
|-------|-----------|-------|
| "Fast queries" | More indexes = slower writes | Write performance mentioned? |
| "Fast writes" | Fewer indexes = slower queries | Query performance mentioned? |
| "Both fast" | Possible with read replicas/caching | Architecture supports this? |
```

**Output:** Index trade-off analysis

---

### Step 5: Check Schema Design

**Do:** Assess schema design claims.

**Normalization Trade-offs:**
```
| Approach | Pro | Con | Check |
|----------|-----|-----|-------|
| Normalized | Less redundancy | More joins | Join performance? |
| Denormalized | Faster reads | Data inconsistency risk | Sync strategy? |
```

**Red Flags:**
- "No joins needed" with normalized schema
- "Consistent" with denormalized without sync strategy
- "Schema-less" with complex relationships

**Output:** Schema design assessment

---

## Finding Templates

### CRITICAL Findings

**CAP Violation:**
```
Finding: Distributed database claims all CAP properties.
Claims:
- Consistency: "[quote]"
- Availability: "[quote]"
- Partition Tolerance: "[quote]"
Theorem: CAP - cannot have all three.
Severity: CRITICAL
```

### IMPORTANT Findings

**ACID Ambiguity:**
```
Finding: Claims ACID without specifying isolation level.
Claim: "[quote]"
Issue: Isolation level significantly affects behavior.
Severity: IMPORTANT
Recommendation: Specify isolation level (read committed, serializable, etc.)
```

**Index Trade-off Ignored:**
```
Finding: Claims fast reads AND writes without addressing index trade-off.
Claim: "[quote]"
Issue: More indexes speed reads but slow writes.
Severity: IMPORTANT
Recommendation: Clarify indexing strategy and expected trade-offs.
```

**CAP Ambiguity:**
```
Finding: Distributed database doesn't clarify CAP trade-off.
Issue: Unclear what happens during network partition.
Severity: IMPORTANT
Recommendation: Specify behavior during partition (favor C or A).
```

---

## Process Metrics

| Metric | Target |
|--------|--------|
| Steps | 5 |
| Tokens | 1.5-2.5K |
| Time | 2-3 min |
| Domain-KB sections used | §1.Database, §1.Distributed, §2.Database Terms, §3.Database Checklist |
