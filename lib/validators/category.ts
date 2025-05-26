import { z } from 'zod';
import { TransactionType } from '../generated/prisma';

// Base schema
const baseCategorySchema = z.object({
	userId: z.string().uuid(),
	name: z.string().min(4, 'Category must be at least 3 characters'),
	type: z
		.enum(['INCOME', 'EXPENSE'] as const)
		.or(z.literal(''))
		.refine((val) => val === 'INCOME' || val === 'EXPENSE', {
			message: 'Select a transaction type',
		}) as z.ZodType<TransactionType>,
	icon: z.string().optional(),
});

export const insertCategorySchema = baseCategorySchema;

export const categoryWithIdSchema = baseCategorySchema.extend({
	id: z.string().uuid('ID must be a valid UUID'),
});

export const updateCategorySchema = categoryWithIdSchema;
