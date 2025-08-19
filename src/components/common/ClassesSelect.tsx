"use client";

import { useState } from "react";

import useClassesQuery from "@/hooks/useClassesQuery";
import { cn } from "@/lib/utils";
import { SelectClassType } from "@/schemas/classes";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface IClassesSelectProps {
  value: string;
  onChange: (value: string) => void;
  onClassChange?: (classItem: SelectClassType) => void;
}

const ClassesSelect = ({
  value,
  onChange,
  onClassChange,
}: IClassesSelectProps) => {
  const [open, setOpen] = useState(false);
  const classesQueryData = useClassesQuery();

  const selectedClass = classesQueryData.data?.rows.find(
    (classItem) => classItem.id === value
  );

  const handleSelect = (id: string) => {
    const classItem = classesQueryData.data?.rows.find(
      (classItem) => classItem.id === id
    );
    if (classItem) {
      onClassChange?.(classItem);
      onChange(id);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} modal onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={classesQueryData.isPending}
        >
          {selectedClass ? (
            <div className="flex items-center gap-2">
              <span
                style={{
                  backgroundColor: selectedClass.color ?? "black",
                }}
                className="size-3 rounded-full"
              />
              <span>
                {selectedClass.name} ({selectedClass.code})
              </span>
            </div>
          ) : (
            "Select a class..."
          )}
          {classesQueryData.isPending ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search classes..." />
          <CommandList>
            <CommandEmpty>No class found.</CommandEmpty>
            <CommandGroup>
              {classesQueryData.data?.rows.map((classItem) => (
                <CommandItem
                  key={classItem.id}
                  value={`${classItem.name} ${classItem.code}`}
                  onSelect={() => handleSelect(classItem.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        backgroundColor: classItem.color ?? "black",
                      }}
                      className="size-3 rounded-full"
                    />
                    <span>
                      {classItem.name} ({classItem.code})
                    </span>
                  </div>

                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === classItem.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ClassesSelect;
