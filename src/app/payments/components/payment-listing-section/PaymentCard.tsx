"use client";

import { PaymentStatus } from "@/enums";
import formatDate from "@/lib/format-date";
import formatPrice from "@/lib/format-price";
import { SelectClassType } from "@/schemas/classes";
import { type SelectPayment } from "@/schemas/payments";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PaymentDataType } from "../form/schema";
import PaymentActions from "./PaymentActions";

interface PaymentCardProps {
  payment: SelectPayment & {
    class: Pick<SelectClassType, "name" | "code" | "color">;
  };
  onEdit: (payment: { id?: string; data: PaymentDataType }) => void;
  onDelete: (id: string) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge
            variant="default"
            className="border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
          >
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-800 dark:bg-amber-500/20 dark:text-amber-400"
          >
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="destructive"
            className="border-red-200 bg-red-500/10 text-red-700 dark:border-red-800 dark:bg-red-500/20 dark:text-red-400"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEdit = () => {
    onEdit({
      id: payment.id,
      data: {
        date: new Date(payment.date).toISOString(),
        classId: payment.classId,
        amount: payment.amount,
        status: payment.status as PaymentStatus,
        notes: payment.notes || "",
      },
    });
  };

  const handleDelete = () => {
    onDelete(payment.id);
  };

  // Display class code if available, otherwise show class name
  const displayClassInfo = () => (
    <div className="flex items-center gap-2">
      <div
        className="h-2 w-2 rounded-full backdrop-opacity-30"
        style={{ backgroundColor: payment.class.color ?? "#f0f0f0" }}
      />
      <span className="text-sm font-medium">{payment.class.name}</span>
    </div>
  );

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {formatPrice(payment.amount)}
            </CardTitle>
            <CardDescription className="flex flex-col gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
              {formatDate(new Date(payment.date))}
              {getStatusBadge(payment.status)}
            </CardDescription>
          </div>
          <PaymentActions onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </CardHeader>

      <CardContent className="relative pt-0">
        {payment.notes && (
          <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/30">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {payment.notes}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Class</span>
          {displayClassInfo()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
