/**
 * Rajya Configuration — Zone weights for Stability Index calculation
 */

export interface RajyaZone {
  key: string;
  name: string;
  hindiName: string;
  weight: number;  // Contribution to Rajya Stability Index (0-1, totals to 1.0)
  icon: string;
  color: string;
  moduleId: number;
}

export const RAJYA_ZONES: Record<string, RajyaZone> = {
  RAKSHA: {
    key: 'RAKSHA',
    name: 'Insurance',
    hindiName: 'Raksha Kavach',
    weight: 0.20,
    icon: '🛡️',
    color: '#8E44AD',
    moduleId: 8,
  },
  DURG: {
    key: 'DURG',
    name: 'Emergency Fund',
    hindiName: 'Durg',
    weight: 0.20,
    icon: '🏰',
    color: '#C0392B',
    moduleId: 6,
  },
  KOSH: {
    key: 'KOSH',
    name: 'Income Health',
    hindiName: 'Kosh',
    weight: 0.15,
    icon: '💰',
    color: '#27AE60',
    moduleId: 4,
  },
  VYAYA: {
    key: 'VYAYA',
    name: 'Expense Control',
    hindiName: 'Vyaya',
    weight: 0.20,
    icon: '📊',
    color: '#E67E22',
    moduleId: 5,
  },
  BEEJ: {
    key: 'BEEJ',
    name: 'Investments',
    hindiName: 'Beej Kshetra',
    weight: 0.15,
    icon: '🌱',
    color: '#1ABC9C',
    moduleId: 7,
  },
  RIN: {
    key: 'RIN',
    name: 'Loan Health',
    hindiName: 'Rin Mukt',
    weight: 0.10,
    icon: '📋',
    color: '#E74C3C',
    moduleId: 9,
  },
};

// Validate weights sum to 1.0
const totalWeight = Object.values(RAJYA_ZONES).reduce((sum, z) => sum + z.weight, 0);
if (Math.abs(totalWeight - 1.0) > 0.001) {
  console.warn(`⚠️ RAJYA_ZONES weights sum to ${totalWeight}, expected 1.0`);
}

export const RAJYA_SCORE_LABELS: Record<string, { label: string; color: string }> = {
  CRITICAL: { label: 'Critical', color: '#E74C3C' },    // 0-25
  WEAK: { label: 'Weak', color: '#E67E22' },             // 26-50
  STABLE: { label: 'Stable', color: '#F1C40F' },         // 51-75
  STRONG: { label: 'Strong', color: '#27AE60' },         // 76-90
  INVINCIBLE: { label: 'Invincible', color: '#D4AF37' }, // 91-100
};

export function getRajyaScoreLabel(score: number): { label: string; color: string } {
  if (score <= 25) return RAJYA_SCORE_LABELS.CRITICAL;
  if (score <= 50) return RAJYA_SCORE_LABELS.WEAK;
  if (score <= 75) return RAJYA_SCORE_LABELS.STABLE;
  if (score <= 90) return RAJYA_SCORE_LABELS.STRONG;
  return RAJYA_SCORE_LABELS.INVINCIBLE;
}
