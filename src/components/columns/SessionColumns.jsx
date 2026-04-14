import { SessionActionsCell } from "./SessionActionsCell";
import { Badge } from "@/components/ui/badge";

export const sessionColumns = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="font-medium">
          {date.toLocaleDateString("en-GB", { 
            day: "2-digit", 
            month: "short", 
            year: "numeric" 
          })}
        </div>
      );
    },
  },
  { accessorKey: "startTime", header: "Start Time" },
  { accessorKey: "endTime", header: "End Time" },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => `${row.getValue("duration")} min`,
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => `${row.getValue("capacity")} pax`,
  },
  {
    accessorKey: "bookedCount",
    header: "Booked",
    cell: ({ row }) => {
      const booked = row.getValue("bookedCount");
      const capacity = row.original.capacity;
      return `${booked} / ${capacity}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={status === "available" ? "default" : "destructive"}>
          {status === "available" ? "Available" : "Full"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <SessionActionsCell row={row} />,
  },
];