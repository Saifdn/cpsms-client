import { Page, PageHeader } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

import { DataTable } from "@/components/ui/data-table";
import { bookingColumns } from "@/components/columns/BookingColumns";

import { useBookings } from "@/hooks/studio/useBookings";

import { CreateBookingDialog } from "@/pages/booking/CreateBookingDialog";

const Booking = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: bookingsData, isLoading } = useBookings({ page: currentPage, limit, search: debouncedSearch });

  const bookings = bookingsData?.data || [];
  const pagination = bookingsData?.pagination;

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

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
        currentPage={currentPage}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        limit={limit}
        onLimitChange={handleLimitChange}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <CreateBookingDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </Page>
  );
};

export default Booking;