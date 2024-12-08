/*
  Warnings:

  - You are about to drop the `OtpToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OtpToken" DROP CONSTRAINT "OtpToken_userId_fkey";

-- DropTable
DROP TABLE "OtpToken";
