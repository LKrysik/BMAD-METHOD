# Plugin Architecture for BMAD-METHOD Extensions

**Document Version:** 1.0
**Date:** 2026-01-11
**Status:** Design Document
**Author:** Architecture Team

---

## Executive Summary

This document defines a comprehensive plugin architecture for the BMAD-METHOD system that allows users to extend the core method library (methods.csv, currently methods 1-150) without modifying core files. The architecture addresses plugin discovery, method numbering integration, dependency management, hot-reload capabilities, schema validation, workflow integration, conflict handling, method extension, backwards compatibility, and error isolation.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Plugin Discovery Mechanism](#plugin-discovery-mechanism)
3. [Method Numbering Strategy](#method-numbering-strategy)
4. [Dependency Resolution](#dependency-resolution)
5. [Hot-Reload System](#hot-reload-system)
6. [Schema Validation](#schema-validation)
7. [Workflow Integration](#workflow-integration)
8. [Conflict Resolution](#conflict-resolution)
9. [Method Extension](#method-extension)
10. [Backwards Compatibility](#backwards-compatibility)
11. [Error Isolation](#error-isolation)
12. [Plugin Lifecycle](#plugin-lifecycle)
13. [Implementation Guidance](#implementation-guidance)
14. [Edge Cases and Failure Modes](#edge-cases-and-failure-modes)
15. [Assumptions and Dependencies](#assumptions-and-dependencies)

---

## 1. Architecture Overview

### 1.1 Design Principles

1. **Non-Invasive:** Plugins extend without modifying core system files
2. **Isolated:** Plugin failures do not crash the core system
3. **Discoverable:** Automatic discovery with explicit registration fallback
4. **Composable:** Plugins can depend on core and other plugins
5. **Transparent:** Plugin methods appear seamlessly alongside core methods
6. **Hot-Reloadable:** Changes take effect without system restart
7. **Schema-Enforced:** All plugins validated against method schema
8. **Conflict-Aware:** Clear resolution strategy for overlapping definitions

### 1.2 System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    BMAD-METHOD System                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐          ┌──────────────────┐          │
│  │  Core Methods   │          │  Plugin Registry │          │
│  │  (1-150)        │◄─────────┤  - Discovery     │          │
│  │  methods.csv    │          │  - Validation    │          │
│  └─────────────────┘          │  - Loading       │          │
│          ▲                    │  - Conflict Res  │          │
│          │                    └──────────────────┘          │
│          │                             ▲                     │
│  ┌───────┴──────────┐                 │                     │
│  │ Unified Method   │                 │                     │
│  │ Provider         │◄────────────────┘                     │
│  │ - Merging        │                                        │
│  │ - Dependency Res │                                        │
│  │ - Hot Reload     │                                        │
│  └──────────────────┘                                        │
│          ▲                                                    │
│          │                                                    │
│  ┌───────┴──────────┐                                        │
│  │  Workflow Engine │                                        │
│  │  - Method Lookup │                                        │
│  │  - Validation    │                                        │
│  └──────────────────┘                                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Plugin Directories:
  {project-root}/_bmad/plugins/
  {user-home}/.bmad/plugins/
  {system}/bmad/plugins/
```

---

## 2. Plugin Discovery Mechanism

### 2.1 Discovery Locations

Plugins are discovered from multiple locations in priority order:

1. **Project-level:** `{project-root}/_bmad/plugins/`
2. **User-level:** `{user-home}/.bmad/plugins/`
3. **System-level:** `{system}/bmad/plugins/` (OS-dependent)

**Priority Rule:** Project-level > User-level > System-level

### 2.2 Plugin Directory Structure

Each plugin follows this structure:

```
{plugin-root}/
├── plugin.yaml              # Plugin manifest (required)
├── methods.csv              # Plugin methods (required)
├── README.md                # Documentation (recommended)
├── examples/                # Usage examples (optional)
│   └── example-workflow.md
└── tests/                   # Plugin tests (optional)
    └── validation-tests.md
```

### 2.3 Plugin Manifest (plugin.yaml)

```yaml
# Plugin identity
name: "domain-specific-methods"
version: "1.0.0"
author: "Plugin Author"
description: "Domain-specific extension methods for X domain"

# Plugin metadata
bmad_version_min: "1.0.0"     # Minimum BMAD version required
bmad_version_max: "2.0.0"     # Maximum BMAD version supported (optional)

# Method numbering
method_range:
  start: 1000                  # Plugin methods start at 1000
  end: 1050                    # Plugin methods end at 1050

# Dependencies
dependencies:
  core_methods: [1, 5, 10, 72] # Core methods this plugin requires
  plugins: []                  # Other plugins required (name@version)

# Extension declarations
extends:
  - method_num: 46            # Extending SCAMPER method
    extension_type: "output_pattern_variant"
    description: "Add domain-specific SCAMPER patterns"

# Configuration
config:
  enabled: true               # Plugin enabled by default
  hot_reload: true            # Support hot reload
  priority: 100               # Loading priority (higher = first)

# Tags for discovery
tags:
  - "creative"
  - "domain-specific"
  - "innovation"
```

### 2.4 Discovery Algorithm

```python
def discover_plugins():
    """
    Discovers plugins from all configured locations.
    Returns: List of discovered plugin manifests with metadata
    """
    discovered = []

    # Scan locations in priority order
    for location in [project_plugins, user_plugins, system_plugins]:
        if not exists(location):
            continue

        # Find all plugin.yaml files
        for plugin_dir in list_subdirectories(location):
            manifest_path = join(plugin_dir, "plugin.yaml")

            if not exists(manifest_path):
                log_warning(f"Skipping {plugin_dir}: No plugin.yaml found")
                continue

            try:
                manifest = parse_yaml(manifest_path)
                manifest['_path'] = plugin_dir
                manifest['_location_priority'] = get_priority(location)

                # Basic validation
                validate_manifest_structure(manifest)

                discovered.append(manifest)

            except Exception as e:
                log_error(f"Failed to load plugin {plugin_dir}: {e}")
                # Continue discovery - don't fail entire process
                continue

    return sort_by_priority(discovered)
```

### 2.5 Discovery Triggers

Plugin discovery occurs at:

1. **System Startup:** Full discovery and loading
2. **Manual Trigger:** User command `bmad plugins refresh`
3. **File Watch:** Automatic when plugin.yaml changes (if hot-reload enabled)
4. **Explicit Load:** User command `bmad plugins load <plugin-name>`

---

## 3. Method Numbering Strategy

### 3.1 Number Space Allocation

**Core Methods:** 1-150 (reserved)
**Plugin Methods:** 151+ (available for plugins)

**Recommended Ranges:**
- 151-999: General community plugins
- 1000-9999: Domain-specific plugins
- 10000+: Experimental or temporary methods

### 3.2 Number Assignment Strategies

Plugins can use one of three strategies:

#### Strategy A: Fixed Range (Recommended)

Plugin declares a fixed range in plugin.yaml:

```yaml
method_range:
  start: 1000
  end: 1050
```

**Pros:** Stable, predictable, no runtime conflicts
**Cons:** Requires coordination between plugin authors

#### Strategy B: Dynamic Assignment

Plugin methods use symbolic IDs that are dynamically assigned at load time:

```yaml
method_range:
  strategy: "dynamic"
  requested_count: 50
```

Plugin methods.csv uses symbolic IDs:
```csv
num,category,method_name,description,output_pattern
@PLUGIN_1,creative,New Method,...,...
@PLUGIN_2,creative,Another Method,...,...
```

**Pros:** No coordination needed, auto-conflict avoidance
**Cons:** Numbers change between sessions, harder to reference

#### Strategy C: Hybrid Approach (Best Practice)

Plugin declares preferred range with fallback to dynamic:

```yaml
method_range:
  preferred_start: 1000
  preferred_end: 1050
  fallback: "dynamic"
```

**Pros:** Stable when possible, resilient to conflicts
**Cons:** Slightly more complex implementation

### 3.3 Number Collision Detection

```python
def detect_collisions(loaded_methods, new_plugin):
    """
    Detects if new plugin's method numbers collide with existing methods.
    Returns: List of collision descriptors
    """
    collisions = []

    new_range = range(new_plugin.method_range.start,
                     new_plugin.method_range.end + 1)

    for method_num in new_range:
        if method_num in loaded_methods:
            existing = loaded_methods[method_num]
            collisions.append({
                'method_num': method_num,
                'existing_plugin': existing.plugin_name,
                'new_plugin': new_plugin.name,
                'severity': 'error'
            })

    return collisions
```

### 3.4 Global Method Registry

The system maintains a global registry mapping method numbers to providers:

```python
class MethodRegistry:
    def __init__(self):
        self.methods = {}          # num -> Method object
        self.providers = {}        # num -> provider (core|plugin_name)
        self.extensions = {}       # num -> [Extension objects]
        self.dependencies = {}     # num -> [dependency nums]

    def register_method(self, method, provider):
        """Register a method from core or plugin"""
        if method.num in self.methods:
            raise ConflictError(f"Method {method.num} already registered")

        self.methods[method.num] = method
        self.providers[method.num] = provider

    def get_method(self, num):
        """Retrieve method with all extensions applied"""
        base = self.methods.get(num)
        if not base:
            return None

        # Apply extensions
        if num in self.extensions:
            for ext in self.extensions[num]:
                base = apply_extension(base, ext)

        return base
```

---

## 4. Dependency Resolution

### 4.1 Dependency Types

1. **Core Method Dependency:** Plugin method requires core method
2. **Plugin Method Dependency:** Plugin method requires another plugin method
3. **Plugin Dependency:** Plugin requires entire other plugin
4. **Version Dependency:** Dependency on specific BMAD version

### 4.2 Dependency Declaration

In plugin.yaml:

```yaml
dependencies:
  # Core methods this plugin requires
  core_methods: [1, 5, 10, 72]

  # Other plugins required (with version constraints)
  plugins:
    - name: "base-research-methods"
      version: ">=1.0.0,<2.0.0"
      required: true
    - name: "optional-helpers"
      version: "*"
      required: false

  # Specific BMAD system version
  bmad_version:
    min: "1.0.0"
    max: "2.0.0"
```

In methods.csv, individual methods can declare dependencies:

```csv
num,category,method_name,description,output_pattern,requires
1001,advanced,Meta-Analysis,"...",analysis → synthesis,"1,5,72"
```

### 4.3 Dependency Resolution Algorithm

```python
def resolve_dependencies(plugins):
    """
    Resolves plugin dependencies using topological sort.
    Returns: Ordered list of plugins to load, or raises DependencyError
    """
    # Build dependency graph
    graph = {}
    for plugin in plugins:
        graph[plugin.name] = {
            'plugin': plugin,
            'depends_on': set(plugin.dependencies.plugins)
        }

    # Topological sort (Kahn's algorithm)
    sorted_plugins = []
    no_deps = [p for p in plugins if not p.dependencies.plugins]

    while no_deps:
        current = no_deps.pop(0)
        sorted_plugins.append(current)

        # Remove edges
        for plugin in plugins:
            if current.name in graph[plugin.name]['depends_on']:
                graph[plugin.name]['depends_on'].remove(current.name)
                if not graph[plugin.name]['depends_on']:
                    no_deps.append(plugin)

    # Check for cycles
    if len(sorted_plugins) != len(plugins):
        remaining = [p.name for p in plugins if p not in sorted_plugins]
        raise DependencyError(f"Circular dependency detected: {remaining}")

    return sorted_plugins
```

### 4.4 Missing Dependency Handling

When a required dependency is missing:

1. **Hard Dependency:** Plugin fails to load, error logged, system continues
2. **Soft Dependency:** Plugin loads with reduced functionality, warning logged
3. **Optional Dependency:** Plugin loads normally, info logged

```python
def validate_dependencies(plugin, loaded_plugins, core_methods):
    """
    Validates all plugin dependencies are satisfied.
    Returns: (is_valid, errors, warnings)
    """
    errors = []
    warnings = []

    # Check core method dependencies
    for method_num in plugin.dependencies.core_methods:
        if method_num not in core_methods:
            errors.append(f"Missing core method: {method_num}")

    # Check plugin dependencies
    for dep in plugin.dependencies.plugins:
        if dep.required and dep.name not in loaded_plugins:
            errors.append(f"Missing required plugin: {dep.name}")
        elif not dep.required and dep.name not in loaded_plugins:
            warnings.append(f"Missing optional plugin: {dep.name}")

    # Check version compatibility
    if not is_version_compatible(plugin.bmad_version_min, BMAD_VERSION):
        errors.append(f"BMAD version {BMAD_VERSION} < required {plugin.bmad_version_min}")

    return (len(errors) == 0, errors, warnings)
```

### 4.5 Dependency Graph Visualization

System provides command to visualize dependencies:

```bash
bmad plugins deps --graph

Output:
core-methods
├── plugin-a (v1.0.0)
│   └── plugin-c (v2.1.0)
└── plugin-b (v1.5.0)
    └── plugin-c (v2.1.0)
```

---

## 5. Hot-Reload System

### 5.1 Hot-Reload Architecture

Hot-reload allows plugin changes to take effect without restarting the system.

**Supported Changes:**
- Method additions/removals
- Method property updates
- Plugin configuration changes
- Extension additions

**Unsupported Changes (Require Restart):**
- Core method modifications
- Dependency graph structure changes
- Plugin manifest schema changes

### 5.2 File Watching

```python
class PluginWatcher:
    def __init__(self, registry):
        self.registry = registry
        self.watchers = {}

    def watch_plugin(self, plugin):
        """Start watching plugin directory for changes"""
        if not plugin.config.hot_reload:
            return

        watcher = FileWatcher(plugin._path)
        watcher.on_change('plugin.yaml', self.on_manifest_change)
        watcher.on_change('methods.csv', self.on_methods_change)
        watcher.start()

        self.watchers[plugin.name] = watcher

    def on_manifest_change(self, plugin_name, file_path):
        """Handle plugin.yaml changes"""
        try:
            # Reload manifest
            new_manifest = parse_yaml(file_path)

            # Validate changes
            validate_manifest_structure(new_manifest)

            # Reload plugin
            self.registry.reload_plugin(plugin_name, new_manifest)

            log_info(f"Hot-reloaded plugin: {plugin_name}")

        except Exception as e:
            log_error(f"Hot-reload failed for {plugin_name}: {e}")
            # Keep existing plugin loaded

    def on_methods_change(self, plugin_name, file_path):
        """Handle methods.csv changes"""
        try:
            # Parse new methods
            new_methods = parse_methods_csv(file_path)

            # Validate schema
            validate_methods_schema(new_methods)

            # Update registry
            self.registry.update_plugin_methods(plugin_name, new_methods)

            log_info(f"Hot-reloaded methods for: {plugin_name}")

        except Exception as e:
            log_error(f"Hot-reload failed for {plugin_name}: {e}")
            # Keep existing methods loaded
```

### 5.3 Graceful Reload Strategy

```python
def reload_plugin(self, plugin_name, new_manifest):
    """
    Gracefully reload a plugin with transactional semantics.
    """
    # Step 1: Prepare new plugin state
    try:
        new_plugin = load_plugin(new_manifest)
        validate_plugin(new_plugin)
    except Exception as e:
        raise ReloadError(f"Failed to prepare new plugin: {e}")

    # Step 2: Check for conflicts
    conflicts = detect_conflicts(new_plugin, exclude=plugin_name)
    if conflicts:
        raise ReloadError(f"Reload would cause conflicts: {conflicts}")

    # Step 3: Create transaction checkpoint
    checkpoint = self.create_checkpoint()

    try:
        # Step 4: Unload old plugin
        self.unload_plugin(plugin_name)

        # Step 5: Load new plugin
        self.load_plugin(new_plugin)

        # Step 6: Commit transaction
        self.commit_checkpoint(checkpoint)

    except Exception as e:
        # Step 7: Rollback on failure
        self.rollback_checkpoint(checkpoint)
        raise ReloadError(f"Reload failed, rolled back: {e}")
```

### 5.4 Reload Notifications

When a plugin is hot-reloaded:

1. **Event Emitted:** `plugin.reloaded` event with plugin name and changes
2. **Workflows Notified:** Active workflows using reloaded methods receive notification
3. **Cache Invalidation:** Method cache cleared for affected methods
4. **User Notification:** Optional user notification based on config

---

## 6. Schema Validation

### 6.1 Method Schema Definition

All methods (core and plugin) must conform to this schema:

```yaml
method_schema:
  required_fields:
    - num: integer (unique identifier)
    - category: string (from allowed categories)
    - method_name: string (unique within plugin)
    - description: string (formatted as per spec)
    - output_pattern: string (pattern notation)

  optional_fields:
    - requires: string (comma-separated method numbers)
    - tags: string (comma-separated tags)
    - version: string (semantic version)
    - deprecated: boolean
    - replacement: integer (replacement method num)

  description_format:
    pattern: |
      [TRIGGER]: ... [STEPS]: ... [FORCED]: ...
      [KEY QUESTION]: ... [ANTI-PATTERN]: ...

  allowed_categories:
    - collaboration
    - advanced
    - competitive
    - technical
    - creative
    - research
    - risk
    - core
    - sanity
    - coherence
    - exploration
    - epistemology
    - challenge
    - meta
    - protocol
```

### 6.2 Validation Implementation

```python
class MethodValidator:
    def __init__(self, schema):
        self.schema = schema

    def validate_method(self, method, context):
        """
        Validates a single method against schema.
        Returns: (is_valid, errors, warnings)
        """
        errors = []
        warnings = []

        # Check required fields
        for field in self.schema.required_fields:
            if not hasattr(method, field.name):
                errors.append(f"Missing required field: {field.name}")
            elif not self.validate_field_type(method, field):
                errors.append(f"Invalid type for {field.name}")

        # Validate field contents
        if method.category not in self.schema.allowed_categories:
            errors.append(f"Invalid category: {method.category}")

        # Validate description format
        if not self.validate_description(method.description):
            warnings.append("Description does not follow recommended format")

        # Validate uniqueness
        if context.has_method_num(method.num):
            errors.append(f"Duplicate method number: {method.num}")

        if context.has_method_name(method.method_name, method.plugin):
            errors.append(f"Duplicate method name: {method.method_name}")

        # Validate dependencies
        if hasattr(method, 'requires'):
            for dep_num in parse_requires(method.requires):
                if not context.has_method_num(dep_num):
                    errors.append(f"Unknown dependency: {dep_num}")

        return (len(errors) == 0, errors, warnings)

    def validate_description(self, description):
        """Check if description follows recommended format"""
        required_sections = ['TRIGGER', 'STEPS', 'FORCED',
                           'KEY QUESTION', 'ANTI-PATTERN']
        return all(section in description for section in required_sections)
```

### 6.3 Validation Stages

Validation occurs at multiple stages:

1. **Pre-Load:** Before plugin is loaded into registry
2. **Load-Time:** During plugin loading process
3. **Runtime:** When method is actually invoked
4. **Hot-Reload:** When plugin is reloaded

```python
def load_plugin_with_validation(plugin_manifest):
    """
    Load plugin with multi-stage validation.
    """
    # Stage 1: Pre-load validation (fast checks)
    validator = MethodValidator(METHOD_SCHEMA)

    methods = parse_methods_csv(plugin_manifest.methods_csv_path)

    pre_errors = []
    for method in methods:
        is_valid, errors, warnings = validator.validate_method(
            method,
            context=PreLoadContext()
        )
        if not is_valid:
            pre_errors.extend(errors)
        for warning in warnings:
            log_warning(f"{plugin_manifest.name}: {warning}")

    if pre_errors:
        raise ValidationError(f"Pre-load validation failed: {pre_errors}")

    # Stage 2: Load-time validation (with full context)
    loaded_plugin = Plugin(plugin_manifest, methods)

    load_errors = []
    for method in loaded_plugin.methods:
        is_valid, errors, warnings = validator.validate_method(
            method,
            context=LoadContext(global_registry)
        )
        if not is_valid:
            load_errors.extend(errors)

    if load_errors:
        raise ValidationError(f"Load-time validation failed: {load_errors}")

    return loaded_plugin
```

### 6.4 Custom Validation Rules

Plugins can define custom validation rules:

```yaml
# In plugin.yaml
validation:
  custom_rules:
    - name: "domain_specific_check"
      script: "./validation/domain_check.py"
      stage: "pre_load"
    - name: "integration_test"
      script: "./validation/integration.py"
      stage: "post_load"
```

---

## 7. Workflow Integration

### 7.1 Workflow Method Discovery

Workflows must seamlessly discover and use both core and plugin methods.

**Transparent Integration:** Workflows should not need to distinguish between core and plugin methods.

```python
class WorkflowMethodProvider:
    def __init__(self, registry):
        self.registry = registry

    def get_method(self, num):
        """
        Get method by number (transparent to source).
        """
        return self.registry.get_method(num)

    def get_methods_by_category(self, category):
        """
        Get all methods in a category (core + plugins).
        """
        return self.registry.get_methods_by_category(category)

    def search_methods(self, query):
        """
        Search methods by name, description, or tags.
        """
        return self.registry.search(query)

    def get_method_with_context(self, num, workflow_context):
        """
        Get method with workflow-specific context applied.
        This allows plugins to customize behavior per workflow.
        """
        method = self.registry.get_method(num)

        # Apply workflow-specific extensions
        for ext in method.get_extensions():
            if ext.applies_to_workflow(workflow_context):
                method = ext.apply(method, workflow_context)

        return method
```

### 7.2 Method Loading in Workflows

Current workflows reference methods by number. This continues to work:

```markdown
## Step 2: Analysis

Use method 72 (First Principles Analysis) to break down the problem.

[Load method 72 from registry - works for core or plugin methods]
```

Enhanced workflows can use semantic references:

```markdown
## Step 2: Analysis

Use the "First Principles Analysis" method to break down the problem.

[Registry resolves name to number, loads method]
```

### 7.3 Plugin-Aware Workflow Templates

Workflows can query available methods:

```markdown
## Step: Select Analysis Method

Available analysis methods:
{% for method in get_methods_by_category("analysis") %}
- [{{ method.num }}] {{ method.method_name }}
{% endfor %}

Select a method: _____
```

This automatically includes plugin methods in the "analysis" category.

### 7.4 Workflow Phase Compatibility

Plugin methods declare which workflow phases they support:

```yaml
# In plugin.yaml or as CSV column
method_metadata:
  1001:
    compatible_phases:
      - "analysis"
      - "research"
      - "validation"
    incompatible_phases:
      - "implementation"  # This method doesn't apply to implementation
```

Workflows can filter methods by phase compatibility:

```python
def get_methods_for_phase(phase_name):
    """Get methods compatible with workflow phase"""
    all_methods = registry.get_all_methods()
    return [m for m in all_methods
            if phase_name in m.compatible_phases]
```

---

## 8. Conflict Resolution

### 8.1 Conflict Types

1. **Number Collision:** Two plugins use same method number
2. **Name Collision:** Two plugins use same method name
3. **Extension Collision:** Multiple plugins extend same method differently
4. **Priority Conflict:** Plugins have same priority value

### 8.2 Conflict Detection

```python
class ConflictDetector:
    def detect_all_conflicts(self, plugins):
        """
        Detect all types of conflicts between plugins.
        Returns: List of Conflict objects
        """
        conflicts = []

        # Number collisions
        number_map = {}
        for plugin in plugins:
            for method in plugin.methods:
                if method.num in number_map:
                    conflicts.append(NumberCollision(
                        method_num=method.num,
                        plugin_a=number_map[method.num],
                        plugin_b=plugin.name
                    ))
                else:
                    number_map[method.num] = plugin.name

        # Name collisions (within same namespace)
        name_map = {}
        for plugin in plugins:
            for method in plugin.methods:
                key = (method.category, method.method_name)
                if key in name_map:
                    conflicts.append(NameCollision(
                        method_name=method.method_name,
                        category=method.category,
                        plugin_a=name_map[key],
                        plugin_b=plugin.name
                    ))
                else:
                    name_map[key] = plugin.name

        # Extension collisions
        extension_map = {}
        for plugin in plugins:
            for ext in plugin.extensions:
                key = (ext.method_num, ext.extension_type)
                if key in extension_map:
                    conflicts.append(ExtensionCollision(
                        method_num=ext.method_num,
                        extension_type=ext.extension_type,
                        plugin_a=extension_map[key],
                        plugin_b=plugin.name
                    ))
                else:
                    extension_map[key] = plugin.name

        return conflicts
```

### 8.3 Conflict Resolution Strategies

#### Strategy 1: Priority-Based Resolution

Plugins have priority values (higher = wins):

```yaml
# In plugin.yaml
config:
  priority: 100  # Higher priority wins conflicts
```

```python
def resolve_by_priority(conflict):
    """Resolve conflict using priority values"""
    plugin_a_priority = get_plugin_priority(conflict.plugin_a)
    plugin_b_priority = get_plugin_priority(conflict.plugin_b)

    if plugin_a_priority > plugin_b_priority:
        winner = conflict.plugin_a
        loser = conflict.plugin_b
    elif plugin_b_priority > plugin_a_priority:
        winner = conflict.plugin_b
        loser = conflict.plugin_a
    else:
        # Equal priority - use location priority
        winner = resolve_by_location(conflict)
        loser = conflict.plugin_a if winner == conflict.plugin_b else conflict.plugin_b

    return ConflictResolution(
        conflict=conflict,
        winner=winner,
        loser=loser,
        strategy="priority"
    )
```

#### Strategy 2: Location-Based Resolution

Project plugins > User plugins > System plugins

```python
def resolve_by_location(conflict):
    """Resolve conflict using plugin location"""
    location_a = get_plugin_location(conflict.plugin_a)
    location_b = get_plugin_location(conflict.plugin_b)

    priority_order = ['project', 'user', 'system']

    if priority_order.index(location_a) < priority_order.index(location_b):
        return conflict.plugin_a
    else:
        return conflict.plugin_b
```

#### Strategy 3: Explicit Configuration

User can explicitly configure conflict resolution:

```yaml
# In {project-root}/_bmad/config.yaml
plugin_conflicts:
  method_1001:
    winner: "plugin-a"
    reason: "Plugin A has better implementation"

  method_1005:
    winner: "plugin-b"
    reason: "Plugin B is more recent"
```

#### Strategy 4: Namespacing (Avoid Conflicts)

Plugins can use namespaced names to avoid conflicts:

```csv
num,category,method_name,description,output_pattern
1001,creative,DomainX::Ideation,...,...
1002,creative,DomainX::Validation,...,...
```

Access via namespace: `get_method("DomainX::Ideation")`

### 8.4 Conflict Resolution Protocol

```python
def resolve_conflicts(conflicts, resolution_config):
    """
    Apply conflict resolution protocol.
    Returns: List of resolutions
    """
    resolutions = []

    for conflict in conflicts:
        # Strategy 1: Check explicit configuration
        if conflict.id in resolution_config:
            resolution = apply_explicit_config(conflict, resolution_config)

        # Strategy 2: Check priority
        elif has_priority_difference(conflict):
            resolution = resolve_by_priority(conflict)

        # Strategy 3: Use location priority
        else:
            resolution = resolve_by_location(conflict)

        # Log resolution
        log_warning(f"Conflict resolved: {conflict} -> Winner: {resolution.winner}")

        resolutions.append(resolution)

    return resolutions
```

### 8.5 User Notification

When conflicts are detected and resolved:

1. **Warning Level:** Log warning with conflict details
2. **User Prompt:** Optionally prompt user to confirm resolution
3. **Report Generation:** Generate conflict report file
4. **Suggestion:** Suggest fixes to plugin authors

```bash
bmad plugins check

Output:
⚠ Conflicts Detected:

1. Number Collision: Method 1001
   - plugin-a (priority: 100, location: project)
   - plugin-b (priority: 50, location: user)
   → Resolved: plugin-a wins (higher priority)

2. Extension Collision: Method 46 (output_pattern extension)
   - plugin-c (priority: 100, location: project)
   - plugin-d (priority: 100, location: project)
   → Resolved: plugin-c wins (location alphabetical)
   ⚠ Suggestion: Use explicit config to override

Run 'bmad plugins fix-conflicts' for guided resolution.
```

---

## 9. Method Extension

### 9.1 Extension Types

Plugins can extend existing methods in several ways:

1. **Output Pattern Variants:** Add alternative output patterns
2. **Description Enhancements:** Add domain-specific guidance
3. **Step Additions:** Add optional steps to method
4. **Example Additions:** Add domain-specific examples
5. **Metadata Additions:** Add tags, categories, or attributes

### 9.2 Extension Declaration

```yaml
# In plugin.yaml
extends:
  - method_num: 46                    # Extending SCAMPER Method
    extension_type: "output_pattern_variant"
    description: "Domain-specific SCAMPER patterns for software architecture"
    priority: 100
```

```csv
# In plugin's methods.csv (special extension rows)
extends,46,output_pattern,architecture → components → interfaces → deployment
extends,46,example,"Example: Using SCAMPER for microservices design..."
extends,72,description,"[DOMAIN CONTEXT]: In software architecture..."
```

### 9.3 Extension Application

```python
class MethodExtension:
    def __init__(self, method_num, extension_type, data, plugin_name):
        self.method_num = method_num
        self.extension_type = extension_type
        self.data = data
        self.plugin_name = plugin_name

    def apply(self, base_method):
        """Apply this extension to base method"""
        if self.extension_type == "output_pattern_variant":
            return self.add_output_pattern_variant(base_method)
        elif self.extension_type == "description_enhancement":
            return self.enhance_description(base_method)
        elif self.extension_type == "example":
            return self.add_example(base_method)
        else:
            raise ValueError(f"Unknown extension type: {self.extension_type}")

    def add_output_pattern_variant(self, method):
        """Add alternative output pattern"""
        extended = method.copy()

        if not hasattr(extended, 'output_pattern_variants'):
            extended.output_pattern_variants = [extended.output_pattern]

        extended.output_pattern_variants.append({
            'pattern': self.data,
            'source': self.plugin_name,
            'description': f"Variant from {self.plugin_name}"
        })

        return extended

    def enhance_description(self, method):
        """Enhance description with additional context"""
        extended = method.copy()

        if not hasattr(extended, 'description_enhancements'):
            extended.description_enhancements = []

        extended.description_enhancements.append({
            'content': self.data,
            'source': self.plugin_name
        })

        return extended
```

### 9.4 Multi-Extension Composition

When multiple plugins extend the same method:

```python
def compose_extensions(base_method, extensions):
    """
    Compose multiple extensions onto base method.
    Extensions are applied in priority order.
    """
    # Sort by priority (high to low)
    sorted_exts = sorted(extensions,
                        key=lambda e: e.priority,
                        reverse=True)

    result = base_method.copy()

    for ext in sorted_exts:
        result = ext.apply(result)

    return result
```

### 9.5 Extension Visibility

Users can see which extensions are applied:

```bash
bmad method info 46

Output:
Method 46: SCAMPER Method
Category: creative
Description: [TRIGGER]: Use when systematic ideation...

Extensions Applied:
  1. Output Pattern Variant (from plugin-architecture)
     → architecture → components → interfaces → deployment

  2. Example Addition (from plugin-software-design)
     → "Example: Using SCAMPER for microservices..."

  3. Description Enhancement (from plugin-domain-x)
     → "[DOMAIN CONTEXT]: In domain X..."

View base method: bmad method info 46 --no-extensions
```

---

## 10. Backwards Compatibility

### 10.1 Compatibility Requirements

1. **Existing Workflows:** Must work without modification
2. **Core Methods:** Must remain unchanged in behavior
3. **Method Numbers:** Core 1-150 reserved permanently
4. **CSV Format:** Core methods.csv format preserved
5. **No Breaking Changes:** Plugin system is additive only

### 10.2 Graceful Degradation

System operates correctly when:

- No plugins installed
- All plugins disabled
- Plugin directory doesn't exist
- Plugin loading fails

```python
class PluginRegistry:
    def __init__(self, core_methods):
        self.core_methods = core_methods
        self.plugins = {}
        self.fallback_mode = False

    def load_plugins(self):
        """Load plugins with fallback to core-only mode"""
        try:
            discovered = discover_plugins()

            for plugin_manifest in discovered:
                try:
                    plugin = load_plugin(plugin_manifest)
                    self.plugins[plugin.name] = plugin
                except Exception as e:
                    log_error(f"Failed to load plugin {plugin_manifest.name}: {e}")
                    # Continue with other plugins

            log_info(f"Loaded {len(self.plugins)} plugins successfully")

        except Exception as e:
            log_error(f"Plugin discovery failed: {e}")
            log_warning("Falling back to core-only mode")
            self.fallback_mode = True

    def get_method(self, num):
        """Get method with fallback"""
        # Always check core first for 1-150
        if 1 <= num <= 150:
            return self.core_methods.get(num)

        # Check plugins
        if not self.fallback_mode:
            for plugin in self.plugins.values():
                method = plugin.get_method(num)
                if method:
                    return method

        return None
```

### 10.3 Version Compatibility

Plugins declare version compatibility:

```yaml
bmad_version_min: "1.0.0"
bmad_version_max: "2.0.0"
```

System checks compatibility:

```python
def is_plugin_compatible(plugin, bmad_version):
    """Check if plugin is compatible with current BMAD version"""
    from packaging import version

    current = version.parse(bmad_version)
    min_version = version.parse(plugin.bmad_version_min)

    if current < min_version:
        return False, f"BMAD {bmad_version} < required {plugin.bmad_version_min}"

    if plugin.bmad_version_max:
        max_version = version.parse(plugin.bmad_version_max)
        if current >= max_version:
            return False, f"BMAD {bmad_version} >= max {plugin.bmad_version_max}"

    return True, "Compatible"
```

### 10.4 Feature Flags

Plugins can check for feature availability:

```python
# In plugin code
if registry.has_feature('hot_reload'):
    enable_hot_reload()
else:
    log_info("Hot reload not available in this BMAD version")
```

### 10.5 Migration Support

When introducing breaking changes, provide migration:

```bash
bmad plugins migrate --from 1.0 --to 2.0

Output:
Migrating plugin configurations...
✓ Updated plugin-a: priority field moved to config section
✓ Updated plugin-b: method_range syntax changed
⚠ Manual action required for plugin-c: See migration guide

Migration complete. Review changes and commit.
```

---

## 11. Error Isolation

### 11.1 Error Boundaries

Plugin errors must not crash core system.

**Isolation Principles:**
1. Plugin load errors are logged, system continues
2. Plugin method errors are caught, method fails gracefully
3. Plugin validation errors prevent loading, don't crash system
4. Plugin hot-reload errors preserve old version

### 11.2 Try-Catch Boundaries

```python
class IsolatedPluginLoader:
    def load_plugin(self, manifest):
        """Load plugin with error isolation"""
        try:
            # Parse manifest
            plugin = Plugin(manifest)

            # Validate
            is_valid, errors, warnings = self.validator.validate(plugin)
            if not is_valid:
                raise ValidationError(errors)

            # Load methods
            plugin.load_methods()

            # Register
            self.registry.register_plugin(plugin)

            return plugin

        except ValidationError as e:
            log_error(f"Validation failed for {manifest.name}: {e}")
            self.report_error(manifest.name, 'validation', e)
            return None

        except FileNotFoundError as e:
            log_error(f"Plugin files missing for {manifest.name}: {e}")
            self.report_error(manifest.name, 'missing_files', e)
            return None

        except Exception as e:
            log_error(f"Unexpected error loading {manifest.name}: {e}")
            self.report_error(manifest.name, 'unknown', e)
            return None

    def report_error(self, plugin_name, error_type, error):
        """Report error without crashing"""
        error_report = {
            'plugin': plugin_name,
            'type': error_type,
            'message': str(error),
            'timestamp': now(),
            'bmad_version': BMAD_VERSION
        }

        # Write to error log
        append_to_file(ERROR_LOG_PATH, json.dumps(error_report))

        # Optional: Send to telemetry
        if config.telemetry_enabled:
            send_error_report(error_report)
```

### 11.3 Method Execution Isolation

```python
def execute_method_safely(method, context):
    """Execute method with error isolation"""
    try:
        result = method.execute(context)
        return MethodResult(success=True, data=result)

    except MethodExecutionError as e:
        log_error(f"Method {method.num} execution failed: {e}")
        return MethodResult(
            success=False,
            error=str(e),
            fallback=get_fallback_result(method)
        )

    except Exception as e:
        log_error(f"Unexpected error in method {method.num}: {e}")
        return MethodResult(
            success=False,
            error="Internal error occurred",
            fallback=None
        )
```

### 11.4 Resource Limits

Prevent plugins from consuming excessive resources:

```python
class ResourceLimitedExecutor:
    def __init__(self):
        self.max_memory_mb = 100
        self.max_execution_time_sec = 30

    def execute_with_limits(self, method, context):
        """Execute method with resource limits"""
        # Set memory limit (platform-dependent)
        if platform.system() != 'Windows':
            import resource
            resource.setrlimit(resource.RLIMIT_AS,
                             (self.max_memory_mb * 1024 * 1024, -1))

        # Set execution time limit
        with Timeout(self.max_execution_time_sec):
            try:
                return method.execute(context)
            except TimeoutError:
                raise MethodExecutionError(
                    f"Method {method.num} exceeded time limit"
                )
            except MemoryError:
                raise MethodExecutionError(
                    f"Method {method.num} exceeded memory limit"
                )
```

### 11.5 Error Reporting

Comprehensive error reporting for debugging:

```bash
bmad plugins errors

Output:
Plugin Error Report
===================

plugin-a (v1.0.0)
  ✗ Validation Error (2026-01-11 10:23:45)
    - Missing required field: output_pattern in method 1001
    - Invalid category: "custm" (should be one of: creative, research, ...)

  ✗ Load Error (2026-01-11 10:24:12)
    - File not found: /path/to/plugin-a/methods.csv

plugin-b (v2.1.0)
  ✗ Runtime Error (2026-01-11 11:05:33)
    - Method 1050 execution failed: Division by zero
    - Stack trace: [...]

Export report: bmad plugins errors --export errors-2026-01-11.json
```

---

## 12. Plugin Lifecycle

### 12.1 Lifecycle States

```
┌─────────────┐
│ DISCOVERED  │ → Plugin found in filesystem
└──────┬──────┘
       │
       ↓ validate manifest
┌──────────────┐
│  VALIDATED   │ → Manifest is valid
└──────┬───────┘
       │
       ↓ resolve dependencies
┌──────────────┐
│ DEPENDENCIES │ → Dependencies satisfied
│   RESOLVED   │
└──────┬───────┘
       │
       ↓ load methods
┌──────────────┐
│   LOADED     │ → Methods loaded and validated
└──────┬───────┘
       │
       ↓ register with system
┌──────────────┐
│   ACTIVE     │ → Available for use
└──────┬───────┘
       │
       ↓ error or unload
┌──────────────┐
│   FAILED /   │ → Error occurred or manually unloaded
│  UNLOADED    │
└──────────────┘
```

### 12.2 State Transitions

```python
class PluginLifecycle:
    def __init__(self, manifest_path):
        self.state = PluginState.DISCOVERED
        self.manifest_path = manifest_path
        self.plugin = None
        self.errors = []

    def advance(self):
        """Advance plugin through lifecycle states"""
        if self.state == PluginState.DISCOVERED:
            return self.validate_manifest()

        elif self.state == PluginState.VALIDATED:
            return self.resolve_dependencies()

        elif self.state == PluginState.DEPENDENCIES_RESOLVED:
            return self.load_methods()

        elif self.state == PluginState.LOADED:
            return self.register_plugin()

        else:
            raise ValueError(f"Cannot advance from state: {self.state}")

    def validate_manifest(self):
        """Validate plugin manifest"""
        try:
            manifest = parse_yaml(self.manifest_path)
            validate_manifest_structure(manifest)

            self.plugin = Plugin(manifest)
            self.state = PluginState.VALIDATED
            return True

        except Exception as e:
            self.state = PluginState.FAILED
            self.errors.append(('validation', str(e)))
            return False

    def resolve_dependencies(self):
        """Resolve plugin dependencies"""
        try:
            is_valid, errors, warnings = validate_dependencies(
                self.plugin,
                registry.loaded_plugins,
                registry.core_methods
            )

            if not is_valid:
                raise DependencyError(errors)

            self.state = PluginState.DEPENDENCIES_RESOLVED
            return True

        except Exception as e:
            self.state = PluginState.FAILED
            self.errors.append(('dependencies', str(e)))
            return False

    def load_methods(self):
        """Load and validate plugin methods"""
        try:
            methods = parse_methods_csv(self.plugin.methods_csv_path)

            for method in methods:
                validate_method(method)

            self.plugin.methods = methods
            self.state = PluginState.LOADED
            return True

        except Exception as e:
            self.state = PluginState.FAILED
            self.errors.append(('method_loading', str(e)))
            return False

    def register_plugin(self):
        """Register plugin with system registry"""
        try:
            registry.register_plugin(self.plugin)
            self.state = PluginState.ACTIVE
            return True

        except Exception as e:
            self.state = PluginState.FAILED
            self.errors.append(('registration', str(e)))
            return False
```

### 12.3 Lifecycle Events

System emits events during lifecycle transitions:

```python
class PluginEventEmitter:
    def __init__(self):
        self.listeners = defaultdict(list)

    def on(self, event_type, callback):
        """Register event listener"""
        self.listeners[event_type].append(callback)

    def emit(self, event_type, data):
        """Emit event to all listeners"""
        for callback in self.listeners[event_type]:
            try:
                callback(data)
            except Exception as e:
                log_error(f"Event listener error: {e}")

# Event types
events = PluginEventEmitter()

events.on('plugin.discovered', lambda p: log_info(f"Discovered: {p.name}"))
events.on('plugin.validated', lambda p: log_info(f"Validated: {p.name}"))
events.on('plugin.loaded', lambda p: log_info(f"Loaded: {p.name}"))
events.on('plugin.active', lambda p: log_info(f"Active: {p.name}"))
events.on('plugin.failed', lambda p: log_error(f"Failed: {p.name} - {p.errors}"))
events.on('plugin.unloaded', lambda p: log_info(f"Unloaded: {p.name}"))
```

### 12.4 Manual Lifecycle Control

Users can control plugin lifecycle:

```bash
# Load specific plugin
bmad plugins load my-plugin

# Unload plugin
bmad plugins unload my-plugin

# Reload plugin
bmad plugins reload my-plugin

# Enable/disable plugin
bmad plugins enable my-plugin
bmad plugins disable my-plugin

# View plugin status
bmad plugins status my-plugin

Output:
Plugin: my-plugin
Status: ACTIVE
Version: 1.0.0
Location: /path/to/plugins/my-plugin
Methods: 1001-1050 (50 methods)
Dependencies: core methods [1, 5, 72], plugin base-research@1.2.0
Extensions: 2 extensions to core methods [46, 72]
```

---

## 13. Implementation Guidance

### 13.1 Implementation Phases

**Phase 1: Core Infrastructure (Week 1-2)**
- Implement plugin manifest parser
- Build plugin discovery mechanism
- Create method registry
- Implement basic validation

**Phase 2: Loading and Dependencies (Week 3-4)**
- Implement dependency resolution
- Build plugin loading system
- Implement error isolation
- Create conflict detection

**Phase 3: Advanced Features (Week 5-6)**
- Implement hot-reload system
- Build method extension system
- Implement conflict resolution
- Create workflow integration

**Phase 4: Tooling and UX (Week 7-8)**
- Build CLI commands
- Implement error reporting
- Create plugin templates
- Write documentation

**Phase 5: Testing and Polish (Week 9-10)**
- Comprehensive testing
- Performance optimization
- Security review
- Beta testing with real plugins

### 13.2 Technology Stack

**Language:** Python 3.8+ (matches existing BMAD tooling)

**Key Libraries:**
- `pyyaml`: YAML parsing for plugin.yaml
- `watchdog`: File system watching for hot-reload
- `packaging`: Version comparison
- `jsonschema`: Schema validation
- `networkx`: Dependency graph analysis (optional)

**File Structure:**
```
src/core/plugins/
├── __init__.py
├── discovery.py           # Plugin discovery logic
├── manifest.py            # Manifest parsing and validation
├── registry.py            # Plugin and method registry
├── loader.py              # Plugin loading logic
├── validator.py           # Schema validation
├── dependencies.py        # Dependency resolution
├── conflicts.py           # Conflict detection and resolution
├── extensions.py          # Method extension system
├── hot_reload.py          # Hot-reload mechanism
├── errors.py              # Error types and handling
└── cli.py                 # CLI commands
```

### 13.3 Configuration Files

**System Config:** `{install-root}/src/core/config/plugins.yaml`

```yaml
plugins:
  enabled: true

  discovery:
    locations:
      - type: "project"
        path: "{project-root}/_bmad/plugins"
        enabled: true
      - type: "user"
        path: "{user-home}/.bmad/plugins"
        enabled: true
      - type: "system"
        path: "{system}/bmad/plugins"
        enabled: false

  loading:
    parallel: true              # Load plugins in parallel
    max_parallel: 4             # Max parallel loads
    continue_on_error: true     # Continue if plugin fails

  validation:
    strict: true               # Strict schema validation
    allow_experimental: false  # Allow experimental features

  hot_reload:
    enabled: true
    debounce_ms: 500          # Debounce file change events

  conflicts:
    resolution_strategy: "priority"  # priority | location | explicit
    prompt_user: false                # Prompt for conflict resolution

  errors:
    log_file: "{project-root}/_bmad/logs/plugin-errors.log"
    report_telemetry: false
```

**Project Override:** `{project-root}/_bmad/config.yaml`

```yaml
plugins:
  discovery:
    locations:
      - type: "project"
        enabled: true  # Override system config

  conflicts:
    explicit_resolutions:
      method_1001:
        winner: "my-plugin"
        reason: "Custom implementation for this project"
```

### 13.4 Testing Strategy

**Unit Tests:**
- Manifest parsing
- Schema validation
- Dependency resolution algorithms
- Conflict detection logic
- Extension application

**Integration Tests:**
- Plugin discovery across locations
- Full plugin loading lifecycle
- Workflow integration
- Hot-reload scenarios
- Error isolation

**End-to-End Tests:**
- Real plugin creation and loading
- Multi-plugin scenarios
- Conflict resolution flows
- Performance with many plugins

**Test Plugins:**
Create suite of test plugins:
- `test-plugin-valid`: Well-formed plugin
- `test-plugin-invalid-manifest`: Broken manifest
- `test-plugin-invalid-methods`: Schema violations
- `test-plugin-conflicts`: Intentional conflicts
- `test-plugin-dependencies`: Complex dependencies
- `test-plugin-extensions`: Method extensions

### 13.5 Performance Considerations

**Optimization Strategies:**

1. **Lazy Loading:** Only load plugin methods when first accessed
2. **Caching:** Cache parsed manifests and validated methods
3. **Parallel Discovery:** Discover plugins in parallel
4. **Incremental Hot-Reload:** Only reload changed files
5. **Index Building:** Build searchable index of methods

**Performance Targets:**
- Discovery: < 100ms for 100 plugins
- Loading: < 500ms for 100 plugins
- Hot-reload: < 200ms for single plugin
- Method lookup: < 1ms (with caching)

### 13.6 Security Considerations

**Threats:**
1. Malicious plugin code execution
2. Path traversal attacks
3. Resource exhaustion
4. Data exfiltration

**Mitigations:**
1. **Sandboxing:** Plugins are data-only (CSV/YAML), no code execution
2. **Path Validation:** Validate all file paths
3. **Resource Limits:** Limit memory and execution time
4. **Input Validation:** Strict schema validation
5. **Isolation:** Plugin errors don't affect core
6. **Permissions:** Plugin directories have appropriate permissions

**Note:** Current design assumes plugins are data-only (CSV/YAML). If future versions allow plugin code execution, additional sandboxing required.

---

## 14. Edge Cases and Failure Modes

### 14.1 Edge Cases

#### Edge Case 1: Plugin Directory Deleted During Hot-Reload

**Scenario:** Plugin directory is deleted while system is watching it.

**Handling:**
```python
def on_directory_deleted(plugin_name, path):
    """Handle plugin directory deletion"""
    log_warning(f"Plugin directory deleted: {plugin_name} at {path}")

    # Unload plugin gracefully
    registry.unload_plugin(plugin_name)

    # Stop watching
    watcher.stop_watching(plugin_name)

    # Notify user
    notify_user(f"Plugin {plugin_name} was removed")
```

#### Edge Case 2: Circular Plugin Dependencies

**Scenario:** Plugin A depends on Plugin B, which depends on Plugin A.

**Handling:**
```python
def detect_circular_dependencies(plugins):
    """Detect circular dependencies using DFS"""
    visited = set()
    rec_stack = set()

    def has_cycle(plugin):
        visited.add(plugin.name)
        rec_stack.add(plugin.name)

        for dep in plugin.dependencies.plugins:
            if dep not in visited:
                if has_cycle(get_plugin(dep)):
                    return True
            elif dep in rec_stack:
                return True

        rec_stack.remove(plugin.name)
        return False

    for plugin in plugins:
        if plugin.name not in visited:
            if has_cycle(plugin):
                raise DependencyError(f"Circular dependency detected involving {plugin.name}")
```

#### Edge Case 3: Plugin Version Incompatibility Chain

**Scenario:** Plugin A requires Plugin B v1.0, Plugin C requires Plugin B v2.0.

**Handling:**
```python
def resolve_version_conflicts(plugins):
    """Attempt to resolve version conflicts"""
    # Group plugins by dependency
    dependency_map = defaultdict(list)

    for plugin in plugins:
        for dep in plugin.dependencies.plugins:
            dependency_map[dep.name].append({
                'requirer': plugin.name,
                'version_constraint': dep.version
            })

    # Check for incompatible constraints
    for dep_name, requirements in dependency_map.items():
        if len(requirements) > 1:
            # Check if constraints are compatible
            if not are_constraints_compatible([r['version_constraint']
                                              for r in requirements]):
                raise DependencyError(
                    f"Incompatible version requirements for {dep_name}: "
                    f"{requirements}"
                )
```

#### Edge Case 4: Method Number Exhaustion

**Scenario:** So many plugins that method numbers approach integer limits.

**Handling:**
```python
MAX_METHOD_NUM = 999999  # Reasonable upper limit

def allocate_method_number(requested_num):
    """Allocate method number with overflow check"""
    if requested_num > MAX_METHOD_NUM:
        raise MethodNumberError(
            f"Method number {requested_num} exceeds maximum {MAX_METHOD_NUM}"
        )

    if requested_num in registry.methods:
        raise ConflictError(f"Method {requested_num} already allocated")

    return requested_num
```

#### Edge Case 5: Extension Conflicts with Different Types

**Scenario:** Plugin A adds output_pattern variant, Plugin B modifies description of same method.

**Handling:** Both extensions are compatible and can coexist:

```python
def check_extension_compatibility(ext_a, ext_b):
    """Check if two extensions are compatible"""
    # Different extension types are compatible
    if ext_a.extension_type != ext_b.extension_type:
        return True

    # Same type - check specific compatibility
    if ext_a.extension_type == "output_pattern_variant":
        # Multiple variants are fine
        return True

    if ext_a.extension_type == "description_enhancement":
        # Multiple enhancements can be concatenated
        return True

    # Same type, same target - conflict
    return False
```

### 14.2 Failure Modes

#### Failure Mode 1: All Plugins Fail to Load

**Impact:** System falls back to core-only mode
**Recovery:** System remains functional with 150 core methods
**User Action:** Check plugin error log, fix issues, reload

#### Failure Mode 2: Critical Plugin Fails During Workflow

**Impact:** Workflow using plugin method cannot continue
**Recovery:** Workflow prompts user to select alternative method
**User Action:** Choose different method or fix plugin

```python
def handle_method_unavailable(method_num, workflow_context):
    """Handle unavailable method during workflow"""
    # Log error
    log_error(f"Method {method_num} unavailable in workflow {workflow_context.name}")

    # Find similar methods
    similar = registry.find_similar_methods(method_num)

    # Prompt user
    print(f"Method {method_num} is not available.")
    print("Similar methods:")
    for i, method in enumerate(similar[:5]):
        print(f"  {i+1}. [{method.num}] {method.method_name}")

    choice = input("Select alternative (or 'skip'): ")

    if choice == 'skip':
        return None
    else:
        return similar[int(choice) - 1]
```

#### Failure Mode 3: Hot-Reload Corruption

**Impact:** Plugin state becomes inconsistent
**Recovery:** Automatic rollback to previous version
**User Action:** Fix plugin files, trigger reload again

```python
def hot_reload_with_rollback(plugin_name):
    """Hot-reload with automatic rollback on failure"""
    # Create snapshot
    snapshot = registry.snapshot_plugin(plugin_name)

    try:
        # Attempt reload
        registry.reload_plugin(plugin_name)

    except Exception as e:
        log_error(f"Hot-reload failed, rolling back: {e}")

        # Rollback to snapshot
        registry.restore_plugin(snapshot)

        # Notify user
        notify_user(f"Hot-reload failed for {plugin_name}, reverted to previous version")
```

#### Failure Mode 4: Schema Evolution Incompatibility

**Impact:** Old plugins incompatible with new BMAD version
**Recovery:** Plugin marked as incompatible, disabled
**User Action:** Update plugin or use compatibility layer

```python
def check_schema_compatibility(plugin, current_schema_version):
    """Check if plugin schema is compatible"""
    plugin_schema_version = plugin.manifest.get('schema_version', '1.0.0')

    if plugin_schema_version < current_schema_version:
        # Check if migration available
        if migration_available(plugin_schema_version, current_schema_version):
            return 'migrate'
        else:
            return 'incompatible'

    return 'compatible'
```

#### Failure Mode 5: File System Permissions Issues

**Impact:** Cannot read/write plugin files
**Recovery:** Log error, skip plugin
**User Action:** Fix file permissions

```python
def check_plugin_permissions(plugin_path):
    """Check if plugin directory has correct permissions"""
    try:
        # Check read access
        test_file = os.path.join(plugin_path, 'plugin.yaml')
        with open(test_file, 'r') as f:
            f.read(1)

        # Check write access (for hot-reload)
        test_write = os.path.join(plugin_path, '.bmad-access-test')
        with open(test_write, 'w') as f:
            f.write('test')
        os.remove(test_write)

        return True

    except PermissionError as e:
        log_error(f"Permission denied for {plugin_path}: {e}")
        return False
```

---

## 15. Assumptions and Dependencies

### 15.1 Explicit Assumptions

1. **Plugin Format:** Plugins are data-only (YAML + CSV), no executable code
   - **Rationale:** Simplifies security, no sandboxing needed
   - **Impact:** Limits plugin capabilities to data extensions
   - **Alternative:** If code execution needed in future, add sandboxing layer

2. **File System Access:** System has read/write access to plugin directories
   - **Rationale:** Required for discovery and hot-reload
   - **Impact:** Won't work in read-only file systems
   - **Alternative:** Provide in-memory plugin registration API

3. **Method Number Uniqueness:** Method numbers are globally unique identifiers
   - **Rationale:** Simplifies referencing and lookup
   - **Impact:** Requires coordination for fixed numbering
   - **Alternative:** Use compound keys (plugin:num)

4. **CSV Format Stability:** Core methods.csv format won't change dramatically
   - **Rationale:** Backwards compatibility requirement
   - **Impact:** Plugin methods must follow same format
   - **Alternative:** Support format versioning and migration

5. **Single BMAD Instance:** One BMAD instance per project/user context
   - **Rationale:** Simplifies state management
   - **Impact:** Multi-instance scenarios need separate plugin registries
   - **Alternative:** Support multi-tenancy with isolated registries

6. **Plugin Trust:** Users trust plugins they install
   - **Rationale:** Data-only plugins have limited attack surface
   - **Impact:** Malformed data could cause issues
   - **Alternative:** Add plugin signing and verification

7. **Filesystem Notifications:** OS supports file system watching
   - **Rationale:** Required for hot-reload
   - **Impact:** Hot-reload disabled on unsupported systems
   - **Alternative:** Fallback to periodic polling

8. **Python Environment:** System runs in Python 3.8+ environment
   - **Rationale:** Matches existing BMAD implementation
   - **Impact:** Plugin system tied to Python
   - **Alternative:** Language-agnostic plugin protocol

### 15.2 External Dependencies

**Required:**
- Python 3.8+
- File system access
- YAML parser (pyyaml)

**Optional:**
- File system watcher (watchdog) - for hot-reload
- Version parser (packaging) - for version checks
- JSON schema validator (jsonschema) - for validation

**System:**
- Existing BMAD-METHOD core (methods 1-150)
- Project configuration system
- Workflow execution engine

### 15.3 Constraints

**Technical Constraints:**
1. Must not modify core methods.csv
2. Must maintain backwards compatibility
3. Plugin errors must not crash system
4. Hot-reload must be transactional
5. Memory overhead must be minimal

**Business Constraints:**
1. Users should not need programming knowledge
2. Plugin creation should be simple
3. No external services required
4. Works offline

**Performance Constraints:**
1. Discovery < 100ms for 100 plugins
2. Loading < 500ms for 100 plugins
3. Method lookup < 1ms
4. Hot-reload < 200ms

### 15.4 Open Questions

Questions requiring stakeholder input:

1. **Plugin Distribution:** How should plugins be distributed?
   - Options: Git repositories, package manager, marketplace, manual download
   - Recommendation: Start with manual download, add package manager later

2. **Plugin Signing:** Should plugins be cryptographically signed?
   - Options: No signing, optional signing, required signing
   - Recommendation: Optional signing for community plugins

3. **Telemetry:** Should plugin errors be reported to maintainers?
   - Options: No telemetry, opt-in telemetry, opt-out telemetry
   - Recommendation: Opt-in telemetry with clear privacy policy

4. **Versioning Policy:** How should plugin version compatibility be enforced?
   - Options: Strict semantic versioning, loose versioning, no enforcement
   - Recommendation: Strict semantic versioning with migration support

5. **Community Plugins:** Should there be an official plugin registry?
   - Options: No registry, community registry, official registry
   - Recommendation: Community-maintained registry on GitHub

6. **Plugin Namespace:** Should plugins have namespaced method names?
   - Options: Global namespace, plugin namespace, hybrid
   - Recommendation: Hybrid - optional namespace for conflict avoidance

### 15.5 Risk Assessment

**High Risk:**
- **Circular Dependencies:** Could deadlock plugin loading
  - Mitigation: Topological sort with cycle detection

- **Method Number Collisions:** Could cause data loss
  - Mitigation: Strict validation, conflict detection, user notification

**Medium Risk:**
- **Hot-Reload Corruption:** Could leave system in bad state
  - Mitigation: Transactional reload with rollback

- **Performance Degradation:** Many plugins could slow system
  - Mitigation: Lazy loading, caching, performance monitoring

**Low Risk:**
- **Version Incompatibility:** Old plugins might not work with new BMAD
  - Mitigation: Version checking, migration tools, compatibility warnings

---

## Appendix A: Example Plugin

### Complete Example Plugin

**Directory Structure:**
```
_bmad/plugins/software-architecture-methods/
├── plugin.yaml
├── methods.csv
├── README.md
└── examples/
    └── microservices-example.md
```

**plugin.yaml:**
```yaml
name: "software-architecture-methods"
version: "1.0.0"
author: "Architecture Team"
description: "Software architecture-specific thinking methods"

bmad_version_min: "1.0.0"

method_range:
  start: 1000
  end: 1010

dependencies:
  core_methods: [46, 72, 36]
  plugins: []

extends:
  - method_num: 46
    extension_type: "output_pattern_variant"
    description: "Software architecture SCAMPER patterns"

config:
  enabled: true
  hot_reload: true
  priority: 100

tags:
  - "software"
  - "architecture"
  - "design"
```

**methods.csv:**
```csv
num,category,method_name,description,output_pattern,requires
1000,technical,Architecture Quality Attributes,"[TRIGGER]: Use when defining quality requirements for architecture. [STEPS]: (1) List business drivers (2) Identify key quality attributes (performance/security/scalability/maintainability) (3) Define measurable targets for each (4) Identify trade-offs between attributes (5) Prioritize based on business value. [FORCED]: At least two attributes must be in conflict requiring trade-off. [KEY QUESTION]: Which quality attributes are most critical? [ANTI-PATTERN]: Trying to optimize all attributes equally.",drivers → attributes → targets → trade-offs,"36,72"
1001,technical,Component Responsibility Mapping,"[TRIGGER]: Use when defining clear component boundaries. [STEPS]: (1) List all components (2) For each define single primary responsibility (3) Identify secondary responsibilities (4) Check for overlapping responsibilities (5) Refactor overlaps (6) Validate against SOLID principles. [FORCED]: If no overlaps found you have not looked carefully enough. [KEY QUESTION]: What is each component's single reason to change? [ANTI-PATTERN]: Components with vague or multiple primary responsibilities.",components → responsibilities → overlaps → refactor,72
extends,46,output_pattern,"architecture → components → interfaces → deployment"
extends,46,example,"Example: Using SCAMPER for microservices architecture\nSUBSTITUTE: Replace monolith with microservices\nCOMBINE: Merge user service with auth service\nADAPT: Adapt Netflix patterns for our domain\nMODIFY: Change sync to async communication\nPUT TO OTHER USE: Use message queue for event sourcing\nELIMINATE: Remove redundant API gateway\nREVERSE: Invert dependency from service to database"
```

**README.md:**
```markdown
# Software Architecture Methods Plugin

Extension methods for software architecture thinking.

## Methods Provided

- **1000: Architecture Quality Attributes** - Define and prioritize quality requirements
- **1001: Component Responsibility Mapping** - Define clear component boundaries

## Extensions

- **Method 46 (SCAMPER)** - Adds software architecture specific output pattern and examples

## Installation

1. Copy this directory to `_bmad/plugins/`
2. Run `bmad plugins refresh`
3. Verify: `bmad plugins list`

## Usage

In workflows, reference methods by number:
```

Use method 1000 to define quality attributes for the architecture.
```

Or search by name:
```

Use "Architecture Quality Attributes" method to define requirements.
```

## Dependencies

Requires core methods:
- 46 (SCAMPER Method)
- 72 (First Principles Analysis)
- 36 (Architecture Decision Records)

## Version History

- 1.0.0 - Initial release with 2 methods
```

---

## Appendix B: CLI Command Reference

### Plugin Management Commands

```bash
# Discovery and loading
bmad plugins refresh                    # Rediscover and reload all plugins
bmad plugins list                       # List all discovered plugins
bmad plugins list --active              # List only active plugins
bmad plugins list --failed              # List failed plugins

# Plugin control
bmad plugins load <name>                # Load specific plugin
bmad plugins unload <name>              # Unload specific plugin
bmad plugins reload <name>              # Reload specific plugin
bmad plugins enable <name>              # Enable plugin
bmad plugins disable <name>             # Disable plugin

# Information
bmad plugins info <name>                # Show plugin details
bmad plugins status <name>              # Show plugin status
bmad plugins deps <name>                # Show plugin dependencies
bmad plugins deps --graph               # Visualize dependency graph

# Validation
bmad plugins check                      # Check all plugins for errors
bmad plugins check <name>               # Check specific plugin
bmad plugins validate <path>            # Validate plugin before loading

# Conflict management
bmad plugins conflicts                  # List all conflicts
bmad plugins conflicts resolve          # Interactive conflict resolution
bmad plugins fix-conflicts              # Guided conflict fixing

# Errors
bmad plugins errors                     # Show plugin error log
bmad plugins errors <name>              # Show errors for specific plugin
bmad plugins errors --export <file>     # Export error report

# Method management
bmad method info <num>                  # Show method details
bmad method info <num> --no-extensions  # Show base method only
bmad method search <query>              # Search methods
bmad method list                        # List all methods
bmad method list --category <cat>       # List methods in category
bmad method list --plugin <name>        # List methods from plugin

# Plugin creation
bmad plugins create <name>              # Create new plugin from template
bmad plugins template                   # Show plugin template
```

---

## Appendix C: Migration Guide

### Migrating Existing Custom Methods to Plugins

If you have custom methods added directly to methods.csv:

**Step 1: Extract Custom Methods**
```bash
# Identify custom methods (numbers > 150)
grep "^[0-9]\{3,\}," _bmad/core/methods.csv > custom-methods.csv
```

**Step 2: Create Plugin**
```bash
bmad plugins create my-custom-methods
```

**Step 3: Populate Plugin**
```
Copy custom methods to plugin/methods.csv
Edit plugin.yaml with metadata
```

**Step 4: Validate and Load**
```bash
bmad plugins validate _bmad/plugins/my-custom-methods
bmad plugins load my-custom-methods
```

**Step 5: Remove from Core**
```
Remove custom methods from core methods.csv
Test workflows still work
```

---

## Appendix D: Plugin Template

### Minimal Plugin Template

Create this directory structure for new plugins:

```
my-plugin/
├── plugin.yaml
├── methods.csv
└── README.md
```

**plugin.yaml template:**
```yaml
name: "my-plugin"
version: "0.1.0"
author: "Your Name"
description: "Brief description of what this plugin provides"

bmad_version_min: "1.0.0"

method_range:
  start: XXXX        # Choose available range
  end: XXXX

dependencies:
  core_methods: []   # List core method dependencies
  plugins: []        # List plugin dependencies

extends: []          # List any method extensions

config:
  enabled: true
  hot_reload: true
  priority: 100

tags:
  - "tag1"
  - "tag2"
```

**methods.csv template:**
```csv
num,category,method_name,description,output_pattern
XXXX,category,Method Name,"[TRIGGER]: ... [STEPS]: ... [FORCED]: ... [KEY QUESTION]: ... [ANTI-PATTERN]: ...",pattern
```

**README.md template:**
```markdown
# Plugin Name

Brief description

## Methods

- **XXXX: Method Name** - What it does

## Installation

1. Copy to `_bmad/plugins/`
2. Run `bmad plugins refresh`

## Usage

Example usage...

## Dependencies

List dependencies...

## Version History

- 0.1.0 - Initial version
```

---

## Document Control

**Review Schedule:** Quarterly
**Next Review:** 2026-04-11
**Stakeholders:** Engineering Team, Product Team, Community
**Approval Required:** Technical Lead, Product Owner

**Change Log:**
- 2026-01-11: Initial design document v1.0

---

**End of Document**
