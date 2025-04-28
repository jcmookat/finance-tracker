'use client';

import { useState } from 'react';
import { MonthYearPicker } from './month-year-picker';
import TransactionsList from './transactions-list';
import EmptyState from '@/components/shared/empty-state';
import { calculateTotalTransactions } from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { TransactionsClientProps, Transaction } from '@/types'; // Adjust import path as needed
import Loading from './loading';

export default function TransactionsClient({
  initialTransactions,
  initialMonth,
  initialYear,
}: TransactionsClientProps) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [isLoading, setIsLoading] = useState(false);

  const monthTotal = calculateTotalTransactions(transactions);

  const handleMonthYearChange = async (newMonth: number, newYear: number) => {
    setIsLoading(true);
    setMonth(newMonth);
    setYear(newYear);

    try {
      const response = await fetch(
        `/api/transactions?month=${newMonth}&year=${newYear}`,
      );
      if (!response.ok) throw new Error('Failed to fetch transactions');

      const newTransactions = await response.json();

      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MonthYearPicker
        initialMonth={month}
        initialYear={year}
        onMonthYearChangeAction={handleMonthYearChange}
      />
      {isLoading ? (
        <Loading />
      ) : transactions.length === 0 ? (
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
  );
}
