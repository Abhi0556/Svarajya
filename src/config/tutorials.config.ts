/**
 * Tutorial Configuration — centralized tutorial content for all modules
 */

export interface TutorialItem {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  youtubeId?: string;
  transcript?: string;
  thumbnail?: string;
}

export const TUTORIALS: Record<string, Record<string, TutorialItem[]>> = {
  MODULE_1: {
    USER_PROFILE: [
      {
        id: 'raja-parichay-1',
        title: 'Arthashastra: Identity & Governance',
        duration: '3:45',
        youtubeId: '',
        transcript: 'Introduction to the Raja Parichay chapter...',
      },
    ],
    FAMILY: [
      {
        id: 'parivar-1',
        title: 'Building Your Royal Family Tree',
        duration: '4:20',
        youtubeId: '',
      },
    ],
  },
  MODULE_2: {
    IDENTITY_VAULT: [
      {
        id: 'pehchaan-1',
        title: 'Your Identity Documents Explained',
        duration: '5:00',
        youtubeId: '',
      },
    ],
  },
  MODULE_3: {
    CREDENTIALS: [
      {
        id: 'kunji-1',
        title: 'Securing Your Digital Kingdom',
        duration: '4:30',
        youtubeId: '',
      },
    ],
  },
  MODULE_4: {
    INCOME: [
      {
        id: 'kosh-1',
        title: 'Income Sources: Building Your Treasury',
        duration: '6:00',
        youtubeId: '',
      },
    ],
  },
  MODULE_5: {
    EXPENSES: [
      {
        id: 'vyaya-1',
        title: 'Managing the Royal Expenditure',
        duration: '5:30',
        youtubeId: '',
      },
    ],
  },
  MODULE_6: {
    BANK: [
      {
        id: 'khate-1',
        title: 'Your Bank Accounts: The River of Wealth',
        duration: '5:00',
        youtubeId: '',
      },
    ],
  },
  MODULE_7: {
    INVESTMENTS: [
      {
        id: 'beej-1',
        title: 'Planting Seeds: Investment Basics',
        duration: '7:00',
        youtubeId: '',
      },
    ],
  },
  MODULE_8: {
    INSURANCE: [
      {
        id: 'raksha-1',
        title: 'Building Your Shield: Insurance Essentials',
        duration: '6:30',
        youtubeId: '',
      },
    ],
  },
};

export function getTutorialById(id: string): TutorialItem | undefined {
  for (const module of Object.values(TUTORIALS)) {
    for (const section of Object.values(module)) {
      const found = section.find(t => t.id === id);
      if (found) return found;
    }
  }
  return undefined;
}
