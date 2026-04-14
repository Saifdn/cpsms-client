import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

import { DeleteAlertDialog } from "@/components/dialog/DeleteAlertDialog";
import { ViewDetailsDialog } from "@/components/dialog/ViewDetailsDialog";

import { useDeleteBooking, useUpdateBooking } from "@/hooks/studio/useBookings";

export function BookingActionsCell({ row }) {
  const booking = row.original;
  const deleteBooking = useDeleteBooking();
  const updateBooking = useUpdateBooking();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Handle Cancel Booking (change status)
  const handleCancelBooking = () => {
    updateBooking.mutate({
      id: booking._id,
      status: "cancelled",
    });
  };

  // Handle Hard Delete
  const handleDelete = () => {
    deleteBooking.mutate(booking._id);
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
              onClick={() => setShowViewDialog(true)} 
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem 
              onClick={handleCancelBooking}
              className="cursor-pointer text-amber-600"
              disabled={booking.status === "cancelled" || booking.status === "completed"}
            >
              Cancel Booking
            </DropdownMenuItem>

            {/* <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* View Details Dialog */}
      <ViewDetailsDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        title={`Booking #${booking.bookingNumber}`}
        data={booking}
        fields={[
          { key: "bookingNumber", label: "Booking Number" },
          { key: "graduate.fullName", label: "Graduate" },
          { key: "package.name", label: "Package" },
          { key: "session.date", label: "Date", isDate: true },
          { key: "session.startTime", label: "Start Time" },
          { key: "session.endTime", label: "End Time" },
          { key: "status", label: "Status", isBadge: true },
          { key: "bookedAt", label: "Booked At", isDate: true },
          { key: "checkInTime", label: "Check-in Time", isDate: true },
        ]}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteAlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        itemName={`Booking #${booking.bookingNumber}`}
      />
    </>
  );
}