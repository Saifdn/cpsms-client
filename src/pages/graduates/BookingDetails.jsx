// pages/graduates/BookingDetails.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMyBookingById, useCancelBooking } from "@/hooks/studio/useBookings";
import { getBookingStatus, getPaymentStatus } from "@/lib/bookingStatus";
import { getShipmentStatus } from "@/lib/easyparcelStatus";
import {
  CheckCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  Truck,
  Package,
  XCircle,
  MapPin,
  ChevronLeft,
  CalendarDays,
  Camera,
  PlusCircle,
  List,
  AlertCircle,
  Hash,
  Copy,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import { SummaryRow, SectionCard } from "@/components/booking/BookingSummaryParts";

// ─── Delivery Sub-Stepper ────────────────────────────────────────────────────

const DeliverySubStepper = ({ shipment }) => {
  if (!shipment?.status_log?.length) return null;

  const sortedLogs = [...shipment.status_log].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  const latestCode = shipment.latest_shipment_status_code;
  const latestIndex = sortedLogs.findIndex((l) => l.shipment_status_code === latestCode);

  return (
    <div className="ml-10 mt-3 pl-4 border-l-2 border-dashed border-muted flex flex-col gap-4">
      {sortedLogs.map((log, idx) => {
        const statusInfo = getShipmentStatus(log.shipment_status_code);
        const isLatest = idx === latestIndex;
        const isPast = idx < latestIndex;
        const isFuture = idx > latestIndex;

        return (
          <div
            key={log._id}
            className={`flex gap-3 items-start transition-opacity ${isFuture ? "opacity-40" : ""}`}
          >
            <div className="shrink-0 mt-0.5 -ml-[0.4rem]">
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 ${
                  isLatest
                    ? "bg-green-500 border-green-500 ring-4 ring-green-500/20 animate-pulse"
                    : isPast
                    ? "bg-green-500 border-green-500"
                    : "bg-background border-muted-foreground/40"
                }`}
              />
            </div>
            <div className="pb-1 min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${isLatest ? "text-primary" : "text-muted-foreground"}`}>
                {statusInfo.label}
              </p>
              <p className="text-sm font-medium text-foreground leading-snug">
                {log.tracking_status}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
                {isLatest && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-green-600 border border-green-500/30">
                    Latest
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <Page>
    <PageHeader title="Booking Details" description="Loading your booking…" />
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="h-1.5 w-full bg-primary/20 rounded-t-xl" />
        <CardContent className="pt-6 pb-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 pb-6 space-y-5">
          <Skeleton className="h-5 w-36" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 pb-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    </div>
  </Page>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { data: response, isLoading, isError } = useMyBookingById(id);
  const cancelBooking = useCancelBooking();
  const booking = response?.data;

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !booking) {
    return (
      <Page>
        <div className="max-w-md mx-auto py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load this booking. It may have been removed or you may not have permission to view it.
          </p>
          <Button onClick={() => navigate("/my-bookings")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            My Bookings
          </Button>
        </div>
      </Page>
    );
  }

  const DELIVERY_STATUSES = ["delivery", "shipped"];
  const isCancelled = booking.status === "cancelled";
  const isInDelivery = DELIVERY_STATUSES.includes(booking.status);
  const isCancellable = ["pending", "booked"].includes(booking.status);

  const statusInfo = getBookingStatus(booking.status);
  const paymentInfo = getPaymentStatus(booking.paymentStatus);

  const statusSteps = [
    { key: "pending",      label: "Pending",      icon: Clock,        description: "Booking request received" },
    { key: "booked",       label: "Booked",        icon: CheckCircle,  description: "Booking confirmed" },
    { key: "checked-in",   label: "Checked In",    icon: UserCheck,    description: "You have arrived at the studio" },
    { key: "in-progress",  label: "In Progress",   icon: UserCheck,    description: "Session is ongoing" },
    { key: "completed",    label: "Completed",     icon: CheckCircle2, description: "Session finished" },
    { key: "preparing",    label: "Preparing",     icon: Package,      description: "Items are being prepared for delivery" },
    { key: "delivery",     label: "Delivery",      icon: Truck,        description: "Items are on the way" },
  ];

  const normalisedStatus = DELIVERY_STATUSES.includes(booking.status) ? "delivery" : booking.status;
  const currentStatusIndex = statusSteps.findIndex((s) => s.key === normalisedStatus);

  const addons = booking.addons ?? booking.selectedAddons ?? [];
  const packagePrice = Number(booking.package?.price) || 0;
  const addonsTotal = addons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const totalPrice = Number(booking.totalPrice) || packagePrice + addonsTotal;

  const bookedDate = booking.createdAt ?? booking.bookedAt;
  const delivery = booking.deliveryAddress?.receiver ?? booking.deliveryAddress ?? null;

  const handleCopyBookingNumber = () => {
    navigator.clipboard.writeText(booking.bookingNumber).then(() => {
      toast.success("Booking number copied!");
    });
  };

  const handleConfirmCancel = () => {
    cancelBooking.mutate(booking._id, {
      onSuccess: () => navigate("/my-bookings"),
    });
  };

  return (
    <Page>
      <PageHeader
        title="Booking Details"
        description="View your booking status and information"
      />

      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Booking Summary Card ──────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <div className="h-1.5 w-full bg-primary" />
          <CardContent className="pt-5 pb-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Left: booking info + status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xl font-bold tracking-tight">
                    {booking.bookingNumber}
                  </span>
                  <button
                    onClick={handleCopyBookingNumber}
                    className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                    title="Copy booking number"
                    aria-label="Copy booking number"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                {bookedDate && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Booked on{" "}
                    {new Date(bookedDate).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                )}
                <Badge className={`text-sm px-4 py-1.5 font-semibold border capitalize ${statusInfo.className}`}>
                  {statusInfo.label}
                </Badge>
              </div>

              {/* Right: QR code for check-in */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="p-3 rounded-xl border bg-white shadow-sm">
                  <QRCode
                    value={booking.bookingNumber}
                    size={110}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground text-center leading-tight">
                  Show this at the<br />check-in counter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Status Tracker Card ───────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="rounded-md p-1.5 bg-primary/10 text-primary">
                <List className="h-4 w-4" />
              </div>
              Booking Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {isCancelled ? (
              <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 shrink-0">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400">Booking Cancelled</p>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-0.5">
                    This booking has been cancelled. Please make a new booking if needed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-muted" />
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const isDeliveryStep = step.key === "delivery";

                    return (
                      <div key={step.key}>
                        <div className="relative flex gap-4 items-start">
                          <div
                            className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                              isCurrent
                                ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20"
                                : isCompleted
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <step.icon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="pt-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-medium leading-none ${isCurrent ? "text-primary" : isCompleted ? "" : "text-muted-foreground"}`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
                                  Current Stage
                                </span>
                              )}
                            </div>
                            <p className="text-sm mt-0.5 text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        {isDeliveryStep && isInDelivery && booking.shipment && (
                          <DeliverySubStepper shipment={booking.shipment} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Booking Information Card ──────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="rounded-md p-1.5 bg-primary/10 text-primary">
                <Camera className="h-4 w-4" />
              </div>
              Booking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">

            <SectionCard icon={CalendarDays} title="Session Details">
              <SummaryRow
                label="Date"
                value={
                  booking.session?.date
                    ? new Date(booking.session.date).toLocaleDateString("en-GB", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric",
                      })
                    : null
                }
              />
              <SummaryRow
                label="Time"
                value={
                  booking.session?.startTime && booking.session?.endTime
                    ? `${booking.session.startTime} – ${booking.session.endTime}`
                    : null
                }
              />
              {booking.session?.studio?.name && (
                <SummaryRow label="Studio" value={booking.session.studio.name} />
              )}
            </SectionCard>

            <SectionCard icon={Camera} title="Package">
              <SummaryRow label="Name" value={booking.package?.name} />
              <SummaryRow
                label="Price"
                value={booking.package?.price != null ? `RM ${Number(booking.package.price).toFixed(2)}` : null}
              />
              {booking.package?.services?.length > 0 && (
                <div className="pt-1 space-y-1.5">
                  <span className="text-xs text-muted-foreground">Includes:</span>
                  <ul className="space-y-1.5">
                    {booking.package.services.map((service, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-green-500" />
                        <span className="text-foreground/80 leading-snug">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </SectionCard>

            {addons.length > 0 && (
              <SectionCard icon={PlusCircle} title="Add-ons">
                {addons.map((addon, i) => (
                  <SummaryRow
                    key={addon._id ?? i}
                    label={addon.name}
                    value={addon.price != null ? `RM ${Number(addon.price).toFixed(2)}` : null}
                  />
                ))}
              </SectionCard>
            )}

            {delivery && (delivery.name || delivery.address_1) && (
              <SectionCard icon={MapPin} title="Delivery Address">
                {delivery.name && <SummaryRow label="Recipient" value={delivery.name} />}
                {delivery.phone_number && (
                  <SummaryRow label="Phone" value={`+60 ${delivery.phone_number}`} />
                )}
                {delivery.email && <SummaryRow label="Email" value={delivery.email} />}
                {(delivery.address_1 || delivery.city) && (
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground shrink-0">Address</span>
                    <div className="text-right space-y-0.5">
                      {[
                        delivery.address_1,
                        delivery.address_2,
                        [delivery.postcode, delivery.city].filter(Boolean).join(", "),
                      ]
                        .filter(Boolean)
                        .map((line, i) => (
                          <div key={i} className="font-medium">{line}</div>
                        ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            )}

            {/* Payment Summary */}
            <div className="rounded-xl border p-4 space-y-2.5">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-md p-1.5 bg-primary/10 text-primary shrink-0">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">Payment Summary</span>
              </div>
              <SummaryRow label="Package" value={`RM ${packagePrice.toFixed(2)}`} />
              {addons.length > 0 && (
                <SummaryRow
                  label={`Add-ons (${addons.length})`}
                  value={`RM ${addonsTotal.toFixed(2)}`}
                />
              )}
              <Separator className="my-1" />
              <div className="flex justify-between items-center gap-4">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  RM {totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-4 pt-1">
                <span className="text-sm text-muted-foreground">Payment Status</span>
                <Badge className={`text-xs px-3 py-1 font-medium border capitalize ${paymentInfo.className}`}>
                  {paymentInfo.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Action Buttons ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Button variant="outline" onClick={() => navigate("/my-bookings")} className="flex-1">
            <ChevronLeft className="mr-2 h-4 w-4" />
            My Bookings
          </Button>
          {isCancellable && (
            <Button
              variant="destructive"
              onClick={() => setCancelDialogOpen(true)}
              className="flex-1"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Booking
            </Button>
          )}
        </div>
      </div>

      {/* ── Cancel Confirmation Dialog ────────────────────────────────── */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel booking <strong>{booking.bookingNumber}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelBooking.isPending}>
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelBooking.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelBooking.isPending ? "Cancelling…" : "Yes, Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
};

export default BookingDetails;
