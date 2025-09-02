"use client";

import { useCallback } from "react";

import { Column, FacetedMultipleData } from "@tanstack/react-table";

import FilterItem from "./filter-item";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  data: FacetedMultipleData[];
}

const getSelectedValues = (
  q: string,
  selectedValues?: Array<{ queryKey: string; value: string[] }>
): Set<string> => {
  if (!selectedValues) {
    return new Set();
  }

  const array = selectedValues.find((v) => v.queryKey === q)?.value ?? [];

  return new Set(array);
};

export function DataTableFacetedMultipleFilter<TData, TValue>({
  column,
  data,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const fullSelectedValues = column?.getFilterValue() as
    | Array<{
        queryKey: string;
        value: string[];
      }>
    | undefined;

  const setFilter = useCallback(
    (queryKey: string, value: Set<string>) => {
      column?.setFilterValue(
        (prev?: Array<{ queryKey: string; value: string[] }>) => {
          const newSelectedFilters = prev ?? [];
          const index = newSelectedFilters.findIndex(
            (v) => v.queryKey === queryKey
          );

          if (index > -1) {
            newSelectedFilters[index] = { queryKey, value: Array.from(value) };
          } else {
            newSelectedFilters.push({ queryKey, value: Array.from(value) });
          }
          // organize the filters newSelectedFilters, filter option not in data options provided
          const finaleSelectedFilters: Array<{
            queryKey: string;
            value: string[];
          }> = [];
          newSelectedFilters.forEach((filter) => {
            const queryKey = filter.queryKey;
            const selectedValues = filter.value;
            const validOptions =
              data
                .find((d) => d.queryKey === queryKey)
                ?.options.map((o) => o.value) ?? [];

            const values = selectedValues.filter((v) =>
              validOptions.includes(v)
            );

            if (values.length) {
              finaleSelectedFilters.push({ queryKey, value: values });
            }
          });

          return finaleSelectedFilters.length > 0
            ? finaleSelectedFilters
            : undefined;
        }
      );
    },
    [column, data]
  );

  const onClearFilter = (queryKey: string) => {
    setFilter(queryKey, new Set());
  };

  const isDisabled = (queryKeys: string[]) => {
    const count = queryKeys.reduce((acc, key) => {
      const selectedValues = getSelectedValues(key, fullSelectedValues);
      return acc + selectedValues.size;
    }, 0);

    if (count === 0) {
      return false;
    }
    return true;
  };

  return (
    <div className="flex items-center gap-2 rounded-sm border p-1">
      {data.map((dataOptions, index) => {
        const selectedValues = getSelectedValues(
          dataOptions.queryKey,
          fullSelectedValues
        );
        const isLast = index === data.length - 1;
        let disabled = false;
        if (!isLast) {
          const listNextQueryKey = data
            .slice(index + 1, data.length)
            .map((d) => d.queryKey);

          disabled = isDisabled(listNextQueryKey);
        }

        return (
          <FilterItem
            key={dataOptions.queryKey}
            dataOptions={dataOptions}
            selectedValues={selectedValues}
            setSelectedValues={(value) => {
              setFilter(dataOptions.queryKey, value);
            }}
            disabled={disabled}
            onClearFilter={onClearFilter}
          />
        );
      })}
    </div>
  );
}
