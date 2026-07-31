import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';

export default function DashboardStats({
	totalIncome,
	totalExpense,
	netIncome,
}: {
	totalIncome: number;
	totalExpense: number;
	netIncome: number;
}) {
	const stats = [
		{
			key: 'income',
			label: 'Total Income',
			value: formatCurrency(totalIncome),
			icon: ArrowUpRight,
			iconClass: 'bg-secondary/15 text-secondary',
			valueClass: 'text-secondary',
		},
		{
			key: 'expense',
			label: 'Total Expenses',
			value: formatCurrency(totalExpense),
			icon: ArrowDownRight,
			iconClass: 'bg-destructive/15 text-destructive',
			valueClass: 'text-destructive',
		},
		{
			key: 'net',
			label: 'Net Balance',
			value: formatCurrency(netIncome),
			icon: Wallet,
			iconClass: 'bg-primary/15 text-primary',
			valueClass: netIncome >= 0 ? 'text-secondary' : 'text-destructive',
		},
	];

	return (
		<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
			{stats.map((stat) => (
				<Card key={stat.key} className='p-6'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm text-muted-foreground'>{stat.label}</p>
							<p className={cn('mt-1 text-2xl font-bold', stat.valueClass)}>
								{stat.value}
							</p>
						</div>
						<div className={cn('rounded-full p-3', stat.iconClass)}>
							<stat.icon className='h-5 w-5' />
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
