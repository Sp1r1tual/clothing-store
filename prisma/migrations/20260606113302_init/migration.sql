-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Customer', 'Admin');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(32),
    "email" VARCHAR(255),
    "avatar_url" TEXT,
    "phone" VARCHAR(20),
    "role" "UserRole" NOT NULL DEFAULT 'Customer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profiles_created_at_idx" ON "profiles"("created_at");

-- CreateIndex
CREATE INDEX "profiles_role_idx" ON "profiles"("role");
