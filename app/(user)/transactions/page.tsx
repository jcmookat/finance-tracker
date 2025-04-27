import { auth } from '@/auth';
import { getTransactionsByUserId } from '@/lib/data/transaction';
import { getCurrentMonthAndYear, groupTransactionsByDate } from '@/lib/utils';
import { type ReactElement } from 'react';

export default async function TransactionsPage(): Promise<ReactElement> {
  const session = await auth();

  if (!session) {
    throw new Error('User is not authenticated');
  }
  const userId = session.user.id;

  const { month, year } = getCurrentMonthAndYear();
  const transactions = await getTransactionsByUserId(userId, month, year); // Fetch April 2025

  const groupedTransactions = groupTransactionsByDate(transactions);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) =>
    b.localeCompare(a),
  );

  return (
    <>
      <div>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div>
            {sortedDates.map((date) => (
              <div key={date}>
                <h3 className="text-lg font-bold mt-6">
                  {new Date(date).toLocaleDateString()}
                </h3>
                <ul>
                  {groupedTransactions[date].map((tr) => (
                    <li key={tr.id} className="ml-4">
                      {tr.category} - ${tr.amount.toFixed(2)} ({tr.type})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
