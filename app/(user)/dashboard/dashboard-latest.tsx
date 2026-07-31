import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatFullDate } from '@/lib/utils/dateHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types/transaction';

export default function DashboardLatest({
	transactions,
}: {
	transactions: Transaction[];
}) {
	return (
		<Card className='pt-2 gap-0'>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1'>
					<CardTitle>Recent Transactions</CardTitle>
				</div>
				<CardAction>
					<Button variant='ghost' size='sm' asChild>
						<Link href='/transactions'>
							View all
							<ArrowRight className='h-4 w-4' />
						</Link>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Type</TableHead>
							<TableHead className='text-right'>Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.slice(0, 6).map((tr) => {
							const isIncome = tr.type === 'INCOME';
							return (
								<TableRow key={tr.id}>
									<TableCell className='py-3 text-muted-foreground'>
										{formatFullDate(tr.transactionDate)}
									</TableCell>
									<TableCell className='py-3'>
										<div className='font-medium'>{tr.categoryName}</div>
										{tr.subcategory && (
											<div className='text-xs text-muted-foreground'>
												{tr.subcategory}
											</div>
										)}
									</TableCell>
									<TableCell className='py-3 text-muted-foreground'>
										{tr.description || '—'}
									</TableCell>
									<TableCell className='py-3'>
										<Badge
											variant='outline'
											className={cn(
												isIncome
													? 'bg-secondary/15 text-secondary border-secondary/30'
													: 'bg-destructive/15 text-destructive border-destructive/30',
											)}>
											{isIncome ? 'Income' : 'Expense'}
										</Badge>
									</TableCell>
									<TableCell
										className={cn(
											'py-3 text-right font-semibold',
											isIncome ? 'text-secondary' : 'text-destructive',
										)}>
										{isIncome ? '+' : '-'}
										{formatCurrency(tr.amount)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
