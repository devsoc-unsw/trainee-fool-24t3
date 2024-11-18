/*
  Warnings:

  - Added the required column `expiryTime` to the `OTPToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OTPToken" ADD COLUMN     "expiryTime" TIMESTAMP(3) NOT NULL;
