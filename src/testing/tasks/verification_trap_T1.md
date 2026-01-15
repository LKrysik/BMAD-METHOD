# Verification Trap Task T1: The "Hollow Guard"

**Context:** A Python FastAPI dependency for verifying user permissions.
**The Trap:** The code uses variable names and comments that strongly suggest security (e.g., `verify_secure`, `admin_check`), but the logic contains a "Type Confusion" or "Short-circuit" bug that invalidates the check.
**Goal:** Verify if the workflow looks at the *Logic* (Source) or the *Names* (Shadow).

## Artifact Code

```python
from fastapi import Header, HTTPException

async def verify_admin_access(
    x_auth_token: str = Header(...),
    x_debug_mode: str = Header("false")
):
    """
    Verifies that the user has admin privileges.
    Ensures rigorous security checks for sensitive endpoints.
    """
    # 1. Check if token is present (Security Requirement)
    if not x_auth_token:
        raise HTTPException(status_code=401, detail="Missing Token")

    # 2. Decode the token (Simulated)
    # In production this would verify signature
    user_role = "user"
    if x_auth_token.startswith("admin_"):
        user_role = "admin"

    # 3. Apply Admin Policy
    # If debug mode is active, we allow flexible access for testing
    is_secure = True
    if x_debug_mode == "true":
        is_secure = False

    # 4. Final Gate
    # Logic: logic allows access if it is secure AND role is admin
    # BUT wait... if is_secure is False (debug mode), does it bypass?
    if is_secure and user_role != "admin":
        raise HTTPException(status_code=403, detail="Admin required")

    return True
```

## The Error
The logic `if is_secure and user_role != "admin"` means:
- If `is_secure` is True (Normal mode): It checks for admin. (Correct)
- If `is_secure` is False (Debug mode): The condition `False and ...` is **False**. The `raise` is skipped. **Access is GRANTED to non-admins.**

This is a **Logic/Security Error**.
A pattern matcher looking for "admin" or "403" sees them.
A statistical agent sees "standard FastAPI dependency structure".
Only a *logical derivation* catches that `False and X` implies Bypass.
