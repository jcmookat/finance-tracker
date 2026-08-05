'use client';

import { Form } from '@/components/ui/form';
import BaseFormField from '@/components/base-form-field';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SubmitButton from '../submit-button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
	TransactionOption,
	InsertTransactionOption,
} from '@/types/transaction-option';
import {
	insertTransactionOptionSchema,
	updateTransactionOptionSchema,
} from '@/lib/validators/transaction-option';
import {
	createTransactionOption,
	updateTransactionOption,
} from '@/lib/actions/transaction-option.actions';
import CategoryIconSelect from '../category-icon-select';
import { TransactionOptionKind } from '@/lib/generated/prisma';

export default function TransactionOptionForm({
	mode,
	userId,
	kind,
	option,
	optionId,
	onEditAction,
	onCreateAction,
	setIsOpenAction,
}: {
	mode: 'Create' | 'Update';
	userId: string;
	kind: TransactionOptionKind;
	option?: TransactionOption;
	optionId?: string;
	onEditAction?: (updatedOption: TransactionOption) => void;
	onCreateAction?: (newOption: TransactionOption) => void;
	setIsOpenAction?: Dispatch<SetStateAction<boolean>>;
}): ReactElement {
	const router = useRouter();

	const modeConfig = {
		Update: {
			buttonLabel: 'Update',
			isPendingLabel: 'Updating...',
			schema: updateTransactionOptionSchema,
		},
		Create: {
			buttonLabel: 'Create',
			isPendingLabel: 'Creating...',
			schema: insertTransactionOptionSchema,
		},
	};

	const currentMode = mode === 'Update' ? 'Update' : 'Create';
	const { buttonLabel, isPendingLabel, schema } = modeConfig[currentMode];

	const form = useForm<InsertTransactionOption>({
		resolver: zodResolver(schema),
		defaultValues:
			option && mode === 'Update'
				? option
				: {
						userId,
						kind,
						name: '',
						icon: '',
					},
	});

	const onSubmit: SubmitHandler<InsertTransactionOption> = async (values) => {
		const fullData = {
			...values,
			userId,
			kind,
		};

		const handleResponse = (res: {
			success: boolean;
			message: string;
			option?: TransactionOption;
		}) => {
			toast('', {
				description: res.message,
			});
			if (res.success) {
				router.push('/categories');
			}
		};

		if (mode === 'Create') {
			const res = await createTransactionOption(fullData);
			handleResponse(res);
			if (res.success && res.option) {
				onCreateAction?.(res.option);
			}
			setIsOpenAction?.(false);
		}

		if (mode === 'Update') {
			if (!optionId) {
				setIsOpenAction?.(false);
				return;
			}
			const res = await updateTransactionOption({
				...fullData,
				id: optionId,
			});
			handleResponse(res);

			if (res.success) {
				onEditAction?.({
					...fullData,
					id: optionId,
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
					<BaseFormField<typeof insertTransactionOptionSchema>
						name='name'
						label='Name'
						placeholder='Enter a name'
						formControl={form.control}
					/>
					<CategoryIconSelect<typeof insertTransactionOptionSchema>
						name='icon'
						label='Icon'
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
