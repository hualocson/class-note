"use client";

import { useState } from "react";

import { CalendarDays } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import MiniCalendarSection from "./MiniCalendarSection";
import ClassSessionListingSection from "./class-session-listing/ClassSessionListingSection";

const MainClassSessionsPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <>
      <PageHeader
        title="Class Sessions"
        icon={<CalendarDays className="text-primary size-4" />}
      />
      <main className="mx-auto max-w-4xl pb-24">
        <MiniCalendarSection
          selectedDate={selectedDate}
          onSelectedDateChange={setSelectedDate}
        />
        <ClassSessionListingSection selectedDate={selectedDate} />
      </main>
    </>
  );
};

export default MainClassSessionsPage;
