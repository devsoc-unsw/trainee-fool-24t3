-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_societyId_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;
