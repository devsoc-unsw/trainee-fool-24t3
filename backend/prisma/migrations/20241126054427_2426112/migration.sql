-- DropIndex
DROP INDEX "Society_userId_key";

-- AlterTable
ALTER TABLE "Society" ADD COLUMN     "profilePicture" TEXT,
ALTER COLUMN "discordId" DROP NOT NULL;
