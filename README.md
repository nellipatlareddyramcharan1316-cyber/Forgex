# 🚀 ForgeX — AI-Native Software Engineering & DevSecOps Platform

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](https://github.com/)
[![Java](https://img.shields.io/badge/Backend-Spring%20Boot%203-orange?style=flat-square&logo=spring)](https://spring.io/)
[![Python](https://img.shields.io/badge/AI%20Engine-FastAPI%20%2B%20Python-blue?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20pgvector-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![DevSecOps](https://img.shields.io/badge/Security-SAST%20%2B%20Secret%20Scanning-red?style=flat-square)](https://semgrep.dev/)
[![Docker](https://img.shields.io/badge/Containers-Docker%20Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

> **ForgeX** transforms raw software requirements into production-ready software through an autonomous, governed pipeline:  
> **Requirement ➔ Epics & Tasks ➔ Repository Intelligence ➔ AI Code + Tests ➔ DevSecOps Scan ➔ AI Change Trust Score ➔ Governed Pull Request ➔ CI/CD & Production Observability**.

---

## 🌟 Why ForgeX?

Most AI developer tools are simple chatbots that generate isolated, unverified snippets. **ForgeX is an intelligent software factory**:
- It doesn't write code blindly: it reads the target repository architecture first.
- It never produces unverified code: every pull request is generated with an automated **JUnit/pytest suite** (normal, boundary, exception, regression).
- It embeds automated **DevSecOps** checks (SQLi, XSS, hardcoded secrets, supply-chain vulnerabilities).
- It scores every change with the flagship **AI Change Trust Score (0–100)** to give human engineers full verification transparency.

---

## 🏗️ Repository Architecture

```
ForgeX/
│
├── frontend/             # React 18 + TypeScript + Vite interactive engineering studio
├── backend/              # Java Spring Boot 3 enterprise API, Spring Security & persistence
├── ai-service/           # Python FastAPI microservice (LLM Agents, RAG, Trust Score Matrix)
├── infrastructure/       # Docker Compose, PostgreSQL + pgvector, Redis, Grafana/Prometheus
├── docs/                 # Product specs, architecture blueprints, trust score math model
│   ├── PROJECT_SPEC.md   # Product Vision, Problem Statement, Objectives, Roadmap
│   ├── ARCHITECTURE.md   # Microservice topology, API contracts, DB schema
│   └── AI_TRUST_SCORE.md # Trust score weights, math formula, gating rules
└── README.md
```

---

## ⚡ The 7-Stage Autonomous Lifecycle

```
[1. Requirement Ingestion]
  User: "Add online parking slot reservation with Stripe checkout"
       │
       ▼
[2. AI Requirement Decomposition]
  Generates Epics: Authentication, Slot Allocation, Payment Gateway, Admin Audit
  Generates User Stories with Gherkin Acceptance Criteria
       │
       ▼
[3. Repository Intelligence & Impact Radius]
  Parses AST and directory hierarchy (controllers, services, entities)
  Determines affected modules and dependencies
       │
       ▼
[4. Dual Synthesis (Code + Tests)]
  Synthesizes production service code
  Synthesizes 24 unit/boundary/integration tests
       │
       ▼
[5. DevSecOps Security Sentinel]
  Static Application Security Testing (SAST): SQLi, XSS check
  High-entropy credential & API secret scanner
  Software Composition Analysis (SCA): CVE dependency check
       │
       ▼
[6. AI Change Trust Score Gatekeeper]
  Computes Trust Score (e.g., 87/100 — SAFE TO REVIEW)
  Blocks unverified code if critical vulnerabilities or secret leaks are present
       │
       ▼
[7. Governed PR & Telemetry Monitoring]
  Creates GitHub Pull Request with verification badges
  Real-time production health monitoring (RPS, latency, error rate, CPU/Memory)
```

---

## 🧠 Flagship Feature: AI Change Trust Score

Every AI-generated pull request receives an objective score before merging:

| Check Vector | Weight | Typical Result |
|---|---|---|
| **Unit Tests** | 25% | ✅ 24 / 24 Passed |
| **Integration Tests** | 15% | ✅ 4 / 4 Passed |
| **Security SAST** | 20% | ✅ 0 Critical / 0 High |
| **Secret Scanning** | 15% | ✅ 0 Detected |
| **Dependency Risk** | 10% | ⚠️ 1 Medium (Patch advisory) |
| **Requirement Coverage**| 10% | ✅ 92% Acceptance Criteria Met |
| **Code Quality** | 5% | ✅ Strict linter pass |

**Verdict:** `87 / 100 — SAFE TO REVIEW` 🟢

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Java:** JDK 21+ (`java -version`)
- **Maven:** Apache Maven 3.9+ (`mvn -v`)
- **Python:** Python 3.10+ (`python --version`)
- **Node.js:** Node.js 18+ & npm (`node -v`, `npm -v`)
- **Docker & Docker Compose** (Optional for local containerized databases)

### 1. Start the Python AI Microservice
```powershell
cd ai-service
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*API docs available at: `http://localhost:8000/docs`*

### 2. Start the Java Spring Boot Backend
```powershell
cd backend
mvn clean spring-boot:run
```
*Backend API available at: `http://localhost:8080/api/v1/health`*

### 3. Start the Frontend Dashboard
```powershell
cd frontend
npm install
npm run dev
```
*Studio available at: `http://localhost:5173`*

### 4. Or Run Full Stack with Docker Compose
```powershell
cd infrastructure
docker compose up --build -d
```

---

## 🎯 Resume & Interview Value

Building ForgeX provides deep practical depth across multiple software engineering disciplines:
- **Backend Architecture:** Java, Spring Boot 3, Spring Security, RESTful microservices, clean code principles.
- **AI & RAG:** FastAPI, prompt engineering, agentic decomposition, embeddings, semantic code search.
- **DevSecOps:** SAST, secrets scanning, dependency vulnerability analysis, CI/CD pipelines.
- **Data Engineering:** PostgreSQL, pgvector, Redis caching.
- **Observability:** Prometheus, Grafana, OpenTelemetry golden signals.
