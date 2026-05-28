import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookingActionsCell } from "./BookingActionsCell";

const STATUS_MAP = {
  booked: {
    label: "Booked",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  },
  "checked-in": {
    label: "Checked In",
    className:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  completed: {
    label: "Completed",
    className:
      "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  },
};

export const bookingColumns = [
  {
    accessorKey: "bookingNumber",
    header: "Booking No.",
    cell: ({ row }) => (
      <div className="font-mono font-semibold text-sm tracking-wide">
        {row.getValue("bookingNumber")}
      </div>
    ),
  },
  {
    accessorKey: "graduate",
    header: "Graduate",
    cell: ({ row }) => {
      const { graduate } = row.original;
      return (
        <div>
          <div className="font-medium">{graduate?.fullName ?? "—"}</div>
          <div className="text-xs text-muted-foreground">{graduate?.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "package",
    header: "Package",
    cell: ({ row }) => {
      const pkg = row.original.package;
      return <div className="font-medium">{pkg?.name ?? "—"}</div>;
    },
  },
  {
    accessorKey: "session",
    header: "Session",
    cell: ({ row }) => {
      const { session } = row.original;
      if (!session) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="text-sm">
          <div className="font-medium">
            {format(new Date(session.date), "dd MMM yyyy")}
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">
            {session.startTime} – {session.endTime}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("totalPrice");
      return (
        <div className="font-medium tabular-nums">
          {total != null ? `RM ${Number(total).toFixed(2)}` : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const config = STATUS_MAP[status] ?? { label: status, className: "" };
      return (
        <Badge className={cn("capitalize border font-medium", config.className)}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "bookedAt",
    header: "Booked At",
    cell: ({ row }) => {
      const date = row.getValue("bookedAt");
      if (!date) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
          {format(new Date(date), "dd MMM yyyy, hh:mm a")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <BookingActionsCell row={row} />,
  },
];
