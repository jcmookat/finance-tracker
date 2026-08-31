'use client';

import { Form } from '@/components/ui/form';
import BaseFormField from '@/components/base-form-field';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
	insertRecurringTransactionSchema,
	updateRecurringTransactionSchema,
} from '@/lib/validators/recurring-transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	InsertRecurringTransaction,
	RecurringTransaction,
} from '@/types/recurring-transaction';
import SubmitButton from '../submit-button';
import { transactionType } from '@/lib/constants';
import { toast } from 'sonner';
import {
	createRecurringTransaction,
	updateRecurringTransaction,
} from '@/lib/actions/recurring-transaction.actions';
import { Category } from '@/types/category';
import { TransactionOption } from '@/types/transaction-option';
import { resolveIcon } from '@/lib/utils/iconHelpers';
import { expenseSubCategories } from '@/lib/constants';
import { normalizeToUtcMidnight } from '@/lib/utils/dateHelpers';

const DAY_OF_MONTH_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
	label: String(i + 1),
	value: String(i + 1),
}));

export default function RecurringTransactionForm({
	mode,
	userId,
	item,
	itemId,
	userCategories,
	userPaymentMethods,
	userCreditCardTypes,
	onEditAction,
	onCreateAction,
	setIsOpenAction,
}: {
	mode: 'Create' | 'Update';
	userId: string;
	item?: RecurringTransaction;
	itemId?: string;
	userCategories?: Category[];
	userPaymentMethods?: TransactionOption[];
	userCreditCardTypes?: TransactionOption[];
	onEditAction?: (updated: RecurringTransaction) => void;
	onCreateAction?: (created: RecurringTransaction) => void;
	setIsOpenAction?: Dispatch<SetStateAction<boolean>>;
}): ReactElement {
	const modeConfig = {
		Update: {
			buttonLabel: 'Update Recurring',
			isPendingLabel: 'Updating...',
			schema: updateRecurringTransactionSchema,
		},
		Create: {
			buttonLabel: 'Create Recurring',
			isPendingLabel: 'Creating...',
			schema: insertRecurringTransactionSchema,
		},
	};

	const currentMode = mode === 'Update' ? 'Update' : 'Create';
	const { buttonLabel, isPendingLabel, schema } = modeConfig[currentMode];

	const form = useForm<InsertRecurringTransaction>({
		resolver: zodResolver(schema),
		defaultValues:
			item && mode === 'Update'
				? item
				: {
						userId,
						type: 'EXPENSE',
						categoryName: '',
						subcategory: '',
						paymentMethod: '',
						creditCardType: '',
						amount: 100,
						description: '',
						dayOfMonth: 1,
						endDate: undefined,
					},
	});

	const type = form.watch('type');
	const paymentMethod = form.watch('paymentMethod');

	const expenseCategories =
		userCategories
			?.filter((item) => item.type === 'EXPENSE')
			?.map((item) => ({
				label: item.name,
				value: item.name,
				icon: resolveIcon(item.icon, item.name),
			})) || [];

	const incomeCategories =
		userCategories
			?.filter((item) => item.type === 'INCOME')
			?.map((item) => ({
				label: item.name,
				value: item.name,
				icon: resolveIcon(item.icon, item.name),
			})) || [];

	const categories = type === 'INCOME' ? incomeCategories : expenseCategories;

	const paymentMethodOptions =
		userPaymentMethods?.map((option) => ({
			label: option.name,
			value: option.name,
			icon: resolveIcon(option.icon, option.name),
		})) || [];

	const creditCardTypeOptions =
		userCreditCardTypes?.map((option) => ({
			label: option.name,
			value: option.name,
			icon: resolveIcon(option.icon, option.name),
		})) || [];

	const onSubmit: SubmitHandler<InsertRecurringTransaction> = async (
		values,
	) => {
		const fullData = {
			...values,
			userId,
			// Normalize while still in the browser's own timezone context - see
			// transaction-form.tsx for why this can't happen on the server.
			endDate: values.endDate
				? normalizeToUtcMidnight(new Date(values.endDate))
				: values.endDate,
		};

		const handleResponse = (res: { success: boolean; message: string }) => {
			toast('', { description: res.message });
		};

		if (mode === 'Create') {
			const res = await createRecurringTransaction(fullData);
			handleResponse(res);
			if (res.success && res.item) {
				onCreateAction?.(res.item);
				setIsOpenAction?.(false);
			}
		}

		if (mode === 'Update') {
			if (!itemId) {
				setIsOpenAction?.(false);
				return;
			}
			const res = await updateRecurringTransaction({
				...fullData,
				id: itemId,
			});
			handleResponse(res);
			if (res.success && res.item) {
				onEditAction?.(res.item);
				setIsOpenAction?.(false);
			}
		}
	};

	return (
		<Form {...form}>
			<form
				method='post'
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8'>
				<div className='flex flex-col gap-5'>
					<BaseFormField<typeof insertRecurringTransactionSchema>
						name='type'
						inputType='toggle'
						dataArr={transactionType}
						formControl={form.control}
					/>
					<BaseFormField<typeof insertRecurringTransactionSchema>
						name='amount'
						label='Amount'
						placeholder='Enter amount'
						inputType='number'
						formControl={form.control}
					/>
					<BaseFormField<typeof insertRecurringTransactionSchema>
						name='dayOfMonth'
						label='Day of Month'
						placeholder='Select a day'
						inputType='select'
						dataArr={DAY_OF_MONTH_OPTIONS}
						formControl={form.control}
					/>
					{type === 'EXPENSE' && (
						<BaseFormField<typeof insertRecurringTransactionSchema>
							name='paymentMethod'
							label='Payment Method'
							placeholder='Select a payment method'
							inputType='select'
							dataArr={paymentMethodOptions}
							formControl={form.control}
						/>
					)}
					{type === 'EXPENSE' && paymentMethod === 'Credit Card' && (
						<BaseFormField<typeof insertRecurringTransactionSchema>
							name='creditCardType'
							label='Credit Card Type'
							placeholder='Select a credit card type'
							inputType='select'
							dataArr={creditCardTypeOptions}
							formControl={form.control}
						/>
					)}
					<BaseFormField<typeof insertRecurringTransactionSchema>
						name='categoryName'
						label='Category'
						placeholder='Select a category'
						inputType='select'
						dataArr={categories}
						formControl={form.control}
					/>
					{type === 'EXPENSE' && (
						<BaseFormField<typeof insertRecurringTransactionSchema>
							name='subcategory'
							label='Sub Category'
							placeholder='Enter a sub category'
							inputType='select'
							dataArr={expenseSubCategories}
							formControl={form.control}
						/>
					)}
					<BaseFormField<typeof insertRecurringTransactionSchema>
						name='endDate'
						label='End Date (optional)'
						inputType='datepicker'
						clearable
						formControl={form.control}
					/>
					<BaseFormField<typeof insertRecurringTransactionSchema>
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
