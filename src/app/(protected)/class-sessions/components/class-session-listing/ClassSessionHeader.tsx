"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ClassSessionHeaderProps {
  className?: string;
  onAddClassSession?: () => void;
}

const ClassSessionHeader: React.FC<ClassSessionHeaderProps> = ({
  className,
  onAddClassSession,
}) => {
  const router = useRouter();
  return (
    <div
      className={cn(
        "bg-background/70 safe-area-top safe-area-bottom sticky top-[65px] z-50 flex flex-col justify-between backdrop-blur-sm md:flex-row md:items-center",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold md:text-xl">All Sessions</h2>
      </div>
      <div className="flex items-center gap-3 *:flex-1 md:gap-4">
        <Button onClick={() => router.push("/class-schedules")}>
          <CalendarDays className="size-4" />
          Schedule
        </Button>
        <Button onClick={onAddClassSession}>
          <Plus className="size-4" />
          Create Session
        </Button>
      </div>
    </div>
  );
};

export default ClassSessionHeader;
