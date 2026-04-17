/**
 * Gamification Engine — Points, Badges, Chapter unlocking, Progress tracking
 * Implements the Arthashastra achievement system
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type BadgeId =
  | 'raja-parichay'        // Completed profile
  | 'pehchaan-rakshak'     // Added 3+ identity docs
  | 'kunji-dharak'         // Added 5+ credentials
  | 'kosh-sthapak'         // Added first income source
  | 'vyaya-niyantrak'      // Logged 30 days of expenses
  | 'khate-prabhandak'     // Added all bank accounts
  | 'raksha-kavach'        // Insurance module complete
  | 'rin-mukta'            // All loans tracked
  | 'beej-ropak'           // First investment added
  | 'granthagaar-pramukh'  // 10+ docs in vault
  | 'lakshya-nirdeshak'    // First goal set
  | 'raj-mantri-shreni';   // Used AI assistant

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: number; // timestamp
}

export interface GamificationState {
  totalPoints: number;
  level: number;
  levelName: string;
  badges: Badge[];
  chapterProgress: Record<string, number>; // chapterId -> % complete
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const BADGES: Record<BadgeId, Badge> = {
  'raja-parichay': {
    id: 'raja-parichay',
    name: 'Raja Parichay',
    description: 'Completed your Royal Profile',
    icon: '👑',
    points: 50,
  },
  'pehchaan-rakshak': {
    id: 'pehchaan-rakshak',
    name: 'Pehchaan Rakshak',
    description: 'Added 3+ identity documents',
    icon: '🔏',
    points: 75,
  },
  'kunji-dharak': {
    id: 'kunji-dharak',
    name: 'Kunji Dharak',
    description: 'Secured 5+ portal credentials',
    icon: '🗝️',
    points: 75,
  },
  'kosh-sthapak': {
    id: 'kosh-sthapak',
    name: 'Kosh Sthapak',
    description: 'Added first income source to treasury',
    icon: '💰',
    points: 50,
  },
  'vyaya-niyantrak': {
    id: 'vyaya-niyantrak',
    name: 'Vyaya Niyantrak',
    description: 'Logged expenses for 30 consecutive days',
    icon: '📊',
    points: 100,
  },
  'khate-prabhandak': {
    id: 'khate-prabhandak',
    name: 'Khate Prabhandak',
    description: 'All bank accounts tracked',
    icon: '🏦',
    points: 75,
  },
  'raksha-kavach': {
    id: 'raksha-kavach',
    name: 'Raksha Kavach',
    description: 'Insurance portfolio complete',
    icon: '🛡️',
    points: 100,
  },
  'rin-mukta': {
    id: 'rin-mukta',
    name: 'Rin Mukta',
    description: 'All loans and EMIs tracked',
    icon: '📋',
    points: 75,
  },
  'beej-ropak': {
    id: 'beej-ropak',
    name: 'Beej Ropak',
    description: 'First investment seed planted',
    icon: '🌱',
    points: 50,
  },
  'granthagaar-pramukh': {
    id: 'granthagaar-pramukh',
    name: 'Granthagaar Pramukh',
    description: '10+ documents stored in vault',
    icon: '📚',
    points: 100,
  },
  'lakshya-nirdeshak': {
    id: 'lakshya-nirdeshak',
    name: 'Lakshya Nirdeshak',
    description: 'Set your first financial goal',
    icon: '🎯',
    points: 50,
  },
  'raj-mantri-shreni': {
    id: 'raj-mantri-shreni',
    name: 'Raj Mantri Shreni',
    description: 'Consulted the royal AI advisor',
    icon: '🤖',
    points: 25,
  },
};

export const LEVEL_THRESHOLDS = [
  { min: 0, max: 99, level: 1, name: 'Naya Rajya' },
  { min: 100, max: 299, level: 2, name: 'Sthapana' },
  { min: 300, max: 599, level: 3, name: 'Unnati' },
  { min: 600, max: 999, level: 4, name: 'Samruddhi' },
  { min: 1000, max: Infinity, level: 5, name: 'Chakravarti' },
];

// ─── Engine Functions ─────────────────────────────────────────────────────────

/**
 * Determine level and title from total points
 */
export function getLevelFromPoints(points: number): { level: number; levelName: string } {
  const threshold = LEVEL_THRESHOLDS.find(t => points >= t.min && points <= t.max);
  return threshold
    ? { level: threshold.level, levelName: threshold.name }
    : { level: 5, levelName: 'Chakravarti' };
}

/**
 * Award a badge — returns updated badge list
 */
export function awardBadge(
  existing: Badge[],
  badgeId: BadgeId
): { badges: Badge[]; newPoints: number; alreadyHad: boolean } {
  if (existing.some(b => b.id === badgeId)) {
    return { badges: existing, newPoints: 0, alreadyHad: true };
  }

  const badge: Badge = {
    ...BADGES[badgeId],
    unlockedAt: Date.now(),
  };

  return {
    badges: [...existing, badge],
    newPoints: badge.points,
    alreadyHad: false,
  };
}

/**
 * Calculate total points from badge list
 */
export function calculateTotalPoints(badges: Badge[]): number {
  return badges.reduce((sum, b) => sum + b.points, 0);
}

/**
 * Check if a chapter is unlocked based on prerequisite completion
 */
export function isChapterUnlocked(
  chapterId: string,
  completedChapters: string[]
): boolean {
  // Chapter 1 of any module is always unlocked
  if (chapterId.endsWith('-1') || chapterId.includes('intro')) return true;
  // Otherwise, require all previous chapters (simplified rule)
  return completedChapters.length > 0;
}

/**
 * Calculate module completion percentage
 */
export function calculateModuleProgress(
  moduleChapters: string[],
  completedChapters: string[]
): number {
  if (moduleChapters.length === 0) return 0;
  const completed = moduleChapters.filter(c => completedChapters.includes(c)).length;
  return Math.round((completed / moduleChapters.length) * 100);
}
