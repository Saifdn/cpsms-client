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

const BookingDetails = ({ booking, loading, onConfirm }) => {
  if (loading) {
    return <div>Loading...</div>; // later replace with Skeleton
  }

  if (!booking) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          No booking selected.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>{booking.name}</CardTitle>
        <Badge>{booking.status}</Badge>
      </CardHeader>

      <Separator />

      <CardContent className="grid grid-cols-2 gap-4 py-6">
        <div>
          <p className="text-sm text-muted-foreground">Booking ID</p>
          <p>{booking.id}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Studio</p>
          <p>{booking.studio}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Slot</p>
          <p>{booking.slot}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Date</p>
          <p>{booking.date}</p>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex gap-2">
        <Button onClick={onConfirm}>Confirm Check-In</Button>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  );
};

export default BookingDetails;