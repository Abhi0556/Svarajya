/*
  Warnings:

  - Added the required column `createdBy` to the `iks_assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `iks_assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `notification_templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calculation_parameters" ADD COLUMN     "maxValue" DOUBLE PRECISION,
ADD COLUMN     "minValue" DOUBLE PRECISION,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "iks_assets" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notification_templates" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedBy" TEXT;

-- CreateTable
CREATE TABLE "calculation_parameter_history" (
    "id" TEXT NOT NULL,
    "parameterId" TEXT NOT NULL,
    "parameterKey" TEXT NOT NULL,
    "oldValue" DOUBLE PRECISION NOT NULL,
    "newValue" DOUBLE PRECISION NOT NULL,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculation_parameter_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "calculation_parameter_history_parameterId_idx" ON "calculation_parameter_history"("parameterId");

-- CreateIndex
CREATE INDEX "calculation_parameter_history_parameterKey_idx" ON "calculation_parameter_history"("parameterKey");

-- CreateIndex
CREATE INDEX "calculation_parameter_history_changedAt_idx" ON "calculation_parameter_history"("changedAt");

-- CreateIndex
CREATE INDEX "iks_assets_name_idx" ON "iks_assets"("name");

-- CreateIndex
CREATE INDEX "notification_templates_triggerEvent_idx" ON "notification_templates"("triggerEvent");

-- AddForeignKey
ALTER TABLE "calculation_parameter_history" ADD CONSTRAINT "calculation_parameter_history_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "calculation_parameters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculation_parameter_history" ADD CONSTRAINT "calculation_parameter_history_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "iks_assets" ADD CONSTRAINT "iks_assets_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
