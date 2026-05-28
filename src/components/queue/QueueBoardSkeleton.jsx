import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const COLUMN_STYLES = [
  {
    card: "border-orange-200 dark:border-orange-800/60",
    header: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
    icon: "bg-orange-100 dark:bg-orange-900",
    items: 4,
  },
  {
    card: "border-blue-300 dark:border-blue-700",
    header: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    icon: "bg-blue-100 dark:bg-blue-900",
    items: 2,
  },
  {
    card: "border-green-200 dark:border-green-800/60",
    header: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    icon: "bg-green-100 dark:bg-green-900",
    items: 3,
  },
];

export const QueueBoardSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
    {COLUMN_STYLES.map((col, i) => (
      <Card key={i} className={cn("flex flex-col", col.card)}>
        <CardHeader className={cn("border-b", col.header)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className={cn("h-9 w-9 rounded-lg", col.icon)} />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
            <Skeleton className="h-7 w-7" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-4">
          {Array.from({ length: col.items }, (_, j) => (
            <Skeleton
              key={j}
              className={cn(
                "w-full rounded-xl",
                j === 0 && i === 1 ? "h-28" : "h-12",
              )}
            />
          ))}
        </CardContent>
      </Card>
    ))}
  </div>
);
