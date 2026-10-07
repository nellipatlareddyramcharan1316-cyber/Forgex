import re
from typing import List, Dict
from models import (
    RequirementRequest, RequirementAnalysisResponse, ArchitectureProposal, Epic, UserStory,
    RepoQueryRequest, RepoIntelligenceResponse, AffectedFile,
    CodeGenRequest, CodeGenResponse, GeneratedTestCase,
    SecurityScanRequest, SecurityScanResponse, SecurityFinding,
    TrustScoreRequest, TrustScoreResponse, VectorBreakdown
)

def analyze_requirement(req: RequirementRequest) -> RequirementAnalysisResponse:
    text = req.requirement_text.lower()
    
    # Heuristic domain detection for realistic, rich software engineering decomposition
    if "food" in text or "delivery" in text or "restaurant" in text:
        arch = ArchitectureProposal(
            overview="Distributed Cloud-Native Food Delivery & Quick Commerce Engine with Event-Driven Architecture.",
            suggested_stack={
                "Backend": "Java 21 Spring Boot 3 (Microservices)",
                "Frontend": "React + TypeScript + Vite",
                "Database": "PostgreSQL with spatial PostGIS",
                "Cache & Broker": "Redis Cluster + Apache Kafka",
                "Payments": "Stripe SDK + Webhooks"
            },
            key_entities=["CustomerUser", "Restaurant", "MenuItem", "OrderHeader", "OrderItem", "DeliveryRider", "PaymentTransaction"],
            api_endpoints=[
                "POST /api/v1/auth/login",
                "GET /api/v1/restaurants/search?cuisine=italian",
                "POST /api/v1/orders/checkout",
                "POST /api/v1/payments/stripe/intent",
                "GET /api/v1/deliveries/track/{orderId}"
            ]
        )
        epics = [
            Epic(
                epic_name="EPIC-1: User Authentication & Role Management",
                description="Secure multi-tenant authentication supporting Customers, Restaurant Partners, and Riders.",
                user_stories=[
                    UserStory(
                        story_key="US-101",
                        title="Customer Registration & JWT Login",
                        description="As a customer, I want to authenticate securely with email/phone so that my orders and cart are preserved.",
                        acceptance_criteria=[
                            "Given valid credentials, return JWT access token (expiry 15m) and refresh token.",
                            "Given invalid password, reject with HTTP 401 and lock account after 5 failed attempts.",
                            "Password must be hashed using BCrypt (work factor 12)."
                        ],
                        estimated_points=3
                    ),
                    UserStory(
                        story_key="US-102",
                        title="Role-Based Access Control (RBAC)",
                        description="Ensure restaurant managers cannot access customer payment tokens or rider location APIs.",
                        acceptance_criteria=[
                            "Only users with ROLE_RESTAURANT can modify menu items.",
                            "Only users with ROLE_ADMIN can issue system-wide refunds."
                        ],
                        estimated_points=2
                    )
                ]
            ),
            Epic(
                epic_name="EPIC-2: Restaurant Catalog & Real-Time Menu Search",
                description="High-performance menu search and inventory indexing with sub-50ms response times.",
                user_stories=[
                    UserStory(
                        story_key="US-103",
                        title="Search Restaurants by Geo-Radius and Cuisine",
                        description="As a hungry user, I want to discover open restaurants within a 5km radius.",
                        acceptance_criteria=[
                            "Given latitude/longitude coordinates, return restaurants sorted by delivery ETA.",
                            "Results cached in Redis with 60-second TTL."
                        ],
                        estimated_points=5
                    )
                ]
            ),
            Epic(
                epic_name="EPIC-3: Cart Management & Stripe Payment Processing",
                description="ACID-compliant cart checkout and idempotent payment processing.",
                user_stories=[
                    UserStory(
                        story_key="US-104",
                        title="Idempotent Payment Intent Creation",
                        description="As a customer, I want to pay via card with 0% chance of double charging.",
                        acceptance_criteria=[
                            "Client passes unique Idempotency-Key in HTTP header.",
                            "Payment processed through Stripe API v2.",
                            "Store transaction status in PostgreSQL with pessimistic locking."
                        ],
                        estimated_points=5
                    )
                ]
            )
        ]
    elif "parking" in text or "reservation" in text or "slot" in text:
        arch = ArchitectureProposal(
            overview="Smart IoT-Integrated Parking Slot Reservation Platform with Dynamic Concurrency Control.",
            suggested_stack={
                "Backend": "Java 21 Spring Boot 3",
                "Concurrency": "Redis Distributed Locks (Redisson)",
                "Database": "PostgreSQL 16 + pgvector",
                "Frontend": "React + TypeScript"
            },
            key_entities=["User", "ParkingLot", "ParkingSlot", "Reservation", "Payment", "GateTelemetry"],
            api_endpoints=[
                "POST /api/v1/auth/login",
                "GET /api/v1/slots/available?lotId=LOT-4",
                "POST /api/v1/reservations/hold",
                "POST /api/v1/reservations/confirm",
                "GET /api/v1/slots/{slotId}/sensor-status"
            ]
        )
        epics = [
            Epic(
                epic_name="EPIC-1: Parking Slot Allocation Engine",
                description="Real-time reservation of bays with race-condition prevention.",
                user_stories=[
                    UserStory(
                        story_key="US-201",
                        title="Reserve Parking Slot with 10-Minute Hold Lock",
                        description="As a driver, I want to reserve an open bay for 10 minutes while I complete payment.",
                        acceptance_criteria=[
                            "Acquire Redis lock on slot_id to prevent double-booking.",
                            "If payment is not completed within 10 minutes, slot status automatically reverts to AVAILABLE.",
                            "Return reservation token with QR code payload."
                        ],
                        estimated_points=5
                    )
                ]
            )
        ]
    else:
        # Generic Domain Fallback
        arch = ArchitectureProposal(
            overview="Modular Cloud-Native System Architecture customized for enterprise scalability.",
            suggested_stack={
                "Backend": "Java 21 Spring Boot 3",
                "Frontend": "React + TypeScript",
                "Database": "PostgreSQL 16 + pgvector",
                "DevSecOps": "Docker + Semgrep SAST"
            },
            key_entities=["UserAccount", "CoreEntity", "AuditLog", "Transaction"],
            api_endpoints=[
                "POST /api/v1/auth/token",
                "GET /api/v1/entities",
                "POST /api/v1/entities",
                "GET /api/v1/health"
            ]
        )
        epics = [
            Epic(
                epic_name="EPIC-1: Core Domain Infrastructure & API Gateway",
                description="Foundational entities, security policies, and standard REST contracts.",
                user_stories=[
                    UserStory(
                        story_key="US-001",
                        title="Authentication and Session Verification",
                        description="Enable secure user login and permission validation.",
                        acceptance_criteria=[
                            "Issue signed JWT with 15-minute expiration.",
                            "Validate all non-public routes with bearer token."
                        ],
                        estimated_points=3
                    ),
                    UserStory(
                        story_key="US-002",
                        title="Core Entity Ingestion & Validation",
                        description="Provide create, update, and search APIs with input validation.",
                        acceptance_criteria=[
                            "Reject invalid payload with structured HTTP 400 response.",
                            "Persist records in PostgreSQL with full audit timestamps."
                        ],
                        estimated_points=5
                    )
                ]
            )
        ]

    total_stories = sum(len(e.user_stories) for e in epics)
    return RequirementAnalysisResponse(
        status="SUCCESS",
        project_name=req.project_name or "ForgeX Target Project",
        architecture=arch,
        epics=epics,
        total_stories=total_stories
    )

def query_repo_intelligence(req: RepoQueryRequest) -> RepoIntelligenceResponse:
    q = req.query.lower()
    
    if "payment" in q:
        affected = [
            AffectedFile(file_path="src/main/java/com/forgex/service/PaymentService.java", layer="Service", impact_level="DIRECT", reason="Core business logic for Stripe checkout & idempotency keys."),
            AffectedFile(file_path="src/main/java/com/forgex/controller/PaymentController.java", layer="Controller", impact_level="DIRECT", reason="REST endpoints exposing /api/v1/payments/stripe/intent."),
            AffectedFile(file_path="src/main/java/com/forgex/repository/PaymentRepository.java", layer="Repository", impact_level="INDIRECT", reason="Data persistence queries for PaymentTransaction entity."),
            AffectedFile(file_path="src/main/java/com/forgex/dto/PaymentRequestDto.java", layer="DTO", impact_level="DIRECT", reason="Input payload schema and validation annotations.")
        ]
        test_files = [
            "src/test/java/com/forgex/service/PaymentServiceTest.java",
            "src/test/java/com/forgex/controller/PaymentControllerIntegrationTest.java"
        ]
        ans = "Modifying the Payment Service directly impacts PaymentController, PaymentRepository, and PaymentRequestDto. Concurrency locks and Stripe webhooks must be verified."
        radius = 4
    elif "auth" in q or "user" in q or "login" in q:
        affected = [
            AffectedFile(file_path="src/main/java/com/forgex/security/JwtAuthenticationFilter.java", layer="Security", impact_level="DIRECT", reason="Intercepts incoming HTTP requests to validate Bearer tokens."),
            AffectedFile(file_path="src/main/java/com/forgex/service/UserService.java", layer="Service", impact_level="DIRECT", reason="Manages user entity lookups and password hashing."),
            AffectedFile(file_path="src/main/java/com/forgex/controller/AuthController.java", layer="Controller", impact_level="DIRECT", reason="Public endpoints for /api/v1/auth/login and /register.")
        ]
        test_files = [
            "src/test/java/com/forgex/security/JwtAuthenticationFilterTest.java",
            "src/test/java/com/forgex/controller/AuthControllerTest.java"
        ]
        ans = "Authentication is configured in Spring Security filter chain with JwtAuthenticationFilter and UserService."
        radius = 3
    else:
        affected = [
            AffectedFile(file_path="src/main/java/com/forgex/service/OrderService.java", layer="Service", impact_level="DIRECT", reason="Core workflow orchestrator."),
            AffectedFile(file_path="src/main/java/com/forgex/controller/OrderController.java", layer="Controller", impact_level="DIRECT", reason="REST API facade.")
        ]
        test_files = [
            "src/test/java/com/forgex/service/OrderServiceTest.java"
        ]
        ans = "General service layer modification. Recommended reviewing downstream event listeners and repository query methods."
        radius = 2

    return RepoIntelligenceResponse(
        query=req.query,
        direct_answer=ans,
        affected_files=affected,
        recommended_test_files=test_files,
        impact_radius_score=radius
    )

def generate_code_and_tests(req: CodeGenRequest) -> CodeGenResponse:
    primary_code = f"""// Generated by ForgeX AI Developer Agent for [{req.task_key}] {req.task_title}
package com.forgex.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.Objects;

@Service
public class {req.target_component} {{

    /**
     * Calculates final transaction total with tiered promotional discount.
     * Guaranteed pure function with boundary validation.
     */
    public BigDecimal calculateDiscountedTotal(BigDecimal originalAmount, double discountPercentage) {{
        if (originalAmount == null || originalAmount.compareTo(BigDecimal.ZERO) < 0) {{
            throw new IllegalArgumentException("Original amount cannot be null or negative");
        }}
        if (discountPercentage < 0.0 || discountPercentage > 100.0) {{
            throw new IllegalArgumentException("Discount percentage must be between 0.0 and 100.0");
        }}

        BigDecimal discountFactor = BigDecimal.valueOf(1.0 - (discountPercentage / 100.0));
        return originalAmount.multiply(discountFactor).setScale(2, java.math.RoundingMode.HALF_UP);
    }}

    @Transactional
    public boolean processReservation(String slotId, String userId) {{
        Objects.requireNonNull(slotId, "Slot ID is required");
        Objects.requireNonNull(userId, "User ID is required");
        // Safe, parameterized execution flow
        return true;
    }}
}}
"""
    
    test_cases = [
        GeneratedTestCase(
            name="testStandardDiscountCalculation_HappyPath",
            category="NORMAL",
            description="Verifies standard 10% discount on $100.00 produces $90.00.",
            code_snippet="@Test\nvoid testStandardDiscountCalculation_HappyPath() {\n    BigDecimal result = service.calculateDiscountedTotal(new BigDecimal(\"100.00\"), 10.0);\n    assertEquals(new BigDecimal(\"90.00\"), result);\n}"
        ),
        GeneratedTestCase(
            name="testZeroDiscount_BoundaryCase",
            category="BOUNDARY",
            description="Verifies 0% discount retains full original value.",
            code_snippet="@Test\nvoid testZeroDiscount_BoundaryCase() {\n    BigDecimal result = service.calculateDiscountedTotal(new BigDecimal(\"50.00\"), 0.0);\n    assertEquals(new BigDecimal(\"50.00\"), result);\n}"
        ),
        GeneratedTestCase(
            name="testHundredPercentDiscount_BoundaryCase",
            category="BOUNDARY",
            description="Verifies 100% discount reduces amount to $0.00.",
            code_snippet="@Test\nvoid testHundredPercentDiscount_BoundaryCase() {\n    BigDecimal result = service.calculateDiscountedTotal(new BigDecimal(\"250.00\"), 100.0);\n    assertEquals(new BigDecimal(\"0.00\"), result);\n}"
        ),
        GeneratedTestCase(
            name="testNegativeAmount_InvalidInputException",
            category="EXCEPTION",
            description="Verifies IllegalArgumentException when amount is negative.",
            code_snippet="@Test\nvoid testNegativeAmount_InvalidInputException() {\n    assertThrows(IllegalArgumentException.class, () -> \n        service.calculateDiscountedTotal(new BigDecimal(\"-10.00\"), 15.0));\n}"
        ),
        GeneratedTestCase(
            name="testInvalidDiscountPercentage_Exception",
            category="INVALID_INPUT",
            description="Verifies discount > 100.0 is cleanly rejected.",
            code_snippet="@Test\nvoid testInvalidDiscountPercentage_Exception() {\n    assertThrows(IllegalArgumentException.class, () -> \n        service.calculateDiscountedTotal(new BigDecimal(\"100.00\"), 110.0));\n}"
        ),
        GeneratedTestCase(
            name="testProcessReservation_ConcurrencySafety",
            category="REGRESSION",
            description="Ensures null slotId does not cause unhandled NullPointerException.",
            code_snippet="@Test\nvoid testProcessReservation_NullCheck() {\n    assertThrows(NullPointerException.class, () -> \n        service.processReservation(null, \"user_123\"));\n}"
        )
    ]

    plan = [
        "1. Inspect existing Service interfaces in src/main/java/com/forgex/service",
        "2. Implement null-safe argument checks and domain invariant validations",
        "3. Synthesize JUnit 5 test cases across 5 coverage profiles (Normal, Boundary, Invalid, Exception, Regression)",
        "4. Prepare patch diff for Git commit & static analysis scan"
    ]

    return CodeGenResponse(
        task_key=req.task_key,
        implementation_plan=plan,
        primary_code=primary_code,
        file_path=f"src/main/java/com/forgex/service/{req.target_component}.java",
        test_cases=test_cases,
        total_tests_generated=len(test_cases)
    )

def perform_security_scan(req: SecurityScanRequest) -> SecurityScanResponse:
    code = req.code_snippet
    findings: List[SecurityFinding] = []
    
    # 1. SQL Injection Scan (concatenation in SQL query)
    if re.search(r'("select\s+.*\s+from\s+.*"\s*\+)|(executeQuery\(.*"\s*\+)', code, re.IGNORECASE):
        findings.append(SecurityFinding(
            severity="CRITICAL",
            category="SQL_INJECTION",
            title="Unsafe SQL String Concatenation Detected",
            description="Raw query concatenation allows SQL Injection via untrusted parameters.",
            remediation="Replace statement with parameterized PreparedStatement or Spring Data JPA @Query with :param bindings."
        ))

    # 2. Hardcoded Secrets Scan (AWS keys, GitHub tokens, raw JWT secret literals)
    if re.search(r'(AKIA[0-9A-Z]{16})|(ghp_[0-9a-zA-Z]{36})|("secret\s*=\s*\"[a-zA-Z0-9_\-]{8,}\")', code):
        findings.append(SecurityFinding(
            severity="CRITICAL",
            category="HARDCODED_SECRET",
            title="Exposed Credential / Secret Key in Source Code",
            description="Hardcoded secrets commit credentials into version control history.",
            remediation="Extract credentials to environment variables or AWS Secrets Manager / HashiCorp Vault."
        ))

    # 3. Cross-Site Scripting (XSS) / Unescaped HTML rendering
    if re.search(r'(innerHTML\s*=)|(response\.getWriter\(\)\.write\(.*request\.getParameter)', code, re.IGNORECASE):
        findings.append(SecurityFinding(
            severity="HIGH",
            category="XSS",
            title="Reflected XSS Vulnerability in Output Stream",
            description="Unsanitized user request data rendered directly into client response stream.",
            remediation="Use context-aware HTML entity encoders (OWASP Java HTML Sanitizer)."
        ))

    # 4. Dependency checks
    deps = req.dependencies or []
    for d in deps:
        if "log4j:2.14" in d.lower():
            findings.append(SecurityFinding(
                severity="CRITICAL",
                category="VULN_DEPENDENCY",
                title="Vulnerable Log4j Core (Log4Shell CVE-2021-44228)",
                description="Remote code execution vulnerability present in Log4j <= 2.14.1.",
                remediation="Upgrade org.apache.logging.log4j to >= 2.17.1."
            ))
        elif "spring-security:5.5.0" in d.lower():
            findings.append(SecurityFinding(
                severity="MEDIUM",
                category="VULN_DEPENDENCY",
                title="Spring Security Regex Filter Bypass",
                description="Known CVE in Spring Security 5.5.0 path matching.",
                remediation="Upgrade to Spring Security 6.x or patch to 5.5.3."
            ))

    critical = sum(1 for f in findings if f.severity == "CRITICAL")
    high = sum(1 for f in findings if f.severity == "HIGH")
    medium = sum(1 for f in findings if f.severity == "MEDIUM")
    
    is_deployable = (critical == 0 and high == 0)

    return SecurityScanResponse(
        scan_status="COMPLETED",
        critical_count=critical,
        high_count=high,
        medium_count=medium,
        findings=findings,
        is_deployable=is_deployable
    )

def calculate_trust_score(req: TrustScoreRequest) -> TrustScoreResponse:
    # 1. Unit Tests (Max: 25 pts)
    unit_ratio = (req.unit_tests_passed / req.unit_tests_total) if req.unit_tests_total > 0 else 1.0
    unit_score = round(unit_ratio * 25.0, 1)

    # 2. Integration Tests (Max: 15 pts)
    int_ratio = (req.integration_tests_passed / req.integration_tests_total) if req.integration_tests_total > 0 else 1.0
    int_score = round(int_ratio * 15.0, 1)

    # 3. Security Vulnerabilities (Max: 20 pts)
    if req.critical_vulnerabilities > 0:
        sec_score = 0.0
    elif req.high_vulnerabilities > 0:
        sec_score = 5.0
    elif req.medium_vulnerabilities > 0:
        sec_score = 15.0
    else:
        sec_score = 20.0

    # 4. Secrets Detected (Max: 15 pts)
    sec_secrets_score = 0.0 if req.secrets_detected > 0 else 15.0

    # 5. Dependency Risk (Max: 10 pts)
    dep_deduction = (req.medium_vulnerabilities * 3.0)
    dep_score = max(0.0, 10.0 - dep_deduction)

    # 6. Requirement Coverage (Max: 10 pts)
    req_score = round((min(100.0, max(0.0, req.requirement_coverage_pct)) / 100.0) * 10.0, 1)

    # 7. Code Quality (Max: 5 pts)
    quality_pct = req.code_quality_pct or 95.0
    quality_score = round((quality_pct / 100.0) * 5.0, 1)

    raw_sum = unit_score + int_score + sec_score + sec_secrets_score + dep_score + req_score + quality_score

    # Apply Hard Zeroing / Clamp Rules
    hard_blocked = False
    block_reason = ""
    if req.critical_vulnerabilities > 0:
        raw_sum = min(raw_sum, 25.0)
        hard_blocked = True
        block_reason = "CRITICAL SECURITY VULNERABILITY DETECTED (SQLi or RCE)"
    elif req.secrets_detected > 0:
        raw_sum = min(raw_sum, 20.0)
        hard_blocked = True
        block_reason = "HARDCODED SECRETS DETECTED IN DIFF"
    elif unit_ratio < 0.8:
        raw_sum = min(raw_sum, 55.0)
        hard_blocked = True
        block_reason = "UNIT TEST PASS RATE BELOW 80% THRESHOLD"

    final_score = int(round(raw_sum))
    final_score = max(0, min(100, final_score))

    # Gating Verdict
    if hard_blocked or final_score < 65:
        verdict = "BLOCKED - INSECURE"
        color = "red"
        can_deploy = False
        msg = f"Deployment is blocked: {block_reason or 'Trust Score below acceptable threshold (65)'}."
    elif final_score >= 85:
        verdict = "SAFE TO REVIEW"
        color = "green"
        can_deploy = True
        msg = "All verification checks passed with flying colors. Automated PR is ready for human approval."
    else:
        verdict = "REQUIRES APPROVAL"
        color = "yellow"
        can_deploy = True
        msg = "Change satisfies core tests, but medium dependency/quality warnings require senior developer sign-off."

    vectors = [
        VectorBreakdown(
            name="Unit Tests",
            score=unit_score,
            max_weight=25.0,
            status="PASS" if unit_ratio >= 0.9 else "FAIL",
            detail=f"{req.unit_tests_passed}/{req.unit_tests_total} passed ({int(unit_ratio*100)}%)"
        ),
        VectorBreakdown(
            name="Integration Tests",
            score=int_score,
            max_weight=15.0,
            status="PASS" if int_ratio >= 0.9 else "FAIL",
            detail=f"{req.integration_tests_passed}/{req.integration_tests_total} passed"
        ),
        VectorBreakdown(
            name="Security Vulnerabilities",
            score=sec_score,
            max_weight=20.0,
            status="CRITICAL" if req.critical_vulnerabilities > 0 else ("WARNING" if req.high_vulnerabilities > 0 else "PASS"),
            detail=f"{req.critical_vulnerabilities} critical, {req.high_vulnerabilities} high"
        ),
        VectorBreakdown(
            name="Secret Scanning",
            score=sec_secrets_score,
            max_weight=15.0,
            status="FAIL" if req.secrets_detected > 0 else "PASS",
            detail=f"{req.secrets_detected} exposed credentials found"
        ),
        VectorBreakdown(
            name="Dependency Risk",
            score=dep_score,
            max_weight=10.0,
            status="PASS" if dep_score >= 8.0 else "WARNING",
            detail=f"{req.medium_vulnerabilities} medium CVEs flagged"
        ),
        VectorBreakdown(
            name="Requirement Coverage",
            score=req_score,
            max_weight=10.0,
            status="PASS" if req.requirement_coverage_pct >= 85 else "WARNING",
            detail=f"{req.requirement_coverage_pct}% acceptance criteria met"
        ),
        VectorBreakdown(
            name="Code Quality & Style",
            score=quality_score,
            max_weight=5.0,
            status="PASS",
            detail=f"Linter compliance: {quality_pct}%"
        )
    ]

    return TrustScoreResponse(
        overall_score=final_score,
        verdict=verdict,
        badge_color=color,
        is_safe_to_deploy=can_deploy,
        summary_message=msg,
        vectors=vectors
    )
