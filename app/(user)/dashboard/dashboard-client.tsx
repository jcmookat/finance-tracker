'use client';

import * as React from 'react';
import DashboardChart from './dashboard-chart';
import { ChartEntry } from '@/types';
import DashboardLatest from './dashboard-latest';
import { Transaction } from '@/types/transaction';

export default function DashboardClient({
	chartData,
	transactions,
}: {
	chartData: ChartEntry[];
	transactions: Transaction[];
}) {
	return (
		<>
			<DashboardChart chartData={chartData} />
			<div className='pt-4'>
				<DashboardLatest transactions={transactions} />
			</div>
		</>
	);
}
