import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils/formatHelpers';

export async function getRecurringTransactionsByUserId(userId: string) {
	const rawItems = await prisma.recurringTransaction.findMany({
		where: { userId },
		orderBy: { nextRunDate: 'asc' },
	});
	const items = rawItems.map((item) => ({
		...item,
		amount: item.amount.toNumber(),
		subcategory: item.subcategory ?? undefined,
		paymentMethod: item.paymentMethod ?? undefined,
		creditCardType: item.creditCardType ?? undefined,
		description: item.description ?? undefined,
		endDate: item.endDate ?? undefined,
	}));
	return convertToPlainObject(items);
}
