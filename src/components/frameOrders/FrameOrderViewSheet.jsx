import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SummaryRow, SectionCard } from "@/components/booking/BookingSummaryParts";
import {
  getFrameOrderStatus,
  getFrameOrderPaymentStatus,
} from "@/components/columns/FrameOrderColumns";
import { Hash, Package, User, MapPin, CreditCard } from "lucide-react";

export function FrameOrderViewSheet({ open, onOpenChange, order }) {
  if (!order) return null;

  const statusInfo = getFrameOrderStatus(order.status);
  const paymentInfo = getFrameOrderPaymentStatus(order.paymentStatus);
  const graduate = order.graduate;
  const delivery = order.shipment?.receiver ?? null;

  const itemsTotal =
    order.items?.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0) ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto" side="right">
        <SheetHeader className="sr-only">
          <SheetTitle>Frame Order #{order.orderNumber}</SheetTitle>
          <SheetDescription>Detailed view of this frame order</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-xl font-bold tracking-tight">
                {order.orderNumber}
              </span>
            </div>
            {order.createdAt && (
              <p className="text-sm text-muted-foreground">
                Ordered on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge
                className={`text-sm px-4 py-1.5 font-semibold border capitalize ${statusInfo.className}`}
              >
                {statusInfo.label}
              </Badge>
              <Badge
                className={`text-sm px-4 py-1.5 font-medium border capitalize ${paymentInfo.className}`}
              >
                {paymentInfo.label}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Graduate */}
          {graduate && (
            <SectionCard icon={User} title="Graduate">
              <SummaryRow label="Name" value={graduate.fullName} />
              <SummaryRow label="Email" value={graduate.email} />
              {graduate.phone && <SummaryRow label="Phone" value={graduate.phone} />}
            </SectionCard>
          )}

          {/* Items */}
          <SectionCard icon={Package} title="Items">
            {order.items?.map((item, i) => (
              <SummaryRow
                key={item.frame?._id ?? i}
                label={`${item.frame?.name ?? "Frame"} ×${item.quantity}`}
                value={`RM ${(Number(item.price) * item.quantity).toFixed(2)}`}
              />
            ))}
          </SectionCard>

          {/* Delivery */}
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
                        <div key={idx} className="font-medium">
                          {line}
                        </div>
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
              <Badge
                className={`text-xs px-3 py-1 font-medium border capitalize ${paymentInfo.className}`}
              >
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
