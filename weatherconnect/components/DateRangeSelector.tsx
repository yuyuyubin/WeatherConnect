import React from 'react';
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { DateRange } from "react-day-picker"

interface DateRangeSelectorProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ dateRange, setDateRange }) => {
  const today = new Date();
  
  const setLastNDays = (n: number) => {
    const from = new Date();
    from.setDate(today.getDate() - n);
    setDateRange({ from, to: today });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Button onClick={() => setLastNDays(7)} variant="outline">최근 7일</Button>
        <Button onClick={() => setLastNDays(30)} variant="outline">최근 30일</Button>
        <Button onClick={() => setLastNDays(90)} variant="outline">최근 90일</Button>
      </div>
      <DatePickerWithRange 
        date={dateRange} 
        setDate={setDateRange}
      />
    </div>
  );
};

