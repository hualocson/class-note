"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import {
  ClassDataInputType,
  ClassDataOutputType,
  ClassDataType,
  classDefaultValues,
  classSchema,
} from "./schema";

interface IClassFormProviderProps {
  onSubmit: (data: ClassDataType) => void;
  className?: string;
  defaultValues?: ClassDataType;
  children?: (
    form: UseFormReturn<ClassDataInputType, unknown, ClassDataOutputType>
  ) => React.ReactNode;
}

const ClassForm: React.FC<IClassFormProviderProps> = ({
  onSubmit,
  className,
  defaultValues,
  children,
}) => {
  const form = useForm<ClassDataInputType, unknown, ClassDataOutputType>({
    resolver: zodResolver(classSchema),
    defaultValues: defaultValues || classDefaultValues,
  });

  const handleSubmit = (data: ClassDataType) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-4", className)}
      >
        {children?.(form)}
      </form>
    </Form>
  );
};

export default ClassForm;
