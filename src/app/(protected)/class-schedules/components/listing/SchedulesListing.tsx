"use client";

import { getListScheduleForAllClasses } from "@/actions/class-schedules";
import { GetAllClassSchedulesSuccessResponseData } from "@/actions/types";
import dayjs from "@/configs/dayjs";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { RRule } from "rrule";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import ScheduleItemAction from "./ScheduleItemAction";

const ScheduleCard: React.FC<{
  schedule: GetAllClassSchedulesSuccessResponseData["rows"][number];
  onEdit: () => void;
  onDelete: () => void;
  onCreateBulkClassSession: () => void;
}> = ({ schedule, onEdit, onDelete, onCreateBulkClassSession }) => {
  const classData = schedule.class;
  if (!classData) {
    return null;
  }

  const rruleParsed = RRule.fromString(schedule.rrule);
  return (
    <Card className="group transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center gap-3">
            <div className="flex w-full flex-col items-stretch gap-1">
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full shadow-sm ring-2 ring-white"
                    style={{ backgroundColor: classData.color || "#6B7280" }}
                  />
                  <h3 className="font-semibold">
                    {classData.name || "Unknown Class"}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <ScheduleItemAction onEdit={onEdit} onDelete={onDelete} />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onCreateBulkClassSession}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                {classData.code || classData.classId}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium tracking-wide">
            Start Date
          </span>
          <span className="text-primary text-sm font-semibold">
            {dayjs(schedule.startDate).format("DD/MM/YYYY")}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-grow flex-col justify-end">
        {/* Week Info */}

        {/* show rrule and weekTimes */}
        <div className="py-2 text-sm capitalize">{rruleParsed.toText()}</div>
        <CardFooter>
          <div className="bg-muted/50 flex w-full flex-col gap-2 rounded-lg px-3 py-2">
            <span className="text-muted-foreground text-xs font-medium tracking-wide">
              Weekly Times
            </span>
            <div className="text-primary text-sm font-semibold">
              {Object.entries(schedule.weeklyTimes).map(([weekday, time]) => (
                <div key={weekday}>
                  {weekday} - {time.start} - {time.end}
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

interface ISchedulesListingProps {
  onEdit: (
    schedule: GetAllClassSchedulesSuccessResponseData["rows"][number]
  ) => void;
  onDelete: (
    schedule: GetAllClassSchedulesSuccessResponseData["rows"][number]
  ) => void;
  onCreateBulkClassSession: (scheduleId: string) => void;
}

const SchedulesListing: React.FC<ISchedulesListingProps> = ({
  onEdit,
  onDelete,
  onCreateBulkClassSession,
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["class-schedules"],
    queryFn: async () => {
      const response = await getListScheduleForAllClasses();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-muted h-4 w-4 rounded" />
                <div className="space-y-1">
                  <div className="bg-muted h-4 w-24 rounded" />
                  <div className="bg-muted h-3 w-16 rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/30 flex items-center gap-2 rounded-lg px-3 py-2">
                <div className="bg-muted h-3 w-12 rounded" />
                <div className="bg-muted h-4 w-20 rounded" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, scheduleIndex) => (
                  <div
                    key={scheduleIndex}
                    className="flex items-center justify-between"
                  >
                    <div className="bg-muted h-6 w-12 rounded-md" />
                    <div className="bg-muted h-4 w-24 rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error: Failed to load schedules</div>;
  }

  // empty state
  if (data.rows.length === 0) {
    return <div>No schedules found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.rows.map((schedule) => (
        <ScheduleCard
          key={schedule.id}
          schedule={schedule}
          onEdit={() => onEdit(schedule)}
          onDelete={() => onDelete(schedule)}
          onCreateBulkClassSession={() => onCreateBulkClassSession(schedule.id)}
        />
      ))}
    </div>
  );
};

export default SchedulesListing;
