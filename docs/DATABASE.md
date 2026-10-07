# ForgeX Database Architecture & Schema Specification

Complete relational database schema and vector storage architecture for ForgeX.

---

## 1. Storage Overview

- **Primary Relational Store**: PostgreSQL 16 (production) / H2 in-memory (development testing)
- **Vector Embeddings Store**: PostgreSQL `pgvector` extension (`1536`-dimension dense vector embeddings for RAG)
- **In-Memory Cache**: Redis 7 Alpine (distributed locks, session tokens, rate limiting counters)

---

## 2. Core Relational Entities (14 Tables)

```mermaid
erDiagram
    USERS ||--o{ PROJECT_MEMBERS : "joins"
    PROJECTS ||--o{ PROJECT_MEMBERS : "contains"
    PROJECTS ||--o{ REQUIREMENTS : "defines"
    PROJECTS ||--o{ EPICS : "groups"
    PROJECTS ||--o{ TASKS : "manages"
    PROJECTS ||--o{ REPOSITORIES : "links"
    PROJECTS ||--o{ TEST_RESULTS : "records"
    PROJECTS ||--o{ SECURITY_SCANS : "scans"
    PROJECTS ||--o{ DEPLOYMENTS : "deploys"
    REPOSITORIES ||--o{ PULL_REQUESTS : "tracks"
    EPICS ||--o{ TASKS : "contains"
    USERS ||--o{ TASKS : "assigned_to"

    USERS {
        bigint id PK
        string email UK
        string password_hash
        string full_name
        string role
        timestamp created_at
    }

    PROJECTS {
        bigint id PK
        string name
        string description
        string status
        string repository_url
        bigint owner_id FK
        timestamp created_at
    }

    PROJECT_MEMBERS {
        bigint id PK
        bigint project_id FK
        bigint user_id FK
        string role
        timestamp joined_at
    }

    TASKS {
        bigint id PK
        string story_key UK
        string title
        text description
        string status
        string priority
        bigint project_id FK
        bigint epic_id FK
        bigint assignee_id FK
        text acceptance_criteria
        timestamp created_at
    }

    SECURITY_SCANS {
        bigint id PK
        bigint project_id FK
        string scan_type
        int critical_count
        int high_count
        int medium_count
        int low_count
        string status
        timestamp scanned_at
    }

    DEPLOYMENTS {
        bigint id PK
        bigint project_id FK
        string environment
        string version
        string status
        double latency_ms
        timestamp deployed_at
    }
```

---

## 3. Database Indexes for Performance

```sql
-- Fast query lookup for project tasks by status
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);

-- Fast lookup for project members
CREATE INDEX idx_project_members_user ON project_members(project_id, user_id);

-- Fast lookup for user authentication
CREATE INDEX idx_users_email ON users(email);

-- Vector indexing for RAG similarity search (IVFFlat with Cosine distance)
CREATE INDEX idx_code_chunks_embedding ON code_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```
