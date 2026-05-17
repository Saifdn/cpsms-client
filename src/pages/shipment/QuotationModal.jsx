// components/shipment/QuotationModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Check, Clock, Tag } from "lucide-react";

const QuotationModal = ({
  open,
  onOpenChange,
  quotationResult,
  onProceed,
  isProcessing,
}) => {
  if (!quotationResult?.options?.length) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Shipping Options</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose a service to apply to all {quotationResult.totalBookings} selected bookings
          </p>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {quotationResult.options.map((option, index) => (
            <div
              key={index}
              className="border rounded-2xl p-6 hover:border-primary transition-all group cursor-pointer"
              onClick={() => onProceed(option)}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Courier Logo / Icon */}
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="h-7 w-7 text-primary" />
                  </div>

                  <div>
                    <div className="font-semibold text-lg">{option.courierName}</div>
                    <div className="text-muted-foreground">{option.serviceName}</div>

                    {/* Service Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {option.courier?.service_tag?.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    RM {option.totalAmount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    RM {option.averagePrice} per shipment
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Est. Delivery: {option.deliveryDuration || "2-5 days"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>Pickup: {option.isPickup ? "Yes" : "No"}</span>
                </div>
              </div>

              {/* Select Button */}
              <Button 
                className="w-full mt-6" 
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Select & Apply to All Shipments
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuotationModal;