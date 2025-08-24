"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, UseFormReturn, useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import {
  ClassScheduleDataInputType,
  ClassScheduleDataOutputType,
  ClassScheduleDataType,
  classScheduleDefaultValues,
  classScheduleSchema,
} from "./schema";

interface IClassScheduleFormProviderProps {
  onSubmit: (data: ClassScheduleDataType) => void;
  className?: string;
  defaultValues?: ClassScheduleDataType;
  children?: (
    form: UseFormReturn<
      ClassScheduleDataInputType,
      unknown,
      ClassScheduleDataOutputType
    >
  ) => React.ReactNode;
}

const ClassScheduleFormProvider = ({
  onSubmit,
  className,
  defaultValues,
  children,
}: IClassScheduleFormProviderProps) => {
  const form = useForm<
    ClassScheduleDataInputType,
    unknown,
    ClassScheduleDataOutputType
  >({
    resolver: zodResolver(classScheduleSchema),
    defaultValues: defaultValues || classScheduleDefaultValues,
  });

  const handleSubmit = (data: ClassScheduleDataType) => {
    onSubmit(data);
  };

  const onError = (errors: FieldErrors<ClassScheduleDataInputType>) => {
    console.log(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, onError)}
        className={cn("space-y-4", className)}
      >
        {children?.(form)}
      </form>
    </Form>
  );
};

export default ClassScheduleFormProvider;
