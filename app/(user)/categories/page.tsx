import { auth } from '@/auth';
import { Metadata } from 'next';

import { getCategoriesByUserId } from '@/lib/data/category';
import { getTransactionOptionsByUserId } from '@/lib/data/transaction-option';
import { type ReactElement } from 'react';
import CategoriesList from './categories-list';
import TransactionOptionManager from './transaction-option-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
	title: 'Manage',
};

export default async function CategoriesPage(): Promise<ReactElement> {
	const session = await auth();
	if (!session) {
		throw new Error('User is not authenticated');
	}
	const userId = session.user.id;
	const userCategories = await getCategoriesByUserId(userId);
	const paymentMethods = await getTransactionOptionsByUserId(
		userId,
		'PAYMENT_METHOD',
	);
	const creditCardTypes = await getTransactionOptionsByUserId(
		userId,
		'CREDIT_CARD_TYPE',
	);

	return (
		<Tabs defaultValue='categories' className='gap-6 pt-4'>
			<TabsList>
				<TabsTrigger value='categories'>Categories</TabsTrigger>
				<TabsTrigger value='payment-methods'>Payment Methods</TabsTrigger>
				<TabsTrigger value='credit-cards'>Credit Card Types</TabsTrigger>
			</TabsList>
			<TabsContent value='categories'>
				<CategoriesList userId={userId} userCategories={userCategories} />
			</TabsContent>
			<TabsContent value='payment-methods'>
				<TransactionOptionManager
					userId={userId}
					kind='PAYMENT_METHOD'
					title='Payment Method'
					initialOptions={paymentMethods}
				/>
			</TabsContent>
			<TabsContent value='credit-cards'>
				<TransactionOptionManager
					userId={userId}
					kind='CREDIT_CARD_TYPE'
					title='Credit Card Type'
					initialOptions={creditCardTypes}
				/>
			</TabsContent>
		</Tabs>
	);
}
