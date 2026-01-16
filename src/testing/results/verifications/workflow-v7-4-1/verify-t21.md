# Deep Verify V7.4.1 - Verification Report for Artifact T21

**Artifact:** VerifyLang DSL Compiler Design Document
**Workflow Version:** V7.4.1 - Adaptive Exploration (Optimized & Resilient)
**Analyst:** Verification Agent
**Date:** 2026-01-16

---

## Phase 0: Artifact Intake & Triage (Optimized)

### Step 0.1: Self-Check & Profile

#### Artifact Profile
- **Type**: document (Technical Design Document / Language Specification)
- **Size**: ~650 lines, approximately 4,500-5,000 tokens
- **Complexity Score**: HIGH
  - Rationale: The document describes a compiler with multiple intermediate representations, a type system with dependent types and gradual typing, termination analysis, and LLVM code generation. Multiple interacting systems with formal semantics.
- **Criticality Score**: HIGH
  - Rationale: This is a language/compiler specification intended to produce verification rules that execute as native code. Errors in the design could propagate to incorrect verification outcomes in downstream systems.

#### Domain Detection (Method Visibility Mask)

| Domain | Confidence | Method Category Visibility |
|--------|------------|----------------------------|
| Technical/Code | 95% | Allow: technical, code, core |
| Research/Docs | 75% | Allow: research, logic, core |
| Collaboration | 10% | Allow: collaboration, core |
| Security/Risk | 40% | Allow: risk, security, competitive |
| Advanced/Theory| 85% | Allow: advanced, theory, core |

**Active Categories** (Confidence > 40%):
- Technical/Code (95%)
- Research/Docs (75%)
- Advanced/Theory (85%)

**Inactive but Potential Categories** (Confidence <= 40% but > 5%):
- Collaboration (10%)
- Security/Risk (40% - borderline, included for safety)

### Step 0.2: Triage Decision

#### Triage Matrix Analysis
| Complexity | Criticality | Tier | Budget | Visibility |
|------------|-------------|------|--------|------------|
| HIGH | HIGH | 3-4 | 30-60K | Restricted + Adjacent / FULL |

**DECISION:**
- **TIER**: 3 (HIGH Complexity + HIGH Criticality, but not CRITICAL infrastructure)
- **BUDGET_TOTAL**: 30K tokens
- **BUDGET_PRIMARY**: 27K tokens (90% of 30K)
- **BUDGET_EXPLORE**: 3K tokens (10% of 30K)
- **METHOD MASK_PRIMARY**: [technical, code, core, research, logic, advanced, theory]
- **METHOD MASK_EXPLORE**: [risk, security, collaboration] (max 2 active: risk, security)

---

## LAYER 1: INNATE DETECTION (Confidence-Weighted)

### Phase 1: Unified Innate Sanity Check

#### 1. Consistency (Internal Logic)

**Analysis:**

Scanning for definitional stability and internal contradictions...

- **Definition Stability Check:**
  - `Rule<Input, Output>` type is introduced in Section 3.1 (type_expr grammar) and used consistently throughout Section 5 (Higher-Order Rules).
  - The `AST` base type is used consistently as the primary input type for verification rules.
  - The `decreasing` termination clause syntax is defined in Section 4.1 and demonstrated consistently in examples.

- **Potential Contradictions Identified:**
  1. **Gradual Type Soundness Claim vs. Runtime Check Reality:**
     - Section 3.5 claims "Gradual Guarantee: Removing type annotations preserves semantics"
     - However, Section 3.3 states "runtime checks inserted at typed-untyped boundaries"
     - This is internally consistent (the runtime checks preserve semantics), but the claim could mislead readers about performance implications.

  2. **Termination Checking Scope Ambiguity:**
     - Section 4.3 describes termination checking for explicit recursive calls.
     - Section 5.1 introduces higher-order rules where `mapRule` passes rules as parameters.
     - The termination analysis does not explicitly address higher-order recursion (passing a recursive rule to another rule that applies it).

  3. **Pattern Matching Completeness vs. Example Code:**
     - Section 9 admits "Pattern matching exhaustiveness checking requires user annotations for complex ADTs"
     - Yet examples in Section 7 (e.g., `noSQLInjection`) use patterns without exhaustiveness annotations.
     - This is noted as a limitation but creates a gap between specification and examples.

**Verdict**: PASS (with minor concerns)
- No direct logical contradictions found.
- Some specification gaps exist around higher-order termination and pattern completeness.

#### 2. Completeness (Structure)

**Analysis:**

Scanning for structural completeness...

**Required Elements Check:**
- [x] Language overview and design philosophy
- [x] Grammar/syntax specification (EBNF)
- [x] Type system specification
- [x] Termination analysis specification
- [x] Compilation strategy
- [x] Examples
- [x] Standard library description
- [x] Limitations acknowledgment

**Gaps Identified:**

1. **Missing Error Handling Specification:**
   - Section 5.2 shows `try { ... } catch { ... }` in the `optional` rule combinator.
   - There is NO grammar rule for try/catch expressions in Section 2.
   - The semantics of what exceptions can be thrown and caught is undefined.

2. **Missing Operator Precedence:**
   - The EBNF in Section 2 does not define precedence for `and`, `or`, `not` in conditions.
   - Example code assumes `and` binds tighter than `then` in composition, but this is not specified.

3. **Missing Gradual Type Runtime Check Specification:**
   - Section 3.3 mentions "runtime checks inserted at typed-untyped boundaries"
   - No specification of what these checks look like, what errors they raise, or how they interact with termination.

4. **Missing Module System Details:**
   - `import` syntax is defined (Section 2.2), but module resolution, visibility rules, and cyclic import handling are not specified.

5. **Placeholder/TODO Check:**
   - No explicit TODO/TBD markers found.
   - However, Section 9 lists "Future Work" items that represent acknowledged incompleteness.

**Verdict**: FAIL (Structural gaps present)
- Missing try/catch grammar
- Missing operator precedence specification
- Missing gradual type runtime check specification
- Missing module system semantics

#### 3. Scope Alignment (Intent)

**Analysis:**

Based on the Executive Summary, the artifact should provide:
1. A declarative DSL for verification rules - CHECK
2. Sophisticated type system with dependent types, gradual typing - CHECK
3. Guaranteed termination - CHECK (but see higher-order concerns)
4. LLVM native code generation - CHECK
5. Incremental compilation and rule composition - CHECK

**Scope Drift Analysis:**

- The document stays within scope of a language design specification.
- No feature creep beyond the stated goals.
- The examples demonstrate practical utility aligned with the stated purpose.

**Silent Omissions:**
- The Executive Summary mentions "support for incremental compilation" but does not mention what triggers recompilation (file changes? rule changes? type changes?).
- The document does not specify IDE/tooling integration despite being a developer-facing DSL.

**Verdict**: ALIGNED
- Output matches stated intent.
- Minor omissions in incremental compilation trigger specification.

---

### Phase 1.4: Taxonomy Weighting

Scanning for error type indicators...

| Category | Indicators Found | Confidence | Vector Weight |
|----------|------------------|------------|---------------|
| LOGIC | Higher-order termination gap, gradual type + termination interaction | 55% | 0.55 |
| SECURITY | No security model for compiled code, no sandboxing mentioned | 30% | 0.30 |
| OMISSION | Missing try/catch grammar, operator precedence, module semantics | 75% | 0.75 |
| SEMANTIC | Gradual guarantee claim may be misleading about performance | 35% | 0.35 |
| RESOURCE | No specification of compile-time resource limits, potential infinite type inference | 25% | 0.25 |
| ASSUMPTION | Assumes LLVM 15+ available, assumes AST structure matches expected patterns | 45% | 0.45 |
| CONTRADICTION | None identified strongly | 15% | 0.15 |
| COMPLETENESS | Structural gaps in grammar and semantics | 70% | 0.70 |

**Active Error Vectors** (Weight > 0): All categories listed above.

**Priority Vectors** (Weight >= 0.50):
1. OMISSION (0.75)
2. COMPLETENESS (0.70)
3. LOGIC (0.55)

---

## LAYER 2: ADAPTIVE DETECTION (with Budgeted Exploration)

### Phase 3: Adaptive Method Selection

#### Primary Method Selection
Allocate BUDGET_PRIMARY (27K) for methods from METHOD MASK_PRIMARY based on Active Error Vectors.

| Target Vector | Allocated Primary Budget | Selected Method | Why? |
|---------------|--------------------------|-----------------|------|
| OMISSION (0.75) | 8K | #83 Completeness Check | Systematically identify all missing specifications |
| OMISSION (0.75) | 4K | #87 Gap Analysis | Identify specification gaps between sections |
| COMPLETENESS (0.70) | 6K | #84 Structural Consistency | Verify document structure completeness |
| LOGIC (0.55) | 5K | #91 Formal Reasoning Check | Analyze termination claims against higher-order features |
| ASSUMPTION (0.45) | 2K | #78 Assumption Excavation | Surface implicit assumptions in the design |
| SEMANTIC (0.35) | 2K | #86 Claim Verification | Verify type soundness claims |

#### Exploratory Method Selection
Allocate BUDGET_EXPLORE (3K) for methods from METHOD MASK_EXPLORE [risk, security].

| Selected Exploration Method | Why? (targeting potential blind spots) |
|-----------------------------|----------------------------------------|
| #115 Negative Space Cartography | Identify what the document does NOT say that it should |
| #102 Security Threat Modeling | The compiler generates executable code; assess threat surface |

**Total Selected Primary Methods**: [#83, #87, #84, #91, #78, #86]
**Total Selected Exploration Methods**: [#115, #102]

---

### Phase 4: Execution & Anomaly Scan

#### Primary Method Execution Findings

**Method #83 (Completeness Check):**

Systematic scan for specification completeness...

Finding 1: **Missing Expression Grammar for Error Handling**
- Severity: IMPORTANT
- The `optional` combinator in Section 5.2 uses `try { ... } catch { ... }` syntax.
- This syntax is NOT defined in the grammar (Section 2).
- Cannot implement a parser without this grammar rule.

Finding 2: **Incomplete Type Rule Specification**
- Severity: IMPORTANT
- Refinement types are shown (`{x: T | condition}`) but no typing rules for how conditions are checked.
- No specification of what language the condition is written in (is it the full expression language? a subset?).

Finding 3: **Missing LLVM Runtime Library Specification**
- Severity: MINOR
- Section 6.3 shows LLVM IR calling `@ast_get_field`, `@list_count`, etc.
- These are external functions, but no specification of the runtime library API exists.

**Method #87 (Gap Analysis):**

Finding 4: **Gap Between Type System and Compilation**
- Severity: IMPORTANT
- The type system (Section 3) includes dependent types and refinement types.
- The compilation pipeline (Section 6) does not explain how dependent type constraints are compiled/verified.
- No explanation of whether dependent constraints are checked at compile-time, runtime, or both.

Finding 5: **Gap Between Grammar and Examples**
- Severity: MINOR
- Section 7.1 shows list comprehension syntax: `[ expr | pattern <- source, guards ]`
- This syntax is NOT defined in the EBNF grammar (Section 2).

**Method #84 (Structural Consistency):**

Finding 6: **Operator Precedence Undefined**
- Severity: IMPORTANT
- The grammar defines `condition 'and' condition` and `condition 'or' condition` but does not specify precedence.
- In `compose_body`, `rule_ref 'and' rule_ref` is used with different semantics (parallel execution) than `condition 'and' condition` (logical conjunction).
- This overloading without precedence rules creates parsing ambiguity.

**Method #91 (Formal Reasoning Check):**

Finding 7: **Higher-Order Termination Not Addressed**
- Severity: CRITICAL
- The termination checker (Section 4.3) only addresses direct recursive calls.
- Higher-order rules (Section 5) allow passing rules as parameters.
- Example: `mapRule(transform, nodes)` is safe because it recurses on `nodes`.
- But consider: `rule fix(f: Rule<T, T>) = f(fix(f))` - this would not terminate.
- The specification does not prevent construction of non-terminating higher-order combinations.
- The termination guarantee claim (Section 3.5) may be violated.

Finding 8: **Dependent Type Evaluation Order**
- Severity: MINOR
- Dependent types require evaluating expressions at compile time.
- The specification does not define the evaluation order for dependent type arguments.
- Example: In `Vec<T, n>`, when is `n` evaluated? Before or after `T` is resolved?

**Method #78 (Assumption Excavation):**

Finding 9: **Implicit AST Structure Assumption**
- Severity: MINOR
- The language assumes AST nodes have `kind`, `children`, `value`, `span` fields.
- No specification of how custom AST formats are supported.
- Users must conform to this structure or the language is unusable for their AST format.

Finding 10: **Implicit Well-Formedness of Input**
- Severity: MINOR
- Rules assume input is a valid AST.
- No specification of behavior when input is malformed.

**Method #86 (Claim Verification):**

Finding 11: **Type Soundness Claim Requires Clarification**
- Severity: IMPORTANT
- Section 3.5 claims "Progress" and "Preservation" guarantees.
- These are standard type soundness properties, but no formal proof or proof sketch is provided.
- Given the complexity (dependent types + gradual types + termination), this claim needs more justification.

---

#### Exploratory Method Execution Findings

**Method #115 (Negative Space Cartography):**

What the document does NOT say:

Finding 12: **No Memory Safety Model**
- Severity: IMPORTANT
- The language compiles to LLVM IR which can have memory safety issues.
- The runtime library calls (e.g., `@list_get`) could have out-of-bounds access.
- No specification of memory safety guarantees or bounds checking.

Finding 13: **No Concurrency Model**
- Severity: MINOR
- `parallel_compose` allows parallel execution of rules.
- No specification of:
  - Thread safety of shared state
  - Race condition prevention
  - Memory model for concurrent access

Finding 14: **No Versioning/Compatibility Story**
- Severity: MINOR
- No specification of language versioning.
- No backward compatibility guarantees for rule libraries.

**Method #102 (Security Threat Modeling):**

Finding 15: **Compiled Rules Execute Native Code**
- Severity: IMPORTANT
- VerifyLang compiles to native LLVM code.
- A malicious rule could be crafted to exploit buffer overflows, arbitrary code execution.
- No sandboxing or capability model specified.
- No specification of how untrusted rules are handled.

Finding 16: **SQL Example Shows Security Rules But No Self-Security**
- Severity: MINOR
- Section 7.2 shows `noSQLInjection` rule for checking OTHER code.
- The specification does not address security of the VerifyLang compiler itself.
- Malicious input to the compiler (malformed source) could potentially exploit compiler bugs.

---

### Primary_Findings Summary:
| ID | Severity | Type | Description |
|----|----------|------|-------------|
| F1 | IMPORTANT | OMISSION | Missing try/catch grammar |
| F2 | IMPORTANT | OMISSION | Incomplete refinement type rules |
| F3 | MINOR | OMISSION | Missing runtime library specification |
| F4 | IMPORTANT | GAP | Dependent type compilation strategy missing |
| F5 | MINOR | GAP | List comprehension syntax not in grammar |
| F6 | IMPORTANT | CONSISTENCY | Operator precedence undefined, overloaded 'and' |
| F7 | CRITICAL | LOGIC | Higher-order termination not addressed |
| F8 | MINOR | LOGIC | Dependent type evaluation order undefined |
| F9 | MINOR | ASSUMPTION | Fixed AST structure assumed |
| F10 | MINOR | ASSUMPTION | Input well-formedness assumed |
| F11 | IMPORTANT | CLAIM | Type soundness claims unsupported |

### Exploration_Findings Summary:
| ID | Severity | Type | Description |
|----|----------|------|-------------|
| F12 | IMPORTANT | SECURITY | No memory safety model |
| F13 | MINOR | SECURITY | No concurrency/threading model |
| F14 | MINOR | COMPLETENESS | No versioning specification |
| F15 | IMPORTANT | SECURITY | Native code execution without sandboxing |
| F16 | MINOR | SECURITY | No compiler self-security model |

### Unclassified Anomalies:
- None identified.

---

### Phase 5: Sanity Challenge

For each finding with Confidence > 50%:

**Finding F1:** "Missing try/catch grammar"
- **Counter-Argument**: The try/catch in `optional` could be a pseudocode example, not actual language syntax.
- **Rebuttal**: The document presents code in `verifylang` blocks as actual language examples. The `optional` combinator is in the standard library section, implying it should be implementable. Without try/catch grammar, it cannot be parsed.
- **Final Verdict**: CONFIRMED

**Finding F2:** "Incomplete refinement type rules"
- **Counter-Argument**: Refinement type semantics are well-known from literature; specification may assume reader knowledge.
- **Rebuttal**: A language specification should be self-contained for implementers. The condition language for refinements is not specified (can it use quantifiers? function calls? recursion?).
- **Final Verdict**: CONFIRMED

**Finding F4:** "Dependent type compilation strategy missing"
- **Counter-Argument**: The MIR/LIR lowering stages might handle this implicitly.
- **Rebuttal**: Dependent types are complex to compile. The document mentions "Dependent Type Resolution" in the inference algorithm (Section 3.4 step 5) but not in the compilation pipeline (Section 6). This is a significant architectural gap.
- **Final Verdict**: CONFIRMED

**Finding F6:** "Operator precedence undefined"
- **Counter-Argument**: Standard precedence (not > and > or) could be assumed.
- **Rebuttal**: The overloading of `and` for both logical conjunction (conditions) and parallel composition (compose_body) creates genuine ambiguity. A parser implementation cannot proceed without explicit rules.
- **Final Verdict**: CONFIRMED

**Finding F7:** "Higher-order termination not addressed"
- **Counter-Argument**: The `decreasing` clause on individual rules ensures they terminate; combinations are safe.
- **Rebuttal**: Consider `rule loop(r: Rule<T, T>) = r(loop(r))`. This is a valid rule according to the grammar with no recursive call on shrinking data. The termination checker as specified would not reject it, but it will not terminate. The type system does not prevent higher-order non-termination.
- **Final Verdict**: CONFIRMED

**Finding F11:** "Type soundness claims unsupported"
- **Counter-Argument**: Formal proofs belong in academic papers, not design documents.
- **Rebuttal**: The document makes specific formal claims (Progress, Preservation, Termination, Gradual Guarantee). Without proof sketches or references to established results, these are unverified assertions. Given finding F7, the Termination guarantee is already questionable.
- **Final Verdict**: CONFIRMED

**Finding F12:** "No memory safety model"
- **Counter-Argument**: LLVM provides tools for memory safety (AddressSanitizer, etc.).
- **Rebuttal**: The specification compiles rules to native code with external runtime calls. There is no specification of bounds checking, null safety, or memory management. This is a design gap for a verification tool.
- **Final Verdict**: CONFIRMED

**Finding F15:** "Native code execution without sandboxing"
- **Counter-Argument**: VerifyLang rules are written by trusted developers.
- **Rebuttal**: The document positions VerifyLang as a DSL for verification rules. Verification tools often run on untrusted input code. If an attacker can craft input that triggers a malicious code path in a rule, arbitrary code execution is possible. No trust model is specified.
- **Final Verdict**: CONFIRMED

---

## LAYER 2.5: SANITY CHECK FEEDBACK LOOP

### Phase 5.5: Feedback Loop Trigger Analysis

1. **Calculate Primary Findings Significance:**
   CONFIRMED Primary Findings:
   - F1: IMPORTANT (2)
   - F2: IMPORTANT (2)
   - F4: IMPORTANT (2)
   - F6: IMPORTANT (2)
   - F7: CRITICAL (3)
   - F11: IMPORTANT (2)

   `S_primary` = 2 + 2 + 2 + 2 + 3 + 2 = **13**

2. **Calculate Exploratory Findings Significance:**
   CONFIRMED Exploration Findings:
   - F12: IMPORTANT (2)
   - F15: IMPORTANT (2)

   `S_explore` = 2 + 2 = **4**

**Trigger Condition Check:**
- `S_primary` (13) >= 3? YES
- `S_explore` (4) >= 3? YES
- But condition is: IF (`S_primary` < 3 AND `S_explore` >= 3)

Since `S_primary` = 13 >= 3, the trigger condition is FALSE.

**STATUS**: `TRIAGE CONFIRMED`
**ACTION**: Proceed to Layer 3.

The primary analysis was productive and identified significant issues. The exploration budget also found important issues, confirming the initial triage was appropriate but the exploration was valuable. No re-triage needed.

---

## LAYER 3: MEMORY & OUTPUT

### Phase 6: Report

#### Verification Summary
- **Tier**: 3
- **Active Domains (Post-Triage)**: Technical/Code, Research/Docs, Advanced/Theory
- **Ignored Vectors (Post-Triage)**: CONTRADICTION (0.15), RESOURCE (0.25)
- **Re-Triage Occurred**: No

#### Findings Table

| ID | Severity | Type | Source | Description | Status |
|----|----------|------|--------|-------------|--------|
| F1 | IMPORTANT | OMISSION | Primary | Missing try/catch grammar in EBNF specification | CONFIRMED |
| F2 | IMPORTANT | OMISSION | Primary | Incomplete refinement type typing rules | CONFIRMED |
| F3 | MINOR | OMISSION | Primary | Missing LLVM runtime library specification | CONFIRMED |
| F4 | IMPORTANT | GAP | Primary | Dependent type compilation strategy not specified | CONFIRMED |
| F5 | MINOR | GAP | Primary | List comprehension syntax used but not in grammar | CONFIRMED |
| F6 | IMPORTANT | CONSISTENCY | Primary | Operator precedence undefined; 'and' keyword overloaded | CONFIRMED |
| F7 | CRITICAL | LOGIC | Primary | Higher-order termination guarantee has gaps | CONFIRMED |
| F8 | MINOR | LOGIC | Primary | Dependent type evaluation order not specified | CONFIRMED |
| F9 | MINOR | ASSUMPTION | Primary | Fixed AST structure assumed without adaptation mechanism | CONFIRMED |
| F10 | MINOR | ASSUMPTION | Primary | Input well-formedness assumed; error behavior undefined | CONFIRMED |
| F11 | IMPORTANT | CLAIM | Primary | Type soundness claims (Progress, Preservation, Termination) not supported with proofs | CONFIRMED |
| F12 | IMPORTANT | SECURITY | Exploratory | No memory safety model for compiled native code | CONFIRMED |
| F13 | MINOR | SECURITY | Exploratory | No concurrency model for parallel_compose | CONFIRMED |
| F14 | MINOR | COMPLETENESS | Exploratory | No versioning or compatibility specification | CONFIRMED |
| F15 | IMPORTANT | SECURITY | Exploratory | Native code execution without sandboxing or trust model | CONFIRMED |
| F16 | MINOR | SECURITY | Exploratory | No specification of compiler self-security | CONFIRMED |

#### Critical Finding Detail

**F7 - Higher-Order Termination Gap**

This is the most significant finding. The specification claims "Termination: Well-typed recursive rules always terminate" (Section 3.5, claim 3). However, the termination checker (Section 4.3) only verifies that recursive calls operate on structurally smaller arguments.

The higher-order rule system (Section 5) allows rules to be passed as parameters. This enables construction of non-terminating combinations:

```verifylang
// This rule is well-typed according to the specification
rule diverge(r: Rule<Int, Int>) : Rule<Int, Int>
    = rule(x: Int) = r(diverge(r)(x))
```

The termination checker would need to track how rule parameters are used and ensure they cannot create unbounded recursion chains. The current specification does not address this.

**Recommendation**: The specification should either:
1. Restrict higher-order rules to prevent recursive application of rule parameters
2. Extend the termination checker to handle higher-order recursion (e.g., using sized types or effect systems)
3. Weaken the termination guarantee claim to exclude higher-order combinations

#### Optimization Feedback
- **Did we over-analyze?** No - the document's complexity warranted Tier 3 analysis.
- **Did we miss a domain initially?** Partially - Security/Risk was at the 40% boundary. The exploration budget successfully surfaced important security findings (F12, F15) that would have been missed with stricter domain gating.

---

## Executive Summary

The VerifyLang DSL design document (T21) is a technically sophisticated specification with strong foundations in type theory and compiler design. However, verification reveals **1 CRITICAL**, **6 IMPORTANT**, and **9 MINOR** issues.

The CRITICAL finding concerns the termination guarantee: the specification claims all well-typed rules terminate, but the higher-order rule system allows construction of non-terminating combinations that the described termination checker would not reject.

Key IMPORTANT findings include:
- Grammar incompleteness (missing try/catch, list comprehensions)
- Undefined operator precedence and keyword overloading
- Missing dependent type compilation strategy
- Unsupported type soundness claims
- No memory safety or security model for native code execution

The document would benefit from:
1. Extending the termination checker to handle higher-order recursion
2. Completing the EBNF grammar with all syntactic forms used in examples
3. Specifying operator precedence and disambiguation rules
4. Adding a security/trust model for compiled rules
5. Providing proof sketches or references for type soundness claims

**Overall Assessment**: The artifact demonstrates expert knowledge in programming language design but has specification gaps that would impede implementation and claims that may not hold in edge cases. Recommend revision before use as an implementation specification.

---

*Report generated by Deep Verify V7.4.1 - Adaptive Exploration workflow*
