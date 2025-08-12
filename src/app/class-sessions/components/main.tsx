"use client";

import { useRouter } from "next/navigation";

import { CalendarDays } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import ClassSessionListingSection from "../class-session-listing/ClassSessionListingSection";

const MainClassSessionsPage = () => {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Class Sessions"
        icon={<CalendarDays className="text-primary size-4" />}
        onBack={() => router.push("/")}
      />
      <main className="mx-auto max-w-4xl px-4 py-6 pb-24">
        <ClassSessionListingSection />
      </main>
    </>
  );
};

export default MainClassSessionsPage;
