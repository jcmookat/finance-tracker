import { Metadata } from 'next';
import { auth } from '@/auth';
import { type ReactElement } from 'react';
import { getCurrentMonthAndYear } from '@/lib/utils/dateHelpers';
import { getTransactionsForPeriod } from '@/lib/data/transaction';
import AnnualClient from './annual-client';

export const metadata: Metadata = {
	title: 'Annual Reports',
};

export default async function AnnualPage(): Promise<ReactElement> {
	const session = await auth();
	if (!session) {
		throw new Error('User is not authenticated');
	}
	const userId = session.user.id;
	const { month, year } = getCurrentMonthAndYear();

	// Start and end dates for current year
	const startDate = new Date(year - 1, 0, 1);
	const endDate = new Date(year + 1, 0, 1);

	const transactions = await getTransactionsForPeriod(
		userId,
		startDate,
		endDate,
	);

	return (
		<>
			<AnnualClient
				initialTransactions={transactions}
				initialMonth={month}
				initialYear={year}
			/>
		</>
	);
}
