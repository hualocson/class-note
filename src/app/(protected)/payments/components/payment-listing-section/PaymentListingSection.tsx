"use client";

import { useMemo, useState } from "react";

import { PaymentStatus } from "@/enums";
import useClassesQuery from "@/hooks/useClassesQuery";
import usePaymentActions from "@/hooks/usePaymentActions";
import { ColumnFiltersState } from "@tanstack/react-table";

import PaymentDialog from "../PaymentDialog";
import PaymentStatsSection from "../PaymentStatsSeciton";
import { PaymentDataType } from "../form/schema";
import PaymentTable from "../payment-table-view/PaymentTable";

const PaymentListingSection: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [columnFilters, setColumnFilters] = useState<
    ColumnFiltersState | undefined
  >();

  const [selectedPayment, setSelectedPayment] = useState<{
    id?: string;
    data: PaymentDataType;
  } | null>(null);

  const { deletePaymentMutation } = usePaymentActions();
  const classesQueryData = useClassesQuery();

  const handleDeletePayment = async (id: string) => {
    deletePaymentMutation.mutate(id, {
      onSuccess: () => {
        setIsDialogOpen(false);
      },
    });
  };

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsDialogOpen(true);
  };
  const filters = useMemo(() => {
    if (!columnFilters) {
      return undefined;
    }
    const status = columnFilters.find((c) => c.id === "status")?.value as
      | [PaymentStatus, ...PaymentStatus[]]
      | undefined;

    const dateRange = columnFilters.find((c) => c.id === "date")?.value as
      | number[]
      | undefined;
    const dateRangeString = dateRange
      ? `${dateRange[0]}-${dateRange[1]}`
      : undefined;

    const classIds = columnFilters.find((c) => c.id === "class")?.value as
      | string[]
      | undefined;

    return {
      dateRange: dateRangeString,
      status,
      classIds,
    };
  }, [columnFilters]);

  return classesQueryData.isPending ? (
    <>Loading...</>
  ) : classesQueryData.isSuccess ? (
    <>
      <PaymentStatsSection filters={filters} />
      <section>
        <PaymentTable
          onAddPayment={handleAddPayment}
          onDeletePayment={handleDeletePayment}
          onEditPayment={(data) => {
            setSelectedPayment({
              id: data.id,
              data: {
                date: data.date.toISOString(),
                classId: data.classId,
                amount: data.amount,
                status: data.status,
                notes: data.notes ?? undefined,
              },
            });
            setIsDialogOpen(true);
          }}
          onFilterChange={setColumnFilters}
          classes={classesQueryData.data.rows}
        />
      </section>

      <PaymentDialog
        openState={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultValues={selectedPayment !== null ? selectedPayment : undefined}
      />
    </>
  ) : (
    <>Error loading classes</>
  );
};

export default PaymentListingSection;
