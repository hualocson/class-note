"use client";

import { useRouter } from "next/navigation";

import { DollarSignIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

const ClassActions: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => router.push("/payments")}>
        <DollarSignIcon />
        Payment
      </Button>
      <Button>
        <Plus />
        Add Class
      </Button>
    </div>
  );
};

export default ClassActions;
