import { describe, expect, it } from 'vitest';
import {
	calculateTotal,
	getTotalsByKey,
	groupTransactionsByDate,
	groupTransactionsByMonth,
	groupTransactionsByYear,
	prepareAllReport,
	prepareAnnualReport,
} from './transactionHelpers';
import { Transaction } from '@/types/transaction';

let nextId = 1;

function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
	return {
		id: String(nextId++),
		userId: 'user-1',
		type: 'EXPENSE',
		categoryName: 'Groceries',
		subcategory: undefined,
		paymentMethod: undefined,
		creditCardType: undefined,
		amount: 100,
		description: undefined,
		transactionDate: new Date(2025, 0, 15), // Jan 15, 2025 (local time)
		...overrides,
	};
}

describe('calculateTotal', () => {
	it('returns 0 for an empty list', () => {
		expect(calculateTotal([], 'ALL')).toBe(0);
	});

	it('sums only income for mode INCOME', () => {
		const transactions = [
			makeTransaction({ type: 'INCOME', amount: 500 }),
			makeTransaction({ type: 'EXPENSE', amount: 100 }),
		];
		expect(calculateTotal(transactions, 'INCOME')).toBe(500);
	});

	it('sums only expenses for mode EXPENSE', () => {
		const transactions = [
			makeTransaction({ type: 'INCOME', amount: 500 }),
			makeTransaction({ type: 'EXPENSE', amount: 100 }),
			makeTransaction({ type: 'EXPENSE', amount: 50 }),
		];
		expect(calculateTotal(transactions, 'EXPENSE')).toBe(150);
	});

	it('returns net income minus expense for mode ALL', () => {
		const transactions = [
			makeTransaction({ type: 'INCOME', amount: 500 }),
			makeTransaction({ type: 'EXPENSE', amount: 100 }),
			makeTransaction({ type: 'EXPENSE', amount: 50 }),
		];
		expect(calculateTotal(transactions, 'ALL')).toBe(350);
	});
});

describe('groupTransactionsByDate', () => {
	it('groups transactions that fall on the same calendar day together', () => {
		const sameDay = new Date(2025, 5, 15, 9, 0, 0);
		const sameDayLater = new Date(2025, 5, 15, 21, 0, 0);
		const otherDay = new Date(2025, 5, 20, 9, 0, 0);

		const grouped = groupTransactionsByDate([
			makeTransaction({ transactionDate: sameDay }),
			makeTransaction({ transactionDate: sameDayLater }),
			makeTransaction({ transactionDate: otherDay }),
		]);

		const groups = Object.values(grouped);
		expect(groups).toHaveLength(2);
		expect(groups.map((g) => g.length).sort()).toEqual([1, 2]);
	});
});

describe('groupTransactionsByMonth', () => {
	it('groups transactions under a YYYY-MM key regardless of day', () => {
		const grouped = groupTransactionsByMonth([
			makeTransaction({ transactionDate: new Date(2025, 0, 1) }),
			makeTransaction({ transactionDate: new Date(2025, 0, 28) }),
			makeTransaction({ transactionDate: new Date(2025, 1, 5) }),
		]);

		expect(grouped['2025-01']).toHaveLength(2);
		expect(grouped['2025-02']).toHaveLength(1);
	});
});

describe('groupTransactionsByYear', () => {
	it('groups transactions under a YYYY key', () => {
		const grouped = groupTransactionsByYear([
			makeTransaction({ transactionDate: new Date(2024, 11, 31) }),
			makeTransaction({ transactionDate: new Date(2025, 0, 1) }),
			makeTransaction({ transactionDate: new Date(2025, 5, 1) }),
		]);

		expect(grouped['2024']).toHaveLength(1);
		expect(grouped['2025']).toHaveLength(2);
	});
});

describe('getTotalsByKey', () => {
	it('sums amounts grouped by an arbitrary transaction field', () => {
		const totals = getTotalsByKey(
			[
				makeTransaction({ categoryName: 'Groceries', amount: 100 }),
				makeTransaction({ categoryName: 'Groceries', amount: 50 }),
				makeTransaction({ categoryName: 'Transport', amount: 30 }),
			],
			'categoryName',
		);

		expect(totals).toEqual({ Groceries: 150, Transport: 30 });
	});
});

describe('prepareAnnualReport', () => {
	it('buckets totals by month and accumulates annual totals per key', () => {
		const transactions = [
			makeTransaction({
				type: 'INCOME',
				categoryName: 'Salary',
				amount: 3000,
				transactionDate: new Date(2025, 0, 15),
			}),
			makeTransaction({
				type: 'EXPENSE',
				categoryName: 'Groceries',
				subcategory: 'Supermarket',
				paymentMethod: 'Cash',
				amount: 100,
				transactionDate: new Date(2025, 0, 20),
			}),
			makeTransaction({
				type: 'EXPENSE',
				categoryName: 'Groceries',
				paymentMethod: 'Credit Card',
				creditCardType: 'VISA',
				amount: 200,
				transactionDate: new Date(2025, 1, 5),
			}),
		];

		const { sortedKeys, monthlyTotals, annualTotals } =
			prepareAnnualReport(transactions);

		// Months present are ordered January -> December, not input order
		expect(Object.keys(monthlyTotals)).toEqual(['January', 'February']);

		expect(monthlyTotals['January']['income:Salary']).toBe(3000);
		expect(monthlyTotals['January']['category:Groceries']).toBe(100);
		expect(monthlyTotals['January']['subcategory:Supermarket']).toBe(100);
		expect(monthlyTotals['January']['paymentMethod:Cash']).toBe(100);
		expect(monthlyTotals['February']['category:Groceries']).toBe(200);
		expect(monthlyTotals['February']['creditCard:VISA']).toBe(200);

		// Annual totals accumulate across both months
		expect(annualTotals['category:Groceries']).toBe(300);
		expect(annualTotals['income:Salary']).toBe(3000);

		expect(sortedKeys).toContain('income:Salary');
		expect(sortedKeys).toContain('category:Groceries');
		expect(sortedKeys).toContain('subcategory:Supermarket');
		expect(sortedKeys).toContain('paymentMethod:Cash');
		expect(sortedKeys).toContain('creditCard:VISA');
	});
});

describe('prepareAllReport', () => {
	it('buckets totals by year and sorts years descending', () => {
		const transactions = [
			makeTransaction({
				type: 'INCOME',
				categoryName: 'Salary',
				amount: 1000,
				transactionDate: new Date(2023, 0, 1),
			}),
			makeTransaction({
				type: 'EXPENSE',
				categoryName: 'Groceries',
				amount: 100,
				transactionDate: new Date(2024, 0, 1),
			}),
			makeTransaction({
				type: 'EXPENSE',
				categoryName: 'Groceries',
				amount: 50,
				transactionDate: new Date(2025, 0, 1),
			}),
		];

		const { yearlyTotals, overallTotals, sortedYearMap } =
			prepareAllReport(transactions);

		expect(yearlyTotals['2023']['income:Salary']).toBe(1000);
		expect(yearlyTotals['2024']['category:Groceries']).toBe(100);
		expect(yearlyTotals['2025']['category:Groceries']).toBe(50);

		expect(overallTotals['category:Groceries']).toBe(150);

		expect(Array.from(sortedYearMap.keys())).toEqual(['2025', '2024', '2023']);
	});
});
