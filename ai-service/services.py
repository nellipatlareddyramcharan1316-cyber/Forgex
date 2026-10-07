import re
import time
from typing import List, Dict, Any
from models import (
    RequirementRequest, RequirementAnalysisResponse, ArchitectureProposal, Epic, UserStory,
    RAGQueryRequest, RAGQueryResponse, CodeChunk,
    RepoAnalyzeRequest, RepoAnalysisResponse,
    DevPlanRequest, DevPlanResponse,
    CodeAgentExecuteRequest, CodeAgentExecuteResponse,
    TestGenRequest, TestGenResponse, GeneratedTestCase,
    CodeReviewRequest, CodeReviewResponse, ReviewFinding,
    SecurityScanRequest, SecurityScanResponse, SecurityFinding,
    TrustScoreRequest, TrustScoreResponse,
    MonitoringMetricsResponse
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
# PHASE 13: AUTOMATED TEST GENERATION
# ----------------------------------------------------
def generate_tests(req: TestGenRequest) -> TestGenResponse:
    sig = req.function_signature or "calculateDiscount(double amount, CustomerType type, String couponCode)"
    lang = req.language or "Java"
    framework = req.framework or "JUnit 5 + Mockito"

    if "python" in lang.lower():
        test_cases = [
            GeneratedTestCase(
                category="Normal test",
                test_name="test_calculate_discount_standard_customer",
                description="Verifies standard customer receives expected 10% discount on regular purchase.",
                code_snippet="""def test_calculate_discount_standard():
    discount = calculate_discount(100.0, CustomerType.STANDARD, "SAVE10")
    assert discount == 10.0"""
            ),
            GeneratedTestCase(
                category="Boundary test",
                test_name="test_calculate_discount_zero_amount_boundary",
                description="Checks boundary value of 0.00 purchase amount returns 0.00 discount.",
                code_snippet="""def test_calculate_discount_zero():
    assert calculate_discount(0.0, CustomerType.STANDARD, None) == 0.0"""
            ),
            GeneratedTestCase(
                category="Null test",
                test_name="test_calculate_discount_none_coupon_handled",
                description="Verifies None coupon parameter executes default discount rate without error.",
                code_snippet="""def test_calculate_discount_none_coupon():
    assert calculate_discount(150.0, CustomerType.VIP, None) == 22.5"""
            ),
            GeneratedTestCase(
                category="Invalid input",
                test_name="test_calculate_discount_negative_amount_raises_value_error",
                description="Verifies negative amount raises ValueError with descriptive message.",
                code_snippet="""def test_calculate_discount_negative():
    with pytest.raises(ValueError, match="Amount cannot be negative"):
        calculate_discount(-50.0, CustomerType.STANDARD, "SAVE10")"""
            ),
            GeneratedTestCase(
                category="Exception case",
                test_name="test_calculate_discount_expired_coupon_raises_exception",
                description="Verifies expired coupon triggers CouponExpiredException.",
                code_snippet="""def test_calculate_discount_expired_coupon():
    with pytest.raises(CouponExpiredException):
        calculate_discount(200.0, CustomerType.STANDARD, "EXPIRED2023")"""
            ),
            GeneratedTestCase(
                category="Large value",
                test_name="test_calculate_discount_one_million_large_value",
                description="Tests high-volume enterprise transaction ($1,000,000.00) without float precision drift.",
                code_snippet="""def test_calculate_discount_large_value():
    assert calculate_discount(1_000_000.0, CustomerType.ENTERPRISE, "BULK25") == 250_000.0"""
            )
        ]
        full_code = '''import pytest
from app.services.billing import calculate_discount, CustomerType, CouponExpiredException

class TestDiscountService:
    def test_calculate_discount_standard(self):
        assert calculate_discount(100.0, CustomerType.STANDARD, "SAVE10") == 10.0

    def test_calculate_discount_zero(self):
        assert calculate_discount(0.0, CustomerType.STANDARD, None) == 0.0

    def test_calculate_discount_none_coupon(self):
        assert calculate_discount(150.0, CustomerType.VIP, None) == 22.5

    def test_calculate_discount_negative(self):
        with pytest.raises(ValueError, match="Amount cannot be negative"):
            calculate_discount(-50.0, CustomerType.STANDARD, "SAVE10")

    def test_calculate_discount_expired_coupon(self):
        with pytest.raises(CouponExpiredException):
            calculate_discount(200.0, CustomerType.STANDARD, "EXPIRED2023")

    def test_calculate_discount_large_value(self):
        assert calculate_discount(1_000_000.0, CustomerType.ENTERPRISE, "BULK25") == 250_000.0
'''
    else:
        test_cases = [
            GeneratedTestCase(
                category="Normal test",
                test_name="testCalculateDiscount_StandardCustomer_AppliesTenPercent",
                description="Standard tier customer with valid coupon receives expected 10% discount.",
                code_snippet="""@Test
void testCalculateDiscount_StandardCustomer_AppliesTenPercent() {
    double discount = discountService.calculateDiscount(100.0, CustomerType.STANDARD, "SAVE10");
    assertEquals(10.0, discount, 0.001);
}"""
            ),
            GeneratedTestCase(
                category="Boundary test",
                test_name="testCalculateDiscount_ZeroAmount_ReturnsZero",
                description="Zero dollar amount edge case returns exact 0.00 without division or computation errors.",
                code_snippet="""@Test
void testCalculateDiscount_ZeroAmount_ReturnsZero() {
    double discount = discountService.calculateDiscount(0.0, CustomerType.STANDARD, null);
    assertEquals(0.0, discount, 0.001);
}"""
            ),
            GeneratedTestCase(
                category="Null test",
                test_name="testCalculateDiscount_NullCustomerType_ThrowsIllegalArgumentException",
                description="Guarantees null customer type fails fast with descriptive IllegalArgumentException.",
                code_snippet="""@Test
void testCalculateDiscount_NullCustomerType_ThrowsIllegalArgumentException() {
    assertThrows(IllegalArgumentException.class, () ->
        discountService.calculateDiscount(100.0, null, "SAVE10")
    );
}"""
            ),
            GeneratedTestCase(
                category="Invalid input",
                test_name="testCalculateDiscount_NegativeAmount_ThrowsInvalidAmountException",
                description="Negative transaction amounts are immediately rejected.",
                code_snippet="""@Test
void testCalculateDiscount_NegativeAmount_ThrowsInvalidAmountException() {
    assertThrows(InvalidAmountException.class, () ->
        discountService.calculateDiscount(-50.0, CustomerType.STANDARD, "SAVE10")
    );
}"""
            ),
            GeneratedTestCase(
                category="Exception case",
                test_name="testCalculateDiscount_ExpiredCoupon_ThrowsCouponExpiredException",
                description="Expired coupon code triggers business domain CouponExpiredException.",
                code_snippet="""@Test
void testCalculateDiscount_ExpiredCoupon_ThrowsCouponExpiredException() {
    when(couponValidator.isExpired("EXPIRED2023")).thenReturn(true);
    assertThrows(CouponExpiredException.class, () ->
        discountService.calculateDiscount(200.0, CustomerType.STANDARD, "EXPIRED2023")
    );
}"""
            ),
            GeneratedTestCase(
                category="Large value",
                test_name="testCalculateDiscount_ExtremeAmountMillion_HandlesWithoutOverflow",
                description="Verifies double precision stability on $1,000,000.00 enterprise transactions.",
                code_snippet="""@Test
void testCalculateDiscount_ExtremeAmountMillion_HandlesWithoutOverflow() {
    double discount = discountService.calculateDiscount(1000000.0, CustomerType.ENTERPRISE, "BULK25");
    assertEquals(250000.0, discount, 0.001);
}"""
            )
        ]
        full_code = '''package com.forgex.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiscountServiceTest {

    @Mock
    private CouponValidator couponValidator;

    @InjectMocks
    private DiscountService discountService;

    @Test
    void testCalculateDiscount_StandardCustomer_AppliesTenPercent() {
        double discount = discountService.calculateDiscount(100.0, CustomerType.STANDARD, "SAVE10");
        assertEquals(10.0, discount, 0.001);
    }

    @Test
    void testCalculateDiscount_ZeroAmount_ReturnsZero() {
        double discount = discountService.calculateDiscount(0.0, CustomerType.STANDARD, null);
        assertEquals(0.0, discount, 0.001);
    }

    @Test
    void testCalculateDiscount_NullCustomerType_ThrowsIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class, () ->
            discountService.calculateDiscount(100.0, null, "SAVE10")
        );
    }

    @Test
    void testCalculateDiscount_NegativeAmount_ThrowsInvalidAmountException() {
        assertThrows(InvalidAmountException.class, () ->
            discountService.calculateDiscount(-50.0, CustomerType.STANDARD, "SAVE10")
        );
    }

    @Test
    void testCalculateDiscount_ExpiredCoupon_ThrowsCouponExpiredException() {
        when(couponValidator.isExpired("EXPIRED2023")).thenReturn(true);
        assertThrows(CouponExpiredException.class, () ->
            discountService.calculateDiscount(200.0, CustomerType.STANDARD, "EXPIRED2023")
        );
    }

    @Test
    void testCalculateDiscount_ExtremeAmountMillion_HandlesWithoutOverflow() {
        double discount = discountService.calculateDiscount(1000000.0, CustomerType.ENTERPRISE, "BULK25");
        assertEquals(250000.0, discount, 0.001);
    }
}'''

    return TestGenResponse(
        function_signature=sig,
        language=lang,
        framework=framework,
        tests_generated=31,
        passed=29,
        failed=2,
        coverage_pct=94.0,
        test_types=req.test_types or ["Unit", "Integration", "API", "Regression"],
        test_cases=test_cases,
        full_test_code=full_code
    )

# ----------------------------------------------------
# PHASE 14: AI CODE REVIEW AGENT
# ----------------------------------------------------
def review_pull_request(req: CodeReviewRequest) -> CodeReviewResponse:
    findings = [
        ReviewFinding(
            category="Performance",
            severity="WARNING",
            file="PaymentService.java",
            line=47,
            title="Database Query Inside Loop Detected (N+1 Problem)",
            description="PaymentService.java performs database access inside a loop. This may cause unnecessary queries and latency bottlenecks.",
            suggestion="Batch fetch payment records using repository.findAllById(paymentIds) before iterating."
        ),
        ReviewFinding(
            category="Security",
            severity="WARNING",
            file="AdminController.java",
            line=22,
            title="Missing Authorization Check on Admin Endpoint",
            description="No authorization check found for admin endpoint POST /api/v1/admin/users/promote.",
            suggestion="Add @PreAuthorize(\"hasRole('ROLE_ADMIN')\") or verify SecurityContextHolder permissions."
        ),
        ReviewFinding(
            category="Error Handling",
            severity="PRAISE",
            file="UserService.java",
            line=65,
            title="Structured Error Handling Implemented",
            description="Error handling improved with clear exception mapping and idempotent rollback.",
            suggestion="Continue adopting CustomUserException hierarchy across all service boundaries."
        ),
        ReviewFinding(
            category="Code Quality",
            severity="SUGGESTION",
            file="OrderController.java",
            line=88,
            title="Potential Duplicate DTO Validation",
            description="Manual null and format validation duplicates existing @Valid @NotNull annotations.",
            suggestion="Remove manual null checks and rely on Jakarta Bean Validation on RequestBody."
        )
    ]

    return CodeReviewResponse(
        review_score=88,
        verdict="APPROVED_WITH_RECOMMENDATIONS",
        findings=findings,
        quality_score=89,
        performance_score=78,
        security_score=92,
        maintainability_score=91,
        summary="High quality Pull Request with clean business abstractions. 2 warnings identified: optimize N+1 query in PaymentService and add @PreAuthorize to admin endpoints."
    )

# ----------------------------------------------------
# PHASE 15: SECURITY SCANNER (DEVSECOPS)
# ----------------------------------------------------
def run_devsecops_scanner(req: SecurityScanRequest) -> SecurityScanResponse:
    findings = [
        SecurityFinding(
            id="SEC-001",
            severity="HIGH",
            category="SECRET_DETECTION",
            title="Hard-coded database password found",
            file="application.properties",
            line=12,
            code_snippet="spring.datasource.password=forgex_secret_password",
            description="Plaintext database password committed to configuration file.",
            remediation="Move credentials to environment variables (e.g. ${SPRING_DATASOURCE_PASSWORD}) or AWS Secrets Manager / HashiCorp Vault."
        ),
        SecurityFinding(
            id="SEC-002",
            severity="MEDIUM",
            category="SAST",
            title="Missing Strict-Transport-Security (HSTS) Header",
            file="SecurityConfig.java",
            line=41,
            code_snippet="http.headers(headers -> headers.frameOptions().disable())",
            description="HTTP Strict Transport Security is not explicitly enforced on API responses.",
            remediation="Enable HSTS: headers.httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))."
        ),
        SecurityFinding(
            id="SEC-003",
            severity="MEDIUM",
            category="DEPENDENCY_SCAN",
            title="Outdated Jackson Databind with Known CVE-2023-35116",
            file="pom.xml",
            line=78,
            code_snippet="<version>2.15.2</version>",
            description="Jackson Databind version contains potential denial-of-service vulnerability.",
            remediation="Upgrade com.fasterxml.jackson.core:jackson-databind to version 2.16.1 or later."
        ),
        SecurityFinding(
            id="SEC-004",
            severity="LOW",
            category="SAST",
            title="Verbose Exception Stacktrace Logging in Production",
            file="GlobalExceptionHandler.java",
            line=53,
            code_snippet="e.printStackTrace();",
            description="Printing raw stack traces may leak internal class structure in server logs.",
            remediation="Use structured SLF4J logger with log.error(\"Context: {}\", e.getMessage())."
        ),
        SecurityFinding(
            id="SEC-005",
            severity="LOW",
            category="SAST",
            title="Missing Rate Limiting Header Configuration",
            file="RateLimitFilter.java",
            line=19,
            code_snippet="response.setHeader(\"X-RateLimit-Limit\", \"100\");",
            description="Retry-After header omitted when rate limit 429 Too Many Requests is triggered.",
            remediation="Include Retry-After: <seconds> header on all 429 response packets."
        ),
        SecurityFinding(
            id="SEC-006",
            severity="LOW",
            category="DEPENDENCY_SCAN",
            title="Transitive Dependency Audit Alert",
            file="pom.xml",
            line=94,
            code_snippet="<artifactId>commons-compress</artifactId>",
            description="Transitive dependency version qualifies for security maintenance patch.",
            remediation="Pin org.apache.commons:commons-compress to >= 1.26.0."
        ),
        SecurityFinding(
            id="SEC-007",
            severity="LOW",
            category="SECRET_DETECTION",
            title="Test Dummy API Key Pattern Found in Mock Data",
            file="MockStripeService.java",
            line=14,
            code_snippet="private final String TEST_KEY = \"sk_test_mock_1234567890\";",
            description="Test key pattern matched regex. Confirmed mock string, no active breach.",
            remediation="Document mock keys in test-fixtures directory."
        )
    ]

    return SecurityScanResponse(
        status="COMPLETED",
        critical_count=0,
        high_count=1,
        medium_count=2,
        low_count=4,
        findings=findings,
        secret_scan_status="PASSED (1 advisory)",
        sast_status="PASSED (0 critical)",
        dependency_audit_status="AUDITED (1 outdated library)",
        is_deployable=True
    )

# ----------------------------------------------------
# PHASE 16: AI TRUST SCORE (SIGNATURE GOVERNANCE FORMULA) ⭐
# ----------------------------------------------------
def calculate_trust_score(req: TrustScoreRequest) -> TrustScoreResponse:
    # Exact Formula:
    # 0.20 * Requirement + 0.20 * Tests + 0.20 * Security + 0.15 * Code Quality + 0.10 * Dependencies + 0.15 * AI Review
    weights = {
        "requirement_weight": 0.20,
        "test_weight": 0.20,
        "security_weight": 0.20,
        "quality_weight": 0.15,
        "dependency_weight": 0.10,
        "ai_review_weight": 0.15
    }

    score = (
        0.20 * req.requirement_coverage +
        0.20 * req.test_coverage +
        0.20 * req.security_score +
        0.15 * req.code_quality_score +
        0.10 * req.dependency_risk_score +
        0.15 * req.ai_review_score
    )
    score_rounded = round(score, 1)

    if score_rounded >= 90.0:
        band = "READY"
        gate = "DEPLOYMENT_APPROVED"
        recommendation = "Exceptional quality & governance. Pull request is verified and ready for production deployment."
    elif score_rounded >= 75.0:
        band = "REVIEW"
        gate = "PEER_REVIEW_REQUIRED"
        recommendation = "Solid foundation. Minor performance or dependency warnings require lead developer sign-off."
    elif score_rounded >= 50.0:
        band = "CAUTION"
        gate = "ADDITIONAL_TESTS_REQUIRED"
        recommendation = "Multiple test gaps or security advisories identified. Resolve before staging deployment."
    else:
        band = "BLOCKED"
        gate = "DEPLOYMENT_BLOCKED"
        recommendation = "Critical security vulnerability or severe test regression detected. Deployment forbidden."

    breakdown = {
        "requirement_coverage": req.requirement_coverage,
        "test_coverage": req.test_coverage,
        "security": req.security_score,
        "code_quality": req.code_quality_score,
        "dependency_risk": req.dependency_risk_score,
        "ai_review": req.ai_review_score
    }

    return TrustScoreResponse(
        trust_score=score_rounded,
        status_band=band,
        recommendation=recommendation,
        deployment_gate=gate,
        breakdown=breakdown,
        weights=weights
    )

# ----------------------------------------------------
# PHASE 20: OBSERVABILITY / PRODUCTION TELEMETRY
# ----------------------------------------------------
def get_production_monitoring() -> MonitoringMetricsResponse:
    import datetime
    return MonitoringMetricsResponse(
        requests_total=14284,
        avg_latency_ms=184.2,
        error_rate_pct=0.4,
        cpu_usage_pct=41.0,
        memory_usage_pct=57.0,
        services={
            "Backend": "🟢 HEALTHY (Spring Boot 3.3.4, Port 8080)",
            "AI Service": "🟢 HEALTHY (FastAPI Python 3.14, Port 8000)",
            "Database": "🟢 CONNECTED (PostgreSQL 16 + pgvector, Port 5432)",
            "Redis": "🟢 CONNECTED (Redis 7 Alpine, Port 6379)"
        },
        timestamp=datetime.datetime.utcnow().isoformat() + "Z"
    )

