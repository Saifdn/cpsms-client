import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import BookingDetails from "@/components/BookingDetails";

export function BookingViewSheet({ open, onOpenChange, booking }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto" side="right">
        <SheetHeader className="sr-only">
          <SheetTitle>Booking #{booking?.bookingNumber}</SheetTitle>
          <SheetDescription>Detailed view of this booking</SheetDescription>
        </SheetHeader>
        <BookingDetails booking={booking} loading={false} showConfirmButton={false} />
      </SheetContent>
    </Sheet>
  );
}
