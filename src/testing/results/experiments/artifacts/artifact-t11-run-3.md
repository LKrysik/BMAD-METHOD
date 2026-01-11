# Plugin Architecture for BMAD-METHOD Extensions - Run 3

## Design Document v1.0

---

## 1. Executive Summary

Defines a plugin architecture for the BMAD-METHOD allowing users to extend the core method library without modifying core files. Supports discovery, validation, dependencies, hot-reload, conflict handling, workflow integration, and backwards compatibility.

---

## 2. Explicit Assumptions

### About Existing System

| Assumption | Rationale |
|------------|-----------|
| `methods.csv` has methods 1-150 | Stated in requirements |
| Methods have output_pattern field | Requirement #8 mentions variants |
| Workflow phases consume methods | Requirement #6 |
| Long-lived process | Requirement #4 (hot-reload) |
| CSV format for methods | File name `methods.csv` |

### Design Decisions

| Decision | Resolution |
|----------|------------|
| Plugin ID namespace | Starts at 1001 |
| Manifest format | YAML (human-readable) |
| Plugin storage | Dedicated directories |
| Architecture | Event-driven for hot-reload |

---

## 3. Architecture Overview

### Directory Structure

```
BMAD-METHOD/
├── src/core/methods.csv          # Core methods (1-150)
├── plugins/                      # Plugin installation directory
│   ├── .plugin-registry.json     # Cached plugin state
│   ├── my-custom-methods/
│   │   ├── plugin.yaml           # Plugin manifest
│   │   ├── methods.csv           # Plugin methods
│   │   └── extensions/
│   └── another-plugin/
└── config/plugins.yaml           # Plugin configuration
```

### Component Diagram

```
┌─────────────────────────────────────────┐
│           BMAD-METHOD CORE              │
├─────────────────────────────────────────┤
│  methods.csv ◄─── Method Registry ◄────┤
│     (1-150)         (Unified)           │
├─────────────────────────────────────────┤
│              Plugin Manager             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Discovery│ │Validator│ │Resolver │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Loader  │ │ Watcher │ │Lifecycle│   │
│  └─────────┘ └─────────┘ └─────────┘   │
├─────────────────────────────────────────┤
│         Plugin Registry                 │
│  [Plugin A] [Plugin B] [Plugin C]       │
│  IDs:1001+  IDs:2001+  IDs:3001+        │
└─────────────────────────────────────────┘
```

---

## 4. Plugin Manifest Schema

```yaml
plugin:
  # Required
  id: "my-custom-methods"
  name: "My Custom Methods"
  version: "1.0.0"
  method_range:
    start: 1001
    end: 1050

  # Optional metadata
  author: "Author Name"
  description: "Adds specialized methods"

  # Dependencies
  dependencies:
    core_methods: [5, 12, 45]
    plugins:
      - id: "base-extensions"
        version: ">=1.0.0"

  # Workflow
  workflow_phases: [discovery, analysis, implementation]

  # Extensions
  extends:
    - method_id: 5
      extension_file: "extensions/core-method-5-variant.yaml"

  # Policies
  conflict_policy:
    on_duplicate_id: "error"
    on_missing_dependency: "error"

  # Lifecycle
  hooks:
    on_load: "scripts/init.sh"
    on_unload: "scripts/cleanup.sh"
```

---

## 5. Method ID Allocation

```
┌─────────────────────────────────────────┐
│         METHOD ID NAMESPACE             │
├─────────────────────────────────────────┤
│  1-150      Current core (immutable)    │
│  151-850    Future core expansion       │
│  851-1000   Emergency buffer            │
│  ─────────────────────────────────────  │
│  1001-1999  Official/verified plugins   │
│  2000-4999  Community plugins           │
│  5000-9999  User/local plugins          │
│  10000+     Auto-assigned               │
└─────────────────────────────────────────┘
```

---

## 6. Lifecycle State Machine

```
DISCOVERED ──► VALIDATING ──► RESOLVING ──► LOADING
                  │              │             │
               (fail)         (fail)        (fail)
                  ▼              ▼             ▼
              INVALID      UNRESOLVED      ERRORED

LOADING ──► ACTIVE ──► RELOADING ──► ACTIVE
                │
            [unload]
                │
                ▼
            UNLOADED
```

### Lifecycle Events

| Event | Handler Actions |
|-------|-----------------|
| `plugin:discovered` | Parse manifest, validate structure |
| `plugin:validated` | Queue for dependency resolution |
| `plugin:resolved` | Check for ID conflicts |
| `plugin:ready` | Load methods into store |
| `plugin:active` | Register with workflow engine |
| `plugin:error` | Log error, maintain isolation |
| `plugin:reload` | Unload, re-validate, reload |
| `plugin:unload` | Remove methods, notify dependents |

---

## 7. Dependency Resolution

### Algorithm

```
1. BUILD dependency graph G
2. DETECT cycles → return Error if found
3. CHECK core dependencies exist
4. TOPOLOGICAL SORT
5. RETURN sorted plugins in load order
```

### Validation Rules

| Rule | Error Action |
|------|--------------|
| Core method exists | Block plugin |
| Plugin exists | Block until available |
| Version matches | Block plugin |
| No cycles | Block all cycle members |

---

## 8. Conflict Handling

### Conflict Types

| Type | Detection | Resolution |
|------|-----------|------------|
| ID Collision | Loading | First wins, second blocked |
| Name Collision | Loading | Namespace prefix |
| Extension Conflict | Loading | Merge or reject |
| Phase Conflict | Loading | Reorder by dependency |

### Prevention

- ID Range Reservation in manifest
- Global Registry tracks claimed ranges
- Pre-flight Check before loading
- Manifest Locking once active

---

## 9. Hot Reload Implementation

### File Watcher Architecture

```
File System Watcher
        │
   [file change]
        ▼
Debounce Buffer (500ms)
        │
   [debounced event]
        ▼
Change Classifier
   ├── manifest change → Full Reload
   ├── methods change  → Method-Only Reload
   └── plugin removed  → Unload Plugin
```

### Safe Reload Protocol

1. **Prepare new version** in isolation
2. **Validate** - schema and semantic checks
3. **Check active usage** - wait for operations
4. **Atomic swap** - write lock, remove old, add new
5. **Notify dependents**

### Safety Guarantees

- Atomicity: Write lock during swap
- Isolation: New version validated before swap
- Fallback: Previous version remains on failure
- No Interruption: Active operations complete first

---

## 10. Error Handling

### Error Boundary Layers

```
Layer 0: CORE SYSTEM (Protected)
         - Never crashes due to plugins

Layer 1: Plugin Manager Boundary
         - Catches all lifecycle errors
         - Circuit breaker pattern

Layer 2: Individual Plugin Sandbox
         - Each plugin isolated
         - Failed plugins disabled
```

### Error Categories

| Category | Core Impact | Resolution |
|----------|-------------|------------|
| Manifest parse error | None | Skip plugin |
| Schema validation | None | Skip plugin |
| Missing dependency | None | Disable plugin |
| Method execution error | None | Fallback behavior |
| Hot-reload failure | None | Keep previous |

### Circuit Breaker

- Threshold: 5 consecutive failures
- Opens circuit: Plugin calls blocked
- Reset timeout: 60 seconds
- Half-open: Single test call

---

## 11. Backwards Compatibility

### Guarantees

| Scenario | Behavior |
|----------|----------|
| No plugins directory | Core-only mode |
| Empty plugins directory | No warnings |
| Plugins disabled | Not scanned |
| Plugin fails | Core continues |

### Configuration

```yaml
plugins:
  enabled: true
  discovery_paths:
    - "./plugins"
    - "~/.bmad/plugins"
  disabled:
    - experimental-plugin
```

---

## 12. Implementation Roadmap

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Foundation | Week 1-2 | Schemas, Discovery, Validation |
| Core Loading | Week 3-4 | Dependencies, Conflicts, Registry |
| Hot-Reload | Week 5 | Watcher, Atomic swap, Rollback |
| Integration | Week 6 | Workflow phases, Extensions |
| Polish | Week 7-8 | CLI, Docs, Security |

---

## 13. Security Considerations

| Risk | Mitigation |
|------|------------|
| Malicious hooks | Sandboxing available |
| Core overwrites | Validation blocks 1-1000 |
| Resource exhaustion | Timeouts on operations |
| Information disclosure | Plugin isolation |

---

## 14. Summary

This architecture provides:

1. **Extensibility** - Custom methods without core changes
2. **Safety** - Plugin errors cannot crash core
3. **Flexibility** - Hot reload, dependencies, extensions
4. **Backwards Compatibility** - Works with or without plugins
5. **Robustness** - Validation, conflict detection, circuit breakers
