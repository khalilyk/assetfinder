-- AlterTable
ALTER TABLE "admin_users"
  ADD COLUMN "title" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "linkedinUrl" TEXT,
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "cardSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_cardSlug_key" ON "admin_users"("cardSlug");
