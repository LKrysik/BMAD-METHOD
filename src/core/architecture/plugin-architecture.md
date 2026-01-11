# BMAD-METHOD Plugin Architecture

## Version 1.0 | Design Document

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Assumptions and Prerequisites](#assumptions-and-prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Plugin Structure and Schema](#plugin-structure-and-schema)
5. [Plugin Discovery Mechanism](#plugin-discovery-mechanism)
6. [Method Numbering and Integration](#method-numbering-and-integration)
7. [Dependency Resolution](#dependency-resolution)
8. [Hot-Reload System](#hot-reload-system)
9. [Validation and Schema Enforcement](#validation-and-schema-enforcement)
10. [Workflow Phase Integration](#workflow-phase-integration)
11. [Conflict Detection and Resolution](#conflict-detection-and-resolution)
12. [Method Extension System](#method-extension-system)
13. [Backwards Compatibility](#backwards-compatibility)
14. [Error Isolation and Fault Tolerance](#error-isolation-and-fault-tolerance)
15. [Plugin Lifecycle](#plugin-lifecycle)
16. [Implementation Guidance](#implementation-guidance)
17. [Edge Cases and Failure Modes](#edge-cases-and-failure-modes)

---

## Executive Summary

This document defines the plugin architecture for BMAD-METHOD, enabling users to extend the core methods.csv (currently methods 1-150) with custom methods without modifying core files. The architecture provides:

- **Discovery**: Automatic scanning of designated directories for plugin method files
- **Integration**: Seamless integration with existing method numbering (1-150 reserved for core)
- **Dependencies**: Declarative dependency system between plugin and core methods
- **Hot-Reload**: Runtime loading/unloading without system restart
- **Validation**: Schema enforcement before method activation
- **Compatibility**: Full backwards compatibility with non-plugin usage
- **Isolation**: Plugin errors cannot crash the core system

---

## Assumptions and Prerequisites

### Explicit Assumptions

1. **Core methods.csv is read-only**: Plugins never modify `src/core/methods/methods.csv`
2. **Method numbers 1-150 are reserved**: Core methods occupy this range permanently
3. **Plugin methods use numbers 1001+**: Prevents collision with future core expansion
4. **File-based configuration**: Plugins are defined in CSV/YAML files, not code
5. **Single runtime context**: One active method registry per BMAD session
6. **Agent-executed validation**: Validation runs within agent context, not external tools
7. **Filesystem access**: Plugin discovery requires read access to plugin directories

### Prerequisites

1. Core BMAD-METHOD installation is functional
2. `src/core/methods/methods.csv` exists and follows current schema
3. Plugin directory structure is writable by the installation process
4. Agent has capability to read filesystem and parse CSV/YAML

### Information Gaps (Requiring Clarification)

1. **Execution environment**: Is this CLI-based, IDE extension, or web-based?
2. **State persistence**: How should plugin state persist across sessions?
3. **Multi-user scenarios**: Do multiple users share plugin registrations?
4. **Version control**: Should plugins be git-tracked or user-local?

---

## Architecture Overview

### System Diagram

```
+------------------------------------------------------------------+
|                     BMAD-METHOD RUNTIME                          |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------------+     +---------------------------+          |
|  |   CORE REGISTRY   |     |    PLUGIN REGISTRY        |          |
|  |   methods.csv     |     |    (merged view)          |          |
|  |   [1-150]         |     |    [1001+]                |          |
|  +-------------------+     +---------------------------+          |
|           |                           |                           |
|           +-------------+-------------+                           |
|                         |                                         |
|                         v                                         |
|              +---------------------+                              |
|              |  UNIFIED METHOD     |                              |
|              |     REGISTRY        |                              |
|              |  (runtime merged)   |                              |
|              +---------------------+                              |
|                         |                                         |
|           +-------------+-------------+                           |
|           |             |             |                           |
|           v             v             v                           |
|     +---------+   +---------+   +---------+                       |
|     |Workflow |   |Workflow |   |Workflow |                       |
|     | Phase 1 |   | Phase 2 |   | Phase N |                       |
|     +---------+   +---------+   +---------+                       |
|                                                                   |
+------------------------------------------------------------------+
          ^                                    ^
          |                                    |
+------------------+              +------------------------+
| PLUGIN DISCOVERY |              | HOT-RELOAD CONTROLLER  |
|                  |              |                        |
| - Dir scanning   |              | - File watchers        |
| - Schema valid.  |              | - Registry refresh     |
| - Dependency res.|              | - Conflict detection   |
+------------------+              +------------------------+
          ^
          |
+------------------------------------------------------------------+
|                    PLUGIN DIRECTORIES                            |
|                                                                   |
|  +----------------+  +----------------+  +----------------+       |
|  | plugins/       |  | .bmad-plugins/ |  | custom-dir/    |       |
|  | official/      |  | user-local/    |  | (configured)   |       |
|  +----------------+  +----------------+  +----------------+       |
|                                                                   |
+------------------------------------------------------------------+
```

### Core Components

| Component | Responsibility |
|-----------|----------------|
| **Core Registry** | Immutable store of methods 1-150 |
| **Plugin Registry** | Mutable store of plugin methods 1001+ |
| **Unified Registry** | Runtime merge of core + plugins |
| **Plugin Discovery** | Scans directories, validates, loads plugins |
| **Hot-Reload Controller** | Watches files, triggers refresh |
| **Dependency Resolver** | Validates and orders method dependencies |
| **Conflict Detector** | Identifies and handles method collisions |

---

## Plugin Structure and Schema

### Plugin Manifest File

Each plugin must include a `plugin.yaml` manifest:

```yaml
# plugin.yaml - Plugin Manifest Schema v1.0

# REQUIRED FIELDS
plugin:
  id: "security-methods"           # Unique identifier (kebab-case)
  name: "Advanced Security Methods"
  version: "1.0.0"                 # SemVer format
  author: "Author Name"
  description: "Security-focused verification methods"

  # Method number range claimed by this plugin
  method_range:
    start: 1001                    # Must be >= 1001
    end: 1020                      # Inclusive upper bound

  # Core methods this plugin requires
  requires_core:
    - 26                           # Red Team vs Blue Team
    - 39                           # Security Audit Personas
    - 61                           # Pre-mortem Analysis

# OPTIONAL FIELDS

  # Other plugins this plugin depends on
  requires_plugins:
    - id: "risk-methods"
      version: ">=1.0.0"

  # Categories this plugin adds
  categories:
    - "security"
    - "compliance"

  # Workflow phases this plugin supports
  workflow_phases:
    - "verify"
    - "discover"

  # Extension declarations
  extends:
    - method: 26                   # Extends core method #26
      type: "output_pattern"       # What it extends

  # Compatibility
  bmad_version: ">=2.0.0"

  # Lifecycle hooks (file paths relative to plugin root)
  hooks:
    on_load: "hooks/on-load.md"
    on_unload: "hooks/on-unload.md"
    on_activate: "hooks/on-activate.md"
```

### Plugin Methods File

Plugin methods are defined in `methods.csv` within the plugin directory:

```csv
num,category,method_name,description,output_pattern
1001,security,Threat Modeling Session,"[TRIGGER]: Use when... [STEPS]: (1)...",threats -> mitigations -> residual risk
1002,security,Compliance Checklist Audit,"[TRIGGER]: Use when...",requirements -> checks -> gaps
```

**Schema Rules:**

| Field | Type | Constraints |
|-------|------|-------------|
| num | integer | >= 1001, unique across all plugins |
| category | string | Alphanumeric + hyphen, max 32 chars |
| method_name | string | Max 64 chars, no commas |
| description | string | Must contain [TRIGGER], [STEPS], [KEY QUESTION] |
| output_pattern | string | Arrow-delimited stages |

### Directory Structure

```
plugins/
  security-methods/
    plugin.yaml              # Manifest (required)
    methods.csv              # Method definitions (required)
    extensions/              # Optional: method extensions
      output-patterns/
        method-26-variant.yaml
    hooks/                   # Optional: lifecycle hooks
      on-load.md
    docs/                    # Optional: documentation
      README.md
```

---

## Plugin Discovery Mechanism

### Discovery Locations

Plugins are discovered in the following locations (priority order):

| Priority | Location | Type | Description |
|----------|----------|------|-------------|
| 1 | `src/core/plugins/` | Built-in | Official BMAD plugins |
| 2 | `{project-root}/plugins/` | Project | Project-specific plugins |
| 3 | `{user-home}/.bmad/plugins/` | User | User-global plugins |
| 4 | `$BMAD_PLUGIN_PATH` | Environment | Custom paths (colon-separated) |

### Discovery Algorithm

```
FUNCTION discover_plugins():
    discovered = []

    FOR each location IN priority_order:
        IF location.exists():
            FOR each subdirectory IN location:
                IF subdirectory.contains("plugin.yaml"):
                    manifest = parse_yaml(subdirectory/"plugin.yaml")

                    IF validate_manifest(manifest):
                        plugin = {
                            path: subdirectory,
                            manifest: manifest,
                            methods: null,  # Lazy load
                            status: "discovered"
                        }
                        discovered.append(plugin)
                    ELSE:
                        log_warning("Invalid manifest", subdirectory)

    RETURN discovered
```

### Discovery Events

| Event | Trigger | Action |
|-------|---------|--------|
| `plugin:discovered` | Valid manifest found | Add to pending registry |
| `plugin:invalid` | Schema validation fails | Log error, skip plugin |
| `plugin:conflict` | Duplicate ID detected | Use priority rules |

---

## Method Numbering and Integration

### Number Space Allocation

```
+------------------+------------------------+----------------------+
|     Range        |        Owner           |      Purpose         |
+------------------+------------------------+----------------------+
|      1 - 150     |   Core BMAD-METHOD     | Reserved core methods|
|    151 - 500     |   Future Core          | Reserved for growth  |
|    501 - 1000    |   Reserved             | Future use           |
|   1001 - 5000    |   Official Plugins     | Curated extensions   |
|   5001 - 9999    |   Community Plugins    | Third-party methods  |
|  10000 - 49999   |   Project Plugins      | Project-specific     |
|  50000 - 99999   |   User Plugins         | User-local methods   |
+------------------+------------------------+----------------------+
```

### Method Reference Resolution

When a workflow references a method by number:

```
FUNCTION resolve_method(method_ref):
    # Parse reference (supports #26, 26, or "26")
    num = parse_method_number(method_ref)

    # Check unified registry
    IF unified_registry.has(num):
        method = unified_registry.get(num)

        # Check if method is available (dependencies met)
        IF method.status == "active":
            RETURN method
        ELSE:
            RETURN error("Method unavailable", method.status_reason)

    # Not found
    RETURN error("Unknown method", num)
```

### Aliasing System

Plugins can define aliases for easier reference:

```yaml
# In plugin.yaml
aliases:
  - alias: "threat-model"
    target: 1001
  - alias: "TM"
    target: 1001
```

Usage in workflows: `#threat-model` or `#TM` resolves to method 1001.

---

## Dependency Resolution

### Dependency Types

| Type | Syntax | Description |
|------|--------|-------------|
| Core method | `requires_core: [26, 39]` | Plugin needs core methods |
| Plugin method | `requires_plugins: [{id, version}]` | Plugin needs other plugins |
| Soft dependency | `suggests: [1002]` | Optional enhancement |

### Resolution Algorithm

```
FUNCTION resolve_dependencies(plugins):
    # Build dependency graph
    graph = build_dependency_graph(plugins)

    # Check for cycles
    IF has_cycles(graph):
        cycles = find_cycles(graph)
        RETURN error("Circular dependency", cycles)

    # Topological sort for load order
    load_order = topological_sort(graph)

    # Validate all dependencies are satisfiable
    FOR plugin IN load_order:
        FOR dep IN plugin.dependencies:
            IF NOT is_satisfiable(dep, load_order):
                IF dep.type == "required":
                    plugin.status = "blocked"
                    plugin.status_reason = f"Missing: {dep}"
                ELSE:
                    log_warning(f"Optional dep missing: {dep}")

    RETURN load_order
```

### Dependency Graph Visualization

```
Core Methods (1-150)
    |
    +---> Plugin: security-methods (1001-1020)
    |         requires: core [26, 39, 61]
    |         |
    |         +---> Plugin: compliance-methods (1021-1040)
    |                   requires: security-methods >=1.0.0
    |
    +---> Plugin: risk-methods (1041-1060)
              requires: core [61, 62, 63]
```

### Version Matching

Plugin version constraints follow SemVer:

| Constraint | Meaning |
|------------|---------|
| `1.0.0` | Exact version |
| `>=1.0.0` | Minimum version |
| `^1.0.0` | Compatible (1.x.x) |
| `~1.0.0` | Approximately (1.0.x) |
| `>=1.0.0 <2.0.0` | Range |

---

## Hot-Reload System

### File Watching

```
FUNCTION initialize_hot_reload():
    watcher = create_file_watcher()

    FOR each plugin_location IN discovery_locations:
        watcher.watch(plugin_location, {
            events: ["create", "modify", "delete"],
            patterns: ["plugin.yaml", "methods.csv", "extensions/**"],
            debounce: 500ms
        })

    watcher.on_change(handle_plugin_change)
```

### Reload Events

| File Changed | Action |
|--------------|--------|
| `plugin.yaml` | Full plugin reload |
| `methods.csv` | Method definitions reload |
| `extensions/*` | Extension reload only |
| Directory deleted | Plugin unload |
| New directory | Plugin discovery |

### Safe Reload Protocol

```
FUNCTION handle_plugin_change(event):
    plugin_id = identify_plugin(event.path)

    # Phase 1: Validate new state
    new_manifest = parse_yaml(event.path.parent/"plugin.yaml")
    IF NOT validate_manifest(new_manifest):
        log_error("Invalid manifest after change", plugin_id)
        RETURN  # Keep old version active

    new_methods = parse_csv(event.path.parent/"methods.csv")
    IF NOT validate_methods(new_methods):
        log_error("Invalid methods after change", plugin_id)
        RETURN  # Keep old version active

    # Phase 2: Check for conflicts with other plugins
    conflicts = check_conflicts(new_methods, excluding=plugin_id)
    IF conflicts:
        log_error("Conflicts detected", conflicts)
        RETURN  # Keep old version active

    # Phase 3: Atomic swap
    old_plugin = plugin_registry.get(plugin_id)

    TRY:
        # Remove old methods from unified registry
        FOR method IN old_plugin.methods:
            unified_registry.remove(method.num)

        # Add new methods
        FOR method IN new_methods:
            unified_registry.add(method.num, method)

        # Update plugin registry
        plugin_registry.set(plugin_id, {
            manifest: new_manifest,
            methods: new_methods,
            status: "active",
            loaded_at: now()
        })

        emit("plugin:reloaded", plugin_id)

    CATCH error:
        # Rollback
        FOR method IN old_plugin.methods:
            unified_registry.add(method.num, method)

        log_error("Reload failed, rolled back", error)
```

### Reload Notification

Active workflows receive notification when methods change:

```
EVENT: method:changed
DATA: {
    plugin_id: "security-methods",
    affected_methods: [1001, 1002, 1003],
    change_type: "modified" | "added" | "removed"
}
```

Workflows can:
1. Continue with cached method definitions
2. Refresh method definitions mid-workflow
3. Notify user of changes

---

## Validation and Schema Enforcement

### Validation Layers

```
+----------------------------------------------------------+
|                    VALIDATION PIPELINE                    |
+----------------------------------------------------------+
|                                                           |
|  Layer 1: STRUCTURAL VALIDATION                          |
|  - YAML/CSV syntax valid                                 |
|  - Required fields present                               |
|  - Field types correct                                   |
|                                                           |
|  Layer 2: SEMANTIC VALIDATION                            |
|  - Method numbers in valid range                         |
|  - Description contains required sections                |
|  - Category names follow conventions                     |
|                                                           |
|  Layer 3: RELATIONAL VALIDATION                          |
|  - Dependencies exist and are satisfiable                |
|  - Method numbers unique across all plugins              |
|  - Extensions reference valid base methods               |
|                                                           |
|  Layer 4: RUNTIME VALIDATION                             |
|  - Methods executable in current environment             |
|  - Required resources available                          |
|  - Version compatibility confirmed                       |
|                                                           |
+----------------------------------------------------------+
```

### Method Description Schema

Each method description MUST contain:

```
[TRIGGER]: <when to use condition>
[STEPS]: <numbered steps (1), (2), ...>
[FORCED]: <mandatory constraint>
[KEY QUESTION]: <core question this method answers>
[ANTI-PATTERN]: <what to avoid>
```

### Validation Rules

| Rule ID | Scope | Check | Severity |
|---------|-------|-------|----------|
| V001 | Manifest | plugin.id is unique | ERROR |
| V002 | Manifest | version is valid SemVer | ERROR |
| V003 | Manifest | method_range.start >= 1001 | ERROR |
| V004 | Manifest | method_range does not overlap others | ERROR |
| V005 | Methods | num within declared range | ERROR |
| V006 | Methods | description has [TRIGGER] | ERROR |
| V007 | Methods | description has [STEPS] | ERROR |
| V008 | Methods | description has [KEY QUESTION] | WARNING |
| V009 | Methods | output_pattern follows format | WARNING |
| V010 | Methods | category matches declared list | WARNING |

### Validation Report Format

```yaml
validation_report:
  plugin_id: "security-methods"
  timestamp: "2026-01-11T10:30:00Z"
  status: "passed" | "failed" | "warnings"

  errors: []

  warnings:
    - rule: "V009"
      location: "methods.csv:line 5"
      message: "output_pattern missing arrow separator"

  info:
    methods_validated: 20
    extensions_validated: 3
```

---

## Workflow Phase Integration

### Supported Phases

Plugins declare which workflow phases their methods support:

| Phase | Description | Typical Methods |
|-------|-------------|-----------------|
| `discover` | Finding concerns and areas to explore | Exploration, research methods |
| `verify` | Validating and checking work | Sanity, coherence methods |
| `create` | Generating new content | Creative, synthesis methods |
| `plan` | Strategic planning | Risk, planning methods |
| `review` | Retrospective analysis | Meta, protocol methods |

### Phase Registration

```yaml
# In plugin.yaml
workflow_phases:
  - phase: "verify"
    methods: [1001, 1002, 1003]

  - phase: "discover"
    methods: [1001, 1004]
```

### Phase-Aware Method Selection

```
FUNCTION get_methods_for_phase(phase, content_type):
    available = []

    # Core methods for phase
    FOR method IN core_registry:
        IF method.supports_phase(phase):
            available.append(method)

    # Plugin methods for phase
    FOR plugin IN plugin_registry:
        IF plugin.status == "active":
            FOR method IN plugin.methods:
                IF method.supports_phase(phase):
                    available.append(method)

    # Filter by content type if applicable
    IF content_type:
        available = filter(available, lambda m: m.supports_type(content_type))

    RETURN available
```

### Workflow Integration Points

```
Deep Verify Workflow:
  Step 2 (Discovery)  ---> get_methods_for_phase("discover")
  Step 3 (Methods)    ---> get_methods_for_phase("verify")
  Step 4 (Verify)     ---> unified_registry.get(method_num)

Brainstorming Workflow:
  Technique Selection ---> get_methods_for_phase("create")
  Execution          ---> unified_registry.get(method_num)
```

---

## Conflict Detection and Resolution

### Conflict Types

| Type | Description | Resolution Strategy |
|------|-------------|---------------------|
| **Number Collision** | Two plugins claim same method number | Priority-based, reject later |
| **Range Overlap** | Plugin ranges intersect | Reject overlapping plugin |
| **ID Duplicate** | Same plugin.id registered | Priority-based, reject later |
| **Alias Collision** | Same alias in multiple plugins | First-registered wins |
| **Extension Conflict** | Multiple extensions for same method | Merge or user choice |

### Detection Algorithm

```
FUNCTION detect_conflicts(pending_plugins):
    conflicts = []

    # Check against core methods
    FOR plugin IN pending_plugins:
        FOR method IN plugin.methods:
            IF core_registry.has(method.num):
                conflicts.append({
                    type: "core_collision",
                    plugin: plugin.id,
                    method: method.num,
                    severity: "error"
                })

    # Check between plugins
    method_claims = {}
    FOR plugin IN pending_plugins:
        FOR method IN plugin.methods:
            IF method.num IN method_claims:
                conflicts.append({
                    type: "plugin_collision",
                    plugins: [method_claims[method.num], plugin.id],
                    method: method.num,
                    severity: "error"
                })
            ELSE:
                method_claims[method.num] = plugin.id

    # Check range overlaps
    FOR i, p1 IN enumerate(pending_plugins):
        FOR p2 IN pending_plugins[i+1:]:
            IF ranges_overlap(p1.method_range, p2.method_range):
                conflicts.append({
                    type: "range_overlap",
                    plugins: [p1.id, p2.id],
                    ranges: [p1.method_range, p2.method_range],
                    severity: "error"
                })

    RETURN conflicts
```

### Resolution Strategies

**Strategy 1: Priority-Based (Default)**

```
Priority order:
1. Core methods (always win)
2. Built-in plugins (src/core/plugins/)
3. Project plugins (project/plugins/)
4. User plugins (~/.bmad/plugins/)
5. Environment plugins ($BMAD_PLUGIN_PATH)
```

**Strategy 2: Explicit Override**

```yaml
# In project bmad-config.yaml
plugin_overrides:
  - conflict: "method:1005"
    winner: "security-methods"
    reason: "Project requires security variant"
```

**Strategy 3: User Prompt**

For interactive sessions, prompt user to resolve:

```
CONFLICT DETECTED:
Method #1005 claimed by multiple plugins:
  [1] security-methods v1.0.0 (project plugin)
  [2] audit-methods v2.1.0 (user plugin)

Choose winner: [1/2/skip]
```

---

## Method Extension System

### Extension Types

| Extension Type | Purpose | Example |
|----------------|---------|---------|
| **output_pattern** | Add variant output patterns | Alternative visualization |
| **category_override** | Assign method to additional category | Cross-categorization |
| **trigger_addition** | Add new trigger conditions | Extended use cases |
| **step_augmentation** | Add optional steps | Enhanced workflow |

### Extension File Format

```yaml
# extensions/output-patterns/method-26-variant.yaml

extension:
  type: "output_pattern"
  base_method: 26                    # Core method being extended
  plugin_id: "security-methods"

  # The extension data
  pattern:
    name: "compliance-focused"
    format: "vulnerabilities -> controls -> compliance_status -> remediation_plan"
    description: "Variant output for compliance-driven security review"

  # When to suggest this variant
  triggers:
    - content_contains: "compliance"
    - content_contains: "regulation"
    - workflow_phase: "verify"
```

### Extension Registry

```
FUNCTION register_extensions(plugin):
    FOR extension_file IN plugin.path/"extensions"/**/*.yaml:
        extension = parse_yaml(extension_file)

        # Validate base method exists
        base = unified_registry.get(extension.base_method)
        IF NOT base:
            log_error("Extension references unknown method", extension)
            CONTINUE

        # Register extension
        extension_registry.add({
            id: f"{plugin.id}:{extension.type}:{base.num}",
            plugin: plugin.id,
            base_method: extension.base_method,
            type: extension.type,
            data: extension
        })
```

### Using Extensions in Workflows

```
FUNCTION get_method_with_extensions(method_num, context):
    base_method = unified_registry.get(method_num)
    extensions = extension_registry.get_for_method(method_num)

    IF NOT extensions:
        RETURN base_method

    # Find applicable extensions based on context
    applicable = []
    FOR ext IN extensions:
        IF ext.triggers_match(context):
            applicable.append(ext)

    IF NOT applicable:
        RETURN base_method

    # Return method with applicable extensions
    RETURN {
        ...base_method,
        extensions: applicable,
        output_patterns: [base_method.output_pattern] +
                        [e.pattern for e in applicable if e.type == "output_pattern"]
    }
```

---

## Backwards Compatibility

### Compatibility Guarantees

| Scenario | Behavior |
|----------|----------|
| No plugins installed | System works exactly as before |
| Core methods only used | No change in behavior |
| Plugin fails to load | Core system continues, warning logged |
| Plugin has invalid methods | Plugin rejected, core unaffected |
| Method reference not found | Clear error, system stable |

### Non-Plugin Mode

When plugins are disabled or unavailable:

```
FUNCTION initialize_registry(mode):
    IF mode == "core-only" OR no_plugins_found():
        unified_registry = copy(core_registry)
        log_info("Running in core-only mode")
        RETURN

    # Normal plugin loading
    ...
```

### Configuration Flag

```yaml
# bmad-config.yaml

plugins:
  enabled: true | false       # Master switch
  safe_mode: false           # If true, only load signed plugins
  discovery_paths: []        # Additional search paths
  disabled_plugins: []       # Explicitly disabled plugin IDs
```

### Method Reference Compatibility

All existing method references continue to work:

```
# All these resolve correctly:
#26                          # Numeric
#Red Team vs Blue Team       # By name (if unique)
method:26                    # Explicit prefix
core:26                      # Explicit core reference
```

---

## Error Isolation and Fault Tolerance

### Error Boundaries

```
+---------------------------------------------------------------+
|                     ERROR ISOLATION LAYERS                     |
+---------------------------------------------------------------+
|                                                                |
|  Layer 1: Plugin Loading                                       |
|  - Parse errors isolated per plugin                            |
|  - One plugin failure doesn't block others                     |
|  - Failed plugins logged but skipped                           |
|                                                                |
|  Layer 2: Method Execution                                     |
|  - Method errors caught and reported                           |
|  - Workflow continues with error noted                         |
|  - Fallback to core method if available                        |
|                                                                |
|  Layer 3: Hot-Reload                                           |
|  - Reload failures keep old version                            |
|  - Atomic swap prevents partial states                         |
|  - File watcher errors don't crash system                      |
|                                                                |
|  Layer 4: Dependency Resolution                                |
|  - Missing dependencies disable dependent plugin               |
|  - Core always available regardless of plugin state            |
|  - Circular dependencies detected and rejected                 |
|                                                                |
+---------------------------------------------------------------+
```

### Error Handling Patterns

**Plugin Load Error:**

```
TRY:
    load_plugin(plugin_path)
CATCH ParseError as e:
    log_error("Plugin manifest invalid", plugin_path, e)
    plugin.status = "load_failed"
    plugin.error = e.message
    # Continue loading other plugins
CATCH ValidationError as e:
    log_error("Plugin validation failed", plugin_path, e)
    plugin.status = "validation_failed"
    plugin.error = e.message
    # Continue loading other plugins
```

**Method Execution Error:**

```
FUNCTION execute_method_safe(method_num, context):
    TRY:
        method = unified_registry.get(method_num)
        IF NOT method:
            RETURN error("Method not found", method_num)

        RETURN method.execute(context)

    CATCH ExecutionError as e:
        log_error("Method execution failed", method_num, e)

        # If this is a plugin method, try core fallback
        IF method_num >= 1001:
            suggested_core = find_similar_core_method(method_num)
            IF suggested_core:
                RETURN {
                    error: e.message,
                    suggestion: f"Try core method #{suggested_core} instead"
                }

        RETURN {error: e.message, method: method_num}
```

### Recovery Procedures

| Failure | Recovery |
|---------|----------|
| All plugins fail to load | Fall back to core-only mode |
| Plugin crashes during execution | Mark plugin as "degraded", skip in future |
| Circular dependency detected | Disable cycle participants, load others |
| Hot-reload fails | Keep previous version, log warning |
| File watcher crash | Restart watcher, re-scan all plugins |

---

## Plugin Lifecycle

### States

```
                    +-------------+
                    |  DISCOVERED |
                    +-------------+
                           |
                           v
                    +-------------+
               +--->|  VALIDATING |<---+
               |    +-------------+    |
               |           |           |
               |   +-------+-------+   |
               |   |               |   |
               v   v               v   |
        +----------+         +-----------+
        |  INVALID |         |  LOADING  |
        +----------+         +-----------+
                                   |
                                   v
                            +-------------+
                       +--->|   ACTIVE    |<---+
                       |    +-------------+    |
                       |           |           |
                       |   +-------+-------+   |
                       |   |               |   |
                       v   v               v   |
                +-----------+       +-----------+
                | RELOADING |       | DEGRADED  |
                +-----------+       +-----------+
                                          |
                                          v
                                   +-------------+
                                   |  DISABLED   |
                                   +-------------+
                                          |
                                          v
                                   +-------------+
                                   |  UNLOADED   |
                                   +-------------+
```

### Lifecycle Events

| State Transition | Event | Description |
|-----------------|-------|-------------|
| -> DISCOVERED | `plugin:discovered` | Plugin directory found |
| DISCOVERED -> VALIDATING | `plugin:validating` | Schema check starting |
| VALIDATING -> INVALID | `plugin:invalid` | Validation failed |
| VALIDATING -> LOADING | `plugin:loading` | Validation passed, loading |
| LOADING -> ACTIVE | `plugin:activated` | Plugin ready for use |
| ACTIVE -> RELOADING | `plugin:reloading` | Hot-reload triggered |
| RELOADING -> ACTIVE | `plugin:reloaded` | Reload successful |
| ACTIVE -> DEGRADED | `plugin:degraded` | Errors during operation |
| DEGRADED -> DISABLED | `plugin:disabled` | Too many errors |
| * -> UNLOADED | `plugin:unloaded` | Plugin removed |

### Lifecycle Hooks

Plugins can define hooks executed at state transitions:

```yaml
# plugin.yaml
hooks:
  on_load: "hooks/on-load.md"
  on_unload: "hooks/on-unload.md"
  on_activate: "hooks/on-activate.md"
  on_error: "hooks/on-error.md"
```

Hook file format (executed by agent):

```markdown
# On Load Hook

## Context Available
- `plugin.id`: This plugin's identifier
- `plugin.version`: Current version
- `plugin.path`: Plugin directory path

## Actions
1. Verify any external dependencies are available
2. Log activation message
3. Initialize any runtime state

## Output
Report: success | failure with reason
```

---

## Implementation Guidance

### Phase 1: Core Infrastructure

**Priority: Critical**

1. **Create Plugin Registry Module**
   - Location: `src/core/plugins/registry/`
   - Core registry wrapper (read-only view of methods.csv)
   - Plugin registry (mutable)
   - Unified registry (merged view)

2. **Implement Discovery Service**
   - Location: `src/core/plugins/discovery/`
   - Directory scanner
   - Manifest parser
   - Schema validator

3. **Define Plugin Schema**
   - Location: `src/core/plugins/schemas/`
   - plugin.yaml JSON Schema
   - methods.csv validation rules

### Phase 2: Integration

**Priority: High**

4. **Modify Workflow Methods Loading**
   - Update workflows to use unified registry
   - Add method source tracking (core vs plugin)
   - Implement phase filtering

5. **Build Dependency Resolver**
   - Topological sort for load order
   - Version constraint matching
   - Cycle detection

6. **Create Conflict Detector**
   - Number collision detection
   - Range overlap detection
   - Resolution strategy implementation

### Phase 3: Advanced Features

**Priority: Medium**

7. **Hot-Reload System**
   - File watcher setup
   - Atomic swap mechanism
   - Rollback on failure

8. **Extension System**
   - Extension registry
   - Output pattern variants
   - Context-aware extension selection

9. **CLI Integration**
   - `bmad plugins list`
   - `bmad plugins validate <path>`
   - `bmad plugins enable/disable <id>`

### Phase 4: Polish

**Priority: Low**

10. **Documentation Generator**
    - Auto-generate docs from plugin methods
    - Include in method reference

11. **Plugin Marketplace Structure**
    - Define sharing format
    - Version compatibility matrix

### Estimated Effort

| Phase | Components | Effort |
|-------|------------|--------|
| Phase 1 | Registry, Discovery, Schema | 2-3 weeks |
| Phase 2 | Integration, Dependencies, Conflicts | 2 weeks |
| Phase 3 | Hot-Reload, Extensions, CLI | 2-3 weeks |
| Phase 4 | Docs, Marketplace | 1-2 weeks |

---

## Edge Cases and Failure Modes

### Edge Cases

| Case | Handling |
|------|----------|
| Empty plugin directory | Skip with info log |
| Plugin with 0 methods | Valid, may only provide extensions |
| Plugin references future core methods | Block until core updated |
| Very large method numbers (99999+) | Warn but allow |
| Unicode in method names | Allow, validate display |
| Plugin depends on itself | Reject circular dependency |
| Plugin extends non-existent method | Reject extension, load rest |
| Two plugins extend same method | Merge extensions, document order |
| Method description too short | Warning, allow load |
| Plugin version downgrade during reload | Allow with warning |

### Failure Modes

| Failure | Detection | Mitigation |
|---------|-----------|------------|
| Corrupt plugin.yaml | Parse error | Skip plugin, log error |
| Missing methods.csv | File not found | Skip plugin, log error |
| Disk full during reload | Write error | Keep old version |
| Manifest schema evolves | Version mismatch | Provide migration script |
| Agent loses context mid-validation | Incomplete state | Require fresh validation |
| Network plugin path unavailable | Timeout | Skip path, continue others |
| Concurrent plugin modifications | Race condition | Lock during operations |
| System crash during atomic swap | Partial state | Recovery on next start |

### Recovery Procedures

**Corrupt Registry State:**
```
1. Detect corruption via checksum
2. Clear unified registry
3. Reload from core
4. Re-discover all plugins
5. Log recovered plugins
```

**Plugin Causing Repeated Failures:**
```
1. Track failure count per plugin
2. After N failures, set status = DEGRADED
3. After M more failures, set status = DISABLED
4. Require manual re-enable
```

---

## Appendix A: Example Plugin

### security-methods Plugin

**Directory Structure:**
```
plugins/security-methods/
  plugin.yaml
  methods.csv
  extensions/
    output-patterns/
      red-team-compliance.yaml
  docs/
    README.md
```

**plugin.yaml:**
```yaml
plugin:
  id: "security-methods"
  name: "Advanced Security Verification Methods"
  version: "1.0.0"
  author: "BMAD Security Team"
  description: "Security-focused methods for threat modeling, penetration testing simulation, and compliance verification"

  method_range:
    start: 1001
    end: 1010

  requires_core:
    - 26   # Red Team vs Blue Team
    - 39   # Security Audit Personas
    - 61   # Pre-mortem Analysis

  categories:
    - "security"
    - "compliance"

  workflow_phases:
    - phase: "verify"
      methods: [1001, 1002, 1003, 1004, 1005]
    - phase: "discover"
      methods: [1001, 1006]

  extends:
    - method: 26
      type: "output_pattern"

  bmad_version: ">=2.0.0"
```

**methods.csv:**
```csv
num,category,method_name,description,output_pattern
1001,security,Threat Modeling Session,"[TRIGGER]: Use when identifying security threats in a system design. [STEPS]: (1) Define trust boundaries (2) Identify assets worth protecting (3) Enumerate threat actors and motivations (4) Apply STRIDE per component (5) Rate threats by risk (6) Define mitigations. [FORCED]: Must identify at least one threat per trust boundary crossing. [KEY QUESTION]: What could go wrong and how likely is it? [ANTI-PATTERN]: Listing threats without considering attacker motivation or capability.",trust boundaries -> threats -> risk rating -> mitigations
1002,security,Penetration Test Simulation,"[TRIGGER]: Use when validating security controls through attack simulation. [STEPS]: (1) Define scope and rules of engagement (2) Reconnaissance phase (3) Vulnerability identification (4) Exploitation attempts (5) Post-exploitation analysis (6) Report findings with evidence. [FORCED]: Must attempt to exploit identified vulnerabilities not just list them. [KEY QUESTION]: Can an attacker actually exploit this? [ANTI-PATTERN]: Theoretical vulnerabilities without exploitation proof.",scope -> reconnaissance -> vulnerabilities -> exploitation -> findings
1003,compliance,Compliance Gap Analysis,"[TRIGGER]: Use when assessing adherence to regulatory requirements. [STEPS]: (1) Identify applicable regulations (2) Map requirements to controls (3) Assess control implementation status (4) Identify gaps (5) Prioritize remediation (6) Document compliance posture. [FORCED]: Each requirement must have evidence of compliance or documented gap. [KEY QUESTION]: Are we compliant and can we prove it? [ANTI-PATTERN]: Claiming compliance without evidence.",regulations -> controls -> gaps -> evidence -> remediation plan
```

**extensions/output-patterns/red-team-compliance.yaml:**
```yaml
extension:
  type: "output_pattern"
  base_method: 26
  plugin_id: "security-methods"

  pattern:
    name: "compliance-focused"
    format: "attack vectors -> control effectiveness -> compliance impact -> remediation priority"
    description: "Variant output emphasizing compliance implications of security findings"

  triggers:
    - content_contains: "compliance"
    - content_contains: "regulation"
    - content_contains: "audit"
```

---

## Appendix B: Configuration Reference

### bmad-config.yaml Plugin Section

```yaml
plugins:
  # Enable/disable plugin system
  enabled: true

  # Only load plugins with valid signatures
  safe_mode: false

  # Additional discovery paths
  discovery_paths:
    - "/shared/team-plugins"
    - "${TEAM_PLUGINS_PATH}"

  # Explicitly disabled plugins
  disabled_plugins:
    - "deprecated-methods"

  # Conflict resolution overrides
  overrides:
    - conflict: "method:1005"
      winner: "security-methods"

  # Hot-reload settings
  hot_reload:
    enabled: true
    debounce_ms: 500

  # Error handling
  error_tolerance:
    max_failures_before_degraded: 3
    max_failures_before_disabled: 10
```

---

## Appendix C: CLI Commands Reference

```bash
# List all discovered plugins
bmad plugins list
bmad plugins list --status active
bmad plugins list --format json

# Validate a plugin
bmad plugins validate ./my-plugin/
bmad plugins validate ./my-plugin/ --strict

# Enable/disable plugins
bmad plugins enable security-methods
bmad plugins disable deprecated-methods

# Show plugin details
bmad plugins info security-methods
bmad plugins info security-methods --methods

# Create new plugin scaffold
bmad plugins create my-new-plugin
bmad plugins create my-new-plugin --range 5001-5010

# Check for conflicts
bmad plugins check-conflicts
bmad plugins check-conflicts --verbose

# Reload plugins
bmad plugins reload
bmad plugins reload security-methods
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-11 | Architecture Team | Initial design document |

---

*This architecture document addresses all 10 requirements specified in Task 11. Implementation should proceed in phases as outlined in the Implementation Guidance section.*
