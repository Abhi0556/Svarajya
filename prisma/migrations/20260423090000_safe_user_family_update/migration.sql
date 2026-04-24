/*
  Safe migration: add required User columns, enum, unique indexes,
  and CHECK constraints for 10-digit mobiles without dropping old columns/tables.
*/

-- Create enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER');
  END IF;
END
$$;

-- Add new columns to users (if missing)
ALTER TABLE IF EXISTS "users"
  ADD COLUMN IF NOT EXISTS "mobile" VARCHAR(10),
  ADD COLUMN IF NOT EXISTS "profile_image_url" TEXT,
  ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "is_adult" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "is_mobile_verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "is_first_login" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "is_onboarded" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "whatsapp_reminders_enabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'MEMBER';

-- Ensure unique indexes exist (safe check)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_name_key') THEN
    CREATE UNIQUE INDEX "users_name_key" ON "users" ("name");
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_mobile_key') THEN
    CREATE UNIQUE INDEX "users_mobile_key" ON "users" ("mobile");
  END IF;
END
$$;

-- Add CHECK constraints for exact 10-digit mobile values
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_mobile_digits') THEN
    ALTER TABLE "users" ADD CONSTRAINT users_mobile_digits CHECK (mobile ~ '^[0-9]{10}$');
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'family_members') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'family_members_mobile_digits') THEN
      ALTER TABLE "family_members" ADD CONSTRAINT family_members_mobile_digits CHECK (mobile IS NULL OR mobile ~ '^[0-9]{10}$');
    END IF;
  END IF;
END
$$;

-- Note: This migration intentionally does not drop or rename existing columns/tables.
-- Review and apply with `prisma migrate dev` when ready.
