import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, MapPin, Receipt, Lock, Loader2 } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { MALAYSIA_STATES_MAP } from "@/lib/malaysia";
import { SummaryRow, SectionCard } from "@/components/booking/BookingSummaryParts";

const Step3_ReviewPayment = ({ data, onPrev, onComplete, isLoading }) => {
  const { cart, frames, receiver } = data;

  const cartItems = useMemo(
    () =>
      (frames ?? [])
        .filter((f) => (cart ?? {})[f._id] > 0)
        .map((f) => ({ frame: f, quantity: (cart ?? {})[f._id] })),
    [frames, cart],
  );

  const total = useMemo(
    () => cartItems.reduce((sum, { frame, quantity }) => sum + frame.price * quantity, 0),
    [cartItems],
  );

  const stateName = receiver?.subdivision_code
    ? MALAYSIA_STATES_MAP[receiver.subdivision_code] || receiver.subdivision_code
    : null;

  const addressLines = [
    receiver?.address_1,
    receiver?.address_2,
    [receiver?.postcode, receiver?.city].filter(Boolean).join(", "),
    stateName,
  ].filter(Boolean);

  const formattedPhone = receiver?.phone_number
    ? (parsePhoneNumberFromString(
        receiver.phone_number,
        receiver.phone_number_country_code || "MY",
      )?.formatInternational() ?? `+60 ${receiver.phone_number}`)
    : null;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Review Your Order</CardTitle>
        <p className="text-sm text-muted-foreground">
          Please review all details before proceeding to payment.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <SectionCard icon={ShoppingBag} title="Order Items">
          {cartItems.map(({ frame, quantity }) => (
            <SummaryRow
              key={frame._id}
              label={`${frame.name} ×${quantity}`}
              value={`RM ${(frame.price * quantity).toFixed(2)}`}
            />
          ))}
        </SectionCard>

        <SectionCard icon={MapPin} title="Delivery Address">
          <SummaryRow label="Name" value={receiver?.name} />
          <SummaryRow label="Phone" value={formattedPhone} />
          <SummaryRow label="Email" value={receiver?.email} />
          {addressLines.length > 0 && (
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground shrink-0">Address</span>
              <div className="text-right space-y-0.5">
                {addressLines.map((line, i) => (
                  <div key={i} className="font-medium">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        <div className="rounded-xl border p-4 space-y-2">
          {cartItems.map(({ frame, quantity }) => (
            <SummaryRow
              key={frame._id}
              label={`${frame.name} ×${quantity}`}
              value={`RM ${(frame.price * quantity).toFixed(2)}`}
            />
          ))}
          <Separator className="my-1" />
          <div className="flex justify-between gap-4 items-center">
            <span className="font-semibold flex items-center gap-1.5 text-sm">
              <Receipt className="h-4 w-4" />
              Total
            </span>
            <span className="text-lg font-bold text-primary">RM {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Button onClick={onComplete} className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Proceed to Payment
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Secure payment — your information is protected</span>
          </div>

          <Button variant="outline" size="lg" onClick={onPrev} className="w-full">
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3_ReviewPayment;
