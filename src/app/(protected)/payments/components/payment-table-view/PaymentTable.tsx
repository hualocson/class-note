"use client";

import { useEffect } from "react";

import { getPayments } from "@/actions/payments";
import { GetClassesSuccessResponseData } from "@/actions/types";
import { PaymentStatus } from "@/enums";
import { PaginationFetcher } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/common/date-table";
import useDataTable, {
  makeMeta,
} from "@/components/common/date-table/hooks/useDataTable";

import BulkChangePaymentStatusDialog from "./BulkChangePaymentStatusDialog";
import BulkDeletePaymentDialog from "./BulkDeletePaymentDialog";
import { genClassFilter, paymentStatusFilter } from "./TableFilter";
import columns from "./columns";
import { PaymentType } from "./type";

const fetcher: PaginationFetcher<PaymentType> = async (pagination, filters) => {
  try {
    const response = await getPayments({
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      filters: {
        status: filters.find((f) => f.id === "status")?.value as [
          PaymentStatus,
          ...PaymentStatus[],
        ],
        dateRange: filters.find((f) => f.id === "date")?.value as string,
        classIds: filters.find((f) => f.id === "classIds")?.value as string[],
      },
    });
    if (!response.success) {
      console.error(response.error);
      return {
        rows: [],
        rowCount: 0,
      };
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch token transactions:", error);
    throw error;
  }
};

interface IPaymentTableProps {
  onAddPayment: () => void;
  onDeletePayment: (id: string) => void;
  onEditPayment: (payment: PaymentType) => void;
  onFilterChange: (filters: ColumnFiltersState) => void;
  classes: GetClassesSuccessResponseData["rows"];
}

const PaymentTable: React.FC<IPaymentTableProps> = ({
  onAddPayment,
  onDeletePayment,
  onEditPayment,
  onFilterChange,
  classes,
}) => {
  const {
    dataQuery,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    facetedFilters,
    searchFilter,
    setSearchFilter,
    dateRangeFilter,
  } = useDataTable({
    queryKey: "payments-table",
    fetcher,
    facetedFilters: [paymentStatusFilter, genClassFilter(classes)],
    dateRangeFilter: {
      key: "date",
      from: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
      to: new Date(new Date().setHours(23, 59, 59, 999)).getTime(),
    },
    queryMapKeys: {
      class: "classIds",
    },
  });

  useEffect(() => {
    onFilterChange(columnFilters);
  }, [columnFilters]);

  const meta = makeMeta<PaymentType>({
    menuItems: [
      {
        key: "edit",
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
    <>
      <DataTable
        columns={columns}
        data={dataQuery.data ?? { rows: [] }}
        pagination={pagination}
        setPagination={setPagination}
        columnFilters={columnFilters}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        setColumnFilters={setColumnFilters}
        isLoading={dataQuery.isPending}
        meta={meta}
        tableActions={[
          <Button key="add-payment" size={"sm"} onClick={onAddPayment}>
            <PlusIcon />
            Add Payment
          </Button>,
        ]}
        rowSelectionDialogs={{
          bulkDelete: BulkDeletePaymentDialog,
          bulkChangeStatus: BulkChangePaymentStatusDialog,
        }}
        facetedFilters={facetedFilters}
        dateRangeFilter={dateRangeFilter}
      />
    </>
  );
};

export default PaymentTable;
