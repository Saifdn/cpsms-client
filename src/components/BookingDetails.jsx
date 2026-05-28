import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  Camera,
  CalendarDays,
  Clock,
  Plus,
  Hash,
  Receipt,
  QrCode,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  booked: {
    label: "Booked",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  "checked-in": {
    label: "Checked In",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  completed: {
    label: "Completed",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  },
};


function InfoRow({ icon, label, value }) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-muted-foreground">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium leading-snug break-all">{value || "—"}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
      {children}
    </p>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-4 bg-muted/40 border-b">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const BookingDetails = ({
  booking,
  loading,
  error,
  onConfirm,
  confirmLoading,
  showConfirmButton = true,
}) => {
  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <Card className="border-destructive/40">
        <CardContent className="p-10 flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-destructive/10 p-3 mb-1">
            <QrCode size={22} className="text-destructive" />
          </div>
          <p className="font-semibold text-destructive">Booking Not Found</p>
          <p className="text-sm text-muted-foreground">
            {error?.response?.data?.message ||
              "Please check the QR code and try again."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!booking) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-12 flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-muted p-4">
            <QrCode size={28} className="text-muted-foreground" />
          </div>
          <p className="font-medium text-muted-foreground">No booking scanned</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Scan a graduate's QR code to view their booking details here
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = STATUS_CONFIG[booking.status] ?? {
    label: booking.status,
    className: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const sessionDate = booking.session?.date
    ? format(new Date(booking.session.date), "dd MMM yyyy")
    : "—";

  const bookedAt = booking.bookedAt
    ? format(new Date(booking.bookedAt), "dd MMM yyyy, hh:mm a")
    : "—";

  const addons = booking.addons ?? [];
  const packagePrice = booking.package?.price ?? 0;
  const addonsTotal = addons.reduce((sum, a) => sum + (a.price ?? 0), 0);
  const total = booking.totalPrice ?? packagePrice + addonsTotal;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-muted/40 border-b pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1 mb-1">
              <Hash size={10} /> Booking Number
            </p>
            <CardTitle className="text-lg font-bold tracking-wide">
              {booking.bookingNumber}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Booked on {bookedAt}</p>
          </div>
          <Badge className={cn("shrink-0 capitalize border text-xs", statusConfig.className)}>
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y">
        {/* Graduate */}
        <div className="p-5">
          <SectionLabel>Graduate</SectionLabel>
          <div className="space-y-3">
            <InfoRow icon={User} label="Full Name" value={booking.graduate?.fullName} />
            <InfoRow icon={Mail} label="Email" value={booking.graduate?.email} />
            <InfoRow icon={Phone} label="Phone" value={booking.graduate?.phone} />
          </div>
        </div>

        {/* Session */}
        <div className="p-5">
          <SectionLabel>Session</SectionLabel>
          <div className="space-y-3">
            <InfoRow icon={CalendarDays} label="Date" value={sessionDate} />
            <InfoRow
              icon={Clock}
              label="Time Slot"
              value={
                booking.session?.startTime && booking.session?.endTime
                  ? `${booking.session.startTime} — ${booking.session.endTime}`
                  : "—"
              }
            />
          </div>
        </div>

        {/* Package & Add-ons */}
        <div className="p-5">
          <SectionLabel>Package &amp; Add-ons</SectionLabel>
          <div className="space-y-2.5">
            {/* Package row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Camera size={14} className="shrink-0 text-muted-foreground" />
                <span className="font-medium">{booking.package?.name || "—"}</span>
              </div>
              <span className="text-sm font-medium tabular-nums">
                RM {packagePrice.toFixed(2)}
              </span>
            </div>

            {/* Addons rows */}
            {addons.length > 0 ? (
              addons.map((addon) => (
                <div key={addon._id} className="flex items-center justify-between pl-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Plus size={12} className="shrink-0" />
                    <span>{addon.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    RM {(addon.price ?? 0).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground pl-5">No add-ons</p>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="px-5 py-4 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Receipt size={15} />
            Total Amount
          </div>
          <span className="text-xl font-bold tabular-nums">RM {total.toFixed(2)}</span>
        </div>
      </CardContent>

      {showConfirmButton && (() => {
        const canCheckIn = booking.status === "booked";

        return (
          <>
            {!canCheckIn && (
              <div className="px-5 py-3 bg-muted border-t flex items-start gap-2.5">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Check-in is only allowed for <span className="font-semibold">Booked</span> status.
                  This booking is currently <span className="font-semibold">{statusConfig.label}</span>.
                </p>
              </div>
            )}
            <CardFooter className="p-4 border-t bg-background">
              <Button
                onClick={onConfirm}
                className="w-full h-11 text-base font-semibold"
                disabled={!canCheckIn || confirmLoading}
              >
                {confirmLoading ? "Processing…" : "Confirm Check-In"}
              </Button>
            </CardFooter>
          </>
        );
      })()}
    </Card>
  );
};

export default BookingDetails;
