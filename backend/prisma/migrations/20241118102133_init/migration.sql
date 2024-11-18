/*
  Warnings:

  - Changed the type of `token` on the `OtpToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OtpToken" DROP COLUMN "token",
ADD COLUMN     "token" INTEGER NOT NULL;
