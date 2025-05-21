import { Metadata } from 'next';
import { auth } from '@/auth';
import { type ReactElement } from 'react';
import { getTransactionsByUserId } from '@/lib/data/transaction';
import ReportsClient from './reports-client';

export const metadata: Metadata = {
  title: 'Reports',
};

export default async function AnnualPage(): Promise<ReactElement> {
  const session = await auth();
  if (!session) {
    throw new Error('User is not authenticated');
  }
  const userId = session.user.id;

  const transactions = await getTransactionsByUserId(userId);

  return (
    <>
      <ReportsClient transactions={transactions} />
    </>
  );
}
