import { type ReactElement } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import TransactionForm from '@/components/form/transaction-form';
import { getTransactionById } from '@/lib/data/transaction';
import { getCategoriesByUserId } from '@/lib/data/category';

export const metadata: Metadata = {
	title: 'Update Transaction',
};

export default async function UpdateTransactionPage(props: {
	params: Promise<{
		id: string;
	}>;
}): Promise<ReactElement> {
	const session = await auth();
	if (!session) throw new Error('User not authenticated');
	const userId = session.user.id;

	const { id } = await props.params;
	const transaction = await getTransactionById(id);

	const userCategories = await getCategoriesByUserId(userId);

	return (
		<div>
			<TransactionForm
				mode='Update'
				userId={userId}
				transactionId={id}
				transaction={transaction}
				userCategories={userCategories}
			/>
		</div>
	);
}
