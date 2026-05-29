import { Badge } from "@/components/ui/badge";

export const submittedColumns = [
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
    accessorKey: "courierName",
    header: "Courier",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.shipment.courierName || "—"}
      </div>
    ),
  },
  {
    accessorKey: "awb_number",
    header: "AWB / Tracking",
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.original.shipment.awb_number ? (
          <span className="text-green-600 font-medium">
            {row.original.shipment.awb_number}
          </span>
        ) : (
          <span className="text-muted-foreground">Not Generated</span>
        )}
      </div>
    ),
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