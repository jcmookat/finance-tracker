'use client';

import {
	calculateTotal,
	groupTransactionsByDate,
} from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { Transaction, TransactionsListProps } from '@/types/transaction';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ResponsiveDialog from '@/components/responsive-dialog';
import DeleteForm from '@/components/delete-form';
import { deleteTransaction } from '@/lib/actions/transaction.actions';
import TransactionForm from '@/components/form/transaction-form';
import { formatFullDate } from '@/lib/utils/dateHelpers';

export default function TransactionsList({
	transactions,
	onDeleteAction,
	onEditAction,
	userCategories,
}: TransactionsListProps) {
	const groupedTransactionsByDate = groupTransactionsByDate(transactions);
	const sortedDates = Object.keys(groupedTransactionsByDate).sort((a, b) =>
		b.localeCompare(a),
	);

	const [dialogMode, setDialogMode] = useState<'DELETE' | 'EDIT' | null>(null);
	const [selectedTransaction, setSelectedTransaction] =
		useState<Transaction | null>(null);
	const isDialogOpen = dialogMode !== null;

	const handleOpenDeleteDialog = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		setDialogMode('DELETE');
	};

	const handleOpenEditDialog = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		setDialogMode('EDIT');
	};

	const handleCloseDialog = () => {
		setDialogMode(null);
		// Add a small delay before clearing the ID to prevent UI flicker
		setTimeout(() => {
			setSelectedTransaction(null);
		}, 200);
	};

	type LucideIconComponent = React.ForwardRefExoticComponent<
		Omit<LucideIcons.LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
	>;

	const iconMap = userCategories.reduce(
		(acc, category) => {
			let resolvedIconComponent: LucideIconComponent;

			if (category.icon) {
				const iconName = category.icon as keyof typeof LucideIcons;
				const potentialIcon = LucideIcons[iconName];

				if (potentialIcon) {
					resolvedIconComponent = potentialIcon as LucideIconComponent;
				} else {
					console.warn(
						`Warning: Icon '${category.icon}' not found in LucideIcons or is not a valid component. Using ShoppingBag as default for '${category.name}'.`,
					);
					resolvedIconComponent = LucideIcons.ShoppingBag;
				}
			} else {
				// If category.icon is null, use ShoppingBag
				resolvedIconComponent = LucideIcons.ShoppingBag;
			}

			acc[category.name] = resolvedIconComponent;
			return acc;
		},
		{} as Record<string, LucideIconComponent>,
	);

	const renderTransactionGroup = (date: string) => {
		const dayTransactions = groupedTransactionsByDate[date];
		const dayTotal = calculateTotal(dayTransactions, 'ALL');

		const incomes = dayTransactions.filter((tr) => tr.type === 'INCOME');
		const expenses = dayTransactions.filter((tr) => tr.type === 'EXPENSE');
		return (
			<Card key={date} className='relative pb-10 pt-3'>
				<CardContent className='px-3'>
					<h3 className='text-xs text-muted-foreground mb-2 border-b border-b-black/15 pb-2'>
						{formatFullDate(date)}
					</h3>
					{incomes.length > 0 && (
						<div className='mb-2'>
							<h4 className='mb-1 font-semibold text-sm text-green-700'>
								Income
							</h4>
							<ul>
								{incomes
									.slice() // clone the array to avoid mutating original
									.sort((a, b) => {
										const categoryCompare = a.categoryName.localeCompare(
											b.categoryName,
											undefined,
											{ sensitivity: 'base' },
										);
										if (categoryCompare !== 0) return categoryCompare;

										// Optional: sort by subcategory if categories are the same
										return (a.subcategory || '').localeCompare(
											b.subcategory || '',
											undefined,
											{ sensitivity: 'base' },
										);
									})
									.map((tr) => {
										const Icon = iconMap[tr.categoryName];
										return (
											<li key={tr.id} className='w-full'>
												<DropdownMenu modal={false}>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															className='flex items-center justify-between gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 w-full px-3 hover:cursor-pointer'>
															<span className='flex items-center gap-2 mr-2'>
																<Icon className='px-0 m-0 h-4 w-4 text-muted-foreground' />
																{tr.categoryName}
															</span>
															<span>+{formatCurrency(Number(tr.amount))}</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end' className='min-w-0'>
														<DropdownMenuItem
															onClick={() => handleOpenEditDialog(tr)}>
															<LucideIcons.PenBox className='text-orange-400 w-5 h-5' />
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleOpenDeleteDialog(tr)}>
															<LucideIcons.Trash2 className='text-red-400 w-6 h-6' />
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</li>
										);
									})}
							</ul>
						</div>
					)}
					{expenses.length > 0 && (
						<div className='mb-2'>
							<h4 className='mb-1 font-semibold text-sm text-red-700'>
								Expenses
							</h4>
							<ul>
								{expenses
									.slice() // clone the array to avoid mutating original
									.sort((a, b) => {
										const categoryCompare = a.categoryName.localeCompare(
											b.categoryName,
											undefined,
											{ sensitivity: 'base' },
										);
										if (categoryCompare !== 0) return categoryCompare;

										// Optional: sort by subcategory if categories are the same
										return (a.subcategory || '').localeCompare(
											b.subcategory || '',
											undefined,
											{ sensitivity: 'base' },
										);
									})
									.map((tr) => {
										const Icon = iconMap[tr.categoryName];
										return (
											<li key={tr.id} className='w-full'>
												<DropdownMenu modal={false}>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															className='flex items-center justify-between gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 w-full px-3 hover:cursor-pointer'>
															<span className='flex items-center gap-2 mr-2'>
																<Icon className='px-0 m-0 h-4 w-4 text-muted-foreground' />
																{tr.categoryName}
																{tr.subcategory && (
																	<span className='text-xs'>
																		({tr.subcategory})
																	</span>
																)}
															</span>
															<span className='text-right flex items-center gap-1.5'>
																-{formatCurrency(Number(tr.amount))}
																{tr.paymentMethod === 'Cash' ? (
																	<LucideIcons.Banknote />
																) : (
																	<LucideIcons.CreditCard />
																)}
															</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end' className='min-w-0'>
														<DropdownMenuItem
															onClick={() => handleOpenEditDialog(tr)}>
															<LucideIcons.PenBox className='text-orange-400 w-5 h-5' />
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleOpenDeleteDialog(tr)}>
															<LucideIcons.Trash2 className='text-red-400 w-6 h-6' />
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</li>
										);
									})}
							</ul>
						</div>
					)}
					<p
						className={`absolute bottom-0 font-bold rounded-b-xl left-0 pl-4 py-1.5 pr-4 text-right w-full bg-muted ${dayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
						{dayTotal >= 0 ? '+' : '-'}
						{formatCurrency(Math.abs(dayTotal))}
					</p>
				</CardContent>
			</Card>
		);
	};

	return (
		<>
			{sortedDates.map(renderTransactionGroup)}
			{/* Single dialog instance for all transactions */}
			{selectedTransaction && (
				<ResponsiveDialog
					isOpen={isDialogOpen}
					setIsOpenAction={handleCloseDialog}
					title={
						dialogMode === 'DELETE' ? 'Delete Transaction' : 'Edit Transaction'
					}
					description={
						dialogMode === 'DELETE'
							? 'Are you sure you want to delete this transaction?'
							: 'Edit your transaction below'
					}>
					{dialogMode === 'DELETE' ? (
						<DeleteForm
							transactionId={selectedTransaction.id}
							setIsOpenAction={handleCloseDialog}
							action={deleteTransaction}
							onDeleteAction={onDeleteAction}
						/>
					) : (
						<TransactionForm
							mode='Update'
							userId={selectedTransaction.userId}
							transactionId={selectedTransaction.id}
							transaction={selectedTransaction}
							onEditAction={onEditAction}
							setIsOpenAction={handleCloseDialog}
							userCategories={userCategories}
						/>
					)}
				</ResponsiveDialog>
			)}
		</>
	);
}
