"use client";

import { useState } from "react";

import { getPayments } from "@/actions/payments";
import usePaymentActions from "@/hooks/usePaymentActions";
import { useQuery } from "@tanstack/react-query";

import PaymentDialog from "../PaymentDialog";
import { PaymentDataType } from "../form/schema";
import EmptyPaymentsState from "./EmptyPaymentsState";
import PaymentsGrid from "./PaymentsGrid";
import PaymentsHeader from "./PaymentsHeader";
import PaymentsLoadingState from "./PaymentsLoadingState";

const PaymentListingSection: React.FC = () => {
  const paymentsQueryData = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const result = await getPayments();

      if (!result.success) {
        throw new Error(result.error || "Failed to load payments");
      }

      return result.data;
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    id?: string;
    data: PaymentDataType;
  } | null>(null);

  const { deletePaymentMutation } = usePaymentActions();

  const handleDeletePayment = async (id: string) => {
    deletePaymentMutation.mutate(id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        paymentsQueryData.refetch();
      },
    });
  };

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsDialogOpen(true);
  };

  const handleEditPayment = (payment: {
    id?: string;
    data: PaymentDataType;
  }) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  return (
    <>
      <section>
        <PaymentsHeader
          paymentCount={paymentsQueryData.data?.rowCount ?? 0}
          onAddPayment={handleAddPayment}
        />

        {paymentsQueryData.isPending ? (
          <PaymentsLoadingState />
        ) : paymentsQueryData.data?.rowCount === 0 ? (
          <EmptyPaymentsState onAddPayment={handleAddPayment} />
        ) : (
          <PaymentsGrid
            payments={paymentsQueryData.data?.rows ?? []}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
          />
        )}
      </section>

      <PaymentDialog
        openState={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={selectedPayment !== null ? selectedPayment : undefined}
      />
    </>
  );
};

export default PaymentListingSection;
