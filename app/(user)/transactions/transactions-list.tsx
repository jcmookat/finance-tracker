import {
	calculateTotal,
	groupTransactionsByDate,
} from '@/lib/utils/transactionHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { TransactionsListProps } from '@/types/transaction';
import { categoryIconMap } from '@/lib/constants';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { PenBox, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import ResponsiveDialog from '@/components/shared/responsive-dialog';
import DeleteForm from '@/components/shared/delete-form';
import { deleteTransaction } from '@/lib/actions/transaction.actions';

export default function TransactionsList({
	transactions,
	onDelete,
}: TransactionsListProps) {
	const groupedTransactionsByDate = groupTransactionsByDate(transactions);
	const sortedDates = Object.keys(groupedTransactionsByDate).sort((a, b) =>
		b.localeCompare(a),
	);
	const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
	const [transactionIdToDelete, setTransactionIdToDelete] = useState<
		string | null
	>(null);

	const handleOpenDeleteDialog = (id: string) => {
		setTransactionIdToDelete(id);
		setIsDeleteOpen(true);
	};

	const handleCloseDeleteDialog = () => {
		setIsDeleteOpen(false);
		// Add a small delay before clearing the ID to prevent UI flicker
		setTimeout(() => {
			setTransactionIdToDelete(null);
		}, 200);
	};

	const renderTransactionGroup = (date: string) => {
		const dayTransactions = groupedTransactionsByDate[date];
		const dayTotal = calculateTotal(dayTransactions, 'ALL');

		const incomes = dayTransactions.filter((tr) => tr.type === 'INCOME');
		const expenses = dayTransactions.filter((tr) => tr.type === 'EXPENSE');
		return (
			<div
				key={date}
				className='rounded-xl drop-shadow-lg bg-muted p-4 pb-10 relative'>
				<h3 className='text-sm text-center font-bold mb-2 border-b border-b-black/15 pb-2'>
					{new Date(date).toLocaleDateString()}
				</h3>
				{incomes.length > 0 && (
					<div className='mb-2'>
						<h4 className='mb-1 font-semibold text-sm text-green-700'>
							Income
						</h4>
						<ul>
							{incomes.map((tr) => {
								const Icon = categoryIconMap[tr.category];
								return (
									<li key={tr.id} className='w-full'>
										<DropdownMenu modal={false}>
											<DropdownMenuTrigger asChild>
												<Button
													variant='ghost'
													className='flex items-center justify-between gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 w-full px-0 hover:cursor-pointer'>
													<span className='flex items-center gap-2 mr-2'>
														{Icon && (
															<Icon className='px-0 m-0 h-4 w-4 text-muted-foreground' />
														)}
														{tr.category}
													</span>
													<span>{formatCurrency(Number(tr.amount))}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end' className='min-w-0'>
												<DropdownMenuItem asChild>
													<Link href={`/transactions/${tr.id}`}>
														<PenBox className='text-orange-400 w-5 h-5' />
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleOpenDeleteDialog(tr.id)}>
													<Trash2 className='text-red-400 w-6 h-6' />
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
							{expenses.map((tr) => {
								const Icon = categoryIconMap[tr.category];
								return (
									<li key={tr.id} className='w-full'>
										<DropdownMenu modal={false}>
											<DropdownMenuTrigger asChild>
												<Button
													variant='ghost'
													className='flex items-center justify-between gap-2 focus-visible:ring-0 focus-visible:ring-offset-0 w-full px-0 hover:cursor-pointer'>
													<span className='flex items-center gap-2 mr-2'>
														{Icon && (
															<Icon className='px-0 m-0 h-4 w-4 text-muted-foreground' />
														)}
														{tr.category}
														{tr.subcategory && (
															<span className='text-xs'>
																({tr.subcategory})
															</span>
														)}
													</span>
													<span>{formatCurrency(Number(tr.amount))}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end' className='min-w-0'>
												<DropdownMenuItem asChild>
													<Link href={`/transactions/${tr.id}`}>
														<PenBox className='text-orange-400 w-5 h-5' />
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleOpenDeleteDialog(tr.id)}>
													<Trash2 className='text-red-400 w-6 h-6' />
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
					className={`absolute bottom-0 font-bold rounded-b-xl left-0 pl-4 pb-2 pt-2 pr-4 text-right w-full bg-sidebar-accent-foreground/5 ${dayTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
					{dayTotal >= 0 ? '+' : '-'}
					{formatCurrency(Math.abs(dayTotal))}
				</p>
			</div>
		);
	};

	return (
		<>
			{sortedDates.map(renderTransactionGroup)}
			{/* Single dialog instance for all transactions */}
			{transactionIdToDelete && (
				<ResponsiveDialog
					isOpen={isDeleteOpen}
					setIsOpenAction={handleCloseDeleteDialog}
					title='Delete Transaction'
					description='Are you sure you want to delete this transaction?'>
					<DeleteForm
						transactionId={transactionIdToDelete}
						setIsOpenAction={handleCloseDeleteDialog}
						action={deleteTransaction}
						onDeleteAction={onDelete}
					/>
				</ResponsiveDialog>
			)}
		</>
	);
}
