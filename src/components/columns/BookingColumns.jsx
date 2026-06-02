import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookingActionsCell } from "./BookingActionsCell";

const STATUS_MAP = {
  pending: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  },
  booked: {
    label: "Booked",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  },
  "checked-in": {
    label: "Checked In",
    className:
      "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800",
  },
  "in-progress": {
    label: "In Progress",
    className:
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
  },
  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  preparing: {
    label: "Preparing",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  },
  delivery: {
    label: "Delivery",
    className:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
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
