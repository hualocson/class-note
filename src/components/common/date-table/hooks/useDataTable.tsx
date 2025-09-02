"use client";

import React, { useEffect } from "react";

import {
  PaginationFetcher,
  UseQueryResult,
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFilter,
  ColumnFiltersState,
  FacetedFilter,
  OnChangeFn,
  PaginationData,
  PaginationState,
  TableOptions,
} from "@tanstack/react-table";

export function makeColumns<TData>(columns: ColumnDef<TData, unknown>[]) {
  return [...columns];
}

export function makeMeta<TData>(
  meta: TableOptions<TData>["meta"]
): TableOptions<TData>["meta"] {
  return {
    isTrash: (row) => {
      const deletedAt = (row as { deletedAt: string | null } | undefined)
        ?.deletedAt;
      if (deletedAt === undefined) {
        return undefined;
      }
      return deletedAt !== null;
    },
    ...meta,
  };
}

interface UseDataTableProps<TData> {
  queryKey: string;
  fetcher: PaginationFetcher<TData>;
  globalFilterKey?: string; // filter
  facetedFilters?: FacetedFilter<TData>[];
  // map filter key to query key
  queryMapKeys?: { [key in keyof TData | string]?: string };

  dateRangeFilter?: {
    key: string;
    from: number;
    to: number;
  };
}

interface UseDataTableResult<TData> {
  dataQuery: UseQueryResult<PaginationData<TData>>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  facetedFilters: FacetedFilter<TData>[];
  makeColumns: (columns: ColumnDef<TData>[]) => ColumnDef<TData>[];
  makeMeta: (meta: TableOptions<TData>["meta"]) => TableOptions<TData>["meta"];
  invalidateQuery: () => void;

  // handle search filter
  searchFilter?: { key: string; value: string };
  setSearchFilter: OnChangeFn<
    | {
        key: string;
        value: string;
      }
    | undefined
  >;
  columnFiltersForQuery: ColumnFilter[];
  dateRangeFilter:
    | {
        key: string;
        from: number;
        to: number;
      }
    | undefined;
}

export default function useDataTable<TData>({
  queryKey,
  fetcher,
  facetedFilters = [],
  queryMapKeys = {},
  dateRangeFilter,
}: UseDataTableProps<TData>): UseDataTableResult<TData> {
  const queryClient = useQueryClient();
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [searchFilterValue, setSearchFilterValue] = React.useState<
    | {
        key: string;
        value: string;
      }
    | undefined
  >();

  const columnFiltersForQuery = React.useMemo(() => {
    const columnFiltersForQuery: ColumnFilter[] = [];
    let filteredColumnFilters = columnFilters;
    // map date range filter
    if (
      dateRangeFilter &&
      columnFilters.find((f) => f.id === dateRangeFilter.key)
    ) {
      const values = columnFilters.find((c) => c.id === dateRangeFilter.key)
        ?.value as number[];

      const dateFrom = values?.[0] ?? dateRangeFilter.from;
      const dateTo = values?.[1] ?? dateRangeFilter.to;
      const dateRange = `${dateFrom}-${dateTo}`;

      const queryProps = {
        id: dateRangeFilter.key,
        value: dateRange,
      };
      columnFiltersForQuery.push(queryProps);
      filteredColumnFilters = filteredColumnFilters.filter(
        (f) => f.id !== dateRangeFilter.key
      );
    }

    // map filter options to column filters
    if (facetedFilters.length) {
      const queryFilter = filteredColumnFilters
        .map((filter) => {
          if (Array.isArray(filter.value)) {
            // check type of value is string[]
            if (typeof filter.value[0] === "string") {
              return {
                id: queryMapKeys[filter.id as keyof TData] ?? filter.id,
                value: filter.value as string[],
              };
            }

            if (typeof filter.value[0] === "number") {
              return {
                id: queryMapKeys[filter.id as keyof TData] ?? filter.id,
                value: filter.value as number[],
              };
            }

            // query for complex filter
            const data = filter.value as Array<{
              queryKey: string;
              value: string[];
            }>;
            const query = data.map((d) => ({
              id: d.queryKey,
              value: d.value,
            }));
            return query;
          }

          const id = queryMapKeys[filter.id as keyof TData] ?? filter.id;
          return {
            id,
            value: filter.value as string[],
          };
        })
        .flat();

      columnFiltersForQuery.push(...queryFilter);
    } else {
      columnFiltersForQuery.push(...filteredColumnFilters);
    }

    // map search key
    if (searchFilterValue && searchFilterValue.key && searchFilterValue.value) {
      columnFiltersForQuery.push({
        id: searchFilterValue.key,
        value: searchFilterValue.value,
      });
    }

    return columnFiltersForQuery;
  }, [columnFilters, searchFilterValue]);

  const dataQuery = useQuery({
    queryKey: [queryKey, pagination, columnFiltersForQuery],
    queryFn: () => fetcher(pagination, columnFiltersForQuery),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFiltersForQuery]);

  const invalidateQuery = React.useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [queryKey, pagination, columnFiltersForQuery],
    });
  }, [queryKey, pagination, queryClient, columnFiltersForQuery]);

  return {
    dataQuery,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    makeColumns,
    makeMeta,
    invalidateQuery,
    facetedFilters,
    columnFiltersForQuery,
    searchFilter: searchFilterValue,
    setSearchFilter: setSearchFilterValue,
    dateRangeFilter,
  };
}
