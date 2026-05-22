import { Page, PageHeader } from "@/components/layout/Page";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MonthlyRevenueChart } from "@/components/dashboard/MonthlyRevenueChart";
import { BookingStatusChart } from "@/components/dashboard/BookingStatusChart";
import { ShipmentStatusCard } from "@/components/dashboard/ShipmentStatusCard";
import {
  CalendarClock,
  UserCheck,
  Clock,
  Camera,
  CheckCircle,
  Banknote,
  TrendingUp,
  Package,
  GraduationCap,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const KPI_CONFIG = [
  { key: "expectedCustomersToday", label: "Expected Today", icon: CalendarClock, color: "text-blue-500" },
  { key: "checkedInToday", label: "Checked In", icon: UserCheck, color: "text-green-500" },
  { key: "waitingInQueue", label: "In Queue", icon: Clock, color: "text-amber-500" },
  { key: "activeStudios", label: "Active Studios", icon: Camera, color: "text-purple-500" },
  { key: "availableStudios", label: "Available Studios", icon: CheckCircle, color: "text-teal-500" },
  { key: "todayRevenue", label: "Today's Revenue", icon: Banknote, color: "text-emerald-500", prefix: "RM " },
  { key: "totalRevenue", label: "Total Revenue", icon: TrendingUp, color: "text-primary", prefix: "RM " },
  { key: "pendingShipments", label: "Pending Shipments", icon: Package, color: "text-orange-500" },
];

const BOOKING_STATUS_STYLE = {
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  preparing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  delivery: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const PAYMENT_STATUS_STYLE = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function KpiCard({ label, value, icon, color, prefix = "" }) {
  const Icon = icon;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-2xl font-bold mt-1 truncate">
              {prefix}{typeof value === "number" ? value.toLocaleString() : value ?? 0}
            </p>
          </div>
          <div className={cn("shrink-0 ml-2 mt-0.5", color)}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentBookingsTable({ data = [] }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Last {data.length} bookings in the system</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No recent bookings
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking No.</TableHead>
                <TableHead>Graduate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="font-mono text-xs">{booking.bookingNumber}</TableCell>
                  <TableCell>{booking.graduate?.fullName ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("capitalize text-xs", BOOKING_STATUS_STYLE[booking.status])}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn("capitalize text-xs", PAYMENT_STATUS_STYLE[booking.paymentStatus])}
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    RM {booking.totalPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {format(new Date(booking.createdAt), "d MMM yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function UserCountsCard({ data = {} }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Registered Users</CardTitle>
        <CardDescription>Total accounts in the system</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/40">
            <GraduationCap size={24} className="text-primary" />
            <p className="text-2xl font-bold">{data.graduates ?? 0}</p>
            <p className="text-xs text-muted-foreground">Graduates</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/40">
            <Users size={24} className="text-primary" />
            <p className="text-2xl font-bold">{data.staff ?? 0}</p>
            <p className="text-xs text-muted-foreground">Staff</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Dashboard = () => {
  const { data, isLoading } = useDashboard();
  const overview = data?.data?.data || {};
  const kpi = overview.kpi || {};

  return (
    <Page>
      <PageHeader
        title="Dashboard"
        description={`Overview for ${format(new Date(), "EEEE, d MMMM yyyy")}`}
      />

      {/* KPI Row */}
      {isLoading ? (
        <KpiSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CONFIG.map(({ key, label, icon, color, prefix }) => (
            <KpiCard key={key} label={label} value={kpi[key]} icon={icon} color={color} prefix={prefix} />
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
          ) : (
            <MonthlyRevenueChart data={overview.monthlyRevenue} />
          )}
        </div>
        <div>
          {isLoading ? (
            <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
          ) : (
            <BookingStatusChart data={overview.bookingStatusBreakdown} />
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </CardContent>
            </Card>
          ) : (
            <RecentBookingsTable data={overview.recentBookings} />
          )}
        </div>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
              <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
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
