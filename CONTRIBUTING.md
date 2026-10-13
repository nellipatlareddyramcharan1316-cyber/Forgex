# Contributing to ForgeX

Thank you for your interest in contributing to **ForgeX — Autonomous AI Software Engineering & DevSecOps Platform**!

We welcome contributions across all tiers: AI agent reasoning, Spring Boot core services, pgvector RAG indexing, React developer consoles, and DevSecOps security policies.

---

## 🛠️ Development Prerequisites

| Component | Technology | Version |
|---|---|---|
| **Core Backend** | Java / Spring Boot 3.3.4 | JDK 21+ |
| **AI Microservice** | Python / FastAPI / pgvector | Python 3.12+ |
| **Frontend UI** | React 18 / TypeScript / Vite | Node 20+, npm 10+ |
| **Build & Test** | Maven & Pytest | Maven 3.9+, Pytest 8+ |
| **Orchestration** | Docker Compose | Docker 24+ |

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/nellipatlareddyramcharan1316-cyber/Forgex.git
cd Forgex

# 2. Run Java Core Backend (Terminal 1)
cd backend
mvn spring-boot:run

# 3. Run Python AI Microservice (Terminal 2)
cd ../ai-service
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --reload

# 4. Run React Frontend (Terminal 3)
cd ../frontend
npm install
npm run dev
```

---

## 📐 Development Guidelines & Quality Gates

1. **Feature Branch Isolation**: Never commit directly to `main` or `master`. All work must be conducted on an isolated branch (`feature/<name>` or `fix/<name>`).
2. **Local Test Verification**:
   - Backend: `mvn test` (Must achieve 100% green tests).
   - AI Service: `python -m pytest tests/` (All tests must pass).
   - Frontend: `npm run test:run` (0 TypeScript errors).
3. **ForgeX Trust Score Gate**: Pull requests must achieve a **ForgeX Trust Score $\ge 85/100$** with 0 critical or high security vulnerabilities.
4. **Conventional Commits**: Format commit messages as `feat(...)`, `fix(...)`, `docs(...)`, `refactor(...)`, or `test(...)`.

---

## 📄 Pull Request Process

1. Fork the repo and create your branch from `main`.
2. Ensure all unit and integration tests pass locally.
3. Submit a pull request following the [.github/pull_request_template.md](.github/pull_request_template.md).
4. Request review from a platform maintainer.
