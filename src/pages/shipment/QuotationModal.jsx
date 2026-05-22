// components/shipment/QuotationModal.jsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, CheckCircle2, Clock, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const CourierLogo = ({ src, alt }) => {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
        <Truck className="h-7 w-7 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-14 h-14 bg-white border rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        onError={() => setErrored(true)}
      />
    </div>
  );
};

const QuotationModal = ({
  open,
  onOpenChange,
  quotationResult,
  onProceed,
  isProcessing,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  if (!quotationResult?.options?.length) return null;

  const selectedOption =
    quotationResult.options.find((o) => o.serviceId === selectedServiceId) ??
    quotationResult.options[0];

  const bestValuePrice = Math.min(
    ...quotationResult.options.map((o) => parseFloat(o.averagePrice))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Available Shipping Options
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select a courier service to apply to all{" "}
            <span className="font-medium text-foreground">
              {quotationResult.totalBookings}
            </span>{" "}
            selected bookings
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {quotationResult.options.map((option, index) => {
            const isSelected = selectedOption?.serviceId === option.serviceId;
            const isBestValue =
              parseFloat(option.averagePrice) === bestValuePrice;

            return (
              <div
                key={index}
                onClick={() => setSelectedServiceId(option.serviceId)}
                className={cn(
                  "relative border-2 rounded-2xl p-5 cursor-pointer transition-all select-none",
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "border-border hover:border-primary/40 bg-card"
                )}
              >
                {/* Best Value badge */}
                {isBestValue && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-xs px-2 py-0.5 shadow-sm">
                      Best Value
                    </Badge>
                  </div>
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-primary" />
                )}

                {/* Header: logo + courier/service name */}
                <div className="flex items-start gap-3">
                  <CourierLogo
                    src={option.courierLogo}
                    alt={option.courierName}
                  />
                  <div className="min-w-0 flex-1 pr-6">
                    <div className="font-semibold text-sm leading-tight truncate">
                      {option.courierName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {option.serviceName}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    <MapPin className="h-3 w-3" />
                    {option.isPickup ? "Pickup" : "Drop-off"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Clock className="h-3 w-3" />
                    {option.deliveryDuration ?? "2–5 days"}
                  </Badge>
                </div>

                {/* Divider */}
                <div className="border-t mt-4 mb-3" />

                {/* Price */}
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Package className="h-3.5 w-3.5" />
                    <span>
                      RM {parseFloat(option.averagePrice).toFixed(2)} ×{" "}
                      {option.count} shipment
                      {option.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary leading-none">
                      RM {parseFloat(option.totalAmount).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      total
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onProceed(selectedOption)}
            disabled={!selectedOption || isProcessing}
            className="min-w-36"
          >
            {isProcessing ? "Processing..." : "Confirm Selection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuotationModal;
