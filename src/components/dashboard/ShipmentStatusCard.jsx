import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "./DashboardCard";
import { Package } from "lucide-react";

const STATUS_CONFIG = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "outline" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  in_transit: { label: "In Transit", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export function ShipmentStatusCard({ data = {} }) {
  const entries = Object.entries(data);

  return (
    <DashboardCard title="Shipment Status" description="Current shipment breakdown">
      {entries.length === 0 ? (
        <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
          No shipment data
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(([status, count]) => {
            const config = STATUS_CONFIG[status] ?? { label: status };
            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-muted-foreground" />
                  <span className="text-sm">
                    {config.label}
                  </span>
                </div>
                <Badge
                  variant={config.variant}
                  className={config.className}
                >
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
