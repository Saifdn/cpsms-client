import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Package, PlusCircle, MapPin, Lock, Loader2 } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { MALAYSIA_STATES_MAP } from "@/lib/malaysia";
import { SummaryRow, SectionCard } from "@/components/booking/BookingSummaryParts";

const formatDate = (date) => {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const Step4_ReviewPayment = ({ data, onPrev, onComplete, isLoading }) => {
  const delivery = data.deliveryAddress?.receiver || {};
  const session = data.selectedSession || {};
  const selectedPackage = data.selectedPackage || {};
  const selectedAddons = data.selectedAddons || [];

  const groupedAddons = selectedAddons.reduce((acc, addon) => {
    const existing = acc.find((a) => a._id === addon._id);
    if (existing) {
      existing.qty += 1;
    } else {
      acc.push({ ...addon, qty: 1 });
    }
    return acc;
  }, []);

  const packagePrice = Number(selectedPackage.price) || 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const totalPrice = packagePrice + addonsTotal;

  const stateName = delivery.subdivision_code
    ? MALAYSIA_STATES_MAP[delivery.subdivision_code] || delivery.subdivision_code
    : null;

  const addressLines = [
    delivery.address_1,
    delivery.address_2,
    [delivery.postcode, delivery.city].filter(Boolean).join(", "),
    stateName,
  ].filter(Boolean);

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Review Your Booking</CardTitle>
        <p className="text-sm text-muted-foreground">
          Please review all details before proceeding to payment.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Session */}
        <SectionCard icon={CalendarDays} title="Session Details">
          <SummaryRow label="Date" value={formatDate(session.date)} />
          <SummaryRow
            label="Time"
            value={
              session.startTime && session.endTime
                ? `${session.startTime} – ${session.endTime}`
                : null
            }
          />
        </SectionCard>

        {/* Package */}
        <SectionCard icon={Package} title="Package">
          <SummaryRow label="Name" value={selectedPackage.name} />
          <SummaryRow
            label="Price"
            value={selectedPackage.price ? `RM ${selectedPackage.price}` : null}
          />
          {selectedPackage.services?.length > 0 && (
            <div className="pt-1 space-y-1">
              <span className="text-xs text-muted-foreground">Includes:</span>
              <ul className="space-y-1">
                {selectedPackage.services.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="mt-0.5 text-green-500">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SectionCard>

        {/* Add-ons */}
        <SectionCard icon={PlusCircle} title="Add-ons">
          {groupedAddons.length > 0 ? (
            groupedAddons.map((addon) => (
              <SummaryRow
                key={addon._id}
                label={`${addon.name}${addon.qty > 1 ? ` ×${addon.qty}` : ""}`}
                value={`RM ${(Number(addon.price) * addon.qty).toFixed(2)}`}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No add-ons selected.</p>
          )}
        </SectionCard>

        {/* Delivery */}
        <SectionCard icon={MapPin} title="Delivery Address">
          <SummaryRow label="Name" value={delivery.name} />
          <SummaryRow
            label="Phone"
            value={
              delivery.phone_number
                ? (parsePhoneNumberFromString(
                    delivery.phone_number,
                    delivery.phone_number_country_code || "MY",
                  )?.formatInternational() ?? `+60 ${delivery.phone_number}`)
                : null
            }
          />
          <SummaryRow label="Email" value={delivery.email} />
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground shrink-0">Address</span>
            <div className="text-right space-y-0.5">
              {addressLines.map((line, i) => (
                <div key={i} className="font-medium">{line}</div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Pricing breakdown */}
        <div className="rounded-xl border p-4 space-y-2">
          <SummaryRow label="Package" value={`RM ${packagePrice.toFixed(2)}`} />
          {selectedAddons.length > 0 && (
            <SummaryRow label="Add-ons" value={`RM ${addonsTotal.toFixed(2)}`} />
          )}
          <Separator className="my-1" />
          <div className="flex justify-between gap-4">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">RM {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button onClick={onComplete} className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              "Proceed to Payment"
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

export default Step4_ReviewPayment;
