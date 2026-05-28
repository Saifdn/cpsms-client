import { cn } from "@/lib/utils";

export const ConnectionStatus = ({ isConnected, className }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <span className="relative flex h-2.5 w-2.5">
      {isConnected && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      )}
      <span
        className={cn(
          "relative inline-flex rounded-full h-2.5 w-2.5",
          isConnected ? "bg-green-500" : "bg-red-500",
        )}
      />
    </span>
    <span
      className={cn(
        "text-xs font-medium",
        isConnected ? "text-green-600 dark:text-green-400" : "text-red-500",
      )}
    >
      {isConnected ? "Live" : "Reconnecting…"}
    </span>
  </div>
);
