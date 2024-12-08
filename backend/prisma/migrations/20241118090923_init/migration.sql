-- CreateTable
CREATE TABLE "OTPToken" (
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OTPToken_userId_key" ON "OTPToken"("userId");

-- AddForeignKey
ALTER TABLE "OTPToken" ADD CONSTRAINT "OTPToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
