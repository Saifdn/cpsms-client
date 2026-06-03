import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

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

export const frameSubmittedColumns = [
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
    id: "courierName",
    header: "Courier",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.shipment?.courierName || "—"}
      </div>
    ),
  },
  {
    id: "awb_number",
    header: "AWB / Tracking",
    cell: ({ row }) => {
      const { awb_number, tracking_url } = row.original.shipment ?? {};
      return (
        <div className="font-mono text-sm">
          {awb_number ? (
            tracking_url ? (
              <a
                href={tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 font-medium hover:underline"
              >
                {awb_number}
              </a>
            ) : (
              <span className="text-green-600 font-medium">{awb_number}</span>
            )
          ) : (
            <span className="text-muted-foreground">Not Generated</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") || "submitted";
      return (
        <Badge variant={getShipmentBadgeVariant(status)} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
];
