import {
  createClassSession,
  deleteClassSession,
  finishClassSession,
  updateClassSession,
} from "@/actions/class-sessions";
import { ClassSessionDataType } from "@/app/class-sessions/components/form/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useClassSessionActions = () => {
  const queryClient = useQueryClient();
  const createClassSessionMutation = useMutation({
    mutationFn: async (data: ClassSessionDataType) => {
      const result = await createClassSession(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to create class session");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-sessions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateClassSessionMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ClassSessionDataType>;
    }) => {
      const result = await updateClassSession(id, data);

      if (!result.success) {
        throw new Error(result.error || "Failed to create class session");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-sessions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteClassSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteClassSession(id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete class session");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-sessions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const finishClassSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await finishClassSession(id);

      if (!result.success) {
        throw new Error(result.error || "Failed to finish class session");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-sessions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    createClassSessionMutation,
    updateClassSessionMutation,
    deleteClassSessionMutation,
    finishClassSessionMutation,
  };
};

export default useClassSessionActions;
