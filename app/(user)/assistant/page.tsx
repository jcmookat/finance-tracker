import { Metadata } from 'next';
import { auth } from '@/auth';
import { type ReactElement } from 'react';
import AssistantChat from './assistant-chat';

export const metadata: Metadata = {
	title: 'Ask AI',
};

export default async function AssistantPage(): Promise<ReactElement> {
	const session = await auth();
	if (!session) {
		throw new Error('User is not authenticated');
	}

	return (
		<div className='flex flex-col gap-4 pt-4'>
			<div>
				<h1 className='text-2xl font-bold tracking-tight'>Ask AI</h1>
				<p className='text-sm text-muted-foreground'>
					Ask questions about your income, expenses, and budgets
				</p>
			</div>
			<AssistantChat />
		</div>
	);
}
