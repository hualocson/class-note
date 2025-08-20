"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitErrorHandler, UseFormReturn, useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import {
  ClassSessionDataInputType,
  ClassSessionDataOutputType,
  ClassSessionDataType,
  classSessionDefaultValues,
  classSessionSchema,
} from "./schema";

interface IClassSessionFormProviderProps {
  onSubmit: (data: ClassSessionDataType) => void;
  className?: string;
  defaultValues?: ClassSessionDataType;
  children?: (
    form: UseFormReturn<
      ClassSessionDataInputType,
      unknown,
      ClassSessionDataOutputType
    >
  ) => React.ReactNode;
}

const ClassSessionFormProvider = ({
  onSubmit,
  className,
  defaultValues,
  children,
}: IClassSessionFormProviderProps) => {
  const form = useForm<
    ClassSessionDataInputType,
    unknown,
    ClassSessionDataOutputType
  >({
    resolver: zodResolver(classSessionSchema),
    defaultValues: defaultValues || classSessionDefaultValues,
  });

  const handleSubmit = (data: ClassSessionDataType) => {
    onSubmit(data);
  };

  const handleOnError: SubmitErrorHandler<ClassSessionDataInputType> = (e) => {
    const date = form.getValues("date");
    console.log({ error: e.date, date });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleOnError)}
        className={cn("space-y-4", className)}
      >
        {children?.(form)}
      </form>
    </Form>
  );
};

export default ClassSessionFormProvider;
