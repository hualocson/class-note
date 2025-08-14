"use client";

import { useState } from "react";

import useClassAction from "@/hooks/useClassAction";
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

import ClassForm from "./form/ClassForm";
import ClassFormFields from "./form/ClassFormFields";
import { type ClassDataType } from "./form/schema";

interface ClassDialogProps {
  triggerText?: string;
  triggerIcon?: React.ReactNode;
  defaultValues?: {
    id?: string;
    data: ClassDataType;
  };
  openState?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ClassDialog: React.FC<ClassDialogProps> = ({
  triggerText = "Add Class",
  triggerIcon = <Plus className="h-4 w-4" />,
  defaultValues,
  openState,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(openState || false);
  const { createClassMutation, updateClassMutation } = useClassAction();

  const title = defaultValues?.id ? "Edit Class" : "Add Class";
  const description = defaultValues?.id
    ? "Update class details"
    : "Create a new class with the form below.";

  const handleUpdate = async (data: ClassDataType) => {
    if (!defaultValues?.id) {
      toast.error("Class not found");
      return;
    }

    updateClassMutation.mutate(
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

  const handleSubmit = async (data: ClassDataType) => {
    if (defaultValues?.id) {
      await handleUpdate(data);
      return;
    }

    createClassMutation.mutate(data, {
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

        <ClassForm onSubmit={handleSubmit} defaultValues={defaultValues?.data}>
          {(form) => (
            <>
              <div className="flex max-h-[50svh] w-full flex-col gap-3 overflow-y-auto px-6 md:gap-4">
                <ClassFormFields form={form} />
              </div>
              <DialogFooter className="border-t px-6 pt-4">
                {/* Form Actions */}
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
                    createClassMutation.isPending ||
                    updateClassMutation.isPending
                  }
                >
                  {createClassMutation.isPending ||
                  updateClassMutation.isPending
                    ? "Saving..."
                    : "Save"}
                </Button>
              </DialogFooter>
            </>
          )}
        </ClassForm>
      </DialogContent>
    </Dialog>
  );
};

export default ClassDialog;
