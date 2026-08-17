import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils/formatHelpers';
import { Category } from '@/types/category';

export default function BudgetStatus({
	categories,
	monthlySpendByCategory,
}: {
	categories: Category[];
	monthlySpendByCategory: Record<string, number>;
}) {
	const limitedCategories = categories.filter(
		(c) => c.type === 'EXPENSE' && c.monthlyLimit,
	);

	if (limitedCategories.length === 0) return null;

	return (
		<Card className='p-6'>
			<CardHeader className='p-0 pb-4'>
				<CardTitle>Budget Status</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-4 p-0'>
				{limitedCategories
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((category) => {
						const spent = monthlySpendByCategory[category.name] || 0;
						const limit = category.monthlyLimit as number;
						const percent = Math.min(100, Math.round((spent / limit) * 100));
						const indicatorClassName =
							spent >= limit
								? 'bg-destructive'
								: percent >= 80
									? 'bg-amber-500'
									: 'bg-secondary';

						return (
							<div key={category.id}>
								<div className='mb-1 flex items-center justify-between text-sm'>
									<span className='font-medium'>{category.name}</span>
									<span className='text-muted-foreground'>
										{formatCurrency(spent)} / {formatCurrency(limit)}
									</span>
								</div>
								<Progress value={percent} indicatorClassName={indicatorClassName} />
							</div>
						);
					})}
			</CardContent>
		</Card>
	);
}
