import { z } from 'zod';
import {
  insertTransactionSchema,
  updateTransactionSchema,
} from '@/lib/validators/transaction';
// Transaction Types
// export type Transaction = PrismaTransaction;
export type Transaction = z.infer<typeof insertTransactionSchema>;

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
export type UpdateTransaction = z.infer<typeof updateTransactionSchema> & {
  id: string;
};
