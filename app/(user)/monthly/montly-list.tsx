import { formatCurrency } from '@/lib/utils/formatHelpers';
import { TransactionsListProps } from '@/types/transaction';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { formatFullDate } from '@/lib/utils/dateHelpers';
import { Card, CardContent } from '@/components/ui/card';

type MonthlyListProps = Omit<TransactionsListProps, 'onDelete' | 'onEdit'>;

export default function MonthlyList({ transactions }: MonthlyListProps) {
	return (
		<Card>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Sub Category</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Payment Method</TableHead>
							<TableHead>Credit Card Type</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.map((tr) => {
							return (
								<TableRow key={tr.id} className='relative pb-10 pt-3'>
									<TableCell>{formatFullDate(tr.transactionDate)}</TableCell>
									<TableCell>{tr.type}</TableCell>
									<TableCell>{tr.category}</TableCell>
									<TableCell>{tr.subcategory}</TableCell>
									<TableCell>{tr.description}</TableCell>
									<TableCell>{formatCurrency(tr.amount)}</TableCell>
									<TableCell>{tr.paymentMethod}</TableCell>
									<TableCell>{tr.creditCardType}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
