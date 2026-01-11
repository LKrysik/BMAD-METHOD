# Plugin Architecture for BMAD-METHOD Extensions - Run 2

## Design Document v1.0

---

## 1. Executive Summary

Defines a plugin architecture for extending the BMAD-METHOD core method library (`methods.csv`) without modifying core files. Supports plugin discovery, dependency resolution, conflict handling, hot-reloading, and maintains full backwards compatibility.

---

## 2. Assumptions

### About Existing System

| Assumption | Impact on Design |
|------------|------------------|
| `methods.csv` contains methods numbered 1-150 | Plugin methods use numbers 1001+ |
| Methods have an `output_pattern` field | Plugin extension mechanism for patterns |
| Workflow phases exist and consume methods | Plugins register phase compatibility |
| System runs as a long-lived process | File watcher implementation needed |

### Method ID Allocation

```
1-150       Core methods (immutable)
151-999     Future core expansion (reserved)
1000-9999   Community plugins
10000-99999 Enterprise/private plugins
```

---

## 3. Architecture

### High-Level Components

```
BMAD-METHOD CORE
├── methods.csv (1-150)
├── Workflow Engine
└── Method Registry (Unified)
    │
    └── Plugin Manager
        ├── Discovery Service
        ├── Validator Service
        ├── Resolver Service
        ├── Loader Service
        ├── Watcher Service
        └── Plugin Registry
            ├── Plugin A (IDs: 1001-1050)
            ├── Plugin B (IDs: 2001-2010)
            └── Plugin C (IDs: 3001-3005)
```

### Plugin Manifest (plugin.yaml)

```yaml
plugin:
  name: "advanced-analysis-pack"
  version: "1.2.0"
  method_id_range:
    start: 1001
    end: 1099
  bmad_version: ">=2.0.0"
  phases: [analyze, design, validate]
  plugin_dependencies:
    - name: "base-extensions"
      version: ">=1.0.0"
  core_dependencies: [12, 45]
  extensions:
    - extends: 23
      add_output_patterns: ["json-detailed", "xml-enterprise"]
  error_policy: "isolate"
  hot_reload:
    enabled: true
    debounce_ms: 500
```

---

## 4. Lifecycle State Machine

```
DISCOVERED → VALIDATING → RESOLVING → LOADING → ACTIVE
     │           │            │          │
     │    (fail) │     (fail) │   (fail) │
     │           ▼            ▼          ▼
     │       INVALID     UNRESOLVED   ERRORED
     │
     └──────────────────────────────────────┐
                                            │
           RELOADING ◄────────────────── ACTIVE
                │
                └─────────────► UNLOADED
```

---

## 5. Conflict Resolution

### Conflict Types

| Type | Resolution |
|------|------------|
| ID Collision | First plugin wins, second blocked |
| Name Collision | Namespace with plugin prefix |
| Extension Conflict | Merge if patterns differ, reject if same |
| Phase Conflict | Reorder based on dependency graph |

### Prevention Mechanisms

- ID Range Reservation in manifest
- Global Registry tracks claimed ranges
- Pre-flight validation before loading
- Manifest locking once active

---

## 6. Dependency Resolution Algorithm

```
1. BUILD dependency graph G
2. DETECT cycles → Error if found
3. CHECK core dependencies exist
4. TOPOLOGICAL SORT excluding unresolvable
5. RETURN sorted plugins in load order
```

---

## 7. Hot Reload Protocol

1. **Detect Change** - File watcher with debouncing
2. **Prepare New Version** - Load in isolation
3. **Validate** - Schema and semantic checks
4. **Check Active Usage** - Wait for operations to complete
5. **Atomic Swap** - Write lock, remove old, add new
6. **Notify Dependents** - Trigger dependent plugin checks

### Safety Guarantees

- **Atomicity**: Write lock during swap
- **Isolation**: New version validated before swap
- **Fallback**: Previous version remains on failure
- **No Interruption**: Active operations complete first

---

## 8. Error Handling

### Error Boundary Layers

```
Layer 0: CORE SYSTEM (Protected)
         ↓ Plugin Error Boundary
Layer 1: Plugin Manager Boundary
         ↓
Layer 2: Individual Plugin Sandbox
         [Plugin A] [Plugin B] [Plugin C]
              │         ✗         │
              │    (isolated)     │
              └───────────────────┘
```

### Circuit Breaker Pattern

- Failure threshold: 5 consecutive failures
- Circuit opens: Plugin calls blocked
- Reset timeout: 60 seconds to half-open
- Half-open: Single test call allowed

---

## 9. Schema Validation Pipeline

```
Stage 1: Structure Validation
         ├── plugin.yaml exists
         ├── methods.csv exists
         └── YAML/CSV syntax valid

Stage 2: Schema Validation
         ├── Manifest matches JSON Schema
         └── Methods match JSON Schema

Stage 3: Semantic Validation
         ├── Method IDs within declared range
         ├── No duplicate IDs within plugin
         └── Phases match declared phases

Stage 4: Compatibility Validation
         ├── BMAD version requirement met
         ├── Core dependencies exist
         └── No ID range overlap
```

---

## 10. Backwards Compatibility

### Guarantees

| Scenario | Behavior |
|----------|----------|
| No plugins directory | Core-only mode |
| Plugins disabled | Plugins not scanned |
| Plugin fails to load | Core continues |
| Core method modified | Plugin still works |

### Configuration

```yaml
plugins:
  enabled: true
  discovery_paths: [plugins/, ~/.bmad/plugins/]
  disabled: [experimental-plugin]
```

---

## 11. Implementation Phases

1. **Foundation** (Week 1-2): Registry, discovery, schema validation
2. **Core Loading** (Week 3-4): Workflow integration, dependency resolution
3. **Hot-Reload** (Week 5): File watching, atomic swap
4. **Extensions** (Week 6): Method extension system
5. **Polish** (Week 7-8): CLI, documentation, security review
