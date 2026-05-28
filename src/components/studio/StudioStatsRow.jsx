import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, CheckCircle2, XCircle, Users2 } from "lucide-react";

const STAT_CONFIG = [
  { key: "total", label: "Total Studios", icon: Building2, color: "text-primary" },
  { key: "available", label: "Available", icon: CheckCircle2, color: "text-green-500" },
  { key: "unavailable", label: "Unavailable", icon: XCircle, color: "text-muted-foreground" },
  { key: "occupied", label: "Occupied", icon: Users2, color: "text-amber-500" },
];

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value ?? 0}</p>
          </div>
          <div className={cn("mt-0.5", color)}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StudioStatsRow({ stats = {} }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CONFIG.map(({ key, label, icon, color }) => (
        <StatCard key={key} label={label} value={stats[key]} icon={icon} color={color} />
      ))}
    </div>
  );
}
