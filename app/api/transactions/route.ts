import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getTransactionsForPeriod } from '@/lib/data/transaction';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Get month and year from query parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const olderStartDate = new Date(startDate);
    const olderEndDate = new Date(endDate);

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Month and year are required' },
        { status: 400 },
      );
    }

    const transactions = await getTransactionsForPeriod(
      userId,
      olderStartDate,
      olderEndDate,
    );

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    );
  }
}
