/*
  Warnings:

  - You are about to drop the column `banner` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `Society` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "banner";

-- AlterTable
ALTER TABLE "Society" DROP COLUMN "profilePicture",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePicture";

-- CreateTable
CREATE TABLE "HSLColour" (
    "id" INTEGER NOT NULL,
    "hue" INTEGER NOT NULL,
    "saturation" INTEGER NOT NULL,
    "lightness" INTEGER NOT NULL,

    CONSTRAINT "HSLColour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageColour" (
    "imageURL" TEXT NOT NULL,
    "colourID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Image" (
    "url" TEXT NOT NULL,
    "profilePictureUserId" INTEGER NOT NULL,
    "societyPictureId" INTEGER NOT NULL,
    "eventPictureId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("url")
);

-- CreateIndex
CREATE UNIQUE INDEX "HSLColour_hue_saturation_lightness_key" ON "HSLColour"("hue", "saturation", "lightness");

-- CreateIndex
CREATE UNIQUE INDEX "ImageColour_imageURL_colourID_key" ON "ImageColour"("imageURL", "colourID");

-- CreateIndex
CREATE UNIQUE INDEX "Image_profilePictureUserId_key" ON "Image"("profilePictureUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_societyPictureId_key" ON "Image"("societyPictureId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_eventPictureId_key" ON "Image"("eventPictureId");

-- AddForeignKey
ALTER TABLE "ImageColour" ADD CONSTRAINT "ImageColour_imageURL_fkey" FOREIGN KEY ("imageURL") REFERENCES "Image"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageColour" ADD CONSTRAINT "ImageColour_colourID_fkey" FOREIGN KEY ("colourID") REFERENCES "HSLColour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_profilePictureUserId_fkey" FOREIGN KEY ("profilePictureUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_societyPictureId_fkey" FOREIGN KEY ("societyPictureId") REFERENCES "Society"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_eventPictureId_fkey" FOREIGN KEY ("eventPictureId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
