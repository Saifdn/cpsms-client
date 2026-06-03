import { FrameActionsCell } from "./FrameActionsCell";
import { Badge } from "@/components/ui/badge";

export const frameColumns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("description") || "—"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Ala-Carte Price",
    cell: ({ row }) => (
      <span className="tabular-nums font-semibold">
        RM {Number(row.getValue("price")).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("isActive");
      return (
        <Badge variant={active ? "outline" : "secondary"} className={active ? "border-green-500 text-green-600" : ""}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <FrameActionsCell row={row} />,
  },
];
