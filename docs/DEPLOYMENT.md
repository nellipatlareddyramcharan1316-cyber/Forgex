# 🚀 ForgeX Production Deployment & Infrastructure Runbook

This guide covers deployment procedures for ForgeX across local environments, Docker Compose clusters, Kubernetes, and Cloud Container registries (AWS ECS / GCP Cloud Run).

---

## 🏗️ Architecture Overview

The ForgeX production topology consists of four interconnected service tiers:

```
                  ┌──────────────────────┐
                  │   Client / Browser   │
                  └──────────┬───────────┘
                             │
                      [Port 5173 / 80]
                             ▼
                  ┌──────────────────────┐
                  │   Vite React SPA     │
                  └──────────┬───────────┘
                             │ REST / WebSocket
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│ Spring Boot Backend   │         │  FastAPI AI Service   │
│ (Tomcat, Port 8080)   │         │ (Uvicorn, Port 8000)  │
└───────────┬───────────┘         └───────────┬───────────┘
            │                                 │
     JDBC / JPA                        SQLAlchemy / pgvector
            │                                 │
            └────────────────┬────────────────┘
                             ▼
                  ┌───────────────────────┐
                  │ PostgreSQL 16 Cluster │
                  │     (Port 5432)       │
                  └──────────┬────────────┘
                             │
                  ┌──────────┴────────────┐
                  │  Redis 7 In-Memory    │
                  │     (Port 6379)       │
                  └───────────────────────┘
```

---

## 🐳 Option 1: Multi-Container Deployment via Docker Compose

ForgeX ships with a production-grade [docker-compose.yml](file:///d:/build/docker-compose.yml) orchestrating all services with health checks and volume persistence.

### Prerequisites
- Docker Engine 24.0+
- Docker Compose v2.20+
- Minimum 4 GB RAM allocated to Docker

### Starting the Cluster

```bash
# Clone the repository
git clone https://github.com/nellipatlareddyramcharan1316-cyber/Forgex.git
cd Forgex

# Launch all microservices in detached mode
docker compose up -d --build
```

### Checking Service Health

```bash
docker compose ps
```

Expected output:
```
NAME                 IMAGE               COMMAND                  SERVICE             STATUS
forgex-postgres      postgres:16-alpine  "docker-entrypoint.s…"   postgres            healthy (port 5432)
forgex-redis         redis:7-alpine      "docker-entrypoint.s…"   redis               healthy (port 6379)
forgex-backend       forgex-backend      "java -jar /app/app.…"   backend             healthy (port 8080)
forgex-ai-service    forgex-ai-service   "uvicorn main:app -…"    ai-service          healthy (port 8000)
forgex-frontend      forgex-frontend     "/docker-entrypoint.…"   frontend            healthy (port 80)
```

---

## 🖥️ Option 2: Bare-Metal / Local Development Setup

### 1. PostgreSQL 16 & Redis
```powershell
# Ensure PostgreSQL is running on port 5432 with database 'forgex'
psql -U postgres -c "CREATE DATABASE forgex;"

# Ensure Redis is running on port 6379
redis-server
```

### 2. Spring Boot Core Backend
```powershell
cd d:\build\backend
mvn clean package -DskipTests
java -jar target/forgex-backend-1.0.0.jar --server.port=8080
```
- Health Check: `http://localhost:8080/api/v1/health`
- Swagger / OpenAPI: `http://localhost:8080/swagger-ui.html`

### 3. FastAPI AI Engine
```powershell
cd d:\build\ai-service
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
- Health Check: `http://localhost:8000/docs`

### 4. React 18 + Vite Frontend
```powershell
cd d:\build\frontend
npm install
npm run build
npm run preview -- --port 5173
```
- Application Portal: `http://localhost:5173`

---

## 🔒 Production Security Hardening Checklist

| Security Control | Implementation | Verification |
|---|---|---|
| **TLS / SSL Termination** | Let's Encrypt / NGINX Ingress Controller | HTTPS on all public endpoints |
| **JWT Secrets** | Stored in HashiCorp Vault or AWS KMS | Nonce rotation every 24h |
| **CORS Policy** | Whitelisted strict origin domains | Preflight `OPTIONS` validated |
| **Rate Limiting** | Redis token-bucket limiter (100 req/min/IP) | HTTP 429 Too Many Requests |
| **Prompt Injection Defense** | Input sanitization barrier + delimiter containment | `POST /api/ai/security/sanitize-prompt` |
| **SQL Injection Defense** | Parameterized Spring Data JPA & Hibernate queries | SAST CodeQL zero-finding gate |

---

## 📊 CI/CD Automation Pipelines

ForgeX utilizes GitHub Actions located in `.github/workflows/`:

1. **[build.yml](file:///d:/build/.github/workflows/build.yml)**: Builds Spring Boot Maven JAR and Vite bundle on push.
2. **[test.yml](file:///d:/build/.github/workflows/test.yml)**: Executes JUnit 5, Pytest, and Vitest test suites.
3. **[security.yml](file:///d:/build/.github/workflows/security.yml)**: Executes SAST, Gitleaks secret detection, and dependency audit.
4. **[deploy.yml](file:///d:/build/.github/workflows/deploy.yml)**: Gated deployment requiring an **AI Trust Score ≥ 90/100**.

---

## 📈 Monitoring & Telemetry

Production health metrics are exposed via:
- **Spring Actuator**: `http://localhost:8080/actuator/prometheus`
- **FastAPI Telemetry**: `http://localhost:8000/api/ai/monitoring`
- **Grafana Dashboard**: Imports pre-configured JSON dashboard for JVM heap, latency p95, error rates, and AI inference latency.
