"use client";

import * as React from "react";
import { ko } from "date-fns/locale";
import { format, addMonths, subMonths } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calender";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}) {
  const [startDate, setStartDate] = React.useState<Date | undefined>(date?.from);
  const [endDate, setEndDate] = React.useState<Date | undefined>(date?.to);
  const [startMonth, setStartMonth] = React.useState<Date>(
    date?.from || new Date()
  );
  const [endMonth, setEndMonth] = React.useState<Date>(
    date?.to || new Date()
  );

  React.useEffect(() => {
    if (date?.from) {
      setStartDate(date.from);
    }
    if (date?.to) {
      setEndDate(date.to);
    }
  }, [date]);

  const handleStartMonthChange = (increment: boolean) => {
    setStartMonth((prevMonth) =>
      increment ? addMonths(prevMonth, 1) : subMonths(prevMonth, 1)
    );
  };

  const handleEndMonthChange = (increment: boolean) => {
    setEndMonth((prevMonth) =>
      increment ? addMonths(prevMonth, 1) : subMonths(prevMonth, 1)
    );
  };

  const handleDateSelect = React.useCallback(
    (newDate: Date | undefined, isStart: boolean) => {
      if (isStart) {
        setStartDate(newDate);
        setDate({ from: newDate, to: endDate });
      } else {
        setEndDate(newDate);
        setDate({ from: startDate, to: newDate });
      }
    },
    [setDate, startDate, endDate]
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="start-date"
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate
                ? format(startDate, "yyyy년 MM월 dd일")
                : "시작일 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex justify-between items-center p-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleStartMonthChange(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>{format(startMonth, "yyyy년 MM월", { locale: ko })}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleStartMonthChange(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(newDate) => handleDateSelect(newDate, true)}
              month={startMonth}
              onMonthChange={setStartMonth}
              initialFocus
              locale={ko}
              lang="ko"
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="end-date"
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate
                ? format(endDate, "yyyy년 MM월 dd일")
                : "종료일 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex justify-between items-center p-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEndMonthChange(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>{format(endMonth, "yyyy년 MM월", { locale: ko })}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEndMonthChange(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(newDate) => handleDateSelect(newDate, false)}
              month={endMonth}
              onMonthChange={setEndMonth}
              initialFocus
              locale={ko}
              lang="ko"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
