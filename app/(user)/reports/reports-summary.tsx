import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { getTotalsByKey } from '@/lib/utils/transactionHelpers';
import { ReportsSummaryProps } from '@/types/transaction';

function renderTotalsTable(data: Record<string, number>, label: string) {
	const validKeys = Object.keys(data).filter((key) => key && key !== 'N/A'); // Only keys that are not empty or "N/A"
	const validValues = Object.entries(data).filter(
		([key]) => key && key !== 'N/A',
	);
	return (
		<Card>
			<CardHeader>
				<CardTitle>{label}</CardTitle>
			</CardHeader>
			<CardContent>
				<Table className='w-full'>
					<TableHeader>
						<TableRow>
							{validKeys.map((key) => (
								<TableHead
									key={`${label}-head-${key}`}
									className='text-center font-bold'>
									{key || 'N/A'}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							{validValues.map(([, total], idx) => (
								<TableCell
									key={`${label}-val-${idx}`}
									className='text-center font-medium'>
									{formatCurrency(total)}
								</TableCell>
							))}
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export default function ReportsSummary({ transactions }: ReportsSummaryProps) {
	return (
		<div className='space-y-4'>
			{Object.entries(transactions).map(([month, transactions]) => {
				const incomeTransactions = transactions.filter(
					(tr) => tr.type === 'INCOME',
				);
				const expenseTransactions = transactions.filter(
					(tr) => tr.type !== 'INCOME',
				);

				return (
					<div key={month} className='space-y-4'>
						{/* INCOME totals first */}
						{incomeTransactions.length > 0 && (
							<>
								<h3 className='text-lg font-medium text-green-600'>Income</h3>
								{renderTotalsTable(
									getTotalsByKey(incomeTransactions, 'category'),
									'Categories',
								)}
							</>
						)}

						{/* Other types (e.g. EXPENSE) */}
						{expenseTransactions.length > 0 && (
							<>
								<h3 className='text-lg font-medium text-red-600'>Expenses</h3>
								{renderTotalsTable(
									getTotalsByKey(expenseTransactions, 'category'),
									'Categories',
								)}
								{renderTotalsTable(
									getTotalsByKey(expenseTransactions, 'subcategory'),
									'Subcategories',
								)}
								{renderTotalsTable(
									getTotalsByKey(expenseTransactions, 'paymentMethod'),
									'Payment Methods',
								)}
								{renderTotalsTable(
									getTotalsByKey(expenseTransactions, 'creditCardType'),
									'Credit Card Types',
								)}
							</>
						)}
					</div>
				);
			})}
		</div>
	);
}
