import { type ReactElement } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import TransactionForm from '@/components/user/transaction-form';

export const metadata: Metadata = {
  title: 'Create Transaction',
};

export default async function CreateTransactionPage(): Promise<ReactElement> {
  const session = await auth();
  if (!session) throw new Error('User not authenticated');
  const userId = session.user.id;
  return (
    <div>
      <TransactionForm mode="Create" userId={userId} />
    </div>
  );
}
