"use client";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaymentStatusType = "pending" | "paid" | "cancelled";

interface PaymentStatusSelectProps {
  value?: PaymentStatusType;
  onChange?: (value: PaymentStatusType) => void;
  className?: string;
}

const PaymentStatusSelect: React.FC<PaymentStatusSelectProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange?.(value as PaymentStatusType)}
    >
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PaymentStatusSelect;
