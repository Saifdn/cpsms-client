import { format } from "date-fns";
import { useAuth } from "@/context/useAuth";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { useMyTasks } from "@/hooks/task/useTasks";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { RecentBookingsTable } from "@/components/dashboard/RecentBookingsTable";
import { UserCountsCard } from "@/components/dashboard/UserCountsCard";
import { MonthlyRevenueChart } from "@/components/dashboard/MonthlyRevenueChart";
import { BookingStatusChart } from "@/components/dashboard/BookingStatusChart";
import { ShipmentStatusCard } from "@/components/dashboard/ShipmentStatusCard";

const STAFF_ROLES = new Set(["staff", "admin", "superadmin"]);

function ChartSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();
  const overview = data?.data?.data ?? {};
  const kpi = overview.kpi ?? {};

  const isStaffRole = STAFF_ROLES.has(user?.role);

  const { data: myTasksData, isLoading: myTasksLoading } = useMyTasks({
    enabled: user?.role === "staff",
  });
  const myTasks = myTasksData?.data ?? [];

  return (
    <Page>
      {isStaffRole ? (
        <WelcomeBanner user={user} tasks={myTasks} isLoading={myTasksLoading} />
      ) : (
        <PageHeader
          title="Dashboard"
          description={`Overview for ${format(new Date(), "EEEE, d MMMM yyyy")}`}
        />
      )}

      <KpiGrid data={kpi} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <MonthlyRevenueChart data={overview.monthlyRevenue} />
          )}
        </div>
        <div>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <BookingStatusChart data={overview.bookingStatusBreakdown} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <RecentBookingsTable data={overview.recentBookings} />
          )}
        </div>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <ShipmentStatusCard data={overview.shipmentStatusBreakdown} />
              <UserCountsCard data={overview.userCounts} />
            </>
          )}
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;
