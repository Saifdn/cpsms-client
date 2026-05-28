import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SCHEMES = {
  waiting: {
    card: "border-orange-200 dark:border-orange-800/60",
    header: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
    iconWrap: "bg-orange-100 dark:bg-orange-900",
    icon: "text-orange-500 dark:text-orange-400",
    title: "text-orange-700 dark:text-orange-300",
    sub: "text-orange-500 dark:text-orange-400",
    count: "text-orange-600 dark:text-orange-400",
  },
  called: {
    card: "border-blue-300 dark:border-blue-700 ring-1 ring-blue-200 dark:ring-blue-800",
    fsExtra: "shadow-lg shadow-blue-100/50",
    header: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    iconWrap: "bg-blue-100 dark:bg-blue-900",
    icon: "text-blue-500 dark:text-blue-400",
    title: "text-blue-700 dark:text-blue-300",
    sub: "text-blue-500 dark:text-blue-400",
    count: "text-blue-600 dark:text-blue-300",
  },
  "in-progress": {
    card: "border-green-200 dark:border-green-800/60",
    header: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    iconWrap: "bg-green-100 dark:bg-green-900",
    icon: "text-green-500 dark:text-green-400",
    title: "text-green-700 dark:text-green-300",
    sub: "text-green-500 dark:text-green-400",
    count: "text-green-600 dark:text-green-400",
  },
};

export const QueueColumn = ({
  variant,
  icon: Icon,
  title,
  subtitle,
  count,
  fullscreen,
  children,
}) => {
  const s = SCHEMES[variant];

  return (
    <Card
      className={cn(
        "flex flex-col",
        s.card,
        fullscreen && "bg-white rounded-2xl",
        fullscreen && s.fsExtra,
      )}
    >
      <CardHeader
        className={cn(
          "border-b shrink-0",
          s.header,
          fullscreen && "rounded-t-2xl",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", s.iconWrap)}>
              <Icon
                className={cn(
                  fullscreen ? "h-7 w-7" : "h-5 w-5",
                  s.icon,
                )}
              />
            </div>
            <div>
              <CardTitle
                className={cn(s.title, fullscreen ? "text-xl" : "text-base")}
              >
                {title}
              </CardTitle>
              <p className={cn(s.sub, fullscreen ? "text-sm mt-0.5" : "text-xs")}>
                {subtitle}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "font-bold tabular-nums font-mono",
              s.count,
              fullscreen ? "text-3xl" : "text-xl",
            )}
          >
            {count}
          </span>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "flex-1 overflow-y-auto",
          variant === "called" ? "space-y-3" : "space-y-2.5",
          fullscreen ? "pt-5 px-5 pb-5" : "pt-4",
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
};
