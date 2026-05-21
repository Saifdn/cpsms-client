import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { bookingColumns } from "@/components/columns/BookingColumns";

import { useBookings } from "@/hooks/studio/useBookings";

import { CreateBookingDialog } from "@/pages/booking/CreateBookingDialog";

const Booking = () => {
  const { data: bookingsData, isLoading } = useBookings();

  const bookings = bookingsData?.data || [];

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <Page>
      <PageHeader
        title="Booking Management"
        description="Help graduates book sessions"
      />

      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>

      <DataTable
        title="All Bookings"
        description="List of all graduate bookings with status"
        columns={bookingColumns}
        data={bookings}
        isLoading={isLoading}
      />

      <CreateBookingDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </Page>
  );
};

export default Booking;