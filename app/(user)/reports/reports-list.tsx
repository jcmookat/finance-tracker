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
import { prepareAllReport } from '@/lib/utils/transactionHelpers';

export default function ReportsList({
	transactions,
}: {
	transactions: Transaction[];
}) {
	const { sortedKeys, yearlyTotals, sortedYearMap, overallTotals } =
		prepareAllReport(transactions);

	return (
		<div className='overflow-auto rounded-xl border'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-48'>Category / Key</TableHead>
						{Array.from(sortedYearMap).map(([year]) => (
							<TableHead key={year} className='font-bold text-right'>
								{year}
							</TableHead>
						))}
						<TableHead className='font-bold text-right'>Total</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{sortedKeys.map((key) => {
						const label = key.split(':')[1] || 'N/A';
						return (
							<TableRow key={key}>
								<TableCell className='font-bold'>{label}</TableCell>
								{Array.from(sortedYearMap).map(([year]) => (
									<TableCell key={`${key}-${year}`} className='text-right'>
										{yearlyTotals[year][key]
											? formatCurrency(yearlyTotals[year][key])
											: '-'}
									</TableCell>
								))}
								<TableCell className='font-bold text-right'>
									{formatCurrency(overallTotals[key] || 0)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell className='font-bold'>Total</TableCell>
						{Array.from(sortedYearMap).map(([year]) => {
							const total = Object.values(yearlyTotals[year]).reduce(
								(sum, val) => sum + val,
								0,
							);
							return (
								<TableCell
									key={`year-total-${year}`}
									className='font-bold text-right'>
									{formatCurrency(total)}
								</TableCell>
							);
						})}
						<TableCell className='font-bold text-right'>
							{formatCurrency(
								Object.values(overallTotals).reduce((sum, val) => sum + val, 0),
							)}
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
}
