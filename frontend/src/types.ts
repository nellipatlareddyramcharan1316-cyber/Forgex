export type Page =
  | 'projects'
  | 'kanban'
  | 'github'
  | 'requirements'
  | 'rag-knowledge'
  | 'repo-analyzer'
  | 'dev-planner'
  | 'coding-agent'
  | 'test-generator'
  | 'code-review'
  | 'security-scanner'
  | 'trust-score'
  | 'cicd-docker'
  | 'observability'
  | 'ai-pm'
  | 'analytics'
  | 'notifications'
  | 'admin-panel'
  | 'prompt-defense'
  | 'killer-demo';

export interface UserProfile {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  repositoryUrl: string;
  status: string;
  owner?: { name: string; email: string; role: string };
  createdAt?: string;
}

export interface TaskItem {
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

export const KANBAN_STATUSES = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'CODE_REVIEW',
  'TESTING',
  'DONE',
  'BLOCKED'
];

export interface TrustScoreData {
  taskKey: string;
  overallScore: number;
  verdict: string;
  badgeColor: string;
  safeToDeploy: boolean;
  summaryMessage: string;
  breakdown?: Record<string, any>;
}
