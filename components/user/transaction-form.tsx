'use client';

import { Form } from '@/components/ui/form';
import BaseFormField from '@/components/shared/base-form-field';
import { ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  insertTransactionSchema,
  updateTransactionSchema,
} from '@/lib/validators/transaction';
import { zodResolver } from '@hookform/resolvers/zod';
import { InsertTransaction, Transaction } from '@/types/transaction';
import { transactionDefaultValues } from '@/lib/constants';
import SubmitButton from '../shared/submit-button';
import {
  expenseCategories,
  incomeCategories,
  transactionType,
} from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  createTransaction,
  updateTransaction,
} from '@/lib/actions/transaction.actions';

export default function TransactionForm({
  mode,
  userId,
  transaction,
  transactionId,
}: {
  mode: 'Create' | 'Update';
  userId: string;
  transaction?: Transaction;
  transactionId?: string;
}): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as 'EXPENSE' | 'INCOME';
  const formDefaults = transactionDefaultValues();

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
            type: typeParam || 'EXPENSE',
            category: typeParam === 'INCOME' ? 'Salary' : formDefaults.category,
          },
  });

  const type = form.watch('type');
  const categories = type === 'INCOME' ? incomeCategories : expenseCategories;

  // useEffect(() => {
  //   const newCategory =
  //     type === 'INCOME'
  //       ? incomeCategories[0].value
  //       : expenseCategories[0].value;
  //
  //   form.setValue('category', newCategory);
  // }, [form, type]);

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
    }
  };

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5">
          <BaseFormField<typeof insertTransactionSchema>
            name="type"
            inputType="toggle"
            dataArr={transactionType}
            formControl={form.control}
          />
          <BaseFormField<typeof insertTransactionSchema>
            name="transactionDate"
            inputType="datepicker"
            formControl={form.control}
          />
          <BaseFormField<typeof insertTransactionSchema>
            name="amount"
            label="Amount"
            placeholder="Enter amount"
            inputType="number"
            formControl={form.control}
          />
          <BaseFormField<typeof insertTransactionSchema>
            name="category"
            label="Category"
            placeholder="Enter a category"
            inputType="select"
            dataArr={categories}
            formControl={form.control}
          />
          <BaseFormField<typeof insertTransactionSchema>
            name="description"
            label="Description"
            placeholder="Enter a description"
            inputType="textarea"
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
