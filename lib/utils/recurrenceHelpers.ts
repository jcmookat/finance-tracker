function clampDayOfMonth(
	year: number,
	monthIndex: number,
	dayOfMonth: number,
): number {
	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
	return Math.min(dayOfMonth, daysInMonth);
}

function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Advance one month past `from`, landing on `dayOfMonth` (clamped to that
// month's actual last day, e.g. Jan 31 + 1 month -> Feb 28/29).
export function getNextRunDate(from: Date, dayOfMonth: number): Date {
	const year = from.getFullYear();
	const month = from.getMonth();
	const nextMonthYear = month === 11 ? year + 1 : year;
	const nextMonthIndex = month === 11 ? 0 : month + 1;
	const clampedDay = clampDayOfMonth(nextMonthYear, nextMonthIndex, dayOfMonth);

	return new Date(nextMonthYear, nextMonthIndex, clampedDay);
}

// The nearest upcoming occurrence of `dayOfMonth` - this month if it hasn't
// passed yet (today counts as not yet passed), otherwise next month.
export function getFirstRunDate(
	dayOfMonth: number,
	today: Date = new Date(),
): Date {
	const todayStart = startOfDay(today);
	const clampedDay = clampDayOfMonth(
		todayStart.getFullYear(),
		todayStart.getMonth(),
		dayOfMonth,
	);
	const thisMonthRun = new Date(
		todayStart.getFullYear(),
		todayStart.getMonth(),
		clampedDay,
	);

	if (thisMonthRun >= todayStart) {
		return thisMonthRun;
	}

	return getNextRunDate(thisMonthRun, dayOfMonth);
}
