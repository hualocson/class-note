"use client";

import { useRouter } from "next/navigation";

import { DollarSignIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface IClassActionsProps {
  onAddClass: () => void;
}

const ClassActions: React.FC<IClassActionsProps> = ({ onAddClass }) => {
  const router = useRouter();
  return (
    <div className="flex gap-2 *:flex-1">
      <Button variant="outline" onClick={() => router.push("/payments")}>
        <DollarSignIcon />
        Payment
      </Button>
      <Button onClick={onAddClass}>
        <Plus />
        Add Class
      </Button>
    </div>
  );
};

export default ClassActions;
