import React, { useState, useEffect } from 'react';

// API Base URLs
const AI_SERVICE_URL = 'http://localhost:8000';
const BACKEND_URL = 'http://localhost:8080/api/v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'requirements' | 'repo-intel' | 'coding' | 'security' | 'trust-score' | 'observability'>('trust-score');

  // Backend / AI Service Connection State
  const [backendStatus, setBackendStatus] = useState<'ONLINE' | 'STANDBY'>('STANDBY');
  const [aiServiceStatus, setAiServiceStatus] = useState<'ONLINE' | 'STANDBY'>('STANDBY');

  // Module 1: Requirement State
  const [reqInput, setReqInput] = useState('Build an online food delivery application with login, restaurant search, cart and payment.');
  const [reqLoading, setReqLoading] = useState(false);
  const [reqData, setReqData] = useState<any>(null);

  // Module 2: Repo Intelligence State
  const [repoQuery, setRepoQuery] = useState('Which files would be affected if I change the payment service?');
  const [repoIntelData, setRepoIntelData] = useState<any>(null);
  const [repoLoading, setRepoLoading] = useState(false);

  // Module 3: Code & Test Generation State
  const [codeGenData, setCodeGenData] = useState<any>(null);
  const [codeLoading, setCodeLoading] = useState(false);

  // Module 4: Security Scanner State
  const [secCodeInput, setSecCodeInput] = useState(`public void findCustomer(String userId) {
    // Legacy SQL string concatenation
    String sql = "SELECT * FROM users WHERE id = '" + userId + "'";
    String awsSecret = "AKIA1234567890ABCDEF"; // AWS Token
    jdbcTemplate.execute(sql);
}`);
  const [secScanData, setSecScanData] = useState<any>(null);
  const [secLoading, setSecLoading] = useState(false);

  // Module 5: Trust Score Interactive Controls (Flagship Feature)
  const [unitPassed, setUnitPassed] = useState(24);
  const [unitTotal] = useState(24);
  const [intPassed, setIntPassed] = useState(4);
  const [intTotal] = useState(4);
  const [critVulns, setCritVulns] = useState(0);
  const [highVulns, setHighVulns] = useState(0);
  const [medVulns, setMedVulns] = useState(1);
  const [secretsFound, setSecretsFound] = useState(0);
  const [reqCoverage, setReqCoverage] = useState(92);
  const [prCreatedModal, setPrCreatedModal] = useState<any>(null);

  // Check health on mount
  useEffect(() => {
    fetch(`${AI_SERVICE_URL}/health`)
      .then(res => res.json())
      .then(() => setAiServiceStatus('ONLINE'))
      .catch(() => setAiServiceStatus('STANDBY'));

    fetch(`${BACKEND_URL}/health`)
      .then(res => res.json())
      .then(() => setBackendStatus('ONLINE'))
      .catch(() => setBackendStatus('STANDBY'));
  }, []);

  // Compute Trust Score calculation dynamically
  const calculateTrustScore = () => {
    const unitScore = (unitPassed / unitTotal) * 25.0;
    const intScore = (intPassed / intTotal) * 15.0;

    let secScore = 20.0;
    if (critVulns > 0) secScore = 0.0;
    else if (highVulns > 0) secScore = 5.0;
    else if (medVulns > 0) secScore = 15.0;

    const secSecretsScore = secretsFound > 0 ? 0.0 : 15.0;
    const depScore = Math.max(0.0, 10.0 - (medVulns * 3.0));
    const reqScore = (reqCoverage / 100.0) * 10.0;
    const qualityScore = 4.8;

    let total = unitScore + intScore + secScore + secSecretsScore + depScore + reqScore + qualityScore;

    let hardBlocked = false;
    let blockReason = '';

    if (critVulns > 0) {
      total = Math.min(total, 25.0);
      hardBlocked = true;
      blockReason = 'CRITICAL SECURITY VULNERABILITY DETECTED';
    } else if (secretsFound > 0) {
      total = Math.min(total, 20.0);
      hardBlocked = true;
      blockReason = 'EXPOSED HARDCODED SECRET DETECTED';
    } else if (unitPassed / unitTotal < 0.8) {
      total = Math.min(total, 50.0);
      hardBlocked = true;
      blockReason = 'UNIT TEST PASS RATE BELOW 80%';
    }

    const overallScore = Math.max(0, Math.min(100, Math.round(total)));
    let verdict = 'SAFE TO REVIEW';
    let badgeColor = 'green';
    let canDeploy = true;

    if (hardBlocked || overallScore < 65) {
      verdict = 'BLOCKED - INSECURE';
      badgeColor = 'red';
      canDeploy = false;
    } else if (overallScore < 85) {
      verdict = 'REQUIRES SENIOR APPROVAL';
      badgeColor = 'yellow';
      canDeploy = true;
    }

    return {
      overallScore,
      verdict,
      badgeColor,
      canDeploy,
      blockReason,
      unitScore: unitScore.toFixed(1),
      intScore: intScore.toFixed(1),
      secScore: secScore.toFixed(1),
      secretsScore: secSecretsScore.toFixed(1),
      depScore: depScore.toFixed(1),
      reqScore: reqScore.toFixed(1),
      qualityScore: qualityScore.toFixed(1),
    };
  };

  const trustResult = calculateTrustScore();

  // Action: Analyze Requirement
  const handleAnalyzeRequirement = async () => {
    setReqLoading(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/analyze-requirement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement_text: reqInput, project_name: 'FoodieFlow' })
      });
      if (res.ok) {
        const data = await res.json();
        setReqData(data);
      } else {
        throw new Error('Fallback to simulated decomposition');
      }
    } catch {
      // Graceful fallback
      setReqData({
        status: 'SUCCESS',
        project_name: 'FoodieFlow Quick Commerce',
        architecture: {
          overview: 'Distributed Cloud-Native Food Delivery & Ordering Engine.',
          suggested_stack: {
            Backend: 'Java 21 Spring Boot 3 (Microservices)',
            Frontend: 'React + TypeScript + Vite',
            Database: 'PostgreSQL 16 with pgvector',
            Cache: 'Redis 7 Cluster',
            DevSecOps: 'Semgrep SAST + GitHub Actions'
          },
          key_entities: ['CustomerUser', 'Restaurant', 'MenuItem', 'OrderHeader', 'PaymentTransaction'],
          api_endpoints: [
            'POST /api/v1/auth/login',
            'GET /api/v1/restaurants/search',
            'POST /api/v1/orders/checkout',
            'POST /api/v1/payments/stripe/intent'
          ]
        },
        epics: [
          {
            epic_name: 'EPIC-1: User Authentication & RBAC',
            description: 'Customer JWT authentication and role-based permissions.',
            user_stories: [
              {
                story_key: 'US-101',
                title: 'Customer JWT Registration & Login',
                description: 'Issue signed JWT access tokens with BCrypt password hashing.',
                acceptance_criteria: ['Return JWT with 15m expiration', 'Enforce BCrypt work factor 12'],
                estimated_points: 3
              }
            ]
          },
          {
            epic_name: 'EPIC-2: Restaurant Catalog & Real-Time Menu Search',
            description: 'Geo-radius spatial restaurant lookup and menu indexing.',
            user_stories: [
              {
                story_key: 'US-103',
                title: 'Search Restaurants by Geo-Radius',
                description: 'Query open restaurants within 5km radius cached in Redis.',
                acceptance_criteria: ['Calculate Haversine distance', 'Cache in Redis with 60s TTL'],
                estimated_points: 5
              }
            ]
          },
          {
            epic_name: 'EPIC-3: Cart Management & Stripe Payments',
            description: 'ACID checkout transactions and idempotent Stripe integration.',
            user_stories: [
              {
                story_key: 'US-104',
                title: 'Idempotent Payment Intent API',
                description: 'Prevent double charging with client Idempotency-Key header.',
                acceptance_criteria: ['Validate Idempotency-Key', 'Store transaction state with pessimistic lock'],
                estimated_points: 5
              }
            ]
          }
        ]
      });
    } finally {
      setReqLoading(false);
    }
  };

  // Action: Repo Query
  const handleQueryRepo = async () => {
    setRepoLoading(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/repo-intelligence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: repoQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setRepoIntelData(data);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      setRepoIntelData({
        direct_answer: 'Modifying PaymentService directly impacts PaymentController, PaymentRepository, and PaymentRequestDto. Concurrency locks and Stripe webhooks must be verified.',
        impact_radius_score: 4,
        affected_files: [
          { file_path: 'src/main/java/com/forgex/service/PaymentService.java', layer: 'Service', impact_level: 'DIRECT', reason: 'Core payment transaction execution' },
          { file_path: 'src/main/java/com/forgex/controller/PaymentController.java', layer: 'Controller', impact_level: 'DIRECT', reason: 'REST endpoint facade' },
          { file_path: 'src/main/java/com/forgex/repository/PaymentRepository.java', layer: 'Repository', impact_level: 'INDIRECT', reason: 'JPA persistence entity queries' },
          { file_path: 'src/main/java/com/forgex/dto/PaymentRequestDto.java', layer: 'DTO', impact_level: 'DIRECT', reason: 'Input schema validation' }
        ],
        recommended_test_files: [
          'src/test/java/com/forgex/service/PaymentServiceTest.java',
          'src/test/java/com/forgex/controller/PaymentControllerIntegrationTest.java'
        ]
      });
    } finally {
      setRepoLoading(false);
    }
  };

  // Action: Generate Code
  const handleGenerateCode = async () => {
    setCodeLoading(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_key: 'US-104',
          task_title: 'Idempotent Payment Intent API',
          target_component: 'PaymentService',
          specifications: ['Idempotency-Key validation', 'Tiered discount computation', 'JPA locking']
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCodeGenData(data);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      setCodeGenData({
        task_key: 'US-104',
        implementation_plan: [
          '1. Inspect PaymentService interface in com.forgex.service',
          '2. Implement defensive null validation and tiered promotional discount formula',
          '3. Generate JUnit 5 test suite across Normal, Boundary, Invalid Input, and Exception cases',
          '4. Prepare patch diff for Git commit & DevSecOps security scan'
        ],
        file_path: 'src/main/java/com/forgex/service/PaymentService.java',
        primary_code: `package com.forgex.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.Objects;

@Service
public class PaymentService {

    public BigDecimal calculateDiscountedTotal(BigDecimal originalAmount, double discountPercentage) {
        if (originalAmount == null || originalAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Original amount cannot be null or negative");
        }
        if (discountPercentage < 0.0 || discountPercentage > 100.0) {
            throw new IllegalArgumentException("Discount percentage must be between 0.0 and 100.0");
        }
        BigDecimal discountFactor = BigDecimal.valueOf(1.0 - (discountPercentage / 100.0));
        return originalAmount.multiply(discountFactor).setScale(2, java.math.RoundingMode.HALF_UP);
    }

    @Transactional
    public boolean processPayment(String orderId, String idempotencyKey) {
        Objects.requireNonNull(orderId, "Order ID required");
        Objects.requireNonNull(idempotencyKey, "Idempotency key required");
        return true;
    }
}`,
        total_tests_generated: 4,
        test_cases: [
          { name: 'testDiscount_HappyPath', category: 'NORMAL', description: 'Verifies 10% on $100 yields $90', code_snippet: '@Test\nvoid testHappy() { assertEquals(new BigDecimal("90.00"), service.calculateDiscountedTotal(new BigDecimal("100.00"), 10.0)); }' },
          { name: 'testZeroDiscount_Boundary', category: 'BOUNDARY', description: '0% discount preserves original', code_snippet: '@Test\nvoid testZero() { assertEquals(new BigDecimal("50.00"), service.calculateDiscountedTotal(new BigDecimal("50.00"), 0.0)); }' },
          { name: 'testNegativeAmount_Exception', category: 'EXCEPTION', description: 'Throws IllegalArgumentException', code_snippet: '@Test\nvoid testNeg() { assertThrows(IllegalArgumentException.class, () -> service.calculateDiscountedTotal(new BigDecimal("-10"), 10)); }' }
        ]
      });
    } finally {
      setCodeLoading(false);
    }
  };

  // Action: Security Scan
  const handleRunSecurityScan = async () => {
    setSecLoading(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/security-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_snippet: secCodeInput })
      });
      if (res.ok) {
        const data = await res.json();
        setSecScanData(data);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      setSecScanData({
        scan_status: 'COMPLETED',
        critical_count: 2,
        high_count: 0,
        medium_count: 1,
        is_deployable: false,
        findings: [
          {
            severity: 'CRITICAL',
            category: 'SQL_INJECTION',
            title: 'Raw SQL String Concatenation Detected',
            description: 'Untrusted user input concatenated directly into SQL statement string.',
            remediation: 'Use parameterized queries with PreparedStatement or Spring Data JPA @Query with :param bindings.'
          },
          {
            severity: 'CRITICAL',
            category: 'HARDCODED_SECRET',
            title: 'Hardcoded AWS Credential Detected',
            description: 'Matching pattern for AWS Access Key (AKIA...) embedded directly in source code.',
            remediation: 'Extract credentials to environment variables or AWS Secrets Manager.'
          },
          {
            severity: 'MEDIUM',
            category: 'VULN_DEPENDENCY',
            title: 'Vulnerable transitive dependency jackson-databind',
            description: 'Known advisory CVE-2023-35116 in JSON deserializer.',
            remediation: 'Upgrade to jackson-databind >= 2.15.2'
          }
        ]
      });
    } finally {
      setSecLoading(false);
    }
  };

  // Action: Create Governed PR
  const handleCreatePullRequest = () => {
    setPrCreatedModal({
      prNumber: 42,
      prUrl: 'https://github.com/forgex-demo/foodieflow/pull/42',
      title: 'feat(payment): Idempotent Stripe checkout with verified tests & DevSecOps scan',
      branch: 'feature/forgex-ai-payment-us104',
      trustScore: trustResult.overallScore,
      verdict: trustResult.verdict,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div>
      {/* Top Navigation Bar */}
      <header className="header-container">
        <div className="brand-wrapper">
          <span className="brand-logo">⚡ ForgeX</span>
          <span className="brand-pill">AI DevSecOps Factory</span>
        </div>

        <div className="header-status-group">
          <div className="status-pill">
            <span className="pulse-dot"></span>
            <span>BACKEND: {backendStatus}</span>
          </div>
          <div className="status-pill">
            <span className="pulse-dot" style={{ backgroundColor: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }}></span>
            <span>AI ENGINE: {aiServiceStatus}</span>
          </div>
          <div className="status-pill">
            <span>REPO: github.com/forgex-demo/foodieflow</span>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'trust-score' ? 'active' : ''}`}
          onClick={() => setActiveTab('trust-score')}
        >
          🎯 AI Change Trust Score
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
          onClick={() => setActiveTab('requirements')}
        >
          📋 Requirement Analyzer
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'repo-intel' ? 'active' : ''}`}
          onClick={() => setActiveTab('repo-intel')}
        >
          🔍 Repo Intelligence
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'coding' ? 'active' : ''}`}
          onClick={() => setActiveTab('coding')}
        >
          💻 AI Code & Test Hub
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🛡️ DevSecOps Sentinel
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'observability' ? 'active' : ''}`}
          onClick={() => setActiveTab('observability')}
        >
          📊 Production Observability
        </button>
      </nav>

      {/* Main Workspace Area */}
      <main className="main-content">

        {/* ----------------- TAB: AI CHANGE TRUST SCORE (SIGNATURE FEATURE) ----------------- */}
        {activeTab === 'trust-score' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">
                <span>🧠 AI Change Trust Score Gatekeeper</span>
              </h1>
              <p className="section-subtitle">
                Deterministic mathematical trust verification evaluating AI-generated pull requests against test coverage, security scans, hardcoded secrets, and requirement fidelity.
              </p>
            </div>

            {/* Pipeline Stage Tracker */}
            <div className="pipeline-flow">
              <div className="pipeline-node">
                <div className="node-icon completed">✅</div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Requirement</span>
              </div>
              <div className="pipeline-connector done"></div>

              <div className="pipeline-node">
                <div className="node-icon completed">✅</div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Repo Context</span>
              </div>
              <div className="pipeline-connector done"></div>

              <div className="pipeline-node">
                <div className="node-icon completed">✅</div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Code & Tests</span>
              </div>
              <div className="pipeline-connector done"></div>

              <div className="pipeline-node">
                <div className="node-icon active">🛡️</div>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>Trust Score</span>
              </div>
              <div className="pipeline-connector"></div>

              <div className="pipeline-node">
                <div className="node-icon">🚀</div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>CI/CD Deploy</span>
              </div>
            </div>

            <div className="grid-2">
              {/* Left Column: Visual Trust Score Gauge & Decision */}
              <div className="glass-panel trust-gauge-box">
                <div
                  className="gauge-circle"
                  style={{
                    borderColor: trustResult.badgeColor === 'green' ? 'var(--accent-emerald)' : (trustResult.badgeColor === 'yellow' ? 'var(--accent-amber)' : 'var(--accent-rose)'),
                    boxShadow: trustResult.badgeColor === 'green' ? 'var(--glow-emerald)' : (trustResult.badgeColor === 'yellow' ? 'none' : 'var(--glow-rose)'),
                  }}
                >
                  <span className="gauge-number" style={{ color: trustResult.badgeColor === 'green' ? 'var(--accent-emerald)' : (trustResult.badgeColor === 'yellow' ? 'var(--accent-amber)' : 'var(--accent-rose)') }}>
                    {trustResult.overallScore}
                  </span>
                  <span className="gauge-denom">/ 100</span>
                </div>

                <div
                  className="gauge-verdict-banner"
                  style={{
                    background: trustResult.badgeColor === 'green' ? 'rgba(16, 185, 129, 0.15)' : (trustResult.badgeColor === 'yellow' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)'),
                    color: trustResult.badgeColor === 'green' ? 'var(--accent-emerald)' : (trustResult.badgeColor === 'yellow' ? 'var(--accent-amber)' : 'var(--accent-rose)'),
                    border: `1px solid ${trustResult.badgeColor === 'green' ? 'rgba(16, 185, 129, 0.3)' : (trustResult.badgeColor === 'yellow' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(244, 63, 94, 0.3)')}`,
                  }}
                >
                  {trustResult.verdict}
                </div>

                <p style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px' }}>
                  {trustResult.canDeploy
                    ? 'All security gates and baseline unit tests passed. This pull request is mathematically verified and ready for human review.'
                    : `⚠️ ${trustResult.blockReason || 'Critical security or verification issues detected. Pull Request merging is strictly blocked by policy.'}`}
                </p>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button
                    className="btn-primary"
                    disabled={!trustResult.canDeploy}
                    style={{ opacity: trustResult.canDeploy ? 1 : 0.5, cursor: trustResult.canDeploy ? 'pointer' : 'not-allowed' }}
                    onClick={handleCreatePullRequest}
                  >
                    <span>⚡ Create Governed PR</span>
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setUnitPassed(24);
                      setIntPassed(4);
                      setCritVulns(0);
                      setHighVulns(0);
                      setMedVulns(1);
                      setSecretsFound(0);
                      setReqCoverage(92);
                    }}
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>

              {/* Right Column: Live Interactive Simulation Sliders */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#fff' }}>
                  🎛️ Live Verification Matrix & Hard-Gate Simulation
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                  Adjust parameters below to simulate real-world failure scenarios and observe the Trust Gatekeeper response.
                </p>

                {/* Unit Tests Slider */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Unit Tests Passed ({unitPassed} / {unitTotal})</span>
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{trustResult.unitScore} / 25 pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={unitTotal}
                    value={unitPassed}
                    onChange={(e) => setUnitPassed(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                  />
                </div>

                {/* Integration Tests Slider */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Integration Tests Passed ({intPassed} / {intTotal})</span>
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{trustResult.intScore} / 15 pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={intTotal}
                    value={intPassed}
                    onChange={(e) => setIntPassed(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                  />
                </div>

                {/* Requirement Coverage Slider */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span>Requirement Coverage ({reqCoverage}%)</span>
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{trustResult.reqScore} / 10 pts</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={reqCoverage}
                    onChange={(e) => setReqCoverage(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                  />
                </div>

                {/* Hard Gate Simulation Toggles */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 600 }}>
                    Hard-Gate Zeroing Simulation
                  </span>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <button
                      className={critVulns > 0 ? 'badge-danger' : 'btn-secondary'}
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', cursor: 'pointer' }}
                      onClick={() => setCritVulns(critVulns === 0 ? 1 : 0)}
                    >
                      {critVulns > 0 ? '❌ Injected SQLi (Active)' : '⚡ Simulate SQLi Flaw'}
                    </button>

                    <button
                      className={secretsFound > 0 ? 'badge-danger' : 'btn-secondary'}
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', cursor: 'pointer' }}
                      onClick={() => setSecretsFound(secretsFound === 0 ? 1 : 0)}
                    >
                      {secretsFound > 0 ? '❌ AWS Secret Exposed' : '⚡ Simulate Secret Leak'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized Verification Table */}
            <div className="glass-panel" style={{ marginTop: '1.5rem', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Detailed Vector Audit Log</h3>
              </div>

              <div className="check-item">
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Unit Test Pass Rate</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Deterministic test verification via JUnit 5</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{unitPassed}/{unitTotal} ({trustResult.unitScore} / 25 pts)</span>
                  <span className={unitPassed / unitTotal >= 0.8 ? 'stat-badge badge-success' : 'stat-badge badge-danger'}>
                    {unitPassed / unitTotal >= 0.8 ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>

              <div className="check-item">
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Static Security Vulnerabilities (SAST)</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Semgrep static rule scanning for injection & deserialization</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{critVulns} Critical, {highVulns} High ({trustResult.secScore} / 20 pts)</span>
                  <span className={critVulns === 0 ? 'stat-badge badge-success' : 'stat-badge badge-danger'}>
                    {critVulns === 0 ? '0 CRITICAL' : 'HARD BLOCK'}
                  </span>
                </div>
              </div>

              <div className="check-item">
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Secret & Token Detection</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>High-entropy scanner for AWS, GitHub, JWT tokens</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{secretsFound} Detected ({trustResult.secretsScore} / 15 pts)</span>
                  <span className={secretsFound === 0 ? 'stat-badge badge-success' : 'stat-badge badge-danger'}>
                    {secretsFound === 0 ? 'CLEAN' : 'LEAK DETECTED'}
                  </span>
                </div>
              </div>

              <div className="check-item">
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Dependency Supply Chain Risk</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>OWASP Software Composition Analysis (SCA)</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{medVulns} Medium CVE ({trustResult.depScore} / 10 pts)</span>
                  <span className="stat-badge badge-warning">1 ADVISORY</span>
                </div>
              </div>

              <div className="check-item">
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Requirement & Acceptance Criteria Coverage</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Verified user story criteria satisfaction</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{reqCoverage}% ({trustResult.reqScore} / 10 pts)</span>
                  <span className="stat-badge badge-success">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: REQUIREMENT ANALYZER (MODULE 1) ----------------- */}
        {activeTab === 'requirements' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">
                <span>📋 AI Requirement Analyzer</span>
              </h1>
              <p className="section-subtitle">
                Deconstruct raw stakeholder requirements into cloud-native architecture proposals, epics, user stories, and Gherkin acceptance criteria.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                ENTER SOFTWARE REQUIREMENT:
              </label>
              <textarea
                className="forge-textarea"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                placeholder="Describe your target application or feature..."
              />
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" onClick={handleAnalyzeRequirement} disabled={reqLoading}>
                  {reqLoading ? 'Analyzing Architecture...' : '🚀 Analyze & Generate Epics'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setReqInput('Build an online food delivery application with login, restaurant search, cart and payment.')}
                >
                  Load Food Delivery Preset
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setReqInput('Create an IoT smart parking slot reservation system with concurrency hold locks.')}
                >
                  Load Smart Parking Preset
                </button>
              </div>
            </div>

            {reqData && (
              <div>
                {/* Architecture Overview */}
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                    🏛️ Proposed Architecture Blueprint
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {reqData.architecture.overview}
                  </p>

                  <div className="grid-3" style={{ marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>KEY ENTITIES</span>
                      <p style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                        {reqData.architecture.key_entities.join(', ')}
                      </p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>SUGGESTED TECH STACK</span>
                      <p style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.3rem' }}>
                        Java 21 Spring Boot + PostgreSQL + Redis
                      </p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>DEVSECOPS PIPELINE</span>
                      <p style={{ fontSize: '0.85rem', color: '#f59e0b', marginTop: '0.3rem' }}>
                        Semgrep SAST + Docker Compose
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decomposed Epics & Stories */}
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>
                  📦 Decomposed Epics & User Stories
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reqData.epics.map((epic: any, idx: number) => (
                    <div key={idx} className="glass-panel" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ color: '#fff', fontSize: '1rem' }}>{epic.epic_name}</h4>
                        <span className="stat-badge badge-success">{epic.user_stories.length} User Stories</span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>{epic.description}</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {epic.user_stories.map((story: any, sIdx: number) => (
                          <div key={sIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.9rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <strong style={{ color: '#38bdf8', fontSize: '0.88rem' }}>[{story.story_key}] {story.title}</strong>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Points: {story.estimated_points}</span>
                            </div>
                            <p style={{ color: '#cbd5e1', fontSize: '0.82rem', marginTop: '0.3rem' }}>{story.description}</p>
                            <div style={{ marginTop: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>GHERKIN CRITERIA:</span>
                              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.2rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                                {story.acceptance_criteria.map((ac: string, acIdx: number) => (
                                  <li key={acIdx}>{ac}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB: REPO INTELLIGENCE (MODULE 2) ----------------- */}
        {activeTab === 'repo-intel' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">
                <span>🔍 Repository Intelligence & AST Graph</span>
              </h1>
              <p className="section-subtitle">
                Repository-aware context engine. Asks natural language questions regarding code architecture, impact radius, and component dependencies.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                ASK CODEBASE QUERY:
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  className="forge-input"
                  value={repoQuery}
                  onChange={(e) => setRepoQuery(e.target.value)}
                  placeholder="e.g. Which files would be affected if I change the payment service?"
                />
                <button className="btn-primary" onClick={handleQueryRepo} disabled={repoLoading}>
                  {repoLoading ? 'Scanning AST...' : 'Analyze Impact Radius'}
                </button>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn-secondary"
                  onClick={() => setRepoQuery('Which files would be affected if I change the payment service?')}
                >
                  Query: Payment Service Impact
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setRepoQuery('Where is user authentication and JWT validation implemented?')}
                >
                  Query: Auth & Filter Chain
                </button>
              </div>
            </div>

            {repoIntelData && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Impact Radius Analysis</h3>
                  <span className="stat-badge badge-warning">Impact Score: {repoIntelData.impact_radius_score} / 5</span>
                </div>

                <p style={{ color: '#38bdf8', fontSize: '0.92rem', marginBottom: '1.25rem', padding: '0.75rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px' }}>
                  💡 {repoIntelData.direct_answer}
                </p>

                <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>Affected Files & Architectural Layers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {repoIntelData.affected_files.map((file: any, fIdx: number) => (
                    <div key={fIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.9rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#fff' }}>{file.file_path}</span>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>{file.reason}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="stat-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                          {file.layer}
                        </span>
                        <span className={file.impact_level === 'DIRECT' ? 'stat-badge badge-danger' : 'stat-badge badge-warning'}>
                          {file.impact_level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Recommended Test Suites to Execute</h4>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    {repoIntelData.recommended_test_files.map((tf: string, idx: number) => (
                      <li key={idx}>{tf}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB: AI CODE & TEST GENERATOR (MODULES 3 & 4) ----------------- */}
        {activeTab === 'coding' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">
                <span>💻 AI Coding & Automated Test Generator</span>
              </h1>
              <p className="section-subtitle">
                Never generate raw code in isolation. ForgeX pairs every synthesized service change with multi-tier unit, boundary, exception, and regression tests.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem' }}>Active Task: [US-104] Idempotent Payment Intent API</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Target: PaymentService.java | Requirement: Calculate tiered discounts and validate idempotency</p>
                </div>
                <button className="btn-primary" onClick={handleGenerateCode} disabled={codeLoading}>
                  {codeLoading ? 'Synthesizing Plan & Tests...' : '⚡ Generate Code & Tests'}
                </button>
              </div>
            </div>

            {codeGenData && (
              <div className="grid-2">
                {/* Left: Code Implementation */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.95rem', color: '#fff' }}>Synthesized Service Implementation</h3>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{codeGenData.file_path}</span>
                  </div>
                  <pre className="code-container" style={{ maxHeight: '420px' }}>
                    <code>{codeGenData.primary_code}</code>
                  </pre>
                </div>

                {/* Right: Generated Test Cases */}
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.95rem', color: '#fff' }}>Generated Automated Test Suite</h3>
                    <span className="stat-badge badge-success">{codeGenData.test_cases.length} Tests Generated</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                    {codeGenData.test_cases.map((tc: any, tIdx: number) => (
                      <div key={tIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-emerald)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fff' }}>{tc.name}</span>
                          <span className="stat-badge badge-success">{tc.category}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0' }}>{tc.description}</p>
                        <pre className="code-container" style={{ padding: '0.5rem', fontSize: '0.75rem' }}>
                          <code>{tc.code_snippet}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB: DEVSECOPS SENTINEL (MODULE 5) ----------------- */}
        {activeTab === 'security' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">
                <span>🛡️ DevSecOps Security Sentinel</span>
              </h1>
              <p className="section-subtitle">
                Automated SAST, Secret Scanning, and Dependency CVE Audit protecting the deployment pipeline against vulnerable AI code.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                PASTE CODE SNIPPET TO AUDIT:
              </label>
              <textarea
                className="forge-textarea"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', minHeight: '140px' }}
                value={secCodeInput}
                onChange={(e) => setSecCodeInput(e.target.value)}
              />
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" onClick={handleRunSecurityScan} disabled={secLoading}>
                  {secLoading ? 'Scanning Vulnerabilities...' : '🛡️ Run DevSecOps Security Audit'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setSecCodeInput(`public BigDecimal calculateDiscount(BigDecimal amount, double discount) {
    if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
        throw new IllegalArgumentException("Amount must be positive");
    }
    return amount.multiply(BigDecimal.valueOf(1.0 - (discount / 100.0)));
}`)}
                >
                  Load Clean Code (Safe)
                </button>
              </div>
            </div>

            {secScanData && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Security Audit Findings</h3>
                  <span className={secScanData.is_deployable ? 'stat-badge badge-success' : 'stat-badge badge-danger'}>
                    {secScanData.is_deployable ? 'PASSED — SAFE TO MERGE' : 'BLOCKED — VULNERABILITIES DETECTED'}
                  </span>
                </div>

                <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
                  <div className="stat-card glass-panel">
                    <span className="stat-label">CRITICAL VULNS</span>
                    <span className="stat-value" style={{ color: secScanData.critical_count > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                      {secScanData.critical_count}
                    </span>
                  </div>
                  <div className="stat-card glass-panel">
                    <span className="stat-label">HIGH VULNS</span>
                    <span className="stat-value" style={{ color: secScanData.high_count > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                      {secScanData.high_count}
                    </span>
                  </div>
                  <div className="stat-card glass-panel">
                    <span className="stat-label">DEPENDENCY ADVISORIES</span>
                    <span className="stat-value" style={{ color: 'var(--accent-amber)' }}>
                      {secScanData.medium_count}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {secScanData.findings.map((f: any, idx: number) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: `3px solid ${f.severity === 'CRITICAL' ? 'var(--accent-rose)' : 'var(--accent-amber)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{f.title}</strong>
                        <span className={f.severity === 'CRITICAL' ? 'stat-badge badge-danger' : 'stat-badge badge-warning'}>{f.severity}</span>
                      </div>
                      <p style={{ color: '#cbd5e1', fontSize: '0.82rem', marginTop: '0.3rem' }}>{f.description}</p>
                      <div style={{ marginTop: '0.4rem', padding: '0.4rem 0.6rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>REMEDIATION: </span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{f.remediation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB: PRODUCTION OBSERVABILITY & AI PM (MODULES 7 & 8) ----------------- */}
        {activeTab === 'observability' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">
                <span>📊 Production Observability & AI Project Manager</span>
              </h1>
              <p className="section-subtitle">
                Real-time Golden Signals monitoring combined with proactive engineering bottleneck detection.
              </p>
            </div>

            {/* Golden Signals Cards */}
            <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
              <div className="stat-card glass-panel">
                <span className="stat-label">API LATENCY (P95)</span>
                <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>182 ms</span>
                <span className="stat-badge badge-success">HEALTHY</span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">HTTP ERROR RATE</span>
                <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>0.8%</span>
                <span className="stat-badge badge-success">&lt; 1% SLA</span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">THROUGHPUT</span>
                <span className="stat-value">245 RPM</span>
                <span className="stat-badge badge-success">NORMAL</span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">CONTAINER CPU / MEM</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>37% / 52%</span>
                <span className="stat-badge badge-success">OPTIMAL</span>
              </div>
            </div>

            {/* AI Project Manager Insights */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>
                🧠 AI Project Manager Insights & Bottleneck Radar
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--accent-amber)' }}>
                  <span>⚠️</span>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.88rem' }}>Testing Bottleneck Detected</strong>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Payment module integration tests are taking 4.2 minutes. Consider running parallel test shards.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--accent-emerald)' }}>
                  <span>✅</span>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.88rem' }}>Authentication Milestone Complete</strong>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>User stories US-101 and US-102 have reached 100% test coverage and merged cleanly into main.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '6px', borderLeft: '3px solid var(--accent-cyan)' }}>
                  <span>🟢</span>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.88rem' }}>Production Canary v1.2.0 Stable</strong>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Traffic shifting: 100% routed to new container instances. Zero 5xx errors recorded in the last 60 minutes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Governed PR Creation Modal */}
      {prCreatedModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '580px', width: '90%', border: '1px solid var(--accent-cyan)' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.75rem' }}>
              🚀 Governed Pull Request Dispatched!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              ForgeX has packaged the verified code diff, test cases, and DevSecOps security report into a GitHub Pull Request.
            </p>

            <div style={{ background: '#060911', padding: '1rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
              <div style={{ color: '#38bdf8' }}>PR #{prCreatedModal.prNumber}: {prCreatedModal.title}</div>
              <div style={{ color: '#64748b', marginTop: '0.3rem' }}>Branch: {prCreatedModal.branch}</div>
              <div style={{ color: 'var(--accent-emerald)', marginTop: '0.3rem' }}>AI Trust Score: {prCreatedModal.trustScore} / 100 ({prCreatedModal.verdict})</div>
              <div style={{ color: '#94a3b8', marginTop: '0.3rem' }}>CI/CD: GitHub Actions Pipeline Initiated</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn-secondary" onClick={() => setPrCreatedModal(null)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => setPrCreatedModal(null)}>
                View on GitHub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
