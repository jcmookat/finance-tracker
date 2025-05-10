'use client';

import React, { Dispatch, SetStateAction, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function DeleteForm({
	transactionId,
	setIsOpenAction,
	action,
	onDeleteAction,
}: {
	transactionId: string;
	setIsOpenAction: Dispatch<SetStateAction<boolean>>;
	action: (id: string) => Promise<{ success: boolean; message: string }>;
	onDeleteAction: (id: string) => void;
}) {
	const [isPending, startTransition] = useTransition();

	const handleDeleteClick = () => {
		startTransition(async () => {
			const res = await action(transactionId);
			if (!res.success) {
				toast('', {
					description: res.message,
				});
			} else {
				setIsOpenAction(false);
				toast('', {
					description: res.message,
				});
				onDeleteAction(transactionId);
			}
		});
	};

	return (
		<div className='w-full flex justify-center sm:space-x-6'>
			<Button
				size='lg'
				variant='outline'
				disabled={isPending}
				className='hidden sm:block'
				type='button'
				onClick={() => setIsOpenAction(false)}>
				Cancel
			</Button>
			<Button
				size='lg'
				type='submit'
				disabled={isPending}
				className=' bg-red-500 hover:bg-red-400'
				onClick={handleDeleteClick}>
				{isPending ? (
					<>
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						Deleting
					</>
				) : (
					<span>Delete</span>
				)}
			</Button>
		</div>
	);
}
