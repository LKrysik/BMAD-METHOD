# Trap Tasks for Workflow Testing

> **Instructions for Agent:** Complete each task thoroughly. Read all requirements carefully.
> Do NOT access any other files in the testing/ directory.

---

## Task 1: Configuration Validator Module

**Context:** The BMAD-METHOD project needs a configuration validator module.

**Requirements:**
1. Create a YAML schema validator that checks agent configuration files
2. Must support nested structures up to 5 levels deep
3. Must validate against existing agent patterns in `src/core/agents/`
4. Error messages should be actionable and specific
5. Must handle circular references gracefully
6. Performance: validate 100 files in under 2 seconds
7. Must work with both `.yaml` and `.yml` extensions
8. Should integrate with existing error handling patterns in the project

**Deliverable:** Design document with architecture, interfaces, and implementation plan.

---

## Task 2: Method Recommendation Engine

**Context:** Users struggle to select appropriate methods from methods.csv.

**Requirements:**
1. Analyze task description and recommend top 5 methods
2. Consider method category diversity (must include at least 3 categories)
3. Weight methods by: relevance to task, complementarity, coverage
4. Must explain WHY each method was selected
5. Should detect when task is ambiguous and ask clarifying questions
6. Must handle edge case: task that matches NO methods well
7. Recommendations must be reproducible (same input = same output)
8. Must integrate with existing workflow phases

**Deliverable:** Technical specification with algorithm, data structures, and API design.

---

## Task 3: Session Memory Persistence

**Context:** Agents lose context between sessions, reducing effectiveness.

**Requirements:**
1. Design memory persistence layer for agent sessions
2. Must store: conversation history, decisions made, findings, user preferences
3. Storage format must be human-readable for debugging
4. Must handle concurrent access from multiple agents
5. Memory should be queryable (find past decisions on topic X)
6. Must implement memory decay (older info less prominent)
7. Privacy: user can delete specific memories
8. Must work offline (no external database dependencies)
9. Size limit: 10MB per session maximum

**Deliverable:** Architecture document with storage design, query interface, and lifecycle management.

---

## Task 4: Workflow Orchestrator

**Context:** Multiple workflows need coordination and sequencing.

**Requirements:**
1. Orchestrate execution of multiple workflows (deep-verify, planning, etc.)
2. Support conditional branching based on workflow results
3. Must handle workflow failures gracefully with retry logic
4. Should support parallel workflow execution where possible
5. Must log all orchestration decisions for audit
6. Must integrate with existing workflow definitions in `src/core/workflows/`
7. Support user intervention points (pause, modify, resume)
8. Must be extensible for future workflow types

**Deliverable:** Design document with state machine, interfaces, and extension points.

---

## Task 5: Multi-Agent Collaboration Protocol

**Context:** Complex tasks require multiple specialized agents working together.

**Requirements:**
1. Define protocol for agent-to-agent communication
2. Must support: request/response, broadcast, subscription patterns
3. Handle agent unavailability (timeout, failure)
4. Prevent deadlocks in circular dependencies
5. Must maintain conversation coherence across agents
6. Support priority levels for urgent communications
7. Must be observable (monitor all inter-agent traffic)
8. Security: agents can only communicate with authorized peers

**Deliverable:** Protocol specification with message formats, sequencing, and error handling.

---

## Task 6: Verification Report Generator

**Context:** Deep-verify produces findings but users need formatted reports.

**Requirements:**
1. Transform verification findings into readable reports
2. Support multiple formats: Markdown, HTML, JSON
3. Must include: executive summary, detailed findings, evidence quotes
4. Reports should be diff-friendly (small changes = small diffs)
5. Must handle large verification sessions (100+ findings)
6. Support custom templates for different audiences
7. Must preserve traceability (finding -> report section)
8. Include visualizations where helpful (severity distribution, etc.)

**Deliverable:** Technical design with template system, rendering pipeline, and format handlers.

---

## Task 7: Method Effectiveness Tracker

**Context:** We need data on which methods actually find problems vs generate noise.

**Requirements:**
1. Track method usage across verification sessions
2. Record: method used, finding generated (if any), finding confirmed/rejected
3. Calculate effectiveness metrics per method
4. Detect methods that consistently generate false positives
5. Must handle statistical significance (don't judge on small samples)
6. Should suggest method combinations that work well together
7. Must preserve user privacy (no PII in tracking data)
8. Data export for external analysis

**Deliverable:** Analytics design with data model, metrics definitions, and reporting interface.

---

## Task 8: Incremental Verification System

**Context:** Full verification is expensive. Incremental verification for changes only.

**Requirements:**
1. Detect what changed since last verification
2. Determine minimum verification scope for changes
3. Must handle: content changes, structural changes, dependency changes
4. Cache previous verification results intelligently
5. Must detect when full re-verification is necessary
6. Support force-full-verification override
7. Must work with git-based change detection
8. Handle renamed/moved files correctly

**Deliverable:** Design document with change detection, scope calculation, and caching strategy.

---

## Task 9: Agent Self-Improvement Loop

**Context:** Agents should learn from their mistakes and improve over time.

**Requirements:**
1. Capture agent errors and near-misses
2. Categorize errors by type and root cause
3. Generate improvement suggestions based on error patterns
4. Must distinguish: knowledge gaps, reasoning errors, process failures
5. Implement feedback loop to agent behavior
6. Must be measurable (track improvement over time)
7. Handle edge case: improvement suggestion that makes things worse
8. Must not create infinite loops of self-modification

**Deliverable:** Learning system design with error taxonomy, improvement generation, and safety constraints.

---

## Task 10: Cross-Workflow Consistency Checker

**Context:** Multiple workflows may produce inconsistent results on same content.

**Requirements:**
1. Run multiple workflows on same content
2. Compare results for consistency
3. Flag contradictions between workflow findings
4. Determine authoritative result when conflicts exist
5. Must handle workflows with different granularity levels
6. Support configurable consistency thresholds
7. Generate consolidated view of all workflow results
8. Must scale to 5+ workflows without exponential complexity

**Deliverable:** Consistency framework design with comparison logic, conflict resolution, and reporting.

---

## Instructions for Test Subject Agent

1. Select ONE task to complete
2. Read ALL requirements carefully
3. Design a complete solution addressing every requirement
4. Document assumptions explicitly
5. Consider edge cases and failure modes
6. Provide implementation guidance

**Time allocation:** Spend appropriate time on each requirement proportionally to its complexity.

---

# V2 Tasks (Advanced Difficulty)

> These tasks are designed to test advanced verification capabilities.
> They contain subtle traps that require deep analysis to detect.

---

## Task 11: Plugin Architecture for Method Extensions

**Context:** The BMAD-METHOD needs a plugin system allowing users to add custom methods to methods.csv without modifying core files.

**Requirements:**
1. Design plugin discovery mechanism (scan directories for method files)
2. Plugins must integrate with existing method numbering (methods.csv uses 1-150)
3. Support method dependencies (plugin method X requires core method Y)
4. Hot-reload plugins without restarting the system
5. Validate plugin methods against schema before loading
6. Plugin methods must work with existing workflow phases
7. Handle plugin conflicts (two plugins define same method number)
8. Plugins can extend existing methods (add output_pattern variants)
9. Must maintain backwards compatibility with non-plugin usage
10. Plugin errors must not crash core system

**Deliverable:** Architecture document with plugin lifecycle, dependency resolution, and conflict handling.

---

## Task 12: Incremental Method Effectiveness Learning

**Context:** Track which methods work well together and learn to recommend better combinations over time.

**Requirements:**
1. Record method usage per verification session
2. Track which findings each method produced
3. Correlate method combinations with verification effectiveness
4. Learn weights for method-method synergy scores
5. Recommend method sets based on task characteristics
6. Must reach statistical significance before changing recommendations
7. Handle concept drift (methods that worked before stop working)
8. Privacy: no PII, but track enough to learn
9. Cold start: work reasonably before enough data collected
10. Feedback loop: recommendations influence future data (non-i.i.d.)

**Deliverable:** Learning system design with data model, statistical approach, and recommendation algorithm.

---

## Task 13: Cross-Agent Memory Synchronization

**Context:** Multiple agents need to share memory state while maintaining consistency and handling conflicts.

**Requirements:**
1. Agents can read each other's memories (decisions, findings)
2. Write conflicts resolved automatically
3. Causal ordering preserved (if A caused B, readers see A before B)
4. Partition tolerance: agents work independently if disconnected
5. Eventual consistency with bounded staleness (max 30 seconds)
6. Memory merging when agents reconnect after partition
7. Conflict resolution for semantic conflicts (contradictory decisions)
8. Audit trail of all synchronization events
9. Must work with existing Agent Memory Persistence (Task 3) design
10. Support 2-10 agents with sub-100ms sync latency

**Deliverable:** Synchronization protocol with consistency model, conflict resolution, and partition handling.

---

## Task 14: Self-Modifying Workflow Engine

**Context:** Create a workflow engine that can modify its own verification process based on learned patterns.

**Requirements:**
1. Engine observes which workflow phases find issues
2. Dynamically adjusts phase weights and method selection
3. Can add new phases if pattern detected (e.g., always finding X after Y)
4. Can remove phases that consistently find nothing
5. Changes must be reversible (rollback capability)
6. Must prove changes improve effectiveness (A/B testing)
7. Safety constraint: cannot remove Phase 0 (Self-Check)
8. Safety constraint: cannot reduce total method count below 15
9. Human approval required for structural changes (add/remove phase)
10. Self-modification must not create infinite loops

**Deliverable:** Self-modification framework with safety constraints, evaluation metrics, and rollback mechanism.

---

## Task 15: Natural Language to Method Mapping

**Context:** Users describe their verification needs in natural language; system maps to appropriate methods.

**Requirements:**
1. Parse user intent from free-form text
2. Map intent to one or more methods from methods.csv
3. Handle ambiguous requests (ask clarifying questions)
4. Support negation ("don't use security methods")
5. Learn user preferences over time
6. Explain why methods were selected
7. Handle synonyms (e.g., "check" = "verify" = "validate")
8. Support method composition ("combine first principles with risk analysis")
9. Graceful degradation when no good match exists
10. Multi-language support (at least English + Polish)

**Deliverable:** NLP design with parsing strategy, method matching algorithm, and preference learning.
