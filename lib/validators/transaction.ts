import { z } from 'zod';
import { TransactionType } from '../generated/prisma';

// Schema for inserting transaction
export const insertTransactionSchema = z.object({
	userId: z.string().uuid(),
	type: z
		.enum(['INCOME', 'EXPENSE'] as const)
		.or(z.literal(''))
		.refine((val) => val === 'INCOME' || val === 'EXPENSE', {
			message: 'Select a transaction type',
		}) as z.ZodType<TransactionType>,
	category: z.string().min(3, 'Select a category'),
	subcategory: z.string().optional(),
	amount: z.coerce
		.number({
			required_error: 'Amount is required',
			invalid_type_error: 'Amount must be a number',
		})
		.positive('Amount must be positive'),
	description: z.string().optional(),
	transactionDate: z.coerce.date({
		required_error: 'Date is required',
		invalid_type_error: 'Invalid date',
	}),
});

export const transactionWithIdSchema = insertTransactionSchema.extend({
	id: z.string().uuid('ID must be a valid UUID'),
});

//Schema for updating transaction
export const updateTransactionSchema = insertTransactionSchema.extend({
	id: z.string().uuid('ID must be a valid UUID'),
});
