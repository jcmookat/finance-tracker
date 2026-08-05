import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils/formatHelpers';
import { TransactionOptionKind } from '@/lib/generated/prisma';

// Get a user's payment methods or credit card types
export async function getTransactionOptionsByUserId(
	userId: string,
	kind: TransactionOptionKind,
) {
	const rawOptions = await prisma.transactionOption.findMany({
		where: { userId, kind },
		orderBy: { name: 'asc' },
	});
	const options = rawOptions.map((option) => ({
		...option,
		icon: option.icon ?? undefined,
	}));
	return convertToPlainObject(options);
}
