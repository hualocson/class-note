"use client";

import { useState } from "react";

import useClassScheduleActions from "@/hooks/useClassScheduleActions";
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

import ClassScheduleFields from "./form/ClassScheduleFields";
import ClassScheduleFormProvider from "./form/ClassScheduleFormProvider";
import { ClassScheduleDataType } from "./form/schema";

interface ClassScheduleDialogProps {
  triggerText?: string;
  triggerIcon?: React.ReactNode;
  titleProps?: string;
  descriptionProps?: string;
  openState?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: {
    id?: string;
    data: ClassScheduleDataType;
  } | null;
}

const ClassScheduleDialog: React.FC<ClassScheduleDialogProps> = ({
  triggerText = "Add Schedule",
  triggerIcon = <Plus className="h-4 w-4" />,
  titleProps = "Add Class Schedule",
  descriptionProps = "Create a new schedule for a specific week",
  openState,
  onOpenChange,
  defaultValues,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createClassScheduleMutation, updateClassScheduleMutation } =
    useClassScheduleActions();

  const { title, description } = defaultValues
    ? {
        title: "Edit Class Schedule",
        description: "Edit the schedule for a specific week",
      }
    : {
        title: titleProps,
        description: descriptionProps,
      };

  const handleOnUpdate = async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<ClassScheduleDataType>;
  }) => {
    if (!id) {
      toast.error("Schedule not found");
      return;
    }

    updateClassScheduleMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleOnSubmit = async (data: ClassScheduleDataType) => {
    if (defaultValues?.id) {
      await handleOnUpdate({ id: defaultValues.id, data });
    } else {
      createClassScheduleMutation.mutate(data, {
        onSuccess: () => {
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
          <Button>
            {triggerIcon}
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl px-0">
        <DialogHeader className="px-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ClassScheduleFormProvider
          onSubmit={handleOnSubmit}
          defaultValues={defaultValues?.data}
        >
          {(form) => (
            <>
              <div className="flex max-h-[60svh] w-full flex-col gap-3 overflow-y-auto px-6 md:gap-4">
                <ClassScheduleFields form={form} />
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
                    createClassScheduleMutation.isPending ||
                    updateClassScheduleMutation.isPending
                  }
                >
                  {createClassScheduleMutation.isPending ||
                  updateClassScheduleMutation.isPending
                    ? "Saving..."
                    : "Save Schedule"}
                </Button>
              </DialogFooter>
            </>
          )}
        </ClassScheduleFormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ClassScheduleDialog;
