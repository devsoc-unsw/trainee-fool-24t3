/*
  Warnings:

  - You are about to drop the `Attendee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AttendeeToKeyword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AttendeeToSociety` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attendee" DROP CONSTRAINT "Attendee_userId_fkey";

-- DropForeignKey
ALTER TABLE "_AttendeeToKeyword" DROP CONSTRAINT "_AttendeeToKeyword_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttendeeToKeyword" DROP CONSTRAINT "_AttendeeToKeyword_B_fkey";

-- DropForeignKey
ALTER TABLE "_AttendeeToSociety" DROP CONSTRAINT "_AttendeeToSociety_A_fkey";

-- DropForeignKey
ALTER TABLE "_AttendeeToSociety" DROP CONSTRAINT "_AttendeeToSociety_B_fkey";

-- DropTable
DROP TABLE "Attendee";

-- DropTable
DROP TABLE "_AttendeeToKeyword";

-- DropTable
DROP TABLE "_AttendeeToSociety";

-- CreateTable
CREATE TABLE "_membertosociety" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_KeywordToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_membertosociety_AB_unique" ON "_membertosociety"("A", "B");

-- CreateIndex
CREATE INDEX "_membertosociety_B_index" ON "_membertosociety"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KeywordToUser_AB_unique" ON "_KeywordToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_KeywordToUser_B_index" ON "_KeywordToUser"("B");

-- AddForeignKey
ALTER TABLE "_membertosociety" ADD CONSTRAINT "_membertosociety_A_fkey" FOREIGN KEY ("A") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_membertosociety" ADD CONSTRAINT "_membertosociety_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToUser" ADD CONSTRAINT "_KeywordToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToUser" ADD CONSTRAINT "_KeywordToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
