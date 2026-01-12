# Domain-Specific Language Compiler for Verification Rules (T21) - Design Document

## Executive Summary

This document specifies VerifyLang, a domain-specific language (DSL) and compiler infrastructure for expressing verification rules that compile to efficient, executable checkers. VerifyLang provides a declarative syntax with a sophisticated type system featuring dependent types, gradual typing, and guaranteed termination. The compiler targets LLVM for native code generation with support for incremental compilation and rule composition.

---

## 1. Language Overview

### 1.1 Design Philosophy

VerifyLang is designed around three core principles:

1. **Declarative Expression**: Rules describe *what* to verify, not *how* to verify it
2. **Type-Driven Correctness**: The type system guarantees that well-typed rules produce valid results
3. **Compositional Design**: Simple rules combine to form complex verification pipelines

### 1.2 Language Features Summary

| Feature | Description |
|---------|-------------|
| Declarative Syntax | Pattern-based rule definitions |
| Dependent Types | Types that depend on values for precise specifications |
| Gradual Typing | Seamless mixing of typed and untyped code |
| Pattern Matching | First-class support for AST traversal and matching |
| Higher-Order Rules | Rules can accept and return other rules |
| Termination Guarantee | Type system ensures all rules terminate |
| Native Compilation | LLVM backend for efficient execution |
| Incremental Compilation | Recompile only modified rules |

---

## 2. Grammar and Syntax Specification

### 2.1 Lexical Structure

```ebnf
(* Identifiers and Literals *)
identifier     ::= [a-z_][a-zA-Z0-9_]*
type_id        ::= [A-Z][a-zA-Z0-9_]*
string_lit     ::= '"' [^"]* '"'
int_lit        ::= [0-9]+
float_lit      ::= [0-9]+ '.' [0-9]+

(* Keywords *)
keyword        ::= 'rule' | 'check' | 'match' | 'with' | 'where'
                 | 'forall' | 'exists' | 'and' | 'or' | 'not'
                 | 'import' | 'export' | 'type' | 'struct'
                 | 'decreasing' | 'compose' | 'dynamic'
```

### 2.2 Program Structure

```ebnf
program        ::= import_decl* declaration*

import_decl    ::= 'import' module_path ('as' identifier)?
                 | 'import' module_path '{' identifier (',' identifier)* '}'

declaration    ::= rule_decl
                 | type_decl
                 | struct_decl
                 | compose_decl
```

### 2.3 Rule Declarations

```ebnf
rule_decl      ::= 'rule' identifier type_params? params? (':' type_expr)?
                   'where' termination_clause?
                   '=' rule_body

type_params    ::= '<' type_param (',' type_param)* '>'
type_param     ::= type_id (':' kind)?

params         ::= '(' param (',' param)* ')'
param          ::= identifier (':' type_expr)?

rule_body      ::= match_expr
                 | check_expr
                 | compose_expr
                 | higher_order_expr
```

### 2.4 Pattern Matching Expressions

```ebnf
match_expr     ::= 'match' expr 'with'
                   '|' pattern '=>' rule_body
                   ('|' pattern '=>' rule_body)*

pattern        ::= '_'                              (* wildcard *)
                 | identifier                       (* binding *)
                 | constructor pattern*             (* ADT *)
                 | pattern '@' pattern             (* as-pattern *)
                 | '[' pattern (',' pattern)* ']'  (* list *)
                 | '{' field_pattern (',' field_pattern)* '}' (* struct *)
                 | ast_pattern                      (* AST-specific *)

ast_pattern    ::= 'AST' '{' ast_field (',' ast_field)* '}'
ast_field      ::= 'kind' ':' string_lit
                 | 'children' ':' pattern
                 | 'value' ':' pattern
                 | 'span' ':' pattern
```

### 2.5 Check Expressions

```ebnf
check_expr     ::= 'check' condition ('and' condition)* message?

condition      ::= comparison
                 | quantified
                 | 'satisfies' identifier
                 | '(' condition ')'
                 | 'not' condition
                 | condition 'and' condition
                 | condition 'or' condition

quantified     ::= 'forall' identifier 'in' expr '.' condition
                 | 'exists' identifier 'in' expr '.' condition

comparison     ::= expr comp_op expr
comp_op        ::= '==' | '!=' | '<' | '>' | '<=' | '>=' | 'matches'

message        ::= 'message' string_lit
```

### 2.6 Composition Expressions

```ebnf
compose_expr   ::= 'compose' compose_body

compose_body   ::= sequential_compose
                 | parallel_compose
                 | conditional_compose

sequential_compose  ::= rule_ref 'then' rule_ref ('then' rule_ref)*
parallel_compose    ::= rule_ref 'and' rule_ref ('and' rule_ref)*
conditional_compose ::= 'if' condition 'then' rule_ref 'else' rule_ref
```

---

## 3. Type System Specification

### 3.1 Type Grammar

```ebnf
type_expr      ::= base_type
                 | function_type
                 | dependent_type
                 | refinement_type
                 | gradual_type
                 | higher_kinded_type

base_type      ::= 'Bool' | 'Int' | 'String' | 'AST' | 'Void'
                 | 'List' type_expr
                 | 'Option' type_expr
                 | type_id type_args?

function_type  ::= type_expr '->' type_expr
                 | 'Rule' '<' type_expr ',' type_expr '>'

dependent_type ::= '(' identifier ':' type_expr ')' '->' type_expr
                 | 'Vec' type_expr int_expr

refinement_type::= '{' identifier ':' type_expr '|' condition '}'

gradual_type   ::= 'dynamic'
                 | type_expr '?'
```

### 3.2 Dependent Type Features

VerifyLang supports dependent types that allow types to depend on runtime values, enabling precise specification of verification constraints.

```verifylang
// Vector with length encoded in type
type Vec<T, n: Nat> = {
    data: List<T>,
    length: n
}

// Rule that requires input to have minimum depth
rule checkTreeDepth<n: Nat>(tree: AST) : Bool
    where decreasing(depth(tree))
    = match tree with
    | AST { kind: "leaf" } => n == 0
    | AST { children: cs } => forall c in cs. checkTreeDepth<n-1>(c)

// Dependent pair: result type depends on success
type VerifyResult<T>(success: Bool) =
    if success then { value: T, proof: ValidProof<T> }
    else { errors: List<Error>, suggestions: List<Fix> }
```

### 3.3 Gradual Typing System

VerifyLang implements gradual typing, allowing seamless integration of typed and untyped code. The `dynamic` type serves as the gradual type, with runtime checks inserted at typed-untyped boundaries.

```verifylang
// Fully typed rule
rule strictCheck(node: AST) : Bool =
    check node.kind == "function"

// Gradually typed rule (dynamic parameters)
rule flexibleCheck(node: dynamic) =
    check node.kind == "function"

// Mixed: typed signature, dynamic internals
rule mixedCheck(node: AST) : Bool =
    let children: dynamic = node.children in
    exists c in children. c.kind == "return"
```

**Type Consistency Relation:**

The gradual type system uses a consistency relation (~) rather than equality:
- `dynamic ~ T` for any type T
- `T ~ dynamic` for any type T
- `T ~ T` for any type T
- `List<T1> ~ List<T2>` if `T1 ~ T2`

### 3.4 Type Inference Algorithm

VerifyLang employs bidirectional type inference with constraint solving:

```
Algorithm: InferType(expr, context)
--------------------------------------
1. SYNTHESIS Phase (bottom-up):
   - Literals: infer concrete types
   - Variables: lookup in context
   - Applications: infer function type, check argument

2. CHECKING Phase (top-down):
   - Push expected types into subexpressions
   - Lambda parameters get expected argument types
   - Match branches get expected return type

3. CONSTRAINT GENERATION:
   - Generate equality constraints from applications
   - Generate subtyping constraints from refinements
   - Generate consistency constraints for dynamic types

4. UNIFICATION:
   - Solve equality constraints via standard unification
   - Solve subtyping via lattice-based algorithm
   - Resolve dynamic types via runtime check insertion

5. DEPENDENT TYPE RESOLUTION:
   - Evaluate compile-time expressions
   - Substitute values into dependent types
   - Verify dependent constraints
```

### 3.5 Type Soundness

The type system provides the following guarantees:

1. **Progress**: Well-typed rules either produce a result or match against input
2. **Preservation**: Rule evaluation preserves types
3. **Termination**: Well-typed recursive rules always terminate (see Section 4)
4. **Gradual Guarantee**: Removing type annotations preserves semantics

---

## 4. Termination Analysis

### 4.1 Termination Guarantee Mechanism

VerifyLang guarantees termination through a structural termination checker embedded in the type system. Rules must specify a decreasing measure for recursive calls.

```ebnf
termination_clause ::= 'decreasing' '(' measure (',' measure)* ')'

measure            ::= identifier                (* variable *)
                     | 'size' '(' expr ')'      (* structural size *)
                     | 'depth' '(' expr ')'     (* tree depth *)
                     | 'lexicographic' '(' measure (',' measure)* ')'
```

### 4.2 Decreasing Measure Types

```verifylang
// Built-in measure types
type Measure =
    | Size(Nat)           // Structural size
    | Depth(Nat)          // Tree depth
    | Lex(List<Measure>)  // Lexicographic ordering

// Measure extraction functions
size  : AST -> Nat
depth : AST -> Nat
count : List<T> -> Nat
```

### 4.3 Termination Checking Algorithm

```
Algorithm: CheckTermination(rule_decl)
--------------------------------------
Input: Rule declaration with body and termination clause
Output: Verified | TerminationError

1. EXTRACT RECURSIVE CALLS:
   calls = FindRecursiveCalls(rule_decl.body)

2. FOR EACH recursive call:
   a. Extract actual arguments at call site
   b. Extract formal parameters from declaration
   c. Compute measure for both

3. VERIFY DECREASE:
   For each call (args_actual, args_formal):
     measure_actual = EvaluateMeasure(termination_clause, args_actual)
     measure_formal = EvaluateMeasure(termination_clause, args_formal)

     if not (measure_actual < measure_formal):
       return TerminationError(call_site, "measure not decreasing")

4. VERIFY WELL-FOUNDEDNESS:
   Ensure measure type has well-founded ordering
   (Nat is well-founded, lexicographic products preserve well-foundedness)

5. RETURN Verified
```

### 4.4 Termination Examples

```verifylang
// Structural recursion on AST depth
rule checkAllNodes(node: AST) : Bool
    where decreasing(depth(node))
    = match node with
    | AST { children: [] } => True
    | AST { children: cs } => forall c in cs. checkAllNodes(c)

// Lexicographic termination measure
rule binarySearch<n: Nat>(arr: Vec<Int, n>, target: Int, lo: Nat, hi: Nat) : Option<Nat>
    where decreasing(lexicographic(hi - lo, n))
    = if lo >= hi then None
      else let mid = (lo + hi) / 2 in
           if arr[mid] == target then Some(mid)
           else if arr[mid] < target
                then binarySearch(arr, target, mid + 1, hi)
                else binarySearch(arr, target, lo, mid)
```

---

## 5. Higher-Order Rules

### 5.1 Rules as First-Class Values

Rules are first-class values in VerifyLang, enabling powerful abstractions:

```verifylang
// Rule type constructor
type Rule<Input, Output>

// Higher-order rule: takes a rule as parameter
rule mapRule<A, B>(transform: Rule<A, B>, nodes: List<A>) : List<B>
    where decreasing(size(nodes))
    = match nodes with
    | []      => []
    | x :: xs => transform(x) :: mapRule(transform, xs)

// Rule combinator: logical AND of two rules
rule andRule<T>(r1: Rule<T, Bool>, r2: Rule<T, Bool>) : Rule<T, Bool>
    = rule(input: T) = r1(input) and r2(input)

// Rule combinator: sequential composition
rule thenRule<A, B, C>(first: Rule<A, B>, second: Rule<B, C>) : Rule<A, C>
    = rule(input: A) = second(first(input))
```

### 5.2 Rule Combinators Library

```verifylang
module RuleCombinators {
    // Lift a predicate to a rule
    export rule fromPredicate<T>(p: T -> Bool) : Rule<T, Bool> =
        rule(x: T) = p(x)

    // Apply rule to all children
    export rule forAllChildren(r: Rule<AST, Bool>) : Rule<AST, Bool> =
        rule(node: AST) = forall c in node.children. r(c)

    // Apply rule to any child
    export rule existsChild(r: Rule<AST, Bool>) : Rule<AST, Bool> =
        rule(node: AST) = exists c in node.children. r(c)

    // Negate a rule
    export rule notRule<T>(r: Rule<T, Bool>) : Rule<T, Bool> =
        rule(x: T) = not r(x)

    // Optional rule (always succeeds, reports if failed)
    export rule optional<T>(r: Rule<T, Bool>) : Rule<T, Option<Bool>> =
        rule(x: T) = try { Some(r(x)) } catch { None }
}
```

---

## 6. Compilation Strategy

### 6.1 Compiler Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VerifyLang Compiler Pipeline                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │  Parser  │──▶│   Type   │──▶│Termination│──▶│   HIR    │──▶│   MIR   │  │
│  │          │   │  Checker │   │  Checker │   │  Lower   │   │  Optim  │  │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘  │
│                                                                     │       │
│                                                                     ▼       │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │  Native  │◀──│   LLVM   │◀──│   LLVM   │◀──│ Gradual  │◀──│   LIR   │  │
│  │  Binary  │   │  CodeGen │   │    IR    │   │  Compile │   │  Lower  │  │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Intermediate Representations

**HIR (High-Level IR)**: Preserves source structure, used for type checking
**MIR (Mid-Level IR)**: Desugared, explicit control flow, pattern match compilation
**LIR (Low-Level IR)**: Memory layout explicit, ready for LLVM translation

### 6.3 LLVM Code Generation

```verifylang
// Source rule
rule hasReturnStatement(func: AST) : Bool =
    exists stmt in func.body.statements. stmt.kind == "return"
```

Compiles to LLVM IR (simplified):

```llvm
define i1 @rule_hasReturnStatement(%AST* %func) {
entry:
  %body = call %AST* @ast_get_field(%AST* %func, i8* "body")
  %stmts = call %ASTList* @ast_get_field(%AST* %body, i8* "statements")
  %count = call i64 @list_count(%ASTList* %stmts)
  br label %loop

loop:
  %i = phi i64 [ 0, %entry ], [ %next_i, %continue ]
  %cmp = icmp ult i64 %i, %count
  br i1 %cmp, label %check, label %not_found

check:
  %stmt = call %AST* @list_get(%ASTList* %stmts, i64 %i)
  %kind = call i8* @ast_get_kind(%AST* %stmt)
  %is_return = call i1 @str_equals(i8* %kind, i8* "return")
  br i1 %is_return, label %found, label %continue

continue:
  %next_i = add i64 %i, 1
  br label %loop

found:
  ret i1 true

not_found:
  ret i1 false
}
```

### 6.4 Incremental Compilation

```
Algorithm: IncrementalCompile(changed_files, dependency_graph, cache)
---------------------------------------------------------------------
1. IDENTIFY CHANGED RULES:
   changed_rules = ExtractRules(changed_files)

2. COMPUTE TRANSITIVE DEPENDENTS:
   affected_rules = TransitiveClosure(dependency_graph, changed_rules)

3. INVALIDATE CACHE:
   for each rule in affected_rules:
     cache.invalidate(rule.id)

4. TOPOLOGICAL SORT:
   compile_order = TopologicalSort(affected_rules, dependency_graph)

5. RECOMPILE:
   for each rule in compile_order:
     if cache.has(rule.id):
       continue
     compiled = CompileRule(rule)
     cache.store(rule.id, compiled)

6. LINK:
   LinkIncrementally(cache.all_compiled())
```

**Dependency Tracking:**

```verifylang
// Dependency annotations (auto-generated by compiler)
@depends_on(checkReturnType, validateFunctionBody)
rule checkFunction(func: AST) : Bool =
    checkReturnType(func.returnType) and validateFunctionBody(func.body)
```

---

## 7. Example Verification Rules

### 7.1 Code Quality Rules

```verifylang
// Rule: Functions should not exceed maximum complexity
rule checkCyclomaticComplexity(func: AST, maxComplexity: Nat) : VerifyResult
    where decreasing(size(func))
    = let complexity = computeComplexity(func) in
      check complexity <= maxComplexity
      message "Function '{func.name}' has complexity {complexity}, max allowed is {maxComplexity}"

// Rule: All public functions must have documentation
rule checkDocumentation(module: AST) : List<Violation>
    = match module with
    | AST { kind: "module", children: decls } =>
        [ Violation(d.span, "Missing documentation")
        | d <- decls
        , d.kind == "function"
        , d.visibility == "public"
        , not hasDocComment(d) ]
```

### 7.2 Security Rules

```verifylang
// Rule: No SQL injection vulnerabilities
rule noSQLInjection(func: AST) : Bool
    where decreasing(depth(func))
    = match func with
    | AST { kind: "call", callee: "query", args: [sql] } =>
        check not containsUserInput(sql)
        message "Potential SQL injection: user input in query"
    | AST { children: cs } =>
        forall c in cs. noSQLInjection(c)

// Rule: Sensitive data must be encrypted
rule sensitiveDataEncrypted(dataflow: DataFlowGraph) : Bool =
    forall node in dataflow.nodes.
        if isSensitive(node.data) then
            forall edge in outgoingEdges(node).
                edge.encrypted or edge.target.isEncryptionBoundary
```

### 7.3 Composed Rules

```verifylang
// Compose multiple rules into a comprehensive check
compose fullFunctionCheck =
    checkCyclomaticComplexity(_, 10)
    and checkDocumentation
    and noSQLInjection
    then checkPerformanceHints

// Conditional composition
compose securityAudit =
    if isPublicAPI(_) then
        strictSecurityCheck and inputValidation and outputSanitization
    else
        basicSecurityCheck
```

### 7.4 Higher-Order Rule Usage

```verifylang
// Apply a rule recursively to all AST nodes
rule applyToAllNodes<R>(r: Rule<AST, R>, combine: (R, R) -> R, identity: R) : Rule<AST, R>
    where decreasing(depth(input))
    = rule(node: AST) =
        let nodeResult = r(node) in
        let childResults = map(applyToAllNodes(r, combine, identity), node.children) in
        fold(combine, nodeResult, childResults)

// Usage: count all function calls
let countCalls = applyToAllNodes(
    rule(n) = if n.kind == "call" then 1 else 0,
    (+),
    0
)
```

---

## 8. Standard Library

### 8.1 Core Modules

| Module | Description |
|--------|-------------|
| `VerifyLang.AST` | AST traversal and pattern matching utilities |
| `VerifyLang.Rules` | Rule combinators and composition |
| `VerifyLang.Types` | Type predicates and refinement helpers |
| `VerifyLang.DataFlow` | Data flow analysis primitives |
| `VerifyLang.Metrics` | Code metrics computation |
| `VerifyLang.Report` | Violation reporting and formatting |

### 8.2 Built-in Predicates

```verifylang
// AST predicates
isFunction   : AST -> Bool
isClass      : AST -> Bool
isLoop       : AST -> Bool
isConditional: AST -> Bool
hasChildren  : AST -> Bool

// Type predicates
isNumeric    : Type -> Bool
isCallable   : Type -> Bool
isNullable   : Type -> Bool

// Metric functions
lineCount    : AST -> Nat
depth        : AST -> Nat
complexity   : AST -> Nat
```

---

## 9. Limitations and Future Work

1. **Pattern Completeness**: Pattern matching exhaustiveness checking requires user annotations for complex ADTs
2. **Dependent Type Inference**: Some dependent types require explicit annotations when inference is ambiguous
3. **Gradual Typing Overhead**: Runtime checks at dynamic boundaries may impact performance for tight loops
4. **Incremental Compilation Granularity**: Current implementation tracks dependencies at rule level, not expression level
5. **LLVM Version**: Requires LLVM 15+ for optimal code generation

---

## 10. Conclusion

VerifyLang provides a powerful, type-safe language for expressing verification rules with guaranteed termination and efficient native execution. The combination of dependent types, gradual typing, and higher-order rules enables both precise specifications and practical flexibility. The LLVM backend ensures production-ready performance, while incremental compilation supports rapid development workflows.

The language design prioritizes correctness guarantees through its type system while maintaining the expressiveness needed for real-world verification tasks. Rule composition enables building complex verification pipelines from simple, tested components.
