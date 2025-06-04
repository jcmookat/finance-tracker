import { formatCurrency } from '@/lib/utils/formatHelpers';
import { Transaction } from '@/types/transaction';
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { prepareAnnualReport } from '@/lib/utils/transactionHelpers';
import { Card, CardContent } from '@/components/ui/card';

export default function AnnualList({
	transactions,
}: {
	transactions: Transaction[];
}) {
	const { sortedKeys, monthlyTotals, annualTotals } =
		prepareAnnualReport(transactions);

	return (
		<Card>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-28'>Month</TableHead>
							{sortedKeys.map((key) => {
								const label = key.split(':')[1] || 'N/A';
								return (
									<TableHead key={key} className='text-center font-bold'>
										{label}
									</TableHead>
								);
							})}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.entries(monthlyTotals).map(([month, totals]) => (
							<TableRow key={month}>
								<TableCell className='font-bold'>{month}</TableCell>
								{sortedKeys.map((key) => (
									<TableCell key={key} className='text-center'>
										{totals[key] ? formatCurrency(totals[key]) : '-'}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell className='font-bold'>Total</TableCell>
							{sortedKeys.map((key) => (
								<TableCell
									key={`total-${key}`}
									className='text-center font-bold'>
									{formatCurrency(annualTotals[key] || 0)}
								</TableCell>
							))}
						</TableRow>
					</TableFooter>
				</Table>
			</CardContent>
		</Card>
	);
}
