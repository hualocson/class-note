"use client";

import { useEffect, useState } from "react";

import { PaymentStatus } from "@/enums";
import { cn } from "@/lib/utils";
import { type SelectClassType } from "@/schemas/classes";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import ClassesSelect from "@/components/common/ClassesSelect";

import { PaymentDataInput, PaymentDataOutput } from "./schema";

interface IPaymentFormFieldsProps {
  form: UseFormReturn<PaymentDataInput, unknown, PaymentDataOutput>;
}

const PaymentFormFields: React.FC<IPaymentFormFieldsProps> = ({ form }) => {
  const [selectedClass, setSelectedClass] = useState<SelectClassType | null>(
    null
  );

  useEffect(() => {
    if (selectedClass) {
      form.setValue("amount", Number(selectedClass.price));
    }
  }, [selectedClass, form]);

  return (
    <>
      {/* Date */}
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date *</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    disabled={(date) => date < new Date("1900-01-01")}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Class ID */}
      <FormField
        control={form.control}
        name="classId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Class *</FormLabel>
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

      {/* Amount */}
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount (VND) *</FormLabel>
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

      {/* Status */}
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status *</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentStatus.PENDING}>
                    {PaymentStatus.PENDING}
                  </SelectItem>
                  <SelectItem value={PaymentStatus.PAID}>
                    {PaymentStatus.PAID}
                  </SelectItem>
                  <SelectItem value={PaymentStatus.CANCELLED}>
                    {PaymentStatus.CANCELLED}
                  </SelectItem>
                </SelectContent>
              </Select>
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

export default PaymentFormFields;
