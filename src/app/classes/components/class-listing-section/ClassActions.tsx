"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface IClassActionsProps {
  onAddClass: () => void;
}

const ClassActions: React.FC<IClassActionsProps> = ({ onAddClass }) => {
  return (
    <div className="flex gap-2 *:flex-1">
      <Button onClick={onAddClass}>
        <Plus />
        Add Class
      </Button>
    </div>
  );
};

export default ClassActions;
