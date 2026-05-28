import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const CATEGORY_CONFIG = {
  studio: {
    label: "Studio",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    borderClass: "border-l-blue-500",
  },
  counter: {
    label: "Counter",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    borderClass: "border-l-purple-500",
  },
  shipment: {
    label: "Shipment",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    borderClass: "border-l-orange-500",
  },
  admin: {
    label: "Admin",
    badgeClass: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    borderClass: "border-l-gray-400",
  },
  other: {
    label: "Other",
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    borderClass: "border-l-slate-400",
  },
};

export const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export function CategoryBadge({ value }) {
  const cfg = CATEGORY_CONFIG[value] ?? CATEGORY_CONFIG.other;
  return (
    <Badge variant="secondary" className={cn("text-xs shrink-0", cfg.badgeClass)}>
      {cfg.label}
    </Badge>
  );
}
