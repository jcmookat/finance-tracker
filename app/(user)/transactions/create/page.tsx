import { type ReactElement } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import TransactionForm from '@/components/form/transaction-form';
import { getCategoriesByUserId } from '@/lib/data/category';

export const metadata: Metadata = {
	title: 'Create Transaction',
};

export default async function CreateTransactionPage(): Promise<ReactElement> {
	const session = await auth();
	if (!session) throw new Error('User not authenticated');
	const userId = session.user.id;

	const userCategories = await getCategoriesByUserId(userId);

	return (
		<div>
			<TransactionForm
				mode='Create'
				userId={userId}
				userCategories={userCategories}
			/>
		</div>
	);
}
