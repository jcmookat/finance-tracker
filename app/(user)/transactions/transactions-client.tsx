'use client';

import { useState } from 'react';
import MonthYearPicker from '@/components/month-year-picker';
import TransactionsList from './transactions-list';
import EmptyState from '@/components/empty-state';
import { calculateTotal } from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { TransactionsClientProps, Transaction } from '@/types/transaction';
import Loading from '@/components/loading';
import { normalizeToUtcMidnight } from '@/lib/utils/dateHelpers';
import CreateTransactionButtons from '@/components/form/transaction-buttons';

export default function TransactionsClient({
	initialTransactions,
	initialMonth,
	initialYear,
	initialStartDate,
	userCategories,
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

	const handleDelete = (id: string) => {
		setTransactions((prev) => prev.filter((t) => t.id !== id));
	};

	const handleEdit = (updatedTransaction: Transaction) => {
		setTransactions((prev) =>
			prev.map((t) =>
				t.id === updatedTransaction.id
					? {
							...updatedTransaction,
							transactionDate: normalizeToUtcMidnight(
								new Date(updatedTransaction.transactionDate),
							),
						}
					: t,
			),
		);
	};

	return (
		<div>
			<div className='flex justify-between mb-2 flex-col-reverse md:flex-row gap-4'>
				<MonthYearPicker
					initialMonth={month}
					initialYear={year}
					onMonthYearChangeAction={handleMonthYearChange}
				/>
				<CreateTransactionButtons />
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
						<div className='flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto md:items-center'>
							<p className='font-bold text-right text-muted-foreground'>
								Income:{' '}
								<span className='text-left text-green-700 w-[50%] md:w-auto inline-block md:inline'>
									{formatCurrency(Math.abs(monthIncome))}
								</span>
							</p>
							<p className='font-bold text-right text-muted-foreground'>
								Expense:{' '}
								<span className='text-left text-red-700 w-[50%] md:w-auto inline-block md:inline'>
									{formatCurrency(Math.abs(monthExpense))}
								</span>
							</p>
							<p className='font-bold text-right text-muted-foreground'>
								Total:{' '}
								<span
									className={`text-lg text-left w-[50%] md:w-auto inline-block md:inline ${monthTotal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
									{monthTotal >= 0 ? '+' : '-'}
									{formatCurrency(Math.abs(monthTotal))}
								</span>
							</p>
						</div>
					</div>
					<div className='flex flex-wrap gap-4'>
						<TransactionsList
							transactions={filteredTransactions}
							onDeleteAction={handleDelete}
							onEditAction={handleEdit}
							userCategories={userCategories}
						/>
					</div>
				</>
			)}
		</div>
	);
}
