import { prisma } from '@/db/prisma';

// Get transactions by User ID
export async function getTransactionsByUserId(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { transactionDate: 'desc' }, // most recent first
  });

  return transactions;
}
