import { z } from 'zod';
import { TransactionOptionKind } from '../generated/prisma';

// Base schema
const baseTransactionOptionSchema = z.object({
	userId: z.string().uuid(),
	kind: z.nativeEnum(TransactionOptionKind),
	name: z.string().min(1, 'Name is required'),
	icon: z.string().optional(),
});

export const insertTransactionOptionSchema = baseTransactionOptionSchema;

export const transactionOptionWithIdSchema = baseTransactionOptionSchema.extend(
	{
		id: z.string().uuid('ID must be a valid UUID'),
	},
);

export const updateTransactionOptionSchema = transactionOptionWithIdSchema;
