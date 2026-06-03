import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FrameShipmentActionsCell } from "./FrameShipmentActionsCell";

const getShipmentBadgeVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "draft":        return "secondary";
    case "submitted":    return "default";
    case "paid":         return "default";
    case "label_generated": return "outline";
    case "shipped":      return "default";
    case "delivered":    return "default";
    case "failed":       return "destructive";
    default:             return "secondary";
  }
};

export const frameShipmentColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    size: 50,
  },
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }) => (
      <div className="font-mono font-medium">
        {row.original.orderNumber || "—"}
      </div>
    ),
  },
  {
    id: "graduate",
    header: "Graduate",
    cell: ({ row }) => {
      const graduate = row.original?.graduate;
      return (
        <div>
          <div className="font-medium">{graduate?.fullName || "—"}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
            {graduate?.email}
          </div>
        </div>
      );
    },
  },
  {
    id: "items",
    header: "Frames",
    cell: ({ row }) => {
      const items = row.original.items ?? [];
      return (
        <div>
          {items.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <div className="flex flex-wrap gap-x-1">
              {items.map((item, i) => (
                <span key={i} className="text-sm">
                  {item.frame?.name ?? "Frame"}{" "}
                  <span className="text-muted-foreground">×{item.quantity}</span>
                  {i < items.length - 1 && ","}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "receiver",
    header: "Ship To",
    cell: ({ row }) => {
      const r = row.original.shipment?.receiver;
      return (
        <div>
          <div className="font-medium">{r?.name || "—"}</div>
          <div className="text-xs text-muted-foreground">
            {r?.city}, {r?.postcode}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Shipment Status",
    cell: ({ row }) => {
      const status = row.getValue("status") || "draft";
      return (
        <Badge variant={getShipmentBadgeVariant(status)} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <FrameShipmentActionsCell row={row} />,
  },
];
