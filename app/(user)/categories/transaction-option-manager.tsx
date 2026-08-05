'use client';

import TransactionOptionForm from '@/components/form/transaction-option-form';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { TransactionOption } from '@/types/transaction-option';
import { resolveIcon } from '@/lib/utils/iconHelpers';
import { TransactionOptionKind } from '@/lib/generated/prisma';
import { useState } from 'react';

export default function TransactionOptionManager({
	userId,
	kind,
	title,
	initialOptions,
}: {
	userId: string;
	kind: TransactionOptionKind;
	title: string;
	initialOptions: TransactionOption[];
}) {
	const [options, setOptions] = useState<TransactionOption[]>(initialOptions);
	const [dialogMode, setDialogMode] = useState<'CREATE' | 'EDIT' | null>(null);
	const [selectedOption, setSelectedOption] = useState<TransactionOption | null>(
		null,
	);
	const isDialogOpen = dialogMode !== null;

	const handleOpenCreateDialog = () => {
		setDialogMode('CREATE');
	};

	const handleOpenEditDialog = (option: TransactionOption) => {
		setSelectedOption(option);
		setDialogMode('EDIT');
	};

	const handleCloseDialog = () => {
		setDialogMode(null);
		// Add a small delay before clearing the selection to prevent UI flicker
		setTimeout(() => {
			setSelectedOption(null);
		}, 200);
	};

	const handleEdit = (updatedOption: TransactionOption) => {
		setOptions((prev) =>
			prev.map((o) => (o.id === updatedOption.id ? { ...updatedOption } : o)),
		);
	};

	const handleCreate = (newOption: TransactionOption) => {
		setOptions((prev) => [...prev, newOption]);
	};

	return (
		<div>
			<div className='mb-4'>
				<Button onClick={handleOpenCreateDialog}>Add {title}</Button>
			</div>
			<ul>
				{options
					.slice()
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((item) => {
						const Icon = resolveIcon(item.icon, item.name);
						return (
							<li key={item.id}>
								<Button
									variant='ghost'
									onClick={() => handleOpenEditDialog(item)}>
									<Icon className='h-4 w-4' />
									{item.name}
								</Button>
							</li>
						);
					})}
			</ul>

			<ResponsiveDialog
				isOpen={isDialogOpen}
				setIsOpenAction={handleCloseDialog}
				title={dialogMode === 'CREATE' ? `Create ${title}` : `Edit ${title}`}
				description={
					dialogMode === 'CREATE'
						? `Create a ${title.toLowerCase()}`
						: `Edit your ${title.toLowerCase()} below`
				}>
				{dialogMode === 'EDIT' ? (
					selectedOption && (
						<TransactionOptionForm
							mode='Update'
							userId={userId}
							kind={kind}
							optionId={selectedOption.id}
							option={selectedOption}
							onEditAction={handleEdit}
							setIsOpenAction={handleCloseDialog}
						/>
					)
				) : (
					<TransactionOptionForm
						mode='Create'
						userId={userId}
						kind={kind}
						setIsOpenAction={handleCloseDialog}
						onCreateAction={handleCreate}
					/>
				)}
			</ResponsiveDialog>
		</div>
	);
}
