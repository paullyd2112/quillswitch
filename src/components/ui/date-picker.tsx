import React from "react";

export interface DatePickerProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
}
export const DatePicker: React.FC<DatePickerProps> = ({ date, onDateChange }) => {
  return (
    <input
      type="date"
      value={date ? date.toISOString().split('T')[0] : ''}
      onChange={(e) => onDateChange(e.target.value ? new Date(e.target.value) : null)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
};