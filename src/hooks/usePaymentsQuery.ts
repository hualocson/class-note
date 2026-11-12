"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";

import { getPaymentStats, getPayments } from "@/actions/payments";
import {
  filtersFromColumns,
  parsePaymentPagination,
} from "@/lib/payment-filters";
import { useQuery } from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  Updater,
} from "@tanstack/react-table";

interface PaymentsState {
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

type PaymentsAction =
  | { type: "filtersChanged"; updater: Updater<ColumnFiltersState> }
  | { type: "paginationChanged"; updater: Updater<PaginationState> };

function paymentsReducer(
  state: PaymentsState,
  action: PaymentsAction
): PaymentsState {
  if (action.type === "filtersChanged") {
    return {
      columnFilters:
        typeof action.updater === "function"
          ? action.updater(state.columnFilters)
          : action.updater,
      pagination: { ...state.pagination, pageIndex: 0 },
    };
  }
  const pagination =
    typeof action.updater === "function"
      ? action.updater(state.pagination)
      : action.updater;
  return { ...state, pagination: parsePaymentPagination(pagination) };
}

export default function usePaymentsQuery() {
  const [state, dispatch] = useReducer(paymentsReducer, {
    columnFilters: [],
    pagination: { pageIndex: 0, pageSize: 10 },
  });
  const filters = useMemo(
    () => filtersFromColumns(state.columnFilters),
    [state.columnFilters]
  );
  const summaryQuery = useQuery({
    queryKey: ["payment-stats", filters],
    queryFn: async () => {
      const result = await getPaymentStats(filters);
      if (!result.success) {
        throw new Error(result.error || "Failed to load payment stats");
      }
      return result.data;
    },
  });
  const rowCount = summaryQuery.data?.rowCount;
  // Wait for the current summary, including mutation refetches, before clamping.
  const lastPage =
    summaryQuery.isSuccess && !summaryQuery.isFetching
      ? Math.max(
          0,
          Math.ceil(summaryQuery.data.rowCount / state.pagination.pageSize) - 1
        )
      : state.pagination.pageIndex;
  const pagination = useMemo(
    () => ({
      ...state.pagination,
      pageIndex: Math.min(state.pagination.pageIndex, lastPage),
    }),
    [state.pagination, lastPage]
  );

  const rowsQuery = useQuery({
    queryKey: ["payments-table", filters, pagination],
    queryFn: async () => {
      const result = await getPayments({ pagination, filters });
      if (!result.success) {
        throw new Error(result.error || "Failed to load payments");
      }
      return result.data;
    },
  });

  const setPagination: OnChangeFn<PaginationState> = useCallback((updater) => {
    dispatch({ type: "paginationChanged", updater });
  }, []);
  const setColumnFilters: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      dispatch({ type: "filtersChanged", updater });
    },
    []
  );

  useEffect(() => {
    if (pagination.pageIndex !== state.pagination.pageIndex) {
      dispatch({ type: "paginationChanged", updater: pagination });
    }
  }, [pagination, state.pagination.pageIndex]);

  return {
    rowsQuery,
    summaryQuery,
    rowCount,
    pagination,
    setPagination,
    columnFilters: state.columnFilters,
    setColumnFilters,
  };
}
