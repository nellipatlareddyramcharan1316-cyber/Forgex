# Security Policy & Vulnerability Disclosure

ForgeX takes the security of autonomous engineering agents, DevSecOps pipelines, and repository integrations seriously.

---

## 🛡️ Supported Versions

| Version | Supported | Maintenance Status |
|---|---|---|
| `2.x` (Current) | :white_check_mark: | Active Security Patches & Threat Mitigation |
| `1.x` | :x: | Deprecated |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or prompt injection exploit within ForgeX:

1. **Do not create a public GitHub issue.**
2. Send a vulnerability disclosure report to **`security@forgex.dev`** (or create a private GitHub Security Advisory).
3. Include:
   - Affected component (Core Backend, AI Microservice, Frontend, or CI/CD).
   - Detailed proof-of-concept (PoC) or reproduction steps.
   - Potential impact (e.g. privilege escalation, secret exfiltration, sandbox bypass).
4. The ForgeX security team will acknowledge receipt within 24 hours and issue a CVE/patch within 72 hours.

---

## 🔒 Security Architecture Highlights

| Layer | Control | Mitigation |
|---|---|---|
| **Branch Governance** | Isolated `feature/*` namespace | AI coding agent is hard-blocked from direct commits to `main`/`master`. |
| **Authentication** | BCrypt + JWT HS256 | Stateless role-based access control with enforced `ROLE_DEVELOPER` defaults. |
| **Prompt Injection Defense** | Token Isolation & Pattern Neutralizer | Prevents prompt hijacking via repository code or untrusted issue titles. |
| **Secret Scanning** | GitLeaks / TruffleHog AST Patterns | Zero hardcoded API keys or unmasked secrets allowed in CI/CD. |
| **Change Trust Score Gate** | Mathematical Gate ($\ge 85/100$) | Blocks deployments if security findings are present, regardless of test coverage. |

*For complete threat models and OWASP LLM Top 10 compliance, see [docs/SECURITY.md](docs/SECURITY.md).*
