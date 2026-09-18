import { Transaction } from '@/types/transaction';
import { Category } from '@/types/category';
import { TransactionOption } from '@/types/transaction-option';
import { calculateTotal, groupTransactionsByMonth } from './transactionHelpers';
import { getCurrentMonthAndYear } from './dateHelpers';

// Builds a compact JSON summary of a user's finances for the chat
// assistant's system prompt. Only the current month gets line-item detail;
// earlier months are monthly aggregates, to keep token cost independent of
// how many transactions the user has accumulated over time.
export function buildFinanceContext({
	transactions,
	categories,
	paymentMethods,
	creditCardTypes,
	rewardPercent,
	savingsPercent,
}: {
	transactions: Transaction[];
	categories: Category[];
	paymentMethods: TransactionOption[];
	creditCardTypes: TransactionOption[];
	rewardPercent: number;
	savingsPercent: number;
}): string {
	const { month, year } = getCurrentMonthAndYear();
	const currentMonthKey = `${year}-${String(month).padStart(2, '0')}`;

	const groupedByMonth = groupTransactionsByMonth(transactions);

	const monthlySummaries = Object.entries(groupedByMonth)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([monthKey, monthTransactions]) => {
			const income = calculateTotal(monthTransactions, 'INCOME');
			const expense = calculateTotal(monthTransactions, 'EXPENSE');

			const expenseByCategory: Record<string, number> = {};
			monthTransactions
				.filter((t) => t.type === 'EXPENSE')
				.forEach((t) => {
					expenseByCategory[t.categoryName] =
						(expenseByCategory[t.categoryName] || 0) + t.amount;
				});

			return {
				month: monthKey,
				income,
				expense,
				net: income - expense,
				expenseByCategory,
			};
		});

	const currentMonthTransactions = (groupedByMonth[currentMonthKey] || []).map(
		(t) => ({
			date: new Date(t.transactionDate).toISOString().slice(0, 10),
			type: t.type,
			category: t.categoryName,
			subcategory: t.subcategory || undefined,
			paymentMethod: t.paymentMethod || undefined,
			amount: t.amount,
			description: t.description || undefined,
		}),
	);

	const budgetPercent = Math.max(0, 100 - rewardPercent - savingsPercent);

	const context = {
		today: new Date().toISOString().slice(0, 10),
		budgetSplit: { rewardPercent, budgetPercent, savingsPercent },
		categories: categories.map((c) => ({
			name: c.name,
			type: c.type,
			monthlyLimit: c.monthlyLimit ?? undefined,
		})),
		paymentMethods: paymentMethods.map((p) => p.name),
		creditCardTypes: creditCardTypes.map((c) => c.name),
		monthlySummaries,
		currentMonthDetail: {
			month: currentMonthKey,
			transactions: currentMonthTransactions,
		},
	};

	return JSON.stringify(context);
}
