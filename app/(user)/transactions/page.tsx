import { auth } from '@/auth';
import { getTransactionsByUserId } from '@/lib/data/transaction';
import { type ReactElement } from 'react';

export default async function TransactionsPage(): Promise<ReactElement> {
  const session = await auth();

  if (!session) {
    throw new Error('User is not authenticated');
  }
  const user = session.user;
  const transactions = await getTransactionsByUserId(user.id);

  return (
    <>
      <div>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {transactions.map((tx) => (
              <li key={tx.id}>
                {tx.category} - ${tx.amount.toFixed(2)} ({tx.type})
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
