import { prisma } from '@/db/prisma';
import { getNextRunDate } from '@/lib/utils/recurrenceHelpers';
import { normalizeToUtcMidnight } from '@/lib/utils/dateHelpers';
import { RecurringTransaction as PrismaRecurringTransaction } from '@/lib/generated/prisma';

const MAX_CATCH_UP_ITERATIONS = 36;

// Generates any Transaction rows due for a single template (looping in case
// of missed cron runs), then advances its nextRunDate. Shared by the daily
// cron and by createRecurringTransaction (to generate today's occurrence
// immediately instead of waiting for the next cron run).
export async function processRecurringTransaction(
	template: PrismaRecurringTransaction,
	today: Date = normalizeToUtcMidnight(new Date()),
) {
	let nextRunDate = template.nextRunDate;
	let isActive = true;
	let iterations = 0;
	let transactionsGenerated = 0;

	while (
		nextRunDate <= today &&
		(!template.endDate || nextRunDate <= template.endDate) &&
		iterations < MAX_CATCH_UP_ITERATIONS
	) {
		await prisma.transaction.create({
			data: {
				userId: template.userId,
				type: template.type,
				categoryName: template.categoryName,
				subcategory: template.subcategory,
				paymentMethod: template.paymentMethod,
				creditCardType: template.creditCardType,
				amount: template.amount,
				description: template.description,
				transactionDate: nextRunDate,
			},
		});
		transactionsGenerated++;

		nextRunDate = normalizeToUtcMidnight(
			getNextRunDate(nextRunDate, template.dayOfMonth),
		);
		iterations++;

		if (template.endDate && nextRunDate > template.endDate) {
			isActive = false;
			break;
		}
	}

	const updatedTemplate = await prisma.recurringTransaction.update({
		where: { id: template.id },
		data: { nextRunDate, isActive },
	});

	return { transactionsGenerated, updatedTemplate };
}

// Called by app/api/cron/recurring-transactions
export async function generateDueRecurringTransactions() {
	const today = normalizeToUtcMidnight(new Date());

	const dueTemplates = await prisma.recurringTransaction.findMany({
		where: {
			isActive: true,
			nextRunDate: { lte: today },
		},
	});

	let transactionsGenerated = 0;

	for (const template of dueTemplates) {
		const result = await processRecurringTransaction(template, today);
		transactionsGenerated += result.transactionsGenerated;
	}

	return {
		templatesProcessed: dueTemplates.length,
		transactionsGenerated,
	};
}
