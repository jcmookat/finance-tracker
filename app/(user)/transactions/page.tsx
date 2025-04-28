import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTransactionsByUserId } from '@/lib/data/transaction';
import { getCurrentMonthAndYear } from '@/lib/utils/dateHelpers';
import { type ReactElement } from 'react';
import { TransactionsList } from './transactions-list';
import { calculateTotalTransactions } from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = {
  title: 'Transactions',
};

export default async function TransactionsPage(): Promise<ReactElement> {
  const session = await auth();
  if (!session) {
    throw new Error('User is not authenticated');
  }
  const userId = session.user.id;
  const { month, year } = getCurrentMonthAndYear();
  const transactions = await getTransactionsByUserId(userId, month, year); // Fetch April 2025

  const monthTotal = calculateTotalTransactions(transactions);
  return (
    <>
      <div>
        {transactions.length === 0 ? (
          <EmptyState
            title="No Transactions Yet"
            subtitle="Start tracking your finances to see them here!"
          />
        ) : (
          <div className="">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {new Date(year, month - 1).toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
              <p
                className={`text-lg ${monthTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                Total: {monthTotal >= 0 ? '+' : '-'}
                {formatCurrency(Math.abs(monthTotal))}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <TransactionsList transactions={transactions} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
