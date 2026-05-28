// pages/graduates/MyBookings.jsx
import { useMemo, useState } from "react";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyBookings } from "@/hooks/studio/useBookings";
import { getBookingStatus } from "@/lib/bookingStatus";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Camera,
  CalendarX,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTERS = [
  { value: "all",       label: "All" },
  { value: "upcoming",  label: "Upcoming" },
  { value: "active",    label: "In Progress" },
  { value: "done",      label: "Post-Session" },
  { value: "cancelled", label: "Cancelled" },
];

const FILTER_STATUSES = {
  upcoming:  ["pending", "booked"],
  active:    ["checked-in", "in-progress"],
  done:      ["completed", "preparing", "delivery", "shipped"],
  cancelled: ["cancelled"],
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const BookingCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="h-1.5 w-full bg-primary/20" />
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-4 pb-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex flex-col items-end justify-between gap-3">
          <div className="space-y-2 text-right">
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ filter }) => {
  const isFiltered = filter !== "all";

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-5">
        <CalendarX className="h-9 w-9 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">
        {isFiltered ? "No bookings here" : "No bookings yet"}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-xs">
        {isFiltered
          ? "Try switching to a different tab or view all bookings."
          : "You haven't made any bookings. Book a session to get started!"}
      </p>
      {!isFiltered && (
        <Button asChild size="lg">
          <Link to="/book">Book Your First Session</Link>
        </Button>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const MyBookings = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useMyBookings();
  const [filter, setFilter] = useState("all");

  const bookings = data?.data ?? [];

  const filtered = useMemo(() => {
    if (filter === "all") return bookings;
    const allowed = FILTER_STATUSES[filter] ?? [];
    return bookings.filter((b) => allowed.includes(b.status));
  }, [bookings, filter]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(FILTER_STATUSES).map(([key, statuses]) => [
          key,
          bookings.filter((b) => statuses.includes(b.status)).length,
        ])
      ),
    [bookings]
  );

  if (isLoading) {
    return (
      <Page>
        <PageHeader title="My Bookings" description="View and manage all your studio sessions" />
        <div className="grid gap-5">
          {[...Array(3)].map((_, i) => (
            <BookingCardSkeleton key={i} />
          ))}
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <PageHeader title="My Bookings" description="View and manage all your studio sessions" />
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to load bookings</h2>
          <p className="text-muted-foreground mb-6">
            {error?.response?.data?.message || error?.message || "Something went wrong."}
          </p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader title="My Bookings" description="View and manage all your studio sessions" />

      {/* ── Filter Tabs + summary ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-2 mb-6">
        <p className="text-sm text-muted-foreground order-last sm:order-first">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""} total
          {isFetching && !isLoading && (
            <span className="ml-2 text-xs text-muted-foreground/60">(refreshing…)</span>
          )}
        </p>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-auto flex-wrap gap-1 bg-muted/60">
            {FILTERS.map(({ value, label }) => {
              const count = value === "all" ? bookings.length : (counts[value] ?? 0);
              return (
                <TabsTrigger key={value} value={value} className="text-xs gap-1.5 py-1.5">
                  {label}
                  {count > 0 && (
                    <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-primary/15 text-primary">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* ── Booking List ─────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="grid gap-5">
          {filtered.map((booking) => {
            const statusInfo = getBookingStatus(booking.status);
            const totalPrice = booking.totalPrice ?? booking.totalAmount ?? booking.package?.price;
            const bookedDate = booking.createdAt ?? booking.bookedAt;

            return (
              <Card
                key={booking._id}
                className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="h-1.5 w-full bg-primary" />

                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-base font-bold tracking-tight leading-none mb-1">
                        {booking.bookingNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.package?.name || "Studio Session"}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs px-3 py-1 font-semibold border capitalize shrink-0 ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4 pb-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Session date & time */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                          Session Date
                        </p>
                      </div>
                      <p className="text-sm font-medium leading-snug">
                        {booking.session?.date
                          ? new Date(booking.session.date).toLocaleDateString("en-GB", {
                              weekday: "short",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                      {booking.session?.startTime && booking.session?.endTime && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {booking.session.startTime} – {booking.session.endTime}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Package & price */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                          Package
                        </p>
                      </div>
                      <p className="text-sm font-medium leading-snug">
                        {booking.package?.name || "—"}
                      </p>
                      {totalPrice != null && (
                        <p className="text-sm font-semibold text-primary mt-1">
                          RM {Number(totalPrice).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Booked on + action */}
                    <div className="flex flex-col sm:items-end justify-between gap-3">
                      <div className="sm:text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                          Booked On
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bookedDate
                            ? new Date(bookedDate).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm" className="shrink-0">
                        <Link to={`/my-bookings/${booking._id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
};

export default MyBookings;
