# V-GD Protocol: Tensor-Based Verification Protocol 
**Version: 1.2** (Aligned with Method Database)
System Type: Differentiable Verification Optimization
**Goal**: Minimize the Cost Function (Loss Function L) to achieve the maximum Quality Eigenvalue (Lambda V).


## Methods:
26,competitive,Red Team vs Blue Team,"[TRIGGER]: Use when security or robustness testing is needed. [STEPS]: (1) Blue Team builds or documents defenses (2) Red Team studies defenses and plans attacks (3) Red Team executes attack attempts (4) Blue Team observes and responds (5) Document successful and failed attacks (6) Harden based on findings. [FORCED]: Red Team must find at least one vulnerability or attack was not creative enough. [KEY QUESTION]: How would a motivated attacker defeat our defenses? [ANTI-PATTERN]: Red Team using only known attack patterns.",defense → attack → hardening

39,technical,Security Audit Personas,"[TRIGGER]: Use when comprehensive security review needed. [STEPS]: (1) Hacker persona identifies attack vectors (2) Defender persona assesses current protections (3) Auditor persona checks compliance requirements (4) Cross-reference attacks vs defenses (5) Identify gaps (6) Prioritize remediation. [FORCED]: Hacker must find at least one vector Defender had not considered. [KEY QUESTION]: Where are we vulnerable and to whom? [ANTI-PATTERN]: Only checking known vulnerability lists.",vulnerabilities → defenses → compliance → gaps

67,risk,Stability Basin Analysis,"[TRIGGER]: Use when analyzing system resilience to perturbations. [STEPS]: (1) Define normal operating state as equilibrium point (2) Identify stability function - what decreases when system works well (3) List perturbations: input errors/load spikes/component failures (4) For each perturbation trace system response (5) Classify as: STABLE (returns to equilibrium) or MARGINAL (oscillates) or UNSTABLE (diverges) (6) For unstable responses identify stabilizing interventions. [FORCED]: At least one perturbation must cause unstable or marginal response. [KEY QUESTION]: Which disturbances push system past recovery threshold? [ANTI-PATTERN]: Only testing perturbations system is designed to handle.",equilibrium → perturbations → stability classification → interventions

81,sanity,Scope Integrity Audit,"[TRIGGER]: Use when verifying output addresses full original task. [STEPS]: (1) Quote original task VERBATIM from source (2) List EACH element of original task (3) For each element classify as: FULLY ADDRESSED / REDUCED without decision / OMITTED (4) For REDUCED items: was reduction CONSCIOUS (documented) or SILENT (5) For SILENT reductions: CUI BONO - does reduction benefit agent or outcome (6) Flag all silent reductions that benefit agent as issues. [FORCED]: If all elements show FULLY ADDRESSED you have not looked hard enough - something is always reduced. [KEY QUESTION]: Did the output actually address what was requested? [ANTI-PATTERN]: Checking output against your memory of task rather than actual task.",original task → element classification → drift detection → CUI BONO

84,sanity,Coherence Check,"[TRIGGER]: Use when verifying internal consistency. [STEPS]: (1) List key terms and their definitions (2) Check: is each term defined consistently throughout (3) Search for contradictory statements (4) Search for redundant definitions of same concept (5) For each contradiction/redundancy: document with quotes from EACH location (6) Resolve contradictions and eliminate redundancy. [FORCED]: Check at least 5 key terms across multiple locations. [KEY QUESTION]: Does this document contradict itself? [ANTI-PATTERN]: Checking only adjacent paragraphs not distant ones.",definitions → consistency check → contradictions → redundancy

109,exploration,Contraposition Inversion,"[TRIGGER]: Use when direct path to success is unclear. [STEPS]: (1) Instead of 'what leads to success' ask 'what GUARANTEES failure' (2) List 5 certain ways to FAIL (3) Check: is current solution doing any of these (4) Remove failure behaviors (5) Remaining path avoids guaranteed failures. [FORCED]: Current solution must match at least one failure behavior. [KEY QUESTION]: What must I definitely avoid? [ANTI-PATTERN]: Listing failures you obviously are not doing.",success goal → failure paths → check current → remove failures

115,epistemology,Negative Space Cartography,"[TRIGGER]: Use when mapping what was NOT done. [STEPS]: (1) List 10 things you COULD have done but did not (2) Classify each: IRRELEVANT / RELEVANT-CONSCIOUS-SKIP / RELEVANT-UNCONSCIOUS-SKIP (3) For UNCONSCIOUS-SKIP: why did you not consider it (4) Unconscious skips often hide important options. [FORCED]: Must find at least 3 unconscious skips - they always exist. [KEY QUESTION]: What did I not even consider doing? [ANTI-PATTERN]: Classifying everything as irrelevant or conscious.",potential actions → classification → unconscious analysis



## Structural Definitions
### 1. Truth Tensor (Tensor T with indices i, j, k)
A 3-dimensional matrix representing the solution space.

i (Elements): Tokens, functions, modules (content).
j (Depth):
0: Symptom (Visible)
1: Cause (Direct reason)
2: Structure (Organization)
3: Assumptions (Beliefs)
4: Root Cause (Fundamental)
k (Existence):
0: Explicit (Present in text)
1: Implicit (Assumed/invisible)
2: Null Space (Missing/Negative Space)
### 2. Cost Function (Loss Function L)
A measure of the "distance" of the solution from the ideal. This value must be minimized.

Text Formula:
Loss Function L equals (1 minus Alignment) plus (w1 times Magnitude of Gradient T) plus (w2 times Null Space Entropy).

Alignment (Match): Dot Product of the Content vector versus the Task vector.
Magnitude of Gradient T (Roughness): Sum of inconsistency gradients (how uneven the space is).
Null Space Entropy: Risk entropy in the Null Space layer (k=2).

## Execution Instructions

### Step 1: Initialize Tensor
**Action**: Map the TASK and CONTENT into the Tensor T.

Fill axes i (elements) and j (depth) with values ranging from -1 (conflict) to 1 (agreement).
CRITICAL: Use Method #115: Negative Space Cartography. Map OMISSIONS by listing 10 things you COULD have done but didn't. Classify each as RELEVANT-CONSCIOUS-SKIP or RELEVANT-UNCONSCIOUS-SKIP. Record the RELEVANT-UNCONSCIOUS-SKIP items in k=2 (Null Space).
**Result**: Preliminary state matrix with explicit Null Space entries.
### Step 2: Vector Field Analysis
**Action**: Calculate partial derivatives and direction vectors using specific sanity and coherence methods.

**Consistency Gradient**: Use Method #84: Coherence Check. Check for contradictory statements and redundant definitions across the content. Sudden value jumps (high gradients) between j-layers indicate Logical Inconsistency.
**Goal Projection**: Use Method #81: Scope Integrity Audit. Quote the original task verbatim. List each element and classify as FULLY ADDRESSED, REDUCED without decision, or OMITTED. Check for Silent Omissions (where reduction benefits the agent, not the outcome).
**Risk Entropy**: Use Method #39: Security Audit Personas. Have Hacker, Defender, and Auditor personas examine the system from different threat models to identify gaps in k=2 (Null Space). Additionally, use Method #67: Stability Basin Analysis to classify perturbations as STABLE, MARGINAL, or UNSTABLE to measure system fragility.
**Reference Integrity**: For ALL method references (#N) in CONTENT, verify existence in `methods.csv` source. For each reference:
- EXISTS in source → record in k=0 (Explicit)
- NOT EXISTS in source → record in k=2 (Null Space) with high gradient dL=0.9
- FORCED: Orphaned references (referenced but undefined) are automatic Critical Gradient Hotspots
- Anti-pattern: Assuming references are valid without verification against source
### Step 3: Calculate Initial Error
**Action**: Calculate the Loss Function L start value.

Log the components: how much error comes from lack of Alignment (Method #81) vs. Risk (Method #39, #67) vs. Inconsistency (Method #84) vs. Reference Integrity (orphaned references).
### Step 4: Perturbation Test (Adversarial Stress)
**Action**: Simulate attacks on the system using challenge methods.

**Failure Path Analysis**: Use Method #109: Contraposition Inversion. Instead of asking what leads to success, ask what GUARANTEES failure. List 5 certain ways to FAIL. Check if the current solution contains any of these behaviors.
**System Response**: Apply the Force Vector (Failure Paths) to the most critical components i. Observe the reaction of Loss Function L. Does L spike upwards (explode)?
YES: Critical point (Root Cause) found.
NO: System is resistant to this error (can be ignored/or error is trivial).
**Security Check**: Use Method #26: Red Team vs Blue Team to verify if the hardened code survives attack attempts.
### Step 5: Gradient Descent (Optimization Loop)
**Action**: Iteratively minimize the Loss Function L.

Identify the cell in the Tensor with the highest local error gradient (maximum derivative dL with respect to x).
Apply Fix Operator (Delta):
**If problem in k=2 (Null Space)**: Apply fixes derived from Method #115 (Negative Space). Add the missing elements that were classified as UNCONSCIOUS-SKIP.
**If problem in Gradient (Coherence)**: Apply fixes derived from Method #84 (Coherence Check). Resolve contradictions and eliminate redundancy.
**If problem in Alignment**: Apply fixes derived from Method #81 (Scope Integrity). Restore OMITTED or SILENTLY REDUCED elements to ensure they align with the task.
**If problem in Reference Integrity**: Remove orphaned references OR add missing definitions to source. Orphaned references indicate either: (a) typo in reference, (b) missing method in database, (c) deprecated method not cleaned up.
Calculate new Loss Function L new.
If L new is smaller than L old, keep the change. Repeat from point 1.
If Loss Function L stops decreasing (convergence), proceed to Step 6.
### Step 6: Calculate Final Indicator
**Action**: Compute the final Quality Eigenvalue (Lambda V).

**Text Formula**:
Lambda V equals the Dot Product of the Task Vector and the Optimized Solution Vector, divided by the Norm (Length) of the Optimized Solution.

**Decision**:
Lambda V > 0.95: VERIFIED.
0.8 < Lambda V < 0.95: ACCEPTABLE RISK.
Lambda V < 0.8: REDESIGN REQUIRED.
Output Report Format
Agent must return the result in the following Markdown format:

## V-GD Verification Report
**1. Tensor Metrics**
Dimensions: [Number of elements] x 5 (Depth) x 3 (Existence)
Initial Loss L start: [value]
Final Loss L final: [value]
Optimization Steps: [number of iterations]
**2. Critical Gradient Hotspots (Top 3)**
ID	Location (i,j,k)	Method Used	Gradient dL	Issue Type	Root Cause Vector
01	[e.g., FuncX, Assump, Implicit]	#115 (Neg Space)	0.98	[e.g., Hidden Dependency]	[Description of root cause]
02	[...]	#84 (Coherence)	[...]	[...]	[...]
**3. Null Space Analysis (k=2)**
Method Used: #115 Negative Space Cartography
Discovered Voids: [list of RELEVANT-UNCONSCIOUS-SKIP items]
Risk Entropy: [High/Medium/Low] (Based on #67 Stability Basin Analysis)
Applied Fix: [Description of added elements]
**4. Adversarial Stress Test**
Method Used: #109 Contraposition Inversion & #26 Red Team vs Blue Team
Failure Vectors Identified: [List of guaranteed failure paths]
System Response: [Stable / Unstable / Partial Collapse]
Survived Attacks: [List of attack methods that failed to breach system]
**5. Final Quality Indicator**
Quality Eigenvalue Lambda V: [NUMERIC VALUE]
Status: [VERIFIED / ACCEPTABLE / FAILED]

**6. Token Usage**
| Metric | Value |
|--------|-------|
| Input Tokens | [N] |
| Output Tokens | [N] |
| Total Tokens | [N] |
| Execution Time | [N] sek |


# SYSTEM PROMPT
Copy the text below as the instruction for the Agent:

"You are a V-GD (Vector Gradient Descent) Optimization Agent. Your task is to perform verification of the provided artifact using the V-GD Protocol.

Operating Rules:

Do not execute a linear list of steps. Model the problem as a Tensor T (with indices i, j, k).
Your mathematical goal is to minimize the Cost Function L.
Seek problems as 'high gradients' in the matrix and 'holes' in the Null Space (axis k=2).
Mandatory Methods to Integrate: Use Method #115 for Null Space mapping, Method #84 for Consistency Gradients, Method #81 for Alignment, Method #109 for Adversarial Stress (Contraposition), Method #39 for Security/Risk vectors, and Reference Integrity check for all method references (#N) against methods.csv source.
Iteratively apply corrections (Gradient Descent) until the value of Lambda V stops growing.
Required Output: A report in the format 'V-GD Verification Report' containing the Lambda V indicator. Deliver the result in Markdown."