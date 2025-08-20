"use client";

import classColorOptions from "@/app/constants/class-color";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ClassDataInputType, ClassDataOutputType } from "./schema";

interface IClassFormFieldsProps {
  form: UseFormReturn<ClassDataInputType, unknown, ClassDataOutputType>;
}

const ClassFormFields: React.FC<IClassFormFieldsProps> = ({ form }) => {
  return (
    <>
      {/* Class Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class Name *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Yoga Basics, Advanced Math"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Class Code */}
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class Code (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., YOGA101, MATH201"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Price */}
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price (VND) *</FormLabel>
            <FormControl>
              <Input
                placeholder="150000"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(Number(value));
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  field.onChange(Number(value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Color Picker */}
      <FormField
        control={form.control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class Color</FormLabel>
            <FormControl>
              <div className="mt-2 grid w-full grid-cols-6 place-items-center gap-4">
                {classColorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "size-10 cursor-pointer rounded-full border-2 transition-all",
                      field.value === option.value
                        ? "border-primary scale-110"
                        : "border-gray-400 hover:scale-105 hover:border-gray-500"
                    )}
                    style={{ backgroundColor: option.color }}
                    onClick={() => field.onChange(option.value)}
                    aria-label={`Select ${option.label} color`}
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ClassFormFields;
