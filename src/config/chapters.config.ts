/**
 * Chapters Configuration — Metadata for all chapter flows across modules
 */

export interface ChapterConfig {
  id: string;
  moduleId: number;
  title: string;
  hindiTitle: string;
  description: string;
  tutorialIds: string[];
  quizIds: string[];
  unlockConditions: string[] | null; // chapter IDs that must be completed first
  gameComponent?: string;
  formComponent?: string;
  estimatedMinutes: number;
  points: number;
}

export const CHAPTERS: Record<string, ChapterConfig> = {
  // Module 1: Foundation
  'raja-parichay': {
    id: 'raja-parichay',
    moduleId: 1,
    title: 'Raja Parichay',
    hindiTitle: 'राजा परिचय',
    description: 'Your royal introduction — name, DOB, life phase',
    tutorialIds: ['raja-parichay-1'],
    quizIds: ['quiz-rajmudra-seal'],
    unlockConditions: null, // always unlocked
    formComponent: 'ProfileForm',
    estimatedMinutes: 10,
    points: 50,
  },
  'parivar': {
    id: 'parivar',
    moduleId: 1,
    title: 'Parivar Nirmaan',
    hindiTitle: 'परिवार निर्माण',
    description: 'Build your royal family tree',
    tutorialIds: ['parivar-1'],
    quizIds: [],
    unlockConditions: ['raja-parichay'],
    gameComponent: 'FamilyTreeForge',
    formComponent: 'FamilyForm',
    estimatedMinutes: 15,
    points: 75,
  },

  // Module 2: Identity
  'dastaavet': {
    id: 'dastaavet',
    moduleId: 2,
    title: 'Dastaavet Sangrah',
    hindiTitle: 'दस्तावेज़ संग्रह',
    description: 'Add and verify your identity documents',
    tutorialIds: ['pehchaan-1'],
    quizIds: [],
    unlockConditions: null,
    gameComponent: 'MandalaLinkBoard',
    estimatedMinutes: 20,
    points: 75,
  },

  // Module 3: Credentials
  'kunji': {
    id: 'kunji',
    moduleId: 3,
    title: 'Kunji Sangrah',
    hindiTitle: 'कुंजी संग्रह',
    description: 'Secure all your portal login credentials',
    tutorialIds: ['kunji-1'],
    quizIds: [],
    unlockConditions: null,
    estimatedMinutes: 20,
    points: 75,
  },

  // Module 4: Income
  'aamdani': {
    id: 'aamdani',
    moduleId: 4,
    title: 'Aamdani Stambha',
    hindiTitle: 'आमदनी स्तंभ',
    description: 'Record all your income sources',
    tutorialIds: ['kosh-1'],
    quizIds: [],
    unlockConditions: null,
    estimatedMinutes: 15,
    points: 50,
  },

  // Module 5: Expenses
  'kharch': {
    id: 'kharch',
    moduleId: 5,
    title: 'Kharch Pariksha',
    hindiTitle: 'खर्च परीक्षा',
    description: 'Log and categorise your monthly expenses',
    tutorialIds: ['vyaya-1'],
    quizIds: [],
    unlockConditions: null,
    gameComponent: 'ChaturangaBoard',
    estimatedMinutes: 20,
    points: 75,
  },
};

export function getChapterById(id: string): ChapterConfig | undefined {
  return CHAPTERS[id];
}

export function getChaptersByModule(moduleId: number): ChapterConfig[] {
  return Object.values(CHAPTERS).filter(c => c.moduleId === moduleId);
}
