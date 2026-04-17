-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'CONTENT_ADMIN', 'QUIZ_ADMIN', 'COMPLIANCE_ADMIN', 'COHORT_ADMIN', 'SUPPORT_ADMIN');

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING_INVITE');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'ARCHIVE', 'ROLLBACK', 'EXPORT', 'RESET', 'LOGIN', 'LOGIN_FAIL', 'LOGOUT', 'FORCE_LOGOUT', 'VIEW', 'TOGGLE');

-- CreateEnum
CREATE TYPE "ParamType" AS ENUM ('STRING', 'INTEGER', 'FLOAT', 'BOOLEAN', 'JSON');

-- CreateEnum
CREATE TYPE "ZoneType" AS ENUM ('RAKSHA', 'KOSH', 'VYAYA', 'RIN', 'DURG', 'MITRA', 'BHOOMI', 'GRANTHAGAAR', 'KAR', 'OTHER');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'NUMERIC', 'BOOLEAN', 'MULTI_SELECT', 'DATE', 'PHONE', 'EMAIL', 'SLIDER', 'CONFIRM', 'TEXT');

-- CreateEnum
CREATE TYPE "NotifChannel" AS ENUM ('IN_APP', 'EMAIL', 'PUSH', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "NotifStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'FAILED');

-- CreateEnum
CREATE TYPE "BroadcastStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('ICON', 'STORY_CARD', 'MAP_ELEMENT', 'ANIMATION', 'SOUND');

-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('BUG', 'QUESTION', 'SUGGESTION', 'ACCOUNT_ISSUE', 'DATA_CONCERN', 'OTHER');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_ON_USER', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('CHAPTER_RATING', 'MODULE_RATING', 'GAME_RATING', 'NPS_SURVEY', 'GENERAL_FEEDBACK', 'FEATURE_REQUEST');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('DAILY_SUMMARY', 'WEEKLY_ENGAGEMENT', 'MONTHLY_HEALTH', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReportFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('INDIVIDUAL_SALARIED', 'INDIVIDUAL_SELF_EMPLOYED', 'FAMILY');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED', 'PENDING_VERIFICATION');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVE',
    "twoFactorSecret" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_sessions" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "actionType" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_access_logs" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionPerformed" TEXT NOT NULL,
    "dataScope" TEXT NOT NULL,
    "justification" TEXT,
    "ipAddress" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL,
    "consentedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "version" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_parameters" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueType" "ParamType" NOT NULL DEFAULT 'STRING',
    "description" TEXT,
    "category" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "personaScope" JSONB,
    "cohortScope" TEXT,
    "geoScope" JSONB,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "dependsOnFlagId" TEXT,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameHindi" TEXT,
    "zoneType" "ZoneType" NOT NULL,
    "iconRef" TEXT,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "isMvp" BOOLEAN NOT NULL DEFAULT false,
    "visibilityStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "featureFlagId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submodules" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameHindi" TEXT,
    "adhyayaTitle" TEXT,
    "tutorialCount" INTEGER NOT NULL DEFAULT 0,
    "gameTemplateType" TEXT,
    "gameCount" INTEGER NOT NULL DEFAULT 0,
    "fieldCount" INTEGER NOT NULL DEFAULT 0,
    "completionRules" JSONB,
    "displayOrder" INTEGER NOT NULL,
    "visibilityStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submodules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutorials" (
    "id" TEXT NOT NULL,
    "submoduleId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeUrl" TEXT,
    "youtubeId" TEXT,
    "durationSeconds" INTEGER,
    "transcriptText" TEXT,
    "mustWatch" BOOLEAN NOT NULL DEFAULT false,
    "visibilityStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "personaScope" JSONB,
    "cohortScope" TEXT,
    "publishStartDate" TIMESTAMP(3),
    "publishEndDate" TIMESTAMP(3),
    "displayOrder" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "changeNotes" TEXT,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutorials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutorial_completions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tutorialId" TEXT NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchDuration" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tutorial_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutorial_analytics" (
    "id" TEXT NOT NULL,
    "tutorialId" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedCount" INTEGER NOT NULL DEFAULT 0,
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "avgWatchDuration" DOUBLE PRECISION,
    "dropOffPoint" INTEGER,

    CONSTRAINT "tutorial_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "submoduleId" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "questionText" TEXT NOT NULL,
    "explanationText" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "fieldMappingId" TEXT,
    "scoringWeight" INTEGER NOT NULL DEFAULT 1,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "personaScope" JSONB,
    "visibilityStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "displayOrder" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_mappings" (
    "id" TEXT NOT NULL,
    "databaseTable" TEXT NOT NULL,
    "databaseField" TEXT NOT NULL,
    "validationRule" JSONB,
    "calculationDeps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerValue" JSONB NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculation_parameters" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "defaultValue" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculation_parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channel" "NotifChannel" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "subject" TEXT,
    "bodyTemplate" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "personaScope" JSONB,
    "visibilityStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT,
    "channel" "NotifChannel" NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "status" "NotifStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broadcasts" (
    "id" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "targetScope" JSONB NOT NULL,
    "channel" "NotifChannel" NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "status" "BroadcastStatus" NOT NULL DEFAULT 'DRAFT',
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "openedCount" INTEGER NOT NULL DEFAULT 0,
    "clickedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "broadcasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohorts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "assignedModules" JSONB NOT NULL,
    "weeklyTasks" JSONB,
    "announcementText" TEXT,
    "visibilityFlag" BOOLEAN NOT NULL DEFAULT true,
    "maxCapacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cohorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_cohorts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "user_cohorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "iks_assets" (
    "id" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "moduleScope" TEXT,
    "language" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "visibilityFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "iks_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "TicketCategory" NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "assignedTo" TEXT,
    "deviceInfo" JSONB,
    "appVersion" TEXT,
    "screenshots" JSONB,
    "internalNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "userSatisfaction" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_responses" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "responderId" TEXT,
    "responderType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feedbackType" "FeedbackType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "rating" INTEGER,
    "sentiment" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "displayOrder" INTEGER NOT NULL,
    "linkedEntity" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "notHelpfulCount" INTEGER NOT NULL DEFAULT 0,
    "visibilityFlag" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_reports" (
    "id" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "reportType" "ReportType" NOT NULL,
    "frequency" "ReportFrequency" NOT NULL,
    "recipients" JSONB NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'PDF',
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scheduled_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "name" TEXT,
    "dob" DATE,
    "gender" TEXT,
    "panMasked" TEXT,
    "aadhaarMasked" TEXT,
    "primaryMobile" TEXT,
    "primaryEmail" TEXT,
    "recoveryEmail" TEXT,
    "address" TEXT,
    "maritalStatus" TEXT,
    "occupationType" TEXT,
    "employerCompany" TEXT,
    "profileType" "ProfileType" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3),
    "deviceInfo" JSONB,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceType" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "dob" DATE,
    "isDependent" BOOLEAN NOT NULL DEFAULT false,
    "nomineeEligible" BOOLEAN NOT NULL DEFAULT true,
    "accessLevel" TEXT NOT NULL DEFAULT 'VIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institute" TEXT NOT NULL,
    "yearCompleted" INTEGER,
    "specialization" TEXT,
    "linkedLoanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "idType" TEXT NOT NULL,
    "numberMasked" TEXT NOT NULL,
    "numberFull" TEXT,
    "expiryDate" DATE,
    "issuedDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_links" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "linkedType" TEXT NOT NULL,
    "linkedValue" TEXT NOT NULL,
    "serviceName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "identity_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credential_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "portalType" TEXT NOT NULL,
    "portalName" TEXT NOT NULL,
    "portalUrl" TEXT,
    "loginId" TEXT,
    "registeredEmail" TEXT,
    "registeredMobile" TEXT,
    "storageMode" TEXT NOT NULL DEFAULT 'REFERENCE',
    "encryptedPassword" TEXT,
    "linkedMemberId" TEXT,
    "registrationDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credential_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "income_streams" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT,
    "frequency" TEXT NOT NULL DEFAULT 'MONTHLY',
    "amountGross" DOUBLE PRECISION NOT NULL,
    "deductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amountNet" DOUBLE PRECISION NOT NULL,
    "creditedAccountId" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "income_streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "mode" TEXT,
    "accountId" TEXT,
    "description" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expense_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalMonthly" DOUBLE PRECISION NOT NULL,
    "categories" JSONB NOT NULL,
    "overspendRules" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifsc" TEXT,
    "holders" JSONB,
    "openingBalance" DOUBLE PRECISION,
    "currentBalance" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_holdings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "investedAmount" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION,
    "maturityDate" DATE,
    "lockInPeriod" INTEGER,
    "riskLevel" TEXT,
    "linkedGoalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investment_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_policies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "insurerName" TEXT,
    "sumAssured" DOUBLE PRECISION NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "premiumFrequency" TEXT NOT NULL DEFAULT 'ANNUAL',
    "dueDate" DATE NOT NULL,
    "maturityDate" DATE,
    "nomineeId" TEXT,
    "agentContact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_coverage" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "insurance_coverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "lenderName" TEXT,
    "principal" DOUBLE PRECISION NOT NULL,
    "outstandingAmount" DOUBLE PRECISION NOT NULL,
    "emi" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "tenure" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "linkedPropertyId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_assets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT,
    "purchaseDate" DATE,
    "purchaseAmount" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION,
    "ownContribution" DOUBLE PRECISION,
    "linkedLoanId" TEXT,
    "rentalIncome" DOUBLE PRECISION,
    "annualCosts" DOUBLE PRECISION,
    "propertyTax" DOUBLE PRECISION,
    "vacancyMonths" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "renewalDate" DATE NOT NULL,
    "lastUsedDate" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "targetDate" DATE NOT NULL,
    "currentSaved" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "requiredMonthlySavings" DOUBLE PRECISION,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nominee_mapping" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetRef" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "nomineeId" TEXT NOT NULL,
    "sharePercent" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "proofDocLinked" BOOLEAN NOT NULL DEFAULT false,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nominee_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "will_status" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "existsFlag" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "executorName" TEXT,
    "executorContact" TEXT,
    "instructions" TEXT,
    "lastReviewDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "will_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_inventory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "purchaseValue" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION,
    "ownerId" TEXT,
    "insuredFlag" BOOLEAN NOT NULL DEFAULT false,
    "linkedPolicyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_meta" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "linkedPersonId" TEXT,
    "linkedEntityId" TEXT,
    "fileName" TEXT NOT NULL,
    "fileHash" TEXT,
    "localPathRef" TEXT,
    "cloudBackupConsent" BOOLEAN NOT NULL DEFAULT false,
    "cloudStorageUrl" TEXT,
    "expiryDate" DATE,
    "versionTag" TEXT,
    "versionHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetDate" DATE NOT NULL,
    "leadTime" INTEGER NOT NULL DEFAULT 7,
    "channel" TEXT NOT NULL DEFAULT 'IN_APP',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "linkedEntityId" TEXT,
    "message" TEXT,
    "sentAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_module_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "user_module_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_chapter_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submoduleId" TEXT NOT NULL,
    "tutorialsWatched" JSONB,
    "gameStartedAt" TIMESTAMP(3),
    "gameCompletedAt" TIMESTAMP(3),
    "sealConfirmedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'LOCKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_chapter_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_runs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submoduleId" TEXT NOT NULL,
    "gameTemplate" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "game_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamification_state" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "badgesEarned" JSONB,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "rank" TEXT NOT NULL DEFAULT 'BEGINNER',
    "lastActivityDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gamification_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rajya_scores" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "rank" TEXT NOT NULL,
    "rakshaScore" DOUBLE PRECISION,
    "durgScore" DOUBLE PRECISION,
    "rinScore" DOUBLE PRECISION,
    "vyayaScore" DOUBLE PRECISION,
    "mitraScore" DOUBLE PRECISION,
    "koshScore" DOUBLE PRECISION,
    "goalsScore" DOUBLE PRECISION,
    "riskFlags" JSONB,
    "nextActions" JSONB,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousScore" DOUBLE PRECISION,
    "trend" TEXT,

    CONSTRAINT "rajya_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB,
    "deviceType" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_analytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "newRegistrations" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "dau" INTEGER NOT NULL DEFAULT 0,
    "sessionsTotal" INTEGER NOT NULL DEFAULT 0,
    "avgSessionDuration" DOUBLE PRECISION,
    "modulesCompleted" INTEGER NOT NULL DEFAULT 0,
    "chaptersCompleted" INTEGER NOT NULL DEFAULT 0,
    "docsUploaded" INTEGER NOT NULL DEFAULT 0,
    "supportTicketsCreated" INTEGER NOT NULL DEFAULT 0,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_analytics" (
    "id" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "weekEnd" DATE NOT NULL,
    "wau" INTEGER NOT NULL DEFAULT 0,
    "retention7Day" DOUBLE PRECISION,
    "retention14Day" DOUBLE PRECISION,
    "retention30Day" DOUBLE PRECISION,
    "topModule" TEXT,
    "topDropOffPoint" TEXT,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_analytics" (
    "id" TEXT NOT NULL,
    "month" DATE NOT NULL,
    "mau" INTEGER NOT NULL DEFAULT 0,
    "retention30Day" DOUBLE PRECISION,
    "retention60Day" DOUBLE PRECISION,
    "retention90Day" DOUBLE PRECISION,
    "avgStabilityScore" DOUBLE PRECISION,
    "productHealthScore" DOUBLE PRECISION,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_email_idx" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_role_idx" ON "admin_users"("role");

-- CreateIndex
CREATE INDEX "admin_users_status_idx" ON "admin_users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "admin_sessions_token_key" ON "admin_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "admin_sessions_refreshToken_key" ON "admin_sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "admin_sessions_adminUserId_idx" ON "admin_sessions"("adminUserId");

-- CreateIndex
CREATE INDEX "admin_sessions_token_idx" ON "admin_sessions"("token");

-- CreateIndex
CREATE INDEX "admin_sessions_expiresAt_idx" ON "admin_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_adminUserId_idx" ON "admin_audit_logs"("adminUserId");

-- CreateIndex
CREATE INDEX "admin_audit_logs_entityType_idx" ON "admin_audit_logs"("entityType");

-- CreateIndex
CREATE INDEX "admin_audit_logs_actionType_idx" ON "admin_audit_logs"("actionType");

-- CreateIndex
CREATE INDEX "admin_audit_logs_timestamp_idx" ON "admin_audit_logs"("timestamp");

-- CreateIndex
CREATE INDEX "data_access_logs_adminUserId_idx" ON "data_access_logs"("adminUserId");

-- CreateIndex
CREATE INDEX "data_access_logs_userId_idx" ON "data_access_logs"("userId");

-- CreateIndex
CREATE INDEX "data_access_logs_timestamp_idx" ON "data_access_logs"("timestamp");

-- CreateIndex
CREATE INDEX "consent_records_userId_idx" ON "consent_records"("userId");

-- CreateIndex
CREATE INDEX "consent_records_consentType_idx" ON "consent_records"("consentType");

-- CreateIndex
CREATE UNIQUE INDEX "consent_records_userId_consentType_key" ON "consent_records"("userId", "consentType");

-- CreateIndex
CREATE UNIQUE INDEX "system_parameters_key_key" ON "system_parameters"("key");

-- CreateIndex
CREATE INDEX "system_parameters_key_idx" ON "system_parameters"("key");

-- CreateIndex
CREATE INDEX "system_parameters_category_idx" ON "system_parameters"("category");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_name_key" ON "feature_flags"("name");

-- CreateIndex
CREATE INDEX "feature_flags_name_idx" ON "feature_flags"("name");

-- CreateIndex
CREATE INDEX "feature_flags_enabled_idx" ON "feature_flags"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "modules_code_key" ON "modules"("code");

-- CreateIndex
CREATE INDEX "modules_code_idx" ON "modules"("code");

-- CreateIndex
CREATE INDEX "modules_visibilityStatus_idx" ON "modules"("visibilityStatus");

-- CreateIndex
CREATE INDEX "modules_isMvp_idx" ON "modules"("isMvp");

-- CreateIndex
CREATE UNIQUE INDEX "submodules_code_key" ON "submodules"("code");

-- CreateIndex
CREATE INDEX "submodules_moduleId_idx" ON "submodules"("moduleId");

-- CreateIndex
CREATE INDEX "submodules_code_idx" ON "submodules"("code");

-- CreateIndex
CREATE INDEX "tutorials_submoduleId_idx" ON "tutorials"("submoduleId");

-- CreateIndex
CREATE INDEX "tutorials_language_idx" ON "tutorials"("language");

-- CreateIndex
CREATE INDEX "tutorials_visibilityStatus_idx" ON "tutorials"("visibilityStatus");

-- CreateIndex
CREATE INDEX "tutorial_completions_userId_idx" ON "tutorial_completions"("userId");

-- CreateIndex
CREATE INDEX "tutorial_completions_tutorialId_idx" ON "tutorial_completions"("tutorialId");

-- CreateIndex
CREATE UNIQUE INDEX "tutorial_completions_userId_tutorialId_key" ON "tutorial_completions"("userId", "tutorialId");

-- CreateIndex
CREATE INDEX "tutorial_analytics_tutorialId_idx" ON "tutorial_analytics"("tutorialId");

-- CreateIndex
CREATE INDEX "tutorial_analytics_date_idx" ON "tutorial_analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "tutorial_analytics_tutorialId_date_key" ON "tutorial_analytics"("tutorialId", "date");

-- CreateIndex
CREATE INDEX "questions_submoduleId_idx" ON "questions"("submoduleId");

-- CreateIndex
CREATE INDEX "questions_questionType_idx" ON "questions"("questionType");

-- CreateIndex
CREATE INDEX "questions_visibilityStatus_idx" ON "questions"("visibilityStatus");

-- CreateIndex
CREATE INDEX "field_mappings_databaseTable_idx" ON "field_mappings"("databaseTable");

-- CreateIndex
CREATE UNIQUE INDEX "field_mappings_databaseTable_databaseField_key" ON "field_mappings"("databaseTable", "databaseField");

-- CreateIndex
CREATE INDEX "quiz_answers_userId_idx" ON "quiz_answers"("userId");

-- CreateIndex
CREATE INDEX "quiz_answers_questionId_idx" ON "quiz_answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "calculation_parameters_key_key" ON "calculation_parameters"("key");

-- CreateIndex
CREATE INDEX "calculation_parameters_key_idx" ON "calculation_parameters"("key");

-- CreateIndex
CREATE INDEX "calculation_parameters_category_idx" ON "calculation_parameters"("category");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_name_key" ON "notification_templates"("name");

-- CreateIndex
CREATE INDEX "notification_templates_name_idx" ON "notification_templates"("name");

-- CreateIndex
CREATE INDEX "notification_templates_channel_idx" ON "notification_templates"("channel");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "broadcasts_status_idx" ON "broadcasts"("status");

-- CreateIndex
CREATE INDEX "broadcasts_scheduledFor_idx" ON "broadcasts"("scheduledFor");

-- CreateIndex
CREATE INDEX "cohorts_name_idx" ON "cohorts"("name");

-- CreateIndex
CREATE INDEX "user_cohorts_userId_idx" ON "user_cohorts"("userId");

-- CreateIndex
CREATE INDEX "user_cohorts_cohortId_idx" ON "user_cohorts"("cohortId");

-- CreateIndex
CREATE UNIQUE INDEX "user_cohorts_userId_cohortId_key" ON "user_cohorts"("userId", "cohortId");

-- CreateIndex
CREATE INDEX "iks_assets_assetType_idx" ON "iks_assets"("assetType");

-- CreateIndex
CREATE INDEX "iks_assets_moduleScope_idx" ON "iks_assets"("moduleScope");

-- CreateIndex
CREATE INDEX "support_tickets_userId_idx" ON "support_tickets"("userId");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_assignedTo_idx" ON "support_tickets"("assignedTo");

-- CreateIndex
CREATE INDEX "ticket_responses_ticketId_idx" ON "ticket_responses"("ticketId");

-- CreateIndex
CREATE INDEX "user_feedback_userId_idx" ON "user_feedback"("userId");

-- CreateIndex
CREATE INDEX "user_feedback_feedbackType_idx" ON "user_feedback"("feedbackType");

-- CreateIndex
CREATE INDEX "user_feedback_entityType_idx" ON "user_feedback"("entityType");

-- CreateIndex
CREATE INDEX "faqs_category_idx" ON "faqs"("category");

-- CreateIndex
CREATE INDEX "faqs_language_idx" ON "faqs"("language");

-- CreateIndex
CREATE INDEX "scheduled_reports_nextRunAt_idx" ON "scheduled_reports"("nextRunAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_profileType_idx" ON "users"("profileType");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refreshToken_key" ON "user_sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_token_idx" ON "user_sessions"("token");

-- CreateIndex
CREATE INDEX "user_sessions_expiresAt_idx" ON "user_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "family_members_userId_idx" ON "family_members"("userId");

-- CreateIndex
CREATE INDEX "education_userId_idx" ON "education"("userId");

-- CreateIndex
CREATE INDEX "identity_records_userId_idx" ON "identity_records"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "identity_records_userId_idType_key" ON "identity_records"("userId", "idType");

-- CreateIndex
CREATE INDEX "identity_links_userId_idx" ON "identity_links"("userId");

-- CreateIndex
CREATE INDEX "identity_links_identityId_idx" ON "identity_links"("identityId");

-- CreateIndex
CREATE INDEX "credential_records_userId_idx" ON "credential_records"("userId");

-- CreateIndex
CREATE INDEX "credential_records_portalType_idx" ON "credential_records"("portalType");

-- CreateIndex
CREATE INDEX "income_streams_userId_idx" ON "income_streams"("userId");

-- CreateIndex
CREATE INDEX "income_streams_type_idx" ON "income_streams"("type");

-- CreateIndex
CREATE INDEX "expense_entries_userId_idx" ON "expense_entries"("userId");

-- CreateIndex
CREATE INDEX "expense_entries_date_idx" ON "expense_entries"("date");

-- CreateIndex
CREATE INDEX "expense_entries_category_idx" ON "expense_entries"("category");

-- CreateIndex
CREATE INDEX "budget_plans_userId_idx" ON "budget_plans"("userId");

-- CreateIndex
CREATE INDEX "bank_accounts_userId_idx" ON "bank_accounts"("userId");

-- CreateIndex
CREATE INDEX "bank_accounts_status_idx" ON "bank_accounts"("status");

-- CreateIndex
CREATE INDEX "investment_holdings_userId_idx" ON "investment_holdings"("userId");

-- CreateIndex
CREATE INDEX "investment_holdings_type_idx" ON "investment_holdings"("type");

-- CreateIndex
CREATE INDEX "insurance_policies_userId_idx" ON "insurance_policies"("userId");

-- CreateIndex
CREATE INDEX "insurance_policies_type_idx" ON "insurance_policies"("type");

-- CreateIndex
CREATE INDEX "insurance_policies_dueDate_idx" ON "insurance_policies"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_coverage_policyId_memberId_key" ON "insurance_coverage"("policyId", "memberId");

-- CreateIndex
CREATE INDEX "loan_accounts_userId_idx" ON "loan_accounts"("userId");

-- CreateIndex
CREATE INDEX "loan_accounts_type_idx" ON "loan_accounts"("type");

-- CreateIndex
CREATE INDEX "loan_accounts_status_idx" ON "loan_accounts"("status");

-- CreateIndex
CREATE INDEX "property_assets_userId_idx" ON "property_assets"("userId");

-- CreateIndex
CREATE INDEX "property_assets_type_idx" ON "property_assets"("type");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_renewalDate_idx" ON "subscriptions"("renewalDate");

-- CreateIndex
CREATE INDEX "goals_userId_idx" ON "goals"("userId");

-- CreateIndex
CREATE INDEX "goals_status_idx" ON "goals"("status");

-- CreateIndex
CREATE INDEX "nominee_mapping_userId_idx" ON "nominee_mapping"("userId");

-- CreateIndex
CREATE INDEX "nominee_mapping_assetType_idx" ON "nominee_mapping"("assetType");

-- CreateIndex
CREATE UNIQUE INDEX "will_status_userId_key" ON "will_status"("userId");

-- CreateIndex
CREATE INDEX "asset_inventory_userId_idx" ON "asset_inventory"("userId");

-- CreateIndex
CREATE INDEX "asset_inventory_itemType_idx" ON "asset_inventory"("itemType");

-- CreateIndex
CREATE INDEX "document_meta_userId_idx" ON "document_meta"("userId");

-- CreateIndex
CREATE INDEX "document_meta_docType_idx" ON "document_meta"("docType");

-- CreateIndex
CREATE INDEX "document_meta_expiryDate_idx" ON "document_meta"("expiryDate");

-- CreateIndex
CREATE INDEX "reminders_userId_idx" ON "reminders"("userId");

-- CreateIndex
CREATE INDEX "reminders_targetDate_idx" ON "reminders"("targetDate");

-- CreateIndex
CREATE INDEX "reminders_status_idx" ON "reminders"("status");

-- CreateIndex
CREATE INDEX "user_module_progress_userId_idx" ON "user_module_progress"("userId");

-- CreateIndex
CREATE INDEX "user_module_progress_moduleId_idx" ON "user_module_progress"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_module_progress_userId_moduleId_key" ON "user_module_progress"("userId", "moduleId");

-- CreateIndex
CREATE INDEX "user_chapter_progress_userId_idx" ON "user_chapter_progress"("userId");

-- CreateIndex
CREATE INDEX "user_chapter_progress_submoduleId_idx" ON "user_chapter_progress"("submoduleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_chapter_progress_userId_submoduleId_key" ON "user_chapter_progress"("userId", "submoduleId");

-- CreateIndex
CREATE INDEX "game_runs_userId_idx" ON "game_runs"("userId");

-- CreateIndex
CREATE INDEX "game_runs_submoduleId_idx" ON "game_runs"("submoduleId");

-- CreateIndex
CREATE UNIQUE INDEX "gamification_state_userId_key" ON "gamification_state"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "rajya_scores_userId_key" ON "rajya_scores"("userId");

-- CreateIndex
CREATE INDEX "rajya_scores_userId_idx" ON "rajya_scores"("userId");

-- CreateIndex
CREATE INDEX "rajya_scores_rank_idx" ON "rajya_scores"("rank");

-- CreateIndex
CREATE INDEX "activity_events_userId_idx" ON "activity_events"("userId");

-- CreateIndex
CREATE INDEX "activity_events_eventType_idx" ON "activity_events"("eventType");

-- CreateIndex
CREATE INDEX "activity_events_timestamp_idx" ON "activity_events"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "daily_analytics_date_key" ON "daily_analytics"("date");

-- CreateIndex
CREATE INDEX "daily_analytics_date_idx" ON "daily_analytics"("date");

-- CreateIndex
CREATE INDEX "weekly_analytics_weekStart_idx" ON "weekly_analytics"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_analytics_weekStart_weekEnd_key" ON "weekly_analytics"("weekStart", "weekEnd");

-- CreateIndex
CREATE INDEX "monthly_analytics_month_idx" ON "monthly_analytics"("month");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_analytics_month_key" ON "monthly_analytics"("month");

-- AddForeignKey
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_access_logs" ADD CONSTRAINT "data_access_logs_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_access_logs" ADD CONSTRAINT "data_access_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_parameters" ADD CONSTRAINT "system_parameters_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_dependsOnFlagId_fkey" FOREIGN KEY ("dependsOnFlagId") REFERENCES "feature_flags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submodules" ADD CONSTRAINT "submodules_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_submoduleId_fkey" FOREIGN KEY ("submoduleId") REFERENCES "submodules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutorials" ADD CONSTRAINT "tutorials_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutorial_completions" ADD CONSTRAINT "tutorial_completions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutorial_completions" ADD CONSTRAINT "tutorial_completions_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutorial_analytics" ADD CONSTRAINT "tutorial_analytics_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_submoduleId_fkey" FOREIGN KEY ("submoduleId") REFERENCES "submodules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_fieldMappingId_fkey" FOREIGN KEY ("fieldMappingId") REFERENCES "field_mappings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "notification_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broadcasts" ADD CONSTRAINT "broadcasts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cohorts" ADD CONSTRAINT "user_cohorts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cohorts" ADD CONSTRAINT "user_cohorts_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_responses" ADD CONSTRAINT "ticket_responses_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feedback" ADD CONSTRAINT "user_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_reports" ADD CONSTRAINT "scheduled_reports_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_records" ADD CONSTRAINT "identity_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_links" ADD CONSTRAINT "identity_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_links" ADD CONSTRAINT "identity_links_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "identity_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credential_records" ADD CONSTRAINT "credential_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "income_streams" ADD CONSTRAINT "income_streams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_entries" ADD CONSTRAINT "expense_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_plans" ADD CONSTRAINT "budget_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_holdings" ADD CONSTRAINT "investment_holdings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_holdings" ADD CONSTRAINT "investment_holdings_linkedGoalId_fkey" FOREIGN KEY ("linkedGoalId") REFERENCES "goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_policies" ADD CONSTRAINT "insurance_policies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_coverage" ADD CONSTRAINT "insurance_coverage_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "insurance_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_coverage" ADD CONSTRAINT "insurance_coverage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_accounts" ADD CONSTRAINT "loan_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_assets" ADD CONSTRAINT "property_assets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominee_mapping" ADD CONSTRAINT "nominee_mapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nominee_mapping" ADD CONSTRAINT "nominee_mapping_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "family_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "will_status" ADD CONSTRAINT "will_status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_inventory" ADD CONSTRAINT "asset_inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_meta" ADD CONSTRAINT "document_meta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_progress" ADD CONSTRAINT "user_module_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_progress" ADD CONSTRAINT "user_module_progress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chapter_progress" ADD CONSTRAINT "user_chapter_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chapter_progress" ADD CONSTRAINT "user_chapter_progress_submoduleId_fkey" FOREIGN KEY ("submoduleId") REFERENCES "submodules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_runs" ADD CONSTRAINT "game_runs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamification_state" ADD CONSTRAINT "gamification_state_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rajya_scores" ADD CONSTRAINT "rajya_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
