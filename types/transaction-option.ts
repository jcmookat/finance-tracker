import { z } from 'zod';

import {
	insertTransactionOptionSchema,
	transactionOptionWithIdSchema,
	updateTransactionOptionSchema,
} from '@/lib/validators/transaction-option';

export type TransactionOption = z.infer<typeof transactionOptionWithIdSchema>;

export type InsertTransactionOption = z.infer<
	typeof insertTransactionOptionSchema
>;
export type UpdateTransactionOption = z.infer<
	typeof updateTransactionOptionSchema
>;
