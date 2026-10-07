import React, { useState, useEffect } from 'react';

// API Configuration
const BACKEND_URL = 'http://localhost:8080/api/v1';
const AUTH_URL = 'http://localhost:8080/api/auth';
const AI_SERVICE_URL = 'http://localhost:8000';

type Page =
  | 'dashboard'
  | 'projects'
  | 'project-details'
  | 'requirements'
  | 'tasks'
  | 'repository'
  | 'ai-assistant'
  | 'testing'
  | 'security'
  | 'deployment'
  | 'analytics';

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
  createdAt?: string;
}

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
  const [authLoading, setAuthLoading] = useState(false);

  // Active View / Page
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  // Backend Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create Project Modal
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectRepo, setNewProjectRepo] = useState('');

  // Create Task Modal
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('HIGH');
  const [newTaskStoryKey, setNewTaskStoryKey] = useState('');

  // Module States
  const [reqPrompt, setReqPrompt] = useState('Build an online food delivery application with login, restaurant search, cart and payment.');
  const [reqData, setReqData] = useState<any>(null);
  const [reqLoading, setReqLoading] = useState(false);

  const [repoQuery, setRepoQuery] = useState('Which files would be affected if I change the payment service?');
  const [repoData, setRepoData] = useState<any>(null);

  const [codePlan, setCodePlan] = useState<any>(null);
  const [secScanResult, setSecScanResult] = useState<any>(null);

  // Trust Score Dynamic Controls
  const [unitPassed, setUnitPassed] = useState(24);
  const [unitTotal] = useState(24);
  const [critVulns, setCritVulns] = useState(0);
  const [secretsFound, setSecretsFound] = useState(0);

  // Load Projects from Backend
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
      // Fallback seed
      const fallback: Project[] = [
        { id: 1, name: 'Food Delivery Platform', description: 'High-throughput food ordering engine with restaurant catalog, cart checkout, and Stripe integration.', repositoryUrl: 'https://github.com/forgex-demo/foodieflow', status: 'ACTIVE' },
        { id: 2, name: 'Parking System', description: 'IoT-integrated automated parking bay reservation system with concurrency control.', repositoryUrl: 'https://github.com/forgex-demo/smartpark', status: 'ACTIVE' },
        { id: 3, name: 'College Portal', description: 'Integrated academic management system with grades, attendance, and fee tracking.', repositoryUrl: 'https://github.com/forgex-demo/collegeportal', status: 'DEVELOPMENT' },
        { id: 4, name: 'AI DevSecOps Pipeline', description: 'Continuous compliance and automated verification engine.', repositoryUrl: 'https://github.com/forgex-demo/pipeline', status: 'ACTIVE' }
      ];
      setProjects(fallback);
      if (!selectedProject) setSelectedProject(fallback[0]);
    }
  };

  // Load Tasks for Selected Project
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
        { id: 2, storyKey: 'US-102', title: 'Role-Based Access Control', description: 'Enforce RBAC annotations on admin and restaurant routes', status: 'IN_REVIEW', priority: 'MEDIUM', epicName: 'Authentication' },
        { id: 3, storyKey: 'US-103', title: 'Geo-Radius Menu Search', description: 'Query open restaurants within 5km radius with Redis cache', status: 'IN_PROGRESS', priority: 'HIGH', epicName: 'Catalog' },
        { id: 4, storyKey: 'US-104', title: 'Idempotent Payment Intent API', description: 'Stripe checkout with Idempotency-Key validation', status: 'BACKLOG', priority: 'CRITICAL', epicName: 'Payments' }
      ]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.id);
    }
  }, [selectedProject]);

  // Auth: Login
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      if (res.ok) {
        const user: UserProfile = await res.json();
        setCurrentUser(user);
        localStorage.setItem('forgex_user', JSON.stringify(user));
        setCurrentPage('dashboard');
      } else {
        setAuthError('Invalid email or password');
      }
    } catch {
      // Offline fallback login for demo convenience
      const demoUser: UserProfile = {
        token: 'demo-jwt-token-12345',
        id: 3,
        name: authEmail.includes('admin') ? 'Alice Vance' : 'Devon Lee',
        email: authEmail,
        role: authEmail.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_DEVELOPER'
      };
      setCurrentUser(demoUser);
      localStorage.setItem('forgex_user', JSON.stringify(demoUser));
      setCurrentPage('dashboard');
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth: Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: authName, email: authEmail, password: authPassword, role: authRole })
      });
      if (res.ok) {
        const user: UserProfile = await res.json();
        setCurrentUser(user);
        localStorage.setItem('forgex_user', JSON.stringify(user));
        setCurrentPage('dashboard');
      } else {
        const err = await res.json();
        setAuthError(err.error || 'Registration failed');
      }
    } catch {
      setAuthError('Network error connecting to backend auth');
    } finally {
      setAuthLoading(false);
    }
  };

  // Auth: Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('forgex_user');
  };

  // Action: Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDesc,
          repositoryUrl: newProjectRepo || `https://github.com/forgex-demo/${newProjectName.toLowerCase().replaceAll(' ', '-')}`
        })
      });
      if (res.ok) {
        const created = await res.json();
        setProjects([created, ...projects]);
        setSelectedProject(created);
        setShowCreateProjectModal(false);
        setNewProjectName('');
        setNewProjectDesc('');
        setNewProjectRepo('');
      }
    } catch {
      const newProj: Project = {
        id: projects.length + 1,
        name: newProjectName,
        description: newProjectDesc,
        repositoryUrl: newProjectRepo || `https://github.com/forgex-demo/${newProjectName.toLowerCase().replaceAll(' ', '-')}`,
        status: 'ACTIVE'
      };
      setProjects([newProj, ...projects]);
      setSelectedProject(newProj);
      setShowCreateProjectModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
    }
  };

  // Action: Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProject) return;

    try {
      const res = await fetch(`${BACKEND_URL}/tasks/project/${selectedProject.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          priority: newTaskPriority,
          storyKey: newTaskStoryKey || `US-${100 + tasks.length + 1}`,
          status: 'BACKLOG'
        })
      });
      if (res.ok) {
        const created = await res.json();
        setTasks([created, ...tasks]);
        setShowCreateTaskModal(false);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskStoryKey('');
      }
    } catch {
      const newTask: TaskItem = {
        id: tasks.length + 1,
        storyKey: newTaskStoryKey || `US-${100 + tasks.length + 1}`,
        title: newTaskTitle,
        description: newTaskDesc,
        status: 'BACKLOG',
        priority: newTaskPriority,
        projectId: selectedProject.id
      };
      setTasks([newTask, ...tasks]);
      setShowCreateTaskModal(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
    }
  };

  // Action: Update Task Status
  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTasks(tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
      }
    } catch {
      setTasks(tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
    }
  };

  // Calculate Trust Score Gauge
  const calculateTrustScore = () => {
    const unitScore = (unitPassed / unitTotal) * 25.0;
    const intScore = 15.0;
    const secScore = critVulns > 0 ? 0.0 : 20.0;
    const secSecretsScore = secretsFound > 0 ? 0.0 : 15.0;
    const depScore = 7.0;
    const reqScore = 9.2;
    const qualityScore = 4.8;

    let total = unitScore + intScore + secScore + secSecretsScore + depScore + reqScore + qualityScore;
    let blocked = false;
    let reason = '';

    if (critVulns > 0) {
      total = 20.0;
      blocked = true;
      reason = 'CRITICAL SQL INJECTION / SAST FLAW';
    } else if (secretsFound > 0) {
      total = 25.0;
      blocked = true;
      reason = 'HARDCODED AWS CREDENTIAL DETECTED';
    }

    const finalScore = Math.max(0, Math.min(100, Math.round(total)));
    const verdict = blocked || finalScore < 65 ? 'BLOCKED - INSECURE' : (finalScore >= 85 ? 'SAFE TO REVIEW' : 'REQUIRES SENIOR APPROVAL');
    const badgeColor = finalScore >= 85 ? 'green' : (finalScore >= 65 ? 'yellow' : 'red');

    return { finalScore, verdict, badgeColor, blocked, reason };
  };

  const trustResult = calculateTrustScore();

  // ----------------------------------------------------
  // VIEW: AUTHENTICATION (LOGIN / REGISTER)
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

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: '8px' }}>
            <button
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', background: authMode === 'login' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: authMode === 'login' ? '#fff' : '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              onClick={() => setAuthMode('login')}
            >
              Sign In
            </button>
            <button
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', background: authMode === 'register' ? 'rgba(56, 189, 248, 0.2)' : 'transparent', color: authMode === 'register' ? '#fff' : '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>

          {authError && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '1rem' }}>
              {authError}
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="forge-input"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>PASSWORD</label>
                <input
                  type="password"
                  className="forge-input"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }} disabled={authLoading}>
                {authLoading ? 'Authenticating with Spring Security...' : 'Sign In with JWT'}
              </button>

              <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  QUICK DEMO ROLES (ONE-CLICK):
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                    onClick={() => { setAuthEmail('dev@forgex.io'); setAuthPassword('Password123!'); }}
                  >
                    👨‍💻 Developer
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                    onClick={() => { setAuthEmail('admin@forgex.io'); setAuthPassword('Password123!'); }}
                  >
                    👩‍💼 Admin
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                    onClick={() => { setAuthEmail('pm@forgex.io'); setAuthPassword('Password123!'); }}
                  >
                    👨‍💼 PM
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                    onClick={() => { setAuthEmail('viewer@forgex.io'); setAuthPassword('Password123!'); }}
                  >
                    👁️ Viewer
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>FULL NAME</label>
                <input
                  type="text"
                  className="forge-input"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="forge-input"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>PASSWORD</label>
                <input
                  type="password"
                  className="forge-input"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>ROLE</label>
                <select
                  className="forge-input"
                  value={authRole}
                  onChange={(e) => setAuthRole(e.target.value)}
                  style={{ background: '#0a0e17' }}
                >
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }} disabled={authLoading}>
                {authLoading ? 'Creating User...' : 'Create Account (BCrypt)'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN AUTHENTICATED PLATFORM
  // ----------------------------------------------------
  return (
    <div>
      {/* Platform Header */}
      <header className="header-container">
        <div className="brand-wrapper">
          <span className="brand-logo">⚡ ForgeX</span>
          <span className="brand-pill">AI DevSecOps Factory</span>
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

      {/* Main Navigation Tabs */}
      <nav className="nav-tabs">
        <button className={`nav-tab-btn ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>
          📊 Dashboard
        </button>
        <button className={`nav-tab-btn ${currentPage === 'projects' ? 'active' : ''}`} onClick={() => setCurrentPage('projects')}>
          📁 Projects
        </button>
        <button className={`nav-tab-btn ${currentPage === 'project-details' ? 'active' : ''}`} onClick={() => setCurrentPage('project-details')}>
          📄 Project Details
        </button>
        <button className={`nav-tab-btn ${currentPage === 'requirements' ? 'active' : ''}`} onClick={() => setCurrentPage('requirements')}>
          📋 Requirements
        </button>
        <button className={`nav-tab-btn ${currentPage === 'tasks' ? 'active' : ''}`} onClick={() => setCurrentPage('tasks')}>
          ✅ Tasks Board
        </button>
        <button className={`nav-tab-btn ${currentPage === 'repository' ? 'active' : ''}`} onClick={() => setCurrentPage('repository')}>
          🔍 Repository
        </button>
        <button className={`nav-tab-btn ${currentPage === 'ai-assistant' ? 'active' : ''}`} onClick={() => setCurrentPage('ai-assistant')}>
          🤖 AI Assistant
        </button>
        <button className={`nav-tab-btn ${currentPage === 'testing' ? 'active' : ''}`} onClick={() => setCurrentPage('testing')}>
          🧪 Testing
        </button>
        <button className={`nav-tab-btn ${currentPage === 'security' ? 'active' : ''}`} onClick={() => setCurrentPage('security')}>
          🛡️ Security
        </button>
        <button className={`nav-tab-btn ${currentPage === 'deployment' ? 'active' : ''}`} onClick={() => setCurrentPage('deployment')}>
          🚀 Deployment & Trust
        </button>
        <button className={`nav-tab-btn ${currentPage === 'analytics' ? 'active' : ''}`} onClick={() => setCurrentPage('analytics')}>
          📈 Analytics
        </button>
      </nav>

      {/* Main Content Workspace */}
      <main className="main-content">

        {/* ----------------- PAGE: DASHBOARD (MATCHING USER SPECIFICATION) ----------------- */}
        {currentPage === 'dashboard' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">ForgeX Engineering Command Center</h1>
              <p className="section-subtitle">Real-time status across projects, tasks, test suites, and DevSecOps gates.</p>
            </div>

            {/* Dashboard 4 Summary Cards */}
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <div className="stat-card glass-panel">
                <span className="stat-label">PROJECTS</span>
                <span className="stat-value">{projects.length}</span>
                <span className="stat-badge badge-success">Active Ecosystem</span>
              </div>

              <div className="stat-card glass-panel">
                <span className="stat-label">TASKS</span>
                <span className="stat-value">28</span>
                <span className="stat-badge badge-success">4 In Progress</span>
              </div>

              <div className="stat-card glass-panel">
                <span className="stat-label">TESTS</span>
                <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>91%</span>
                <span className="stat-badge badge-success">24/24 Passed</span>
              </div>

              <div className="stat-card glass-panel">
                <span className="stat-label">SECURITY</span>
                <span className="stat-value" style={{ color: 'var(--accent-amber)' }}>2 Issues</span>
                <span className="stat-badge badge-warning">0 Critical</span>
              </div>
            </div>

            <div className="grid-2">
              {/* Left Column: Projects List */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Projects</h3>
                  <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => setShowCreateProjectModal(true)}>
                    + New Project
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      style={{
                        padding: '1rem',
                        background: selectedProject?.id === proj.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.3)',
                        border: selectedProject?.id === proj.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedProject(proj)}
                    >
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{proj.name}</strong>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.2rem' }}>{proj.description}</p>
                      </div>

                      <div>
                        {proj.status === 'ACTIVE' ? (
                          <span className="stat-badge badge-success">🟢 Active</span>
                        ) : (
                          <span className="stat-badge badge-warning">🟡 Development</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Engineering Health */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1.25rem' }}>AI Engineering Health</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="check-item">
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Requirement Coverage</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>92%</span>
                      <span className="stat-badge badge-success">HEALTHY</span>
                    </div>
                  </div>

                  <div className="check-item">
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Test Coverage</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', fontWeight: 600 }}>91%</span>
                      <span className="stat-badge badge-success">VERIFIED</span>
                    </div>
                  </div>

                  <div className="check-item">
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Security Health</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', fontWeight: 600 }}>94%</span>
                      <span className="stat-badge badge-success">0 CRITICAL</span>
                    </div>
                  </div>

                  <div className="check-item">
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Deployment Status</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>Ready</span>
                      <span className="stat-badge badge-success">PROMOTED</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                  <strong style={{ color: '#38bdf8', fontSize: '0.85rem' }}>🎯 AI Project Manager Highlight:</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    Food Delivery module has completed all unit test gates. Trust Score is at 87/100 (Safe to Review).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- PAGE: PROJECTS ----------------- */}
        {currentPage === 'projects' && (
          <div>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className="section-title">Engineering Projects</h1>
                <p className="section-subtitle">Manage project repositories, owner assignments, and sprint milestones.</p>
              </div>
              <button className="btn-primary" onClick={() => setShowCreateProjectModal(true)}>
                + Create Project
              </button>
            </div>

            <div className="grid-3">
              {projects.map((proj) => (
                <div key={proj.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.05rem' }}>{proj.name}</h3>
                      <span className={proj.status === 'ACTIVE' ? 'stat-badge badge-success' : 'stat-badge badge-warning'}>
                        {proj.status}
                      </span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1rem' }}>{proj.description}</p>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                      {proj.repositoryUrl}
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn-primary"
                      style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem' }}
                      onClick={() => {
                        setSelectedProject(proj);
                        setCurrentPage('tasks');
                      }}
                    >
                      View Tasks
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.45rem' }}
                      onClick={() => {
                        setSelectedProject(proj);
                        setCurrentPage('project-details');
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- PAGE: PROJECT DETAILS ----------------- */}
        {currentPage === 'project-details' && selectedProject && (
          <div>
            <div className="section-header">
              <h1 className="section-title">Project: {selectedProject.name}</h1>
              <p className="section-subtitle">Repository overview, member governance, and linked epics.</p>
            </div>

            <div className="grid-2">
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1rem' }}>Repository & Architecture</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div><strong style={{ color: '#94a3b8' }}>Repo URL: </strong> <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{selectedProject.repositoryUrl}</span></div>
                  <div><strong style={{ color: '#94a3b8' }}>Status: </strong> <span className="stat-badge badge-success">{selectedProject.status}</span></div>
                  <div><strong style={{ color: '#94a3b8' }}>Description: </strong> <p style={{ color: '#cbd5e1', marginTop: '0.3rem' }}>{selectedProject.description}</p></div>
                  <div><strong style={{ color: '#94a3b8' }}>Primary Language: </strong> <span style={{ color: '#10b981' }}>Java 21 / Spring Boot 3</span></div>
                  <div><strong style={{ color: '#94a3b8' }}>Database: </strong> <span style={{ color: '#38bdf8' }}>PostgreSQL 16 + pgvector</span></div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1rem' }}>Team Members & Access Control</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                    <div><strong style={{ color: '#fff', fontSize: '0.85rem' }}>Alice Vance</strong> <span style={{ color: '#64748b', fontSize: '0.75rem' }}> (admin@forgex.io)</span></div>
                    <span className="stat-badge badge-warning">ADMIN</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                    <div><strong style={{ color: '#fff', fontSize: '0.85rem' }}>Marcus Brody</strong> <span style={{ color: '#64748b', fontSize: '0.75rem' }}> (pm@forgex.io)</span></div>
                    <span className="stat-badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>PROJECT_MANAGER</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                    <div><strong style={{ color: '#fff', fontSize: '0.85rem' }}>Devon Lee</strong> <span style={{ color: '#64748b', fontSize: '0.75rem' }}> (dev@forgex.io)</span></div>
                    <span className="stat-badge badge-success">DEVELOPER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- PAGE: TASKS BOARD (KANBAN & UPDATE TASK) ----------------- */}
        {currentPage === 'tasks' && selectedProject && (
          <div>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className="section-title">Sprint Tasks Board — {selectedProject.name}</h1>
                <p className="section-subtitle">Select or update status (Backlog ➔ In Progress ➔ In Review ➔ Done) with real-time JPA persistence.</p>
              </div>
              <button className="btn-primary" onClick={() => setShowCreateTaskModal(true)}>
                + Create Task
              </button>
            </div>

            {/* Kanban Columns */}
            <div className="grid-4" style={{ gap: '1rem' }}>
              {['BACKLOG', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((colStatus) => {
                const colTasks = tasks.filter(t => t.status === colStatus);
                return (
                  <div key={colStatus} className="glass-panel" style={{ padding: '1rem', minHeight: '450px', background: 'rgba(10, 14, 23, 0.6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{colStatus.replace('_', ' ')}</strong>
                      <span className="stat-badge" style={{ background: 'rgba(255,255,255,0.06)' }}>{colTasks.length}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {colTasks.map((t) => (
                        <div key={t.id} style={{ background: 'rgba(18, 24, 38, 0.85)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{t.storyKey}</span>
                            <span className={t.priority === 'CRITICAL' ? 'stat-badge badge-danger' : (t.priority === 'HIGH' ? 'stat-badge badge-warning' : 'stat-badge badge-success')} style={{ fontSize: '0.68rem' }}>
                              {t.priority}
                            </span>
                          </div>

                          <h4 style={{ color: '#fff', fontSize: '0.88rem', margin: '0.4rem 0' }}>{t.title}</h4>
                          <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem' }}>{t.description}</p>

                          {/* Quick Status Update Controls */}
                          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {['BACKLOG', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((s) => (
                              <button
                                key={s}
                                disabled={t.status === s}
                                style={{
                                  fontSize: '0.65rem',
                                  padding: '0.2rem 0.4rem',
                                  borderRadius: '4px',
                                  border: 'none',
                                  background: t.status === s ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
                                  color: t.status === s ? '#000' : '#cbd5e1',
                                  cursor: t.status === s ? 'default' : 'pointer'
                                }}
                                onClick={() => handleUpdateTaskStatus(t.id, s)}
                              >
                                {s.substring(0, 4)}
                              </button>
                            ))}
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

        {/* ----------------- PAGE: REQUIREMENTS (MODULE 1) ----------------- */}
        {currentPage === 'requirements' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">AI Requirement Analyzer</h1>
              <p className="section-subtitle">Convert unstructured user specs into architecture proposals, decomposed epics, and user stories.</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>REQUIREMENT INPUT</label>
              <textarea
                className="forge-textarea"
                value={reqPrompt}
                onChange={(e) => setReqPrompt(e.target.value)}
              />
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn-primary"
                  onClick={async () => {
                    setReqLoading(true);
                    try {
                      const res = await fetch(`${AI_SERVICE_URL}/api/ai/analyze-requirement`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ requirement_text: reqPrompt })
                      });
                      if (res.ok) setReqData(await res.json());
                    } catch {
                      setReqData({
                        architecture: { overview: 'Distributed Cloud-Native food ordering engine with microservices.' },
                        epics: [
                          { epic_name: 'EPIC-1: Authentication', user_stories: [{ story_key: 'US-101', title: 'Customer JWT Login' }] },
                          { epic_name: 'EPIC-2: Catalog', user_stories: [{ story_key: 'US-103', title: 'Geo-Radius Menu Search' }] },
                          { epic_name: 'EPIC-3: Payments', user_stories: [{ story_key: 'US-104', title: 'Stripe Idempotency API' }] }
                        ]
                      });
                    } finally {
                      setReqLoading(false);
                    }
                  }}
                  disabled={reqLoading}
                >
                  {reqLoading ? 'Analyzing...' : 'Deconstruct Requirement'}
                </button>
              </div>
            </div>

            {reqData && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#38bdf8', marginBottom: '0.5rem' }}>Architecture Blueprint</h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>{reqData.architecture?.overview}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {reqData.epics?.map((e: any, i: number) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '6px' }}>
                      <strong style={{ color: '#fff' }}>{e.epic_name}</strong>
                      <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {e.user_stories?.map((s: any, si: number) => (
                          <span key={si} className="stat-badge badge-success">[{s.story_key}] {s.title}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- PAGE: REPOSITORY (MODULE 2) ----------------- */}
        {currentPage === 'repository' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">Repository Intelligence</h1>
              <p className="section-subtitle">AST semantic code search and dependency impact radius.</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                className="forge-input"
                value={repoQuery}
                onChange={(e) => setRepoQuery(e.target.value)}
              />
              <button
                className="btn-primary"
                style={{ marginTop: '0.75rem' }}
                onClick={async () => {
                  try {
                    const res = await fetch(`${AI_SERVICE_URL}/api/ai/repo-intelligence`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ query: repoQuery })
                    });
                    if (res.ok) setRepoData(await res.json());
                  } catch {
                    setRepoData({
                      direct_answer: 'Modifying PaymentService impacts PaymentController and PaymentRepository.',
                      impact_radius_score: 4,
                      affected_files: [
                        { file_path: 'src/main/java/com/forgex/service/PaymentService.java', layer: 'Service', impact_level: 'DIRECT' },
                        { file_path: 'src/main/java/com/forgex/controller/PaymentController.java', layer: 'Controller', impact_level: 'DIRECT' }
                      ]
                    });
                  }
                }}
              >
                Scan Codebase Radius
              </button>
            </div>

            {repoData && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <p style={{ color: '#38bdf8', marginBottom: '1rem' }}>💡 {repoData.direct_answer}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {repoData.affected_files?.map((f: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fff' }}>{f.file_path}</span>
                      <span className="stat-badge badge-warning">{f.impact_level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- PAGE: AI ASSISTANT & CODING (MODULE 3) ----------------- */}
        {currentPage === 'ai-assistant' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">AI Coding & Test Generator</h1>
              <p className="section-subtitle">Multi-tier test generation (Normal, Boundary, Invalid, Exception, Regression).</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <button
                className="btn-primary"
                onClick={async () => {
                  try {
                    const res = await fetch(`${AI_SERVICE_URL}/api/ai/generate-code`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ task_key: 'US-104', task_title: 'Idempotent Payment API', target_component: 'PaymentService', specifications: [] })
                    });
                    if (res.ok) setCodePlan(await res.json());
                  } catch {
                    setCodePlan({
                      primary_code: `public BigDecimal calculateDiscountedTotal(BigDecimal originalAmount, double discountPercentage) {\n    if (originalAmount == null || originalAmount.compareTo(BigDecimal.ZERO) < 0) throw new IllegalArgumentException();\n    return originalAmount.multiply(BigDecimal.valueOf(1.0 - (discountPercentage / 100.0)));\n}`,
                      test_cases: [
                        { name: 'testDiscount_HappyPath', category: 'NORMAL' },
                        { name: 'testZeroDiscount_Boundary', category: 'BOUNDARY' },
                        { name: 'testNegativeAmount_Exception', category: 'EXCEPTION' }
                      ]
                    });
                  }
                }}
              >
                Synthesize Code & Tests for US-104
              </button>
            </div>

            {codePlan && (
              <div className="grid-2">
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Generated Code</h3>
                  <pre className="code-container"><code>{codePlan.primary_code}</code></pre>
                </div>
                <div className="glass-panel" style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Synthesized Test Cases</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {codePlan.test_cases?.map((t: any, i: number) => (
                      <div key={i} style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#fff', fontSize: '0.85rem' }}>{t.name}</span>
                        <span className="stat-badge badge-success">{t.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- PAGE: TESTING (MODULE 4) ----------------- */}
        {currentPage === 'testing' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">Automated Testing Suites</h1>
              <p className="section-subtitle">JUnit 5 execution results across unit, boundary, and regression profiles.</p>
            </div>

            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              <div className="stat-card glass-panel">
                <span className="stat-label">UNIT TESTS</span>
                <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>24 / 24</span>
                <span className="stat-badge badge-success">100% Passed</span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">INTEGRATION TESTS</span>
                <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>4 / 4</span>
                <span className="stat-badge badge-success">100% Passed</span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">CODE COVERAGE</span>
                <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>91.2%</span>
                <span className="stat-badge badge-success">Jacoco Metric</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1rem' }}>Test Execution Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="check-item">
                  <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>PaymentServiceTest.testStandardDiscountCalculation_HappyPath</span>
                  <span className="stat-badge badge-success">PASSED (4ms)</span>
                </div>
                <div className="check-item">
                  <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>PaymentServiceTest.testZeroDiscount_BoundaryCase</span>
                  <span className="stat-badge badge-success">PASSED (2ms)</span>
                </div>
                <div className="check-item">
                  <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>PaymentServiceTest.testNegativeAmount_InvalidInputException</span>
                  <span className="stat-badge badge-success">PASSED (3ms)</span>
                </div>
                <div className="check-item">
                  <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>AuthControllerIntegrationTest.testJwtTokenIssuance</span>
                  <span className="stat-badge badge-success">PASSED (12ms)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- PAGE: SECURITY (MODULE 5) ----------------- */}
        {currentPage === 'security' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">DevSecOps Security Sentinel</h1>
              <p className="section-subtitle">Static Application Security Testing (SAST), Secret Scanning, and Dependency CVE Audit.</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <button
                className="btn-primary"
                onClick={async () => {
                  try {
                    const res = await fetch(`${AI_SERVICE_URL}/api/ai/security-scan`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ code_snippet: 'String sql = "SELECT * FROM users WHERE id = " + userId; String aws = "AKIA1234567890ABCDEF";' })
                    });
                    if (res.ok) setSecScanResult(await res.json());
                  } catch {
                    setSecScanResult({
                      critical_count: 2,
                      findings: [
                        { severity: 'CRITICAL', title: 'SQL String Concatenation Detected', remediation: 'Use parameterized PreparedStatement.' },
                        { severity: 'CRITICAL', title: 'AWS Secret Token Detected', remediation: 'Move secret to environment variables.' }
                      ]
                    });
                  }
                }}
              >
                Scan Code for Vulnerabilities
              </button>
            </div>

            {secScanResult && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>Security Findings ({secScanResult.findings?.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {secScanResult.findings?.map((f: any, i: number) => (
                    <div key={i} style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', borderLeft: '3px solid var(--accent-rose)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: '#fff' }}>{f.title}</strong>
                        <span className="stat-badge badge-danger">{f.severity}</span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.3rem' }}>{f.remediation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- PAGE: DEPLOYMENT & TRUST (MODULE 6) ----------------- */}
        {currentPage === 'deployment' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">Deployment & AI Change Trust Score</h1>
              <p className="section-subtitle">Deterministic 0–100 verification gauge controlling Pull Request and container release gates.</p>
            </div>

            <div className="grid-2">
              <div className="glass-panel trust-gauge-box">
                <div
                  className="gauge-circle"
                  style={{
                    borderColor: trustResult.badgeColor === 'green' ? 'var(--accent-emerald)' : (trustResult.badgeColor === 'yellow' ? 'var(--accent-amber)' : 'var(--accent-rose)'),
                    boxShadow: trustResult.badgeColor === 'green' ? 'var(--glow-emerald)' : 'var(--glow-rose)'
                  }}
                >
                  <span className="gauge-number" style={{ color: trustResult.badgeColor === 'green' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {trustResult.finalScore}
                  </span>
                  <span className="gauge-denom">/ 100</span>
                </div>

                <div
                  className="gauge-verdict-banner"
                  style={{
                    background: trustResult.badgeColor === 'green' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: trustResult.badgeColor === 'green' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                    border: `1px solid ${trustResult.badgeColor === 'green' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
                  }}
                >
                  {trustResult.verdict}
                </div>

                <p style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                  {trustResult.blocked ? `Blocked by policy: ${trustResult.reason}` : 'All verification checks passed. Pull Request is safe to merge into main.'}
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '1rem' }}>Live Gate Simulation</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                    Unit Tests Passed ({unitPassed} / {unitTotal})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={unitTotal}
                    value={unitPassed}
                    onChange={(e) => setUnitPassed(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    className={critVulns > 0 ? 'badge-danger' : 'btn-secondary'}
                    style={{ padding: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}
                    onClick={() => setCritVulns(critVulns === 0 ? 1 : 0)}
                  >
                    {critVulns > 0 ? '❌ Injected SQLi' : '⚡ Simulate SQLi'}
                  </button>
                  <button
                    className={secretsFound > 0 ? 'badge-danger' : 'btn-secondary'}
                    style={{ padding: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}
                    onClick={() => setSecretsFound(secretsFound === 0 ? 1 : 0)}
                  >
                    {secretsFound > 0 ? '❌ Exposed Secret' : '⚡ Simulate Secret'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- PAGE: ANALYTICS (MODULES 7 & 8) ----------------- */}
        {currentPage === 'analytics' && (
          <div>
            <div className="section-header">
              <h1 className="section-title">Production Observability & Golden Signals</h1>
              <p className="section-subtitle">Real-time latency, error rates, throughput, and AI Project Manager insights.</p>
            </div>

            <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
              <div className="stat-card glass-panel">
                <span className="stat-label">API LATENCY</span>
                <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>182 ms</span>
                <span className="stat-badge badge-success">HEALTHY</span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">ERROR RATE</span>
                <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>0.8%</span>
                <span className="stat-badge badge-success">&lt; 1%</span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">REQUESTS/MIN</span>
                <span className="stat-value">245 RPM</span>
                <span className="stat-badge badge-success">NORMAL</span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">CPU / RAM</span>
                <span className="stat-value" style={{ fontSize: '1.4rem' }}>37% / 52%</span>
                <span className="stat-badge badge-success">OPTIMAL</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ----------------- MODAL: CREATE PROJECT ----------------- */}
      {showCreateProjectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '480px', width: '90%', border: '1px solid var(--accent-cyan)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Create New Engineering Project</h3>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>PROJECT NAME</label>
                <input
                  type="text"
                  className="forge-input"
                  required
                  placeholder="e.g. Autonomous Fleet Manager"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>DESCRIPTION</label>
                <textarea
                  className="forge-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="High-level architecture and objectives..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>GITHUB REPOSITORY URL</label>
                <input
                  type="text"
                  className="forge-input"
                  placeholder="https://github.com/forgex-demo/..."
                  value={newProjectRepo}
                  onChange={(e) => setNewProjectRepo(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Project in Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: CREATE TASK ----------------- */}
      {showCreateTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '480px', width: '90%', border: '1px solid var(--accent-cyan)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>
              Create Sprint Task for {selectedProject?.name}
            </h3>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>TASK TITLE</label>
                <input
                  type="text"
                  className="forge-input"
                  required
                  placeholder="e.g. Implement Webhook Signature Verification"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>DESCRIPTION</label>
                <textarea
                  className="forge-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="User story context and acceptance criteria..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>PRIORITY</label>
                  <select
                    className="forge-input"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    style={{ background: '#0a0e17' }}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>STORY KEY</label>
                  <input
                    type="text"
                    className="forge-input"
                    placeholder="e.g. US-105"
                    value={newTaskStoryKey}
                    onChange={(e) => setNewTaskStoryKey(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateTaskModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Task in PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
