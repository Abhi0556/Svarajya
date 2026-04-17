// API response and request types

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// ─── Profile API ──────────────────────────────────────────────────────────────

export interface CreateProfileRequest {
  fullName: string
  dob?: string
  lifePhase?: string
  maritalStatus?: string
  occupationType?: string
  occupationOther?: string
  email?: string
  mobile?: string
  priority?: string
}

// ─── Income API ──────────────────────────────────────────────────────────────

export interface CreateIncomeRequest {
  amount: number
  date: string
  source: string
  isRecurring?: boolean
  frequency?: string
  description?: string
  accountId?: string
}

// ─── Expense API ──────────────────────────────────────────────────────────────

export interface CreateExpenseRequest {
  amount: number
  date: string
  categoryId: string
  paymentMode: string
  isRecurring?: boolean
  frequency?: string
  description?: string
  linkedFamilyMemberId?: string
  paidFromAccountId?: string
}

// ─── Bank API ─────────────────────────────────────────────────────────────────

export interface CreateBankAccountRequest {
  bankName: string
  accountType: string
  nickname?: string
  accountLast4: string
  openingBalance?: number
  latestBalance?: number
  latestBalanceAsOf: string
}
