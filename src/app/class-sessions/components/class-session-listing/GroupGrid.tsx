"use client";

import { FC, useDeferredValue, useMemo, useState } from "react";

import { GetClassSessionsSuccessResponseData } from "@/actions/types";

import { Input } from "@/components/ui/input";

import { ClassSessionDataType } from "../form/schema";
import ClassSessionCard from "./ClassSessionCard";

interface IGroupGridProps {
  title: string;
  icon: React.ReactNode;
  data: GetClassSessionsSuccessResponseData["rows"] | undefined;
  onEditClassSession?: (data: {
    id?: string;
    data: ClassSessionDataType;
  }) => void;
  onDeleteClassSession?: (id: string) => void;
  onFinishClassSession?: (id: string) => void;
  renderEmptyState: () => React.ReactNode;
}

const GroupGrid: FC<IGroupGridProps> = ({
  title,
  icon,
  data,
  onEditClassSession,
  onDeleteClassSession,
  onFinishClassSession,
  renderEmptyState,
}) => {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const filteredData = useMemo(() => {
    if (!data || !deferredSearch.trim()) {
      return data;
    }

    const searchLower = deferredSearch.toLowerCase();
    return data.filter((classSession) => {
      return (
        classSession.class.name?.toLowerCase().includes(searchLower) ||
        classSession.class.code?.toLowerCase().includes(searchLower) ||
        classSession.notes?.toLowerCase().includes(searchLower)
      );
    });
  }, [data, deferredSearch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 md:gap-4">
        <h3 className="flex shrink-0 items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {icon}
          {title}
        </h3>
        {data && data.length > 0 && (
          <Input
            placeholder="Search sessions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>
      {filteredData && filteredData.length > 0 ? (
        <div className="grid grid-cols-1 content-start gap-4 md:grid-cols-2">
          {filteredData.map((classSession) => (
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
        renderEmptyState()
      )}
    </div>
  );
};

export default GroupGrid;
