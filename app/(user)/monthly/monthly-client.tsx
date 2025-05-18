'use client';

import { useState } from 'react';
import MonthYearPicker from '@/components/month-year-picker';
import ReportsList from './montly-list';
import EmptyState from '@/components/empty-state';
import {
	calculateTotal,
	groupTransactionsByMonth,
} from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { TransactionsClientProps, Transaction } from '@/types/transaction'; // Adjust import path as needed
import Loading from '@/components/loading';
import MonthlySummary from './monthly-summary';

export default function MonthlyClient({
	initialTransactions,
	initialMonth,
	initialYear,
	initialStartDate,
}: TransactionsClientProps) {
	const [transactions, setTransactions] =
		useState<Transaction[]>(initialTransactions);
	const [month, setMonth] = useState(initialMonth);
	const [year, setYear] = useState(initialYear);
	const [startDate, setStartDate] = useState(initialStartDate);
	const [isLoading, setIsLoading] = useState(false);

	const filteredTransactions = transactions.filter((t) => {
		const date = new Date(t.transactionDate);
		return date.getMonth() + 1 === month && date.getFullYear() === year;
	});

	const groupedTransactionsByMonth =
		groupTransactionsByMonth(filteredTransactions);

	const monthIncome = calculateTotal(filteredTransactions, 'INCOME');
	const monthExpense = calculateTotal(filteredTransactions, 'EXPENSE');
	const monthTotal = calculateTotal(filteredTransactions, 'ALL');

	const handleMonthYearChange = async (
		selectedMonth: number,
		selectedYear: number,
	) => {
		setIsLoading(true);
		setMonth(selectedMonth);
		setYear(selectedYear);
		setIsLoading(false);

		const dateOfSelectedMonthYear = new Date(selectedYear, selectedMonth);

		const isSelectedMonthPrefetched = transactions.some((t) => {
			const date = new Date(t.transactionDate);
			return (
				date.getMonth() + 1 === selectedMonth &&
				date.getFullYear() === selectedYear
			);
		});

		const isSelectedMonthOlderThanStartDate =
			dateOfSelectedMonthYear < startDate;

		if (!isSelectedMonthPrefetched && isSelectedMonthOlderThanStartDate) {
			try {
				const olderEndDate = new Date(selectedYear, selectedMonth);
				const olderStartDate = new Date(selectedYear - 1, selectedMonth);
				setStartDate(olderStartDate);
				setIsLoading(true);
				const response = await fetch(
					`/api/transactions?startDate=${olderStartDate}&endDate=${olderEndDate}`,
				);
				if (!response.ok) throw new Error('Failed to fetch transactions');

				const olderTransactions = await response.json();

				setTransactions((prev) => [...prev, ...olderTransactions]);
			} catch (error) {
				console.error('Error fetching transactions:', error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div>
			<div className='flex justify-between mb-2 flex-col-reverse md:flex-row gap-4'>
				<MonthYearPicker
					initialMonth={month}
					initialYear={year}
					onMonthYearChangeAction={handleMonthYearChange}
				/>
			</div>

			{isLoading ? (
				<Loading />
			) : filteredTransactions.length === 0 ? (
				<EmptyState
					title='No Transactions Yet'
					subtitle='Start tracking your finances to see them here!'
				/>
			) : (
				<>
					<div className='mb-6 flex gap-4 items-center flex-between flex-col md:flex-row'>
						<h2 className='text-2xl font-bold'>
							{new Date(year, month - 1).toLocaleString('default', {
								month: 'long',
								year: 'numeric',
							})}
						</h2>
						<div className='flex gap-4'>
							<p className='text-lg font-bold text-green-600'>
								Income: +{formatCurrency(Math.abs(monthIncome))}
							</p>
							<p className='text-lg font-bold text-red-600'>
								Expense: -{formatCurrency(Math.abs(monthExpense))}
							</p>
							<p
								className={`text-lg font-bold ${monthTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
								Total: {monthTotal >= 0 ? '+' : '-'}
								{formatCurrency(Math.abs(monthTotal))}
							</p>
						</div>
					</div>
					<div className='mb-4'>
						<MonthlySummary transactions={groupedTransactionsByMonth} />
					</div>
					<div>
						<ReportsList transactions={filteredTransactions} />
					</div>
				</>
			)}
		</div>
	);
}
