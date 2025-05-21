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

export function groupTransactionsByYear(transactions: Transaction[]) {
	const grouped: Record<string, Transaction[]> = {};

	transactions.forEach((tr) => {
		const date = new Date(tr.transactionDate);
		const year = date.getFullYear();
		const yearKey = `${year}`;

		if (!grouped[yearKey]) grouped[yearKey] = [];
		grouped[yearKey].push(tr);
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
	const incomeKeys = new Set<string>();

	// Separate sets to maintain order
	const categoryKeys = new Set<string>();
	const subcategoryKeys = new Set<string>();
	const paymentMethodKeys = new Set<string>();
	const creditCardTypeKeys = new Set<string>();

	const monthlyTotals: Record<string, Record<string, number>> = {};
	const annualTotals: Record<string, number> = {};

	for (const tx of transactions) {
		const date = new Date(tx.transactionDate);
		const month = months[date.getMonth()];
		if (!monthlyTotals[month]) monthlyTotals[month] = {};

		const addTotal = (key: string | null | undefined, isIncome: boolean) => {
			if (!key) return;
			allKeys.add(key);
			if (isIncome) incomeKeys.add(key);

			monthlyTotals[month][key] = (monthlyTotals[month][key] || 0) + tx.amount;
			annualTotals[key] = (annualTotals[key] || 0) + tx.amount;
		};

		if (tx.type === 'INCOME') {
			addTotal(`income:${tx.category}`, true);
		} else {
			if (tx.category) {
				categoryKeys.add(`category:${tx.category}`);
				addTotal(`category:${tx.category}`, false);
			}
			if (tx.subcategory) {
				subcategoryKeys.add(`subcategory:${tx.subcategory}`);
				addTotal(`subcategory:${tx.subcategory}`, false);
			}
			if (tx.paymentMethod) {
				paymentMethodKeys.add(`paymentMethod:${tx.paymentMethod}`);
				addTotal(`paymentMethod:${tx.paymentMethod}`, false);
			}
			if (tx.creditCardType) {
				creditCardTypeKeys.add(`creditCard:${tx.creditCardType}`);
				addTotal(`creditCard:${tx.creditCardType}`, false);
			}
		}
	}

	const sortedKeys = Array.from(
		new Set([
			...Array.from(incomeKeys).sort(),
			...Array.from(categoryKeys).sort(),
			...Array.from(subcategoryKeys).sort(),
			...Array.from(paymentMethodKeys).sort(),
			...Array.from(creditCardTypeKeys).sort(),
		]),
	);

	// Ensure months are sorted from January to December
	const sortedMonthlyTotals: Record<string, Record<string, number>> = {};
	for (const month of months) {
		if (monthlyTotals[month]) {
			sortedMonthlyTotals[month] = monthlyTotals[month];
		}
	}

	return { sortedKeys, monthlyTotals: sortedMonthlyTotals, annualTotals };
}

// All reports
export function prepareAllReport(transactions: Transaction[]) {
	const allKeys = new Set<string>();
	const incomeKeys = new Set<string>();
	const categoryKeys = new Set<string>();
	const subcategoryKeys = new Set<string>();
	const paymentMethodKeys = new Set<string>();
	const creditCardTypeKeys = new Set<string>();

	const yearlyTotals: Record<string, Record<string, number>> = {};
	const totalByKey: Record<string, number> = {};

	for (const tx of transactions) {
		const date = new Date(tx.transactionDate);
		const year = String(date.getFullYear());
		if (!yearlyTotals[year]) yearlyTotals[year] = {};

		const addTotal = (key: string | null | undefined, isIncome: boolean) => {
			if (!key) return;
			allKeys.add(key);
			if (isIncome) incomeKeys.add(key);

			yearlyTotals[year][key] = (yearlyTotals[year][key] || 0) + tx.amount;
			totalByKey[key] = (totalByKey[key] || 0) + tx.amount;
		};

		if (tx.type === 'INCOME') {
			addTotal(`income:${tx.category}`, true);
		} else {
			if (tx.category) {
				categoryKeys.add(`category:${tx.category}`);
				addTotal(`category:${tx.category}`, false);
			}
			if (tx.subcategory) {
				subcategoryKeys.add(`subcategory:${tx.subcategory}`);
				addTotal(`subcategory:${tx.subcategory}`, false);
			}
			if (tx.paymentMethod) {
				paymentMethodKeys.add(`paymentMethod:${tx.paymentMethod}`);
				addTotal(`paymentMethod:${tx.paymentMethod}`, false);
			}
			if (tx.creditCardType) {
				creditCardTypeKeys.add(`creditCard:${tx.creditCardType}`);
				addTotal(`creditCard:${tx.creditCardType}`, false);
			}
		}
	}

	const sortedKeys = Array.from(
		new Set([
			...Array.from(incomeKeys).sort(),
			...Array.from(categoryKeys).sort(),
			...Array.from(subcategoryKeys).sort(),
			...Array.from(paymentMethodKeys).sort(),
			...Array.from(creditCardTypeKeys).sort(),
		]),
	);

	const sortedYearKeys = Object.keys(yearlyTotals).sort(
		(a, b) => Number(b) - Number(a),
	);
	const sortedYearMap = new Map();

	for (const key of sortedYearKeys) {
		sortedYearMap.set(key, yearlyTotals[key]);
	}

	return {
		sortedKeys,
		yearlyTotals,
		sortedYearMap,
		overallTotals: totalByKey,
	};
}
