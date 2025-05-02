import { Transaction } from '@/types/transaction';

export function calculateTotal(
  transactions: Transaction[],
  mode: 'ALL' | 'INCOME' | 'EXPENSE',
) {
  return transactions.reduce((sum, tr) => {
    const numericAmount = Number(tr.amount);

    let amount = 0;

    if (mode === 'ALL') {
      amount = tr.type === 'INCOME' ? numericAmount : -numericAmount;
    } else if (mode === tr.type) {
      amount = numericAmount;
    }

    return sum + amount;
  }, 0);
}

// Helper to group transactions by date (yyyy-mm-dd)
export function groupTransactionsByDate(transactions: Transaction[]) {
  return transactions.reduce((groups: Record<string, Transaction[]>, tr) => {
    const dateKey = tr.transactionDate.toString().split('T')[0]; // '2025-04-05'
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(tr);
    return groups;
  }, {});
}
