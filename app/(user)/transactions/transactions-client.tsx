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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { updateBudgetPercentages } from '@/lib/actions/user.actions';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const PERCENT_OPTIONS = Array.from({ length: 20 }, (_, i) => i * 5); // 0, 5, ..., 95

interface TransactionsPageClientProps extends TransactionsClientProps {
	initialRewardPercent: number;
	initialSavingsPercent: number;
}

export default function TransactionsClient({
	initialTransactions,
	initialMonth,
	initialYear,
	initialStartDate,
	userCategories,
	initialRewardPercent,
	initialSavingsPercent,
}: TransactionsPageClientProps) {
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

	const taxationTotal = filteredTransactions
		.filter((t) => t.type === 'EXPENSE' && t.categoryName === 'Taxation')
		.reduce((sum, t) => sum + t.amount, 0);
	const netIncome = monthIncome - taxationTotal;

	const [rewardPercent, setRewardPercent] = useState(initialRewardPercent);
	const [savingsPercent, setSavingsPercent] = useState(initialSavingsPercent);
	const budgetPercent = Math.max(0, 100 - rewardPercent - savingsPercent);

	const saveBudgetPercentages = async (reward: number, savings: number) => {
		const result = await updateBudgetPercentages(reward, savings);
		if (!result.success) {
			toast('Failed to save budget percentages', {
				description: result.message,
			});
		}
	};

	const handleRewardChange = (value: string) => {
		const percent = Number(value);
		setRewardPercent(percent);
		saveBudgetPercentages(percent, savingsPercent);
	};

	const handleSavingsChange = (value: string) => {
		const percent = Number(value);
		setSavingsPercent(percent);
		saveBudgetPercentages(rewardPercent, percent);
	};

	const rewardAmount = netIncome * (rewardPercent / 100);
	const budgetAmount = netIncome * (budgetPercent / 100);
	const savingsAmount = netIncome * (savingsPercent / 100);

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
			<div className='flex justify-between mb-2 pt-4 flex-col-reverse md:flex-row gap-4'>
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
					<div className='mb-2 flex gap-4 items-center flex-between flex-col md:flex-row'>
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
					<Card className='mb-6 p-6'>
						<div className='flex flex-col gap-6'>
							<div>
								<p className='text-sm text-muted-foreground'>Net Income</p>
								<p
									className={cn(
										'text-2xl font-bold',
										netIncome >= 0 ? 'text-secondary' : 'text-destructive',
									)}>
									{netIncome >= 0 ? '+' : '-'}
									{formatCurrency(Math.abs(netIncome))}
								</p>
							</div>
							<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
								<div className='flex flex-col gap-2'>
									<div className='flex items-center justify-between gap-2'>
										<span className='text-sm text-muted-foreground'>
											Reward
										</span>
										<Select
											value={String(rewardPercent)}
											onValueChange={handleRewardChange}>
											<SelectTrigger className='h-8 w-[76px]'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{PERCENT_OPTIONS.map((p) => (
													<SelectItem key={p} value={String(p)}>
														{p}%
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<p className='text-lg font-bold text-chart-3'>
										{formatCurrency(Math.abs(rewardAmount))}
									</p>
								</div>
								<div className='flex flex-col gap-2'>
									<div className='flex items-center justify-between gap-2'>
										<span className='text-sm text-muted-foreground'>
											Budget
										</span>
										<div className='flex h-8 w-[76px] items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground'>
											{budgetPercent}%
										</div>
									</div>
									<p className='text-lg font-bold text-chart-4'>
										{formatCurrency(Math.abs(budgetAmount))}
									</p>
								</div>
								<div className='flex flex-col gap-2'>
									<div className='flex items-center justify-between gap-2'>
										<span className='text-sm text-muted-foreground'>
											Savings
										</span>
										<Select
											value={String(savingsPercent)}
											onValueChange={handleSavingsChange}>
											<SelectTrigger className='h-8 w-[76px]'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{PERCENT_OPTIONS.map((p) => (
													<SelectItem key={p} value={String(p)}>
														{p}%
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<p className='text-lg font-bold text-chart-5'>
										{formatCurrency(Math.abs(savingsAmount))}
									</p>
								</div>
							</div>
						</div>
					</Card>
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
