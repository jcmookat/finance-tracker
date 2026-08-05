'use client';

import { useState } from 'react';
import MonthYearPicker from '@/components/month-year-picker';
import EmptyState from '@/components/empty-state';
import {
	calculateTotal,
	groupTransactionsByMonth,
} from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { TransactionsClientProps, Transaction } from '@/types/transaction'; // Adjust import path as needed
import { TransactionOption } from '@/types/transaction-option';
import Loading from '@/components/loading';
import MonthlySummary from './monthly-summary';
import MonthlyList from './montly-list';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideRefreshCcw } from 'lucide-react';

interface MonthlyClientProps extends TransactionsClientProps {
	userPaymentMethods: TransactionOption[];
	userCreditCardTypes: TransactionOption[];
}

export default function MonthlyClient({
	initialTransactions,
	initialMonth,
	initialYear,
	initialStartDate,
	userPaymentMethods,
	userCreditCardTypes,
}: MonthlyClientProps) {
	const [transactions, setTransactions] =
		useState<Transaction[]>(initialTransactions);
	const [month, setMonth] = useState(initialMonth);
	const [year, setYear] = useState(initialYear);
	const [startDate, setStartDate] = useState(initialStartDate);
	const [isLoading, setIsLoading] = useState(false);

	const ALL = 'ALL';

	const [selectedCategory, setSelectedCategory] = useState<string>(ALL);
	const [selectedSubcategory, setSelectedSubcategory] = useState<string>(ALL);
	const [selectedPaymentMethod, setSelectedPaymentMethod] =
		useState<string>(ALL);
	const [selectedCreditCardType, setSelectedCreditCardType] =
		useState<string>(ALL);

	const filteredTransactions = transactions.filter((t) => {
		const date = new Date(t.transactionDate);
		const matchesMonthYear =
			date.getMonth() + 1 === month && date.getFullYear() === year;

		const matchesCategory =
			selectedCategory === ALL || t.categoryName === selectedCategory;

		const matchesSubcategory =
			selectedSubcategory === ALL || t.subcategory === selectedSubcategory;

		const matchesPaymentMethod =
			selectedPaymentMethod === ALL ||
			t.paymentMethod === selectedPaymentMethod;

		const matchesCreditCardType =
			selectedCreditCardType === ALL ||
			t.creditCardType === selectedCreditCardType;

		return (
			matchesMonthYear &&
			matchesCategory &&
			matchesSubcategory &&
			matchesPaymentMethod &&
			matchesCreditCardType
		);
	});

	const uniqueCategories = Array.from(
		new Set(
			transactions.map((t) => t.categoryName).filter((s): s is string => !!s),
		),
	);
	const uniqueSubcategories = Array.from(
		new Set(
			transactions.map((t) => t.subcategory).filter((s): s is string => !!s),
		),
	);
	const uniquePaymentMethods = Array.from(
		new Set(
			transactions.map((t) => t.paymentMethod).filter((s): s is string => !!s),
		),
	);
	const uniqueCreditCardTypes = Array.from(
		new Set(
			transactions.map((t) => t.creditCardType).filter((s): s is string => !!s),
		),
	);

	const groupedTransactionsByMonth =
		groupTransactionsByMonth(filteredTransactions);

	const monthIncome = calculateTotal(filteredTransactions, 'INCOME');
	const monthExpense = calculateTotal(filteredTransactions, 'EXPENSE');
	const monthTotal = calculateTotal(filteredTransactions, ALL);

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

	const handleEdit = (updatedTransaction: Transaction) => {
		setTransactions((prev) =>
			prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)),
		);
	};

	const resetFilter = () => {
		setSelectedCategory(ALL);
		setSelectedSubcategory(ALL);
		setSelectedPaymentMethod(ALL);
		setSelectedCreditCardType(ALL);
	};

	return (
		<div>
			<div className='flex mb-2 pt-4 flex-col md:flex-wrap md:flex-row gap-4'>
				<MonthYearPicker
					initialMonth={month}
					initialYear={year}
					onMonthYearChangeAction={handleMonthYearChange}
				/>
				<div className='flex flex-wrap gap-4 mb-4'>
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className='w-[calc(50%-8px)] md:w-auto'>
							<SelectValue placeholder='Filter by Category' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>All Categories</SelectItem>
							{uniqueCategories.map((val) => (
								<SelectItem key={val} value={val}>
									{val}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={selectedSubcategory}
						onValueChange={setSelectedSubcategory}>
						<SelectTrigger className='w-[calc(50%-8px)] md:w-auto'>
							<SelectValue placeholder='Subcategory' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>All Subcategories</SelectItem>
							{uniqueSubcategories.map((val) => (
								<SelectItem key={val} value={val}>
									{val}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={selectedPaymentMethod}
						onValueChange={setSelectedPaymentMethod}>
						<SelectTrigger className='w-[calc(50%-8px)] md:w-auto'>
							<SelectValue placeholder='Payment Method' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>All Payment Methods</SelectItem>
							{uniquePaymentMethods.map((val) => (
								<SelectItem key={val} value={val}>
									{val}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={selectedCreditCardType}
						onValueChange={setSelectedCreditCardType}>
						<SelectTrigger className='w-[calc(50%-8px)] md:w-auto'>
							<SelectValue placeholder='Credit Card Type' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>All Credit Card Types</SelectItem>
							{uniqueCreditCardTypes.map((val) => (
								<SelectItem key={val} value={val}>
									{val}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						variant='outline'
						size='icon'
						onClick={resetFilter}
						disabled={
							selectedCategory === ALL &&
							selectedSubcategory === ALL &&
							selectedPaymentMethod === ALL &&
							selectedCreditCardType === ALL
						}>
						<LucideRefreshCcw />
					</Button>
				</div>
			</div>

			{isLoading ? (
				<Loading />
			) : filteredTransactions.length === 0 ? (
				<Card>
					<EmptyState
						title='No Transactions Yet'
						subtitle='Start tracking your finances to see them here!'
					/>
				</Card>
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
								<span className='text-left text-green-700 w-[calc(50%-8px)] md:w-auto inline-block md:inline'>
									{formatCurrency(Math.abs(monthIncome))}
								</span>
							</p>
							<p className='font-bold text-right text-muted-foreground'>
								Expense:{' '}
								<span className='text-left text-red-700 w-[calc(50%-8px)] md:w-auto inline-block md:inline'>
									{formatCurrency(Math.abs(monthExpense))}
								</span>
							</p>
							<p className='font-bold text-right text-muted-foreground'>
								Total:{' '}
								<span
									className={`text-lg text-left w-[calc(50%-8px)] md:w-auto inline-block md:inline ${monthTotal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
									{monthTotal >= 0 ? '+' : '-'}
									{formatCurrency(Math.abs(monthTotal))}
								</span>
							</p>
						</div>
					</div>
					<div className='mb-4'>
						<Card className='gap-4'>
							<MonthlyList
							transactions={filteredTransactions}
							userPaymentMethods={userPaymentMethods}
							userCreditCardTypes={userCreditCardTypes}
							onEditAction={handleEdit}
						/>
						</Card>
					</div>
					<div>
						<MonthlySummary transactions={groupedTransactionsByMonth} />
					</div>
				</>
			)}
		</div>
	);
}
