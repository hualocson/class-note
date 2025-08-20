"use client";

import { FC, useState } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { startOfWeek } from "date-fns";

import {
  MiniCalendar,
  MiniCalendarDays,
  MiniCalendarNavigation,
  MiniCalendarWeekDay,
} from "@/components/ui/shadcn-io/mini-calendar";

interface IMiniCalendarSectionProps {
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}

const MiniCalendarSection: FC<IMiniCalendarSectionProps> = ({
  selectedDate,
  onSelectedDateChange,
}) => {
  const isMobile = useIsMobile();
  const [startDate, setStartDate] = useState(
    startOfWeek(selectedDate, { weekStartsOn: 1 })
  );

  const onStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
    } else {
      setStartDate(startOfWeek(selectedDate, { weekStartsOn: 1 }));
    }
  };

  return (
    <section className="mt-2 flex w-full items-center justify-center">
      <MiniCalendar
        value={selectedDate}
        onValueChange={(date) => onSelectedDateChange(date ?? new Date())}
        days={isMobile ? 5 : 7}
        startDate={startDate}
        onStartDateChange={onStartDateChange}
      >
        <MiniCalendarNavigation direction="prev" />
        <MiniCalendarDays>
          {(date) => (
            <MiniCalendarWeekDay date={date} key={date.toISOString()} />
          )}
        </MiniCalendarDays>
        <MiniCalendarNavigation direction="next" />
      </MiniCalendar>
    </section>
  );
};

export default MiniCalendarSection;
