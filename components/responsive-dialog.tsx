import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

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
	const isMobile = useIsMobile();
	if (!isMobile) {
		return (
			<Dialog open={isOpen} onOpenChange={setIsOpenAction}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{description && (
							<DialogDescription>{description}</DialogDescription>
						)}
					</DialogHeader>
					{children}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpenAction}>
			<DrawerContent>
				<DrawerHeader className='text-left'>
					<DrawerTitle>{title}</DrawerTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DrawerHeader>
				{children}
				<DrawerFooter className='pt-2'>
					<DrawerClose asChild>
						<Button variant='outline'>Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
