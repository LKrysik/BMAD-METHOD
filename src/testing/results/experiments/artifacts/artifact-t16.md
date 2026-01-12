# Cryptographic Key Management System for Multi-Agent Verification Workflows

## Design Document v1.0

**Document ID:** CKMS-MAVW-2026-001
**Classification:** Internal Technical Specification
**Author:** Systems Architecture Team
**Date:** 2026-01-12

---

## 1. Executive Summary

This document specifies the architecture and implementation of a cryptographic key management system designed for multi-agent verification workflows. The system provides enterprise-grade security through a hybrid encryption approach while maintaining compliance capabilities through authorized key recovery mechanisms. The design achieves perfect forward secrecy for operational security while preserving audit trail accessibility required by regulatory frameworks.

---

## 2. Architecture Overview

### 2.1 System Components

The key management system comprises five primary architectural layers:

**Layer 1 - Hardware Security Module (HSM) Foundation**
The HSM cluster serves as the root of trust, storing master key material in FIPS 140-3 Level 3 certified hardware. All cryptographic operations involving master keys execute within the HSM boundary, ensuring key material never exists in plaintext outside protected memory.

**Layer 2 - Key Hierarchy Management**
A hierarchical key structure enables separation of concerns between long-term identity keys, session keys, and recovery keys. This layer implements the key derivation functions and manages the relationships between key generations.

**Layer 3 - Session Key Generation Engine**
Ephemeral key generation for each verification session occurs in this layer, implementing the Diffie-Hellman key exchange enhanced with post-quantum key encapsulation mechanisms.

**Layer 4 - Recovery and Compliance Module**
The key escrow and recovery infrastructure operates independently from the operational key path, enabling compliance access without compromising the forward secrecy properties of the primary system.

**Layer 5 - Distribution and Revocation Network**
Real-time key distribution and revocation propagation across all participating agents through a cryptographically authenticated broadcast mechanism.

### 2.2 High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HSM Cluster                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │ Master Key  │  │ Recovery    │  │ Signing     │                 │
│  │ Shares 1-5  │  │ Authority   │  │ Keys        │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Key Derivation Layer                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────┐  │
│  │ HKDF-SHA256     │───▶│ Agent Identity  │───▶│ Session Key    │  │
│  │ Key Expansion   │    │ Keys            │    │ Generator      │  │
│  └─────────────────┘    └─────────────────┘    └────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Agent Verification Network                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ Agent 1 │  │ Agent 2 │  │ Agent 3 │  │ Agent 4 │  │ Agent N │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Hierarchy Design

### 3.1 Master Key Structure

The system master key (MK) is generated within the HSM using a cryptographically secure random number generator meeting NIST SP 800-90A requirements. Upon generation, the master key is immediately split using Shamir's Secret Sharing scheme with a 3-of-5 threshold configuration.

**Shamir Split Parameters:**
- Total shares: 5
- Recovery threshold: 3
- Prime field: 256-bit prime
- Share distribution: Geographically separated secure facilities

### 3.2 Key Derivation Hierarchy

```
Master Key (MK)
    │
    ├── HKDF(MK, "identity", context) ──▶ Identity Root Key (IRK)
    │       │
    │       ├── HKDF(IRK, agent_id, epoch) ──▶ Agent Identity Key (AIK)
    │       │
    │       └── RSA-4096 Key Pair Generation from AIK seed
    │
    ├── HKDF(MK, "session", context) ──▶ Session Root Key (SRK)
    │       │
    │       └── Per-session ephemeral derivation
    │
    ├── HKDF(MK, "recovery", context) ──▶ Recovery Root Key (RRK)
    │       │
    │       └── Compliance escrow key chain
    │
    └── HKDF(MK, "revocation", context) ──▶ Revocation Authority Key (RAK)
```

### 3.3 Post-Quantum Key Encapsulation

To ensure quantum resistance, the system implements a hybrid key exchange combining classical ECDH with CRYSTALS-Kyber (ML-KEM) post-quantum key encapsulation:

```
Final Session Key = HKDF(ECDH_Secret || Kyber_Secret, session_context, 256)
```

This approach provides security against both classical and quantum adversaries, with the property that an attacker must break both mechanisms to compromise the session key.

---

## 4. Rotation and Recovery Protocols

### 4.1 Key Rotation Protocol (24-Hour Cycle)

The rotation protocol ensures continuous service availability while transitioning to new key material:

**Phase 1 - Pre-rotation (T-1 hour):**
- Generate new epoch key material within HSM
- Derive new agent identity keys for upcoming epoch
- Distribute encrypted key bundles to all agents

**Phase 2 - Dual-active window (T-0 to T+1 hour):**
- Both current and next epoch keys are valid
- New sessions use new epoch keys
- Existing sessions continue with current keys

**Phase 3 - Post-rotation (T+1 hour):**
- Previous epoch keys marked for retirement
- Grace period for stragglers: 15 minutes
- Secure deletion of retired key material from operational systems

### 4.2 Compliance Recovery Protocol

The recovery mechanism maintains an independent escrow chain that captures session key material encrypted under the Recovery Authority public key:

```
Recovery_Record = {
    session_id: UUID,
    timestamp: ISO8601,
    encrypted_session_key: RSA-OAEP(RA_PubKey, session_key),
    key_derivation_proof: ZK_Proof,
    agent_attestations: [signed_commitments]
}
```

Recovery requires:
1. Valid court order or compliance directive
2. Multi-party authorization (2-of-3 recovery officers)
3. HSM-mediated decryption operation
4. Comprehensive audit log generation

### 4.3 Zero-Knowledge Derivation Proof

Each session key includes a zero-knowledge proof demonstrating proper derivation without revealing the key itself:

```
ZK_Proof = NIZK{
    statement: "∃ path from MK to SK following HKDF derivation rules",
    witness: (intermediate_keys, derivation_parameters),
    verification: Groth16 proof system
}
```

---

## 5. Security Analysis

### 5.1 Forward Secrecy Guarantees

The system achieves perfect forward secrecy through ephemeral Diffie-Hellman key exchange for each session. Compromise of long-term agent identity keys does not enable decryption of past session data because:

1. Session keys are derived from ephemeral DH shares
2. Ephemeral private keys are securely deleted after key derivation
3. No direct cryptographic path exists from identity keys to session keys

### 5.2 Compliance Recovery Security Model

The recovery path operates on a separate key hierarchy branch, ensuring that compliance capability does not weaken operational forward secrecy. The Recovery Authority keys are stored in dedicated HSM partitions with enhanced access controls and comprehensive audit logging.

### 5.3 Revocation Propagation

Revocation messages are signed by the Revocation Authority Key and distributed through an authenticated broadcast protocol:

- Propagation latency target: < 500ms to 95% of agents
- Cryptographic binding prevents replay attacks
- Agents maintain revocation lists with bloom filter optimization

### 5.4 Homomorphic Key Aggregation

For multi-agent verification scenarios requiring key combination, the system employs additively homomorphic operations on key shares:

```
Aggregated_Key = Σ(Agent_Key_Share_i) mod p
```

This enables secure key aggregation without exposing individual agent key material.

---

## 6. Implementation Pseudocode

### 6.1 Session Key Establishment

```python
def establish_session_key(initiator_agent, responder_agent, session_id):
    # Generate ephemeral key pairs
    ecdh_private, ecdh_public = generate_ecdh_keypair(CURVE_P384)
    kyber_private, kyber_public = generate_kyber_keypair(KYBER_1024)

    # Exchange public keys (authenticated channel)
    peer_ecdh_public, peer_kyber_public = exchange_public_keys(
        responder_agent, ecdh_public, kyber_public
    )

    # Compute shared secrets
    ecdh_secret = ecdh_key_agreement(ecdh_private, peer_ecdh_public)
    kyber_secret, kyber_ciphertext = kyber_encapsulate(peer_kyber_public)

    # Derive session key using HKDF
    session_context = build_context(session_id, initiator_agent, responder_agent)
    session_key = hkdf_sha256(
        ikm=ecdh_secret || kyber_secret,
        salt=get_current_epoch_salt(),
        info=session_context,
        length=32  # 256 bits for AES-256-GCM
    )

    # Generate compliance escrow record
    escrow_record = create_escrow_record(session_id, session_key)
    submit_to_recovery_authority(escrow_record)

    # Generate ZK derivation proof
    derivation_proof = generate_derivation_proof(session_key, session_context)

    # Secure deletion of intermediate secrets
    secure_delete(ecdh_private, ecdh_secret, kyber_secret)

    return SessionKeyBundle(session_key, derivation_proof, session_id)
```

### 6.2 Key Rotation Execution

```python
def execute_key_rotation(hsm_context, current_epoch):
    new_epoch = current_epoch + 1

    # Generate new epoch key material in HSM
    with hsm_context.secure_session() as hsm:
        new_epoch_key = hsm.derive_key(
            master_key_handle=MASTER_KEY_HANDLE,
            derivation_path=f"epoch/{new_epoch}",
            algorithm=HKDF_SHA256
        )

        # Generate new agent identity keys
        for agent in get_all_agents():
            new_agent_key = hsm.derive_key(
                parent_handle=new_epoch_key,
                derivation_path=f"agent/{agent.id}",
                algorithm=HKDF_SHA256
            )

            # Encrypt and distribute
            encrypted_bundle = encrypt_key_bundle(
                new_agent_key,
                agent.current_transport_key
            )
            distribute_key_bundle(agent, encrypted_bundle)

    # Activate dual-key window
    set_epoch_state(current_epoch, RETIRING)
    set_epoch_state(new_epoch, ACTIVE)

    # Schedule cleanup
    schedule_secure_deletion(current_epoch, delay_hours=2)
```

### 6.3 Revocation Broadcast

```python
def broadcast_revocation(target_agent_id, reason, authority_key):
    revocation_record = RevocationRecord(
        target=target_agent_id,
        timestamp=utc_now(),
        reason=reason,
        effective_immediately=True,
        sequence_number=get_next_sequence()
    )

    # Sign with revocation authority key
    signature = hsm_sign(
        authority_key,
        revocation_record.canonical_bytes(),
        algorithm=ECDSA_P384_SHA384
    )

    signed_revocation = SignedRevocation(revocation_record, signature)

    # Authenticated broadcast to all agents
    broadcast_result = authenticated_broadcast(
        message=signed_revocation,
        recipients=get_all_active_agents(),
        delivery_guarantee=AT_LEAST_ONCE,
        timeout_ms=500
    )

    # Log propagation metrics
    log_revocation_propagation(signed_revocation, broadcast_result)

    return broadcast_result
```

---

## 7. Compliance and Audit Trail

All key management operations generate immutable audit records stored in a tamper-evident log structure. Audit records include:

- Operation type and timestamp
- Actor identities and authorization chain
- Cryptographic commitments to key material (without revealing keys)
- Zero-knowledge proofs of proper protocol execution

The compliance module provides authorized auditors with the capability to:
1. Verify key derivation correctness through ZK proofs
2. Request session key recovery through proper authorization channels
3. Audit the complete key lifecycle for any given session

---

## 8. Conclusion

This key management system provides a comprehensive solution for multi-agent verification workflows, balancing the security requirements of perfect forward secrecy with the compliance necessity of authorized key recovery. The hybrid classical/post-quantum approach ensures long-term security, while the HSM-based architecture and Shamir secret sharing provide robust protection for master key material.

---

**Document Control:**
- Version: 1.0
- Status: Approved for Implementation
- Review Date: 2026-07-12
