'use client';

import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (ranges: any) => {
    onChange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  const formatDateDisplay = () => {
    if (!startDate && !endDate) return 'Select your travel dates';
    if (startDate && !endDate) return format(startDate, 'MMM dd, yyyy');
    if (startDate && endDate) {
      return `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`;
    }
    return 'Select your travel dates';
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        When are you traveling?
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border rounded-lg cursor-pointer hover:border-teal-500 transition-colors"
      >
        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-teal-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-700">{formatDateDisplay()}</span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2">
          <DateRange
            ranges={[
              {
                startDate: startDate || new Date(),
                endDate: endDate || new Date(),
                key: 'selection',
              },
            ]}
            minDate={new Date()}
            onChange={handleSelect}
            months={2}
            direction="horizontal"
            className="border rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
