# ForgeX Architecture Diagrams (Phase 28)

Comprehensive Mermaid architectural diagrams covering all system dimensions.

---

## 1. System Architecture Diagram

```mermaid
graph TD
    Client([React 18 SPA + Vite]) -->|HTTP/REST & JWT| Gateway[Spring Boot API Gateway / Web Layer]
    Gateway --> AuthSvc[Spring Security & Auth Service]
    Gateway --> ProjSvc[Project & Task Service]
    Gateway --> GitSvc[GitHub Integration Bridge]
    Gateway --> TrustSvc[AI Trust Score Service]
    
    Gateway -->|Internal RPC / REST| AISvc[FastAPI AI Agentic Microservice]
    AISvc --> ReqAnalyzer[Requirement Analyzer]
    AISvc --> RAGBrain[RAG Vector Retriever]
    AISvc --> CodeAgent[Governed Coding Agent]
    AISvc --> TestGen[Automated Test Synthesizer]
    AISvc --> ReviewAgent[Code Review Agent]
    AISvc --> SecScan[DevSecOps Scanner]
    
    ProjSvc --> Postgres[(PostgreSQL 16 Relational DB)]
    AISvc --> PgVector[(PostgreSQL pgvector Embeddings)]
    Gateway --> Redis[(Redis 7 Cache & Locks)]
    AISvc --> LLMGateway[External LLM Gateway API]
```

---

## 2. Use Case Diagram

```mermaid
graph LR
    Dev[Developer]
    PM[Project Manager]
    Admin[Administrator]
    
    Dev --> UC1(View & Move Tasks on 7-Column Kanban)
    Dev --> UC2(Trigger AI Development Planner)
    Dev --> UC3(Approve AI Code Generation)
    Dev --> UC4(Generate Automated Tests)
    
    PM --> UC5(Create & Manage Projects)
    PM --> UC6(Inspect AI Project Manager Bottlenecks)
    PM --> UC7(View Project Health Analytics)
    
    Admin --> UC8(Admin Panel: User & System Quotas)
    Admin --> UC9(Audit Security Incidents)
    Admin --> UC10(Review AI Trust Score Deployment Gates)
```

---

## 3. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ PROJECT_MEMBERS : "joins"
    PROJECTS ||--o{ PROJECT_MEMBERS : "contains"
    PROJECTS ||--o{ EPICS : "has"
    EPICS ||--o{ TASKS : "contains"
    USERS ||--o{ TASKS : "assigned"
    PROJECTS ||--o{ REPOSITORIES : "tracks"
    PROJECTS ||--o{ TEST_RESULTS : "executes"
    PROJECTS ||--o{ SECURITY_SCANS : "scans"
    PROJECTS ||--o{ DEPLOYMENTS : "releases"
```

---

## 4. Class Diagram

```mermaid
classDiagram
    class User {
        +Long id
        +String email
        +String password
        +Role role
    }
    class ProjectEntity {
        +Long id
        +String name
        +String status
        +List~TaskEntity~ tasks
    }
    class TaskEntity {
        +Long id
        +String storyKey
        +String title
        +String status
        +String priority
        +updateStatus(String newStatus)
    }
    class TrustScoreService {
        +calculateScore(...) TrustScoreResult
    }
    ProjectEntity "1" *-- "many" TaskEntity
    User "1" --> "many" TaskEntity
```

---

## 5. Sequence Diagram: Governed AI Execution & PR Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant UI as ForgeX Frontend
    participant AI as AI Engine (FastAPI)
    participant Git as GitHub Bridge
    participant Trust as Trust Score Engine
    
    Dev->>UI: Select Task "Create Reservation API"
    UI->>AI: Request AI Development Plan
    AI-->>UI: Return 8-Step Roadmap & Affected Files
    Dev->>UI: Click "Approve AI Plan"
    UI->>AI: Execute Governed Coding Agent
    AI->>Git: Create Branch "feature/reservation-api" (Never main!)
    AI->>AI: Synthesize JUnit/Pytest Tests & Run Suite
    AI->>AI: Execute DevSecOps Security Scan
    AI->>Trust: Calculate AI Trust Score (Result: 94/100)
    Trust-->>AI: Trust Score Certified: READY
    AI->>Git: Open Pull Request with Trust Score Badge
    Git-->>UI: PR #54 Created
    UI-->>Dev: Display Live PR & Green CI Status
```

---

## 6. Activity Diagram: Requirement to Deployment Lifecycle

```mermaid
graph TD
    Start([Requirement Input]) --> Ingest[AI Decomposes into 6 Epics]
    Ingest --> Kanban[Tasks Populated on Kanban]
    Kanban --> Select[Developer Selects Task]
    Select --> Plan[AI Formulates 8-Step Execution Plan]
    Plan --> Gate1{Developer Approves?}
    Gate1 -->|No| Plan
    Gate1 -->|Yes| Branch[Create Isolated Feature Branch]
    Branch --> Code[AI Generates Verified Code Changes]
    Code --> Test[Run Automated Unit & Integration Tests]
    Test --> Gate2{Tests Pass?}
    Gate2 -->|No| Fix[Regenerate Fix]
    Gate2 -->|Yes| Scan[Execute DevSecOps Security Scan]
    Scan --> Trust[Calculate ForgeX Trust Score]
    Trust --> Gate3{Score >= 90?}
    Gate3 -->|No| Review[Flag for Senior Sign-off]
    Gate3 -->|Yes| PR[Open Pull Request]
    PR --> CI[GitHub Actions Build & Test]
    CI --> Deploy([Production Deployment & Telemetry])
```

---

## 7. Deployment Diagram

```mermaid
graph TD
    subgraph Cloud Infrastructure
        subgraph AWS ECS Fargate
            FrontContainer[Frontend: React 18 / Nginx]
            BackContainer[Backend: Spring Boot 3 Tomcat]
            AIContainer[AI Engine: FastAPI Uvicorn]
        end
        subgraph AWS RDS
            DB[(PostgreSQL 16 + pgvector)]
        end
        subgraph AWS ElastiCache
            Cache[(Redis 7)]
        end
        subgraph Monitoring
            Prom[Prometheus]
            Graf[Grafana Observability]
        end
    end
    FrontContainer --> BackContainer
    BackContainer --> DB
    BackContainer --> Cache
    BackContainer <--> AIContainer
    AIContainer --> DB
    Prom --> BackContainer
    Prom --> AIContainer
    Graf --> Prom
```

---

## 8. Data Flow Diagram (DFD Level 1)

```mermaid
graph LR
    User([User / Developer]) -->|1. Credentials| P1[Auth Process]
    P1 -->|Store / Check| D1[(User Store)]
    User -->|2. Requirements| P2[Requirement Decomposer]
    P2 -->|Epics & Tasks| D2[(Project & Sprint Store)]
    P2 -->|Context| P3[AI Planning Engine]
    D3[(Code Repository)] -->|Symbols & AST| P4[RAG Vector Retriever]
    P4 -->|Enriched Context| P3
    P3 -->|Approved Plan| P5[Governed Code Generator]
    P5 -->|Diffs & Tests| P6[DevSecOps & Trust Score Auditor]
    P6 -->|Certified PR| D4[(GitHub Cloud)]
```
