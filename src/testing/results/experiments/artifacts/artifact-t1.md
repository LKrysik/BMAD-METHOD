# Configuration Validator Module - Technical Design Document

**Task:** T1 - Configuration Validator Module
**Author:** AI Software Architect
**Date:** 2026-01-12
**Version:** 1.0

---

## Executive Summary

This document presents a comprehensive design for a YAML schema validator module tailored for the BMAD-METHOD project. The module validates agent configuration files against defined schemas, supporting nested structures up to 5 levels deep, handling circular references gracefully, and providing actionable error messages. The design prioritizes performance (100 files in under 2 seconds), extensibility, and seamless integration with existing project patterns.

### Key Design Decisions

1. **Schema-based validation** using JSON Schema converted from YAML for robust type checking
2. **Lazy loading architecture** to meet performance requirements
3. **Directed Acyclic Graph (DAG) detection** for circular reference handling
4. **Context-rich error messages** with path information and suggested fixes
5. **Plugin architecture** for custom validation rules

---

## Architecture Overview

### System Context

```
+-------------------+     +------------------------+     +-------------------+
|                   |     |                        |     |                   |
|  Agent Config     |---->|  Configuration         |---->|  Validation       |
|  Files            |     |  Validator Module      |     |  Report           |
|  (.yaml/.yml)     |     |                        |     |                   |
+-------------------+     +------------------------+     +-------------------+
                                    |
                                    v
                          +------------------------+
                          |                        |
                          |  Agent Pattern         |
                          |  Reference             |
                          |  (src/core/agents/)    |
                          +------------------------+
```

### Component Architecture

```
+------------------------------------------------------------------+
|                   Configuration Validator Module                   |
+------------------------------------------------------------------+
|                                                                    |
|  +---------------+  +---------------+  +----------------------+   |
|  |               |  |               |  |                      |   |
|  | Schema        |  | File          |  | Pattern              |   |
|  | Manager       |  | Loader        |  | Matcher              |   |
|  |               |  |               |  |                      |   |
|  +---------------+  +---------------+  +----------------------+   |
|         |                  |                    |                  |
|         v                  v                    v                  |
|  +---------------+  +---------------+  +----------------------+   |
|  |               |  |               |  |                      |   |
|  | Validation    |  | Circular      |  | Error                |   |
|  | Engine        |  | Ref Detector  |  | Reporter             |   |
|  |               |  |               |  |                      |   |
|  +---------------+  +---------------+  +----------------------+   |
|                                                                    |
+------------------------------------------------------------------+
```

---

## Detailed Design

### Requirement 1: YAML Schema Validator

**Design:**

The schema validator uses a two-phase approach:
1. **Schema Definition Phase**: Define validation rules in YAML-based schema format
2. **Validation Phase**: Parse target files and validate against schema

**Schema Definition Format:**

```yaml
# agent-schema.yaml
$schema: "bmad-config-validator/1.0"
type: object
required:
  - agent
properties:
  agent:
    type: object
    required:
      - metadata
      - persona
    properties:
      metadata:
        type: object
        required:
          - id
          - name
        properties:
          id:
            type: string
            pattern: "^_bmad/.*\\.md$"
          name:
            type: string
            minLength: 1
          title:
            type: string
          icon:
            type: string
            pattern: "^[\\p{Emoji}]$"
          hasSidecar:
            type: boolean
```

**Interface:**

```typescript
interface SchemaValidator {
  loadSchema(schemaPath: string): Schema;
  validate(config: YAMLDocument, schema: Schema): ValidationResult;
  validateFile(filePath: string, schemaPath: string): ValidationResult;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  path: string;
  timestamp: Date;
}
```

### Requirement 2: Nested Structures (5 Levels Deep)

**Design:**

The validator implements recursive descent parsing with depth tracking:

```
Level 0: Root (agent)
  Level 1: Section (metadata, persona, menu)
    Level 2: Property (id, name, trigger)
      Level 3: Sub-property (action, description)
        Level 4: Nested object or array
          Level 5: Leaf values
```

**Implementation Strategy:**

```typescript
interface DepthTracker {
  maxDepth: 5;
  currentPath: string[];

  enterLevel(key: string): boolean;  // Returns false if maxDepth exceeded
  exitLevel(): void;
  getCurrentDepth(): number;
  getPath(): string;  // Returns "agent.metadata.id" format
}

function validateRecursive(
  node: any,
  schema: SchemaNode,
  tracker: DepthTracker
): ValidationError[] {
  if (tracker.getCurrentDepth() > tracker.maxDepth) {
    return [{
      code: "MAX_DEPTH_EXCEEDED",
      message: `Nesting exceeds maximum depth of ${tracker.maxDepth}`,
      path: tracker.getPath(),
      severity: "error"
    }];
  }
  // Recursive validation logic...
}
```

### Requirement 3: Validate Against Existing Agent Patterns

**Design:**

The Pattern Matcher component extracts patterns from existing agents in `src/core/agents/`:

**Pattern Extraction:**

```typescript
interface AgentPattern {
  structurePattern: StructureSignature;
  requiredFields: string[];
  optionalFields: string[];
  namingConventions: NamingRule[];
  typeConstraints: Map<string, TypeConstraint>;
}

class PatternExtractor {
  private agentsPath = "src/core/agents/";

  async extractPatterns(): Promise<AgentPattern[]> {
    const files = await this.scanDirectory(this.agentsPath);
    const patterns: AgentPattern[] = [];

    for (const file of files) {
      const content = await this.parseYAML(file);
      patterns.push(this.analyzeStructure(content));
    }

    return this.consolidatePatterns(patterns);
  }

  private consolidatePatterns(patterns: AgentPattern[]): AgentPattern[] {
    // Identify common structures across all agents
    // Build canonical pattern with optional variations
  }
}
```

**Reference Patterns (from bmad-master.agent.yaml):**

| Section | Required Fields | Type |
|---------|----------------|------|
| agent.metadata | id, name | object |
| agent.persona | role, identity | object |
| agent.critical_actions | - | array of strings |
| agent.menu | trigger, action | array of objects |

### Requirement 4: Actionable and Specific Error Messages

**Design:**

Error messages follow a structured format:

```typescript
interface ValidationError {
  code: ErrorCode;           // Machine-readable code
  message: string;           // Human-readable description
  path: string;              // JSON path to error location
  severity: "error" | "warning" | "info";
  suggestion: string;        // Actionable fix suggestion
  context: {
    expected: any;           // What was expected
    received: any;           // What was found
    schemaRef: string;       // Reference to schema rule
  };
}

// Example error:
{
  code: "MISSING_REQUIRED_FIELD",
  message: "Required field 'id' is missing in agent.metadata",
  path: "agent.metadata",
  severity: "error",
  suggestion: "Add 'id' field with format: id: \"_bmad/core/agents/<name>.md\"",
  context: {
    expected: "string matching pattern ^_bmad/.*\\.md$",
    received: undefined,
    schemaRef: "#/properties/agent/properties/metadata/required"
  }
}
```

**Error Categories:**

| Category | Code Prefix | Example |
|----------|-------------|---------|
| Structure | STRUCT_ | STRUCT_MISSING_FIELD |
| Type | TYPE_ | TYPE_INVALID_STRING |
| Pattern | PATTERN_ | PATTERN_MISMATCH |
| Reference | REF_ | REF_CIRCULAR |
| Constraint | CONST_ | CONST_EXCEEDED_DEPTH |

### Requirement 5: Circular Reference Handling

**Design:**

Circular references are detected using a visited-node tracking approach:

```typescript
interface CircularRefDetector {
  visited: Set<string>;
  path: string[];

  checkNode(nodeId: string): CircularRefResult;
  recordVisit(nodeId: string): void;
  clearPath(): void;
}

interface CircularRefResult {
  isCircular: boolean;
  cycle?: string[];  // Path of the cycle if detected
}

function detectCircularRefs(document: YAMLDocument): CircularRefResult[] {
  const detector = new CircularRefDetector();
  const results: CircularRefResult[] = [];

  function traverse(node: any, path: string[]) {
    const nodeId = generateNodeId(node, path);

    if (detector.visited.has(nodeId)) {
      results.push({
        isCircular: true,
        cycle: [...path, nodeId]
      });
      return;
    }

    detector.recordVisit(nodeId);

    if (isReference(node)) {
      const refTarget = resolveReference(node);
      traverse(refTarget, [...path, node.$ref]);
    }

    // Continue traversal...
  }

  traverse(document.root, []);
  return results;
}
```

**Graceful Handling:**

- Circular references are reported but do not crash validation
- Validation continues with remaining non-circular portions
- Clear error message identifies the cycle path

### Requirement 6: Performance (100 Files < 2 Seconds)

**Design:**

Performance is achieved through:

1. **Parallel File Processing:**

```typescript
async function validateBatch(files: string[]): Promise<ValidationResult[]> {
  const BATCH_SIZE = 20;  // Process 20 files concurrently
  const results: ValidationResult[] = [];

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(file => validateFile(file))
    );
    results.push(...batchResults);
  }

  return results;
}
```

2. **Schema Caching:**

```typescript
class SchemaCache {
  private cache: Map<string, Schema> = new Map();
  private maxSize: number = 50;

  get(schemaPath: string): Schema | undefined {
    return this.cache.get(schemaPath);
  }

  set(schemaPath: string, schema: Schema): void {
    if (this.cache.size >= this.maxSize) {
      // LRU eviction
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
    this.cache.set(schemaPath, schema);
  }
}
```

3. **Lazy Pattern Loading:**

Patterns from `src/core/agents/` are loaded once and cached for the session.

**Performance Targets:**

| Operation | Target Time |
|-----------|-------------|
| Single file validation | < 15ms |
| Schema loading (cached) | < 1ms |
| Schema loading (uncached) | < 50ms |
| 100 files (parallel) | < 2000ms |

### Requirement 7: Support .yaml and .yml Extensions

**Design:**

```typescript
const YAML_EXTENSIONS = ['.yaml', '.yml'];

function isYAMLFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return YAML_EXTENSIONS.includes(ext);
}

async function scanForYAMLFiles(directory: string): Promise<string[]> {
  const files = await fs.readdir(directory, { recursive: true });
  return files.filter(file => isYAMLFile(file));
}
```

Both extensions are treated identically in all operations.

### Requirement 8: Integration with Existing Error Handling

**Design:**

Based on analysis of the project structure, the validator integrates with existing patterns:

```typescript
// Follows BMAD error handling conventions
interface BMadError {
  type: "validation" | "parsing" | "system";
  code: string;
  message: string;
  recoverable: boolean;
  context: Record<string, any>;
}

class ValidationModule {
  private errorHandler: ErrorHandler;

  constructor(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;
  }

  async validate(filePath: string): Promise<ValidationResult> {
    try {
      return await this.performValidation(filePath);
    } catch (error) {
      this.errorHandler.handle({
        type: "validation",
        code: "VALIDATION_FAILED",
        message: error.message,
        recoverable: true,
        context: { filePath, error }
      });
      throw error;
    }
  }
}
```

---

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)

| Task | Description | Effort |
|------|-------------|--------|
| 1.1 | Create project structure and dependencies | 4h |
| 1.2 | Implement YAML parser wrapper | 8h |
| 1.3 | Implement basic schema validator | 16h |
| 1.4 | Create error message formatter | 8h |

### Phase 2: Advanced Features (Week 2)

| Task | Description | Effort |
|------|-------------|--------|
| 2.1 | Implement depth tracking (5 levels) | 8h |
| 2.2 | Implement circular reference detection | 12h |
| 2.3 | Build pattern extractor | 16h |
| 2.4 | Create schema cache | 4h |

### Phase 3: Integration & Performance (Week 3)

| Task | Description | Effort |
|------|-------------|--------|
| 3.1 | Integrate with existing error handling | 8h |
| 3.2 | Implement parallel file processing | 8h |
| 3.3 | Performance optimization | 8h |
| 3.4 | Write integration tests | 16h |

### Phase 4: Documentation & Release (Week 4)

| Task | Description | Effort |
|------|-------------|--------|
| 4.1 | API documentation | 8h |
| 4.2 | Usage examples | 4h |
| 4.3 | Performance benchmarks | 4h |
| 4.4 | Code review and fixes | 8h |

---

## Assumptions

1. **YAML Parser Availability**: A mature YAML parsing library (e.g., js-yaml, yaml) is available and handles YAML 1.2 specification.

2. **File System Access**: The module has read access to `src/core/agents/` directory to extract existing patterns.

3. **Schema Format**: JSON Schema (draft-07 or later) semantics are acceptable for YAML validation rules.

4. **Concurrency Model**: The runtime environment supports async/await and parallel execution (Promise.all).

5. **Memory Constraints**: Each YAML file is assumed to be < 100KB, allowing in-memory validation.

6. **Character Encoding**: All YAML files use UTF-8 encoding.

7. **Reference Syntax**: Circular references use YAML anchor/alias syntax (&anchor/*alias) or JSON-schema-style $ref.

8. **Error Severity Levels**: Three severity levels (error, warning, info) are sufficient for classification.

---

## Edge Cases and Failure Modes

### Edge Cases Handled

| Edge Case | Handling Strategy |
|-----------|-------------------|
| Empty YAML file | Return warning, valid: true |
| Malformed YAML | Return parsing error with line number |
| File not found | Return system error with path |
| Schema not found | Return error, suggest schema path |
| Deeply nested (>5) | Truncate validation, return depth error |
| Very large file | Stream-based parsing, memory limits |
| Unicode in keys | Full UTF-8 support |
| Mixed indentation | Normalize during parsing |

### Failure Modes

| Failure | Recovery | User Impact |
|---------|----------|-------------|
| Schema parsing failure | Use cached schema or fallback | Degraded validation |
| Memory exhaustion | Batch size reduction | Slower processing |
| File system error | Retry with exponential backoff | Delayed results |
| Pattern extraction failure | Use minimal schema | Less precise validation |

---

## API Reference

### Primary Interface

```typescript
// Main entry point
export interface ConfigurationValidator {
  // Validate single file
  validateFile(filePath: string, options?: ValidateOptions): Promise<ValidationResult>;

  // Validate multiple files
  validateBatch(filePaths: string[], options?: ValidateOptions): Promise<ValidationResult[]>;

  // Validate directory
  validateDirectory(dirPath: string, options?: ValidateOptions): Promise<ValidationResult[]>;

  // Load custom schema
  loadSchema(schemaPath: string): Promise<Schema>;

  // Get validation statistics
  getStats(): ValidationStats;
}

export interface ValidateOptions {
  schema?: string;           // Custom schema path
  maxDepth?: number;         // Override default depth (5)
  strict?: boolean;          // Treat warnings as errors
  parallel?: boolean;        // Enable parallel processing
  timeout?: number;          // Per-file timeout (ms)
}

export interface ValidationStats {
  filesProcessed: number;
  totalErrors: number;
  totalWarnings: number;
  processingTimeMs: number;
  cacheHitRate: number;
}
```

---

## Conclusion

This design provides a robust, performant, and extensible configuration validator for the BMAD-METHOD project. The architecture separates concerns cleanly, allowing for independent testing and future enhancement. Performance targets are achievable through parallel processing and caching strategies. The error reporting system provides actionable guidance for users resolving validation issues.
