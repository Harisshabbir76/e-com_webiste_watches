'use client'
import React from 'react';

interface DateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const dateRanges = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7days', label: 'Last 7 Days' },
  { value: 'month', label: 'Last Month' },
  { value: '90days', label: 'Last 90 Days' }
];

const DateFilters: React.FC<DateFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {dateRanges.map(({ value: val, label }) => (
        <button
          key={val}
          onClick={() => onChange(val)}
          className={`px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-full transition-all ${
            value === val
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'glass text-text-muted hover:text-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DateFilters;

