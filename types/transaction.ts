import { z } from 'zod';
import {
  insertTransactionSchema,
  transactionWithIdSchema,
  updateTransactionSchema,
} from '@/lib/validators/transaction';

export type Transaction = z.infer<typeof transactionWithIdSchema>;

export interface TransactionsListProps {
  transactions: Transaction[];
}

export interface TransactionsClientProps {
  initialTransactions: Transaction[];
  initialMonth: number;
  initialYear: number;
  initialStartDate: Date;
}

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type TransactionWithId = z.infer<typeof transactionWithIdSchema>;
