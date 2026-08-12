import { z } from 'zod';

import {
	insertRecurringTransactionSchema,
	recurringTransactionWithIdSchema,
	updateRecurringTransactionSchema,
} from '@/lib/validators/recurring-transaction';

type RecurringTransactionFormValues = z.infer<
	typeof recurringTransactionWithIdSchema
>;

// Full DB row shape - adds the server-managed scheduling fields that aren't
// part of the create/edit form itself.
export interface RecurringTransaction extends RecurringTransactionFormValues {
	frequency: 'MONTHLY';
	nextRunDate: Date;
	isActive: boolean;
}

export type InsertRecurringTransaction = z.infer<
	typeof insertRecurringTransactionSchema
>;
export type UpdateRecurringTransaction = z.infer<
	typeof updateRecurringTransactionSchema
>;
