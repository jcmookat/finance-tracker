import { Metadata } from 'next';
import { auth } from '@/auth';
import { type ReactElement } from 'react';
import { getCurrentMonthAndYear } from '@/lib/utils/dateHelpers';
import { getTransactionsForPeriod } from '@/lib/data/transaction';
import MonthlySummary from './monthly-client';

export const metadata: Metadata = {
	title: 'Monthly Reports',
};

export default async function ReportsPage(): Promise<ReactElement> {
	const session = await auth();
	if (!session) {
		throw new Error('User is not authenticated');
	}
	const userId = session.user.id;
	const { month, year } = getCurrentMonthAndYear();

	// Calculate start and end dates for a 1-year period
	const startDate = new Date(year, month - 13, 1); // Current month and 12 months before
	const endDate = new Date(year, month, 1); // First day of next month

	const transactions = await getTransactionsForPeriod(
		userId,
		startDate,
		endDate,
	);

	return (
		<>
			<MonthlySummary
				initialTransactions={transactions}
				initialMonth={month}
				initialYear={year}
				initialStartDate={startDate}
			/>
		</>
	);
}
