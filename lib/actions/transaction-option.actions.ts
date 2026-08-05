'use server';
import {
	insertTransactionOptionSchema,
	updateTransactionOptionSchema,
} from '@/lib/validators/transaction-option';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import {
	TransactionOption,
	InsertTransactionOption,
	UpdateTransactionOption,
} from '@/types/transaction-option';
import { formatError } from '../utils/formatHelpers';

// Create a payment method or credit card type
export async function createTransactionOption(data: InsertTransactionOption) {
	// Validate
	const parsed = insertTransactionOptionSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			message: 'Validation failed',
			errors: parsed.error.format(),
		};
	}

	const optionToCreate = { ...parsed.data };

	try {
		const newOption = await prisma.transactionOption.create({
			data: optionToCreate,
		});

		revalidatePath('/categories');

		return {
			success: true,
			message: 'Saved successfully',
			option: newOption as TransactionOption,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update a payment method or credit card type
export async function updateTransactionOption(data: UpdateTransactionOption) {
	// Validate
	const parsed = updateTransactionOptionSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			message: 'Validation failed',
			errors: parsed.error.format(),
		};
	}

	const option = { ...parsed.data };
	const { id, ...updateOption } = option;

	try {
		const optionExists = await prisma.transactionOption.findFirst({
			where: { id },
		});

		if (!optionExists) throw new Error('Not found');

		await prisma.transactionOption.update({
			where: { id },
			data: updateOption,
		});

		revalidatePath('/categories');

		return {
			success: true,
			message: 'Updated successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
