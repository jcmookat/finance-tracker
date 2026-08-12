import { z } from 'zod';
import { TransactionType } from '../generated/prisma';

const baseRecurringTransactionSchema = z.object({
	userId: z.string().uuid(),
	type: z
		.enum(['INCOME', 'EXPENSE'] as const)
		.or(z.literal(''))
		.refine((val) => val === 'INCOME' || val === 'EXPENSE', {
			message: 'Select a transaction type',
		}) as z.ZodType<TransactionType>,
	categoryName: z.string().min(3, 'Select a category'),
	subcategory: z.string().optional(),
	paymentMethod: z.string().optional().nullable(),
	creditCardType: z.string().optional().nullable(),
	amount: z.coerce
		.number({
			required_error: 'Amount is required',
			invalid_type_error: 'Amount must be a number',
		})
		.positive('Amount must be positive'),
	description: z.string().optional(),
	dayOfMonth: z.coerce
		.number({ required_error: 'Day of month is required' })
		.int()
		.min(1, 'Must be between 1 and 31')
		.max(31, 'Must be between 1 and 31'),
	endDate: z.coerce.date().optional().nullable(),
});

function requireCreditCardType(
	data: z.infer<typeof baseRecurringTransactionSchema>,
	ctx: z.RefinementCtx,
) {
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
}

export const insertRecurringTransactionSchema =
	baseRecurringTransactionSchema.superRefine(requireCreditCardType);

export const recurringTransactionWithIdSchema = baseRecurringTransactionSchema
	.extend({
		id: z.string().uuid('ID must be a valid UUID'),
	})
	.superRefine(requireCreditCardType);

export const updateRecurringTransactionSchema = recurringTransactionWithIdSchema;
