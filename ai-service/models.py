from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# 1. Requirement Analysis Models
class RequirementRequest(BaseModel):
    requirement_text: str = Field(..., description="Raw requirement prompt from human stakeholder")
    project_name: Optional[str] = "Demo Project"

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

# 2. Repository Intelligence Models
class RepoQueryRequest(BaseModel):
    query: str
    target_service_or_file: Optional[str] = None

class AffectedFile(BaseModel):
    file_path: str
    layer: str  # Controller, Service, Repository, Model, DTO
    impact_level: str  # DIRECT, INDIRECT, LOW
    reason: str

class RepoIntelligenceResponse(BaseModel):
    query: str
    direct_answer: str
    affected_files: List[AffectedFile]
    recommended_test_files: List[str]
    impact_radius_score: int

# 3. Code Generation Models
class CodeGenRequest(BaseModel):
    task_key: str
    task_title: str
    target_component: str
    specifications: List[str]

class GeneratedTestCase(BaseModel):
    name: str
    category: str  # NORMAL, BOUNDARY, INVALID_INPUT, EXCEPTION, REGRESSION
    description: str
    code_snippet: str

class CodeGenResponse(BaseModel):
    task_key: str
    implementation_plan: List[str]
    primary_code: str
    file_path: str
    test_cases: List[GeneratedTestCase]
    total_tests_generated: int

# 4. Security Scan Models
class SecurityScanRequest(BaseModel):
    code_snippet: str
    file_path: Optional[str] = "src/main/java/Service.java"
    dependencies: Optional[List[str]] = []

class SecurityFinding(BaseModel):
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    category: str  # SQL_INJECTION, XSS, HARDCODED_SECRET, VULN_DEPENDENCY, INSECURE_AUTH
    title: str
    description: str
    line_number: Optional[int] = None
    remediation: str

class SecurityScanResponse(BaseModel):
    scan_status: str
    critical_count: int
    high_count: int
    medium_count: int
    findings: List[SecurityFinding]
    is_deployable: bool

# 5. AI Change Trust Score Models
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
    code_quality_pct: Optional[float] = 95.0

class VectorBreakdown(BaseModel):
    name: str
    score: float
    max_weight: float
    status: str
    detail: str

class TrustScoreResponse(BaseModel):
    overall_score: int
    verdict: str  # SAFE TO REVIEW, REQUIRES APPROVAL, BLOCKED - INSECURE
    badge_color: str  # green, yellow, red
    is_safe_to_deploy: bool
    summary_message: str
    vectors: List[VectorBreakdown]
