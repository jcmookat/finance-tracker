'use client';

import TransactionOptionForm from '@/components/form/transaction-option-form';
import ResponsiveDialog from '@/components/responsive-dialog';
import DeleteForm from '@/components/delete-form';
import { Button } from '@/components/ui/button';
import { TransactionOption } from '@/types/transaction-option';
import { resolveIcon } from '@/lib/utils/iconHelpers';
import { TransactionOptionKind } from '@/lib/generated/prisma';
import { deleteTransactionOption } from '@/lib/actions/transaction-option.actions';
import { Trash2 } from 'lucide-react';
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
	const [dialogMode, setDialogMode] = useState<
		'CREATE' | 'EDIT' | 'DELETE' | null
	>(null);
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

	const handleOpenDeleteDialog = (option: TransactionOption) => {
		setSelectedOption(option);
		setDialogMode('DELETE');
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

	const handleDelete = (id: string) => {
		setOptions((prev) => prev.filter((o) => o.id !== id));
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
							<li key={item.id} className='flex items-center'>
								<Button
									variant='ghost'
									className='flex-1 justify-start'
									onClick={() => handleOpenEditDialog(item)}>
									<Icon className='h-4 w-4' />
									{item.name}
								</Button>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => handleOpenDeleteDialog(item)}>
									<Trash2 className='h-4 w-4 text-red-400' />
								</Button>
							</li>
						);
					})}
			</ul>

			<ResponsiveDialog
				isOpen={isDialogOpen}
				setIsOpenAction={handleCloseDialog}
				title={
					dialogMode === 'CREATE'
						? `Create ${title}`
						: dialogMode === 'DELETE'
							? `Delete ${title}`
							: `Edit ${title}`
				}
				description={
					dialogMode === 'CREATE'
						? `Create a ${title.toLowerCase()}`
						: dialogMode === 'DELETE'
							? `Are you sure you want to delete this ${title.toLowerCase()}?`
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
				) : dialogMode === 'DELETE' ? (
					selectedOption && (
						<DeleteForm
							transactionId={selectedOption.id}
							setIsOpenAction={handleCloseDialog}
							action={deleteTransactionOption}
							onDeleteAction={handleDelete}
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
