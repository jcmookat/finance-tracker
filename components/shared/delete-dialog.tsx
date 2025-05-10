'use client';

import { useState, useTransition, type ReactElement } from 'react';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function DeleteDialog({
	id,
	action,
}: {
	id: string;
	action: (id: string) => Promise<{ success: boolean; message: string }>;
}): ReactElement {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	// Handle delete order button click
	const handleDeleteClick = () => {
		startTransition(async () => {
			const res = await action(id);
			if (!res.success) {
				toast('', {
					description: res.message,
				});
			} else {
				setOpen(false);
				toast('', {
					description: res.message,
				});
			}
		});
	};
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button size='sm' variant='destructive' className='ml-2'>
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant='destructive'
						size='sm'
						disabled={isPending}
						onClick={handleDeleteClick}>
						{isPending ? 'Deleting' : 'Delete'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
