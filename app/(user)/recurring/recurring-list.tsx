'use client';

import { useState } from 'react';
import RecurringTransactionForm from '@/components/form/recurring-transaction-form';
import ResponsiveDialog from '@/components/responsive-dialog';
import DeleteForm from '@/components/delete-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { formatFullDate } from '@/lib/utils/dateHelpers';
import { deleteRecurringTransaction, toggleRecurringTransactionActive } from '@/lib/actions/recurring-transaction.actions';
import { RecurringTransaction } from '@/types/recurring-transaction';
import { Category } from '@/types/category';
import { TransactionOption } from '@/types/transaction-option';
import { toast } from 'sonner';
import { Pause, Play, Pencil, Trash2 } from 'lucide-react';
import EmptyState from '@/components/empty-state';

export default function RecurringList({
	userId,
	initialItems,
	userCategories,
	userPaymentMethods,
	userCreditCardTypes,
}: {
	userId: string;
	initialItems: RecurringTransaction[];
	userCategories: Category[];
	userPaymentMethods: TransactionOption[];
	userCreditCardTypes: TransactionOption[];
}) {
	const [items, setItems] = useState<RecurringTransaction[]>(initialItems);
	const [dialogMode, setDialogMode] = useState<
		'CREATE' | 'EDIT' | 'DELETE' | null
	>(null);
	const [selectedItem, setSelectedItem] = useState<RecurringTransaction | null>(
		null,
	);
	const isDialogOpen = dialogMode !== null;

	const handleOpenCreateDialog = () => setDialogMode('CREATE');

	const handleOpenEditDialog = (item: RecurringTransaction) => {
		setSelectedItem(item);
		setDialogMode('EDIT');
	};

	const handleOpenDeleteDialog = (item: RecurringTransaction) => {
		setSelectedItem(item);
		setDialogMode('DELETE');
	};

	const handleCloseDialog = () => {
		setDialogMode(null);
		setTimeout(() => setSelectedItem(null), 200);
	};

	const handleCreate = (newItem: RecurringTransaction) => {
		setItems((prev) => [...prev, newItem]);
	};

	const handleEdit = (updatedItem: RecurringTransaction) => {
		setItems((prev) =>
			prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
		);
	};

	const handleDelete = (id: string) => {
		setItems((prev) => prev.filter((i) => i.id !== id));
	};

	const handleToggleActive = (item: RecurringTransaction) => {
		const nextActive = !item.isActive;
		setItems((prev) =>
			prev.map((i) => (i.id === item.id ? { ...i, isActive: nextActive } : i)),
		);
		toggleRecurringTransactionActive(item.id, nextActive).then((res) => {
			if (!res.success) {
				toast('Failed to update', { description: res.message });
			}
		});
	};

	return (
		<div>
			<div className='mb-4'>
				<Button onClick={handleOpenCreateDialog}>Add Recurring</Button>
			</div>

			{items.length === 0 ? (
				<Card>
					<EmptyState
						title='No Recurring Transactions Yet'
						subtitle='Add rent, subscriptions, or salary to have them generated automatically.'
					/>
				</Card>
			) : (
				<div className='flex flex-col gap-3'>
					{items
						.slice()
						.sort(
							(a, b) =>
								new Date(a.nextRunDate).getTime() -
								new Date(b.nextRunDate).getTime(),
						)
						.map((item) => (
							<Card key={item.id}>
								<CardContent className='flex flex-wrap items-center justify-between gap-3'>
									<div>
										<div className='flex items-center gap-2'>
											<span className='font-semibold'>{item.categoryName}</span>
											<Badge variant={item.isActive ? 'secondary' : 'outline'}>
												{item.isActive ? 'Active' : 'Paused'}
											</Badge>
										</div>
										<p className='text-sm text-muted-foreground'>
											{item.type === 'INCOME' ? '+' : '-'}
											{formatCurrency(item.amount)} on day {item.dayOfMonth} of
											every month
										</p>
										<p className='text-xs text-muted-foreground'>
											Next: {formatFullDate(item.nextRunDate)}
											{item.endDate &&
												` · Ends: ${formatFullDate(item.endDate)}`}
										</p>
									</div>
									<div className='flex items-center gap-2'>
										<Button
											variant='outline'
											size='icon'
											aria-label={item.isActive ? 'Pause' : 'Resume'}
											onClick={() => handleToggleActive(item)}>
											{item.isActive ? (
												<Pause className='h-4 w-4' />
											) : (
												<Play className='h-4 w-4' />
											)}
										</Button>
										<Button
											variant='outline'
											size='icon'
											aria-label='Edit'
											onClick={() => handleOpenEditDialog(item)}>
											<Pencil className='h-4 w-4' />
										</Button>
										<Button
											variant='outline'
											size='icon'
											aria-label='Delete'
											onClick={() => handleOpenDeleteDialog(item)}>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
				</div>
			)}

			<ResponsiveDialog
				isOpen={isDialogOpen}
				setIsOpenAction={handleCloseDialog}
				title={
					dialogMode === 'CREATE'
						? 'Create Recurring Transaction'
						: dialogMode === 'DELETE'
							? 'Delete Recurring Transaction'
							: 'Edit Recurring Transaction'
				}
				description={
					dialogMode === 'CREATE'
						? 'Set up a transaction that repeats every month'
						: dialogMode === 'DELETE'
							? 'Are you sure you want to delete this? Already-generated transactions are not affected.'
							: 'Edit your recurring transaction below'
				}>
				{dialogMode === 'DELETE' ? (
					selectedItem && (
						<DeleteForm
							transactionId={selectedItem.id}
							setIsOpenAction={handleCloseDialog}
							action={deleteRecurringTransaction}
							onDeleteAction={handleDelete}
						/>
					)
				) : dialogMode === 'EDIT' ? (
					selectedItem && (
						<RecurringTransactionForm
							mode='Update'
							userId={userId}
							item={selectedItem}
							itemId={selectedItem.id}
							userCategories={userCategories}
							userPaymentMethods={userPaymentMethods}
							userCreditCardTypes={userCreditCardTypes}
							onEditAction={handleEdit}
							setIsOpenAction={handleCloseDialog}
						/>
					)
				) : (
					<RecurringTransactionForm
						mode='Create'
						userId={userId}
						userCategories={userCategories}
						userPaymentMethods={userPaymentMethods}
						userCreditCardTypes={userCreditCardTypes}
						onCreateAction={handleCreate}
						setIsOpenAction={handleCloseDialog}
					/>
				)}
			</ResponsiveDialog>
		</div>
	);
}
