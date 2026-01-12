# Workflow Orchestrator - Technical Design Document

**Task:** T4 - Workflow Orchestrator
**Author:** AI Software Architect
**Date:** 2026-01-12
**Version:** 1.0

---

## Executive Summary

This document presents a comprehensive design for a Workflow Orchestrator that coordinates and sequences multiple workflows within the BMAD-METHOD project. The orchestrator manages execution of workflows such as deep-verify, brainstorming, and party-mode, supporting conditional branching, parallel execution, failure handling with retry logic, audit logging, user intervention points, and extensibility for future workflow types.

### Key Design Decisions

1. **State machine architecture** for clear workflow lifecycle management
2. **Directed Acyclic Graph (DAG) execution model** for dependency-aware parallel execution
3. **Event-driven design** for extensibility and loose coupling
4. **Checkpoint-based persistence** for resume capability
5. **Plugin architecture** for adding new workflow types without core changes

---

## Architecture Overview

### System Context

```
+-------------------+     +------------------------+     +-------------------+
|                   |     |                        |     |                   |
|  User / Caller    |<--->|  Workflow              |<--->|  Workflow         |
|                   |     |  Orchestrator          |     |  Definitions      |
|                   |     |                        |     |  (src/core/       |
+-------------------+     +------------------------+     |   workflows/)     |
                                    |                     +-------------------+
                          +---------+---------+
                          |                   |
                          v                   v
              +-------------------+  +-------------------+
              |                   |  |                   |
              |  Audit Logger     |  |  State            |
              |                   |  |  Persistence      |
              |                   |  |                   |
              +-------------------+  +-------------------+
```

### Component Architecture

```
+------------------------------------------------------------------+
|                       Workflow Orchestrator                        |
+------------------------------------------------------------------+
|                                                                    |
|  +---------------+  +------------------+  +--------------------+  |
|  |               |  |                  |  |                    |  |
|  | Workflow      |  | Execution        |  | State              |  |
|  | Registry      |  | Engine           |  | Manager            |  |
|  |               |  |                  |  |                    |  |
|  +---------------+  +------------------+  +--------------------+  |
|         |                  |                      |               |
|         v                  v                      v               |
|  +---------------+  +------------------+  +--------------------+  |
|  |               |  |                  |  |                    |  |
|  | Condition     |  | Retry            |  | Intervention       |  |
|  | Evaluator     |  | Handler          |  | Controller         |  |
|  |               |  |                  |  |                    |  |
|  +---------------+  +------------------+  +--------------------+  |
|         |                  |                      |               |
|         v                  v                      v               |
|  +---------------+  +------------------+  +--------------------+  |
|  |               |  |                  |  |                    |  |
|  | Parallel      |  | Audit            |  | Extension          |  |
|  | Scheduler     |  | Logger           |  | Manager            |  |
|  |               |  |                  |  |                    |  |
|  +---------------+  +------------------+  +--------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

---

## Detailed Design

### Requirement 1: Orchestrate Multiple Workflows

**Design:**

The orchestrator manages workflow execution through a central Execution Engine:

**Data Structures:**

```typescript
// Workflow definition (loaded from src/core/workflows/)
interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  phases: Phase[];
  inputs: InputSchema;
  outputs: OutputSchema;
  dependencies: string[];  // Other workflows that must complete first
  metadata: WorkflowMetadata;
}

interface Phase {
  id: string;
  name: string;
  type: "sequential" | "parallel" | "conditional" | "intervention";
  steps: Step[];
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

interface Step {
  id: string;
  action: StepAction;
  inputs: Map<string, any>;
  outputs: string[];
  onSuccess?: string;  // Next step ID
  onFailure?: string;  // Failure handling step ID
}

// Orchestration plan
interface OrchestrationPlan {
  id: string;
  workflows: WorkflowExecution[];
  executionOrder: string[][];  // Array of parallel groups
  conditions: ConditionalBranch[];
  interventionPoints: InterventionPoint[];
}

interface WorkflowExecution {
  workflowId: string;
  instanceId: string;
  inputs: Map<string, any>;
  state: ExecutionState;
  result?: WorkflowResult;
  startTime?: Date;
  endTime?: Date;
}

type ExecutionState =
  | "pending"
  | "running"
  | "paused"
  | "waiting_intervention"
  | "completed"
  | "failed"
  | "cancelled";
```

**Execution Engine:**

```typescript
class ExecutionEngine {
  private registry: WorkflowRegistry;
  private stateManager: StateManager;
  private auditLogger: AuditLogger;

  async execute(plan: OrchestrationPlan): Promise<OrchestrationResult> {
    this.auditLogger.log("orchestration_start", { planId: plan.id });

    try {
      for (const parallelGroup of plan.executionOrder) {
        // Check for intervention before each group
        await this.checkInterventionPoints(plan);

        // Execute workflows in parallel group
        const results = await this.executeParallelGroup(parallelGroup, plan);

        // Evaluate conditions for next steps
        await this.evaluateConditions(results, plan);

        // Persist checkpoint
        await this.stateManager.checkpoint(plan);
      }

      return this.buildResult(plan);
    } catch (error) {
      this.auditLogger.log("orchestration_error", { planId: plan.id, error });
      throw error;
    }
  }

  private async executeParallelGroup(
    workflowIds: string[],
    plan: OrchestrationPlan
  ): Promise<WorkflowResult[]> {
    const executions = workflowIds.map(id =>
      plan.workflows.find(w => w.workflowId === id)!
    );

    return Promise.all(
      executions.map(exec => this.executeSingleWorkflow(exec))
    );
  }

  private async executeSingleWorkflow(
    execution: WorkflowExecution
  ): Promise<WorkflowResult> {
    const workflow = this.registry.get(execution.workflowId);

    execution.state = "running";
    execution.startTime = new Date();

    try {
      const result = await workflow.run(execution.inputs);
      execution.state = "completed";
      execution.result = result;
      return result;
    } catch (error) {
      execution.state = "failed";
      throw error;
    } finally {
      execution.endTime = new Date();
    }
  }
}
```

### Requirement 2: Conditional Branching Based on Results

**Design:**

Conditional branching is implemented through a Condition Evaluator:

```typescript
interface ConditionalBranch {
  id: string;
  condition: Condition;
  onTrue: string[];   // Workflow IDs to execute if true
  onFalse: string[];  // Workflow IDs to execute if false
}

interface Condition {
  type: ConditionType;
  expression: string;
  context: string[];  // Workflow outputs to evaluate
}

type ConditionType =
  | "result_equals"     // Check if result equals value
  | "result_contains"   // Check if result contains value
  | "severity_above"    // Check if finding severity exceeds threshold
  | "count_exceeds"     // Check if count exceeds threshold
  | "custom_expression" // JavaScript expression
  | "all_passed"        // All workflows passed
  | "any_failed";       // Any workflow failed

class ConditionEvaluator {
  evaluate(condition: Condition, context: ExecutionContext): boolean {
    switch (condition.type) {
      case "result_equals":
        return this.evaluateEquals(condition, context);

      case "severity_above":
        return this.evaluateSeverity(condition, context);

      case "count_exceeds":
        return this.evaluateCount(condition, context);

      case "all_passed":
        return this.evaluateAllPassed(context);

      case "any_failed":
        return this.evaluateAnyFailed(context);

      case "custom_expression":
        return this.evaluateCustom(condition, context);

      default:
        throw new Error(`Unknown condition type: ${condition.type}`);
    }
  }

  private evaluateSeverity(
    condition: Condition,
    context: ExecutionContext
  ): boolean {
    const findings = context.getFindings();
    const threshold = this.parseThreshold(condition.expression);

    return findings.some(f => this.severityToNumber(f.severity) >= threshold);
  }

  private severityToNumber(severity: string): number {
    const map: Record<string, number> = {
      "critical": 3,
      "important": 2,
      "minor": 1
    };
    return map[severity.toLowerCase()] || 0;
  }
}
```

**Example Conditional Flow:**

```yaml
# orchestration-plan.yaml
conditionalBranches:
  - id: "security-gate"
    condition:
      type: "severity_above"
      expression: "2"  # Critical or Important
      context: ["deep-verify.findings"]
    onTrue: ["security-remediation", "security-review"]
    onFalse: ["standard-completion"]

  - id: "completeness-check"
    condition:
      type: "count_exceeds"
      expression: "3"
      context: ["deep-verify.findings.count"]
    onTrue: ["extended-verification"]
    onFalse: ["quick-summary"]
```

### Requirement 3: Graceful Failure Handling with Retry Logic

**Design:**

```typescript
interface RetryPolicy {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors: string[];  // Error types that should be retried
}

interface FailureContext {
  workflowId: string;
  phaseId: string;
  stepId: string;
  error: Error;
  attempt: number;
  history: FailureRecord[];
}

interface FailureRecord {
  timestamp: Date;
  error: Error;
  attempt: number;
  recoveryAction: string;
}

class RetryHandler {
  private defaultPolicy: RetryPolicy = {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    retryableErrors: ["TIMEOUT", "NETWORK_ERROR", "TRANSIENT_FAILURE"]
  };

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    policy: RetryPolicy = this.defaultPolicy,
    context: FailureContext
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        context.attempt = attempt;
        context.history.push({
          timestamp: new Date(),
          error: lastError,
          attempt,
          recoveryAction: this.determineRecoveryAction(lastError, policy)
        });

        if (!this.isRetryable(lastError, policy)) {
          break;
        }

        if (attempt < policy.maxAttempts) {
          const delay = this.calculateDelay(attempt, policy);
          await this.sleep(delay);
        }
      }
    }

    return this.handleFinalFailure(lastError!, context);
  }

  private calculateDelay(attempt: number, policy: RetryPolicy): number {
    const delay = policy.initialDelayMs *
      Math.pow(policy.backoffMultiplier, attempt - 1);
    return Math.min(delay, policy.maxDelayMs);
  }

  private isRetryable(error: Error, policy: RetryPolicy): boolean {
    return policy.retryableErrors.some(type =>
      error.name === type || error.message.includes(type)
    );
  }

  private handleFinalFailure(error: Error, context: FailureContext): never {
    // Emit failure event for orchestrator to handle
    this.emitEvent("workflow_failure", {
      ...context,
      finalError: error,
      recommendation: this.suggestRecovery(error, context)
    });

    throw new WorkflowFailureError(error, context);
  }

  private suggestRecovery(error: Error, context: FailureContext): string {
    // Analyze failure pattern and suggest recovery
    if (context.history.length >= 3) {
      return "Multiple failures detected. Consider manual intervention.";
    }

    if (error.message.includes("TIMEOUT")) {
      return "Increase timeout or reduce workflow complexity.";
    }

    return "Review error details and retry manually.";
  }
}
```

**Graceful Degradation:**

```typescript
interface DegradationStrategy {
  type: "skip" | "fallback" | "partial" | "abort";
  fallbackWorkflow?: string;
  partialContinuation?: string[];
}

class GracefulDegradation {
  determineStrategy(
    failure: FailureContext,
    plan: OrchestrationPlan
  ): DegradationStrategy {
    const workflow = plan.workflows.find(w => w.workflowId === failure.workflowId);

    // Critical workflows cannot be skipped
    if (workflow?.metadata.critical) {
      return { type: "abort" };
    }

    // Check for fallback workflow
    if (workflow?.metadata.fallback) {
      return { type: "fallback", fallbackWorkflow: workflow.metadata.fallback };
    }

    // Determine if partial continuation is possible
    const independentWorkflows = this.findIndependentWorkflows(
      failure.workflowId,
      plan
    );

    if (independentWorkflows.length > 0) {
      return { type: "partial", partialContinuation: independentWorkflows };
    }

    return { type: "skip" };
  }
}
```

### Requirement 4: Parallel Workflow Execution

**Design:**

The Parallel Scheduler identifies workflows that can run concurrently:

```typescript
interface DependencyGraph {
  nodes: Map<string, WorkflowNode>;
  edges: Map<string, string[]>;  // workflow -> dependencies
}

interface WorkflowNode {
  workflowId: string;
  dependencies: string[];
  dependents: string[];
  status: ExecutionState;
}

class ParallelScheduler {
  private graph: DependencyGraph;

  buildExecutionPlan(workflows: WorkflowDefinition[]): string[][] {
    this.graph = this.buildDependencyGraph(workflows);
    this.validateNoCycles();

    const plan: string[][] = [];
    const completed = new Set<string>();

    while (completed.size < workflows.length) {
      // Find all workflows with satisfied dependencies
      const ready = this.findReadyWorkflows(completed);

      if (ready.length === 0 && completed.size < workflows.length) {
        throw new Error("Deadlock detected in workflow dependencies");
      }

      plan.push(ready);
      ready.forEach(id => completed.add(id));
    }

    return plan;
  }

  private findReadyWorkflows(completed: Set<string>): string[] {
    const ready: string[] = [];

    for (const [workflowId, node] of this.graph.nodes) {
      if (completed.has(workflowId)) continue;

      const allDependenciesMet = node.dependencies.every(
        dep => completed.has(dep)
      );

      if (allDependenciesMet) {
        ready.push(workflowId);
      }
    }

    return ready;
  }

  private validateNoCycles(): void {
    // Tarjan's algorithm for cycle detection
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const workflowId of this.graph.nodes.keys()) {
      if (this.hasCycle(workflowId, visited, recursionStack)) {
        throw new Error(`Circular dependency detected involving ${workflowId}`);
      }
    }
  }

  private hasCycle(
    node: string,
    visited: Set<string>,
    stack: Set<string>
  ): boolean {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    const dependencies = this.graph.edges.get(node) || [];
    for (const dep of dependencies) {
      if (this.hasCycle(dep, visited, stack)) {
        return true;
      }
    }

    stack.delete(node);
    return false;
  }
}
```

**Parallel Execution Example:**

```
Workflows: A, B, C, D, E
Dependencies:
  B depends on A
  C depends on A
  D depends on B, C
  E depends on nothing

Execution Plan:
  Group 1: [A, E]     <- Run in parallel
  Group 2: [B, C]     <- Run in parallel after A completes
  Group 3: [D]        <- Run after B and C complete
```

### Requirement 5: Audit Logging

**Design:**

```typescript
interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  orchestrationId: string;
  workflowId?: string;
  phaseId?: string;
  stepId?: string;
  actor: string;
  details: Record<string, any>;
  correlationId: string;
}

type AuditEventType =
  | "orchestration_start"
  | "orchestration_complete"
  | "orchestration_error"
  | "workflow_start"
  | "workflow_complete"
  | "workflow_error"
  | "phase_start"
  | "phase_complete"
  | "condition_evaluated"
  | "branch_taken"
  | "retry_attempted"
  | "intervention_requested"
  | "intervention_resolved"
  | "state_checkpoint"
  | "decision_made";

class AuditLogger {
  private storage: AuditStorage;
  private correlationId: string;

  log(eventType: AuditEventType, details: Record<string, any>): void {
    const event: AuditEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      eventType,
      orchestrationId: details.orchestrationId || this.currentOrchestrationId,
      workflowId: details.workflowId,
      phaseId: details.phaseId,
      stepId: details.stepId,
      actor: details.actor || "system",
      details: this.sanitizeDetails(details),
      correlationId: this.correlationId
    };

    this.storage.append(event);

    // Emit for real-time monitoring
    this.emitAuditEvent(event);
  }

  logDecision(decision: OrchestrationDecision): void {
    this.log("decision_made", {
      decisionType: decision.type,
      options: decision.options,
      selected: decision.selected,
      rationale: decision.rationale,
      alternatives: decision.alternatives
    });
  }

  private sanitizeDetails(details: Record<string, any>): Record<string, any> {
    // Remove sensitive data
    const sanitized = { ...details };
    delete sanitized.credentials;
    delete sanitized.tokens;
    delete sanitized.secrets;
    return sanitized;
  }

  // Query audit trail
  async queryEvents(
    filter: AuditFilter
  ): Promise<AuditEvent[]> {
    return this.storage.query(filter);
  }

  // Generate audit report
  async generateReport(
    orchestrationId: string
  ): Promise<AuditReport> {
    const events = await this.queryEvents({ orchestrationId });

    return {
      orchestrationId,
      totalEvents: events.length,
      timeline: this.buildTimeline(events),
      decisions: this.extractDecisions(events),
      errors: this.extractErrors(events),
      interventions: this.extractInterventions(events),
      duration: this.calculateDuration(events)
    };
  }
}
```

**Audit Log Format:**

```json
{
  "id": "evt_20260112_001",
  "timestamp": "2026-01-12T10:30:15.123Z",
  "eventType": "condition_evaluated",
  "orchestrationId": "orch_abc123",
  "workflowId": "deep-verify",
  "details": {
    "conditionId": "security-gate",
    "conditionType": "severity_above",
    "input": {"findings": [{"severity": "critical"}]},
    "result": true,
    "branch": "onTrue",
    "nextWorkflows": ["security-remediation"]
  },
  "correlationId": "corr_xyz789"
}
```

### Requirement 6: Integration with Existing Workflow Definitions

**Design:**

```typescript
interface WorkflowRegistry {
  // Load workflow from src/core/workflows/
  load(workflowPath: string): Promise<WorkflowDefinition>;

  // Register workflow
  register(workflow: WorkflowDefinition): void;

  // Get workflow by ID
  get(workflowId: string): WorkflowDefinition | undefined;

  // List all registered workflows
  list(): WorkflowDefinition[];

  // Validate workflow definition
  validate(workflow: WorkflowDefinition): ValidationResult;
}

class WorkflowLoader {
  private basePath = "src/core/workflows/";

  async loadAll(): Promise<WorkflowDefinition[]> {
    const directories = await this.scanWorkflowDirectories();
    const workflows: WorkflowDefinition[] = [];

    for (const dir of directories) {
      const definition = await this.loadWorkflow(dir);
      if (definition) {
        workflows.push(definition);
      }
    }

    return workflows;
  }

  private async loadWorkflow(directory: string): Promise<WorkflowDefinition | null> {
    const workflowFile = path.join(directory, "workflow.md");

    if (!await this.fileExists(workflowFile)) {
      return null;
    }

    const content = await this.readFile(workflowFile);
    return this.parseWorkflowDefinition(content, directory);
  }

  private parseWorkflowDefinition(
    content: string,
    directory: string
  ): WorkflowDefinition {
    // Extract workflow metadata from markdown
    const metadata = this.extractMetadata(content);
    const phases = this.extractPhases(content);

    return {
      id: path.basename(directory),
      name: metadata.name || path.basename(directory),
      version: metadata.version || "1.0",
      description: metadata.description || "",
      phases,
      inputs: this.extractInputSchema(content),
      outputs: this.extractOutputSchema(content),
      dependencies: metadata.dependencies || [],
      metadata: {
        path: directory,
        critical: metadata.critical || false,
        fallback: metadata.fallback
      }
    };
  }
}
```

**Supported Workflows (from project):**

| Workflow | Path | Description |
|----------|------|-------------|
| deep-verify | src/core/workflows/deep-verify/ | Verification workflow |
| deep-discover | src/core/workflows/deep-discover/ | Discovery workflow |
| brainstorming | src/core/workflows/brainstorming/ | Ideation workflow |
| party-mode | src/core/workflows/party-mode/ | Multi-agent discussion |

### Requirement 7: User Intervention Points

**Design:**

```typescript
interface InterventionPoint {
  id: string;
  type: InterventionType;
  workflowId: string;
  phaseId?: string;
  condition?: Condition;  // When to trigger intervention
  prompt: string;
  options: InterventionOption[];
  timeout?: number;  // Auto-proceed after timeout
  defaultOption?: string;
}

type InterventionType =
  | "approval"       // User must approve to continue
  | "choice"         // User selects from options
  | "input"          // User provides input data
  | "review"         // User reviews results before continuing
  | "modification";  // User can modify parameters

interface InterventionOption {
  id: string;
  label: string;
  description: string;
  action: InterventionAction;
}

type InterventionAction =
  | { type: "continue" }
  | { type: "skip"; target: string }
  | { type: "abort" }
  | { type: "modify"; parameters: string[] }
  | { type: "retry"; withChanges?: Record<string, any> };

class InterventionController {
  private pendingInterventions: Map<string, PendingIntervention> = new Map();

  async requestIntervention(
    point: InterventionPoint,
    context: ExecutionContext
  ): Promise<InterventionResponse> {
    const intervention: PendingIntervention = {
      id: this.generateId(),
      point,
      context,
      requestedAt: new Date(),
      state: "pending"
    };

    this.pendingInterventions.set(intervention.id, intervention);

    // Emit event for UI/notification system
    this.emitEvent("intervention_requested", intervention);

    // Wait for response or timeout
    return this.waitForResponse(intervention);
  }

  private async waitForResponse(
    intervention: PendingIntervention
  ): Promise<InterventionResponse> {
    return new Promise((resolve) => {
      const timeoutMs = intervention.point.timeout || 300000; // 5 min default

      const timeoutId = setTimeout(() => {
        if (intervention.state === "pending") {
          const defaultOption = intervention.point.defaultOption;
          if (defaultOption) {
            resolve({
              interventionId: intervention.id,
              selectedOption: defaultOption,
              source: "timeout",
              timestamp: new Date()
            });
          } else {
            resolve({
              interventionId: intervention.id,
              selectedOption: "abort",
              source: "timeout",
              timestamp: new Date()
            });
          }
        }
      }, timeoutMs);

      // Listen for user response
      this.onResponse(intervention.id, (response) => {
        clearTimeout(timeoutId);
        intervention.state = "resolved";
        resolve(response);
      });
    });
  }

  // User interface for responding to interventions
  respond(
    interventionId: string,
    optionId: string,
    additionalData?: Record<string, any>
  ): void {
    const intervention = this.pendingInterventions.get(interventionId);
    if (!intervention || intervention.state !== "pending") {
      throw new Error(`Invalid intervention: ${interventionId}`);
    }

    const response: InterventionResponse = {
      interventionId,
      selectedOption: optionId,
      source: "user",
      timestamp: new Date(),
      additionalData
    };

    this.emitResponse(interventionId, response);
  }

  // Pause orchestration
  async pause(orchestrationId: string): Promise<void> {
    return this.requestIntervention({
      id: "manual-pause",
      type: "approval",
      workflowId: "*",
      prompt: "Orchestration paused. Select action:",
      options: [
        { id: "resume", label: "Resume", description: "Continue execution", action: { type: "continue" } },
        { id: "abort", label: "Abort", description: "Stop orchestration", action: { type: "abort" } }
      ]
    }, { orchestrationId });
  }

  // Resume from pause
  resume(orchestrationId: string): void {
    this.respond(`pause-${orchestrationId}`, "resume");
  }

  // Modify parameters mid-execution
  async modifyParameters(
    orchestrationId: string,
    workflowId: string,
    parameters: Record<string, any>
  ): Promise<void> {
    const context = await this.getExecutionContext(orchestrationId);
    context.updateParameters(workflowId, parameters);
    this.auditLogger.log("parameters_modified", { orchestrationId, workflowId, parameters });
  }
}
```

**Intervention UI Flow:**

```
1. Orchestrator reaches intervention point
2. Orchestrator emits "intervention_requested" event
3. UI displays intervention dialog to user
4. User selects option or provides input
5. UI calls InterventionController.respond()
6. Orchestrator continues with selected action
```

### Requirement 8: Extensibility for Future Workflow Types

**Design:**

Plugin architecture for extending workflow capabilities:

```typescript
interface WorkflowPlugin {
  // Plugin metadata
  id: string;
  name: string;
  version: string;

  // Lifecycle hooks
  onLoad(): Promise<void>;
  onUnload(): Promise<void>;

  // Workflow type registration
  getWorkflowTypes(): WorkflowTypeDefinition[];

  // Custom step handlers
  getStepHandlers(): Map<string, StepHandler>;

  // Custom conditions
  getConditionTypes(): Map<string, ConditionHandler>;

  // Custom intervention types
  getInterventionTypes(): Map<string, InterventionHandler>;
}

interface WorkflowTypeDefinition {
  type: string;
  schema: JSONSchema;
  executor: WorkflowExecutor;
  validator: WorkflowValidator;
}

interface StepHandler {
  type: string;
  execute(step: Step, context: ExecutionContext): Promise<StepResult>;
  validate(step: Step): ValidationResult;
}

class ExtensionManager {
  private plugins: Map<string, WorkflowPlugin> = new Map();
  private stepHandlers: Map<string, StepHandler> = new Map();
  private conditionHandlers: Map<string, ConditionHandler> = new Map();

  async loadPlugin(pluginPath: string): Promise<void> {
    const plugin = await this.importPlugin(pluginPath);

    // Validate plugin
    this.validatePlugin(plugin);

    // Register plugin components
    await plugin.onLoad();

    for (const [type, handler] of plugin.getStepHandlers()) {
      this.stepHandlers.set(type, handler);
    }

    for (const [type, handler] of plugin.getConditionTypes()) {
      this.conditionHandlers.set(type, handler);
    }

    this.plugins.set(plugin.id, plugin);
  }

  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    await plugin.onUnload();

    // Unregister components
    for (const [type] of plugin.getStepHandlers()) {
      this.stepHandlers.delete(type);
    }

    this.plugins.delete(pluginId);
  }

  getStepHandler(type: string): StepHandler | undefined {
    return this.stepHandlers.get(type);
  }
}
```

**Example Plugin:**

```typescript
// custom-verification-plugin.ts
export class CustomVerificationPlugin implements WorkflowPlugin {
  id = "custom-verification";
  name = "Custom Verification Plugin";
  version = "1.0.0";

  async onLoad(): Promise<void> {
    console.log("Custom verification plugin loaded");
  }

  async onUnload(): Promise<void> {
    console.log("Custom verification plugin unloaded");
  }

  getWorkflowTypes(): WorkflowTypeDefinition[] {
    return [{
      type: "custom-verify",
      schema: this.getSchema(),
      executor: new CustomVerifyExecutor(),
      validator: new CustomVerifyValidator()
    }];
  }

  getStepHandlers(): Map<string, StepHandler> {
    return new Map([
      ["custom-check", new CustomCheckHandler()],
      ["external-api-call", new ExternalAPIHandler()]
    ]);
  }

  getConditionTypes(): Map<string, ConditionHandler> {
    return new Map([
      ["ml-confidence", new MLConfidenceCondition()]
    ]);
  }

  getInterventionTypes(): Map<string, InterventionHandler> {
    return new Map();
  }
}
```

---

## State Machine Design

### Orchestration State Machine

```
                    +----------+
                    |  CREATED |
                    +----+-----+
                         |
                         v
+-------+           +----+-----+
| ABORT |<----------+ STARTING |
+-------+           +----+-----+
    ^                    |
    |                    v
    |   +-----------+----+-----+-----------+
    |   |           |  RUNNING |           |
    |   |           +----+-----+           |
    |   |                |                 |
    |   v                v                 v
    | +------+      +----+-----+      +--------+
    +-+ PAUSE|      | WAITING  |      | ERROR  |
    | +--+---+      | INTERV   |      +----+---+
    |    |          +----+-----+           |
    |    |               |                 |
    |    +-------+-------+                 |
    |            |                         |
    |            v                         |
    |       +----+-----+                   |
    +-------+ COMPLETE +-------------------+
            +----------+
```

### State Transitions

| From | To | Trigger |
|------|-----|---------|
| CREATED | STARTING | start() called |
| STARTING | RUNNING | Initialization complete |
| RUNNING | WAITING_INTERVENTION | Intervention point reached |
| RUNNING | PAUSE | pause() called |
| RUNNING | ERROR | Unrecoverable error |
| RUNNING | COMPLETE | All workflows finished |
| WAITING_INTERVENTION | RUNNING | Intervention resolved |
| PAUSE | RUNNING | resume() called |
| PAUSE | ABORT | abort() called |
| ERROR | COMPLETE | Error handled |
| * | ABORT | abort() called |

---

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1-2)

| Task | Description | Effort |
|------|-------------|--------|
| 1.1 | Implement state machine | 16h |
| 1.2 | Create workflow registry | 12h |
| 1.3 | Build execution engine | 24h |
| 1.4 | Implement workflow loader | 8h |

### Phase 2: Advanced Features (Week 3-4)

| Task | Description | Effort |
|------|-------------|--------|
| 2.1 | Implement conditional branching | 16h |
| 2.2 | Build parallel scheduler | 16h |
| 2.3 | Implement retry handler | 12h |
| 2.4 | Create audit logger | 12h |

### Phase 3: User Interaction (Week 5)

| Task | Description | Effort |
|------|-------------|--------|
| 3.1 | Implement intervention controller | 16h |
| 3.2 | Build pause/resume functionality | 8h |
| 3.3 | Create state persistence | 12h |
| 3.4 | Integration with existing workflows | 12h |

### Phase 4: Extensibility and Testing (Week 6)

| Task | Description | Effort |
|------|-------------|--------|
| 4.1 | Implement extension manager | 16h |
| 4.2 | Create plugin interface | 8h |
| 4.3 | Write comprehensive tests | 16h |
| 4.4 | Documentation | 8h |

---

## Assumptions

1. **Workflow Definition Format**: Existing workflows in `src/core/workflows/` follow a consistent markdown format with extractable phase definitions.

2. **Single Orchestration Instance**: Only one orchestration runs at a time per context. Multi-tenant orchestration is out of scope.

3. **Synchronous Phase Execution**: Within a workflow, phases execute sequentially. Parallelism only applies across workflows.

4. **State Persistence**: File-based state persistence is acceptable. Database integration can be added later.

5. **Intervention Response Time**: Users respond to interventions within 5 minutes. Longer timeouts can be configured per intervention.

6. **Error Recovery Scope**: The orchestrator handles transient errors. Persistent errors require manual intervention.

7. **Audit Log Retention**: Audit logs are retained for the session. Long-term retention policies are out of scope.

8. **Plugin Isolation**: Plugins run in the same process. Sandboxing is not implemented in v1.

---

## API Reference

### Primary Interface

```typescript
export interface WorkflowOrchestrator {
  // Create orchestration plan
  createPlan(config: OrchestrationConfig): Promise<OrchestrationPlan>;

  // Execute orchestration
  execute(plan: OrchestrationPlan): Promise<OrchestrationResult>;

  // Control operations
  pause(orchestrationId: string): Promise<void>;
  resume(orchestrationId: string): Promise<void>;
  abort(orchestrationId: string): Promise<void>;

  // Intervention
  respondToIntervention(
    interventionId: string,
    response: InterventionResponse
  ): Promise<void>;

  // Query
  getStatus(orchestrationId: string): Promise<OrchestrationStatus>;
  getAuditLog(orchestrationId: string): Promise<AuditEvent[]>;

  // Extension
  loadPlugin(pluginPath: string): Promise<void>;
  unloadPlugin(pluginId: string): Promise<void>;
}

export interface OrchestrationConfig {
  workflows: string[];  // Workflow IDs to orchestrate
  inputs: Map<string, any>;  // Inputs per workflow
  conditions?: ConditionalBranch[];
  interventionPoints?: InterventionPoint[];
  retryPolicy?: RetryPolicy;
  parallelism?: boolean;  // Enable parallel execution
  timeout?: number;  // Overall timeout
}

export interface OrchestrationResult {
  orchestrationId: string;
  status: "completed" | "failed" | "aborted";
  workflowResults: Map<string, WorkflowResult>;
  duration: number;
  auditSummary: AuditSummary;
}
```

---

## Conclusion

This Workflow Orchestrator design provides a robust, flexible, and extensible framework for coordinating multiple workflows in the BMAD-METHOD project. The state machine architecture ensures predictable behavior, while the plugin system enables future growth without core modifications. The comprehensive audit logging and intervention points give users full visibility and control over the orchestration process.
