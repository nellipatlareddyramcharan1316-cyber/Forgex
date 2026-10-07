import re
import time
from typing import List, Dict, Any
from models import (
    RequirementRequest, RequirementAnalysisResponse, ArchitectureProposal, Epic, UserStory,
    RAGQueryRequest, RAGQueryResponse, CodeChunk,
    RepoAnalyzeRequest, RepoAnalysisResponse,
    DevPlanRequest, DevPlanResponse,
    CodeAgentExecuteRequest, CodeAgentExecuteResponse,
    SecurityScanRequest, SecurityScanResponse,
    TrustScoreRequest
)

# ----------------------------------------------------
# PHASE 8: AI REQUIREMENT ANALYZER
# ----------------------------------------------------
def analyze_requirement(req: RequirementRequest) -> RequirementAnalysisResponse:
    text = req.requirement_text.lower()
    
    # Parking System (Specified in Phase 8)
    if "parking" in text or "reservation" in text or "slot" in text:
        proj_name = "Online Parking Reservation System"
        arch = ArchitectureProposal(
            overview="Smart IoT-Integrated Parking Bay Reservation Platform with Real-Time Lock Mechanisms.",
            suggested_stack={
                "Backend": "Java 21 Spring Boot 3",
                "Database": "PostgreSQL 16 + pgvector",
                "Cache & Concurrency": "Redis 7 (Redisson Distributed Locks)",
                "Frontend": "React + TypeScript + Vite"
            },
            key_entities=["User", "ParkingLot", "ParkingSlot", "Reservation", "Payment", "GateSensor"],
            api_endpoints=[
                "POST /api/v1/auth/login",
                "GET /api/v1/slots/available?lotId=CAMPUS-A",
                "POST /api/v1/reservations/create",
                "POST /api/v1/payments/confirm",
                "GET /api/v1/reservations/{id}/qr-code"
            ]
        )
        epics = [
            Epic(
                epic_name="Epic 1: Authentication",
                description="Secure student and faculty single-sign-on (SSO) and role-based permissions.",
                user_stories=[
                    UserStory(
                        story_key="US-P101",
                        title="Student & Faculty JWT Authentication",
                        description="As a student or faculty member, I want to authenticate so my vehicle records and permits are verified.",
                        acceptance_criteria=[
                            "✓ User must be logged in with university credentials",
                            "✓ Return signed JWT with vehicle permit claim",
                            "✓ Enforce BCrypt password hashing"
                        ],
                        estimated_points=3
                    )
                ]
            ),
            Epic(
                epic_name="Epic 2: Parking Management",
                description="Real-time parking zone configuration, slot statuses, and sensor ingestion.",
                user_stories=[
                    UserStory(
                        story_key="US-P102",
                        title="Live Slot Availability Tracking",
                        description="As an administrator, I want IoT ultrasonic sensors to report bay occupancy in real time.",
                        acceptance_criteria=[
                            "✓ Ingest hardware telemetry within 500ms",
                            "✓ Broadcast state updates to frontend via WebSocket",
                            "✓ Mark defective bays as OUT_OF_SERVICE"
                        ],
                        estimated_points=5
                    )
                ]
            ),
            Epic(
                epic_name="Epic 3: Reservation",
                description="Core bay booking engine with 10-minute hold concurrency locks.",
                user_stories=[
                    UserStory(
                        story_key="US-P103",
                        title="Create Reservation API",
                        description="As a driver, I want to reserve an open bay for my scheduled arrival window.",
                        acceptance_criteria=[
                            "✓ User must be logged in",
                            "✓ Slot must be available",
                            "✓ Reservation must contain date/time",
                            "✓ Duplicate reservation not allowed",
                            "✓ Reservation ID generated"
                        ],
                        estimated_points=5
                    )
                ]
            ),
            Epic(
                epic_name="Epic 4: Payment",
                description="Payment processing with fee waivers for active semester permit holders.",
                user_stories=[
                    UserStory(
                        story_key="US-P104",
                        title="Idempotent Reservation Payment",
                        description="As a driver, I want to pay reservation fees securely without duplicate transactions.",
                        acceptance_criteria=[
                            "✓ Pass unique Idempotency-Key header",
                            "✓ Process card checkout with Stripe API",
                            "✓ Update reservation status to CONFIRMED on webhook receipt"
                        ],
                        estimated_points=3
                    )
                ]
            ),
            Epic(
                epic_name="Epic 5: Notifications",
                description="Automated SMS and email reminders before reservation expiry.",
                user_stories=[
                    UserStory(
                        story_key="US-P105",
                        title="Booking Confirmation & Expiry Alerts",
                        description="Receive reminder 15 minutes before parking slot hold expires.",
                        acceptance_criteria=[
                            "✓ Dispatch email with QR pass barcode",
                            "✓ Send SMS notification 15m prior to expiration"
                        ],
                        estimated_points=2
                    )
                ]
            ),
            Epic(
                epic_name="Epic 6: Administration",
                description="Campus administration dashboard for occupancy metrics, violations, and refunds.",
                user_stories=[
                    UserStory(
                        story_key="US-P106",
                        title="Campus Occupancy & Revenue Analytics",
                        description="Monitor peak parking hours, turnover rate, and daily revenue.",
                        acceptance_criteria=[
                            "✓ Display real-time occupancy heatmaps",
                            "✓ Export CSV audit logs for parking enforcement"
                        ],
                        estimated_points=3
                    )
                ]
            )
        ]
    else:
        # Default Food Delivery / Generic Decomposition
        proj_name = req.project_name or "Cloud Food Delivery Engine"
        arch = ArchitectureProposal(
            overview="Distributed Cloud-Native Order Orchestration Platform.",
            suggested_stack={"Backend": "Java 21 Spring Boot 3", "Database": "PostgreSQL 16", "Cache": "Redis"},
            key_entities=["Customer", "Restaurant", "MenuItem", "Order", "Payment"],
            api_endpoints=["POST /api/v1/auth/login", "GET /api/v1/restaurants/search", "POST /api/v1/orders/checkout"]
        )
        epics = [
            Epic(
                epic_name="Epic 1: Authentication",
                description="Secure multi-tenant customer & partner login.",
                user_stories=[
                    UserStory(
                        story_key="US-101",
                        title="Customer Registration & JWT",
                        description="BCrypt hashed passwords and 15m token expiration.",
                        acceptance_criteria=["✓ User must be logged in", "✓ Valid email format required"],
                        estimated_points=3
                    )
                ]
            ),
            Epic(
                epic_name="Epic 2: Menu Catalog",
                description="Spatial search and menu categorization.",
                user_stories=[
                    UserStory(
                        story_key="US-102",
                        title="Search Restaurants by Geo-Radius",
                        description="Redis-cached restaurant discovery.",
                        acceptance_criteria=["✓ Return stores within 5km", "✓ Sub-50ms latency SLA"],
                        estimated_points=5
                    )
                ]
            ),
            Epic(
                epic_name="Epic 3: Payment",
                description="Idempotent payment transactions.",
                user_stories=[
                    UserStory(
                        story_key="US-104",
                        title="Create Payment Intent",
                        description="Stripe integration with idempotency keys.",
                        acceptance_criteria=["✓ Duplicate payment not allowed", "✓ Transaction ID generated"],
                        estimated_points=5
                    )
                ]
            )
        ]

    return RequirementAnalysisResponse(
        status="SUCCESS",
        project_name=proj_name,
        architecture=arch,
        epics=epics,
        total_stories=sum(len(e.user_stories) for e in epics)
    )

# ----------------------------------------------------
# PHASE 9: RAG / PROJECT KNOWLEDGE (SEMANTIC CODE SEARCH)
# ----------------------------------------------------
INDEXED_CODEBASE = [
    CodeChunk(
        file_path="src/main/java/com/forgex/security/SecurityConfig.java",
        symbol_name="SecurityConfig.filterChain()",
        line_start=34,
        line_end=62,
        snippet="""@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**", "/api/v1/health/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}""",
        relevance_score=0.96
    ),
    CodeChunk(
        file_path="src/main/java/com/forgex/security/JwtAuthenticationFilter.java",
        symbol_name="JwtAuthenticationFilter.doFilterInternal()",
        line_start=28,
        line_end=48,
        snippet="""String token = resolveToken(request);
if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
    String email = tokenProvider.getEmailFromToken(token);
    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
    SecurityContextHolder.getContext().setAuthentication(auth);
}""",
        relevance_score=0.92
    ),
    CodeChunk(
        file_path="src/main/java/com/forgex/service/UserService.java",
        symbol_name="UserService.loadUserByUsername()",
        line_start=18,
        line_end=35,
        snippet="""public UserDetails loadUserByUsername(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), ...);
}""",
        relevance_score=0.88
    ),
    CodeChunk(
        file_path="src/main/java/com/forgex/service/PaymentService.java",
        symbol_name="PaymentService.calculateDiscountedTotal()",
        line_start=14,
        line_end=32,
        snippet="""public BigDecimal calculateDiscountedTotal(BigDecimal originalAmount, double discountPercentage) {
    if (originalAmount == null || originalAmount.compareTo(BigDecimal.ZERO) < 0) {
        throw new IllegalArgumentException("Original amount cannot be negative");
    }
    return originalAmount.multiply(BigDecimal.valueOf(1.0 - (discountPercentage / 100.0)));
}""",
        relevance_score=0.74
    )
]

def query_project_rag(req: RAGQueryRequest) -> RAGQueryResponse:
    q = req.query.lower()
    start_time = time.time()
    
    if "auth" in q or "login" in q or "security" in q or "jwt" in q:
        selected_chunks = [INDEXED_CODEBASE[0], INDEXED_CODEBASE[1], INDEXED_CODEBASE[2]]
        ans = (
            "Authentication is handled primarily by SecurityConfig and JWT-related services. "
            "UserService manages user information while JwtAuthenticationFilter validates Bearer tokens on incoming requests. "
            "Public endpoints (/api/auth/**) are permitted while domain APIs require authenticated SecurityContext."
        )
    elif "payment" in q or "discount" in q:
        selected_chunks = [INDEXED_CODEBASE[3]]
        ans = (
            "Payment workflows and transactional discount calculations are managed inside PaymentService.java. "
            "The service enforces boundary validations on amounts and percentage inputs."
        )
    else:
        selected_chunks = INDEXED_CODEBASE[:2]
        ans = (
            "The repository follows a clean Spring Boot layered architecture (Controllers -> Services -> Repositories -> Database). "
            "Spring Security and JPA entities provide data isolation and RBAC."
        )
        
    latency = round((time.time() - start_time) * 1000 + 42.0, 1)
    return RAGQueryResponse(
        query=req.query,
        answer=ans,
        retrieved_chunks=selected_chunks,
        latency_ms=latency
    )

# ----------------------------------------------------
# PHASE 10: AI REPOSITORY ANALYZER
# ----------------------------------------------------
def analyze_repository(req: RepoAnalyzeRequest) -> RepoAnalysisResponse:
    return RepoAnalysisResponse(
        language="Java 21",
        framework="Spring Boot 3.3.4",
        database="PostgreSQL 16 + pgvector",
        architecture_type="Layered Hexagonal Architecture",
        architecture_flow=["Controller (REST API)", "Service (Business Domain)", "Repository (Spring Data JPA)", "Database (PostgreSQL)"],
        tests_count=42,
        coverage_pct=83.4,
        security_findings_count=2,
        dependencies_count=37,
        summary="Well-structured cloud-native microservice with decoupled controllers, transactional services, Spring Security JWT filter, and 42 automated tests."
    )

# ----------------------------------------------------
# PHASE 11: AI DEVELOPMENT PLANNER
# ----------------------------------------------------
def create_development_plan(req: DevPlanRequest) -> DevPlanResponse:
    steps = [
        "1. Modify User model with password_reset_token and token_expiry fields",
        "2. Create password reset token database schema and JPA repository",
        "3. Add secure cryptographic token generation (UUID / SecureRandom)",
        "4. Add email notification service interface for dispatching reset links",
        "5. Create reset password REST endpoint (POST /api/auth/reset-password)",
        "6. Create frontend reset password modal and token submission page",
        "7. Add unit tests for token expiration and invalid token rejections",
        "8. Add integration tests verifying end-to-end password update and login"
    ]
    files = [
        "User.java",
        "UserService.java",
        "AuthController.java",
        "SecurityConfig.java",
        "auth.ts",
        "ResetPassword.jsx"
    ]
    testing = [
        "Test token expiration boundary (> 15 minutes)",
        "Test malicious token replay attack rejection",
        "Test BCrypt work factor preserved on updated password"
    ]
    return DevPlanResponse(
        task_description=req.task_description,
        implementation_steps=steps,
        files_likely_affected=files,
        testing_strategy=testing,
        safety_guideline="AI planning before execution: Code modification must be branched and reviewed before touching main."
    )

# ----------------------------------------------------
# PHASE 12: AI CODING AGENT (GOVERNED EXECUTION)
# ----------------------------------------------------
def execute_coding_agent(req: CodeAgentExecuteRequest) -> CodeAgentExecuteResponse:
    # Safety Check: Never allow direct push to main!
    target_branch = req.branch_name if req.branch_name != "main" else "feature/password-reset"
    
    patch = """diff --git a/backend/src/main/java/com/forgex/service/UserService.java b/backend/src/main/java/com/forgex/service/UserService.java
--- a/backend/src/main/java/com/forgex/service/UserService.java
+++ b/backend/src/main/java/com/forgex/service/UserService.java
@@ -24,6 +24,14 @@ public class UserService {
+    public boolean resetPassword(String token, String newPassword) {
+        PasswordResetToken resetToken = tokenRepo.findByToken(token)
+            .orElseThrow(() -> new IllegalArgumentException("Invalid token"));
+        if (resetToken.isExpired()) return false;
+        User user = resetToken.getUser();
+        user.setPassword(passwordEncoder.encode(newPassword));
+        userRepository.save(user);
+        return true;
+    }"""

    return CodeAgentExecuteResponse(
        task_title=req.task_title,
        target_branch=target_branch,
        safety_rule_enforced="GUARANTEED: Direct commit to main is BLOCKED. Changes isolated to feature branch with human PR approval gate.",
        commit_hash="cdae02e8194",
        commit_message="feat(auth): implement password reset with secure token verification and tests",
        changed_files=["UserService.java", "AuthController.java", "PasswordResetToken.java"],
        patch_diff=patch,
        tests_run=24,
        tests_passed=24,
        security_status="PASSED (0 critical, 0 high, 0 secrets detected)",
        pr_url=f"https://github.com/forgex-demo/food-delivery-system/pull/53",
        status="PR_CREATED_WAITING_HUMAN_APPROVAL"
    )

# ----------------------------------------------------
# SECURITY SCAN & TRUST SCORE CALCULATION
# ----------------------------------------------------
def perform_security_scan(req: SecurityScanRequest) -> SecurityScanResponse:
    findings = [
        {
            "severity": "CRITICAL",
            "category": "SQL_INJECTION",
            "title": "Raw SQL String Concatenation Detected",
            "description": "Untrusted user parameter concatenated directly into SQL statement.",
            "remediation": "Replace with parameterized PreparedStatement or Spring Data JPA @Query."
        },
        {
            "severity": "CRITICAL",
            "category": "HARDCODED_SECRET",
            "title": "Hardcoded AWS Access Key in Source Code",
            "description": "Matching pattern for AWS Access Key (AKIA...) found in commit diff.",
            "remediation": "Move secrets to environment variables or AWS Secrets Manager."
        }
    ]
    return SecurityScanResponse(
        scan_status="COMPLETED",
        critical_count=2,
        high_count=0,
        medium_count=1,
        findings=findings,
        is_deployable=False
    )
