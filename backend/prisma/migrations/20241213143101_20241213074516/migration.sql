/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Keyword_text_key" ON "Keyword"("text");
