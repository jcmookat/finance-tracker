import { z } from 'zod';

// Schema for inserting transaction
export const insertTransactionSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['INCOME', 'EXPENSE']), // matches TransactionType enum
  category: z.string().min(3, 'Category must be at least 3 characters'),
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
