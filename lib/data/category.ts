import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils/formatHelpers';

// Get transactions by User ID, with optional month/year filtering
export async function getCategoriesByUserId(userId: string) {
	const rawCategories = await prisma.category.findMany({
		where: { userId },
	});
	const categories = rawCategories.map((tr) => ({
		...tr,
		icon: tr.icon ?? undefined,
	}));
	return convertToPlainObject(categories);
}
