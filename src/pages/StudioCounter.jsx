import { Page, PageHeader } from "@/components/layout/Page";
import QrScanner from "@/components/QrScanner";
import { useState } from "react";
import BookingDetails from "@/components/BookingDetails";
import { bookingDetailsData } from "@/data/BookingDetails";

const StudioCounter = () => {
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Page>
      <PageHeader
        title="Studio Counter"
        description="Graduate registration."
      />

      <div className="grid gap-6 py-8 lg:grid-cols-[360px_1fr]">
        <div>
          <QrScanner
            onScan={(bookingId) => {
              setLoading(true);

              const found = bookingDetailsData.find((b) => b.id === bookingId);

              setBooking(found || null);

              setLoading(false);
            }}
          />
        </div>
        <div>
          <BookingDetails
            booking={booking}
            loading={loading}
            onConfirm={async () => {
              // await axios.post("/api/bookings/check-in", {
              //   bookingId: booking.id,
              // });
            }}
          />
          {/* {message} */}
        </div>
      </div>
    </Page>
  );
};

export default StudioCounter;
