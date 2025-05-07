'use server';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils/formatHelpers';
import {
  insertTransactionSchema,
  updateTransactionSchema,
} from '../validators/transaction';
import { revalidatePath } from 'next/cache';
import { InsertTransaction, UpdateTransaction } from '@/types/transaction';

// Create transaction
export async function createTransaction(data: InsertTransaction) {
  // Validate
  const parsed = insertTransactionSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: parsed.error.format(),
    };
  }

  const transaction = { ...parsed.data };

  // Handle date timezone conversion
  if (transaction.transactionDate) {
    const date = new Date(transaction.transactionDate);
    // Just extract the date components and create a new date string in YYYY-MM-DD format
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    transaction.transactionDate = new Date(dateString);
  }

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
export async function updateTransaction(data: UpdateTransaction) {
  // Validate
  const parsed = updateTransactionSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: parsed.error.format(),
    };
  }

  const transaction = { ...parsed.data };
  const { id, ...updateTransaction } = transaction;

  // Handle date timezone conversion
  if (updateTransaction.transactionDate) {
    const date = new Date(updateTransaction.transactionDate);
    // Extract date components and create a new date string in YYYY-MM-DD format
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    updateTransaction.transactionDate = new Date(dateString);
  }

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
