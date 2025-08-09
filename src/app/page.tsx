import { HomeIcon } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import ClassPaymentsStatsGrid from "./components/ClassPaymentsStatsGrid";
import QuickActionsSection from "./components/QuickActionsSection";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Reusable Header */}
      <PageHeader
        title="Class Payment Tracker"
        icon={<HomeIcon className="text-primary h-6 w-6" />}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <QuickActionsSection />
        <ClassPaymentsStatsGrid />
      </main>
    </div>
  );
}
