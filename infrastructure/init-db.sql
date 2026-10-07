-- ForgeX PostgreSQL Database Initialization Script with pgvector
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    repository_url VARCHAR(512),
    default_branch VARCHAR(64) DEFAULT 'main',
    status VARCHAR(64) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Requirements Table
CREATE TABLE IF NOT EXISTS requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    raw_prompt TEXT NOT NULL,
    architecture_summary JSONB,
    status VARCHAR(64) DEFAULT 'ANALYZED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Epics and User Stories (Tasks)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES requirements(id) ON DELETE SET NULL,
    story_key VARCHAR(32) NOT NULL,
    epic_name VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    acceptance_criteria JSONB,
    status VARCHAR(64) DEFAULT 'BACKLOG', -- BACKLOG, IN_PROGRESS, IN_REVIEW, DONE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Code Changes & Proposed Diffs
CREATE TABLE IF NOT EXISTS code_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    branch_name VARCHAR(255),
    commit_message VARCHAR(255),
    patch_diff TEXT,
    generated_tests TEXT,
    pr_number INTEGER,
    pr_url VARCHAR(512),
    status VARCHAR(64) DEFAULT 'PENDING_VERIFICATION',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI Change Trust Scores
CREATE TABLE IF NOT EXISTS trust_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_change_id UUID REFERENCES code_changes(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL,
    verdict VARCHAR(64) NOT NULL, -- SAFE_TO_REVIEW, REQUIRES_APPROVAL, BLOCKED
    unit_test_score NUMERIC(5,2),
    integration_test_score NUMERIC(5,2),
    security_score NUMERIC(5,2),
    secrets_score NUMERIC(5,2),
    dependency_score NUMERIC(5,2),
    requirement_coverage NUMERIC(5,2),
    code_quality_score NUMERIC(5,2),
    human_approved BOOLEAN DEFAULT FALSE,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Security Scan Findings
CREATE TABLE IF NOT EXISTS security_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_change_id UUID REFERENCES code_changes(id) ON DELETE CASCADE,
    severity VARCHAR(32) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW, INFO
    category VARCHAR(64) NOT NULL, -- SQL_INJECTION, XSS, SECRET_LEAK, VULN_DEPENDENCY
    description TEXT NOT NULL,
    file_path VARCHAR(512),
    line_number INTEGER,
    remediation_hint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Repository Intelligence & Vector Index
CREATE TABLE IF NOT EXISTS code_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_path VARCHAR(512) NOT NULL,
    symbol_name VARCHAR(255),
    symbol_type VARCHAR(64), -- CLASS, METHOD, INTERFACE, CONFIG
    code_snippet TEXT NOT NULL,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Project for Demo
INSERT INTO projects (id, name, description, repository_url, default_branch, status)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'FoodieFlow - Quick Commerce Delivery',
    'High-throughput hyper-local food ordering and restaurant catalog platform.',
    'https://github.com/forgex-demo/foodieflow',
    'main',
    'ACTIVE'
) ON CONFLICT DO NOTHING;
