// Get Current Month and Year
export function getCurrentMonthAndYear() {
	const now = new Date();
	return {
		month: now.getMonth() + 1,
		year: now.getFullYear(),
	};
}

// Normalize to UTC midnight
export function normalizeToUtcMidnight(date: Date): Date {
	return new Date(
		Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
	);
}

export function formatFullDate(date: string | Date): string {
	const d = typeof date === 'string' ? new Date(date) : date;

	return d.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
}
