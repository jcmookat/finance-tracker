import { Metadata } from 'next';
import { auth } from '@/auth';
import { type ReactElement } from 'react';
import RecurringList from './recurring-list';
import { getRecurringTransactionsByUserId } from '@/lib/data/recurring-transaction';
import { getCategoriesByUserId } from '@/lib/data/category';
import { getTransactionOptionsByUserId } from '@/lib/data/transaction-option';

export const metadata: Metadata = {
	title: 'Recurring',
};

export default async function RecurringPage(): Promise<ReactElement> {
	const session = await auth();
	if (!session) {
		throw new Error('User is not authenticated');
	}
	const userId = session.user.id;

	const items = await getRecurringTransactionsByUserId(userId);
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
			<RecurringList
				userId={userId}
				initialItems={items}
				userCategories={userCategories}
				userPaymentMethods={userPaymentMethods}
				userCreditCardTypes={userCreditCardTypes}
			/>
		</div>
	);
}
