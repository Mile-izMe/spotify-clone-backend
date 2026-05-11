/*
  Warnings:

  - You are about to drop the column `create_by` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `create_by` on the `playlists` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `playlists` table. All the data in the column will be lost.
  - You are about to drop the column `create_by` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `create_by` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `create_by` on the `songs` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `songs` table. All the data in the column will be lost.
  - You are about to drop the column `create_by` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `update_by` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "create_by",
DROP COLUMN "update_by",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "playlists" DROP COLUMN "create_by",
DROP COLUMN "update_by",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "create_by",
DROP COLUMN "update_by",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "create_by",
DROP COLUMN "update_by",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "songs" DROP COLUMN "create_by",
DROP COLUMN "update_by",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "create_by",
DROP COLUMN "update_by",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;
