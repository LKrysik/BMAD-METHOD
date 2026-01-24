# Process: Security Verification

## Triggers

Keywords that activate this process:
- auth, authentication, login
- encrypt, encryption, cipher
- key, secret key, public key
- signature, signing
- PFS, perfect forward secrecy
- ZK, zero-knowledge
- token, JWT, session
- password, credential
- permission, access control, authorization
- secure, security
- hash, hashing
- certificate, TLS, SSL

---

## Steps

### Step 1: Extract Security Claims

**Do:** List ALL security-related claims in the artifact.

Look for these claim types:
- Confidentiality guarantees
- Integrity guarantees
- Authentication mechanisms
- Authorization mechanisms
- Forward secrecy
- Zero-knowledge properties
- Quantum resistance
- Key management

**Output Format:**
```
| Claim Type | Claimed? | Location | Exact Quote |
|------------|----------|----------|-------------|
| Confidentiality | [what] | §[X] | "[quote]" |
| Authentication | [method] | §[X] | "[quote]" |
| Forward Secrecy | YES/NO | §[X] | "[quote]" |
| Zero-Knowledge | YES/NO | §[X] | "[quote]" |
| Quantum Resistant | YES/NO | §[X] | "[quote]" |
```

---

### Step 2: Check Cryptographic Impossibilities

**Do:** Check if security claims violate known constraints.

**Uses:** domain-knowledge-base.md §1.Cryptography

**Check Matrix:**
```
| Combination | Constraint | Violated? |
|-------------|------------|-----------|
| PFS + Key Recovery | PFS = past unreadable; Recovery = past readable | If both claimed |
| ZK + Information Leakage | ZK cannot leak witness info | If ZK + recovery derivable |
| RSA/ECC + Quantum Resistance | Shor's algorithm breaks these | If both claimed |
```

**Output:** List of violations or "No violations found"

---

### Step 3: Check Algorithm Choices

**Do:** Verify cryptographic algorithms are appropriate.

**Uses:** domain-knowledge-base.md §2.Cryptography Terms

**Algorithm Checks:**
```
| Algorithm Mentioned | Appropriate For | Inappropriate For |
|---------------------|-----------------|-------------------|
| RSA | Current security | Quantum resistance |
| ECC | Current security | Quantum resistance |
| AES | Symmetric encryption | (usually fine) |
| SHA-256 | Hashing | (usually fine) |
| MD5/SHA-1 | NOTHING (deprecated) | Any security use |
```

**Red Flags:**
- MD5 or SHA-1 for security purposes
- RSA/ECC with quantum resistance claims
- "Homomorphic" used incorrectly (see domain-kb)
- Custom/unspecified cryptography

**Output:** Algorithm assessment

---

### Step 4: Check Key Management

**Do:** Assess key management practices.

**Key Management Checks:**
- Where are keys stored?
- How are keys rotated?
- What happens if key is compromised?
- Is there key escrow? (conflicts with PFS)
- Are there hardcoded keys/secrets?

**Red Flags:**
- Keys in code/config
- No rotation mechanism
- Recovery mechanism that breaks PFS
- Unclear key derivation

**Output:** Key management assessment

---

### Step 5: Check Authentication/Authorization

**Do:** Assess auth mechanisms.

**Uses:** domain-knowledge-base.md §3.Crypto Checklist, §1.Web (if applicable)

**Auth Checks:**
```
| Aspect | What to Check | Finding if Issue |
|--------|---------------|------------------|
| JWT | Revocation strategy? | Stateless JWT cannot revoke |
| Session | Storage location? | Server-side breaks stateless |
| Tokens | Expiration? | Long-lived tokens are risky |
| Passwords | Hashing algorithm? | Plain text = CRITICAL |
```

**Output:** Auth mechanism assessment

---

## Finding Templates

### CRITICAL Findings

**PFS + Recovery Conflict:**
```
Finding: Artifact claims Perfect Forward Secrecy AND key/session recovery.
Constraint: PFS means past sessions are unreadable if keys compromised.
Recovery means past sessions CAN be read.
Evidence:
- PFS claim: "[quote]"
- Recovery claim: "[quote]"
Severity: CRITICAL
Recommendation: Choose one - cannot have both by definition.
```

**Quantum Resistance + RSA/ECC:**
```
Finding: Claims quantum resistance while using RSA/ECC.
Constraint: Shor's algorithm breaks RSA/ECC on quantum computers.
Evidence: "[quotes]"
Severity: CRITICAL (if quantum resistance is requirement)
Severity: IMPORTANT (if just mentioned)
```

### IMPORTANT Findings

**No Key Rotation:**
```
Finding: No key rotation mechanism specified.
Risk: Compromised keys remain valid indefinitely.
Severity: IMPORTANT
```

**JWT Revocation:**
```
Finding: Uses stateless JWT with no revocation strategy.
Risk: Compromised tokens valid until expiration.
Evidence: "[quote]"
Severity: IMPORTANT
```

---

## Process Metrics

| Metric | Target |
|--------|--------|
| Steps | 5 |
| Tokens | 1.5-3K |
| Time | 2-4 min |
| Domain-KB sections used | §1.Cryptography, §2.Crypto Terms, §3.Crypto Checklist |
