"use client";

import { FC, useState } from "react";

import { GetClassSessionsSuccessResponseData } from "@/actions/types";
import { SessionStatus } from "@/enums";
import formatPrice from "@/lib/format-price";
import { format } from "date-fns";
import { CheckIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ClassSessionDataType } from "../form/schema";
import ClassSessionActions from "./ClassSessionActions";

const StatusBadge: FC<{
  status: SessionStatus;
}> = ({ status }) => {
  switch (status) {
    case SessionStatus.FINISHED:
      return (
        <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
          Finished
        </span>
      );
    case SessionStatus.CANCELLED:
      return (
        <span className="inline-flex items-center rounded-md border border-red-200 bg-red-500/10 px-2 py-1 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-500/20 dark:text-red-400">
          Cancelled
        </span>
      );
    case SessionStatus.PLANNED:
      return (
        <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-500/20 dark:text-blue-400">
          Planned
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-500/20 dark:text-gray-400">
          {status}
        </span>
      );
  }
};

interface IClassSessionCardProps {
  classSession: GetClassSessionsSuccessResponseData["rows"][number];
  onEditClassSession?: (data: {
    id?: string;
    data: ClassSessionDataType;
  }) => void;
  onDeleteClassSession?: (id: string) => void;
  onFinishClassSession?: (id: string) => void;
}

const ClassSessionCard: FC<IClassSessionCardProps> = ({
  classSession,
  onEditClassSession,
  onDeleteClassSession,
  onFinishClassSession,
}) => {
  const [isFinishing, setIsFinishing] = useState(false);
  return (
    <Card>
      <CardHeader>
        <div className="flex min-h-9 items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: classSession.class.color || "#e2e8f0" }}
            />
            <CardTitle>{classSession.class.name}</CardTitle>
          </div>
          {classSession.status !== SessionStatus.FINISHED && (
            <ClassSessionActions
              onEdit={() =>
                onEditClassSession?.({
                  id: classSession.id,
                  data: {
                    classId: classSession.classId,
                    date: classSession.date.toISOString(),
                    fee: classSession.fee,
                    notes: classSession.notes || undefined,
                  },
                })
              }
              onDelete={() => onDeleteClassSession?.(classSession.id)}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="relative pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Session Date
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {format(new Date(classSession.date), "dd/MM/yyyy HH:mm")}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Fee
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(classSession.fee)}
            </span>
          </div>

          {classSession.notes && (
            <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/30">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {classSession.notes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Class Code</span>
            <span className="font-mono">
              {classSession.class.code || "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {/* card footer for status and button finish class session */}
        <div className="flex min-h-9 w-full items-center justify-between">
          <StatusBadge status={classSession.status} />
          {classSession.status !== SessionStatus.FINISHED &&
            (isFinishing ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFinishing(false)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
                <Button
                  size={"icon"}
                  onClick={() => onFinishClassSession?.(classSession.id)}
                >
                  <CheckIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsFinishing(true)}>
                <CheckIcon />
                Finish
              </Button>
            ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClassSessionCard;
