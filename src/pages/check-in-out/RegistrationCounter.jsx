import { Page, PageHeader } from "@/components/layout/Page";
import QrScanner from "@/components/QrScanner";
import BookingDetails from "@/components/BookingDetails";
import { useState } from "react";

import { useBookingDetails } from "@/hooks/counter/useBookingDetails";
import { useCheckIn } from "@/hooks/counter/useQueue";

const RegistrationCounter = () => {
  const [scannedBookingNumber, setScannedBookingNumber] = useState(null);

  // Fetch booking details when QR is scanned
  const { 
    data: bookingData, 
    isLoading, 
    error 
  } = useBookingDetails(scannedBookingNumber);

  const checkInMutation = useCheckIn();

  // When QR code is scanned
  const handleScan = (bookingNumber) => {
    setScannedBookingNumber(bookingNumber);
  };

  // Staff confirms after reviewing details
  const handleConfirmCheckIn = async () => {
    if (!scannedBookingNumber) return;

    try {
      await checkInMutation.mutateAsync({ 
        bookingNumber: scannedBookingNumber 
      });

      // alert(`Check-in confirmed successfully for booking #${scannedBookingNumber}`);

      // Reset for next customer
      setScannedBookingNumber(null);

    } catch (err) {
      // Error is already handled by toast in the hook
      console.error(err);
    }
  };

  return (
    <Page>
      <PageHeader
        title="Registration Counter"
        description="Scan QR code → Verify details → Confirm check-in"
      />

      <div className="grid gap-6 py-8 lg:grid-cols-[500px_1fr]">
        
        {/* Left: QR Scanner */}
        <div>
          <QrScanner 
            onScan={handleScan}
            isScanning={!scannedBookingNumber}   // Disable scanner while reviewing
          />
        </div>

        {/* Right: Booking Details + Confirm */}
        <div>
          <BookingDetails
            booking={bookingData?.data || bookingData}
            loading={isLoading}
            error={error}
            onConfirm={handleConfirmCheckIn}
            showConfirmButton={!!bookingData}   // Only show button after successful fetch
          />
        </div>
      </div>
    </Page>
  );
};

export default RegistrationCounter;