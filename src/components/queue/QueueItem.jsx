import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COMPACT_SCHEMES = {
  waiting: {
    dot: "h-2 w-2 bg-orange-400",
    number: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800/60 hover:border-orange-300 dark:hover:border-orange-700",
    fsBg: "bg-orange-50 border-orange-200",
  },
  "in-progress": {
    dot: "h-2 w-2 bg-green-400",
    number: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800/60 hover:border-green-300 dark:hover:border-green-700",
    fsBg: "bg-green-50 border-green-200",
  },
};

const CompactItem = ({ item, scheme, fullscreen }) => (
  <div
    className={cn(
      "bg-card border rounded-xl flex items-center gap-4 transition-all duration-300 hover:shadow-md",
      fullscreen ? cn("px-5 py-4 gap-5", scheme.fsBg) : "px-4 py-3",
      scheme.border,
    )}
  >
    <span className={cn("rounded-full shrink-0", scheme.dot)} />
    <div
      className={cn(
        "font-mono font-bold tabular-nums",
        scheme.number,
        fullscreen ? "text-4xl" : "text-2xl",
      )}
    >
      #{item.queueNumber}
    </div>
    <p className={cn("truncate", fullscreen ? "text-base font-medium text-gray-800" : "text-sm font-medium")}>
      {item.booking?.graduate?.fullName || "Customer"}
    </p>
  </div>
);

const CalledItem = ({ item, fullscreen }) => (
  <div
    className={cn(
      "border-2 border-blue-300 dark:border-blue-600 rounded-2xl transition-all duration-300",
      fullscreen
        ? "bg-blue-50 border-blue-300 p-6"
        : "bg-blue-50 dark:bg-blue-950/60 p-5",
    )}
  >
    <div className="flex items-start gap-3">
      <span className="mt-2 h-3 w-3 rounded-full bg-blue-400 animate-pulse shrink-0" />
      <div className="min-w-0">
        <div
          className={cn(
            "font-mono font-black tabular-nums text-blue-600 dark:text-blue-300 leading-none",
            fullscreen ? "text-7xl" : "text-5xl",
          )}
        >
          #{item.queueNumber}
        </div>
        <p
          className={cn(
            "truncate",
            fullscreen
              ? "text-xl font-semibold text-blue-800 mt-3"
              : "text-base font-semibold mt-2",
          )}
        >
          {item.booking?.graduate?.fullName || "Customer"}
        </p>
        {item.studio?.name && (
          <Badge
            variant="secondary"
            className={cn(
              "mt-2",
              fullscreen
                ? "text-sm bg-blue-100 text-blue-700 border-blue-200"
                : "text-xs",
            )}
          >
            {item.studio.name}
          </Badge>
        )}
      </div>
    </div>
  </div>
);

export const QueueItem = ({ item, variant, fullscreen }) => {
  if (variant === "called") {
    return <CalledItem item={item} fullscreen={fullscreen} />;
  }
  return (
    <CompactItem item={item} scheme={COMPACT_SCHEMES[variant]} fullscreen={fullscreen} />
  );
};
