-- CreateEnum
CREATE TYPE "Status" AS ENUM ('WISHLIST', 'PLAYING', 'COMPLETED', 'DROPPED');

-- DropForeignKey
ALTER TABLE "backlogs" DROP CONSTRAINT "backlogs_gameId_fkey";

-- DropForeignKey
ALTER TABLE "backlogs" DROP CONSTRAINT "backlogs_userId_fkey";

-- AlterTable
ALTER TABLE "backlogs" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'WISHLIST';

-- AddForeignKey
ALTER TABLE "backlogs" ADD CONSTRAINT "backlogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlogs" ADD CONSTRAINT "backlogs_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
