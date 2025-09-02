import { ReactNode } from "react";

import { ColumnFilter, PaginationState, RowData } from "@tanstack/table-core";

declare module "@tanstack/table-core" {
  interface Customize<TData> {
    deleteLabel?: ReactNode | string;
    restoreLabel?: ReactNode | string;
    updateLabel?: ReactNode | string;
    disabledDelete?: (row: TData) => boolean;
    disabledRestore?: (row: TData) => boolean;
  }
  interface MenuItemConfirmation {
    title: string;
    description: string;
    cancelLabel?: string;
    actionLabel?: string;
  }

  interface MenuItemDialog {
    content: (close: () => void) => JSX.Element;
    onOpenChange?: (isOpen: boolean) => void;
  }

  interface MenuItem<TData> {
    key: string;
    confirmation?: (row: TData) => MenuItemConfirmation;
    dialog?: (row: TData) => MenuItemDialog;
    children: (row: TData) => JSX.Element | string;
    onClick: (row: TData) => void;
    disabled?: (row: TData) => boolean;
  }

  interface PaginationData<TData> {
    rows: TData[];
    pageCount?: number;
    rowCount?: number;
  }

  interface TableMeta<TData extends RowData> {
    isTrash?: (row: TData) => boolean | undefined;
    customize?: Customize<TData>;
    onUpdate?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    onRestore?: (row: TData) => void;
    menuItems?: MenuItem<TData>[];
    quickActions?: (row: TData) => ReactNode;
  }
  interface FacetedSingleData {
    label: string;
    options: {
      value: string;
      label: string;
      icon?: React.ComponentType<{
        className?: string;
      }>;
    }[];
    multiple?: boolean;
  }

  interface FacetedMultipleData extends FacetedSingleData {
    queryKey: string;
  }

  interface FacetedFilter<TData> {
    key: keyof TData | string;
    singleData?: FacetedSingleData;
    multipleData?: Array<FacetedMultipleData>;
    asyncData?: Omit<FacetedSingleData, "options">;
  }
}

declare module "@tanstack/react-query" {
  type PaginationFetcher<TData> = (
    pagination: PaginationState,
    columnFilters: ColumnFilter[]
  ) => Promise<PaginationData<TData>>;
}
