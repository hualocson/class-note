"use client";

import { SelectClassType } from "@/schemas/classes";
import { type SelectPayment } from "@/schemas/payments";

import { PaymentDataType } from "../form/schema";
import PaymentCard from "./PaymentCard";

interface PaymentsGridProps {
  payments: (SelectPayment & {
    class: Pick<SelectClassType, "name" | "code" | "color">;
  })[];
  onEdit: (payment: { id?: string; data: PaymentDataType }) => void;
  onDelete: (id: string) => void;
}

const PaymentsGrid: React.FC<PaymentsGridProps> = ({
  payments,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {payments.map((payment) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PaymentsGrid;
