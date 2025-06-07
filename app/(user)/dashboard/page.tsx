import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTransactionsByUserId } from '@/lib/data/transaction';
import CreateTransactionButtons from '@/components/form/transaction-buttons';
import { type ReactElement } from 'react';
import DashboardClient from './dashboard-client';
import { ChartEntry } from '@/types';

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

	return (
		<>
			<div className='mb-4'>
				<CreateTransactionButtons />
			</div>
			<div>
				<DashboardClient chartData={chartData} transactions={transactions} />
			</div>
		</>
	);
}
