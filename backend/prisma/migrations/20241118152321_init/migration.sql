-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ATTENDEE', 'SOCIETY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "salt" TEXT NOT NULL,
    "dateJoined" TIMESTAMP(3) NOT NULL,
    "profilePicture" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Society" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,

    CONSTRAINT "Society_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "banner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL,
    "expiryTime" INTEGER NOT NULL,

    CONSTRAINT "OtpToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttendeeToKeyword" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AttendeeToSociety" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToSociety" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToKeyword" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_userId_key" ON "Attendee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Society_userId_key" ON "Society"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Society_name_key" ON "Society"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Society_discordId_key" ON "Society"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_text_key" ON "Keyword"("text");

-- CreateIndex
CREATE UNIQUE INDEX "OtpToken_userId_key" ON "OtpToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_AttendeeToKeyword_AB_unique" ON "_AttendeeToKeyword"("A", "B");

-- CreateIndex
CREATE INDEX "_AttendeeToKeyword_B_index" ON "_AttendeeToKeyword"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AttendeeToSociety_AB_unique" ON "_AttendeeToSociety"("A", "B");

-- CreateIndex
CREATE INDEX "_AttendeeToSociety_B_index" ON "_AttendeeToSociety"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToSociety_AB_unique" ON "_EventToSociety"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToSociety_B_index" ON "_EventToSociety"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToKeyword_AB_unique" ON "_EventToKeyword"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToKeyword_B_index" ON "_EventToKeyword"("B");

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Society" ADD CONSTRAINT "Society_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpToken" ADD CONSTRAINT "OtpToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttendeeToKeyword" ADD CONSTRAINT "_AttendeeToKeyword_A_fkey" FOREIGN KEY ("A") REFERENCES "Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttendeeToKeyword" ADD CONSTRAINT "_AttendeeToKeyword_B_fkey" FOREIGN KEY ("B") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttendeeToSociety" ADD CONSTRAINT "_AttendeeToSociety_A_fkey" FOREIGN KEY ("A") REFERENCES "Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttendeeToSociety" ADD CONSTRAINT "_AttendeeToSociety_B_fkey" FOREIGN KEY ("B") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToSociety" ADD CONSTRAINT "_EventToSociety_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToSociety" ADD CONSTRAINT "_EventToSociety_B_fkey" FOREIGN KEY ("B") REFERENCES "Society"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToKeyword" ADD CONSTRAINT "_EventToKeyword_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToKeyword" ADD CONSTRAINT "_EventToKeyword_B_fkey" FOREIGN KEY ("B") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;
