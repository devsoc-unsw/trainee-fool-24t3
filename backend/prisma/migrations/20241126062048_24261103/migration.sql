-- DropForeignKey
ALTER TABLE "Society" DROP CONSTRAINT "Society_userId_fkey";

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
