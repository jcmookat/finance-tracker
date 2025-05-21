'use client';

import EmptyState from '@/components/empty-state';
import { Transaction } from '@/types/transaction'; // Adjust import path as needed
import ReportsList from './reports-list';

export default function MonthlyClient({
	transactions,
}: {
	transactions: Transaction[];
}) {
	return (
		<div>
			{transactions.length === 0 ? (
				<EmptyState
					title='No Transactions Yet'
					subtitle='Start tracking your finances to see them here!'
				/>
			) : (
				<div>
					<ReportsList transactions={transactions} />
				</div>
			)}
		</div>
	);
}
