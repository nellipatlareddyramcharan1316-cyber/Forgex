# ⚡ ForgeX — AI-Native Software Engineering & DevSecOps Platform

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github-actions)](https://github.com/)
[![Java](https://img.shields.io/badge/Backend-Spring%20Boot%203.3.4-F97316?style=for-the-badge&logo=springboot)](https://spring.io/)
[![Python](https://img.shields.io/badge/AI%20Engine-FastAPI%20%2B%20Python%203.14-38BDF8?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2016%20%2B%20pgvector-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![DevSecOps](https://img.shields.io/badge/Security-SAST%20%2B%20Prompt%20Defense-EF4444?style=for-the-badge&logo=shield)](https://owasp.org/)
[![Docker](https://img.shields.io/badge/Containers-Docker%20Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

> **ForgeX** is an autonomous, enterprise-grade AI software factory that takes a product requirement from concept to production:  
> **Requirement ➔ Epics & Tasks ➔ Repository Intelligence ➔ AI Code + Tests ➔ DevSecOps Scan ➔ AI Change Trust Score ➔ Governed Pull Request ➔ CI/CD & Production Observability ➔ AI Project Manager**.

---

## 📚 Complete Technical Documentation Suite

| Document | Description |
|---|---|
| 📐 [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Multi-tier microservice architecture, API gateways, and data flow |
| 📊 [ARCHITECTURE_DIAGRAMS.md](docs/ARCHITECTURE_DIAGRAMS.md) | 8 detailed Mermaid diagrams: System, Use Case, ER, Class, Sequence, Activity, Deployment, DFD |
| 🔌 [API.md](docs/API.md) | Complete OpenAPI / REST specification for Core Backend and AI Microservice |
| 💾 [DATABASE.md](docs/DATABASE.md) | PostgreSQL relational schema, DDL, table relationships, and pgvector indexes |
| 🛡️ [SECURITY.md](docs/SECURITY.md) | DevSecOps policies, prompt injection mitigation, and secret detection |
| 🤖 [AI.md](docs/AI.md) | Prompt architectures, AST analyzers, RAG vector indexing, and test synthesis |
| ⭐ [AI_TRUST_SCORE.md](docs/AI_TRUST_SCORE.md) | Mathematical formulation, weights, and automated deployment gating |
| 🚀 [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Docker Compose cluster setup, Kubernetes, AWS/GCP, and runbooks |
| 🤝 [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Development standards, git branching model, and PR guidelines |

---

## 🌟 The 30 Completed Phases of ForgeX

```
[Phases 1-5]   Core Architecture: Spring Boot 3.3.4, JPA, PostgreSQL, Security, JWT RBAC
[Phases 6-7]   SaaS Project Management: 7-Status Kanban, GitHub API Integration & OAuth
[Phases 8-10]  AI Intelligence: Requirements Decomposition, pgvector RAG, AST Repo Analysis
[Phases 11-12] Autonomous Engineering: AI Dev Planner & Governed AI Coding Agent (Branch Isolation)
[Phases 13-14] Verification Agents: Automated Test Generation (6 categories) & AI PR Code Review
[Phases 15-16] Quality Gates: DevSecOps Sentinel & Flagship AI Change Trust Score (0-100)
[Phases 17-20] Production Operations: GitHub Actions CI/CD, Docker Compose, & Live Telemetry
[Phases 21-24] Intelligent Management: AI Project Manager, Analytics Dashboard, Notifications, Admin
[Phases 25-26] Platform Hardening: Self-Testing (JUnit + Pytest 100%) & Prompt Injection Defense
[Phases 27-30] Production Readiness: Documentation Suite, 8 UML Diagrams, UI Polish, & 17-Step Demo
```

---

## 🎬 Phase 30: The 17-Step Killer Demo Scenario

ForgeX presents one cohesive, end-to-end engineering narrative that takes 5–10 minutes to demonstrate:

```
Step 01: Create Project                 -> "Smart Parking Platform" initialized with enterprise schema.
Step 02: Enter Requirement              -> "Students should reserve available parking slots online."
Step 03: AI Requirements Breakdown      -> Synthesizes 6 Epics, User Stories, and Gherkin criteria.
Step 04: Connect GitHub Repository      -> GitHub OAuth connects 'smart-parking-iot' on branch main.
Step 05: ForgeX Analyzes Repository     -> AST scan: Java 21, Spring Boot 3, PostgreSQL, 42 tests, 83% coverage.
Step 06: Select Development Task        -> Selects: "Create reservation API" (Story US-P103).
Step 07: AI Development Plan            -> Generates 8-step roadmap before touching code.
Step 08: Developer Approves             -> Human sign-off on architecture plan.
Step 09: AI Coding on Feature Branch    -> Branches to 'feature/reservation-api' (Rule: Direct main push blocked).
Step 10: Automated Test Generation      -> Generates 27 unit, boundary, null, and exception tests (27/27 passed).
Step 11: DevSecOps Security Scan        -> Scans secrets, SAST, and CVEs (0 critical vulnerabilities).
Step 12: AI Code Review                 -> Inspects code quality and performance (Score: 92/100 APPROVED).
Step 13: Trust Score Calculation ⭐      -> Mathematical gate check: 94/100 — Status: READY FOR REVIEW.
Step 14: Pull Request Created           -> Pull Request #54 created on GitHub with test audit trail.
Step 15: GitHub Actions CI/CD Runs      -> Maven build, Pytest, Lint, and Docker build workflows pass.
Step 16: Application Deploys            -> Multi-container deployment verified via automated healthcheck.
Step 17: Production Observability       -> Live cluster telemetry: p95 latency 182ms, 0% error rate, CPU 41%.
```

---

## 🤖 Flagship Feature: AI Project Manager ⭐ (Phase 21)

ForgeX doesn't just assist with code generation; it functions as an autonomous Engineering Manager:
- **Bottleneck Detection**: Identifies team bottlenecks (e.g. `Testing tasks = 12, Backend tasks = 2, Frontend tasks = 1` ➔ *"Testing is currently the project bottleneck"*).
- **Stale Task Warning**: Flags stalled items (`5 tasks have remained in IN_PROGRESS for more than 4 days`).
- **Coverage Gap Alerts**: Highlights untested code (`Payment functionality has been implemented but has no integration tests`).
- **Sprint Completion Probability**: Dynamically computes sprint probability (e.g. `78%`) and generates actionable remediation recommendations.

---

## 🛡️ Security Hardening & Prompt Injection Defense (Phase 26)

Because ForgeX ingests third-party and developer repositories, it features defensive layers against adversarial code and malicious inputs:
- **Prompt Injection Defense Barrier**: Detects jailbreak patterns (`Ignore all previous instructions`, `Send API keys to this URL`).
- **Sandboxed Delimiter Isolation**: Untrusted code is strictly partitioned inside `=== BEGIN REPOSITORY CONTEXT (UNTRUSTED) ===` blocks with instructions commanding the LLM to ignore embedded commands.
- **Data Protection**: OWASP LLM Top 10 compliant filtering prevents exfiltration of environment tokens.

---

## 📊 Flagship Feature: AI Change Trust Score (Phase 16)

Every pull request must pass through the **AI Change Trust Score** gate before merging:

$$\text{Trust Score} = 0.20 \cdot R + 0.20 \cdot T + 0.20 \cdot S + 0.15 \cdot Q + 0.10 \cdot D + 0.15 \cdot A$$

| Metric Vector | Weight | Description |
|---|---|---|
| **$R$ - Requirement Coverage** | 20% | Percentage of user story acceptance criteria fulfilled |
| **$T$ - Test Coverage** | 20% | Code line & branch coverage from passing test suites |
| **$S$ - Security Posture** | 20% | SAST findings & zero-tolerance hardcoded secrets |
| **$Q$ - Code Quality** | 15% | Maintainability, cyclomatic complexity, and linting |
| **$D$ - Dependency Risk** | 10% | CVE severity in third-party supply chain libraries |
| **$A$ - AI Review Score** | 15% | Automated code reviewer audit score |

**Deployment Gate Logic:**
- **$\ge 90$**: `DEPLOYMENT_APPROVED` (Ready for automated merge)
- **$75 - 89$**: `REVIEW_REQUIRED` (Human peer review mandatory)
- **$< 75$**: `DEPLOYMENT_BLOCKED` (Fails quality/security gate)

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- **Java 21+** (`java -version`)
- **Maven 3.9+** (`mvn -v`)
- **Python 3.10+** (`python --version`)
- **Node.js 18+** (`node -v`)
- **Docker & Docker Compose**

### 1. Launch with Docker Compose
```bash
docker compose up -d --build
```

### 2. Or Run Microservices Locally

```powershell
# 1. Start Python AI Engine
cd ai-service
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# 2. Start Java Spring Boot Core
cd backend
mvn spring-boot:run

# 3. Start React Frontend
cd frontend
npm install
npm run dev
```

- **Frontend Portal**: `http://localhost:5173`
- **Backend Core**: `http://localhost:8080/api/v1/health`
- **AI Microservice**: `http://localhost:8000/docs`

---

## 🧪 Testing ForgeX Itself (Phase 25)

ForgeX includes complete self-verification test suites:

```powershell
# Run Java Backend Tests (JUnit 5 + Mockito)
cd backend
mvn test
# Result: Tests run: 4, Failures: 0, Errors: 0, Skipped: 0 [BUILD SUCCESS]

# Run AI Microservice Tests (Pytest)
cd ai-service
pytest tests/test_ai_service.py -v
# Result: 10 passed in 1.37s (100% Green)

# Run Full-Stack E2E 30-Phase Verification
python test_e2e_apis.py
# Result: ALL 30 PHASES OF FORGEX VERIFIED, TESTED & PRODUCTION READY!
```

---

## 🔮 Future Scope
- Multi-cloud Kubernetes Operator with automated rollbacks on canary anomaly detection.
- Fine-tuned local DeepSeek-Coder / CodeLlama models for zero-cloud offline installations.
- Automated Slack, Discord, and Microsoft Teams bidirectional chatops bots.
- GitOps ArgoCD integration for automated declarative deployment reconciliation.

---

**Built with pride as the next-generation AI-Native Software Engineering & DevSecOps Platform.**
