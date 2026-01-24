# #86 Topological Hole Detection

**Tier:** 2 (Signal-based - Phase 2)
**Purpose:** Find structural gaps in the system.

## What to do

1. Map elements as graph (nodes = components, edges = dependencies)
2. Find persistent holes:
   - Dead ends (components with no outbound connections)
   - Cycles without closure (infinite loops)
   - High-inbound-no-outbound clusters (sinks)

## Step-by-step

```
1. Build dependency graph:
   Nodes: [Auth, User Service, Database, Cache, API Gateway]
   Edges:
   - API Gateway → Auth
   - API Gateway → User Service
   - User Service → Database
   - User Service → Cache
   - Auth → Database

2. Analyze topology:
   - Dead ends: Database, Cache (no outbound)
     → OK for data stores
   - Cycles: None found ✓
   - Sinks: Database has high inbound
     → Check: failure propagation?

3. Find holes:
   - Auth → Database but no Auth → Cache
     → Is this intentional? Session caching?
```

## Output format

```
Dependency graph:
[ASCII or list representation]

Topology analysis:
- Dead ends: [list] — [OK/concern]
- Cycles: [list] — [breaking condition?]
- Sinks: [list] — [failure impact?]

Holes found:
- [Component A] → [Component B] missing
  Impact: [description]

FINDING (if any): [description]
QUOTE: "[architecture description]"
SEVERITY: [CRITICAL/IMPORTANT/MINOR]
```
