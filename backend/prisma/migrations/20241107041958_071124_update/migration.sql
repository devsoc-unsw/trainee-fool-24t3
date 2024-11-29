/*
  Warnings:

  - You are about to drop the column `picture` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `Society` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Society` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Attendee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Society` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ATTENDEE', 'SOCIETY');

-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "picture",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Society" DROP COLUMN "picture",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "salt" TEXT NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL,
    "profilePicture" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_userId_key" ON "Attendee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Society_userId_key" ON "Society"("userId");

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
