# AI Change Trust Score — Mathematical Specification & Gating Model

> **Module:** `ForgeX Core Engine / Trust Evaluator`  
> **Signature Feature:** Real-Time AI Change Verification & Safe Deployment Gatekeeper  

---

## 1. Executive Summary

The **AI Change Trust Score** is ForgeX's signature mechanism for replacing blind faith in AI code generation with **verifiable, quantitative software engineering metrics**. 

Rather than presenting an unverified diff directly to a human reviewer or CI pipeline, ForgeX scores every proposed change on an objective scale of **0 to 100**. If security violations, hardcoded secrets, or test failures occur, the score drops sharply and acts as a **hard deployment gate**.

---

## 2. Mathematical Scoring Model

The Trust Score $T \in [0, 100]$ is computed as a weighted summation across seven primary verification vectors, adjusted by deterministic penalty multipliers and hard-gate zeroing conditions:

$$T = \max\left(0, \min\left(100, \sum_{i=1}^{7} (W_i \times S_i) - P_{\text{penalties}}\right)\right)$$

### Verification Vectors & Weights

| Vector ($i$) | Description | Max Weight ($W_i$) | Scoring Criteria ($S_i \in [0, 1]$) |
|---|---|---|---|
| **$V_1$: Unit Tests** | Automated unit test pass rate | **25 pts** | $\frac{\text{Passed Unit Tests}}{\text{Total Unit Tests}}$ |
| **$V_2$: Integration Tests** | Component & API boundary tests | **15 pts** | $\frac{\text{Passed Integration Tests}}{\text{Total Integration Tests}}$ |
| **$V_3$: Vulnerability Scan** | SAST vulnerability check (SQLi, XSS, etc.) | **20 pts** | $1.0$ if 0 vulns, $-1.0$ if Critical, $0.5$ if Low |
| **$V_4$: Secret Scanning** | High-entropy token / secret detection | **15 pts** | $1.0$ if 0 secrets detected; $0.0$ if any detected |
| **$V_5$: Dependency Risk** | Supply chain & SCA vulnerabilities | **10 pts** | $1.0 - (0.3 \times \text{Med} + 0.6 \times \text{High})$ |
| **$V_6$: Requirement Coverage** | User Story acceptance criteria satisfied | **10 pts** | $\frac{\text{Verified Acceptance Criteria}}{\text{Total Criteria}}$ |
| **$V_7$: Static Code Quality** | Linter rules, cyclomatic complexity | **5 pts** | Clean formatting, no dead code, docstrings |

---

## 3. Hard-Gate Zeroing Rules

Regardless of the calculated weighted sum, the final Trust Score is subject to **Hard Zeroing Rules**:

1. **Critical Security Vulnerability Detected:**  
   If any Critical/High SAST finding (e.g. Remote Code Execution, Raw SQL String Concatenation) is confirmed, $T$ is clamped to $\le 30$ and tagged with `BLOCKED - CRITICAL VULNERABILITY`.
2. **Hardcoded Secret Detected:**  
   If high-entropy credentials (AWS keys, GitHub tokens, database passwords) are found in the diff, $T$ is clamped to $\le 20$ and tagged with `BLOCKED - CREDENTIAL EXPOSURE`.
3. **Test Regression:**  
   If existing baseline tests fail after applying the AI patch, deployment is automatically blocked.

---

## 4. Gating Verdicts & Action Matrix

```
       Trust Score Range                        Action & Verdict
┌──────────────────────────────┐       ┌─────────────────────────────────────┐
│       85  ───►  100          │  ───► │  🟢 SAFE TO REVIEW                  │
│                              │       │  Automated PR created, Ready to merge│
├──────────────────────────────┤       ├─────────────────────────────────────┤
│       65  ───►  84           │  ───► │  🟡 REQUIRES SENIOR APPROVAL        │
│                              │       │  PR flagged with warnings (e.g. SCA)│
├──────────────────────────────┤       ├─────────────────────────────────────┤
│        0  ───►  64           │  ───► │  🔴 BLOCKED - CANNOT MERGE          │
│                              │       │  Critical tests or security failed  │
└──────────────────────────────┘       └─────────────────────────────────────┘
```

### Real-World Example Output
```json
{
  "changeId": "chg_9823b1",
  "taskRef": "US-101 (Parking Reservation API)",
  "overallScore": 87,
  "verdict": "SAFE TO REVIEW",
  "breakdown": {
    "unitTests": { "score": 25, "passed": 24, "total": 24, "status": "PASS" },
    "integrationTests": { "score": 15, "passed": 4, "total": 4, "status": "PASS" },
    "securityVulnerabilities": { "score": 20, "critical": 0, "high": 0, "status": "PASS" },
    "secretsDetected": { "score": 15, "detected": 0, "status": "PASS" },
    "dependencyRisk": { "score": 7, "medium": 1, "status": "WARNING", "note": "jackson-databind patch available" },
    "requirementCoverage": { "score": 9.2, "coveragePct": 92.0, "status": "PASS" },
    "codeQuality": { "score": 4.8, "status": "PASS" }
  },
  "deploymentGate": {
    "canDeploy": true,
    "humanApprovalRequired": true,
    "recommendedAction": "Address 1 medium dependency warning, review PR, and merge."
  }
}
```
