"use client";

import { GetClassesSuccessResponseData } from "@/actions/types";
import type usePaymentsQuery from "@/hooks/usePaymentsQuery";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/common/date-table";
import { makeMeta } from "@/components/common/date-table/hooks/useDataTable";

import BulkChangePaymentStatusDialog from "./BulkChangePaymentStatusDialog";
import BulkDeletePaymentDialog from "./BulkDeletePaymentDialog";
import { genClassFilter, paymentStatusFilter } from "./TableFilter";
import columns from "./columns";
import { PaymentType } from "./type";

interface IPaymentTableProps {
  onAddPayment: () => void;
  onDeletePayment: (id: string) => void;
  onEditPayment: (payment: PaymentType) => void;
  query: ReturnType<typeof usePaymentsQuery>;
  canManagePayments: boolean;
  classes: GetClassesSuccessResponseData["rows"];
}

const PaymentTable: React.FC<IPaymentTableProps> = ({
  onAddPayment,
  onDeletePayment,
  onEditPayment,
  query,
  canManagePayments,
  classes,
}) => {
  const {
    rowsQuery,
    summaryQuery,
    rowCount,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
  } = query;
  const isLoading = rowsQuery.isPending || summaryQuery.isPending;

  if (rowsQuery.isError || summaryQuery.isError) {
    return (
      <div role="alert" className="space-y-2">
        <p>Unable to load payments.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void Promise.all([rowsQuery.refetch(), summaryQuery.refetch()]);
          }}
        >
          Retry payments
        </Button>
      </div>
    );
  }

  const meta = makeMeta<PaymentType>({
    menuItems: [
      {
        key: "edit",
        disabled: () => !canManagePayments,
        children: () => {
          return (
            <button className="flex w-full items-center gap-2">
              <PencilIcon />
              Edit
            </button>
          );
        },

        onClick: (row) => {
          onEditPayment(row);
        },
      },

      {
        key: "delete",
        children: () => {
          return (
            <button className="flex w-full items-center gap-2">
              <TrashIcon />
              Delete
            </button>
          );
        },

        onClick: (row) => {
          onDeletePayment(row.id);
        },
        confirmation: () => {
          return {
            title: "Delete Payment",
            description: "Are you sure you want to delete this payment?",
            cancelLabel: "Cancel",
            actionLabel: "Delete",
          };
        },
      },
    ],
  });

  return (
    <DataTable
      columns={columns}
      data={{
        rows: isLoading ? [] : (rowsQuery.data?.rows ?? []),
        rowCount: rowCount ?? 0,
      }}
      pagination={pagination}
      setPagination={setPagination}
      columnFilters={columnFilters}
      setSearchFilter={() => {}}
      setColumnFilters={setColumnFilters}
      isLoading={isLoading}
      meta={meta}
      tableActions={[
        <Button
          key="add-payment"
          size={"sm"}
          onClick={onAddPayment}
          disabled={!canManagePayments}
        >
          <PlusIcon />
          Add Payment
        </Button>,
      ]}
      rowSelectionDialogs={{
        bulkDelete: BulkDeletePaymentDialog,
        bulkChangeStatus: BulkChangePaymentStatusDialog,
      }}
      facetedFilters={[
        paymentStatusFilter,
        ...(canManagePayments ? [genClassFilter(classes)] : []),
      ]}
      dateRangeFilter={{
        key: "date",
        from: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
        to: new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
      }}
    />
  );
};

export default PaymentTable;
