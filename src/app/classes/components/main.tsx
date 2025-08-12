"use client";

import { BookOpen } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import ClassListingSection from "./class-listing-section/ClassListingSection";

const MainClassesPage = () => {
  return (
    <div className="bg-background text-foreground">
      {/* Reusable Header */}
      <PageHeader
        title="Classes"
        icon={<BookOpen className="text-primary size-4" />}
      >
        {/* Add Class Button will be in the listing component */}
      </PageHeader>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6 pb-24">
        {/* Classes List */}
        <ClassListingSection />
      </main>
    </div>
  );
};

export default MainClassesPage;
