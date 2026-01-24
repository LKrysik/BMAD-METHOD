# Method Procedures — Detailed Operational Definitions
# LOAD: When executing any numbered method
# PURPOSE: Step-by-step instructions for each verification method

---

# LOADING INSTRUCTIONS:
# 1. Load this file when methods.csv description is insufficient
# 2. Each method has: What to do, Output format, Examples
# 3. Follow steps in order for consistent results

---

## Tier 1 Methods (Mandatory - Phase 1)

### #71 First Principles Analysis

**Purpose:** Strip away assumptions to rebuild from fundamental truths.

**What to do:**
1. Identify the 3-5 core claims of the artifact
2. For each claim, ask: "What must be fundamentally true for this to work?"
3. Check if those fundamentals are:
   - Explicitly stated and justified
   - Consistent with known constraints (physics, math, regulations)
   - Not contradicting each other

**Step-by-step:**
```
1. Read artifact overview/summary section
2. Extract core claims:
   - What does this artifact promise to deliver?
   - What capabilities does it claim?
   - What guarantees does it make?

3. For each claim, identify fundamentals:
   "Claim: System provides real-time updates"
   → Fundamental: Network latency must be low enough
   → Fundamental: Processing must complete within threshold
   → Fundamental: "Real-time" must be defined

4. Verify fundamentals:
   □ Is network assumption stated?
   □ Is processing time bounded?
   □ Is "real-time" defined (100ms? 1s? 10s?)?

5. Check for contradictions between fundamentals
```

**Output format:**
```
Core claims identified:
1. [Claim 1]
2. [Claim 2]
3. [Claim 3]

Fundamentals required:
Claim 1: [List fundamentals]
Claim 2: [List fundamentals]
Claim 3: [List fundamentals]

Fundamentals validity:
[x] Explicitly stated: [which ones]
[x] Consistent with constraints: [which ones]
[ ] Contradictions found: [describe]

FINDING (if any): [description]
QUOTE: "[exact text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #100 Vocabulary Consistency

**Purpose:** Ensure key terms are used consistently throughout.

**What to do:**
1. Extract all key terms (technical jargon, defined concepts)
2. For each term, find all locations where it's used
3. Check: Is the term used consistently everywhere?
4. Look for:
   - Synonyms (same concept, different words) — potential confusion
   - Homonyms (same word, different meanings) — potential contradiction

**Step-by-step:**
```
1. Scan for technical terms and domain jargon
2. Build term index:
   Term: "validation"
   - Section 2.1: "data validation" (input checking)
   - Section 4.3: "validation" (approval workflow)
   - Section 7.2: "validation set" (ML testing)

3. For each term with multiple uses:
   - Are they the same concept?
   - If different, is this clear from context?
   - Could a reader be confused?

4. Check for synonym pairs:
   "user" vs "customer" vs "client"
   - Same entity? → Confusion risk
   - Different entities? → Should be explicit
```

**Output format:**
```
Key terms extracted:
- [Term 1]: locations [X, Y, Z]
- [Term 2]: locations [A, B]
- [Term 3]: locations [C, D, E, F]

Synonyms found:
- [Term A] = [Term B]: potential confusion at [locations]

Homonyms found:
- [Term]: means X at [location], means Y at [location]

FINDING (if any): [description]
QUOTE: "[text from location 1]" vs "[text from location 2]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #17 Abstraction Laddering

**Purpose:** Check vertical coherence between abstraction levels.

**What to do:**
1. Identify all abstraction levels (high-level goals → mid-level design → implementation details)
2. Check vertical coherence: Do promises at one level match details at another?
3. Check for gaps: Are there jumps where intermediate steps are missing?
4. Check for orphans: Are there details that don't connect to any higher goal?

**Step-by-step:**
```
1. Map abstraction levels:
   HIGH: "System enables seamless collaboration"
    ↓
   MID: "Real-time sync, conflict resolution, presence"
    ↓
   LOW: "WebSocket protocol, CRDT merging, heartbeat"

2. Check vertical coherence:
   - Does "seamless" mean < 100ms latency?
   - Is that achievable with WebSocket + CRDT?
   - Any conflicts between levels?

3. Find gaps:
   - HIGH mentions "offline support"
   - LOW has no offline implementation details
   → GAP

4. Find orphans:
   - LOW has "audit logging" detail
   - No MID or HIGH goal connects to audit
   → ORPHAN (or missing requirement)
```

**Output format:**
```
Abstraction levels:
- HIGH (goals/vision): [list]
- MID (design/approach): [list]
- LOW (implementation): [list]

Vertical coherence check:
[x] HIGH → MID connected: [which ones]
[x] MID → LOW connected: [which ones]
[ ] Disconnects: [describe]

Gaps found:
- [HIGH promise] has no [MID/LOW] support

Orphans found:
- [LOW detail] connects to no [MID/HIGH]

FINDING (if any): [description]
QUOTE: "[exact text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

## Tier 2 Methods (Signal-based - Phase 2)

### #78 Assumption Excavation

**Purpose:** Surface hidden assumptions that could invalidate claims.

**What to do:**
1. For each mechanism or claim, ask: "What must be true for this to work?"
2. Dig through three layers:
   - Surface (conscious): Explicitly stated assumptions
   - Inherited (learned): Domain conventions not stated
   - Invisible (cultural): Unstated "obvious" assumptions
3. For unstated assumptions: Is this assumption reasonable? Always true?

**Step-by-step:**
```
1. Select key mechanism:
   "User authentication via OAuth"

2. Surface assumptions (stated):
   - "Users have Google/GitHub accounts"
   - "Network available during auth"

3. Inherited assumptions (domain):
   - OAuth provider is reliable
   - Token expiry is acceptable
   - Refresh tokens work

4. Invisible assumptions (unstated):
   - Users trust OAuth providers
   - Browser supports redirects
   - No MitM possible on redirect

5. Stress test each:
   - What if OAuth provider down?
   - What if user has no accounts?
   - What if corporate firewall blocks?
```

**Output format:**
```
Mechanism: [name]

Surface assumptions (stated):
- [assumption]: justified? [yes/no]

Inherited assumptions (domain):
- [assumption]: valid? [yes/no]

Invisible assumptions (unstated):
- [assumption]: reasonable? [yes/no/sometimes]

Risk assessment:
- [assumption] if wrong → [impact]

FINDING (if any): Hidden assumption "[X]" is [unreasonable/unstated/risky]
QUOTE: "[mechanism description that relies on assumption]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #84 Coherence Check

**Purpose:** Verify internal consistency across sections.

**What to do:**
1. For each section, summarize its key claim in one sentence
2. Compare claims across sections:
   - Do they support each other?
   - Do any contradict?
   - Are there gaps (A assumes X, but X never established)?
3. Check for orphan mechanisms (described but never used)

**Step-by-step:**
```
1. Summarize each section:
   Sec 2: "Data is validated at ingestion"
   Sec 4: "Processing assumes clean data"
   Sec 7: "Error handling catches invalid data"

2. Check consistency:
   - Sec 2 + Sec 4: consistent ✓
   - Sec 4 + Sec 7: contradiction?
     If data is clean (Sec 4), why error handling (Sec 7)?

3. Check gaps:
   - Sec 5 references "audit trail"
   - No section defines audit trail format
   → GAP

4. Check orphans:
   - Sec 6 describes "rollback mechanism"
   - No other section references rollback
   → ORPHAN (or missing integration)
```

**Output format:**
```
Section summaries:
- Sec 1: [one sentence]
- Sec 2: [one sentence]
- ...

Consistency matrix:
| Section | Supports | Contradicts | Gap |
|---------|----------|-------------|-----|
| 1 ↔ 2   | ✓        |             |     |
| 2 ↔ 3   |          | ✓           |     |
| ...     |          |             |     |

Orphan mechanisms:
- [mechanism] in [section] — not referenced elsewhere

FINDING (if any): [description]
QUOTE: "[Sec X]" vs "[Sec Y]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #85 Grounding Check

**Purpose:** Verify claims have evidence.

**What to do:**
1. For each significant claim, ask: "What evidence supports this?"
2. Classify evidence as:
   - Explicit (cited, demonstrated)
   - Implicit (follows logically from stated facts)
   - Missing (assertion without support)
3. Flag all claims with missing evidence
4. Apply CUI BONO: Who benefits from ungrounded claims?

**Step-by-step:**
```
1. Extract significant claims:
   - "System handles 10,000 concurrent users"
   - "Response time under 100ms"
   - "99.9% uptime"

2. For each claim, find evidence:
   Claim: "10,000 concurrent users"
   - Explicit evidence: None found
   - Implicit evidence: Architecture diagram shows load balancer
   - Verdict: PARTIALLY GROUNDED

   Claim: "99.9% uptime"
   - Explicit evidence: None (no SLA, no historical data)
   - Implicit evidence: None
   - Verdict: UNGROUNDED

3. CUI BONO analysis:
   - Who benefits from "99.9%" claim? Sales/marketing
   - Is there pressure to make this claim? Likely
   - Higher scrutiny warranted? Yes
```

**Output format:**
```
Claims analyzed:
| Claim | Explicit | Implicit | Verdict |
|-------|----------|----------|---------|
| [C1]  | [Y/N]    | [Y/N]    | [G/P/U] |
| [C2]  | [Y/N]    | [Y/N]    | [G/P/U] |

G = Grounded, P = Partially, U = Ungrounded

CUI BONO:
- [Claim]: benefits [who], scrutiny level [low/med/high]

FINDING (if any): Claim "[X]" is ungrounded
QUOTE: "[exact claim text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #86 Topological Hole Detection

**Purpose:** Find structural gaps in the system.

**What to do:**
1. Map elements as graph (nodes = components, edges = dependencies)
2. Find persistent holes:
   - Dead ends (components with no outbound connections)
   - Cycles without closure (infinite loops)
   - High-inbound-no-outbound clusters (sinks)

**Step-by-step:**
```
1. Build dependency graph:
   Nodes: [Auth, User Service, Database, Cache, API Gateway]
   Edges:
   - API Gateway → Auth
   - API Gateway → User Service
   - User Service → Database
   - User Service → Cache
   - Auth → Database

2. Analyze topology:
   - Dead ends: Database, Cache (no outbound)
     → OK for data stores
   - Cycles: None found ✓
   - Sinks: Database has high inbound
     → Check: failure propagation?

3. Find holes:
   - Auth → Database but no Auth → Cache
     → Is this intentional? Session caching?
```

**Output format:**
```
Dependency graph:
[ASCII or list representation]

Topology analysis:
- Dead ends: [list] — [OK/concern]
- Cycles: [list] — [breaking condition?]
- Sinks: [list] — [failure impact?]

Holes found:
- [Component A] → [Component B] missing
  Impact: [description]

FINDING (if any): [description]
QUOTE: "[architecture description]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #109 Contraposition Inversion

**Purpose:** Reveal hidden failure modes by asking "what guarantees failure?"

**What to do:**
1. For each key claim "If A then B", consider "If not-B then not-A"
2. Ask: What would have to be true for this system to fail?
3. Check: Are those failure conditions addressed?

**Step-by-step:**
```
1. Identify key claims:
   "If user is authenticated, they can access resources"

2. Apply contraposition:
   "If user cannot access resources, they are not authenticated"
   → Is this true? What about authorization?
   → FINDING: Auth ≠ Authz, conflation

3. Ask failure question:
   "What guarantees this system fails?"
   - Network partition
   - Database corruption
   - Auth service down
   - Cache inconsistency

4. Check mitigations:
   - Network partition: [addressed? how?]
   - Database corruption: [addressed? how?]
   - ...

5. Check theorem violations:
   - Async + Consensus + Faults → FLP
   - SP + IR + EFF + BB → Myerson-Satterthwaite
```

**Output format:**
```
Key claims:
- [Claim]: "If A then B"
  Contraposition: "If not-B then not-A"
  Valid? [yes/no/partially]

Failure conditions:
| Condition | Addressed? | How? |
|-----------|------------|------|
| [F1]      | [Y/N/P]    | [X]  |
| [F2]      | [Y/N/P]    | [X]  |

Theorem checks:
- FLP: [applicable? violated?]
- M-S: [applicable? violated?]
- CAP: [applicable? violated?]

FINDING (if any): Failure condition "[X]" not addressed
QUOTE: "[claim that assumes it won't happen]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #116 Strange Loop Detection

**Purpose:** Find circular reasoning or dependencies.

**What to do:**
1. Build justification graph (what justifies what)
2. Detect cycles - each cycle needs external anchor or reasoning is ungrounded
3. For each cycle: Is there a breaking condition? Is there dampening?

**Step-by-step:**
```
1. Map justifications:
   "System is secure" ← "Uses encryption"
   "Uses encryption" ← "Has key management"
   "Has key management" ← "System is secure" ← LOOP!

2. For each loop:
   - External anchor? No
   - Breaking condition? No
   → UNGROUNDED REASONING

3. Check for dampening:
   "A influences B influences C influences A"
   - Does influence diminish? (dampening)
   - Or amplify? (instability)
```

**Output format:**
```
Justification graph:
[ASCII or list representation]

Cycles detected:
- [A] → [B] → [C] → [A]
  External anchor: [yes/no]
  Breaking condition: [yes/no]
  Dampening: [yes/no/amplifying]
  Verdict: [grounded/ungrounded/unstable]

FINDING (if any): Circular dependency in [X]
QUOTE: "[text showing the cycle]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #130 Assumption Torture

**Purpose:** Test assumption sensitivity.

**What to do:**
1. For each key assumption, test at graduated error levels:
   - 10% wrong (minor deviation)
   - 50% wrong (significant deviation)
   - 100% wrong (completely invalid)
2. What happens to the system at each level?
3. Is there graceful degradation or catastrophic failure?

**Step-by-step:**
```
1. Identify key assumptions:
   "Network latency < 50ms"

2. Test at levels:
   10% wrong (55ms):
   - Impact: Slightly slower UI
   - Degradation: Graceful ✓

   50% wrong (75ms):
   - Impact: Noticeable delay
   - Degradation: User experience suffers

   100% wrong (100ms+):
   - Impact: Timeouts possible
   - Degradation: CATASTROPHIC - system fails

3. Assess:
   - At what point does system break?
   - Is there warning before break?
   - Can system adapt?
```

**Output format:**
```
Assumption: [name]
Current value: [X]

Sensitivity analysis:
| Error | Value | Impact | Degradation |
|-------|-------|--------|-------------|
| 10%   | [X]   | [desc] | [graceful/warning/catastrophic] |
| 50%   | [X]   | [desc] | [graceful/warning/catastrophic] |
| 100%  | [X]   | [desc] | [graceful/warning/catastrophic] |

Breaking point: [X% / value]
Early warning: [yes/no]

FINDING (if any): Assumption "[X]" causes catastrophic failure at [Y]%
QUOTE: "[text stating the assumption]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #153 Theoretical Impossibility Check

**Purpose:** Check claims against known theorems.

**What to do:**
1. Identify claims that sound "too good to be true"
2. Check against impossibility theorems:
   - Distributed: CAP, FLP, Byzantine bounds
   - Mechanism design: Green-Laffont, Myerson-Satterthwaite, Arrow
   - Computation: Halting, Rice, Gödel
   - Cryptography: PFS constraints
   - Optimization: No Free Lunch
   - Information: Shannon limits

**Step-by-step:**
```
1. Flag ambitious claims:
   "Guarantees consensus in async network with f < N/2 faults"

2. Check theorem library:
   FLP theorem: Impossible to guarantee consensus in
   async network with even ONE faulty process.

3. Check for valid exceptions:
   - Synchrony assumptions? Not stated
   - Probabilistic termination? Not mentioned
   → THEOREM VIOLATION

4. Document:
   Claim: [exact quote]
   Theorem: FLP impossibility
   Violation: Yes, claims impossible guarantee
   Exception path: None stated
```

**Output format:**
```
Ambitious claims identified:
- [Claim 1]: "[quote]"
- [Claim 2]: "[quote]"

Theorem checks:
| Claim | Theorem | Violated? | Exception? |
|-------|---------|-----------|------------|
| [C1]  | [T1]    | [Y/N]     | [Y/N/desc] |
| [C2]  | [T2]    | [Y/N]     | [Y/N/desc] |

FINDING (if any): Claim "[X]" violates [theorem]
QUOTE: "[exact claim]"
SEVERITY: CRITICAL (theorem violations are always CRITICAL)
```

---

### #154 Definitional Contradiction Detector

**Purpose:** Find requirements that are mutually exclusive by definition.

**What to do:**
1. List all requirements as R1, R2, R3...
2. For each, expand:
   - MEANS: What it literally says
   - IMPLIES: Logical consequences
   - EXCLUDES: What it's incompatible with
3. Check each pair for exclusion overlaps

**Step-by-step:**
```
1. List requirements:
   R1: "Perfect forward secrecy"
   R2: "Key escrow for compliance"

2. Expand R1:
   MEANS: Session keys cannot be recovered after session
   IMPLIES: No key storage, immediate deletion
   EXCLUDES: Any key recovery mechanism

3. Expand R2:
   MEANS: Keys stored for later recovery
   IMPLIES: Key storage, retrieval capability
   EXCLUDES: Immediate key deletion

4. Check overlap:
   R1.EXCLUDES ∩ R2.MEANS = {key recovery}
   R2.EXCLUDES ∩ R1.MEANS = {key deletion}
   → DEFINITIONAL CONTRADICTION
```

**Output format:**
```
Requirements:
- R1: [description]
- R2: [description]
- ...

Expansions:
R1:
  MEANS: [literal interpretation]
  IMPLIES: [logical consequences]
  EXCLUDES: [incompatibilities]

R2:
  MEANS: [literal interpretation]
  IMPLIES: [logical consequences]
  EXCLUDES: [incompatibilities]

Contradiction check:
| Pair | R_i.EXCLUDES ∩ R_j.MEANS | Contradiction? |
|------|-------------------------|----------------|
| 1,2  | [overlap]               | [Y/N]          |
| 1,3  | [overlap]               | [Y/N]          |

FINDING (if any): R[X] and R[Y] are definitionally contradictory
QUOTE: "[R_X text]" vs "[R_Y text]"
SEVERITY: CRITICAL (definitional contradictions are always CRITICAL)
```

---

### #87 Falsifiability Check

**Purpose:** Verify claims can be tested or are unfalsifiable by theorem.

**What to do:**
1. For each claim, specify what evidence would prove it wrong
2. Classify claims:
   - Falsifiable (testable)
   - Unfalsifiable-by-theorem (known impossibility)
   - Unfalsifiable-by-design (untestable)

**Step-by-step:**
```
1. Extract claims:
   "System achieves optimal performance"

2. Attempt falsification:
   - What would prove this wrong?
   - "Finding a configuration with better performance"
   - Can this be tested? Depends on "optimal" definition

3. Check theorem status:
   - Is "optimal" for NP-hard problem?
   - If yes → unfalsifiable by theorem (can't prove optimality)

4. Classify:
   - If testable → Falsifiable
   - If theorem prevents testing → Unfalsifiable-by-theorem → CRITICAL
   - If just poorly defined → Unfalsifiable-by-design → IMPORTANT
```

**Output format:**
```
Claims analyzed:
| Claim | Falsification criterion | Category |
|-------|------------------------|----------|
| [C1]  | [what would disprove]  | [F/UT/UD]|
| [C2]  | [what would disprove]  | [F/UT/UD]|

F = Falsifiable, UT = Unfalsifiable-by-theorem, UD = Unfalsifiable-by-design

FINDING (if any): Claim "[X]" is unfalsifiable
QUOTE: "[exact claim]"
SEVERITY: [CRITICAL if theorem, IMPORTANT if design]
```

---

### #159 Transitive Dependency Closure

**Purpose:** Find indirect dependency issues.

**What to do:**
1. Build dependency graph
2. Compute transitive closure (all indirect dependencies)
3. Find:
   - Circular dependencies (path A→...→A)
   - Missing dependencies (referenced but undefined)
   - Transitive conflicts (A depends on B and C, but B and C conflict)

**Step-by-step:**
```
1. Build direct dependencies:
   A → B
   B → C
   C → D
   D → B (creates cycle)

2. Compute transitive closure:
   A depends on: B, C, D (transitively)
   B depends on: C, D, B (CYCLE)

3. Find issues:
   - Cycle: B → C → D → B
   - Missing: E referenced in A but not defined
   - Conflict: A → X and A → Y where X conflicts with Y
```

**Output format:**
```
Direct dependencies:
[list or matrix]

Transitive closure:
[expanded dependencies]

Cycles found:
- [path]

Missing dependencies:
- [node] referenced but undefined

Transitive conflicts:
- [A] depends on [X] and [Y] which conflict

FINDING (if any): [description]
QUOTE: "[relevant text]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #162 Theory-Dependence Verification

**Purpose:** Verify theoretical claims have proper backing.

**What to do:**
1. For each theoretical claim, identify the theory relied upon
2. Check if the theory actually supports the claim
3. Verify no misapplication of theory
4. Demand proof or reference for novel claims

**Step-by-step:**
```
1. Identify theoretical claims:
   "Algorithm is provably correct"

2. Find supporting theory:
   - What theorem/proof is referenced?
   - Is it cited? Restated? Assumed?

3. Verify support:
   - Does theorem actually prove this?
   - Are preconditions met?
   - Is there a gap in reasoning?

4. Flag issues:
   - "Soundness" claimed without proof
   - "Termination" claimed without checker
   - "Guarantees" without theorems
```

**Output format:**
```
Theoretical claims:
| Claim | Theory cited | Supports claim? | Preconditions met? |
|-------|-------------|-----------------|-------------------|
| [C1]  | [theory]    | [Y/N/P]         | [Y/N/unclear]     |
| [C2]  | [none]      | N/A             | N/A               |

Flags:
- [Claim without backing]
- [Misapplied theorem]
- [Missing precondition]

FINDING (if any): Claim "[X]" lacks theoretical backing
QUOTE: "[exact claim]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```

---

### #163 Existence Proof Demand

**Purpose:** Challenge unproven capability claims.

**What to do:**
1. For each major capability claimed, demand existence proof:
   - Formal proof
   - Reference to existing system
   - Constructive example
2. Inability to provide any = unsubstantiated claim

**Step-by-step:**
```
1. Identify capability claims:
   "System achieves X while maintaining Y"

2. Demand proof:
   - Formal proof? Not provided
   - Reference system? None cited
   - Constructive example? Not given

3. Assess:
   - Is X+Y known to be achievable?
   - Has anyone done this before?
   - Is this novel combination?

4. If novel and unproven → UNSUBSTANTIATED
```

**Output format:**
```
Capability claims:
| Claim | Formal proof | Reference | Example | Verdict |
|-------|-------------|-----------|---------|---------|
| [C1]  | [Y/N]       | [Y/N]     | [Y/N]   | [S/U]   |
| [C2]  | [Y/N]       | [Y/N]     | [Y/N]   | [S/U]   |

S = Substantiated, U = Unsubstantiated

FINDING (if any): Claim "[X]" is unsubstantiated
QUOTE: "[exact claim]"
SEVERITY: [CRITICAL if core claim, IMPORTANT otherwise]
```

---

### #165 Constructive Counterexample

**Purpose:** Actively attempt to break claimed properties.

**What to do:**
1. For each claim, identify what would violate it
2. Attempt to construct a counterexample
3. If construction succeeds → claim is false

**Step-by-step:**
```
1. Select claim:
   "All user inputs are validated"

2. Define violation:
   - Find input that bypasses validation
   - Construct malformed input
   - Test edge cases

3. Attempt construction:
   - Empty string: handled?
   - Unicode edge cases: handled?
   - Null bytes: handled?
   - Extremely long input: handled?

4. If any succeeds:
   → CRITICAL finding (claim is demonstrably false)
```

**Output format:**
```
Claim: [description]
Violation definition: [what would break it]

Construction attempts:
| Attempt | Description | Result |
|---------|-------------|--------|
| [A1]    | [desc]      | [pass/fail] |
| [A2]    | [desc]      | [pass/fail] |

Counterexample found: [yes/no]
If yes: [describe the counterexample]

FINDING (if any): Counterexample breaks claim "[X]"
QUOTE: "[claim text]"
Counterexample: [description]
SEVERITY: CRITICAL (demonstrated failure)
```

---

## Tier 3 Methods (Adversarial - Phase 3)

### #63 Challenge from Critical Perspective

**Purpose:** Play devil's advocate to find weaknesses.

**What to do:**
1. Assume role of hostile critic
2. Construct strongest possible argument that artifact is flawed
3. Use all previous findings as ammunition
4. Synthesize: Do findings combine into systemic problem?

**Step-by-step:**
```
1. Adopt adversarial mindset:
   "I want to prove this artifact is fatally flawed"

2. Review all findings:
   - F1: [description]
   - F2: [description]
   - F3: [description]

3. Construct attack:
   "The combination of [F1] and [F2] means that
   under condition X, the system will fail because..."

4. Test attack strength:
   - Is this a realistic scenario?
   - Would this actually happen?
   - Is there a defense not mentioned?

5. Synthesize:
   "Individually these are [severity], but together
   they represent a systemic [vulnerability/flaw]"
```

**Output format:**
```
Adversarial critique:

Individual findings:
- [F1]: [severity] — [description]
- [F2]: [severity] — [description]

Combined attack:
[Description of how findings combine into larger problem]

Attack strength: [weak/moderate/strong/devastating]

Synthesis:
□ Findings are independent → no amplification
□ Findings compound → elevated concern
□ Findings create systemic failure → CRITICAL

FINDING (if any): Systemic issue from combined [F1, F2, ...]
QUOTE: [quotes from multiple locations]
SEVERITY: [based on synthesis, often elevated]
```

---
