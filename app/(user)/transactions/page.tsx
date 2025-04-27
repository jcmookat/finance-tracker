import { auth } from '@/auth';
import { getTransactionsByUserId } from '@/lib/data/transaction';
import { getCurrentMonthAndYear } from '@/lib/utils';
import { type ReactElement } from 'react';

export default async function TransactionsPage(): Promise<ReactElement> {
  const session = await auth();

  if (!session) {
    throw new Error('User is not authenticated');
  }
  const userId = session.user.id;

  const { month, year } = getCurrentMonthAndYear();
  const transactions = await getTransactionsByUserId(userId, month, year); // Fetch April 2025

  return (
    <>
      <div>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {transactions.map((tr) => (
              <li key={tr.id}>
                {tr.category} - ${tr.amount.toFixed(2)} ({tr.type})
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
