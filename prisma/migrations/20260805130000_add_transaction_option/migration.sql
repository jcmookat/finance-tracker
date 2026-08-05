-- CreateEnum
CREATE TYPE "TransactionOptionKind" AS ENUM ('PAYMENT_METHOD', 'CREDIT_CARD_TYPE');

-- CreateTable
CREATE TABLE "TransactionOption" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "kind" "TransactionOptionKind" NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionOption_userId_kind_name_key" ON "TransactionOption"("userId", "kind", "name");

-- AddForeignKey
ALTER TABLE "TransactionOption" ADD CONSTRAINT "TransactionOption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed existing users with today's hardcoded payment method / credit card
-- type options, so their dropdowns aren't empty once the form switches from
-- the old static lib/constants arrays to this table.
INSERT INTO "TransactionOption" ("id", "userId", "kind", "name", "icon", "updatedAt")
SELECT gen_random_uuid(), "id", 'PAYMENT_METHOD', v.name, v.icon, CURRENT_TIMESTAMP
FROM "User"
CROSS JOIN (
    VALUES
        ('Cash', 'Banknote'),
        ('Credit Card', 'CreditCard'),
        ('Points', 'TicketCheck'),
        ('Salary Deduction', 'Briefcase')
) AS v(name, icon);

INSERT INTO "TransactionOption" ("id", "userId", "kind", "name", "icon", "updatedAt")
SELECT gen_random_uuid(), "id", 'CREDIT_CARD_TYPE', v.name, v.icon, CURRENT_TIMESTAMP
FROM "User"
CROSS JOIN (
    VALUES
        ('VPASS', 'CreditCard'),
        ('UCS', 'CreditCard'),
        ('RAKUTEN', 'CreditCard'),
        ('PAYPAY', 'CreditCard')
) AS v(name, icon);
