/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `games` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "games" ADD COLUMN     "backgroundImage" TEXT,
ADD COLUMN     "externalId" INTEGER,
ADD COLUMN     "releaseDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "games_externalId_key" ON "games"("externalId");
