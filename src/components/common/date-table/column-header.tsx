"use client";

import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  EyeOff,
  Info,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  tooltip,
}: DataTableColumnHeaderProps<TData, TValue> &
  React.HTMLAttributes<HTMLDivElement> & {
    tooltip?: React.ReactNode;
  }) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-white/20"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            <RotateCcw className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Reset
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {!!tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="hover:bg-accent rounded-sm p-1">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
