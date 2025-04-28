import { Metadata } from 'next';
import { auth } from '@/auth';
import { type ReactElement } from 'react';
import TransactionsClient from './transactions-client';
import { getCurrentMonthAndYear } from '@/lib/utils/dateHelpers';
import { getTransactionsByUserId } from '@/lib/data/transaction';

export const metadata: Metadata = {
  title: 'Transactions',
};

export default async function TransactionsPage(): Promise<ReactElement> {
  const session = await auth();
  if (!session) {
    throw new Error('User is not authenticated');
  }
  const userId = session.user.id;
  const { month, year } = getCurrentMonthAndYear();
  const transactions = await getTransactionsByUserId(userId, month, year);
  return (
    <>
      <TransactionsClient
        initialTransactions={transactions}
        initialMonth={month}
        initialYear={year}
      />
    </>
  );
}
