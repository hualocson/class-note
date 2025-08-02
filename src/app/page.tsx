"use client";

import { useRouter } from "next/navigation";

import {
  BarChart3,
  BookOpen,
  DollarSign,
  HomeIcon,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";

export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Reusable Header */}
      <PageHeader
        title="Class Payment Tracker"
        icon={<HomeIcon className="text-primary h-6 w-6" />}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Quick Actions */}
        <section className="mb-12">
          <h3 className="mb-4 text-lg font-medium">Quick Start</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="w-full" onClick={() => router.push("/classes")}>
              Class
            </Button>
            <Button variant="secondary" className="w-full">
              Payment
            </Button>
          </div>
        </section>

        {/* Hero Section */}
        <section className="mb-12">
          <h2 className="mb-3 text-2xl font-semibold sm:text-3xl">
            Track Your Class Payments
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Keep organized with your educational expenses. Simple, efficient,
            and always accessible.
          </p>
        </section>

        {/* Stats Overview */}
        <section className="mb-12">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-muted-foreground mt-1 text-xs">Classes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-muted-foreground mt-1 text-xs">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-muted-foreground mt-1 text-xs">
                This Month
              </div>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="space-y-6">
          <h3 className="text-lg font-medium">Features</h3>

          <div className="grid gap-4">
            <div className="group border-border/50 hover:border-border rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                  <BookOpen className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-medium">Class Management</h4>
                  <p className="text-muted-foreground text-sm">
                    Add, edit, and organize your classes with instructor details
                    and payment status.
                  </p>
                </div>
              </div>
            </div>

            <div className="group border-border/50 hover:border-border rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                  <DollarSign className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-medium">Payment Tracking</h4>
                  <p className="text-muted-foreground text-sm">
                    Record payments, track due dates, and manage payment history
                    with receipts.
                  </p>
                </div>
              </div>
            </div>

            <div className="group border-border/50 hover:border-border rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                  <BarChart3 className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-medium">Analytics & Reports</h4>
                  <p className="text-muted-foreground text-sm">
                    View spending trends, generate reports, and track your
                    educational budget.
                  </p>
                </div>
              </div>
            </div>

            <div className="group border-border/50 hover:border-border rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                  <Smartphone className="text-primary h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-medium">Mobile First</h4>
                  <p className="text-muted-foreground text-sm">
                    Responsive design that works perfectly on all devices, from
                    mobile to desktop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
