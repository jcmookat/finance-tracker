import { NextRequest, NextResponse } from 'next/server';
import { generateDueRecurringTransactions } from '@/lib/cron/generateRecurringTransactions';

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get('authorization');

	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new NextResponse('Unauthorized', { status: 401 });
	}

	const result = await generateDueRecurringTransactions();

	return NextResponse.json(result);
}
