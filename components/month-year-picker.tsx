'use client';

import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { getCurrentMonthAndYear } from '@/lib/utils/dateHelpers';

interface MonthYearPickerProps {
	initialMonth: number;
	initialYear: number;
	onMonthYearChangeAction: (month: number, year: number) => void;
	withMonth?: boolean;
}

export default function MonthYearPicker({
	initialMonth,
	initialYear,
	onMonthYearChangeAction,
	withMonth = true,
}: MonthYearPickerProps) {
	const { month: currentMonth, year: currentYear } = getCurrentMonthAndYear();
	const [month, setMonth] = useState(initialMonth);
	const [year, setYear] = useState(initialYear);

	const maxMonth = year === currentYear ? currentMonth : 12;

	// Generate array of years from current year - 5 to current
	const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
	const months = Array.from({ length: maxMonth }, (_, i) => i + 1);

	const handleMonthChange = (newMonth: string) => {
		const parsedMonth = parseInt(newMonth, 10); // Parse the string value to a number based 10
		setMonth(parsedMonth);
		onMonthYearChangeAction(parsedMonth, year);
	};

	const handleYearChange = (newYear: string) => {
		const parsedYear = parseInt(newYear);
		setYear(parsedYear);
		onMonthYearChangeAction(month, parsedYear);
	};

	return (
		<div className='flex gap-4 mb-4'>
			{withMonth && (
				<Select value={String(month)} onValueChange={handleMonthChange}>
					<SelectTrigger className='w-[calc(50%-8px)] md:w-[180px]'>
						<SelectValue placeholder='Select a month' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{months.map((m) => (
								<SelectItem key={m} value={String(m)}>
									{new Date(0, m - 1).toLocaleString('default', {
										month: 'long',
									})}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			)}

			<Select value={String(year)} onValueChange={handleYearChange}>
				<SelectTrigger className='w-[calc(50%-8px)] md:w-[180px]'>
					<SelectValue placeholder='Select a month' />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{years.map((y) => (
							<SelectItem key={y} value={String(y)}>
								{y}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
