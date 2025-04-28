'use client';

import { useState } from 'react';

interface MonthYearPickerProps {
  initialMonth: number;
  initialYear: number;
  onMonthYearChangeAction: (month: number, year: number) => void;
}

export function MonthYearPicker({
  initialMonth,
  initialYear,
  onMonthYearChangeAction,
}: MonthYearPickerProps) {
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  // Generate array of years from current year - 5 to current
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setMonth(newMonth);
    onMonthYearChangeAction(newMonth, year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear);
    onMonthYearChangeAction(month, newYear);
  };

  return (
    <div className="flex gap-2 mb-4">
      <select
        value={month}
        onChange={handleMonthChange}
        className="rounded-md border border-gray-300 px-3 py-2"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>
            {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={handleYearChange}
        className="rounded-md border border-gray-300 px-3 py-2"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
