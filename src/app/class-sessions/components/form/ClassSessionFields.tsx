"use client";

import { useEffect, useState } from "react";

import { SelectClassType } from "@/schemas/classes";
import { UseFormReturn } from "react-hook-form";

import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import ClassesSelect from "@/components/common/ClassesSelect";

import {
  ClassSessionDataInputType,
  ClassSessionDataOutputType,
} from "./schema";

interface IClassSessionFieldsProps {
  form: UseFormReturn<
    ClassSessionDataInputType,
    unknown,
    ClassSessionDataOutputType
  >;
}

const ClassSessionFields = ({ form }: IClassSessionFieldsProps) => {
  const [selectedClass, setSelectedClass] = useState<SelectClassType | null>(
    null
  );

  useEffect(() => {
    if (selectedClass) {
      form.setValue("fee", Number(selectedClass.price));
    }
  }, [selectedClass, form]);

  return (
    <>
      {/* Class */}
      <FormField
        control={form.control}
        name="classId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class</FormLabel>
            <FormControl>
              <ClassesSelect
                value={field.value}
                onChange={field.onChange}
                onClassChange={setSelectedClass}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Date */}
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start session time *</FormLabel>
            <DateTimePicker
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => {
                // Preserve local timezone by creating a date string that includes timezone offset
                if (date) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  const hours = String(date.getHours()).padStart(2, "0");
                  const minutes = String(date.getMinutes()).padStart(2, "0");
                  const seconds = String(date.getSeconds()).padStart(2, "0");

                  // Create ISO-like string but preserve local timezone
                  const localDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                  field.onChange(localDateString);
                } else {
                  field.onChange(undefined);
                }
              }}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      {/* fee */}
      <FormField
        control={form.control}
        name="fee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fee (VND) *</FormLabel>
            <FormControl>
              <Input
                placeholder="150000"
                {...field}
                value={field.value?.toString() ?? "0"}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Notes */}
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add any notes here"
                {...field}
                rows={6}
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ClassSessionFields;
