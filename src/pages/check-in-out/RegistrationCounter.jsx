import { Page, PageHeader } from "@/components/layout/Page";
import QrScanner from "@/components/QrScanner";
import BookingDetails from "@/components/BookingDetails";
import CheckInSuccessBanner from "@/components/counter/CheckInSuccessBanner";
import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";

import { useBookingDetails } from "@/hooks/counter/useBookingDetails";
import { useCheckIn } from "@/hooks/counter/useQueue";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function isWithinSessionRange(session) {
  if (!session?.date || !session?.startTime || !session?.endTime) return true;

  const sessionDate = new Date(session.date);
  const [startH, startM] = session.startTime.split(":").map(Number);
  const [endH, endM] = session.endTime.split(":").map(Number);

  const start = new Date(sessionDate);
  start.setHours(startH, startM, 0, 0);

  const end = new Date(sessionDate);
  end.setHours(endH, endM, 0, 0);

  return new Date() >= start && new Date() <= end;
}

const RegistrationCounter = () => {
  const [scannedBookingNumber, setScannedBookingNumber] = useState(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [successSnapshot, setSuccessSnapshot] = useState(null);

  const {
    data: bookingData,
    isLoading,
    error,
  } = useBookingDetails(scannedBookingNumber);

  const checkInMutation = useCheckIn();

  const booking = bookingData?.data ?? bookingData ?? null;

  const isOutOfRange = !isLoading && !!booking && !isWithinSessionRange(booking.session);
  const showOutOfRangeAlert = isOutOfRange && !alertDismissed;

  const handleScan = (bookingNumber) => {
    setScannedBookingNumber(bookingNumber);
    setAlertDismissed(false);
    setSuccessSnapshot(null);
  };

  const handleReset = () => {
    setScannedBookingNumber(null);
    setAlertDismissed(false);
  };

  const handleConfirmCheckIn = async () => {
    if (!scannedBookingNumber) return;
    try {
      await checkInMutation.mutateAsync({ bookingNumber: scannedBookingNumber });

      setSuccessSnapshot({
        bookingNumber: booking?.bookingNumber ?? scannedBookingNumber,
        fullName: booking?.graduate?.fullName ?? "Graduate",
        sessionTime:
          booking?.session?.startTime && booking?.session?.endTime && booking?.session?.date
            ? `${booking.session.startTime} — ${booking.session.endTime}, ${format(new Date(booking.session.date), "dd MMM yyyy")}`
            : null,
      });

      setScannedBookingNumber(null);
      setAlertDismissed(false);
    } catch {
      // Error toast is handled by the mutation's onError
    }
  };

  const sessionWindow =
    booking?.session?.startTime && booking?.session?.endTime && booking?.session?.date
      ? `${booking.session.startTime} — ${booking.session.endTime} on ${format(new Date(booking.session.date), "dd MMM yyyy")}`
      : null;

  const currentDateTime = format(new Date(), "hh:mm a, dd MMM yyyy");

  return (
    <Page>
      <PageHeader
        title="Registration Counter"
        description="Scan participant QR codes, verify registration details, and confirm check-ins quickly at the counter."
      />

      <div className="grid gap-6 py-8 lg:grid-cols-[440px_1fr]">
        {/* Left: QR Scanner */}
        <div className="space-y-3">
          <QrScanner onScan={handleScan} />
          {scannedBookingNumber && (
            <p className="text-xs text-center text-muted-foreground">
              Showing details for{" "}
              <span className="font-semibold text-foreground">{scannedBookingNumber}</span>
              {" · "}
              <button
                className="text-primary underline underline-offset-2 hover:no-underline"
                onClick={handleReset}
              >
                Scan another
              </button>
            </p>
          )}
        </div>

        {/* Right: Success banner OR Booking Details */}
        <div>
          {successSnapshot ? (
            <CheckInSuccessBanner
              snapshot={successSnapshot}
              onDismiss={() => setSuccessSnapshot(null)}
            />
          ) : (
            <BookingDetails
              booking={booking}
              loading={isLoading}
              error={error}
              onConfirm={handleConfirmCheckIn}
              confirmLoading={checkInMutation.isPending}
              showConfirmButton={!!bookingData}
            />
          )}
        </div>
      </div>

      {/* Out-of-range informational alert */}
      <AlertDialog open={showOutOfRangeAlert} onOpenChange={() => setAlertDismissed(true)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2 shrink-0">
                <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <AlertDialogTitle>Outside Session Time</AlertDialogTitle>
            </div>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  This graduate is checking in outside their booked session window.
                </p>
                {sessionWindow && (
                  <div className="rounded-md bg-muted px-4 py-3 space-y-1 text-foreground">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      Session Window
                    </p>
                    <p className="font-medium">{sessionWindow}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current time: {currentDateTime}
                    </p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertDismissed(true)}>
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
};

export default RegistrationCounter;
