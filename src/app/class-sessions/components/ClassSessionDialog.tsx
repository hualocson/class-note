"use client";

import React, { FC, useState } from "react";

import useClassSessionActions from "@/hooks/useClassSessionActions";
import { Plus } from "lucide-react";
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

import ClassSessionFields from "./form/ClassSessionFields";
import ClassSessionFormProvider from "./form/ClassSessionFormProvider";
import { ClassSessionDataType } from "./form/schema";

interface IClassSessionDialogProps {
  triggerText?: string;
  triggerIcon?: React.ReactNode;
  openState?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: {
    id?: string;
    data: ClassSessionDataType;
  } | null;
}
const ClassSessionDialog: FC<IClassSessionDialogProps> = ({
  triggerText = "Add Class Session",
  triggerIcon = <Plus />,
  openState,
  onOpenChange,
  defaultValues,
}) => {
  const [isOpen, setIsOpen] = useState(openState || false);
  const { createClassSessionMutation, updateClassSessionMutation } =
    useClassSessionActions();

  const { title, description } = defaultValues
    ? {
        title: "Edit Class Session",
        description: "Update class session details",
      }
    : {
        title: "Add Class Session",
        description: "Add new class session",
      };

  const handleUpdate = async (data: ClassSessionDataType) => {
    if (!defaultValues?.id) {
      toast.error("Class session not found");
      return;
    }

    updateClassSessionMutation.mutate(
      {
        id: defaultValues.id,
        data,
      },
      {
        onSuccess: () => {
          toast.success("Class session updated successfully");
          onClose();
        },
      }
    );
  };

  const handleSubmit = async (data: ClassSessionDataType) => {
    if (defaultValues?.id) {
      await handleUpdate(data);
    } else {
      createClassSessionMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Class session created successfully");
          onClose();
        },
      });
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
          j
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

        <ClassSessionFormProvider
          onSubmit={handleSubmit}
          defaultValues={defaultValues?.data}
        >
          {(form) => (
            <>
              <ClassSessionFields form={form} />
              <DialogFooter className="border-t pt-4">
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
                    createClassSessionMutation.isPending ||
                    updateClassSessionMutation.isPending
                  }
                >
                  {createClassSessionMutation.isPending ||
                  updateClassSessionMutation.isPending
                    ? "Saving..."
                    : defaultValues?.id
                      ? "Update Class Session"
                      : "Add Class Session"}
                </Button>
              </DialogFooter>
            </>
          )}
        </ClassSessionFormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ClassSessionDialog;
