// pages/graduate/MyBookings.jsx
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMyBookings } from "@/hooks/studio/useBookings";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

const MyBookings = () => {
  const { data, isLoading, isError, error, refetch } = useMyBookings();

  const bookings = data?.data ?? [];

  if (isLoading) {
    return (
      <Page>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your bookings...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <p className="text-red-600 text-lg mb-4">Failed to load bookings</p>
            <p className="text-muted-foreground mb-6">
              {error?.response?.data?.message || error?.message}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
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

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-3xl">
          <p className="text-3xl text-muted-foreground mb-3">No bookings yet</p>
          <p className="text-muted-foreground mb-8">You haven't made any bookings yet.</p>
          <Button asChild>
            <Link to="/booking">Book Your First Session</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      {booking.bookingNumber}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {booking.package?.name || "Studio Session"}
                    </p>
                  </div>

                  <Badge
                    variant={
                      booking.status === "paid" || booking.status === "confirmed"
                        ? "default"
                        : booking.status === "pending_payment"
                        ? "secondary"
                        : booking.status === "cancelled"
                        ? "destructive"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {booking.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date & Session */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">SESSION DATE</p>
                  <p className="font-medium">
                    {new Date(booking.session?.date).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Package Info */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">PACKAGE</p>
                  <p className="font-medium">{booking.package?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    RM {booking.totalAmount || booking.package?.price}
                  </p>
                </div>

                {/* Status & Action */}
                <div className="flex flex-col justify-between items-end">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">BOOKED ON</p>
                    <p className="text-sm">
                      {new Date(booking.bookedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link to={`/my-bookings/${booking._id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
};

export default MyBookings;