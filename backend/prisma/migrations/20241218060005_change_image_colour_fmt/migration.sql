/*
  Warnings:

  - You are about to drop the `ImageColour` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imageColoursID]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageColoursID` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImageColour" DROP CONSTRAINT "ImageColour_colourID_fkey";

-- DropForeignKey
ALTER TABLE "ImageColour" DROP CONSTRAINT "ImageColour_imageURL_fkey";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "imageColoursID" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ImageColour";

-- CreateTable
CREATE TABLE "ImageColours" (
    "colourID" INTEGER NOT NULL,
    "dominantID" INTEGER NOT NULL,
    "secondaryID" INTEGER NOT NULL,
    "tertiaryID" INTEGER NOT NULL,

    CONSTRAINT "ImageColours_pkey" PRIMARY KEY ("colourID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_imageColoursID_key" ON "Image"("imageColoursID");

-- AddForeignKey
ALTER TABLE "ImageColours" ADD CONSTRAINT "ImageColours_dominantID_fkey" FOREIGN KEY ("dominantID") REFERENCES "HSLColour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageColours" ADD CONSTRAINT "ImageColours_secondaryID_fkey" FOREIGN KEY ("secondaryID") REFERENCES "HSLColour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageColours" ADD CONSTRAINT "ImageColours_tertiaryID_fkey" FOREIGN KEY ("tertiaryID") REFERENCES "HSLColour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_imageColoursID_fkey" FOREIGN KEY ("imageColoursID") REFERENCES "ImageColours"("colourID") ON DELETE RESTRICT ON UPDATE CASCADE;
