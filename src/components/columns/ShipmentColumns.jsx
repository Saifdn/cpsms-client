import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ShipmentActionsCell } from "./ShipmentActionsCell";

export const shipmentColumns = [
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
    accessorKey: "bookingNumber",
    header: "Booking",
    cell: ({ row }) => (
      <div className="font-mono font-medium">
        {row.original.bookingNumber || "—"}
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
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
    accessorKey: "package",
    header: "Package",
    cell: ({ row }) => {
      const addons = row.original.addons ?? [];
      return (
        <div>
          <div className="font-medium">{row.original.package?.name || "N/A"}</div>
          {addons.length > 0 && (
            <div className="mt-0.5 flex flex-wrap gap-x-1">
              {addons.map((addon) => (
                <span key={addon._id} className="text-xs text-muted-foreground">
                  + {addon.name}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "receiver",
    header: "Ship To",
    cell: ({ row }) => {
      const r = row.original.shipment.receiver;
      return (
        <div>
          <div className="font-medium">{r?.name}</div>
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
    cell: ({ row }) => <ShipmentActionsCell row={row} />,
  },
];

// Helper function for better status colors
const getShipmentBadgeVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "draft":
      return "secondary";
    case "submitted":
      return "default";
    case "paid":
      return "default";
    case "label_generated":
      return "outline";
    case "shipped":
      return "default";
    case "delivered":
      return "default";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
};
