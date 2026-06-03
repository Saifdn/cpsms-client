import { useParams, useNavigate } from "react-router-dom";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useMyFrameOrderById, useCancelFrameOrder } from "@/hooks/frameOrders/useFrameOrders";
import { getFrameOrderStatus, getFrameOrderPaymentStatus } from "@/components/columns/FrameOrderColumns";
import { getShipmentStatus } from "@/lib/easyparcelStatus";
import {
  AlertCircle,
  ChevronLeft,
  Hash,
  Copy,
  CreditCard,
  Truck,
  Package,
  MapPin,
  List,
  XCircle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { SummaryRow, SectionCard } from "@/components/booking/BookingSummaryParts";
import { cn } from "@/lib/utils";

const STATUS_STEPS = [
  { key: "pending",   label: "Pending",   icon: Clock,         description: "Order received, awaiting payment" },
  { key: "paid",      label: "Paid",      icon: CheckCircle,   description: "Payment confirmed" },
  { key: "preparing", label: "Preparing", icon: Package,       description: "Frames are being prepared" },
  { key: "delivery",  label: "Delivery",  icon: Truck,         description: "Order is on the way" },
  { key: "delivered", label: "Delivered", icon: CheckCircle,   description: "Order delivered" },
];

const DeliverySubStepper = ({ shipment }) => {
  if (!shipment?.status_log?.length) return null;

  const sortedLogs = [...shipment.status_log].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  const latestCode = shipment.latest_shipment_status_code;
  const latestIndex = sortedLogs.findIndex((l) => l.shipment_status_code === latestCode);

  return (
    <div className="ml-10 mt-3 pl-4 border-l-2 border-dashed border-muted flex flex-col gap-4">
      {sortedLogs.map((log, idx) => {
        const statusInfo = getShipmentStatus(log.shipment_status_code);
        const isLatest = idx === latestIndex;
        const isPast = idx < latestIndex;
        const isFuture = idx > latestIndex;

        return (
          <div
            key={log._id ?? idx}
            className={`flex gap-3 items-start transition-opacity ${isFuture ? "opacity-40" : ""}`}
          >
            <div className="shrink-0 mt-0.5 -ml-[0.4rem]">
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 ${
                  isLatest
                    ? "bg-green-500 border-green-500 ring-4 ring-green-500/20 animate-pulse"
                    : isPast
                    ? "bg-green-500 border-green-500"
                    : "bg-background border-muted-foreground/40"
                }`}
              />
            </div>
            <div className="pb-1 min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${isLatest ? "text-primary" : "text-muted-foreground"}`}>
                {statusInfo.label}
              </p>
              <p className="text-sm font-medium text-foreground leading-snug">
                {log.tracking_status}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
                {isLatest && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-green-600 border border-green-500/30">
                    Latest
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LoadingSkeleton = () => (
  <Page>
    <PageHeader title="Order Details" description="Loading your order…" />
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="h-1.5 w-full bg-primary/20 rounded-t-xl" />
        <CardContent className="pt-6 pb-6 space-y-4">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </CardContent>
      </Card>
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6 pb-6 space-y-4">
            {[...Array(3)].map((__, j) => (
              <Skeleton key={j} className="h-16 w-full rounded-xl" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  </Page>
);

const GraduateFrameOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useMyFrameOrderById(id);
  const cancelOrder = useCancelFrameOrder();
  const order = response?.data;

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !order) {
    return (
      <Page>
        <div className="max-w-md mx-auto py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load this order.
          </p>
          <Button onClick={() => navigate("/my-frame-orders")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            My Frame Orders
          </Button>
        </div>
      </Page>
    );
  }

  const statusInfo = getFrameOrderStatus(order.status);
  const paymentInfo = getFrameOrderPaymentStatus(order.paymentStatus);
  const isCancelled = order.status === "cancelled";
  const canCancel = order.status === "pending" || order.status === "paid";
  const isInDelivery = order.status === "delivery";
  const currentStatusIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const delivery = order.shipment?.receiver ?? null;

  // snapshot prices — always use item.price, not item.frame.price
  const itemsTotal = order.items?.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  ) ?? 0;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber).then(() => {
      toast.success("Order number copied!");
    });
  };

  const handleCancel = () => {
    cancelOrder.mutate(order._id);
  };

  return (
    <Page>
      <PageHeader
        title="Order Details"
        description="View your frame order status and information"
      />

      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Order Summary Card ────────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <div className="h-1.5 w-full bg-primary" />
          <CardContent className="pt-5 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-xl font-bold tracking-tight">
                {order.orderNumber}
              </span>
              <button
                onClick={handleCopyOrderNumber}
                className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                title="Copy order number"
                aria-label="Copy order number"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            {order.createdAt && (
              <p className="text-sm text-muted-foreground mb-4">
                Ordered on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            )}
            <Badge className={`text-sm px-4 py-1.5 font-semibold border capitalize ${statusInfo.className}`}>
              {statusInfo.label}
            </Badge>
          </CardContent>
        </Card>

        {/* ── Status Tracker ────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="rounded-md p-1.5 bg-primary/10 text-primary">
                <List className="h-4 w-4" />
              </div>
              Order Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            {isCancelled ? (
              <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 shrink-0">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400">Order Cancelled</p>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-0.5">
                    This order has been cancelled.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-muted" />
                <div className="space-y-6">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;

                    return (
                      <div key={step.key}>
                        <div className="relative flex gap-4 items-start">
                          <div
                            className={cn(
                              "relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all",
                              isCurrent
                                ? "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20"
                                : isCompleted
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-muted text-muted-foreground"
                            )}
                          >
                            <step.icon className="h-4 w-4" />
                          </div>
                          <div className="pt-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-medium leading-none ${isCurrent ? "text-primary" : isCompleted ? "" : "text-muted-foreground"}`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
                                  Current Stage
                                </span>
                              )}
                            </div>
                            <p className="text-sm mt-0.5 text-muted-foreground">{step.description}</p>
                          </div>
                        </div>

                        {step.key === "delivery" && isInDelivery && order.shipment && (
                          <DeliverySubStepper shipment={order.shipment} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Order Items Card ──────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="rounded-md p-1.5 bg-primary/10 text-primary">
                <Package className="h-4 w-4" />
              </div>
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <SectionCard icon={Package} title="Items">
              {order.items?.map((item, i) => (
                <SummaryRow
                  key={item.frame?._id ?? i}
                  label={`${item.frame?.name ?? "Frame"} ×${item.quantity}`}
                  // snapshot price — use item.price, not item.frame.price
                  value={`RM ${(Number(item.price) * item.quantity).toFixed(2)}`}
                />
              ))}
            </SectionCard>

            {delivery && (delivery.name || delivery.address_1) && (
              <SectionCard icon={MapPin} title="Delivery Address">
                {delivery.name && <SummaryRow label="Recipient" value={delivery.name} />}
                {delivery.phone_number && (
                  <SummaryRow label="Phone" value={delivery.phone_number} />
                )}
                {delivery.email && <SummaryRow label="Email" value={delivery.email} />}
                {(delivery.address_1 || delivery.city) && (
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground shrink-0">Address</span>
                    <div className="text-right space-y-0.5">
                      {[
                        delivery.address_1,
                        delivery.address_2,
                        [delivery.postcode, delivery.city].filter(Boolean).join(", "),
                      ]
                        .filter(Boolean)
                        .map((line, i) => (
                          <div key={i} className="font-medium">{line}</div>
                        ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            )}

            {/* Payment Summary */}
            <div className="rounded-xl border p-4 space-y-2.5">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-md p-1.5 bg-primary/10 text-primary shrink-0">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">Payment Summary</span>
              </div>
              {order.items?.map((item, i) => (
                <SummaryRow
                  key={item.frame?._id ?? i}
                  label={`${item.frame?.name ?? "Frame"} ×${item.quantity}`}
                  value={`RM ${(Number(item.price) * item.quantity).toFixed(2)}`}
                />
              ))}
              <Separator className="my-1" />
              <div className="flex justify-between items-center gap-4">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  RM {Number(order.totalPrice ?? itemsTotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-4 pt-1">
                <span className="text-sm text-muted-foreground">Payment Status</span>
                <Badge className={`text-xs px-3 py-1 font-medium border capitalize ${paymentInfo.className}`}>
                  {paymentInfo.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Action Buttons ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Button
            variant="outline"
            onClick={() => navigate("/my-frame-orders")}
            className="flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            My Frame Orders
          </Button>

          {canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelOrder.isPending}
              className="flex-1"
            >
              {cancelOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling…
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Page>
  );
};

export default GraduateFrameOrderDetail;
