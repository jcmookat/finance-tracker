'use server';
import {
	insertCategorySchema,
	updateCategorySchema,
} from '@/lib/validators/category';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { InsertCategory, UpdateCategory } from '@/types/category';
import { formatError } from '../utils/formatHelpers';

// Create transaction
export async function createCategory(data: InsertCategory) {
	// Validate
	const parsed = insertCategorySchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			message: 'Validation failed',
			errors: parsed.error.format(),
		};
	}

	const category = { ...parsed.data };

	try {
		// Create transaction
		await prisma.category.create({ data: category });

		revalidatePath('/categories');

		return {
			success: true,
			message: 'Category created successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update category
export async function updateCategory(data: UpdateCategory) {
	// Validate
	const parsed = updateCategorySchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			message: 'Validation failed',
			errors: parsed.error.format(),
		};
	}

	const category = { ...parsed.data };
	const { id, ...updateCategory } = category;

	try {
		// Validate and find category
		const categoryExists = await prisma.category.findFirst({
			where: { id },
		});

		if (!categoryExists) throw new Error('Category not found');

		// Update category
		await prisma.category.update({
			where: { id },
			data: updateCategory,
		});

		revalidatePath('/category');

		return {
			success: true,
			message: 'Category updated successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
