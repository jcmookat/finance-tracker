'use server';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils/formatHelpers';
import {
	insertTransactionSchema,
	updateTransactionSchema,
} from '../validators/transaction';
import { revalidatePath } from 'next/cache';
import { InsertTransaction, UpdateTransaction } from '@/types/transaction';
import { normalizeToUtcMidnight } from '../utils/dateHelpers';

// Create transaction
export async function createTransaction(data: InsertTransaction) {
	// Validate
	const parsed = insertTransactionSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			message: 'Validation failed',
			errors: parsed.error.format(),
		};
	}

	const transaction = { ...parsed.data };

	if (transaction.transactionDate) {
		transaction.transactionDate = normalizeToUtcMidnight(
			new Date(transaction.transactionDate),
		);
	}

	try {
		// Create transaction
		await prisma.transaction.create({ data: transaction });

		revalidatePath('/transactions');

		return {
			success: true,
			message: 'Transaction created successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update transaction
export async function updateTransaction(data: UpdateTransaction) {
	// Validate
	const parsed = updateTransactionSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			message: 'Validation failed',
			errors: parsed.error.format(),
		};
	}

	const transaction = { ...parsed.data };
	const { id, ...updateTransaction } = transaction;

	if (updateTransaction.transactionDate) {
		updateTransaction.transactionDate = normalizeToUtcMidnight(
			new Date(updateTransaction.transactionDate),
		);
	}

	try {
		// Validate and find transaction
		const transactionExists = await prisma.transaction.findFirst({
			where: { id },
		});

		if (!transactionExists) throw new Error('Transaction not found');

		// Update transaction
		await prisma.transaction.update({
			where: { id },
			data: updateTransaction,
		});

		revalidatePath('/transactions');

		return {
			success: true,
			message: 'Transaction updated successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Delete transaction
export async function deleteTransaction(id: string) {
	try {
		const transactionExists = await prisma.transaction.findFirst({
			where: { id },
		});

		if (!transactionExists) throw new Error('Transaction not found');

		await prisma.transaction.delete({ where: { id } });

		revalidatePath('/transactions');

		return {
			success: true,
			message: 'Transaction deleted successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
