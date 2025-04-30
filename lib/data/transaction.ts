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

  const transactions = await prisma.transaction.findMany({
    where: { userId, ...dateFilter },
    orderBy: { transactionDate: 'desc' }, // most recent first
  });
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

  const transactions = await prisma.transaction.findMany({
    where: { userId, ...dateFilter },
    orderBy: { transactionDate: 'desc' }, // most recent first
  });
  return convertToPlainObject(transactions);
}
