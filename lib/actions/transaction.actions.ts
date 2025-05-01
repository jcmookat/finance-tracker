import { prisma } from '@/db/prisma';
import { z } from 'zod';
import { formatError } from '../utils/formatHelpers';
import {
  insertTransactionSchema,
  updateTransactionSchema,
} from '../validators/transaction';
import { revalidatePath } from 'next/cache';

// Create transaction
export async function createTransaction(
  data: z.infer<typeof insertTransactionSchema>,
) {
  // Validate
  const parsed = insertTransactionSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: parsed.error.format(),
    };
  }

  const transaction = parsed.data;

  try {
    // Create transaction
    await prisma.transaction.create({ data: transaction });

    revalidatePath('/transactions');

    return {
      success: true,
      message: 'Transaction created successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update transaction
export async function updateTransaction(
  data: z.infer<typeof updateTransactionSchema>,
) {
  // Validate
  const parsed = updateTransactionSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: parsed.error.format(),
    };
  }

  const transaction = parsed.data;

  const { id, ...updateTransaction } = transaction;

  try {
    // Validate and find transaction
    const transactionExists = await prisma.transaction.findFirst({
      where: { id },
    });

    if (!transactionExists) throw new Error('Transaction not found');

    // Update transaction
    await prisma.transaction.update({
      where: { id },
      data: updateTransaction,
    });

    revalidatePath('/transactions');

    return {
      success: true,
      message: 'Transaction updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Delete transaction
export async function deleteTransaction(id: string) {
  try {
    const transactionExists = await prisma.transaction.findFirst({
      where: { id },
    });

    if (!transactionExists) throw new Error('Transaction not found');

    await prisma.transaction.delete({ where: { id } });

    revalidatePath('/transactions');

    return {
      success: true,
      message: 'Transaction deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
