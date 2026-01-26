// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Case/Ärende Types
export type CaseStatus = 'new' | 'active' | 'pending' | 'in_collection' | 'paused' | 'paid' | 'closed' | 'legal' | 'handed_off' | 'cancelled';

export interface Case {
  id: string;
  invoiceNumber: string;
  debtorName: string;
  debtorEmail: string;
  debtorPhone?: string;
  originalAmount: number;
  currentAmount: number;
  paidAmount: number;
  status: CaseStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface CaseDetails extends Case {
  debtorAddress?: string;
  debtorOrgNumber?: string;
  notes?: string;
  activities: Activity[];
}

// Activity Types
export type ActivityType =
  | 'case_created'
  | 'reminder_sent'
  | 'payment_received'
  | 'phone_call'
  | 'email_sent'
  | 'status_changed'
  | 'note_added'
  | 'legal_action';

export interface Activity {
  id: string;
  caseId: string;
  type: ActivityType;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

// Statistics Types
export interface StatsOverview {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  successRate: number;
}

// Period comparison - current vs previous period
export interface PeriodComparison {
  collectedAmount: number;
  collectedAmountPrev: number;
  collectedChange: number; // percentage change
  casesResolved: number;
  casesResolvedPrev: number;
  casesResolvedChange: number;
  newCases: number;
  newCasesPrev: number;
  newCasesChange: number;
  avgDaysToCollect: number;
  avgDaysToCollectPrev: number;
  avgDaysChange: number;
}

export interface TimelineDataPoint {
  date: string;
  amount: number;
  count: number;
}

export interface StatusDistribution {
  status: CaseStatus;
  count: number;
  percentage: number;
}

export interface StatsTimeline {
  collectedOverTime: TimelineDataPoint[];
  statusDistribution: StatusDistribution[];
}

// Dashboard View Types
export type DashboardView = 'overview' | 'cases' | 'stats' | 'analysis' | 'integrations';

// Integration Types
export type IntegrationProvider = 'fortnox' | 'visma' | 'bjorn_lunden';

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error';

export interface Integration {
  id: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  connectedAt?: string;
  lastSyncAt?: string;
  invoicesImported?: number;
  error?: string;
}

// Filter Types
export interface CaseFilters {
  status?: CaseStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
