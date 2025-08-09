"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const QuickActionsSection = () => {
  const router = useRouter();
  return (
    <section>
      <h3 className="mb-4 text-lg font-medium">Quick Start</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button className="w-full" onClick={() => router.push("/classes")}>
          Class
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => router.push("/payments")}
        >
          Payment
        </Button>
      </div>
    </section>
  );
};

export default QuickActionsSection;
