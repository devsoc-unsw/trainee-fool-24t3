/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `_EventToSociety` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[societyId,name,startDateTime,endDateTime]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `societyId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EventToKeyword" DROP CONSTRAINT "_EventToKeyword_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToSociety" DROP CONSTRAINT "_EventToSociety_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToSociety" DROP CONSTRAINT "_EventToSociety_B_fkey";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
ADD COLUMN     "numId" SERIAL NOT NULL,
ADD COLUMN     "societyId" INTEGER NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("numId");

-- DropTable
DROP TABLE "_EventToSociety";

-- CreateIndex
CREATE UNIQUE INDEX "Event_societyId_name_startDateTime_endDateTime_key" ON "Event"("societyId", "name", "startDateTime", "endDateTime");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToKeyword" ADD CONSTRAINT "_EventToKeyword_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("numId") ON DELETE CASCADE ON UPDATE CASCADE;
