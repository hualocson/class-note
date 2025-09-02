"use client";

import { FacetedFilter, Table } from "@tanstack/react-table";
import { RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DateRangeSelector } from "./filter/date-range-select";
import { DataTableFacetedMultipleFilter } from "./filter/faceted-multiple-filter";
import { DataTableFacetedFilter } from "./filter/facted-filter";
import SearchFilter from "./filter/search-filter";
import { DataTableViewOptions } from "./view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  facetedFilters?: FacetedFilter<TData>[];
  isFetching?: boolean;
  searchKeys?: Array<{ key: string; label: string }>;
  dateRangeFilter?: {
    key: string;
    from: number;
    to: number;
  };
  actions?: React.ReactNode[];
  rowSelectionDialogs?: Record<string, React.ReactNode>;
}

export function DataTableToolbar<TData>({
  table,
  facetedFilters = [],
  searchKeys = [],
  actions = [],
  rowSelectionDialogs,
  dateRangeFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const filteredDateValues = table
    .getState()
    .columnFilters.find((c) => c.id === dateRangeFilter?.key)
    ?.value as number[];

  const dateRange = filteredDateValues
    ? {
        from: new Date(filteredDateValues?.[0] ?? dateRangeFilter?.from),
        to: new Date(filteredDateValues?.[1] ?? dateRangeFilter?.to),
      }
    : undefined;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* filter with search */}
        {!!searchKeys.length && (
          <SearchFilter table={table} searchKeys={searchKeys} />
        )}
        {dateRangeFilter && (
          <DateRangeSelector
            size="sm"
            variant="outline"
            onValueChange={(values) => {
              const { from, to } = values;
              table
                .getColumn(dateRangeFilter.key)
                ?.setFilterValue([from?.getTime(), to?.getTime()]);
            }}
            value={dateRange}
          />
        )}
        {/* Filter with select */}
        {facetedFilters.map(({ key: keyStr, singleData, multipleData }) => {
          const key = keyStr.toString();
          return (
            table.getColumn(key) &&
            (singleData ? (
              <DataTableFacetedFilter
                key={`facetedFilterKey.${key}`}
                column={table.getColumn(key)}
                {...singleData}
              />
            ) : (
              multipleData && (
                <DataTableFacetedMultipleFilter
                  key={`facetedMultiFilterKey.${key}`}
                  column={table.getColumn(key)}
                  data={multipleData}
                />
              )
            ))
          );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            size={"icon"}
          >
            <RotateCcwIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {rowSelectionDialogs &&
          Object.entries(rowSelectionDialogs).map(([key, component]) => (
            <div key={key}>{component}</div>
          ))}
        <DataTableViewOptions table={table} />
        {actions.map((action, index) => (
          <div key={index} className="inline-block">
            {action}
          </div>
        ))}
      </div>
    </div>
  );
}
