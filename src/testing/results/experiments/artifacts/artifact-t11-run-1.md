# Plugin Architecture for BMAD-METHOD Extensions - Run 1

## Design Document

### Summary

A comprehensive plugin architecture for BMAD-METHOD allowing users to add custom methods to methods.csv without modifying core files.

### Requirements Coverage

| # | Requirement | Solution |
|---|-------------|----------|
| 1 | **Plugin discovery mechanism** | Multi-location scanning with priority order: core plugins, project plugins, user plugins, environment paths. Automatic manifest validation during discovery. |
| 2 | **Method numbering integration** | Core methods reserved (1-150), plugin methods use 1001+. Number space allocated by category: official (1001-5000), community (5001-9999), project (10000-49999), user (50000+). |
| 3 | **Method dependencies** | Declarative `requires_core` and `requires_plugins` in manifest. Topological sort for load order. Circular dependency detection and rejection. |
| 4 | **Hot-reload** | File watcher system with debouncing. Atomic swap mechanism ensures no partial states. Rollback on failure keeps previous version active. |
| 5 | **Schema validation** | Four-layer validation pipeline: structural (YAML/CSV syntax), semantic (field values), relational (dependencies exist), runtime (environment ready). |
| 6 | **Workflow phase integration** | Plugins declare supported phases (verify, discover, create, plan, review). Phase-aware method selection filters by declared compatibility. |
| 7 | **Conflict handling** | Detection of number collisions, range overlaps, ID duplicates. Resolution via priority rules, explicit overrides, or user prompt. |
| 8 | **Method extensions** | Extension system supports output_pattern variants, category overrides, trigger additions. Context-aware extension selection at runtime. |
| 9 | **Backwards compatibility** | Non-plugin mode works identically. Core methods always available. Plugin failures isolated. Configuration flag to disable plugins entirely. |
| 10 | **Error isolation** | Four isolation layers: plugin loading, method execution, hot-reload, dependency resolution. Failed plugins logged but system continues. Degraded state after repeated failures. |

### Key Design Decisions

1. **Number space separation**: Core methods (1-150) are permanently reserved. Plugins must use 1001+.
2. **File-based configuration**: Plugins are defined via `plugin.yaml` manifest and `methods.csv` definitions.
3. **Unified registry pattern**: Core and plugin methods merge at runtime into a single registry.
4. **Graceful degradation**: Any plugin failure isolates to that plugin.

### Plugin Manifest Schema

```yaml
plugin:
  id: "my-plugin"
  version: "1.0.0"
  method_range:
    start: 1001
    end: 1099
  dependencies:
    core_methods: [12, 45]
    plugins: []
  phases: [analyze, design]
  error_policy: "isolate"
  hot_reload:
    enabled: true
    debounce_ms: 500
```

### Architecture Components

1. **Discovery Engine** - Scans directories for plugin manifests
2. **Schema Validator** - Validates plugin methods against JSON Schema
3. **Dependency Resolver** - Resolves and validates method dependencies
4. **Hot Reloader** - Watches filesystem, triggers reload on changes
5. **Plugin Registry** - Maintains loaded plugin state and metadata
6. **Method Store** - Unified access to core + plugin methods

### Lifecycle States

DISCOVERED → VALIDATED → RESOLVED → READY → ACTIVE → (RELOADING) → UNLOADED

### Explicit Assumptions

- Core methods.csv is read-only by plugins
- Plugins are file-based (CSV/YAML), not code-based
- Single runtime context per BMAD session
- Agent has filesystem access for plugin discovery

### Information Gaps

- Execution environment details
- State persistence requirements
- Multi-user scenarios
- Version control approach
