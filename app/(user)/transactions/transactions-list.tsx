import {
  calculateTotalTransactionsByDay,
  groupTransactionsByDate,
} from '@/lib/utils/transactionHelpers';
import { type Transaction } from '@/lib/generated/prisma';
import { formatCurrency } from '@/lib/utils/formatHelpers';

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const groupedTransactionsByDate = groupTransactionsByDate(transactions);
  const sortedDates = Object.keys(groupedTransactionsByDate).sort((a, b) =>
    b.localeCompare(a),
  );

  const renderTransactionGroup = (date: string) => {
    const dayTransactions = groupedTransactionsByDate[date];
    const dayTotal = calculateTotalTransactionsByDay(dayTransactions);

    return (
      <div key={date} className="mt-6">
        <h3 className="text-lg font-bold">
          {new Date(date).toLocaleDateString()}
        </h3>
        <p
          className={`ml-4 mb-2 ${dayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          Total: {dayTotal >= 0 ? '+' : '-'}
          {formatCurrency(Math.abs(dayTotal))}
        </p>
        <ul>
          {dayTransactions.map((tr) => (
            <li key={tr.id} className="ml-6">
              {tr.category} - {formatCurrency(tr.amount)} ({tr.type})
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return <div>{sortedDates.map(renderTransactionGroup)}</div>;
}
