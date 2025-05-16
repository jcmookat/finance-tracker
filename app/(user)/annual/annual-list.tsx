import { formatCurrency } from '@/lib/utils/formatHelpers';
import { Transaction } from '@/types/transaction';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { prepareAnnualReport } from '@/lib/utils/transactionHelpers';

type Props = {
	transactions: Transaction[];
};

export default function AnnualReportTable({ transactions }: Props) {
	const { sortedKeys, monthlyTotals } = prepareAnnualReport(transactions);

	return (
		<div className='overflow-auto rounded-xl border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-28'>Month</TableHead>
						{sortedKeys.map((key) => (
							<TableHead key={key} className='text-center font-bold'>
								{key || 'N/A'}
							</TableHead>
						))}
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
			</Table>
		</div>
	);
}
