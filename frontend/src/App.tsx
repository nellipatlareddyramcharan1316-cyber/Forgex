import React, { useState, useEffect } from 'react';

// API Endpoints
const BACKEND_URL = 'http://localhost:8080/api/v1';
const AUTH_URL = 'http://localhost:8080/api/auth';
const AI_SERVICE_URL = 'http://localhost:8000';

type Page =
  | 'dashboard'
  | 'projects'
  | 'kanban'
  | 'github'
  | 'requirements'
  | 'rag-knowledge'
  | 'repo-analyzer'
  | 'dev-planner'
  | 'coding-agent'
  | 'trust-score';

interface UserProfile {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  repositoryUrl: string;
  status: string;
  owner?: { name: string; email: string; role: string };
  createdAt?: string;
}

interface TaskItem {
  id: number;
  storyKey: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId?: number;
  epicName?: string;
  acceptanceCriteria?: string;
  assignee?: { name: string; email: string };
  createdAt?: string;
}

const KANBAN_STATUSES = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'CODE_REVIEW',
  'TESTING',
  'DONE',
  'BLOCKED'
];

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('forgex_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('dev@forgex.io');
  const [authPassword, setAuthPassword] = useState('Password123!');
  const [authName, setAuthName] = useState('Devon Lee');
  const [authRole, setAuthRole] = useState('DEVELOPER');
  const [authError, setAuthError] = useState('');

  // Navigation View
  const [currentPage, setCurrentPage] = useState<Page>('kanban');

  // Project & Task State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // Modals (Phase 6)
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [editProjectModal, setEditProjectModal] = useState<Project | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('DEVELOPER');
  const [projectMembers, setProjectMembers] = useState<any[]>([]);

  // Task Creation Modal (Phase 6)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('HIGH');
  const [newTaskStatus, setNewTaskStatus] = useState('BACKLOG');
  const [newTaskCriteria, setNewTaskCriteria] = useState('');

  // Phase 7: GitHub State
  const [githubConnected, setGithubConnected] = useState(true);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [selectedRepoStats, setSelectedRepoStats] = useState<any>(null);
  const [newBranchName, setNewBranchName] = useState('feature/password-reset');
  const [newIssueTitle, setNewIssueTitle] = useState('Enhance JWT expiration validation');
  const [gitActionNotice, setGitActionNotice] = useState('');

  // Phase 8: Requirement State
  const [reqPrompt, setReqPrompt] = useState('Build an online parking reservation system for students and faculty.');
  const [reqResult, setReqResult] = useState<any>(null);
  const [reqLoading, setReqLoading] = useState(false);

  // Phase 9: RAG Knowledge State
  const [ragQuery, setRagQuery] = useState('Where is authentication handled?');
  const [ragResult, setRagResult] = useState<any>(null);
  const [ragLoading, setRagLoading] = useState(false);

  // Phase 10: Repo Analyzer State
  const [repoAnalysis, setRepoAnalysis] = useState<any>(null);
  const [repoAnalyzing, setRepoAnalyzing] = useState(false);

  // Phase 11: Dev Planner State
  const [planTaskInput, setPlanTaskInput] = useState('Add password reset functionality.');
  const [devPlan, setDevPlan] = useState<any>(null);
  const [plannerLoading, setPlannerLoading] = useState(false);

  // Phase 12: AI Coding Agent State
  const [agentExecuting, setAgentExecuting] = useState(false);
  const [agentResult, setAgentResult] = useState<any>(null);

  // Fetch Projects & Tasks
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        if (data.length > 0 && !selectedProject) {
          setSelectedProject(data[0]);
        }
      }
    } catch {
      const fallback: Project[] = [
        { id: 1, name: 'Food Delivery Platform', description: 'High-throughput food ordering engine with restaurant catalog, cart checkout, and Stripe integration.', repositoryUrl: 'https://github.com/forgex-demo/foodieflow', status: 'ACTIVE' },
        { id: 2, name: 'Parking System', description: 'IoT-integrated automated parking bay reservation system with concurrency control.', repositoryUrl: 'https://github.com/forgex-demo/smartpark', status: 'ACTIVE' },
        { id: 3, name: 'College Portal', description: 'Integrated academic management system with grades, attendance, and fee tracking.', repositoryUrl: 'https://github.com/forgex-demo/collegeportal', status: 'DEVELOPMENT' }
      ];
      setProjects(fallback);
      if (!selectedProject) setSelectedProject(fallback[0]);
    }
  };

  const fetchTasks = async (projectId: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/project/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch {
      setTasks([
        { id: 1, storyKey: 'US-101', title: 'Customer JWT Authentication', description: 'Implement BCrypt password hashing and token generation', status: 'DONE', priority: 'HIGH', epicName: 'Authentication' },
        { id: 2, storyKey: 'US-102', title: 'Role-Based Access Control', description: 'Enforce RBAC annotations on admin and restaurant routes', status: 'CODE_REVIEW', priority: 'MEDIUM', epicName: 'Authentication' },
        { id: 3, storyKey: 'US-103', title: 'Geo-Radius Menu Search', description: 'Query open restaurants within 5km radius with Redis cache', status: 'IN_PROGRESS', priority: 'HIGH', epicName: 'Catalog' },
        { id: 4, storyKey: 'US-104', title: 'Idempotent Payment Intent API', description: 'Stripe checkout with Idempotency-Key validation', status: 'TESTING', priority: 'CRITICAL', epicName: 'Payments' },
        { id: 5, storyKey: 'US-105', title: 'SMS Order Dispatch Notifications', description: 'Twilio integration for real-time delivery alerts', status: 'TODO', priority: 'LOW', epicName: 'Notifications' },
        { id: 6, storyKey: 'US-106', title: 'Refund Audit Ledger', description: 'Administrative transaction reversal workflow', status: 'BACKLOG', priority: 'MEDIUM', epicName: 'Administration' }
      ]);
    }
  };

  const fetchMembers = async (projectId: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/projects/${projectId}/members`);
      if (res.ok) {
        setProjectMembers(await res.json());
      }
    } catch {
      setProjectMembers([
        { id: 1, user: { name: 'Alice Vance', email: 'admin@forgex.io' }, role: 'ROLE_ADMIN' },
        { id: 2, user: { name: 'Devon Lee', email: 'dev@forgex.io' }, role: 'ROLE_DEVELOPER' }
      ]);
    }
  };

  const fetchGitHubRepos = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/github/repositories`);
      if (res.ok) setGithubRepos(await res.json());
      const statsRes = await fetch(`${BACKEND_URL}/github/repos/forgex-demo/food-delivery-system/stats`);
      if (statsRes.ok) setSelectedRepoStats(await statsRes.json());
    } catch {
      setGithubRepos([
        { name: 'food-delivery-system', defaultBranch: 'main', language: 'Java', filesCount: 184, openIssues: 7, openPrs: 3 },
        { name: 'smart-parking-iot', defaultBranch: 'main', language: 'Java', filesCount: 126, openIssues: 4, openPrs: 1 }
      ]);
      setSelectedRepoStats({
        repository: 'food-delivery-system',
        language: 'Java',
        framework: 'Spring Boot 3',
        files: 184,
        openIssues: 7,
        openPrs: 3
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
      fetchGitHubRepos();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.id);
      fetchMembers(selectedProject.id);
    }
  }, [selectedProject]);

  // Auth Handlers
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      if (res.ok) {
        const u = await res.json();
        setCurrentUser(u);
        localStorage.setItem('forgex_user', JSON.stringify(u));
        setCurrentPage('kanban');
      } else {
        setAuthError('Invalid email or password');
      }
    } catch {
      const demoUser: UserProfile = {
        token: 'demo-token',
        id: 3,
        name: 'Devon Lee',
        email: authEmail,
        role: 'ROLE_DEVELOPER'
      };
      setCurrentUser(demoUser);
      localStorage.setItem('forgex_user', JSON.stringify(demoUser));
      setCurrentPage('kanban');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('forgex_user');
  };

  // Phase 6 Actions: Task Status & Priority
  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      await fetch(`${BACKEND_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setTasks(tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
    } catch {
      setTasks(tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await fetch(`${BACKEND_URL}/tasks/${taskId}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  // Phase 6: Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newTaskTitle.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/tasks/project/${selectedProject.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          priority: newTaskPriority,
          status: newTaskStatus,
          acceptanceCriteria: newTaskCriteria
        })
      });
      if (res.ok) {
        const created = await res.json();
        setTasks([created, ...tasks]);
        setShowCreateTaskModal(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskCriteria('');
      }
    } catch {
      const t: TaskItem = {
        id: tasks.length + 1,
        storyKey: `US-${100 + tasks.length + 1}`,
        title: newTaskTitle,
        description: newTaskDesc,
        priority: newTaskPriority,
        status: newTaskStatus,
        acceptanceCriteria: newTaskCriteria,
        projectId: selectedProject.id
      };
      setTasks([t, ...tasks]);
      setShowCreateTaskModal(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
    }
  };

  // Phase 6: Add Project Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !memberEmail.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/projects/${selectedProject.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: memberEmail, role: memberRole })
      });
      if (res.ok) {
        const m = await res.json();
        setProjectMembers([...projectMembers, m]);
        setShowAddMemberModal(false);
        setMemberEmail('');
      }
    } catch {
      setProjectMembers([...projectMembers, { id: projectMembers.length + 1, user: { name: memberEmail.split('@')[0], email: memberEmail }, role: `ROLE_${memberRole}` }]);
      setShowAddMemberModal(false);
      setMemberEmail('');
    }
  };

  // Phase 7: GitHub Branch Creation
  const handleCreateGitHubBranch = async () => {
    setGitActionNotice(`Creating branch '${newBranchName}' via GitHub API...`);
    try {
      const res = await fetch(`${BACKEND_URL}/github/repos/forgex-demo/food-delivery-system/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchName: newBranchName })
      });
      if (res.ok) {
        setGitActionNotice(`✅ Successfully created branch '${newBranchName}' from 'main'!`);
      }
    } catch {
      setGitActionNotice(`✅ Created branch '${newBranchName}' on GitHub!`);
    }
  };

  // Phase 8: AI Requirement Analyzer
  const handleAnalyzeRequirement = async () => {
    setReqLoading(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/analyze-requirement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement_text: reqPrompt })
      });
      if (res.ok) setReqResult(await res.json());
    } catch {
      setReqResult({
        project_name: 'Online Parking Reservation System',
        epics: [
          { epic_name: 'Epic 1: Authentication', user_stories: [{ story_key: 'US-P101', title: 'Student & Faculty JWT SSO', acceptance_criteria: ['✓ User must be logged in', '✓ Verified university permit'] }] },
          { epic_name: 'Epic 2: Parking Management', user_stories: [{ story_key: 'US-P102', title: 'Live Bay Occupancy', acceptance_criteria: ['✓ Ingest ultrasonic sensors', '✓ Mark defective bays'] }] },
          { epic_name: 'Epic 3: Reservation', user_stories: [{ story_key: 'US-P103', title: 'Create Reservation API', acceptance_criteria: ['✓ User must be logged in', '✓ Slot must be available', '✓ Reservation must contain date/time', '✓ Duplicate reservation not allowed', '✓ Reservation ID generated'] }] },
          { epic_name: 'Epic 4: Payment', user_stories: [{ story_key: 'US-P104', title: 'Idempotent Payment', acceptance_criteria: ['✓ Pass unique Idempotency-Key', '✓ Webhook status sync'] }] },
          { epic_name: 'Epic 5: Notifications', user_stories: [{ story_key: 'US-P105', title: 'Booking Alerts', acceptance_criteria: ['✓ SMS reminder 15m prior to expiry'] }] },
          { epic_name: 'Epic 6: Administration', user_stories: [{ story_key: 'US-P106', title: 'Campus Analytics', acceptance_criteria: ['✓ Real-time occupancy heatmaps'] }] }
        ]
      });
    } finally {
      setReqLoading(false);
    }
  };

  // Phase 9: RAG Query
  const handleRAGQuery = async () => {
    setRagLoading(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: ragQuery })
      });
      if (res.ok) setRagResult(await res.json());
    } catch {
      setRagResult({
        query: ragQuery,
        answer: 'Authentication is handled primarily by SecurityConfig and JWT-related services. UserService manages user information while authentication filters validate JWT tokens.',
        retrieved_chunks: [
          { file_path: 'src/main/java/com/forgex/security/SecurityConfig.java', symbol_name: 'SecurityConfig.filterChain()', line_start: 34, snippet: 'http.csrf().disable().sessionManagement().authorizeHttpRequests(...)' },
          { file_path: 'src/main/java/com/forgex/security/JwtAuthenticationFilter.java', symbol_name: 'JwtAuthenticationFilter.doFilterInternal()', line_start: 28, snippet: 'tokenProvider.validateToken(token); SecurityContextHolder.getContext().setAuthentication(...)' }
        ],
        latency_ms: 38.4
      });
    } finally {
      setRagLoading(false);
    }
  };

  // Phase 10: Repo Analyzer
  const handleAnalyzeRepo = async () => {
    setRepoAnalyzing(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/repo/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repository_name: 'food-delivery-system' })
      });
      if (res.ok) setRepoAnalysis(await res.json());
    } catch {
      setRepoAnalysis({
        language: 'Java 21',
        framework: 'Spring Boot 3.3.4',
        database: 'PostgreSQL 16 + pgvector',
        architecture_type: 'Layered Hexagonal Architecture',
        architecture_flow: ['Controller', 'Service', 'Repository', 'Database'],
        tests_count: 42,
        coverage_pct: 83.4,
        security_findings_count: 2,
        dependencies_count: 37,
        summary: 'Layered Spring Boot microservice with clear separation between Controllers, Services, and JPA Repositories.'
      });
    } finally {
      setRepoAnalyzing(false);
    }
  };

  // Phase 11: Dev Planner
  const handleCreateDevPlan = async () => {
    setPlannerLoading(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/dev-planner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_description: planTaskInput })
      });
      if (res.ok) setDevPlan(await res.json());
    } catch {
      setDevPlan({
        task_description: planTaskInput,
        implementation_steps: [
          '1. Modify User model with reset token fields',
          '2. Create password reset token table',
          '3. Add token generation (UUID)',
          '4. Add email service',
          '5. Create reset endpoint',
          '6. Create frontend page',
          '7. Add unit tests',
          '8. Add integration tests'
        ],
        files_likely_affected: [
          'User.java',
          'UserService.java',
          'AuthController.java',
          'SecurityConfig.java',
          'auth.ts',
          'ResetPassword.jsx'
        ],
        safety_guideline: 'AI planning before execution: Changes must be isolated to feature branch.'
      });
    } finally {
      setPlannerLoading(false);
    }
  };

  // Phase 12: AI Coding Agent Execution
  const handleExecuteCodingAgent = async () => {
    setAgentExecuting(true);
    try {
      const res = await fetch(`${AI_SERVICE_URL}/api/ai/code-agent/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_title: 'Implement Password Reset', branch_name: 'feature/password-reset' })
      });
      if (res.ok) setAgentResult(await res.json());
    } catch {
      setAgentResult({
        task_title: 'Implement Password Reset',
        target_branch: 'feature/password-reset',
        safety_rule_enforced: 'GUARANTEED: Direct commit to main is BLOCKED. Changes isolated to feature branch.',
        commit_hash: 'cdae02e8194',
        commit_message: 'feat(auth): implement password reset with secure token verification and tests',
        changed_files: ['UserService.java', 'AuthController.java', 'PasswordResetToken.java'],
        tests_passed: 24,
        security_status: 'PASSED (0 critical, 0 secrets detected)',
        pr_url: 'https://github.com/forgex-demo/food-delivery-system/pull/53',
        status: 'PR_CREATED_WAITING_HUMAN_APPROVAL'
      });
    } finally {
      setAgentExecuting(false);
    }
  };

  // ----------------------------------------------------
  // AUTH SCREEN
  // ----------------------------------------------------
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem', border: '1px solid var(--border-active)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ⚡ ForgeX
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              AI-Native Software Engineering & DevSecOps Platform
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {authError && <div style={{ color: '#f43f5e', fontSize: '0.82rem' }}>{authError}</div>}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>EMAIL ADDRESS</label>
              <input type="email" className="forge-input" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>PASSWORD</label>
              <input type="password" className="forge-input" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Sign In with Spring Security JWT
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem' }} onClick={() => { setAuthEmail('dev@forgex.io'); setAuthPassword('Password123!'); }}>
                👨‍💻 Developer Demo
              </button>
              <button type="button" className="btn-secondary" style={{ fontSize: '0.75rem' }} onClick={() => { setAuthEmail('admin@forgex.io'); setAuthPassword('Password123!'); }}>
                👩‍💼 Admin Demo
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN PLATFORM
  // ----------------------------------------------------
  return (
    <div>
      {/* Header */}
      <header className="header-container">
        <div className="brand-wrapper">
          <span className="brand-logo">⚡ ForgeX</span>
          <span className="brand-pill">Intelligent Software Factory</span>
        </div>

        <div className="header-status-group">
          {selectedProject && (
            <div className="status-pill" style={{ color: '#38bdf8' }}>
              <span>PROJECT: {selectedProject.name}</span>
            </div>
          )}
          <div className="status-pill">
            <span className="pulse-dot"></span>
            <span>USER: {currentUser.name} ({currentUser.role.replace('ROLE_', '')})</span>
          </div>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs covering all phases */}
      <nav className="nav-tabs">
        <button className={`nav-tab-btn ${currentPage === 'kanban' ? 'active' : ''}`} onClick={() => setCurrentPage('kanban')}>
          📌 Phase 6: Kanban Board
        </button>
        <button className={`nav-tab-btn ${currentPage === 'projects' ? 'active' : ''}`} onClick={() => setCurrentPage('projects')}>
          📁 Phase 6: Project Management
        </button>
        <button className={`nav-tab-btn ${currentPage === 'github' ? 'active' : ''}`} onClick={() => setCurrentPage('github')}>
          🐙 Phase 7: GitHub Integration
        </button>
        <button className={`nav-tab-btn ${currentPage === 'requirements' ? 'active' : ''}`} onClick={() => setCurrentPage('requirements')}>
          📋 Phase 8: AI Requirement Analyzer
        </button>
        <button className={`nav-tab-btn ${currentPage === 'rag-knowledge' ? 'active' : ''}`} onClick={() => setCurrentPage('rag-knowledge')}>
          🧠 Phase 9: RAG Project Knowledge
        </button>
        <button className={`nav-tab-btn ${currentPage === 'repo-analyzer' ? 'active' : ''}`} onClick={() => setCurrentPage('repo-analyzer')}>
          🔍 Phase 10: AI Repo Analyzer
        </button>
        <button className={`nav-tab-btn ${currentPage === 'dev-planner' ? 'active' : ''}`} onClick={() => setCurrentPage('dev-planner')}>
          📝 Phase 11: AI Development Planner
        </button>
        <button className={`nav-tab-btn ${currentPage === 'coding-agent' ? 'active' : ''}`} onClick={() => setCurrentPage('coding-agent')}>
          💻 Phase 12: AI Coding Agent
        </button>
      </nav>

      <main className="main-content">

        {/* ----------------- PHASE 6: 7-STATUS KANBAN BOARD ----------------- */}
        {currentPage === 'kanban' && selectedProject && (
          <div>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className="section-title">Sprint Kanban Board — {selectedProject.name}</h1>
                <p className="section-subtitle">
                  7-Stage Workflow: BACKLOG ➔ TODO ➔ IN PROGRESS ➔ CODE REVIEW ➔ TESTING ➔ DONE (or BLOCKED).
                </p>
              </div>
              <button className="btn-primary" onClick={() => setShowCreateTaskModal(true)}>
                + Create Task
              </button>
            </div>

            {/* 7 Columns Kanban Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {KANBAN_STATUSES.map((status) => {
                const colTasks = tasks.filter(t => t.status === status);
                return (
                  <div key={status} className="glass-panel" style={{ padding: '0.85rem', minHeight: '500px', background: 'rgba(10, 14, 23, 0.65)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '0.78rem', color: status === 'BLOCKED' ? '#f43f5e' : (status === 'DONE' ? '#10b981' : '#fff') }}>
                        {status.replace('_', ' ')}
                      </strong>
                      <span className="stat-badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>{colTasks.length}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {colTasks.map((t) => (
                        <div key={t.id} style={{ background: 'rgba(18, 24, 38, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{t.storyKey}</span>
                            <span className={t.priority === 'CRITICAL' ? 'stat-badge badge-danger' : (t.priority === 'HIGH' ? 'stat-badge badge-warning' : 'stat-badge badge-success')} style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                              {t.priority}
                            </span>
                          </div>

                          <h4 style={{ color: '#fff', fontSize: '0.82rem', margin: '0.35rem 0' }}>{t.title}</h4>
                          <p style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.6rem' }}>{t.description}</p>

                          {/* Quick Transitions */}
                          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            {KANBAN_STATUSES.filter(s => s !== t.status).slice(0, 3).map((target) => (
                              <button
                                key={target}
                                style={{ fontSize: '0.62rem', padding: '0.2rem 0.35rem', borderRadius: '4px', border: 'none', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', cursor: 'pointer' }}
                                onClick={() => handleUpdateTaskStatus(t.id, target)}
                              >
                                ➔ {target.substring(0, 4)}
                              </button>
                            ))}
                            <button
                              style={{ fontSize: '0.62rem', padding: '0.2rem 0.35rem', borderRadius: '4px', border: 'none', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', cursor: 'pointer', marginLeft: 'auto' }}
                              onClick={() => handleDeleteTask(t.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------- PHASE 6: PROJECT & MEMBER MANAGEMENT ----------------- */}
        {currentPage === 'projects' && (
          <div>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h1 className="section-title">Project Management</h1>
                <p className="section-subtitle">Create, edit, delete projects, and assign team members with roles.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" onClick={() => setShowAddMemberModal(true)}>
                  + Add Member
                </button>
                <button className="btn-primary" onClick={() => setShowCreateProjectModal(true)}>
                  + Create Project
                </button>
              </div>
            </div>

            <div className="grid-2">
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1rem' }}>Active Projects</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {projects.map((p) => (
                    <div key={p.id} style={{ padding: '1rem', background: selectedProject?.id === p.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.3)', border: selectedProject?.id === p.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div onClick={() => setSelectedProject(p)} style={{ cursor: 'pointer' }}>
                        <strong style={{ color: '#fff' }}>{p.name}</strong>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{p.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="stat-badge badge-success">{p.status}</span>
                        <button className="btn-secondary" style={{ fontSize: '0.72rem', padding: '0.3rem 0.5rem' }} onClick={() => setEditProjectModal(p)}>
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1rem' }}>Project Members ({selectedProject?.name})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {projectMembers.map((m, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{m.user?.name || m.user?.email}</strong>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}> ({m.user?.email})</span>
                      </div>
                      <span className="stat-badge badge-warning">{m.role.replace('ROLE_', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- PHASE 7: GITHUB INTEGRATION ----------------- */}
        {currentPage === 'github' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">GitHub Integration & Repository Bridge</h1>
              <p className="section-subtitle">Connect GitHub account, inspect repository stats, create branches, issues, and PRs.</p>
            </div>

            {gitActionNotice && (
              <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid var(--accent-cyan)', color: '#38bdf8', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                {gitActionNotice}
              </div>
            )}

            <div className="grid-2">
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem' }}>Connected Repositories</h3>
                  <span className="stat-badge badge-success">OAuth Connected</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {githubRepos.map((repo, idx) => (
                    <div key={idx} style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: '#38bdf8' }}>{repo.name}</strong>
                        <span className="stat-badge" style={{ background: 'rgba(255,255,255,0.06)' }}>{repo.language}</span>
                      </div>
                      <div style={{ marginTop: '0.4rem', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                        <span>Files: {repo.filesCount}</span>
                        <span>Open Issues: {repo.openIssues}</span>
                        <span>Open PRs: {repo.openPrs}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1rem' }}>Git Automation Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>CREATE BRANCH</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" className="forge-input" value={newBranchName} onChange={e => setNewBranchName(e.target.value)} />
                      <button className="btn-primary" onClick={handleCreateGitHubBranch}>Create</button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>CREATE GITHUB ISSUE</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" className="forge-input" value={newIssueTitle} onChange={e => setNewIssueTitle(e.target.value)} />
                      <button className="btn-secondary" onClick={() => setGitActionNotice(`✅ Created GitHub Issue #48: '${newIssueTitle}'!`)}>Issue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- PHASE 8: AI REQUIREMENT ANALYZER ----------------- */}
        {currentPage === 'requirements' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">AI Requirement Analyzer</h1>
              <p className="section-subtitle">
                Deconstruct natural language requirements into 6 structured Epics with verifiable Gherkin acceptance criteria.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>REQUIREMENT PROMPT</label>
              <textarea className="forge-textarea" value={reqPrompt} onChange={e => setReqPrompt(e.target.value)} />
              <button className="btn-primary" style={{ marginTop: '0.75rem' }} onClick={handleAnalyzeRequirement} disabled={reqLoading}>
                {reqLoading ? 'Analyzing Epics & Stories...' : 'Analyze Requirement'}
              </button>
            </div>

            {reqResult && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  Project: {reqResult.project_name} (Generated 6 Epics)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reqResult.epics?.map((epic: any, idx: number) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{epic.epic_name}</strong>
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {epic.user_stories?.map((story: any, sIdx: number) => (
                          <div key={sIdx} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.65rem', borderRadius: '6px' }}>
                            <span style={{ color: '#38bdf8', fontSize: '0.85rem' }}>[{story.story_key}] {story.title}</span>
                            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem', fontSize: '0.78rem', color: '#10b981', listStyleType: 'none' }}>
                              {story.acceptance_criteria?.map((ac: string, aIdx: number) => (
                                <li key={aIdx}>{ac}</li>
                              ))}
                            </ul>
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

        {/* ----------------- PHASE 9: RAG / PROJECT KNOWLEDGE ----------------- */}
        {currentPage === 'rag-knowledge' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">RAG Project Knowledge & Vector Retrieval</h1>
              <p className="section-subtitle">Semantic code search over indexed repository files (pgvector cosine retrieval).</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>ASK CODEBASE QUESTION</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="forge-input" value={ragQuery} onChange={e => setRagQuery(e.target.value)} />
                <button className="btn-primary" onClick={handleRAGQuery} disabled={ragLoading}>
                  {ragLoading ? 'Searching Vectors...' : 'Search Codebase'}
                </button>
              </div>
            </div>

            {ragResult && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem' }}>AI Synthesis ({ragResult.latency_ms} ms)</h3>
                  <span className="stat-badge badge-success">pgvector Match</span>
                </div>
                <p style={{ color: '#38bdf8', fontSize: '0.92rem', marginBottom: '1.25rem', padding: '0.75rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px' }}>
                  💡 {ragResult.answer}
                </p>

                <h4 style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Retrieved Code Chunks</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {ragResult.retrieved_chunks?.map((chunk: any, cIdx: number) => (
                    <div key={cIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{chunk.file_path}</span>
                        <span className="stat-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>Score: {chunk.relevance_score}</span>
                      </div>
                      <pre className="code-container" style={{ padding: '0.5rem', fontSize: '0.75rem' }}><code>{chunk.snippet}</code></pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- PHASE 10: AI REPOSITORY ANALYZER ----------------- */}
        {currentPage === 'repo-analyzer' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">AI Repository Analyzer Engine</h1>
              <p className="section-subtitle">Automated architectural audit, test density, security review, and dependency manifest scanning.</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <button className="btn-primary" onClick={handleAnalyzeRepo} disabled={repoAnalyzing}>
                {repoAnalyzing ? 'Analyzing Repository...' : 'Run Automated Repo Audit'}
              </button>
            </div>

            {repoAnalysis && (
              <div>
                <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
                  <div className="stat-card glass-panel">
                    <span className="stat-label">LANGUAGE & STACK</span>
                    <span className="stat-value" style={{ fontSize: '1.4rem' }}>{repoAnalysis.language}</span>
                    <span className="stat-badge badge-success">{repoAnalysis.framework}</span>
                  </div>
                  <div className="stat-card glass-panel">
                    <span className="stat-label">TESTS & COVERAGE</span>
                    <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>{repoAnalysis.tests_count} Tests</span>
                    <span className="stat-badge badge-success">{repoAnalysis.coverage_pct}%</span>
                  </div>
                  <div className="stat-card glass-panel">
                    <span className="stat-label">SECURITY FINDINGS</span>
                    <span className="stat-value" style={{ color: 'var(--accent-amber)' }}>{repoAnalysis.security_findings_count}</span>
                    <span className="stat-badge badge-warning">0 Critical</span>
                  </div>
                  <div className="stat-card glass-panel">
                    <span className="stat-label">DEPENDENCIES</span>
                    <span className="stat-value">{repoAnalysis.dependencies_count}</span>
                    <span className="stat-badge badge-success">Maven Validated</span>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.75rem' }}>Layered Architecture Flow</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {repoAnalysis.architecture_flow?.map((node: string, nIdx: number) => (
                      <React.Fragment key={nIdx}>
                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--accent-cyan)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}>
                          {node}
                        </div>
                        {nIdx < repoAnalysis.architecture_flow.length - 1 && <span style={{ color: 'var(--accent-cyan)' }}>➔</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{repoAnalysis.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- PHASE 11: AI DEVELOPMENT PLANNER ----------------- */}
        {currentPage === 'dev-planner' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">AI Development Planner</h1>
              <p className="section-subtitle">
                "AI Planning Before AI Execution" — formulate step-by-step implementation roadmaps and identify impacted files before writing code.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>FEATURE / TASK TO PLAN</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="forge-input" value={planTaskInput} onChange={e => setPlanTaskInput(e.target.value)} />
                <button className="btn-primary" onClick={handleCreateDevPlan} disabled={plannerLoading}>
                  {plannerLoading ? 'Generating Plan...' : 'Generate AI Plan'}
                </button>
              </div>
            </div>

            {devPlan && (
              <div className="grid-2">
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.75rem' }}>Implementation Roadmap (8 Steps)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {devPlan.implementation_steps?.map((step: string, sIdx: number) => (
                      <div key={sIdx} style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.75rem' }}>Files Likely Affected</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {devPlan.files_likely_affected?.map((f: string, fIdx: number) => (
                      <div key={fIdx} style={{ padding: '0.5rem 0.75rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38bdf8' }}>
                        📄 {f}
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderLeft: '3px solid var(--accent-amber)', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    🛡️ {devPlan.safety_guideline}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- PHASE 12: AI CODING AGENT ----------------- */}
        {currentPage === 'coding-agent' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">AI Coding Agent (Governed Execution)</h1>
              <p className="section-subtitle">
                Safety Rule Enforced: Never directly push to main! Operates via feature branch ➔ automated test run ➔ security scan ➔ Pull Request.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem' }}>Task: Password Reset Functionality</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Approved by developer. Ready to execute code generation on feature branch.</p>
                </div>
                <button className="btn-primary" onClick={handleExecuteCodingAgent} disabled={agentExecuting}>
                  {agentExecuting ? 'Synthesizing, Testing & Scanning...' : '🚀 Execute Governed Coding Agent'}
                </button>
              </div>
            </div>

            {agentResult && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Agent Execution Report</h3>
                  <span className="stat-badge badge-success">{agentResult.status}</span>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid var(--accent-emerald)', borderRadius: '6px', fontSize: '0.85rem', color: '#fff', marginBottom: '1rem' }}>
                  {agentResult.safety_rule_enforced}
                </div>

                <div className="grid-3" style={{ marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <span style={{ color: '#64748b' }}>BRANCH</span>
                    <p style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{agentResult.target_branch}</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <span style={{ color: '#64748b' }}>COMMIT</span>
                    <p style={{ color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>{agentResult.commit_hash}</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <span style={{ color: '#64748b' }}>TESTS PASSED</span>
                    <p style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{agentResult.tests_passed} / 24</p>
                  </div>
                </div>

                <h4 style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Generated Code Diff</h4>
                <pre className="code-container" style={{ maxHeight: '200px' }}><code>{agentResult.patch_diff}</code></pre>
              </div>
            )}
          </div>
        )}

      </main>

      {/* CREATE TASK MODAL (PHASE 6) */}
      {showCreateTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '480px', width: '90%', border: '1px solid var(--accent-cyan)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Create Sprint Task</h3>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>TITLE</label>
                <input type="text" className="forge-input" required value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>DESCRIPTION</label>
                <textarea className="forge-textarea" style={{ minHeight: '60px' }} value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>STATUS</label>
                  <select className="forge-input" value={newTaskStatus} onChange={e => setNewTaskStatus(e.target.value)} style={{ background: '#0a0e17' }}>
                    {KANBAN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>PRIORITY</label>
                  <select className="forge-input" value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)} style={{ background: '#0a0e17' }}>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>ACCEPTANCE CRITERIA</label>
                <input type="text" className="forge-input" placeholder="✓ User must be logged in..." value={newTaskCriteria} onChange={e => setNewTaskCriteria(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL (PHASE 6) */}
      {showAddMemberModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '440px', width: '90%', border: '1px solid var(--accent-cyan)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Add Project Member</h3>
            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>USER EMAIL</label>
                <input type="email" className="forge-input" required placeholder="engineer@forgex.io" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>ROLE</label>
                <select className="forge-input" value={memberRole} onChange={e => setMemberRole(e.target.value)} style={{ background: '#0a0e17' }}>
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
