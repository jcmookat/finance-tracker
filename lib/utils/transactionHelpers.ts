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

export function groupTransactionsByMonth(transactions: Transaction[]) {
	const grouped: Record<string, Transaction[]> = {};

	transactions.forEach((tr) => {
		const date = new Date(tr.transactionDate);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // zero-padded
		const monthKey = `${year}-${month}`; // e.g., "2025-05"

		if (!grouped[monthKey]) grouped[monthKey] = [];
		grouped[monthKey].push(tr);
	});

	return grouped;
}

export function getTotalsByKey(
	transactions: Transaction[],
	key: keyof Transaction,
) {
	const totals: Record<string, number> = {};

	for (const t of transactions) {
		const groupKey = (t[key] as string) || '';
		totals[groupKey] = (totals[groupKey] || 0) + t.amount;
	}

	return totals;
}

export function prepareAnnualReport(transactions: Transaction[]) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const allKeys = new Set<string>();
	const monthlyTotals: Record<string, Record<string, number>> = {};

	for (const tx of transactions) {
		const date = new Date(tx.transactionDate);
		const month = months[date.getMonth()];
		if (!monthlyTotals[month]) monthlyTotals[month] = {};

		const addTotal = (key: string | null | undefined) => {
			if (!key) return;
			allKeys.add(key);
			monthlyTotals[month][key] = (monthlyTotals[month][key] || 0) + tx.amount;
		};

		if (tx.type === 'INCOME') {
			addTotal(tx.category);
		} else {
			addTotal(tx.category);
			addTotal(tx.subcategory);
			addTotal(tx.paymentMethod);
			addTotal(tx.creditCardType);
		}
	}

	const sortedKeys = Array.from(allKeys);

	return { sortedKeys, monthlyTotals };
}
