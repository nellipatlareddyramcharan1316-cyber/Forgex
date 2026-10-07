from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    RequirementRequest, RequirementAnalysisResponse,
    RAGQueryRequest, RAGQueryResponse,
    RepoAnalyzeRequest, RepoAnalysisResponse,
    DevPlanRequest, DevPlanResponse,
    CodeAgentExecuteRequest, CodeAgentExecuteResponse,
    TestGenRequest, TestGenResponse,
    CodeReviewRequest, CodeReviewResponse,
    SecurityScanRequest, SecurityScanResponse,
    TrustScoreRequest, TrustScoreResponse,
    MonitoringMetricsResponse
)
import services

app = FastAPI(
    title="ForgeX AI Engine & DevSecOps Intelligence Service",
    description="Agentic Software Engineering microservice powering requirements analysis, RAG code intelligence, Dev Planner, Automated Test Generation, AI Code Review, DevSecOps Security Scanning, and AI Trust Score Governance.",
    version="2.0.0"
)

# Enable CORS for Frontend & Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "ForgeX AI Engine",
        "version": "2.0.0",
        "modules": [
            "PHASE_8_REQUIREMENT_ANALYZER",
            "PHASE_9_RAG_CODE_KNOWLEDGE",
            "PHASE_10_REPO_ANALYZER",
            "PHASE_11_AI_DEV_PLANNER",
            "PHASE_12_AI_CODING_AGENT",
            "PHASE_13_AUTOMATED_TEST_GENERATOR",
            "PHASE_14_AI_CODE_REVIEW_AGENT",
            "PHASE_15_SECURITY_SCANNER",
            "PHASE_16_AI_TRUST_SCORE",
            "PHASE_20_PRODUCTION_MONITORING"
        ]
    }

# Phase 8: Requirement Analyzer
@app.post("/api/ai/analyze-requirement", response_model=RequirementAnalysisResponse)
def api_analyze_requirement(req: RequirementRequest):
    return services.analyze_requirement(req)

# Phase 9: RAG / Project Knowledge
@app.post("/api/ai/rag/query", response_model=RAGQueryResponse)
def api_rag_query(req: RAGQueryRequest):
    return services.query_project_rag(req)

# Phase 10: AI Repository Analyzer
@app.post("/api/ai/repo/analyze", response_model=RepoAnalysisResponse)
def api_repo_analyze(req: RepoAnalyzeRequest):
    return services.analyze_repository(req)

# Phase 11: AI Development Planner
@app.post("/api/ai/dev-planner", response_model=DevPlanResponse)
def api_dev_planner(req: DevPlanRequest):
    return services.create_development_plan(req)

# Phase 12: AI Coding Agent
@app.post("/api/ai/code-agent/execute", response_model=CodeAgentExecuteResponse)
def api_coding_agent(req: CodeAgentExecuteRequest):
    return services.execute_coding_agent(req)

# Phase 13: Automated Test Generation
@app.post("/api/ai/test-generator", response_model=TestGenResponse)
def api_test_generator(req: TestGenRequest):
    return services.generate_tests(req)

# Phase 14: AI Code Review Agent
@app.post("/api/ai/code-review", response_model=CodeReviewResponse)
def api_code_review(req: CodeReviewRequest):
    return services.review_pull_request(req)

# Phase 15: Security Scanner (DevSecOps)
@app.post("/api/ai/security-scan", response_model=SecurityScanResponse)
def api_security_scan(req: SecurityScanRequest):
    return services.run_devsecops_scanner(req)

# Phase 16: AI Trust Score ⭐
@app.post("/api/ai/trust-score", response_model=TrustScoreResponse)
def api_trust_score(req: TrustScoreRequest):
    return services.calculate_trust_score(req)

# Phase 20: Production Observability / Monitoring
@app.get("/api/ai/monitoring", response_model=MonitoringMetricsResponse)
def api_monitoring():
    return services.get_production_monitoring()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
