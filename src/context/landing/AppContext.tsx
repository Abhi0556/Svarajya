import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  email: string
  name: string
  role: string
}

interface Zone {
  id: string
  name: string
  sanskritName: string
  description: string
  icon: string
  progress: number
  status: string
  statusMessage: string
  chapters: Chapter[]
  isComplete: boolean
}

interface Chapter {
  id: string
  title: string
  description: string
  isComplete: boolean
  isLocked: boolean
  xpReward: number
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt?: Date
}

interface AppState {
  isAuthenticated: boolean
  user: User | null
  svarajyaName: string
  stabilityScore: number
  svarajyaPoints: number
  zones: Zone[]
  badges: Badge[]
  currentStep: 'landing' | 'login' | 'signup' | 'onboarding' | 'dashboard' | 'zone' | 'chapter'
  showRoyalSeal: boolean
  showBadgeUnlock: Badge | null
  consentGiven: boolean
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => void
  logout: () => void
  signup: (svarajyaName: string, userName: string, email: string) => void
  setCurrentStep: (step: AppState['currentStep']) => void
  updateZoneProgress: (zoneId: string, progress: number) => void
  completeChapter: (zoneId: string, chapterId: string) => void
  showSealModal: () => void
  hideSealModal: () => void
  unlockBadge: (badge: Badge) => void
  hideBadgeUnlock: () => void
  giveConsent: () => void
  addPoints: (points: number) => void
}

const defaultZones: Zone[] = [
  {
    id: 'raksha',
    name: 'Fort',
    sanskritName: 'Raksha',
    description: 'Your protection coverage',
    icon: 'Shield',
    progress: 45,
    status: 'needs-attention',
    statusMessage: 'Your fort could be stronger.',
    isComplete: false,
    chapters: [
      {
        id: 'r1',
        title: 'Understanding Protection',
        description: 'Learn the foundations of financial protection',
        isComplete: true,
        isLocked: false,
        xpReward: 50,
      },
      {
        id: 'r2',
        title: 'Life Insurance Basics',
        description: "Secure your family's future",
        isComplete: false,
        isLocked: false,
        xpReward: 75,
      },
      {
        id: 'r3',
        title: 'Health Coverage',
        description: 'Medical protection for all',
        isComplete: false,
        isLocked: true,
        xpReward: 75,
      },
      {
        id: 'r4',
        title: 'Emergency Fund',
        description: 'Build your safety reserve',
        isComplete: false,
        isLocked: true,
        xpReward: 100,
      },
    ],
  },
  {
    id: 'vyaya',
    name: 'Matka',
    sanskritName: 'Vyaya',
    description: 'Track your expenses',
    icon: 'Wallet',
    progress: 68,
    status: 'on-track',
    statusMessage: 'Your Matka flows are balanced.',
    isComplete: false,
    chapters: [
      {
        id: 'v1',
        title: 'Know Your Flow',
        description: 'Understand where money goes',
        isComplete: true,
        isLocked: false,
        xpReward: 50,
      },
      {
        id: 'v2',
        title: 'Stop the Leaks',
        description: 'Identify subscription drains',
        isComplete: true,
        isLocked: false,
        xpReward: 75,
      },
      {
        id: 'v3',
        title: 'Mindful Spending',
        description: 'Align expenses with values',
        isComplete: false,
        isLocked: false,
        xpReward: 75,
      },
      {
        id: 'v4',
        title: 'Monthly Governance',
        description: 'Budget like a wise ruler',
        isComplete: false,
        isLocked: true,
        xpReward: 100,
      },
    ],
  },
  {
    id: 'kosh',
    name: 'Treasury',
    sanskritName: 'Kosh',
    description: 'Grow your wealth',
    icon: 'Landmark',
    progress: 32,
    status: 'building',
    statusMessage: 'Your treasury is growing steadily.',
    isComplete: false,
    chapters: [
      {
        id: 'k1',
        title: 'Wealth Foundations',
        description: 'Principles of accumulation',
        isComplete: true,
        isLocked: false,
        xpReward: 50,
      },
      {
        id: 'k2',
        title: 'Investment Paths',
        description: 'Choose your growth routes',
        isComplete: false,
        isLocked: false,
        xpReward: 75,
      },
      {
        id: 'k3',
        title: 'Tax Wisdom',
        description: 'Keep more of what you earn',
        isComplete: false,
        isLocked: true,
        xpReward: 75,
      },
      {
        id: 'k4',
        title: 'Long-term Vision',
        description: 'Plan for generations',
        isComplete: false,
        isLocked: true,
        xpReward: 100,
      },
    ],
  },
  {
    id: 'rin',
    name: 'Battlefield',
    sanskritName: 'Rin',
    description: 'Conquer your debts',
    icon: 'Swords',
    progress: 78,
    status: 'winning',
    statusMessage: 'Victory approaches on the battlefield.',
    isComplete: false,
    chapters: [
      {
        id: 'd1',
        title: 'Know Your Enemy',
        description: 'Map all your debts',
        isComplete: true,
        isLocked: false,
        xpReward: 50,
      },
      {
        id: 'd2',
        title: 'Battle Strategy',
        description: 'Choose snowball or avalanche',
        isComplete: true,
        isLocked: false,
        xpReward: 75,
      },
      {
        id: 'd3',
        title: 'Winning Momentum',
        description: 'Accelerate debt freedom',
        isComplete: true,
        isLocked: false,
        xpReward: 75,
      },
      {
        id: 'd4',
        title: 'Final Victory',
        description: 'Become debt-free',
        isComplete: false,
        isLocked: false,
        xpReward: 100,
      },
    ],
  },
  {
    id: 'mitra',
    name: 'Legacy',
    sanskritName: 'Mitra',
    description: 'Protect your nominees',
    icon: 'Users',
    progress: 20,
    status: 'needs-attention',
    statusMessage: 'Your legacy needs your attention.',
    isComplete: false,
    chapters: [
      {
        id: 'm1',
        title: 'Who Matters Most',
        description: 'Identify your beneficiaries',
        isComplete: true,
        isLocked: false,
        xpReward: 50,
      },
      {
        id: 'm2',
        title: 'Document Trail',
        description: 'Ensure clear succession',
        isComplete: false,
        isLocked: false,
        xpReward: 75,
      },
      {
        id: 'm3',
        title: 'Family Awareness',
        description: 'Share knowledge wisely',
        isComplete: false,
        isLocked: true,
        xpReward: 75,
      },
      {
        id: 'm4',
        title: 'Will & Testament',
        description: 'Formalize your wishes',
        isComplete: false,
        isLocked: true,
        xpReward: 100,
      },
    ],
  },
  {
    id: 'granthagaar',
    name: 'Granthagaar',
    sanskritName: 'Documents',
    description: 'Organize your records',
    icon: 'FileText',
    progress: 55,
    status: 'on-track',
    statusMessage: 'Your archives are well maintained.',
    isComplete: false,
    chapters: [
      {
        id: 'g1',
        title: 'Gather Records',
        description: 'Collect all documents',
        isComplete: true,
        isLocked: false,
        xpReward: 50,
      },
      {
        id: 'g2',
        title: 'Digital Vault',
        description: 'Secure cloud storage',
        isComplete: true,
        isLocked: false,
        xpReward: 75,
      },
      {
        id: 'g3',
        title: 'Organization System',
        description: 'Structure for easy access',
        isComplete: false,
        isLocked: false,
        xpReward: 75,
      },
      {
        id: 'g4',
        title: 'Regular Review',
        description: 'Keep records current',
        isComplete: false,
        isLocked: true,
        xpReward: 100,
      },
    ],
  },
]

const defaultBadges: Badge[] = [
  {
    id: 'first-login',
    name: 'Svarajya Founder',
    description: 'Created your financial kingdom',
    icon: 'Crown',
  },
  {
    id: 'first-chapter',
    name: 'First Steps',
    description: 'Completed your first chapter',
    icon: 'Footprints',
  },
]

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    svarajyaName: '',
    stabilityScore: 78,
    svarajyaPoints: 420,
    zones: defaultZones,
    badges: defaultBadges,
    currentStep: 'landing',
    showRoyalSeal: false,
    showBadgeUnlock: null,
    consentGiven: false,
  })

  const login = (email: string, _password: string) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: { email, name: 'Svarajya Admin', role: 'Admin' },
      svarajyaName: 'Sharma Household',
      currentStep: 'dashboard',
    }))
  }

  const logout = () => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      currentStep: 'landing',
    }))
  }

  const signup = (svarajyaName: string, userName: string, email: string) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: { email, name: userName, role: 'Admin' },
      svarajyaName,
      currentStep: 'onboarding',
    }))
  }

  const setCurrentStep = (step: AppState['currentStep']) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }

  const updateZoneProgress = (zoneId: string, progress: number) => {
    setState((prev) => ({
      ...prev,
      zones: prev.zones.map((z) =>
        z.id === zoneId ? { ...z, progress, isComplete: progress >= 100 } : z
      ),
    }))
  }

  const completeChapter = (zoneId: string, chapterId: string) => {
    setState((prev) => {
      const zones = prev.zones.map((z) => {
        if (z.id !== zoneId) return z
        const chapters = z.chapters.map((c, idx, arr) => {
          if (c.id === chapterId) {
            return { ...c, isComplete: true }
          }

          if (arr[idx - 1]?.id === chapterId) {
            return { ...c, isLocked: false }
          }

          return c
        })
        const completedCount = chapters.filter((c) => c.isComplete).length
        const progress = Math.round((completedCount / chapters.length) * 100)
        return { ...z, chapters, progress, isComplete: progress >= 100 }
      })

      const chapter = prev.zones
        .find((z) => z.id === zoneId)
        ?.chapters.find((c) => c.id === chapterId)
      const newPoints = prev.svarajyaPoints + (chapter?.xpReward || 0)

      return { ...prev, zones, svarajyaPoints: newPoints }
    })
  }

  const showSealModal = () => setState((prev) => ({ ...prev, showRoyalSeal: true }))
  const hideSealModal = () => setState((prev) => ({ ...prev, showRoyalSeal: false }))

  const unlockBadge = (badge: Badge) => {
    setState((prev) => ({
      ...prev,
      badges: prev.badges.map((b) => (b.id === badge.id ? { ...b, earnedAt: new Date() } : b)),
      showBadgeUnlock: badge,
    }))
  }

  const hideBadgeUnlock = () => setState((prev) => ({ ...prev, showBadgeUnlock: null }))
  const giveConsent = () => setState((prev) => ({ ...prev, consentGiven: true }))
  const addPoints = (points: number) =>
    setState((prev) => ({ ...prev, svarajyaPoints: prev.svarajyaPoints + points }))

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        signup,
        setCurrentStep,
        updateZoneProgress,
        completeChapter,
        showSealModal,
        hideSealModal,
        unlockBadge,
        hideBadgeUnlock,
        giveConsent,
        addPoints,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
