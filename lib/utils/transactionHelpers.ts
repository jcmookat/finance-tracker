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

export function groupTransactionsByDate(transactions: Transaction[]) {
	const grouped: Record<string, Transaction[]> = {};

	transactions.forEach((tr) => {
		const date = new Date(tr.transactionDate);
		// Ensure consistent YYYY-MM-DD formatting
		const dateKey = date.toISOString().split('T')[0]; // ISO date format (safe after normalization)
		if (!grouped[dateKey]) grouped[dateKey] = [];
		grouped[dateKey].push(tr);
	});

	return grouped;
}
