// pages/booking/PaymentResult.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

import { usePaymentStatusById } from "@/hooks/payment/usePayments";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading, success, failed
  const [bookingNumber, setBookingNumber] = useState(null);

  const billplzId = searchParams.get("billplz[id]");
  const billplzPaid = searchParams.get("billplz[paid]"); // "true" or "false"
  const billplzXSignature = searchParams.get("billplz[x_signature]");

  // Use server-side status check when we have an id
  const {
    data: paymentStatusData,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = usePaymentStatusById(billplzId, Boolean(billplzId));

  useEffect(() => {
    if (isPaymentLoading) {
      setStatus("loading");
      return;
    }

    if (isPaymentError || !paymentStatusData) {
      // fallback to query param if server check failed
      if (billplzPaid === "true") {
        setStatus("success");
        setBookingNumber(billplzId || "N/A");
      } else {
        setStatus("failed");
      }
      return;
    }

    const paid = paymentStatusData.status === "paid";

    if (paid) {
      setStatus("success");
      setBookingNumber(paymentStatusData.bill_number || billplzId || "N/A");
    } else {
      setStatus("failed");
    }
  }, [isPaymentLoading, isPaymentError, paymentStatusData, billplzPaid, billplzId]);

  if (status === "loading") {
    return (
      <Page>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="max-w-md mx-auto pt-20 px-4">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            {status === "success" ? (
              <>
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-6">
                  Thank you! Your booking has been confirmed.
                </p>

                {bookingNumber && (
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-8">
                    <p className="text-sm text-muted-foreground">Bill Number</p>
                    <p className="font-mono text-2xl font-bold text-green-600">
                      {bookingNumber}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-2 text-red-600">Payment Failed</h1>
                <p className="text-muted-foreground mb-8">
                  Your payment was not successful. Please try again.
                </p>
              </>
            )}

            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => navigate(status === "success" ? "/" : "/book")}
              >
                {status === "success" ? "View My Bookings" : "Try Again"}
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default PaymentResult;