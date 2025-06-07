import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils/formatHelpers';

// Get transactions by User ID
export async function getTransactionsByUserId(userId: string) {
	const rawTransactions = await prisma.transaction.findMany({
		where: { userId },
		orderBy: { transactionDate: 'desc' }, // most recent first
	});
	const transactions = rawTransactions.map((tr) => ({
		...tr,
		amount: tr.amount.toNumber(),
		description: tr.description ?? undefined,
		subcategory: tr.subcategory ?? undefined,
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
		subcategory: tr.subcategory ?? undefined,
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
		subcategory: rawTransaction.subcategory ?? undefined,
	};

	return convertToPlainObject(transaction);
}

export async function getLatestTransactionsByUserId(userId: string) {
	const rawTransactions = await prisma.transaction.findMany({
		where: { userId },
		orderBy: { transactionDate: 'desc' }, // most recent first
		take: 6,
	});
	const transactions = rawTransactions.map((tr) => ({
		...tr,
		amount: tr.amount.toNumber(),
		description: tr.description ?? undefined,
		subcategory: tr.subcategory ?? undefined,
	}));
	return convertToPlainObject(transactions);
}
