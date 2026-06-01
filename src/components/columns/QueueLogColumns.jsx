import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_MAP = {
  waiting: {
    label: "Waiting",
    className:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  },
  called: {
    label: "Called",
    className:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  },
  "in-progress": {
    label: "In Progress",
    className:
      "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  },
  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  },
};

const formatTime = (value) => {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="text-sm tabular-nums whitespace-nowrap">
      {format(new Date(value), "dd MMM yyyy, hh:mm a")}
    </span>
  );
};

export const queueLogColumns = [
  {
    accessorKey: "queueNumber",
    header: "Queue No.",
    cell: ({ row }) => (
      <div className="font-mono font-bold text-sm tabular-nums">
        #{row.getValue("queueNumber")}
      </div>
    ),
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
    accessorKey: "checkInTime",
    header: "Check-in Time",
    cell: ({ row }) => formatTime(row.getValue("checkInTime")),
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => formatTime(row.getValue("startTime")),
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => formatTime(row.getValue("endTime")),
  },
  {
    accessorKey: "studio",
    header: "Studio",
    cell: ({ row }) => {
      const studio = row.original.studio;
      if (!studio) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="text-sm">
          <div className="font-medium">{studio.name}</div>
          {studio.location && (
            <div className="text-xs text-muted-foreground">{studio.location}</div>
          )}
        </div>
      );
    },
  },
];
