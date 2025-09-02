"use client";

import React, { useCallback, useEffect } from "react";

import { Dialog } from "@radix-ui/react-dialog";
import { MenuItemConfirmation, Row, TableMeta } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionProps<TData> {
  row: Row<TData>;
  meta?: TableMeta<TData>;
}

interface MenuItemConfirmDialogProps {
  children: React.ReactNode;
  onAction: React.MouseEventHandler<HTMLButtonElement>;
}

export const MenuItemConfirmDialog: React.FC<
  MenuItemConfirmDialogProps & MenuItemConfirmation
> = ({ children, title, description, cancelLabel, actionLabel, onAction }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel ?? `Cancel`}</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>
            {actionLabel ?? `Confirm`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface MenuItemDialogProps {
  children: React.ReactNode;
  content: (close: () => void) => React.ReactNode;
  dropdownClose: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}
export function MenuItemDialog({
  children,
  content,
  onOpenChange,
  dropdownClose,
}: MenuItemDialogProps) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(open);
    }
  }, [open, onOpenChange]);

  const close = useCallback(() => {
    setOpen(false);
    dropdownClose();
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          dropdownClose();
        }
        setOpen(state);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="pt-10"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        {content(close)}
      </DialogContent>
    </Dialog>
  );
}

export default function RowActions<TData>({ row, meta }: ActionProps<TData>) {
  const [open, setOpen] = React.useState(false);
  if (
    meta?.menuItems?.length === 0 &&
    !meta.onDelete &&
    !meta.onRestore &&
    !meta.onUpdate
  ) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {meta?.quickActions?.(row.original)}
        {meta?.menuItems?.length && (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {meta?.menuItems?.map((item) =>
                item.confirmation !== undefined ? (
                  <MenuItemConfirmDialog
                    key={item.key}
                    onAction={() => item.onClick(row.original)}
                    {...item.confirmation(row.original)}
                  >
                    <DropdownMenuItem
                      disabled={item.disabled?.(row.original)}
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {item.children(row.original)}
                    </DropdownMenuItem>
                  </MenuItemConfirmDialog>
                ) : item.dialog !== undefined ? (
                  <MenuItemDialog
                    key={item.key}
                    onOpenChange={item.dialog(row.original).onOpenChange}
                    content={item.dialog(row.original).content}
                    dropdownClose={() => setOpen(false)} // When dialog is closed, close the dropdown
                  >
                    <DropdownMenuItem
                      disabled={item.disabled?.(row.original)}
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {item.children(row.original)}
                    </DropdownMenuItem>
                  </MenuItemDialog>
                ) : (
                  <DropdownMenuItem
                    key={item.key}
                    onClick={() => item.onClick(row.original)}
                    disabled={item.disabled?.(row.original)}
                  >
                    {item.children(row.original)}
                  </DropdownMenuItem>
                )
              )}
              {meta?.isTrash?.(row.original) === false && (
                <DropdownMenuItem
                  onClick={() => meta?.onDelete?.(row.original)}
                  disabled={meta?.customize?.disabledDelete?.(row.original)}
                >
                  {meta?.customize?.deleteLabel ?? `Delete`}
                </DropdownMenuItem>
              )}
              {meta?.isTrash?.(row.original) === true && (
                <DropdownMenuItem
                  onClick={() => meta?.onRestore?.(row.original)}
                  disabled={meta?.customize?.disabledRestore?.(row.original)}
                >
                  {meta?.customize?.restoreLabel ?? `Restore`}
                </DropdownMenuItem>
              )}
              {meta?.onUpdate !== undefined && (
                <DropdownMenuItem
                  onClick={() => meta?.onUpdate?.(row.original)}
                >
                  {meta?.customize?.updateLabel ?? `Update`}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </>
  );
}
