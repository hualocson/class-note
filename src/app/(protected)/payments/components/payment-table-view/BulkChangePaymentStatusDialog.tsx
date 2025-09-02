"use client";

import { useState } from "react";

import { batchUpdatePaymentsStatus } from "@/actions/payments";
import { getQueryClient } from "@/app/getQueryClient";
import { PaymentStatus } from "@/enums";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { type Table } from "@tanstack/react-table";
import {
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  Loader2Icon,
  RefreshCwIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PaymentType } from "./type";

const STATUS_OPTIONS = {
  [PaymentStatus.PAID]: {
    icon: CreditCardIcon,
    label: "Paid",
  },
  [PaymentStatus.PENDING]: {
    icon: ClockIcon,
    label: "Pending",
  },
  [PaymentStatus.CANCELLED]: {
    icon: XCircleIcon,
    label: "Cancelled",
  },
};

interface IProps<TData> {
  table: Table<TData>;
}

function BulkChangePaymentStatusDialog<TData extends PaymentType>({
  table,
}: IProps<TData>) {
  const selectedRowModel = table.getSelectedRowModel();

  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | null>(
    null
  );

  const queryClient = getQueryClient();
  const updatePaymentsStatusMutation = useMutation({
    mutationFn: async ({
      paymentIds,
      status,
    }: {
      paymentIds: string[];
      status: PaymentStatus;
    }) => {
      const result = await batchUpdatePaymentsStatus(paymentIds, status);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update payment status");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments-table"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["payment-stats"],
        refetchType: "all",
      });
      toast.success("Payment status updated successfully");
      setOpen(false);
      setSelectedStatus(null);
    },
  });

  const handleSubmit = () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    updatePaymentsStatusMutation.mutate({
      paymentIds: selectedRowModel.rows.map((r) => r.original.id),
      status: selectedStatus,
    });
  };

  return (
    selectedRowModel.rows.length > 0 && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="iconSm"
            disabled={selectedRowModel.rows.length === 0}
            className="relative"
          >
            <RefreshCwIcon className="size-4" />
            <span className="bg-primary absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full p-1 text-[10px] text-white">
              {selectedRowModel.rows.length}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Payment Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedRowModel.rows.length} selected
              payment(s).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="status-select"
                className="flex-shrink-0 truncate text-sm font-medium"
              >
                New Status
              </label>
              <Select
                value={selectedStatus || ""}
                onValueChange={(value) =>
                  setSelectedStatus(value as PaymentStatus)
                }
              >
                <SelectTrigger id="status-select" className="flex-grow">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_OPTIONS).map(
                    ([key, { label, icon: Icon }]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" />
                          {label}
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="relative"
              disabled={
                !selectedStatus || updatePaymentsStatusMutation.isPending
              }
            >
              {updatePaymentsStatusMutation.isPending && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2Icon className="animate-spin" />
                </span>
              )}
              <span
                className={cn(
                  "relative flex items-center gap-2",
                  updatePaymentsStatusMutation.isPending && "opacity-0"
                )}
              >
                <CheckCircleIcon className="size-4" />
                Update Status
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
}

export default BulkChangePaymentStatusDialog;
