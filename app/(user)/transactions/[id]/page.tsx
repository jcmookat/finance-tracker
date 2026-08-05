import { type ReactElement } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import TransactionForm from '@/components/form/transaction-form';
import { getTransactionById } from '@/lib/data/transaction';
import { getCategoriesByUserId } from '@/lib/data/category';
import { getTransactionOptionsByUserId } from '@/lib/data/transaction-option';

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
	const userPaymentMethods = await getTransactionOptionsByUserId(
		userId,
		'PAYMENT_METHOD',
	);
	const userCreditCardTypes = await getTransactionOptionsByUserId(
		userId,
		'CREDIT_CARD_TYPE',
	);

	return (
		<div className='pt-4'>
			<TransactionForm
				mode='Update'
				userId={userId}
				transactionId={id}
				transaction={transaction}
				userCategories={userCategories}
				userPaymentMethods={userPaymentMethods}
				userCreditCardTypes={userCreditCardTypes}
			/>
		</div>
	);
}
