import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const COLUMN_STYLES = [
  { card: "border-border", header: "bg-muted/50 border-border", items: 4 },
  { card: "border-primary/30", header: "bg-primary/5 border-primary/20", items: 2 },
  { card: "border-border", header: "bg-muted/30 border-border", items: 3 },
];

export const QueueBoardSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
    {COLUMN_STYLES.map((col, i) => (
      <Card key={i} className={cn("flex flex-col", col.card)}>
        <CardHeader className={cn("border-b", col.header)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
            <Skeleton className="h-7 w-7" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-3 px-3 pb-3">
          {Array.from({ length: col.items }, (_, j) => (
            <Skeleton
              key={j}
              className={cn(
                "w-full rounded-xl",
                j === 0 && i === 1 ? "h-24" : "h-14",
              )}
            />
          ))}
        </CardContent>
      </Card>
    ))}
  </div>
);
