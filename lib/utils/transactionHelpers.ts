// Helper to calculate total amount for a list of transactions
export function calculateTotalTransactions(transactions: any[]) {
  return transactions.reduce((sum, tr) => {
    // Convert amount to a number explicitly to ensure arithmetic addition
    const numericAmount = parseFloat(tr.amount);

    // Apply the sign based on transaction type
    const amount = tr.type === 'INCOME' ? numericAmount : -numericAmount;

    const total = sum + amount;

    return total;
  }, 0);
}

// Helper to group transactions by date (yyyy-mm-dd)
export function groupTransactionsByDate(transactions: any[]) {
  return transactions.reduce((groups: Record<string, any[]>, tr) => {
    const dateKey = tr.transactionDate.split('T')[0]; // '2025-04-05'
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(tr);
    return groups;
  }, {});
}
