import { z } from 'zod';

import {
	categoryWithIdSchema,
	insertCategorySchema,
	updateCategorySchema,
} from '@/lib/validators/category';

export type Category = z.infer<typeof categoryWithIdSchema>;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type CategoryWithId = z.infer<typeof categoryWithIdSchema>;
