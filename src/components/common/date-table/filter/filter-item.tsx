"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { FacetedMultipleData } from "@tanstack/react-table";
import { CheckIcon, PlusCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableFacetedFilterItemProps {
  dataOptions: FacetedMultipleData;
  selectedValues: Set<string>;
  setSelectedValues: (selectedValues: Set<string>) => void;
  disabled?: boolean;
  onClearFilter: (queryKey: string) => void;
}
const filterSelectedValues = (
  chosenValues: Set<string>,
  options: Array<string>
): Set<string> => {
  const filteredValues = Array.from(chosenValues).filter((v) =>
    options.some((option) => option === v)
  );

  return new Set(filteredValues);
};

function FilterItem({
  dataOptions,
  selectedValues,
  setSelectedValues,
  disabled,
  onClearFilter,
}: DataTableFacetedFilterItemProps) {
  const { queryKey, label, options, multiple } = dataOptions;

  const sortedOptions = useMemo(() => {
    return options.sort((a) => {
      if (selectedValues.has(a.value)) {
        return -1;
      }
      return 1;
    });
  }, [options, selectedValues]);

  return (
    <Popover key={queryKey}>
      <PopoverTrigger asChild>
        <Button
          disabled={!!disabled}
          variant="outline"
          size="sm"
          className="h-6 border-dashed"
        >
          <PlusCircleIcon className="h-4 w-4" />
          {label}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="outline"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="outline"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={label} />
          <CommandList>
            {selectedValues.size > 0 && (
              <CommandGroup className="bg-background sticky top-0 z-50">
                <CommandItem
                  onSelect={() => onClearFilter(queryKey)}
                  className="justify-center text-center"
                >
                  Clear filters
                </CommandItem>
              </CommandGroup>
            )}
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {sortedOptions.map((option, index) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={`${option.value}-${index}`}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        if (!multiple) {
                          selectedValues.clear();
                        }
                        selectedValues.add(option.value);
                      }
                      setSelectedValues(
                        filterSelectedValues(
                          selectedValues,
                          options.map((o) => o.value)
                        )
                      );

                      // const filterValues = Array.from(selectedValues);
                      // column?.setFilterValue(
                      //   (
                      //     prev?: {
                      //       queryKey: string;
                      //       value: string[];
                      //     }[]
                      //   ) => {
                      //     const isEmpty = filterValues.length === 0;
                      //     if (isEmpty && prev?.length === 1) {
                      //       return undefined;
                      //     }

                      //     if (!prev) {
                      //       return [
                      //         {
                      //           queryKey,
                      //           value: filterValues,
                      //         },
                      //       ];
                      //     }

                      //     // check if the queryKey already exists
                      //     const index = prev.findIndex(
                      //       (v) => v.queryKey === queryKey
                      //     );
                      //     if (index !== -1) {
                      //       if (isEmpty) {
                      //         return prev.filter(
                      //           (v) => v.queryKey !== queryKey
                      //         );
                      //       } else {
                      //         prev[index].value = filterValues;
                      //       }
                      //     } else {
                      //       prev.push({
                      //         queryKey,
                      //         value: filterValues,
                      //       });
                      //     }

                      //     return prev;
                      //   }
                      // );
                    }}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default FilterItem;
