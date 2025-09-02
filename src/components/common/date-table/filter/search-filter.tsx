"use client";

import { useState } from "react";

import { RowData, Table } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DebounceInput from "@/components/common/DebounceInput";

interface IProps<TData> {
  table: Table<TData>;
  searchKeys?: Array<{ key: string; label: string }>;
}

const SearchFilter = <TData extends RowData>({
  table,
  searchKeys = [],
}: IProps<TData>) => {
  const [activeFilterKey, setActiveFilterKey] = useState<string>(
    searchKeys[0]?.key
  );

  const placeholder =
    searchKeys.length > 1
      ? `Search by`
      : searchKeys.length === 1
        ? `Search by ${searchKeys[0].label}`
        : "No search keys";

  return (
    <div className="flex w-fit items-center gap-2">
      <DebounceInput
        placeholder={placeholder}
        defaultValue={""}
        onDebounceValueChange={(value) =>
          table.setGlobalFilter({
            key: activeFilterKey,
            value,
          })
        }
        delay={500}
        className="focus-visible:border-primary h-8 w-[150px] focus-visible:ring-0 focus-visible:ring-offset-0 lg:w-[250px]"
      />
      {searchKeys.length > 1 && (
        <Select
          onValueChange={(value) => setActiveFilterKey(value)}
          defaultValue={searchKeys[0].key}
        >
          <SelectTrigger className="focus-visible:border-primary h-8 focus-visible:ring-0">
            <div className="mr-2">
              <SelectValue placeholder="Search by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {searchKeys.map((search) => (
              <SelectItem key={search.key} value={search.key}>
                {search.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SearchFilter;
