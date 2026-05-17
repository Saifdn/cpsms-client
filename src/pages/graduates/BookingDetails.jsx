// pages/booking/BookingDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyBookingById } from "@/hooks/studio/useBookings";
import { CheckCircle, Clock, UserCheck, Truck, Home, XCircle } from "lucide-react";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useMyBookingById(id);

  // Extract the actual booking data
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
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </Page>
    );
  }

  const statusSteps = [
    { key: "pending", label: "Pending", icon: Clock, description: "Booking request received" },
    { key: "booked", label: "Booked", icon: CheckCircle, description: "Booking confirmed" },
    { key: "checked-in", label: "Checked In", icon: UserCheck, description: "You have arrived at the studio" },
    { key: "in-progress", label: "In Progress", icon: UserCheck, description: "Session is ongoing" },
    { key: "completed", label: "Completed", icon: CheckCircle, description: "Session finished" },
  ];

  // Only show shipping steps if relevant
  const hasShipping = ["shipped", "delivered"].includes(booking.status);
  if (hasShipping) {
    statusSteps.push(
      { key: "shipped", label: "Shipped", icon: Truck, description: "Your items are on the way" },
      { key: "delivered", label: "Delivered", icon: Home, description: "Items delivered successfully" }
    );
  }

  const currentStatusIndex = statusSteps.findIndex(step => step.key === booking.status);
  const isCancelled = booking.status === "cancelled";

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

                return (
                  <div key={step.key} className="relative flex gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 
                        ${isCompleted ? "bg-primary border-primary text-white" : "border-muted"}`}
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
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {isCurrent && <p className="text-xs text-primary mt-1">Current Stage</p>}
                    </div>
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
                    <p className="text-sm text-muted-foreground">This booking has been cancelled</p>
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

            {booking.package?.services && booking.package.services.length > 0 && (
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
              <p className="text-2xl font-bold">RM {booking.totalAmount}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">PAYMENT STATUS</p>
              <p className="font-medium capitalize">{booking.paymentStatus}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
            Back
          </Button>
          <Button onClick={() => navigate("/graduate/my-bookings")} className="flex-1">
            View All Bookings
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default BookingDetails;