import { describe, expect, it } from 'vitest';
import { buildFinanceContext } from './chatContext';
import { Transaction } from '@/types/transaction';
import { Category } from '@/types/category';
import { TransactionOption } from '@/types/transaction-option';

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

function makeCategory(overrides: Partial<Category> = {}): Category {
	return {
		id: 'cat-1',
		name: 'Groceries',
		userId: 'user-1',
		icon: undefined,
		type: 'EXPENSE',
		monthlyLimit: undefined,
		...overrides,
	};
}

function makeOption(overrides: Partial<TransactionOption> = {}): TransactionOption {
	return {
		id: 'opt-1',
		userId: 'user-1',
		kind: 'PAYMENT_METHOD',
		name: 'Cash',
		icon: undefined,
		...overrides,
	};
}

const baseArgs = {
	categories: [makeCategory()],
	paymentMethods: [makeOption()],
	creditCardTypes: [] as TransactionOption[],
	rewardPercent: 5,
	savingsPercent: 35,
};

describe('buildFinanceContext', () => {
	it('aggregates income/expense/net per month, keyed by YYYY-MM', () => {
		const transactions = [
			makeTransaction({
				type: 'INCOME',
				categoryName: 'Salary',
				amount: 500,
				transactionDate: new Date(2025, 0, 1),
			}),
			makeTransaction({
				type: 'EXPENSE',
				categoryName: 'Groceries',
				amount: 100,
				transactionDate: new Date(2025, 0, 15),
			}),
			makeTransaction({
				type: 'EXPENSE',
				categoryName: 'Utilities',
				amount: 50,
				transactionDate: new Date(2025, 1, 1),
			}),
		];

		const context = JSON.parse(
			buildFinanceContext({ ...baseArgs, transactions }),
		);

		const jan = context.monthlySummaries.find((m: { month: string }) => m.month === '2025-01');
		const feb = context.monthlySummaries.find((m: { month: string }) => m.month === '2025-02');

		expect(jan).toEqual({
			month: '2025-01',
			income: 500,
			expense: 100,
			net: 400,
			expenseByCategory: { Groceries: 100 },
		});
		expect(feb).toEqual({
			month: '2025-02',
			income: 0,
			expense: 50,
			net: -50,
			expenseByCategory: { Utilities: 50 },
		});
	});

	it('sums multiple expenses in the same category within a month', () => {
		const transactions = [
			makeTransaction({ categoryName: 'Groceries', amount: 30 }),
			makeTransaction({ categoryName: 'Groceries', amount: 70 }),
		];

		const context = JSON.parse(
			buildFinanceContext({ ...baseArgs, transactions }),
		);

		expect(context.monthlySummaries[0].expenseByCategory).toEqual({
			Groceries: 100,
		});
	});

	it('includes line-item detail only for the current calendar month', () => {
		const today = new Date();
		const transactions = [
			makeTransaction({ transactionDate: today, description: 'Today lunch' }),
			makeTransaction({ transactionDate: new Date(2020, 0, 1), description: 'Old purchase' }),
		];

		const context = JSON.parse(
			buildFinanceContext({ ...baseArgs, transactions }),
		);

		expect(context.currentMonthDetail.transactions).toHaveLength(1);
		expect(context.currentMonthDetail.transactions[0].description).toBe(
			'Today lunch',
		);
	});

	it('passes through categories, payment methods, and budget split', () => {
		const context = JSON.parse(
			buildFinanceContext({
				...baseArgs,
				transactions: [],
				categories: [makeCategory({ name: 'Health', monthlyLimit: 20000 })],
				paymentMethods: [makeOption({ name: 'Credit Card' })],
				creditCardTypes: [makeOption({ kind: 'CREDIT_CARD_TYPE', name: 'VISA' })],
			}),
		);

		expect(context.categories).toEqual([
			{ name: 'Health', type: 'EXPENSE', monthlyLimit: 20000 },
		]);
		expect(context.paymentMethods).toEqual(['Credit Card']);
		expect(context.creditCardTypes).toEqual(['VISA']);
		expect(context.budgetSplit).toEqual({
			rewardPercent: 5,
			budgetPercent: 60,
			savingsPercent: 35,
		});
	});
});
