// pages/graduates/PaymentResult.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/layout/Page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Home, List } from "lucide-react";
import { usePaymentStatusById } from "@/hooks/payment/usePayments";

// ─── Hourglass Animation ──────────────────────────────────────────────────────

const HourglassAnimation = () => (
  <div className="flex justify-center mb-6">
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      className="hourglass-svg"
    >
      <style>{`
        .hourglass-svg {
          animation: flip 2.4s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes flip {
          0%   { transform: rotate(0deg); }
          40%  { transform: rotate(0deg); }
          50%  { transform: rotate(180deg); }
          90%  { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        .sand-top {
          animation: drainTop 2.4s ease-in infinite;
          transform-origin: 40px 28px;
        }
        .sand-bottom {
          animation: fillBottom 2.4s ease-in infinite;
          transform-origin: 40px 52px;
        }
        @keyframes drainTop {
          0%   { transform: scaleY(1); opacity: 1; }
          45%  { transform: scaleY(0); opacity: 0; }
          50%  { transform: scaleY(0); opacity: 0; }
          51%  { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes fillBottom {
          0%   { transform: scaleY(0); opacity: 0; }
          10%  { transform: scaleY(0); opacity: 0; }
          45%  { transform: scaleY(1); opacity: 1; }
          50%  { transform: scaleY(1); opacity: 1; }
          51%  { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(0); opacity: 0; }
        }
        .sand-stream {
          animation: stream 2.4s ease-in infinite;
        }
        @keyframes stream {
          0%   { opacity: 1; }
          45%  { opacity: 0; }
          51%  { opacity: 1; }
          96%  { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>

      <path
        d="M20 10 L60 10 L60 14 L44 34 L44 46 L60 66 L60 70 L20 70 L20 66 L36 46 L36 34 L20 14 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        className="text-primary"
      />
      <clipPath id="topClip">
        <path d="M22 14 L58 14 L44 34 L36 34 Z" />
      </clipPath>
      <path
        d="M22 14 L58 14 L44 34 L36 34 Z"
        fill="currentColor"
        className="text-primary sand-top"
        clipPath="url(#topClip)"
        opacity="0.7"
      />
      <clipPath id="bottomClip">
        <path d="M36 46 L44 46 L60 66 L20 66 Z" />
      </clipPath>
      <path
        d="M36 46 L44 46 L60 66 L20 66 Z"
        fill="currentColor"
        className="text-primary sand-bottom"
        clipPath="url(#bottomClip)"
        opacity="0.7"
      />
      <rect
        x="39" y="34" width="2" height="12"
        fill="currentColor"
        className="text-primary sand-stream"
        opacity="0.6"
      />
    </svg>
  </div>
);

// ─── Auto-redirect countdown ──────────────────────────────────────────────────

const AutoRedirectCountdown = ({ seconds, onRedirect }) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onRedirect();
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onRedirect]);

  const progress = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="mt-6 space-y-2">
      <p className="text-sm text-muted-foreground">
        Redirecting in <span className="font-semibold text-foreground">{remaining}s</span>
      </p>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resolved, setResolved] = useState(false);

  const billplzId = searchParams.get("billplz[id]");

  const { data, isPending, isFetching, isError } = usePaymentStatusById(billplzId, {
    refetchInterval: (query) => {
      const status = query.state.data?.data?.paymentStatus;
      if (status === "paid" || status === "failed") return false;
      return 3000;
    },
  });

  const paymentData = data?.data;

  const status = !billplzId
    ? "failed"
    : !resolved && (isPending || isFetching || paymentData?.paymentStatus === "pending")
    ? "loading"
    : isError
    ? "failed"
    : paymentData?.paymentStatus === "paid"
    ? "success"
    : "failed";

  const bookingNumber = paymentData?.bookingNumber;
  const bookingId = paymentData?.bookingId;

  useEffect(() => {
    if (!isPending && !isFetching && paymentData?.paymentStatus && paymentData.paymentStatus !== "pending") {
      const timer = setTimeout(() => setResolved(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isPending, isFetching, paymentData?.paymentStatus]);

  if (status === "loading") {
    return (
      <Page>
        <div className="max-w-md mx-auto pt-20 px-4">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <HourglassAnimation />
              <h1 className="text-2xl font-semibold mb-3">Processing Payment</h1>
              <p className="text-muted-foreground mb-8">
                Please wait while we confirm your payment.
                <br />
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Do not close this browser window.
                </span>
              </p>
              <p className="text-sm text-muted-foreground">This may take a few seconds…</p>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="max-w-md mx-auto pt-20 px-4">
        <Card className="text-center overflow-hidden">
          {/* Top accent */}
          <div className={`h-1.5 w-full ${status === "success" ? "bg-green-500" : "bg-red-500"}`} />

          <CardContent className="pt-10 pb-10">
            {status === "success" ? (
              <>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                  <CheckCircle className="h-14 w-14 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-6">
                  Thank you! Your booking has been confirmed.
                </p>
                {bookingNumber && (
                  <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 p-4 rounded-xl mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                      Booking Number
                    </p>
                    <p className="font-mono text-2xl font-bold text-green-600 dark:text-green-400">
                      {bookingNumber}
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => navigate(bookingId ? `/my-bookings/${bookingId}` : "/my-bookings")}
                  >
                    <List className="mr-2 h-4 w-4" />
                    View Booking Details
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </div>
                <AutoRedirectCountdown
                  seconds={8}
                  onRedirect={() => navigate(bookingId ? `/my-bookings/${bookingId}` : "/my-bookings")}
                />
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                  <XCircle className="h-14 w-14 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2 text-red-600">Payment Failed</h1>
                <p className="text-muted-foreground mb-8">
                  Your payment was not successful. Please try again or contact support if the issue persists.
                </p>
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => navigate("/book")}>
                    Try Again
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default PaymentResult;
