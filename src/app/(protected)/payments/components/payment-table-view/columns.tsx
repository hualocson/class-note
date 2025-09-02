import { PaymentStatus } from "@/enums";
import { formatServerDate } from "@/lib/format-date";
import formatPrice from "@/lib/format-price";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { makeColumns } from "@/components/common/date-table/hooks/useDataTable";
import RowActions from "@/components/common/date-table/row-actions";

import { PaymentType } from "./type";

const BADGE_COLORS = {
  [PaymentStatus.PAID]: "bg-green-500/20 text-green-500",
  [PaymentStatus.PENDING]: "bg-amber-500/20 text-amber-500",
  [PaymentStatus.CANCELLED]: "bg-red-500/20 text-red-500",
};

const StatusBadge = ({ status }: { status: PaymentType["status"] }) => {
  return (
    <span
      className={cn(
        BADGE_COLORS[status],
        "rounded-md px-1.5 py-0.5 font-mono text-xs"
      )}
    >
      {status}
    </span>
  );
};

const actionCol: ColumnDef<PaymentType> = {
  id: "action-col",
  enableHiding: false,
  enableSorting: false,
  cell: ({ row, table }) => <RowActions row={row} meta={table.options.meta} />,
};

const checkboxCol: ColumnDef<PaymentType> = {
  id: "select",
  header: ({ table }) => (
    <div className="min-w-12 px-0 pr-4 text-center">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  ),
  cell: ({ row }) => (
    <div className="pr-4 text-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  ),
  enableSorting: false,
  enableHiding: false,
};

/**
 * display: short id, date, class, amount, status, notes, updated at, created at
 */

const columns = makeColumns<PaymentType>([
  checkboxCol,
  {
    header: "Short ID",
    accessorKey: "id",
    cell: ({ row }) => {
      return (
        <p>
          {row.original.id.slice(0, 3)}...{row.original.id.slice(-4)}
        </p>
      );
    },
  },
  {
    header: "Class",
    id: "class",
    accessorKey: "class",
    cell: ({ row }) => {
      const classData = row.original.class;
      return (
        <div className="flex items-center gap-1 truncate">
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: classData.color ?? "transparent" }}
          />
          <p> {classData.name} </p>
          <span className="text-muted-foreground font-mono">
            ({classData.code})
          </span>
        </div>
      );
    },
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => {
      return (
        <p className="truncate">
          {formatServerDate(row.original.date).format("DD/MM/YYYY HH:mm")}
        </p>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <p className="font-mono font-semibold">
          {formatPrice(row.original.amount)}
        </p>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return <StatusBadge status={row.original.status} />;
    },
  },
  {
    header: "Notes",
    accessorKey: "notes",
    cell: ({ row }) => {
      return <p>{row.original.notes}</p>;
    },
  },
  actionCol,
]);

export default columns;
