# Process: API Design Verification

## Triggers

Keywords that activate this process:
- REST, RESTful
- API, endpoint
- HTTP, HTTPS
- GET, POST, PUT, DELETE, PATCH
- request, response
- stateless
- CORS
- JSON, XML
- rate limit, throttling
- versioning, v1, v2

---

## Steps

### Step 1: Extract API Claims

**Do:** List ALL claims about the API design.

Look for these claim types:
- RESTful compliance
- Statelessness
- Idempotency
- Rate limiting
- Authentication method
- Versioning strategy
- Error handling

**Output Format:**
```
| Claim Type | Claimed? | Location | Exact Quote |
|------------|----------|----------|-------------|
| RESTful | YES/NO | §[X] | "[quote]" |
| Stateless | YES/NO | §[X] | "[quote]" |
| Idempotent | [methods] | §[X] | "[quote]" |
| Rate Limited | YES/NO | §[X] | "[quote]" |
| Auth Method | [method] | §[X] | "[quote]" |
```

---

### Step 2: Check REST Compliance

**Do:** If "RESTful" is claimed, verify actual compliance.

**Uses:** domain-knowledge-base.md §2.Web/API Terms

**REST Constraints (all required for "RESTful"):**
```
| Constraint | Check | Status |
|------------|-------|--------|
| Client-Server | Clear separation? | [YES/NO] |
| Stateless | No server-side session? | [YES/NO] |
| Cacheable | Cache headers used? | [YES/NO/NA] |
| Uniform Interface | Resource-based URLs? | [YES/NO] |
| Layered System | Can add proxies/gateways? | [YES/NO/NA] |
```

**If claims "RESTful" but fails constraints:** IMPORTANT finding

**Output:** REST compliance assessment

---

### Step 3: Check Statelessness Claims

**Do:** Verify statelessness is actually achieved.

**Uses:** domain-knowledge-base.md §1.Web/API, §4.Contradiction Patterns

**Statelessness Checks:**
```
| Aspect | Truly Stateless | Not Stateless |
|--------|-----------------|---------------|
| Session | Client-side (JWT, cookie) | Server-side session store |
| Auth | Token in each request | Session ID lookup |
| State | Passed in request | Stored between requests |
```

**Red Flags:**
- "Stateless" but mentions session store
- "Stateless" but mentions Redis for sessions
- JWT but server-side blacklist (partial statefulness)

**Output:** Statelessness analysis

---

### Step 4: Check Auth Mechanism

**Do:** Assess authentication/authorization design.

**Uses:** domain-knowledge-base.md §3.Web/API Checklist

**Auth Checks:**
```
| Mechanism | Check | Common Issues |
|-----------|-------|---------------|
| JWT | Revocation strategy? | Can't revoke stateless JWT |
| API Keys | Rotation? Scoping? | Long-lived keys are risky |
| OAuth | Correct flow for use case? | Wrong grant type |
| Basic Auth | Over HTTPS only? | Plain text credentials |
```

**Output:** Auth mechanism assessment

---

### Step 5: Check Rate Limiting

**Do:** If distributed, assess rate limiting approach.

**Uses:** domain-knowledge-base.md §1.Web/API

**Rate Limiting Checks:**
```
If distributed system + rate limiting:
- How is count shared across instances?
- Is it approximate or exact?
- What happens during partition?

Exact distributed rate limiting requires shared state.
"Stateless" + "exact rate limiting" + "distributed" = contradiction
```

**Output:** Rate limiting analysis

---

## Finding Templates

### IMPORTANT Findings

**REST Compliance:**
```
Finding: Claims "RESTful" but violates REST constraints.
Claim: "[quote]"
Violations: [list of failed constraints]
Severity: IMPORTANT
Recommendation: Either fix violations or don't claim RESTful.
```

**Statelessness Contradiction:**
```
Finding: Claims stateless but uses server-side session.
Claim: "[stateless quote]"
Contradiction: "[session store quote]"
Severity: IMPORTANT
Recommendation: Clarify - it's stateless-like, not truly stateless.
```

**JWT Revocation:**
```
Finding: Uses JWT with no revocation strategy.
Issue: Compromised tokens remain valid until expiration.
Severity: IMPORTANT
Recommendation: Add token blacklist OR short expiration + refresh tokens.
```

### MINOR Findings

**API Versioning:**
```
Finding: No versioning strategy specified.
Risk: Breaking changes affect all clients.
Severity: MINOR
Recommendation: Define versioning approach (URL, header, etc.)
```

---

## Process Metrics

| Metric | Target |
|--------|--------|
| Steps | 5 |
| Tokens | 1-2K |
| Time | 2-3 min |
| Domain-KB sections used | §1.Web, §2.Web Terms, §3.Web Checklist |
