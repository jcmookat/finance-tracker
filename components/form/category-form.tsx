'use client';

import { Form } from '@/components/ui/form';
import BaseFormField from '@/components/base-form-field';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SubmitButton from '../submit-button';
import { transactionDefaultValues, transactionType } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Category, InsertCategory } from '@/types/category';
import {
	insertCategorySchema,
	updateCategorySchema,
} from '@/lib/validators/category';
import { createCategory, updateCategory } from '@/lib/actions/category.actions';
import CategoryIconSelect from '../category-icon-select';

export default function CategoryForm({
	mode,
	userId,
	category,
	categoryId,
	onEditAction,
	setIsOpenAction,
}: {
	mode: 'Create' | 'Update';
	userId: string;
	category?: Category;
	categoryId?: string;
	onEditAction?: (updatedCategory: Category) => void;
	setIsOpenAction?: Dispatch<SetStateAction<boolean>>;
}): ReactElement {
	const router = useRouter();
	const formDefaults = transactionDefaultValues();

	const modeConfig = {
		Update: {
			buttonLabel: 'Update Category',
			isPendingLabel: 'Updating category...',
			schema: updateCategorySchema,
		},
		Create: {
			buttonLabel: 'Create Category',
			isPendingLabel: 'Creating category...',
			schema: insertCategorySchema,
		},
	};

	const currentMode = mode === 'Update' ? 'Update' : 'Create';
	const { buttonLabel, isPendingLabel, schema } = modeConfig[currentMode];

	const form = useForm<InsertCategory>({
		resolver: zodResolver(schema),
		defaultValues:
			category && mode === 'Update'
				? category
				: {
						...formDefaults,
						userId,
					},
	});

	const onSubmit: SubmitHandler<InsertCategory> = async (values) => {
		const fullData = {
			...values,
			userId,
		};

		const handleResponse = (res: { success: boolean; message: string }) => {
			if (!res.success) {
				toast('', {
					description: res.message,
				});
			} else {
				toast('', {
					description: res.message,
				});
				router.push('/categories');
			}
		};

		if (mode === 'Create') {
			const res = await createCategory(fullData);
			handleResponse(res);
			setIsOpenAction?.(false);
		}

		if (mode === 'Update') {
			if (!categoryId) {
				router.push('/categories');
				return;
			}
			const res = await updateCategory({
				...fullData,
				id: categoryId,
			});
			handleResponse(res);

			if (res.success) {
				onEditAction?.({
					...fullData,
					id: categoryId,
				});
			}
			setIsOpenAction?.(false);
		}
	};

	return (
		<Form {...form}>
			<form
				method='post'
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8'>
				<div className='flex flex-col gap-5'>
					{mode === 'Create' && (
						<BaseFormField<typeof insertCategorySchema>
							name='type'
							inputType='toggle'
							dataArr={transactionType}
							formControl={form.control}
						/>
					)}
					<BaseFormField<typeof insertCategorySchema>
						name='name'
						label='Category name'
						placeholder='Enter category'
						formControl={form.control}
					/>
					<CategoryIconSelect<typeof insertCategorySchema>
						name='icon'
						label='Category icon'
						formControl={form.control}
					/>
				</div>
				<div>
					<SubmitButton
						isPending={form.formState.isSubmitting}
						buttonLabel={buttonLabel}
						isPendingLabel={isPendingLabel}
					/>
				</div>
			</form>
		</Form>
	);
}
