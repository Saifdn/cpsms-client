import { SessionActionsCell } from "./SessionActionsCell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: "Start",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("startTime")}</span>
    ),
  },
  {
    accessorKey: "endTime",
    header: "End",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getValue("endTime")}</span>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("duration")} min</span>
    ),
  },
  {
    accessorKey: "bookedCount",
    header: "Bookings",
    cell: ({ row }) => {
      const booked = row.getValue("bookedCount") ?? 0;
      const capacity = row.original.capacity ?? 0;
      const pct = capacity > 0 ? Math.round((booked / capacity) * 100) : 0;
      const isFull = booked >= capacity;

      return (
        <div className="flex items-center gap-2 min-w-[90px]">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isFull ? "bg-destructive" : pct >= 75 ? "bg-amber-500" : "bg-green-500",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-sm tabular-nums text-muted-foreground whitespace-nowrap">
            {booked} / {capacity}
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
      const isAvailable = status === "available";
      return (
        <Badge variant={isAvailable ? "outline" : "destructive"}>
          {isAvailable ? "Available" : "Full"}
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
