# Security Analysis

## Purpose
Check for security vulnerabilities, crypto misuse, and authentication/authorization issues.

## When to Apply
When artifact contains markers: auth, encrypt, key, token, password, permission, PFS, ZK.

## Security Knowledge

### Crypto Pitfalls

| Pitfall | Problem | Correct Approach |
|---------|---------|------------------|
| Rolling own crypto | Likely insecure | Use established libraries |
| ECB mode | Pattern leakage | Use CBC, GCM, or CTR |
| MD5/SHA1 for security | Broken | Use SHA-256+ |
| Hardcoded keys | Trivially compromised | Key management system |
| PFS + key recovery | Contradiction | Choose one |

### Authentication Issues

| Issue | Problem | Fix |
|-------|---------|-----|
| Plaintext passwords | Compromised on breach | Hash with bcrypt/argon2 |
| No rate limiting | Brute force possible | Add rate limiting |
| Session in URL | Leaked in logs/referrer | Use cookies with flags |
| No CSRF protection | Cross-site attacks | Add CSRF tokens |

### Authorization Issues

| Issue | Problem | Fix |
|-------|---------|-----|
| Missing auth checks | Unauthorized access | Check on every request |
| Client-side only | Bypassable | Server-side validation |
| IDOR | Access other users' data | Check ownership |
| Privilege escalation | Gain admin rights | Validate role changes |

### Crypto Impossibilities

| Claim | Reality |
|-------|---------|
| PFS + recover past sessions | Contradiction by definition |
| ZK proof + derivable info | ZK means no info leakage |
| RSA + quantum resistant | RSA broken by Shor |

## Checklist

- [ ] **Passwords?** Hashed with strong algorithm?
- [ ] **Keys?** Properly managed, not hardcoded?
- [ ] **Encryption?** Modern algorithm, correct mode?
- [ ] **Auth?** Server-side, on all endpoints?
- [ ] **Sessions?** Secure flags, not in URL?
- [ ] **CSRF?** Protected?
- [ ] **Crypto claims?** Any impossibilities?

## Procedure

### Step 1: Extract Security Elements
Find:
- Authentication mechanisms
- Authorization checks
- Encryption usage
- Key management
- Session handling

### Step 2: Apply Checklist
Go through checklist for each element.

### Step 3: Check Crypto Claims
Compare claims against Crypto Impossibilities table.

### Step 4: Identify Vulnerabilities
Flag missing protections or dangerous patterns.

## Output Format

```markdown
## Security Analysis Results

### Security Elements Found
| Element | Location | Type |
|---------|----------|------|
| [element] | line X | auth/crypto/session/authz |

### Checklist Results
| Check | Result | Notes |
|-------|--------|-------|
| Passwords hashed? | YES/NO/N/A | [details] |
| Keys managed? | YES/NO/N/A | [details] |
| Encryption modern? | YES/NO/N/A | [details] |
| Auth server-side? | YES/NO/N/A | [details] |
| Sessions secure? | YES/NO/N/A | [details] |

### Vulnerabilities Found
| ID | Issue | Location | Severity |
|----|-------|----------|----------|
| S-1 | [vulnerability] | line X | CRITICAL/IMPORTANT |
```

## Severity Guide

| Issue | Severity |
|-------|----------|
| Plaintext passwords | CRITICAL |
| Hardcoded secrets | CRITICAL |
| Missing auth on sensitive endpoint | CRITICAL |
| Crypto impossibility (PFS + recovery) | CRITICAL |
| Weak hash algorithm | IMPORTANT |
| Missing CSRF protection | IMPORTANT |
| Session in URL | IMPORTANT |
