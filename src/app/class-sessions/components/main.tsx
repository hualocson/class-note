"use client";

import { CalendarDays } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import ClassSessionListingSection from "../class-session-listing/ClassSessionListingSection";

const MainClassSessionsPage = () => {
  return (
    <>
      <PageHeader
        title="Class Sessions"
        icon={<CalendarDays className="text-primary size-4" />}
      />
      <main className="mx-auto max-w-4xl pb-24">
        <ClassSessionListingSection />
      </main>
    </>
  );
};

export default MainClassSessionsPage;
