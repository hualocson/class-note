"use client";

import { useState } from "react";

import { createClass, updateClass } from "@/actions/classes";
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
  title?: string;
  description?: string;
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
  title = "Add New Class",
  description = "Create a new class with the form below.",
  defaultValues,
  openState,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(openState || false);

  const handleUpdate = async (data: ClassDataType) => {
    const response = await updateClass(defaultValues?.id || "", data);

    if (!defaultValues?.id) {
      return;
    }

    if (response.success) {
      toast.success("Class updated successfully");
      onClose();
    } else {
      toast.error(response.error);
    }
  };

  const handleSubmit = async (data: ClassDataType) => {
    if (defaultValues?.id) {
      await handleUpdate(data);
      return;
    }

    const response = await createClass(data);

    if (response.success) {
      toast.success("Class created successfully");
      onClose();
    } else {
      toast.error(response.error);
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

        <ClassForm onSubmit={handleSubmit} defaultValues={defaultValues?.data}>
          {(form) => (
            <>
              <ClassFormFields form={form} />
              <DialogFooter className="border-t pt-4">
                {/* Form Actions */}
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {defaultValues?.id ? "Update Class" : "Add Class"}
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
