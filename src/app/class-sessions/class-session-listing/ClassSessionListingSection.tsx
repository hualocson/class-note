"use client";

import { useState } from "react";

import { getClassSessions } from "@/actions/class-sessions";
import useClassSessionActions from "@/hooks/useClassSessionActions";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import ClassSessionDialog from "../components/ClassSessionDialog";
import { ClassSessionDataType } from "../components/form/schema";
import ClassSessionGrid from "./ClassSessionGrid";
import ClassSessionHeader from "./ClassSessionHeader";

const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="bg-muted h-6 w-32 rounded" />
                <div className="bg-muted h-3 w-3 rounded-full" />
              </div>
            </div>
            <div className="space-y-2 p-6 pt-0">
              <div className="flex items-center gap-2">
                <div className="bg-muted h-4 w-10 rounded" />
                <div className="bg-muted h-4 w-24 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-muted h-4 w-10 rounded" />
                <div className="bg-muted h-4 w-16 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ClassSessionListingSection = () => {
  const classSessionsQueryData = useQuery({
    queryKey: ["class-sessions"],
    queryFn: async () => {
      const result = await getClassSessions();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch class sessions");
      }

      return result.data;
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClassSession, setSelectedClassSession] = useState<{
    id?: string;
    data: ClassSessionDataType;
  } | null>(null);
  const { deleteClassSessionMutation, finishClassSessionMutation } =
    useClassSessionActions();

  const handleDeleteClassSession = (id: string) => {
    deleteClassSessionMutation.mutate(id, {
      onSuccess: () => {
        classSessionsQueryData.refetch();
        toast.success("Class session deleted successfully");
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to delete class session");
        }
      },
    });
  };

  const handleFinishClassSession = (id: string) => {
    finishClassSessionMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Class session finished successfully");
      },
      onError: (error) => {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to finish class session");
        }
      },
    });
  };

  const handleAddClassSession = () => {
    setSelectedClassSession(null);
    setIsDialogOpen(true);
  };

  const handleEditClassSession = (classSession: {
    id?: string;
    data: ClassSessionDataType;
  }) => {
    setSelectedClassSession(classSession);
    setIsDialogOpen(true);
  };

  return (
    <>
      <section className="flex w-full flex-col">
        <ClassSessionHeader
          onAddClassSession={handleAddClassSession}
          className="px-4"
        />
        {classSessionsQueryData.isLoading ? (
          <LoadingState />
        ) : (
          <ClassSessionGrid
            classSessions={
              classSessionsQueryData.data || { rows: [], rowCount: 0 }
            }
            onEditClassSession={handleEditClassSession}
            onDeleteClassSession={handleDeleteClassSession}
            onFinishClassSession={handleFinishClassSession}
          />
        )}
      </section>
      <ClassSessionDialog
        openState={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={
          selectedClassSession !== null ? selectedClassSession : undefined
        }
      />
    </>
  );
};

export default ClassSessionListingSection;
