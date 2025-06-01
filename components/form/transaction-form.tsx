'use client';

import { Form } from '@/components/ui/form';
import BaseFormField from '@/components/base-form-field';
import { Dispatch, ReactElement, SetStateAction, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
	insertTransactionSchema,
	updateTransactionSchema,
} from '@/lib/validators/transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { InsertTransaction, Transaction } from '@/types/transaction';
import SubmitButton from '../submit-button';
import {
	expenseSubCategories,
	transactionDefaultValues,
	transactionType,
	expensePaymentMethod,
	expenseCreditCardType,
} from '@/lib/constants';
import * as LucideIcons from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
	createTransaction,
	updateTransaction,
} from '@/lib/actions/transaction.actions';
import { Category } from '@/types/category';
// import { ComboBox } from '../combo-box';

export default function TransactionForm({
	mode,
	userId,
	transaction,
	transactionId,
	userCategories,
	onEditAction,
	setIsOpenAction,
}: {
	mode: 'Create' | 'Update';
	userId: string;
	transaction?: Transaction;
	transactionId?: string;
	userCategories?: Category[];
	onEditAction?: (updatedTransaction: Transaction) => void;
	setIsOpenAction?: Dispatch<SetStateAction<boolean>>;
}): ReactElement {
	const router = useRouter();
	const searchParams = useSearchParams();
	const typeParam = searchParams.get('type') as 'EXPENSE' | 'INCOME';
	const formDefaults = transactionDefaultValues();

	type LucideIconComponent = React.ForwardRefExoticComponent<
		Omit<LucideIcons.LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
	>;

	const iconMap = userCategories?.reduce(
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
		userCategories
			?.filter((item) => item.type === 'EXPENSE')
			?.map((item) => ({
				label: item.name,
				value: item.name,
				icon: iconMap?.[item.name],
			})) || [];

	const incomeCategories =
		userCategories
			?.filter((item) => item.type === 'INCOME')
			?.map((item) => ({
				label: item.name,
				value: item.name,
				icon: iconMap?.[item.name],
			})) || [];

	const modeConfig = {
		Update: {
			buttonLabel: 'Update Transaction',
			isPendingLabel: 'Updating transaction...',
			schema: updateTransactionSchema,
		},
		Create: {
			buttonLabel: 'Create Transaction',
			isPendingLabel: 'Creating transaction...',
			schema: insertTransactionSchema,
		},
	};

	const currentMode = mode === 'Update' ? 'Update' : 'Create';
	const { buttonLabel, isPendingLabel, schema } = modeConfig[currentMode];

	const form = useForm<InsertTransaction>({
		resolver: zodResolver(schema),
		defaultValues:
			transaction && mode === 'Update'
				? transaction
				: {
						...formDefaults,
						userId,
						type:
							typeParam === 'INCOME' || typeParam === 'EXPENSE'
								? typeParam
								: 'EXPENSE',
						categoryName:
							typeParam === 'INCOME' ? 'Salary' : formDefaults.categoryName,
					},
	});

	const type = form.watch('type');
	const paymentMethod = form.watch('paymentMethod');
	const categories = type === 'INCOME' ? incomeCategories : expenseCategories;

	useEffect(() => {
		if (type === 'INCOME') {
			form.setValue('subcategory', '');
		}
	}, [form, type]);

	const onSubmit: SubmitHandler<InsertTransaction> = async (values) => {
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
				router.push('/transactions');
			}
		};

		if (mode === 'Create') {
			const res = await createTransaction(fullData);
			handleResponse(res);
		}

		if (mode === 'Update') {
			if (!transactionId) {
				router.push('/transactions');
				return;
			}
			const res = await updateTransaction({
				...fullData,
				id: transactionId,
			});
			handleResponse(res);
			onEditAction?.({
				...fullData,
				id: transactionId,
			});
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
						<BaseFormField<typeof insertTransactionSchema>
							name='type'
							inputType='toggle'
							dataArr={transactionType}
							formControl={form.control}
						/>
					)}
					<BaseFormField<typeof insertTransactionSchema>
						name='transactionDate'
						inputType='datepicker'
						formControl={form.control}
					/>
					<BaseFormField<typeof insertTransactionSchema>
						name='amount'
						label='Amount'
						placeholder='Enter amount'
						inputType='number'
						formControl={form.control}
					/>
					{type === 'EXPENSE' && (
						<BaseFormField<typeof insertTransactionSchema>
							name='paymentMethod'
							label='Payment Method'
							placeholder='Select a payment method'
							inputType='select'
							dataArr={expensePaymentMethod}
							formControl={form.control}
						/>
					)}
					{type === 'EXPENSE' && paymentMethod === 'Credit Card' && (
						<BaseFormField<typeof insertTransactionSchema>
							name='creditCardType'
							label='Credit Card Type'
							placeholder='Select a credit card type'
							inputType='select'
							dataArr={expenseCreditCardType}
							formControl={form.control}
						/>
					)}
					<BaseFormField<typeof insertTransactionSchema>
						name='categoryName'
						label='Category'
						placeholder='Select a category'
						inputType='select'
						dataArr={categories}
						formControl={form.control}
					/>
					{/* <ComboBox<typeof insertTransactionSchema>
						name='categoryName'
						label='User Category'
						placeholder='Select or add a category'
						dataArr={categories}
						formControl={form.control}
					/> */}
					{type === 'EXPENSE' && (
						<BaseFormField<typeof insertTransactionSchema>
							name='subcategory'
							label='Sub Category'
							placeholder='Enter a sub category'
							inputType='select'
							dataArr={expenseSubCategories}
							formControl={form.control}
						/>
					)}
					<BaseFormField<typeof insertTransactionSchema>
						name='description'
						label='Description'
						placeholder='Enter a description'
						inputType='textarea'
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
