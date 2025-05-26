/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_categoryId_fkey";

-- DropIndex
DROP INDEX "Category_id_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "categoryId",
ADD COLUMN     "categoryName" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("name") ON DELETE CASCADE ON UPDATE CASCADE;
