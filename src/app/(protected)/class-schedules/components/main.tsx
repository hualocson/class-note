"use client";

import { useState } from "react";

import useClassScheduleActions from "@/hooks/useClassScheduleActions";
import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import PageHeader from "@/components/common/PageHeader";

import ClassScheduleDialog from "./ClassScheduleDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ClassScheduleDataType } from "./form/schema";
import SchedulesListing from "./listing/SchedulesListing";

const MainClassSchedulesPage = () => {
  const [selectedSchedule, setSelectedSchedule] = useState<{
    id: string;
    data: ClassScheduleDataType;
  } | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const { deleteClassScheduleMutation } = useClassScheduleActions();

  const handleDeleteSchedule = async () => {
    if (!selectedSchedule) {
      return;
    }
    deleteClassScheduleMutation.mutate(selectedSchedule.id, {
      onSuccess: () => {
        setOpenConfirmDeleteDialog(false);
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Class Schedules"
        icon={<CalendarDays className="text-primary size-4" />}
      />
      <main className="mx-auto max-w-4xl space-y-4 py-4">
        <div className="flex justify-end gap-2 px-4">
          <Input placeholder="Search" />
          <Button
            onClick={() => {
              setSelectedSchedule(null);
              setOpenDialog(true);
            }}
          >
            <Plus />
            Add Schedule
          </Button>
          <ClassScheduleDialog
            openState={openDialog}
            onOpenChange={setOpenDialog}
            defaultValues={
              selectedSchedule
                ? {
                    id: selectedSchedule.id,
                    data: {
                      classId: selectedSchedule.data.classId,
                      rrule: selectedSchedule.data.rrule,
                      startDate: selectedSchedule.data.startDate,
                      endDate: selectedSchedule.data.endDate,
                      weeklyTimes: selectedSchedule.data.weeklyTimes,
                    },
                  }
                : null
            }
          />
        </div>
        <SchedulesListing
          onEdit={(schedule) => {
            setSelectedSchedule({
              id: schedule.id,
              data: schedule,
            });
            setOpenDialog(true);
          }}
          onDelete={(schedule) => {
            setSelectedSchedule({
              id: schedule.id,
              data: schedule,
            });
            setOpenConfirmDeleteDialog(true);
          }}
        />
      </main>
      <ConfirmDeleteDialog
        open={openConfirmDeleteDialog}
        onOpenChange={setOpenConfirmDeleteDialog}
        onConfirm={handleDeleteSchedule}
        isLoading={deleteClassScheduleMutation.isPending}
        title="Delete Class Schedule"
        description="Are you sure you want to delete this class schedule? This action cannot be undone."
      />
    </>
  );
};

export default MainClassSchedulesPage;
