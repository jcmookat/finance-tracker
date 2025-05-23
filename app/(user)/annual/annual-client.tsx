'use client';

import { useState } from 'react';
import MonthYearPicker from '@/components/month-year-picker';
import AnnualList from './annual-list';
import EmptyState from '@/components/empty-state';
import { calculateTotal } from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { Transaction, TransactionsClientProps } from '@/types/transaction';
import Loading from '@/components/loading';

type Props = Omit<TransactionsClientProps, 'initialStartDate'>;

export default function AnnualClient({
	initialTransactions,
	initialMonth,
	initialYear,
}: Props) {
	const [transactions, setTransactions] =
		useState<Transaction[]>(initialTransactions);
	const [month, setMonth] = useState(initialMonth);
	const [year, setYear] = useState(initialYear);
	const [isLoading, setIsLoading] = useState(false);

	const filteredTransactionsByYear = transactions.filter((t) => {
		const date = new Date(t.transactionDate);
		return date.getFullYear() === year;
	});

	const yearIncome = calculateTotal(filteredTransactionsByYear, 'INCOME');
	const yearExpense = calculateTotal(filteredTransactionsByYear, 'EXPENSE');
	const yearTotal = calculateTotal(filteredTransactionsByYear, 'ALL');

	const handleYearChange = async (
		selectedMonth: number,
		selectedYear: number,
	) => {
		setIsLoading(true);
		setMonth(selectedMonth);
		setYear(selectedYear);

		// Check if any transaction from the selected year is already prefetched
		const isSelectedYearPrefetched = transactions.some((t) => {
			const date = new Date(t.transactionDate);
			return date.getFullYear() === selectedYear;
		});

		if (!isSelectedYearPrefetched) {
			try {
				const startOfYear = new Date(selectedYear - 1, 0, 1); // Jan 1
				const endOfYear = new Date(selectedYear + 1, 0, 1); // Jan 1 next year (exclusive end)

				const response = await fetch(
					`/api/transactions?startDate=${startOfYear.toISOString()}&endDate=${endOfYear.toISOString()}`,
				);

				if (!response.ok) throw new Error('Failed to fetch transactions');

				const yearTransactions = await response.json();
				setTransactions((prev) => [...prev, ...yearTransactions]);
			} catch (error) {
				console.error('Error fetching transactions:', error);
			}
		}

		setIsLoading(false);
	};

	return (
		<>
			<div className='flex justify-between mb-2 flex-col-reverse md:flex-row gap-4'>
				<MonthYearPicker
					initialMonth={month}
					initialYear={year}
					onMonthYearChangeAction={handleYearChange}
					withMonth={false}
				/>
			</div>

			{isLoading ? (
				<Loading />
			) : filteredTransactionsByYear.length === 0 ? (
				<EmptyState
					title='No Transactions Yet'
					subtitle='Start tracking your finances to see them here!'
				/>
			) : (
				<>
					<h2 className='text-2xl font-bold mb-4'>
						{new Date(year, month - 1).toLocaleString('default', {
							year: 'numeric',
						})}
					</h2>
					<div className='mb-4'>
						<AnnualList transactions={filteredTransactionsByYear} />
					</div>

					<div className='mb-6 flex gap-4 items-center flex-between flex-col md:flex-row'>
						<div className='flex gap-4'>
							<p className='text-lg font-bold text-green-600'>
								Income: +{formatCurrency(Math.abs(yearIncome))}
							</p>
							<p className='text-lg font-bold text-red-600'>
								Expense: -{formatCurrency(Math.abs(yearExpense))}
							</p>
							<p
								className={`text-lg font-bold ${yearTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
								Total: {yearTotal >= 0 ? '+' : '-'}
								{formatCurrency(Math.abs(yearTotal))}
							</p>
						</div>
					</div>
				</>
			)}
		</>
	);
}
