"use client";

import { useEffect, useState } from "react";

import { getClasses } from "@/actions/classes";
import { createPayment, updatePayment } from "@/actions/payments";
import { type SelectClassType } from "@/schemas/classes";
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
  onSuccess?: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  triggerText = "Add Payment",
  triggerIcon = <DollarSign />,
  defaultValues,
  openState,
  onOpenChange,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(openState || false);
  const [classes, setClasses] = useState<SelectClassType[]>([]);

  const { title, description } = defaultValues
    ? {
        title: "Edit Payment",
        description: "Update payment details",
      }
    : {
        title: "Add Payment",
        description: "Create a new payment record",
      };

  // Load classes for the select dropdown
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const result = await getClasses();
        if (result.success) {
          setClasses(result.data.rows);
        }
      } catch (error) {
        console.error("Error loading classes:", error);
      }
    };

    const isDialogOpen = openState !== undefined ? openState : isOpen;
    if (isDialogOpen) {
      loadClasses();
    }
  }, [openState, isOpen]);

  const handleUpdate = async (data: PaymentDataType) => {
    const response = await updatePayment(defaultValues?.id || "", data);

    if (!defaultValues?.id) {
      return;
    }

    if (response.success) {
      toast.success("Payment updated successfully");
      onSuccess?.();
      onClose();
    } else {
      toast.error(response.error || "Failed to update payment");
    }
  };

  const handleSubmit = async (data: PaymentDataType) => {
    if (defaultValues?.id) {
      await handleUpdate(data);
      return;
    }

    const response = await createPayment(data);

    if (response.success) {
      toast.success("Payment created successfully");
      onSuccess?.();
      onClose();
    } else {
      toast.error(response.error || "Failed to create payment");
    }
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <PaymentFormProvider
          onSubmit={handleSubmit}
          defaultValues={defaultValues?.data}
        >
          {(form) => (
            <>
              <PaymentFormFields form={form} classes={classes} />
              <DialogFooter className="border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {defaultValues?.id ? "Update Payment" : "Add Payment"}
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
