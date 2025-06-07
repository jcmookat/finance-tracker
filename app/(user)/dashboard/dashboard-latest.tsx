import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { formatFullDate } from '@/lib/utils/dateHelpers';
import { formatCurrency } from '@/lib/utils/formatHelpers';
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
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
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
						{transactions.slice(0, 6).map((tr) => {
							return (
								<TableRow key={tr.id} className='relative pb-10 pt-3'>
									<TableCell>{formatFullDate(tr.transactionDate)}</TableCell>
									<TableCell>{tr.type}</TableCell>
									<TableCell>{tr.categoryName}</TableCell>
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
