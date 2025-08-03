"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitErrorHandler, UseFormReturn, useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import {
  PaymentDataInput,
  PaymentDataOutput,
  PaymentDataType,
  paymentDefaultValues,
  paymentSchema,
} from "./schema";

interface IPaymentFormProviderProps {
  onSubmit: (data: PaymentDataType) => void;
  className?: string;
  defaultValues?: PaymentDataType;
  children?: (
    form: UseFormReturn<PaymentDataInput, unknown, PaymentDataOutput>
  ) => React.ReactNode;
}

const PaymentFormProvider: React.FC<IPaymentFormProviderProps> = ({
  onSubmit,
  className,
  defaultValues,
  children,
}) => {
  const form = useForm<PaymentDataInput, unknown, PaymentDataOutput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: defaultValues || paymentDefaultValues,
  });

  const handleSubmit = (data: PaymentDataType) => {
    onSubmit(data);
  };

  const handleOnError: SubmitErrorHandler<PaymentDataInput> = (e) => {
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

export default PaymentFormProvider;
