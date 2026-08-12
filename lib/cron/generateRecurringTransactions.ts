import { prisma } from '@/db/prisma';
import { getNextRunDate } from '@/lib/utils/recurrenceHelpers';
import { normalizeToUtcMidnight } from '@/lib/utils/dateHelpers';

const MAX_CATCH_UP_ITERATIONS = 36;

// Called by app/api/cron/recurring-transactions - generates any real
// Transaction rows that are due, then advances each template's nextRunDate.
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
		let nextRunDate = template.nextRunDate;
		let isActive = true;
		let iterations = 0;

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

		await prisma.recurringTransaction.update({
			where: { id: template.id },
			data: { nextRunDate, isActive },
		});
	}

	return {
		templatesProcessed: dueTemplates.length,
		transactionsGenerated,
	};
}
