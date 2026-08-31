'use server';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { formatError } from '../utils/formatHelpers';
import {
	insertRecurringTransactionSchema,
	updateRecurringTransactionSchema,
} from '@/lib/validators/recurring-transaction';
import {
	InsertRecurringTransaction,
	UpdateRecurringTransaction,
	RecurringTransaction,
} from '@/types/recurring-transaction';
import { getFirstRunDate } from '@/lib/utils/recurrenceHelpers';
import { normalizeToUtcMidnight } from '@/lib/utils/dateHelpers';
import { convertToPlainObject } from '../utils/formatHelpers';
import { Prisma } from '@/lib/generated/prisma';
import { processRecurringTransaction } from '@/lib/cron/generateRecurringTransactions';

function toPlainRecurringTransaction(row: {
	id: string;
	userId: string;
	type: string;
	categoryName: string;
	subcategory: string | null;
	paymentMethod: string | null;
	creditCardType: string | null;
	amount: Prisma.Decimal;
	description: string | null;
	frequency: string;
	dayOfMonth: number;
	endDate: Date | null;
	nextRunDate: Date;
	isActive: boolean;
}): RecurringTransaction {
	return convertToPlainObject({
		...row,
		amount: row.amount.toNumber(),
		subcategory: row.subcategory ?? undefined,
		paymentMethod: row.paymentMethod ?? undefined,
		creditCardType: row.creditCardType ?? undefined,
		description: row.description ?? undefined,
		endDate: row.endDate ?? undefined,
	}) as RecurringTransaction;
}

// Create a recurring transaction template
export async function createRecurringTransaction(
	data: InsertRecurringTransaction,
) {
	const parsed = insertRecurringTransactionSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			message: 'Validation failed',
			errors: parsed.error.format(),
		};
	}

	const { endDate, ...rest } = parsed.data;
	const nextRunDate = normalizeToUtcMidnight(getFirstRunDate(rest.dayOfMonth));

	try {
		const created = await prisma.recurringTransaction.create({
			data: {
				...rest,
				frequency: 'MONTHLY',
				endDate: endDate ?? null,
				nextRunDate,
			},
		});

		// If it's already due (nextRunDate === today), generate the first
		// occurrence immediately instead of waiting for the next cron run.
		const { transactionsGenerated, updatedTemplate } =
			await processRecurringTransaction(created);

		revalidatePath('/recurring');
		if (transactionsGenerated > 0) {
			revalidatePath('/transactions');
			revalidatePath('/monthly');
		}

		return {
			success: true,
			message:
				transactionsGenerated > 0
					? "Recurring transaction created - today's transaction was added"
					: 'Recurring transaction created successfully',
			item: toPlainRecurringTransaction(updatedTemplate),
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update a recurring transaction template - always re-anchors nextRunDate
// to the nearest upcoming occurrence of the (possibly changed) dayOfMonth,
// and reactivates it in case it had auto-paused after passing its old endDate.
export async function updateRecurringTransaction(
	data: UpdateRecurringTransaction,
) {
	const parsed = updateRecurringTransactionSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			message: 'Validation failed',
			errors: parsed.error.format(),
		};
	}

	const { id, endDate, ...rest } = parsed.data;
	const nextRunDate = normalizeToUtcMidnight(getFirstRunDate(rest.dayOfMonth));

	try {
		const exists = await prisma.recurringTransaction.findFirst({
			where: { id },
		});

		if (!exists) throw new Error('Recurring transaction not found');

		const updated = await prisma.recurringTransaction.update({
			where: { id },
			data: {
				...rest,
				endDate: endDate ?? null,
				nextRunDate,
				isActive: true,
			},
		});

		revalidatePath('/recurring');

		return {
			success: true,
			message: 'Recurring transaction updated successfully',
			item: toPlainRecurringTransaction(updated),
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Delete a recurring transaction template
export async function deleteRecurringTransaction(id: string) {
	try {
		const exists = await prisma.recurringTransaction.findFirst({
			where: { id },
		});

		if (!exists) throw new Error('Recurring transaction not found');

		await prisma.recurringTransaction.delete({ where: { id } });

		revalidatePath('/recurring');

		return {
			success: true,
			message: 'Recurring transaction deleted successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Pause or resume a recurring transaction template without deleting it
export async function toggleRecurringTransactionActive(
	id: string,
	isActive: boolean,
) {
	try {
		await prisma.recurringTransaction.update({
			where: { id },
			data: { isActive },
		});

		revalidatePath('/recurring');

		return {
			success: true,
			message: isActive ? 'Resumed' : 'Paused',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
