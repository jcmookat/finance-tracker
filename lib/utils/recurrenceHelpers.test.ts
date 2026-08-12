import { describe, expect, it } from 'vitest';
import { getFirstRunDate, getNextRunDate } from './recurrenceHelpers';

describe('getNextRunDate', () => {
	it('advances to the same day next month', () => {
		const result = getNextRunDate(new Date(2026, 0, 15), 15);
		expect(result).toEqual(new Date(2026, 1, 15));
	});

	it('clamps to the last day of a shorter month', () => {
		const result = getNextRunDate(new Date(2026, 0, 31), 31);
		// 2026 is not a leap year, so February has 28 days
		expect(result).toEqual(new Date(2026, 1, 28));
	});

	it('clamps correctly into a leap-year February', () => {
		const result = getNextRunDate(new Date(2028, 0, 31), 31);
		// 2028 is a leap year
		expect(result).toEqual(new Date(2028, 1, 29));
	});

	it('rolls over into the next year from December', () => {
		const result = getNextRunDate(new Date(2026, 11, 10), 10);
		expect(result).toEqual(new Date(2027, 0, 10));
	});
});

describe('getFirstRunDate', () => {
	it('uses this month when the day has not passed yet', () => {
		const today = new Date(2026, 5, 10);
		const result = getFirstRunDate(20, today);
		expect(result).toEqual(new Date(2026, 5, 20));
	});

	it('treats today itself as not yet passed', () => {
		const today = new Date(2026, 5, 20);
		const result = getFirstRunDate(20, today);
		expect(result).toEqual(new Date(2026, 5, 20));
	});

	it('rolls over to next month when the day already passed', () => {
		const today = new Date(2026, 5, 25);
		const result = getFirstRunDate(20, today);
		expect(result).toEqual(new Date(2026, 6, 20));
	});

	it('clamps to the current month\'s last day when the requested day does not exist yet', () => {
		const today = new Date(2026, 1, 5); // Feb 5, 2026 (28-day February)
		const result = getFirstRunDate(31, today);
		expect(result).toEqual(new Date(2026, 1, 28));
	});
});
