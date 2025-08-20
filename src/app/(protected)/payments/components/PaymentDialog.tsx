"use client";

import { useState } from "react";

import usePaymentActions from "@/hooks/usePaymentActions";
import { DollarSign } from "lucide-react";
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

import PaymentFormFields from "./form/PaymentFormFields";
import PaymentFormProvider from "./form/PaymentFormProvider";
import { type PaymentDataType } from "./form/schema";

interface PaymentDialogProps {
  triggerText?: string;
  triggerIcon?: React.ReactNode;
  defaultValues?: {
    id?: string;
    data: PaymentDataType;
  } | null;
  openState?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  triggerText = "Add Payment",
  triggerIcon = <DollarSign />,
  defaultValues,
  openState,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(openState || false);
  const { createPaymentMutation, updatePaymentMutation } = usePaymentActions();

  const { title, description } = defaultValues
    ? {
        title: "Edit Payment",
        description: "Update payment details",
      }
    : {
        title: "Add Payment",
        description: "Create a new payment record",
      };

  const handleUpdate = async (data: PaymentDataType) => {
    if (!defaultValues?.id) {
      toast.error("Payment not found");
      return;
    }

    updatePaymentMutation.mutate(
      {
        id: defaultValues.id,
        data,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleSubmit = async (data: PaymentDataType) => {
    if (defaultValues?.id) {
      await handleUpdate(data);
      return;
    }

    createPaymentMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onClose = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  return (
    <Dialog
      open={openState !== undefined ? openState : isOpen}
      onOpenChange={onOpenChange !== undefined ? onOpenChange : setIsOpen}
    >
      {openState === undefined && onOpenChange === undefined && (
        <DialogTrigger asChild>
          <Button>
            {triggerIcon}
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="px-0">
        <DialogHeader className="px-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <PaymentFormProvider
          onSubmit={handleSubmit}
          defaultValues={defaultValues?.data}
        >
          {(form) => (
            <>
              <div className="flex max-h-[50svh] w-full flex-col gap-3 overflow-y-auto px-6 md:gap-4">
                <PaymentFormFields form={form} />
              </div>
              <DialogFooter className="border-t px-6 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={
                    createPaymentMutation.isPending ||
                    updatePaymentMutation.isPending
                  }
                >
                  {createPaymentMutation.isPending ||
                  updatePaymentMutation.isPending
                    ? "Saving..."
                    : defaultValues?.id
                      ? "Update Payment"
                      : "Add Payment"}
                </Button>
              </DialogFooter>
            </>
          )}
        </PaymentFormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
