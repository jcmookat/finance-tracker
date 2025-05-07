import {
  calculateTotal,
  groupTransactionsByDate,
} from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { TransactionsListProps } from '@/types/transaction';

export default function TransactionsList({
  transactions,
}: TransactionsListProps) {
  const groupedTransactionsByDate = groupTransactionsByDate(transactions);
  const sortedDates = Object.keys(groupedTransactionsByDate).sort((a, b) =>
    b.localeCompare(a),
  );
  const renderTransactionGroup = (date: string) => {
    const dayTransactions = groupedTransactionsByDate[date];
    const dayTotal = calculateTotal(dayTransactions, 'ALL');

    const incomes = dayTransactions.filter((tr) => tr.type === 'INCOME');
    const expenses = dayTransactions.filter((tr) => tr.type === 'EXPENSE');
    return (
      <div
        key={date}
        className="rounded-xl drop-shadow-lg bg-muted p-4 pb-10 relative"
      >
        <h3 className="text-sm text-center font-bold mb-2 border-b border-b-black/15 pb-2">
          {new Date(date).toLocaleDateString()}
        </h3>
        {incomes.length > 0 && (
          <div className="mb-2">
            <h4 className="font-semibold text-sm text-green-700">Income</h4>
            <ul>
              {incomes.map((tr) => (
                <li key={tr.id} className="ml-2">
                  {tr.category}: {formatCurrency(Number(tr.amount))}
                </li>
              ))}
            </ul>
          </div>
        )}
        {expenses.length > 0 && (
          <div className="mb-2">
            <h4 className="font-semibold text-sm text-red-700">Expenses</h4>
            <ul>
              {expenses.map((tr) => (
                <li key={tr.id} className="ml-2">
                  {tr.category}: {formatCurrency(Number(tr.amount))}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p
          className={`absolute bottom-0 font-bold rounded-b-xl left-0 pl-4 pb-2 pt-2 pr-4 text-right w-full bg-sidebar-accent-foreground/5 ${dayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {dayTotal >= 0 ? '+' : '-'}
          {formatCurrency(Math.abs(dayTotal))}
        </p>
      </div>
    );
  };

  return <>{sortedDates.map(renderTransactionGroup)}</>;
}
