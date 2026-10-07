from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    RequirementRequest, RequirementAnalysisResponse,
    RAGQueryRequest, RAGQueryResponse,
    RepoAnalyzeRequest, RepoAnalysisResponse,
    DevPlanRequest, DevPlanResponse,
    CodeAgentExecuteRequest, CodeAgentExecuteResponse,
    SecurityScanRequest, SecurityScanResponse
)
import services

app = FastAPI(
    title="ForgeX AI Engine & DevSecOps Intelligence Service",
    description="Agentic Software Engineering microservice powering requirements analysis, RAG code intelligence, Dev Planner, and Governed Coding Agent.",
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
            "PHASE_12_AI_CODING_AGENT"
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

# DevSecOps Security Scan
@app.post("/api/ai/security-scan", response_model=SecurityScanResponse)
def api_security_scan(req: SecurityScanRequest):
    return services.perform_security_scan(req)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
