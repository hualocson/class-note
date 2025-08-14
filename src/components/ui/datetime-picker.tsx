"use client";

import * as React from "react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [time, setTime] = React.useState(
    value ? format(value, "HH:mm:ss") : "00:00:00"
  );

  // Merge date & time when either changes
  React.useEffect(() => {
    if (date) {
      const [h, m, s] = time.split(":").map(Number);
      const combined = new Date(date);
      combined.setHours(h, m, s || 0);
      onChange(combined);
    } else {
      onChange(undefined);
    }
  }, [date, time]);

  return (
    <div className="flex items-center gap-2 *:flex-1">
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-32 justify-between font-normal"
          >
            {date ? format(date, "dd/MM/yyyy") : "Select date"}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
      <Input
        type="time"
        id="time-picker"
        step="1"
        defaultValue={
          value ? format(value, "HH:mm:00") : format(new Date(), "HH:mm:00")
        }
        onChange={(e) => setTime(e.target.value)}
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  );
}
