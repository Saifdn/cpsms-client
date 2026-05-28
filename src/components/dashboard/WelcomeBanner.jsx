import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const TASK_CATEGORY_LABELS = {
  studio: "Studio",
  counter: "Counter",
  shipment: "Shipment",
  admin: "Admin",
  other: "Other",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function TaskItem({ task }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="inline-flex shrink-0 items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/15 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-primary-foreground whitespace-nowrap">
        {TASK_CATEGORY_LABELS[task.category] ?? "Other"}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug text-primary-foreground">
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-primary-foreground/60 truncate mt-0.5">
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}

function BannerSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-28 bg-primary-foreground/20" />
        <Skeleton className="h-7 w-48 bg-primary-foreground/20" />
        <Skeleton className="h-3 w-36 mt-2 bg-primary-foreground/20" />
        <Skeleton className="h-3 w-56 mt-3 bg-primary-foreground/20" />
      </div>
      <div className="hidden lg:block w-px self-stretch bg-primary-foreground/20" />
      <div className="flex-1 lg:max-w-xs space-y-2">
        <Skeleton className="h-3 w-20 mb-3 bg-primary-foreground/20" />
        <Skeleton className="h-8 w-full bg-primary-foreground/20" />
        <Skeleton className="h-8 w-full bg-primary-foreground/20" />
        <Skeleton className="h-8 w-full bg-primary-foreground/20" />
      </div>
    </div>
  );
}

function BannerContent({ firstName, tasks }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">
          {getGreeting()}
        </p>
        <h2 className="text-2xl font-bold mt-0.5 truncate text-primary-foreground drop-shadow-sm">
          {firstName}
        </h2>
        <p className="text-sm text-primary-foreground/70 mt-1">
          {format(new Date(), "EEEE, d MMMM yyyy")}
        </p>
        <p className="text-sm text-primary-foreground/70 mt-3">
          {tasks.length === 0 ? (
            "You have no tasks assigned. You're all clear!"
          ) : (
            <>
              You have{" "}
              <span className="font-semibold text-primary-foreground">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""}
              </span>{" "}
              assigned to you.
            </>
          )}
        </p>
      </div>

      {tasks.length > 0 && (
        <div className="hidden lg:block w-px self-stretch bg-primary-foreground/20" />
      )}

      {tasks.length > 0 && (
        <div className="flex-1 lg:max-w-sm min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60 mb-3">
            Your Tasks
          </p>
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mb-2 max-lg:hidden [&_button]:text-primary-foreground [&_button]:hover:bg-primary-foreground/10">
        <ThemeToggle />
      </div>
    </div>
  );
}

export function WelcomeBanner({ user, tasks = [], isLoading }) {
  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg shadow-primary/20 mb-6">
      <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-primary/80" />
      <div className="absolute -top-12 right-4 w-52 h-52 rounded-full bg-primary-foreground/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-14 -left-10 w-60 h-60 rounded-full bg-primary-foreground/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />
      <CardContent className="relative z-10 p-6">
        {isLoading ? (
          <BannerSkeleton />
        ) : (
          <BannerContent firstName={firstName} tasks={tasks} />
        )}
      </CardContent>
    </Card>
  );
}
