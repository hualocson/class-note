"use client";

import { useState } from "react";

import { deletePayments } from "@/actions/payments";
import { getQueryClient } from "@/app/getQueryClient";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { type Table } from "@tanstack/react-table";
import { Loader2, Trash2 } from "lucide-react";
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

import { PaymentType } from "./type";

interface IProps<TData> {
  table: Table<TData>;
}

function BulkDeletePaymentDialog<TData extends PaymentType>({
  table,
}: IProps<TData>) {
  const selectedRowModel = table.getSelectedRowModel();

  const [open, setOpen] = useState(false);

  const queryClient = getQueryClient();
  const deletePaymentsMutation = useMutation({
    mutationFn: async (paymentIds: string[]) => {
      const result = await deletePayments(paymentIds);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete payments");
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
      toast.success("Bookmark list detached successfully");
      setOpen(false);
    },
  });

  return (
    selectedRowModel.rows.length > 0 && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"destructive"}
            size={"iconSm"}
            disabled={selectedRowModel.rows.length === 0}
            className="relative"
          >
            <Trash2 className="size-4" />
            <span className="bg-destructive absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full p-1 text-[10px]">
              {selectedRowModel.rows.length}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action will remove {selectedRowModel.rows.length} item(s)
              from the payment list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                deletePaymentsMutation.mutate(
                  selectedRowModel.rows.map((r) => r.original.id)
                )
              }
              className="relative"
              disabled={deletePaymentsMutation.isPending}
            >
              {deletePaymentsMutation.isPending && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </span>
              )}
              <span
                className={cn(
                  "relative",
                  deletePaymentsMutation.isPending && "opacity-0"
                )}
              >
                Confirm
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
}

export default BulkDeletePaymentDialog;
