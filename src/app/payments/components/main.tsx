"use client";

import { DollarSign } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import PaymentStatsSection from "./PaymentStatsSeciton";
import PaymentListingSection from "./payment-listing-section/PaymentListingSection";

const MainPaymentsPage = () => {
  return (
    <div className="bg-background text-foreground">
      {/* Reusable Header */}
      <PageHeader
        title="Payments"
        icon={<DollarSign className="text-primary size-4" />}
      >
        {/* Add Payment Button will be in the listing component */}
      </PageHeader>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6 pb-24">
        <PaymentStatsSection />
        {/* Payments List */}
        <PaymentListingSection />
      </main>
    </div>
  );
};

export default MainPaymentsPage;
