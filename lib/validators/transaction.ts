import { z } from 'zod';
import { TransactionType } from '../generated/prisma';

// Base schema
const baseTransactionSchema = z.object({
	userId: z.string().uuid(),
	type: z
		.enum(['INCOME', 'EXPENSE'] as const)
		.or(z.literal(''))
		.refine((val) => val === 'INCOME' || val === 'EXPENSE', {
			message: 'Select a transaction type',
		}) as z.ZodType<TransactionType>,
	paymentMethod: z.enum(['Cash', 'Credit Card']).optional(),
	creditCardType: z.enum(['VPASS', 'UCS', 'RAKUTEN']).optional().nullable(),
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

// Schema for inserting transaction with validation logic
export const insertTransactionSchema = baseTransactionSchema.superRefine(
	(data, ctx) => {
		if (
			data.type === 'EXPENSE' &&
			data.paymentMethod === 'Credit Card' &&
			!data.creditCardType
		) {
			ctx.addIssue({
				path: ['creditCardType'],
				code: z.ZodIssueCode.custom,
				message:
					'Credit card type is required when payment method is Credit Card',
			});
		}
	},
);

// Extend safely **before** calling `.superRefine()`
export const transactionWithIdSchema = baseTransactionSchema
	.extend({
		id: z.string().uuid('ID must be a valid UUID'),
	})
	.superRefine((data, ctx) => {
		if (
			data.type === 'EXPENSE' &&
			data.paymentMethod === 'Credit Card' &&
			!data.creditCardType
		) {
			ctx.addIssue({
				path: ['creditCardType'],
				code: z.ZodIssueCode.custom,
				message:
					'Credit card type is required when payment method is Credit Card',
			});
		}
	});

//Schema for updating transaction
export const updateTransactionSchema = transactionWithIdSchema;
