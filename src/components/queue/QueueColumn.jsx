import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SCHEMES = {
  waiting: {
    card: "border-border",
    header: "bg-muted/50 border-border",
    iconWrap: "bg-background border border-border",
    icon: "text-muted-foreground",
    title: "text-foreground",
    sub: "text-muted-foreground",
    count: "text-foreground",
  },
  called: {
    card: "border-primary/30 ring-1 ring-primary/20",
    fsExtra: "shadow-lg shadow-primary/10",
    header: "bg-primary/5 border-primary/20",
    iconWrap: "bg-primary/15",
    icon: "text-primary",
    title: "text-primary",
    sub: "text-muted-foreground",
    count: "text-primary",
  },
  "in-progress": {
    card: "border-border",
    header: "bg-muted/30 border-border",
    iconWrap: "bg-background border border-border",
    icon: "text-muted-foreground",
    title: "text-foreground",
    sub: "text-muted-foreground",
    count: "text-foreground",
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
        fullscreen && "bg-card rounded-2xl",
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
                  fullscreen ? "h-6 w-6" : "h-4 w-4",
                  s.icon,
                )}
              />
            </div>
            <div>
              <CardTitle
                className={cn(s.title, fullscreen ? "text-lg" : "text-sm font-semibold")}
              >
                {title}
              </CardTitle>
              <p className={cn(s.sub, "text-xs mt-0.5")}>
                {subtitle}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "font-bold tabular-nums font-mono",
              s.count,
              fullscreen ? "text-3xl" : "text-2xl",
            )}
          >
            {count}
          </span>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "flex-1 overflow-y-auto",
          variant === "called" ? "space-y-3" : "space-y-2",
          fullscreen ? "pt-4 px-4 pb-4" : "pt-3 px-3 pb-3",
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
};
