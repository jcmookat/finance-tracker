import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTransactionsByUserId } from '@/lib/data/transaction';
import CreateTransactionButtons from '@/components/form/transaction-buttons';
import { type ReactElement } from 'react';
import DashboardClient from './dashboard-client';
import DashboardStats from './dashboard-stats';
import { ChartEntry } from '@/types';
import { calculateTotal } from '@/lib/utils/transactionHelpers';

export const metadata: Metadata = {
	title: 'Dashboard',
};

export default async function ProfilePage(): Promise<ReactElement> {
	const session = await auth();
	if (!session) {
		throw new Error('User is not authenticated');
	}
	const userId = session.user.id;

	const transactions = await getTransactionsByUserId(userId);

	const groupedData: { [date: string]: ChartEntry } = {};
	for (const txn of transactions) {
		const date = new Date(txn.transactionDate).toISOString().slice(0, 10);
		if (!groupedData[date]) {
			groupedData[date] = { date, INCOME: 0, EXPENSE: 0 };
		}

		// Safely assign amount to INCOME or EXPENSE
		if (txn.type === 'INCOME' || txn.type === 'EXPENSE') {
			groupedData[date][txn.type] += txn.amount;
		}
	}

	const chartData: ChartEntry[] = Object.values(groupedData);
	chartData.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	const totalIncome = calculateTotal(transactions, 'INCOME');
	const totalExpense = calculateTotal(transactions, 'EXPENSE');
	const netIncome = totalIncome - totalExpense;

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
					<p className='text-sm text-muted-foreground'>
						Track your income, expenses, and overall balance
					</p>
				</div>
				<CreateTransactionButtons />
			</div>
			<DashboardStats
				totalIncome={totalIncome}
				totalExpense={totalExpense}
				netIncome={netIncome}
			/>
			<DashboardClient chartData={chartData} transactions={transactions} />
		</div>
	);
}
