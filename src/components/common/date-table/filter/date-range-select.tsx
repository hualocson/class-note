"use client";

import * as React from "react";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker/date-range-picker";

export interface IDateRange {
  from: Date;
  to: Date;
}

export interface DateRangeSelectorProps {
  value?: Omit<IDateRange, "label">;
  onValueChange?: (range: IDateRange) => void;
}

export function DateRangeSelector({
  value,
  onValueChange,
}: DateRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = React.useState<
    IDateRange | undefined
  >(value);

  React.useEffect(() => {
    setSelectedRange(value);
  }, [value]);

  const handleCustomRangeUpdate = (values: {
    range: { from: Date; to: Date | undefined };
  }) => {
    if (values.range.to) {
      const customRange: IDateRange = {
        from: values.range.from,
        to: values.range.to,
      };
      setSelectedRange(customRange);
      onValueChange?.(customRange);
    }
  };

  return selectedRange ? (
    <DateRangePicker
      initialDateFrom={new Date()}
      initialDateTo={new Date()}
      onUpdate={handleCustomRangeUpdate}
      align="start"
    />
  ) : (
    <Button
      onClick={() => {
        setSelectedRange({
          from: new Date(),
          to: new Date(),
        });
      }}
      size={"sm"}
      variant={"outline"}
      className="border-dashed"
    >
      <CalendarIcon />
      Select date range
    </Button>
  );
}
