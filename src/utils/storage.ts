import { TaskBreakdown, ChoreItem, LifeReminder, UserProfile, SensoryStatus } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'aunicorn_user_profile',
  TASK_BREAKDOWNS: 'aunicorn_task_breakdowns',
  CHORES: 'aunicorn_chores',
  LIFE_REMINDERS: 'aunicorn_life_reminders',
  SENSORY_STATUS: 'aunicorn_sensory_status',
  GENTLE_STREAK: 'aunicorn_gentle_streak',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Quinn',
  pronouns: 'they/them/she',
  stateText: 'Calmed • Low Stim',
  spoons: 3,
  maxSpoons: 5,
  lowStimMode: false,
  soundEnabled: true,
  brownNoiseVolume: 0.35,
  autoPurgeMonths: 6,
};

const DEFAULT_TASK_BREAKDOWN: TaskBreakdown = {
  id: 'task-bathroom-1',
  originalTask: 'Deep clean bathroom',
  energyRequired: 3,
  createdAt: new Date().toISOString(),
  steps: [
    {
      id: 'step-1',
      title: 'Collect empty shampoo bottles and toss into bin',
      duration: '2m',
      sensoryTip: 'Finished • 2m spent',
      status: 'done',
      completedAt: '10m ago',
    },
    {
      id: 'step-2',
      title: 'Spray sink with lavender cleaner & let sit',
      duration: '3m',
      sensoryTip: 'Low odor safe • 3 min timer active',
      status: 'ongoing',
    },
    {
      id: 'step-3',
      title: 'Wipe down sink basin with soft cloth',
      duration: '3m',
      sensoryTip: 'Ready next',
      status: 'pendant',
    },
    {
      id: 'step-4',
      title: 'Replace hand towel with fresh dry one',
      duration: '1m',
      sensoryTip: 'Final touch',
      status: 'pendant',
    },
  ],
};

const DEFAULT_CHORES: ChoreItem[] = [
  {
    id: 'chore-1',
    title: 'Run dishwasher on eco cycle',
    subtitle: 'Started 15 mins ago',
    status: 'ongoing',
    pushTime: '3:30 PM push',
    sensoryTag: 'Low noise cycle',
    category: 'kitchen',
  },
  {
    id: 'chore-2',
    title: 'Sort laundry into soft cottons & darks',
    subtitle: 'Gentle tactile bin ready',
    status: 'pendant',
    pushTime: '3:30 PM push',
    sensoryTag: 'Tactile safe',
    category: 'laundry',
  },
  {
    id: 'chore-3',
    title: 'Clear desk into "sort later" sensory bin',
    subtitle: 'Zero-pressure tidy complete',
    status: 'done',
    pushTime: 'Daily',
    sensoryTag: 'Zero overwhelm',
    category: 'organizing',
  },
];

const DEFAULT_REMINDERS: LifeReminder[] = [
  {
    id: 'rem-1',
    title: 'Pet vet follow-up (Dr. Rivera)',
    subtitle: 'Check vaccination record & allergy meds',
    category: 'social_pet',
    scheduledText: 'Tomorrow 10:30 AM • Calendar synced',
    calmingBufferMinutes: 30,
    status: 'pendant',
    icon: 'pets',
    badgeColor: 'text-cosmic-violet bg-cosmic-violet/15',
  },
  {
    id: 'rem-2',
    title: 'Doctor: Endocrinology Review',
    subtitle: 'Review metabolic panel & blood work results',
    category: 'health',
    scheduledText: 'Friday 2:00 PM • Calming buffer 45m prior',
    calmingBufferMinutes: 45,
    status: 'pendant',
    icon: 'medical_services',
    badgeColor: 'text-cosmic-cyan bg-cosmic-cyan/15',
  },
  {
    id: 'rem-3',
    title: 'Sensory-safe grocery restock',
    subtitle: 'Rice cakes, almond butter, iced herbal tea',
    category: 'errands',
    scheduledText: 'Weekend pickup • Low noise hours',
    calmingBufferMinutes: 20,
    status: 'pendant',
    icon: 'shopping_bag',
    badgeColor: 'text-warning-gold bg-warning-gold/15',
  },
  {
    id: 'rem-4',
    title: 'Fill weekly medication organizer',
    subtitle: 'Sensory-quiet morning refill with herbal tea',
    category: 'health',
    scheduledText: 'Sunday 11:00 AM',
    calmingBufferMinutes: 15,
    status: 'pendant',
    icon: 'medication',
    badgeColor: 'text-tertiary bg-tertiary/15',
  },
  {
    id: 'rem-5',
    title: 'Text supportive LGBTQ+ friend group check-in',
    subtitle: 'No obligation to maintain a long dialogue',
    category: 'social_pet',
    scheduledText: 'Today 5:00 PM',
    calmingBufferMinutes: 10,
    status: 'ongoing',
    icon: 'forum',
    badgeColor: 'text-cosmic-violet bg-cosmic-violet/15',
  },
];

const DEFAULT_SENSORY_STATUS: SensoryStatus = {
  visual: 2, // 1-5
  auditory: 3,
  tactile: 1,
  social: 3,
  lastUpdated: new Date().toLocaleDateString(),
};

export const storage = {
  getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  },

  getTaskBreakdown(): TaskBreakdown {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASK_BREAKDOWNS);
      return stored ? JSON.parse(stored) : DEFAULT_TASK_BREAKDOWN;
    } catch {
      return DEFAULT_TASK_BREAKDOWN;
    }
  },

  saveTaskBreakdown(breakdown: TaskBreakdown) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASK_BREAKDOWNS, JSON.stringify(breakdown));
    } catch (e) {
      console.error(e);
    }
  },

  getChores(): ChoreItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHORES);
      return stored ? JSON.parse(stored) : DEFAULT_CHORES;
    } catch {
      return DEFAULT_CHORES;
    }
  },

  saveChores(chores: ChoreItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHORES, JSON.stringify(chores));
    } catch (e) {
      console.error(e);
    }
  },

  getReminders(): LifeReminder[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIFE_REMINDERS);
      return stored ? JSON.parse(stored) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  },

  saveReminders(reminders: LifeReminder[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.LIFE_REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.error(e);
    }
  },

  getSensoryStatus(): SensoryStatus {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SENSORY_STATUS);
      return stored ? JSON.parse(stored) : DEFAULT_SENSORY_STATUS;
    } catch {
      return DEFAULT_SENSORY_STATUS;
    }
  },

  saveSensoryStatus(status: SensoryStatus) {
    try {
      localStorage.setItem(STORAGE_KEYS.SENSORY_STATUS, JSON.stringify(status));
    } catch (e) {
      console.error(e);
    }
  },

  exportAllData(): string {
    const data = {
      profile: this.getProfile(),
      taskBreakdown: this.getTaskBreakdown(),
      chores: this.getChores(),
      reminders: this.getReminders(),
      sensoryStatus: this.getSensoryStatus(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (parsed.taskBreakdown) this.saveTaskBreakdown(parsed.taskBreakdown);
      if (parsed.chores) this.saveChores(parsed.chores);
      if (parsed.reminders) this.saveReminders(parsed.reminders);
      if (parsed.sensoryStatus) this.saveSensoryStatus(parsed.sensoryStatus);
      return true;
    } catch {
      return false;
    }
  },
};
