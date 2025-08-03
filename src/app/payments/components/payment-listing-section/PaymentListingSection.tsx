"use client";

import { useEffect, useState } from "react";

import { deletePayment, getPayments } from "@/actions/payments";
import { SelectClassType } from "@/schemas/classes";
import { type SelectPayment } from "@/schemas/payments";
import { toast } from "sonner";

import PaymentDialog from "../PaymentDialog";
import { PaymentDataType } from "../form/schema";
import EmptyPaymentsState from "./EmptyPaymentsState";
import PaymentsGrid from "./PaymentsGrid";
import PaymentsHeader from "./PaymentsHeader";
import PaymentsLoadingState from "./PaymentsLoadingState";

const PaymentListingSection: React.FC = () => {
  const [payments, setPayments] = useState<
    Array<
      SelectPayment & {
        class: Pick<SelectClassType, "name" | "code" | "color">;
      }
    >
  >([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    id?: string;
    data: PaymentDataType;
  } | null>(null);

  // Load payments on component mount
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const result = await getPayments();

      if (result.success) {
        setPayments(result.data.rows);
      } else {
        toast.error(result.error || "Failed to load payments");
      }
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      const result = await deletePayment(id);

      if (result.success) {
        toast.success("Payment deleted successfully");
        loadPayments(); // Reload the list
      } else {
        toast.error(result.error || "Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleRefresh = () => {
    loadPayments();
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

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedPayment(null);
    handleRefresh();
  };

  return (
    <>
      <section>
        <PaymentsHeader
          paymentCount={payments.length}
          onRefresh={handleRefresh}
          onAddPayment={handleAddPayment}
        />

        {loading ? (
          <PaymentsLoadingState />
        ) : payments.length === 0 ? (
          <EmptyPaymentsState onAddPayment={handleAddPayment} />
        ) : (
          <PaymentsGrid
            payments={payments}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
          />
        )}
      </section>

      <PaymentDialog
        openState={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={selectedPayment !== null ? selectedPayment : undefined}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default PaymentListingSection;
