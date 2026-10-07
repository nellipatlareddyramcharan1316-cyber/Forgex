from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ==========================================
# Phase 8: Requirement Models
# ==========================================
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

# ==========================================
# Phase 9: RAG / Knowledge Models
# ==========================================
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

# ==========================================
# Phase 10: Repo Analyzer Models
# ==========================================
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

# ==========================================
# Phase 11: AI Development Planner Models
# ==========================================
class DevPlanRequest(BaseModel):
    task_description: str
    target_component: Optional[str] = "Authentication Module"

class DevPlanResponse(BaseModel):
    task_description: str
    implementation_steps: List[str]
    files_likely_affected: List[str]
    testing_strategy: List[str]
    safety_guideline: str

# ==========================================
# Phase 12: AI Coding Agent Models
# ==========================================
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

# ==========================================
# Phase 13: Automated Test Generation Models
# ==========================================
class TestGenRequest(BaseModel):
    function_signature: Optional[str] = "calculateDiscount(double amount, CustomerType type, String couponCode)"
    language: Optional[str] = "Java"
    framework: Optional[str] = "JUnit 5 + Mockito"
    test_types: Optional[List[str]] = ["Unit", "Integration", "API", "Regression"]

class GeneratedTestCase(BaseModel):
    category: str
    test_name: str
    description: str
    code_snippet: str

class TestGenResponse(BaseModel):
    function_signature: str
    language: str
    framework: str
    tests_generated: int
    passed: int
    failed: int
    coverage_pct: float
    test_types: List[str]
    test_cases: List[GeneratedTestCase]
    full_test_code: str

# ==========================================
# Phase 14: AI Code Review Agent Models
# ==========================================
class CodeReviewRequest(BaseModel):
    pull_request_id: Optional[str] = "PR-52"
    repository: Optional[str] = "food-delivery-system"
    code_diff: Optional[str] = ""

class ReviewFinding(BaseModel):
    category: str
    severity: str
    file: str
    line: Optional[int]
    title: str
    description: str
    suggestion: str

class CodeReviewResponse(BaseModel):
    review_score: int
    verdict: str
    findings: List[ReviewFinding]
    quality_score: int
    performance_score: int
    security_score: int
    maintainability_score: int
    summary: str

# ==========================================
# Phase 15: Security Scanner Models
# ==========================================
class SecurityScanRequest(BaseModel):
    repository_name: Optional[str] = "food-delivery-system"
    include_sast: bool = True
    include_secrets: bool = True
    include_dependencies: bool = True

class SecurityFinding(BaseModel):
    id: str
    severity: str
    category: str
    title: str
    file: str
    line: Optional[int]
    code_snippet: Optional[str]
    description: str
    remediation: str

class SecurityScanResponse(BaseModel):
    status: str
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    findings: List[SecurityFinding]
    secret_scan_status: str
    sast_status: str
    dependency_audit_status: str
    is_deployable: bool

# ==========================================
# Phase 16: AI Trust Score Models ⭐
# ==========================================
class TrustScoreRequest(BaseModel):
    requirement_coverage: float = Field(default=95.0, ge=0, le=100)
    test_coverage: float = Field(default=93.0, ge=0, le=100)
    security_score: float = Field(default=98.0, ge=0, le=100)
    code_quality_score: float = Field(default=87.0, ge=0, le=100)
    dependency_risk_score: float = Field(default=85.0, ge=0, le=100)
    ai_review_score: float = Field(default=90.0, ge=0, le=100)

class TrustScoreResponse(BaseModel):
    trust_score: float
    status_band: str
    recommendation: str
    deployment_gate: str
    breakdown: Dict[str, float]
    weights: Dict[str, float]

# ==========================================
# Phase 20: Observability / Monitoring Models
# ==========================================
class MonitoringMetricsResponse(BaseModel):
    requests_total: int
    avg_latency_ms: float
    error_rate_pct: float
    cpu_usage_pct: float
    memory_usage_pct: float
    services: Dict[str, str]
    timestamp: str

# ==========================================
# Phase 21: AI Project Manager Models ⭐
# ==========================================
class PMAnalysisRequest(BaseModel):
    testing_tasks: int = 12
    backend_tasks: int = 2
    frontend_tasks: int = 1
    stale_in_progress_days: int = 4
    stale_tasks_count: int = 5
    missing_test_features: Optional[List[str]] = ["PaymentService (Stripe webhook checkout)"]

class PMBottleneck(BaseModel):
    area: str
    severity: str
    message: str
    action_item: str

class PMAnalysisResponse(BaseModel):
    bottlenecks: List[PMBottleneck]
    sprint_completion_probability: int
    velocity_status: str
    risk_factors: List[str]
    executive_summary: str

# ==========================================
# Phase 22: Project Analytics & Health Models
# ==========================================
class ProjectHealthResponse(BaseModel):
    requirements_pct: int
    tasks_pct: int
    code_pct: int
    testing_pct: int
    security_pct: int
    deployment_pct: int
    overall_health_pct: int
    velocity_history: List[Dict[str, Any]]
    commit_history: List[Dict[str, Any]]

# ==========================================
# Phase 23: Notification Models
# ==========================================
class NotificationItem(BaseModel):
    id: str
    title: str
    message: str
    type: str
    timestamp: str
    read: bool = False

class NotificationListResponse(BaseModel):
    notifications: List[NotificationItem]
    unread_count: int

# ==========================================
# Phase 24: Admin Panel Metrics Models
# ==========================================
class AdminMetricsResponse(BaseModel):
    total_users: int
    projects_count: int
    ai_requests_count: int
    repositories_count: int
    deployments_count: int
    system_health: str
    security_incidents: int

# ==========================================
# Phase 26: Security Hardening / Prompt Injection Models
# ==========================================
class PromptSanitizeRequest(BaseModel):
    prompt_or_code: str

class PromptSanitizeResponse(BaseModel):
    is_safe: bool
    threat_detected: Optional[str]
    sanitized_content: str
    defense_strategy: str

# ==========================================
# Phase 30: Final Killer Demo Scenario Models
# ==========================================
class DemoStep(BaseModel):
    step_number: int
    title: str
    description: str
    artifact_summary: str
    status: str

class DemoScenarioResponse(BaseModel):
    scenario_name: str
    steps: List[DemoStep]
    final_trust_score: int
    deployment_url: str
