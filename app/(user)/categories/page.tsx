import { auth } from '@/auth';

import { getCategoriesByUserId } from '@/lib/data/category';
import { type ReactElement } from 'react';
import CategoriesList from './categories-list';

export default async function CategoriesPage(): Promise<ReactElement> {
	const session = await auth();
	if (!session) {
		throw new Error('User is not authenticated');
	}
	const userId = session.user.id;
	const userCategories = await getCategoriesByUserId(userId);

	return <CategoriesList userId={userId} userCategories={userCategories} />;
}
