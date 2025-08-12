"use client";

import useClassesQuery from "@/hooks/useClassesQuery";
import { SelectClassType } from "@/schemas/classes";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  const classesQueryData = useClassesQuery();

  return (
    <Select
      onValueChange={(id) => {
        const classItem = classesQueryData.data?.rows.find(
          (classItem) => classItem.id === id
        );
        if (classItem) {
          onClassChange?.(classItem);
          onChange(id);
        }
      }}
      defaultValue={value}
    >
      <SelectTrigger className="w-full" disabled={classesQueryData.isPending}>
        <SelectValue placeholder="Select a class" />
        {classesQueryData.isPending && (
          <Loader2 className="ml-auto h-4 w-4 animate-spin" />
        )}
      </SelectTrigger>
      <SelectContent>
        {classesQueryData.data?.rows.map((classItem) => (
          <SelectItem key={classItem.id} value={classItem.id}>
            <span
              style={{
                backgroundColor: classItem.color ?? "black",
              }}
              className="size-3 rounded-full"
            ></span>
            <span>
              {classItem.name} ({classItem.code})
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClassesSelect;
