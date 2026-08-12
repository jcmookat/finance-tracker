-- CreateEnum
CREATE TYPE "RecurringFrequency" AS ENUM ('MONTHLY');

-- CreateTable
CREATE TABLE "RecurringTransaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "categoryName" TEXT NOT NULL,
    "subcategory" TEXT,
    "paymentMethod" TEXT,
    "creditCardType" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "frequency" "RecurringFrequency" NOT NULL DEFAULT 'MONTHLY',
    "dayOfMonth" INTEGER NOT NULL,
    "endDate" TIMESTAMP(6),
    "nextRunDate" TIMESTAMP(6) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecurringTransaction_userId_idx" ON "RecurringTransaction"("userId");

-- AddForeignKey
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
