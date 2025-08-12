"use client";

import { FC } from "react";

import { GetClassSessionsSuccessResponseData } from "@/actions/types";

import { ClassSessionDataType } from "../components/form/schema";
import ClassSessionCard from "./ClassSessionCard";

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
  return classSessions.rows.length > 0 ? (
    <div className="grid grid-cols-1 content-start gap-4 px-4 md:grid-cols-2 lg:grid-cols-3">
      {classSessions.rows.map((classSession) => (
        <ClassSessionCard
          key={classSession.id}
          classSession={classSession}
          onEditClassSession={onEditClassSession}
          onDeleteClassSession={onDeleteClassSession}
          onFinishClassSession={onFinishClassSession}
        />
      ))}
    </div>
  ) : (
    <EmptyState />
  );
};

export default ClassSessionGrid;
