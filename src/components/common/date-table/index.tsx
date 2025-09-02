"use client";

import React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  FacetedFilter,
  OnChangeFn,
  PaginationData,
  PaginationState,
  SortingState,
  type Table as TTable,
  TableMeta,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./pagination";
import { DataTableToolbar } from "./toolbar";

export type SelectionDialogProps<TData> = {
  table: TTable<TData>;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: PaginationData<TData>;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: OnChangeFn<ColumnFiltersState>;

  meta?: TableMeta<TData>;
  facetedFilters?: FacetedFilter<TData>[];
  tableActions?: React.ReactNode[];
  isLoading?: boolean;
  rowSelectionDialogs?: Record<string, React.FC<SelectionDialogProps<TData>>>;

  searchKeys?: Array<{ key: string; label: string }>;
  dateRangeFilter?: {
    key: string;
    from: number;
    to: number;
  };
  searchFilter?: {
    key: string;
    value: string;
  };
  setSearchFilter: OnChangeFn<
    | {
        key: string;
        value: string;
      }
    | undefined
  >;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  columnFilters,
  setColumnFilters,
  meta,
  facetedFilters,
  tableActions = [],
  isLoading = false,
  rowSelectionDialogs,
  dateRangeFilter,
  searchFilter,
  setSearchFilter,
  searchKeys = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchFilter,
    rowCount: data?.rowCount ?? -1,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
      globalFilter: searchFilter,
    },
    manualFiltering: true,
    manualPagination: true,
    enableGlobalFilter: true,
    meta: meta,
  });

  const components: Record<string, React.ReactNode> = rowSelectionDialogs
    ? Object.entries(rowSelectionDialogs).reduce(
        (acc, [key, component]) => {
          const Component = component;
          acc[key] = <Component table={table} />;
          return acc;
        },
        {} as Record<string, React.ReactNode>
      )
    : {};

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        facetedFilters={facetedFilters}
        actions={tableActions}
        rowSelectionDialogs={components}
        searchKeys={searchKeys}
        dateRangeFilter={dateRangeFilter}
      />
      <div className="overflow-hidden">
        <Table>
          {isLoading ? (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id + "loading"}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        <Skeleton className="h-5 w-full rounded-[8px]" />
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          ) : (
            <TableHeader className="bg-card">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}
          {isLoading ? (
            <TableBody>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`loading-row-${index}`}>
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <TableCell key={`loading-cell-${header.id}`}>
                      <div className="flex w-full flex-col">
                        <Skeleton
                          className={
                            "h-4 w-1/2 rounded-[8px] dark:bg-stone-600/20"
                          }
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-12 text-center"
                  >
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      {table.getRowModel().rows?.length ? (
        <DataTablePagination table={table} />
      ) : null}
    </div>
  );
}
