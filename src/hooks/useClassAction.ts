"use client";

import { createClass, deleteClass, updateClass } from "@/actions/classes";
import { ClassDataType } from "@/app/classes/components/form/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useClassAction = () => {
  const queryClient = useQueryClient();
  const createClassMutation = useMutation({
    mutationFn: async (data: ClassDataType) => {
      const result = await createClass(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to create class");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Class created successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: () => {
      toast.error("Failed to create class");
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: async (data: { id: string; data: ClassDataType }) => {
      const result = await updateClass(data.id, data.data);

      if (!result.success) {
        throw new Error(result.error || "Failed to update class");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Class updated successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: () => {
      toast.error("Failed to update class");
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteClass(id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete class");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Class deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: () => {
      toast.error("Failed to delete class");
    },
  });

  return {
    createClassMutation,
    updateClassMutation,
    deleteClassMutation,
  };
};
export default useClassAction;
