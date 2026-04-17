/**
 * Calculation Engine — core financial computations for Rajya Stability Index
 * Net Worth, Debt Burden %, Emergency Fund Coverage, Insurance Adequacy
 */

export interface FinancialSnapshot {
  // Income
  monthlyIncome: number;
  annualIncome: number;

  // Assets
  bankBalances: number;
  investments: number;
  propertyValue: number;
  otherAssets: number;

  // Liabilities
  totalLoans: number;
  monthlyEMIs: number;
  creditCardDebt: number;

  // Insurance
  lifeInsuranceCover: number;
  healthInsuranceCover: number;

  // Expenses
  monthlyExpenses: number;
  monthlySubscriptions: number;
}

export interface RajyaCalculations {
  netWorth: number;
  debtBurdenPercent: number;     // EMIs / Monthly Income
  emergencyMonths: number;        // Bank Balance / Monthly Expenses
  savingsRate: number;            // (Income - Expenses) / Income
  insuranceAdequacy: number;      // Life cover / (Annual income * 10)
  stabilityIndex: number;         // 0-100 Rajya Stability Score
}

/**
 * Calculate net worth = total assets - total liabilities
 */
export function calculateNetWorth(snapshot: FinancialSnapshot): number {
  const totalAssets =
    snapshot.bankBalances +
    snapshot.investments +
    snapshot.propertyValue +
    snapshot.otherAssets;

  const totalLiabilities = snapshot.totalLoans + snapshot.creditCardDebt;

  return totalAssets - totalLiabilities;
}

/**
 * Debt burden % = (Monthly EMIs / Monthly Income) * 100
 * Healthy: < 40%
 */
export function calculateDebtBurden(snapshot: FinancialSnapshot): number {
  if (snapshot.monthlyIncome <= 0) return 0;
  return (snapshot.monthlyEMIs / snapshot.monthlyIncome) * 100;
}

/**
 * Emergency fund coverage = Bank Balance / Monthly Expenses
 * Healthy: >= 6 months
 */
export function calculateEmergencyMonths(snapshot: FinancialSnapshot): number {
  if (snapshot.monthlyExpenses <= 0) return 0;
  return snapshot.bankBalances / snapshot.monthlyExpenses;
}

/**
 * Savings rate = (Income - Expenses) / Income * 100
 * Healthy: >= 20%
 */
export function calculateSavingsRate(snapshot: FinancialSnapshot): number {
  if (snapshot.monthlyIncome <= 0) return 0;
  const savings = snapshot.monthlyIncome - snapshot.monthlyExpenses;
  return (savings / snapshot.monthlyIncome) * 100;
}

/**
 * Insurance adequacy = Life Cover / (Annual Income * 10)
 * Ideal: >= 1.0 (i.e., life cover >= 10x annual income)
 */
export function calculateInsuranceAdequacy(snapshot: FinancialSnapshot): number {
  const idealCover = snapshot.annualIncome * 10;
  if (idealCover <= 0) return 0;
  return Math.min(1, snapshot.lifeInsuranceCover / idealCover);
}

/**
 * Rajya Stability Index (0-100)
 * Weighted composite score based on financial health pillars
 *
 * RAKSHA (Insurance):   20%
 * DURG (Emergency):     20%
 * KOSH (Income health): 15%
 * VYAYA (Debt burden):  20%
 * BEEJ (Investments):   15%
 * RIN (Loan health):    10%
 */
export function calculateRajyaStabilityIndex(snapshot: FinancialSnapshot): number {
  // Component scores (0-100)

  // Emergency fund: 6+ months = 100, 0 months = 0
  const emergencyScore = Math.min(100, (calculateEmergencyMonths(snapshot) / 6) * 100);

  // Insurance adequacy: 1.0+ = 100
  const insuranceScore = Math.min(100, calculateInsuranceAdequacy(snapshot) * 100);

  // Debt burden: 0% = 100, 40%+ = 0
  const debtBurden = calculateDebtBurden(snapshot);
  const debtScore = Math.max(0, 100 - (debtBurden / 40) * 100);

  // Savings rate: 20%+ = 100, 0% = 0
  const savingsScore = Math.min(100, (calculateSavingsRate(snapshot) / 20) * 100);

  // Investment ratio: investments / annual income, 1x = 100
  const investmentRatio = snapshot.annualIncome > 0
    ? Math.min(100, (snapshot.investments / snapshot.annualIncome) * 100)
    : 0;

  // Composite weighted score
  const stabilityIndex =
    emergencyScore * 0.20 +
    insuranceScore * 0.20 +
    debtScore * 0.20 +
    savingsScore * 0.15 +
    investmentRatio * 0.15 +
    Math.min(100, (snapshot.bankBalances > 0 ? 100 : 0)) * 0.10;

  return Math.round(stabilityIndex);
}

/**
 * Run all calculations at once
 */
export function runAllCalculations(snapshot: FinancialSnapshot): RajyaCalculations {
  return {
    netWorth: calculateNetWorth(snapshot),
    debtBurdenPercent: calculateDebtBurden(snapshot),
    emergencyMonths: calculateEmergencyMonths(snapshot),
    savingsRate: calculateSavingsRate(snapshot),
    insuranceAdequacy: calculateInsuranceAdequacy(snapshot),
    stabilityIndex: calculateRajyaStabilityIndex(snapshot),
  };
}
