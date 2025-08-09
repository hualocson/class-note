"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthSelectProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

const MonthSelect: React.FC<MonthSelectProps> = ({
  value = new Date(),
  onChange,
  className,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handlePrevMonth = () => {
    if (!date) {
      return;
    }
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1);
    setDate(newDate);
    onChange?.(newDate);
  };

  const handleNextMonth = () => {
    if (!date) {
      return;
    }
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1);
    if (newDate > new Date()) {
      return;
    }
    setDate(newDate);
    onChange?.(newDate);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "min-w-32 justify-center font-medium",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "MMMM yyyy") : "Select month"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="center">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }, (_, i) => {
              const monthDate = new Date(
                date?.getFullYear() || new Date().getFullYear(),
                i
              );
              const isCurrentMonth = new Date().getMonth() === i;
              const isSelected = date?.getMonth() === i;
              const isFutureMonth = monthDate > new Date();

              return (
                <Button
                  key={i}
                  variant={
                    isSelected
                      ? "default"
                      : isCurrentMonth
                        ? "secondary"
                        : "ghost"
                  }
                  className="w-full"
                  onClick={() => {
                    const newDate = new Date(
                      date?.getFullYear() || new Date().getFullYear(),
                      i
                    );
                    setDate(newDate);
                    onChange?.(newDate);
                  }}
                  disabled={isFutureMonth}
                >
                  {format(monthDate, "MMM (MM)")}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        disabled={
          date && new Date(date.getFullYear(), date.getMonth() + 1) > new Date()
        }
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default MonthSelect;
