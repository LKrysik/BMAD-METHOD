# Session Memory Persistence - Minimal Architecture

**Version:** 1.0
**Approach:** Simplest design that meets all requirements

---

## 1. Storage: Single JSONL File

```
.bmad/sessions/{session-id}.jsonl
```

Each line is a memory entry:

```json
{"id":"m001","type":"conversation","ts":"2026-01-11T14:30:00Z","data":{"role":"user","content":"Hello"},"priority":1.0,"access":0}
{"id":"m002","type":"decision","ts":"2026-01-11T14:31:00Z","data":{"decision":"Use OAuth","by":"architect"},"priority":0.95,"access":3}
{"id":"m003","type":"finding","ts":"2026-01-11T14:32:00Z","data":{"issue":"Missing MFA","severity":"critical"},"priority":0.9,"access":1}
{"id":"m004","type":"preference","ts":"2026-01-11T14:33:00Z","data":{"key":"verification_depth","value":"thorough"},"priority":0.85,"access":5}
```

---

## 2. Memory Types

| Type | Fields | Decay Rate |
|------|--------|------------|
| conversation | role, content | 0.05/day |
| decision | decision, by, rationale | 0.03/day |
| finding | issue, severity, status | 0.04/day |
| preference | key, value | 0.02/day |

---

## 3. Concurrency: File Lock

```python
def write_memory(session_id, memory):
    with FileLock(f"{session_id}.lock", timeout=5):
        with open(f"{session_id}.jsonl", "a") as f:
            f.write(json.dumps(memory) + "\n")
```

---

## 4. Query: Linear Scan with Filter

```python
def query(session_id, type=None, topic=None, min_priority=0):
    results = []
    for line in open(f"{session_id}.jsonl"):
        m = json.loads(line)
        if m.get("deleted"): continue
        if type and m["type"] != type: continue
        if min_priority and m["priority"] < min_priority: continue
        if topic and topic not in str(m["data"]): continue
        results.append(m)
    return sorted(results, key=lambda x: -x["priority"])
```

---

## 5. Memory Decay

On each access, update priority:

```python
def decay_priority(memory, now):
    days = (now - memory["ts"]).days
    base = {"conversation": 1.0, "decision": 0.95, "finding": 0.9, "preference": 0.85}
    rate = {"conversation": 0.05, "decision": 0.03, "finding": 0.04, "preference": 0.02}

    decay = math.exp(-rate[memory["type"]] * days)
    boost = min(0.2, memory["access"] * 0.02)
    return base[memory["type"]] * decay + boost
```

---

## 6. Privacy: Soft Delete

```python
def delete_memory(session_id, memory_id):
    # Append deletion marker
    with FileLock(f"{session_id}.lock"):
        with open(f"{session_id}.jsonl", "a") as f:
            f.write(json.dumps({"id": memory_id, "deleted": True, "ts": now()}) + "\n")
```

---

## 7. Size Management

```python
def check_quota(session_id):
    size = os.path.getsize(f"{session_id}.jsonl")
    if size > 10 * 1024 * 1024:  # 10MB
        compact(session_id)

def compact(session_id):
    memories = [m for m in load_all(session_id) if not m.get("deleted") and m["priority"] > 0.3]
    with open(f"{session_id}.jsonl", "w") as f:
        for m in memories:
            f.write(json.dumps(m) + "\n")
```

---

## 8. API

```python
class SessionMemory:
    def __init__(self, session_id):
        self.session_id = session_id

    def add(self, type, data): ...
    def query(self, type=None, topic=None, min_priority=0): ...
    def delete(self, memory_id): ...
    def get_context(self, limit=20): ...
```

---

## 9. Trade-offs

| Aspect | This Design | Complex Alternative |
|--------|-------------|---------------------|
| Query speed | O(n) linear | O(1) indexed |
| Complexity | ~100 lines | ~1000+ lines |
| Dependencies | None | Index library |
| Debugging | Read file directly | Parse index |
| Scaling | 10k memories | 100k+ memories |

**Conclusion:** For typical agent sessions (<10k memories), linear scan is fast enough (<100ms) and dramatically simpler.

---

## 10. Limitations

1. **No indexing** - queries scan all entries
2. **No graph queries** - find related requires manual linking
3. **No time travel** - only current state
4. **Single session** - no cross-session queries

These are acceptable for the stated requirements.

---

**End of Architecture**
