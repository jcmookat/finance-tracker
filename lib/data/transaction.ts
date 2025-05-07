import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils/formatHelpers';

// Get transactions by User ID, with optional month/year filtering
export async function getTransactionsByUserId(
  userId: string,
  month?: number, // 1-12
  year?: number, // ex: 2025
) {
  let dateFilter = {};

  if (month && year) {
    const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS, (start of the month)
    const endDate = new Date(year, month, 1); // First day of next month, (end of the month)

    dateFilter = {
      transactionDate: {
        gte: startDate,
        lt: endDate,
      },
    };
  }

  const rawTransactions = await prisma.transaction.findMany({
    where: { userId, ...dateFilter },
    orderBy: { transactionDate: 'desc' }, // most recent first
  });
  const transactions = rawTransactions.map((tr) => ({
    ...tr,
    amount: tr.amount.toNumber(),
    description: tr.description ?? undefined,
  }));
  return convertToPlainObject(transactions);
}

/**
 * Get transactions for a date range (used for prefetching multiple months)
 */
export async function getTransactionsForPeriod(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  const dateFilter = {
    transactionDate: {
      gte: startDate,
      lt: endDate,
    },
  };

  const rawTransactions = await prisma.transaction.findMany({
    where: { userId, ...dateFilter },
    orderBy: { transactionDate: 'desc' }, // most recent first
  });
  const transactions = rawTransactions.map((tr) => ({
    ...tr,
    amount: tr.amount.toNumber(),
    description: tr.description ?? undefined,
  }));
  return convertToPlainObject(transactions);
}

// Get single transaction by transaction Id
export async function getTransactionById(transactionId: string) {
  const rawTransaction = await prisma.transaction.findFirst({
    where: { id: transactionId },
  });
  if (!rawTransaction) throw new Error('Transaction not found');

  // Convert Decimal to number
  const transaction = {
    ...rawTransaction,
    amount: rawTransaction.amount.toNumber(),
    description: rawTransaction.description ?? undefined,
  };

  return convertToPlainObject(transaction);
}
