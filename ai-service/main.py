from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    RequirementRequest, RequirementAnalysisResponse,
    RepoQueryRequest, RepoIntelligenceResponse,
    CodeGenRequest, CodeGenResponse,
    SecurityScanRequest, SecurityScanResponse,
    TrustScoreRequest, TrustScoreResponse
)
import services

app = FastAPI(
    title="ForgeX AI Engine & DevSecOps Intelligence Service",
    description="Agentic Software Engineering microservice powering requirements analysis, code synthesis, security scanning, and AI Change Trust Scoring.",
    version="1.0.0"
)

# Enable CORS for Frontend (Vite :5173 / React :3000) and Backend (:8080)
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
        "version": "1.0.0",
        "capabilities": [
            "REQUIREMENT_ANALYZER",
            "REPOSITORY_INTELLIGENCE",
            "CODE_AND_TEST_SYNTHESIS",
            "DEVSECOPS_SAST_SCANNER",
            "AI_CHANGE_TRUST_SCORE"
        ]
    }

@app.post("/api/ai/analyze-requirement", response_model=RequirementAnalysisResponse)
def api_analyze_requirement(req: RequirementRequest):
    try:
        return services.analyze_requirement(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/repo-intelligence", response_model=RepoIntelligenceResponse)
def api_repo_intelligence(req: RepoQueryRequest):
    try:
        return services.query_repo_intelligence(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/generate-code", response_model=CodeGenResponse)
def api_generate_code(req: CodeGenRequest):
    try:
        return services.generate_code_and_tests(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/security-scan", response_model=SecurityScanResponse)
def api_security_scan(req: SecurityScanRequest):
    try:
        return services.perform_security_scan(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/trust-score", response_model=TrustScoreResponse)
def api_calculate_trust_score(req: TrustScoreRequest):
    try:
        return services.calculate_trust_score(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
