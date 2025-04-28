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
    const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS
    const endDate = new Date(year, month, 1); // First day of next month

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
