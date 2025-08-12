"use client";

import { PaymentStatus } from "@/enums";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentStatusSelectProps {
  value?: PaymentStatus;
  onChange?: (value: PaymentStatus) => void;
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
      onValueChange={(value) => onChange?.(value as PaymentStatus)}
    >
      <SelectTrigger className={cn("w-[180px]", className)}>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
        <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
        <SelectItem value={PaymentStatus.CANCELLED}>Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PaymentStatusSelect;
