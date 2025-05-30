import { ZodError } from 'zod';

// Format errors
export function formatError(error: unknown): string {
	if (error instanceof ZodError) {
		// Gather all _errors from each field
		return Object.values(error.format())
			.flatMap((field: any) =>
				field && typeof field === 'object' && '_errors' in field
					? field._errors
					: [],
			)
			.join('. ');
	}

	// Handle Prisma unique constraint error (e.g. P2002)
	if (
		typeof error === 'object' &&
		error !== null &&
		'name' in error &&
		(error as any).name === 'PrismaClientKnownRequestError' &&
		(error as any).code === 'P2002'
	) {
		const field = (error as any).meta?.target?.[0] || 'Field';
		return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
	}

	// Handle Postgres bad input format (e.g. invalid UUID - code 22P02)
	if (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		(error as any).message?.includes(`code: "22P02"`)
	) {
		return 'Not found';
	}

	// Generic fallback
	if (typeof error === 'object' && error !== null && 'message' in error) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (error as any).message ?? 'Unknown error';
	}

	return 'An unknown error occurred';
}

export function formatCurrency(
	amount: number,
	locale = 'ja-JP',
	currency = 'JPY',
) {
	// Currencies like JPY don't use decimal places
	const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR'];
	const fractionDigits = noDecimalCurrencies.includes(currency) ? 0 : 2;

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	}).format(amount);
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}
