import {
  calculateTotalTransactions,
  groupTransactionsByDate,
} from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { Transactions } from '@/types';

export function TransactionsList({ transactions }: Transactions) {
  const groupedTransactionsByDate = groupTransactionsByDate(transactions);
  console.log(groupedTransactionsByDate);
  const sortedDates = Object.keys(groupedTransactionsByDate).sort((a, b) =>
    b.localeCompare(a),
  );

  const renderTransactionGroup = (date: string) => {
    const dayTransactions = groupedTransactionsByDate[date];
    const dayTotal = calculateTotalTransactions(dayTransactions);
    const monthTotal = calculateTotalTransactions(transactions);

    console.log(monthTotal);

    const incomes = dayTransactions.filter((tr) => tr.type === 'INCOME');
    const expenses = dayTransactions.filter((tr) => tr.type === 'EXPENSE');

    return (
      <div key={date} className="rounded-2xl bg-muted p-4">
        <h3 className="text-sm text-center mb-2 border-b border-b-black/25 pb-2">
          {new Date(date).toLocaleDateString()}
        </h3>
        {incomes.length > 0 && (
          <div className="mb-2">
            <h4 className="font-semibold text-green-700">Income</h4>
            <ul>
              {incomes.map((tr) => (
                <li key={tr.id} className="ml-2">
                  {tr.category}: +{formatCurrency(tr.amount)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {expenses.length > 0 && (
          <div className="mb-2">
            <h4 className="font-semibold text-red-700">Expenses</h4>
            <ul>
              {expenses.map((tr) => (
                <li key={tr.id} className="ml-2">
                  {tr.category}: -{formatCurrency(tr.amount)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className={`${dayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          Total: {dayTotal >= 0 ? '+' : '-'}
          {formatCurrency(Math.abs(dayTotal))}
        </p>
      </div>
    );
  };

  return <>{sortedDates.map(renderTransactionGroup)}</>;
}
