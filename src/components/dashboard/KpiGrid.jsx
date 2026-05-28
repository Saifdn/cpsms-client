import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  UserCheck,
  Clock,
  Camera,
  CheckCircle,
  Banknote,
  TrendingUp,
  Package,
} from "lucide-react";

const KPI_CONFIG = [
  {
    key: "expectedCustomersToday",
    label: "Expected Today",
    icon: CalendarClock,
    color: "text-blue-500",
  },
  {
    key: "checkedInToday",
    label: "Checked In",
    icon: UserCheck,
    color: "text-green-500",
  },
  {
    key: "waitingInQueue",
    label: "In Queue",
    icon: Clock,
    color: "text-amber-500",
  },
  {
    key: "activeStudios",
    label: "Active Studios",
    icon: Camera,
    color: "text-purple-500",
  },
  {
    key: "availableStudios",
    label: "Available Studios",
    icon: CheckCircle,
    color: "text-teal-500",
  },
  {
    key: "todayRevenue",
    label: "Today's Revenue",
    icon: Banknote,
    color: "text-emerald-500",
    prefix: "RM ",
  },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: TrendingUp,
    color: "text-primary",
    prefix: "RM ",
  },
  {
    key: "pendingShipments",
    label: "Pending Shipments",
    icon: Package,
    color: "text-orange-500",
  },
];

function KpiCard({ label, value, icon: Icon, color, prefix = "" }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-2xl font-bold mt-1 truncate">
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : (value ?? 0)}
            </p>
          </div>
          <div className={cn("shrink-0 ml-2 mt-0.5", color)}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KpiGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function KpiGrid({ data = {}, isLoading }) {
  if (isLoading) return <KpiGridSkeleton />;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_CONFIG.map(({ key, label, icon, color, prefix = "" }) => (
        <KpiCard
          key={key}
          label={label}
          value={data[key]}
          icon={icon}
          color={color}
          prefix={prefix}
        />
      ))}
    </div>
  );
}
