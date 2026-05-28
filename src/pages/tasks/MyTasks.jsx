import { useState } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ClipboardList, RefreshCw } from "lucide-react";
import { useMyTasks } from "@/hooks/task/useTasks";
import {
  CategoryBadge,
  CATEGORY_CONFIG,
} from "@/components/task/TaskCategoryBadge";

function TaskCardSkeleton() {
  return (
    <Card className="border-l-4 border-l-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Skeleton className="h-5 w-16 rounded-full shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton className="h-3 w-20 shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ filtered }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm">
            {filtered ? "No tasks in this category" : "All clear!"}
          </p>
          <p className="text-xs text-muted-foreground">
            {filtered
              ? "Try selecting a different category filter."
              : "No tasks have been assigned to you yet."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorState({ onRetry }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <RefreshCw className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm">Failed to load tasks</p>
          <p className="text-xs text-muted-foreground">
            Something went wrong. Please try again.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

function TaskCard({ task }) {
  const cfg = CATEGORY_CONFIG[task.category] ?? CATEGORY_CONFIG.other;
  return (
    <Card className={cn("border-l-4", cfg.borderClass)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <CategoryBadge value={task.category} />
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug">{task.title}</p>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Assigned by{" "}
                <span className="font-medium">
                  {task.assignedBy?.fullName ?? "—"}
                </span>
              </p>
            </div>
          </div>
          <time
            className="text-xs text-muted-foreground shrink-0"
            dateTime={task.createdAt}
          >
            {format(new Date(task.createdAt), "d MMM yyyy")}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryFilterChips({ tasks, activeFilter, onFilterChange }) {
  const presentCategories = [...new Set(tasks.map((t) => t.category))];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={activeFilter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        All
        <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-xs leading-none">
          {tasks.length}
        </span>
      </Button>
      {presentCategories.map((cat) => {
        const count = tasks.filter((t) => t.category === cat).length;
        const label = CATEGORY_CONFIG[cat]?.label ?? cat;
        return (
          <Button
            key={cat}
            variant={activeFilter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(cat)}
          >
            {label}
            <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-xs leading-none">
              {count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

const MyTasks = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data, isLoading, isError, refetch } = useMyTasks();
  const tasks = data?.data ?? [];

  const filtered =
    activeFilter === "all"
      ? tasks
      : tasks.filter((t) => t.category === activeFilter);

  const headerDescription =
    !isLoading && !isError
      ? `${tasks.length} task${tasks.length !== 1 ? "s" : ""} assigned to you`
      : "Tasks assigned to you by an admin";

  return (
    <Page>
      <PageHeader title="My Tasks" description={headerDescription} />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          {tasks.length > 1 && (
            <CategoryFilterChips
              tasks={tasks}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          )}

          {filtered.length === 0 ? (
            <EmptyState filtered={activeFilter !== "all"} />
          ) : (
            <div className="space-y-3">
              {filtered.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </>
      )}
    </Page>
  );
};

export default MyTasks;
