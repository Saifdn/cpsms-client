import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page, PageHeader } from "@/components/layout/Page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFrameOrderById, useUpdateFrameOrder } from "@/hooks/frameOrders/useFrameOrders";
import { getFrameOrderStatus, getFrameOrderPaymentStatus } from "@/components/columns/FrameOrderColumns";
import { SummaryRow, SectionCard } from "@/components/booking/BookingSummaryParts";
import {
  AlertCircle,
  ChevronLeft,
  Hash,
  CreditCard,
  Package,
  MapPin,
  User,
  Loader2,
  ClipboardEdit,
} from "lucide-react";

// Status transitions: only forward steps allowed
const NEXT_STATUSES = {
  paid:      [{ value: "preparing", label: "Preparing" }],
  preparing: [{ value: "delivery",  label: "Delivery" }],
  delivery:  [{ value: "delivered", label: "Delivered" }],
};

const LoadingSkeleton = () => (
  <Page>
    <PageHeader title="Frame Order Detail" description="Loading order…" />
    <div className="max-w-3xl mx-auto space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-6 pb-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            {[...Array(4)].map((__, j) => (
              <Skeleton key={j} className="h-5 w-full" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  </Page>
);

const AdminFrameOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useFrameOrderById(id);
  const updateOrder = useUpdateFrameOrder();
  const order = response?.data;

  const [pendingStatus, setPendingStatus] = useState("");

  if (isLoading) return <LoadingSkeleton />;

  if (isError || !order) {
    return (
      <Page>
        <div className="max-w-md mx-auto py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">This order could not be loaded.</p>
          <Button onClick={() => navigate("/frame-orders")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Frame Orders
          </Button>
        </div>
      </Page>
    );
  }

  const statusInfo = getFrameOrderStatus(order.status);
  const paymentInfo = getFrameOrderPaymentStatus(order.paymentStatus);
  const graduate = order.graduate;
  const delivery = order.shipment?.receiver ?? null;

  // snapshot prices — always use item.price, not item.frame.price
  const itemsTotal = order.items?.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  ) ?? 0;

  const nextStatusOptions = NEXT_STATUSES[order.status] ?? [];
  const selectValue = pendingStatus || "";

  const handleStatusUpdate = () => {
    if (!pendingStatus) return;
    updateOrder.mutate(
      { id: order._id, status: pendingStatus },
      { onSuccess: () => setPendingStatus("") }
    );
  };

  return (
    <Page>
      <PageHeader
        title="Frame Order Detail"
        description="View and manage this frame order"
      />

      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Header Card ───────────────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <div className="h-1.5 w-full bg-primary" />
          <CardContent className="pt-5 pb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xl font-bold tracking-tight">
                    {order.orderNumber}
                  </span>
                </div>
                {order.createdAt && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge className={`text-sm px-4 py-1.5 font-semibold border capitalize ${statusInfo.className}`}>
                    {statusInfo.label}
                  </Badge>
                  <Badge className={`text-sm px-4 py-1.5 font-medium border capitalize ${paymentInfo.className}`}>
                    {paymentInfo.label}
                  </Badge>
                </div>
              </div>

              {/* Status Update */}
              {nextStatusOptions.length > 0 && (
                <div className="flex items-end gap-2 shrink-0">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5 font-medium">Update Status</p>
                    <Select value={selectValue} onValueChange={setPendingStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select next status" />
                      </SelectTrigger>
                      <SelectContent>
                        {nextStatusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={!pendingStatus || updateOrder.isPending}
                    size="sm"
                  >
                    {updateOrder.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ClipboardEdit className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Graduate Info Card ────────────────────────────────────────── */}
        {graduate && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <div className="rounded-md p-1.5 bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                Graduate
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <SectionCard icon={User} title="Contact">
                <SummaryRow label="Name" value={graduate.fullName} />
                <SummaryRow label="Email" value={graduate.email} />
                {graduate.phone && <SummaryRow label="Phone" value={graduate.phone} />}
              </SectionCard>
            </CardContent>
          </Card>
        )}

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
                        .map((line, idx) => (
                          <div key={idx} className="font-medium">{line}</div>
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
              {order.paymentMethod && (
                <div className="flex justify-between items-center gap-4 pt-1">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="text-sm font-medium capitalize">{order.paymentMethod}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Back Button ───────────────────────────────────────────────── */}
        <div className="pb-4">
          <Button variant="outline" onClick={() => navigate("/frame-orders")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Frame Orders
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default AdminFrameOrderDetail;
