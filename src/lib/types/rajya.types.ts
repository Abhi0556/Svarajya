// Core Rajya application types

// ─── User / Auth ──────────────────────────────────────────────────────────────

export type RajyaUser = {
  id: string; // Supabase auth.users.id
  email?: string;
  profileId?: string;
};

// ─── Gamification ─────────────────────────────────────────────────────────────

export type KoshEntry = {
  id: string;
  userId: string;
  amount: number;
  confidenceScore: number;
  updatedAt: string;
};

export type VyayaEntry = {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  dateLogged: string;
};

export type LeakageAudit = {
  id: string;
  userId: string;
  activeSubscriptions: string[];
  auditedAt: string;
};

export type RajyaState = {
  userId: string;
  stabilityScore: number;
  dataConfidenceScore: number;
  unlockedModules: string[];
};

// ─── Common UI ────────────────────────────────────────────────────────────────

export type LifePhase = 'Yuva' | 'Nirmaan' | 'Sthirta' | 'Parampara';
export type AccessRole = 'Viewer' | 'Executor' | 'Emergency-only' | 'None';
export type Priority = 'Save' | 'Protect' | 'Grow' | 'Organise';

export interface PageGuideItem {
  icon: string;
  title: string;
  description: string;
}
