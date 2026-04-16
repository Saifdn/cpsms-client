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
import { format } from "date-fns";

const BookingDetails = ({ booking, loading, error, onConfirm, showConfirmButton = true }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading booking details...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-red-500 text-center">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!booking) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Scan a QR code to view booking details
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">Booking #{booking.bookingNumber}</CardTitle>
          <Badge 
            variant={
              booking.status === "checked-in" ? "default" :
              booking.status === "completed" ? "secondary" : 
              "outline"
            }
            className="capitalize"
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Graduate Info */}
        <div>
          <p className="text-xs uppercase text-muted-foreground mb-1">Graduate</p>
          <p className="font-medium">{booking.graduate?.fullName}</p>
          <p className="text-sm text-muted-foreground">{booking.graduate?.email}</p>
          {booking.graduate?.phone && (
            <p className="text-sm text-muted-foreground">{booking.graduate.phone}</p>
          )}
        </div>

        <Separator />

        {/* Package Info */}
        <div>
          <p className="text-xs uppercase text-muted-foreground mb-1">Package</p>
          <p className="font-medium">{booking.package?.name}</p>
          <p className="text-sm text-muted-foreground">RM {booking.package?.price}</p>
        </div>

        <Separator />

        {/* Session Info */}
        <div>
          <p className="text-xs uppercase text-muted-foreground mb-1">Session</p>
          <p className="font-medium">
            {booking.session?.date 
              ? new Date(booking.session.date).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                }) 
              : '—'}
          </p>
          <p className="text-sm text-muted-foreground">
            {booking.session?.startTime} — {booking.session?.endTime}
          </p>
        </div>

        <Separator />

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Booked At</p>
            <p>{new Date(booking.bookedAt).toLocaleString()}</p>
          </div>
          {booking.checkInTime && (
            <div>
              <p className="text-muted-foreground">Check-in Time</p>
              <p>{new Date(booking.checkInTime).toLocaleString()}</p>
            </div>
          )}
        </div>

      </CardContent>

      {showConfirmButton && (
        <>
          <Separator />
          <CardFooter className="pt-6">
            <Button 
              onClick={onConfirm} 
              className="w-full py-5"
              disabled={!booking}
            >
              Confirm Check-In
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default BookingDetails;