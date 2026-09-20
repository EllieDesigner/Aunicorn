export type SpoonLevel = 1 | 2 | 3 | 4 | 5;

export interface MicroStep {
  id: string;
  title: string;
  duration: string;
  sensoryTip: string;
  status: 'done' | 'ongoing' | 'pendant';
  completedAt?: string;
}

export interface TaskBreakdown {
  id: string;
  originalTask: string;
  energyRequired: SpoonLevel;
  steps: MicroStep[];
  createdAt: string;
}

export interface ChoreItem {
  id: string;
  title: string;
  subtitle: string;
  status: 'done' | 'ongoing' | 'pendant';
  pushTime?: string;
  sensoryTag?: string;
  category: 'cleaning' | 'laundry' | 'kitchen' | 'organizing';
}

export interface LifeReminder {
  id: string;
  title: string;
  subtitle: string;
  category: 'health' | 'errands' | 'social_pet' | 'admin';
  scheduledText: string;
  calmingBufferMinutes?: number;
  status: 'done' | 'ongoing' | 'pendant';
  icon: string;
  badgeColor: string;
}

export interface UserProfile {
  name: string;
  pronouns: string;
  stateText: string;
  spoons: SpoonLevel;
  maxSpoons: number;
  lowStimMode: boolean;
  soundEnabled: boolean;
  brownNoiseVolume: number;
  autoPurgeMonths: 6 | 12 | 0; // 0 = never
}

export interface SensoryStatus {
  visual: number; // 1-5
  auditory: number; // 1-5
  tactile: number; // 1-5
  social: number; // 1-5
  lastUpdated: string;
}

export type ActiveTab = 'dashboard' | 'health-area' | 'activities-area';
export type ActivitySubSection = 
  | 'overview' 
  | 'section-task-breakdown' 
  | 'section-focus-timer' 
  | 'section-chores-checklist' 
  | 'section-life-checklist' 
  | 'section-space-guarantee';
