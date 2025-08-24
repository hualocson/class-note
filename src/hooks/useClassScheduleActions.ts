import {
  createBulkClassSessionBaseOnSchedule,
  createNewSchedule,
  deleteSchedule,
  updateSchedule,
} from "@/actions/class-schedules";
import { ClassScheduleDataType } from "@/app/(protected)/class-schedules/components/form/schema";
import { getQueryClient } from "@/app/getQueryClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useClassScheduleActions = () => {
  const queryClient = getQueryClient();

  const createClassScheduleMutation = useMutation({
    mutationFn: async (data: ClassScheduleDataType) => {
      const result = await createNewSchedule(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to create class schedule");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Class schedule created successfully");
      queryClient.invalidateQueries({ queryKey: ["class-schedules"] });
    },
    onError: () => {
      toast.error("Failed to create class schedule");
    },
  });

  const updateClassScheduleMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ClassScheduleDataType>;
    }) => {
      const result = await updateSchedule(id, data);
      if (!result.success) {
        throw new Error(result.error || "Failed to update class schedule");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Class schedule updated successfully");
      queryClient.invalidateQueries({ queryKey: ["class-schedules"] });
    },
    onError: () => {
      toast.error("Failed to update class schedule");
    },
  });

  const deleteClassScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteSchedule(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete class schedule");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Class schedule deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["class-schedules"] });
    },
    onError: () => {
      toast.error("Failed to delete class schedule");
    },
  });

  const createBulkClassSessionBaseOnScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await createBulkClassSessionBaseOnSchedule(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to create bulk class session");
      }

      return result.data;
    },
    onSuccess: (data) => {
      if (data.created > 0) {
        toast.success(`${data.created} class session created successfully`);
      } else {
        toast.info("No new class session created");
      }
    },
    onError: () => {
      toast.error("Failed to create bulk class session");
    },
  });

  return {
    createClassScheduleMutation,
    updateClassScheduleMutation,
    deleteClassScheduleMutation,
    createBulkClassSessionBaseOnScheduleMutation,
  };
};

export default useClassScheduleActions;
