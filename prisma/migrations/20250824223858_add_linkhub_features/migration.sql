/*
  Warnings:

  - A unique constraint covering the columns `[profileId,order]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Link" ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'default';

-- CreateIndex
CREATE UNIQUE INDEX "Link_profileId_order_key" ON "public"."Link"("profileId", "order");
