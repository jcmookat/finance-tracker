import * as React from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

export default function ResponsiveDialog({
	children,
	isOpen,
	setIsOpenAction,
	title,
	description,
}: {
	children: React.ReactNode;
	isOpen: boolean;
	setIsOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
	title: string;
	description?: string;
}) {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpenAction}>
			<DialogContent className='sm:max-w-[425px] overflow-y-auto max-h-screen'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}
