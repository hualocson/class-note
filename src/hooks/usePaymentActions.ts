"use client";

import {
  createPayment,
  deletePayment,
  updatePayment,
} from "@/actions/payments";
import { PaymentDataType } from "@/app/payments/components/form/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const usePaymentActions = () => {
  const queryClient = useQueryClient();

  const createPaymentMutation = useMutation({
    mutationFn: async (data: PaymentDataType) => {
      const result = await createPayment(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to create payment");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Payment created successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment-stats"] });
    },
    onError: () => {
      toast.error("Failed to create payment");
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async (data: { id: string; data: PaymentDataType }) => {
      const result = await updatePayment(data.id, data.data);

      if (!result.success) {
        throw new Error(result.error || "Failed to update payment");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Payment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment-stats"] });
    },
    onError: () => {
      toast.error("Failed to update payment");
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deletePayment(id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete payment");
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success("Payment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment-stats"] });
    },
    onError: () => {
      toast.error("Failed to delete payment");
    },
  });

  return {
    createPaymentMutation,
    updatePaymentMutation,
    deletePaymentMutation,
  };
};

export default usePaymentActions;
