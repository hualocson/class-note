"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ClassSessionHeaderProps {
  className?: string;
  onAddClassSession?: () => void;
}

const ClassSessionHeader: React.FC<ClassSessionHeaderProps> = ({
  className,
  onAddClassSession,
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">All Sessions</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button className="flex items-center gap-2" onClick={onAddClassSession}>
          <Plus className="size-4" />
          Create Session
        </Button>
      </div>
    </div>
  );
};

export default ClassSessionHeader;
