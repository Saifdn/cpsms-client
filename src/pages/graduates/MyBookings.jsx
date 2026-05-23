// pages/graduate/MyBookings.jsx
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useMyBookings } from "@/hooks/studio/useBookings";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Camera,
  CalendarX,
  AlertCircle,
} from "lucide-react";

// ─── Status Config ───────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:       { label: "Pending",     className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700" },
  booked:        { label: "Booked",      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  "checked-in":  { label: "Checked In",  className: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800" },
  "in-progress": { label: "In Progress", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" },
  completed:     { label: "Completed",   className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" },
  preparing:     { label: "Preparing",   className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  delivery:      { label: "Delivery",    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  shipped:       { label: "Shipped",     className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  cancelled:     { label: "Cancelled",   className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" },
};

// ─── Skeleton Card ───────────────────────────────────────────────────────────

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

// ─── Main Component ──────────────────────────────────────────────────────────

const MyBookings = () => {
  const { data, isLoading, isError, error, refetch } = useMyBookings();

  const bookings = data?.data ?? [];

  if (isLoading) {
    return (
      <Page>
        <PageHeader
          title="My Bookings"
          description="View and manage all your studio sessions"
        />
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
        <PageHeader
          title="My Bookings"
          description="View and manage all your studio sessions"
        />
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to load bookings</h2>
          <p className="text-muted-foreground mb-6">
            {error?.response?.data?.message || error?.message || "Something went wrong."}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title="My Bookings"
        description="View and manage all your studio sessions"
      />
      {bookings.length > 0 && (
        <p className="text-sm text-muted-foreground -mt-2 mb-6">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
        </p>
      )}

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-5">
            <CalendarX className="h-9 w-9 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No bookings yet</h2>
          <p className="text-muted-foreground mb-8 max-w-xs">
            You haven't made any bookings. Book a session to get started!
          </p>
          <Button asChild size="lg">
            <Link to="/book">Book Your First Session</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => {
            const statusInfo = STATUS_CONFIG[booking.status] ?? {
              label: booking.status,
              className: "bg-muted text-muted-foreground border-muted",
            };
            const totalPrice = booking.totalPrice ?? booking.totalAmount ?? booking.package?.price;
            const bookedDate = booking.createdAt ?? booking.bookedAt;

            return (
              <Card
                key={booking._id}
                className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Top accent stripe */}
                <div className="h-1.5 w-full bg-primary" />

                {/* Header: booking number + status badge */}
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

                {/* Content grid */}
                <CardContent className="pt-4 pb-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Column 1: Session date & time */}
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

                    {/* Column 2: Package & price */}
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

                    {/* Column 3: Booked on + action */}
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
