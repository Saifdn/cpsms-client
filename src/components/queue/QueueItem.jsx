import { cn } from "@/lib/utils";

const CompactItem = ({ item, fullscreen }) => (
  <div
    className={cn(
      "bg-card border border-border rounded-xl transition-all hover:shadow-sm hover:border-primary/20",
      fullscreen ? "px-5 py-4" : "px-4 py-3",
    )}
  >
    <div
      className={cn(
        "font-mono font-bold tabular-nums text-foreground leading-tight",
        fullscreen ? "text-4xl" : "text-2xl",
      )}
    >
      #{item.queueNumber}
    </div>
    <p
      className={cn(
        "truncate text-muted-foreground",
        fullscreen ? "text-sm mt-1.5" : "text-xs mt-0.5",
      )}
    >
      {item.booking?.graduate?.fullName || "Customer"}
    </p>
  </div>
);

const CalledItem = ({ item, fullscreen }) => (
  <div
    className={cn(
      "border-2 border-primary/30 bg-primary/5 rounded-2xl transition-all",
      fullscreen ? "p-6" : "p-4",
    )}
  >
    <span className="h-2 w-2 rounded-full bg-primary animate-pulse block mb-3" />
    <div className="flex items-baseline gap-3 min-w-0">
      <span
        className={cn(
          "font-mono font-black tabular-nums text-primary leading-none shrink-0",
          fullscreen ? "text-7xl" : "text-5xl",
        )}
      >
        #{item.queueNumber}
      </span>
      {item.studio?.name && (
        <>
          <span
            className={cn(
              "font-bold text-primary/50 leading-none shrink-0",
              fullscreen ? "text-5xl" : "text-3xl",
            )}
          >
            |
          </span>
          <span
            className={cn(
              "font-bold text-primary leading-none truncate",
              fullscreen ? "text-4xl" : "text-3xl",
            )}
          >
            {item.studio.name}
          </span>
        </>
      )}
    </div>
    <p
      className={cn(
        "truncate font-medium text-muted-foreground",
        fullscreen ? "text-md mt-3" : "text-xs mt-2",
      )}
    >
      {item.booking?.graduate?.fullName || "Customer"}
    </p>
  </div>
);

export const QueueItem = ({ item, variant, fullscreen }) => {
  if (variant === "called") {
    return <CalledItem item={item} fullscreen={fullscreen} />;
  }
  return <CompactItem item={item} fullscreen={fullscreen} />;
};
