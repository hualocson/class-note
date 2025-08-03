"use client";

import { useRouter } from "next/navigation";

import { BookOpen } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";

import ClassListingSection from "./class-listing-section/ClassListingSection";

const MainClassesPage = () => {
  const router = useRouter();

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Reusable Header */}
      <PageHeader
        title="Classes"
        icon={<BookOpen className="text-primary h-6 w-6" />}
        onBack={() => router.push("/")}
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
