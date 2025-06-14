'use client';

import { useState } from 'react';
import MonthYearPicker from '@/components/month-year-picker';
import AnnualList from './annual-list';
import EmptyState from '@/components/empty-state';
import { calculateTotal } from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { Transaction, TransactionsClientProps } from '@/types/transaction';
import Loading from '@/components/loading';

type Props = Omit<
	TransactionsClientProps,
	'initialStartDate' | 'userCategories'
>;

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
					<div className='mb-6 flex gap-4 items-center flex-between flex-col md:flex-row'>
						<h2 className='text-2xl font-bold'>
							{new Date(year, month - 1).toLocaleString('default', {
								year: 'numeric',
							})}
						</h2>
						<div className='flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto md:items-center'>
							<p className='font-bold text-right text-muted-foreground'>
								Income:{' '}
								<span className='text-left text-green-700 w-[50%] md:w-auto inline-block md:inline'>
									{formatCurrency(Math.abs(yearIncome))}
								</span>
							</p>
							<p className='font-bold text-right text-muted-foreground'>
								Expense:{' '}
								<span className='text-left text-red-700 w-[50%] md:w-auto inline-block md:inline'>
									{formatCurrency(Math.abs(yearExpense))}
								</span>
							</p>
							<p className='font-bold text-right text-muted-foreground'>
								Total:{' '}
								<span
									className={`text-lg text-left w-[50%] md:w-auto inline-block md:inline ${yearTotal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
									{yearTotal >= 0 ? '+' : '-'}
									{formatCurrency(Math.abs(yearTotal))}
								</span>
							</p>
						</div>
					</div>
					<div className='mb-4'>
						<AnnualList transactions={filteredTransactionsByYear} />
					</div>
				</>
			)}
		</>
	);
}
