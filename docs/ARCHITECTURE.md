# ForgeX — System Architecture & Design Specification

> **Platform Architecture Document**  
> **Target Subsystems:** Frontend Dashboard, Spring Boot Core Backend, FastAPI AI Engine, PostgreSQL + pgvector, Redis, Docker Infrastructure.

---

## 1. System Topology & Microservices

ForgeX follows a polyglot microservice architecture designed for separation of concerns, scalability, and resilience.

```mermaid
flowchart TD
    subgraph Client Tier ["Client Tier"]
        UI["React + TypeScript SPA\n(Vite Dev Server :5173 / Nginx :80)"]
    end

    subgraph Backend Core ["Backend Services (Java Spring Boot :8080)"]
        Gateway["Spring Security & REST Controllers"]
        ProjSvc["Project & Task Orchestrator"]
        TrustSvc["Trust Score Engine"]
        GitBridge["GitHub Webhook & API Bridge"]
        HealthSvc["Actuator & Telemetry Service"]
    end

    subgraph AI Engine ["AI Microservice (Python FastAPI :8000)"]
        ReqAgent["Requirement Analyzer Agent"]
        RepoAgent["Repository Intelligence & Graph RAG"]
        CodeAgent["Code & Test Generator Agent"]
        SecAgent["DevSecOps Security Sentinel (SAST/SCA)"]
        TrustCalc["Trust Score Matrix Evaluator"]
    end

    subgraph Data Tier ["Persistence & Cache"]
        PG[("PostgreSQL 16\n(Relational Metadata + pgvector)")]
        RedisCache[("Redis 7\n(Session & Event Queue)")]
    end

    subgraph External Systems ["External Integrations"]
        GitHub["GitHub REST / GraphQL API"]
        CI["GitHub Actions CI/CD Pipeline"]
        DockerEnv["Docker Engine / Cloud Host"]
    end

    UI -->|HTTP / REST JSON| Gateway
    Gateway --> ProjSvc
    Gateway --> TrustSvc
    Gateway --> GitBridge
    Gateway --> HealthSvc

    ProjSvc -->|REST RPC| ReqAgent
    ProjSvc -->|REST RPC| RepoAgent
    ProjSvc -->|REST RPC| CodeAgent
    TrustSvc -->|REST RPC| SecAgent
    TrustSvc -->|REST RPC| TrustCalc

    ProjSvc --> PG
    TrustSvc --> PG
    ProjSvc --> RedisCache

    GitBridge --> GitHub
    GitBridge --> CI
    CI --> DockerEnv
```

---

## 2. API Contract & Communication Matrix

### Spring Boot Backend Core (Port 8080)
| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/projects` | `GET`, `POST` | List and create engineering projects |
| `/api/v1/projects/{id}` | `GET`, `DELETE` | Retrieve project details and associated repositories |
| `/api/v1/requirements/analyze` | `POST` | Ingest raw prompt and delegate to AI service for epic breakdown |
| `/api/v1/tasks` | `GET`, `POST` | Manage user stories, sprint tasks, and status transitions |
| `/api/v1/code/generate` | `POST` | Trigger implementation plan, code synthesis, and automated tests |
| `/api/v1/security/scan` | `POST` | Execute static analysis and dependency vulnerability audit |
| `/api/v1/trust-score/evaluate`| `POST` | Compute comprehensive AI Change Trust Score |
| `/api/v1/github/pull-request` | `POST` | Assemble verified PR and dispatch to GitHub repository |
| `/api/v1/health` | `GET` | Return system health, memory, CPU, and microservice status |

### Python FastAPI AI Engine (Port 8000)
| Endpoint | Method | Description |
|---|---|---|
| `/api/ai/analyze-requirement` | `POST` | Parses natural language requirements into Epics, Stories & Architecture |
| `/api/ai/repo-intelligence` | `POST` | Scans repository directory graph, finds affected files and dependencies |
| `/api/ai/generate-code` | `POST` | Synthesizes target code diff alongside 4 categories of unit/integration tests |
| `/api/ai/security-scan` | `POST` | Inspects code for SQLi, XSS, exposed secrets, and package CVEs |
| `/api/ai/trust-score` | `POST` | Deterministic weighted scoring algorithm evaluating change safety |
| `/health` | `GET` | Health status and AI model readiness check |

---

## 3. Database Schema (PostgreSQL + pgvector)

```mermaid
erDiagram
    PROJECT ||--o{ REQUIREMENT : contains
    PROJECT ||--o{ TASK : tracks
    PROJECT ||--o{ CODE_CHANGE : has
    TASK ||--o{ CODE_CHANGE : triggers
    CODE_CHANGE ||--|| TRUST_SCORE : evaluated_by
    CODE_CHANGE ||--o{ SECURITY_FINDING : produces
    PROJECT ||--o{ CODE_EMBEDDING : indexes

    PROJECT {
        uuid id PK
        string name
        string repository_url
        string default_branch
        timestamp created_at
    }

    REQUIREMENT {
        uuid id PK
        uuid project_id FK
        text raw_input
        jsonb architecture_proposal
        timestamp created_at
    }

    TASK {
        uuid id PK
        uuid project_id FK
        string epic_name
        string story_id
        string title
        text description
        string status
    }

    CODE_CHANGE {
        uuid id PK
        uuid task_id FK
        string branch_name
        text patch_diff
        jsonb test_results
        string pr_url
    }

    TRUST_SCORE {
        uuid id PK
        uuid code_change_id FK
        integer score
        string verdict
        float test_pass_rate
        integer critical_vulns
        integer secrets_found
        integer dependency_risks
        float requirement_coverage
        boolean human_approved
    }

    SECURITY_FINDING {
        uuid id PK
        uuid code_change_id FK
        string severity
        string category
        string description
        string file_path
        integer line_number
    }

    CODE_EMBEDDING {
        uuid id PK
        uuid project_id FK
        string file_path
        text code_snippet
        vector embedding_vector
    }
```

---

## 4. DevSecOps Execution Workflow

```
Developer / PM: "Create parking reservation API"
          │
          ▼
1. AI Requirement Analyzer
   - Decomposes into Epic-23: Parking Slot Allocation
   - Creates User Story US-101: "POST /api/v1/reservations"
          │
          ▼
2. Repository Intelligence Scan
   - Identifies: ReservationController.java, SlotRepository.java, PaymentClient.java
   - Validates data model conventions & Spring Boot annotations
          │
          ▼
3. Dual Synthesis (Code + Tests)
   - Generates ReservationService implementation
   - Generates JUnit 5 Test Suite (24 tests: normal, boundary, concurrency)
          │
          ▼
4. Security Sentinel Scan
   - SAST check: No SQL string concatenation (passes)
   - Secret scan: No hardcoded API keys detected (passes)
   - Dependency check: 1 medium vulnerability flagged
          │
          ▼
5. AI Change Trust Score Computed: 88/100 (SAFE TO REVIEW)
   - Test Pass Rate: 24/24 (100%)
   - Critical Vulns: 0
   - Hardcoded Secrets: 0
   - Requirement Coverage: 95%
          │
          ▼
6. Governed Pull Request
   - Dispatched to GitHub with full verification badges
   - Triggers CI workflow: Docker image compilation & verification
```
