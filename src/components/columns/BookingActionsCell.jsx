import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, Eye, XCircle } from "lucide-react";

import { BookingViewSheet } from "@/components/booking/BookingViewSheet";
import { useCancelBooking } from "@/hooks/studio/useBookings";

export function BookingActionsCell({ row }) {
  const booking = row.original;
  const cancelBooking = useCancelBooking();

  const [showViewSheet, setShowViewSheet] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const isCancellable =
    booking.status !== "cancelled" && booking.status !== "completed";

  const handleConfirmCancel = () => {
    cancelBooking.mutate(booking._id, {
      onSuccess: () => setShowCancelDialog(false),
    });
  };

  return (
    <>
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setShowViewSheet(true)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setShowCancelDialog(true)}
              className="cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/30"
              disabled={!isCancellable}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <BookingViewSheet
        open={showViewSheet}
        onOpenChange={setShowViewSheet}
        booking={booking}
      />

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full">
                <XCircle className="h-5 w-5" />
              </div>
              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to cancel booking{" "}
              <strong>#{booking.bookingNumber}</strong> for{" "}
              <strong>{booking.graduate?.fullName}</strong>? This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelBooking.isPending}>
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelBooking.isPending}
              className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-600"
            >
              {cancelBooking.isPending ? "Cancelling…" : "Yes, Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
