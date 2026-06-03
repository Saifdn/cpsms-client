import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/layout/Page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Home, List, Clock } from "lucide-react";
import { useMyFrameOrderById } from "@/hooks/frameOrders/useFrameOrders";

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
        .hourglass-svg { animation: flip 2.4s ease-in-out infinite; transform-origin: center; }
        @keyframes flip {
          0%   { transform: rotate(0deg); }
          40%  { transform: rotate(0deg); }
          50%  { transform: rotate(180deg); }
          90%  { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        .sand-top { animation: drainTop 2.4s ease-in infinite; transform-origin: 40px 28px; }
        .sand-bottom { animation: fillBottom 2.4s ease-in infinite; transform-origin: 40px 52px; }
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
        .sand-stream { animation: stream 2.4s ease-in infinite; }
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
        fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"
        className="text-primary"
      />
      <clipPath id="topClipFO"><path d="M22 14 L58 14 L44 34 L36 34 Z" /></clipPath>
      <path d="M22 14 L58 14 L44 34 L36 34 Z" fill="currentColor"
        className="text-primary sand-top" clipPath="url(#topClipFO)" opacity="0.7" />
      <clipPath id="bottomClipFO"><path d="M36 46 L44 46 L60 66 L20 66 Z" /></clipPath>
      <path d="M36 46 L44 46 L60 66 L20 66 Z" fill="currentColor"
        className="text-primary sand-bottom" clipPath="url(#bottomClipFO)" opacity="0.7" />
      <rect x="39" y="34" width="2" height="12" fill="currentColor"
        className="text-primary sand-stream" opacity="0.6" />
    </svg>
  </div>
);

// ─── Auto-redirect countdown ──────────────────────────────────────────────────

const AutoRedirectCountdown = ({ seconds, onRedirect }) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) { onRedirect(); return; }
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

const FrameOrderPaymentResult = () => {
  const navigate = useNavigate();
  const [timedOut, setTimedOut] = useState(false);

  const frameOrderId = sessionStorage.getItem("pendingFrameOrderId");

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 1 * 60 * 1000);
    return () => clearTimeout(timer);
  }, []);

  const { data, isPending, isFetching, isError } = useMyFrameOrderById(frameOrderId, {
    refetchInterval: (query) => {
      if (timedOut) return false;
      const paymentStatus = query.state.data?.data?.paymentStatus;
      if (paymentStatus === "paid" || paymentStatus === "failed") return false;
      return 3000;
    },
  });

  const orderData = data?.data;

  const status = !frameOrderId
    ? "failed"
    : orderData?.paymentStatus === "paid"
    ? "success"
    : orderData?.paymentStatus === "failed" || isError
    ? "failed"
    : timedOut
    ? "timeout"
    : isPending || isFetching || orderData?.paymentStatus === "pending"
    ? "loading"
    : "failed";

  const handleSuccessRedirect = () => {
    sessionStorage.removeItem("pendingFrameOrderId");
    navigate(frameOrderId ? `/my-frame-orders/${frameOrderId}` : "/my-frame-orders");
  };

  if (status === "timeout") {
    return (
      <Page>
        <div className="max-w-md mx-auto pt-20 px-4">
          <Card className="text-center overflow-hidden">
            <div className="h-1.5 w-full bg-amber-400" />
            <CardContent className="pt-10 pb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
                <Clock className="h-14 w-14 text-amber-500" />
              </div>
              <h1 className="text-2xl font-semibold mb-3">Payment Verification Delayed</h1>
              <p className="text-muted-foreground mb-2">
                We couldn&apos;t confirm your payment status within the expected time.
              </p>
              <p className="text-muted-foreground mb-8">
                Please check your{" "}
                <span className="font-semibold text-foreground">My Frame Orders</span>{" "}
                page in about{" "}
                <span className="font-semibold text-foreground">10 minutes</span>{" "}
                to see if your order has been confirmed.
              </p>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => navigate("/my-frame-orders")}>
                  <List className="mr-2 h-4 w-4" />
                  Go to My Frame Orders
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

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
          <div className={`h-1.5 w-full ${status === "success" ? "bg-green-500" : "bg-red-500"}`} />
          <CardContent className="pt-10 pb-10">
            {status === "success" ? (
              <>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                  <CheckCircle className="h-14 w-14 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground mb-6">
                  Thank you! Your frame order has been confirmed.
                </p>
                {orderData?.orderNumber && (
                  <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 p-4 rounded-xl mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                      Order Number
                    </p>
                    <p className="font-mono text-2xl font-bold text-green-600 dark:text-green-400">
                      {orderData.orderNumber}
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  <Button className="w-full" onClick={handleSuccessRedirect}>
                    <List className="mr-2 h-4 w-4" />
                    View Order Details
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </div>
                <AutoRedirectCountdown seconds={8} onRedirect={handleSuccessRedirect} />
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                  <XCircle className="h-14 w-14 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2 text-red-600">Payment Failed</h1>
                <p className="text-muted-foreground mb-8">
                  Your payment was not successful. Please try again or contact support.
                </p>
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => navigate("/frames")}>
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

export default FrameOrderPaymentResult;
