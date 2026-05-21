// pages/booking/BookingDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyBookingById } from "@/hooks/studio/useBookings";
import { getShipmentStatus } from "@/lib/easyparcelStatus";
import {
  CheckCircle, Clock, UserCheck, Truck, Package, XCircle, MapPin
} from "lucide-react";

// ─── Delivery Sub-Stepper ────────────────────────────────────────────────────
const DeliverySubStepper = ({ shipment }) => {
  if (!shipment?.status_log?.length) return null;

  const sortedLogs = [...shipment.status_log].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const latestCode = shipment.latest_shipment_status_code;

  // Find the index of the latest entry to determine past/future
  const latestIndex = sortedLogs.findIndex(
    (l) => l.shipment_status_code === latestCode
  );

  return (
    <div className="ml-14 mt-3 pl-4 border-l-2 border-dashed border-muted flex flex-col gap-4">
      {sortedLogs.map((log, idx) => {
        const statusInfo = getShipmentStatus(log.shipment_status_code);
        const isLatest = idx === latestIndex;
        const isPast = idx < latestIndex;
        const isFuture = idx > latestIndex;

        return (
          <div
            key={log._id}
            className={`flex gap-3 items-start transition-opacity ${
              isFuture ? "opacity-40" : ""
            }`}
          >
            {/* Dot */}
            <div className="flex-shrink-0 mt-0.5 -ml-[0.4rem]">
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 
                  ${isLatest
                    ? "bg-green-500 border-green-500 ring-4 ring-green-500/20 animate-pulse"
                    : isPast
                    ? "bg-green-500 border-green-500"
                    : "bg-background border-muted-foreground/40"
                  }`}
              />
            </div>

            {/* Content */}
            <div className="pb-1 min-w-0">
              {/* Label from status map as title */}
              <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5
                ${isLatest ? "text-primary" : "text-muted-foreground"}`}
              >
                {statusInfo.label}
              </p>

              {/* tracking_status as body */}
              <p className="text-sm font-medium text-foreground leading-snug">
                {log.tracking_status}
              </p>

              {/* Timestamp + badge row */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
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

// ─── Main Component ──────────────────────────────────────────────────────────
const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useMyBookingById(id);
  const booking = response?.data;

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center py-20">Loading booking details...</div>
      </Page>
    );
  }

  if (isError || !booking) {
    return (
      <Page>
        <div className="text-center py-20">
          <p className="text-red-500">Booking not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </Page>
    );
  }

  const DELIVERY_STATUSES = ["delivery", "shipped"];

  const statusSteps = [
    { key: "pending",     label: "Pending",     icon: Clock,      description: "Booking request received" },
    { key: "booked",      label: "Booked",       icon: CheckCircle, description: "Booking confirmed" },
    { key: "checked-in",  label: "Checked In",   icon: UserCheck,  description: "You have arrived at the studio" },
    { key: "in-progress", label: "In Progress",  icon: UserCheck,  description: "Session is ongoing" },
    { key: "completed",   label: "Completed",    icon: CheckCircle, description: "Session finished" },
    { key: "preparing",   label: "Preparing",    icon: Package,    description: "Items are being prepared for delivery" },
    { key: "delivery",    label: "Delivery",     icon: Truck,      description: "Items are on the way" },
  ];

  // Normalise "shipped" → "delivery" for index lookup
  const normalisedStatus = DELIVERY_STATUSES.includes(booking.status)
    ? "delivery"
    : booking.status;

  const currentStatusIndex = statusSteps.findIndex(
    (s) => s.key === normalisedStatus
  );
  const isCancelled = booking.status === "cancelled";
  const isInDelivery = DELIVERY_STATUSES.includes(booking.status);

  return (
    <Page>
      <PageHeader
        title="Booking Details"
        description={`Booking #${booking.bookingNumber}`}
      />

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Status Overview */}
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Booking Status</h2>
              <Badge
                variant={isCancelled ? "destructive" : "default"}
                className="capitalize text-sm px-4 py-1"
              >
                {booking.status.replace("-", " ")}
              </Badge>
            </div>

            {/* Vertical Stepper */}
            <div className="space-y-8 pl-4 border-l-2 border-muted ml-6">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isDeliveryStep = step.key === "delivery";

                return (
                  <div key={step.key}>
                    <div className="relative flex gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 
                          ${isCompleted
                            ? "bg-primary border-primary text-white"
                            : "border-muted"
                          }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="pt-1">
                        <p className={`font-medium ${isCurrent ? "text-primary" : ""}`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-primary mt-1">Current Stage</p>
                        )}
                      </div>
                    </div>

                    {/* Sub-stepper: only shown on delivery step when active */}
                    {isDeliveryStep && isInDelivery && booking.shipment && (
                      <DeliverySubStepper shipment={booking.shipment} />
                    )}
                  </div>
                );
              })}

              {isCancelled && (
                <div className="relative flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div className="pt-1">
                    <p className="font-medium text-red-600">Cancelled</p>
                    <p className="text-sm text-muted-foreground">
                      This booking has been cancelled
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Information */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <p className="text-xs text-muted-foreground">PACKAGE</p>
              <p className="font-medium">{booking.package?.name}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">SESSION DATE & TIME</p>
              <p className="font-medium">
                {new Date(booking.session?.date).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                • {booking.session?.startTime} - {booking.session?.endTime}
              </p>
            </div>

            {booking.package?.services?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">SERVICES INCLUDED</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {booking.package.services.map((service, idx) => (
                    <li key={idx}>{service}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground">TOTAL AMOUNT</p>
              <p className="text-2xl font-bold">RM {booking.totalPrice.toFixed(2)}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">PAYMENT STATUS</p>
              <p className="font-medium capitalize">{booking.paymentStatus}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">Back</Button>
          <Button onClick={() => navigate("/graduate/my-bookings")} className="flex-1">
            View All Bookings
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default BookingDetails;