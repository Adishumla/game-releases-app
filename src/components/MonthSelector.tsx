"use client";

import { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { format, addMonths, subMonths, parse } from "date-fns";

interface MonthSelectorProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  isPending: boolean;
}

export function MonthSelector({
  currentMonth,
  onMonthChange,
  isPending,
}: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate = parse(currentMonth, "yyyy-MM", new Date());

  const handleMonthChange = useCallback(
    (newDate: Date) => {
      setIsOpen(false);
      const formattedMonth = format(newDate, "yyyy-MM");
      onMonthChange(formattedMonth);
    },
    [onMonthChange]
  );

  const goToPreviousMonth = useCallback(() => {
    handleMonthChange(subMonths(selectedDate, 1));
  }, [selectedDate, handleMonthChange]);

  const goToNextMonth = useCallback(() => {
    handleMonthChange(addMonths(selectedDate, 1));
  }, [selectedDate, handleMonthChange]);

  const monthOptions = useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => {
      return subMonths(new Date(), i);
    });
  }, []);

  return (
    <div className="flex items-center space-x-4 text-black">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
          disabled={isPending}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-[180px] justify-start text-left font-normal ${
                isPending ? "opacity-50" : ""
              }`}
              disabled={isPending}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {format(selectedDate, "MMMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="grid grid-cols-3 gap-2 p-2">
              {monthOptions.map((date) => (
                <Button
                  key={date.toISOString()}
                  onClick={() => handleMonthChange(date)}
                  variant="outline"
                  className={`justify-start ${
                    format(date, "yyyy-MM") === currentMonth
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  disabled={isPending}
                >
                  {format(date, "MMM yyyy")}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextMonth}
          aria-label="Next month"
          disabled={isPending}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
