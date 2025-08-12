import { HomeIcon } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import ClassPaymentsStatsGrid from "./components/ClassPaymentsStatsGrid";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* Reusable Header */}
      <PageHeader
        title="Class Payment Tracker"
        icon={<HomeIcon className="text-primary h-6 w-6" />}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-4 pb-24 md:py-6">
        <ClassPaymentsStatsGrid />
      </main>
    </div>
  );
}
