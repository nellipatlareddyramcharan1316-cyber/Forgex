from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Phase 8: Requirement Models
class RequirementRequest(BaseModel):
    requirement_text: str
    project_name: Optional[str] = "Online Parking Reservation System"

class UserStory(BaseModel):
    story_key: str
    title: str
    description: str
    acceptance_criteria: List[str]
    estimated_points: int

class Epic(BaseModel):
    epic_name: str
    description: str
    user_stories: List[UserStory]

class ArchitectureProposal(BaseModel):
    overview: str
    suggested_stack: Dict[str, str]
    key_entities: List[str]
    api_endpoints: List[str]

class RequirementAnalysisResponse(BaseModel):
    status: str
    project_name: str
    architecture: ArchitectureProposal
    epics: List[Epic]
    total_stories: int

# Phase 9: RAG / Knowledge Models
class RAGQueryRequest(BaseModel):
    query: str
    repository_id: Optional[str] = "food-delivery-system"

class CodeChunk(BaseModel):
    file_path: str
    symbol_name: str
    line_start: int
    line_end: int
    snippet: str
    relevance_score: float

class RAGQueryResponse(BaseModel):
    query: str
    answer: str
    retrieved_chunks: List[CodeChunk]
    latency_ms: float

# Phase 10: Repo Analyzer Models
class RepoAnalyzeRequest(BaseModel):
    repository_name: str

class RepoAnalysisResponse(BaseModel):
    language: str
    framework: str
    database: str
    architecture_type: str
    architecture_flow: List[str]
    tests_count: int
    coverage_pct: float
    security_findings_count: int
    dependencies_count: int
    summary: str

# Phase 11: AI Development Planner Models
class DevPlanRequest(BaseModel):
    task_description: str
    target_component: Optional[str] = "Authentication Module"

class DevPlanResponse(BaseModel):
    task_description: str
    implementation_steps: List[str]
    files_likely_affected: List[str]
    testing_strategy: List[str]
    safety_guideline: str

# Phase 12: AI Coding Agent Models
class CodeAgentExecuteRequest(BaseModel):
    task_title: str
    branch_name: Optional[str] = "feature/password-reset"
    developer_approved: bool = True

class CodeAgentExecuteResponse(BaseModel):
    task_title: str
    target_branch: str
    safety_rule_enforced: str
    commit_hash: str
    commit_message: str
    changed_files: List[str]
    patch_diff: str
    tests_run: int
    tests_passed: int
    security_status: str
    pr_url: str
    status: str

# Security & Trust Score Models
class SecurityScanRequest(BaseModel):
    code_snippet: str
    dependencies: Optional[List[str]] = []

class SecurityScanResponse(BaseModel):
    scan_status: str
    critical_count: int
    high_count: int
    medium_count: int
    findings: List[Dict[str, Any]]
    is_deployable: bool

class TrustScoreRequest(BaseModel):
    unit_tests_passed: int
    unit_tests_total: int
    integration_tests_passed: int
    integration_tests_total: int
    critical_vulnerabilities: int
    high_vulnerabilities: int
    medium_vulnerabilities: int
    secrets_detected: int
    requirement_coverage_pct: float
