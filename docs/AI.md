# ForgeX AI Architecture & Agentic Intelligence (Phase 8–16, 21)

This document provides a technical deep-dive into ForgeX's AI microservice, RAG vector retrieval pipeline, and signature Trust Score governance algorithm.

---

## 1. Agentic AI Ecosystem

```mermaid
graph TD
    UserReq[User Requirement] --> ReqAnalyzer[AI Requirement Analyzer: Phase 8]
    ReqAnalyzer --> Epics[6 Epics + Stories + Gherkin Criteria]
    
    RepoContext[Codebase Files] --> RAG[RAG Intelligence Engine: Phase 9]
    RAG --> Embeddings[pgvector 1536-dim Embeddings]
    
    Epics & Embeddings --> DevPlanner[AI Development Planner: Phase 11]
    DevPlanner --> Roadmap[8-Step Implementation Plan + Affected Files]
    
    Roadmap --> Approval{Human Developer Approval}
    Approval -->|Approved| CodeAgent[Governed AI Coding Agent: Phase 12]
    
    CodeAgent --> TestAgent[AI Test Agent: Phase 13]
    TestAgent --> ReviewAgent[AI Code Review Agent: Phase 14]
    ReviewAgent --> SecScanner[DevSecOps Security Scanner: Phase 15]
    
    TestAgent & ReviewAgent & SecScanner --> TrustScore[ForgeX AI Trust Score Engine: Phase 16]
    TrustScore --> Gatekeeper{Trust Score >= 90?}
    Gatekeeper -->|Yes: READY| PR[Create GitHub PR & Deploy]
    Gatekeeper -->|No: REVIEW/BLOCKED| Remediation[Halt & Alert Developer]
```

---

## 2. RAG Pipeline Mechanics (Phase 9)

1. **Chunking**: Code files (`SecurityConfig.java`, `UserService.java`, `PaymentService.java`) are parsed into AST symbols (classes, methods).
2. **Dense Embeddings**: Chunks are embedded into vector vectors and stored in PostgreSQL using `pgvector`.
3. **Cosine Similarity Search**:
   $$\text{similarity} = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$$
4. **Context Injection**: Relevant symbols are provided to the LLM with prompt isolation to prevent prompt injection.

---

## 3. Mathematical AI Trust Score Formula (Phase 16 ⭐)

$$\text{Trust Score} = 0.20 \times C_{\text{req}} + 0.20 \times C_{\text{test}} + 0.20 \times S_{\text{sec}} + 0.15 \times Q_{\text{code}} + 0.10 \times D_{\text{dep}} + 0.15 \times R_{\text{ai}}$$

### Score Thresholds
- **90 – 100** ➔ **`READY`** (Deployment Gate: `DEPLOYMENT_APPROVED`)
- **75 – 89** ➔ **`REVIEW`** (Deployment Gate: `PEER_REVIEW_REQUIRED`)
- **50 – 74** ➔ **`CAUTION`** (Deployment Gate: `ADDITIONAL_TESTS_REQUIRED`)
- **< 50** ➔ **`BLOCKED`** (Deployment Gate: `DEPLOYMENT_BLOCKED`)
