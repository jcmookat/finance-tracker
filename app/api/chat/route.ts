import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/auth';
import { getTransactionsForPeriod } from '@/lib/data/transaction';
import { getCategoriesByUserId } from '@/lib/data/category';
import { getTransactionOptionsByUserId } from '@/lib/data/transaction-option';
import { getUserBudgetPreferences } from '@/lib/data/user';
import { buildFinanceContext } from '@/lib/utils/chatContext';
import { getCurrentMonthAndYear } from '@/lib/utils/dateHelpers';

const OPENAI_MODEL = 'gpt-4o-mini';

const SYSTEM_PROMPT = `You are a helpful financial assistant for a personal finance tracker app. Answer questions using only the JSON financial data provided below. Amounts are in the user's own currency - do not assume USD or add a currency symbol unless the data does. If the data doesn't contain enough detail to answer precisely (e.g. a specific transaction from several months ago, since only the current month has line-item detail), say so rather than guessing. Be concise.`;

export async function POST(request: NextRequest) {
	try {
		const session = await auth();
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		if (!process.env.OPENAI_API_KEY) {
			return NextResponse.json(
				{ error: 'OPENAI_API_KEY is not configured' },
				{ status: 500 },
			);
		}

		const { messages } = (await request.json()) as {
			messages: { role: 'user' | 'assistant'; content: string }[];
		};

		if (!Array.isArray(messages) || messages.length === 0) {
			return NextResponse.json({ error: 'messages is required' }, { status: 400 });
		}

		const userId = session.user.id;
		const { month, year } = getCurrentMonthAndYear();

		// Same 13-month window used on the Transactions/Monthly/Annual pages.
		const startDate = new Date(year, month - 13, 1);
		const endDate = new Date(year, month, 1);

		const [transactions, categories, paymentMethods, creditCardTypes, budgetPrefs] =
			await Promise.all([
				getTransactionsForPeriod(userId, startDate, endDate),
				getCategoriesByUserId(userId),
				getTransactionOptionsByUserId(userId, 'PAYMENT_METHOD'),
				getTransactionOptionsByUserId(userId, 'CREDIT_CARD_TYPE'),
				getUserBudgetPreferences(userId),
			]);

		const financeContext = buildFinanceContext({
			transactions,
			categories,
			paymentMethods,
			creditCardTypes,
			rewardPercent: budgetPrefs.rewardPercent,
			savingsPercent: budgetPrefs.savingsPercent,
		});

		const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

		const stream = await client.chat.completions.create({
			model: OPENAI_MODEL,
			stream: true,
			messages: [
				{
					role: 'system',
					content: `${SYSTEM_PROMPT}\n\nFinancial data (JSON):\n${financeContext}`,
				},
				...messages,
			],
		});

		const encoder = new TextEncoder();
		const readable = new ReadableStream({
			async start(controller) {
				try {
					for await (const chunk of stream) {
						const delta = chunk.choices[0]?.delta?.content ?? '';
						if (delta) controller.enqueue(encoder.encode(delta));
					}
				} catch (error) {
					console.error('Error streaming chat completion:', error);
				} finally {
					controller.close();
				}
			},
		});

		return new Response(readable, {
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
	} catch (error) {
		console.error('Error in chat route:', error);
		return NextResponse.json(
			{ error: 'Failed to get a response from the assistant' },
			{ status: 500 },
		);
	}
}
