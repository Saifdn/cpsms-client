import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMyTasks } from "@/hooks/task/useTasks";

const CATEGORY_CONFIG = {
  studio: {
    label: "Studio",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  counter: {
    label: "Counter",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  shipment: {
    label: "Shipment",
    className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  admin: {
    label: "Admin",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
  other: {
    label: "Other",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  },
};

function CategoryBadge({ value }) {
  const cfg = CATEGORY_CONFIG[value] ?? CATEGORY_CONFIG.other;
  return (
    <Badge variant="secondary" className={cn("text-xs", cfg.className)}>
      {cfg.label}
    </Badge>
  );
}

const MyTasks = () => {
  const { data, isLoading } = useMyTasks();
  const tasks = data?.data || [];

  return (
    <Page>
      <PageHeader
        title="My Tasks"
        description="Tasks assigned to you by an admin"
      />

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-5 w-64 mb-2" />
                <Skeleton className="h-3 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              No tasks assigned. You're all clear!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="shrink-0 mt-0.5">
                      <CategoryBadge value={task.category} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Assigned by {task.assignedBy?.fullName ?? "—"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {format(new Date(task.createdAt), "d MMM yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
};

export default MyTasks;
