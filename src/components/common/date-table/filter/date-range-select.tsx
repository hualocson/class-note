"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  endOfDay,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
} from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface IDateRange {
  from: Date;
  to: Date;
  label: string;
}

export interface DateRangeSelectorProps {
  value?: Omit<IDateRange, "label">;
  onValueChange?: (range: IDateRange) => void;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export const DEFAULT_PRESET_RANGE = {
  label: "All time",
  from: new Date(2020, 0, 1), // Adjust this date as needed
  to: endOfDay(new Date()),
};

export const PRESET_RANGES: IDateRange[] = [
  {
    label: "Today",
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  },
  {
    label: "Yesterday",
    from: startOfDay(subDays(new Date(), 1)),
    to: endOfDay(subDays(new Date(), 1)),
  },
  {
    label: "Last 24 hours",
    from: subDays(new Date(), 1),
    to: new Date(),
  },
  {
    label: "Last 7 days",
    from: startOfDay(subDays(new Date(), 7)),
    to: endOfDay(new Date()),
  },
  {
    label: "Last 14 days",
    from: startOfDay(subDays(new Date(), 14)),
    to: endOfDay(new Date()),
  },
  {
    label: "Last 30 days",
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date()),
  },

  {
    label: "This month",
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  },
  {
    label: "Year to date",
    from: startOfYear(new Date()),
    to: endOfDay(new Date()),
  },
  DEFAULT_PRESET_RANGE,
];

const convertToIDateRange = (range?: Omit<IDateRange, "label">): IDateRange => {
  if (!range) {
    return DEFAULT_PRESET_RANGE;
  }

  for (const preset of PRESET_RANGES) {
    if (
      new Date(preset.from).getTime() <= new Date(range.from).getTime() &&
      new Date(preset.to).getTime() >= new Date(range.to).getTime()
    ) {
      return preset;
    }
  }

  return DEFAULT_PRESET_RANGE;
};

export function DateRangeSelector({
  value,
  onValueChange,
  className,
  variant = "default",
  size = "default",
}: DateRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = React.useState<IDateRange>(
    convertToIDateRange(value)
  );
  const [isOpen, setIsOpen] = React.useState(false);

  // sync local state with value
  React.useEffect(() => {
    setSelectedRange(convertToIDateRange(value));
  }, [value]);

  const handleRangeSelect = (range: IDateRange) => {
    setSelectedRange(range);
    onValueChange?.(range);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("min-w-[200px] justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {/* display label */}
            <span className="truncate">{selectedRange.label}</span>
          </div>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="h-48 w-64 overflow-y-auto p-0"
        align="start"
        sideOffset={4}
      >
        <div className="max-h-[400px] overflow-y-auto">
          {PRESET_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => handleRangeSelect(range)}
              className={cn(
                "group relative h-8 w-full px-4 text-left text-sm transition-all duration-200 focus:outline-none",
                "hover:bg-white/10 hover:shadow-lg hover:backdrop-blur-sm",
                "rounded-[inherit] backdrop-blur-sm",
                selectedRange.label === range.label
                  ? "text-foreground bg-white/20 backdrop-blur-md"
                  : "text-popover-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium transition-colors duration-200">
                  {range.label}
                </span>
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
