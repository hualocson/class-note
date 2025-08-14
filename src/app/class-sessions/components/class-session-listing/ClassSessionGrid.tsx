"use client";

import { FC } from "react";

import { GetClassSessionsSuccessResponseData } from "@/actions/types";
import { isPast } from "date-fns";
import { CalendarIcon, HistoryIcon } from "lucide-react";

import { ClassSessionDataType } from "../form/schema";
import GroupGrid from "./GroupGrid";

const EmptyState = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">No class sessions found</p>
    </div>
  );
};

interface IClassSessionGridProps {
  classSessions: GetClassSessionsSuccessResponseData;
  onEditClassSession?: (data: {
    id?: string;
    data: ClassSessionDataType;
  }) => void;
  onDeleteClassSession?: (id: string) => void;
  onFinishClassSession?: (id: string) => void;
}

const ClassSessionGrid: FC<IClassSessionGridProps> = ({
  classSessions,
  onEditClassSession,
  onDeleteClassSession,
  onFinishClassSession,
}) => {
  // grouping by date (upcoming, past) use date-fns Record<"upcoming" | "past", ClassSessionDataType[]>
  const groupedClassSessions = classSessions.rows.reduce(
    (acc, classSession) => {
      const date = classSession.date;
      const dateKey = isPast(date) ? "past" : "upcoming";
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(classSession);
      return acc;
    },
    {} as Record<
      "upcoming" | "past",
      GetClassSessionsSuccessResponseData["rows"]
    >
  );
  return classSessions.rows.length > 0 ? (
    <div className="space-y-8 p-4">
      <GroupGrid
        title="Upcoming Sessions"
        icon={<CalendarIcon className="size-4" />}
        data={groupedClassSessions.upcoming}
        onEditClassSession={onEditClassSession}
        onDeleteClassSession={onDeleteClassSession}
        onFinishClassSession={onFinishClassSession}
        renderEmptyState={() => <EmptyState />}
      />

      <GroupGrid
        title="Past Sessions"
        icon={<HistoryIcon className="size-4" />}
        data={groupedClassSessions.past}
        onEditClassSession={onEditClassSession}
        onDeleteClassSession={onDeleteClassSession}
        onFinishClassSession={onFinishClassSession}
        renderEmptyState={() => <EmptyState />}
      />
    </div>
  ) : (
    <EmptyState />
  );
};

export default ClassSessionGrid;
