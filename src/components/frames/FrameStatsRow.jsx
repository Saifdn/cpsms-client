import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Frame, CheckCircle2, XCircle } from "lucide-react";

const STAT_CONFIG = [
  { key: "total", label: "Total Frames", icon: Frame, color: "text-primary" },
  { key: "active", label: "Active", icon: CheckCircle2, color: "text-primary" },
  { key: "inactive", label: "Inactive", icon: XCircle, color: "text-muted-foreground" },
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

export function FrameStatsRow({ stats = {} }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {STAT_CONFIG.map(({ key, label, icon, color }) => (
        <StatCard key={key} label={label} value={stats[key]} icon={icon} color={color} />
      ))}
    </div>
  );
}
