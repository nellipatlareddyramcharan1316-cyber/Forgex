# ForgeX REST & AI API Documentation

Complete specification of all REST endpoints exposed by **ForgeX Backend Core** (Port 8080) and **ForgeX AI Engine** (Port 8000).

---

## 1. Authentication & Users (Spring Security + JWT)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account with role selection | Public |
| `POST` | `/api/auth/login` | Authenticate user credentials and return JWT bearer token | Public |
| `POST` | `/api/auth/logout` | Invalidate user session & blacklist token in Redis | Bearer JWT |
| `GET` | `/api/users/me` | Retrieve authenticated user profile and permissions | Bearer JWT |

---

## 2. Project Management & Kanban (Phase 6)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/projects` | List all accessible engineering projects |
| `POST` | `/api/v1/projects` | Create a new project |
| `GET` | `/api/v1/projects/{id}` | Retrieve project details by ID |
| `PUT` | `/api/v1/projects/{id}` | Update project description or repository URL |
| `DELETE` | `/api/v1/projects/{id}` | Delete project |
| `GET` | `/api/v1/projects/{id}/members` | List project team members |
| `POST` | `/api/v1/projects/{id}/members` | Add project team member with role |
| `GET` | `/api/v1/tasks/project/{projectId}` | Retrieve all sprint tasks for project |
| `POST` | `/api/v1/tasks/project/{projectId}` | Create new task |
| `PATCH` | `/api/v1/tasks/{taskId}/status` | Update task status across 7 Kanban stages (`BACKLOG`, `TODO`, `IN_PROGRESS`, `CODE_REVIEW`, `TESTING`, `DONE`, `BLOCKED`) |
| `DELETE` | `/api/v1/tasks/{taskId}` | Delete task |

---

## 3. GitHub Integration Bridge (Phase 7)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/github/status` | Check GitHub OAuth integration status & rate limit |
| `GET` | `/api/v1/github/repositories` | List connected GitHub repositories |
| `GET` | `/api/v1/github/repos/{owner}/{repo}/stats` | Retrieve repository files count, issues, PRs, and languages |
| `POST` | `/api/v1/github/repos/{owner}/{repo}/branches` | Create new Git feature branch |
| `POST` | `/api/v1/github/repos/{owner}/{repo}/issues` | Create new GitHub issue |
| `POST` | `/api/v1/github/repos/{owner}/{repo}/pulls` | Create new Pull Request with AI Trust Score badge |

---

## 4. AI Engine & DevSecOps Services (FastAPI Port 8000)

| Method | Endpoint | Phase | Description |
|---|---|---|---|
| `POST` | `/api/ai/analyze-requirement` | Phase 8 | Decompose natural language requirements into 6 Epics, Stories & Gherkin criteria |
| `POST` | `/api/ai/rag/query` | Phase 9 | Vector semantic code search across indexed repository files |
| `POST` | `/api/ai/repo/analyze` | Phase 10 | Tech stack, test count, coverage, dependencies & layered architecture mapping |
| `POST` | `/api/ai/dev-planner` | Phase 11 | Synthesize 8-step execution plan and predict affected files before code modification |
| `POST` | `/api/ai/code-agent/execute` | Phase 12 | Governed code generation on isolated feature branch with human PR approval gate |
| `POST` | `/api/ai/test-generator` | Phase 13 | Generate 6 categories of tests (Normal, Boundary, Null, Invalid, Exception, Large) for JUnit & Pytest |
| `POST` | `/api/ai/code-review` | Phase 14 | Automated PR inspection for N+1 queries, authorization checks, and review score (88/100) |
| `POST` | `/api/ai/security-scan` | Phase 15 | DevSecOps scanner for secrets, CVEs, and SAST rules |
| `POST` | `/api/ai/trust-score` | Phase 16 | Mathematical 6-variable AI Trust Score governance evaluation |
| `GET` | `/api/ai/monitoring` | Phase 20 | Cluster telemetry (Requests, Latency, Error Rate, CPU, Memory, Health) |
| `POST` | `/api/ai/pm/analyze` | Phase 21 | AI Project Manager analyzing workflow bottlenecks and sprint completion probability |
| `GET` | `/api/ai/analytics/health` | Phase 22 | Overall project health metrics and commit/velocity trends |
| `GET` | `/api/ai/notifications` | Phase 23 | In-app notification queue & alert stream |
| `GET` | `/api/ai/admin/metrics` | Phase 24 | Enterprise administrative control metrics |
| `POST` | `/api/ai/security/sanitize-prompt` | Phase 26 | Prompt injection defense and token isolation |
| `POST` | `/api/ai/demo/execute-scenario` | Phase 30 | Automated 17-step killer demo story runner |
