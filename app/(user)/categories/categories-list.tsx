'use client';

import CategoryForm from '@/components/form/category-form';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/category';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';

export default function CategoriesList({
	userCategories,
	userId,
}: {
	userCategories: Category[];
	userId: string;
}) {
	const [categories, setCategories] = useState<Category[]>(userCategories);
	const [dialogMode, setDialogMode] = useState<'CREATE' | 'EDIT' | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);
	const isDialogOpen = dialogMode !== null;

	const handleOpenCreateDialog = () => {
		setDialogMode('CREATE');
	};

	const handleOpenEditDialog = (category: Category) => {
		setSelectedCategory(category);
		setDialogMode('EDIT');
	};

	const handleCloseDialog = () => {
		setDialogMode(null);
		// Add a small delay before clearing the ID to prevent UI flicker
		setTimeout(() => {
			setSelectedCategory(null);
		}, 200);
	};

	type LucideIconComponent = React.ForwardRefExoticComponent<
		Omit<LucideIcons.LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
	>;

	const iconMap = categories.reduce(
		(acc, category) => {
			let resolvedIconComponent: LucideIconComponent;

			if (category.icon) {
				const iconName = category.icon as keyof typeof LucideIcons;
				const potentialIcon = LucideIcons[iconName];

				if (potentialIcon) {
					resolvedIconComponent = potentialIcon as LucideIconComponent;
				} else {
					console.warn(
						`Warning: Icon '${category.icon}' not found in LucideIcons or is not a valid component. Using ShoppingBag as default for '${category.name}'.`,
					);
					resolvedIconComponent = LucideIcons.ShoppingBag;
				}
			} else {
				// If category.icon is null, use ShoppingBag
				resolvedIconComponent = LucideIcons.ShoppingBag;
			}

			acc[category.name] = resolvedIconComponent;
			return acc;
		},
		{} as Record<string, LucideIconComponent>,
	);

	const expenseCategories =
		categories?.filter((item) => item.type === 'EXPENSE') || [];

	const incomeCategories =
		categories?.filter((item) => item.type === 'INCOME') || [];

	const handleEdit = (updatedCategory: Category) => {
		setCategories((prev) =>
			prev.map((c) =>
				c.id === updatedCategory.id
					? {
							...updatedCategory,
						}
					: c,
			),
		);
	};

	const handleCreate = (newCategory: Category) => {
		setCategories((prev) => [...prev, newCategory]);
	};

	return (
		<div>
			<div className='mb-4'>
				<Button onClick={() => handleOpenCreateDialog()}>Add Category</Button>
			</div>
			<div className='mb-4'>
				<h3 className='mb-2 font-bold text-green-700'>Income Categories</h3>
				<ul>
					{incomeCategories
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((item) => {
							const Icon = iconMap[item.name];
							return (
								<li key={item.id}>
									<Button
										variant='ghost'
										onClick={() => handleOpenEditDialog(item)}>
										<Icon className='h-4 w-4' />
										{item.name}
									</Button>
								</li>
							);
						})}
				</ul>
			</div>
			<div className='mb-4'>
				<h3 className='mb-2 font-bold text-red-700'>Expense Categories</h3>
				<ul>
					{expenseCategories
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((item) => {
							const Icon = iconMap[item.name];
							return (
								<li key={item.id}>
									<Button
										variant='ghost'
										onClick={() => handleOpenEditDialog(item)}>
										<Icon className='h-4 w-4' />
										{item.name}
									</Button>
								</li>
							);
						})}
				</ul>
			</div>

			<ResponsiveDialog
				isOpen={isDialogOpen}
				setIsOpenAction={handleCloseDialog}
				title={dialogMode === 'CREATE' ? 'Create Category' : 'Edit Category'}
				description={
					dialogMode === 'CREATE'
						? 'Create a category'
						: 'Edit your category below'
				}>
				{dialogMode === 'EDIT' ? (
					selectedCategory && (
						<CategoryForm
							mode='Update'
							userId={userId}
							categoryId={selectedCategory.id}
							category={selectedCategory}
							onEditAction={handleEdit}
							setIsOpenAction={handleCloseDialog}
						/>
					)
				) : (
					<CategoryForm
						mode='Create'
						userId={userId}
						setIsOpenAction={handleCloseDialog}
						onCreateAction={handleCreate}
					/>
				)}
			</ResponsiveDialog>
		</div>
	);
}
