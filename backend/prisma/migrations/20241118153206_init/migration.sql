/*
  Warnings:

  - Changed the type of `expiryTime` on the `OtpToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OtpToken" DROP COLUMN "expiryTime",
ADD COLUMN     "expiryTime" TIMESTAMP(3) NOT NULL;
