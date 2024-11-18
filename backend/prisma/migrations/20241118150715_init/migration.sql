-- DropForeignKey
ALTER TABLE "Attendee" DROP CONSTRAINT "Attendee_userId_fkey";

-- DropForeignKey
ALTER TABLE "OtpToken" DROP CONSTRAINT "OtpToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Society" DROP CONSTRAINT "Society_userId_fkey";

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpToken" ADD CONSTRAINT "OtpToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
