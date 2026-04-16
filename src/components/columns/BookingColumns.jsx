import { Badge } from "@/components/ui/badge";
import { BookingActionsCell } from "./BookingActionsCell";

export const bookingColumns = [
  {
    accessorKey: "bookingNumber",
    header: "Booking No.",
    cell: ({ row }) => (
      <div className="font-mono font-medium text-sm">{row.getValue("bookingNumber")}</div>
    ),
  },
  {
    accessorKey: "graduate",
    header: "Graduate",
    cell: ({ row }) => {
      const graduate = row.original.graduate;
      return (
        <div>
          <div className="font-medium">{graduate?.fullName}</div>
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
      return <div className="font-medium">{pkg?.name}</div>;
    },
  },
  {
    accessorKey: "session",
    header: "Session",
    cell: ({ row }) => {
      const session = row.original.session;
      if (!session) return "-";
      return (
        <div className="text-sm">
          {new Date(session.date).toLocaleDateString("en-GB")} <br />
          <span className="text-muted-foreground">
            {session.startTime} - {session.endTime}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const variant = 
        status === "completed" ? "default" :
        status === "checked-in" ? "secondary" :
        status === "cancelled" ? "destructive" : "outline";

      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "bookedAt",
    header: "Booked At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("bookedAt"));
      return date.toLocaleDateString("en-GB", { 
        day: "2-digit", 
        month: "short", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <BookingActionsCell row={row} />,
  },
];